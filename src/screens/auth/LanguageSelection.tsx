/* eslint-disable react-native/no-inline-styles */
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { FC } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import CheckIcon from '../../components/icons/Check';
import ScreenContainer from '../../components/layouts/ScreenContainer';
import { Button } from '../../components/ui/button';
import { fontFamilies } from '../../constants/fonts';
import { MainNavigatorParamList } from '../../navigators/AuthNavigator';
import i18n from '../../utils/i18n';

const LANGUAGES = [
  { key: 'en', label: 'English' },
  { key: 'zh', label: '中文简体' },
  { key: 'id', label: 'Bahasa Indonesia' },
  { key: 'jp', label: '日本語' },
  { key: 'kr', label: '한국어' },
  { key: 'th', label: 'ภาษาไทย' },
];

const LanguageSelection: FC<{
  navigation: NativeStackNavigationProp<
    MainNavigatorParamList,
    'LanguageSelection'
  >;
}> = ({ navigation }) => {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      language: 'en',
    },
  });

  const onSubmit = async (data: any) => {
    console.log('Selected language:', data.language);

    // TODO: Navigate to next screen or persist choice
    await i18n.changeLanguage(data.language);
    await AsyncStorage.setItem('language', data.language);

    navigation.push('SignIn');
  };

  return (
    <ScreenContainer style={{ marginTop: 44 }}>
      <Text style={styles.heading}>Please Select a Language</Text>

      <Controller
        control={control}
        name="language"
        render={({ field: { value, onChange } }) => (
          <View style={styles.list}>
            {LANGUAGES.map(lang => {
              const isSelected = value === lang.key;
              return (
                <Pressable
                  key={lang.key}
                  onPress={() => onChange(lang.key)}
                  style={[styles.item, isSelected && styles.itemSelected]}>
                  <Text style={styles.itemText}>{lang.label}</Text>
                  <View
                    style={[
                      styles.checkbox,
                      isSelected && styles.checkboxSelected,
                    ]}>
                    {isSelected && <CheckIcon size={20} />}
                  </View>
                </Pressable>
              );
            })}
          </View>
        )}
      />

      <Button
        title="Next"
        onPress={handleSubmit(onSubmit)}
        style={styles.button}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  heading: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: fontFamilies.ARCHIVO.light,
  },
  list: {
    gap: 12,
    marginBottom: 24,
  },
  item: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemSelected: {
    backgroundColor: '#f9eadf',
    borderColor: '#d7b894',
  },
  itemText: {
    fontSize: 16,
    fontFamily: fontFamilies.ARCHIVO.light,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#888',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    borderColor: 'rgba(52, 52, 52, 0)',
    backgroundColor: 'rgba(52, 52, 52, 0)',
  },
  checkboxDot: {
    width: 10,
    height: 10,
    borderRadius: 2,
    backgroundColor: '#fff',
  },
  button: {
    marginTop: 'auto',
    width: '100%',
  },
});

export default LanguageSelection;
