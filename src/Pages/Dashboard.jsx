import {useAuth, UserButton} from "@clerk/clerk-react";
import DashboardLayout from "../Layout/Dashboard.jsx";
import {useEffect} from "react";

const Dashboard = () => {
    const { getToken } = useAuth();

    useEffect(() => {
        const displayToken = async () => {
            try {
                const token = await getToken();
                console.log("Clerk Token:", token);
            } catch (error) {
                console.error("Error fetching token:", error);
            }
        };

        displayToken();
    }, [getToken]);
    return(
        <DashboardLayout >
            <div>
                DashBoard Content
            </div>
        </DashboardLayout>
    )
}
export default Dashboard;