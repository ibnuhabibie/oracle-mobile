/* eslint-disable react/no-unstable-nested-components */
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {FC, useState} from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ArrowIcon from '../../../components/icons/Arrow';
import CartIcon from '../../../components/icons/Cart';
import CoinIcon from '../../../components/icons/Coin';
import CommentsIcon from '../../../components/icons/Comments';
import ScreenContainer from '../../../components/layouts/ScreenContainer';
import {fontFamilies} from '../../../constants/fonts';
import {MainNavigatorParamList} from '../../../navigators/main-navigator';

interface PurchaseItem {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  orderNumber?: string;
  pointsCost?: number;
  service?: string;
}

interface TopUpItem {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  coinType: 'gold' | 'silver' | 'red';
  orderNumber?: string;
  amount?: number;
  pointsAdded?: number;
  paymentMethod?: string;
}

const PurchaseHistory: FC<{
  navigation: NativeStackNavigationProp<
    MainNavigatorParamList,
    'PurchaseHistory'
  >;
}> = ({navigation}) => {
  const [activeTab, setActiveTab] = useState<'history' | 'topup'>('history');
  const [selectedTopUp, setSelectedTopUp] = useState<TopUpItem | null>(null);
  const [selectedPurchase, setSelectedPurchase] = useState<PurchaseItem | null>(
    null,
  );
  const [topUpModalVisible, setTopUpModalVisible] = useState(false);
  const [purchaseModalVisible, setPurchaseModalVisible] = useState(false);

  // Sample top up data with additional fields for receipt
  const topUpData: TopUpItem[] = [
    {
      id: '1',
      title: 'Top Up',
      description: 'Lorem ipsum dolor sit amet etic...',
      date: '25 Jan 2025',
      time: '10:00',
      coinType: 'gold',
      orderNumber: 'TK129202',
      amount: 50,
      pointsAdded: 55,
      paymentMethod: 'ApplePay',
    },
    {
      id: '2',
      title: 'Top Up',
      description: 'Lorem ipsum dolor sit amet etic...',
      date: '24 Jan 2025',
      time: '15:30',
      coinType: 'gold',
      orderNumber: 'TK129203',
      amount: 25,
      pointsAdded: 30,
      paymentMethod: 'Credit Card',
    },
    {
      id: '3',
      title: 'Top Up',
      description: 'Lorem ipsum dolor sit amet etic...',
      date: '23 Jan 2025',
      time: '09:15',
      coinType: 'red',
      orderNumber: 'TK129204',
      amount: 100,
      pointsAdded: 120,
      paymentMethod: 'PayPal',
    },
    {
      id: '4',
      title: 'Top Up',
      description: 'Lorem ipsum dolor sit amet etic...',
      date: '22 Jan 2025',
      time: '14:45',
      coinType: 'gold',
      orderNumber: 'TK129205',
      amount: 75,
      pointsAdded: 85,
      paymentMethod: 'ApplePay',
    },
  ];

  // Sample purchase data with additional fields for receipt
  const purchaseData: PurchaseItem[] = [
    {
      id: '1',
      title: 'Ask Me',
      description: 'What should I do if I want to start...',
      date: '25 Jan 2025',
      time: '10:00',
      orderNumber: 'TK129202',
      pointsCost: 15,
      service: 'Ask Affinity',
    },
    {
      id: '2',
      title: 'Ask Me',
      description: 'What should I do if I want to start...',
      date: '24 Jan 2025',
      time: '14:30',
      orderNumber: 'TK129206',
      pointsCost: 20,
      service: 'Ask Affinity',
    },
    {
      id: '3',
      title: 'Ask Me',
      description: 'What should I do if I want to start...',
      date: '23 Jan 2025',
      time: '09:15',
      orderNumber: 'TK129207',
      pointsCost: 15,
      service: 'Ask Affinity',
    },
    {
      id: '4',
      title: 'Ask Me',
      description: 'What should I do if I want to start...',
      date: '22 Jan 2025',
      time: '16:45',
      orderNumber: 'TK129208',
      pointsCost: 25,
      service: 'Ask Affinity',
    },
    {
      id: '5',
      title: 'Ask Me',
      description: 'What should I do if I want to start...',
      date: '21 Jan 2025',
      time: '11:20',
      orderNumber: 'TK129209',
      pointsCost: 15,
      service: 'Ask Affinity',
    },
    {
      id: '6',
      title: 'Ask Me',
      description: 'What should I do if I want to start...',
      date: '20 Jan 2025',
      time: '13:30',
      orderNumber: 'TK129210',
      pointsCost: 30,
      service: 'Ask Affinity',
    },
    {
      id: '7',
      title: 'Ask Me',
      description: 'What should I do if I want to start...',
      date: '19 Jan 2025',
      time: '08:45',
      orderNumber: 'TK129211',
      pointsCost: 15,
      service: 'Ask Affinity',
    },
  ];

  const handleTopUpPress = (item: TopUpItem) => {
    setSelectedTopUp(item);
    setTopUpModalVisible(true);
  };

  const handlePurchasePress = (item: PurchaseItem) => {
    setSelectedPurchase(item);
    setPurchaseModalVisible(true);
  };

  const closeTopUpModal = () => {
    setTopUpModalVisible(false);
    setSelectedTopUp(null);
  };

  const closePurchaseModal = () => {
    setPurchaseModalVisible(false);
    setSelectedPurchase(null);
  };

  const formatDateTime = (date: string, time: string) => {
    // Convert to a more detailed format for the receipt
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const [day, monthStr, year] = date.split(' ');
    const monthIndex = months.indexOf(monthStr);
    const monthName = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ][monthIndex];

    return `${day} ${monthName} ${year}, ${time} PM`;
  };

  const renderTopUpItem = ({item}: {item: TopUpItem}) => {
    return (
      <Pressable
        style={styles.purchaseItem}
        onPress={() => handleTopUpPress(item)}>
        <View style={styles.iconContainer}>
          <CartIcon size={24} />
        </View>
        <View style={styles.itemContent}>
          <View style={styles.topUpTitleRow}>
            <Text style={styles.itemTitle}>{item.title}</Text>
            <CoinIcon size={19} />
          </View>
          <Text style={styles.itemDescription}>{item.description}</Text>
        </View>
        <View style={styles.dateTimeContainer}>
          <Text style={styles.dateText}>
            {item.date} {item.time}
          </Text>
        </View>
      </Pressable>
    );
  };

  const renderPurchaseItem = ({item}: {item: PurchaseItem}) => (
    <Pressable
      style={styles.purchaseItem}
      onPress={() => handlePurchasePress(item)}>
      <View style={styles.iconContainer}>
        <CommentsIcon />
      </View>
      <View style={styles.itemContent}>
        <Text style={styles.itemTitle}>{item.title}</Text>
        <Text style={styles.itemDescription}>{item.description}</Text>
      </View>
      <View style={styles.dateTimeContainer}>
        <Text style={styles.dateText}>
          {item.date} {item.time}
        </Text>
      </View>
    </Pressable>
  );

  const TopUpReceiptModal = () => {
    if (!selectedTopUp) {
      return null;
    }

    const previousPoints = 150; // This could be calculated based on the item
    const totalPoints = previousPoints + (selectedTopUp.pointsAdded || 0);

    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={topUpModalVisible}
        onRequestClose={closeTopUpModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>RECEIPT</Text>
              <TouchableOpacity
                onPress={closeTopUpModal}
                style={styles.closeButton}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Receipt Details */}
            <View style={styles.receiptContent}>
              {/* Order Number */}
              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>Order Number</Text>
                <Text style={styles.receiptValue}>
                  {selectedTopUp.orderNumber}
                </Text>
              </View>

              {/* Date Purchased */}
              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>Date Purchased</Text>
                <Text style={styles.receiptValue}>
                  {formatDateTime(selectedTopUp.date, selectedTopUp.time)}
                </Text>
              </View>

              {/* Order Items */}
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Order Item(s)</Text>
              </View>

              <View style={styles.orderItem}>
                <View style={styles.orderItemLeft}>
                  <View style={styles.coinIconContainer}>
                    <CoinIcon size={16} />
                  </View>
                  <View>
                    <View
                      // eslint-disable-next-line react-native/no-inline-styles
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <Text style={styles.orderItemTitle}>
                        {selectedTopUp.pointsAdded}
                      </Text>
                      <CoinIcon size={16} />
                    </View>
                    <Text style={styles.orderItemSubtitle}>Value Pack</Text>
                  </View>
                </View>
                <Text style={styles.orderItemPrice}>
                  ${selectedTopUp.amount}
                </Text>
              </View>

              {/* Total */}
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>
                  Total: ${selectedTopUp.amount}
                </Text>
              </View>

              {/* Payment Method */}
              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>Payment Method</Text>
                <Text style={styles.receiptValue}>
                  {selectedTopUp.paymentMethod}
                </Text>
              </View>

              {/* Points Summary */}
              <View style={styles.pointsSection}>
                <View style={styles.pointsRow}>
                  <Text style={styles.pointsLabel}>Previous Points</Text>
                  <View style={styles.pointsValueContainer}>
                    <Text style={styles.pointsValue}>{previousPoints}</Text>
                    <CoinIcon size={16} />
                  </View>
                </View>

                <View style={styles.pointsRow}>
                  <Text style={styles.pointsLabel}>Points Added</Text>
                  <View style={styles.pointsValueContainer}>
                    <Text style={[styles.pointsValue, styles.pointsAdded]}>
                      +{selectedTopUp.pointsAdded}
                    </Text>
                    <CoinIcon size={16} />
                  </View>
                </View>

                <View style={styles.pointsRow}>
                  <Text style={styles.pointsLabel}>Total Points</Text>
                  <View style={styles.pointsValueContainer}>
                    <Text style={styles.pointsValue}>{totalPoints}</Text>
                    <CoinIcon size={16} />
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const PurchaseReceiptModal = () => {
    if (!selectedPurchase) {
      return null;
    }

    const previousPoints = 150; // This could be calculated based on the item
    const remainingPoints = previousPoints - (selectedPurchase.pointsCost || 0);

    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={purchaseModalVisible}
        onRequestClose={closePurchaseModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>RECEIPT</Text>
              <TouchableOpacity
                onPress={closePurchaseModal}
                style={styles.closeButton}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Receipt Details */}
            <View style={styles.receiptContent}>
              {/* Order Number */}
              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>Order Number</Text>
                <Text style={styles.receiptValue}>
                  {selectedPurchase.orderNumber}
                </Text>
              </View>

              {/* Date Purchased */}
              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>Date Purchased</Text>
                <Text style={styles.receiptValue}>
                  {formatDateTime(selectedPurchase.date, selectedPurchase.time)}
                </Text>
              </View>

              {/* Order Items */}
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Order Item(s)</Text>
              </View>

              <View style={styles.orderItem}>
                <View style={styles.orderItemLeft}>
                  <View style={styles.serviceIconContainer}>
                    <CommentsIcon size={16} />
                  </View>
                  <View>
                    <Text style={styles.orderItemTitle}>
                      {selectedPurchase.service}
                    </Text>
                  </View>
                </View>
                <View style={styles.pointsValueContainer}>
                  <Text style={styles.orderItemPrice}>
                    {selectedPurchase.pointsCost}
                  </Text>
                  <CoinIcon size={16} />
                </View>
              </View>

              {/* Total */}
              <View style={styles.totalRow}>
                <View style={styles.pointsValueContainer}>
                  <Text style={styles.totalLabel}>
                    Total: {selectedPurchase.pointsCost}
                  </Text>
                  <CoinIcon size={16} />
                </View>
              </View>

              {/* Points Summary */}
              <View style={styles.pointsSection}>
                <View style={styles.pointsRow}>
                  <Text style={styles.pointsLabel}>Previous Points</Text>
                  <View style={styles.pointsValueContainer}>
                    <Text style={styles.pointsValue}>{previousPoints}</Text>
                    <CoinIcon size={16} />
                  </View>
                </View>

                <View style={styles.pointsRow}>
                  <Text style={styles.pointsLabel}>Points Used</Text>
                  <View style={styles.pointsValueContainer}>
                    <Text style={[styles.pointsValue, styles.pointsUsed]}>
                      -{selectedPurchase.pointsCost}
                    </Text>
                    <CoinIcon size={16} />
                  </View>
                </View>

                <View style={styles.pointsRow}>
                  <Text style={styles.pointsLabel}>Remaining Points</Text>
                  <View style={styles.pointsValueContainer}>
                    <Text style={styles.pointsValue}>{remainingPoints}</Text>
                    <CoinIcon size={16} />
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

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
        <FlatList
          data={purchaseData}
          renderItem={renderPurchaseItem}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          ListHeaderComponent={<></>}
          ListFooterComponent={<></>}
        />
      ) : (
        <FlatList
          data={topUpData}
          renderItem={renderTopUpItem}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          ListHeaderComponent={<></>}
          ListFooterComponent={<></>}
        />
      )}

      {/* Receipt Modals */}
      <TopUpReceiptModal />
      <PurchaseReceiptModal />
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
  listContainer: {
    paddingBottom: 20,
  },
  purchaseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F8F8F8',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  icon: {
    fontSize: 18,
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
    marginRight: 8,
    fontFamily: fontFamilies.ARCHIVO.light,
  },
  itemDescription: {
    fontSize: 14,
    color: '#666',
    fontFamily: fontFamilies.ARCHIVO.light,
  },
  dateTimeContainer: {
    alignItems: 'flex-end',
  },
  dateText: {
    fontSize: 12,
    color: '#999',
    fontFamily: fontFamilies.ARCHIVO.light,
  },
  topUpTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  coinIcon: {
    fontSize: 16,
    marginLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    fontFamily: fontFamilies.ARCHIVO.light,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    position: 'relative',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#D4A574',
    fontFamily: fontFamilies.ARCHIVO.light,
    letterSpacing: 2,
  },
  closeButton: {
    position: 'absolute',
    right: 20,
    top: 20,
    width: 20,
    height: 20,
    borderRadius: 15,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  receiptContent: {
    padding: 20,
  },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  receiptLabel: {
    fontSize: 14,
    color: '#666',
    fontFamily: fontFamilies.ARCHIVO.light,
  },
  receiptValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    fontFamily: fontFamilies.ARCHIVO.light,
  },
  sectionHeader: {
    marginTop: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    color: '#666',
    fontFamily: fontFamilies.ARCHIVO.light,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
    marginBottom: 10,
  },
  orderItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  coinIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  orderItemTitle: {
    fontSize: 14,
    marginRight: 4,
    fontWeight: '600',
    color: '#333',
    fontFamily: fontFamilies.ARCHIVO.light,
  },
  orderItemSubtitle: {
    fontSize: 12,
    color: '#666',
    fontFamily: fontFamilies.ARCHIVO.light,
  },
  orderItemPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    fontFamily: fontFamilies.ARCHIVO.light,
  },
  totalRow: {
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    fontFamily: fontFamilies.ARCHIVO.light,
  },
  pointsSection: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 16,
  },
  pointsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  pointsLabel: {
    fontSize: 14,
    color: '#666',
    fontFamily: fontFamilies.ARCHIVO.light,
  },
  pointsValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pointsValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    marginRight: 4,
    fontFamily: fontFamilies.ARCHIVO.light,
  },
  pointsAdded: {
    color: '#4CAF50',
  },
  pointsUsed: {
    color: '#F44336',
  },
  serviceIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
});

export default PurchaseHistory;
