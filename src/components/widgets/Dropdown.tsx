/* eslint-disable react-native/no-inline-styles */
import { FC } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, View } from 'react-native';
import { COLORS } from '../../constants/colors';
import { fontFamilies } from '../../constants/fonts';
import { AppText } from '../ui/app-text';

export const DropdownButton: FC<{ onPress?: () => void; text?: string }> = ({
  onPress,
  text,
}) => {
  return (
    <Pressable style={styles.dropdownButton} onPress={onPress}>
      <AppText style={styles.dropdownText}>{text}</AppText>
      <AppText style={styles.dropdownIcon}>▼</AppText>
    </Pressable>
  );
};

export const renderDropdownModal = (
  visible: boolean,
  onClose: () => void,
  title: string,
  data: string[],
  onSelect: (item: string) => void,
  selectedValue: string,
) => (
  <Modal visible={visible} animationType="slide" transparent>
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <View style={styles.modalHeader}>
          <AppText style={styles.modalTitle}>{title}</AppText>
          <Pressable onPress={onClose} style={styles.closeButton}>
            <AppText style={styles.closeButtonText}>×</AppText>
          </Pressable>
        </View>
        <FlatList
          data={data}
          keyExtractor={item => item}
          renderItem={({ item }) => (
            <Pressable
              style={[
                styles.modalItem,
                item === selectedValue && styles.selectedItem,
              ]}
              onPress={() => onSelect(item)}>
              <AppText
                style={[
                  styles.modalItemText,
                  item === selectedValue && styles.selectedItemText,
                ]}>
                {item}
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
    backgroundColor: 'white',
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
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: fontFamilies.ARCHIVO.light,
    color: '#333',
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
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
    borderBottomColor: '#f0f0f0',
  },
  selectedItem: {
    backgroundColor: '#f5f5f5',
  },
  modalItemText: {
    fontSize: 16,
    fontFamily: fontFamilies.ARCHIVO.light,
    color: '#333',
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: COLORS.white,
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
