import Features from "./Features.jsx";

const Footer = () => {
    return (
        <footer className="bg-gray-800">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">

                {/* Top */}
                <div className="flex flex-col items-center text-center space-y-4">
                    <h3 className="text-xl font-bold text-white">
                        CloudShare
                    </h3>

                    <p className="max-w-md text-gray-400 text-sm">
                        Securely upload, store, and share your files with enterprise-grade protection.
                    </p>

                    {/* Links */}


                </div>

                {/* Divider */}
                <div className="mt-8 border-t border-gray-700" />

                {/* Bottom */}
                <div className="mt-6 text-center">
                    <p className="text-base text-gray-400">
                        &copy; {new Date().getFullYear()} CloudShare. All rights reserved.
                    </p>
                </div>

            </div>
        </footer>
    );
};

export default Footer;
