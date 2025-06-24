import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import api from "../../utils/http";
import TextField from "../../components/ui/text-field";
import EyeCrossedIcon from "../../components/icons/auth/eye-crossed-icon";
import EyeIcon from "../../components/icons/profile/eye-icon";
import { AppButton } from "../../components/ui/app-button";
import { AuthFormProps } from "./signin-form";
import AppInput from "../../components/ui/app-input";
import PasswordToggle from "../../components/ui/password-toggle";

const SignUpForm: React.FC<AuthFormProps> = ({ onSuccess }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { t } = useTranslation();

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
        },
    });

    const formRules = {
        full_name: {
            required: t('NAME IS REQUIRED'),
            minLength: {
                value: 2,
                message: t('NAME MIN LENGTH')
            }
        },
        email: {
            required: t('EMAIL IS REQUIRED'),
            pattern: {
                value: /^\S+@\S+$/i,
                message: t('INVALID EMAIL FORMAT')
            }
        },
        password: {
            required: t('PASSWORD IS REQUIRED'),
            minLength: {
                value: 6,
                message: t('PASSWORD MIN LENGTH')
            }
        },
        confirm_password: {
            required: t('PLEASE CONFIRM PASSWORD'),
            validate: (value: string) =>
                value === getValues('password') || t('PASSWORDS DO NOT MATCH')
        }
    };


    const onSubmit = async (data: any) => {
        try {
            console.log('Sign up data:', data);
            const res = await api.post('/v1/users/register', data)
            await AsyncStorage.setItem('auth_token', res.data.token);

            // navigation.navigate('Otp', { email: res.data.email });
            onSuccess(res.data.email)
        } catch (error) {
            Alert.alert(t('LOGIN FAILED'), error.meta.message)
            console.log(error)
        }
    };

    return (
        <>
            <View style={{ flexDirection: 'column', gap: 12 }}>
                <AppInput
                    control={control}
                    name="full_name"
                    rules={formRules.full_name}
                    placeholder={t('NAME')}
                    errors={errors}
                />
                <AppInput
                    control={control}
                    name="email"
                    rules={formRules.email}
                    placeholder={t('EMAIL')}
                    errors={errors}
                    keyboardType="email-address"
                />
                <AppInput
                    control={control}
                    name="password"
                    rules={formRules.password}
                    placeholder={t('PASSWORD')}
                    secureTextEntry={!showPassword}
                    errors={errors}
                    rightIcon={
                        <PasswordToggle
                            onToggle={() => setShowPassword(prev => !prev)}
                            showPassword={showPassword} />
                    }
                />
                <AppInput
                    control={control}
                    name="confirm_password"
                    rules={formRules.confirm_password}
                    placeholder={t('CONFIRM PASSWORD')}
                    secureTextEntry={!showConfirmPassword}
                    errors={errors}
                    rightIcon={
                        <PasswordToggle
                            onToggle={() => setShowConfirmPassword(prev => !prev)}
                            showPassword={showConfirmPassword} />
                    }
                />
                <AppInput
                    control={control}
                    name="referral_code"
                    placeholder={t('REFERRAL CODE')}
                    errors={errors}
                />
            </View>

            <AppButton
                title={t('CREATE ACCOUNT')}
                onPress={handleSubmit(onSubmit)}
                style={styles.signInButton}
            />
        </>
    )
}

const styles = StyleSheet.create({
    signInButton: {
        marginTop: 12,
        width: '100%',
    },
});


export default SignUpForm;
