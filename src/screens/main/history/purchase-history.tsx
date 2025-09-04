import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { FC, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppText } from '../../../components/ui/app-text';

import ScreenContainer from '../../../components/layouts/screen-container';
import Header from '../../../components/ui/header';
import { useTranslation } from 'react-i18next';
import { MainNavigatorParamList } from '../../../navigators/types';
import TopupHistoryList from '../../../features/history/topup-history-list';
import UsageHistoryList from '../../../features/history/usage-history-list';
import TopupReceiptModal from '../../../features/history/topup-receipt-modal';
import UsageReceiptModal from '../../../features/history/usage-receipt-modal';
import { COLORS } from '../../../constants/colors';

type PurchaseHistoryProps = NativeStackScreenProps<MainNavigatorParamList, 'PurchaseHistory'>;

const PurchaseHistory: FC<PurchaseHistoryProps> = ({ navigation }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'history' | 'topup'>('history');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const [usageModalVisible, setUsageModalVisible] = useState(false);
  const [usageSelectedItem, setUsageSelectedItem] = useState<any>(null);

  const handleShowReceipt = (item: any) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const handleShowUsageReceipt = (item: any) => {
    setUsageSelectedItem(item);
    setUsageModalVisible(true);
  };

  return (
    <>
      <ScreenContainer
        scrollable={false}
        header={
          <Header
            title={t('PURCHASE HISTORY')}
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
              {t('PURCHASE HISTORY')}
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
              {t('TOP UP HISTORY')}
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

        <TopupReceiptModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          item={selectedItem}
        />

        <UsageReceiptModal
          visible={usageModalVisible}
          onClose={() => setUsageModalVisible(false)}
          item={usageSelectedItem}
        />
      </ScreenContainer>
    </>
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
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    color: COLORS.gray,
  },
  activeTabText: {
    color: COLORS.white,
    fontWeight: '500',
  },
});

export default PurchaseHistory;
