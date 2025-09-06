import React, { useState, useEffect, FC } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Alert
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from "react-i18next";

import { AppText } from '../../../../components/ui/app-text';
import { COLORS } from '../../../../constants/colors';
import { MainNavigatorParamList } from '../../../../navigators/types';
import SendIcon from '../../../../components/icons/echo/send-icon';
import api from '../../../../utils/http';
import { formatDate, formatDateToHeader } from '../../../../utils/date';
import { scaleSize, scaleFont } from '../../../../utils/scale';
import ChatArea from '../../../../features/services/echo/chat-area';
import Header from '../../../../components/ui/header';
import ScreenContainer from '../../../../components/layouts/screen-container';
import PurchaseAlertModal from '../../../../components/ui/purchase-alert-modal';
import { useServiceCost } from '../../../../hooks/use-service-cost';
import AdviceIcon from '../../../../components/icons/echo/advice-icon';

type EchoDetailProps = NativeStackScreenProps<MainNavigatorParamList, 'EchoDetail'>;

const EchoDetail: FC<EchoDetailProps> = ({ navigation, route }) => {
  const { t } = useTranslation();
  const id = route.params?.id;
  const date = route.params?.date;

  const [modalVisible, setModalVisible] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [lastMessage, setLastMessage] = useState<any>(null);

  const {
    loading: costLoading,
    setLoading: setCostLoading
  } = useServiceCost('ask_affinity');

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
      setCostLoading(false);
    } catch (error) {
      setCostLoading(false)
    }
  }

  useEffect(() => {
    if (!id) {
      return;
    }

    setCostLoading(true);
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
        console.log({ content: input }, id)
        await api.post(`/v1/secret-diaries/${id}/conversations`, { content: input });
        fetchData()
      }
      setInput('');
    } catch (err) {
      console.log(err)
    }
  };

  const handleContinue = async () => {
    setCostLoading(true);
    try {
      const res = await api.post(`/v1/secret-diaries/${id}/consult`, {});
      console.log(res);
      setModalVisible(false);
      setCostLoading(false);
      fetchData();
    } catch (error) {
      setCostLoading(false);
      console.log(error);
      Alert.alert(t('Error'), t('Failed to consult. Please try again.'));
    }
  };

  return (
    <ScreenContainer
      header={
        <>
          <Header
            title={t("DIARY")}
            onBack={() => navigation.goBack()}
          />
          <View style={styles.dateSeparator}>
            <AppText variant='caption1' color='neutral' style={styles.dateSeparatorText}>
              {formatDateToHeader(date)}
            </AppText>
          </View>
        </>
      }
      floatingFooter={
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={16}
        >
          <View style={styles.adviceRow}>
            <AppText color='neutral'>Click on</AppText>
            <View style={styles.adviceIconContainer}>
              <AdviceIcon size={scaleSize(12)} />
            </View>
            <AppText color='neutral'>to get Genie advice</AppText>
          </View>
          <View style={styles.inputBar}>
            <TextInput
              style={styles.input}
              placeholder={t("Tell us anything...")}
              value={input}
              onChangeText={setInput}
              placeholderTextColor="#BDBDBD"
            />
            <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
              <SendIcon size={scaleSize(20)} />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      }
    >
      <ChatArea
        messages={messages}
        lastMessage={lastMessage}
        setModalVisible={setModalVisible}
      />
      <PurchaseAlertModal
        loading={costLoading}
        visible={modalVisible}
        onContinue={handleContinue}
        onCancel={() => setModalVisible(false)}
        service='secret_diary'
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  dateSeparator: {
    alignItems: 'center',
    paddingVertical: scaleSize(12),
  },
  dateSeparatorText: {
    paddingHorizontal: scaleSize(16),
    paddingVertical: scaleSize(2),
    borderRadius: scaleSize(8),
  },

  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    height: 'auto',
    borderRadius: scaleSize(12),
    backgroundColor: 'rgba(255,255,255,0.13)',
    borderWidth: scaleSize(1),
    borderColor: COLORS.black,
    paddingHorizontal: scaleSize(16),
    fontSize: scaleFont(15),
    color: COLORS.neutral,
    marginRight: scaleSize(8),
  },
  sendButton: {
    width: scaleSize(40),
    height: scaleSize(40),
    borderRadius: scaleSize(20),
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
    padding: scaleSize(20),
    borderRadius: scaleSize(10),
    width: '80%',
  },
  title: {
    marginBottom: scaleSize(10),
    textAlign: 'center'
  },
  buttonGroup: {
    marginTop: scaleSize(20),
    gap: scaleSize(8),
    justifyContent: 'space-between',
  },
  adviceIconContainer: {
    width: scaleSize(20),
    height: scaleSize(20),
    borderRadius: scaleSize(10),
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  adviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scaleSize(2),
    marginBottom: scaleSize(4),
  },
});

export default EchoDetail;
