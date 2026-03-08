import React from 'react';

const Input = ({ 
  label, 
  id, 
  type = 'text', 
  placeholder = '', 
  value, 
  onChange, 
  className = '', 
  leftAddon, 
  error 
}) => {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-dark">
          {label}
        </label>
      )}
      <div className="flex items-center w-full">
        {leftAddon && (
          <div className="bg-[#f3f4f6] border-r-0 border border-gray-200 rounded-l-xl py-3 px-4 flex items-center justify-center min-w-[60px] text-dark font-medium h-[52px]">
            {leftAddon}
          </div>
        )}
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`w-full py-4 px-4 bg-[#F3F4F6] border-none focus:outline-none focus:ring-1 focus:ring-primary transition-all duration-200 text-dark placeholder:text-gray-400 h-[56px] ${
            leftAddon ? 'rounded-r-[12px]' : 'rounded-[12px]'
          } ${error ? 'ring-1 ring-red-500' : ''}`}
        />
      </div>
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
};

export default Input;
