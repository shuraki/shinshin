'use client';

import { useState, useCallback, useEffect } from 'react';
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

    // Debounce search
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
    <div className="w-full max-w-2xl mx-auto mb-8">
      <div className="relative">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => query && setShowSuggestions(true)}
            placeholder="חפשו שנת שירות, תחום, ארגון או מקום..."
            className="w-full px-6 py-4 text-lg border-2 border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-slate-400"
            dir="rtl"
            lang="he"
          />

          {isSearching && (
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
            </div>
          )}
        </div>

        {/* Suggestions dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-lg shadow-lg z-10">
            <ul className="py-2">
              {suggestions.map((suggestion, idx) => (
                <li key={idx}>
                  <button
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full text-right px-6 py-2 hover:bg-slate-100 transition-colors text-slate-700 font-medium"
                    dir="rtl"
                  >
                    🔍 {suggestion}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Quick filters under search */}
      <div className="mt-6 flex flex-wrap gap-2 justify-center">
        {[
          { label: 'דתיים', query: 'דתי' },
          { label: 'חינוך', query: 'חינוך' },
          { label: 'חקלאות', query: 'חקלאות' },
          { label: 'טבע', query: 'טבע' },
          { label: 'קהילה', query: 'קהילה' },
        ].map((filter) => (
          <button
            key={filter.query}
            onClick={() => {
              setQuery(filter.query);
              handleSearch(filter.query);
              setShowSuggestions(false);
            }}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full text-sm font-medium transition-colors"
          >
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  );
}
