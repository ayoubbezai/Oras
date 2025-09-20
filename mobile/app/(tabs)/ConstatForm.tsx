import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Platform,
  Animated,
  Easing,
  Dimensions,
  Modal,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import {Sketch} from "@/components/Sketch";
import * as ImagePicker from "expo-image-picker";
import {
  ChevronLeft,
  ChevronRight,
  Save,
  User,
  MapPin,
  FileText,
  X,
  Calendar,
  Download,
  Clock,
  AlertCircle,
  CheckCircle,
  Plus,
  Minus,
  Edit3,
  Car,
  Search,
  ChevronDown,
  Camera as CameraIcon,
  Image as ImageIcon,
} from "lucide-react-native";
import { ConstatServices } from "@/services/ConstatServices";
// Step 3: Vehicle Informationimport { TouchableOpacity } from "react-native";
import { Camera } from "react-native-camera"; // or Expo Camera

const { width, height } = Dimensions.get("window");

// Types for our data
interface Driver {
  id: string;
  name: string;
  licenseNumber: string;
  address: string;
  phone: string;
  insuranceCompany: string;
  policyNumber: string;
}

interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  vin: string;
  color: string;
}

interface AccidentLocation {
  address: string;
  city: string;
  zipCode: string;
  country: string;
  description: string;
}

interface AccidentDetails {
  date: string;
  time: string;
  description: string;
  damages: string[];
  witnesses: Witness[];
  sketch: string;
  additionalImages: string[];
}

interface Witness {
  id: string;
  name: string;
  contact: string;
}

const ConstatForm: React.FC = () => {
  const SketchComponent = Sketch as unknown as React.ComponentType<{
    onSave: (sketchData: string) => void;
    initialData: string;
  }>;

  const [step, setStep] = useState(1);
  const [sketchModalVisible, setSketchModalVisible] = useState(false);
  const [witnessModalVisible, setWitnessModalVisible] = useState(false);
  const [currentWitness, setCurrentWitness] = useState<Witness>({
    id: "",
    name: "",
    contact: "",
  });
  const [isEditingWitness, setIsEditingWitness] = useState(false);

  const loadConstat = async () => {
    try {
      const res = await ConstatServices.getDetails();
      console.log("API Response:", res);

      if (res && res.success && res.data) {
        const data = res.data;
        console.log("Data received:", data);

        // Helper to preserve already entered values
        const preferExisting = (
          existing: string | number | undefined,
          incoming: any
        ) => {
          if (existing === undefined || existing === null || existing === "") {
            return incoming ?? existing;
          }
          return existing;
        };

        // Autofill Driver A from response
        setDrivers((prev) => {
          const updated = [...prev];
          const d0 = { ...updated[0] };

          // Handle lessons data
          const lesson =
            Array.isArray(data.lessons) && data.lessons.length > 0
              ? data.lessons[0]
              : undefined;
          // Handle insurance data - check for different possible field names
          const insurance =
            Array.isArray(data.insurances) && data.insurances.length > 0
              ? data.insurances[0]
              : Array.isArray(data.insurancess) && data.insurancess.length > 0
              ? data.insurancess[0]
              : undefined;

          d0.name =
            preferExisting(
              d0.name,
              `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim()
            ) || "";
          d0.licenseNumber =
            preferExisting(d0.licenseNumber, lesson?.license_number) || "";
          d0.address = preferExisting(d0.address, data.address) || "";
          d0.phone =
            preferExisting(
              d0.phone,
              data.phone || data.company?.phone_number
            ) || "";
          d0.insuranceCompany =
            preferExisting(d0.insuranceCompany, insurance?.company_name) || "";
          d0.policyNumber =
            preferExisting(d0.policyNumber, insurance?.policy_number) || "";

          updated[0] = d0;
          return updated;
        });

        // Autofill Vehicle A from gray card
        setVehicles((prev) => {
          const updated = [...prev];
          const v0 = { ...updated[0] };
          const gray = data.gray_card ?? {};

          v0.make = preferExisting(v0.make, gray.car_name) || "";
          v0.model = preferExisting(v0.model, gray.car_type) || "";
          v0.licensePlate =
            preferExisting(v0.licensePlate, gray.card_number) || "";
          v0.color = preferExisting(v0.color, gray.color) || "";

          updated[0] = v0;
          return updated;
        });

        // Autofill Location
        setLocation((prev) => ({
          address: preferExisting(prev.address, data.address) || "",
          city: preferExisting(prev.city, data.city) || "",
          zipCode: preferExisting(prev.zipCode, data.postal_code) || "",
          country: preferExisting(prev.country, data.country) || prev.country,
          description: prev.description,
        }));

        console.log("Auto-fill completed successfully");
      } else {
        console.log("No data received or API call failed");
      }
    } catch (err) {
      console.error("Error loading constat data:", err);
    }
  };

  useEffect(() => {
    loadConstat();
  }, []);

  const [drivers, setDrivers] = useState<Driver[]>([
    {
      id: "1",
      name: "",
      licenseNumber: "",
      address: "",
      phone: "",
      insuranceCompany: "",
      policyNumber: "",
    },
    {
      id: "2",
      name: "",
      licenseNumber: "",
      address: "",
      phone: "",
      insuranceCompany: "",
      policyNumber: "",
    },
  ]);

  const [vehicles, setVehicles] = useState<Vehicle[]>([
    {
      id: "1",
      make: "",
      model: "",
      year: new Date().getFullYear(),
      licensePlate: "",
      vin: "",
      color: "",
    },
    {
      id: "2",
      make: "",
      model: "",
      year: new Date().getFullYear(),
      licensePlate: "",
      vin: "",
      color: "",
    },
  ]);

  const [location, setLocation] = useState<AccidentLocation>({
    address: "",
    city: "",
    zipCode: "",
    country: "France",
    description: "",
  });

  const [details, setDetails] = useState<AccidentDetails>({
    date: new Date().toLocaleDateString("fr-FR"),
    time: new Date().toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    description: "",
    damages: [],
    witnesses: [],
    sketch: "",
    additionalImages: [],
  });

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  React.useEffect(() => {
    // Animate on step change
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [step]);

  const nextStep = () => {
    // Reset animations
    fadeAnim.setValue(0);
    slideAnim.setValue(50);

    if (step < 5) setStep(step + 1);
  };

  const prevStep = () => {
    // Reset animations
    fadeAnim.setValue(0);
    slideAnim.setValue(50);

    if (step > 1) setStep(step - 1);
  };

  const handleDriverChange = (
    index: number,
    field: keyof Driver,
    value: string
  ) => {
    const updatedDrivers = [...drivers];
    updatedDrivers[index] = { ...updatedDrivers[index], [field]: value };
    setDrivers(updatedDrivers);
  };

  const handleVehicleChange = (
    index: number,
    field: keyof Vehicle,
    value: string | number
  ) => {
    const updatedVehicles = [...vehicles];
    updatedVehicles[index] = { ...updatedVehicles[index], [field]: value };
    setVehicles(updatedVehicles);
  };

  const handleLocationChange = (
    field: keyof AccidentLocation,
    value: string
  ) => {
    setLocation({ ...location, [field]: value });
  };

  const handleDetailsChange = (field: keyof AccidentDetails, value: any) => {
    setDetails({ ...details, [field]: value });
  };

  const handleDamageSelect = (damage: string, vehicle: "A" | "B") => {
    // Remove any existing selection for this damage
    const updatedDamages = details.damages.filter((d) => !d.includes(damage));

    // Add the new selection
    updatedDamages.push(`${vehicle}: ${damage}`);
    handleDetailsChange("damages", updatedDamages);
  };

  const openWitnessModal = (witness?: Witness) => {
    if (witness) {
      setCurrentWitness(witness);
      setIsEditingWitness(true);
    } else {
      setCurrentWitness({ id: Date.now().toString(), name: "", contact: "" });
      setIsEditingWitness(false);
    }
    setWitnessModalVisible(true);
  };

  const saveWitness = () => {
    if (!currentWitness.name.trim()) {
      Alert.alert("Erreur", "Veuillez saisir le nom du témoin");
      return;
    }

    if (isEditingWitness) {
      const updatedWitnesses = details.witnesses.map((w) =>
        w.id === currentWitness.id ? currentWitness : w
      );
      handleDetailsChange("witnesses", updatedWitnesses);
    } else {
      handleDetailsChange("witnesses", [...details.witnesses, currentWitness]);
    }

    setWitnessModalVisible(false);
    setCurrentWitness({ id: "", name: "", contact: "" });
  };

  const removeWitness = (id: string) => {
    handleDetailsChange(
      "witnesses",
      details.witnesses.filter((w) => w.id !== id)
    );
  };

  const handleSketchSave = (sketchData: string) => {
    handleDetailsChange("sketch", sketchData);
    setSketchModalVisible(false);
  };

  const generatePDF = async () => {
    try {
      if (!drivers[0].name || !drivers[1].name) {
        Alert.alert(
          "Attention",
          "Veuillez renseigner les noms des deux conducteurs"
        );
        return;
      }

      const sketchSrc = details.sketch
        ? details.sketch.startsWith("data:")
          ? details.sketch
          : `data:image/png;base64,${details.sketch}`
        : "";

      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Constat Amiable</title>
          <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
          
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }
          
            body {
            font-family: 'Inter', Arial, sans-serif;
            margin: 0;
            padding: 0;
            color: #1a202c;
            background-color: #f8fafc;
            line-height: 1.5;
          }
          
          .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          }
          
            .header {
            background: linear-gradient(135deg, #1e40af 0%, #3730a3 100%);
              color: white;
            padding: 24px 32px;
            text-align: center;
            border-bottom: 4px solid #f59e0b;
          }
          
          .header h1 {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 8px;
            letter-spacing: 0.5px;
          }
          
          .header p {
            font-size: 16px;
            font-weight: 300;
            opacity: 0.9;
          }
          
          .document-id {
            background-color: #eff6ff;
            padding: 12px 32px;
            text-align: right;
            font-size: 14px;
            color: #64748b;
            border-bottom: 1px solid #e2e8f0;
          }
          
          .content {
            padding: 32px;
          }
          
            .section {
            margin-bottom: 32px;
            border-radius: 8px;
            overflow: hidden;
          }
          
            .section-title {
            background-color: #f1f5f9;
            padding: 16px 24px;
              font-size: 18px;
            font-weight: 600;
            color: #1e40af;
            border-left: 4px solid #1e40af;
            margin-bottom: 16px;
          }
          
          .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 16px;
            margin-bottom: 16px;
          }
          
          .field {
            margin-bottom: 16px;
          }
          
            .label {
              font-size: 12px;
            font-weight: 500;
              color: #64748b;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 4px;
            }
          
            .value {
              font-size: 14px;
            padding: 8px 0;
            color: #1e293b;
            font-weight: 500;
            border-bottom: 1px solid #e2e8f0;
          }
          
          .vehicle-section {
              background-color: #f8fafc;
            border-radius: 8px;
            padding: 16px;
            margin-bottom: 16px;
            border-left: 4px solid;
          }
          
            .vehicle-a {
            border-color: #3b82f6;
            }
          
            .vehicle-b {
            border-color: #ef4444;
          }
          
          .vehicle-title {
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 12px;
            color: #1e293b;
            display: flex;
            align-items: center;
          }
          
          .vehicle-title::before {
            content: "";
            display: inline-block;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            margin-right: 8px;
          }
          
          .vehicle-a .vehicle-title::before {
            background-color: #3b82f6;
          }
          
          .vehicle-b .vehicle-title::before {
            background-color: #ef4444;
          }
          
            .damage-list {
              list-style-type: none;
            }
          
            .damage-item {
            padding: 8px 0;
            border-bottom: 1px solid #e2e8f0;
            display: flex;
            align-items: center;
          }
          
          .damage-item::before {
            content: "•";
            color: #64748b;
            font-weight: bold;
            display: inline-block;
            width: 1em;
            margin-right: 8px;
          }
          
          .sketch-container {
            margin: 16px 0;
            text-align: center;
          }
          
          .sketch {
            max-width: 100%;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
          }
          
          .signature-section {
            margin-top: 32px;
            padding-top: 24px;
            border-top: 2px dashed #cbd5e1;
          }
          
          .signature-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 24px;
          }
          
          .signature-box {
            height: 100px;
            border-bottom: 1px solid #cbd5e1;
            margin-bottom: 8px;
          }
          
          .signature-label {
            font-size: 14px;
            font-weight: 500;
            color: #475569;
          }
          
          .signature-date {
            font-size: 12px;
              color: #64748b;
            margin-top: 8px;
          }
          
          .footer {
            margin-top: 48px;
            padding: 16px 32px;
              text-align: center;
            font-size: 12px;
            color: #64748b;
            border-top: 1px solid #e2e8f0;
            background-color: #f8fafc;
          }
          
          .badge {
            display: inline-block;
            padding: 4px 8px;
            background-color: #eff6ff;
            color: #1e40af;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 500;
          }
          
          .witness-item {
            padding: 12px 0;
            border-bottom: 1px solid #e2e8f0;
          }
          
          .empty-state {
            color: #94a3b8;
            font-style: italic;
            padding: 8px 0;
            }
          </style>
        </head>
        <body>
        <div class="container">
          <div class="header">
            <h1>CONSTAT AMIABLE D'AUTO</h1>
            <p>Document officiel de déclaration d'accident</p>
          </div>
          
          <div class="document-id">
            Référence: CA-${Math.random()
              .toString(36)
              .substring(2, 10)
              .toUpperCase()}
          </div>
          
          <div class="content">
          <!-- General Information -->
          <div class="section">
            <div class="section-title">Informations Générales</div>
              <div class="grid">
                <div class="field">
                  <div class="label">Date de l'accident</div>
                  <div class="value">${details.date || "Non renseigné"}</div>
              </div>
                <div class="field">
                  <div class="label">Heure de l'accident</div>
                  <div class="value">${details.time || "Non renseigné"}</div>
              </div>
                <div class="field">
                <div class="label">Responsable selon vous</div>
                  <div class="value">
                    <span class="badge">
                      ${
                        details.responsibleParty === "A"
                          ? "Véhicule A"
                          : "Véhicule B"
                      }
                    </span>
              </div>
            </div>
              </div>
              <div class="field">
                <div class="label">Description des circonstances</div>
                <div class="value">${
                  details.description || "Non renseigné"
                }</div>
            </div>
          </div>
          
          <!-- Drivers Information -->
          <div class="section">
              <div class="section-title">Informations des Conducteurs</div>
              
              <div class="vehicle-section vehicle-a">
                <div class="vehicle-title">Véhicule A</div>
                <div class="grid">
                  <div class="field">
                    <div class="label">Nom complet</div>
                    <div class="value">${
                      drivers[0].name || "Non renseigné"
                    }</div>
                  </div>
                  <div class="field">
                    <div class="label">N° de permis</div>
                    <div class="value">${
                      drivers[0].licenseNumber || "Non renseigné"
                    }</div>
                  </div>
                  <div class="field">
                    <div class="label">Téléphone</div>
                    <div class="value">${
                      drivers[0].phone || "Non renseigné"
                    }</div>
                  </div>
                </div>
                <div class="field">
                    <div class="label">Adresse</div>
                    <div class="value">${
                      drivers[0].address || "Non renseigné"
                    }</div>
                  </div>
                <div class="grid">
                  <div class="field">
                    <div class="label">Assurance</div>
                    <div class="value">${
                      drivers[0].insuranceCompany || "Non renseigné"
                    }</div>
                </div>
                  <div class="field">
                    <div class="label">N° de police</div>
                    <div class="value">${
                      drivers[0].policyNumber || "Non renseigné"
                    }</div>
                  </div>
                </div>
              </div>
              
              <div class="vehicle-section vehicle-b">
                <div class="vehicle-title">Véhicule B</div>
                <div class="grid">
                  <div class="field">
                    <div class="label">Nom complet</div>
                    <div class="value">${
                      drivers[1].name || "Non renseigné"
                    }</div>
                  </div>
                  <div class="field">
                    <div class="label">N° de permis</div>
                    <div class="value">${
                      drivers[1].licenseNumber || "Non renseigné"
                    }</div>
                  </div>
                  <div class="field">
                    <div class="label">Téléphone</div>
                    <div class="value">${
                      drivers[1].phone || "Non renseigné"
                    }</div>
                  </div>
                </div>
                <div class="field">
                  <div class="label">Adresse</div>
                  <div class="value">${
                    drivers[1].address || "Non renseigné"
                  }</div>
                </div>
                <div class="grid">
                  <div class="field">
                    <div class="label">Assurance</div>
                    <div class="value">${
                      drivers[1].insuranceCompany || "Non renseigné"
                    }</div>
                  </div>
                  <div class="field">
                    <div class="label">N° de police</div>
                    <div class="value">${
                      drivers[1].policyNumber || "Non renseigné"
                    }</div>
                  </div>
                </div>
              </div>
          </div>
          
          <!-- Vehicles Information -->
          <div class="section">
              <div class="section-title">Informations des Véhicules</div>
              
              <div class="vehicle-section vehicle-a">
                <div class="vehicle-title">Véhicule A</div>
                <div class="grid">
                  <div class="field">
                    <div class="label">Marque</div>
                    <div class="value">${
                      vehicles[0].make || "Non renseigné"
                    }</div>
                  </div>
                  <div class="field">
                    <div class="label">Modèle</div>
                    <div class="value">${
                      vehicles[0].model || "Non renseigné"
                    }</div>
                  </div>
                  <div class="field">
                    <div class="label">Année</div>
                    <div class="value">${
                      vehicles[0].year || "Non renseigné"
                    }</div>
                  </div>
                </div>
                <div class="grid">
                  <div class="field">
                    <div class="label">Plaque d'immatriculation</div>
                    <div class="value">${
                      vehicles[0].licensePlate || "Non renseigné"
                    }</div>
                  </div>
                  <div class="field">
                    <div class="label">VIN</div>
                    <div class="value">${
                      vehicles[0].vin || "Non renseigné"
                    }</div>
                </div>
                  <div class="field">
                    <div class="label">Couleur</div>
                    <div class="value">${
                      vehicles[0].color || "Non renseigné"
                    }</div>
                  </div>
                </div>
              </div>
              
              <div class="vehicle-section vehicle-b">
                <div class="vehicle-title">Véhicule B</div>
                <div class="grid">
                  <div class="field">
                    <div class="label">Marque</div>
                    <div class="value">${
                      vehicles[1].make || "Non renseigné"
                    }</div>
                  </div>
                  <div class="field">
                    <div class="label">Modèle</div>
                    <div class="value">${
                      vehicles[1].model || "Non renseigné"
                    }</div>
                  </div>
                  <div class="field">
                    <div class="label">Année</div>
                    <div class="value">${
                      vehicles[1].year || "Non renseigné"
                    }</div>
                  </div>
                </div>
                <div class="grid">
                  <div class="field">
                    <div class="label">Plaque d'immatriculation</div>
                    <div class="value">${
                      vehicles[1].licensePlate || "Non renseigné"
                    }</div>
                  </div>
                  <div class="field">
                    <div class="label">VIN</div>
                    <div class="value">${
                      vehicles[1].vin || "Non renseigné"
                    }</div>
                  </div>
                  <div class="field">
                    <div class="label">Couleur</div>
                    <div class="value">${
                      vehicles[1].color || "Non renseigné"
                    }</div>
                  </div>
                </div>
              </div>
          </div>
          
          <!-- Location and Details -->
          <div class="section">
              <div class="section-title">Lieu et Détails de l'Accident</div>
              
              <div class="grid">
                <div class="field">
                  <div class="label">Adresse</div>
                  <div class="value">${
                    location.address || "Non renseigné"
                  }</div>
                </div>
                <div class="field">
                  <div class="label">Ville</div>
                  <div class="value">${location.city || "Non renseigné"}</div>
                </div>
                <div class="field">
                  <div class="label">Code postal</div>
                  <div class="value">${
                    location.zipCode || "Non renseigné"
                  }</div>
                </div>
                <div class="field">
                  <div class="label">Pays</div>
                  <div class="value">${
                    location.country || "Non renseigné"
                  }</div>
                </div>
              </div>
              
              <div class="field">
                  <div class="label">Description du lieu</div>
                  <div class="value">${
                    location.description || "Non renseigné"
                  }</div>
            </div>
            
              <div class="field">
                <div class="label">Dégâts constatés</div>
              <ul class="damage-list">
                ${
                  details.damages.length > 0
                    ? details.damages
                        .map(
                          (damage) => `<li class="damage-item">${damage}</li>`
                        )
                        .join("")
                    : '<li class="empty-state">Aucun dégât enregistré</li>'
                }
              </ul>
            </div>
            
              ${
                sketchSrc
                  ? `
              <div class="field">
                <div class="label">Croquis de l'accident</div>
                <div class="sketch-container">
                  <img class="sketch" src="${sketchSrc}" />
                </div>
              </div>
              `
                  : ""
              }

              <div class="field">
                <div class="label">Témoins</div>
              ${
                details.witnesses.length > 0
                  ? details.witnesses
                      .map(
                        (witness) => `
                        <div class="witness-item">
                          <strong>${witness.name}</strong>
                          <div>${
                            witness.contact || "Contact non renseigné"
                          }</div>
                  </div>
                `
                      )
                      .join("")
                  : '<div class="empty-state">Aucun témoin enregistré</div>'
              }
            </div>
          </div>
          
          <!-- Signatures -->
            <div class="signature-section">
              <div class="section-title">Signatures des Conducteurs</div>
              
              <div class="signature-grid">
                <div class="field">
                  <div class="signature-label">Conducteur du Véhicule A</div>
                  <div class="signature-box"></div>
                  <div class="signature-date">Date: _________________</div>
              </div>
                
                <div class="field">
                  <div class="signature-label">Conducteur du Véhicule B</div>
                  <div class="signature-box"></div>
                  <div class="signature-date">Date: _________________</div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="footer">
            Document généré électroniquement le ${new Date().toLocaleDateString(
              "fr-FR",
              {
                year: "numeric",
                month: "long",
                day: "numeric",
              }
            )} à ${new Date().toLocaleTimeString("fr-FR")}
          </div>
          </div>
        </body>
        </html>
      `;

      const { uri } = await Print.printToFileAsync({ html: htmlContent });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          mimeType: "application/pdf",
          dialogTitle: "Partager le constat PDF",
          UTI: "com.adobe.pdf",
        });
      }

      Alert.alert("Succès", "PDF généré avec succès!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      Alert.alert("Erreur", "Impossible de générer le PDF");
    }
  };

  const handleSubmit = () => {
    // Basic validation
    if (!drivers[0].name || !drivers[1].name) {
      Alert.alert(
        "Attention",
        "Veuillez renseigner les noms des deux conducteurs"
      );
      return;
    }

    console.log("Form submitted:", { drivers, vehicles, location, details });
    Alert.alert("Succès", "Constat enregistré avec succès!");
  };

  // Step 1: General Accident Information
  const renderStep1 = () => (
    <Animated.View
      style={[
        styles.stepContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={styles.sectionHeader}>
        <View style={styles.iconCircle}>
          <AlertCircle size={20} color="#4b76b2" />
        </View>
        <Text style={styles.sectionTitle}>Informations Générales</Text>
      </View>

      <View style={styles.formSection}>
        <View style={styles.inputRow}>
          <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
            <Text style={styles.label}>Date</Text>
            <View style={styles.inputWithIcon}>
              <Calendar size={18} color="#6b7280" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { paddingLeft: 40 }]}
                value={details.date}
                onChangeText={(value) => handleDetailsChange("date", value)}
                placeholder="JJ/MM/AAAA"
              />
            </View>
          </View>
          <View style={[styles.inputGroup, { flex: 1 }]}>
            <Text style={styles.label}>Heure</Text>
            <View style={styles.inputWithIcon}>
              <Clock size={18} color="#6b7280" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { paddingLeft: 40 }]}
                value={details.time}
                onChangeText={(value) => handleDetailsChange("time", value)}
                placeholder="HH:MM"
              />
            </View>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={details.description}
            onChangeText={(value) => handleDetailsChange("description", value)}
            placeholder="Décrivez le déroulement de l'accident"
            multiline
            textAlignVertical="top"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Croquis de l'accident</Text>
          <TouchableOpacity
            style={styles.sketchButton}
            onPress={() => setSketchModalVisible(true)}
          >
            <ImageIcon size={18} color="#3b82f6" />
            <Text style={styles.sketchButtonText}>
              {details.sketch ? "Modifier le croquis" : "Créer un croquis"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );

  // Step 2: Driver Information
  const renderStep2 = () => (
    <Animated.View
      style={[
        styles.stepContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={styles.sectionHeader}>
        <View style={styles.iconCircle}>
          <User size={20} color="#4b76b2" />
        </View>
        <Text style={styles.sectionTitle}>Conducteurs</Text>
      </View>

      {drivers.map((driver, index) => (
        <View
          key={driver.id}
          style={[
            styles.formSection,
            index === 0 ? styles.carASection : styles.carBSection,
            { marginBottom: 16 },
          ]}
        >
          <View style={styles.sectionLabel}>
            <Text
              style={[
                styles.subSectionTitle,
                index === 0 ? styles.carATitle : styles.carBTitle,
              ]}
            >
              Véhicule {index === 0 ? "A" : "B"}
            </Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nom complet</Text>
            <TextInput
              style={styles.input}
              value={driver.name}
              onChangeText={(value) => handleDriverChange(index, "name", value)}
              placeholder="Nom et prénom"
            />
          </View>

          <View style={styles.inputRow}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>N° de permis</Text>
              <TextInput
                style={styles.input}
                value={driver.licenseNumber}
                onChangeText={(value) =>
                  handleDriverChange(index, "licenseNumber", value)
                }
                placeholder="N° de permis"
              />
            </View>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>Téléphone</Text>
              <TextInput
                style={styles.input}
                value={driver.phone}
                onChangeText={(value) =>
                  handleDriverChange(index, "phone", value)
                }
                placeholder="Numéro"
                keyboardType="phone-pad"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Adresse</Text>
            <TextInput
              style={styles.input}
              value={driver.address}
              onChangeText={(value) =>
                handleDriverChange(index, "address", value)
              }
              placeholder="Adresse complète"
            />
          </View>

          <View style={styles.inputRow}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>Assurance</Text>
              <View style={styles.inputWithIcon}>
                <Search size={18} color="#6b7280" style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { paddingLeft: 40 }]}
                  value={driver.insuranceCompany}
                  onChangeText={(value) =>
                    handleDriverChange(index, "insuranceCompany", value)
                  }
                  placeholder="Compagnie"
                />
              </View>
            </View>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>N° de police</Text>
              <TextInput
                style={styles.input}
                value={driver.policyNumber}
                onChangeText={(value) =>
                  handleDriverChange(index, "policyNumber", value)
                }
                placeholder="N° de police"
              />
            </View>
          </View>
        </View>
      ))}
    </Animated.View>
  );
  const renderStep3 = () => {
    const openCameraAndSend = async (vehicleIndex: number) => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        alert("Camera permission is required!");
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        base64: true,
      });

      if (!result.cancelled && result.base64) {
        console.log(`Captured image for vehicle ${vehicleIndex + 1}`);

        try {
          await fetch("https://flaskocr-lhb9.onrender.com/driver_licence", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              image: result.base64,
              vehicle: vehicleIndex === 0 ? "A" : "B",
            }),
          });
        } catch (error) {
          console.log("Error sending image to API:", error);
        }
      }
    };

    return (
      <Animated.View
        style={[
          styles.stepContainer,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        <View style={styles.sectionHeader}>
          <View style={styles.iconCircle}>
            <Car size={20} color="#4b76b2" />
          </View>
          <Text style={styles.sectionTitle}>Véhicules</Text>
        </View>

        {vehicles.map((vehicle, index) => (
          <View
            key={vehicle.id}
            style={[
              styles.formSection,
              index === 0 ? styles.carASection : styles.carBSection,
              { marginBottom: 16 },
            ]}
          >
            {/* Vehicle title with camera icon */}
            <View
              style={[
                styles.sectionLabel,
                {
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                },
              ]}
            >
              <Text
                style={[
                  styles.subSectionTitle,
                  index === 0
                    ? styles.carATitle
                    : [styles.carBTitle, { color: "red" }],
                ]}
              >
                Véhicule {index === 0 ? "A" : "B"}
              </Text>

              <TouchableOpacity onPress={() => openCameraAndSend(index)}>
                <CameraIcon size={20} color="#4b76b2" />
              </TouchableOpacity>
            </View>

            {/* Marque & Modèle */}
            <View style={styles.inputRow}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.label}>Marque</Text>
                <View style={styles.inputWithIcon}>
                  <Search size={18} color="#6b7280" style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, { paddingLeft: 40 }]}
                    value={vehicle.make}
                    onChangeText={(value) =>
                      handleVehicleChange(index, "make", value)
                    }
                    placeholder="Marque"
                  />
                </View>
              </View>

              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Modèle</Text>
                <View style={styles.inputWithIcon}>
                  <ChevronDown
                    size={18}
                    color="#6b7280"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={[styles.input, { paddingLeft: 40 }]}
                    value={vehicle.model}
                    onChangeText={(value) =>
                      handleVehicleChange(index, "model", value)
                    }
                    placeholder="Modèle"
                  />
                </View>
              </View>
            </View>

            {/* Année & Plaque */}
            <View style={styles.inputRow}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.label}>Année</Text>
                <TextInput
                  style={styles.input}
                  value={vehicle.year.toString()}
                  onChangeText={(value) =>
                    handleVehicleChange(
                      index,
                      "year",
                      parseInt(value) || new Date().getFullYear()
                    )
                  }
                  keyboardType="numeric"
                  placeholder="Année"
                />
              </View>

              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Plaque</Text>
                <TextInput
                  style={styles.input}
                  value={vehicle.licensePlate}
                  onChangeText={(value) =>
                    handleVehicleChange(index, "licensePlate", value)
                  }
                  placeholder="AA-123-AA"
                />
              </View>
            </View>

            {/* VIN & Couleur & Camera in row */}
            <View
              style={[
                styles.inputRow,
                { alignItems: "center", justifyContent: "space-between" },
              ]}
            >
              <View style={{ flex: 1, marginRight: 8 }}>
                <Text style={styles.label}>VIN</Text>
                <TextInput
                  style={styles.input}
                  value={vehicle.vin}
                  onChangeText={(value) =>
                    handleVehicleChange(index, "vin", value)
                  }
                  placeholder="N° d'identification"
                />
              </View>

              <View style={{ flex: 1, marginRight: 8 }}>
                <Text style={styles.label}>Couleur</Text>
                <TextInput
                  style={styles.input}
                  value={vehicle.color}
                  onChangeText={(value) =>
                    handleVehicleChange(index, "color", value)
                  }
                  placeholder="Couleur"
                />
              </View>


            </View>
          </View>
        ))}
      </Animated.View>
    );
  };

  // Step 4: Accident Location and Details
  const renderStep4 = () => (
    <Animated.View
      style={[
        styles.stepContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={styles.sectionHeader}>
        <View style={styles.iconCircle}>
          <MapPin size={20} color="#4b76b2" />
        </View>
        <Text style={styles.sectionTitle}>Lieu et Détails</Text>
      </View>

      <View style={[styles.formSection, { marginBottom: 16 }]}>
        <Text style={styles.subSectionTitle}>Lieu de l'accident</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Adresse</Text>
          <TextInput
            style={styles.input}
            value={location.address}
            onChangeText={(value) => handleLocationChange("address", value)}
            placeholder="Adresse exacte"
          />
        </View>

        <View style={styles.inputRow}>
          <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
            <Text style={styles.label}>Ville</Text>
            <TextInput
              style={styles.input}
              value={location.city}
              onChangeText={(value) => handleLocationChange("city", value)}
              placeholder="Ville"
            />
          </View>
          <View style={[styles.inputGroup, { flex: 1 }]}>
            <Text style={styles.label}>Code postal</Text>
            <TextInput
              style={styles.input}
              value={location.zipCode}
              onChangeText={(value) => handleLocationChange("zipCode", value)}
              placeholder="Code postal"
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Pays</Text>
          <TextInput
            style={styles.input}
            value={location.country}
            onChangeText={(value) => handleLocationChange("country", value)}
            placeholder="Pays"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Description du lieu</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={location.description}
            onChangeText={(value) => handleLocationChange("description", value)}
            placeholder="Décrivez l'endroit précis"
            multiline
            textAlignVertical="top"
          />
        </View>
      </View>

      <View style={[styles.formSection, { marginBottom: 16 }]}>
        <Text style={styles.subSectionTitle}>Dégâts constatés</Text>
        <View style={styles.damageContainer}>
          <Text style={styles.damageInstruction}>
            Sélectionnez les zones endommagées:
          </Text>

          <View style={styles.damageSelection}>
            {[
              "Avant droit",
              "Avant gauche",
              "Arrière droit",
              "Arrière gauche",
              "Portière conducteur",
              "Portière passager",
              "Rétroviseur droit",
              "Rétroviseur gauche",
            ].map((damage) => {
              const vehicleA = details.damages.includes(`A: ${damage}`);
              const vehicleB = details.damages.includes(`B: ${damage}`);

              return (
                <View key={damage} style={styles.damageRow}>
                  <Text style={styles.damageLabel}>{damage}</Text>
                  <View style={styles.damageButtons}>
                    <TouchableOpacity
                      style={[
                        styles.damageButton,
                        vehicleA && styles.damageButtonSelectedA,
                        { marginRight: 8 },
                      ]}
                      onPress={() => handleDamageSelect(damage, "A")}
                    >
                      <Text
                        style={[
                          styles.damageButtonText,
                          vehicleA && styles.damageButtonTextSelected,
                        ]}
                      >
                        A
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.damageButton,
                        vehicleB && styles.damageButtonSelectedB,
                      ]}
                      onPress={() => handleDamageSelect(damage, "B")}
                    >
                      <Text
                        style={[
                          styles.damageButtonText,
                          vehicleB && styles.damageButtonTextSelected,
                        ]}
                      >
                        B
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </View>

      <View style={styles.formSection}>
        <Text style={styles.subSectionTitle}>Témoins</Text>
        <View style={styles.witnessContainer}>
          {details.witnesses.map((witness) => (
            <View key={witness.id} style={styles.witnessItem}>
              <View style={styles.witnessInfo}>
                <Text style={styles.witnessName}>{witness.name}</Text>
                {witness.contact ? (
                  <Text style={styles.witnessContact}>{witness.contact}</Text>
                ) : null}
              </View>
              <View style={styles.witnessActions}>
                <TouchableOpacity
                  onPress={() => openWitnessModal(witness)}
                  style={styles.witnessActionButton}
                >
                  <Edit3 size={16} color="#3b82f6" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => removeWitness(witness.id)}
                  style={styles.witnessActionButton}
                >
                  <X size={16} color="#dc2626" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
          <TouchableOpacity
            style={styles.addWitnessButton}
            onPress={() => openWitnessModal()}
          >
            <Plus size={16} color="#3b82f6" />
            <Text style={styles.addWitnessText}>Ajouter un témoin</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );

  // Step 5: Additional Images and Documents
  const renderStep5 = () => (
    <Animated.View
      style={[
        styles.stepContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={styles.sectionHeader}>
        <View style={styles.iconCircle}>
          <ImageIcon size={20} color="#4b76b2" />
        </View>
        <Text style={styles.sectionTitle}>Images et Documents</Text>
      </View>

      <View style={styles.formSection}>
        <Text style={styles.subSectionTitle}>Documents additionnels</Text>
        <Text style={styles.label}>
          Ajoutez des photos supplémentaires de l'accident, des dommages, ou
          d'autres documents pertinents.
        </Text>

        <TouchableOpacity style={styles.addImageButton}>
          <ImageIcon size={24} color="#3b82f6" />
          <Text style={styles.addImageButtonText}>Ajouter une image</Text>
        </TouchableOpacity>

        {details.additionalImages.length > 0 && (
          <View style={styles.imagesList}>
            {details.additionalImages.map((image, index) => (
              <View key={index} style={styles.imageItem}>
                <Text style={styles.imageName}>Image {index + 1}</Text>
                <TouchableOpacity style={styles.removeImageButton}>
                  <X size={16} color="#dc2626" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </View>
    </Animated.View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.header}>
        <Text style={styles.title}>CONSTAT AMIABLE</Text>
        <Text style={styles.subtitle}>Accident Automobile</Text>
      </View>

      {/* Progress bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressSteps}>
          {[1, 2, 3, 4, 5].map((i) => (
            <View key={i} style={styles.progressStepContainer}>
              <View
                style={[
                  styles.progressStep,
                  step >= i
                    ? styles.progressStepActive
                    : styles.progressStepInactive,
                  step === i && styles.progressStepCurrent,
                ]}
              >
                {step > i ? (
                  <CheckCircle size={16} color="white" />
                ) : (
                  <Text
                    style={
                      step >= i
                        ? styles.progressStepTextActive
                        : styles.progressStepTextInactive
                    }
                  >
                    {i}
                  </Text>
                )}
              </View>
              <Text style={styles.progressStepLabel}>
                {i === 1
                  ? "Général"
                  : i === 2
                  ? "Conducteurs"
                  : i === 3
                  ? "Véhicules"
                  : i === 4
                  ? "Détails"
                  : "Images"}
              </Text>
            </View>
          ))}
        </View>
        <View style={styles.progressBar}>
          <View
            style={[styles.progressBarFill, { width: `${(step / 5) * 100}%` }]}
          />
        </View>
      </View>

      {/* Form steps */}
      <ScrollView
        style={styles.formContainer}
        contentContainerStyle={styles.formContentContainer}
        keyboardShouldPersistTaps="handled"
      >
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        {step === 4 && renderStep4()}
        {step === 5 && renderStep5()}
      </ScrollView>

      {/* Navigation buttons */}
      <View style={styles.navigationButtons}>
        {/* Previous button */}
        <TouchableOpacity
          onPress={prevStep}
          disabled={step === 1}
          style={[
            styles.navButton,
            step === 1 ? styles.navButtonDisabled : styles.navButtonPrev,
          ]}
        >
          <ChevronLeft size={16} color={step === 1 ? "#9ca3af" : "#374151"} />
          <Text
            style={[
              styles.navButtonText,
              step === 1 && styles.navButtonTextDisabled,
            ]}
          >
            Précédent
          </Text>
        </TouchableOpacity>

        {/* Step indicator */}
        <View style={styles.stepIndicator}>
          <Text style={styles.stepIndicatorText}>Étape {step} sur 5</Text>
        </View>

        {/* Generate PDF button only on step 5 */}
        {step === 5 && (
          <TouchableOpacity
            onPress={generatePDF}
            style={[styles.navButton, styles.navButtonPdf]}
          >
            <Download size={16} color="white" />
            <Text style={[styles.navButtonText, { color: "white" }]}>
              Générer PDF
            </Text>
          </TouchableOpacity>
        )}

        {/* Next button only for steps 1-4 */}
        {step < 5 && (
          <TouchableOpacity
            onPress={nextStep}
            style={[styles.navButton, styles.navButtonNext]}
          >
            <Text style={[styles.navButtonText, { color: "white" }]}>
              Suivant
            </Text>
            <ChevronRight size={16} color="white" />
          </TouchableOpacity>
        )}
      </View>

      {/* Sketch Modal */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={sketchModalVisible}
        onRequestClose={() => setSketchModalVisible(false)}
      >
        <View style={styles.sketchModalContainer}>
          <View style={styles.sketchModalHeader}>
            <Text style={styles.sketchModalTitle}>Croquis de l'accident</Text>
            <TouchableOpacity
              onPress={() => setSketchModalVisible(false)}
              style={styles.sketchCloseButton}
            >
              <X size={24} color="#374151" />
            </TouchableOpacity>
          </View>
          <View style={styles.sketchModalContent}>
            <SketchComponent
              onSave={handleSketchSave}
              initialData={details.sketch}
            />
          </View>
          <View style={styles.sketchModalActions}>
            <TouchableOpacity
              style={[
                styles.sketchModalButton,
                styles.sketchModalButtonSecondary,
              ]}
              onPress={() => setSketchModalVisible(false)}
            >
              <Text style={styles.sketchModalButtonTextSecondary}>Annuler</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.sketchModalButton,
                styles.sketchModalButtonPrimary,
              ]}
              onPress={() => {
                // This would typically be handled by the Sketch component's save functionality
                setSketchModalVisible(false);
              }}
            >
              <Text style={styles.sketchModalButtonTextPrimary}>
                Enregistrer
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Witness Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={witnessModalVisible}
        onRequestClose={() => setWitnessModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalOverlay}>
            <View style={styles.witnessModalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {isEditingWitness
                    ? "Modifier le témoin"
                    : "Ajouter un témoin"}
                </Text>
                <TouchableOpacity
                  onPress={() => setWitnessModalVisible(false)}
                  style={styles.closeButton}
                >
                  <X size={24} color="#374151" />
                </TouchableOpacity>
              </View>

              <View style={styles.witnessForm}>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Nom du témoin</Text>
                  <TextInput
                    style={styles.input}
                    value={currentWitness.name}
                    onChangeText={(text) =>
                      setCurrentWitness({ ...currentWitness, name: text })
                    }
                    placeholder="Nom complet"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Coordonnées</Text>
                  <TextInput
                    style={styles.input}
                    value={currentWitness.contact}
                    onChangeText={(text) =>
                      setCurrentWitness({ ...currentWitness, contact: text })
                    }
                    placeholder="Téléphone ou email"
                  />
                </View>
              </View>

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonSecondary]}
                  onPress={() => setWitnessModalVisible(false)}
                >
                  <Text style={styles.modalButtonTextSecondary}>Annuler</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonPrimary]}
                  onPress={saveWitness}
                >
                  <Text style={styles.modalButtonTextPrimary}>
                    {isEditingWitness ? "Modifier" : "Ajouter"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    backgroundColor: "#1e3a8a",
    padding: 16,
    paddingTop: 50,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    zIndex: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 12,
    color: "white",
    opacity: 0.9,
    marginTop: 4,
  },
  progressContainer: {
    backgroundColor: "white",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  progressSteps: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  progressStepContainer: {
    alignItems: "center",
    flex: 1,
  },
  progressStep: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
    borderWidth: 2,
    borderColor: "transparent",
  },
  progressStepActive: {
    backgroundColor: "#1e3a8a",
  },
  progressStepInactive: {
    backgroundColor: "#e5e7eb",
  },
  progressStepCurrent: {
    borderColor: "#93c5fd",
  },
  progressStepTextActive: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  progressStepTextInactive: {
    color: "#6b7280",
    fontSize: 14,
  },
  progressStepLabel: {
    fontSize: 10,
    color: "#64748b",
    textAlign: "center",
  },
  progressBar: {
    width: "100%",
    height: 4,
    backgroundColor: "#e5e7eb",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#1e3a8a",
    borderRadius: 2,
  },
  formContainer: {
    flex: 1,
  },
  formContentContainer: {
    padding: 16,
  },
  stepContainer: {
    gap: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 8,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#dbeafe",
    justifyContent: "center",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
  },
  formSection: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 10,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  carASection: {
    borderLeftWidth: 4,
    borderLeftColor: "#3b82f6",
  },
  carBSection: {
    borderLeftWidth: 4,
    borderLeftColor: "#ef4444",
  },
  sectionLabel: {
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  subSectionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1e293b",
  },
  carATitle: {
    color: "#3b82f6",
  },
  carBTitle: {
    color: "#ef4444",
  },
  inputRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  inputGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 4,
  },
  input: {
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 6,
    padding: 10,
    fontSize: 14,
    color: "#1e293b",
    minHeight: 44,
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  inputWithIcon: {
    position: "relative",
  },
  inputIcon: {
    position: "absolute",
    left: 10,
    top: 13,
    zIndex: 1,
  },
  responsibilityContainer: {
    flexDirection: "row",
    gap: 10,
  },
  responsibilityButton: {
    flex: 1,
    padding: 12,
    borderRadius: 6,
    backgroundColor: "#f1f5f9",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "transparent",
  },
  responsibilityButtonSelected: {
    backgroundColor: "#1e40af",
    borderColor: "#1e40af",
  },
  responsibilityButtonText: {
    fontWeight: "500",
    color: "#64748b",
    fontSize: 13,
  },
  responsibilityButtonTextSelected: {
    color: "white",
  },
  sketchButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    backgroundColor: "#f0f9ff",
    borderWidth: 1,
    borderColor: "#bae6fd",
    borderRadius: 6,
    gap: 8,
  },
  sketchButtonText: {
    color: "#0c4a6e",
    fontWeight: "500",
  },
  damageContainer: {
    gap: 12,
  },
  damageInstruction: {
    fontSize: 13,
    color: "#64748b",
    textAlign: "center",
    marginBottom: 8,
  },
  damageSelection: {
    gap: 8,
  },
  damageRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  damageLabel: {
    fontSize: 13,
    color: "#374151",
    flex: 1,
  },
  damageButtons: {
    flexDirection: "row",
  },
  damageButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#d1d5db",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  damageButtonSelectedA: {
    backgroundColor: "#3b82f6",
    borderColor: "#3b82f6",
  },
  damageButtonSelectedB: {
    backgroundColor: "#ef4444",
    borderColor: "#ef4444",
  },
  damageButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
  damageButtonTextSelected: {
    color: "white",
  },
  witnessContainer: {
    gap: 10,
  },
  witnessItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  witnessInfo: {
    flex: 1,
  },
  witnessName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
  },
  witnessContact: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 2,
  },
  witnessActions: {
    flexDirection: "row",
    gap: 8,
  },
  witnessActionButton: {
    padding: 4,
  },
  addWitnessButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 14,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderStyle: "dashed",
    borderRadius: 6,
    gap: 8,
  },
  addWitnessText: {
    color: "#3b82f6",
    fontSize: 13,
    fontWeight: "500",
  },
  navigationButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  navButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    gap: 6,
  },
  navButtonPrev: {
    backgroundColor: "#f3f4f6",
  },
  navButtonNext: {
    backgroundColor: "#1e40af",
  },
  navButtonSubmit: {
    backgroundColor: "#059669",
  },
  navButtonDisabled: {
    backgroundColor: "#f9fafb",
  },
  navButtonText: {
    fontWeight: "600",
    fontSize: 13,
  },
  navButtonTextDisabled: {
    color: "#9ca3af",
  },
  stepIndicator: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#f1f5f9",
    borderRadius: 14,
  },
  stepIndicatorText: {
    fontSize: 11,
    fontWeight: "500",
    color: "#64748b",
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  // Sketch Modal Styles
  sketchModalContainer: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: Platform.OS === "ios" ? 50 : 20,
  },
  sketchModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    backgroundColor: "#f8fafc",
  },
  sketchModalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
  },
  sketchCloseButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: "#f3f4f6",
  },
  sketchModalContent: {
    flex: 1,
    padding: 8,
    backgroundColor: "#f8fafc",
  },
  sketchModalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    backgroundColor: "white",
  },
  sketchModalButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 8,
  },
  sketchModalButtonPrimary: {
    backgroundColor: "#3b82f6",
  },
  sketchModalButtonSecondary: {
    backgroundColor: "#f3f4f6",
    borderWidth: 1,
    borderColor: "#d1d5db",
  },
  sketchModalButtonTextPrimary: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  sketchModalButtonTextSecondary: {
    color: "#374151",
    fontWeight: "600",
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
  },
  closeButton: {
    padding: 4,
  },
  sketchContainer: {
    flex: 1,
  },
  witnessModalContent: {
    backgroundColor: "white",
    borderRadius: 12,
    width: "100%",
    maxWidth: 400,
    overflow: "hidden",
  },
  witnessForm: {
    padding: 16,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    minWidth: 80,
    alignItems: "center",
  },
  modalButtonPrimary: {
    backgroundColor: "#3b82f6",
  },
  modalButtonSecondary: {
    backgroundColor: "#f3f4f6",
  },
  modalButtonTextPrimary: {
    color: "white",
    fontWeight: "600",
  },
  modalButtonTextSecondary: {
    color: "#374151",
    fontWeight: "600",
  },
  navButtonPdf: {
    backgroundColor: "#8b5cf6",
  },
  // Step 5 Styles
  addImageButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#f0f9ff",
    borderWidth: 2,
    borderColor: "#bae6fd",
    borderStyle: "dashed",
    borderRadius: 8,
    gap: 8,
    marginVertical: 12,
  },
  addImageButtonText: {
    color: "#0c4a6e",
    fontWeight: "500",
    fontSize: 14,
  },
  imagesList: {
    gap: 8,
  },
  imageItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    padding: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  imageName: {
    fontSize: 14,
    color: "#374151",
    fontWeight: "500",
  },
  removeImageButton: {
    padding: 4,
  },
});

export default ConstatForm;
