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

type RelationReportProps = NativeStackScreenProps<MainNavigatorParamList, 'RelationReport'>;

const CARD_DATA = [
    {
        icon: require('../../../../assets/icons/services/relation-report/icon-1.png'), label: 'What is your perspective on love?'
    },
    {
        icon: require('../../../../assets/icons/services/relation-report/icon-2.png'), label: 'How does your love interest sees you?'
    },
    {
        icon: require('../../../../assets/icons/services/relation-report/icon-3.png'), label: 'What kind of person your love interest is?'
    },
    {
        icon: require('../../../../assets/icons/services/relation-report/icon-4.png'), label: 'What are the personality traits, preferences and deal-breakers?'
    },
];

const RelationReport: React.FC<RelationReportProps> = ({ navigation }) => {
    const [showForm, setShowForm] = useState(false);
    const [showPurchaseModal, setShowPurchaseModal] = useState(false);
    const [purchaseLoading, setPurchaseLoading] = useState(false);
    const { cost, creditType, loading: costLoading } = useServiceCost('relationship_report');

    const handleContinue = async (values) => {
        setPurchaseLoading(true);
        try {
            // Convert birth_date to YYYY-MM-DD
            const birthDateStr = values.birth_date instanceof Date
                ? values.birth_date.toISOString().split('T')[0]
                : values.birth_date;
            // Convert gender to "M"/"F"
            const genderShort = values.gender === "Male" ? "M" : values.gender === "Female" ? "F" : values.gender;

            const response = await api.post('/v1/affinity/relationship-report', {
                name: values.full_name,
                birth_date: birthDateStr,
                gender: genderShort,
                birth_location: `${values.birth_country.name}, ${values.birth_city.name}`,
                lat: `${values.birth_city.latitude}`,
                lng: `${values.birth_city.longitude}`
            });
            setShowPurchaseModal(false);
            setShowForm(false)
            Alert.alert('Title', response.meta.message)
        } catch (err) {
            setShowPurchaseModal(false);
        } finally {
            setPurchaseLoading(false);
        }
    };

    const handleCancel = () => {
        setShowPurchaseModal(false);
    };

    return (
        <ScreenContainer
            header={
                <Header
                    title="Relationship Compatibility"
                    onBack={() => navigation.goBack()}
                />
            }
            floatingFooter={
                !showForm ? (
                    <AppButton
                        title={
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <AppText color='white' style={{ marginRight: 4 }}>Purchase for {cost}</AppText>
                                <CoinIcon color={creditType === 'gold' ? '#E0AE1E' : '#EB4335'} size={18} />
                            </View>
                        }
                        variant="primary"
                        onPress={() => setShowForm(true)}
                    />
                ) : (
                    <RelationReportForm
                        onSubmit={(values: RelationReportFormValues) => {
                            handleContinue(values)
                        }}
                        onCancel={() => setShowForm(false)}
                    />
                )
            }
        >
            <AppText variant='subtitle1' style={styles.title}>Curious if you're a perfect{'\n'}match? Find out now!</AppText>
            <ShinyContainer dark={false} size={220} style={{ marginVertical: 20 }}>
                <Image source={require('../../../../assets/icons/services/relation-report/service-icon.png')} />
            </ShinyContainer>
            <AppText style={styles.subtitle} variant='title4' color='primary'>
                Astrology meets Bazi for a fresh take on your love compatibility.
            </AppText>
            <AppText style={styles.description} color='neutral'>
                Some tips may sound like common sense—like improving communication or mindset—but they're tailored to your unique chart and relationship dynamics. Their impact is more powerful than they seem.
            </AppText>
            <AppText variant='subtitle1' style={{ textAlign: 'center' }}>Your Love Interest Detail</AppText>
            <AppText style={styles.sectionTitle} variant='caption2' color='primary'>Tell us more about them!</AppText>

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
                loading={purchaseLoading}
            />
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
