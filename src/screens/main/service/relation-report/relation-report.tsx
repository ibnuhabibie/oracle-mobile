import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    Image,
    Alert,
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

type RelationReportProps = NativeStackScreenProps<MainNavigatorParamList, 'RelationReport'>;



const RelationReport: React.FC<RelationReportProps> = ({ navigation }) => {
    const { t } = useTranslation();

    const CARD_DATA = [
        {
            icon: require('../../../../assets/icons/services/relation-report/icon-1.png'),
            label: t('relationReport.cards.perspective')
        },
        {
            icon: require('../../../../assets/icons/services/relation-report/icon-2.png'),
            label: t('relationReport.cards.seeYou')
        },
        {
            icon: require('../../../../assets/icons/services/relation-report/icon-3.png'),
            label: t('relationReport.cards.kindOfPerson')
        },
        {
            icon: require('../../../../assets/icons/services/relation-report/icon-4.png'),
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
        setPollingJobId(null);

        console.log(payload)

        navigation.navigate('RelationReportResult', {
            result: JSON.parse(usageHistory.response_data),
            love_profile: payload // fix: match navigation param type
        });
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
                    title={t('relationReport.header')}
                    onBack={() => navigation.goBack()}
                />
            }
            floatingFooter={
                !showForm ? (
                    <AppButton
                        title={
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <AppText color='white' style={{ marginRight: 4 }}>
                                    {t('relationReport.purchase', { cost })}
                                </AppText>
                                <CoinIcon color={creditType === 'gold' ? '#E0AE1E' : '#EB4335'} size={18} />
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
            <AppText variant='subtitle1' style={styles.title}>{t('relationReport.title')}</AppText>
            <ShinyContainer dark={false} size={220} style={{ marginVertical: 20 }}>
                <Image source={require('../../../../assets/icons/services/relation-report/service-icon.png')} />
            </ShinyContainer>
            <AppText style={styles.subtitle} variant='title4' color='primary'>
                {t('relationReport.subtitle')}
            </AppText>
            <AppText style={styles.description} color='neutral'>
                {t('relationReport.description')}
            </AppText>
            <AppText variant='subtitle1' style={{ textAlign: 'center' }}>{t('relationReport.loveInterestDetail')}</AppText>
            <AppText style={styles.sectionTitle} variant='caption2' color='primary'>{t('relationReport.tellUsMore')}</AppText>

            <View style={styles.grid}>
                {
                    CARD_DATA.map((card, idx) => (
                        <View key={idx} style={styles.card}>
                            <View style={styles.cardIconWrapper}>
                                <ShinyContainer dark={false}>
                                    <Image source={card.icon} style={{ width: 44, height: 44, resizeMode: 'contain' }} />
                                </ShinyContainer>
                            </View>
                            <AppText style={styles.cardLabel} color='primary'>{card.label}</AppText>
                        </View>
                    ))
                }
            </View>
            <View style={{ height: 60 }} />
            <PurchaseAlertModal
                visible={showPurchaseModal}
                onContinue={handleContinue}
                onCancel={handleCancel}
                service="love_report"
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
    title: {
        textAlign: 'center',
        marginBottom: 18,
        letterSpacing: 0.2,
        textTransform: 'uppercase'
    },
    subtitle: {
        textAlign: 'center',
        marginBottom: 8,
        marginTop: 8,
    },
    description: {
        textAlign: 'center',
        marginBottom: 18,
        lineHeight: 18,
    },
    sectionTitle: {
        textAlign: 'center',
        marginBottom: 18,
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
        width: '48%'
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

export default RelationReport;
