import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { View, StyleSheet, Image, InteractionManager, ActivityIndicator } from 'react-native';
import { AppText } from '../../../../components/ui/app-text';
import ScreenContainer from '../../../../components/layouts/screen-container';
import Header from '../../../../components/ui/header';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainNavigatorParamList } from '../../../../navigators/types';
import ProfileItemCard from '../../../../features/profile/report/profile-item-card';
import { AppButton } from '../../../../components/ui/app-button';
import LoveReportIcon1 from '../../../../components/icons/services/love-report/love-report-icon-1';
import LoveReportIcon2 from '../../../../components/icons/services/love-report/love-report-icon-2';
import LoveReportIcon3 from '../../../../components/icons/services/love-report/love-report-icon-3';
import LoveReportIcon4 from '../../../../components/icons/services/love-report/love-report-icon-4';
import LoveReportIcon5 from '../../../../components/icons/services/love-report/love-report-icon-5';
import LoveReportIcon6 from '../../../../components/icons/services/love-report/love-report-icon-6';
import LoveReportIcon7 from '../../../../components/icons/services/love-report/love-report-icon-7';
import LoveReportIcon8 from '../../../../components/icons/services/love-report/love-report-icon-8';
import { downloadPdf } from '../../../../utils/http';
import { COLORS } from '../../../../constants/colors';

type LoveReportResultProps = NativeStackScreenProps<MainNavigatorParamList, 'LoveReportResult'>;

const LoveReportResult: React.FC<LoveReportResultProps> = ({ navigation, route }) => {
    const { t } = useTranslation();
    const { result, job_id } = route.params;
    const [loading, setLoading] = React.useState(false);
    const [ready, setReady] = React.useState(false);

    React.useEffect(() => {
        const interaction = InteractionManager.runAfterInteractions(() => setReady(true));
        return () => interaction && interaction.cancel && interaction.cancel();
    }, []);

    console.log(result, job_id)

    const iconImages = [
        LoveReportIcon1,
        LoveReportIcon2,
        LoveReportIcon3,
        LoveReportIcon4,
        LoveReportIcon5,
        LoveReportIcon6,
        LoveReportIcon7,
        LoveReportIcon8,
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
                {
                    content.map((item, idx) => (
                        <ProfileItemCard
                            key={item.order || idx}
                            data={{
                                title: item.title,
                                description: item.content,
                                icon: iconImages[item.order - 1]
                                    ? React.createElement(iconImages[item.order - 1], { size: 65 })
                                    : undefined,
                            }}
                        />
                    ))
                }
            </>
        );
    };

    const handleDownload = async () => {
        setLoading(true);
        setTimeout(async () => {
            try {
                await downloadPdf(job_id, t, true);
            } finally {
                setLoading(false);
            }
        }, 0);
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
                <AppButton
                    title={t('loveReportResult.downloadPdf')}
                    onPress={handleDownload}
                    loading={loading}
                    disabled={loading}
                />
            }
        >
            {!ready ? (
                <ActivityIndicator size="large" style={{ margin: 32 }} color={COLORS.primary} />
            ) : (
                <>
                    <AppText variant='caption1' style={styles.forecastRange} color="neutral">
                        {t('loveReportResult.forecastFor', { range: forecastRange })}
                    </AppText>
                    <CardList content={result?.content} />
                    <View style={{ height: 60 }} />
                </>
            )}
        </ScreenContainer>
    );
};

const styles = StyleSheet.create({
    forecastRange: {
        textAlign: 'center',
        marginTop: 8,
        marginBottom: 16,
    },
});

export default LoveReportResult;
