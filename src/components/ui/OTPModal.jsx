import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Button from './Button';
import OTPInput from './OTPInput';

const OTPModal = ({
    isOpen,
    onClose,
    onVerify,
    onResend,
    phoneNumber,
    countryCode,
    verifyError,
    otpLength = 6 // Default to 6 for Firebase support
}) => {
    const { t } = useTranslation();
    const [otp, setOtp] = useState(Array(otpLength).fill(''));

    useEffect(() => {
        if (isOpen) {
            setOtp(Array(otpLength).fill(''));
        }
    }, [isOpen, otpLength]);

    if (!isOpen) return null;

    const handleVerify = () => {
        const fullOtp = otp.join('');
        if (fullOtp.length === otpLength) {
            onVerify(fullOtp);
        }
    };

    // Format phone number like +91 XXX XXX X111 (matching Image 1's +1 XXX XXX X789)
    const formattedPhone = `${countryCode} XXX XXX X${phoneNumber.slice(-3)}`;

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            {/* Blurred background backdrop */}
            <div
                className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative bg-white rounded-[32px] shadow-[0_1px_10px_rgba(0,0,0,0.1)] py-10 px-6 sm:px-8 w-full max-w-[401px] z-10 flex flex-col items-center animate-in zoom-in duration-300 font-onest">

                <h3 className="text-[24px] font-bold text-[#2E2E2E] mb-2 text-center tracking-tight">
                    {t('login.otp_title', 'Enter verification code')}
                </h3>

                <p className="text-[#939393] text-[16px] text-center mb-10 leading-relaxed font-normal">
                    {t('login.otp_subtitle', "We've sent a code to")} {formattedPhone}
                </p>

                {/* OTP Inputs */}
                <OTPInput
                    length={otpLength}
                    value={otp}
                    onChange={setOtp}
                    onEnter={handleVerify}
                    className="mb-10"
                />

                {verifyError && (
                    <p className="text-sm text-[#E11D48] text-center mb-4 font-medium">{verifyError}</p>
                )}

                {/* Action Buttons */}
                <div className="flex w-full gap-4 mb-8">
                    <Button
                        variant="secondary"
                        onClick={onClose}
                        className="flex-1 h-[48px] !rounded-[16px] bg-[#F4F4F4] text-[#2E2E2E] font-bold text-[16px] border-none hover:bg-[#E5E5E5] transition-colors"
                    >
                        {t('login.otp_cancel', 'Cancel')}
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleVerify}
                        className="flex-1 h-[48px] !rounded-[16px] bg-[#DC0004] text-white font-bold text-[16px] border-none hover:opacity-95 transition-all active:scale-[0.98] disabled:opacity-50 disabled:scale-100"
                        disabled={otp.join('').length < otpLength}
                    >
                        {t('login.otp_verify', 'Verify')}
                    </Button>
                </div>

                {/* Resend Code */}
                <p className="text-[16px] text-[#939393]">
                    {t('login.otp_didnt_receive', "Didn't receive code?")}{' '}
                    <button
                        type="button"
                        onClick={() => onResend && onResend()}
                        className="text-[#2E2E2E] font-bold hover:underline transition-all"
                    >
                        {t('login.otp_resend', 'Resend code')}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default OTPModal;

