import { ThemedView } from "@/components/ThemedView";
import { LucideIcon } from "@/components/ui/LucideIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { Avatar, Card, Chip, Text } from "react-native-paper";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

export default function NotificationsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<'all' | 'jobs' | 'payments' | 'system'>('all');

  // Mock notifications data
  const notifications = [
    {
      id: 1,
      type: 'job',
      title: 'New Job Posted',
      message: 'Delivery Partner position available at FoodCorp',
      time: '2 minutes ago',
      isRead: false,
      icon: 'briefcase',
      color: colors.primary,
      action: () => Alert.alert('Job Details', 'Navigate to job details page'),
    },
    {
      id: 2,
      type: 'payment',
      title: 'Payment Received',
      message: '₹500 credited to your wallet from FoodCorp',
      time: '1 hour ago',
      isRead: false,
      icon: 'indian-rupee',
      color: colors.success,
      action: () => Alert.alert('Payment Details', 'View transaction details'),
    },
    {
      id: 3,
      type: 'job',
      title: 'Application Selected',
      message: 'You have been selected for Warehouse Assistant at LogiTech',
      time: '3 hours ago',
      isRead: true,
      icon: 'check-circle',
      color: colors.success,
      action: () => Alert.alert('Congratulations!', 'You got the job!'),
    },
    {
      id: 4,
      type: 'payment',
      title: 'Payment Pending',
      message: '₹600 pending from QuickMart for delivery work',
      time: '5 hours ago',
      isRead: true,
      icon: 'clock',
      color: colors.warning,
      action: () => Alert.alert('Pending Payment', 'Payment will be processed within 24 hours'),
    },
    {
      id: 5,
      type: 'system',
      title: 'Profile Updated',
      message: 'Your profile information has been successfully updated',
      time: '1 day ago',
      isRead: true,
      icon: 'user',
      color: colors.secondary,
      action: () => Alert.alert('Profile Updated', 'Your changes have been saved'),
    },
    {
      id: 6,
      type: 'job',
      title: 'Job Reminder',
      message: 'You have a scheduled delivery job in 30 minutes',
      time: '2 days ago',
      isRead: true,
      icon: 'bell',
      color: colors.warning,
      action: () => Alert.alert('Job Reminder', 'Don\'t forget your scheduled job'),
    },
    {
      id: 7,
      type: 'payment',
      title: 'Withdrawal Successful',
      message: '₹2,000 withdrawn to your bank account',
      time: '3 days ago',
      isRead: true,
      icon: 'arrow-down',
      color: colors.success,
      action: () => Alert.alert('Withdrawal', 'Money transferred to your account'),
    },
    {
      id: 8,
      type: 'system',
      title: 'App Update Available',
      message: 'New version 2.1.0 is available with bug fixes',
      time: '1 week ago',
      isRead: true,
      icon: 'arrow-up-circle',
      color: colors.primary,
      action: () => Alert.alert('Update Available', 'Download the latest version'),
    },
  ];

  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === 'all') return true;
    return notification.type === activeTab;
  });

  const getNotificationIcon = (icon: string) => {
    // Map icon names to available Lucide icons
    const iconMap: { [key: string]: string } = {
      'briefcase': 'briefcase',
      'indianrupeesign.circle.fill': 'indian-rupee',
      'checkmark.circle.fill': 'check-circle',
      'clock.fill': 'clock',
      'person.fill': 'user',
      'bell.fill': 'bell',
      'arrow-down': 'arrow-down',
      'arrow.up.circle.fill': 'arrow-up-circle',
    };
    return iconMap[icon] || 'bell';
  };

  const getNotificationColor = (color: string) => {
    return color;
  };

  const markAsRead = (id: number) => {
    // In a real app, this would update the notification status
    Alert.alert('Marked as Read', 'Notification marked as read');
  };

  const clearAll = () => {
    Alert.alert('Clear All', 'All notifications cleared');
  };

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
                   onTouchEnd={() => router.push("/(tabs)/wallet")}
                 />
                <View style={styles.headerTextContainer}>
                  <Text variant="headlineSmall" style={[styles.headerTitle, { color: colors.text }]}>
                    Notifications
                  </Text>
                  <Text variant="titleMedium" style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
                    {notifications.filter(n => !n.isRead).length} unread
                  </Text>
                </View>
                             </View>
             </View>
          </View>

          {/* Filter Tabs */}
          <View style={styles.tabsContainer}>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.tabsScroll}
            >
              <Card 
                style={[
                  styles.tabCard, 
                  { 
                    backgroundColor: activeTab === 'all' ? colors.primary : colors.card,
                    borderColor: colors.cardBorder
                  }
                ]}
                onPress={() => setActiveTab('all')}
              >
                <Card.Content style={styles.tabContent}>
                  <Text variant="bodySmall" style={[
                    styles.tabText, 
                    { color: activeTab === 'all' ? colors.card : colors.text }
                  ]}>
                    All
                  </Text>
                </Card.Content>
              </Card>

              <Card 
                style={[
                  styles.tabCard, 
                  { 
                    backgroundColor: activeTab === 'jobs' ? colors.primary : colors.card,
                    borderColor: colors.cardBorder
                  }
                ]}
                onPress={() => setActiveTab('jobs')}
              >
                <Card.Content style={styles.tabContent}>
                  <LucideIcon 
                    size={16} 
                    name="briefcase" 
                    color={activeTab === 'jobs' ? colors.card : colors.text} 
                  />
                  <Text variant="bodySmall" style={[
                    styles.tabText, 
                    { color: activeTab === 'jobs' ? colors.card : colors.text }
                  ]}>
                    Jobs
                  </Text>
                </Card.Content>
              </Card>

              <Card 
                style={[
                  styles.tabCard, 
                  { 
                    backgroundColor: activeTab === 'payments' ? colors.primary : colors.card,
                    borderColor: colors.cardBorder
                  }
                ]}
                onPress={() => setActiveTab('payments')}
              >
                <Card.Content style={styles.tabContent}>
                                     <LucideIcon 
                     size={16} 
                     name="indian-rupee" 
                     color={activeTab === 'payments' ? colors.card : colors.text} 
                   />
                  <Text variant="bodySmall" style={[
                    styles.tabText, 
                    { color: activeTab === 'payments' ? colors.card : colors.text }
                  ]}>
                    Payments
                  </Text>
                </Card.Content>
              </Card>

              <Card 
                style={[
                  styles.tabCard, 
                  { 
                    backgroundColor: activeTab === 'system' ? colors.primary : colors.card,
                    borderColor: colors.cardBorder
                  }
                ]}
                onPress={() => setActiveTab('system')}
              >
                <Card.Content style={styles.tabContent}>
                  <LucideIcon 
                    size={16} 
                    name="gear" 
                    color={activeTab === 'system' ? colors.card : colors.text} 
                  />
                  <Text variant="bodySmall" style={[
                    styles.tabText, 
                    { color: activeTab === 'system' ? colors.card : colors.text }
                  ]}>
                    System
                  </Text>
                </Card.Content>
              </Card>
            </ScrollView>
          </View>

          {/* Notifications List */}
          <View style={styles.notificationsContainer}>
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification) => (
                <Card 
                  key={notification.id}
                  style={[
                    styles.notificationCard, 
                    { 
                      backgroundColor: colors.card, 
                      borderColor: colors.cardBorder,
                      opacity: notification.isRead ? 0.7 : 1
                    }
                  ]}
                  onPress={notification.action}
                >
                  <Card.Content style={styles.notificationContent}>
                    <View style={styles.notificationLeft}>
                      <View style={[
                        styles.notificationIcon, 
                        { backgroundColor: getNotificationColor(notification.color) + '20' }
                      ]}>
                        <LucideIcon 
                          size={20} 
                          name={getNotificationIcon(notification.icon)} 
                          color={getNotificationColor(notification.color)} 
                        />
                      </View>
                      <View style={styles.notificationInfo}>
                        <View style={styles.notificationHeader}>
                          <Text variant="titleSmall" style={[styles.notificationTitle, { color: colors.text }]}>
                            {notification.title}
                          </Text>
                          {!notification.isRead && (
                            <View style={[styles.unreadDot, { backgroundColor: colors.primary }]} />
                          )}
                        </View>
                        <Text variant="bodyMedium" style={[styles.notificationMessage, { color: colors.textSecondary }]}>
                          {notification.message}
                        </Text>
                        <Text variant="bodySmall" style={[styles.notificationTime, { color: colors.textTertiary }]}>
                          {notification.time}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.notificationRight}>
                      <Chip 
                        mode="outlined" 
                        compact 
                        style={[styles.typeChip, { borderColor: colors.cardBorder }]}
                        textStyle={{ color: colors.textSecondary }}
                      >
                        {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
                      </Chip>
                    </View>
                  </Card.Content>
                </Card>
              ))
            ) : (
              <Card style={[styles.emptyCard, { backgroundColor: colors.backgroundSecondary, borderColor: colors.cardBorder }]}>
                <Card.Content style={styles.emptyContent}>
                  <LucideIcon size={48} name="bell-off" color={colors.textTertiary} />
                  <Text variant="titleMedium" style={[styles.emptyText, { color: colors.text }]}>
                    No notifications
                  </Text>
                  <Text variant="bodyMedium" style={[styles.emptySubtext, { color: colors.textSecondary }]}>
                    You're all caught up! Check back later for new updates.
                  </Text>
                </Card.Content>
              </Card>
            )}
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
  tabsContainer: {
    marginBottom: 20,
  },
  tabsScroll: {
    paddingHorizontal: 20,
    gap: 8,
  },
  tabCard: {
    borderRadius: 20,
    borderWidth: 1,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  tabContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tabText: {
    fontWeight: '500',
  },
  notificationsContainer: {
    paddingHorizontal: 20,
    gap: 12,
  },
  notificationCard: {
    borderRadius: 16,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  notificationContent: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  notificationLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    marginRight: 12,
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationInfo: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  notificationTitle: {
    fontWeight: '600',
    flex: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
  notificationMessage: {
    lineHeight: 20,
    marginBottom: 6,
  },
  notificationTime: {
    fontWeight: '400',
  },
  notificationRight: {
    alignItems: 'flex-end',
  },
  typeChip: {
    borderRadius: 12,
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