import React from 'react';
import { View, ScrollView, Pressable, StyleSheet } from 'react-native';
import { AppText } from '../ui/app-text';
import { COLORS } from '../../constants/colors';
import AdviceIcon from '../icons/echo/advice-icon';

const USER_AVATAR = 'J';

interface Message {
  conversation_id: string;
  type: string;
  content: string;
}

interface ChatAreaProps {
  messages: Message[];
  lastMessage: Message | null;
  setModalVisible: (visible: boolean) => void;
}

const ChatArea: React.FC<ChatAreaProps> = ({ messages, lastMessage, setModalVisible }) => {
  return (
    <View style={styles.chatArea}>
      <ScrollView
        contentContainerStyle={styles.chatContainer}
        showsVerticalScrollIndicator={false}
      >
        {messages.map(item => {
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
                lastMessage &&
                item.conversation_id === lastMessage.conversation_id &&
                (
                  <Pressable style={styles.aiIconCircle} onPress={() => setModalVisible(true)}>
                    <AdviceIcon />
                  </Pressable>
                )
              }
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
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
    marginBottom: 16,
    justifyContent: 'flex-start',
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
});

export default ChatArea;
