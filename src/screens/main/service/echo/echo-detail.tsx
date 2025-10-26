import React, { useState, useEffect, useCallback, FC } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
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

/* ------------------ Floating Footer Component ------------------ */
const FloatingFooter: React.FC<{
  onSend: (message: string) => void;
  t: any;
}> = React.memo(({ onSend, t }) => {
  const [input, setInput] = useState('');

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 16 : 0}
    >
      <View style={styles.adviceRow}>
        <AppText color='neutral'>{t('echoDetail.clickOn')}</AppText>
        <View style={styles.adviceIconContainer}>
          <AdviceIcon size={scaleSize(12)} />
        </View>
        <AppText color='neutral'>{t('echoDetail.toGetGenieAdvice')}</AppText>
      </View>

      <View style={styles.inputBar}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder={t("echoDetail.inputPlaceholder")}
          placeholderTextColor="#BDBDBD"
        />
        <TouchableOpacity style={styles.sendButton} onPress={() => {
          if (!input.trim()) return;
          onSend(input);
          setInput('');
        }}>
          <SendIcon size={scaleSize(20)} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
});
/* -------------------------------------------------------------- */

const EchoDetail: FC<EchoDetailProps> = ({ navigation, route }) => {
  const { t } = useTranslation();
  const id = route.params?.id;
  const date = route.params?.date;

  const [modalVisible, setModalVisible] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [lastMessage, setLastMessage] = useState<any>(null);

  const {
    loading: costLoading,
    setLoading: setCostLoading
  } = useServiceCost('ask_affinity');

  const fetchData = useCallback(async () => {
    if (!id) return;
    try {
      const res = await api.get(`/v1/secret-diaries/${id}`);
      const conversations = res.data.conversations;
      const last_userChat = conversations
        .filter((msg: any) => msg.type === "user")
        .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
      setLastMessage(last_userChat);
      setMessages(conversations);
      setCostLoading(false);
    } catch (error) {
      setCostLoading(false);
    }
  }, [id, setCostLoading]);

  useEffect(() => {
    if (!id) return;
    setCostLoading(true);
    fetchData();
  }, [id, fetchData]);

  const handleSend = useCallback(async (message: string) => {
    if (!message.trim()) return;
    try {
      if (!id) {
        const res = await api.post('/v1/secret-diaries', {
          content: message,
          diary_date: date.dateString
        });
        const newId = res?.data?.diary_id;
        if (newId) {
          navigation.setParams({ id: newId });
        }
        fetchData();
      } else {
        await api.post(`/v1/secret-diaries/${id}/conversations`, { content: message });
        fetchData();
      }
    } catch (err) {
      console.log(err);
    }
  }, [id, date, navigation, fetchData]);

  const handleContinue = async () => {
    setCostLoading(true);
    try {
      await api.post(`/v1/secret-diaries/${id}/consult`, {});
      setModalVisible(false);
      setCostLoading(false);
      fetchData();
    } catch (error) {
      setCostLoading(false);
      Alert.alert(t('echoDetail.errorTitle'), t('echoDetail.failedToConsult'));
    }
  };

  return (
    <ScreenContainer
      header={
        <>
          <Header
            title={t("echoDetail.title")}
            onBack={() => navigation.goBack()}
          />
          <View style={styles.dateSeparator}>
            <AppText variant='caption1' color='neutral' style={styles.dateSeparatorText}>
              {formatDateToHeader(date)}
            </AppText>
          </View>
        </>
      }
      floatingFooter={<FloatingFooter onSend={handleSend} t={t} />}
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
