import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';

import CheckmarkIcon from '../../components/icons/Checkmark';
import ScreenContainer from '../../components/layouts/ScreenContainer';
import { AppButton } from '../../components/ui/app-button';
import { AppText } from '../../components/ui/app-text';
import ShinyContainer from '../../components/widgets/ShinyContainer';
import { COLORS } from '../../constants/colors';
import { fontFamilies } from '../../constants/fonts';
import { MainNavigatorParamList } from '../../navigators/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

type OtpSuccessProps = NativeStackScreenProps<MainNavigatorParamList, 'OtpSuccess'>;

const OtpSuccess: FC<OtpSuccessProps> = ({ navigation }) => {

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
      navigation.replace('Introduction');
    }
  }

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <View
          style={{ width: '100%', alignItems: 'center', paddingHorizontal: 40 }}>
          <ShinyContainer>
            <CheckmarkIcon size={90} />
          </ShinyContainer>
          <AppText style={styles.title}>Verification Success!</AppText>
          <AppText style={styles.subtitle}>
            You're all set! Your account has been verified and is ready to go.
          </AppText>
        </View>

        <AppButton
          title="Continue"
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
    backgroundColor: '#fff',
    width: '100%',
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
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    columnGap: 12,
  },
  otpInput: {
    width: 48,
    height: 48,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 20,
    color: '#000',
  },
  button: {
    marginTop: 126,
    width: '100%',
  },
  resendText: {
    fontSize: 13,
    color: '#555',
    marginTop: 15,
  },
  resendLink: {
    color: '#C0A589',
    fontWeight: '600',
  },
});

export default OtpSuccess;
