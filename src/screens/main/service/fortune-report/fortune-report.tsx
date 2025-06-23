import React from 'react';
import {
    View,
    StyleSheet,
    Text,
    Pressable,
    Image,
} from 'react-native';
import { AppText } from '../../../../components/ui/app-text';
import { COLORS } from '../../../../constants/colors';
import ArrowIcon from '../../../../components/icons/Arrow';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainNavigatorParamList } from '../../../../navigators/types';
import { fontFamilies } from '../../../../constants/fonts';
import { AppButton } from '../../../../components/ui/app-button';
import ShinyContainer from '../../../../components/widgets/ShinyContainer';
import ScreenContainer from '../../../../components/layouts/ScreenContainer';

type FortuneReportProps = NativeStackScreenProps<MainNavigatorParamList, 'FortuneReport'>;

const CARD_DATA = [
    {
        icon: require('../../../../assets/fortune-report/icon-1.png'),
        title: 'Health',
        subtitle: 'Using Astro and Bazi, analyze your health condition to help you take timely preventive measures.'
    },
    {
        icon: require('../../../../assets/fortune-report/icon-2.png'),
        title: 'Finance',
        subtitle: 'Using Astro and Bazi, Analyze yearly Wealth Palace trends to spot the best times for wealth opportunities.'
    },
    {
        icon: require('../../../../assets/fortune-report/icon-3.png'),
        title: 'Career',
        subtitle: 'Using Astro and Bazi, reveal yourcareer luck and challenges through your Career Palace stars.'
    },
    {
        icon: require('../../../../assets/fortune-report/icon-4.png'),
        title: 'Relationship',
        subtitle: 'Using Astro and Bazi, Track yearly love trends through your Marriage Palace.'
    },
];

const Header: React.FC<{ navigation: any }> = ({ navigation }) => (
    <View style={styles.header}>
        <Pressable
            onPress={() => navigation.goBack()}
            style={styles.backButton}>
            <ArrowIcon />
        </Pressable>
        <Text style={styles.headerTitle}>Fortune Report 2025</Text>
    </View>
);

const FortuneReport: React.FC<FortuneReportProps> = ({ navigation }) => {
    return (
        <ScreenContainer
            header={<Header navigation={navigation} />}
            floatingFooter={
                <View style={styles.purchaseButtonAbsolute}>
                    <AppButton
                        title="Purchase for 15 💛"
                        variant="primary"
                        onPress={() => { }}
                    />
                </View>
            }
        >
            <AppText variant='subtitle1' style={styles.title}>Curious about your 2025? See{'\n'}your fortune now!</AppText>
            <ShinyContainer dark={false} size={220} style={{ marginVertical: 20 }}>
                <Image source={require('../../../../assets/fortune-report/service-icon.png')} />
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
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    // fixedHeader removed, handled by ScreenContainer
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 12,
        paddingLeft: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        backgroundColor: COLORS.white,
        paddingTop: 8,
    },
    backButton: {
        padding: 8,
        marginLeft: -8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginLeft: 20,
        textAlign: 'center',
        fontFamily: fontFamilies.ARCHIVO.light,
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingTop: 0,
        alignItems: 'center',
    },
    title: {
        textAlign: 'center',
        marginBottom: 18,
        letterSpacing: 0.2,
        textTransform: 'uppercase'
    },
    centerIconContainer: {
        alignItems: 'center',
        marginBottom: 12,
    },
    sunburst: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#FFF7E6',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
        borderWidth: 2,
        borderColor: COLORS.primary,
        shadowColor: COLORS.primary,
        shadowOpacity: 0.15,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 4 },
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
    divider: {
        height: 1,
        backgroundColor: '#F0F0F0',
        width: '100%',
        marginVertical: 12,
    },
    sectionTitle: {
        textAlign: 'center',
        textTransform: 'uppercase',
        marginBottom: 18,
        width: '100%'
    },
    purchaseButtonWrapper: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 18,
    },
    purchaseButtonAbsolute: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: COLORS.white,
        padding: 12,
        zIndex: 20,
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
