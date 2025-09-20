import React, { useState, useRef } from "react";
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
  Linking,
  Platform,
} from "react-native";
import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

// Define TypeScript interfaces
interface Constat {
  id: number;
  title: string;
  date: string;
  file_name: string;
  file_url: string;
  file_size: string;
  vehicle_info: string;
  status:
    | "pending"
    | "submitted"
    | "processing"
    | "approved"
    | "rejected"
    | "paid"
    | "archived";
}

interface ConstatCardProps {
  constat: Constat;
  index: number;
  onPress: () => void;
}

// Status configuration with colors and icons
const STATUS_CONFIG = {
  pending: {
    label: "Pending",
    color: "#FF9500",
    bgColor: "#FFF4E5",
    icon: "time-outline",
  },
  submitted: {
    label: "Submitted",
    color: "#007AFF",
    bgColor: "#E6F2FF",
    icon: "paper-plane-outline",
  },
  processing: {
    label: "Processing",
    color: "#5856D6",
    bgColor: "#F0EFFF",
    icon: "sync-outline",
  },
  approved: {
    label: "Approved",
    color: "#34C759",
    bgColor: "#E8F8ED",
    icon: "checkmark-circle-outline",
  },
  rejected: {
    label: "Rejected",
    color: "#FF3B30",
    bgColor: "#FFEBE9",
    icon: "close-circle-outline",
  },
  paid: {
    label: "Paid",
    color: "#34C759",
    bgColor: "#E8F8ED",
    icon: "cash-outline",
  },
  archived: {
    label: "Archived",
    color: "#8E8E93",
    bgColor: "#F2F2F7",
    icon: "archive-outline",
  },
};

// Mock data for demonstration
const MOCK_CONSTATS: Constat[] = [
  {
    id: 1,
    title: "Accident Report - Highway 40",
    date: "2023-10-15T14:30:00Z",
    file_name: "accident_report_1015.pdf",
    file_url: "https://example.com/report1.pdf",
    file_size: "2.4 MB",
    vehicle_info: "Toyota Corolla - BMW X5",
    status: "paid",
  },
  {
    id: 2,
    title: "Parking Incident - Downtown",
    date: "2023-09-22T09:15:00Z",
    file_name: "parking_incident_0922.pdf",
    file_url: "https://example.com/report2.pdf",
    file_size: "1.8 MB",
    vehicle_info: "Honda Civic - Ford Focus",
    status: "rejected",
  },
  {
    id: 3,
    title: "Minor Collision - Shopping Mall",
    date: "2023-08-05T16:45:00Z",
    file_name: "mall_collision_0805.pdf",
    file_url: "https://example.com/report3.pdf",
    file_size: "3.1 MB",
    vehicle_info: "Volkswagen Golf - Nissan Altima",
    status: "processing",
  },
  {
    id: 4,
    title: "Rear-end Collision - Main Street",
    date: "2023-11-10T08:20:00Z",
    file_name: "rear_end_1110.pdf",
    file_url: "https://example.com/report4.pdf",
    file_size: "2.1 MB",
    vehicle_info: "Ford F-150 - Toyota Camry",
    status: "approved",
  },
  {
    id: 5,
    title: "Side Impact - Intersection",
    date: "2023-07-18T17:30:00Z",
    file_name: "side_impact_0718.pdf",
    file_url: "https://example.com/report5.pdf",
    file_size: "2.9 MB",
    vehicle_info: "Chevrolet Malibu - Honda CR-V",
    status: "submitted",
  },
];

export default function PastConstat() {
  const [constats, setConstats] = useState<Constat[]>(MOCK_CONSTATS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<string | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  const loadConstats = async () => {
    try {
      setLoading(true);
      setError(null);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

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
    } catch (err) {
      setError("An error occurred while loading constats");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  React.useEffect(() => {
    loadConstats();
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Reset animations for refresh
    fadeAnim.setValue(0);
    slideAnim.setValue(30);
    loadConstats();
  }, []);

  const handleOpenPdf = async (url: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        setError("Cannot open PDF file");
      }
    } catch (error) {
      setError("Failed to open PDF file");
    }
  };

  const filteredConstats = filter
    ? constats.filter((constat) => constat.status === filter)
    : constats;

  const statusCounts = constats.reduce((acc, constat) => {
    acc[constat.status] = (acc[constat.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  if (loading && !refreshing) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading your constats...</Text>
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.centerContainer}>
        <View style={styles.errorIconContainer}>
          <Ionicons name="alert-circle-outline" size={64} color="#FF3B30" />
        </View>
        <Text style={styles.errorTitle}>Something went wrong</Text>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadConstats}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  if (!constats || constats.length === 0) {
    return (
      <ThemedView style={styles.centerContainer}>
        <View style={styles.emptyIconContainer}>
          <Ionicons name="document-outline" size={64} color="#C5C5C7" />
        </View>
        <Text style={styles.emptyTitle}>No constats found</Text>
        <Text style={styles.emptyText}>
          You don't have any past constats yet.{"\n"}
          They will appear here once you create them.
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadConstats}>
          <Text style={styles.retryButtonText}>Refresh</Text>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#007AFF"]}
            tintColor="#007AFF"
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
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
            colors={["#007AFF", "#0055D4"]}
            style={styles.header}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <View style={styles.headerContent}>
              <View style={styles.headerIconContainer}>
                <Ionicons name="document-text" size={32} color="#fff" />
              </View>
              <Text style={styles.headerTitle}>Past Constats</Text>
              <Text style={styles.headerSubtitle}>
                {constats.length} document{constats.length !== 1 ? "s" : ""}{" "}
                available
              </Text>
            </View>
          </LinearGradient>

          {/* Status Filter Bar */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filterContainer}
            contentContainerStyle={styles.filterContent}
          >
            <TouchableOpacity
              style={[styles.filterPill, !filter && styles.filterPillActive]}
              onPress={() => setFilter(null)}
            >
              <Text
                style={[styles.filterText, !filter && styles.filterTextActive]}
              >
                All ({constats.length})
              </Text>
            </TouchableOpacity>

            {Object.entries(STATUS_CONFIG).map(([key, config]) => (
              <TouchableOpacity
                key={key}
                style={[
                  styles.filterPill,
                  filter === key && styles.filterPillActive,
                  {
                    backgroundColor:
                      filter === key ? config.color : config.bgColor,
                  },
                ]}
                onPress={() => setFilter(filter === key ? null : key)}
              >
                <Ionicons
                  name={config.icon as any}
                  size={14}
                  color={filter === key ? "#fff" : config.color}
                  style={styles.filterIcon}
                />
                <Text
                  style={[
                    styles.filterText,
                    filter === key && styles.filterTextActive,
                    { color: filter === key ? "#fff" : config.color },
                  ]}
                >
                  {config.label} ({statusCounts[key] || 0})
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Constats List */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="list" size={22} color="#007AFF" />
              <Text style={styles.sectionTitle}>
                {filter
                  ? STATUS_CONFIG[filter as keyof typeof STATUS_CONFIG].label
                  : "All"}{" "}
                Constats
              </Text>
            </View>
            <View style={styles.constatsList}>
              {filteredConstats.map((constat, index) => (
                <ConstatCard
                  key={constat.id}
                  constat={constat}
                  index={index}
                  onPress={() => handleOpenPdf(constat.file_url)}
                />
              ))}
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const ConstatCard = ({ constat, index, onPress }: ConstatCardProps) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const statusConfig = STATUS_CONFIG[constat.status];

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={styles.constatCard}
        activeOpacity={0.9}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <View
          style={[
            styles.constatIconContainer,
            { backgroundColor: statusConfig.bgColor },
          ]}
        >
          <Ionicons name="document-text" size={24} color={statusConfig.color} />
        </View>

        <View style={styles.constatContent}>
          <Text style={styles.constatTitle} numberOfLines={1}>
            {constat.title || constat.file_name}
          </Text>
          <Text style={styles.constatSubtitle} numberOfLines={1}>
            {constat.vehicle_info}
          </Text>

          <View style={styles.constatMeta}>
            <View style={styles.metaItem}>
              <Ionicons name="calendar-outline" size={14} color="#8E8E93" />
              <Text style={styles.metaText}>{formatDate(constat.date)}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="document-outline" size={14} color="#8E8E93" />
              <Text style={styles.metaText}>{constat.file_size}</Text>
            </View>
          </View>
        </View>

        <View style={styles.statusContainer}>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: statusConfig.bgColor },
            ]}
          >
            <Ionicons
              name={statusConfig.icon as any}
              size={12}
              color={statusConfig.color}
              style={styles.statusIcon}
            />
            <Text style={[styles.statusText, { color: statusConfig.color }]}>
              {statusConfig.label}
            </Text>
          </View>

          <View style={styles.constatAction}>
            <Ionicons name="download-outline" size={22} color="#007AFF" />
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const formatDate = (dateString: string | null) => {
  if (!dateString) return "Unknown date";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F2F2F7",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F2F2F7",
    padding: 24,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#8E8E93",
    fontFamily: "System",
    fontWeight: "500",
  },
  errorIconContainer: {
    marginBottom: 16,
    opacity: 0.8,
  },
  emptyIconContainer: {
    marginBottom: 16,
    opacity: 0.5,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
    marginBottom: 8,
    textAlign: "center",
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
    marginBottom: 8,
    textAlign: "center",
  },
  errorText: {
    fontSize: 16,
    color: "#8E8E93",
    textAlign: "center",
    marginBottom: 24,
    fontFamily: "System",
    lineHeight: 22,
  },
  emptyText: {
    fontSize: 16,
    color: "#8E8E93",
    textAlign: "center",
    marginBottom: 24,
    fontFamily: "System",
    lineHeight: 22,
  },
  retryButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: "#007AFF",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "System",
  },
  header: {
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  headerContent: {
    alignItems: "center",
  },
  headerIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 6,
    fontFamily: "System",
  },
  headerSubtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.85)",
    fontFamily: "System",
  },
  filterContainer: {
    marginTop: 16,
    marginHorizontal: 16,
    maxHeight: 40,
  },
  filterContent: {
    paddingVertical: 4,
    gap: 8,
  },
  filterPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "#E5E5EA",
  },
  filterPillActive: {
    backgroundColor: "#007AFF",
  },
  filterIcon: {
    marginRight: 4,
  },
  filterText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#8E8E93",
  },
  filterTextActive: {
    color: "#fff",
  },
  section: {
    marginTop: 24,
    marginHorizontal: 16,
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000",
    fontFamily: "System",
  },
  constatsList: {
    gap: 16,
  },
  constatCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.05)",
  },
  constatIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  constatContent: {
    flex: 1,
  },
  constatTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
    fontFamily: "System",
  },
  constatSubtitle: {
    fontSize: 15,
    color: "#8E8E93",
    marginBottom: 10,
    fontFamily: "System",
  },
  constatMeta: {
    flexDirection: "row",
    gap: 16,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  metaText: {
    fontSize: 13,
    color: "#8E8E93",
    fontFamily: "System",
  },
  statusContainer: {
    alignItems: "flex-end",
    gap: 8,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusIcon: {
    marginRight: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    fontFamily: "System",
  },
  constatAction: {
    padding: 8,
  },
});
