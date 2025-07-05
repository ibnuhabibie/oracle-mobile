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
import ProfileCard from '../../../../features/profile/report/profile-card';

type RelationReportResultProps = NativeStackScreenProps<MainNavigatorParamList, 'RelationReportResult'>;

const RelationReportResult: React.FC<RelationReportResultProps> = ({ navigation, route }) => {
    const { result, love_profile } = route.params;
    const { t } = useTranslation();
    console.log(result?.content, 'result')

    const iconImages = [
        require('../../../../assets/icons/reports/relation-report/icon-1.png'),
        require('../../../../assets/icons/reports/relation-report/icon-2.png'),
        require('../../../../assets/icons/reports/relation-report/icon-3.png'),
        require('../../../../assets/icons/reports/relation-report/icon-4.png'),
        require('../../../../assets/icons/reports/relation-report/icon-5.png'),
    ];

    const CardList: FC<{ content: any[] }> = ({ content }) => {
        console.log(content, 'content')
        if (!content) return null;

        return (
            <>
                {content.map((item, idx) => (
                    <ProfileItemCard
                        key={item.order || idx}
                        data={{
                            title: item.title,
                            description: Array.isArray(item.content) ? '' : item.content,
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
                    title={t('relationReportResult.header')}
                    onBack={() => navigation.goBack()}
                />
            }
            floatingFooter={
                <AppButton title={t('relationReportResult.downloadPdf')} />
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
