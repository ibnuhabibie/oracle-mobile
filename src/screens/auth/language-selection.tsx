import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { FC, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';
import * as RNLocalize from "react-native-localize";
import { scaleFont, scaleSize } from '../../utils/scale';
import AsyncStorage from '@react-native-async-storage/async-storage';

import ScreenContainer from '../../components/layouts/screen-container';
import { AppButton } from '../../components/ui/app-button';
import { MainNavigatorParamList } from '../../navigators/types';
import i18n from '../../locales/i18n';
import { LANGUAGES } from '../../constants/app';
import { AppText } from '../../components/ui/app-text';
import SelectableItem from '../../components/ui/selectable-item';
import { useTranslation } from 'react-i18next';

type LanguageSelectionProps = NativeStackScreenProps<MainNavigatorParamList, 'LanguageSelection'>;

const getDeviceLanguage = () => {
  const locales = RNLocalize.getLocales();
  if (Array.isArray(locales) && locales.length > 0) {
    let deviceLanguageCode = locales[0].languageCode; // e.g. "en"
    return deviceLanguageCode;
  }
  return 'en';
};

const LanguageSelection: FC<LanguageSelectionProps> = ({ navigation }) => {
  // Use device language for initial selection
  const deviceLangCode = getDeviceLanguage();
  console.log(deviceLangCode, 'deviceLangCode')
  const deviceLang = LANGUAGES.find(l => l.key === deviceLangCode) ? deviceLangCode : 'en';

  const { control, handleSubmit, setValue } = useForm({
    defaultValues: {
      language: deviceLang,
    },
  });
  const { t } = useTranslation();

  const onSubmit = async (data: any) => {
    await i18n.changeLanguage(data.language);
    await AsyncStorage.setItem('language', data.language);

    navigation.push('SignIn');
  };

  // If device language changes after mount, update selected language
  useEffect(() => {
    let langCode = getDeviceLanguage();
    const found = LANGUAGES.find(l => l.key === langCode);
    if (found) {
      setValue('language', langCode);
      i18n.changeLanguage(langCode);
    }
  }, [setValue]);

  return (
    <ScreenContainer style={styles.container}>
      <AppText variant="subtitle2" style={styles.heading} color='white'>{t('languageSelection.heading')}</AppText>

      <Controller
        control={control}
        name="language"
        render={({ field: { value, onChange } }) => (
          <View style={styles.list}>
            {LANGUAGES.map(lang => {
              const isSelected = value === lang.key;
              return (
                <SelectableItem
                  item={lang}
                  onChange={(selectedKey) => {
                    onChange(selectedKey);
                    i18n.changeLanguage(selectedKey);
                  }}
                  isSelected={isSelected}
                  key={lang.key} />
              );
            })}
          </View>
        )}
      />
      <AppButton
        title={t('languageSelection.next')}
        onPress={handleSubmit(onSubmit)}
        style={styles.button}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: scaleSize(44),
  },
  heading: {
    fontWeight: '300',
    textAlign: 'center',
    marginBottom: scaleSize(20),
    fontSize: scaleFont(16), // assuming subtitle2
  },
  list: {
    gap: scaleSize(12),
  },
  button: {
    marginTop: 'auto',
  },
});

export default LanguageSelection;
