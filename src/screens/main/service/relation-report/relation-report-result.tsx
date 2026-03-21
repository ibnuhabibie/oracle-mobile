import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { View,InteractionManager, ActivityIndicator } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AppText } from '../../../../components/ui/app-text';
import Header from '../../../../components/ui/header';
import { AppButton } from '../../../../components/ui/app-button';
import ScreenContainer from '../../../../components/layouts/screen-container';
import ProfileCard from '../../../../components/report/profile-card';
import ProfileItemCard from '../../../../components/report/profile-item-card';
import ProfileDescriptionCard from '../../../../components/report/profile-description-card';

import RelationReportIcon11 from '../../../../components/icons/services/relation-report/relation-report-icon-11';
import RelationReportIcon12 from '../../../../components/icons/services/relation-report/relation-report-icon-12';
import RelationReportIcon13 from '../../../../components/icons/services/relation-report/relation-report-icon-13';
import RelationReportIcon14 from '../../../../components/icons/services/relation-report/relation-report-icon-14';
import RelationReportIcon15 from '../../../../components/icons/services/relation-report/relation-report-icon-15';
import RelationReportIcon16 from '../../../../components/icons/services/relation-report/relation-report-icon-16';
import RelationReportIcon17 from '../../../../components/icons/services/relation-report/relation-report-icon-17';
import RelationReportIcon18 from '../../../../components/icons/services/relation-report/relation-report-icon-18';
import RelationReportIcon19 from '../../../../components/icons/services/relation-report/relation-report-icon-19';
import RelationReportIcon20 from '../../../../components/icons/services/relation-report/relation-report-icon-20';
import RelationReportIcon21 from '../../../../components/icons/services/relation-report/relation-report-icon-21';

import { COLORS } from '../../../../constants/colors';
import { downloadPdf } from '../../../../utils/http';

import type { MainNavigatorParamList } from '../../../../navigators/types';

const iconImages = [
    '',
    RelationReportIcon11,
    RelationReportIcon12,
    RelationReportIcon13,
    RelationReportIcon14,
    RelationReportIcon15,
    RelationReportIcon16,
    RelationReportIcon17,
    RelationReportIcon18,
    RelationReportIcon19,
    RelationReportIcon20,
    RelationReportIcon21,
];

type RelationReportResultProps = NativeStackScreenProps<MainNavigatorParamList, 'RelationReportResult'>;

// Transform love_profile to UserProfile shape
function loveProfileToUserProfile(love_profile: any) {
    if (!love_profile) return {};
    const [country, city] = (love_profile.birth_location || '').split(',').map((s: string) => s.trim());
    return {
        full_name: love_profile.name,
        birth_date: love_profile.birth_date ? new Date(love_profile.birth_date) : undefined,
        birth_time: undefined,
        birth_country: country,
        birth_city: city,
        gender: love_profile.gender,
    };
}

const CardList: FC<{ content: any[] }> = React.memo(({ content }) => {
    if (!content) return null;
    return (
        <>
            {content.map((item, idx) => (
                <ProfileItemCard
                    key={idx}
                    data={{
                        title: item.title,
                        description: Array.isArray(item.content) ? (
                            item.content.map((_content: any) => (
                                <ProfileDescriptionCard data={_content} />
                            ))
                        ) : item.content,
                        isDark: idx == 0,
                        icon: idx == 0 ? (
                            <AppText variant="display1" color="white" style={{ fontWeight: 'bold' }}>{item.score}</AppText>
                        ) : (
                            iconImages[item.order - 1]
                                ? React.createElement(iconImages[item.order - 1], { size: 65 })
                                : null
                        ),
                    }}
                />
            ))}
        </>
    );
});

const RelationReportResult: React.FC<RelationReportResultProps> = ({ navigation, route }) => {
    const { result, love_profile, job_id } = route.params;
    const { t } = useTranslation();
    const [loading, setLoading] = React.useState(false);
    const [ready, setReady] = React.useState(false);

    React.useEffect(() => {
        const interaction = InteractionManager.runAfterInteractions(() => setReady(true));
        return () => interaction && interaction.cancel && interaction.cancel();
    }, []);

    console.log(love_profile, 'love_profile')

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
                    title={t('relationReportResult.header')}
                    onBack={() => navigation.goBack()}
                />
            }
            floatingFooter={
                <AppButton
                    title={t('relationReportResult.downloadPdf')}
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
                    <ProfileCard cardTitle={t('relationReportResult.you')} iconKey={'relation'} />
                    <ProfileCard
                        cardTitle={t('relationReportResult.yourLoveInterest')}
                        iconKey={'relation'}
                        profileData={loveProfileToUserProfile(love_profile)}
                    />
                    <CardList content={result?.content} />
                    <View style={{ height: 60 }} />
                </>
            )}
        </ScreenContainer>
    );
};

export default RelationReportResult;