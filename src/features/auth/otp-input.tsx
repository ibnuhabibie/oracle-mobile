import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { View, TextInput, StyleSheet, TextInputProps, Dimensions } from 'react-native';
import { AppText } from '../../components/ui/app-text';
import { COLORS } from '../../constants/colors';
import { scaleSize } from '../../utils/scale';

type OtpInputProps = {
    length?: number;
    onChangeOtp?: (code: string) => void;
    error?: string;
    reset?: () => void;
};

export type OtpInputRef = { reset: () => void };

export const OtpInput: React.FC<OtpInputProps> = forwardRef<OtpInputRef, OtpInputProps>(({ length = 6, onChangeOtp, error }, ref) => {
    const [otp, setOtp] = useState<string[]>(Array(length).fill(''));
    const inputs = useRef<Array<TextInput | null>>([]);

    useImperativeHandle(ref, () => ({
        reset: () => {
            setOtp(Array(length).fill(''));
            if (inputs.current[0]) {
                inputs.current[0].focus();
            }
        }
    }));

    const focusInput = (index: number) => {
        if (inputs.current[index]) {
            inputs.current[index].focus();
        }
    };

    const handleChange = (text: string, index: number) => {
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

    const handleKeyPress = ({ nativeEvent }: { nativeEvent: any }, index: number) => {
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

    // Dynamic sizing logic
    const screenWidth = Dimensions.get('window').width;
    const gap = scaleSize(12);
    const totalGap = gap * (length - 1);
    const inputSize = Math.floor((screenWidth - totalGap - scaleSize(48)) / length); // scaleSize(48) for some padding

    return (
        <View style={styles.wrapper}>
            <View style={[styles.container, { columnGap: gap }]}>
                {Array(length)
                    .fill(0)
                    .map((_, i) => (
                        <TextInput
                            key={i}
                            ref={ref => { inputs.current[i] = ref; }}
                            style={[
                                styles.input,
                                { width: inputSize, height: inputSize, fontSize: scaleSize(20) },
                                error ? styles.inputError : null
                            ]}
                            keyboardType="number-pad"
                            maxLength={1}
                            value={otp[i]}
                            onChangeText={(text) => handleChange(text, i)}
                            onKeyPress={(e) => handleKeyPress(e, i)}
                            autoFocus={i === 0}
                            returnKeyType="next"
                            importantForAutofill="no"
                            autoComplete="off"
                            textContentType="oneTimeCode"
                        />
                    ))}
            </View>
            {error ? <AppText variant="caption1" color="red" style={styles.errorText}>{error}</AppText> : null}
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
    },
    input: {
        borderWidth: scaleSize(1),
        borderColor: COLORS['light-gray'],
        borderRadius: scaleSize(8),
        textAlign: 'center',
        color: COLORS.neutral,
        backgroundColor: 'transparent',
    },
    inputError: {
        borderColor: COLORS.red,
    },
    errorText: {
        marginTop: scaleSize(10),
        marginBottom: scaleSize(10),
        textAlign: 'center',
    },
});
