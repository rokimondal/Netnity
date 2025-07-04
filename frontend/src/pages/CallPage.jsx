import React, { useEffect, useState } from 'react'
import {
  StreamVideo,
  StreamVideoClient,
  StreamCall,
  CallControls,
  SpeakerLayout,
  StreamTheme,
  CallingState,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import { useNavigate, useParams } from 'react-router-dom';
import useAuthUser from '../hooks/useAuthUser';
import { useQuery } from '@tanstack/react-query';
import { getStreamToken } from '../lib/api';
import PageLoader from '../components/PageLoader';
import toast from 'react-hot-toast';

import "@stream-io/video-react-sdk/dist/css/styles.css";


const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;


function CallPage() {
  const { id: callId } = useParams();

  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);
  const [isConnecting, setConnecting] = useState(true);

  const { authUser, isLoading } = useAuthUser();

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser
  })

  useEffect(() => {
    const initCall = async () => {
      if (!tokenData) return
      try {
        const user = {
          id: authUser._id,
          name: authUser.fullName,
          image: authUser.profilePic
        }

        const videoClient = new StreamVideoClient({
          apiKey: STREAM_API_KEY,
          user,
          token: tokenData.token
        })

        const callInstance = videoClient.call("default", callId);

        await callInstance.join({ create: true });

        setClient(videoClient)
        setCall(callInstance)
      } catch (error) {
        console.error("Error joining call:", error);
        toast.error("Could not join the call. Please try again.");
      } finally {
        setConnecting(false)
      }
    }
    initCall();
  }, [callId, tokenData, authUser])

  if (isLoading || isConnecting) return <PageLoader />

  return (
    <div className='flex items-center justify-center'>
      <div className='relative'>
        {client && call ? (
          <StreamVideo client={client}>
            <StreamCall call={call}>
              <CallContent />
            </StreamCall>
          </StreamVideo>) : (
          <div className='flex items-center justify-center h-full'>
            <p>Could not initialize call. Please refresh or try again later.</p>
          </div>
        )}
      </div>
    </div>
  )
}

const CallContent = () => {
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();
  const navigate = useNavigate();

  if (callingState === CallingState.LEFT) return navigate("/");
  return (<StreamTheme>
    <SpeakerLayout />
    <CallControls />
  </StreamTheme>)
}

export default CallPage