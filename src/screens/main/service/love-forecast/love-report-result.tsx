import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { AppText } from '../../../../components/ui/app-text';
import ScreenContainer from '../../../../components/layouts/screen-container';
import Header from '../../../../components/ui/header';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainNavigatorParamList } from '../../../../navigators/types';

type LoveReportResultProps = NativeStackScreenProps<MainNavigatorParamList, 'LoveReportResult'>;

const LoveReportResult: React.FC<LoveReportResultProps> = ({ navigation, route }) => {
    // The API result is passed via route.params.result
    const { result } = route.params;

    // Example fallback data for UI demo
    const forecastRange = result?.forecastRange || '22 Jan 2025 to 21 Jan 2026';
    const sectionTitle = result?.sectionTitle || 'Introduction: your love blueprint';
    const description = result?.description || 'Lorem ipsum dolor sit amet consectetur adipiscing aenean at mattis magna vivamus est dolor aenean at elit in dui tincidunt vestibulum interdum ut augue nulla ultrices sagittis lectus ultricies tortor ivamus erat ante. Etiam non neque eu metus porttitor mollis at vel nibh aliquam hendrerit laoreet nibh varius pellentesque consequat nisl.';

    return (
        <ScreenContainer
            header={
                <Header
                    title="Love Forecast for Next 12 Months"
                    onBack={() => navigation.goBack()}
                />
            }
        >
            <AppText style={styles.forecastRange} color="neutral">
                Forecast for {forecastRange}
            </AppText>
            <View style={styles.card}>
                <View style={styles.iconWrapper}>
                    <Image
                        source={require('../../../../assets/icons/services/love-forecast/icon-1.png')}
                        style={styles.icon}
                    />
                </View>
                <AppText style={styles.sectionTitle} color="primary">
                    {sectionTitle}
                </AppText>
                <AppText style={styles.description} color="neutral">
                    {description}
                </AppText>
            </View>
        </ScreenContainer>
    );
};

const styles = StyleSheet.create({
    forecastRange: {
        textAlign: 'center',
        marginTop: 8,
        marginBottom: 16,
        fontSize: 14,
    },
    card: {
        borderWidth: 1,
        borderColor: '#222',
        borderRadius: 12,
        padding: 24,
        marginHorizontal: 16,
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    iconWrapper: {
        marginBottom: 18,
        marginTop: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    icon: {
        width: 90,
        height: 90,
        resizeMode: 'contain',
    },
    sectionTitle: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 12,
        textAlign: 'center',
        color: '#E0AE1E',
    },
    description: {
        fontSize: 14,
        textAlign: 'center',
        color: '#444',
    },
});

export default LoveReportResult;
