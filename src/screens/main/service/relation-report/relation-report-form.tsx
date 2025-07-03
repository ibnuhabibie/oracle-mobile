import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Platform, Pressable } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import DateTimePicker from '@react-native-community/datetimepicker';
import { AppText } from '../../../../components/ui/app-text';
import { AppButton } from '../../../../components/ui/app-button';
import { COLORS } from '../../../../constants/colors';
import AppInput from '../../../../components/ui/app-input';
import TextField from '../../../../components/ui/text-field';
import { DropdownButton, renderDropdownModal } from '../../../../components/widgets/dropdown';
import api from '../../../../utils/http';
import { t } from 'i18next';
import CalendarIcon from '../../../../components/icons/auth/calendar-icon';
import { formatDate } from '../../../../utils/formatter';

interface Country {
  name: string;
  iso3: string;
}
interface City {
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

  const formRules = {
    full_name: {
      required: t('NAME IS REQUIRED'),
      minLength: {
        value: 2,
        message: t('NAME MIN LENGTH')
      }
    },
  };

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [showCityModal, setShowCityModal] = useState(false);
  const [countries, setCountries] = useState<Country[]>([]);
  const [cities, setCities] = useState<City[]>([]);

  const watchedCountry = watch('birth_country');
  const watchedCity = watch('birth_city');
  const watchedDate = watch('birth_date');
  const watchedGender = watch('gender');

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await api.get('/v1/configs/countries');
        setCountries(response.data);
        const country = response.data[0]
        setValue('birth_country', {
          name: country.name,
          iso3: country.iso3,
        });
        await fetchCities(country)
      } catch (error) {
        setCountries([]);
      }
    };
    fetchCountries();
  }, []);

  const fetchCities = async (country: Country) => {
    try {
      const response = await api.get(`/v1/configs/countries/${country.iso3}/cities`);
      setCities(response.data);
      if (response.data.length > 0) {
        const city = response.data[0]
        console.log(city, 'city')
        setValue('birth_city', {
          name: city.name,
          latitude: city.latitude,
          longitude: city.longitude,
        });

      }
    } catch (error) {
      setCities([]);
    }
  };

  const selectCountry = async (country: Country) => {
    setValue('birth_country', country);
    await fetchCities(country);
    setShowCountryModal(false);
  };

  const selectCity = (city: City) => {
    setValue('birth_city', city);
    setShowCityModal(false);
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setValue('birth_date', selectedDate);
    }
  };

  return (
    <View style={styles.formContainer}>
      <AppText style={styles.formTitle} color='primary'>{t('Fill in your details')}</AppText>
      <View style={styles.formGroup}>
        <Text style={styles.label}>{t("Name")}</Text>
        <AppInput
          control={control}
          name="full_name"
          rules={formRules.full_name}
          placeholder={t("Name")}
          errors={errors}
        />
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>{t("Birth Date")}</Text>
        <Pressable onPress={() => setShowDatePicker(true)}>
          <View pointerEvents="none">
            <TextField
              placeholder={t("Birth Date:")}
              value={formatDate(watchedDate)}
              style={styles.textField}
              editable={false}
              rightIcon={<CalendarIcon size={15} />}
            />
          </View>
        </Pressable>
        {showDatePicker && (
          <DateTimePicker
            value={watchedDate}
            mode="date"
            display="default"
            onChange={onDateChange}
            maximumDate={new Date()}
          />
        )}
      </View>
      <View style={styles.formGroup}>
        <AppText style={styles.label}>{t("Country of Birth")}</AppText>
        <DropdownButton
          onPress={() => setShowCountryModal(true)}
          text={watchedCountry?.name || t("Please select one")}
        />
        {renderDropdownModal(
          showCountryModal,
          () => setShowCountryModal(false),
          t('Select Country'),
          countries as any[],
          selectCountry,
          watchedCountry as any,
          'iso3'
        )}
      </View>
      <View style={styles.formGroup}>
        <AppText style={styles.label}>{t("City of Birth")}</AppText>
        <DropdownButton
          onPress={() => setShowCityModal(true)}
          text={watchedCity?.name || t("Please select one")}
        />
        {renderDropdownModal(
          showCityModal,
          () => setShowCityModal(false),
          t('Select City'),
          cities as any[],
          selectCity,
          watchedCity as any,
          'name'
        )}
      </View>
      <View style={styles.formGroup}>
        <AppText style={styles.label}>{t("Gender")}</AppText>
        <View style={{ flexDirection: 'row', gap: 24 }}>
          <Pressable
            style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
            onPress={() => setValue('gender', 'Male')}
          >
            <View style={{
              width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: '#c1976b',
              alignItems: 'center', justifyContent: 'center'
            }}>
              {watchedGender === 'Male' && (
                <View style={{
                  width: 10, height: 10, borderRadius: 5, backgroundColor: '#c1976b'
                }} />
              )}
            </View>
            <Text>{t("Male")}</Text>
          </Pressable>
          <Pressable
            style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
            onPress={() => setValue('gender', 'Female')}
          >
            <View style={{
              width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: '#c1976b',
              alignItems: 'center', justifyContent: 'center'
            }}>
              {watchedGender === 'Female' && (
                <View style={{
                  width: 10, height: 10, borderRadius: 5, backgroundColor: '#c1976b'
                }} />
              )}
            </View>
            <Text>{t("Female")}</Text>
          </Pressable>
        </View>
        {errors.gender && <Text style={styles.error}>{errors.gender.message}</Text>}
      </View>
      <View style={styles.buttonRow}>
        <AppButton
          title={t("Continue")}
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
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 20,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 2 },
    width: '100%',
    marginTop: 8,
  },
  formTitle: {
    marginBottom: 16,
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: 14,
  },
  label: {
    fontSize: 13,
    marginBottom: 4,
    color: COLORS.black,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 8,
    padding: Platform.OS === 'ios' ? 12 : 8,
    fontSize: 14,
    backgroundColor: '#FAFAFA',
    color: COLORS.black,
  },
  error: {
    color: '#D32F2F',
    fontSize: 12,
    marginTop: 2,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 10,
  },
  cancelButton: {
    marginRight: 8,
  },
  textField: {
    width: '100%',
    marginBottom: 0,
  },
});

export default RelationReportForm;
