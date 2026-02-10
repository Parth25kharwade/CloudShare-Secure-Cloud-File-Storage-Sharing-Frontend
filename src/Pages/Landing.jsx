import Hero from "../Components/landing/Hero.jsx";
import Features from "../Components/landing/Features.jsx";
import Pricing from "../Components/landing/Pricing.jsx";
import Testimonials from "../Components/landing/Testimonials.jsx";
import CTA from "../Components/landing/CTA.jsx";
import Footer from "../Components/landing/Footer.jsx";
import { useClerk, useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import {features, pricingPlans, testimonials} from "../assets/Data.js";
import {useEffect} from "react";

const Landing = () => {
    const { openSignIn, openSignUp } = useClerk();
    const { isSignedIn } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
         if(isSignedIn) navigate("/dashboard");
    }, [isSignedIn,navigate]);
    return(
        <div className="landing-page bg-gradient-to-b from-gray-50 to-gray-100">

            {/* Hero Section */}
            <Hero openSignIn={openSignIn} openSignUp={openSignUp}/>

            {/* Features Section */}
            <Features features={features}/>

            {/* Pricing Section */}
            <Pricing pricingPlans={pricingPlans} openSignUp={openSignUp}/>


            {/* Testimonials Section */}
            <Testimonials testimonials={testimonials}/>


            {/* CTA Section */}
            <CTA openSignUp={openSignUp}/>


            {/* Footer Section */}
            <Footer/>


        </div>

    )
}
export default Landing;