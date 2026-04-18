import React, { useState, useEffect, useRef } from 'react';
import { Fuel, Utensils } from 'lucide-react';

const Field = ({ label, error, children }) => (
    <div className="space-y-1.5">
        {label && <label className="text-[12px] font-semibold text-[#555555] ml-1">{label}</label>}
        {children}
        {error && <p className="text-[12px] text-red-500 ml-1 flex items-center gap-1 mt-1">
            <span className="w-3.5 h-3.5 rounded-full bg-red-100 flex items-center justify-center text-[9px] font-black text-red-500 flex-shrink-0">!</span>
            {error}
        </p>}
    </div>
);

/** Matches backend defaults (Android emulator / Mountain View area). */
const DEFAULT_LATITUDE = 37.4219983;
const DEFAULT_LONGITUDE = -122.084;
const MAX_IMAGE_SIZE_BYTES = 2 * 1024 * 1024;
const MAX_IMAGE_COUNT = 4;

function fileToDataUrl(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result || ''));
        reader.onerror = () => reject(new Error('Failed to read image'));
        reader.readAsDataURL(file);
    });
}

const AddEditStationModal = ({ isOpen, onClose, onSave, station = null, entityType = 'station' }) => {
    const cities = ['Hyderabad', 'Bangalore', 'Mumbai', 'Delhi', 'Chennai', 'Pune'];
    const states = ['Telangana', 'Karnataka', 'Maharashtra', 'Delhi', 'Tamil Nadu'];

    const emptyForm = {
        name: '',
        address: '',
        city: 'Hyderabad',
        state: 'Telangana',
        managerName: '',
        managerPhone: '',
        imagesBase64: [],
        latitude: String(DEFAULT_LATITUDE),
        longitude: String(DEFAULT_LONGITUDE),
    };

    const [formData, setFormData] = useState(emptyForm);
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    /** Blocks a second click before React re-renders `disabled` on the button. */
    const submitLockRef = useRef(false);

    const isRestaurant = entityType === 'restaurant';
    const entityName = isRestaurant ? 'Restaurant' : 'Petrol Station';
    const asText = (v) => (v == null ? '' : String(v));

    useEffect(() => {
        if (isOpen) {
            setErrors({});
            if (station) {
                setFormData({
                    name: asText(station.name),
                    address: asText(station.address),
                    city: asText(station.city) || cities[0],
                    state: asText(station.state) || states[0],
                    managerName: asText(station.manager_name),
                    managerPhone: asText(station.manager_phone),
                    imagesBase64: Array.isArray(station.outlet_images)
                        ? station.outlet_images.slice(0, MAX_IMAGE_COUNT)
                        : [],
                    latitude:
                        station.latitude != null && station.latitude !== ''
                            ? String(station.latitude)
                            : String(DEFAULT_LATITUDE),
                    longitude:
                        station.longitude != null && station.longitude !== ''
                            ? String(station.longitude)
                            : String(DEFAULT_LONGITUDE),
                });
            } else {
                setFormData(emptyForm);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, station]);

    if (!isOpen) return null;

    const setField = (key, val) => {
        setFormData(prev => ({ ...prev, [key]: val }));
        if (errors[key]) setErrors(prev => ({ ...prev, [key]: '' }));
    };

    const validate = () => {
        const e = {};
        const name = asText(formData.name).trim();
        const address = asText(formData.address).trim();
        const managerName = asText(formData.managerName).trim();
        const managerPhone = asText(formData.managerPhone).trim();
        if (!name) e.name = `${entityName} name is required.`;
        else if (name.length < 3) e.name = 'Name must be at least 3 characters.';

        if (!address) e.address = 'Address is required.';
        else if (address.length < 10) e.address = 'Please enter a more complete address.';

        if (!formData.city) e.city = 'City is required.';
        if (!formData.state) e.state = 'State is required.';

        if (!managerName) e.managerName = 'Manager name is required.';

        if (!managerPhone) e.managerPhone = 'Manager phone is required.';
        else if (!/^\+?[0-9]{10,15}$/.test(managerPhone.replace(/\s/g, '')))
            e.managerPhone = 'Enter a valid phone number (10–15 digits).';
        if (Array.isArray(formData.imagesBase64) && formData.imagesBase64.length > MAX_IMAGE_COUNT) {
            e.imagesBase64 = `Maximum ${MAX_IMAGE_COUNT} images are allowed.`;
        }
        if ((formData.imagesBase64 || []).some(
            (img) => !/^data:image\/(png|jpe?g|webp);base64,/i.test(String(img || ''))
        )) {
            e.imagesBase64 = 'All images must be PNG, JPG, JPEG, or WEBP.';
        }

        const lat = parseFloat(String(formData.latitude).trim().replace(',', '.'));
        const lng = parseFloat(String(formData.longitude).trim().replace(',', '.'));
        if (!Number.isFinite(lat) || lat < -90 || lat > 90) {
            e.latitude = 'Enter a valid latitude (-90 to 90).';
        }
        if (!Number.isFinite(lng) || lng < -180 || lng > 180) {
            e.longitude = 'Enter a valid longitude (-180 to 180).';
        }

        return e;
    };

    const handleSubmit = async () => {
        const e = validate();
        if (Object.keys(e).length > 0) { setErrors(e); return; }
        if (submitLockRef.current) return;
        submitLockRef.current = true;
        const lat = parseFloat(String(formData.latitude).trim().replace(',', '.'));
        const lng = parseFloat(String(formData.longitude).trim().replace(',', '.'));
        setSubmitting(true);
        try {
            await onSave({ ...formData, latitude: lat, longitude: lng });
        } finally {
            submitLockRef.current = false;
            setSubmitting(false);
        }
    };

    const inputCls = (hasError) =>
        `w-full px-5 py-3.5 bg-[#F4F4F4] border rounded-[16px] text-[14px] focus:bg-white focus:outline-none focus:border-primary/20 transition-all placeholder:text-gray-400 ${hasError ? 'border-red-400 ring-2 ring-red-100' : 'border-transparent'}`;
    const imagePreview = Array.isArray(formData.imagesBase64) ? formData.imagesBase64 : [];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[8px]" onClick={onClose} />
            <div className="relative bg-white rounded-[32px] w-full max-w-[440px] shadow-2xl animate-in fade-in zoom-in duration-300 font-onest max-h-[90vh] overflow-y-auto">
                <div className="p-8">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-[12px] bg-[#FFF5F5] flex items-center justify-center">
                            {isRestaurant ? <Utensils className="text-primary w-5 h-5" /> : <Fuel className="text-primary w-5 h-5" />}
                        </div>
                        <h2 className="text-[20px] font-bold text-dark tracking-tight">
                            {station ? `Edit ${entityName}` : `Add ${entityName}`}
                        </h2>
                    </div>

                    {/* Form */}
                    <div className="space-y-4">
                        <Field label={`${entityName} Name *`} error={errors.name}>
                            <input
                                type="text"
                                placeholder={`Enter ${entityName.toLowerCase()} name`}
                                value={formData.name}
                                onChange={(e) => setField('name', e.target.value)}
                                className={inputCls(!!errors.name)}
                            />
                        </Field>

                        <Field label={`${entityName} Address *`} error={errors.address}>
                            <input
                                type="text"
                                placeholder="e.g. 123 Main Street, Near Station"
                                value={formData.address}
                                onChange={(e) => setField('address', e.target.value)}
                                className={inputCls(!!errors.address)}
                            />
                        </Field>

                        <div className="flex gap-4">
                            <div className="flex-1 min-w-0">
                                <Field label="City *" error={errors.city}>
                                    <div className="relative">
                                        <select
                                            value={formData.city}
                                            onChange={(e) => setField('city', e.target.value)}
                                            className={`${inputCls(!!errors.city)} appearance-none cursor-pointer`}
                                        >
                                            {cities.map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                            <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="#939393" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                        </div>
                                    </div>
                                </Field>
                            </div>

                            <div className="flex-1 min-w-0">
                                <Field label="State *" error={errors.state}>
                                    <div className="relative">
                                        <select
                                            value={formData.state}
                                            onChange={(e) => setField('state', e.target.value)}
                                            className={`${inputCls(!!errors.state)} appearance-none cursor-pointer`}
                                        >
                                            {states.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                            <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="#939393" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                        </div>
                                    </div>
                                </Field>
                            </div>
                        </div>

                        <Field label="Manager Name *" error={errors.managerName}>
                            <input
                                type="text"
                                placeholder="Enter manager name"
                                value={formData.managerName}
                                onChange={(e) => setField('managerName', e.target.value)}
                                className={inputCls(!!errors.managerName)}
                            />
                        </Field>

                        <Field label="Manager Phone *" error={errors.managerPhone}>
                            <input
                                type="tel"
                                placeholder="+91 98765 43210"
                                value={formData.managerPhone}
                                onChange={(e) => {
                                    const v = e.target.value.replace(/[^\d+\s-]/g, '');
                                    setField('managerPhone', v);
                                }}
                                className={inputCls(!!errors.managerPhone)}
                            />
                        </Field>

                        <Field label={`${entityName} Images (max ${MAX_IMAGE_COUNT})`} error={errors.imagesBase64}>
                            <input
                                type="file"
                                multiple
                                accept="image/png,image/jpeg,image/jpg,image/webp"
                                className={inputCls(!!errors.imagesBase64)}
                                onChange={async (e) => {
                                    const selected = Array.from(e.target.files || []);
                                    if (selected.length === 0) return;
                                    const nextCount = (formData.imagesBase64?.length || 0) + selected.length;
                                    if (nextCount > MAX_IMAGE_COUNT) {
                                        setErrors(prev => ({
                                            ...prev,
                                            imagesBase64: `You can upload maximum ${MAX_IMAGE_COUNT} images.`,
                                        }));
                                        return;
                                    }
                                    try {
                                        const tooLarge = selected.find((file) => file.size > MAX_IMAGE_SIZE_BYTES);
                                        if (tooLarge) {
                                            setErrors(prev => ({
                                                ...prev,
                                                imagesBase64: 'Each image size should be 2MB or less.',
                                            }));
                                            return;
                                        }
                                        const dataUrls = await Promise.all(selected.map((file) => fileToDataUrl(file)));
                                        setField('imagesBase64', [...(formData.imagesBase64 || []), ...dataUrls]);
                                    } catch (err) {
                                        setErrors(prev => ({
                                            ...prev,
                                            imagesBase64: err.message || 'Failed to process images.',
                                        }));
                                    }
                                }}
                            />
                            {imagePreview.length > 0 && (
                                <div className="mt-2 rounded-[12px] border border-[#ECECEC] bg-[#FAFAFA] p-2">
                                    <div className="grid grid-cols-2 gap-2">
                                        {imagePreview.map((img, idx) => (
                                            <div key={`${idx}-${img.slice(0, 24)}`} className="relative">
                                                <img
                                                    src={img}
                                                    alt={`Outlet preview ${idx + 1}`}
                                                    className="w-full h-24 object-cover rounded-[8px]"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setField('imagesBase64', imagePreview.filter((_, i) => i !== idx))}
                                                    className="absolute top-1.5 right-1.5 text-white bg-black/55 rounded-full w-6 h-6 text-xs"
                                                    aria-label={`Remove image ${idx + 1}`}
                                                >
                                                    x
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </Field>

                        <div className="flex gap-4">
                            <div className="flex-1 min-w-0">
                                <Field label="Latitude *" error={errors.latitude}>
                                    <input
                                        type="text"
                                        inputMode="decimal"
                                        placeholder={String(DEFAULT_LATITUDE)}
                                        value={formData.latitude}
                                        onChange={(e) => setField('latitude', e.target.value)}
                                        className={inputCls(!!errors.latitude)}
                                    />
                                </Field>
                            </div>
                            <div className="flex-1 min-w-0">
                                <Field label="Longitude *" error={errors.longitude}>
                                    <input
                                        type="text"
                                        inputMode="decimal"
                                        placeholder={String(DEFAULT_LONGITUDE)}
                                        value={formData.longitude}
                                        onChange={(e) => setField('longitude', e.target.value)}
                                        className={inputCls(!!errors.longitude)}
                                    />
                                </Field>
                            </div>
                        </div>
                        <p className="text-[11px] text-gray-400 -mt-2 ml-1">
                            Defaults match Android emulator (Mountain View). Adjust for the real site.
                        </p>
                    </div>

                    {/* Footer */}
                    <div className="flex w-full gap-4 mt-8">
                        <button type="button" onClick={onClose}
                            className="flex-1 h-[48px] rounded-[16px] bg-[#F4F4F4] text-[#2E2E2E] font-medium text-[16px] hover:bg-[#E5E5E5] transition-colors">
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={submitting}
                            className="flex-1 h-[48px] rounded-[16px] bg-[#DC0004] text-white font-medium text-[16px] hover:opacity-95 transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {submitting ? 'Saving...' : station ? `Edit ${isRestaurant ? 'Restaurant' : 'Station'}` : `Add ${isRestaurant ? 'Restaurant' : 'Station'}`}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddEditStationModal;
