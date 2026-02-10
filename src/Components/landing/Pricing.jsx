const Pricing = ({ pricingPlans , openSignUp}) => {
    return (
        <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Section Heading */}
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                        Simple, transparent pricing
                    </h2>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-500">
                        Choose a plan that fits your needs. Upgrade or downgrade anytime.
                    </p>
                </div>

                {/* Pricing Cards */}
                <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {pricingPlans.map((plan, index) => (
                        <div
                            key={index}
                            className={`relative flex flex-col rounded-2xl border p-8 bg-white shadow-sm ${
                                plan.highlighted
                                    ? "border-purple-600 shadow-lg scale-[1.03]"
                                    : "border-gray-200"
                            }`}
                        >
                            {/* Highlight badge */}
                            {plan.highlighted && (
                                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 text-sm font-medium bg-purple-600 text-white rounded-full">
                  Most Popular
                </span>
                            )}

                            {/* Plan name */}
                            <h3 className="text-xl font-semibold text-gray-900 text-center">
                                {plan.name}
                            </h3>

                            {/* Price */}
                            <div className="mt-4 text-center">
                <span className="text-4xl font-extrabold text-gray-900">
                  ₹{plan.price}
                </span>
                                <span className="text-gray-500"> / month</span>
                            </div>

                            {/* Description */}
                            <p className="mt-4 text-center text-gray-500">
                                {plan.description}
                            </p>

                            {/* Features */}
                            <ul className="mt-6 space-y-3">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-center text-gray-600">
                                        <span className="mr-2 text-green-500">✔</span>
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            {/* CTA */}
                            <button
                                onClick={openSignUp}
                                className={`mt-8 w-full py-3 rounded-lg font-semibold transition ${
                                    plan.highlighted
                                        ? "bg-purple-600 text-white hover:bg-purple-700"
                                        : "bg-gray-900 text-white hover:bg-gray-800"
                                }`}
                            >
                                {plan.cta}
                            </button>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default Pricing;
