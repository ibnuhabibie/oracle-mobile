import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { FC, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import ScreenContainer from '../../../components/layouts/ScreenContainer';
import Header from '../../../components/ui/header';
import { fontFamilies } from '../../../constants/fonts';
import { MainNavigatorParamList } from '../../../navigators/types';
import TopupHistoryList from '../../../features/history/topup-history-list';
import UsageHistoryList from '../../../features/history/usage-history-list';

type PurchaseHistoryProps = NativeStackScreenProps<MainNavigatorParamList, 'PurchaseHistory'>;

const PurchaseHistory: FC<PurchaseHistoryProps> = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState<'history' | 'topup'>('history');

  return (
    <ScreenContainer
      scrollable={false}
      header={
        <Header
          title="Purchase History"
          onBack={() => navigation.goBack()}
        />
      }
    >
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
      {
        activeTab === 'history' ?
          (
            <UsageHistoryList />
          ) : (
            <TopupHistoryList />
          )
      }
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
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
