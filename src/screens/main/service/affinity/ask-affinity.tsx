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
import { useAsyncStorage } from '../../../../hooks/use-storage';
import { Text } from 'react-native-svg';
import PurchaseAlertModal from '../../../../components/ui/purchase-alert-modal';

type AskAffinityProps = NativeStackScreenProps<MainNavigatorParamList, 'AskAffinity'>;

const AskAffinity: FC<AskAffinityProps> = ({ navigation }) => {
    const { t } = useTranslation();

    // --- API integration and state ---
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);
    const [cost, setCost] = useState<number>(0);
    const [creditType, setCreditType] = useState<string>('');
    const [showPurchaseModal, setShowPurchaseModal] = useState(false);
    const { getConfig } = useAsyncStorage()

    const getConfigValue = (key: string, config) => {
        const found = config.find((c: any) => c.key === key);
        return found ? Number(found.value) : 0;
    };

    useEffect(() => {
        const init = async () => {
            const config = await getConfig()

            let creditType = 'silver';
            let cost = getConfigValue('ask_affinity_cost_using_silver_credit', config);

            if (cost <= 0) {
                cost = getConfigValue('ask_affinity_cost_using_gold_credit', config);
                creditType = 'gold';
            }

            setCost(cost)
            setCreditType(creditType)
        }

        init()
    }, [])

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
        trigger
    } = useForm({
        defaultValues: {
            question: '',
        },
    });

    const onSubmit = async (data) => {
        setApiError(null);
        setLoading(true);
        try {
            const response = await api.post('/v1/users/ask-affinity', { question: data.question });
            setLoading(false);
            navigation.navigate('AffinityResults', { affinityResult: response, question: data.question });
        } catch (err) {
            setLoading(false);
            setApiError(err?.message || 'Something went wrong');
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
                <AppText color='primary'>How to ask the question?</AppText>
                <AppText style={{ lineHeight: 22 }} variant='caption3'>
                    1. Keep a calm state of mind{'\n'}
                    2. Think about the question you have{'\n'}
                    3. Enter the question{'\n'}
                    4. Breathe and press the ask button
                </AppText>
            </View>
            <View style={{ padding: 14 }}>
                <AppText style={{ textAlign: 'center', marginTop: 36, marginBottom: 8 }}>Type your question</AppText>
                <AppInput
                    control={control}
                    name="question"
                    rules={formRules.question}
                    placeholder=''
                    errors={errors}
                />
                {apiError ? (
                    <AppText style={{ color: 'red', textAlign: 'center', marginVertical: 8 }}>{apiError}</AppText>
                ) : null}
                <AppButton
                    title={
                        loading ? 'Loading...' : (
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <AppText color='white' style={{ marginRight: 4 }}>Purchase for {cost}</AppText>
                                <CoinIcon color={creditType === 'gold' ? '#FFD700' : '#C0C0C0'} size={18} />
                            </View>
                        )
                    }
                    onPress={async () => {
                        const valid = await trigger("question");
                        if (valid) setShowPurchaseModal(true);
                    }}
                    disabled={loading}
                />
            </View>
            
            <PurchaseAlertModal
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
