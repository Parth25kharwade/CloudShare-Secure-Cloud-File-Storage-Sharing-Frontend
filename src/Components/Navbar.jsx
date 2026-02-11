import { useState } from "react";
import { Menu, X, Share2, Wallet } from "lucide-react";
import {SignedIn, UserButton} from "@clerk/clerk-react";
import { Link } from "react-router-dom";

const Navbar = ({ onToggleSidebar }) => {
    const [openSideMenu, setOpenSideMenu] = useState(false);

    const handleToggle = () => {
        const newState = !openSideMenu;
        setOpenSideMenu(newState);

        // Inform DashboardLayout
        if (onToggleSidebar) {
            onToggleSidebar(newState);
        }
    };

    return (
        <div className="flex items-center justify-between bg-white border-b border-gray-200 px-6 py-4">

            {/* LEFT SIDE */}
            <div className="flex items-center gap-4">

                {/* Mobile Sidebar Toggle */}
                <button
                    onClick={handleToggle}
                    className="lg:hidden p-2 rounded hover:bg-gray-100 transition"
                >
                    {openSideMenu ? (
                        <X className="w-5 h-5 text-gray-700" />
                    ) : (
                        <Menu className="w-5 h-5 text-gray-700" />
                    )}
                </button>

                {/* Logo */}
                <Link
                    to="/dashboard"
                    className="flex items-center gap-2 hover:opacity-80 transition"
                >
                    <Share2 className="w-6 h-6 text-purple-600" />
                    <span className="text-lg font-semibold text-gray-900">
            CloudShare
          </span>
                </Link>
            </div>

            {/* RIGHT SIDE */}
            {/* Right side - credits and user button */}
            <SignedIn>
                <div className="flex items-center gap-4">

                    {/* Subscriptions / Wallet */}
                    <Link
                        to="/subscription"
                        className="p-2 rounded hover:bg-gray-100 transition"
                    >
                        <Wallet className="w-5 h-5 text-gray-700" />
                    </Link>

                    {/* User Profile Button */}
                    <div className="relative">
                        <UserButton afterSignOutUrl="/" />
                    </div>

                </div>
            </SignedIn>
            {openSideMenu && (
                <div className="fixed top-[73px] left-0 right-0 bg-white border-b border-gray-200 lg:hidden z-20 shadow-md">

                    <div className="flex flex-col p-4 space-y-4">

                        <Link
                            to="/dashboard"
                            className="text-gray-700 hover:text-purple-600 transition"
                            onClick={() => setOpenSideMenu(false)}
                        >
                            Dashboard
                        </Link>

                        <Link
                            to="/upload"
                            className="text-gray-700 hover:text-purple-600 transition"
                            onClick={() => setOpenSideMenu(false)}
                        >
                            Upload
                        </Link>

                        <Link
                            to="/my-files"
                            className="text-gray-700 hover:text-purple-600 transition"
                            onClick={() => setOpenSideMenu(false)}
                        >
                            My Files
                        </Link>

                        <Link
                            to="/subscriptions"
                            className="text-gray-700 hover:text-purple-600 transition"
                            onClick={() => setOpenSideMenu(false)}
                        >
                            Subscriptions
                        </Link>

                        <Link
                            to="/transactions"
                            className="text-gray-700 hover:text-purple-600 transition"
                            onClick={() => setOpenSideMenu(false)}
                        >
                            Transactions
                        </Link>

                    </div>
                </div>
            )}


        </div>
    );
};

export default Navbar;
