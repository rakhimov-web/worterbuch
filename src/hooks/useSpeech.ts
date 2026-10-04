import { useCallback, useEffect, useRef, useState } from 'react';
import { isSpeechSupported, pickGermanVoice, playGermanAudio, stopCurrentAudio } from '../lib/speech';

export function useSpeech() {
  const supported = isSpeechSupported();
  const [localVoice, setLocalVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const token = useRef(0);
  const cancelCurrent = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const synth = window.speechSynthesis;
    const load = () => {
      try {
        const voices = synth.getVoices();
        if (voices && voices.length > 0) {
          setLocalVoice(pickGermanVoice(voices));
        }
      } catch {
        // ignore
      }
    };
    load();
    synth.addEventListener('voiceschanged', load);
    return () => {
      synth.removeEventListener('voiceschanged', load);
      stopCurrentAudio();
    };
  }, []);

  const stop = useCallback(() => {
    token.current++;
    if (cancelCurrent.current) {
      cancelCurrent.current();
      cancelCurrent.current = null;
    }
    stopCurrentAudio();
    setSpeakingId(null);
  }, []);

  const speak = useCallback(
    (id: string, text: string, rate = 0.9) => {
      const mine = ++token.current;
      if (cancelCurrent.current) {
        cancelCurrent.current();
      }
      setSpeakingId(id);

      cancelCurrent.current = playGermanAudio(
        text,
        () => {
          if (token.current === mine) setSpeakingId(id);
        },
        () => {
          if (token.current === mine) setSpeakingId(null);
        },
        rate,
        localVoice,
      );
    },
    [localVoice],
  );

  return {
    supported,
    speak,
    stop,
    speakingId,
    missingGermanVoice: false,
  };
}
