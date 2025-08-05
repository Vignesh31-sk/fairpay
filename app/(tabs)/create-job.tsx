import { ThemedView } from "@/components/ThemedView";
import { LucideIcon } from "@/components/ui/LucideIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { Avatar, Button, Card, Chip, Text, TextInput } from "react-native-paper";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

export default function CreateJobScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const insets = useSafeAreaInsets();
  
  const [formData, setFormData] = useState({
    jobTitle: '',
    company: '',
    location: '',
    salary: '',
    jobType: '',
    experience: '',
    description: '',
    requirements: '',
    benefits: '',
    contactEmail: '',
    contactPhone: '',
  });

  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedJobType, setSelectedJobType] = useState('');

  const jobCategories = [
    { name: "electrician", icon: "zap", color: colors.warning, label: "Electrician" },
    { name: "plumber", icon: "droplets", color: colors.secondary, label: "Plumber" },
    { name: "construction", icon: "hammer", color: colors.accent, label: "Construction" },
    { name: "mechanic", icon: "wrench", color: colors.primary, label: "Mechanic" },
    { name: "welder", icon: "flame", color: colors.error, label: "Welder" },
    { name: "carpenter", icon: "scissors", color: colors.success, label: "Carpenter" },
    { name: "delivery", icon: "truck", color: colors.primary, label: "Delivery" },
    { name: "warehouse", icon: "package", color: colors.secondary, label: "Warehouse" },
  ];

  const jobTypes = [
    { value: "full-time", label: "Full-time" },
    { value: "part-time", label: "Part-time" },
    { value: "contract", label: "Contract" },
    { value: "temporary", label: "Temporary" },
    { value: "freelance", label: "Freelance" },
  ];

  const experienceLevels = [
    { value: "entry", label: "Entry Level" },
    { value: "mid", label: "Mid Level" },
    { value: "senior", label: "Senior Level" },
    { value: "expert", label: "Expert Level" },
  ];

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!formData.jobTitle || !formData.company || !formData.location || !formData.salary) {
      Alert.alert("Missing Information", "Please fill in all required fields");
      return;
    }

    Alert.alert(
      "Job Posted Successfully!",
      `Your job posting "${formData.jobTitle}" has been created and is now live.`,
      [
        { text: "View Job", onPress: () => router.back() },
        { text: "Post Another", onPress: () => setFormData({
          jobTitle: '',
          company: '',
          location: '',
          salary: '',
          jobType: '',
          experience: '',
          description: '',
          requirements: '',
          benefits: '',
          contactEmail: '',
          contactPhone: '',
        }) }
      ]
    );
  };

  const isFormValid = formData.jobTitle && formData.company && formData.location && formData.salary;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top', 'bottom']}>
      <ThemedView style={[styles.container, { paddingBottom: insets.bottom }]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTop}>
              <View style={styles.headerLeft}>
                                 <Avatar.Icon 
                   size={32} 
                   icon="chevron-left" 
                   style={{ backgroundColor: colors.backgroundSecondary }}
                   color={colors.text}
                   onTouchEnd={() => router.push("/(tabs)/jobs")}
                 />
                <View style={styles.headerTextContainer}>
                  <Text variant="headlineSmall" style={[styles.headerTitle, { color: colors.text }]}>
                    Create Job
                  </Text>
                  <Text variant="titleMedium" style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
                    Post a new job opening
                  </Text>
                </View>
                             </View>
             </View>
          </View>

          {/* Job Category Selection */}
          <View style={styles.section}>
            <Text variant="titleMedium" style={[styles.sectionTitle, { color: colors.text }]}>
              Job Category *
            </Text>
            <View style={styles.categoriesGrid}>
              {jobCategories.map((category) => (
                <Card
                  key={category.name}
                  style={[
                    styles.categoryCard,
                    { 
                      backgroundColor: selectedCategory === category.name ? category.color : colors.card,
                      borderColor: colors.cardBorder
                    }
                  ]}
                  onPress={() => setSelectedCategory(category.name)}
                >
                  <Card.Content style={styles.categoryCardContent}>
                    <LucideIcon 
                      size={24} 
                      name={category.icon} 
                      color={selectedCategory === category.name ? colors.card : category.color} 
                    />
                    <Text variant="bodySmall" style={[
                      styles.categoryText, 
                      { color: selectedCategory === category.name ? colors.card : colors.text }
                    ]}>
                      {category.label}
                    </Text>
                  </Card.Content>
                </Card>
              ))}
            </View>
          </View>

          {/* Basic Information */}
          <View style={styles.section}>
            <Text variant="titleMedium" style={[styles.sectionTitle, { color: colors.text }]}>
              Basic Information
            </Text>
            
            <Card style={[styles.formCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
              <Card.Content style={styles.formCardContent}>
                <TextInput
                  label="Job Title *"
                  value={formData.jobTitle}
                  onChangeText={(text) => updateFormData('jobTitle', text)}
                  style={[styles.textInput, { backgroundColor: colors.background }]}
                  textColor={colors.text}
                  activeOutlineColor={colors.primary}
                  outlineColor={colors.cardBorder}
                  mode="outlined"
                />
                
                <TextInput
                  label="Company Name *"
                  value={formData.company}
                  onChangeText={(text) => updateFormData('company', text)}
                  style={[styles.textInput, { backgroundColor: colors.background }]}
                  textColor={colors.text}
                  activeOutlineColor={colors.primary}
                  outlineColor={colors.cardBorder}
                  mode="outlined"
                />
                
                <TextInput
                  label="Location *"
                  value={formData.location}
                  onChangeText={(text) => updateFormData('location', text)}
                  style={[styles.textInput, { backgroundColor: colors.background }]}
                  textColor={colors.text}
                  activeOutlineColor={colors.primary}
                  outlineColor={colors.cardBorder}
                  mode="outlined"
                />
                
                <TextInput
                  label="Salary (e.g., ₹15,000 - ₹25,000) *"
                  value={formData.salary}
                  onChangeText={(text) => updateFormData('salary', text)}
                  style={[styles.textInput, { backgroundColor: colors.background }]}
                  textColor={colors.text}
                  activeOutlineColor={colors.primary}
                  outlineColor={colors.cardBorder}
                  mode="outlined"
                />
              </Card.Content>
            </Card>
          </View>

          {/* Job Type Selection */}
          <View style={styles.section}>
            <Text variant="titleMedium" style={[styles.sectionTitle, { color: colors.text }]}>
              Job Type
            </Text>
            <View style={styles.chipsContainer}>
              {jobTypes.map((type) => (
                <Chip
                  key={type.value}
                  selected={selectedJobType === type.value}
                  onPress={() => setSelectedJobType(type.value)}
                  style={[
                    styles.chip,
                    { 
                      backgroundColor: selectedJobType === type.value ? colors.primary : colors.card,
                      borderColor: colors.cardBorder
                    }
                  ]}
                  textStyle={{ 
                    color: selectedJobType === type.value ? colors.card : colors.text 
                  }}
                >
                  {type.label}
                </Chip>
              ))}
            </View>
          </View>

          {/* Experience Level */}
          <View style={styles.section}>
            <Text variant="titleMedium" style={[styles.sectionTitle, { color: colors.text }]}>
              Experience Level
            </Text>
            <View style={styles.chipsContainer}>
              {experienceLevels.map((level) => (
                <Chip
                  key={level.value}
                  selected={formData.experience === level.value}
                  onPress={() => updateFormData('experience', level.value)}
                  style={[
                    styles.chip,
                    { 
                      backgroundColor: formData.experience === level.value ? colors.primary : colors.card,
                      borderColor: colors.cardBorder
                    }
                  ]}
                  textStyle={{ 
                    color: formData.experience === level.value ? colors.card : colors.text 
                  }}
                >
                  {level.label}
                </Chip>
              ))}
            </View>
          </View>

          {/* Job Description */}
          <View style={styles.section}>
            <Text variant="titleMedium" style={[styles.sectionTitle, { color: colors.text }]}>
              Job Details
            </Text>
            
            <Card style={[styles.formCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
              <Card.Content style={styles.formCardContent}>
                <TextInput
                  label="Job Description"
                  value={formData.description}
                  onChangeText={(text) => updateFormData('description', text)}
                  style={[styles.textArea, { backgroundColor: colors.background }]}
                  textColor={colors.text}
                  activeOutlineColor={colors.primary}
                  outlineColor={colors.cardBorder}
                  mode="outlined"
                  multiline
                  numberOfLines={4}
                  placeholder="Describe the role, responsibilities, and what you're looking for..."
                />
                
                <TextInput
                  label="Requirements"
                  value={formData.requirements}
                  onChangeText={(text) => updateFormData('requirements', text)}
                  style={[styles.textArea, { backgroundColor: colors.background }]}
                  textColor={colors.text}
                  activeOutlineColor={colors.primary}
                  outlineColor={colors.cardBorder}
                  mode="outlined"
                  multiline
                  numberOfLines={3}
                  placeholder="List required skills, qualifications, and experience..."
                />
                
                <TextInput
                  label="Benefits & Perks"
                  value={formData.benefits}
                  onChangeText={(text) => updateFormData('benefits', text)}
                  style={[styles.textArea, { backgroundColor: colors.background }]}
                  textColor={colors.text}
                  activeOutlineColor={colors.primary}
                  outlineColor={colors.cardBorder}
                  mode="outlined"
                  multiline
                  numberOfLines={3}
                  placeholder="Health insurance, flexible hours, bonuses, etc..."
                />
              </Card.Content>
            </Card>
          </View>

          {/* Contact Information */}
          <View style={styles.section}>
            <Text variant="titleMedium" style={[styles.sectionTitle, { color: colors.text }]}>
              Contact Information
            </Text>
            
            <Card style={[styles.formCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
              <Card.Content style={styles.formCardContent}>
                <TextInput
                  label="Contact Email"
                  value={formData.contactEmail}
                  onChangeText={(text) => updateFormData('contactEmail', text)}
                  style={[styles.textInput, { backgroundColor: colors.background }]}
                  textColor={colors.text}
                  activeOutlineColor={colors.primary}
                  outlineColor={colors.cardBorder}
                  mode="outlined"
                  keyboardType="email-address"
                />
                
                <TextInput
                  label="Contact Phone (Optional)"
                  value={formData.contactPhone}
                  onChangeText={(text) => updateFormData('contactPhone', text)}
                  style={[styles.textInput, { backgroundColor: colors.background }]}
                  textColor={colors.text}
                  activeOutlineColor={colors.primary}
                  outlineColor={colors.cardBorder}
                  mode="outlined"
                  keyboardType="phone-pad"
                />
              </Card.Content>
            </Card>
          </View>

          {/* Submit Button */}
          <View style={styles.submitSection}>
            <Button
              mode="contained"
              onPress={handleSubmit}
              disabled={!isFormValid}
              style={[
                styles.submitButton,
                { 
                  backgroundColor: isFormValid ? colors.primary : colors.backgroundSecondary,
                }
              ]}
              labelStyle={{ color: isFormValid ? colors.card : colors.textTertiary }}
            >
              Post Job Opening
            </Button>
            <Text variant="bodySmall" style={[styles.helperText, { color: colors.textSecondary }]}>
              * Required fields
            </Text>
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
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontWeight: '600',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontWeight: '400',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontWeight: '600',
    marginBottom: 16,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryCard: {
    width: '47%',
    borderRadius: 12,
    borderWidth: 1,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  categoryCardContent: {
    padding: 16,
    alignItems: 'center',
  },
  categoryText: {
    fontWeight: '500',
    marginTop: 8,
    textAlign: 'center',
  },
  formCard: {
    borderRadius: 16,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  formCardContent: {
    padding: 20,
    gap: 16,
  },
  textInput: {
    borderRadius: 8,
  },
  textArea: {
    borderRadius: 8,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    borderRadius: 20,
    borderWidth: 1,
  },
  submitSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: 'center',
  },
  submitButton: {
    borderRadius: 12,
    paddingVertical: 8,
    marginBottom: 12,
    width: '100%',
  },
  helperText: {
    textAlign: 'center',
  },
}); 