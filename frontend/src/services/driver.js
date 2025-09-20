import api from "../../src/utils/axiosInstance";

export const fetchDrivers = async () => {
  try {
    const { data } = await api.get("/drivers"); // Use drivers endpoint
    return data.data || []; // Your API wraps drivers inside `data`
  } catch (error) {
    console.error("Fetch drivers error:", error);
    return { error: error.response?.data?.message || error.message };
  }
};

export const addDriver = async (driverData) => {
  try {
    const { data } = await api.post("/drivers", driverData);
    return data;
  } catch (error) {
    console.error("Add driver error:", error);
    return { error: error.response?.data?.message || error.message };
  }
};
