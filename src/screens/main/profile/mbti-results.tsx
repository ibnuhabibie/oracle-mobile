import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { FC } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import ArrowIcon from '../../../components/icons/Arrow';

import ScreenContainer from '../../../components/layouts/ScreenContainer';
import { MainNavigatorParamList } from '../../../navigators/types';
import MBTIProfile from '../../../features/mbti/mbti-profile';
import { AppText } from '../../../components/ui/app-text';

type MbtiResultsProps = NativeStackScreenProps<MainNavigatorParamList, 'MbtiResults'>;

const MbtiResults: FC<MbtiResultsProps> = ({ navigation }) => {
  return (
    <ScreenContainer>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={styles.backButton}>
            <ArrowIcon />
          </Pressable>
          <AppText variant='subtitle2'>MBTI</AppText>
        </View>
        <MBTIProfile />
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
});

export default MbtiResults;
