import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  // 🔹 LocalStorage-аас user сэргээж байх үед redirect хийхгүй
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-semibold">Түр хүлээнэ үү...</p>
      </div>
    );
  }

  // 🔹 Хэрэглэгч байхгүй бол login руу буцаах
  if (!user || !user.isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  return children;
};

export default PrivateRoute;
