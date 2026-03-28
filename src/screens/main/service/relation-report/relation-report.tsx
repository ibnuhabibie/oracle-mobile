import React, { useEffect, useState } from 'react';
import {
    View,
    StyleSheet,
    Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';

import RelationReportIcon from '../../../../components/icons/services/relation-report/relation-report-icon';
import RelationReportIcon1 from '../../../../components/icons/services/relation-report/relation-report-icon-1';
import RelationReportIcon2 from '../../../../components/icons/services/relation-report/relation-report-icon-2';
import RelationReportIcon3 from '../../../../components/icons/services/relation-report/relation-report-icon-3';
import RelationReportIcon4 from '../../../../components/icons/services/relation-report/relation-report-icon-4';
import RelationIcon from '../../../../components/icons/affinity/relation-icon';

import { AppText } from '../../../../components/ui/app-text';
import { AppButton } from '../../../../components/ui/app-button';
import Header from '../../../../components/ui/header';
import PollingLoadingModal from '../../../../components/ui/polling-loading-modal';
import ShinyContainer from '../../../../components/widgets/shiny-container';
import ScreenContainer from '../../../../components/layouts/screen-container';
import RelationReportForm, { RelationReportFormValues } from './relation-report-form';

import { COLORS } from '../../../../constants/colors';
import { scaleSize } from '../../../../utils/scale';
import { formatPrice } from '../../../../utils/formatter';
import { useServiceCost } from '../../../../hooks/use-service-cost';
import { getLocale } from '../../../../hooks/use-storage';
import { useRevenueCat } from '../../../../hooks/use-revenuecat';

import type { MainNavigatorParamList } from '../../../../navigators/types';

type RelationReportProps = NativeStackScreenProps<MainNavigatorParamList, 'RelationReport'>;

const RelationReport: React.FC<RelationReportProps> = ({ navigation }) => {
    const { t } = useTranslation();
    const {
        cost,
        loading: costLoading,
        setLoading: setCostLoading,
        locale,
        currencySymbol
    } = useServiceCost('relationship_report');

    const {
        loadOfferings,
        pay,
        topupNo,
        showPolling,
        setShowPolling,
    } = useRevenueCat();

    useEffect(() => {
        const init = async () => {
            await loadOfferings();
        };

        init();
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

    const handleFormContinue = async (values: RelationReportFormValues) => {
        setCostLoading(true);
        try {
            const language = await getLocale();
            const _locale = language?.startsWith('zh') ? 'name_zh' : `name_${language}`;

            const birthDateStr = values.birth_date instanceof Date
                ? values.birth_date.toISOString().split('T')[0]
                : values.birth_date;
            const genderShort = values.gender === "Male" ? "M" : values.gender === "Female" ? "F" : values.gender;

            if (!values.birth_country || !values.birth_city) {
                throw new Error('Birth location is required');
            }

            const country = (values.birth_country as any)[_locale] || values.birth_country.name;
            const city = (values.birth_city as any)[_locale] || values.birth_city.name;

            const additionalData = {
                partner: {
                    name: values.full_name,
                    birth_date: birthDateStr,
                    gender: genderShort,
                    birth_location: `${country}, ${city}`,
                    lat: `${values.birth_city.latitude}`,
                    lng: `${values.birth_city.longitude}`
                }
            };

            await pay(
                'relationship_report_pkg',
                'relationship_report',
                () => { console.log('Payment Success') },
                (err) => {
                    Alert.alert(t('directPayment.paymentErrorTitle'), err?.message || t('topup.genericError'));
                },
                {
                    amount: cost,
                    currency: currencySymbol,
                    partner: additionalData.partner
                }
            );

            setShowForm(false);
        } catch (err) {
            console.log(err);
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

            <View style={styles.spacer} />
            <PollingLoadingModal
                topupNo={topupNo}
                visible={showPolling}
                onResult={(data) => {
                    console.log('data onresult', data)
                    setShowPolling(false)
                    navigation.navigate('RelationReportResult', {
                        result: JSON.parse(data.response_data),
                        love_profile: data.request_data ? JSON.parse(data.request_data).partner : undefined,
                        job_id: data.job_id
                    })
                }}
                onClose={() => {
                    setShowPolling(false)
                }} />
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
