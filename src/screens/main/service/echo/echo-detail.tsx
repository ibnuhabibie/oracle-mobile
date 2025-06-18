import React, { useState, useEffect, FC } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Text, Pressable } from 'react-native';
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

const USER_AVATAR = 'J';

type EchoDetailProps = NativeStackScreenProps<MainNavigatorParamList, 'EchoDetail'>;


/**
 * Format a date string (yyyy-mm-dd or ISO) or Date object to "EEE, d MMM yyyy" (e.g., "Sat, 2 May 2025")
 */
function formatDateToHeader(input: object): string {
  let _date = new Date(input.dateString);
  const weekday = _date.toLocaleString('en-US', { weekday: 'short' });
  const day = _date.getDate();
  const month = _date.toLocaleString('en-US', { month: 'short' });
  const year = _date.getFullYear();
  return `${weekday}, ${day} ${month} ${year}`;
}

function formatDate(input: object): string {
  let _date = new Date(input.dateString);
  const y = _date.getFullYear();
  const m = (_date.getMonth() + 1).toString().padStart(2, '0');
  const d = _date.getDate().toString().padStart(2, '0');
  return `${y}-${m}-${d}`;
}

const EchoDetail: FC<EchoDetailProps> = ({ navigation, route }) => {
  const id = route.params?.id;
  const date = route.params?.date;
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    console.log(id)
    if (!id) return
    api.get(`/v1/secret-diaries/${id}`)
      .then((res: any) => {
        console.log(res.data.conversations)
        setMessages(res.data.conversations)
      })
      .catch(() => setMessages([]))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    if (!id) {
      setMessages([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    fetchData()
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
      <View style={styles.chatArea}>
        <ScrollView
          contentContainerStyle={styles.chatContainer}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((item, idx) => {
            const isUser = item.type === 'user';
            return (
              <View key={item.conversation_id} style={[styles.messageRow]}>
                <View style={styles.avatarCircle}>
                  <AppText style={styles.avatarText}>{USER_AVATAR}</AppText>
                </View>
                <View style={[
                  styles.bubble,
                  isUser ? styles.bubbleUser : styles.bubbleAI
                ]}>
                  <AppText style={styles.bubbleText}>{item.content}</AppText>
                </View>
                {
                  idx === messages.length - 1
                  &&
                  (
                    <View style={styles.aiIconCircle}>
                      <AdviceIcon />
                    </View>
                  )
                }
              </View>
            );
          })}
        </ScrollView>
      </View>
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
});

export default EchoDetail;
