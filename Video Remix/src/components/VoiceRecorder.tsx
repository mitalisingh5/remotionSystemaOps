import React, { useMemo, useState } from 'react';

interface Props {
  onTranscript: (text: string, isFinal?: boolean) => void;
}

type SpeechRecognitionLike = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  maxAlternatives: number;
  onresult: ((event: any) => void) | null;
  onerror: ((event: any) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

const VoiceRecorder: React.FC<Props> = ({ onTranscript }) => {
  const [recording, setRecording] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognitionLike | null>(null);

  const SpeechRecognitionCtor = useMemo(() => {
    const speechWindow = window as Window & {
      webkitSpeechRecognition?: new () => SpeechRecognitionLike;
      SpeechRecognition?: new () => SpeechRecognitionLike;
    };

    return speechWindow.SpeechRecognition || speechWindow.webkitSpeechRecognition || null;
  }, []);

  const startRecording = async () => {
    try {
      if (!SpeechRecognitionCtor) {
        alert('Live speech recognition is not supported in this browser. Please type your command.');
        return;
      }

      const speechRecognition = new SpeechRecognitionCtor();
      speechRecognition.lang = 'en-US';
      speechRecognition.continuous = true;
      speechRecognition.interimResults = true;
      speechRecognition.maxAlternatives = 1;

      speechRecognition.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let index = event.resultIndex; index < event.results.length; index += 1) {
          const transcript = event.results[index][0].transcript;
          if (event.results[index].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        onTranscript((finalTranscript + interimTranscript).trim(), false);
      };

      speechRecognition.onerror = (event) => {
        console.error('Speech recognition error:', event);
        alert('Could not hear your microphone. Check browser permissions and try again.');
        setRecording(false);
        setRecognition(null);
      };

      speechRecognition.onend = () => {
        setRecording(false);
        setRecognition(null);
      };

      speechRecognition.start();
      setRecognition(speechRecognition);
      setRecording(true);
    } catch (error) {
      console.error('Microphone access denied', error);
      alert('Could not access microphone');
    }
  };

  const stopRecording = () => {
    if (recognition) {
      recognition.stop();
      setRecording(false);
    }
  };

  return (
    <button
      className={`voice-recorder ${recording ? 'recording' : ''}`}
      onClick={recording ? stopRecording : startRecording}
    >
      {recording ? '⏹️ Stop Listening' : '🎤 Speak Command'}
    </button>
  );
};

export default VoiceRecorder;
