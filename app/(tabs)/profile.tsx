import { ThemedView } from "@/components/ThemedView";
import { LucideIcon } from "@/components/ui/LucideIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Avatar, Card, Divider, Text } from "react-native-paper";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const insets = useSafeAreaInsets();

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

          {/* Profile Card */}
          <Card style={[styles.profileCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
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
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text variant="titleLarge" style={[styles.statNumber, { color: colors.primary }]}>
                    {user.rating}
                  </Text>
                  <Text variant="bodySmall" style={[styles.statLabel, { color: colors.textSecondary }]}>
                    Rating
                  </Text>
                </View>
                <View style={styles.statDivider} />
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

          {/* Earnings Card */}
          <Card style={[styles.earningsCard, { backgroundColor: colors.backgroundSecondary, borderColor: colors.cardBorder }]}>
            <Card.Content style={styles.earningsContent}>
              <View style={styles.earningsHeader}>
                <LucideIcon size={24} name="indianrupeesign.circle.fill" color={colors.success} />
                <Text variant="titleMedium" style={[styles.earningsTitle, { color: colors.text }]}>
                  Total Earnings
                </Text>
              </View>
              <Text variant="displaySmall" style={[styles.earningsAmount, { color: colors.success }]}>
                {user.totalEarnings}
              </Text>
              <Text variant="bodySmall" style={[styles.earningsSubtext, { color: colors.textSecondary }]}>
                Since {user.joinDate}
              </Text>
            </Card.Content>
          </Card>

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

          {/* Menu Items */}
          <View style={styles.menuContainer}>
            <Text variant="titleMedium" style={[styles.menuTitle, { color: colors.text }]}>
              Account Settings
            </Text>
            {menuItems.map((item, index) => (
              <Card 
                key={index} 
                style={[styles.menuCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
                onPress={() => {}}
              >
                <Card.Content style={styles.menuCardContent}>
                  <View style={[styles.menuIcon, { backgroundColor: item.color + '20' }]}>
                    <LucideIcon size={20} name={item.icon} color={item.color} />
                  </View>
                  <View style={styles.menuText}>
                    <Text variant="titleSmall" style={[styles.menuItemTitle, { color: colors.text }]}>
                      {item.title}
                    </Text>
                    <Text variant="bodySmall" style={[styles.menuItemSubtitle, { color: colors.textSecondary }]}>
                      {item.subtitle}
                    </Text>
                  </View>
                  <LucideIcon size={16} name="chevron.right" color={colors.textTertiary} />
                </Card.Content>
              </Card>
            ))}
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
    borderTopColor: '#E0E0E0',
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
    backgroundColor: '#E0E0E0',
  },
  earningsCard: {
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
  earningsContent: {
    padding: 20,
    alignItems: 'center',
  },
  earningsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  earningsTitle: {
    fontWeight: '600',
  },
  earningsAmount: {
    fontWeight: '700',
    marginBottom: 4,
  },
  earningsSubtext: {
    fontWeight: '400',
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
  sectionTitle: {
    fontWeight: '600',
    marginBottom: 16,
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
  menuCard: {
    marginBottom: 8,
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuText: {
    flex: 1,
  },
  menuItemTitle: {
    fontWeight: '600',
    marginBottom: 2,
  },
  menuItemSubtitle: {
    fontWeight: '400',
  },
});
