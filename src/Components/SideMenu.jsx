import { useUser } from "@clerk/clerk-react";
import { Link, useLocation } from "react-router-dom";
import { User } from "lucide-react";
import {SIDE_MENU_DATA} from "../assets/Data.js";

const SideMenu = () => {
    const { user } = useUser();
    const location = useLocation();

    return (
        <div className="w-64 h-[calc(100vh-61px)] bg-white border-r border-gray-200/50 p-5 sticky top-[61px]">

            {/* Profile Section */}
            <div className="flex flex-col items-center justify-center gap-3 mt-3 mb-7">

                {user?.imageUrl ? (
                    <img
                        src={user.imageUrl}
                        alt="Profile"
                        className="w-20 h-20 rounded-full object-cover border"
                    />
                ) : (
                    <div className="w-20 h-20 rounded-full bg-slate-200 flex items-center justify-center">
                        <User className="w-8 h-8 text-gray-600" />
                    </div>
                )}

                <div className="text-center">
                    <p className="font-medium text-gray-900">
                        {user?.fullName || "User"}
                    </p>
                    <p className="text-sm text-gray-500">
                        {user?.primaryEmailAddress?.emailAddress}
                    </p>
                </div>

            </div>

            {/* Menu Items */}
            <div className="flex flex-col gap-2">
                {SIDE_MENU_DATA.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;

                    return (
                        <Link
                            key={item.id}
                            to={item.path}
                            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition 
                ${isActive
                                ? "bg-purple-100 text-purple-600"
                                : "text-gray-700 hover:bg-gray-100"
                            }`}
                        >
                            <Icon className="w-5 h-5" />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </div>

        </div>
    );
};

export default SideMenu;
