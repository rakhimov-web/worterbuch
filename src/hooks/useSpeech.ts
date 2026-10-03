import { useCallback, useEffect, useRef, useState } from 'react';
import { isSpeechSupported, pickGermanVoice } from '../lib/speech';

export function useSpeech() {
  const supported = isSpeechSupported();
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [voicesLoaded, setVoicesLoaded] = useState(false);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const token = useRef(0);

  useEffect(() => {
    if (!supported) return;
    const synth = window.speechSynthesis;
    const tokenRef = token;
    const load = () => {
      const voices = synth.getVoices();
      if (voices.length > 0) {
        setVoice(pickGermanVoice(voices));
        setVoicesLoaded(true);
      }
    };
    load();
    synth.addEventListener('voiceschanged', load);
    return () => {
      synth.removeEventListener('voiceschanged', load);
      tokenRef.current++;
      synth.cancel();
    };
  }, [supported]);

  const stop = useCallback(() => {
    token.current++;
    if (supported) window.speechSynthesis.cancel();
    setSpeakingId(null);
  }, [supported]);

  const speak = useCallback(
    (id: string, text: string) => {
      if (!supported) return;
      const synth = window.speechSynthesis;
      const mine = ++token.current;
      synth.cancel(); // never overlap: the previous utterance is dropped
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'de-DE';
      u.rate = 0.9;
      u.pitch = 1;
      if (voice) u.voice = voice;
      const done = () => {
        if (token.current === mine) setSpeakingId(null);
      };
      u.onstart = () => {
        if (token.current === mine) setSpeakingId(id);
      };
      u.onend = done;
      u.onerror = done;
      setSpeakingId(id);
      synth.speak(u);
    },
    [supported, voice],
  );

  return { supported, speak, stop, speakingId, missingGermanVoice: supported && voicesLoaded && !voice };
}
