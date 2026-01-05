import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Platform, Pressable } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import DateTimePicker from '@react-native-community/datetimepicker';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { AppText } from '../../../../components/ui/app-text';
import { AppButton } from '../../../../components/ui/app-button';
import { COLORS } from '../../../../constants/colors';
import AppInput from '../../../../components/ui/app-input';
import TextField from '../../../../components/ui/text-field';
import { DropdownButton, renderDropdownModal } from '../../../../components/widgets/dropdown';
import api from '../../../../utils/http';
import { useTranslation } from 'react-i18next';
import CalendarIcon from '../../../../components/icons/auth/calendar-icon';
import { scaleSize, scaleFont } from '../../../../utils/scale';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Country {
  id: number;
  name: string;
  iso2: string;
}
interface City {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
}

interface RelationReportFormProps {
  onSubmit: (values: RelationReportFormValues) => void;
  onCancel?: () => void;
  loading?: boolean;
}

export interface RelationReportFormValues {
  full_name: string;
  birth_date: Date;
  birth_country: Country | null;
  birth_city: City | null;
  gender: string;
}

const defaultValues: RelationReportFormValues = {
  full_name: '',
  birth_date: new Date(),
  birth_country: null,
  birth_city: null,
  gender: 'Male',
};

export const RelationReportForm: React.FC<RelationReportFormProps> = ({ onSubmit, onCancel, loading }) => {
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors } } = useForm<RelationReportFormValues>({
      defaultValues,
    });

  const { t } = useTranslation();

  const formRules = {
    full_name: {
      required: t('relationReportForm.nameRequired'),
      minLength: {
        value: 2,
        message: t('relationReportForm.nameMinLength')
      }
    },
  };

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [showCityModal, setShowCityModal] = useState(false);
  const [countries, setCountries] = useState<Country[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [labelDropdown, setLabelDropdown] = useState<string>('');

  const watchedCountry = watch('birth_country');
  const watchedCity = watch('birth_city');
  const watchedDate = watch('birth_date');
  const watchedGender = watch('gender');

  const fetchCountries = async () => {
    try {
      const response = await api.get('/v1/configs/countries');
      setCountries(response.data);
      const country = response.data[0]
      setValue('birth_country', response.data[0]);
      await fetchCities(country)
    } catch (error) {
      setCountries([]);
    }
  };

  const fetchCities = async (country: Country) => {
    try {
      const response = await api.get(`/v1/configs/countries/${country.iso2}/cities`);
      setCities(response.data);
      if (response.data.length > 0) {
        const city = response.data[0]
        console.log(city, 'city')
        setValue('birth_city', response.data[0]);
      }
    } catch (error) {
      setCities([]);
    }
  };

  const init = async () => {
    const language = await AsyncStorage.getItem('language');
    setLabelDropdown(language?.startsWith('zh') ? 'name_zh' : `name_${language}`);
  }

  useEffect(() => {
    init();
    fetchCountries();
  }, []);



  const selectCountry = async (country: Country) => {
    setValue('birth_country', country);
    await fetchCities(country);
    setShowCountryModal(false);
  };

  const selectCity = (city: City) => {
    setValue('birth_city', city);
    setShowCityModal(false);
  };

  const onDateChange = (selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setValue('birth_date', selectedDate);
    }
  };

  return (
    <View style={styles.formContainer}>
      <AppText style={styles.formTitle} color='primary'>{t('relationReportForm.formTitle')}</AppText>
      {/* FullName */}
      <View style={styles.formGroup}>
        <AppText variant="caption3" style={styles.label} color="neutral">{t("relationReportForm.fullName")}</AppText>
        <AppInput
          control={control}
          name="full_name"
          rules={formRules.full_name}
          placeholder={t("relationReportForm.fullName")}
          errors={errors}
        />
      </View>
      {/* Birth Date */}
      <View style={styles.formGroup}>
        <AppText variant="caption3" style={styles.label} color="neutral">{t("relationReportForm.birthDate")}</AppText>
        <Pressable onPress={() => setShowDatePicker(true)}>
          <View>
            <TextField
              placeholder={t("relationReportForm.birthDateLabel")}
              value={watchedDate instanceof Date ? watchedDate.toLocaleDateString() : ''}
              style={styles.textField}
              editable={false}
              rightIcon={<CalendarIcon size={15} />}
              onPress={() => setShowDatePicker(true)}
            />
          </View>
        </Pressable>
        {/* {
          showDatePicker && (
            <DateTimePicker
              value={watchedDate}
              mode="date"
              onChange={onDateChange}
              maximumDate={new Date()}
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            />
          )
        } */}
        <DateTimePickerModal
          isVisible={showDatePicker}
          mode="date"
          onConfirm={onDateChange}
          onCancel={() => setShowDatePicker(false)}
        />
      </View>
      {/* Country of Birth */}
      {
        watchedCountry && (
          <>
            <View style={styles.formGroup}>
              <AppText variant="caption3" style={styles.label} color="neutral">{t("relationReportForm.countryOfBirth")}</AppText>
              <DropdownButton
                onPress={() => {
                  setShowCountryModal(true);
                }}
                text={watchedCountry[labelDropdown] || watchedCountry?.name || t("relationReportForm.pleaseSelectOne")}
              />
              {
                renderDropdownModal(
                  showCountryModal,
                  () => setShowCountryModal(false),
                  t('relationReportForm.selectCountry'),
                  countries as any[],
                  selectCountry,
                  watchedCountry as any,
                  'iso3',
                  labelDropdown
                )
              }
            </View>
          </>
        )
      }

      {/* City of Birth */}
      {
        watchedCity && (
          <>
            <View style={styles.formGroup}>
              <AppText variant="caption3" style={styles.label} color="neutral">{t("relationReportForm.cityOfBirth")}</AppText>
              <DropdownButton
                onPress={() => {
                  setShowCityModal(true);
                }}
                text={watchedCity[labelDropdown] || watchedCity?.name || t("relationReportForm.pleaseSelectOne")}
              />
              {
                renderDropdownModal(
                  showCityModal,
                  () => setShowCityModal(false),
                  t('relationReportForm.selectCity'),
                  cities as any[],
                  selectCity,
                  watchedCity as any,
                  'id',
                  labelDropdown
                )
              }
            </View>
          </>
        )
      }
      {/* Gender */}
      <View style={styles.formGroup}>
        <AppText variant="caption3" style={styles.label} color="neutral">{t("relationReportForm.gender")}</AppText>
        <View style={styles.genderRow}>
          <Pressable
            style={styles.genderOption}
            onPress={() => setValue('gender', 'Male')}
          >
            <View style={styles.genderRadio}>
              {watchedGender === 'Male' && (
                <View style={styles.genderRadioSelected} />
              )}
            </View>
            <AppText variant="caption3" color="neutral">{t("relationReportForm.male")}</AppText>
          </Pressable>
          <Pressable
            style={styles.genderOption}
            onPress={() => setValue('gender', 'Female')}
          >
            <View style={styles.genderRadio}>
              {watchedGender === 'Female' && (
                <View style={styles.genderRadioSelected} />
              )}
            </View>
            <AppText variant="caption3" color="neutral">{t("relationReportForm.female")}</AppText>
          </Pressable>
        </View>
        {errors.gender && <AppText variant="caption3" style={styles.error} color="red">{errors.gender.message}</AppText>}
      </View>
      <View style={styles.buttonRow}>
        <AppButton
          title={t("relationReportForm.continue")}
          variant="primary"
          onPress={handleSubmit(onSubmit)}
          loading={loading}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    zIndex: 99,
    padding: scaleSize(20),
    width: '100%',
    marginTop: scaleSize(8),
  },
  formTitle: {
    marginBottom: scaleSize(16),
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: scaleSize(14),
  },
  label: {
    marginBottom: scaleSize(4),
  },
  input: {
    borderWidth: scaleSize(1),
    borderColor: COLORS.primary,
    borderRadius: scaleSize(8),
    padding: Platform.OS === 'ios' ? scaleSize(12) : scaleSize(8),
    fontSize: scaleFont(14),
    backgroundColor: COLORS['input-bg'],
    color: COLORS.black,
  },
  error: {
    color: COLORS['error-dark'],
    marginTop: scaleSize(2),
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: scaleSize(12),
    marginTop: scaleSize(10),
  },
  cancelButton: {
    marginRight: scaleSize(8),
  },
  textField: {
    width: '100%',
    marginBottom: 0,
    backgroundColor: COLORS['overlay-white']
  },
  genderRow: {
    flexDirection: 'row',
    gap: scaleSize(24),
    marginTop: scaleSize(4),
    marginBottom: scaleSize(4),
  },
  genderOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scaleSize(8),
  },
  genderRadio: {
    width: scaleSize(20),
    height: scaleSize(20),
    borderRadius: scaleSize(10),
    borderWidth: scaleSize(2),
    borderColor: COLORS['radio-brown'],
    alignItems: 'center',
    justifyContent: 'center',
  },
  genderRadioSelected: {
    width: scaleSize(10),
    height: scaleSize(10),
    borderRadius: scaleSize(5),
    backgroundColor: COLORS['radio-brown'],
  },
});

export default RelationReportForm;
