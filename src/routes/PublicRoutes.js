import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth/useAuth";
import DashboardLayout from "../components/DashboardLayout";

const PublicRoutes = () => {

    return <DashboardLayout />

}

export default PublicRoutes;