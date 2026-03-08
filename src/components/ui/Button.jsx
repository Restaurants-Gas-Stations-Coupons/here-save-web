import React from 'react';

const Button = ({ children, onClick, type = 'button', className = '', variant = 'primary' }) => {
  const baseStyles = 'w-full py-4 px-4 rounded-[12px] font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center justify-center';
  
  const variants = {
    primary: 'bg-primary text-white hover:bg-opacity-95 active:scale-[0.98]',
    secondary: 'bg-[#F3F4F6] text-dark hover:bg-opacity-90',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
