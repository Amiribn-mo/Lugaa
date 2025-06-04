'use client';

import { useState, useEffect, useCallback } from 'react';
import Display from './components/Display';
import Navbar from './components/Navbar';

interface TranslationResponse {
  responseStatus: number;
  responseData: {
    translatedText: string;
  };
}

export default function Home() {
  const [translatedText, setTranslatedText] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [direction, setDirection] = useState<'en|am' | 'am|en'>('en|am');

  // Debounce function
  const debounce = <F extends (...args: Parameters<F>) => void>(func: F, wait: number) => {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<F>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  // Translation function
  const translateText = useCallback(
    async (text: string, langpair: 'en|am' | 'am|en') => {
      if (!text.trim()) {
        setTranslatedText('');
        setError('');
        return;
      }

      if (!navigator.onLine) {
        setError('You are offline. Please connect to the internet to translate.');
        setTranslatedText('');
        return;
      }

      try {
        const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${langpair}`;
        const response = await fetch(url);
        const data: TranslationResponse = await response.json();

        if (data.responseStatus === 200 && data.responseData) {
          setTranslatedText(data.responseData.translatedText);
          setError('');
        } else {
          setError('Translation failed. Please try again.');
          setTranslatedText('');
        }
      } catch (err) {
        setError('Error: Unable to connect to translation service.');
        setTranslatedText('');
        console.error(err);
      }
    },
    []
  );

  // Debounced translation
  const debouncedTranslate = useCallback(
    debounce((text: string) => translateText(text, direction), 500),
    [direction, translateText] // eslint-disable-line react-hooks/exhaustive-deps
  );

  // Manual translation
  const handleTranslate = useCallback(() => {
    translateText(translatedText || 'Hi', direction);
  }, [translatedText, direction, translateText]);

  // Trigger real-time translation
  useEffect(() => {
    debouncedTranslate(translatedText || 'Hi');
  }, [translatedText, direction, debouncedTranslate]);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <Navbar direction={direction} setDirection={setDirection} handleTranslate={handleTranslate} />
      <div className="flex-1 flex justify-center items-start p-4 sm:p-6 md:p-8">
        <Display
          initialText="Nice to see you"
          initialTranslation={error || translatedText}
          direction={direction}
        />
      </div>
    </div>
  );
}