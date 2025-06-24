import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { FC } from 'react';

import ScreenContainer from '../../../components/layouts/screen-container';
import { MainNavigatorParamList } from '../../../navigators/types';
import MBTIProfile from '../../../features/mbti/mbti-profile';
import Header from '../../../components/ui/header';

type MbtiResultsProps = NativeStackScreenProps<MainNavigatorParamList, 'MbtiResults'>;

const MbtiResults: FC<MbtiResultsProps> = ({ navigation }) => {
  return (
    <ScreenContainer
      header={
        <Header
          title="MBTI"
          onBack={() => navigation.goBack()}
        />
      }
    >
      <MBTIProfile />
    </ScreenContainer>
  );
};

export default MbtiResults;
