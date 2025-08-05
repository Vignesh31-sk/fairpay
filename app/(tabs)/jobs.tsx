import { ThemedView } from "@/components/ThemedView";
import { LucideIcon } from "@/components/ui/LucideIcon";
import { Colors } from "@/constants/Colors";
import { DUMMY_JOBS } from "@/constants/Data";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Job } from "@/types";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, Dimensions, FlatList, ScrollView, StyleSheet, View } from "react-native";
import { Avatar, Badge, Button, Card, Chip, Searchbar, Text } from "react-native-paper";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get('window');

export default function JobsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const insets = useSafeAreaInsets();
  
  const { search } = useLocalSearchParams();
  const [jobs, setJobs] = useState<Job[]>(DUMMY_JOBS);
  const [searchQuery, setSearchQuery] = useState((search as string) || "");
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const categories = [
    { name: "electrician", icon: "bolt.fill", color: colors.warning },
    { name: "plumber", icon: "drop.fill", color: colors.secondary },
    { name: "construction", icon: "hammer.fill", color: colors.accent },
    { name: "mechanic", icon: "wrench.fill", color: colors.primary },
    { name: "welder", icon: "flame.fill", color: colors.error },
    { name: "carpenter", icon: "scissors", color: colors.success },
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

  const getCategoryIcon = (category: string) => {
    const cat = categories.find(c => c.name === category);
    return cat?.icon || "briefcase.fill";
  };

  const getCategoryColor = (category: string) => {
    const cat = categories.find(c => c.name === category);
    return cat?.color || colors.primary;
  };

  const renderJob = ({ item }: { item: Job }) => (
    <Card style={[styles.jobCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
      <Card.Content style={styles.jobCardContent}>
        <View style={styles.jobHeader}>
          <View style={styles.jobTitleContainer}>
            <Text variant="titleMedium" style={[styles.jobTitle, { color: colors.text }]}>
              {item.title}
            </Text>
            <View style={styles.jobBadges}>
              <Chip 
                mode="outlined" 
                compact 
                style={[styles.jobTypeChip, { borderColor: colors.cardBorder }]}
                textStyle={{ color: colors.textSecondary }}
              >
                {item.type}
              </Chip>
              {item.type === "Full-time" && (
                <Badge style={[styles.urgentBadge, { backgroundColor: colors.primary }]}>
                  Urgent
                </Badge>
              )}
            </View>
          </View>
          <Avatar.Icon 
            size={40} 
            icon={getCategoryIcon(item.category)}
            style={{ backgroundColor: getCategoryColor(item.category) + '20' }}
            color={getCategoryColor(item.category)}
          />
        </View>
        
        <View style={styles.jobDetails}>
          <View style={styles.companyRow}>
            <LucideIcon size={16} name="building.2.fill" color={colors.textSecondary} />
            <Text variant="bodyMedium" style={[styles.company, { color: colors.primary }]}>
              {item.company}
            </Text>
          </View>
          
          <View style={styles.locationRow}>
            <LucideIcon size={16} name="location.fill" color={colors.textSecondary} />
            <Text variant="bodySmall" style={[styles.location, { color: colors.textSecondary }]}>
              {item.location}
            </Text>
          </View>
          
          <View style={styles.salaryRow}>
            <LucideIcon size={16} name="indianrupeesign.circle.fill" color={colors.success} />
            <Text variant="titleSmall" style={[styles.salary, { color: colors.success }]}>
              {item.salary}
            </Text>
          </View>
        </View>
        
        <Text variant="bodySmall" style={[styles.description, { color: colors.textSecondary }]} numberOfLines={2}>
          {item.description}
        </Text>
      </Card.Content>
      <Card.Actions style={styles.cardActions}>
        <Button 
          mode="contained" 
          onPress={() => handleApply(item)}
          style={[styles.applyButton, { backgroundColor: colors.primary }]}
          labelStyle={{ color: colors.card }}
        >
          Apply Now
        </Button>
        <Button 
          mode="outlined" 
          onPress={() => Alert.alert("Save Job", "Job saved to favorites")}
          style={[styles.saveButton, { borderColor: colors.cardBorder }]}
          textColor={colors.textSecondary}
        >
          Save
        </Button>
      </Card.Actions>
    </Card>
  );

  return (
<SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top', 'bottom']}>
<ThemedView style={[styles.container, { paddingBottom: insets.bottom }]}>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTop}>
              <View>
                <Text variant="headlineSmall" style={[styles.headerTitle, { color: colors.text }]}>
                  Find Jobs
                </Text>
                <Text variant="titleMedium" style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
                  {jobs.length} jobs available
                </Text>
              </View>
              <Avatar.Icon 
                size={40} 
                icon="plus" 
                style={{ backgroundColor: colors.primary + '20' }}
                color={colors.primary}
                onTouchEnd={() => router.push("/(tabs)/create-job")}
              />
            </View>
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Searchbar
              placeholder="Search jobs, companies, locations..."
              onChangeText={onSearchChange}
              value={searchQuery}
              style={[styles.searchbar, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
              iconColor={colors.icon}
              inputStyle={{ color: colors.text }}
              placeholderTextColor={colors.textTertiary}
            />
          </View>

          {/* Categories */}
          <View style={styles.categoriesContainer}>
            <Text variant="titleMedium" style={[styles.categoriesLabel, { color: colors.text }]}>
              Job Categories
            </Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoriesScroll}
            >
              {categories.map((category) => (
                <Card
                  key={category.name}
                  style={[
                    styles.categoryCard,
                    { 
                      backgroundColor: selectedCategory === category.name ? category.color : colors.card,
                      borderColor: colors.cardBorder
                    }
                  ]}
                  onPress={() => onCategorySelect(category.name)}
                >
                  <Card.Content style={styles.categoryCardContent}>
                    <LucideIcon 
                      size={24} 
                      name={category.icon} 
                      color={selectedCategory === category.name ? colors.card : category.color} 
                    />
                    <Text 
                      variant="bodySmall" 
                      style={[
                        styles.categoryText, 
                        { color: selectedCategory === category.name ? colors.card : colors.text }
                      ]}
                    >
                      {category.name.charAt(0).toUpperCase() + category.name.slice(1)}
                    </Text>
                  </Card.Content>
                </Card>
              ))}
            </ScrollView>
          </View>

          {/* Jobs List */}
          <View style={styles.jobsContainer}>
            <Text variant="titleMedium" style={[styles.jobsLabel, { color: colors.text }]}>
              Available Jobs
            </Text>
            <FlatList
              data={jobs}
              renderItem={renderJob}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.jobsList}
              scrollEnabled={false}
              ListEmptyComponent={
                <Card style={[styles.emptyCard, { backgroundColor: colors.backgroundSecondary, borderColor: colors.cardBorder }]}>
                  <Card.Content style={styles.emptyContent}>
                    <LucideIcon size={48} name="briefcase" color={colors.textTertiary} />
                    <Text variant="titleMedium" style={[styles.emptyText, { color: colors.text }]}>
                      No jobs found
                    </Text>
                    <Text variant="bodyMedium" style={[styles.emptySubtext, { color: colors.textSecondary }]}>
                      Try adjusting your search or category filters
                    </Text>
                  </Card.Content>
                </Card>
              }
            />
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
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchbar: {
    borderRadius: 12,
    borderWidth: 1,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  categoriesContainer: {
    marginBottom: 24,
  },
  categoriesLabel: {
    fontWeight: '600',
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  categoriesScroll: {
    paddingHorizontal: 20,
    gap: 12,
  },
  categoryCard: {
    width: 100,
    borderRadius: 12,
    borderWidth: 1,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  categoryCardContent: {
    padding: 12,
    alignItems: 'center',
  },
  categoryText: {
    fontWeight: '500',
    marginTop: 4,
    textAlign: 'center',
  },
  jobsContainer: {
    paddingHorizontal: 20,
  },
  jobsLabel: {
    fontWeight: '600',
    marginBottom: 16,
  },
  jobsList: {
    gap: 12,
    paddingBottom: 20,
  },
  jobCard: {
    borderRadius: 16,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  jobCardContent: {
    padding: 20,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  jobTitleContainer: {
    flex: 1,
    marginRight: 12,
  },
  jobTitle: {
    fontWeight: '600',
    marginBottom: 8,
    lineHeight: 22,
  },
  jobBadges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  jobTypeChip: {
    borderRadius: 8,
  },
  urgentBadge: {
    borderRadius: 4,
  },
  jobDetails: {
    marginBottom: 16,
    gap: 8,
  },
  companyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  company: {
    fontWeight: '500',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  location: {
    fontWeight: '400',
  },
  salaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  salary: {
    fontWeight: '600',
  },
  description: {
    lineHeight: 18,
  },
  cardActions: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 12,
  },
  applyButton: {
    flex: 1,
    borderRadius: 8,
  },
  saveButton: {
    borderRadius: 8,
  },
  emptyCard: {
    borderRadius: 16,
    borderWidth: 1,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  emptyContent: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    textAlign: 'center',
    lineHeight: 20,
  },
});
