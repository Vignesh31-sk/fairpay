import { ThemedView } from "@/components/ThemedView";
import { LucideIcon } from "@/components/ui/LucideIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useVoiceProcessing } from "@/hooks/useVoiceProcessing";
import { router } from "expo-router";
import React from "react";
import { Alert, Dimensions, ScrollView, StyleSheet, View } from "react-native";
import { Avatar, Card, Text } from "react-native-paper";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const insets = useSafeAreaInsets();
  
  const {
    isListening,
    transcript,
    isProcessing,
    startListening,
    stopListening,
  } = useVoiceProcessing();

  // Mock user data - in real app this would come from user context/state
  const userName = "John"; // This should be dynamic based on logged-in user
  const currentTime = new Date();
  const isMorning = currentTime.getHours() < 12;
  const isAfternoon = currentTime.getHours() >= 12 && currentTime.getHours() < 17;
  const isEvening = currentTime.getHours() >= 17;

  let greeting = "Good morning";
  if (isAfternoon) greeting = "Good afternoon";
  if (isEvening) greeting = "Good evening";

  // Mock attendance data
  const attendanceData = {
    isWorking: true,
    startTime: "09:00 AM",
    currentTime: "02:30 PM",
    totalHours: "5h 30m",
  };

  // Mock wallet data
  const walletData = {
    balance: "₹2,450",
    thisMonth: "₹8,200",
    pending: "₹1,800",
  };

  // Mock recommended jobs
  const recommendedJobs = [
    {
      id: 1,
      title: "Delivery Partner",
      company: "FoodCorp",
      location: "Mumbai Central",
      pay: "₹200/hr",
      duration: "4 hours",
      rating: 4.5,
    },
    {
      id: 2,
      title: "Warehouse Assistant",
      company: "LogiTech",
      location: "Andheri West",
      pay: "₹180/hr",
      duration: "6 hours",
      rating: 4.2,
    },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top', 'bottom']}>
      <ThemedView style={[styles.container, { paddingBottom: insets.bottom }]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTop}>
              <View>
                <Text variant="headlineSmall" style={[styles.headerTitle, { color: colors.text }]}>
                  {greeting}, {userName}
                </Text>
                <Text variant="titleMedium" style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
                  Welcome to FairPay
                </Text>
              </View>
              <Avatar.Icon 
                size={40} 
                icon="bell" 
                style={{ backgroundColor: colors.backgroundSecondary }}
                color={colors.text}
                onTouchEnd={() => router.push("/(tabs)/notifications")}
              />
            </View>
          </View>

          {/* Attendance and Wallet Cards */}
          <View style={styles.cardsContainer}>
            {/* Attendance Card */}
            <Card style={[styles.infoCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
              <Card.Content style={styles.infoCardContent}>
                <View style={styles.cardHeader}>
                  <LucideIcon size={20} name="clock" color={colors.primary} />
                  <Text variant="titleSmall" style={[styles.cardTitle, { color: colors.text }]}>
                    Attendance
                  </Text>
                </View>
                <View style={styles.attendanceInfo}>
                  <Text variant="bodyLarge" style={[styles.attendanceStatus, { color: attendanceData.isWorking ? colors.success : colors.textSecondary }]}>
                    {attendanceData.isWorking ? "🟢 Working" : "⚪ Not Working"}
                  </Text>
                  <Text variant="bodyMedium" style={[styles.attendanceTime, { color: colors.textSecondary }]}>
                    {attendanceData.startTime} - {attendanceData.currentTime}
                  </Text>
                  <Text variant="titleMedium" style={[styles.attendanceHours, { color: colors.primary }]}>
                    {attendanceData.totalHours}
                  </Text>
                </View>
              </Card.Content>
            </Card>

            {/* Wallet Card */}
            <Card style={[styles.infoCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
              <Card.Content style={styles.infoCardContent}>
                <View style={styles.cardHeader}>
                  <LucideIcon size={20} name="wallet" color={colors.secondary} />
                  <Text variant="titleSmall" style={[styles.cardTitle, { color: colors.text }]}>
                    Wallet
                  </Text>
                </View>
                <View style={styles.walletInfo}>
                  <Text variant="bodyLarge" style={[styles.walletBalance, { color: colors.text }]}>
                    {walletData.balance}
                  </Text>
                  <Text variant="bodySmall" style={[styles.walletSubtitle, { color: colors.textSecondary }]}>
                    This month: {walletData.thisMonth}
                  </Text>
                  <Text variant="bodySmall" style={[styles.walletPending, { color: colors.accent }]}>
                    Pending: {walletData.pending}
                  </Text>
                </View>
              </Card.Content>
            </Card>
          </View>

          {/* Help & Support Card */}
          <Card 
            style={[styles.supportCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
            onPress={() => router.push("/(tabs)/grievance")}
          >
            <Card.Content style={styles.supportCardContent}>
              <View style={styles.supportHeader}>
                <LucideIcon size={24} name="help-circle" color={colors.warning} />
                <Text variant="titleMedium" style={[styles.supportTitle, { color: colors.text }]}>
                  Help & Support
                </Text>
              </View>
              <Text variant="bodyMedium" style={[styles.supportSubtitle, { color: colors.textSecondary }]}>
                Get help with your account, payments, or report issues
              </Text>
              <View style={styles.supportActions}>
                <View style={styles.supportAction}>
                  <LucideIcon size={16} name="message-circle" color={colors.primary} />
                  <Text variant="bodySmall" style={[styles.supportActionText, { color: colors.primary }]}>
                    Contact Support
                  </Text>
                </View>
                <View style={styles.supportAction}>
                  <LucideIcon size={16} name="file-text" color={colors.secondary} />
                  <Text variant="bodySmall" style={[styles.supportActionText, { color: colors.secondary }]}>
                    Report Issue
                  </Text>
                </View>
              </View>
            </Card.Content>
          </Card>

          {/* Recommended Jobs Section */}
          <View style={styles.recommendedContainer}>
            <Text variant="titleMedium" style={[styles.sectionTitle, { color: colors.text }]}>
              Recommended Jobs
            </Text>
            <View style={styles.jobsList}>
              {recommendedJobs.map((job, index) => (
                <Card 
                  key={job.id} 
                  style={[styles.jobCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
                  onPress={() => Alert.alert("Job Details", `Apply for ${job.title} at ${job.company}`)}
                >
                  <Card.Content style={styles.jobCardContent}>
                    <View style={styles.jobHeader}>
                      <View>
                        <Text variant="titleSmall" style={[styles.jobTitle, { color: colors.text }]}>
                          {job.title}
                        </Text>
                        <Text variant="bodyMedium" style={[styles.jobCompany, { color: colors.textSecondary }]}>
                          {job.company}
                        </Text>
                      </View>
                      <View style={[styles.jobPay, { backgroundColor: colors.primary + '20' }]}>
                        <Text variant="bodySmall" style={[styles.jobPayText, { color: colors.primary }]}>
                          {job.pay}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.jobDetails}>
                      <View style={styles.jobDetail}>
                        <LucideIcon size={16} name="map-pin" color={colors.textSecondary} />
                        <Text variant="bodySmall" style={[styles.jobDetailText, { color: colors.textSecondary }]}>
                          {job.location}
                        </Text>
                      </View>
                      <View style={styles.jobDetail}>
                        <LucideIcon size={16} name="clock" color={colors.textSecondary} />
                        <Text variant="bodySmall" style={[styles.jobDetailText, { color: colors.textSecondary }]}>
                          {job.duration}
                        </Text>
                      </View>
                      <View style={styles.jobDetail}>
                        <LucideIcon size={16} name="star" color={colors.accent} />
                        <Text variant="bodySmall" style={[styles.jobDetailText, { color: colors.textSecondary }]}>
                          {job.rating}
                        </Text>
                      </View>
                    </View>
                  </Card.Content>
                </Card>
              ))}
            </View>
          </View>
        </ScrollView>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontWeight: '600',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontWeight: '400',
  },
  cardsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 24,
    gap: 12,
  },
  infoCard: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  infoCardContent: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontWeight: '600',
    marginLeft: 8,
  },
  attendanceInfo: {
    alignItems: 'center',
  },
  attendanceStatus: {
    fontWeight: '600',
    marginBottom: 4,
  },
  attendanceTime: {
    marginBottom: 8,
  },
  attendanceHours: {
    fontWeight: '700',
  },
  walletInfo: {
    alignItems: 'center',
  },
  walletBalance: {
    fontWeight: '700',
    fontSize: 20,
    marginBottom: 4,
  },
  walletSubtitle: {
    marginBottom: 4,
  },
  walletPending: {
    fontWeight: '500',
  },
  supportCard: {
    marginHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    marginBottom: 24,
  },
  supportCardContent: {
    padding: 16,
  },
  supportHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  supportTitle: {
    fontWeight: '600',
    marginLeft: 8,
  },
  supportSubtitle: {
    marginBottom: 16,
  },
  supportActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  supportAction: {
    alignItems: 'center',
  },
  supportActionText: {
    fontWeight: '500',
    marginTop: 4,
  },
  recommendedContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontWeight: '600',
    marginBottom: 16,
  },
  jobsList: {
    gap: 12,
  },
  jobCard: {
    borderRadius: 12,
    borderWidth: 1,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  jobCardContent: {
    padding: 16,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  jobTitle: {
    fontWeight: '600',
    marginBottom: 4,
  },
  jobCompany: {
    fontWeight: '400',
  },
  jobPay: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  jobPayText: {
    fontWeight: '600',
  },
  jobDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  jobDetail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  jobDetailText: {
    marginLeft: 4,
  },

});
