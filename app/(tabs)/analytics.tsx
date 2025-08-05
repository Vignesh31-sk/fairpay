import { ThemedView } from '@/components/ThemedView';
import { LucideIcon } from '@/components/ui/LucideIcon';
import { Colors } from '@/constants/Colors';
import { DUMMY_ANALYTICS } from '@/constants/Data';
import { useColorScheme } from '@/hooks/useColorScheme';
import React from 'react';
import { Dimensions, ScrollView, StyleSheet, View } from 'react-native';
import { Avatar, Card, ProgressBar, Text } from 'react-native-paper';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function AnalyticsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const insets = useSafeAreaInsets();
  
  const analytics = DUMMY_ANALYTICS;

  // Calculate percentages for progress bars
  const totalJobsInCategories = Object.values(analytics.jobsByCategory).reduce((sum, count) => sum + count, 0);
  const grievanceResolutionRate = (analytics.resolvedGrievances / analytics.totalGrievances) * 100;

  const statCards = [
    {
      title: "Total Jobs",
      value: analytics.totalJobs,
      icon: "briefcase.fill",
      color: colors.primary,
      subtitle: "Available positions"
    },
    {
      title: "Applications",
      value: analytics.applicationsCount,
      icon: "doc.fill",
      color: colors.secondary,
      subtitle: "This month"
    },
    {
      title: "Grievances",
      value: analytics.totalGrievances,
      icon: "exclamationmark.triangle.fill",
      color: colors.warning,
      subtitle: "Total reported"
    },
    {
      title: "Resolved",
      value: `${Math.round(grievanceResolutionRate)}%`,
      icon: "checkmark.circle.fill",
      color: colors.success,
      subtitle: "Resolution rate"
    }
  ];

  const categoryColors = [
    colors.primary,
    colors.secondary,
    colors.accent,
    colors.success,
    colors.warning,
    colors.error
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
                  Analytics
                </Text>
                <Text variant="titleMedium" style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
                  Your job platform insights
                </Text>
              </View>
              <Avatar.Icon 
                size={40} 
                icon="chart.bar.fill" 
                style={{ backgroundColor: colors.primary + '20' }}
                color={colors.primary}
              />
            </View>
          </View>

          {/* Key Stats Grid */}
          <View style={styles.statsGrid}>
            {statCards.map((stat, index) => (
              <Card 
                key={index} 
                style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
              >
                <Card.Content style={styles.statContent}>
                  <View style={[styles.statIcon, { backgroundColor: stat.color + '20' }]}>
                    <LucideIcon size={24} name={stat.icon} color={stat.color} />
                  </View>
                  <Text variant="headlineMedium" style={[styles.statNumber, { color: colors.text }]}>
                    {stat.value}
                  </Text>
                  <Text variant="titleSmall" style={[styles.statTitle, { color: colors.text }]}>
                    {stat.title}
                  </Text>
                  <Text variant="bodySmall" style={[styles.statSubtitle, { color: colors.textSecondary }]}>
                    {stat.subtitle}
                  </Text>
                </Card.Content>
              </Card>
            ))}
          </View>

          {/* Most Applied Job */}
          <Card style={[styles.featuredCard, { backgroundColor: colors.backgroundSecondary, borderColor: colors.cardBorder }]}>
            <Card.Content style={styles.featuredContent}>
              <View style={styles.featuredHeader}>
                <LucideIcon size={24} name="star.fill" color={colors.accent} />
                <Text variant="titleMedium" style={[styles.featuredTitle, { color: colors.text }]}>
                  Most Applied Job
                </Text>
              </View>
              <Text variant="headlineSmall" style={[styles.mostAppliedJob, { color: colors.primary }]}>
                {analytics.mostAppliedJob}
              </Text>
              <Text variant="bodyMedium" style={[styles.featuredSubtitle, { color: colors.textSecondary }]}>
                Based on recent applications and user interest
              </Text>
            </Card.Content>
          </Card>

          {/* Jobs by Category */}
          <Card style={[styles.chartCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
            <Card.Content>
              <View style={styles.chartHeader}>
                <LucideIcon size={24} name="chart.pie.fill" color={colors.primary} />
                <Text variant="titleMedium" style={[styles.chartTitle, { color: colors.text }]}>
                  Jobs by Category
                </Text>
              </View>
              <View style={styles.progressContainer}>
                {Object.entries(analytics.jobsByCategory).map(([category, count], index) => {
                  const percentage = (count / totalJobsInCategories);
                  const color = categoryColors[index % categoryColors.length];
                  return (
                    <View key={category} style={styles.progressItem}>
                      <View style={styles.progressHeader}>
                        <View style={styles.categoryInfo}>
                          <View style={[styles.categoryDot, { backgroundColor: color }]} />
                          <Text variant="bodyMedium" style={[styles.categoryName, { color: colors.text }]}>
                            {category}
                          </Text>
                        </View>
                        <Text variant="bodySmall" style={[styles.categoryCount, { color: colors.textSecondary }]}>
                          {count} jobs
                        </Text>
                      </View>
                      <ProgressBar 
                        progress={percentage} 
                        color={color}
                        style={styles.progressBar}
                      />
                      <Text variant="bodySmall" style={[styles.percentageText, { color: colors.textSecondary }]}>
                        {Math.round(percentage * 100)}%
                      </Text>
                    </View>
                  );
                })}
              </View>
            </Card.Content>
          </Card>

          {/* Grievance Resolution */}
          <Card style={[styles.chartCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
            <Card.Content>
              <View style={styles.chartHeader}>
                <LucideIcon size={24} name="checkmark.shield.fill" color={colors.success} />
                <Text variant="titleMedium" style={[styles.chartTitle, { color: colors.text }]}>
                  Grievance Resolution
                </Text>
              </View>
              <View style={styles.grievanceContainer}>
                <View style={styles.grievanceItem}>
                  <Text variant="bodyMedium" style={[styles.grievanceLabel, { color: colors.textSecondary }]}>
                    Total Grievances
                  </Text>
                  <Text variant="headlineSmall" style={[styles.grievanceNumber, { color: colors.text }]}>
                    {analytics.totalGrievances}
                  </Text>
                </View>
                <View style={styles.grievanceDivider} />
                <View style={styles.grievanceItem}>
                  <Text variant="bodyMedium" style={[styles.grievanceLabel, { color: colors.textSecondary }]}>
                    Resolved
                  </Text>
                  <Text variant="headlineSmall" style={[styles.grievanceNumber, { color: colors.success }]}>
                    {analytics.resolvedGrievances}
                  </Text>
                </View>
              </View>
              <ProgressBar 
                progress={grievanceResolutionRate / 100} 
                color={colors.success}
                style={styles.grievanceProgress}
              />
              <Text variant="bodySmall" style={[styles.resolutionText, { color: colors.success }]}>
                {Math.round(grievanceResolutionRate)}% resolution rate
              </Text>
            </Card.Content>
          </Card>

          {/* Summary Card */}
          <Card style={[styles.summaryCard, { backgroundColor: colors.backgroundSecondary, borderColor: colors.cardBorder }]}>
            <Card.Content>
              <View style={styles.summaryHeader}>
                <LucideIcon size={24} name="info.circle.fill" color={colors.primary} />
                <Text variant="titleMedium" style={[styles.summaryTitle, { color: colors.text }]}>
                  Platform Summary
                </Text>
              </View>
              <View style={styles.summaryContainer}>
                <View style={styles.summaryItem}>
                  <LucideIcon size={16} name="briefcase.fill" color={colors.primary} />
                  <Text variant="bodyMedium" style={[styles.summaryText, { color: colors.text }]}>
                    Total of {analytics.totalJobs} jobs available across all categories
                  </Text>
                </View>
                <View style={styles.summaryItem}>
                  <LucideIcon size={16} name="hammer.fill" color={colors.accent} />
                  <Text variant="bodyMedium" style={[styles.summaryText, { color: colors.text }]}>
                    Construction jobs are most in demand with {analytics.jobsByCategory.Construction} listings
                  </Text>
                </View>
                <View style={styles.summaryItem}>
                  <LucideIcon size={16} name="checkmark.circle.fill" color={colors.success} />
                  <Text variant="bodyMedium" style={[styles.summaryText, { color: colors.text }]}>
                    {analytics.resolvedGrievances} out of {analytics.totalGrievances} grievances resolved
                  </Text>
                </View>
                <View style={styles.summaryItem}>
                  <LucideIcon size={16} name="doc.fill" color={colors.secondary} />
                  <Text variant="bodyMedium" style={[styles.summaryText, { color: colors.text }]}>
                    {analytics.applicationsCount} applications submitted this month
                  </Text>
                </View>
              </View>
            </Card.Content>
          </Card>
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 12,
  },
  statCard: {
    width: (width - 52) / 2,
    borderRadius: 16,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  statContent: {
    padding: 16,
    alignItems: 'center',
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statNumber: {
    fontWeight: '700',
    marginBottom: 4,
  },
  statTitle: {
    fontWeight: '600',
    marginBottom: 2,
    textAlign: 'center',
  },
  statSubtitle: {
    textAlign: 'center',
    lineHeight: 16,
  },
  featuredCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    borderWidth: 1,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  featuredContent: {
    padding: 20,
    alignItems: 'center',
  },
  featuredHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  featuredTitle: {
    fontWeight: '600',
  },
  mostAppliedJob: {
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
    lineHeight: 28,
  },
  featuredSubtitle: {
    textAlign: 'center',
    lineHeight: 20,
  },
  chartCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    borderWidth: 1,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  chartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  chartTitle: {
    fontWeight: '600',
  },
  progressContainer: {
    gap: 16,
  },
  progressItem: {
    marginBottom: 8,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  categoryName: {
    fontWeight: '500',
  },
  categoryCount: {
    fontWeight: '400',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 4,
  },
  percentageText: {
    fontWeight: '500',
    textAlign: 'right',
  },
  grievanceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 20,
  },
  grievanceItem: {
    alignItems: 'center',
    flex: 1,
  },
  grievanceLabel: {
    fontWeight: '500',
    marginBottom: 4,
  },
  grievanceNumber: {
    fontWeight: '700',
  },
  grievanceDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E0E0E0',
  },
  grievanceProgress: {
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  resolutionText: {
    textAlign: 'center',
    fontWeight: '600',
  },
  summaryCard: {
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 16,
    borderWidth: 1,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  summaryTitle: {
    fontWeight: '600',
  },
  summaryContainer: {
    gap: 12,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  summaryText: {
    flex: 1,
    lineHeight: 20,
  },
});

