import React, { Component } from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';

import CheckIcon from '../icons/auth/check-icon';
import { COLORS } from '../../constants/colors'; // Assuming you have COLORS defined

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
                <Text style={styles.itemText}>{item.label}</Text>
                <View
                    style={[
                        styles.checkbox,
                        isSelected && styles.checkboxSelected,
                    ]}
                >
                    {isSelected && <CheckIcon size={20} />}
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
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: COLORS['light-gray'],
    },
    itemSelected: {
        backgroundColor: '#f9eadf',
        borderColor: '#d7b894',
    },
    itemText: {
        fontSize: 16,
        color: COLORS.black,
        flex: 1,
    },
    checkbox: {
        width: 15,
        height: 15,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: '#888',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 15,
    },
    checkboxSelected: {
        borderColor: 'rgba(52, 52, 52, 0)',
        backgroundColor: COLORS.primary,
    }
});

export default SelectableItem;