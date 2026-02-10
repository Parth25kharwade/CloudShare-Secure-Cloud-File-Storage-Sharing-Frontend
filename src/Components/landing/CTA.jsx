const CTA = ({openSignUp}) => {
    return (
        <div className="bg-purple-600">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">

                {/* CTA Text */}
                <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                    <span className="block">Ready to get started?</span>
                    <span className="block text-purple-200">
          Create your account today.
        </span>
                </h2>

                {/* CTA Button */}
                <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
                    <div className="inline-flex rounded-md shadow">
                        <button onClick={openSignUp}
                            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-semibold rounded-md text-purple-600 bg-white hover:bg-gray-100 transition"
                        >
                            Sign up for free
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );

};
export default CTA;