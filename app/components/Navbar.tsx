'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
  direction: 'en|am' | 'am|en';
  setDirection: (direction: 'en|am' | 'am|en') => void;
  handleTranslate: () => void;
}

const Navbar = ({ direction, setDirection, handleTranslate }: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const swapDirection = () => {
    setDirection(direction === 'en|am' ? 'am|en' : 'en|am');
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-gradient-to-r from-gray-800 to-gray-900 text-white shadow-lg sticky top-0 z-10">
      <div className="flex justify-between items-center p-4 sm:p-5 max-w-7xl mx-auto">
        <div className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
          Explorer
        </div>
        <button
          className="sm:hidden text-white focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <div
          className={`${
            isMenuOpen ? 'flex' : 'hidden'
          } sm:flex flex-col sm:flex-row gap-2 items-center absolute sm:static top-16 left-0 right-0 bg-gray-900 sm:bg-transparent p-4 sm:p-0 sm:gap-3 w-full sm:w-auto`}
        >
          <select
            value={direction}
            onChange={(e) => {
              setDirection(e.target.value as 'en|am' | 'am|en');
              setIsMenuOpen(false);
            }}
            className="bg-gray-800 text-white border border-gray-600 rounded-lg p-2 text-sm sm:text-base w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-indigo-300"
          >
            <option value="en|am">English to Amharic</option>
            <option value="am|en">Amharic to English</option>
          </select>
          <button
            onClick={swapDirection}
            className="relative inline-flex items-center px-3 py-2 text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg shadow-md hover:from-indigo-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 w-full sm:w-auto"
            aria-label="Swap translation direction"
          >
            <span className="mr-2">↔</span> Swap
          </button>
          <button
            onClick={() => {
              handleTranslate();
              setIsMenuOpen(false);
            }}
            className="relative inline-flex items-center px-3 py-2 text-sm font-semibold text-white bg-gradient-to-r from-green-500 to-teal-500 rounded-lg shadow-md hover:from-green-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-green-300 transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 w-full sm:w-auto"
            aria-label="Translate text"
          >
            <span className="mr-2">➤</span> Translate
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;