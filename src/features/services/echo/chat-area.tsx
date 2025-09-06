import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, ScrollView, Pressable, StyleSheet } from 'react-native';
import { AppText } from '../../../components/ui/app-text';
import { COLORS } from '../../../constants/colors';
import AdviceIcon from '../../../components/icons/echo/advice-icon';
import { useAsyncStorage } from '../../../hooks/use-storage';
import GenieIcon from '../../../components/icons/echo/genie-icon';
import { scaleSize, scaleFont } from '../../../utils/scale';

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

interface UserProfile {
  full_name?: string;
  [key: string]: any;
}

const ChatArea: React.FC<ChatAreaProps> = ({ messages, lastMessage, setModalVisible }) => {
  const [initials, setInitials] = useState('');
  const { getUserProfile } = useAsyncStorage();

  const { t } = useTranslation();
  useEffect(() => {
    const fetchInitials = async () => {
      const profile = await getUserProfile() as UserProfile;
      let name = profile?.full_name ?? '';

      // Get first 2 non-space characters, uppercase
      const chars = name.replace(/\s+/g, '').slice(0, 2).toUpperCase();
      setInitials(chars || 'U');
    };
    fetchInitials();
  }, []);

  return (
    <View style={styles.chatArea}>
      <ScrollView
        contentContainerStyle={styles.chatContainer}
        showsVerticalScrollIndicator={false}
      >
        {
          messages.map(
            item => {
              const isUser = item.type === 'user';
              return (
                <View key={item.conversation_id} style={[styles.messageRow]}>
                  <View style={[
                    styles.avatarCircle,
                    { backgroundColor: isUser ? 'rgba(255,255,255,0.24)' : COLORS.primary }
                  ]}>
                    {
                      isUser ? (
                        <AppText variant='body1' style={styles.avatarText} color='neutral'>{initials}</AppText>
                      ) : (
                        <GenieIcon size={scaleSize(16)} />
                      )
                    }
                  </View>
                  <View style={[
                    styles.bubble,
                    isUser
                      ? styles.bubbleUser
                      : styles.bubbleAI
                  ]}>
                    {!isUser && <AppText style={{ fontWeight: 'bold', color: 'white' }}>{t("chatArea.geenieSays")}</AppText>}
                    <AppText
                      variant='body1'
                      style={
                        !isUser
                          ? [styles.bubbleText, { color: COLORS.white }]
                          : [styles.bubbleText]
                      }
                    >
                      {item.content}
                    </AppText>
                  </View>
                  {
                    isUser &&
                    messages[messages.length - 1]?.conversation_id === item.conversation_id &&
                    (
                      <Pressable style={styles.aiIconCircle} onPress={() => setModalVisible(true)}>
                        <AdviceIcon size={scaleSize(20)} />
                      </Pressable>
                    )
                  }
                </View>
              );
            }
          )
        }
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  chatArea: {
    flex: 1,
    position: 'relative',
    marginBottom: scaleSize(70),
    // backgroundColor: 'blue'
  },
  chatContainer: {
    paddingBottom: 0,
    // paddingTop: 20,
    // backgroundColor: 'red'
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: scaleSize(16),
    justifyContent: 'flex-start',
  },
  avatarCircle: {
    width: scaleSize(32),
    height: scaleSize(32),
    borderRadius: scaleSize(16),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: scaleSize(8),
    marginTop: scaleSize(8),
  },
  avatarText: {
    fontWeight: 'bold',
  },
  aiIconCircle: {
    width: scaleSize(32),
    height: scaleSize(32),
    borderRadius: scaleSize(16),
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: scaleSize(8),
    marginTop: 'auto'
  },
  bubble: {
    // maxWidth: '80%',
    // width: '100%',
    flex: 1,
    padding: scaleSize(14),
    borderRadius: scaleSize(16),
    backgroundColor: 'rgba(255,255,255,0.28)',
  },
  bubbleUser: {
    marginLeft: 0,
    marginRight: 'auto',
  },
  bubbleAI: {
    backgroundColor: COLORS.primary,
  },
  bubbleText: {
    color: COLORS.neutral,
    lineHeight: scaleSize(18)
  },
});

export default ChatArea;
