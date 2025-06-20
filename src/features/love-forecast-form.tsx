import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Text, TouchableOpacity, Platform } from 'react-native';
import { AppText } from '../components/ui/app-text';
import { AppButton } from '../components/ui/app-button';
import { COLORS } from '../constants/colors';

interface LoveForecastFormProps {
  onSubmit: (values: LoveForecastFormValues) => void;
  onCancel?: () => void;
  loading?: boolean;
}

export interface LoveForecastFormValues {
  full_name: string;
  birth_date: string;
  country_birth: string;
  city_birth: string;
  gender: string;
}

const initialState: LoveForecastFormValues = {
  full_name: '',
  birth_date: '',
  country_birth: '',
  city_birth: '',
  gender: '',
};

export const LoveForecastForm: React.FC<LoveForecastFormProps> = ({ onSubmit, onCancel, loading }) => {
  const [values, setValues] = useState<LoveForecastFormValues>(initialState);
  const [errors, setErrors] = useState<Partial<LoveForecastFormValues>>({});

  const validate = (): boolean => {
    const newErrors: Partial<LoveForecastFormValues> = {};
    if (!values.full_name.trim()) newErrors.full_name = 'Full name is required';
    if (!values.birth_date.trim()) newErrors.birth_date = 'Birth date is required';
    if (!values.country_birth.trim()) newErrors.country_birth = 'Country of birth is required';
    if (!values.city_birth.trim()) newErrors.city_birth = 'City of birth is required';
    if (!values.gender.trim()) newErrors.gender = 'Gender is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: keyof LoveForecastFormValues, value: string) => {
    setValues({ ...values, [field]: value });
    setErrors({ ...errors, [field]: undefined });
  };

  const handleSubmit = () => {
    if (validate()) {
      onSubmit(values);
    }
  };

  return (
    <View style={styles.formContainer}>
      <AppText style={styles.formTitle}>Fill in your details</AppText>
      <View style={styles.formGroup}>
        <AppText style={styles.label}>Full Name</AppText>
        <TextInput
          style={styles.input}
          value={values.full_name}
          onChangeText={text => handleChange('full_name', text)}
          placeholder="Enter your full name"
        />
        {errors.full_name && <Text style={styles.error}>{errors.full_name}</Text>}
      </View>
      <View style={styles.formGroup}>
        <AppText style={styles.label}>Birth Date</AppText>
        <TextInput
          style={styles.input}
          value={values.birth_date}
          onChangeText={text => handleChange('birth_date', text)}
          placeholder="YYYY-MM-DD"
        />
        {errors.birth_date && <Text style={styles.error}>{errors.birth_date}</Text>}
      </View>
      <View style={styles.formGroup}>
        <AppText style={styles.label}>Country of Birth</AppText>
        <TextInput
          style={styles.input}
          value={values.country_birth}
          onChangeText={text => handleChange('country_birth', text)}
          placeholder="Enter country of birth"
        />
        {errors.country_birth && <Text style={styles.error}>{errors.country_birth}</Text>}
      </View>
      <View style={styles.formGroup}>
        <AppText style={styles.label}>City of Birth</AppText>
        <TextInput
          style={styles.input}
          value={values.city_birth}
          onChangeText={text => handleChange('city_birth', text)}
          placeholder="Enter city of birth"
        />
        {errors.city_birth && <Text style={styles.error}>{errors.city_birth}</Text>}
      </View>
      <View style={styles.formGroup}>
        <AppText style={styles.label}>Gender</AppText>
        <TextInput
          style={styles.input}
          value={values.gender}
          onChangeText={text => handleChange('gender', text)}
          placeholder="Enter gender"
        />
        {errors.gender && <Text style={styles.error}>{errors.gender}</Text>}
      </View>
      <View style={styles.buttonRow}>
        <AppButton
          title="Continue"
          variant="primary"
          onPress={handleSubmit}
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
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: COLORS.primary,
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
});

export default LoveForecastForm;
