"use client";

import React, { createContext, useState, useContext } from "react";
import Notification from "@/components/base/notifications/Notification";

export type NotificationType = "success" | "error" | "warning";

export type NotificationData = {
   id: number;
   type: NotificationType;
   title: string;
   message: string;
};

type NotificationsContextType = {
   notifications: NotificationData[];
   addNotification: (notification: Omit<NotificationData, "id">) => void;
   removeNotification: (id: number) => void;
};

const NotificationsContext = createContext<
   NotificationsContextType | undefined
>(undefined);

export const useNotifications = (): NotificationsContextType => {
   const context = useContext(NotificationsContext);
   if (!context) {
      throw new Error(
         "useNotifications deve ser usado dentro de NotificationsProvider"
      );
   }
   return context;
};

export const NotificationsProvider = ({
   children,
}: {
   children: React.ReactNode;
}) => {
   const [notifications, setNotifications] = useState<NotificationData[]>([]);

   const addNotification = (notification: Omit<NotificationData, "id">) => {
      const id = Date.now() + Math.random() * 1000; // Gera um ID único
      setNotifications((prev) => [...prev, { id, ...notification }]);
   };

   const removeNotification = (id: number) => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
   };

   return (
      <NotificationsContext.Provider
         value={{ notifications, addNotification, removeNotification }}
      >
         {children}
         <div className="fixed top-4 right-2 z-50 space-y-2 flex flex-col items-end">
            {notifications.map((n) => (
               <Notification
                  key={n.id}
                  type={n.type}
                  title={n.title}
                  message={n.message}
                  onClose={() => removeNotification(n.id)}
               />
            ))}
         </div>
      </NotificationsContext.Provider>
   );
};
