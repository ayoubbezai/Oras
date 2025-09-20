// src/api/auth.js
import api from "../utils/axiosInstance";

// ✅ Signup company API call
export const signup = async ({
  first_name,
  last_name,
  email,
  phone_number,
  name_of_company,
  password,
  password_confirmation,
}) => {
  // Prepare payload
  const payload = {
    first_name,
    last_name,
    phone_number,
    name_of_company,
    email,
    password,
    password_confirmation, // ✅ add this
  };

  // ✅ Print payload for debugging
  console.log("Signup payload:", payload);

  try {
    const { data } = await api.post("/companies", payload);
    return data;
  } catch (error) {
    return { error: error.response?.data?.message || error.message };
  }
};


// ✅ Login API call
export const login = async (email, password) => {
  try {
    const { data } = await api.post("/login", { email, password });
    return data;
  } catch (error) {
    return { error: error.response?.data?.message || error.message };
  }
};

// ✅ Logout API call
export const logout = async () => {
  try {
    const { data } = await api.post("/logout");
    return data;
  } catch (error) {
    return { error: error.response?.data?.message || error.message };
  }
};
