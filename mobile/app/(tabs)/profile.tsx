import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
  Animated,
  Easing,
} from "react-native";
import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";
import { ProfileServices } from "@/services/ProfileServices";
import { Fonts } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

// Define TypeScript interfaces
interface User {
  id: number;
  email: string;
  role: string;
  email_verified_at: string | null;
  created_at: string;
}

interface Company {
  name_of_company: string;
  first_name: string;
  last_name: string;
  phone_number: string;
}

interface Profile {
  user_id: number;
  first_name: string;
  last_name: string;
  date_of_birth: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  postal_code: string | null;
  country: string | null;
  user: User;
  company: Company | null;
  created_at: string;
}

interface InfoRowProps {
  label: string;
  value: string | null;
  icon: React.ReactNode;
  isLast?: boolean;
  valueColor?: string;
}

export default function ProfileScreen() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(50))[0];

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await ProfileServices.getProfile();
      if (res.success && res.data) {
        setProfile(res.data);
        // Animate content in
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 500,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
        ]).start();
      } else {
        setError(res.message || "Failed to load profile");
      }
    } catch (err) {
      setError("An error occurred while loading profile");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    // Reset animations for refresh
    fadeAnim.setValue(0);
    slideAnim.setValue(50);
    loadProfile();
  };

  if (loading && !refreshing) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2565F0" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.errorContainer}>
        <View style={styles.errorIconContainer}>
          <Ionicons name="alert-circle-outline" size={48} color="#ef4444" />
        </View>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadProfile}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  if (!profile) {
    return (
      <ThemedView style={styles.errorContainer}>
        <View style={styles.errorIconContainer}>
          <Ionicons name="person-outline" size={48} color="#64748b" />
        </View>
        <Text style={styles.errorText}>No profile data found</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadProfile}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      showsVerticalScrollIndicator={false}
    >
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {/* Header Section with Gradient */}
        <LinearGradient
          colors={["#2565F0", "#1a56db"]}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={32} color="#fff" />
            </View>
            {profile.user?.email_verified_at && (
              <View style={styles.verifiedBadge}>
                <Ionicons name="checkmark" size={14} color="#fff" />
              </View>
            )}
          </View>
          <Text style={styles.name}>
            {profile.first_name} {profile.last_name}
          </Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>
              {profile.user?.role?.toUpperCase()}
            </Text>
          </View>
          <Text style={styles.email}>{profile.user?.email}</Text>
        </LinearGradient>

        {/* Personal Information Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="person-outline" size={20} color="#2565F0" />
            <Text style={styles.sectionTitle}>Personal Information</Text>
          </View>
          <View style={styles.infoCard}>
            <InfoRow
              label="First Name"
              value={profile.first_name}
              icon={
                <Ionicons name="person-outline" size={16} color="#2565F0" />
              }
            />
            <InfoRow
              label="Last Name"
              value={profile.last_name}
              icon={
                <Ionicons name="person-outline" size={16} color="#2565F0" />
              }
            />
            <InfoRow
              label="Date of Birth"
              value={formatDate(profile.date_of_birth)}
              icon={
                <Ionicons name="calendar-outline" size={16} color="#2565F0" />
              }
            />
            <InfoRow
              label="Phone"
              value={profile.phone}
              icon={<Ionicons name="call-outline" size={16} color="#2565F0" />}
              isLast={true}
            />
          </View>
        </View>

        {/* Address Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="location-outline" size={20} color="#2565F0" />
            <Text style={styles.sectionTitle}>Address</Text>
          </View>
          <View style={styles.infoCard}>
            <InfoRow
              label="Address"
              value={profile.address}
              icon={<Ionicons name="home-outline" size={16} color="#2565F0" />}
            />
            <InfoRow
              label="City"
              value={profile.city}
              icon={
                <Ionicons name="business-outline" size={16} color="#2565F0" />
              }
            />
            <InfoRow
              label="Postal Code"
              value={profile.postal_code}
              icon={<Ionicons name="mail-outline" size={16} color="#2565F0" />}
            />
            <InfoRow
              label="Country"
              value={profile.country}
              icon={<Ionicons name="earth-outline" size={16} color="#2565F0" />}
              isLast={true}
            />
          </View>
        </View>

        {/* Company Information */}
        {profile.company && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="business-outline" size={20} color="#2565F0" />
              <Text style={styles.sectionTitle}>Company Information</Text>
            </View>
            <View style={styles.infoCard}>
              <InfoRow
                label="Company"
                value={profile.company.name_of_company}
                icon={
                  <Ionicons name="business-outline" size={16} color="#2565F0" />
                }
              />
              <InfoRow
                label="Contact"
                value={`${profile.company.first_name} ${profile.company.last_name}`}
                icon={
                  <Ionicons name="people-outline" size={16} color="#2565F0" />
                }
              />
              <InfoRow
                label="Company Phone"
                value={profile.company.phone_number}
                icon={
                  <Ionicons name="call-outline" size={16} color="#2565F0" />
                }
                isLast={true}
              />
            </View>
          </View>
        )}

        {/* Account Information */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="lock-closed-outline" size={20} color="#2565F0" />
            <Text style={styles.sectionTitle}>Account Information</Text>
          </View>
          <View style={styles.infoCard}>
            <InfoRow
              label="User ID"
              value={profile.user_id.toString()}
              icon={<Ionicons name="key-outline" size={16} color="#2565F0" />}
            />
            <InfoRow
              label="Email Verified"
              value={profile.user?.email_verified_at ? "Yes" : "No"}
              valueColor={
                profile.user?.email_verified_at ? "#10b981" : "#ef4444"
              }
              icon={
                <Ionicons
                  name="checkmark-circle-outline"
                  size={16}
                  color="#2565F0"
                />
              }
            />
            <InfoRow
              label="Member Since"
              value={formatDate(profile.created_at)}
              icon={<Ionicons name="time-outline" size={16} color="#2565F0" />}
              isLast={true}
            />
          </View>
        </View>
      </Animated.View>
    </ScrollView>
  );
}

const InfoRow = ({
  label,
  value,
  icon,
  isLast = false,
  valueColor,
}: InfoRowProps) => (
  <View style={[styles.infoRow, isLast && styles.infoRowLast]}>
    <View style={styles.infoIcon}>{icon}</View>
    <View style={styles.infoContent}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={[styles.infoValue, valueColor ? { color: valueColor } : {}]}>
        {value || "Not provided"}
      </Text>
    </View>
  </View>
);

const formatDate = (dateString: string | null) => {
  if (!dateString) return "Not provided";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFCFF",
  },
  content: {
    paddingBottom: 30,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FAFCFF",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#334155",
    fontFamily: "Inter",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FAFCFF",
    padding: 20,
  },
  errorIconContainer: {
    marginBottom: 16,
  },
  errorText: {
    fontSize: 16,
    color: "#334155",
    textAlign: "center",
    marginBottom: 24,
    fontFamily: "Inter",
  },
  retryButton: {
    backgroundColor: "#2565F0",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    shadowColor: "#2565F0",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "Inter",
  },
  header: {
    alignItems: "center",
    padding: 24,
    paddingTop: 40,
    marginBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  avatarContainer: {
    marginBottom: 16,
    position: "relative",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  verifiedBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#10b981",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 6,
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    fontFamily: "Inter",
  },
  roleBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  roleText: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "600",
    fontFamily: "Inter",
  },
  email: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
    fontFamily: "Inter",
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 10,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#000",
    fontFamily: "Inter",
  },
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#DBEAFE",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  infoRowLast: {
    borderBottomWidth: 0,
  },
  infoIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#DBEAFE",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 13,
    fontWeight: "500",
    color: "#64748b",
    marginBottom: 2,
    fontFamily: "Inter",
  },
  infoValue: {
    fontSize: 15,
    color: "#334155",
    fontFamily: "Inter",
  },
});
