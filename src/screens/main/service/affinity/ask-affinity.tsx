import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { FC } from 'react';
import { Dimensions, Image, StyleSheet, View, ScrollView } from 'react-native';
import { useTranslation } from "react-i18next";
import { useForm } from 'react-hook-form';

import { MainNavigatorParamList } from '../../../../navigators/types';
import { AppText } from '../../../../components/ui/app-text';
import AppInput from '../../../../components/ui/app-input';
import { AppButton } from '../../../../components/ui/app-button';
import { COLORS } from '../../../../constants/colors';
import ScreenContainer from '../../../../components/layouts/ScreenContainer';
import api from '../../../../utils/http';

type AskAffinityProps = NativeStackScreenProps<MainNavigatorParamList, 'AskAffinity'>;

const AskAffinity: FC<AskAffinityProps> = ({ navigation }) => {
    const { t } = useTranslation();

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
        formState: { errors }
    } = useForm({
        defaultValues: {
            question: '',
        },
    });

    // --- API integration and state ---
    const [loading, setLoading] = React.useState(false);
    const [apiError, setApiError] = React.useState<string | null>(null);

    const onSubmit = async (data) => {
        console.log(data, 'data')

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
                    title={loading ? 'Loading...' : 'Purchase for 14'}
                    onPress={handleSubmit(onSubmit)}
                    disabled={loading}
                />
            </View>
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
