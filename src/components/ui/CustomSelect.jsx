import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';

const CustomSelect = ({
    value,
    options = [],
    onChange,
    placeholder = 'Select',
    icon = null,
    className = '',
    buttonClassName = '',
    menuClassName = '',
}) => {
    const [open, setOpen] = useState(false);
    const wrapperRef = useRef(null);

    const selectedOption = useMemo(
        () => options.find((opt) => String(opt.value) === String(value)) || null,
        [options, value]
    );

    useEffect(() => {
        const onDocClick = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setOpen(false);
            }
        };

        document.addEventListener('mousedown', onDocClick);
        return () => document.removeEventListener('mousedown', onDocClick);
    }, []);

    const handleSelect = (optionValue) => {
        onChange?.(optionValue);
        setOpen(false);
    };

    return (
        <div ref={wrapperRef} className={`relative ${className}`}>
            <button
                type="button"
                className={`w-full h-[48px] rounded-[16px] bg-[#F5F7F9] border border-[#E7EDF3] px-4 text-[14px] text-[#0E1B2C] flex items-center justify-between gap-3 shadow-[0px_1px_10px_0px_rgba(0,0,0,0.1)] ${buttonClassName}`}
                onClick={() => setOpen((prev) => !prev)}
            >
                <span className="flex items-center gap-2 min-w-0">
                    {icon}
                    <span className="truncate font-semibold text-left">
                        {selectedOption?.label || placeholder}
                    </span>
                </span>
                <ChevronDown
                    size={18}
                    className={`text-[#74839A] transition-transform ${open ? 'rotate-180' : ''}`}
                />
            </button>

            {open ? (
                <div
                    className={`absolute z-50 mt-2 w-full rounded-[16px] border border-[#DCE4ED] bg-white shadow-[0px_1px_10px_0px_rgba(0,0,0,0.1)] p-2 ${menuClassName}`}
                >
                    {options.map((option) => {
                        const selected = String(option.value) === String(value);
                        return (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => handleSelect(option.value)}
                                className={`w-full h-[42px] rounded-[12px] px-3 flex items-center justify-between text-left text-[14px] transition-colors ${
                                    selected
                                        ? 'bg-[#EEF4FF] text-[#2563EB] font-semibold'
                                        : 'text-[#233243] hover:bg-[#F3F7FB]'
                                }`}
                            >
                                <span className="truncate">{option.label}</span>
                                {selected ? <Check size={16} /> : null}
                            </button>
                        );
                    })}
                </div>
            ) : null}
        </div>
    );
};

export default CustomSelect;
