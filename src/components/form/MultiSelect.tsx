import type React from "react";
import { useState, useEffect, useRef } from "react";

interface Option {
  value: string;
  text: string;
}

interface MultiSelectProps {
  label: string;
  options: Option[];
  defaultSelected?: string[];
  value?: string[];
  onChange?: (selected: string[]) => void;
  disabled?: boolean;
  placeholder?: string;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  label,
  options,
  defaultSelected = [],
  value,
  onChange,
  disabled = false,
  placeholder = "Select options",
}) => {
  const isControlled = value !== undefined;
  const [internalSelected, setInternalSelected] =
    useState<string[]>(defaultSelected);
  const selectedOptions = isControlled ? value : internalSelected;

  const updateSelection = (newSelected: string[]) => {
    if (!isControlled) setInternalSelected(newSelected);
    onChange?.(newSelected);
  };

  const handleSelect = (optionValue: string) => {
    const newSelected = selectedOptions.includes(optionValue)
      ? selectedOptions.filter((v) => v !== optionValue)
      : [...selectedOptions, optionValue];
    updateSelection(newSelected);
  };

  const removeOption = (optionValue: string) => {
    updateSelection(selectedOptions.filter((v) => v !== optionValue));
  };

  return (
    <div className="w-full">
      {label && (
        <label
          className="mb-3 block text-sm font-medium text-gray-700 dark:text-gray-400"
          id={`${label}-label`}
        >
          {label}
        </label>
      )}

      <div className="space-y-4">
        {/* Selected Items */}
        {selectedOptions.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Selected:</span>
            {selectedOptions.map((value) => {
              const text = options.find((opt) => opt.value === value)?.text || value;
              return (
                <span
                  key={value}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-blue-500 rounded-full hover:bg-blue-600 transition-colors"
                >
                  {text}
                  <button
                    type="button"
                    onClick={() => removeOption(value)}
                    disabled={disabled}
                    className="ml-1 hover:bg-orange-600 rounded-full p-0.5 transition-colors"
                    aria-label={`Remove ${text}`}
                  >
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </span>
              );
            })}
          </div>
        )}

        {/* Available Options */}
        <div className="flex flex-wrap gap-2">
          {options.map((option) => {
            const isSelected = selectedOptions.includes(option.value);
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option.value)}
                disabled={disabled}
                className={`px-3 py-1.5 text-sm font-medium rounded-full border transition-colors ${
                  isSelected
                    ? "bg-blue-500 text-white border-blue-500 hover:bg-blue-600"
                    : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
                } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
              >
                {option.text}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MultiSelect;
