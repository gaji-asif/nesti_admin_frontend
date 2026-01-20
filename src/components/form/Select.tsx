import { useState, useRef, useEffect } from "react";

interface Option {
  label: string;
  value: string;
}

interface SelectProps {
  options: Option[];
  value?: string;           // The currently selected value
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export default function Select({
  options,
  value,
  onChange,
  placeholder = "Select...",
  className = "",
  disabled = false,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Find the selected object so we can display its label
  const selectedOption = options.find((opt) => opt.value === value);

  // Toggle dropdown
  const toggleOpen = () => {
    if (!disabled) setIsOpen(!isOpen);
  };

  // Handle clicking an option
  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  // Close when clicking outside the component
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className={`relative w-full ${className}`}
      ref={containerRef}
    >
      {/* The visible button/input area */}
      <div
        onClick={toggleOpen}
        className={`
          w-full bg-white dark:bg-dark-900
          border border-gray-300 dark:border-gray-700
          rounded-md shadow-sm px-3 py-2 text-left cursor-pointer
          focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500
          flex justify-between items-center
          ${disabled ? "bg-gray-100 cursor-not-allowed opacity-60" : ""}
        `}
      >
        <span className={`block truncate ${!selectedOption ? "text-gray-400" : "text-gray-900 dark:text-gray-100"}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <span className="ml-2 flex items-center pointer-events-none">
          {/* Simple Chevron Icon */}
          <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </div>

      {/* The Dropdown Menu */}
      {isOpen && (
        <ul className="absolute z-50 mt-1 w-full bg-white dark:bg-dark-800 shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
          {options.map((option) => (
            <li
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className={`
                cursor-pointer select-none relative py-2 pl-3 pr-9
                hover:bg-gray-100 dark:hover:bg-dark-700
                ${value === option.value ? "text-brand-600 font-semibold" : "text-gray-900 dark:text-gray-200"}
              `}
            >
              <span className="block truncate">{option.label}</span>

              {/* Checkmark icon for selected item */}
              {value === option.value && (
                <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-brand-600">
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
