import { ThemedView } from "@/components/ThemedView";
import { LucideIcon } from "@/components/ui/LucideIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { router } from "expo-router";
import * as SpeechRecognition from 'expo-speech-recognition';
import React from "react";
import { Alert, Dimensions, ScrollView, StyleSheet, View } from "react-native";
import { Avatar, Card, Text } from "react-native-paper";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get('window');

export default function WalletScreen() {
  async function listAvailableLanguages() {
    const locales = await SpeechRecognition.getSupportedLocales();
    console.log('Supported locales:', locales);
  }
  
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const insets = useSafeAreaInsets();

  // Mock wallet data
  const walletData = {
    balance: "12,590.90 USD",
    percentageChange: "+12.76%",
    user: {
      name: "Hari Monroe",
      address: "Oxb3Sx...yFir",
    },
  };

  // Mock spending data for the week
  const spendingData = [
    { day: "Mon", amount: 120, change: -2, isPositive: false },
    { day: "Tue", amount: 180, change: 4, isPositive: true },
    { day: "Wed", amount: 150, change: 2, isPositive: true },
    { day: "Thu", amount: 90, change: -3, isPositive: false },
    { day: "Fri", amount: 200, change: 4, isPositive: true },
    { day: "Sat", amount: 110, change: -2, isPositive: false },
    { day: "Sun", amount: 160, change: 1, isPositive: true },
  ];

  const maxSpending = Math.max(...spendingData.map(item => item.amount));

  const transactions = [
    {
      id: 1,
      type: "credit",
      amount: "₹500",
      description: "Delivery Partner - FoodCorp",
      date: "Today, 2:30 PM",
      status: "completed",
    },
    {
      id: 2,
      type: "credit",
      amount: "₹800",
      description: "Warehouse Assistant - LogiTech",
      date: "Yesterday, 6:00 PM",
      status: "completed",
    },
    {
      id: 3,
      type: "pending",
      amount: "₹600",
      description: "Delivery Partner - QuickMart",
      date: "Dec 15, 4:30 PM",
      status: "pending",
    },
    {
      id: 4,
      type: "credit",
      amount: "₹750",
      description: "Warehouse Assistant - MegaStore",
      date: "Dec 14, 5:00 PM",
      status: "completed",
    },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top', 'bottom']}>
      <ThemedView style={[styles.container, { paddingBottom: insets.bottom }]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header Section with User Profile */}
          <View style={styles.header}>
            <View style={styles.headerTop}>
              <View style={styles.userSection}>
                <Avatar.Text 
                  size={50} 
                  label={walletData.user.name.split(' ').map(n => n[0]).join('')}
                  style={{ backgroundColor: colors.primary, marginRight: 12 }}
                  color={colors.card}
                />
                <View>
                  <Text variant="titleLarge" style={[styles.userName, { color: colors.text }]}>
                    {walletData.user.name}
                  </Text>
                  <Text variant="bodyMedium" style={[styles.userAddress, { color: colors.textSecondary }]}>
                    {walletData.user.address}
                  </Text>
                </View>
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

          {/* Balance Card */}
          <Card style={[styles.balanceCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
            <Card.Content style={styles.balanceCardContent}>
              <View style={styles.balanceHeader}>
                <Text variant="titleMedium" style={[styles.balanceLabel, { color: colors.textSecondary }]}>
                  Balance
                </Text>
                <View style={[styles.percentageBadge, { backgroundColor: colors.success + '20' }]}>
                  <Text variant="bodySmall" style={[styles.percentageText, { color: colors.success }]}>
                    ↑ {walletData.percentageChange}
                  </Text>
                </View>
              </View>
              <Text variant="displaySmall" style={[styles.balanceAmount, { color: colors.text }]}>
                {walletData.balance}
              </Text>
            </Card.Content>
          </Card>

          {/* Action Buttons */}
          <View style={styles.actionsContainer}>
            <View style={styles.actionsGrid}>
              <Card 
                style={[styles.actionButton, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
                onPress={() => Alert.alert("Exchange", "Exchange currencies")}
              >
                <Card.Content style={styles.actionButtonContent}>
                  <LucideIcon size={24} name="refresh-cw" color={colors.success} />
                  <Text variant="titleSmall" style={[styles.actionButtonText, { color: colors.text }]}>
                    Exchange
                  </Text>
                </Card.Content>
              </Card>

              <Card 
                style={[styles.actionButton, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
                onPress={() => Alert.alert("Withdraw", "Withdraw to bank account")}
              >
                <Card.Content style={styles.actionButtonContent}>
                  <LucideIcon size={24} name="arrow-down" color={colors.text} />
                  <Text variant="titleSmall" style={[styles.actionButtonText, { color: colors.text }]}>
                    Withdraw
                  </Text>
                </Card.Content>
              </Card>

              <Card 
                style={[styles.actionButton, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
                onPress={() => Alert.alert("Top Up", "Add money to wallet")}
              >
                <Card.Content style={styles.actionButtonContent}>
                  <LucideIcon size={24} name="plus" color={colors.text} />
                  <Text variant="titleSmall" style={[styles.actionButtonText, { color: colors.text }]}>
                    Top Up
                  </Text>
                </Card.Content>
              </Card>
            </View>
          </View>

          {/* Spending Chart */}
          <View style={styles.spendingContainer}>
            <View style={styles.spendingHeader}>
              <Text variant="titleMedium" style={[styles.sectionTitle, { color: colors.text }]}>
                Spending
              </Text>
              <Text variant="bodyMedium" style={[styles.timeFilter, { color: colors.textSecondary }]}>
                Last week
              </Text>
            </View>
            <View style={styles.chartContainer}>
              {spendingData.map((item, index) => (
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
                        height: (item.amount / maxSpending) * 100,
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

          {/* Recent Transactions */}
          <View style={styles.transactionsContainer}>
            <Text variant="titleMedium" style={[styles.sectionTitle, { color: colors.text }]}>
              Recent Transactions
            </Text>
            <View style={styles.transactionsList}>
              {transactions.map((transaction) => (
                <Card 
                  key={transaction.id} 
                  style={[styles.transactionCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
                  onPress={() => Alert.alert("Transaction Details", transaction.description)}
                >
                  <Card.Content style={styles.transactionCardContent}>
                    <View style={styles.transactionLeft}>
                      <View style={[
                        styles.transactionIcon, 
                        { backgroundColor: transaction.status === 'completed' ? colors.success + '20' : colors.accent + '20' }
                      ]}>
                        <LucideIcon 
                          size={20} 
                          name="help-circle" 
                          color={transaction.status === 'completed' ? colors.success : colors.accent} 
                        />
                      </View>
                      <View style={styles.transactionInfo}>
                        <Text variant="titleSmall" style={[styles.transactionDescription, { color: colors.text }]}>
                          {transaction.description}
                        </Text>
                        <Text variant="bodySmall" style={[styles.transactionDate, { color: colors.textSecondary }]}>
                          {transaction.date}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.transactionRight}>
                      <Text variant="titleMedium" style={[
                        styles.transactionAmount, 
                        { color: transaction.status === 'completed' ? colors.success : colors.accent }
                      ]}>
                        {transaction.status === 'completed' ? '+' : ''}{transaction.amount}
                      </Text>
                      <View style={[
                        styles.statusBadge, 
                        { backgroundColor: transaction.status === 'completed' ? colors.success + '20' : colors.accent + '20' }
                      ]}>
                        <Text variant="bodySmall" style={[
                          styles.statusText, 
                          { color: transaction.status === 'completed' ? colors.success : colors.accent }
                        ]}>
                          {transaction.status}
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
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    fontWeight: '600',
    marginBottom: 2,
  },
  userAddress: {
    fontWeight: '400',
  },
  balanceCard: {
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 16,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  balanceCardContent: {
    padding: 20,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  balanceLabel: {
    fontWeight: '500',
  },
  percentageBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  percentageText: {
    fontWeight: '600',
  },
  balanceAmount: {
    fontWeight: '700',
  },
  actionsContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: (width - 60) / 3,
    borderRadius: 12,
    borderWidth: 1,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  actionButtonContent: {
    padding: 16,
    alignItems: 'center',
  },
  actionButtonText: {
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
  spendingContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  spendingHeader: {
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
  transactionsContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  transactionsList: {
    gap: 12,
  },
  transactionCard: {
    borderRadius: 12,
    borderWidth: 1,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  transactionCardContent: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDescription: {
    fontWeight: '500',
    marginBottom: 4,
  },
  transactionDate: {
    fontWeight: '400',
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontWeight: '600',
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusText: {
    fontWeight: '500',
    textTransform: 'capitalize',
  },
}); 