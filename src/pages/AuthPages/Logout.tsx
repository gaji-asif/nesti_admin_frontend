import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
import ComponentCard from "../../components/common/ComponentCard";

export default function Logout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    try {
      logout();
    } catch (e) {
      console.error('Error during logout', e);
    }
    // small delay to ensure cleanup
    const t = setTimeout(() => navigate('/login'), 250);
    return () => clearTimeout(t);
  }, [logout, navigate]);

  return (
    <ComponentCard title="Logging out">
      <div className="text-center py-8">Logging out...</div>
    </ComponentCard>
  );
}
