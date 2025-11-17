/* eslint-disable react-native/no-inline-styles */
import { FC } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, View } from 'react-native';
import { COLORS } from '../../constants/colors';
import { fontFamilies } from '../../constants/fonts';
import { AppText } from '../ui/app-text';
import ArrowIcon from '../icons/arrow-icon';
import ChevronDownIcon from '../icons/profile/chevron-down-icon';
import CloseIcon from '../icons/close-icon';
import { scaleFont, scaleSize } from '../../utils/scale';

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
  key: string,
  labelKey: string = 'name', //defaults to 'name'
) => (
  <Modal visible={visible} animationType="slide" transparent>
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <View style={styles.modalHeader}>
          <AppText style={styles.modalTitle}>{title}</AppText>
          <Pressable onPress={onClose}>
            <CloseIcon size={scaleSize(24)} />
          </Pressable>
        </View>
        <FlatList
          data={data}
          keyExtractor={(item) => item[key]}
          renderItem={({ item }) => {

            const label = item[labelKey] || item['name'];

            return (
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
                  {label}
                </AppText>
              </Pressable>
            )
          }}
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
    borderTopLeftRadius: scaleSize(20),
    borderTopRightRadius: scaleSize(20),
    paddingTop: scaleSize(20),
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: scaleSize(20),
    paddingBottom: scaleSize(15),
    borderBottomWidth: scaleSize(1),
    borderBottomColor: COLORS['dark-gray'],
  },
  modalTitle: {
    fontSize: scaleFont(18),
    fontFamily: fontFamilies.ARCHIVO.light,
    color: COLORS.neutral,
  },
  closeButtonText: {
    fontSize: scaleFont(20),
    color: '#666',
    lineHeight: scaleSize(20),
  },
  modalItem: {
    paddingHorizontal: scaleSize(20),
    paddingVertical: scaleSize(15),
    borderBottomWidth: scaleSize(1),
    borderBottomColor: COLORS['dark-gray']
  },
  selectedItem: {
    backgroundColor: '#f5f5f5',
  },
  modalItemText: {
    fontSize: scaleFont(16),
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
    borderWidth: scaleSize(1),
    borderColor: '#6A6A6A',
    borderRadius: scaleSize(12),
    paddingLeft: scaleSize(20),
    paddingRight: scaleSize(32),
    paddingVertical: scaleSize(10, 8, 14),
    backgroundColor: '#FFFFFF22',
  },
  dropdownText: {
    width: '100%',
    fontSize: scaleFont(16),
    color: COLORS.neutral,
    fontFamily: fontFamilies.ARCHIVO.light,
  },
  dropdownIcon: {
    fontSize: scaleFont(12),
    color: '#777',
  },
});
