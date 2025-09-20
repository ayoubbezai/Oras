
import {
  StyleSheet,
  View,
  TouchableOpacity,
  TextInput,
  Alert,
  Animated,
  Keyboard,
  TouchableWithoutFeedback,
  Image,
  Dimensions,
} from "react-native";
import { ThemedText } from "@/components/themed-text";
import { useRouter } from "expo-router";
import { useState, useEffect, useRef } from "react";

import Logo from "../../assets/images/logo.png";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [timeLeft, setTimeLeft] = useState(600);
  const [isActive, setIsActive] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const logoRotateAnim = useRef(new Animated.Value(0)).current;
  const inputFocusAnim = useRef(new Animated.Value(0)).current;
  const buttonHoverAnim = useRef(new Animated.Value(1)).current;

  const generateCode = () => {
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    setCode(newCode);
    setTimeLeft(600);
    setIsActive(true);

    Animated.parallel([
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.95,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(logoRotateAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();

    startPulseAnimation();
  };

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.02,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const handleJoin = () => {
    if (joinCode.length !== 6) {
      Alert.alert("Invalid Code", "Please enter a 6-digit code");
      return;
    }

    Animated.sequence([
      Animated.timing(buttonHoverAnim, {
        toValue: 0.96,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonHoverAnim, {
        toValue: 1.02,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(buttonHoverAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    Alert.alert("Joining", `Joining Safety يقين with code: ${joinCode}`);
  };

  const handleInputFocus = () => {
    Animated.timing(inputFocusAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const handleInputBlur = () => {
    Animated.timing(inputFocusAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const logoRotation = logoRotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const inputScale = inputFocusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.02],
  });

  useEffect(() => {
    if (!isActive) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsActive(false);
          Animated.parallel([
            Animated.timing(fadeAnim, {
              toValue: 0,
              duration: 400,
              useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
              toValue: 50,
              duration: 400,
              useNativeDriver: true,
            }),
          ]).start(() => setCode(""));
          pulseAnim.stopAnimation();
          pulseAnim.setValue(1);
          Alert.alert(
            "Session Expired",
            "Your session has expired. Please generate a new code.",
            [{ text: "OK", style: "default" }]
          );
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isActive]);

  const formatTime = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const getProgress = () => {
    return (600 - timeLeft) / 600;
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Animated.View
          style={[styles.card, { transform: [{ scale: scaleAnim }] }]}
        >
          <View style={styles.logoContainer}>
            <View style={styles.logoGlow}>
              <Animated.View style={{ transform: [{ rotate: logoRotation }] }}>
                <Image source={Logo} style={styles.logo} resizeMode="contain" />
              </Animated.View>
            </View>
          </View>

          <View style={styles.titleContainer}>
            <ThemedText type="title" style={styles.appTitle}>
              Safety يقين
            </ThemedText>
            <View style={styles.badgeContainer}>
              <View style={[styles.badge, styles.secureBadge]}>
                <ThemedText style={[styles.badgeText, styles.secureBadgeText]}>
                  🔒 Secure
                </ThemedText>
              </View>
              <View style={[styles.badge, styles.privateBadge]}>
                <ThemedText style={[styles.badgeText, styles.privateBadgeText]}>
                  👁️ Private
                </ThemedText>
              </View>
              <View style={[styles.badge, styles.encryptedBadge]}>
                <ThemedText
                  style={[styles.badgeText, styles.encryptedBadgeText]}
                >
                  🛡️ Encrypted
                </ThemedText>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={generateCode}
            activeOpacity={0.9}
          >
            <ThemedText style={styles.buttonText}>✨ Create Session</ThemedText>
          </TouchableOpacity>

          {code ? (
            <Animated.View
              style={[
                styles.codeContainer,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }, { scale: pulseAnim }],
                },
              ]}
            >
              <ThemedText style={styles.codeLabel}>Your secure code</ThemedText>
              <View style={styles.codeWrapper}>
                <ThemedText style={styles.codeText}>{code}</ThemedText>
                <View style={styles.copyHint}>
                  <ThemedText style={styles.copyHintText}>
                    Tap to copy
                  </ThemedText>
                </View>
              </View>

              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <Animated.View
                    style={[
                      styles.progressFill,
                      {
                        width: `${getProgress() * 100}%`,
                      },
                    ]}
                  />
                </View>
                <View style={styles.timerContainer}>
                  <ThemedText style={styles.timerText}>
                    ⏱️ Expires in {formatTime()}
                  </ThemedText>
                  <View style={styles.statusDot} />
                </View>
              </View>
            </Animated.View>
          ) : null}

          <View style={styles.joinSection}>
            <View style={styles.inputContainer}>
              <Animated.View style={{ transform: [{ scale: inputScale }] }}>
                <TextInput
                  style={[
                    styles.codeInput,
                    joinCode.length === 6 && styles.codeInputValid,
                  ]}
                  value={joinCode}
                  onChangeText={(text) =>
                    setJoinCode(text.replace(/[^0-9]/g, "").slice(0, 6))
                  }
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  keyboardType="numeric"
                  maxLength={6}
                  placeholder="Enter 6-digit code"
                  placeholderTextColor="#94A3B8"
                />
              </Animated.View>

              {joinCode.length > 0 && (
                <View style={styles.validationContainer}>
                  <ThemedText
                    style={[
                      styles.validationText,
                      joinCode.length === 6
                        ? styles.validText
                        : styles.invalidText,
                    ]}
                  >
                    {joinCode.length === 6
                      ? "✅ Valid code format"
                      : `${joinCode.length}/6 digits entered`}
                  </ThemedText>
                </View>
              )}
            </View>

            <Animated.View style={{ transform: [{ scale: buttonHoverAnim }] }}>
              <TouchableOpacity
                style={[
                  styles.joinButton,
                  joinCode.length === 6
                    ? styles.joinButtonActive
                    : styles.joinButtonDisabled,
                ]}
                onPress={handleJoin}
                disabled={joinCode.length !== 6}
                activeOpacity={0.9}
              >
                <ThemedText style={styles.joinButtonText}>
                  {joinCode.length === 6
                    ? "🚀 Join Session"
                    : "Enter Code to Join"}
                </ThemedText>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "#fff",
    width: "100%",
    maxWidth: 380,
    borderRadius: 24,
    padding: 28,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 20,
    elevation: 8,
  },
  logoContainer: {
    marginBottom: 16,
    alignItems: "center",
  },
  logoGlow: {
    backgroundColor: "#fff",
    borderRadius: 50,
    padding: 12,
    shadowColor: "#2563EB",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 6,
  },
  logo: {
    width: 80,
    height: 80,
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: 26,
  },
  appTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1E293B",
    marginBottom: 12,
    textAlign: "center",
  },
  badgeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 6,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "600",
  },
  secureBadge: {
    backgroundColor: "#FEF3F2",
    borderColor: "#FECACA",
  },
  secureBadgeText: {
    color: "#DC2626",
  },
  privateBadge: {
    backgroundColor: "#F0F9FF",
    borderColor: "#BAE6FD",
  },
  privateBadgeText: {
    color: "#0284C7",
  },
  encryptedBadge: {
    backgroundColor: "#F0FDF4",
    borderColor: "#BBF7D0",
  },
  encryptedBadgeText: {
    color: "#16A34A",
  },
  primaryButton: {
    backgroundColor: "#2563EB",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    width: "100%",
    marginBottom: 20,
    shadowColor: "#2563EB",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 6,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  codeContainer: {
    backgroundColor: "#F8FAFC",
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
    marginBottom: 24,
    width: "100%",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  codeLabel: {
    fontSize: 13,
    color: "#475569",
    marginBottom: 8,
    fontWeight: "600",
  },
  codeText: {
    fontSize: 28,
    fontWeight: "800",
    color: "#2563EB",
    letterSpacing: 4,
    marginBottom: 12,
  },
  codeWrapper: {
    alignItems: "center",
    position: "relative",
  },
  copyHint: {
    marginTop: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: "#E2E8F0",
    borderRadius: 8,
  },
  copyHintText: {
    fontSize: 10,
    color: "#64748B",
    fontWeight: "500",
  },
  progressContainer: {
    width: "100%",
    alignItems: "center",
  },
  progressBar: {
    width: "100%",
    height: 4,
    backgroundColor: "#E2E8F0",
    borderRadius: 2,
    marginBottom: 6,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#DC2626",
    borderRadius: 2,
  },
  timerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  timerText: {
    fontSize: 12,
    color: "#DC2626",
    fontWeight: "600",
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#22C55E",
    shadowColor: "#22C55E",
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 4,
    elevation: 2,
  },
  joinSection: {
    width: "100%",
  },
  inputContainer: {
    marginBottom: 16,
  },
  codeInput: {
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 14,
    padding: 16,
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    color: "#0F172A",
    backgroundColor: "#fff",
    letterSpacing: 1,
  },
  codeInputValid: {
    borderColor: "#2563EB",
    backgroundColor: "#F0F7FF",
  },
  validationContainer: {
    alignItems: "center",
    marginTop: 6,
  },
  validationText: {
    fontSize: 11,
    fontWeight: "600",
  },
  validText: {
    color: "#2563EB",
  },
  invalidText: {
    color: "#94A3B8",
  },
  joinButton: {
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  joinButtonActive: {
    backgroundColor: "#2563EB",
    shadowColor: "#2563EB",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 6,
  },
  joinButtonDisabled: {
    backgroundColor: "#93C5FD",
  },
  joinButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
});
