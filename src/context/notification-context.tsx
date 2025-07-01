import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import notifee, { EventType, Notification, Event } from "@notifee/react-native";
import { Platform, AppState } from "react-native";

type NotificationContextType = {
  displayNotification: (title: string, body: string, data?: Record<string, any>) => Promise<void>;
  lastNotification: Notification | null;
  onNotificationPress: (callback: (notification: Notification) => void) => void;
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lastNotification, setLastNotification] = useState<Notification | null>(null);
  const pressCallback = useRef<((notification: Notification) => void) | null>(null);

  // Request permissions and set up listeners
  useEffect(() => {
    (async () => {
      await notifee.requestPermission();
    })();

    // Foreground event listener
    const unsubscribe = notifee.onForegroundEvent(async ({ type, detail }: Event) => {
      console.log("Foreground event fired:", type, detail);
      if (type === EventType.PRESS && detail.notification) {
        setLastNotification(detail.notification);

        console.log(detail.notification, 'notification')

        if (pressCallback.current) {
          pressCallback.current(detail.notification);
        }
      }
    });

    // Background event listener
    notifee.onBackgroundEvent(async ({ type, detail }) => {
      console.log("Background event fired:", type, detail);
      // ReactNativeFirebaseMessagingHeadlessTask
      console.log(type, detail.notification);

      if (type === EventType.PRESS && detail.notification) {
        setLastNotification(detail.notification);

        console.log(detail.notification, 'notification')

        if (pressCallback.current) {
          pressCallback.current(detail.notification);
        }
      }
    });

    // Handle notification when app is opened from quit state
    (async () => {
      const initialNotification = await notifee.getInitialNotification();
      console.log(initialNotification?.notification, 'notification')

      if (initialNotification?.notification) {
        setLastNotification(initialNotification.notification);

        console.log(initialNotification.notification, 'notification')

        if (pressCallback.current) {
          pressCallback.current(initialNotification.notification);
        }
      }
    })();

    return () => {
      unsubscribe();
    };
  }, []);

  // Expose a function to display a local notification (for testing)
  const displayNotification = async (title: string, body: string, data?: Record<string, any>) => {
    await notifee.displayNotification({
      title,
      body,
      android: {
        channelId: "default",
        pressAction: { id: "default" },
      },
      data,
    });
  };

  // Expose a way to register a callback for notification presses
  const onNotificationPress = (callback: (notification: Notification) => void) => {
    pressCallback.current = callback;
  };

  return (
    <NotificationContext.Provider value={{ displayNotification, lastNotification, onNotificationPress }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotification must be used within a NotificationProvider");
  return ctx;
};
