import {assets} from "../../assets/assets.js";

const Hero = ({openSignIn,openSignUp}) => {
    return(
        <div className="pt-20 pb-16 sm:pt-24 sm:pb-20 lg:pt-32 lg:pb-28 text-center bg-purple-50">

            {/* Badge */}
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-purple-100 text-purple-700 text-sm font-medium mb-6">
                🔒 Secure • Fast • Reliable
            </div>

            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900">
                Share Files Securely With <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
      CloudShare
    </span>
            </h1>

            {/* Subheading */}
            <p className="mt-6 max-w-2xl mx-auto text-lg sm:text-xl text-gray-600">
                Upload, manage and share your files securely. Accessible anywhere, anytime.
            </p>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
                <button onClick={()=>openSignUp()} className="px-8 py-3 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 transition">
                    Get Started
                </button>
                <button onClick={()=>openSignIn()} className="px-8 py-3 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition">
                    Sign In
                </button>
            </div>
            <div className="relative mt-16">
                <div className="aspect-w-16 aspect-h-9 max-w-4xl mx-auto rounded-xl shadow-2xl overflow-hidden border border-gray-200">
                    <img
                        src={assets.dashboard}
                        alt="CloudShare dashboard"
                        className="w-full h-full object-cover"
                    />
                </div>

                <div className="mt-8 text-center">
                    <p className="mt-4 text-base text-gray-500">
                        Your data is protected with end-to-end encryption and industry-leading security standards.
                    </p>

                </div>


            </div>


        </div>

    )
}
export default Hero;