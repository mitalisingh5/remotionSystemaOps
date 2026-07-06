import React, { useState, useRef, useEffect } from 'react';
import VoiceRecorder from './VoiceRecorder';
import TranscriptEditor from './TranscriptEditor';

interface Message {
  id: string;
  role: 'user' | 'bot';
  text: string;
}

interface Props {
  onProcessCommand: (command: string) => Promise<void>;
  loading: boolean;
}

const ChatInterface: React.FC<Props> = ({ onProcessCommand, loading }) => {
  const [messages, setMessages] = useState<Message[]>([
    { id: 'welcome', role: 'bot', text: '🤖 Ready! Upload a video and give me a command.' },
  ]);
  const [transcript, setTranscript] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleTranscript = (text: string) => {
    setTranscript(text);
    setMessages((currentMessages) => {
      const withoutDraft = currentMessages.filter((message) => message.id !== 'live-draft');
      if (!text.trim()) {
        return withoutDraft;
      }

      return [...withoutDraft, { id: 'live-draft', role: 'user', text: `🎤 Draft command: "${text}"` }];
    });
  };

  const send = async () => {
    if (!transcript.trim()) return;

    const command = transcript;
    setTranscript('');
    setMessages((currentMessages) => {
      const withoutDraft = currentMessages.filter((message) => message.id !== 'live-draft');
      return [
        ...withoutDraft,
        { id: `final-${Date.now()}`, role: 'user', text: `✏️ Final command: "${command}"` },
        { id: `processing-${Date.now()}`, role: 'bot', text: '🤖 Got it! Processing your video...' },
      ];
    });

    try {
      await onProcessCommand(command);
      setMessages((m) => [...m, { id: `done-${Date.now()}`, role: 'bot', text: '🤖 ✅ Done! Your edited video is ready to download.' }]);
    } catch (e) {
      setMessages((m) => [...m, { id: `error-${Date.now()}`, role: 'bot', text: '🤖 Error processing video.' }]);
    }
  };

  return (
    <div className="chat-interface">
      <div className="messages">
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.role === 'user' ? 'user' : 'bot'}`}>
            {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-controls">
        <VoiceRecorder onTranscript={handleTranscript} />
        <TranscriptEditor value={transcript} onChange={setTranscript} onSend={send} disabled={loading} />
      </div>
    </div>
  );
};

export default ChatInterface;
