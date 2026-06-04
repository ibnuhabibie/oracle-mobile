import { useTranslation } from "react-i18next";
import Purchases from "react-native-purchases";
import { useState } from "react";
import { Alert } from "react-native";

import api from "../utils/http";

export function useRevenueCat() {
    const { t } = useTranslation();
    const [offering, setOffering] = useState<any>(null);
    const [topupNo, setTopupNo] = useState<string>('');
    const [showPolling, setShowPolling] = useState<boolean>(false);

    const loadOfferings = async (OFFERING_ID = 'onetime_report') => {
        try {
            const offerings = await Purchases.getOfferings();
            console.log('Fetched offerings:', JSON.stringify(offerings));
            const targetOffering = offerings.all[OFFERING_ID];

            if (!targetOffering) {
                throw new Error(`Offering "${OFFERING_ID}" not found`);
            }

            // console.log('Loaded offerings:', targetOffering);
            // console.log('Available packages:', targetOffering.availablePackages);

            console.log('Current Offering ID:', targetOffering.identifier);

            targetOffering.availablePackages.forEach(pkg => {
                console.log('--- PACKAGE ---');
                console.log('Identifier:', pkg.identifier);
                console.log('Package Type:', pkg.packageType);
                console.log('Product ID:', pkg.product.identifier);
                console.log('Product Type:', pkg.product.productType);
                console.log('Price:', pkg.product.priceString);
                console.log('Subscription Period:', pkg.product.subscriptionPeriod);
            });
            setOffering(targetOffering);
        } catch (error) {
            console.log('Error fetching offerings:', error);
        }
    }

    const getPackageByIdentifier = (identifier: string) => {
        if (!offering) return null;

        console.log('offering', offering);

        return offering?.availablePackages.find(p => p.identifier === identifier) || null;
    }

    const pay = async (
        identifier: string,
        report_type: string,
        onSuccess: () => void,
        onError: (error: any) => void,
        data: any
    ) => {
        try {
            const pkg = getPackageByIdentifier(identifier);
            console.log('handleContinue', identifier);
            console.log('--- PACKAGE ---')
            console.log('Identifier:', pkg.identifier);
            console.log('Package Type:', pkg.packageType);
            console.log('Product ID:', pkg.product.identifier);
            console.log('Product Type:', pkg.product.productType);
            console.log('Price:', pkg.product.priceString);
            console.log('Subscription Period:', pkg.product.subscriptionPeriod);

            if (!pkg) {
                Alert.alert(t('topup.error'), t('topup.noReport'));
                return;
            }
            const purchasePackage = await Purchases.purchasePackage(pkg);
            console.log('purchasePackage', purchasePackage)

            await api.post('/v1/affinity/report/draft', {
                amount: data.amount,
                currency_symbol: data.currency,
                transaction_id: purchasePackage.transaction.transactionIdentifier,
                report_type: report_type,
                partner: data.partner || null
            });

            setTopupNo(`${purchasePackage.transaction.transactionIdentifier}?type=revenuecat`);
            setShowPolling(true);
            onSuccess();

        } catch (err: any) {
            if (err.userCancelled) {
                console.log('User cancelled the purchase');
                return;
            }

            console.log(err, 'err')
            onError(err);
        }
    }

    return {
        loadOfferings,
        pay,
        offering,
        topupNo,
        showPolling,
        setShowPolling,
        getPackageByIdentifier
    };
}