import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, ProgressBar } from 'react-native-paper';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { DUMMY_ANALYTICS } from '@/constants/Data';

export default function AnalyticsScreen() {
  const analytics = DUMMY_ANALYTICS;

  // Calculate percentages for progress bars
  const totalJobsInCategories = Object.values(analytics.jobsByCategory).reduce((sum, count) => sum + count, 0);
  const grievanceResolutionRate = (analytics.resolvedGrievances / analytics.totalGrievances) * 100;

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.header}>Analytics</ThemedText>
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Key Stats Cards */}
        <View style={styles.statsContainer}>
          <Card style={styles.statCard}>
            <Card.Content style={styles.statContent}>
              <Text variant="headlineMedium" style={styles.statNumber}>
                {analytics.totalJobs}
              </Text>
              <Text variant="bodyMedium" style={styles.statLabel}>Total Jobs</Text>
            </Card.Content>
          </Card>

          <Card style={styles.statCard}>
            <Card.Content style={styles.statContent}>
              <Text variant="headlineMedium" style={styles.statNumber}>
                {analytics.applicationsCount}
              </Text>
              <Text variant="bodyMedium" style={styles.statLabel}>Applications</Text>
            </Card.Content>
          </Card>
        </View>

        <View style={styles.statsContainer}>
          <Card style={styles.statCard}>
            <Card.Content style={styles.statContent}>
              <Text variant="headlineMedium" style={styles.statNumber}>
                {analytics.totalGrievances}
              </Text>
              <Text variant="bodyMedium" style={styles.statLabel}>Grievances</Text>
            </Card.Content>
          </Card>

          <Card style={styles.statCard}>
            <Card.Content style={styles.statContent}>
              <Text variant="headlineMedium" style={styles.statNumber}>
                {Math.round(grievanceResolutionRate)}%
              </Text>
              <Text variant="bodyMedium" style={styles.statLabel}>Resolved</Text>
            </Card.Content>
          </Card>
        </View>

        {/* Most Applied Job */}
        <Card style={styles.chartCard}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.chartTitle}>Most Applied Job</Text>
            <Text variant="headlineSmall" style={styles.mostAppliedJob}>
              {analytics.mostAppliedJob}
            </Text>
            <Text variant="bodyMedium" style={styles.chartSubtitle}>
              Based on recent applications
            </Text>
          </Card.Content>
        </Card>

        {/* Jobs by Category - Progress Bars */}
        <Card style={styles.chartCard}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.chartTitle}>Jobs by Category</Text>
            <View style={styles.progressContainer}>
              {Object.entries(analytics.jobsByCategory).map(([category, count]) => {
                const percentage = (count / totalJobsInCategories);
                return (
                  <View key={category} style={styles.progressItem}>
                    <View style={styles.progressHeader}>
                      <Text variant="bodyMedium" style={styles.categoryName}>
                        {category}
                      </Text>
                      <Text variant="bodySmall" style={styles.categoryCount}>
                        {count} jobs
                      </Text>
                    </View>
                    <ProgressBar 
                      progress={percentage} 
                      color="#6200ea" 
                      style={styles.progressBar}
                    />
                  </View>
                );
              })}
            </View>
          </Card.Content>
        </Card>

        {/* Grievance Resolution */}
        <Card style={styles.chartCard}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.chartTitle}>Grievance Resolution</Text>
            <View style={styles.grievanceContainer}>
              <View style={styles.grievanceItem}>
                <Text variant="bodyMedium">Total Grievances</Text>
                <Text variant="titleLarge" style={styles.grievanceNumber}>
                  {analytics.totalGrievances}
                </Text>
              </View>
              <View style={styles.grievanceItem}>
                <Text variant="bodyMedium">Resolved</Text>
                <Text variant="titleLarge" style={[styles.grievanceNumber, styles.resolvedNumber]}>
                  {analytics.resolvedGrievances}
                </Text>
              </View>
            </View>
            <ProgressBar 
              progress={grievanceResolutionRate / 100} 
              color="#4caf50" 
              style={styles.grievanceProgress}
            />
            <Text variant="bodySmall" style={styles.percentageText}>
              {Math.round(grievanceResolutionRate)}% resolution rate
            </Text>
          </Card.Content>
        </Card>

        {/* Summary Card */}
        <Card style={styles.chartCard}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.chartTitle}>Summary</Text>
            <View style={styles.summaryContainer}>
              <Text variant="bodyMedium" style={styles.summaryText}>
                📊 Total of {analytics.totalJobs} jobs available across all categories
              </Text>
              <Text variant="bodyMedium" style={styles.summaryText}>
                🏗️ Construction jobs are most in demand with {analytics.jobsByCategory.Construction} listings
              </Text>
              <Text variant="bodyMedium" style={styles.summaryText}>
                ✅ {analytics.resolvedGrievances} out of {analytics.totalGrievances} grievances resolved
              </Text>
              <Text variant="bodyMedium" style={styles.summaryText}>
                📝 {analytics.applicationsCount} applications submitted this month
              </Text>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
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
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
  },
  statContent: {
    alignItems: 'center',
  },
  statNumber: {
    fontWeight: 'bold',
    color: '#6200ea',
    marginBottom: 4,
  },
  statLabel: {
    color: '#666',
    textAlign: 'center',
  },
  chartCard: {
    marginBottom: 16,
  },
  chartTitle: {
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  chartSubtitle: {
    color: '#666',
    textAlign: 'center',
    marginTop: 4,
  },
  mostAppliedJob: {
    fontWeight: 'bold',
    color: '#2e7d32',
    textAlign: 'center',
    marginBottom: 4,
  },
  progressContainer: {
    paddingVertical: 8,
  },
  progressItem: {
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontWeight: '500',
    color: '#333',
  },
  categoryCount: {
    color: '#666',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  grievanceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  grievanceItem: {
    alignItems: 'center',
  },
  grievanceNumber: {
    fontWeight: 'bold',
    color: '#333',
    marginTop: 4,
  },
  resolvedNumber: {
    color: '#4caf50',
  },
  grievanceProgress: {
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  percentageText: {
    textAlign: 'center',
    color: '#4caf50',
    fontWeight: '500',
  },
  summaryContainer: {
    paddingVertical: 8,
  },
  summaryText: {
    marginBottom: 8,
    lineHeight: 20,
    color: '#555',
  },
});
