import { useUser } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import SideMenu from "../Components/SideMenu.jsx";

const DashboardLayout = ({ children }) => {
    const { user, isLoaded } = useUser();

    if (!isLoaded) {
        return (
            <div className="flex items-center justify-center h-screen">
                Loading...
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/" />;
    }

    return (
        <div className="min-h-screen bg-gray-100">

            {/* Top Navbar */}
            <Navbar />

            {/* Sidebar + Content */}
            <div className="flex">

                {/* Desktop Sidebar */}
                <div className="hidden lg:block">
                    <SideMenu />
                </div>

                {/* Main Content */}
                <main className="flex-1 p-6 bg-gray-50">
                    {children}
                </main>

            </div>
        </div>
    );
};

export default DashboardLayout;
