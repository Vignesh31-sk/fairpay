import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { DUMMY_JOBS } from "@/constants/Data";
import { Job } from "@/types";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, FlatList, StyleSheet, View } from "react-native";
import { Button, Card, Chip, Searchbar, Text } from "react-native-paper";

export default function JobsScreen() {
  const { search } = useLocalSearchParams();
  const [jobs, setJobs] = useState<Job[]>(DUMMY_JOBS);
  const [searchQuery, setSearchQuery] = useState((search as string) || "");
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const categories = [
    "electrician",
    "plumber",
    "construction",
    "mechanic",
    "welder",
    "carpenter",
  ];

  useEffect(() => {
    if (search) {
      setSearchQuery(search as string);
      filterJobs(search as string, "");
    }
  }, [search]);

  const filterJobs = (query: string, category: string) => {
    let filtered = DUMMY_JOBS;

    if (query) {
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(query.toLowerCase()) ||
          job.category.toLowerCase().includes(query.toLowerCase()) ||
          job.location.toLowerCase().includes(query.toLowerCase()) ||
          job.company.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (category) {
      filtered = filtered.filter((job) => job.category === category);
    }

    setJobs(filtered);
  };

  const onSearchChange = (query: string) => {
    setSearchQuery(query);
    filterJobs(query, selectedCategory);
  };

  const onCategorySelect = (category: string) => {
    const newCategory = selectedCategory === category ? "" : category;
    setSelectedCategory(newCategory);
    filterJobs(searchQuery, newCategory);
  };

  const handleApply = (job: Job) => {
    Alert.alert(
      "Job Application",
      `Applied for ${job.title} at ${job.company} successfully!`,
      [{ text: "OK" }]
    );
  };

  const renderJob = ({ item }: { item: Job }) => (
    <Card style={styles.jobCard}>
      <Card.Content>
        <View style={styles.jobHeader}>
          <Text variant="titleMedium" style={styles.jobTitle}>
            {item.title}
          </Text>
          <Chip mode="outlined" compact>
            {item.type}
          </Chip>
        </View>
        <Text variant="bodyMedium" style={styles.company}>
          {item.company}
        </Text>
        <Text variant="bodySmall" style={styles.location}>
          {item.location}
        </Text>
        <Text variant="titleSmall" style={styles.salary}>
          {item.salary}
        </Text>
        <Text variant="bodySmall" style={styles.description} numberOfLines={2}>
          {item.description}
        </Text>
      </Card.Content>
      <Card.Actions>
        <Button mode="contained" onPress={() => handleApply(item)}>
          Apply Now
        </Button>
      </Card.Actions>
    </Card>
  );

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.header}>
        Jobs
      </ThemedText>

      <Searchbar
        placeholder="Search jobs, companies, locations..."
        onChangeText={onSearchChange}
        value={searchQuery}
        style={styles.searchbar}
      />

      <View style={styles.categoriesContainer}>
        <Text variant="bodyMedium" style={styles.categoriesLabel}>
          Categories:
        </Text>
        <View style={styles.categoriesRow}>
          {categories.map((category) => (
            <Chip
              key={category}
              mode={selectedCategory === category ? "flat" : "outlined"}
              selected={selectedCategory === category}
              onPress={() => onCategorySelect(category)}
              style={styles.categoryChip}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Chip>
          ))}
        </View>
      </View>

      <FlatList
        data={jobs}
        renderItem={renderJob}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.jobsList}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text variant="bodyLarge" style={styles.emptyText}>
              No jobs found matching your criteria
            </Text>
            <Text variant="bodyMedium" style={styles.emptySubtext}>
              Try adjusting your search or category filters
            </Text>
          </View>
        }
      />
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
  searchbar: {
    marginBottom: 16,
  },
  categoriesContainer: {
    marginBottom: 16,
  },
  categoriesLabel: {
    marginBottom: 8,
    fontWeight: "500",
  },
  categoriesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  categoryChip: {
    marginRight: 4,
    marginBottom: 4,
  },
  jobsList: {
    paddingBottom: 20,
  },
  jobCard: {
    marginBottom: 12,
  },
  jobHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  jobTitle: {
    fontWeight: "bold",
    flex: 1,
    marginRight: 8,
  },
  company: {
    color: "#6200ea",
    fontWeight: "500",
    marginBottom: 4,
  },
  location: {
    color: "#666",
    marginBottom: 4,
  },
  salary: {
    color: "#2e7d32",
    fontWeight: "bold",
    marginBottom: 8,
  },
  description: {
    color: "#555",
    lineHeight: 20,
  },
  emptyContainer: {
    alignItems: "center",
    padding: 40,
  },
  emptyText: {
    textAlign: "center",
    marginBottom: 8,
    fontWeight: "500",
  },
  emptySubtext: {
    textAlign: "center",
    color: "#666",
  },
});
