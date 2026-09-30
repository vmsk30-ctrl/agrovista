'use client';

import { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export function useVoiceAssistant() {
  const { language } = useLanguage();
  const [isSupported, setIsSupported] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hasSynthesis = 'speechSynthesis' in window;
      const hasRecognition = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
      setIsSupported(hasSynthesis || hasRecognition);
    }
  }, []);

  // Text-To-Speech: Reads text aloud in Telugu or English
  const speakText = useCallback(
    (text: string) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        setError('Voice output is not supported on this browser.');
        return;
      }

      window.speechSynthesis.cancel(); // Stop any pending utterances
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'te' ? 'te-IN' : 'en-IN';
      utterance.rate = 0.95; // Slightly slower for better comprehension in rural areas
      utterance.pitch = 1.0;

      utterance.onstart = () => {
        setIsSpeaking(true);
        setError(null);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
      };

      utterance.onerror = (e) => {
        setIsSpeaking(false);
        if (e.error !== 'canceled') {
          setError(`Speech error: ${e.error}`);
        }
      };

      window.speechSynthesis.speak(utterance);
    },
    [language]
  );

  const stopSpeaking = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  // Speech-To-Text: Listens for voice input
  const startListening = useCallback(
    (onResult?: (text: string) => void) => {
      if (typeof window === 'undefined') return;

      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (!SpeechRecognition) {
        setError('Voice speech recognition is not supported on this browser.');
        return;
      }

      try {
        const recognition = new SpeechRecognition();
        recognition.lang = language === 'te' ? 'te-IN' : 'en-IN';
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => {
          setIsListening(true);
          setError(null);
          setTranscript('');
        };

        recognition.onresult = (event: any) => {
          const text = event.results[0][0].transcript;
          setTranscript(text);
          if (onResult) {
            onResult(text);
          }
        };

        recognition.onerror = (event: any) => {
          setIsListening(false);
          setError(`Voice input error: ${event.error}`);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognition.start();
      } catch (err) {
        setIsListening(false);
        setError('Could not access microphone.');
      }
    },
    [language]
  );

  return {
    isSupported,
    isSpeaking,
    isListening,
    transcript,
    error,
    speakText,
    stopSpeaking,
    startListening,
  };
}
