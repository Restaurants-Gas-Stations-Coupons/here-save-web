import React from 'react';

const AuthLayout = ({ children, backgroundImage }) => {
  return (
    <div className="flex flex-col md:flex-row min-h-screen w-full font-onest bg-white p-3 md:p-4 relative">
      {/* Left side image */}
      <div className="w-full md:w-1/2 h-[300px] md:h-[calc(100vh-32px)] relative rounded-[30px] overflow-hidden flex items-center justify-center">
        <img
          src={backgroundImage}
          alt="Authentication Background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Text centered over the image */}
        <h2 className="relative z-10 text-white text-[48px] md:text-[44px] font-semibold leading-[0.95] tracking-[-0.04em] text-left">
          Here&<br />Save
        </h2>
      </div>

      {/* Right side form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12 lg:p-20">
        <div className="w-full max-w-[420px] relative h-full flex flex-col justify-center">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
