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

type RelationReportProps = NativeStackScreenProps<MainNavigatorParamList, 'RelationReport'>;

const CARD_DATA = [
    {
        icon: require('../../../../assets/relation-report/icon-1.png'), label: 'What is your perspective on love?'
    },
    {
        icon: require('../../../../assets/relation-report/icon-2.png'), label: 'How does your love interest sees you?'
    },
    {
        icon: require('../../../../assets/relation-report/icon-3.png'), label: 'What kind of person your love interest is?'
    },
    {
        icon: require('../../../../assets/relation-report/icon-4.png'), label: 'What are the personality traits, preferences and deal-breakers?'
    },
];

const Header: React.FC<{ navigation: any }> = ({ navigation }) => (
    <View style={styles.header}>
        <Pressable
            onPress={() => navigation.goBack()}
            style={styles.backButton}>
            <ArrowIcon />
        </Pressable>
        <Text style={styles.headerTitle}>Relationship Compatibility</Text>
    </View>
);

const RelationReport: React.FC<RelationReportProps> = ({ navigation }) => {
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
            <AppText variant='subtitle1' style={styles.title}>Curious if you're a perfect{'\n'}match? Find out now!</AppText>
            <ShinyContainer dark={false} size={220} style={{ marginVertical: 20 }}>
                <Image source={require('../../../../assets/love-forecast/service-icon.png')} />
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

export default RelationReport;
