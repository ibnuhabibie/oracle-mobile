import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { FC, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Pressable,
    StyleSheet,
    Text,
    View
} from 'react-native';

import ArrowIcon from '../../../../components/icons/arrow-icon';
import { MainNavigatorParamList } from '../../../../navigators/types';
import ScreenContainer from '../../../../components/layouts/screen-container';
import { fontFamilies } from '../../../../constants/fonts';
import { AppText } from '../../../../components/ui/app-text';
import { COLORS } from '../../../../constants/colors';
import ShinyContainer from '../../../../components/widgets/shiny-container';

type AffinityResultsProps = NativeStackScreenProps<MainNavigatorParamList, 'AffinityResults'>;


const AffinityResults: FC<AffinityResultsProps> = ({ navigation, route }) => {
    // Get the result from navigation params
    const affinityResult = route.params?.affinityResult;

    // Defensive: extract tarot_cards array
    const tarotCards = affinityResult?.data?.tarot_cards || [];

    // Group cards by section for display order
    const sectionOrder = [
        { key: 'present_situation', label: 'Present Situation' },
        { key: 'likely_outcome', label: 'Likely Outcome' },
        { key: 'recommended_action', label: 'Recommended Action' }
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
                    {/* Optionally, card image or icon can go here */}
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
                    <Text style={styles.headerTitle}>Ask Affinity</Text>
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
