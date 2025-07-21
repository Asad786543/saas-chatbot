'use client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/client';
import { Chat } from '@/components/chatbot/chat';
import { convertToUIMessages } from '@/lib/utils';
import { DEFAULT_CHAT_MODEL } from '@/lib/ai/models';

export default function ChatPage() {
  const { id } = useParams();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMessages() {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('chat_id', id)
        .order('created_at', { ascending: true });
      setMessages(data || []);
      setLoading(false);
    }
    fetchMessages();
  }, [id]);

  if (loading) return <div>Loading chat...</div>;

  // Convert DB messages to UI messages for the Chat component
  const initialMessages = convertToUIMessages(messages);

  return (
    <Chat
      id={typeof id === 'string' ? id : id?.[0]}
      initialMessages={initialMessages}
      initialChatModel={DEFAULT_CHAT_MODEL}
      initialVisibilityType="private"
      isReadonly={false}
      session={undefined}
      autoResume={false}
    />
  );
}