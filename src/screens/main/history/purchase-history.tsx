import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { FC, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import ScreenContainer from '../../../components/layouts/screen-container';
import Header from '../../../components/ui/header';
import { fontFamilies } from '../../../constants/fonts';
import { useTranslation } from 'react-i18next';
import { MainNavigatorParamList } from '../../../navigators/types';
import TopupHistoryList from '../../../features/history/topup-history-list';
import UsageHistoryList from '../../../features/history/usage-history-list';
import TopupReceiptModal from '../../../features/history/topup-receipt-modal';
import UsageReceiptModal from '../../../features/history/usage-receipt-modal';

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
            <Text
              style={[
                styles.tabText,
                activeTab === 'history' && styles.activeTabText,
              ]}>
              {t('PURCHASE HISTORY')}
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
              {t('TOP UP HISTORY')}
            </Text>
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
