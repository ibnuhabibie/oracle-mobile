import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { View, TextInput, StyleSheet, Text, TextInputProps } from 'react-native';
import { COLORS } from '../../constants/colors';

type OtpInputProps = {
    length?: number;
    onChangeOtp?: (code: string) => void;
    error?: string;
    reset?: () => void;
};

export const OtpInput: React.FC<OtpInputProps> = forwardRef<RNTextInput[], OtpInputProps>(({ length = 6, onChangeOtp, error }, ref) => {
    const [otp, setOtp] = useState(Array(length).fill(''));
    const inputs = useRef<(TextInput | null)[]>([]);

    useImperativeHandle(ref, () => ({
        reset: () => {
            setOtp(Array(length).fill(''));
            inputs.current[0]?.focus();
        }
    }));

    const focusInput = (index) => {
        if (inputs.current[index]) {
            inputs.current[index].focus();
        }
    };

    const handleChange = (text, index) => {
        if (!text) {
            const newOtp = [...otp];
            newOtp[index] = '';
            setOtp(newOtp);
            onChangeOtp && onChangeOtp(newOtp.join(''));
            return;
        }

        // Clean text (keep digits only)
        const digits = text.replace(/\D/g, '');
        console.log(digits, 'handleChange')

        // Handle paste (more than one digit)
        if (digits.length > 1) {
            console.log(digits, 'handleChange')
            // Fill otp from current index onward with pasted digits
            const newOtp = [...otp];
            for (let i = 0; i < digits.length; i++) {
                if (index + i < length) {
                    newOtp[index + i] = digits[i];
                }
            }
            setOtp(newOtp);
            onChangeOtp && onChangeOtp(newOtp.join(''));

            // Focus next input after pasted text or last one
            const nextIndex = Math.min(index + digits.length, length - 1);
            focusInput(nextIndex);
            return;
        }

        // Normal single digit input
        const newOtp = [...otp];
        newOtp[index] = digits;
        setOtp(newOtp);
        onChangeOtp && onChangeOtp(newOtp.join(''));

        // Move focus forward if digit entered
        if (digits && index < length - 1) {
            focusInput(index + 1);
        }
    };

    const handleKeyPress = ({ nativeEvent }, index) => {
        if (nativeEvent.key === 'Backspace') {
            if (otp[index] === '') {
                // Move back if current empty
                if (index > 0) {
                    focusInput(index - 1);
                    const newOtp = [...otp];
                    newOtp[index - 1] = '';
                    setOtp(newOtp);
                    onChangeOtp && onChangeOtp(newOtp.join(''));
                }
            } else {
                // Clear current input
                const newOtp = [...otp];
                newOtp[index] = '';
                setOtp(newOtp);
                onChangeOtp && onChangeOtp(newOtp.join(''));
            }
        }
    };

    return (
        <View style={styles.wrapper}>
            <View style={styles.container}>
                {Array(length)
                    .fill(0)
                    .map((_, i) => (
                        <TextInput
                            key={i}
                            ref={(ref) => (inputs.current[i] = ref)}
                            style={[styles.input, error ? styles.inputError : null]}
                            keyboardType="number-pad"
                            maxLength={1}
                            value={otp[i]}
                            onChangeText={(text) => handleChange(text, i)}
                            onKeyPress={(e) => handleKeyPress(e, i)}
                            autoFocus={i === 0}
                            returnKeyType="next"
                            importantForAutofill="no"
                            autoComplete="off"
                            textContentType="oneTimeCode" a
                        />
                    ))}
            </View>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>
    );
});

const styles = StyleSheet.create({
    wrapper: {
        alignItems: 'center',
    },
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        columnGap: 12,
    },
    input: {
        width: 48,
        height: 48,
        borderWidth: 1,
        borderColor: COLORS['light-gray'],
        borderRadius: 8,
        textAlign: 'center',
        fontSize: 20,
        color: COLORS.black
    },
    inputError: {
        borderColor: COLORS.red,
    },
    errorText: {
        color: COLORS.red,
        fontSize: 14,
        marginTop: 10,
        marginBottom: 10,
        textAlign: 'center',
    },
});
