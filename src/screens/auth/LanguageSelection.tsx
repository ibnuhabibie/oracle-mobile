import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { FC } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import ScreenContainer from '../../components/layouts/ScreenContainer';
import { Button } from '../../components/ui/button';
import { fontFamilies } from '../../constants/fonts';
import { MainNavigatorParamList } from '../../navigators/types';
import i18n from '../../locales/i18n';
import { LANGUAGES } from '../../constants/app';
import { Text } from '../../components/ui/text';
import SelectableItem from '../../components/ui/selectable-item';

type LanguageSelectionProps = NativeStackScreenProps<MainNavigatorParamList, 'LanguageSelection'>;

const LanguageSelection: FC<LanguageSelectionProps> = ({ navigation }) => {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      language: 'en',
    },
  });

  const onSubmit = async (data: any) => {
    await i18n.changeLanguage(data.language);
    await AsyncStorage.setItem('language', data.language);

    navigation.push('SignIn');
  };

  return (
    <ScreenContainer style={{ marginTop: 44 }}>
      <Text variant="subtitle2" style={styles.heading}>Please Select a Language</Text>

      <Controller
        control={control}
        name="language"
        render={({ field: { value, onChange } }) => (
          <View style={styles.list}>
            {LANGUAGES.map(lang => {
              const isSelected = value === lang.key;
              return (
                <SelectableItem item={lang} onChange={onChange} isSelected={isSelected} />
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
