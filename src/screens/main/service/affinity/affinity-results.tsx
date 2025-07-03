import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { FC, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Pressable,
    StyleSheet,
    Text,
    View,
    Image
} from 'react-native';

import ArrowIcon from '../../../../components/icons/arrow-icon';
import { MainNavigatorParamList } from '../../../../navigators/types';
import ScreenContainer from '../../../../components/layouts/screen-container';
import { fontFamilies } from '../../../../constants/fonts';
import { AppText } from '../../../../components/ui/app-text';
import { COLORS } from '../../../../constants/colors';
import ShinyContainer from '../../../../components/widgets/shiny-container';
import { useTranslation } from 'react-i18next';

type AffinityResultsProps = NativeStackScreenProps<MainNavigatorParamList, 'AffinityResults'>;

const tarotImages: Record<string, any> = {
    "The Fool": require('../../../../assets/tarot/The_Fool.jpg'),
    "The Magician": require('../../../../assets/tarot/The_Magician.jpg'),
    "The High Priestess": require('../../../../assets/tarot/The_High_Priestess.jpg'),
    "The Empress": require('../../../../assets/tarot/The_Empress.jpg'),
    "The Emperor": require('../../../../assets/tarot/The_Emperor.jpg'),
    "The Hierophant": require('../../../../assets/tarot/The_Hierophant.jpg'),
    "The Lovers": require('../../../../assets/tarot/The_Lovers.jpg'),
    "The Chariot": require('../../../../assets/tarot/The_Chariot.jpg'),
    "Strength": require('../../../../assets/tarot/Strength.jpg'),
    "The Hermit": require('../../../../assets/tarot/The_Hermit.jpg'),
    "Wheel of Fortune": require('../../../../assets/tarot/Wheel_of_Fortune.jpg'),
    "Justice": require('../../../../assets/tarot/Justice.jpg'),
    "The Hanged Man": require('../../../../assets/tarot/The_Hanged_Man.jpg'),
    "Death": require('../../../../assets/tarot/Death.jpg'),
    "Temperance": require('../../../../assets/tarot/Temperance.jpg'),
    "The Devil": require('../../../../assets/tarot/The_Devil.jpg'),
    "The Tower": require('../../../../assets/tarot/The_Tower.jpg'),
    "The Star": require('../../../../assets/tarot/The_Star.jpg'),
    "The Moon": require('../../../../assets/tarot/The_Moon.jpg'),
    "The Sun": require('../../../../assets/tarot/The_Sun.jpg'),
    "Judgment": require('../../../../assets/tarot/Judgment.jpg'),
    "The World": require('../../../../assets/tarot/The_World.jpg'),
    "Ace of Wands": require('../../../../assets/tarot/Ace_of_Wands.jpg'),
    "Two of Wands": require('../../../../assets/tarot/Two_of_Wands.jpg'),
    "Three of Wands": require('../../../../assets/tarot/Three_of_Wands.jpg'),
    "Four of Wands": require('../../../../assets/tarot/Four_of_Wands.jpg'),
    "Five of Wands": require('../../../../assets/tarot/Five_of_Wands.jpg'),
    "Six of Wands": require('../../../../assets/tarot/Six_of_Wands.jpg'),
    "Seven of Wands": require('../../../../assets/tarot/Seven_of_Wands.jpg'),
    "Eight of Wands": require('../../../../assets/tarot/Eight_of_Wands.jpg'),
    "Nine of Wands": require('../../../../assets/tarot/Nine_of_Wands.jpg'),
    "Ten of Wands": require('../../../../assets/tarot/Ten_of_Wands.jpg'),
    "Page of Wands": require('../../../../assets/tarot/Page_of_Wands.jpg'),
    "Knight of Wands": require('../../../../assets/tarot/Knight_of_Wands.jpg'),
    "Queen of Wands": require('../../../../assets/tarot/Queen_of_Wands.jpg'),
    "King of Wands": require('../../../../assets/tarot/King_of_Wands.jpg'),
    "Ace of Cups": require('../../../../assets/tarot/Ace_of_Cups.jpg'),
    "Two of Cups": require('../../../../assets/tarot/Two_of_Cups.jpg'),
    "Three of Cups": require('../../../../assets/tarot/Three_of_Cups.jpg'),
    "Four of Cups": require('../../../../assets/tarot/Four_of_Cups.jpg'),
    "Five of Cups": require('../../../../assets/tarot/Five_of_Cups.jpg'),
    "Six of Cups": require('../../../../assets/tarot/Six_of_Cups.jpg'),
    "Seven of Cups": require('../../../../assets/tarot/Seven_of_Cups.jpg'),
    "Eight of Cups": require('../../../../assets/tarot/Eight_of_Cups.jpg'),
    "Nine of Cups": require('../../../../assets/tarot/Nine_of_Cups.jpg'),
    "Ten of Cups": require('../../../../assets/tarot/Ten_of_Cups.jpg'),
    "Page of Cups": require('../../../../assets/tarot/Page_of_Cups.jpg'),
    "Knight of Cups": require('../../../../assets/tarot/Knight_of_Cups.jpg'),
    "Queen of Cups": require('../../../../assets/tarot/Queen_of_Cups.jpg'),
    "King of Cups": require('../../../../assets/tarot/King_of_Cups.jpg'),
    "Ace of Swords": require('../../../../assets/tarot/Ace_of_Swords.jpg'),
    "Two of Swords": require('../../../../assets/tarot/Two_of_Swords.jpg'),
    "Three of Swords": require('../../../../assets/tarot/Three_of_Swords.jpg'),
    "Four of Swords": require('../../../../assets/tarot/Four_of_Swords.jpg'),
    "Five of Swords": require('../../../../assets/tarot/Five_of_Swords.jpg'),
    "Six of Swords": require('../../../../assets/tarot/Six_of_Swords.jpg'),
    "Seven of Swords": require('../../../../assets/tarot/Seven_of_Swords.jpg'),
    "Eight of Swords": require('../../../../assets/tarot/Eight_of_Swords.jpg'),
    "Nine of Swords": require('../../../../assets/tarot/Nine_of_Swords.jpg'),
    "Ten of Swords": require('../../../../assets/tarot/Ten_of_Swords.jpg'),
    "Page of Swords": require('../../../../assets/tarot/Page_of_Swords.jpg'),
    "Knight of Swords": require('../../../../assets/tarot/Knight_of_Swords.jpg'),
    "Queen of Swords": require('../../../../assets/tarot/Queen_of_Swords.jpg'),
    "King of Swords": require('../../../../assets/tarot/King_of_Swords.jpg'),
    "Ace of Pentacles": require('../../../../assets/tarot/Ace_of_Pentacles.jpg'),
    "Two of Pentacles": require('../../../../assets/tarot/Two_of_Pentacles.jpg'),
    "Three of Pentacles": require('../../../../assets/tarot/Three_of_Pentacles.jpg'),
    "Four of Pentacles": require('../../../../assets/tarot/Four_of_Pentacles.jpg'),
    "Five of Pentacles": require('../../../../assets/tarot/Five_of_Pentacles.jpg'),
    "Six of Pentacles": require('../../../../assets/tarot/Six_of_Pentacles.jpg'),
    "Seven of Pentacles": require('../../../../assets/tarot/Seven_of_Pentacles.jpg'),
    "Eight of Pentacles": require('../../../../assets/tarot/Eight_of_Pentacles.jpg'),
    "Nine of Pentacles": require('../../../../assets/tarot/Nine_of_Pentacles.jpg'),
    "Ten of Pentacles": require('../../../../assets/tarot/Ten_of_Pentacles.jpg'),
    "Page of Pentacles": require('../../../../assets/tarot/Page_of_Pentacles.jpg'),
    "Knight of Pentacles": require('../../../../assets/tarot/Knight_of_Pentacles.jpg'),
    "Queen of Pentacles": require('../../../../assets/tarot/Queen_of_Pentacles.jpg'),
    "King of Pentacles": require('../../../../assets/tarot/King_of_Pentacles.jpg'),
};


const getTarotImage = (cardName: string) => {
    return tarotImages[cardName];
};

const AffinityResults: FC<AffinityResultsProps> = ({ navigation, route }) => {
    const { t } = useTranslation();
    // Get the result from navigation params
    const affinityResult = route.params?.affinityResult;

    // Defensive: extract tarot_cards array
    const tarotCards = affinityResult?.data?.tarot_cards || [];

    // Group cards by section for display order
    const sectionOrder = [
        { key: 'present_situation', label: t('Present Situation') },
        { key: 'likely_outcome', label: t('Likely Outcome') },
        { key: 'recommended_action', label: t('Recommended Action') }
    ];

    const renderCardSection = (sectionKey: string, sectionLabel: string) => {
        const card = tarotCards.find((c: any) => c.section === sectionKey);
        if (!card) return null;
        return (
            <View key={sectionKey} style={styles.resultCard}>
                <AppText variant='subtitle1' color='primary' style={styles.resultTitle}>
                    {sectionLabel}
                </AppText>
                <ShinyContainer dark={false} size={288}>
                    {card.card_name ? (
                        <Image
                            source={getTarotImage(card.card_name)}
                            style={{ width: 150, height: 288, alignSelf: 'center', borderRadius: 8 }}
                            resizeMode="contain"
                        />
                    ) : null}
                </ShinyContainer>
                <AppText variant='subtitle1' color='primary' style={styles.resultTitle}>
                    {card.card} {card.orientation ? `(${card.orientation})` : ''}
                </AppText>
                <AppText variant='caption2' style={styles.resultCardContent}>
                    {card.result}
                </AppText>
            </View>
        );
    };

    return (
        <ScreenContainer
            header={
                <View style={styles.header}>
                    <Pressable
                        onPress={() => navigation.goBack()}
                        style={styles.backButton}>
                        <ArrowIcon />
                    </Pressable>
                    <Text style={styles.headerTitle}>{t('Ask Affinity')}</Text>
                </View>
            }
        >
            <View style={styles.resultContainer}>
                <AppText variant='title4' color='primary' style={styles.resultTitle}>
                    {route.params?.question || ''}
                </AppText>
                {
                    sectionOrder.map(section => renderCardSection(section.key, section.label))
                }
            </View>
        </ScreenContainer>
    );
};

const styles = StyleSheet.create({
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
    resultContainer: {
        gap: 16,
        marginBottom: 12
    },
    resultTitle: {
        textAlign: 'center',
        marginVertical: 12,
        lineHeight: 28
    },
    resultCard: {
        padding: 12,
        borderColor: COLORS.black,
        borderRadius: 12,
        borderWidth: 1
    },
    resultCardContent: {
        textAlign: 'center',
    }
});

export default AffinityResults;
