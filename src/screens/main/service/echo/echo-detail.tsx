import React, { useState, useEffect, useCallback, FC } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Keyboard
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from "react-i18next";

import { AppText } from '../../../../components/ui/app-text';
import SendIcon from '../../../../components/icons/echo/send-icon';
import ChatArea from './chat-area';
import Header from '../../../../components/ui/header';
import ScreenContainer from '../../../../components/layouts/screen-container';
import PurchaseAlertModal from '../../../../components/ui/purchase-alert-modal';
import AdviceIcon from '../../../../components/icons/echo/advice-icon';

import api from '../../../../utils/http';
import { formatDateWithDayname } from '../../../../utils/date';
import { scaleSize, scaleFont } from '../../../../utils/scale';

import { COLORS } from '../../../../constants/colors';
import { MainNavigatorParamList } from '../../../../navigators/types';
import { useServiceCost } from '../../../../hooks/use-service-cost';

import type {
  FloatingFooterProps,
  Message,
  SecretDiaryResponse,
} from './types';

type EchoDetailProps = NativeStackScreenProps<MainNavigatorParamList, 'EchoDetail'>;

/* ------------------ Floating Footer Component ------------------ */
const FloatingFooter: React.FC<FloatingFooterProps> = React.memo(({ onSend, t }) => {
  const [input, setInput] = useState('');

  return (
    <View style={styles.footerContainer}>
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
          Keyboard.dismiss();
          onSend(input);
          setInput('');
        }}>
          <SendIcon size={scaleSize(20)} />
        </TouchableOpacity>
      </View>
    </View>
  );
});
/* -------------------------------------------------------------- */

const EchoDetail: FC<EchoDetailProps> = ({ navigation, route }) => {
  const { t } = useTranslation();
  const id = route.params?.id;
  const date = route.params?.date;

  const [modalVisible, setModalVisible] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [lastMessage, setLastMessage] = useState<Message | null>(null);

  const {
    loading: costLoading,
    setLoading: setCostLoading
  } = useServiceCost('secret_diary');

  const fetchData = useCallback(async () => {
    if (!id) return;
    try {
      const res = await api.get(`/v1/secret-diaries/${id}`);
      const data = res.data as SecretDiaryResponse;
      const conversations = data.conversations || [];
      const last_userChat = conversations
        .filter((msg: Message) => msg.type === "user")
        .sort((a: Message, b: Message) => {
          const timeA = a.created_at ? new Date(a.created_at).getTime() : 0;
          const timeB = b.created_at ? new Date(b.created_at).getTime() : 0;
          return timeB - timeA;
        })[0];
      setLastMessage(last_userChat || null);
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
          diary_date: date?.dateString
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
              {formatDateWithDayname(date?.dateString || '')}
            </AppText>
          </View>
        </>
      }
      fluid={true}
      scrollable={false}
    >
      <KeyboardAvoidingView
        behavior={'padding'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? scaleSize(142) : scaleSize(168)}
        style={{ flex: 1 }}
      >
        <View style={{ flex: 1, paddingHorizontal: scaleSize(16) }}>
          <ChatArea
            messages={messages}
            lastMessage={lastMessage}
            setModalVisible={setModalVisible}
          />
        </View>
        <FloatingFooter onSend={handleSend} t={t} />
      </KeyboardAvoidingView>

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
  footerContainer: {
    backgroundColor: '#121010',
    padding: scaleSize(14),
    // Padding bottom for SafeArea is usually handled by ScreenContainer safe area view,
    // but since we are inside it, we might need some padding if it's very bottom.
    // However, KeybooardAvoidingView pushes it up.
  },
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
    height: '100%',
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
