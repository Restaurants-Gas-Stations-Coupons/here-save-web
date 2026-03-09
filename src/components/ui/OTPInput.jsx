import React, { useRef, useEffect } from 'react';

/**
 * OTPInput component for entering multi-digit verification codes.
 * @param {Object} props
 * @param {number} props.length - Number of input slots (default: 5 to match Image 1)
 * @param {string[]} props.value - Array of strings representing each digit
 * @param {Function} props.onChange - Callback with the updated OTP array
 * @param {string} props.className - Additional class names for the container
 */
const OTPInput = ({ length = 6, value, onChange, onEnter, className = '' }) => {
    const inputRefs = useRef([]);

    useEffect(() => {
        // Fill refs array with nulls if length changes
        if (inputRefs.current.length !== length) {
            inputRefs.current = Array(length).fill(null);
        }
    }, [length]);

    const handleChange = (index, e) => {
        const val = e.target.value;
        if (isNaN(val)) return;

        const newOtp = [...value];
        // Only take the last character if more than one is entered
        newOtp[index] = val.substring(val.length - 1);
        onChange(newOtp);

        // Auto-focus next input
        if (val && index < length - 1 && inputRefs.current[index + 1]) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (onEnter) onEnter();
            return;
        }

        // Move to previous input on Backspace if current is empty
        if (e.key === 'Backspace' && !value[index] && index > 0 && inputRefs.current[index - 1]) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text/plain').trim();
        const pastedNumbers = pastedData.replace(/\D/g, '').slice(0, length).split('');

        if (pastedNumbers.length > 0) {
            const newOtp = [...value];
            pastedNumbers.forEach((num, i) => {
                if (i < length) newOtp[i] = num;
            });
            onChange(newOtp);

            // Focus the next empty slot or the last one
            const nextIndex = Math.min(pastedNumbers.length, length - 1);
            if (inputRefs.current[nextIndex]) {
                inputRefs.current[nextIndex].focus();
            }
        }
    };

    return (
        <div className={`flex justify-center gap-2 ${className}`}>
            {value.map((digit, idx) => (
                <input
                    key={idx}
                    ref={(el) => (inputRefs.current[idx] = el)}
                    type="text"
                    inputMode="numeric"
                    value={digit}
                    onChange={(e) => handleChange(idx, e)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    onPaste={handlePaste}
                    className="w-[46px] h-[46px] sm:w-[50px] sm:h-[50px] text-center text-[22px] font-bold text-[#2E2E2E] bg-white border border-[#D9D9D9] rounded-[14px] focus:outline-none focus:border-[#DC0004] transition-all shadow-none font-onest"
                    maxLength={1}
                    autoComplete="one-time-code"
                />
            ))}
        </div>
    );
};

export default OTPInput;
