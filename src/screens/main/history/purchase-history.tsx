import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { FC, useState, useCallback, useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useFocusEffect } from '@react-navigation/native';

import { AppText } from '../../../components/ui/app-text';
import Header from '../../../components/ui/header';
import ScreenContainer from '../../../components/layouts/screen-container';
import TopupHistoryList from './topup-history-list';
import UsageHistoryList from './usage-history-list';
import TopupReceiptModal from './topup-receipt-modal';
import UsageReceiptModal from './usage-receipt-modal';

import { COLORS } from '../../../constants/colors';
import { scaleFont, scaleSize } from '../../../utils/scale';

import type { MainNavigatorParamList } from '../../../navigators/types';
import type { PurchaseHistoryTab } from './types';

type PurchaseHistoryProps = NativeStackScreenProps<MainNavigatorParamList, 'PurchaseHistory'>;

const PurchaseHistory: FC<PurchaseHistoryProps> = ({ navigation }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<PurchaseHistoryTab>('history');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const [usageModalVisible, setUsageModalVisible] = useState(false);
  const [usageSelectedItem, setUsageSelectedItem] = useState<any>(null);

  useFocusEffect(
    useCallback(() => {
      return () => setUsageModalVisible(false);
    }, [])
  );

  // Memoize handlers to prevent unnecessary re-renders
  const handleShowReceipt = useCallback((item: any) => {
    console.log(item)
    try {
      setModalVisible(true);
      setSelectedItem(item);
    } catch (e) {
      console.log(e, 'asdasd')
    }
  }, []);

  const handleShowUsageReceipt = useCallback((item: any) => {
    setUsageModalVisible(true);
    requestAnimationFrame(() => {
      setUsageSelectedItem(item);
    });
  }, []);

  // Memoize modal close handlers
  const handleCloseModal = useCallback(() => setModalVisible(false), []);
  const handleCloseUsageModal = useCallback(() => setUsageModalVisible(false), []);

  return (
    <>
      <ScreenContainer
        scrollable={false}
        header={
          <Header
            title={t('purchaseHistory.title')}
            onBack={() => navigation.goBack()}
          />
        }
      >
        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <Pressable
            style={[styles.tab, activeTab === 'history' && styles.activeTab]}
            onPress={() => setActiveTab('history')}>
            <AppText
              variant="body2"
              style={
                activeTab === 'history'
                  ? [styles.tabText, styles.activeTabText]
                  : styles.tabText
              }>
              {t('purchaseHistory.usageTab')}
            </AppText>
          </Pressable>

          <Pressable
            style={[styles.tab, activeTab === 'topup' && styles.activeTab]}
            onPress={() => setActiveTab('topup')}>
            <AppText
              variant="body2"
              style={
                activeTab === 'topup'
                  ? [styles.tabText, styles.activeTabText]
                  : styles.tabText
              }>
              {t('purchaseHistory.topupTab')}
            </AppText>
          </Pressable>
        </View>

        {/* Content */}
        {
          activeTab === 'history' ?
            (
              <UsageHistoryList onItemPress={handleShowUsageReceipt} />
            ) : (
              <TopupHistoryList onItemPress={handleShowReceipt} />
            )
        }
      </ScreenContainer>
      <TopupReceiptModal
        visible={modalVisible}
        onClose={handleCloseModal}
        item={selectedItem}
      />

      <UsageReceiptModal
        visible={usageModalVisible}
        onClose={handleCloseUsageModal}
        item={usageSelectedItem}
      />
    </>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    marginBottom: scaleSize(14, 14, 20),
  },
  tab: {
    flex: 1,
    paddingVertical: scaleSize(8, 8, 12),
    alignItems: 'center',
    borderBottomWidth: scaleSize(2),
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    color: COLORS.gray,
    fontSize: scaleFont(14, 12, 18),
  },
  activeTabText: {
    color: COLORS.white,
    fontWeight: '500',
    fontSize: scaleFont(14, 12, 18),
  },
});

export default PurchaseHistory;
