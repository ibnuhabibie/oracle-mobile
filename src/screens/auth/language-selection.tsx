import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { FC } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import ScreenContainer from '../../components/layouts/ScreenContainer';
import { AppButton } from '../../components/ui/app-button';
import { MainNavigatorParamList } from '../../navigators/types';
import i18n from '../../locales/i18n';
import { LANGUAGES } from '../../constants/app';
import { AppText } from '../../components/ui/app-text';
import SelectableItem from '../../components/ui/selectable-item';
import { useTranslation } from 'react-i18next';

type LanguageSelectionProps = NativeStackScreenProps<MainNavigatorParamList, 'LanguageSelection'>;

const LanguageSelection: FC<LanguageSelectionProps> = ({ navigation }) => {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      language: 'en',
    },
  });
  const { t } = useTranslation();

  const onSubmit = async (data: any) => {
    await i18n.changeLanguage(data.language);
    await AsyncStorage.setItem('language', data.language);

    navigation.push('SignIn');
  };

  return (
    <ScreenContainer style={{ marginTop: 44 }}>
      <AppText variant="subtitle2" style={styles.heading}>{t('PLEASE SELECT A LANGUAGE')}</AppText>

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
        title={t('NEXT')}
        onPress={handleSubmit(onSubmit)}
        style={styles.button}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  heading: {
    fontWeight: 300,
    textAlign: 'center',
    marginBottom: 20,
  },
  list: {
    gap: 12,
  },
  button: {
    marginTop: 'auto',
  },
});

export default LanguageSelection;
