import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { FC } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import ArrowIcon from '../../../components/icons/Arrow';

import ScreenContainer from '../../../components/layouts/ScreenContainer';
import { MainNavigatorParamList } from '../../../navigators/types';
import MBTIProfile from '../../../features/mbti/mbti-profile';
import { AppText } from '../../../components/ui/app-text';
import { COLORS } from '../../../constants/colors';
import { fontFamilies } from '../../../constants/fonts';

type MbtiResultsProps = NativeStackScreenProps<MainNavigatorParamList, 'MbtiResults'>;

const MbtiResults: FC<MbtiResultsProps> = ({ navigation }) => {
  return (
    <ScreenContainer
      header={
        <View style={styles.header}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={styles.backButton}>
            <ArrowIcon />
          </Pressable>
          <AppText variant='subtitle2' style={styles.headerTitle}>MBTI</AppText>
        </View>
      }
    >
      <MBTIProfile />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 12,
    paddingLeft: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    backgroundColor: COLORS.white,
    paddingTop: 8,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginLeft: 20,
    textAlign: 'center',
    fontFamily: fontFamilies.ARCHIVO.light,
  },
});

export default MbtiResults;
