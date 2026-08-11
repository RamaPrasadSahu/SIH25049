import React from 'react';
import { AppLayout } from '../components/layout/AppLayout';
import { ChatWindow } from '../components/chat/ChatWindow';
import { useChatContext } from '../context/ChatContext';

export const Chat = () => {
  const { messages, loading, sendMessage, startNewChat } = useChatContext();

  return (
    <AppLayout onNewChat={startNewChat}>
      <ChatWindow
        messages={messages}
        loading={loading}
        onSendMessage={sendMessage}
      />
    </AppLayout>
  );
};

export default Chat;
