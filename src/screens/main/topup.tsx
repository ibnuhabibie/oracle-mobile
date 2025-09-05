import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { FC, useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View, ActivityIndicator, Alert } from 'react-native';
import {
    initPaymentSheet,
    presentPaymentSheet,
} from '@stripe/stripe-react-native';


import { MainNavigatorParamList } from '../../navigators/types';
import ScreenContainer from '../../components/layouts/screen-container';
import Header from '../../components/ui/header';
import { AppText } from '../../components/ui/app-text';
import api from '../../utils/http';
import { AppButton } from '../../components/ui/app-button';
import { COLORS } from '../../constants/colors';
import { fontFamilies } from '../../constants/fonts';
import CoinIcon from '../../components/icons/profile/coin-icon';
import { scaleFont, scaleSize } from '../../utils/scale';
import { useTranslation } from 'react-i18next';
import { useAsyncStorage } from '../../hooks/use-storage';

type TopupProps = NativeStackScreenProps<MainNavigatorParamList, 'TopUp'>;

interface PackageItem {
    package_id: number;
    name: string;
    description: string;
    price: string;
    credits: number;
    is_active: boolean;
}

interface SubscriptionItem {
    subscription_id: number;
    name: string;
    description: string;
    price: string;
    duration_months: number;
    credits: number;
    is_active: boolean;
}

const Coin = ({ type = 'silver' }) => (
    <CoinIcon size={scaleSize(16, 14, 19)} color={type === 'silver' ? "#EB4335" : "#E0AE1E"} />
);

const RadioIndicator = ({ selected }: { selected: boolean }) => (
    <View style={[styles.radioOuter, selected && styles.radioOuterSelected]}>
        {selected ? <View style={styles.radioInner} /> : null}
    </View>
);

// Package card list component
const PackageCardList: FC<{
    packages: PackageItem[];
    selectedPackage: number | null;
    setSelectedPackage: (id: number) => void;
    loading: boolean;
    error: string | null;
}> = ({ packages, selectedPackage, setSelectedPackage, loading, error }) => {
    const { t } = useTranslation();
    return (
        <View style={{ marginBottom: scaleSize(18, 18, 24) }}>
            <AppText variant='subtitle1' color='primary' style={styles.sectionTitle}>{t('OUR PACKAGES')}</AppText>
            <AppText variant='caption1' style={styles.sectionDesc} color='neutral'>{t('PACKAGES DESC')}</AppText>
            <View style={{ marginTop: scaleSize(8, 8, 12) }}>
                {loading ? (
                    <ActivityIndicator size="small" color="#D4A574" style={{ marginVertical: scaleSize(12, 12, 16) }} />
                ) : error ? (
                    <AppText style={{ color: 'red', marginVertical: scaleSize(12, 12, 16) }}>{t(error)}</AppText>
                ) : (
                    packages.map(pkg => (
                        <Pressable
                            key={pkg.package_id}
                            style={[
                                styles.card,
                                selectedPackage === pkg.package_id && styles.cardSelected
                            ]}
                            onPress={() => setSelectedPackage(pkg.package_id)}
                        >
                            <RadioIndicator selected={selectedPackage === pkg.package_id} />
                            <View style={{ flex: 1 }}>
                                <AppText variant='body1' style={styles.cardTitle} color='white'>{pkg.name}</AppText>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: scaleSize(2) }}>
                                    <AppText variant='caption1' color='neutral'>{t('GET COINS', { count: pkg.credits })} </AppText>
                                    <Coin />
                                </View>
                                {pkg.description ? (
                                    <AppText style={{ marginTop: scaleSize(2) }} color='neutral'>{pkg.description}</AppText>
                                ) : null}
                            </View>
                            <AppText variant='subtitle1' color='primary' style={styles.cardPrice}>${parseFloat(pkg.price)}</AppText>
                        </Pressable>
                    ))
                )}
            </View>
        </View>
    );
};

// Subscription card list component
const SubscriptionCardList: FC<{
    subscriptions: SubscriptionItem[];
    selectedSubscription: number | null;
    setSelectedSubscription: (id: number) => void;
    loading: boolean;
    error: string | null;
}> = ({ subscriptions, selectedSubscription, setSelectedSubscription, loading, error }) => {
    const { t } = useTranslation();
    return (
        <View>
            <AppText variant='subtitle1' color='primary' style={styles.sectionTitle}>{t('OUR SUBSCRIPTIONS')}</AppText>
            <AppText variant='caption1' style={styles.sectionDesc} color='neutral'>
                {t('SUBSCRIPTIONS DESC')}
            </AppText>
            <View style={{ marginTop: scaleSize(8, 8, 12) }}>
                {loading ? (
                    <ActivityIndicator size="small" color="#D4A574" style={{ marginVertical: scaleSize(12, 12, 16) }} />
                ) : error ? (
                    <AppText style={{ color: 'red', marginVertical: scaleSize(12, 12, 16) }}>{t(error)}</AppText>
                ) : (
                    subscriptions.map(sub => (
                        <Pressable
                            key={sub.subscription_id}
                            style={[
                                styles.card,
                                selectedSubscription === sub.subscription_id && styles.cardSelected
                            ]}
                            onPress={() => setSelectedSubscription(sub.subscription_id)}
                        >
                            <RadioIndicator selected={selectedSubscription === sub.subscription_id} />
                            <View style={{ flex: 1 }}>
                                <AppText variant='body1' style={styles.cardTitle} color='white'>{sub.name}</AppText>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: scaleSize(2) }}>
                                    <AppText variant='caption1' color='neutral'>{t('GET COINS', { count: sub.credits })} </AppText>
                                    <Coin type='gold' />
                                </View>
                                {sub.description ? (
                                    <AppText style={{ marginTop: scaleSize(2) }} color='neutral'>{sub.description}</AppText>
                                ) : null}
                            </View>
                            <AppText variant='subtitle1' color='primary' style={styles.cardPrice}>${parseFloat(sub.price)}</AppText>
                        </Pressable>
                    ))
                )}
            </View>
        </View>
    );
};

const Topup: FC<TopupProps> = ({ navigation }) => {
    const { t } = useTranslation();
    const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
    const [selectedSubscription, setSelectedSubscription] = useState<number | null>(null);
    const [packages, setPackages] = useState<PackageItem[]>([]);
    const [subscriptions, setSubscriptions] = useState<SubscriptionItem[]>([]);
    const [loadingPackages, setLoadingPackages] = useState<boolean>(true);
    const [loadingSubscriptions, setLoadingSubscriptions] = useState<boolean>(true);
    const [errorPackages, setErrorPackages] = useState<string | null>(null);
    const [errorSubscriptions, setErrorSubscriptions] = useState<string | null>(null);
    const [processing, setProcessing] = useState<boolean>(false);
    const [userSubscriptionId, setUserSubscriptionId] = useState<number | null>(null);

    const { getUserProfile } = useAsyncStorage();

    const fetchPackages = async () => {
        setLoadingPackages(true);
        setErrorPackages(null);
        try {
            const response = await api.get('/v1/packages');
            setPackages(response.data.rows || []);
        } catch (err) {
            setErrorPackages('FAILED TO LOAD PACKAGES');
        } finally {
            setLoadingPackages(false);
        }
    };

    const fetchSubscriptions = async () => {
        setLoadingSubscriptions(true);
        setErrorSubscriptions(null);
        try {
            const response = await api.get('/v1/subscriptions');
            setSubscriptions(response.data.rows || []);
        } catch (err) {
            setErrorSubscriptions('FAILED TO LOAD SUBSCRIPTIONS');
        } finally {
            setLoadingSubscriptions(false);
        }
    };

    useEffect(() => {
        const init = async () => {
            await fetchPackages();
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
            merchantDisplayName: 'Your App Name',
        });

        if (errorInit) {
            Alert.alert(t('PAYMENT FAILED'), errorInit.message);
        }

        const { error } = await presentPaymentSheet();

        if (error) {
            console.log(error)
            Alert.alert(t('PAYMENT FAILED'), error.message);
        } else {
            Alert.alert(t('SUCCESS'), t('PAYMENT COMPLETE'));
        }
    };

    // Mutually exclusive selection handlers
    const handleSelectPackage = (id: number) => {
        setSelectedPackage(id);
        setSelectedSubscription(null);
    };

    const handleSelectSubscription = (id: number) => {
        setSelectedSubscription(id);
        setSelectedPackage(null);
    };

    const handleContinue = async () => {
        try {
            setProcessing(true);
            let client_secret = null
            if (selectedPackage !== null) {
                const res = await api.post('/v1/payments/topup', { package_id: selectedPackage });
                console.log('res', res)
                client_secret = res.data.client_secret;
                // Alert.alert('Success', 'Top up successful!');
            } else if (selectedSubscription !== null) {
                const res = await api.post('/v1/payments/subscribe', { subscription_id: selectedSubscription });
                client_secret = res.data.client_secret
                // Alert.alert('Success', 'Subscription successful!');
            }

            await openPaymentSheet(client_secret)
        } catch (err: any) {
            Alert.alert(t('ERROR'), err?.response?.data?.message || t('GENERIC ERROR'));
        } finally {
            setProcessing(false);
        }
    };

    return (
        <ScreenContainer
            scrollable={true}
            floatingFooter={
                (selectedPackage !== null || selectedSubscription !== null) && (
                    <View style={{ backgroundColor: "#121010" }}>
                        <AppButton
                            title={processing ? t("PROCESSING") : t("CONTINUE")}
                            variant="primary"
                            disabled={processing}
                            onPress={handleContinue}
                        />
                    </View>
                )
            }
            header={
                <Header
                    title={t("TOP UP")}
                    onBack={() => navigation.goBack()}
                />
            }
        >
            <PackageCardList
                packages={packages}
                selectedPackage={selectedPackage}
                setSelectedPackage={handleSelectPackage}
                loading={loadingPackages}
                error={errorPackages}
            />
            {userSubscriptionId == null && (
                <SubscriptionCardList
                    subscriptions={subscriptions}
                    selectedSubscription={selectedSubscription}
                    setSelectedSubscription={handleSelectSubscription}
                    loading={loadingSubscriptions}
                    error={errorSubscriptions}
                />
            )}
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
});

export default Topup;
