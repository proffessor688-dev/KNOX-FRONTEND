import axios from "axios";

// Create axios instance
const AuthAPI = axios.create({
  baseURL: "https://knox-backend-2.onrender.com/api/auth", // use Vite proxy
  withCredentials: true,
});

// Login
export const loginUser = (formData) => {
  return AuthAPI.post("/login", formData);
};

// Logout
export const logoutUser = () => {
  return AuthAPI.post("/logout");
};

// Verify user
export const verifyUser = (setUser, setLoading) => {
  const checkAuth = async () => {
    try {
      const res = await AuthAPI.get("/profile");

      setUser(res.data.user);

    } catch (err) {
      if (err.response?.status === 401) {
        setUser(null); // normal case
      } else {
        console.error("Unexpected auth error:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  checkAuth();
};
