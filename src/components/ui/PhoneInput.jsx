import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const PhoneInput = ({
  label,
  id,
  value,
  onChange,
  placeholder = '',
  error,
  className = ''
}) => {
  const [countryCode, setCountryCode] = useState('+91');

  const handleInputChange = (e) => {
    // Only allow digits and limit to 10 characters
    const numericValue = e.target.value.replace(/\D/g, '').slice(0, 10);
    // Create a synthetic event structure to pass back
    const event = {
      ...e,
      target: {
        ...e.target,
        name: e.target.name,
        value: numericValue,
      },
    };
    onChange(event);
  };

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-dark">
          {label}
        </label>
      )}
      <div className="flex gap-2">
        <div className="relative min-w-[80px]">
          <div className="bg-[#F3F4F6] rounded-[12px] py-3 px-4 flex items-center justify-between text-dark font-medium h-[56px] cursor-pointer">
            <span>{countryCode}</span>
            <ChevronDown size={16} className="text-gray-400" />
          </div>
        </div>
        <input
          id={id}
          type="tel"
          placeholder={placeholder}
          value={value}
          onChange={handleInputChange}
          maxLength={10}
          className={`w-full py-4 px-4 bg-[#F3F4F6] rounded-[12px] focus:outline-none focus:ring-1 focus:ring-primary transition-all duration-200 text-dark placeholder:text-gray-400 h-[56px] ${error ? 'ring-1 ring-red-500' : ''
            }`}
        />
      </div>
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
};

export default PhoneInput;
