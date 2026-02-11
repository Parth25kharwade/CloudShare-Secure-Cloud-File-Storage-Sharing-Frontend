import { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";
import Navbar from "../Components/Navbar.jsx";


const DashboardLayout = ({ children }) => {
    const { user, isLoaded } = useUser();
    const [sidebarOpen, setSidebarOpen] = useState(false);

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

            {/* Navbar */}
            <Navbar onToggleSidebar={setSidebarOpen} />

            <div className="flex">

                {/* Sidebar */}
                <aside
                    className={`fixed lg:static z-40 top-0 left-0 h-full w-64 bg-white shadow-md transform transition-transform duration-300 
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          lg:translate-x-0`}
                >
                    <div className="p-6 space-y-4 mt-16 lg:mt-0">
                        <a href="/dashboard" className="block hover:text-purple-600">
                            Dashboard
                        </a>
                        <a href="/upload" className="block hover:text-purple-600">
                            Upload
                        </a>
                        <a href="/my-files" className="block hover:text-purple-600">
                            My Files
                        </a>
                        <a href="/subscriptions" className="block hover:text-purple-600">
                            Subscriptions
                        </a>
                        <a href="/transactions" className="block hover:text-purple-600">
                            Transactions
                        </a>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-6">
                    {children}
                </main>

            </div>
        </div>
    );
};

export default DashboardLayout;
