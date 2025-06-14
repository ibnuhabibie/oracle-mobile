import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { FC } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

// i18n
import { useTranslation } from "react-i18next";

import { MainNavigatorParamList } from '../../navigators/types';
import ScreenContainer from '../../components/layouts/ScreenContainer';
import ProfileDashboard from '../../features/profile/profile-dashboard';
import { AppText } from '../../components/ui/app-text';

type HomeProps = NativeStackScreenProps<MainNavigatorParamList, 'Home'>;

const Home: FC<HomeProps> = ({ navigation }) => {
  const { t } = useTranslation();
  return (
    <ScreenContainer>
      <ProfileDashboard />
      <AppText style={styles.subtitle} color='primary' variant='subtitle1'>
        {t("WHAT DO YOU LIKE TO KNOW TODAY?")}
      </AppText>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  subtitle: {
    textAlign: 'center',
    letterSpacing: 5,
    lineHeight: 24,
    marginTop: 40,
    textTransform: 'uppercase'
  },
});

export default Home;
