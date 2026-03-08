import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Button from './Button';

const OTPModal = ({ isOpen, onClose, onVerify, onResend, phoneNumber, countryCode, verifyError }) => {
    const { t } = useTranslation();
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const inputRefs = useRef([]);

    useEffect(() => {
        if (isOpen) {
            setOtp(['', '', '', '', '', '']);
            setTimeout(() => {
                if (inputRefs.current[0]) {
                    inputRefs.current[0].focus();
                }
            }, 100);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleChange = (index, e) => {
        const value = e.target.value;
        if (isNaN(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value.substring(value.length - 1);
        setOtp(newOtp);

        if (value && index < 5 && inputRefs.current[index + 1]) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0 && inputRefs.current[index - 1]) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text/plain').trim();
        const pastedNumbers = pastedData.replace(/\D/g, '').slice(0, 6).split('');

        if (pastedNumbers.length > 0) {
            const newOtp = [...otp];
            pastedNumbers.forEach((num, i) => {
                if (i < 6) newOtp[i] = num;
            });
            setOtp(newOtp);

            const nextIndex = Math.min(pastedNumbers.length, 5);
            if (inputRefs.current[nextIndex]) {
                inputRefs.current[nextIndex].focus();
            }
        }
    };

    const handleVerify = () => {
        const fullOtp = otp.join('');
        if (fullOtp.length === 6) {
            onVerify(fullOtp);
        }
    };

    // Format phone number like +1 XXX XXX X789
    const formattedPhone = `${countryCode} ${phoneNumber.substring(0, 3)} ${phoneNumber.substring(3, 6)} X${phoneNumber.substring(7)}`;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Blurred background backdrop */}
            <div
                className="absolute inset-0 bg-white/30 backdrop-blur-md transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-8 w-full max-w-[400px] z-10 flex flex-col items-center animate-in fade-in zoom-in duration-200">
                <h3 className="text-[24px] font-semibold text-dark mb-2 text-center">
                    {t('login.otp_title', 'Enter verification code')}
                </h3>
                <p className="text-grayCustom text-sm text-center mb-8">
                    {t('login.otp_subtitle', "We've sent a code to")} {formattedPhone}
                </p>

                {/* OTP Inputs */}
                <div className="flex justify-center gap-3 mb-8">
                    {otp.map((digit, idx) => (
                        <input
                            key={idx}
                            ref={(el) => (inputRefs.current[idx] = el)}
                            type="text"
                            inputMode="numeric"
                            value={digit}
                            onChange={(e) => handleChange(idx, e)}
                            onKeyDown={(e) => handleKeyDown(idx, e)}
                            onPaste={handlePaste}
                            className="w-12 h-14 sm:w-14 h-14 text-center text-2xl font-medium text-dark bg-white border border-gray-200 rounded-[12px] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm"
                            maxLength={1}
                        />
                    ))}
                </div>

                {verifyError && (
                    <p className="text-sm text-red-500 text-center mb-2">{verifyError}</p>
                )}

                {/* Action Buttons */}
                <div className="flex w-full gap-4 mb-6">
                    <Button
                        variant="secondary"
                        onClick={onClose}
                        className="flex-1 h-12 text-sm"
                    >
                        {t('login.otp_cancel', 'Cancel')}
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleVerify}
                        className="flex-1 h-12 text-sm"
                        disabled={otp.join('').length < 6}
                    >
                        {t('login.otp_verify', 'Verify')}
                    </Button>
                </div>

                {/* Resend Code */}
                <p className="text-sm">
                    <span className="text-grayCustom">{t('login.otp_didnt_receive', "Didn't receive code?")} </span>
                    <button
                        type="button"
                        onClick={() => onResend && onResend()}
                        className="text-dark font-medium hover:text-primary transition-colors"
                    >
                        {t('login.otp_resend', 'Resend code')}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default OTPModal;
