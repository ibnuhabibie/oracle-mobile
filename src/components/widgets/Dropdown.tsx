/* eslint-disable react-native/no-inline-styles */
import { FC } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, View } from 'react-native';
import { COLORS } from '../../constants/colors';
import { fontFamilies } from '../../constants/fonts';
import { AppText } from '../ui/app-text';
import ArrowIcon from '../icons/arrow-icon';
import ChevronDownIcon from '../icons/profile/chevron-down-icon';
import CloseIcon from '../icons/close-icon';

export const DropdownButton: FC<{ onPress?: () => void; text?: string }> = ({
  onPress,
  text,
}) => {
  return (
    <Pressable style={styles.dropdownButton} onPress={onPress}>
      <AppText style={styles.dropdownText}>{text}</AppText>
      <ChevronDownIcon />
    </Pressable>
  );
};

export const renderDropdownModal = (
  visible: boolean,
  onClose: () => void,
  title: string,
  data: string[],
  onSelect: (item) => void,
  selectedValue: string,
  key: string
) => (
  <Modal visible={visible} animationType="slide" transparent>
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <View style={styles.modalHeader}>
          <AppText style={styles.modalTitle}>{title}</AppText>
          <Pressable onPress={onClose}>
            <CloseIcon size={24} />
          </Pressable>
        </View>
        <FlatList
          data={data}
          keyExtractor={(item) => item[key]}
          renderItem={({ item }) => (
            <Pressable
              style={[
                styles.modalItem,
                // item === selectedValue && styles.selectedItem,
              ]}
              onPress={() => onSelect(item)}>
              <AppText
                style={[
                  styles.modalItemText,
                  // item === selectedValue && styles.selectedItemText,
                ]}>
                {item.name ?? item.label}
              </AppText>
            </Pressable>
          )}
        />
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#121010',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS['dark-gray'],
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: fontFamilies.ARCHIVO.light,
    color: COLORS.neutral,
  },
  closeButtonText: {
    fontSize: 20,
    color: '#666',
    lineHeight: 20,
  },
  modalItem: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS['dark-gray']
  },
  selectedItem: {
    backgroundColor: '#f5f5f5',
  },
  modalItemText: {
    fontSize: 16,
    fontFamily: fontFamilies.ARCHIVO.light,
    color: COLORS.neutral,
  },
  selectedItemText: {
    color: '#c1976b',
    fontWeight: '500',
  },

  dropdownButton: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#6A6A6A',
    borderRadius: 12,
    paddingLeft: 20,
    paddingRight: 32,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF22',
  },
  dropdownText: {
    width: '100%',
    fontSize: 16,
    color: COLORS.neutral,
    fontFamily: fontFamilies.ARCHIVO.light,
  },
  dropdownIcon: {
    fontSize: 12,
    color: '#777',
  },
});
