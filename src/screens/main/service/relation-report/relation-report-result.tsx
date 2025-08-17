import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { View, StyleSheet, Text } from 'react-native';
import { AppText } from '../../../../components/ui/app-text';
import ScreenContainer from '../../../../components/layouts/screen-container';
import Header from '../../../../components/ui/header';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainNavigatorParamList } from '../../../../navigators/types';
import ProfileItemCard from '../../../../features/profile/report/profile-item-card';
import ProfileDescriptionCard from '../../../../features/profile/profile-description-card';
import ProfileCard from '../../../../features/profile/report/profile-card';
import { COLORS } from '../../../../constants/colors';
import { AppButton } from '../../../../components/ui/app-button';
import { downloadPdf } from '../../../../utils/http';

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

const RelationReportResult: React.FC<RelationReportResultProps> = ({ navigation, route }) => {
    const { result, love_profile, job_id } = route.params;
    const { t } = useTranslation();
    const [loading, setLoading] = React.useState(false);

    const CardList: FC<{ content: any[] }> = ({ content }) => {
        if (!content) return null;
        return (
            <>
                {content.map((item, idx) => (
                    <ProfileItemCard
                        key={item.order || idx}
                        data={{
                            title: item.title,
                            description: Array.isArray(item.content) ? (
                                item.content.map((_content: any) => (
                                    <ProfileDescriptionCard data={_content} />
                                ))
                            ) : item.content,
                            isDark: idx == 0,
                            icon: idx == 0 ? (
                                <Text style={{ fontSize: 45, fontWeight: 'bold', color: COLORS.white }}>{item.score}</Text>
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
            <ProfileCard cardTitle={t('relationReportResult.you')} iconKey={'relation'} />
            <ProfileCard cardTitle={t('relationReportResult.yourLoveInterest')} iconKey={'relation'} profileData={love_profile} />
            <CardList content={result?.content} />
            <View style={{ height: 60 }} />
        </ScreenContainer>
    );
};

export default RelationReportResult;
