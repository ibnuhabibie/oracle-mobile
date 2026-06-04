import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { FC, useEffect, useState } from 'react';
import { View, Alert, Platform, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import * as RNLocalize from "react-native-localize";
import { useTranslation } from 'react-i18next';
import Purchases from 'react-native-purchases';

import { PRIVACY_POLICY_URL, TERMS_URL, APP_URL } from '@env';
import Header from '../../../components/ui/header';
import { AppButton } from '../../../components/ui/app-button';
import { AppText } from '../../../components/ui/app-text';
import ScreenContainer from '../../../components/layouts/screen-container';

import api from '../../../utils/http';
import { scaleSize } from '../../../utils/scale';
import { getLocaleByCountryCode } from '../../../utils/platform';
import { useAsyncStorage } from '../../../hooks/use-storage';
import { ActiveSubscription, SubscriptionCardList } from './components';

import type { MainNavigatorParamList } from '../../../navigators/types';
import type {
    SubscriptionItem,
} from './types';
import { useRevenueCat } from '../../../hooks/use-revenuecat';

type TopupProps = NativeStackScreenProps<MainNavigatorParamList, 'TopUp'>;

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

    // const [offering, setOffering] = useState<any>(null);

    const OFFERING_ID = 'credits_subscription';

    const { getUserProfile } = useAsyncStorage();

    const {
        offering,
        loadOfferings,
        getPackageByIdentifier
    } = useRevenueCat();

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

    useEffect(() => {
        const init = async () => {
            await loadOfferings(OFFERING_ID);

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

    const handleSelectSubscription = (sub: SubscriptionItem) => {
        setSelectedSubscription(sub);
        setSelectedPackage(null);
    };

    const handleContinue = async () => {
        try {
            const identifier = selectedSubscription?.subscription_id == 1 ? 'rc_monthly' : 'rc_annual'
            const pkg = getPackageByIdentifier(identifier);
            console.log('handleContinue', selectedSubscription)
            console.log('handleContinue', identifier);
            console.log('--- PACKAGE ---')
            console.log('Identifier:', pkg.identifier);
            console.log('Package Type:', pkg.packageType);
            console.log('Product ID:', pkg.product.identifier);
            console.log('Product Type:', pkg.product.productType);
            console.log('Price:', pkg.product.priceString);
            console.log('Subscription Period:', pkg.product.subscriptionPeriod);

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
                loading={processing}
            /> : null;
        }
    };

    const handleContent = async (type: 'privacy' | 'terms') => {
        // For iOS, open URL directly
        // For Android, navigate to WebviewContent like in profile page
        if (Platform.OS === 'ios') {
            const url = type === 'privacy' ? PRIVACY_POLICY_URL : TERMS_URL;
            try {
                await Linking.openURL(url);
            } catch (err) {
                console.error('Failed to open URL:', err);
            }
        } else {
            // Android: navigate to WebviewContent
            const content = type === 'privacy' ? 'privacy-policy' : 'terms-conditions';
            const title = type === 'privacy'
                ? t('topup.privacyPolicy')
                : t('topup.termsOfUse', { eulaSuffix: '' });

            const token = await getUserProfile();
            let authToken = null;
            if (token && typeof token === 'object' && 'auth_token' in token) {
                authToken = token.auth_token;
            }

            // Get language using getLocales() instead of getLanguage()
            const locales = RNLocalize.getLocales();
            const language = locales[0]?.languageCode || 'en';

            navigation.navigate('WebviewContent', {
                uri: `${APP_URL}/content/${content}?v=${Date.now()}&token=${authToken}&locale=${language}`,
                title,
            });
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
                    {
                        Platform.OS === 'ios' && (
                            <AppButton
                                title={t("topup.restorePurchases")}
                                variant="outline"
                                disabled={processing}
                                onPress={handleRestorePurchases}
                                style={{ marginTop: scaleSize(4) }}
                            />
                        )
                    }
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
            <View style={styles.disclaimerContainer}>
                <AppText variant="caption2" color="neutral" style={styles.disclaimerText}>
                    {Platform.OS === 'ios' ? t('topup.disclaimerTextIOS') : t('topup.disclaimerTextAndroid')}
                </AppText>
                <View style={styles.linksContainer}>
                    <TouchableOpacity onPress={() => handleContent('privacy')}>
                        <AppText variant="caption2" color="primary">
                            {t('topup.privacyPolicy')}
                        </AppText>
                    </TouchableOpacity>
                    <AppText variant="caption2" color="neutral">
                        |
                    </AppText>
                    <TouchableOpacity onPress={() => handleContent('terms')}>
                        <AppText variant="caption2" color="primary">
                            {t('topup.termsOfUse', { eulaSuffix: Platform.OS === 'ios' ? ' (EULA)' : '' })}
                        </AppText>
                    </TouchableOpacity>
                </View>
            </View>
            {/* <View style={{ height: scaleSize(60, 60, 80) }}></View> */}
        </ScreenContainer>
    );
};

const styles = StyleSheet.create({
    disclaimerContainer: {
        position: 'absolute',
        bottom: Platform.OS === 'ios' ? scaleSize(140) : scaleSize(115),
        left: 0,
        right: 0,
        paddingHorizontal: scaleSize(16),
    },
    disclaimerText: {
        textAlign: 'center',
        marginBottom: scaleSize(8),
    },
    linksContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: scaleSize(16),
    },
});

export default Topup;
