'use client';

import { useState, useEffect, useRef } from 'react';
import { getSuggestions } from './datafetch';

/**
 * A debounced input component with autocomplete suggestions
 * 
 * @param {Object} props
 * @param {string} props.id - Input field ID
 * @param {string} props.label - Input field label
 * @param {string} props.value - Current input value
 * @param {Function} props.onChange - Function to handle value changes
 * @param {string} props.field - Database field name for fetching suggestions
 * @param {string} props.placeholder - Input placeholder text
 * @param {boolean} props.required - Whether the field is required
 * @param {Function} props.onBlur - Optional callback for blur events
 * @param {Function} props.onSuggestionSelect - Optional callback when a suggestion is selected
 * @param {string} props.className - Additional CSS classes for the input
 */
const AutocompleteInput = ({
  id,
  label,
  value,
  onChange,
  field,
  placeholder = '',
  required = false,
  onBlur = null,
  onSuggestionSelect = null,
  className = '',
}) => {
  const [inputValue, setInputValue] = useState(value || '');
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const debounceTimerRef = useRef(null);
  const suggestionRef = useRef(null);

  // Update local state when prop value changes
  useEffect(() => {
    setInputValue(value || '');
  }, [value]);

  // Handle clicks outside to close suggestion dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fetchSuggestions = async (input) => {
    if (!input || input.length < 2) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      const fetchedSuggestions = await getSuggestions(field, input);
      setSuggestions(fetchedSuggestions);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(newValue);

    // Clear previous timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set up debounced fetch
    debounceTimerRef.current = setTimeout(() => {
      fetchSuggestions(newValue);
    }, 300); // 300ms debounce

    if (newValue.length > 1) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion);
    onChange(suggestion);
    setIsOpen(false);
    if (onSuggestionSelect) {
      onSuggestionSelect(suggestion);
    }
  };

  const handleBlur = (e) => {
    // Small delay to allow clicking on suggestions
    setTimeout(() => {
      setIsOpen(false);
    }, 200);
    
    if (onBlur) {
      onBlur(e);
    }
  };

  return (
    <div className="relative mb-4">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative" ref={suggestionRef}>
        <input
          id={id}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleBlur}
          onFocus={() => inputValue.length > 1 && fetchSuggestions(inputValue)}
          placeholder={placeholder}
          required={required}
          className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${className}`}
        />
        {isLoading && (
          <div className="absolute right-3 top-2.5">
            <div className="animate-spin h-4 w-4 border-2 border-gray-500 border-t-transparent rounded-full"></div>
          </div>
        )}
        {isOpen && suggestions.length > 0 && (
          <ul className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base overflow-auto focus:outline-none sm:text-sm">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="cursor-pointer hover:bg-gray-100 px-4 py-2"
              >
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AutocompleteInput;