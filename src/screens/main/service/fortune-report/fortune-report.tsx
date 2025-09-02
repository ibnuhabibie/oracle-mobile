import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    Alert,
    Dimensions,
    ActivityIndicator,
    InteractionManager,
} from 'react-native';
import { AppText } from '../../../../components/ui/app-text';
import { COLORS } from '../../../../constants/colors';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainNavigatorParamList } from '../../../../navigators/types';
import { AppButton } from '../../../../components/ui/app-button';
import ShinyContainer from '../../../../components/widgets/shiny-container';
import ScreenContainer from '../../../../components/layouts/screen-container';
import Header from '../../../../components/ui/header';
import { useServiceCost } from '../../../../hooks/use-service-cost';
import CoinIcon from '../../../../components/icons/profile/coin-icon';
import PurchaseAlertModal from '../../../../components/ui/purchase-alert-modal';
import api from '../../../../utils/http';
import PollingLoadingModal from '../../../../components/ui/polling-loading-modal';
import { useTranslation } from 'react-i18next';
import FortuneReportIcon from '../../../../components/icons/services/fortune-report/fortune-report-icon';

import FortuneReportIcon1 from '../../../../components/icons/services/fortune-report/fortune-report-icon-1';
import FortuneReportIcon2 from '../../../../components/icons/services/fortune-report/fortune-report-icon-2';
import FortuneReportIcon3 from '../../../../components/icons/services/fortune-report/fortune-report-icon-3';
import FortuneReportIcon4 from '../../../../components/icons/services/fortune-report/fortune-report-icon-4';

type FortuneReportProps = NativeStackScreenProps<MainNavigatorParamList, 'FortuneReport'>;



const FortuneReport: React.FC<FortuneReportProps> = ({ navigation }) => {
    const { t } = useTranslation();
    const [iconsReady, setIconsReady] = useState(false);

    React.useEffect(() => {
        const interaction = InteractionManager.runAfterInteractions(() => {
            setIconsReady(true);
        });
        return () => interaction && interaction.cancel && interaction.cancel();
    }, []);

    const fortuneYear = (() => {
        const now = new Date();
        const month = now.getMonth() + 1;
        const year = now.getFullYear();
        return month >= 7 ? year + 1 : year;
    })();

    const { width: deviceWidth } = Dimensions.get('window');
    const shinySize = deviceWidth < 350 ? 90 : deviceWidth < 400 ? 130 : 160;
    const iconSize = deviceWidth < 350 ? 28 : deviceWidth < 400 ? 36 : 44;
    const gridGap = deviceWidth < 350 ? 6 : deviceWidth < 400 ? 10 : 14;

    const CARD_DATA = [
        {
            icon: <FortuneReportIcon1 size={iconSize} />,
            title: t('fortuneReport.cards.health.title'),
            subtitle: t('fortuneReport.cards.health.subtitle')
        },
        {
            icon: <FortuneReportIcon2 size={iconSize} />,
            title: t('fortuneReport.cards.finance.title'),
            subtitle: t('fortuneReport.cards.finance.subtitle')
        },
        {
            icon: <FortuneReportIcon3 size={iconSize} />,
            title: t('fortuneReport.cards.career.title'),
            subtitle: t('fortuneReport.cards.career.subtitle')
        },
        {
            icon: <FortuneReportIcon4 size={iconSize} />,
            title: t('fortuneReport.cards.relationship.title'),
            subtitle: t('fortuneReport.cards.relationship.subtitle')
        },
    ];

    // (removed duplicate responsive variable declarations)

    const {
        cost,
        creditType,
        loading: costLoading,
        setLoading: setCostLoading
    } = useServiceCost('transit_report');
    const [showPurchaseModal, setShowPurchaseModal] = useState(false);
    const [showPollingModal, setShowPollingModal] = useState(false);
    const [pollingJobId, setPollingJobId] = useState<string | null>(null);

    const handleCancel = () => {
        setShowPurchaseModal(false);
    };

    const handleContinue = async () => {
        setCostLoading(true);
        try {
            const response = await api.post('/v1/affinity/transit-report', {});
            setShowPurchaseModal(false);
            // Expecting response.data.job_id
            const jobId = response?.data?.job_id;
            if (jobId) {
                setPollingJobId(jobId);
                setShowPollingModal(true);
            } else {
                Alert.alert('Error', 'No job_id returned from server.');
            }
        } catch (err) {
            setShowPurchaseModal(false);
        } finally {
            setCostLoading(false);
        }
    };

    const handlePollingResult = (usageHistory: any) => {
        setShowPollingModal(false);
        navigation.navigate('FortuneReportResult', {
            result: JSON.parse(usageHistory.response_data),
            job_id: pollingJobId ?? ''
        });
        setPollingJobId(null);
    };

    const handlePollingError = (error: any) => {
        setShowPollingModal(false);
        setPollingJobId(null);
        Alert.alert('Error', 'Failed to fetch report status.');
    };

    return (
        <ScreenContainer
            header={
                <Header
                    title={t('fortuneReport.header', { year: fortuneYear })}
                    onBack={() => navigation.goBack()}
                />
            }
            floatingFooter={
                <AppButton
                    title={
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <AppText color='white' style={{ marginRight: 4 }}>
                                {t('fortuneReport.purchase', { cost })}
                            </AppText>
                            <CoinIcon color={creditType === 'gold' ? COLORS.gold : COLORS.red} size={18} />
                        </View>
                    }
                    onPress={() => setShowPurchaseModal(true)}
                />
            }
        >
            <AppText variant='subtitle1' style={styles.title} color='neutral'>{t('fortuneReport.title', { year: fortuneYear })}</AppText>
            <ShinyContainer size={220} style={{ marginVertical: 20 }}>
                <FortuneReportIcon />
            </ShinyContainer>
            <AppText style={styles.subtitle} variant='title4' color='primary'>
                {t('fortuneReport.subtitle', { year: fortuneYear })}
            </AppText>
            <AppText style={styles.description} color='neutral'>
                {t('fortuneReport.description', { year: fortuneYear })}
            </AppText>
            <AppText style={styles.sectionTitle} variant='subtitle1' color='primary'>{t('fortuneReport.sectionTitle')}</AppText>

            {iconsReady ? (
                <View style={[styles.grid, { gap: gridGap }]}>
                    {
                        CARD_DATA.map((card, idx) => (
                            <View key={idx} style={styles.card}>
                                <View style={styles.cardIconWrapper}>
                                    <ShinyContainer size={shinySize}>
                                        {card.icon}
                                    </ShinyContainer>
                                </View>
                                <AppText style={styles.cardLabel} variant='body1' color='white'>{card.title}</AppText>
                                <AppText color='primary' variant='caption2'>{card.subtitle}</AppText>
                            </View>
                        ))
                    }
                </View>
            ) : (
                <View style={styles.activityIndicatorWrapper}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                </View>
            )}
            <View style={{ height: 60 }} />
            <PurchaseAlertModal
                visible={showPurchaseModal}
                onContinue={handleContinue}
                onCancel={handleCancel}
                service="transit_report"
                loading={costLoading}
            />
            {pollingJobId && (
                <PollingLoadingModal
                    job_id={pollingJobId}
                    visible={showPollingModal}
                    message={t('fortuneReport.pollingMessage')}
                    onResult={handlePollingResult}
                    onError={handlePollingError}
                    onClose={() => {
                        setShowPollingModal(false);
                        setPollingJobId(null);
                    }}
                />
            )}
        </ScreenContainer>
    );
};

const styles = StyleSheet.create({
    activityIndicatorWrapper: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 120,
        width: '100%',
    },
    title: {
        textAlign: 'center',
        marginTop: 32,
        marginBottom: 18,
        letterSpacing: 0.2,
        textTransform: 'uppercase'
    },
    subtitle: {
        textAlign: 'center',
        marginBottom: 12,
        marginTop: 8,
    },
    description: {
        textAlign: 'center',
        marginBottom: 22,
        lineHeight: 18,
    },
    sectionTitle: {
        textAlign: 'center',
        textTransform: 'uppercase',
        marginBottom: 18,
        width: '100%'
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 14,
    },
    card: {
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.black,
        width: '48%',
        backgroundColor: 'rgba(255,255,255,0.08)'
    },
    cardIconWrapper: {
        marginBottom: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardLabel: {
        marginTop: 12
    },
});

export default FortuneReport;
