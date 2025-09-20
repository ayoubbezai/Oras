import { useState, useEffect } from "react";
import { fetchDrivers, addDriver } from "../../services/driver";

export const useDrivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadDrivers = async () => {
    setLoading(true);
    setError(null);
    const result = await fetchDrivers();
    if (result.error) setError(result.error);
    else setDrivers(result);
    setLoading(false);
  };

  const createDriver = async (driverData) => {
    setLoading(true);
    setError(null);
    const result = await addDriver(driverData);
    if (result.error) setError(result.error);
    else setDrivers((prev) => [...prev, result.data]); // append new driver
    setLoading(false);
    return result;
  };

  useEffect(() => {
    loadDrivers();
  }, []);

  return { drivers, loading, error, createDriver, reload: loadDrivers };
};
