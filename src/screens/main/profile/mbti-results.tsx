import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { FC, useEffect } from 'react';
import { BackHandler } from 'react-native';

import ScreenContainer from '../../../components/layouts/screen-container';
import { MainNavigatorParamList } from '../../../navigators/types';
import MBTIProfile from '../../../features/mbti/mbti-profile';
import Header from '../../../components/ui/header';

type MbtiResultsProps = NativeStackScreenProps<MainNavigatorParamList, 'MbtiResults'>;

const MbtiResults: FC<MbtiResultsProps> = ({ navigation }) => {
  const handleBack = () => {
    const state = navigation.getState();
    const routes = state.routes;
    const prevRoute = routes[routes.length - 2];

    console.log('Previous route:', prevRoute);
    console.log('Current route stack:', routes);

    if (prevRoute && prevRoute.name === 'SignUp') {
      navigation.popToTop();
      navigation.replace('Tabs');
    } else if (prevRoute == undefined) {
      navigation.replace('Tabs');
    } else {
      navigation.goBack();
    }
  };

  useEffect(() => {
    const onDeviceBack = () => {
      handleBack();
      return true; // prevent default
    };
    const sub = BackHandler.addEventListener('hardwareBackPress', onDeviceBack);
    return () => sub.remove();
  }, [navigation]);

  return (
    <ScreenContainer
      header={
        <Header
          title="MBTI"
          onBack={handleBack}
        />
      }
    >
      <MBTIProfile />
    </ScreenContainer>
  );
};

export default MbtiResults;
