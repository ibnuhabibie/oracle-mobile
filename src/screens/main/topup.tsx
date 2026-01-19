import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { FC, useEffect, useState } from 'react';
import { Pressable, StyleSheet, View, ActivityIndicator, Alert, TouchableOpacity, Platform } from 'react-native';
import {
    initPaymentSheet,
    presentPaymentSheet,
} from '@stripe/stripe-react-native';
import * as RNLocalize from "react-native-localize";
import { useTranslation } from 'react-i18next';

import { MainNavigatorParamList } from '../../navigators/types';
import ScreenContainer from '../../components/layouts/screen-container';
import Header from '../../components/ui/header';
import { AppText } from '../../components/ui/app-text';
import api from '../../utils/http';
import { AppButton } from '../../components/ui/app-button';
import { COLORS } from '../../constants/colors';
import CoinIcon from '../../components/icons/profile/coin-icon';
import { scaleFont, scaleSize } from '../../utils/scale';
import { useAsyncStorage } from '../../hooks/use-storage';
import { getLocaleByCountryCode } from '../../utils/platform';
import { getPricingVariant, getTranslateByKey } from '../../utils/string';
import Purchases from 'react-native-purchases';


type TopupProps = NativeStackScreenProps<MainNavigatorParamList, 'TopUp'>;

interface TranslationItem {
    key: string;
    value: string;
    locale: string;
}

interface PricingVariantItem {
    pricing_variant_id: number;
    locale: string;
    currency_symbol: string;
    price: string;
    stripe_price_id: string;
}


interface SubscriptionItem {
    subscription_id: number;
    name: string;
    description: string;
    price: string;
    duration_months: number;
    credits: number;
    rc_package_id: string;
    is_active: boolean;
    translations?: TranslationItem[];
    pricing_variants?: PricingVariantItem[];
}

const Coin = ({ type = 'silver' }) => (
    <CoinIcon size={scaleSize(16, 14, 19)} type={type === 'silver' ? 'silver' : 'gold'} />
);

const RadioIndicator = ({ selected }: { selected: boolean }) => (
    <View style={[styles.radioOuter, selected && styles.radioOuterSelected]}>
        {selected ? <View style={styles.radioInner} /> : null}
    </View>
);

// Subscription card list component
interface SubscriptionCardListProps {
    subscriptions: SubscriptionItem[];
    selectedSubscription: SubscriptionItem | null;
    setSelectedSubscription: (sub: SubscriptionItem) => void;
    loading: boolean;
    error: string | null;
    locale: string;
}

const SubscriptionCard = ({ subscription, onPress, locale, selectedSubscription }) => {
    const { t } = useTranslation();

    const name = getTranslateByKey(subscription.translations, 'name', locale)
    const description = getTranslateByKey(subscription.translations, 'description', locale)
    const price = getPricingVariant(subscription.pricing_variants, locale)

    return (
        <Pressable
            key={subscription.subscription_id}
            style={[
                styles.card,
                selectedSubscription === subscription && styles.cardSelected
            ]}
            onPress={onPress}
        >
            {
                onPress !== null && (<RadioIndicator selected={selectedSubscription === subscription} />)
            }
            <View style={{ flex: 1 }}>
                <AppText variant='body1' style={styles.cardTitle} color='white'>
                    {name}
                </AppText>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: scaleSize(2) }}>
                    <AppText variant='caption1' color='neutral'>{t('topup.getCoins', { count: subscription.credits })} </AppText>
                    <Coin type='gold' />
                </View>
                <AppText style={{ marginTop: scaleSize(2) }} color='neutral'>{description}</AppText>
            </View>
            <AppText variant='subtitle1' color='primary' style={styles.cardPrice}>
                {price}
            </AppText>
        </Pressable>
    )
}

const SubscriptionCardList: FC<SubscriptionCardListProps> = ({ subscriptions, selectedSubscription, setSelectedSubscription, loading, error, locale }) => {
    const { t } = useTranslation();
    const RenderItem = () => {
        if (loading)
            return <ActivityIndicator size="small" color="#D4A574" style={{ marginVertical: scaleSize(12, 12, 16) }} />

        if (error)
            return <AppText style={{ color: 'red', marginVertical: scaleSize(12, 12, 16) }}>{t(error)}</AppText>

        return (
            subscriptions.map(sub => {
                return (
                    <SubscriptionCard
                        key={sub.subscription_id}
                        locale={locale}
                        subscription={sub}
                        onPress={() => setSelectedSubscription(sub)}
                        selectedSubscription={selectedSubscription} />
                )
            })
        )
    }
    return (
        <View>
            <AppText variant='subtitle1' color='primary' style={styles.sectionTitle}>{t('topup.ourSubscriptions')}</AppText>
            <AppText variant='caption1' style={styles.sectionDesc} color='neutral'>
                {t('topup.subscriptionsDesc')}
            </AppText>
            <View style={{ marginTop: scaleSize(8, 8, 12) }}>
                <RenderItem />
            </View>
        </View>
    );
};

const Topup: FC<TopupProps> = ({ navigation }) => {
    const { t } = useTranslation();
    const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
    const [selectedSubscription, setSelectedSubscription] = useState<SubscriptionItem | null>(null);
    const [subscriptions, setSubscriptions] = useState<SubscriptionItem[]>([]);
    const [loadingSubscriptions, setLoadingSubscriptions] = useState<boolean>(true);
    const [errorSubscriptions, setErrorSubscriptions] = useState<string | null>(null);

    const [processing, setProcessing] = useState<boolean>(false);
    const [userSubscriptionId, setUserSubscriptionId] = useState<number | null>(null);
    const [locale, setLocale] = useState<string>('');

    const [offering, setOffering] = useState<any>(null);

    const OFFERING_ID = 'credits_subscription';

    const { getUserProfile } = useAsyncStorage();

    const fetchSubscriptions = async () => {
        setLoadingSubscriptions(true);
        setErrorSubscriptions(null);
        try {
            const response = await api.get(`/v1/subscriptions`);
            setSubscriptions(response.data.rows || []);
        } catch (err) {
            setErrorSubscriptions('topup.failedToLoadSubscriptions');
        } finally {
            setLoadingSubscriptions(false);
        }
    };

    const loadOfferings = async () => {
        try {
            const offerings = await Purchases.getOfferings();
            const targetOffering = offerings.all[OFFERING_ID];

            if (!targetOffering) {
                throw new Error(`Offering "${OFFERING_ID}" not found`);
            }

            console.log('Loaded offerings:', targetOffering);
            setOffering(targetOffering);
        } catch (error) {
            console.log('Error fetching offerings:', error);
        }
    }

    useEffect(() => {
        const init = async () => {
            await loadOfferings();

            const countryCode = RNLocalize.getCountry();
            const locale = getLocaleByCountryCode(countryCode);

            console.log(countryCode, locale, 'topup')
            // const locale = await getLocale();
            setLocale(locale);

            // await fetchPackages(newLocale);
            await fetchSubscriptions();
            // Get user profile and subscription_id
            const profile = await getUserProfile();
            if (profile && typeof profile === 'object' && 'subscription_id' in profile) {
                setUserSubscriptionId(
                    typeof profile.subscription_id === 'number' ? profile.subscription_id : null
                );
            }
        };
        init();
    }, []);

    const openPaymentSheet = async (clientSecret: string) => {
        const { error: errorInit } = await initPaymentSheet({
            paymentIntentClientSecret: clientSecret,
            merchantDisplayName: 'Affinity AI',
        });

        if (errorInit) {
            Alert.alert(t('topup.paymentFailed'), errorInit.message);
        }

        const { error } = await presentPaymentSheet();

        if (error) {
            console.log(error)
            Alert.alert(t('topup.paymentFailed'), error.message);
        } else {
            Alert.alert(
                t('topup.success'),
                t('topup.paymentComplete'),
                [
                    {
                        text: t('topup.ok'),
                        onPress: () => navigation.navigate('Tabs' as any, { screen: 'Profile' })
                    }
                ]
            );
        }
    };

    // Mutually exclusive selection handlers
    // const handleSelectPackage = (id: number) => {
    //     setSelectedPackage(id);
    //     setSelectedSubscription(null);
    // };

    const handleSelectSubscription = (sub: SubscriptionItem) => {
        setSelectedSubscription(sub);
        setSelectedPackage(null);
    };

    const handleContinue = async () => {
        try {

            const pkg = offering?.availablePackages.find(p => p.product.identifier === selectedSubscription?.rc_package_id);
            console.log('handleContinue', selectedSubscription, pkg)

            if (!pkg) {
                Alert.alert(t('topup.error'), t('topup.selectSubscription'));
                return;
            }
            const purchasePackage = await Purchases.purchasePackage(pkg);
            console.log('purchasePackage', purchasePackage)

            Alert.alert(
                t('topup.success'),
                t('topup.paymentComplete'),
                [
                    {
                        text: t('topup.ok'),
                        onPress: () => navigation.navigate('Tabs' as any, { screen: 'Profile' })
                    }
                ]
            );

        } catch (err: any) {

            if (err.userCancelled) {
                console.log('User cancelled the purchase');
                return;
            }

            console.log(err, 'err')
            Alert.alert(t('topup.error'), err?.message || t('topup.genericError'));
        }
    }

    const handleContinueStripe = async () => {
        try {
            setProcessing(true);
            let client_secret = null
            if (selectedPackage !== null) {
                const res = await api.post('/v1/payments/topup', { package_id: selectedPackage });
                console.log('res', res)
                client_secret = res.data.client_secret;
                // Alert.alert('Success', 'Top up successful!');
            } else if (selectedSubscription !== null) {
                const res = await api.post('/v1/payments/subscribe', {
                    subscription_id: selectedSubscription,
                    locale: locale
                });
                client_secret = res.data.client_secret
                // Alert.alert('Success', 'Subscription successful!');
            }

            await openPaymentSheet(client_secret)
        } catch (err: any) {
            console.log(err, 'err')
            Alert.alert(t('topup.error'), err?.meta?.message || t('topup.genericError'));
        } finally {
            setProcessing(false);
        }
    };

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

    const handleCancelStripeSubscription = async () => {
        try {
            setProcessing(true);
            await api.post(`/v1/users/subscription/cancel`);
            Alert.alert(
                t('topup.success'),
                t('topup.subscriptionCancelled'),
                [
                    {
                        text: t('topup.ok'),
                        onPress: () => {
                            setUserSubscriptionId(null);
                            navigation.navigate('Tabs' as any, { screen: 'Profile' });
                        }
                    }
                ]
            );
        } catch (err: any) {
            Alert.alert(t('topup.error'), err?.response?.data?.message || t('topup.genericError'));
        } finally {
            setProcessing(false);
        }
    };

    const handleRestorePurchases = async () => {
        try {
            setProcessing(true);
            const purchaserInfo = await Purchases.restorePurchases();
            console.log('Purchases restored:', purchaserInfo);

            // Refresh user profile to get updated subscription status
            const profile = await getUserProfile();
            if (profile && typeof profile === 'object' && 'subscription_id' in profile) {
                setUserSubscriptionId(
                    typeof profile.subscription_id === 'number' ? profile.subscription_id : null
                );
            }

            // Calculate total purchases count
            const totalCount = purchaserInfo.allPurchasedProductIdentifiers?.length || 0;

            // Use simplified message
            const message = totalCount > 0
                ? t('topup.restorePurchasesSuccess', { count: totalCount })
                : t('topup.noPurchasesFound');

            Alert.alert(
                t('topup.success'),
                message,
                [
                    {
                        text: t('topup.ok'),
                        onPress: () => navigation.navigate('Tabs' as any, { screen: 'Profile' })
                    }
                ]
            );
        } catch (err: any) {
            console.log('Restore purchases error:', err);
            Alert.alert(t('topup.error'), err?.message || t('topup.genericError'));
        } finally {
            setProcessing(false);
        }
    };

    // Active subscription component
    interface ActiveSubscriptionProps {
        subscription: SubscriptionItem;
        locale: string;
        onCancelSubscription: () => void;
        loading: boolean;
    }

    const ActiveSubscription: FC<ActiveSubscriptionProps> = ({ subscription, locale, onCancelSubscription, loading }) => {
        const { t } = useTranslation();

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

                <AppButton title={t('topup.cancelSubscription')} onPress={handleCancelSubscription} loading={processing} />
            </View>
        );
    };

    const RenderListOrActiveSubscription = () => {
        console.log(userSubscriptionId, 'userSubscriptionId')

        if (userSubscriptionId == null) {
            return <SubscriptionCardList
                subscriptions={subscriptions}
                selectedSubscription={selectedSubscription}
                setSelectedSubscription={handleSelectSubscription}
                loading={loadingSubscriptions}
                error={errorSubscriptions}
                locale={locale}
            />;
        } else {
            // Find the active subscription
            const activeSubscription = subscriptions.find(sub => sub.subscription_id === userSubscriptionId);
            return activeSubscription ? <ActiveSubscription
                subscription={activeSubscription}
                locale={locale}
                onCancelSubscription={handleCancelSubscription}
                loading={processing}
            /> : null;
        }
    };

    return (
        <ScreenContainer
            scrollable={true}
            floatingFooter={
                <View style={{ backgroundColor: "#121010" }}>
                    {(selectedPackage !== null || selectedSubscription !== null) && (
                        <AppButton
                            title={processing ? t("topup.processing") : t("topup.continue")}
                            variant="primary"
                            disabled={processing}
                            onPress={handleContinue}
                        />
                    )}
                    {Platform.OS === 'ios' && (
                        <AppButton
                            title={t("topup.restorePurchases")}
                            variant="outline"
                            disabled={processing}
                            onPress={handleRestorePurchases}
                            style={{ marginTop: scaleSize(4) }}
                        />
                    )}
                </View>
            }
            header={
                <Header
                    title={t("topup.title")}
                    onBack={() => navigation.goBack()}
                />
            }
        >
            <RenderListOrActiveSubscription />
            <View style={{ height: scaleSize(60, 60, 80) }}></View>
        </ScreenContainer>
    );
};

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
        borderColor: 'transparent'
    },
    cardSelected: {
        borderColor: '#D4A574',
    },
    cardBestValue: {
        borderColor: COLORS.neutral,
        backgroundColor: '#FDF7F0',
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
    bestValueBadge: {
        backgroundColor: '#F5E1C6',
        borderRadius: scaleSize(4, 4, 6),
        paddingHorizontal: scaleSize(4, 4, 6),
        paddingVertical: scaleSize(2),
        marginLeft: scaleSize(6, 6, 8),
        fontSize: scaleFont(10, 8, 14),
    },
    // Active subscription styles
    activeSubscriptionContainer: {
        marginBottom: scaleSize(16, 16, 24),
    },
    activeSubscriptionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: scaleSize(8, 8, 12),
    },
    cancelButton: {
        padding: scaleSize(4, 4, 8),
    },
    cancelButtonText: {
        color: COLORS.red,
        fontWeight: '600',
    },
    activeSubscriptionContent: {
        flex: 1,
        alignItems: 'center'
    },
    restoreButton: {
        paddingVertical: scaleSize(12, 12, 16),
        alignItems: 'center',
        justifyContent: 'center',
    },
    restoreButtonWithMargin: {
        marginTop: scaleSize(8, 8, 12),
    },
    restoreButtonText: {
        fontSize: scaleFont(14, 12, 16),
    },
});

export default Topup;
