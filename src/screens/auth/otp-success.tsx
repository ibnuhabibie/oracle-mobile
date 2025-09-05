import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { scaleFont, scaleSize } from '../../utils/scale';
import { useTranslation } from 'react-i18next';

import CheckmarkIcon from '../../components/icons/auth/checkmark-icon';
import ScreenContainer from '../../components/layouts/screen-container';
import { AppButton } from '../../components/ui/app-button';
import { AppText } from '../../components/ui/app-text';
import ShinyContainer from '../../components/widgets/shiny-container';
import { COLORS } from '../../constants/colors';
import { fontFamilies } from '../../constants/fonts';
import { MainNavigatorParamList } from '../../navigators/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SMSIcon from '../../components/icons/auth/sms-icon';

type OtpSuccessProps = NativeStackScreenProps<MainNavigatorParamList, 'OtpSuccess'>;

const OtpSuccess: FC<OtpSuccessProps> = ({ navigation }) => {
  const { t } = useTranslation();

  const handleContinue = async () => {
    const user_profile: any = await AsyncStorage.getItem('user_profile');
    const profile = JSON.parse(user_profile);

    const isProfileCompleted = () => {
      return (
        profile.birth_date &&
        profile.birth_time &&
        profile.birth_city &&
        profile.birth_country
      );
    };

    if (isProfileCompleted()) {
      navigation.replace('Tabs');
    } else {
      navigation.replace('Onboarding');
    }
  }

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <View style={styles.innerContainer}>
          <ShinyContainer>
            <SMSIcon />
          </ShinyContainer>
          <AppText variant='subtitle2' color='primary' style={styles.title}>{t('VERIFICATION SUCCESS')}</AppText>
          <AppText variant='caption1' style={styles.subtitle} color='white'>
            {t('VERIFICATION SUCCESS SUBTITLE')}
          </AppText>
        </View>

        <AppButton
          title={t('Continue')}
          onPress={handleContinue}
          style={styles.button}
        />
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: scaleSize(40),
  },
  title: {
    marginBottom: scaleSize(10),
    marginTop: scaleSize(24),
    fontSize: scaleFont(16), // assuming subtitle2
  },
  subtitle: {
    textAlign: 'center',
    lineHeight: scaleSize(20),
    fontSize: scaleFont(12), // assuming caption1
  },
  button: {
    marginTop: scaleSize(126),
    width: '100%',
  },
});

export default OtpSuccess;
