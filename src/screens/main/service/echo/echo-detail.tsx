import React, { useState, useEffect, FC } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Text, Pressable, Modal, Alert } from 'react-native';
import { AppText } from '../../../../components/ui/app-text';
import { COLORS } from '../../../../constants/colors';
import ScreenContainer from '../../../../components/layouts/ScreenContainer';
import ArrowIcon from '../../../../components/icons/Arrow';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainNavigatorParamList } from '../../../../navigators/types';
import { fontFamilies } from '../../../../constants/fonts';
import SendIcon from '../../../../components/icons/echo/send-icon';
import AdviceIcon from '../../../../components/icons/echo/advice-icon';
import api from '../../../../utils/http';
import { AppButton } from '../../../../components/ui/app-button';
import { formatDate, formatDateToHeader } from '../../../../utils/date';
import ChatArea from '../../../../components/widgets/ChatArea';

const USER_AVATAR = 'J';

type EchoDetailProps = NativeStackScreenProps<MainNavigatorParamList, 'EchoDetail'>;

const EchoDetail: FC<EchoDetailProps> = ({ navigation, route }) => {
  const id = route.params?.id;
  const date = route.params?.date;

  const [modalVisible, setModalVisible] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [lastMessage, setLastMessage] = useState<any>(null);
  const [purchaseLoading, setPurchaseLoading] = useState(false);

  const fetchData = async () => {
    console.log(id)
    if (!id) return

    try {
      const res = await api.get(`/v1/secret-diaries/${id}`)
      let conversations: { type: string; created_at: string; conversation_id: string; content: string }[] = res.data.conversations;
      let last_userChat = conversations
        .filter((msg) => msg.type === "user")
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
      setLastMessage(last_userChat);
      setMessages(conversations);
      setLoading(false);
    } catch (error) {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!id) {
      return;
    }

    setLoading(true);
    const init = async () => {
      await fetchData()
    }

    init()
  }, [id]);

  const handleSend = async () => {
    if (!input.trim()) return;
    try {
      if (!id) {
        const res = await api.post('/v1/secret-diaries', {
          content: input,
          diary_date: formatDate(date)
        });
        console.log(res.data.diary_id)
        const newId = res?.data?.diary_id;
        if (newId) {
          navigation.setParams({ id: newId });
        }
        fetchData()
      } else {
        // Send message to conversation
        console.log({ content: input }, id)
        await api.post(`/v1/secret-diaries/${id}/conversations`, { content: input });
        fetchData()
      }
      setInput('');
    } catch (err) {
      // Optionally handle error
      console.log(err)
    }
  };

  const handleContinue = async () => {
    setPurchaseLoading(true);
    try {
      const res = await api.post(`/v1/secret-diaries/${id}/consult`, {});
      console.log(res);
      setModalVisible(false);
      setPurchaseLoading(false);
      fetchData();
    } catch (error) {
      setPurchaseLoading(false);
      console.log(error);
      Alert.alert('Error', 'Failed to consult. Please try again.');
    }
  };

  return (
    <>
      {/* Fixed Header */}
      <View style={styles.fixedHeader}>
        <View style={styles.header}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={styles.backButton}>
            <ArrowIcon />
          </Pressable>
          <Text style={styles.headerTitle}>Diary</Text>
        </View>
        <View style={styles.dateSeparator}>
          <AppText style={styles.dateSeparatorText}>
            {formatDateToHeader(date)}
          </AppText>
        </View>
      </View>
      {/* Chat area with padding for header and input */}
      <ChatArea
        messages={messages}
        lastMessage={lastMessage}
        setModalVisible={setModalVisible}
      />
      {/* Fixed Input */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={16}
        style={styles.fixedInput}
      >
        <View style={styles.inputBar}>
          <TextInput
            style={styles.input}
            placeholder="Tell us anything..."
            value={input}
            onChangeText={setInput}
            placeholderTextColor="#BDBDBD"
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
            <SendIcon />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
      {/* Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <AppText variant='subtitle1' color='primary' style={styles.title}>PURCHASE ALERT</AppText>
            <AppText style={{ textAlign: 'center', lineHeight: 22 }}>To ask the Geenie, it will cost 15{'\n'}Continue?</AppText>
            <AppText style={{ textAlign: 'center', marginTop: 14 }} color='neutral'>Your Coins: 1650</AppText>
            <View style={styles.buttonGroup}>
              <AppButton title="Continue to Purchase" variant='secondary' onPress={handleContinue} loading={purchaseLoading} />
              <AppButton title="Cancel" variant='outline' onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  fixedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 12,
    paddingLeft: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    backgroundColor: COLORS.white,
    paddingTop: 8,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginLeft: 20,
    textAlign: 'center',
    fontFamily: fontFamilies.ARCHIVO.light,
  },
  dateSeparator: {
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  dateSeparatorText: {
    color: '#BDBDBD',
    fontSize: 13,
    paddingHorizontal: 16,
    paddingVertical: 2,
    borderRadius: 8,
  },
  chatArea: {
    flex: 1,
    position: 'relative',
    marginTop: 105,
    marginBottom: 70,
  },
  chatContainer: {
    paddingHorizontal: 16,
    paddingBottom: 0,
    paddingTop: 20,
  },
  messageRow: {
    flexDirection: 'row',
    // alignItems: 'flex-end',
    marginBottom: 16,
    justifyContent: 'flex-start',
  },
  messageRowUser: {
    justifyContent: 'flex-start',
  },
  messageRowAI: {
    justifyContent: 'flex-end',
  },
  avatarCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.white,
    borderColor: COLORS.primary,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  avatarText: {
    color: '#BDBDBD',
    fontWeight: 'bold',
    fontSize: 16,
  },
  aiIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    marginTop: 'auto'
  },
  bubble: {
    maxWidth: '80%',
    width: '100%',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.white,
  },
  bubbleUser: {
    marginLeft: 0,
    marginRight: 'auto',
  },
  bubbleAI: {
    backgroundColor: COLORS.primary,
  },
  bubbleText: {
    fontSize: 15,
    color: '#222',
  },
  fixedInput: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
    backgroundColor: '#fff',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    padding: 12,
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    height: 'auto',
    borderRadius: 20,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.black,
    paddingHorizontal: 16,
    fontSize: 15,
    color: '#222',
    marginRight: 8,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // modal
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center'
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  title: {
    marginBottom: 10,
    textAlign: 'center'
  },
  buttonGroup: {
    marginTop: 20,
    gap: 8,
    justifyContent: 'space-between',
  },
});

export default EchoDetail;
