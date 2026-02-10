import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth/useAuth";
import DashboardLayout from "../components/DashboardLayout";

const ProtectedRoutes = () => {

    const { token } = useAuth();

    // Check if the user is authenticated
    if (!token) {
        return <Navigate to="/login" />
    }
    return <DashboardLayout />

}

export default ProtectedRoutes;