import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { FC, useEffect, useState } from 'react';
import { Dimensions, Image, StyleSheet, View, ScrollView } from 'react-native';
import { useTranslation } from "react-i18next";
import { useForm } from 'react-hook-form';

import { MainNavigatorParamList } from '../../../../navigators/types';
import { AppText } from '../../../../components/ui/app-text';
import AppInput from '../../../../components/ui/app-input';
import { AppButton } from '../../../../components/ui/app-button';
import CoinIcon from '../../../../components/icons/profile/coin-icon';
import { COLORS } from '../../../../constants/colors';
import ScreenContainer from '../../../../components/layouts/screen-container';
import api from '../../../../utils/http';
import { useServiceCost } from '../../../../hooks/use-service-cost';
import PurchaseAlertModal from '../../../../components/ui/purchase-alert-modal';

type AskAffinityProps = NativeStackScreenProps<MainNavigatorParamList, 'AskAffinity'>;

const AskAffinity: FC<AskAffinityProps> = ({ navigation }) => {
    const { t } = useTranslation();

    const [apiError, setApiError] = useState<string | null>(null);
    const [showPurchaseModal, setShowPurchaseModal] = useState(false);
    const {
        cost,
        creditType,
        loading: costLoading,
        setLoading: setCostLoading
    } = useServiceCost('ask_affinity');

    const screenWidth = Dimensions.get('window').width;
    const localImage = require('../../../../assets/images/ask-affinity/banner.png');
    const { width, height } = Image.resolveAssetSource(localImage);
    const aspectRatio = width / height;

    const formRules = {
        question: {
            required: t('Question is required'),
        },
    }

    const {
        control,
        handleSubmit,
        formState: { errors },
        trigger,
        setValue
    } = useForm({
        defaultValues: {
            question: '',
        },
    });

    const onSubmit = async (data: { question: string }) => {
        setApiError(null);
        setCostLoading(true);
        try {
            const response = await api.post('/v1/users/ask-affinity', { question: data.question });
            setCostLoading(false);
            navigation.navigate('AffinityResults', { affinityResult: response, question: data.question });
            setShowPurchaseModal(false);
            setValue('question', '')
        } catch (err: any) {
            setShowPurchaseModal(false);
            setCostLoading(false);
            setValue('question', '')
            setApiError(typeof err === 'object' && err !== null && typeof err.message === 'string' ? err.message : t('Something went wrong'));
        }
    };

    return (
        <ScreenContainer fluid={true}>
            <AppText style={styles.title} color='primary' variant='subtitle1'>
                {t("ASK AFFINITY")}
            </AppText>
            <AppText style={styles.subtitle} variant='caption1'>{t('Unsure what to do next? Affinity is here to help —  ask anything.')}</AppText>
            <Image
                source={localImage}
                style={{
                    width: screenWidth,
                    height: undefined,
                    aspectRatio,
                    marginTop: 20,
                }}
                resizeMode="contain"
            />
            <View style={styles.infoCard}>
                <AppText color='primary'>{t('How to ask the question?')}</AppText>
                <AppText style={{ lineHeight: 22 }} variant='caption3'>
                    {t('ask_affinity_instructions')}
                </AppText>
            </View>
            <View style={{ padding: 14 }}>
                <AppText style={{ textAlign: 'center', marginTop: 36, marginBottom: 8 }}>{t('Type your question')}</AppText>
                <AppInput
                    control={control}
                    name="question"
                    rules={formRules.question}
                    placeholder=''
                    errors={errors}
                />
                {apiError ? (
                    <AppText style={{ color: 'red', textAlign: 'center', marginVertical: 8 }}>{t(apiError)}</AppText>
                ) : null}
                <AppButton
                    title={
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <AppText color='white' style={{ marginRight: 4 }}>{t('Purchase for {{cost}}', { cost })}</AppText>
                            <CoinIcon color={creditType === 'gold' ? '#E0AE1E' : '#EB4335'} size={18} />
                        </View>
                    }
                    onPress={async () => {
                        const valid = await trigger("question");
                        if (valid) setShowPurchaseModal(true);
                    }}
                />
            </View>

            <PurchaseAlertModal
                loading={costLoading}
                visible={showPurchaseModal}
                onContinue={handleSubmit(onSubmit)}
                onCancel={() => setShowPurchaseModal(false)}
                service="ask_affinity"
            />
        </ScreenContainer>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
    },
    title: {
        textAlign: 'center',
        letterSpacing: 5,
        lineHeight: 24,
        marginTop: 40,
        textTransform: 'uppercase'
    },
    subtitle: {
        textAlign: 'center',
        marginTop: 10,
        maxWidth: '80%',
        alignSelf: 'center'
    },
    infoCard: {
        marginHorizontal: 16,
        borderColor: COLORS.black,
        borderWidth: 1,
        padding: 14,
        borderRadius: 8,
        backgroundColor: COLORS.white
    }
});

export default AskAffinity;
