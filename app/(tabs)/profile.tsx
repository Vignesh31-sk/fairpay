import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Avatar, Card, Text } from "react-native-paper";

export default function ProfileScreen() {
  // Dummy user data
  const user = {
    name: "राहुल शर्मा (Rahul Sharma)",
    phone: "+91 98765 43210",
    location: "Mumbai, Maharashtra",
    profession: "Electrician",
    experience: "5 years",
    rating: "4.5/5",
    completedJobs: 156,
    joinDate: "January 2020",
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.header}>
        Profile
      </ThemedText>

      <Card style={styles.profileCard}>
        <Card.Content>
          <View style={styles.avatarContainer}>
            <Avatar.Text size={80} label="RS" />
            <View style={styles.userInfo}>
              <Text variant="headlineSmall" style={styles.name}>
                {user.name}
              </Text>
              <Text variant="bodyMedium" style={styles.profession}>
                {user.profession}
              </Text>
              <Text variant="bodySmall" style={styles.location}>
                {user.location}
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.detailsCard}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Contact Information
          </Text>
          <View style={styles.infoRow}>
            <Text variant="bodyMedium" style={styles.label}>
              Phone:
            </Text>
            <Text variant="bodyMedium">{user.phone}</Text>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.detailsCard}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Work Experience
          </Text>
          <View style={styles.infoRow}>
            <Text variant="bodyMedium" style={styles.label}>
              Experience:
            </Text>
            <Text variant="bodyMedium">{user.experience}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text variant="bodyMedium" style={styles.label}>
              Rating:
            </Text>
            <Text variant="bodyMedium">{user.rating}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text variant="bodyMedium" style={styles.label}>
              Completed Jobs:
            </Text>
            <Text variant="bodyMedium">{user.completedJobs}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text variant="bodyMedium" style={styles.label}>
              Member Since:
            </Text>
            <Text variant="bodyMedium">{user.joinDate}</Text>
          </View>
        </Card.Content>
      </Card>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 20,
    textAlign: "center",
  },
  profileCard: {
    marginBottom: 16,
  },
  avatarContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  userInfo: {
    marginLeft: 16,
    flex: 1,
  },
  name: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  profession: {
    color: "#6200ea",
    fontWeight: "500",
    marginBottom: 2,
  },
  location: {
    color: "#666",
  },
  detailsCard: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  label: {
    fontWeight: "500",
    color: "#666",
  },
});
