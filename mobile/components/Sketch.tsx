// Sketch.tsx
import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  PanResponder,
  Animated,
  Dimensions,
  TouchableOpacity,
  Alert,
  StatusBar,
  ScrollView,
  TextStyle,
  Platform,
} from "react-native";

type ElementType =
  | "car_a"
  | "car_b"
  | "car_c"
  | "truck"
  | "motorcycle"
  | "bus"
  | "road_straight"
  | "road_curve"
  | "intersection"
  | "roundabout"
  | "impact"
  | "debris"
  | "skid_marks"
  | "traffic_light"
  | "stop_sign";

interface AccidentElement {
  id: string;
  type: ElementType;
  position: Animated.ValueXY;
  rotation: Animated.Value;
  zIndex: number;
  width: number;
  height: number;
  color: string;
  label: string;
  fixed?: boolean;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
// Responsive scaling helpers
const BASE_WIDTH = 390;
const uiScale = Math.min(1, Math.max(0.75, screenWidth / BASE_WIDTH));
const scaleValue = (v: number) => Math.max(10, Math.round(v * uiScale));

// Base element sizes; will be scaled at runtime for mobile
const BASE_ELEMENTS = {
  // Vehicles
  car_a: {
    width: 80,
    height: 40,
    color: "#dc2626",
    label: "Car A",
    zIndex: 10,
  },
  car_b: {
    width: 80,
    height: 40,
    color: "#2563eb",
    label: "Car B",
    zIndex: 10,
  },
  car_c: {
    width: 80,
    height: 40,
    color: "#16a34a",
    label: "Car C",
    zIndex: 10,
  },
  truck: {
    width: 100,
    height: 50,
    color: "#ea580c",
    label: "Truck",
    zIndex: 10,
  },
  motorcycle: {
    width: 60,
    height: 30,
    color: "#7c3aed",
    label: "Motorcycle",
    zIndex: 10,
  },
  bus: { width: 120, height: 55, color: "#f59e0b", label: "Bus", zIndex: 10 },

  // Roads
  road_straight: {
    width: 280,
    height: 50,
    color: "#374151",
    label: "Road",
    zIndex: 1,
  },
  road_curve: {
    width: 100,
    height: 100,
    color: "#374151",
    label: "Curve",
    zIndex: 1,
  },
  intersection: {
    width: 120,
    height: 120,
    color: "#374151",
    label: "Intersection",
    zIndex: 1,
  },
  roundabout: {
    width: 100,
    height: 100,
    color: "#374151",
    label: "Roundabout",
    zIndex: 1,
  },

  // Evidence & Objects
  impact: {
    width: 35,
    height: 35,
    color: "#ef4444",
    label: "Impact",
    zIndex: 8,
  },
  debris: {
    width: 30,
    height: 20,
    color: "#78716c",
    label: "Debris",
    zIndex: 5,
  },
  skid_marks: {
    width: 90,
    height: 15,
    color: "#1f2937",
    label: "Skid Marks",
    zIndex: 3,
  },
  traffic_light: {
    width: 25,
    height: 60,
    color: "#1f2937",
    label: "Traffic Light",
    zIndex: 7,
  },
  stop_sign: {
    width: 35,
    height: 35,
    color: "#dc2626",
    label: "Stop Sign",
    zIndex: 7,
  },
};

const getScaledConfig = (type: ElementType) => {
  const cfg = (BASE_ELEMENTS as any)[type];
  return {
    ...cfg,
    width: scaleValue(cfg.width),
    height: scaleValue(cfg.height),
  };
};

const snapToGrid = (value: number, grid = 5) => Math.round(value / grid) * grid;

// Safe way to read Animated values in TS
const getAnimValue = (v: any): number => {
  if (v && typeof v.__getValue === "function") return v.__getValue();
  return typeof v?._value === "number" ? v._value : 0;
};

// Enhanced Vehicle Component with proper rotation center
const VehicleShape: React.FC<{
  element: AccidentElement;
  isSelected: boolean;
}> = ({ element, isSelected }) => {
  const getVehicleStyle = () => {
    switch (element.type) {
      case "truck":
        return styles.truckStyle;
      case "motorcycle":
        return styles.motorcycleStyle;
      case "bus":
        return styles.busStyle;
      default:
        return styles.carStyle;
    }
  };

  return (
    <View
      style={[
        styles.vehicleContainer,
        {
          width: element.width,
          height: element.height,
          borderWidth: isSelected ? 2 : 1,
          borderColor: isSelected ? "#fbbf24" : "#e5e7eb",
          backgroundColor: element.color,
        },
        getVehicleStyle(),
      ]}
    >
      {/* Vehicle Body Details */}
      <View style={styles.vehicleBody}>
        {/* Windshield */}
        <View
          style={[
            styles.windshield,
            {
              backgroundColor: "#87ceeb",
              width: element.type === "motorcycle" ? "40%" : "55%",
              height: element.type === "bus" ? "25%" : "35%",
            },
          ]}
        />

        {/* Front Indicator */}
        <View
          style={[
            styles.frontIndicator,
            {
              right: element.type === "motorcycle" ? "5%" : "3%",
            },
          ]}
        />

        {/* Wheels */}
        {element.type === "motorcycle" ? (
          <>
            <View style={[styles.motorcycleWheel, { left: "10%" }]} />
            <View style={[styles.motorcycleWheel, { right: "10%" }]} />
          </>
        ) : (
          <>
            <View style={[styles.wheel, { left: "15%" }]} />
            <View style={[styles.wheel, { right: "15%" }]} />
            {(element.type === "truck" || element.type === "bus") && (
              <View style={[styles.wheel, { left: "40%" }]} />
            )}
          </>
        )}

        {/* Direction Arrow */}
        <View style={styles.directionArrow} />
      </View>

      {/* Label */}
      <View style={styles.labelContainer}>
        <Text
          style={[
            styles.vehicleLabel,
            { fontSize: Math.max(8, Math.round(9 * uiScale)) as any },
          ]}
        >
          {element.label}
        </Text>
      </View>
    </View>
  );
};

const DraggableElement: React.FC<{
  element: AccidentElement;
  onSelect: (id: string) => void;
  isSelected: boolean;
  canvasWidth: number;
  canvasHeight: number;
}> = ({ element, onSelect, isSelected, canvasWidth, canvasHeight }) => {
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      onSelect(element.id);
      element.position.setOffset({
        x: getAnimValue(element.position.x),
        y: getAnimValue(element.position.y),
      });
    },
    onPanResponderMove: Animated.event(
      [null, { dx: element.position.x, dy: element.position.y }],
      { useNativeDriver: false }
    ),
    onPanResponderRelease: () => {
      element.position.flattenOffset();

      // Keep element within bounds
      const newX = snapToGrid(
        Math.max(
          10,
          Math.min(
            canvasWidth - element.width - 10,
            getAnimValue(element.position.x)
          )
        )
      );
      const newY = snapToGrid(
        Math.max(
          10,
          Math.min(
            canvasHeight - element.height - 10,
            getAnimValue(element.position.y)
          )
        )
      );

      Animated.spring(element.position, {
        toValue: { x: newX, y: newY },
        useNativeDriver: false,
        tension: 120,
        friction: 8,
      }).start();
    },
  });

  // Fixed rotation around center
  const rotateInterpolation = element.rotation.interpolate({
    inputRange: [0, 360],
    outputRange: ["0deg", "360deg"],
  });

  const renderElement = () => {
    const isVehicle = [
      "car_a",
      "car_b",
      "car_c",
      "truck",
      "motorcycle",
      "bus",
    ].includes(element.type);

    if (isVehicle) {
      return <VehicleShape element={element} isSelected={isSelected} />;
    }

    const getElementStyle = () => {
      switch (element.type) {
        case "road_straight":
          return {
            backgroundColor: element.color,
            borderRadius: 6,
            borderTopWidth: 3,
            borderBottomWidth: 3,
            borderColor: "#facc15",
          };
        case "road_curve":
          return {
            backgroundColor: element.color,
            borderRadius: element.width / 2,
            borderWidth: 3,
            borderColor: "#facc15",
          };
        case "intersection":
          return {
            backgroundColor: element.color,
            borderRadius: 8,
          };
        case "roundabout":
          return {
            backgroundColor: element.color,
            borderRadius: element.width / 2,
            borderWidth: 8,
            borderColor: "#facc15",
          };
        case "impact":
          return {
            backgroundColor: element.color,
            borderRadius: element.width / 2,
            borderWidth: 2,
            borderColor: "#ffffff",
          };
        case "traffic_light":
          return {
            backgroundColor: element.color,
            borderRadius: 4,
            borderWidth: 2,
            borderColor: "#374151",
          };
        case "stop_sign":
          return {
            backgroundColor: element.color,
            borderRadius: 4,
            borderWidth: 2,
            borderColor: "#ffffff",
          };
        default:
          return {
            backgroundColor: element.color,
            borderRadius: 4,
          };
      }
    };

    return (
      <View
        style={[
          {
            width: element.width,
            height: element.height,
            justifyContent: "center",
            alignItems: "center",
            borderWidth: isSelected ? 3 : 0,
            borderColor: isSelected ? "#fbbf24" : "transparent",
          },
          getElementStyle(),
        ]}
      >
        {/* Intersection Lines */}
        {element.type === "intersection" && (
          <>
            <View style={styles.intersectionLineH} />
            <View style={styles.intersectionLineV} />
            <View style={styles.centerDot} />
          </>
        )}

        {/* Roundabout Center */}
        {element.type === "roundabout" && (
          <View style={styles.roundaboutCenter} />
        )}

        <Text style={[styles.elementText, getTextStyle(element.type)]}>
          {getElementSymbol(element.type)}
        </Text>
      </View>
    );
  };

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        styles.draggableElement,
        {
          zIndex: element.zIndex,
          transform: [
            ...element.position.getTranslateTransform(),
            { rotate: rotateInterpolation },
          ],
        },
      ]}
    >
      {renderElement()}
    </Animated.View>
  );
};

const getElementSymbol = (type: ElementType) => {
  switch (type) {
    case "impact":
      return "💥";
    case "debris":
      return "⚡";
    case "skid_marks":
      return "~~~";
    case "traffic_light":
      return "🚦";
    case "stop_sign":
      return "STOP";
    case "road_straight":
      return "━━━";
    case "intersection":
      return "✚";
    case "roundabout":
      return "◯";
    default:
      return "";
  }
};

const getTextStyle = (type: ElementType): TextStyle => {
  const baseStyle: TextStyle = {
    fontSize: 8,
    fontWeight: "600" as TextStyle["fontWeight"],
  };

  switch (type) {
    case "road_straight":
    case "intersection":
    case "skid_marks":
      return { ...baseStyle, color: "#facc15" } as TextStyle;
    case "stop_sign":
      return { ...baseStyle, color: "#ffffff", fontSize: 6 } as TextStyle;
    default:
      return { ...baseStyle, color: "#ffffff" } as TextStyle;
  }
};

export const Sketch: React.FC = () => {
  const [elements, setElements] = useState<AccidentElement[]>([
    {
      id: "car_a",
      type: "car_a",
      position: new Animated.ValueXY({
        x: scaleValue(100),
        y: scaleValue(200),
      }),
      rotation: new Animated.Value(0),
      ...getScaledConfig("car_a"),
    },
    {
      id: "car_b",
      type: "car_b",
      position: new Animated.ValueXY({
        x: scaleValue(200),
        y: scaleValue(250),
      }),
      rotation: new Animated.Value(90),
      ...getScaledConfig("car_b"),
    },
  ]);

  const [selectedElement, setSelectedElement] = useState<string | null>(
    "car_a"
  );
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showAddControls, setShowAddControls] = useState(false);

  // Sidebar width based on screen size
  const sidebarWidth = screenWidth > 600 ? 80 : 60;
  const canvasHeight = isFullscreen
    ? screenHeight
    : Math.max(300, Math.min(screenHeight * 0.65, 520 * uiScale));
  const canvasWidth = screenWidth - sidebarWidth - 20;

  const rotateSelected = (degrees: number) => {
    if (!selectedElement) return;
    const element = elements.find((e) => e.id === selectedElement);
    if (element) {
      // Rotate in place without moving the element
      const newRotation =
        (getAnimValue(element.rotation) + degrees + 360) % 360;
      Animated.spring(element.rotation, {
        toValue: newRotation,
        useNativeDriver: false,
        tension: 100,
        friction: 8,
      }).start();
    }
  };

  const changeZIndex = (direction: "up" | "down") => {
    if (!selectedElement) return;
    setElements(
      elements.map((e) => {
        if (e.id === selectedElement) {
          const newZIndex =
            direction === "up"
              ? Math.min(20, e.zIndex + 1)
              : Math.max(1, e.zIndex - 1);
          return { ...e, zIndex: newZIndex };
        }
        return e;
      })
    );
  };

  const addElement = (type: ElementType) => {
    const config = getScaledConfig(type);
    const newElement: AccidentElement = {
      id: `${type}_${Date.now()}`,
      type,
      position: new Animated.ValueXY({
        x: canvasWidth / 2 - config.width / 2,
        y: canvasHeight / 2 - config.height / 2,
      }),
      rotation: new Animated.Value(0),
      ...config,
    };

    setElements([...elements, newElement]);
    setSelectedElement(newElement.id);
    setShowAddControls(false); // Close add panel after adding
  };

  const duplicateSelected = () => {
    if (!selectedElement) return;
    const element = elements.find((e) => e.id === selectedElement);
    if (element) {
      const newElement: AccidentElement = {
        ...element,
        id: `${element.type}_${Date.now()}`,
        position: new Animated.ValueXY({
          x: getAnimValue(element.position.x) + 20,
          y: getAnimValue(element.position.y) + 20,
        }),
        rotation: new Animated.Value(getAnimValue(element.rotation)),
      };
      setElements([...elements, newElement]);
      setSelectedElement(newElement.id);
    }
  };

  const deleteSelected = () => {
    if (!selectedElement) return;

    Alert.alert("Delete Element", "Remove this element from the scene?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          setElements(elements.filter((e) => e.id !== selectedElement));
          setSelectedElement(
            elements.find((e) => e.id !== selectedElement)?.id || null
          );
        },
      },
    ]);
  };

  const selectedEl = elements.find((e) => e.id === selectedElement);

  return (
    <View
      style={[styles.container, isFullscreen && styles.fullscreenContainer]}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor="#1e293b"
        hidden={isFullscreen}
      />

      {/* Header */}
      {!isFullscreen && (
        <View style={styles.header}>
          <Text style={styles.title}>🚗 Sketch</Text>
          <TouchableOpacity
            style={styles.headerBtn}
            onPress={() => setIsFullscreen(true)}
          >
            <Text style={styles.headerBtnText}>Fullscreen</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Fullscreen Header */}
      {isFullscreen && (
        <View style={styles.fullscreenHeader}>
          <TouchableOpacity
            style={styles.exitFullscreenBtn}
            onPress={() => setIsFullscreen(false)}
          >
            <Text style={styles.exitFullscreenText}>✕ Exit</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.mainContent}>
        {/* Persistent Sidebar */}
        <View style={[styles.sidebar, { width: sidebarWidth }]}>
          <ScrollView
            contentContainerStyle={styles.sidebarContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Rotation Controls */}
            <View style={styles.sidebarSection}>
              <Text style={styles.sidebarSectionTitle}>Rotate</Text>
              <TouchableOpacity
                style={styles.sidebarBtn}
                onPress={() => rotateSelected(-15)}
                disabled={!selectedElement}
              >
                <Text style={styles.sidebarBtnText}>↺</Text>
                <Text style={styles.sidebarBtnSubText}>-15°</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.sidebarBtn}
                onPress={() => rotateSelected(15)}
                disabled={!selectedElement}
              >
                <Text style={styles.sidebarBtnText}>↻</Text>
                <Text style={styles.sidebarBtnSubText}>+15°</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.sidebarBtn}
                onPress={() => rotateSelected(90)}
                disabled={!selectedElement}
              >
                <Text style={styles.sidebarBtnText}>↻</Text>
                <Text style={styles.sidebarBtnSubText}>90°</Text>
              </TouchableOpacity>
            </View>

            {/* Layer Controls */}
            <View style={styles.sidebarSection}>
              <Text style={styles.sidebarSectionTitle}>Layer</Text>
              <TouchableOpacity
                style={styles.sidebarBtn}
                onPress={() => changeZIndex("up")}
                disabled={!selectedElement}
              >
                <Text style={styles.sidebarBtnText}>⬆</Text>
                <Text style={styles.sidebarBtnSubText}>Up</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.sidebarBtn}
                onPress={() => changeZIndex("down")}
                disabled={!selectedElement}
              >
                <Text style={styles.sidebarBtnText}>⬇</Text>
                <Text style={styles.sidebarBtnSubText}>Down</Text>
              </TouchableOpacity>
            </View>

            {/* Quick Actions */}
            <View style={styles.sidebarSection}>
              <Text style={styles.sidebarSectionTitle}>Actions</Text>
              <TouchableOpacity
                style={styles.sidebarBtn}
                onPress={() => setShowAddControls(!showAddControls)}
              >
                <Text style={styles.sidebarBtnText}>➕</Text>
                <Text style={styles.sidebarBtnSubText}>Add</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.sidebarBtn}
                onPress={duplicateSelected}
                disabled={!selectedElement}
              >
                <Text style={styles.sidebarBtnText}>📋</Text>
                <Text style={styles.sidebarBtnSubText}>Copy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.sidebarBtn, styles.deleteBtn]}
                onPress={deleteSelected}
                disabled={!selectedElement}
              >
                <Text style={styles.sidebarBtnText}>🗑</Text>
                <Text style={styles.sidebarBtnSubText}>Del</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>

        {/* Main Canvas Area */}
        <View style={styles.canvasArea}>
          {/* Element Info Bar */}
          {selectedEl && !isFullscreen && (
            <View style={styles.infoBar}>
              <Text style={styles.infoText}>
                <Text style={styles.infoHighlight}>{selectedEl.label}</Text> •
                {Math.round(getAnimValue(selectedEl.rotation))}° • Layer{" "}
                {selectedEl.zIndex}
              </Text>
            </View>
          )}

          {/* Canvas */}
          <View
            style={[
              styles.canvas,
              { height: canvasHeight, width: canvasWidth },
            ]}
          >
            <View style={styles.canvasBackground}>
              {/* Grid */}
              <View style={styles.gridPattern} />

              {elements
                .sort((a, b) => a.zIndex - b.zIndex)
                .map((element) => (
                  <DraggableElement
                    key={element.id}
                    element={element}
                    onSelect={setSelectedElement}
                    isSelected={selectedElement === element.id}
                    canvasWidth={canvasWidth}
                    canvasHeight={canvasHeight}
                  />
                ))}
            </View>
          </View>
        </View>
      </View>

      {/* Add Controls Modal */}
      {showAddControls && (
        <View style={styles.addControlsModal}>
          <View style={styles.addControlsContent}>
            <View style={styles.addControlsHeader}>
              <Text style={styles.addControlsTitle}>Add Elements</Text>
              <TouchableOpacity onPress={() => setShowAddControls(false)}>
                <Text style={styles.addControlsClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.addControlsScroll}>
              {/* Vehicles */}
              <View style={styles.addSection}>
                <Text style={styles.addSectionTitle}>🚗 Vehicles</Text>
                <View style={styles.addButtonGrid}>
                  {[
                    "car_a",
                    "car_b",
                    "car_c",
                    "truck",
                    "motorcycle",
                    "bus",
                  ].map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.addBtn,
                        { backgroundColor: (BASE_ELEMENTS as any)[type].color },
                      ]}
                      onPress={() => addElement(type as ElementType)}
                    >
                      <Text style={styles.addBtnText}>
                        {(BASE_ELEMENTS as any)[type].label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Roads */}
              <View style={styles.addSection}>
                <Text style={styles.addSectionTitle}>🛣️ Infrastructure</Text>
                <View style={styles.addButtonGrid}>
                  {[
                    "road_straight",
                    "intersection",
                    "roundabout",
                    "traffic_light",
                    "stop_sign",
                  ].map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.addBtn,
                        { backgroundColor: (BASE_ELEMENTS as any)[type].color },
                      ]}
                      onPress={() => addElement(type as ElementType)}
                    >
                      <Text style={styles.addBtnText}>
                        {(BASE_ELEMENTS as any)[type].label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Evidence */}
              <View style={styles.addSection}>
                <Text style={styles.addSectionTitle}>🔍 Evidence</Text>
                <View style={styles.addButtonGrid}>
                  {["impact", "debris", "skid_marks"].map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.addBtn,
                        { backgroundColor: (BASE_ELEMENTS as any)[type].color },
                      ]}
                      onPress={() => addElement(type as ElementType)}
                    >
                      <Text style={styles.addBtnText}>
                        {(BASE_ELEMENTS as any)[type].label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  fullscreenContainer: {
    backgroundColor: "#000000",
  },

  // Header
  header: {
    backgroundColor: "#1e293b",
    paddingTop: Platform.OS === "ios" ? 50 : 20,
    paddingBottom: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
  },
  headerBtn: {
    backgroundColor: "#475569",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  headerBtnText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "600",
  },

  // Fullscreen Header
  fullscreenHeader: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 1000,
  },
  exitFullscreenBtn: {
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  exitFullscreenText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },

  // Main Layout
  mainContent: {
    flex: 1,
    flexDirection: "row",
  },

  // Sidebar
  sidebar: {
    backgroundColor: "#1e293b",
    paddingVertical: 12,
    borderRightWidth: 1,
    borderRightColor: "#475569",
  },
  sidebarContent: {
    alignItems: "center",
    paddingHorizontal: 8,
  },
  sidebarSection: {
    marginBottom: 20,
    alignItems: "center",
  },
  sidebarSectionTitle: {
    color: "#e2e8f0",
    fontSize: 10,
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "center",
  },
  sidebarBtn: {
    backgroundColor: "#3b82f6",
    width: 44,
    height: 44,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
  },
  sidebarBtnText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  sidebarBtnSubText: {
    color: "#ffffff",
    fontSize: 8,
    fontWeight: "600",
    marginTop: -2,
  },
  deleteBtn: {
    backgroundColor: "#ef4444",
  },

  // Canvas Area
  canvasArea: {
    flex: 1,
    padding: 10,
  },
  infoBar: {
    backgroundColor: "#ffffff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
  },
  infoText: {
    fontSize: 12,
    color: "#374151",
    textAlign: "center",
  },
  infoHighlight: {
    fontWeight: "bold",
    color: "#1d4ed8",
  },

  // Canvas
  canvas: {
    borderRadius: 12,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  canvasBackground: {
    flex: 1,
    backgroundColor: "#e2e8f0",
    position: "relative",
  },
  gridPattern: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.05,
  },

  // Elements
  draggableElement: {
    position: "absolute",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },

  // Vehicle Styles
  vehicleContainer: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  carStyle: {
    borderRadius: 8,
  },
  truckStyle: {
    borderRadius: 6,
  },
  motorcycleStyle: {
    borderRadius: 12,
  },
  busStyle: {
    borderRadius: 4,
  },
  vehicleBody: {
    width: "100%",
    height: "100%",
    position: "relative",
  },
  windshield: {
    position: "absolute",
    top: "20%",
    left: "22.5%",
    borderRadius: 3,
  },
  frontIndicator: {
    position: "absolute",
    width: "6%",
    height: "30%",
    backgroundColor: "#ffffff",
    top: "35%",
    borderRadius: 2,
  },
  wheel: {
    position: "absolute",
    width: 8,
    height: 8,
    backgroundColor: "#1f2937",
    borderRadius: 4,
    bottom: "20%",
  },
  motorcycleWheel: {
    position: "absolute",
    width: 12,
    height: 12,
    backgroundColor: "#1f2937",
    borderRadius: 6,
    bottom: "25%",
  },
  directionArrow: {
    position: "absolute",
    right: -6,
    top: "50%",
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderTopWidth: 4,
    borderBottomWidth: 4,
    borderLeftColor: "#ffffff",
    borderTopColor: "transparent",
    borderBottomColor: "transparent",
    transform: [{ translateY: -4 }],
  },
  labelContainer: {
    position: "absolute",
    bottom: -18,
    width: "100%",
    alignItems: "center",
  },
  vehicleLabel: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#374151",
    textAlign: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3,
  },

  // Element Styles
  elementText: {
    textAlign: "center",
    fontWeight: "bold",
  },
  intersectionLineH: {
    position: "absolute",
    width: "100%",
    height: 4,
    backgroundColor: "#facc15",
    top: "48%",
  },
  intersectionLineV: {
    position: "absolute",
    width: 4,
    height: "100%",
    backgroundColor: "#facc15",
    left: "48%",
  },
  centerDot: {
    position: "absolute",
    width: 8,
    height: 8,
    backgroundColor: "#ffffff",
    borderRadius: 4,
    top: "46%",
    left: "46%",
  },
  roundaboutCenter: {
    width: "60%",
    height: "60%",
    backgroundColor: "#16a34a",
    borderRadius: 50,
    position: "absolute",
  },

  // Add Controls Modal
  addControlsModal: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  addControlsContent: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    width: "90%",
    maxWidth: 400,
    maxHeight: "80%",
    elevation: 10,
  },
  addControlsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  addControlsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f2937",
  },
  addControlsClose: {
    fontSize: 18,
    color: "#6b7280",
    fontWeight: "bold",
  },
  addControlsScroll: {
    maxHeight: 400,
  },
  addSection: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  addSectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#374151",
    marginBottom: 12,
  },
  addButtonGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  addBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 80,
    alignItems: "center",
    elevation: 2,
  },
  addBtnText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },
});
