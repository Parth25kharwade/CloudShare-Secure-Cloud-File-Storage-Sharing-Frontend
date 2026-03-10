import DashboardLayout from "../Layout/Dashboard.jsx";
import { useState, useEffect, useRef, useContext } from "react";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { CreditCard, Check, Loader, AlertCircle } from "lucide-react";
import { UserCreditsContext } from "../context/UserCreditsContext";
import {apiEndpoints} from "../utill/apiEndpoint.js";



const Subscription = () => {
    const [processingPayment, setProcessingPayment] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");
    const [razorpayLoaded, setRazorpayLoaded] = useState(false);

    const { getToken } = useAuth();
    const razorpayScriptRef = useRef(null);

    const { credits, setCredits } = useContext(UserCreditsContext);

    const plans = [
        {
            id: "premium",
            name: "Premium",
            credits: 500,
            price: 500,
            features: [
                "Upload up to 500 files",
                "Access to all basic features",
                "Priority support",
            ],
            recommended: false,
        },
        {
            id: "ultimate",
            name: "Ultimate",
            credits: 5000,
            price: 2500,
            features: [
                "Upload up to 5000 files",
                "Access to all premium features",
                "Priority support",
                "Advanced analytics",
            ],
            recommended: true,
        },
    ];

    // Load Razorpay Script
    useEffect(() => {
        if (!window.Razorpay) {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.async = true;

            script.onload = () => {
                console.log("Razorpay script loaded successfully");
                setRazorpayLoaded(true);
            };

            script.onerror = () => {
                console.error("Failed to load Razorpay script");
                setMessage(
                    "Payment gateway failed to load. Please refresh the page and try again."
                );
                setMessageType("error");
            };

            document.body.appendChild(script);
            razorpayScriptRef.current = script;
        } else {
            setRazorpayLoaded(true);
        }

        return () => {
            if (razorpayScriptRef.current) {
                document.body.removeChild(razorpayScriptRef.current);
            }
        };
    }, []);

    // Fetch user credits
    useEffect(() => {
        const fetchUserCredits = async () => {
            try {
                const token = await getToken();

                const response = await axios.get(
                    apiEndpoints.GET_CREDITS,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                setCredits(response.data.credits);
            } catch (error) {
                console.error("Error fetching user credits:", error);
                setMessage("Failed to load your current credits. Please try again.");
                setMessageType("error");
            }
        };

        fetchUserCredits();
    }, []);

    const handlePurchase = async (plan) => {
        if (!razorpayLoaded) {
            setMessage("Payment gateway is still loading. Please wait.");
            setMessageType("error");
            return;
        }

        try {
            setProcessingPayment(true);

            const token = await getToken();

            const orderResponse = await axios.post(
                apiEndpoints.CREATE_ORDER,
                {
                    planId: plan.id.toUpperCase(),
                    amount: plan.price * 100,
                    currency: "INR",
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const { orderId } = orderResponse.data;

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY,
                amount: plan.price * 100,
                currency: "INR",
                name: "CloudShare",
                description: `${plan.name} Plan`,
                order_id: orderId,

                handler: async function (response) {
                    try {
                        const verifyResponse = await axios.post(
                            apiEndpoints.VERIFY_PAYMENT,
                            {
                                razorpayOrderId: response.razorpay_order_id,
                                razorpayPaymentId: response.razorpay_payment_id,
                                razorpaySignature: response.razorpay_signature,
                                planId: plan.id.toUpperCase(),
                            },
                            {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                            }
                        );

                        setCredits(verifyResponse.data.credits);
                        setMessage("Payment successful! Credits added.");
                        setMessageType("success");
                    } catch (err) {
                        console.log(err)
                        setMessage("Payment verification failed.");
                        setMessageType("error");
                    }
                },

                theme: {
                    color: "#7c3aed",
                },
            };

            const razor = new window.Razorpay(options);
            razor.open();
        } catch (error) {
            console.error(error);
            setMessage("Payment initialization failed.");
            setMessageType("error");
        } finally {
            setProcessingPayment(false);
        }
    };

    return (
        <DashboardLayout activeMenu="Subscription">
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-2">Subscription Plans</h1>
                <p className="text-gray-600 mb-6">
                    Choose a plan that works for you
                </p>

                {message && (
                    <div
                        className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
                            messageType === "error"
                                ? "bg-red-50 text-red-700"
                                : messageType === "success"
                                    ? "bg-green-50 text-green-700"
                                    : "bg-blue-50 text-blue-700"
                        }`}
                    >
                        {messageType === "error" && <AlertCircle size={20} />}
                        {message}
                    </div>
                )}

                <div className="flex flex-col md:flex-row gap-6 mb-8">
                    <div className="bg-blue-50 p-6 rounded-lg">
                        <div className="flex items-center gap-2 mb-4">
                            <CreditCard className="text-purple-500" />
                            <h2 className="text-lg font-medium">
                                Current Credits:
                                <span className="font-bold text-purple-600 ml-2">
                  {credits}
                </span>
                            </h2>
                        </div>
                        <p className="text-sm text-gray-600">
                            You can upload {credits} more files with your current credits.
                        </p>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {plans.map((plan) => (
                        <div
                            key={plan.id}
                            className={`border rounded-xl p-6 ${
                                plan.recommended
                                    ? "border-purple-200 bg-purple-50 shadow-md"
                                    : "border-gray-200 bg-white"
                            }`}
                        >
                            {plan.recommended && (
                                <div className="inline-block bg-purple-500 text-white text-xs px-3 py-1 rounded mb-2">
                                    RECOMMENDED
                                </div>
                            )}

                            <h3 className="text-xl font-bold">{plan.name}</h3>

                            <div className="mt-2 mb-4">
                                <span className="text-3xl font-bold">₹{plan.price}</span>
                                <span className="text-gray-500">
                  {" "}
                                    for {plan.credits} credits
                </span>
                            </div>

                            <ul className="space-y-3 mb-6">
                                {plan.features.map((feature, index) => (
                                    <li key={index} className="flex items-start">
                                        <Check size={18} className="text-green-500 mr-2" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <button
                                disabled={processingPayment}
                                onClick={() => handlePurchase(plan)}
                                className={`w-full py-2 rounded-md font-medium ${
                                    plan.recommended
                                        ? "bg-purple-500 text-white hover:bg-purple-600"
                                        : "bg-white border border-purple-500 text-purple-500 hover:bg-purple-50"
                                }`}
                            >
                                {processingPayment ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <Loader size={16} className="animate-spin" />
                                        Processing...
                                    </div>
                                ) : (
                                    "Purchase Plan"
                                )}
                            </button>
                        </div>
                    ))}
                </div>

                <div className="mt-8 bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 className="font-medium mb-2">How credits work</h3>
                    <p className="text-sm text-gray-600">
                        Each file upload consumes 1 credit. New users start with 5 free
                        credits. Credits never expire and can be used at any time. If
                        you run out of credits, you can purchase more through one of
                        our plans above.
                    </p>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Subscription;