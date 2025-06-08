import React from 'react';
import { Pressable } from 'react-native';
import EyeIcon from '../icons/Eye';
import EyeCrossedIcon from '../icons/EyeCrossed';

interface PasswordToggleProps {
    showPassword: boolean;
    onToggle: () => void;
    iconSize?: number;
}

const PasswordToggle: React.FC<PasswordToggleProps> = ({
    showPassword,
    onToggle,
    iconSize = 20,
}) => {
    return (
        <Pressable onPress={onToggle}>
            {
                showPassword ?
                    (
                        <EyeCrossedIcon size={iconSize} />
                    )
                    :
                    (
                        <EyeIcon size={iconSize} />
                    )}
        </Pressable>
    );
};

export default PasswordToggle;