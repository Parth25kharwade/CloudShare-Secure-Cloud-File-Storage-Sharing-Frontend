import { useState } from "react";
import { Menu, X, Share2 } from "lucide-react";
import { SignedIn, UserButton } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import SideMenu from "./SideMenu.jsx";
import CreditsDisplay from "./CreditsDisplay.jsx";


const Navbar = () => {
    const [openSideMenu, setOpenSideMenu] = useState(false);

    const handleToggle = () => {
        setOpenSideMenu(!openSideMenu);
    };

    const closeMenu = () => {
        setOpenSideMenu(false);
    };

    return (
        <div className="relative">

            <div className="flex items-center justify-between bg-white border-b border-gray-200 px-6 py-4">

                {/* LEFT */}
                <div className="flex items-center gap-4">

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

                {/* RIGHT */}
                <SignedIn>
                    <div className="flex items-center gap-4">

                        <Link
                            to="/subscriptions"
                            className="p-2 rounded hover:bg-gray-100 transition"
                        >
                            <CreditsDisplay credits={10}/>
                        </Link>

                        <UserButton afterSignOutUrl="/" />

                    </div>
                </SignedIn>
            </div>

            {/* Mobile Side Menu */}
            {openSideMenu && (
                <div className="fixed top-[73px] left-0 right-0 bg-white border-b border-gray-200 lg:hidden z-20 shadow-md">
                    <SideMenu closeMenu={closeMenu}  />
                </div>
            )}

        </div>
    );
};

export default Navbar;
