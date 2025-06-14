import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { FC, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import ArrowIcon from '../../../components/icons/Arrow';
import ScreenContainer from '../../../components/layouts/ScreenContainer';
import { fontFamilies } from '../../../constants/fonts';
import { MainNavigatorParamList } from '../../../navigators/types';
import TopupHistoryList from '../../../features/history/topup-history-list';
import UsageHistoryList from '../../../features/history/usage-history-list';

type PurchaseHistoryProps = NativeStackScreenProps<MainNavigatorParamList, 'PurchaseHistory'>;

const PurchaseHistory: FC<PurchaseHistoryProps> = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState<'history' | 'topup'>('history');

  return (
    <ScreenContainer scrollable={false}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <ArrowIcon />
        </Pressable>
        <Text style={styles.headerTitle}>Purchase History</Text>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <Pressable
          style={[styles.tab, activeTab === 'history' && styles.activeTab]}
          onPress={() => setActiveTab('history')}>
          <Text
            style={[
              styles.tabText,
              activeTab === 'history' && styles.activeTabText,
            ]}>
            Purchase History
          </Text>
        </Pressable>

        <Pressable
          style={[styles.tab, activeTab === 'topup' && styles.activeTab]}
          onPress={() => setActiveTab('topup')}>
          <Text
            style={[
              styles.tabText,
              activeTab === 'topup' && styles.activeTabText,
            ]}>
            Top Up History
          </Text>
        </Pressable>
      </View>

      {/* Content */}
      {activeTab === 'history' ? (
        <UsageHistoryList />
      ) : (
        <TopupHistoryList />
      )}
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  backIcon: {
    fontSize: 24,
    color: '#333',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginLeft: 20,
    textAlign: 'center',
    fontFamily: fontFamilies.ARCHIVO.light,
  },
  tabContainer: {
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#D4A574',
  },
  tabText: {
    fontSize: 16,
    color: '#999',
    fontFamily: fontFamilies.ARCHIVO.light,
  },
  activeTabText: {
    color: '#333',
    fontWeight: '500',
  },
});

export default PurchaseHistory;
