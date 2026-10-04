export function isSpeechSupported(): boolean {
  return typeof window !== 'undefined' && (typeof Audio !== 'undefined' || 'speechSynthesis' in window);
}

const lang = (v: SpeechSynthesisVoice) => v.lang.replace('_', '-').toLowerCase();

/** Prefer de-DE, then any German voice; prefer on-device voices (work offline, start faster). */
export function pickGermanVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  const score = (v: SpeechSynthesisVoice) => (lang(v) === 'de-de' ? 4 : 0) + (v.localService ? 1 : 0);
  const german = voices.filter((v) => lang(v) === 'de' || lang(v).startsWith('de-'));
  return german.sort((a, b) => score(b) - score(a))[0] ?? null;
}

/** Text to read aloud: fall back to the printed German with bracket notes and plural marks removed. */
export function speechText(de: string, speak?: string): string {
  if (speak) return speak;
  return de.replace(/\(.*?\)/g, '').replace(/,\s*¨?-\w*/g, '').replace(/\s*\/\s*/g, ', ').replace(/\s+/g, ' ').trim();
}

/** Build Google Translate TTS audio URL for native German pronunciation */
export function getGermanAudioUrl(text: string): string {
  const clean = text.trim();
  return `https://translate.google.com/translate_tts?ie=UTF-8&tl=de&client=tw-ob&q=${encodeURIComponent(clean)}`;
}

// In-memory audio elements cache for instant 0ms playback
const audioCache = new Map<string, HTMLAudioElement>();
let activeAudio: HTMLAudioElement | null = null;

/** Preloads an audio file in the background so playback on click is instantaneous */
export function preloadGermanAudio(text: string): void {
  if (typeof window === 'undefined' || typeof Audio === 'undefined') return;
  const clean = text.trim();
  if (!clean) return;
  const url = getGermanAudioUrl(clean);
  if (!audioCache.has(url)) {
    try {
      const audio = new Audio(url);
      audio.preload = 'auto';
      audioCache.set(url, audio);
    } catch {
      // ignore
    }
  }
}

/** Preload multiple words (e.g. for visible cards or current list) */
export function preloadGermanAudios(texts: string[]): void {
  for (const t of texts) {
    preloadGermanAudio(t);
  }
}

/** Stop currently playing audio and speech synthesis immediately */
export function stopCurrentAudio(): void {
  if (activeAudio) {
    try {
      activeAudio.pause();
      activeAudio.currentTime = 0;
    } catch {
      // ignore
    }
    activeAudio = null;
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {
      // ignore
    }
  }
}

/**
 * Plays German audio.
 * Uses high-fidelity online studio German TTS (MP3) so it works on ANY device with internet,
 * regardless of whether the device has a German voice package installed.
 * Seamlessly falls back to window.speechSynthesis if offline.
 */
export function playGermanAudio(
  text: string,
  onStart?: () => void,
  onEnd?: () => void,
  rate = 0.9,
  localVoice?: SpeechSynthesisVoice | null,
): () => void {
  stopCurrentAudio();
  const clean = text.trim();
  if (!clean) {
    onEnd?.();
    return () => {};
  }

  let isCanceled = false;

  const fallbackSpeech = () => {
    if (isCanceled) return;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window && typeof SpeechSynthesisUtterance !== 'undefined') {
      try {
        const u = new SpeechSynthesisUtterance(clean);
        u.lang = 'de-DE';
        u.rate = rate;
        if (localVoice) u.voice = localVoice;
        u.onstart = () => {
          if (!isCanceled) onStart?.();
        };
        u.onend = () => {
          if (!isCanceled) onEnd?.();
        };
        u.onerror = () => {
          if (!isCanceled) onEnd?.();
        };
        window.speechSynthesis.speak(u);
      } catch {
        onEnd?.();
      }
    } else {
      onEnd?.();
    }
  };

  if (typeof window !== 'undefined' && typeof Audio !== 'undefined') {
    try {
      const url = getGermanAudioUrl(clean);
      let audio = audioCache.get(url);
      if (!audio) {
        audio = new Audio(url);
        audio.preload = 'auto';
        audioCache.set(url, audio);
      }
      activeAudio = audio;
      audio.currentTime = 0;

      audio.onplay = () => {
        if (!isCanceled) onStart?.();
      };
      audio.onended = () => {
        if (activeAudio === audio) activeAudio = null;
        if (!isCanceled) onEnd?.();
      };
      audio.onerror = () => {
        if (activeAudio === audio) activeAudio = null;
        fallbackSpeech();
      };

      const playPromise = audio.play?.();
      if (playPromise !== undefined && typeof playPromise?.catch === 'function') {
        playPromise.catch((err: unknown) => {
          if (isCanceled) return;
          // AbortError happens when another sound interrupts or pause() is called
          const errorName = err && typeof err === 'object' && 'name' in err ? (err as { name: string }).name : '';
          if (errorName === 'AbortError') {
            return;
          }
          fallbackSpeech();
        });
      }
    } catch {
      fallbackSpeech();
    }
  } else {
    fallbackSpeech();
  }

  return () => {
    isCanceled = true;
    stopCurrentAudio();
    onEnd?.();
  };
}
