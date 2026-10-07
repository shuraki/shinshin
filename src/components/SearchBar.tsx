'use client';

import { useState, useCallback } from 'react';
import { Program, Organization, SearchResult } from '@/lib/types';
import { createSearchIndex } from '@/lib/search/index';

interface SearchBarProps {
  programs: Program[];
  organizations: Organization[];
  onResults: (results: SearchResult[]) => void;
}

export function SearchBar({ programs, organizations, onResults }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const searchIndex = useCallback(() => {
    return createSearchIndex(programs, organizations);
  }, [programs, organizations]);

  const handleSearch = useCallback(
    (searchQuery: string) => {
      if (!searchQuery.trim()) {
        onResults([]);
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      const index = searchIndex();
      const results = index.search(searchQuery, 50);
      const autocompleteSuggestions = index.autocomplete(searchQuery, 8);

      onResults(results);
      setSuggestions(autocompleteSuggestions);
      setShowSuggestions(true);
      setIsSearching(false);
    },
    [searchIndex, onResults]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setIsSearching(true);

    const timer = setTimeout(() => {
      handleSearch(value);
    }, 100);

    return () => clearTimeout(timer);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    handleSearch(suggestion);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch(query);
      setShowSuggestions(false);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto mb-12" style={{ animation: 'fadeIn 0.6s ease-out' }}>
      <div className="relative">
        <div className="relative">
          <div className={`absolute -inset-1 rounded-2xl transition-all duration-300 ${
            isFocused
              ? 'bg-gradient-to-r from-blue-500 to-purple-500 opacity-30'
              : 'bg-gradient-to-r from-blue-500 to-purple-500 opacity-0'
          }`} />

          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              setIsFocused(true);
              query && setShowSuggestions(true);
            }}
            onBlur={() => setIsFocused(false)}
            placeholder="חפשו תוכנית, תחום, ארגון..."
            className="relative w-full px-6 py-4 text-lg border-2 border-slate-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all placeholder:text-slate-400 bg-white shadow-md hover:shadow-lg"
            dir="rtl"
            lang="he"
          />

          {isSearching && (
            <div className="absolute left-6 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
            </div>
          )}

          {query && !isSearching && (
            <button
              onClick={() => {
                setQuery('');
                onResults([]);
                setSuggestions([]);
              }}
              className="absolute left-6 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              ✕
            </button>
          )}
        </div>

        {/* Suggestions dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-3 bg-white border border-slate-200 rounded-xl shadow-xl z-10" style={{ animation: 'slideInFromRight 0.3s ease-out' }}>
            <ul className="py-2">
              {suggestions.map((suggestion, idx) => (
                <li key={idx}>
                  <button
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full text-right px-6 py-3 hover:bg-blue-50 active:bg-blue-100 transition-all text-slate-700 font-medium hover:text-blue-700"
                    dir="rtl"
                  >
                    <span className="text-blue-500 ml-2">🔍</span>
                    {suggestion}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Quick category filters */}
      <div className="mt-8 flex flex-wrap gap-3 justify-center">
        {[
          { emoji: '✡️', label: 'דתיים', query: 'דתי' },
          { emoji: '📚', label: 'חינוך', query: 'חינוך' },
          { emoji: '🌾', label: 'חקלאות', query: 'חקלאות' },
          { emoji: '🌲', label: 'טבע', query: 'טבע' },
          { emoji: '👥', label: 'קהילה', query: 'קהילה' },
        ].map((filter) => (
          <button
            key={filter.query}
            onClick={() => {
              setQuery(filter.query);
              handleSearch(filter.query);
              setShowSuggestions(false);
            }}
            className="px-4 py-3 bg-gradient-to-br from-slate-100 to-slate-50 hover:from-blue-100 hover:to-slate-100 text-slate-700 hover:text-blue-700 rounded-full text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow-md hover:scale-105 active:scale-95"
          >
            <span className="mr-2">{filter.emoji}</span>
            {filter.label}
          </button>
        ))}
      </div>

      {/* Search hint */}
      {!query && (
        <div className="mt-6 text-center text-sm text-slate-500">
          💡 חפשו: קדימה, קרמבו, חלוץ, קומונה, או שם ארגון
        </div>
      )}
    </div>
  );
}
