//route: "/admin/dashboard"
import { useAuth } from "@/src/context/AuthContext";
import { Redirect, Slot } from "expo-router";

export default function AdminLayout() {
    const { user, role, loading } = useAuth();

    if (loading) return null;

    if (!user || role !== 'admin') {
        return <Redirect href="/" />;
    }

    return <Slot />;
}