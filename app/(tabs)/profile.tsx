import { ThemedView } from "@/components/ThemedView";
import { LucideIcon } from "@/components/ui/LucideIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import React, { useState } from "react";
import { Alert, Dimensions, Modal, ScrollView, StyleSheet, View } from "react-native";
import { Avatar, Card, Divider, Text } from "react-native-paper";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const insets = useSafeAreaInsets();
  const [isUserModalVisible, setIsUserModalVisible] = useState(false);

  // Dummy user data
  const user = {
    name: "राहुल शर्मा (Rahul Sharma)",
    phone: "+91 98765 43210",
    email: "rahul.sharma@email.com",
    location: "Mumbai, Maharashtra",
    profession: "Electrician",
    experience: "5 years",
    rating: "4.5/5",
    completedJobs: 156,
    totalEarnings: "₹2,45,000",
    joinDate: "January 2020",
    skills: ["Electrical Wiring", "Circuit Repair", "Installation", "Maintenance"],
    certifications: ["Licensed Electrician", "Safety Certified", "Advanced Wiring"],
  };

  // Mock attendance data for the week
  const attendanceData = [
    { day: "Mon", hours: 8, change: -2, isPositive: false },
    { day: "Tue", hours: 9, change: 4, isPositive: true },
    { day: "Wed", hours: 7, change: 2, isPositive: true },
    { day: "Thu", hours: 6, change: -3, isPositive: false },
    { day: "Fri", hours: 10, change: 4, isPositive: true },
    { day: "Sat", hours: 5, change: -2, isPositive: false },
    { day: "Sun", hours: 8, change: 1, isPositive: true },
  ];

  const maxHours = Math.max(...attendanceData.map(item => item.hours));

  const menuItems = [
    {
      title: "Personal Information",
      subtitle: "Edit your profile details",
      icon: "person.fill",
      color: colors.primary,
    },
    {
      title: "Work History",
      subtitle: "View your job history",
      icon: "clock.fill",
      color: colors.secondary,
    },
    {
      title: "Earnings & Payments",
      subtitle: "Manage your payments",
      icon: "indianrupeesign.circle.fill",
      color: colors.success,
    },
    {
      title: "Documents",
      subtitle: "Upload certificates & IDs",
      icon: "doc.fill",
      color: colors.accent,
    },
    {
      title: "Settings",
      subtitle: "App preferences & security",
      icon: "gearshape.fill",
      color: colors.textSecondary,
    },
    {
      title: "Help & Support",
      subtitle: "Get help and contact support",
      icon: "questionmark.circle.fill",
      color: colors.warning,
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
                  Profile
                </Text>
                <Text variant="titleMedium" style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
                  Manage your account
                </Text>
              </View>
              <Avatar.Icon 
                size={40} 
                icon="bell-outline" 
                style={{ backgroundColor: colors.backgroundSecondary }}
                color={colors.icon}
              />
            </View>
          </View>

          {/* Profile Card - Clickable */}
          <Card 
            style={[styles.profileCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
            onPress={() => setIsUserModalVisible(true)}
          >
            <Card.Content style={styles.profileCardContent}>
              <View style={styles.profileHeader}>
                <Avatar.Text 
                  size={80} 
                  label="RS" 
                  style={{ backgroundColor: colors.primary }}
                  labelStyle={{ color: colors.card, fontWeight: '600' }}
                />
                <View style={styles.userInfo}>
                  <Text variant="headlineSmall" style={[styles.name, { color: colors.text }]}>
                    {user.name}
                  </Text>
                  <View style={styles.professionRow}>
                    <LucideIcon size={16} name="wrench.fill" color={colors.primary} />
                    <Text variant="titleMedium" style={[styles.profession, { color: colors.primary }]}>
                      {user.profession}
                    </Text>
                  </View>
                  <View style={styles.locationRow}>
                    <LucideIcon size={16} name="location.fill" color={colors.textSecondary} />
                    <Text variant="bodyMedium" style={[styles.location, { color: colors.textSecondary }]}>
                      {user.location}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Stats Row */}
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text variant="titleLarge" style={[styles.statNumber, { color: colors.success }]}>
                    {user.completedJobs}
                  </Text>
                  <Text variant="bodySmall" style={[styles.statLabel, { color: colors.textSecondary }]}>
                    Jobs Completed
                  </Text>
                </View>
                <View style={[styles.statDivider, { backgroundColor: colors.cardBorder }]} />
                <View style={styles.statItem}>
                  <Text variant="titleLarge" style={[styles.statNumber, { color: colors.primary }]}>
                    {user.rating}
                  </Text>
                  <Text variant="bodySmall" style={[styles.statLabel, { color: colors.textSecondary }]}>
                    Rating
                  </Text>
                </View>
                <View style={[styles.statDivider, { backgroundColor: colors.cardBorder }]} />
                <View style={styles.statItem}>
                  <Text variant="titleLarge" style={[styles.statNumber, { color: colors.accent }]}>
                    {user.experience}
                  </Text>
                  <Text variant="bodySmall" style={[styles.statLabel, { color: colors.textSecondary }]}>
                    Experience
                  </Text>
                </View>
              </View>
            </Card.Content>
          </Card>

          {/* Attendance Section */}
          <View style={styles.attendanceContainer}>
            <View style={styles.attendanceHeader}>
              <Text variant="titleMedium" style={[styles.sectionTitle, { color: colors.text }]}>
                Attendance
              </Text>
              <Text variant="bodyMedium" style={[styles.timeFilter, { color: colors.textSecondary }]}>
                Last week
              </Text>
            </View>
            <View style={styles.chartContainer}>
              {attendanceData.map((item, index) => (
                <View key={index} style={styles.chartColumn}>
                  <View style={styles.changeIndicator}>
                    <Text variant="bodySmall" style={[
                      styles.changeText, 
                      { color: item.isPositive ? colors.success : colors.error }
                    ]}>
                      {item.isPositive ? '+' : ''}{item.change}%
                    </Text>
                  </View>
                  <View 
                    style={[
                      styles.bar, 
                      { 
                        height: (item.hours / maxHours) * 80,
                        backgroundColor: colors.textSecondary + '30'
                      }
                    ]} 
                  />
                  <Text variant="bodySmall" style={[styles.dayLabel, { color: colors.textSecondary }]}>
                    {item.day}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Skills & Certifications */}
          <Card style={[styles.skillsCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
            <Card.Content>
              <Text variant="titleMedium" style={[styles.sectionTitle, { color: colors.text }]}>
                Skills & Certifications
              </Text>
              
              <View style={styles.skillsSection}>
                <Text variant="bodyMedium" style={[styles.skillsLabel, { color: colors.textSecondary }]}>
                  Skills
                </Text>
                <View style={styles.skillsList}>
                  {user.skills.map((skill, index) => (
                    <View key={index} style={[styles.skillChip, { backgroundColor: colors.primary + '20' }]}>
                      <Text variant="bodySmall" style={[styles.skillText, { color: colors.primary }]}>
                        {skill}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>

              <Divider style={[styles.divider, { backgroundColor: colors.cardBorder }]} />

              <View style={styles.certificationsSection}>
                <Text variant="bodyMedium" style={[styles.skillsLabel, { color: colors.textSecondary }]}>
                  Certifications
                </Text>
                <View style={styles.certificationsList}>
                  {user.certifications.map((cert, index) => (
                    <View key={index} style={styles.certificationItem}>
                      <LucideIcon size={16} name="checkmark.circle.fill" color={colors.success} />
                      <Text variant="bodySmall" style={[styles.certificationText, { color: colors.text }]}>
                        {cert}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            </Card.Content>
          </Card>

          {/* Account Settings - Grid Layout */}
          <View style={styles.menuContainer}>
            <Text variant="titleMedium" style={[styles.menuTitle, { color: colors.text }]}>
              Account Settings
            </Text>
            <View style={styles.menuGrid}>
              {menuItems.map((item, index) => (
                <Card 
                  key={index} 
                  style={[styles.menuCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
                  onPress={() => Alert.alert(item.title, item.subtitle)}
                >
                  <Card.Content style={styles.menuCardContent}>
                    <View style={[styles.menuIcon, { backgroundColor: item.color + '20' }]}>
                      <LucideIcon size={20} name={item.icon} color={item.color} />
                    </View>
                    <Text variant="titleSmall" style={[styles.menuItemTitle, { color: colors.text }]}>
                      {item.title}
                    </Text>
                    <Text variant="bodySmall" style={[styles.menuItemSubtitle, { color: colors.textSecondary }]}>
                      {item.subtitle}
                    </Text>
                  </Card.Content>
                </Card>
              ))}
            </View>
          </View>
        </ScrollView>

        {/* User Details Modal */}
        <Modal
          visible={isUserModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setIsUserModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
              <View style={styles.modalHeader}>
                <Text variant="titleLarge" style={[styles.modalTitle, { color: colors.text }]}>
                  User Details
                </Text>
                <Avatar.Icon 
                  size={24} 
                  icon="close" 
                  style={{ backgroundColor: colors.backgroundSecondary }}
                  color={colors.icon}
                  onTouchEnd={() => setIsUserModalVisible(false)}
                />
              </View>
              
              <View style={styles.modalBody}>
                <View style={styles.detailRow}>
                  <Text variant="bodyMedium" style={[styles.detailLabel, { color: colors.textSecondary }]}>
                    Phone:
                  </Text>
                  <Text variant="bodyMedium" style={[styles.detailValue, { color: colors.text }]}>
                    {user.phone}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text variant="bodyMedium" style={[styles.detailLabel, { color: colors.textSecondary }]}>
                    Email:
                  </Text>
                  <Text variant="bodyMedium" style={[styles.detailValue, { color: colors.text }]}>
                    {user.email}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text variant="bodyMedium" style={[styles.detailLabel, { color: colors.textSecondary }]}>
                    Total Earnings:
                  </Text>
                  <Text variant="bodyMedium" style={[styles.detailValue, { color: colors.success }]}>
                    {user.totalEarnings}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text variant="bodyMedium" style={[styles.detailLabel, { color: colors.textSecondary }]}>
                    Member Since:
                  </Text>
                  <Text variant="bodyMedium" style={[styles.detailValue, { color: colors.text }]}>
                    {user.joinDate}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </Modal>
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
  profileCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  profileCardContent: {
    padding: 20,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  userInfo: {
    marginLeft: 16,
    flex: 1,
  },
  name: {
    fontWeight: '600',
    marginBottom: 8,
    lineHeight: 28,
  },
  professionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 6,
  },
  profession: {
    fontWeight: '500',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  location: {
    fontWeight: '400',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontWeight: '600',
    marginBottom: 4,
  },
  statLabel: {
    fontWeight: '500',
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    height: 40,
  },
  attendanceContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  attendanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontWeight: '600',
  },
  timeFilter: {
    fontWeight: '400',
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
    paddingTop: 20,
  },
  chartColumn: {
    alignItems: 'center',
    flex: 1,
  },
  changeIndicator: {
    marginBottom: 8,
  },
  changeText: {
    fontWeight: '600',
    fontSize: 10,
  },
  bar: {
    width: 20,
    borderRadius: 10,
    marginBottom: 8,
  },
  dayLabel: {
    fontWeight: '500',
  },
  skillsCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    borderWidth: 1,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  skillsSection: {
    marginBottom: 16,
  },
  skillsLabel: {
    fontWeight: '500',
    marginBottom: 8,
  },
  skillsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  skillText: {
    fontWeight: '500',
  },
  divider: {
    marginVertical: 16,
  },
  certificationsSection: {
    marginTop: 8,
  },
  certificationsList: {
    gap: 8,
  },
  certificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  certificationText: {
    fontWeight: '400',
  },
  menuContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  menuTitle: {
    fontWeight: '600',
    marginBottom: 16,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  menuCard: {
    width: (width - 60) / 2,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  menuCardContent: {
    padding: 16,
    alignItems: 'center',
  },
  menuIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  menuItemTitle: {
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
  },
  menuItemSubtitle: {
    fontWeight: '400',
    textAlign: 'center',
    lineHeight: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    borderRadius: 20,
    padding: 24,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontWeight: '600',
  },
  modalBody: {
    gap: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontWeight: '500',
  },
  detailValue: {
    fontWeight: '600',
  },
});
