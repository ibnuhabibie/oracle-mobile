import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Alert, StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";

import api from "../../utils/http";
import { AppButton } from "../../components/ui/app-button";
import { AuthFormProps } from "./signin-form";
import AppInput from "../../components/ui/app-input";
import PasswordToggle from "../../components/ui/password-toggle";
import { useAsyncStorage } from "../../hooks/use-storage";
import { COLORS } from "../../constants/colors";
import { scaleSize } from "../../utils/scale";

const SignUpForm: React.FC<AuthFormProps> = ({ onSuccess }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();
    const { sync } = useAsyncStorage();

    const {
        control,
        handleSubmit,
        getValues,
        formState: { errors }
    } = useForm({
        defaultValues: {
            full_name: '',
            email: '',
            password: '',
            confirm_password: '',
            referral_code: '',
            locale: 'en'
        },
    });

    const formRules = {
        full_name: {
            required: t('registerForm.nameRequired'),
            minLength: {
                value: 2,
                message: t('registerForm.nameMinLength')
            }
        },
        email: {
            required: t('registerForm.emailRequired'),
            pattern: {
                value: /^\S+@\S+$/i,
                message: t('registerForm.invalidEmailFormat')
            }
        },
        password: {
            required: t('registerForm.passwordRequired'),
            minLength: {
                value: 6,
                message: t('registerForm.passwordMinLength')
            }
        },
        confirm_password: {
            required: t('registerForm.confirmPasswordRequired'),
            validate: (value: string) =>
                value === getValues('password') || t('registerForm.passwordsDoNotMatch')
        }
    };


    const onSubmit = async (data: any) => {
        setLoading(true);
        try {
            const locale = await AsyncStorage.getItem('language');
            data.locale = locale;
            console.log('Sign up data:', data);

            const res = await api.post('/v1/users/register', data)
            await AsyncStorage.setItem('auth_token', res.data.token);

            await sync();
            onSuccess(res.data)
        } catch (error) {
            console.log(error);
            const errorMessage = error?.meta?.message || t('registerForm.registerFailedMessage');
            Alert.alert(t('registerForm.registerFailed'), errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <View style={{ flexDirection: 'column', gap: 12 }}>
                <AppInput
                    control={control}
                    name="full_name"
                    rules={formRules.full_name}
                    placeholder={t('registerForm.name')}
                    errors={errors}
                    inputStyle={styles.appInput}
                />
                <AppInput
                    control={control}
                    name="email"
                    rules={formRules.email}
                    placeholder={t('registerForm.email')}
                    errors={errors}
                    keyboardType="email-address"
                    inputStyle={styles.appInput}
                />
                <AppInput
                    control={control}
                    name="password"
                    rules={formRules.password}
                    placeholder={t('registerForm.password')}
                    secureTextEntry={!showPassword}
                    errors={errors}
                    rightIcon={
                        <PasswordToggle
                            onToggle={() => setShowPassword(prev => !prev)}
                            showPassword={showPassword} />
                    }
                    inputStyle={styles.appInput}
                />
                <AppInput
                    control={control}
                    name="confirm_password"
                    rules={formRules.confirm_password}
                    placeholder={t('registerForm.confirmPassword')}
                    secureTextEntry={!showConfirmPassword}
                    errors={errors}
                    rightIcon={
                        <PasswordToggle
                            onToggle={() => setShowConfirmPassword(prev => !prev)}
                            showPassword={showConfirmPassword} />
                    }
                    inputStyle={styles.appInput}
                />
                <AppInput
                    control={control}
                    name="referral_code"
                    placeholder={t('registerForm.referralCode')}
                    errors={errors}
                    inputStyle={styles.appInput}
                />
            </View>

            <AppButton
                title={t('registerForm.createAccount')}
                onPress={handleSubmit(onSubmit)}
                style={styles.signInButton}
                disabled={loading}
                loading={loading}
            />
        </>
    )
}

const styles = StyleSheet.create({
    signInButton: {
        marginTop: scaleSize(12),
        width: '100%',
    },
    appInput: {
        backgroundColor: 'rgba(255, 255, 255, 0.13)',
        borderColor: COLORS['light-gray']
    }
});


export default SignUpForm;
