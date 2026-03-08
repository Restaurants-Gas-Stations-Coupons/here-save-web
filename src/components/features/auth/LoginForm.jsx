import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../../ui/Button';
import PhoneInput from '../../ui/PhoneInput';

const LoginForm = ({ onSubmit, loading, error }) => {
    const { t } = useTranslation();
    const [phoneNumber, setPhoneNumber] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (onSubmit) {
            onSubmit({ phoneNumber, countryCode: '+91' });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <PhoneInput
                id="phone"
                label={t('login.phone')}
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder={t('login.phone_placeholder')}
                error={error}
            />

            <div className="flex justify-end">
                <button
                    type="button"
                    className="text-sm font-medium text-grayCustom hover:text-primary transition-colors"
                >
                    {t('login.forgot_password')}
                </button>
            </div>

            <Button type="submit" variant="primary" className="h-[56px] text-base font-semibold" disabled={loading}>
                {loading ? t('login.sending', 'Sending…') : t('login.login_button')}
            </Button>
        </form>
    );
};

export default LoginForm;
