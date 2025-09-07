import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    Image,
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
import RelationReportForm, { RelationReportFormValues } from './relation-report-form';
import { useServiceCost } from '../../../../hooks/use-service-cost';
import CoinIcon from '../../../../components/icons/profile/coin-icon';
import PurchaseAlertModal from '../../../../components/ui/purchase-alert-modal';
import api from '../../../../utils/http';
import PollingLoadingModal from '../../../../components/ui/polling-loading-modal';
import { useTranslation } from 'react-i18next';
import RelationReportIcon from '../../../../components/icons/services/relation-report/relation-report-icon';
import RelationReportIcon1 from '../../../../components/icons/services/relation-report/relation-report-icon-1';
import RelationReportIcon2 from '../../../../components/icons/services/relation-report/relation-report-icon-2';
import RelationReportIcon3 from '../../../../components/icons/services/relation-report/relation-report-icon-3';
import RelationReportIcon4 from '../../../../components/icons/services/relation-report/relation-report-icon-4';
import RelationIcon from '../../../../components/icons/affinity/relation-icon';
import { scaleSize, scaleFont } from '../../../../utils/scale';

type RelationReportProps = NativeStackScreenProps<MainNavigatorParamList, 'RelationReport'>;



const RelationReport: React.FC<RelationReportProps> = ({ navigation }) => {
    const { t } = useTranslation();
    const [iconsReady, setIconsReady] = useState(false);

    React.useEffect(() => {
        const interaction = InteractionManager.runAfterInteractions(() => {
            setIconsReady(true);
        });
        return () => interaction && interaction.cancel && interaction.cancel();
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
    const [showPurchaseModal, setShowPurchaseModal] = useState(false);
    const [showPollingModal, setShowPollingModal] = useState(false);
    const [pollingJobId, setPollingJobId] = useState<string | null>(null);
    const {
        cost,
        creditType,
        loading: costLoading,
        setLoading: setCostLoading
    } = useServiceCost('relationship_report');
    const [payload, setPayload] = useState<any>(null);

    const handleContinue = async () => {
        setCostLoading(true);
        try {
            const response = await api.post('/v1/affinity/relationship-report', payload);
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

    const handleCancel = () => {
        setShowPurchaseModal(false);
    };

    const handleFormContinue = (values: RelationReportFormValues) => {
        setShowPurchaseModal(true);

        const birthDateStr = values.birth_date instanceof Date
            ? values.birth_date.toISOString().split('T')[0]
            : values.birth_date;
        const genderShort = values.gender === "Male" ? "M" : values.gender === "Female" ? "F" : values.gender;
        setPayload({
            name: values.full_name,
            birth_date: birthDateStr,
            gender: genderShort,
            birth_location: `${values.birth_country?.name}, ${values.birth_city?.name}`,
            lat: `${values.birth_city?.latitude}`,
            lng: `${values.birth_city?.longitude}`
        });
    };

    const handlePollingResult = (usageHistory: any) => {
        setShowPollingModal(false);
        navigation.navigate('RelationReportResult', {
            result: JSON.parse(usageHistory.response_data),
            love_profile: payload,
            job_id: pollingJobId ?? ''
        });
        setPollingJobId(null);
    };

    const handlePollingError = (error: any) => {
        setShowPollingModal(false);
        setPollingJobId(null);
        Alert.alert('Error', 'Failed to fetch report status.');
    };

    const shinySize = scaleSize(140);
    const iconSize = scaleSize(44);
    const gridGap = scaleSize(14);

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
                                    {t('relationReport.purchase', { cost })}
                                </AppText>
                                <CoinIcon color={creditType === 'gold' ? COLORS.gold : COLORS.red} size={scaleSize(18)} />
                            </View>
                        }
                        variant="primary"
                        onPress={() => setShowForm(true)}
                    />
                ) : (
                    <RelationReportForm
                        onSubmit={(values: RelationReportFormValues) => handleFormContinue(values)}
                        onCancel={() => setShowForm(false)}
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
            <PurchaseAlertModal
                visible={showPurchaseModal}
                onContinue={handleContinue}
                onCancel={handleCancel}
                service="relationship_report"
                loading={costLoading}
            />
            {pollingJobId && (
                <PollingLoadingModal
                    job_id={pollingJobId}
                    visible={showPollingModal}
                    message={t('relationReport.pollingMessage')}
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
