import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

import api from "../../utils/http";
import TextField from "../../components/ui/text-field";
import EyeCrossedIcon from "../../components/icons/EyeCrossed";
import EyeIcon from "../../components/icons/Eye";
import { AppButton } from "../../components/ui/app-button";
import { AuthFormProps } from "./signin-form";
import AppInput from "../../components/ui/app-input";
import PasswordToggle from "../../components/ui/password-toggle";

const SignUpForm: React.FC<AuthFormProps> = ({ onSuccess }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
            required: 'Name is required',
            minLength: {
                value: 2,
                message: 'Name must be at least 2 characters'
            }
        },
        email: {
            required: 'Email is required',
            pattern: {
                value: /^\S+@\S+$/i,
                message: 'Invalid email format'
            }
        },
        password: {
            required: 'Password is required',
            minLength: {
                value: 6,
                message: 'Password must be at least 6 characters'
            }
        },
        confirm_password: {
            required: 'Please confirm your password',
            validate: (value: string) =>
                value === getValues('password') || 'Passwords do not match'
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
            Alert.alert('Login Failed', error.meta.message)
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
                    placeholder="Name"
                    errors={errors}
                />
                <AppInput
                    control={control}
                    name="email"
                    rules={formRules.email}
                    placeholder="Email"
                    errors={errors}
                    keyboardType="email-address"
                />
                <AppInput
                    control={control}
                    name="password"
                    rules={formRules.password}
                    placeholder="Password"
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
                    placeholder="Confirm Password"
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
                    placeholder="Referral Code"
                    errors={errors}
                />
            </View>

            <AppButton
                title="Create Account"
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