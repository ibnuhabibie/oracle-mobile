import React from 'react';
import {
    View,
    StyleSheet,
    Image,
} from 'react-native';
import { AppText } from '../../../../components/ui/app-text';
import { COLORS } from '../../../../constants/colors';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainNavigatorParamList } from '../../../../navigators/types';
import { AppButton } from '../../../../components/ui/app-button';
import ShinyContainer from '../../../../components/widgets/ShinyContainer';
import ScreenContainer from '../../../../components/layouts/screen-container';
import Header from '../../../../components/ui/header';

type FortuneReportProps = NativeStackScreenProps<MainNavigatorParamList, 'FortuneReport'>;

const CARD_DATA = [
    {
        icon: require('../../../../assets/icons/services/fortune-report/icon-1.png'),
        title: 'Health',
        subtitle: 'Using Astro and Bazi, analyze your health condition to help you take timely preventive measures.'
    },
    {
        icon: require('../../../../assets/icons/services/fortune-report/icon-2.png'),
        title: 'Finance',
        subtitle: 'Using Astro and Bazi, Analyze yearly Wealth Palace trends to spot the best times for wealth opportunities.'
    },
    {
        icon: require('../../../../assets/icons/services/fortune-report/icon-3.png'),
        title: 'Career',
        subtitle: 'Using Astro and Bazi, reveal yourcareer luck and challenges through your Career Palace stars.'
    },
    {
        icon: require('../../../../assets/icons/services/fortune-report/icon-4.png'),
        title: 'Relationship',
        subtitle: 'Using Astro and Bazi, Track yearly love trends through your Marriage Palace.'
    },
];

const FortuneReport: React.FC<FortuneReportProps> = ({ navigation }) => {
    return (
        <ScreenContainer
            header={
                <Header
                    title="Fortune Report 2025"
                    onBack={() => navigation.goBack()}
                />
            }
            floatingFooter={
                <AppButton
                    title="Purchase for 15 💛"
                    variant="primary"
                    onPress={() => { }}
                />
            }
        >
            <AppText variant='subtitle1' style={styles.title}>Curious about your 2025? See{'\n'}your fortune now!</AppText>
            <ShinyContainer dark={false} size={220} style={{ marginVertical: 20 }}>
                <Image source={require('../../../../assets/icons/services/fortune-report/service-icon.png')} />
            </ShinyContainer>
            <AppText style={styles.subtitle} variant='title4' color='primary'>
                Fortune reading meets planning for a fresh take on your 2025.
            </AppText>
            <AppText style={styles.description} color='neutral'>
                Some insights may seem simple—like timing or decision-making—but they’re personalized to your chart and 2025 path. Their guidance can make a real difference.
            </AppText>
            <AppText style={styles.sectionTitle} variant='subtitle1' color='primary'>What can you find out?</AppText>

            <View style={styles.grid}>
                {
                    CARD_DATA.map((card, idx) => (
                        <View key={idx} style={styles.card}>
                            <View style={styles.cardIconWrapper}>
                                <ShinyContainer dark={false}>
                                    <Image source={card.icon} style={{ width: 44, height: 44, resizeMode: 'contain' }} />
                                </ShinyContainer>
                            </View>
                            <AppText style={styles.cardLabel} variant='body1'>{card.title}</AppText>
                            <AppText color='primary' variant='caption2'>{card.subtitle}</AppText>
                        </View>
                    ))
                }
            </View>
            <View style={{ height: 60 }} />
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

export default FortuneReport;
