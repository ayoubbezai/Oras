import React, { useState, useCallback } from "react";
import {
  GoogleMap,
  LoadScript,
  HeatmapLayer,
  Marker,
} from "@react-google-maps/api";

// Map container style
const containerStyle = {
  width: "100%",
  height: "500px",
};

// Default center position
const defaultCenter = {
  lat: 40.7128,
  lng: -74.006, // New York City
};

// Sample accident data - in a real app, this would come from an API
const accidentData = [
  {
    lat: 40.7128,
    lng: -74.006,
    intensity: 0.8,
    date: "2023-05-15",
    severity: "high",
  },
  {
    lat: 40.7138,
    lng: -74.007,
    intensity: 0.6,
    date: "2023-05-16",
    severity: "medium",
  },
  {
    lat: 40.7148,
    lng: -74.008,
    intensity: 0.9,
    date: "2023-05-17",
    severity: "high",
  },
  {
    lat: 40.7158,
    lng: -74.009,
    intensity: 0.7,
    date: "2023-05-18",
    severity: "medium",
  },
  {
    lat: 40.7168,
    lng: -74.01,
    intensity: 0.5,
    date: "2023-05-19",
    severity: "low",
  },
  {
    lat: 40.7178,
    lng: -74.011,
    intensity: 0.8,
    date: "2023-05-20",
    severity: "high",
  },
  {
    lat: 40.7188,
    lng: -74.012,
    intensity: 0.6,
    date: "2023-05-21",
    severity: "medium",
  },
  {
    lat: 40.7198,
    lng: -74.013,
    intensity: 0.9,
    date: "2023-05-22",
    severity: "high",
  },
  {
    lat: 40.7208,
    lng: -74.014,
    intensity: 0.7,
    date: "2023-05-23",
    severity: "medium",
  },
  {
    lat: 40.7218,
    lng: -74.015,
    intensity: 0.5,
    date: "2023-05-24",
    severity: "low",
  },
  // More data points for a realistic heatmap
  {
    lat: 40.7228,
    lng: -74.016,
    intensity: 0.8,
    date: "2023-05-25",
    severity: "high",
  },
  {
    lat: 40.7238,
    lng: -74.017,
    intensity: 0.6,
    date: "2023-05-26",
    severity: "medium",
  },
  {
    lat: 40.7248,
    lng: -74.018,
    intensity: 0.9,
    date: "2023-05-27",
    severity: "high",
  },
  {
    lat: 40.7258,
    lng: -74.019,
    intensity: 0.7,
    date: "2023-05-28",
    severity: "medium",
  },
  {
    lat: 40.7268,
    lng: -74.02,
    intensity: 0.5,
    date: "2023-05-29",
    severity: "low",
  },
  {
    lat: 40.7278,
    lng: -74.021,
    intensity: 0.8,
    date: "2023-05-30",
    severity: "high",
  },
  {
    lat: 40.7288,
    lng: -74.022,
    intensity: 0.6,
    date: "2023-05-31",
    severity: "medium",
  },
  {
    lat: 40.7298,
    lng: -74.023,
    intensity: 0.9,
    date: "2023-06-01",
    severity: "high",
  },
  {
    lat: 40.7308,
    lng: -74.024,
    intensity: 0.7,
    date: "2023-06-02",
    severity: "medium",
  },
  {
    lat: 40.7318,
    lng: -74.025,
    intensity: 0.5,
    date: "2023-06-03",
    severity: "low",
  },
];

const AccidentHotspotMap = () => {
  const [map, setMap] = useState(null);
  const [selectedAccident, setSelectedAccident] = useState(null);
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  // You need to get an API key from Google Cloud Console
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const onLoad = useCallback(function callback(map) {
    setMap(map);
    setIsLoaded(true);
  }, []);

  const onUnmount = useCallback(function callback(map) {
    setMap(null);
    setIsLoaded(false);
  }, []);

  // Create heatmap data only when Google Maps is loaded
  const getHeatmapData = useCallback(() => {
    if (!isLoaded || !window.google?.maps) return [];
    
    return accidentData.map((accident) => ({
      location: new window.google.maps.LatLng(accident.lat, accident.lng),
      weight: accident.intensity,
    }));
  }, [isLoaded]);

  const heatmapOptions = {
    radius: 40,
    opacity: 0.6,
    gradient: [
      "rgba(0, 255, 255, 0)",
      "rgba(0, 255, 255, 1)",
      "rgba(0, 191, 255, 1)",
      "rgba(0, 127, 255, 1)",
      "rgba(0, 63, 255, 1)",
      "rgba(0, 0, 255, 1)",
      "rgba(0, 0, 223, 1)",
      "rgba(0, 0, 191, 1)",
      "rgba(0, 0, 159, 1)",
      "rgba(0, 0, 127, 1)",
      "rgba(63, 0, 91, 1)",
      "rgba(127, 0, 63, 1)",
      "rgba(191, 0, 31, 1)",
      "rgba(255, 0, 0, 1)",
    ],
  };

  if (!apiKey) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p>
          Google Maps API key is missing. Please add
          VITE_GOOGLE_MAPS_API_KEY to your environment variables.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">
          Accident Hotspots Map
        </h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Show Heatmap</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={showHeatmap}
              onChange={() => setShowHeatmap(!showHeatmap)}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>

      <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="text-blue-600 font-bold text-xl">
            {accidentData.length}
          </div>
          <div className="text-blue-800 text-sm">Total Accidents</div>
        </div>
        <div className="bg-red-50 p-3 rounded-lg">
          <div className="text-red-600 font-bold text-xl">
            {accidentData.filter((a) => a.severity === "high").length}
          </div>
          <div className="text-red-800 text-sm">High Severity</div>
        </div>
        <div className="bg-green-50 p-3 rounded-lg">
          <div className="text-green-600 font-bold text-xl">
            {
              new Set(
                accidentData.map((a) => a.date.split("-").slice(0, 2).join("-"))
              ).size
            }
          </div>
          <div className="text-green-800 text-sm">Active Months</div>
        </div>
      </div>

      <div className="rounded-lg overflow-hidden shadow-md">
        <LoadScript googleMapsApiKey={apiKey} libraries={["visualization"]}>
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={defaultCenter}
            zoom={12}
            onLoad={onLoad}
            onUnmount={onUnmount}
          >
            {showHeatmap && isLoaded && (
              <HeatmapLayer
                data={getHeatmapData()}
                options={heatmapOptions}
              />
            )}

            {isLoaded && accidentData.map((accident, index) => (
              <Marker
                key={index}
                position={{ lat: accident.lat, lng: accident.lng }}
                icon={{
                  url: `data:image/svg+xml;base64,${btoa(`
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" fill="${
              accident.severity === "high"
                ? "#dc2626"
                : accident.severity === "medium"
                ? "#ea580c"
                : "#16a34a"
            }" />
          </svg>
        `)}`,
                  scaledSize: isLoaded && window.google?.maps ? 
                    new window.google.maps.Size(12, 12) : undefined,
                  anchor: { x: 6, y: 6 },
                }}
                onClick={() => setSelectedAccident(accident)}
              />
            ))}
          </GoogleMap>
        </LoadScript>
      </div>

      {selectedAccident && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-bold text-gray-800">Accident Details</h3>
          <p className="text-sm text-gray-600">Date: {selectedAccident.date}</p>
          <p className="text-sm text-gray-600">
            Severity:
            <span
              className={`ml-2 px-2 py-1 rounded-full text-xs ${
                selectedAccident.severity === "high"
                  ? "bg-red-100 text-red-800"
                  : selectedAccident.severity === "medium"
                  ? "bg-orange-100 text-orange-800"
                  : "bg-green-100 text-green-800"
              }`}
            >
              {selectedAccident.severity}
            </span>
          </p>
          <p className="text-sm text-gray-600">
            Location: {selectedAccident.lat.toFixed(4)},{" "}
            {selectedAccident.lng.toFixed(4)}
          </p>
          <button
            className="mt-2 text-blue-600 text-sm hover:text-blue-800"
            onClick={() => setSelectedAccident(null)}
          >
            Close Details
          </button>
        </div>
      )}

      <div className="mt-4 flex items-center justify-start space-x-4">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-red-600 rounded-full mr-2"></div>
          <span className="text-xs text-gray-600">High Severity</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
          <span className="text-xs text-gray-600">Medium Severity</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-600 rounded-full mr-2"></div>
          <span className="text-xs text-gray-600">Low Severity</span>
        </div>
      </div>
    </div>
  );
};

export default AccidentHotspotMap;