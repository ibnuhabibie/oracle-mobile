import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert, StyleSheet, View } from "react-native";
import { Pressable } from "react-native-gesture-handler";
import { useTranslation } from "react-i18next";

import api from "../../utils/http";
import EyeCrossedIcon from "../../components/icons/auth/eye-crossed-icon";
import EyeIcon from "../../components/icons/profile/eye-icon";
import TextField from "../../components/ui/text-field";
import { AppText } from "../../components/ui/app-text";
import { AppButton } from "../../components/ui/app-button";
import AppInput from "../../components/ui/app-input";
import PasswordToggle from "../../components/ui/password-toggle";

interface LoginDTO {
    email: string;
    password: string
}

export interface AuthFormProps {
    onSuccess: (email: string) => void;
}

const SignInForm: React.FC<AuthFormProps> = ({ onSuccess }) => {

    const [showPassword, setShowPassword] = useState(false);
    const { t } = useTranslation();

    const formRules = {
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
        }
    }

    const {
        control,
        handleSubmit,
        formState: { errors }
    } = useForm({
        defaultValues: {
            email: 'john@example.com',
            password: 'password123',
        },
    });

    const onSubmit = async (data: LoginDTO) => {
        try {
            console.log('Sign in data:', data);
            const res = await api.post('/v1/users/auth/login', data)

            console.log(res)
            await AsyncStorage.setItem('auth_token', res.data.token);
            await AsyncStorage.setItem('user_profile', JSON.stringify(res.data));

            onSuccess(res.data)
        } catch (error) {
            Alert.alert(t('LOGIN FAILED'), error.meta.message)
            console.log(error)
        }
    };

    return (
        <View>
            <View style={{ flexDirection: 'column', gap: 12 }}>
                <AppInput<LoginDTO>
                    control={control}
                    name="email"
                    rules={formRules.email}
                    placeholder={t('EMAIL')}
                    keyboardType="email-address"
                    errors={errors}
                />
                <AppInput<LoginDTO>
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
            </View>

            <AppButton
                title={t('SIGN IN')}
                onPress={handleSubmit(onSubmit)}
                style={styles.signInButton}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    signInButton: {
        marginTop: 12,
        width: '100%',
    },
});

export default SignInForm;
