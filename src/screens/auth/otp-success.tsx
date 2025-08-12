import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
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
        <View
          style={{ width: '100%', alignItems: 'center', paddingHorizontal: 40 }}>
          <ShinyContainer>
            <SMSIcon />
          </ShinyContainer>
          <AppText style={styles.title}>{t('VERIFICATION SUCCESS')}</AppText>
          <AppText style={styles.subtitle} color='white'>
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
  title: {
    fontSize: 18,
    color: COLORS.primary,
    fontFamily: fontFamilies.ARCHIVO.light,
    marginBottom: 10,
    marginTop: 24,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20
  },
  button: {
    marginTop: 126,
    width: '100%',
  },
});

export default OtpSuccess;
