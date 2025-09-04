import { useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const OAuthRedirect = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    if (token) {
      login({ token });
      navigate("/");
    } else {
      navigate("/login");
    }
  }, [location, login, navigate]);

  return null;
};

export default OAuthRedirect;
