import React from 'react';
import { View, ActivityIndicator, Alert, StyleSheet, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '../../../components/ui/app-text';
import CoinIcon from '../../../components/icons/profile/coin-icon';
import { scaleSize, scaleFont } from '../../../utils/scale';
import { getTranslateByKey, getPricingVariant } from '../../../utils/string';

import type {
  CoinProps,
  RadioIndicatorProps,
  SubscriptionCardProps,
  SubscriptionCardListProps,
  ActiveSubscriptionProps,
} from './types';
import { AppButton } from '../../../components/ui/app-button';
import Purchases from 'react-native-purchases';
import { COLORS } from '../../../constants/colors';

const styles = StyleSheet.create({
  sectionTitle: {
    marginBottom: scaleSize(2),
    fontSize: scaleFont(16, 12, 20),
  },
  sectionDesc: {
    marginBottom: scaleSize(2),
    fontSize: scaleFont(12, 10, 16),
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderRadius: scaleSize(8, 8, 12),
    padding: scaleSize(12, 12, 16),
    marginBottom: scaleSize(8, 8, 12),
    borderWidth: scaleSize(1),
    borderColor: 'transparent',
  },
  cardSelected: {
    borderColor: '#D4A574',
  },
  cardTitle: {
    fontWeight: '600',
    fontSize: scaleFont(14, 12, 18),
  },
  cardPrice: {
    fontWeight: 'bold',
    marginLeft: scaleSize(8, 8, 12),
    fontSize: scaleFont(14, 12, 18),
  },
  radioOuter: {
    width: scaleSize(16, 14, 22),
    height: scaleSize(16, 14, 22),
    borderRadius: scaleSize(8, 8, 11),
    borderWidth: scaleSize(2),
    borderColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: scaleSize(8, 8, 14),
    backgroundColor: 'rgba(255,255,255,0.14)',
  },
  radioOuterSelected: {
    borderColor: COLORS.primary,
  },
  radioInner: {
    width: scaleSize(6, 6, 10),
    height: scaleSize(6, 6, 10),
    borderRadius: scaleSize(3, 3, 5),
    backgroundColor: '#D4A574',
  },
  activeSubscriptionContainer: {
    marginBottom: scaleSize(16, 16, 24),
  },
});

export const Coin: React.FC<CoinProps> = ({ type = 'silver' }) => (
  <CoinIcon size={scaleSize(16, 14, 19)} type={type === 'silver' ? 'silver' : 'gold'} />
);

export const RadioIndicator: React.FC<RadioIndicatorProps> = ({ selected }) => (
  <View style={[styles.radioOuter, selected && styles.radioOuterSelected]}>
    {selected ? <View style={styles.radioInner} /> : null}
  </View>
);

export const SubscriptionCard: React.FC<SubscriptionCardProps> = ({ subscription, onPress, locale, selectedSubscription }) => {
  const { t } = useTranslation();

  const name = getTranslateByKey(subscription.translations, 'name', locale);
  const description = getTranslateByKey(subscription.translations, 'description', locale);
  const price = getPricingVariant(subscription.pricing_variants, locale);

  return (
    <Pressable
      key={subscription.subscription_id}
      onPress={onPress || undefined}
      style={[
        styles.card,
        selectedSubscription === subscription && styles.cardSelected,
      ]}>
      {onPress !== null && <RadioIndicator selected={selectedSubscription === subscription} />}
      <View style={{ flex: 1 }}>
        <AppText variant="body1" style={styles.cardTitle} color="white">
          {name}
        </AppText>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: scaleSize(2) }}>
          <AppText variant="caption1" color="neutral">
            {t('topup.getCoins', { count: subscription.credits })}
          </AppText>
          <Coin type="gold" />
        </View>
        <AppText style={{ marginTop: scaleSize(2) }} color="neutral">
          {description}
        </AppText>
      </View>
      <AppText variant="subtitle1" color="primary" style={styles.cardPrice}>
        {price}
      </AppText>
    </Pressable>
  );
};

export const SubscriptionCardList: React.FC<SubscriptionCardListProps> = ({
  subscriptions,
  selectedSubscription,
  setSelectedSubscription,
  loading,
  error,
  locale,
}) => {
  const { t } = useTranslation();

  const RenderItem = () => {
    if (loading)
      return <ActivityIndicator size="small" color="#D4A574" style={{ marginVertical: scaleSize(12, 12, 16) }} />;

    if (error)
      return <AppText style={{ color: 'red', marginVertical: scaleSize(12, 12, 16) }}>{t(error)}</AppText>;

    return (
      subscriptions.map((sub) => {
        return (
          <SubscriptionCard
            key={sub.subscription_id}
            locale={locale}
            subscription={sub}
            onPress={() => {
              console.log('press', sub)
              setSelectedSubscription(sub)
            }}
            selectedSubscription={selectedSubscription}
          />
        );
      })
    );
  };

  return (
    <View>
      <AppText variant="subtitle1" color="primary" style={styles.sectionTitle}>
        {t('topup.ourSubscriptions')}
      </AppText>
      <AppText variant="caption1" style={styles.sectionDesc} color="neutral">
        {t('topup.subscriptionsDesc')}
      </AppText>
      <View style={{ marginTop: scaleSize(8, 8, 12) }}>
        <RenderItem />
      </View>
    </View>
  );
};

// Active subscription component
export const ActiveSubscription: React.FC<ActiveSubscriptionProps> = ({ subscription, locale, loading }) => {
  const { t } = useTranslation();

  const handleCancelSubscription = async () => {
    Alert.alert(
      t('topup.manageSubscription'),
      t('topup.manageSubscriptionDesc'),
      [
        { text: t('topup.cancel'), style: 'cancel' },
        {
          text: t('topup.openStore'),
          onPress: () => Purchases.showManageSubscriptions(),
        },
      ]
    );
  }

  return (
    <View style={styles.activeSubscriptionContainer}>
      <AppText variant='subtitle1' color='primary' style={styles.sectionTitle}>
        {t('topup.activeSubscriptionTitle')}
      </AppText>
      <AppText
        variant='caption1' style={[
          styles.sectionDesc, { marginBottom: 12 }
        ]}
        color='neutral'>
        {t('topup.activeSubscriptionSubtitle')}
      </AppText>

      <SubscriptionCard
        subscription={subscription}
        onPress={null}
        locale={locale}
        selectedSubscription={null} />

      <AppButton title={t('topup.cancelSubscription')} onPress={handleCancelSubscription} loading={loading} />
    </View>
  );
};