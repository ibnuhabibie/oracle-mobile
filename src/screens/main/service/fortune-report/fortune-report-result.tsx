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

type FortuneReportResultProps = NativeStackScreenProps<MainNavigatorParamList, 'FortuneReportResult'>;

const FortuneReportResult: React.FC<FortuneReportResultProps> = ({ navigation, route }) => {
    const { result } = route.params;
    const { t } = useTranslation();

    const iconImages = [
        require('../../../../assets/icons/reports/fortune-report/icon-1.png'),
        require('../../../../assets/icons/reports/fortune-report/icon-2.png'),
        require('../../../../assets/icons/reports/fortune-report/icon-3.png'),
        require('../../../../assets/icons/reports/fortune-report/icon-4.png'),
        require('../../../../assets/icons/reports/fortune-report/icon-5.png'),
        require('../../../../assets/icons/reports/fortune-report/icon-6.png'),
        require('../../../../assets/icons/reports/fortune-report/icon-7.png'),
    ];

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
                    title={t('fortuneReportResult.header', { year: result.transit_year })}
                    onBack={() => navigation.goBack()}
                />
            }
            floatingFooter={
                <AppButton title={t('fortuneReportResult.downloadPdf')} />
            }
        >
            <CardList content={result?.content} />
            <View style={{ height: 60 }} />
        </ScreenContainer>
    );
};

export default FortuneReportResult;
