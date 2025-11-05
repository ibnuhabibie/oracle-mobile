import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { FC, useEffect, useState } from 'react';
import { Dimensions, Image, StyleSheet, View, ScrollView, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import Carousel from 'react-native-reanimated-carousel';
import { useSharedValue } from 'react-native-reanimated';

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
import { rgbaColor } from 'react-native-reanimated/lib/typescript/Colors';
import { scaleSize } from '../../../../utils/scale';

type AskAffinityProps = NativeStackScreenProps<
  MainNavigatorParamList,
  'AskAffinity'
>;

const AskAffinity: FC<AskAffinityProps> = ({ navigation }) => {
  const { t } = useTranslation();

  const [apiError, setApiError] = useState<string | null>(null);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const {
    cost,
    creditType,
    loading: costLoading,
    setLoading: setCostLoading,
  } = useServiceCost('ask_affinity');

  const screenWidth = Dimensions.get('window').width;
  const progress = useSharedValue<number>(0);

  const carouselItems = [
    {
      id: 1,
      image: require('../../../../assets/images/ask-affinity/banner-1.png'),
    },
    {
      id: 2,
      image: require('../../../../assets/images/ask-affinity/banner-2.png'),
    },
    {
      id: 3,
      image: require('../../../../assets/images/ask-affinity/banner-3.png'),
    },
  ];

  const formRules = {
    question: {
      required: t('askAffinity.questionRequired'),
    },
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
    trigger,
    setValue,
  } = useForm({
    defaultValues: {
      question: '',
    },
  });

  const onSubmit = async (data: { question: string }) => {
    setApiError(null);
    setCostLoading(true);
    try {
      const response = await api.post('/v1/users/ask-affinity', {
        question: data.question,
      });
      setCostLoading(false);
      navigation.navigate('AffinityResults', {
        affinityResult: response,
        question: data.question,
      });
      setShowPurchaseModal(false);
      setValue('question', '');
    } catch (err: any) {
      setShowPurchaseModal(false);
      setCostLoading(false);
      setValue('question', '');
      setApiError(
        typeof err === 'object' &&
          err !== null &&
          typeof err.message === 'string'
          ? err.message
          : t('Something went wrong'),
      );
    }
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    <ScreenContainer fluid={true} scrollable={true}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 16 : 64}
        style={styles.keyboardAvoidingView}
      >
        <AppText style={styles.title} color="primary" variant="subtitle1">
          {t('askAffinity.title')}
        </AppText>
        <AppText style={styles.subtitle} variant="caption1" color="white">
          {t('askAffinity.subtitle')}
        </AppText>
        <Carousel
          autoPlayInterval={2000}
          data={carouselItems}
          height={scaleSize(300)}
          loop={true}
          pagingEnabled={true}
          snapEnabled={true}
          width={screenWidth}
          style={styles.carouselStyle}
          mode="parallax"
          modeConfig={{
            parallaxScrollingScale: scaleSize(0.85, 0.85, 0.9),
            parallaxScrollingOffset: scaleSize(220), // Fixed value instead of scaled
          }}
          onProgressChange={progress}
          renderItem={
            ({ item }) => (
              <Image
                source={item.image}
                style={styles.carouselImage}
                resizeMode="contain"
              />
            )
          }
        />
        <View style={styles.infoCard}>
          <AppText color="primary">{t('askAffinity.howToAskTitle')}</AppText>
          <AppText style={styles.infoCardText} variant="caption3" color="white">
            {t('askAffinity.instructions')}
          </AppText>
        </View>
        <View style={[styles.formContainer, keyboardVisible && styles.formContainerAbsolute]}>
          <AppText style={styles.formTitle} color="white">
            {t('askAffinity.questionLabel')}
          </AppText>
          <AppInput
            control={control}
            name="question"
            rules={formRules.question}
            placeholder=""
            errors={errors}
          />
          {apiError ? (
            <AppText style={styles.apiErrorText}>{t(apiError)}</AppText>
          ) : null}
          <AppButton
            title={
              <View style={styles.purchaseButtonContent}>
                <AppText color="white" style={styles.purchaseButtonText}>
                  {t('askAffinity.purchaseButton', { cost })}
                </AppText>
                <CoinIcon
                  type={creditType === 'gold' ? 'gold' : 'silver'}
                  size={scaleSize(18)}
                />
              </View>
            }
            onPress={async () => {
              const valid = await trigger('question');
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
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  formContainer: {
    padding: scaleSize(12),
    paddingTop: scaleSize(8),
  },
  formContainerAbsolute: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#121010',
    borderTopLeftRadius: scaleSize(20),
    borderTopRightRadius: scaleSize(20),
  },
  title: {
    textAlign: 'center',
    letterSpacing: scaleSize(5),
    lineHeight: scaleSize(24),
    marginTop: scaleSize(40),
    textTransform: 'uppercase',
  },
  subtitle: {
    textAlign: 'center',
    marginTop: scaleSize(10),
    maxWidth: '80%',
    alignSelf: 'center',
  },
  infoCard: {
    marginHorizontal: scaleSize(16),
    padding: scaleSize(14),
    borderRadius: scaleSize(8),
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
  },
  infoCardText: {
    lineHeight: scaleSize(24),
  },
  formTitle: {
    textAlign: 'center',
    marginTop: scaleSize(14),
  },
  apiErrorText: {
    color: 'red',
    textAlign: 'center',
    marginVertical: scaleSize(8),
  },
  purchaseButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  purchaseButtonText: {
    marginRight: scaleSize(4),
  },
  carouselStyle: {
    width: '100%',
    marginBottom: scaleSize(20),
  },
  carouselImage: {
    width: '100%',
    height: '100%',
    borderRadius: scaleSize(12),
  },
});

export default AskAffinity;
