import React, { useState, useRef, useEffect } from 'react';
import { googleMapsService, AddressInfo } from '../utils/googleMaps';
import { useTranslation } from '../hooks/useTranslation';

interface AddressSearchProps {
  onAddressSelect?: (addressInfo: AddressInfo) => void;
  placeholder?: string;
  className?: string;
}

const AddressSearch: React.FC<AddressSearchProps> = ({
  onAddressSelect,
  placeholder,
  className = ''
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<AddressInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();
  const { t } = useTranslation();

  const searchAddresses = async (searchQuery: string) => {
    if (!searchQuery.trim() || searchQuery.length < 3) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      const results = await googleMapsService.geocodeAddress(searchQuery);
      setSuggestions(results.slice(0, 5)); // 限制显示5个结果
    } catch (error) {
      console.error('Address search failed:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setShowSuggestions(true);

    // 清除之前的搜索定时器
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // 设置新的搜索定时器，延迟500ms搜索
    searchTimeoutRef.current = setTimeout(() => {
      searchAddresses(value);
    }, 500);
  };

  const handleSuggestionClick = (addressInfo: AddressInfo) => {
    setQuery(addressInfo.address);
    setShowSuggestions(false);
    setSuggestions([]);
    onAddressSelect?.(addressInfo);
  };

  const handleInputFocus = () => {
    if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleInputBlur = () => {
    // 延迟隐藏建议列表，允许点击建议项
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
  };

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          placeholder={placeholder || t('search.placeholder') || 'Search for an address...'}
          className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          {isLoading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          ) : (
            <svg
              className="h-4 w-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          )}
        </div>
      </div>

      {/* 搜索建议列表 */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <button
              key={`${suggestion.placeId}-${index}`}
              className="w-full px-4 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none first:rounded-t-lg last:rounded-b-lg"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <div className="flex items-start space-x-2">
                <svg
                  className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 truncate">
                    {suggestion.address}
                  </p>
                  <p className="text-xs text-gray-500">
                    {suggestion.location.lat.toFixed(6)}, {suggestion.location.lng.toFixed(6)}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* 无搜索结果 */}
      {showSuggestions && !isLoading && query.length >= 3 && suggestions.length === 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
          <div className="px-4 py-3 text-sm text-gray-500 text-center">
            {t('search.noResults') || 'No addresses found'}
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressSearch;