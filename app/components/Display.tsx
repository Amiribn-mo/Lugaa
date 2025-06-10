'use client';

import { useState, useEffect, useCallback } from 'react';

interface TranslationResponse {
  responseStatus: number;
  responseData: {
    translatedText: string;
  };
}

interface DisplayProps {
  initialText?: string;
  initialTranslation?: string;
  direction: 'en|am' | 'am|en';
}

const Display = ({ initialText = '', initialTranslation = '', direction }: DisplayProps) => {
  const [inputText, setInputText] = useState<string>(initialText);
  const [translatedText, setTranslatedText] = useState<string>(initialTranslation);
  const [error, setError] = useState<string>('');

  // Debounce function for real-time translation
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

      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${langpair}`;

      try {
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

  // Debounced translation for real-time typing
  const debouncedTranslate = useCallback(
    debounce((text: string) => translateText(text, direction), 500),
    [direction, translateText] // eslint-disable-line react-hooks/exhaustive-deps
  );

  // Manual translation for button click
  const handleTranslate = useCallback(() => {
    translateText(inputText, direction);
  }, [inputText, direction, translateText]);

  // Trigger real-time translation on input or direction change
  useEffect(() => {
    debouncedTranslate(inputText);
  }, [inputText, direction, debouncedTranslate]);

  return (
    <div className="flex flex-col w-full max-w-3xl gap-4 mx-auto p-4 sm:p-6 md:p-8">
      <div className="relative w-full group">
        <span className="absolute -left-0.5 top-2 bottom-2 w-1 rounded bg-gradient-to-b from-indigo-500 to-purple-500 opacity-70 transition-all duration-300 group-focus-within:opacity-100"></span>
        <input
          type="text"
          id="input"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder=""
          className="peer w-full pl-6 pr-4 pt-6 pb-2 text-sm sm:text-base bg-white border border-gray-200 rounded-lg shadow-md focus:border-transparent focus:ring-2 focus:ring-indigo-300 focus:outline-none transition-all duration-300 delay-200 placeholder-transparent h-32 sm:h-80"
        />
        <label
          htmlFor="input"
          className="absolute left-6 top-3.5 text-sm sm:text-base text-gray-500 transition-all duration-200 ease-in-out peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-1 peer-focus:text-sm peer-focus:text-indigo-500 peer-focus:font-semibold cursor-text"
        >
          {direction === 'en|am' ? 'Write in English' : 'Write in Amharic'}
        </label>
      </div>
      <textarea
        value={error || translatedText}
        readOnly
        placeholder={direction === 'en|am' ? 'Translated Amharic text will appear here' : 'Translated English text will appear here'}
        className="peer w-full pl-6 pr-4 pt-6 pb-2 text-sm sm:text-base bg-white border border-gray-200 rounded-lg shadow-lg focus:border-transparent focus:ring-2 focus:ring-indigo-300 focus:outline-none transition-all duration-300 delay-200 placeholder-transparent h-32 sm:h-80"
      />
      <button
        onClick={handleTranslate}
        className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition"
      >
        {/* Translate Now */}
      </button>

      <p className='text-white font-semibold p-5 '>{inputText} : {translatedText}</p>
     
    </div>
  );
};

export default Display;