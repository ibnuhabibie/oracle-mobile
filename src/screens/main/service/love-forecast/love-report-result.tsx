import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { View, StyleSheet, InteractionManager, ActivityIndicator } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import LoveReportIcon1 from '../../../../components/icons/services/love-report/love-report-icon-1';
import LoveReportIcon2 from '../../../../components/icons/services/love-report/love-report-icon-2';
import LoveReportIcon3 from '../../../../components/icons/services/love-report/love-report-icon-3';
import LoveReportIcon4 from '../../../../components/icons/services/love-report/love-report-icon-4';
import LoveReportIcon5 from '../../../../components/icons/services/love-report/love-report-icon-5';
import LoveReportIcon6 from '../../../../components/icons/services/love-report/love-report-icon-6';
import LoveReportIcon7 from '../../../../components/icons/services/love-report/love-report-icon-7';
import LoveReportIcon8 from '../../../../components/icons/services/love-report/love-report-icon-8';

import { AppText } from '../../../../components/ui/app-text';
import Header from '../../../../components/ui/header';
import { AppButton } from '../../../../components/ui/app-button';
import ScreenContainer from '../../../../components/layouts/screen-container';
import ProfileItemCard from '../../../../components/report/profile-item-card';

import { COLORS } from '../../../../constants/colors';
import { downloadPdf } from '../../../../utils/http';
import { scaleSize, scaleFont } from '../../../../utils/scale';
import { formatDateOnly } from '../../../../utils/date';

import type { MainNavigatorParamList } from '../../../../navigators/types';

type LoveReportResultProps = NativeStackScreenProps<MainNavigatorParamList, 'LoveReportResult'>;

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

const CardList: FC<{ content: any[] }> = React.memo(({ content }) => {
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
});

const LoveReportResult: React.FC<LoveReportResultProps> = ({ navigation, route }) => {
    const { t } = useTranslation();
    const { result, job_id } = route.params;
    const [loading, setLoading] = React.useState(false);
    const [ready, setReady] = React.useState(false);
    const [forecastRange, setForecastRange] = React.useState('');

    React.useEffect(() => {
        const interaction = InteractionManager.runAfterInteractions(() => setReady(true));
        return () => interaction && interaction.cancel && interaction.cancel();
    }, []);

    console.log(result, job_id)

    // Format date_range if present, else fallback
    React.useEffect(() => {
        const formatForecastRange = async () => {
            const dateRangeRaw = result?.result?.date_range || result?.date_range;
            if (dateRangeRaw && typeof dateRangeRaw === 'string' && dateRangeRaw.includes(':')) {
                const [start, end] = dateRangeRaw.split(':');
                const startDate = await formatDateOnly(start);
                const endDate = await formatDateOnly(end);
                setForecastRange(`${startDate} - ${endDate}`);
            }
        };

        formatForecastRange();
    }, [result]);

    const handleDownload = async () => {
        setLoading(true);
        try {
            await downloadPdf(job_id, t, true);
        } finally {
            setLoading(false);
        }
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
            {
                !ready ?
                    (
                        <ActivityIndicator size="large" style={styles.loadingIndicator} color={COLORS.primary} />
                    ) :
                    (
                        <>
                            <AppText variant='caption1' style={styles.forecastRange} color="neutral">
                                {t('loveReportResult.forecastFor', { range: forecastRange })}
                            </AppText>
                            <CardList content={result?.content} />
                            <View style={styles.spacer} />
                        </>
                    )
            }
        </ScreenContainer>
    );
};

const styles = StyleSheet.create({
    forecastRange: {
        textAlign: 'center',
        marginTop: scaleSize(8),
        marginBottom: scaleSize(16),
    },
    loadingIndicator: {
        margin: scaleSize(32),
    },
    spacer: {
        height: scaleSize(60),
    },
});

export default LoveReportResult;
