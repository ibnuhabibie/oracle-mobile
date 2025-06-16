import React, { useState, useEffect, FC } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Text, Pressable } from 'react-native';
import { AppText } from '../../../../components/ui/app-text';
import { COLORS } from '../../../../constants/colors';
import ScreenContainer from '../../../../components/layouts/ScreenContainer';
import ArrowIcon from '../../../../components/icons/Arrow';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainNavigatorParamList } from '../../../../navigators/types';
import { fontFamilies } from '../../../../constants/fonts';

const USER_AVATAR = 'J';

type EchoDetailProps = NativeStackScreenProps<MainNavigatorParamList, 'EchoDetail'>;


const EchoDetail: FC<EchoDetailProps> = ({ navigation, route }) => {
  const { id } = route.params;
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const api = require('../../../../utils/http').default;
    api.get(`/v1/secret-diaries/${id}`)
      .then((res: any) => {
        // Assume res.data.messages or res.data.content as array of messages
        if (res?.data?.messages && Array.isArray(res.data.messages)) {
          setMessages(res.data.messages);
        } else if (res?.data?.content) {
          // fallback: treat content as a single user message
          setMessages([
            {
              id: res.data.diary_id?.toString() || '1',
              sender: 'user',
              text: res.data.content,
              date: res.data.diary_date,
            }
          ]);
        } else {
          setMessages([]);
        }
      })
      .catch(() => setMessages([]))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSend = () => {
    if (input.trim()) {
      setMessages([
        ...messages,
        {
          id: (messages.length + 1).toString(),
          sender: 'user',
          text: input,
          date: '2025-05-02',
        },
      ]);
      setInput('');
      // Here you would also send the message to the backend and handle AI response
    }
  };

  const renderMessage = ({ item }: any) => {
    const isUser = item.sender === 'user';
    return (
      <View style={[
        styles.messageRow,
        // isUser ? styles.messageRowUser : styles.messageRowAI
      ]}>
        {/* {isUser && ( */}
        <View style={styles.avatarCircle}>
          <AppText style={styles.avatarText}>{USER_AVATAR}</AppText>
        </View>
        {/* )} */}
        <View style={[
          styles.bubble,
          isUser ? styles.bubbleUser : styles.bubbleAI
        ]}>
          <AppText style={styles.bubbleText}>{item.text}</AppText>
        </View>
        {!isUser && (
          <View style={styles.aiIconCircle}>
            {/* <Ionicons name="star" size={20} color={COLORS.primary} /> */}
          </View>
        )}
      </View>
    );
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
          <AppText style={styles.dateSeparatorText}>Sat, 2 May 2025</AppText>
        </View>
      </View>
      {/* Chat area with padding for header and input */}
      <View style={styles.chatArea}>
        <ScrollView
          contentContainerStyle={styles.chatContainer}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((item) => {
            const isUser = item.sender === 'user';
            return (
              <View key={item.id} style={[styles.messageRow]}>
                <View style={styles.avatarCircle}>
                  <AppText style={styles.avatarText}>{USER_AVATAR}</AppText>
                </View>
                <View style={[
                  styles.bubble,
                  isUser ? styles.bubbleUser : styles.bubbleAI
                ]}>
                  <AppText style={styles.bubbleText}>{item.text}</AppText>
                </View>
                {!isUser && (
                  <View style={styles.aiIconCircle}>
                    {/* <Ionicons name="star" size={20} color={COLORS.primary} /> */}
                  </View>
                )}
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
            {/* <Ionicons name="arrow-forward" size={24} color={COLORS.primary} /> */}
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
    backgroundColor: '#fff',
    // shadow for iOS
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    // elevation for Android
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    backgroundColor: '#fff',
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
    marginVertical: 12,
    backgroundColor: '#fff',
  },
  dateSeparatorText: {
    color: '#BDBDBD',
    fontSize: 13,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 2,
    borderRadius: 8,
  },
  chatArea: {
    flex: 1,
    position: 'relative',
    paddingTop: 130, // header + date separator height
    paddingBottom: 80, // input bar height
    backgroundColor: '#fff',
  },
  chatContainer: {
    paddingHorizontal: 16,
    paddingBottom: 0,
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
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  bubble: {
    maxWidth: '75%',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.primary,
    backgroundColor: '#fff',
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
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 16,
    fontSize: 15,
    color: '#222',
    marginRight: 8,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FAF6F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default EchoDetail;
