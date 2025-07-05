import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { View, StyleSheet, Image } from 'react-native';
import { AppText } from '../../../../components/ui/app-text';
import ScreenContainer from '../../../../components/layouts/screen-container';
import Header from '../../../../components/ui/header';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainNavigatorParamList } from '../../../../navigators/types';
import ProfileItemCard from '../../../../features/profile/report/profile-item-card';
import { AppButton } from '../../../../components/ui/app-button';

type LoveReportResultProps = NativeStackScreenProps<MainNavigatorParamList, 'LoveReportResult'>;

const LoveReportResult: React.FC<LoveReportResultProps> = ({ navigation, route }) => {
    const { t } = useTranslation();
    const { result } = route.params;

    console.log(result)

    const iconImages = [
        require('../../../../assets/icons/reports/love-forecast/icon-1.png'),
        require('../../../../assets/icons/reports/love-forecast/icon-2.png'),
        require('../../../../assets/icons/reports/love-forecast/icon-3.png'),
        require('../../../../assets/icons/reports/love-forecast/icon-4.png'),
        require('../../../../assets/icons/reports/love-forecast/icon-5.png'),
        require('../../../../assets/icons/reports/love-forecast/icon-6.png'),
        require('../../../../assets/icons/reports/love-forecast/icon-7.png'),
        require('../../../../assets/icons/reports/love-forecast/icon-8.png'),
    ];

    // Format date_range if present, else fallback
    let forecastRange = '22 Jan 2025 to 21 Jan 2026';
    const dateRangeRaw = result?.result?.date_range || result?.date_range;
    if (dateRangeRaw && typeof dateRangeRaw === 'string' && dateRangeRaw.includes(':')) {
        const [start, end] = dateRangeRaw.split(':');
        const formatDate = (dateStr: string) => {
            const date = new Date(dateStr);
            const day = date.getDate();
            const month = date.toLocaleString('default', { month: 'short' });
            const year = date.getFullYear();
            return `${day} ${month} ${year}`;
        };
        forecastRange = `${formatDate(start)} - ${formatDate(end)}`;
    }

    const CardList: FC<{ content: any[] }> = ({ content }) => {
        if (!content) return null;

        return (
            <>
                {content.map((item, idx) => (
                    <ProfileItemCard
                        key={item.order || idx}
                        data={{
                            title: item.title,
                            description: item.content,
                            icon: iconImages[item.order - 1] ? (
                                <Image
                                    source={iconImages[item.order - 1]}
                                    style={{ width: 65, height: 65 }}
                                    resizeMode="contain"
                                />
                            ) : undefined,
                        }}
                    />
                ))}
            </>
        );
    };

    return (
        <ScreenContainer
            header={
                <Header
                    title={t('loveReportResult.title')}
                    onBack={() => navigation.goBack()}
                />
            }
            floatingFooter={
                <AppButton title={t('loveReportResult.downloadPdf')} />
            }
        >
            <AppText style={styles.forecastRange} color="neutral">
                {t('loveReportResult.forecastFor', { range: forecastRange })}
            </AppText>
            <CardList content={result?.content} />
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
});

export default LoveReportResult;
