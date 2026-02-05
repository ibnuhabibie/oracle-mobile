import React, { FC, useState } from 'react';
import {
    Pressable,
    View,
    ActivityIndicator,
} from 'react-native';


import { AppText } from '../../components/ui/app-text';
import { scaleSize } from '../../utils/scale';
import { useTranslation } from 'react-i18next';

import { formatPrice } from '../../utils/formatter';
import api from '../../utils/http';


interface PricingVariantItem {
    pricing_variant_id: number;
    locale: string;
    currency_symbol: string;
    price: string;
    stripe_price_id: string;
}

interface TranslationItem {
    key: string;
    value: string;
    locale: string;
}

interface PackageItem {
    package_id: number;
    name: string;
    description: string;
    price: string;
    credits: number;
    is_active: boolean;
    translations?: TranslationItem[];
    pricing_variants?: PricingVariantItem[];
}

// Package card list component
interface PackageCardListProps {
    packages: PackageItem[];
    selectedPackage: number | null;
    setSelectedPackage: (id: number) => void;
    loading: boolean;
    error: string | null;
    locale: string;
}

const [packages, setPackages] = useState<PackageItem[]>([]);
const [loadingPackages, setLoadingPackages] = useState<boolean>(true);
const [errorPackages, setErrorPackages] = useState<string | null>(null);
const fetchPackages = async (_locale: string) => {
    console.log('_locale in fetchPackages', _locale);
    setLoadingPackages(true);
    setErrorPackages(null);
    try {
        const response = await api.get(`/v1/packages?locale=${_locale}`);
        setPackages(response.data.rows || []);
    } catch (err) {
        setErrorPackages('topup.failedToLoadPackages');
    } finally {
        setLoadingPackages(false);
    }
};

const PackageCardList: FC<PackageCardListProps> = ({ packages, selectedPackage, setSelectedPackage, loading, error, locale }) => {
    const { t } = useTranslation();
    return (
        <View style={{ marginBottom: scaleSize(18, 18, 24) }}>
            <AppText variant='subtitle1' color='primary' style={styles.sectionTitle}>{t('topup.ourPackages')}</AppText>
            <AppText variant='caption1' style={styles.sectionDesc} color='neutral'>{t('topup.packagesDesc')}</AppText>
            <View style={{ marginTop: scaleSize(8, 8, 12) }}>
                {
                    loading ?
                        (
                            <ActivityIndicator size="small" color="#D4A574" style={{ marginVertical: scaleSize(12, 12, 16) }} />
                        ) :
                        error ?
                            (
                                <AppText style={{ color: 'red', marginVertical: scaleSize(12, 12, 16) }}>{t(error)}</AppText>
                            )
                            :
                            (
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
                                            <AppText variant='body1' style={styles.cardTitle} color='white'>
                                                {(() => {
                                                    if (Array.isArray(pkg.translations)) {
                                                        const nameTrans = pkg.translations.find((tr: TranslationItem) => tr.key === 'name' && tr.locale === locale);
                                                        return nameTrans?.value || pkg.name;
                                                    }
                                                    return pkg.name;
                                                })()}
                                            </AppText>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: scaleSize(2) }}>
                                                <AppText variant='caption1' color='neutral'>{t('topup.getCoins', { count: pkg.credits })} </AppText>
                                                <Coin type='gold' />
                                            </View>
                                            {(() => {
                                                if (Array.isArray(pkg.translations)) {
                                                    const descTrans = pkg.translations.find((tr: TranslationItem) => tr.key === 'description' && tr.locale === locale);
                                                    if (descTrans?.value) {
                                                        return <AppText style={{ marginTop: scaleSize(2) }} color='neutral'>{descTrans.value}</AppText>;
                                                    }
                                                }
                                                if (pkg.description) {
                                                    return <AppText style={{ marginTop: scaleSize(2) }} color='neutral'>{pkg.description}</AppText>;
                                                }
                                                return null;
                                            })()}
                                        </View>
                                        <AppText variant='subtitle1' color='primary' style={styles.cardPrice}>
                                            {(() => {
                                                console.log('pkg.pricing_variants', pkg.pricing_variants, locale);

                                                if (Array.isArray(pkg.pricing_variants)) {
                                                    const pricingVariant = pkg.pricing_variants.find((pv: PricingVariantItem) => pv.locale === locale);
                                                    if (pricingVariant) {
                                                        return formatPrice(parseFloat(pricingVariant.price), pricingVariant.currency_symbol);
                                                    }
                                                }
                                                return `$${parseFloat(pkg.price)}`;
                                            })()}
                                        </AppText>
                                    </Pressable>
                                ))
                            )
                }
            </View>
        </View>
    );
};