import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { View, StyleSheet, InteractionManager, ActivityIndicator } from 'react-native';
import { AppText } from '../../../../components/ui/app-text';
import ScreenContainer from '../../../../components/layouts/screen-container';
import Header from '../../../../components/ui/header';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainNavigatorParamList } from '../../../../navigators/types';
import ProfileItemCard from '../../../../features/profile/report/profile-item-card';
import { AppButton } from '../../../../components/ui/app-button';
import { downloadPdf } from '../../../../utils/http';

import FortuneReportIcon11 from '../../../../components/icons/services/fortune-report/fortune-report-icon-11';
import FortuneReportIcon12 from '../../../../components/icons/services/fortune-report/fortune-report-icon-12';
import FortuneReportIcon13 from '../../../../components/icons/services/fortune-report/fortune-report-icon-13';
import FortuneReportIcon14 from '../../../../components/icons/services/fortune-report/fortune-report-icon-14';
import FortuneReportIcon15 from '../../../../components/icons/services/fortune-report/fortune-report-icon-15';
import FortuneReportIcon16 from '../../../../components/icons/services/fortune-report/fortune-report-icon-16';
import FortuneReportIcon17 from '../../../../components/icons/services/fortune-report/fortune-report-icon-17';
import { COLORS } from '../../../../constants/colors';

const iconImages = [
    FortuneReportIcon11,
    FortuneReportIcon12,
    FortuneReportIcon13,
    FortuneReportIcon14,
    FortuneReportIcon15,
    FortuneReportIcon16,
    FortuneReportIcon17,
];

type FortuneReportResultProps = NativeStackScreenProps<MainNavigatorParamList, 'FortuneReportResult'>;

const FortuneReportResult: React.FC<FortuneReportResultProps> = ({ navigation, route }) => {
    const { result, job_id } = route.params;
    const { t } = useTranslation();
    const [loading, setLoading] = React.useState(false);
    const [ready, setReady] = React.useState(false);

    React.useEffect(() => {
        const interaction = InteractionManager.runAfterInteractions(() => setReady(true));
        return () => interaction && interaction.cancel && interaction.cancel();
    }, []);

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
                            icon: iconImages[item.order - 1]
                                ? React.createElement(iconImages[item.order - 1], { size: 65 })
                                : undefined,
                        }}
                    />
                ))}
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
                    title={t('fortuneReportResult.header', { year: result.transit_year })}
                    onBack={() => navigation.goBack()}
                />
            }
            floatingFooter={
                <AppButton
                    title={t('fortuneReportResult.downloadPdf')}
                    onPress={handleDownload}
                    loading={loading}
                    disabled={loading || !job_id}
                />
            }
        >
            {!ready ? (
                <ActivityIndicator size="large" style={{ margin: 32 }} color={COLORS.primary} />
            ) : (
                <>
                    <CardList content={result?.content} />
                    <View style={{ height: 60 }} />
                </>
            )}
        </ScreenContainer>
    );
};

export default FortuneReportResult;
