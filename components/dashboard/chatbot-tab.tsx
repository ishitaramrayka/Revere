'use client'

import { useCallback, useEffect, useState } from 'react'
import { Mic, MicOff, Loader2, BotMessageSquare, AlertCircle } from 'lucide-react'
import { useConversation, ConversationProvider } from '@elevenlabs/react'
import { cn } from '@/lib/utils'
import type { DashboardSnapshot } from '@/lib/dashboard-types'

type ChatbotTabProps = {
  data: DashboardSnapshot
}

function ChatbotInner({ data }: ChatbotTabProps) {
  const [hasPermission, setHasPermission] = useState(false)
  const agentId = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID

  const conversation = useConversation({
    onConnect: () => console.log('Connected to ElevenLabs Agent'),
    onDisconnect: () => console.log('Disconnected from ElevenLabs Agent'),
    onError: (error) => {
      console.error('ElevenLabs Error:', error)
      alert(`ElevenLabs Connection Error: ${typeof error === 'string' ? error : (error as Error).message || 'Check console'}. Make sure you clicked Publish and defined the Variable!`)
    },
  })

  // Start the conversation session
  const toggleConversation = useCallback(async () => {
    if (conversation.status === 'connected') {
      await conversation.endSession()
    } else {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true })
        setHasPermission(true)

        // Convert dashboard data to a readable string context for the AI
        const contextStr = JSON.stringify({
          scheduleToday: data.schedule,
          facesKnown: data.faces.map(f => f.name),
          recentActivity: data.activity.slice(0, 5)
        })

        // Start session using their exact agent id and send the live dashboard data
        await conversation.startSession({
          agentId: agentId || 'agent_5501kmtw6tawef9arhcfs74xt2s3',
          dynamicVariables: {
            dashboard_context: contextStr
          }
        })
      } catch (err) {
        console.error('Failed to start conversation:', err)
        alert(`Failed to start conversation: \n${err}`)
      }
    }
  }, [conversation, data, agentId])

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] md:h-[calc(100vh-5rem)] max-w-2xl mx-auto items-center justify-center p-6 space-y-8 animate-fade-in">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-serif tracking-tight text-foreground flex items-center justify-center gap-2">
          <BotMessageSquare className="w-6 h-6 text-primary" />
          Caregiver Assistant
        </h2>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          An interactive AI companion that knows the patient's schedule and familiar faces.
          Tap the microphone to start talking.
        </p>
      </div>

      {!agentId && (
        <div className="flex items-start gap-3 p-4 bg-destructive/10 text-destructive rounded-lg w-full">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold">Missing Agent ID</p>
            <p className="opacity-90">Please add NEXT_PUBLIC_ELEVENLABS_AGENT_ID to your .env.local file to connect to ElevenLabs.</p>
          </div>
        </div>
      )}

      <div className="relative flex items-center justify-center w-48 h-48">
        {/* Pulsing rings when connected */}
        {conversation.status === 'connected' && (
          <>
            <div className={cn("absolute inset-0 rounded-full bg-primary/20", conversation.isSpeaking ? "animate-ping" : "animate-pulse")} />
            <div className={cn("absolute inset-4 rounded-full bg-primary/30", conversation.isSpeaking ? "animate-ping" : "animate-pulse delay-75")} />
          </>
        )}

        <button
          onClick={toggleConversation}
          disabled={!agentId && conversation.status !== 'connected'}
          className={cn(
            "relative z-10 flex items-center justify-center w-24 h-24 rounded-full text-white shadow-xl transition-all duration-300",
            conversation.status === 'connected'
              ? "bg-destructive hover:bg-destructive/90 scale-110"
              : "bg-primary hover:bg-primary/90 hover:scale-105",
            (!agentId && conversation.status !== 'connected') && "opacity-50 cursor-not-allowed"
          )}
        >
          {conversation.status === 'connecting' ? (
            <Loader2 className="w-10 h-10 animate-spin" />
          ) : conversation.status === 'connected' ? (
            <MicOff className="w-10 h-10" />
          ) : (
            <Mic className="w-10 h-10" />
          )}
        </button>
      </div>

      <div className="text-center space-y-1">
        <p className="text-sm font-medium">
          {conversation.status === 'connected'
            ? (conversation.isSpeaking ? 'Agent is speaking...' : 'Listening...')
            : conversation.status === 'connecting'
              ? 'Connecting to AI...'
              : 'Disconnected'}
        </p>
        {conversation.status === 'connected' && (
          <p className="text-xs text-muted-foreground animate-fade-in delay-150">
            It knows about {data.schedule.length} schedule items and {data.faces.length} faces.
          </p>
        )}
      </div>
    </div>
  )
}

export function ChatbotTab({ data }: ChatbotTabProps) {
  return (
    <ConversationProvider>
      <ChatbotInner data={data} />
    </ConversationProvider>
  )
}
