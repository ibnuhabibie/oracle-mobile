import React, { Component } from 'react';
import { Pressable, View, StyleSheet } from 'react-native';
import { AppText } from './app-text';

import CheckIcon from '../icons/auth/check-icon';
import { COLORS } from '../../constants/colors'; // Assuming you have COLORS defined
import { scaleSize } from '../../utils/scale';

// Define the shape of your selectable item's data
export interface SelectableItemData {
    key: string;
    label: string;
}

// Define the props for your SelectableItem component
interface SelectableItemProps {
    item: SelectableItemData;       // The data for the specific item
    isSelected: boolean;           // Whether this item is currently selected
    onChange: (key: string) => void; // Callback when the item is pressed
}

class SelectableItem extends Component<SelectableItemProps> {
    render() {
        const { item, isSelected, onChange } = this.props;

        return (
            <Pressable
                onPress={() => onChange(item.key)}
                style={[styles.item, isSelected && styles.itemSelected]}
            >
                <AppText variant="body1" color="white" style={styles.itemText}>{item.label}</AppText>
                <View
                    style={[
                        styles.checkbox,
                        isSelected && styles.checkboxSelected,
                    ]}
                >
                    {isSelected && <CheckIcon size={scaleSize(20)} color={COLORS.white} />}
                </View>
            </Pressable>
        );
    }
}

const styles = StyleSheet.create({
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: scaleSize(15),
        paddingHorizontal: scaleSize(20),
        borderRadius: scaleSize(12),
        borderWidth: scaleSize(1),
        backgroundColor: '#FFFFFF21'
    },
    itemSelected: {
        borderColor: COLORS.neutral,
    },
    itemText: {
        flex: 1,
    },
    checkbox: {
        width: scaleSize(15),
        height: scaleSize(15),
        borderRadius: scaleSize(4),
        borderWidth: scaleSize(2),
        borderColor: COLORS.white,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: scaleSize(15),
    },
});

export default SelectableItem;
