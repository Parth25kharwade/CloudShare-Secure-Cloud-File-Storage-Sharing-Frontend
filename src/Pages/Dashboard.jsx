import {UserButton} from "@clerk/clerk-react";
import DashboardLayout from "../Layout/Dashboard.jsx";

const Dashboard = () => {
    return(
        <DashboardLayout>
            <div>
                <UserButton/>
            </div>
        </DashboardLayout>
    )
}
export default Dashboard;