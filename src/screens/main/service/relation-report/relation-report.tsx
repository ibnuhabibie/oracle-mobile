import React, { useEffect, useState } from 'react';
import {
    View,
    StyleSheet,
    Alert,
    ActivityIndicator,
    InteractionManager,
} from 'react-native';
import {
    initPaymentSheet,
    presentPaymentSheet,
} from '@stripe/stripe-react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import * as RNLocalize from "react-native-localize";

import { AppText } from '../../../../components/ui/app-text';
import { COLORS } from '../../../../constants/colors';
import { MainNavigatorParamList } from '../../../../navigators/types';
import { AppButton } from '../../../../components/ui/app-button';
import ShinyContainer from '../../../../components/widgets/shiny-container';
import ScreenContainer from '../../../../components/layouts/screen-container';
import Header from '../../../../components/ui/header';
import RelationReportForm, { RelationReportFormValues } from './relation-report-form';
import { useServiceCost } from '../../../../hooks/use-service-cost';
import api from '../../../../utils/http';
import RelationReportIcon from '../../../../components/icons/services/relation-report/relation-report-icon';
import RelationReportIcon1 from '../../../../components/icons/services/relation-report/relation-report-icon-1';
import RelationReportIcon2 from '../../../../components/icons/services/relation-report/relation-report-icon-2';
import RelationReportIcon3 from '../../../../components/icons/services/relation-report/relation-report-icon-3';
import RelationReportIcon4 from '../../../../components/icons/services/relation-report/relation-report-icon-4';
import RelationIcon from '../../../../components/icons/affinity/relation-icon';
import { scaleSize } from '../../../../utils/scale';
import { getLocale } from '../../../../hooks/use-storage';
import { CURRENCIES } from '../../../../constants/app';
import { formatPrice } from '../../../../utils/formatter';
import { getLocaleByCountryCode } from '../../../../utils/platform';

type RelationReportProps = NativeStackScreenProps<MainNavigatorParamList, 'RelationReport'>;

const RelationReport: React.FC<RelationReportProps> = ({ navigation }) => {
    const { t } = useTranslation();
    const [iconsReady, setIconsReady] = useState(false);
    const [currencySymbol, setCurrencySymbol] = useState('');
    const [locale, setLocale] = useState('');

    useEffect(() => {
        const interaction = InteractionManager.runAfterInteractions(() => {
            setIconsReady(true);
        });
        return () => interaction && interaction.cancel && interaction.cancel();
    }, []);

    useEffect(() => {
        const fetchLocaleAndSetCurrency = async () => {
            const _locale = await getLocale()
            const currency = CURRENCIES.find(c => c.key === _locale) || CURRENCIES[0];
            setCurrencySymbol(currency.symbol);
        };
        fetchLocaleAndSetCurrency();
    }, []);


    const CARD_DATA = [
        {
            icon: RelationReportIcon1,
            iconKey: 'perspective',
            label: t('relationReport.cards.perspective')
        },
        {
            icon: RelationReportIcon2,
            iconKey: 'seeYou',
            label: t('relationReport.cards.seeYou')
        },
        {
            icon: RelationReportIcon3,
            iconKey: 'kindOfPerson',
            label: t('relationReport.cards.kindOfPerson')
        },
        {
            icon: RelationReportIcon4,
            iconKey: 'traits',
            label: t('relationReport.cards.traits')
        },
    ];

    const [showForm, setShowForm] = useState(false);

    const {
        cost,
        loading: costLoading,
        setLoading: setCostLoading
    } = useServiceCost('relationship_report');

    const openPaymentSheet = async (clientSecret: string) => {
        const { error: errorInit } = await initPaymentSheet({
            paymentIntentClientSecret: clientSecret,
            merchantDisplayName: 'Affinity AI',
        });

        if (errorInit) {
            Alert.alert(t('directPayment.paymentErrorTitle'), errorInit.message);
        }

        const { error } = await presentPaymentSheet();

        if (error) {
            console.log(error)
            const message = error.code == 'Canceled' ? t('directPayment.paymentNotCompletedMessage') : error.localizedMessage;
            Alert.alert(t('directPayment.paymentErrorTitle'), message);
        } else {
            Alert.alert(
                t('directPayment.paymentSuccessTitle'),
                t('directPayment.paymentSuccessMessage'),
                [{ text: t('topup.ok') }]
            );
        }
    };

    const handleFormContinue = async (values: RelationReportFormValues) => {
        try {
            setCostLoading(true);

            const language = await getLocale();
            const _locale = language?.startsWith('zh') ? 'name_zh' : `name_${language}`;

            const birthDateStr = values.birth_date instanceof Date
                ? values.birth_date.toISOString().split('T')[0]
                : values.birth_date;
            const genderShort = values.gender === "Male" ? "M" : values.gender === "Female" ? "F" : values.gender;

            const country = values.birth_country[_locale] || values.birth_country.name;
            const city = values.birth_city[_locale] || values.birth_city.name;

            const payload = {
                name: values.full_name,
                birth_date: birthDateStr,
                gender: genderShort,
                birth_location: `${country}, ${city}`,
                lat: `${values.birth_city?.latitude}`,
                lng: `${values.birth_city?.longitude}`
            }

            const countryCode = RNLocalize.getCountry();
            const localeByCountry = getLocaleByCountryCode(countryCode);

            const response = await api.post('/v1/payments/direct', {
                reportType: "relationship_report",
                locale: localeByCountry,
                partner: payload
            });
            console.log(response)

            setCostLoading(false);
            openPaymentSheet(response.data.client_secret)
            setShowForm(false);
        } catch (err) {
            setCostLoading(false);
            console.log(err)
        } finally {
            setCostLoading(false);
        }
    };

    const shinySize = scaleSize(140);
    const iconSize = scaleSize(44);

    return (
        <ScreenContainer
            header={
                <Header
                    title={t('relationReport.header')}
                    onBack={() => navigation.goBack()}
                />
            }
            floatingFooter={
                !showForm ? (
                    <AppButton
                        title={
                            <View style={styles.buttonRow}>
                                <AppText color='white' style={{ marginRight: scaleSize(4) }}>
                                    {t('relationReport.purchase', { cost: formatPrice(cost, currencySymbol) })}
                                </AppText>
                            </View>
                        }
                        variant="primary"
                        loading={costLoading}
                        onPress={() => setShowForm(true)}
                    />
                ) : (
                    <RelationReportForm
                        onSubmit={(values: RelationReportFormValues) => handleFormContinue(values)}
                        onCancel={() => setShowForm(false)}
                        loading={costLoading}
                    />
                )
            }
        >
            <AppText variant='subtitle1' style={styles.title} color='neutral'>{t('relationReport.title')}</AppText>
            <ShinyContainer size={scaleSize(220)} style={styles.shinyContainer}>
                <RelationReportIcon size={scaleSize(60)} />
            </ShinyContainer>
            <AppText style={styles.subtitle} variant='title4' color='primary'>
                {t('relationReport.subtitle')}
            </AppText>
            <AppText style={styles.description} color='neutral'>
                {t('relationReport.description')}
            </AppText>
            {/* <AppText variant='subtitle1' style={{ textAlign: 'center' }} color='neutral'>{t('relationReport.loveInterestDetail')}</AppText> */}
            <AppText style={styles.sectionTitle} variant='caption2' color='primary'>{t('relationReport.tellUsMore')}</AppText>

            {iconsReady ? (
                <View style={styles.grid}>
                    {
                        CARD_DATA.map((card, idx) => (
                            <View key={idx} style={styles.card}>
                                <View style={styles.cardIconWrapper}>
                                    <ShinyContainer size={shinySize}>
                                        {card.iconKey === 'relation'
                                            ? <RelationIcon size={iconSize} />
                                            : React.createElement(card.icon, { size: iconSize })}
                                    </ShinyContainer>
                                </View>
                                <AppText style={styles.cardLabel} color='white'>{card.label}</AppText>
                            </View>
                        ))
                    }
                </View>
            ) : (
                <View style={styles.activityIndicatorWrapper}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                </View>
            )}
            <View style={styles.spacer} />
        </ScreenContainer>
    );
};

const styles = StyleSheet.create({
    activityIndicatorWrapper: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: scaleSize(120),
        width: '100%',
    },
    title: {
        textAlign: 'center',
        marginBottom: scaleSize(18),
        letterSpacing: scaleSize(0.2),
        textTransform: 'uppercase'
    },
    subtitle: {
        textAlign: 'center',
        marginBottom: scaleSize(8),
        marginTop: scaleSize(8),
    },
    description: {
        textAlign: 'center',
        marginVertical: scaleSize(22),
        lineHeight: scaleSize(18),
    },
    sectionTitle: {
        textAlign: 'center',
        marginVertical: scaleSize(32),
        letterSpacing: scaleSize(0.2),
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between'
        // gap is set dynamically
    },
    card: {
        padding: scaleSize(12),
        borderRadius: scaleSize(12),
        borderWidth: scaleSize(1),
        borderColor: COLORS.black,
        width: '48%',
        backgroundColor: 'rgba(255,255,255,0.08)',
        marginBottom: '4%'
    },
    cardIconWrapper: {
        marginBottom: scaleSize(10),
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardLabel: {
        marginTop: scaleSize(12)
    },
    buttonRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    shinyContainer: {
        marginVertical: scaleSize(20),
    },
    spacer: {
        height: scaleSize(60),
    },
});

export default RelationReport;
