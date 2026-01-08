import { useState, useCallback, useEffect } from 'react';

export const useSpeech = () => {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [supported, setSupported] = useState(true);

    useEffect(() => {
        if (typeof window !== 'undefined' && !window.speechSynthesis) {
            setSupported(false);
        }
    }, []);

    const speak = useCallback((text: string) => {
        if (!supported) return;

        // Cancel any ongoing speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ja-JP'; // Japanese
        utterance.rate = 0.9; // Slightly slower for clarity
        utterance.pitch = 1;

        // Try to select a Japanese voice if available
        const voices = window.speechSynthesis.getVoices();
        const japaneseVoice = voices.find(voice => voice.lang.includes('ja'));
        if (japaneseVoice) {
            utterance.voice = japaneseVoice;
        }

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);

        window.speechSynthesis.speak(utterance);
    }, [supported]);

    return { speak, isSpeaking, supported };
};
