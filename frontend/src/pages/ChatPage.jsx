import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import useAuthUser from '../hooks/useAuthUser';
import { useQuery } from '@tanstack/react-query';
import { getStreamToken } from '../lib/api';
import { StreamChat } from "stream-chat";
import toast from 'react-hot-toast';

import {
  Channel,
  ChannelHeader,
  Chat,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";
import ChatLoader from "../components/ChatLoader";
import CallButton from "../components/CallButton";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

function ChatPage() {
  const { id: targetUserId } = useParams();

  const [chatClient, setChatClient] = useState(null);
  const [channel, setChatChannel] = useState(null);
  const [loading, setLoading] = useState(true)

  const { authUser } = useAuthUser();

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser
  })

  useEffect(() => {
    const initChat = async () => {
      if (!tokenData?.token) return;
      try {
        const client = StreamChat.getInstance(STREAM_API_KEY);
        console.log(authUser)

        await client.connectUser({
          id: authUser._id,
          name: authUser.fullName,
          image: authUser.profilePic,
        }, tokenData.token)

        console.log(client)

        const channelId = [authUser._id, targetUserId].sort().join("-");

        const currChannel = client.channel("messaging", channelId, {
          members: [authUser._id, targetUserId],
        })

        setChatClient(client);
        setChatChannel(currChannel);

      } catch (error) {
        console.error("Error initializing chat", error);
        toast.error("Could not connect to chat. Please try again.")
      } finally {
        setLoading(false);
      }
    }
    initChat();
  }, [tokenData, authUser, targetUserId])

  const handleVideoCall = () => {
    if (channel) {
      const callUrl = `${window.location.origin}/call/${channel.id}`
      channel.sendMessage({
        text: `I've started a video call. Join me here: ${callUrl}`,
      });
      toast.success("Video call link sent successfully!");
    }
  }
  if (loading || !chatClient || !channel) return <ChatLoader />;
  return (
    <div className='h-[93vh]'>
      <Chat client={chatClient}>
        <Channel channel={channel}>
          <div className='w-full'>
            <CallButton handleVideoCall={handleVideoCall} />
            <Window>
              <ChannelHeader />
              <MessageList />
              <MessageInput focus />
            </Window>
          </div>
        </Channel>
      </Chat>
    </div>
  )
}

export default ChatPage