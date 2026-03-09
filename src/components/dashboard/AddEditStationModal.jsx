import React, { useState, useEffect } from 'react';
import { Fuel, Utensils } from 'lucide-react';

const AddEditStationModal = ({ isOpen, onClose, onSave, station = null, entityType = 'station' }) => {
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        city: 'Hyderabad',
        state: 'Telangana',
        managerName: '',
        managerPhone: '',
    });

    useEffect(() => {
        if (station) {
            setFormData({
                name: station.name || '',
                address: station.address || '',
                city: 'Hyderabad',
                state: 'Telangana',
                managerName: station.manager || '',
                managerPhone: station.contact || '',
            });
        } else {
            setFormData({
                name: '',
                address: '',
                city: 'Hyderabad',
                state: 'Telangana',
                managerName: '',
                managerPhone: '',
            });
        }
    }, [station, isOpen]);

    if (!isOpen) return null;

    const cities = ['Hyderabad', 'Bangalore', 'Mumbai', 'Delhi'];
    const states = ['Telangana', 'Karnataka', 'Maharashtra', 'Delhi'];

    const isRestaurant = entityType === 'restaurant';
    const entityName = isRestaurant ? 'Restaurant' : 'Petrol Station';

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-[8px]"
                onClick={onClose}
            />
            <div className="relative bg-white rounded-[32px] w-full max-w-[440px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 font-onest">
                <div className="p-8">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-[12px] bg-[#FFF5F5] flex items-center justify-center">
                            {isRestaurant ? <Utensils className="text-primary w-5 h-5" /> : <Fuel className="text-primary w-5 h-5" />}
                        </div>
                        <h2 className="text-[20px] font-bold text-dark text-center tracking-tight">
                            {station ? `Edit ${entityName}` : `Add ${entityName}`}
                        </h2>
                    </div>

                    {/* Form */}
                    <div className="space-y-4">
                        {/* Station Name */}
                        <div className="space-y-1.5">
                            <label className="text-[12px] font-semibold text-[#555555] ml-1">{entityName} Name</label>
                            <input
                                type="text"
                                placeholder={`Enter ${entityName.toLowerCase()} name`}
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-5 py-3.5 bg-[#F4F4F4] border border-transparent rounded-[16px] text-[14px] focus:bg-white focus:border-primary/20 outline-none transition-all placeholder:text-gray-400"
                            />
                        </div>

                        {/* Address */}
                        <div className="space-y-1.5">
                            <label className="text-[12px] font-semibold text-[#555555] ml-1">{entityName} Address</label>
                            <input
                                type="text"
                                placeholder={`Enter Address ${entityName.toLowerCase()}`}
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                className="w-full px-5 py-3.5 bg-[#F4F4F4] border border-transparent rounded-[16px] text-[14px] focus:bg-white focus:border-primary/20 outline-none transition-all placeholder:text-gray-400"
                            />
                        </div>

                        {/* City & State */}
                        <div className="flex gap-4">
                            <div className="flex-1 space-y-1.5">
                                <label className="text-[12px] font-semibold text-[#555555] ml-1">City</label>
                                <div className="relative">
                                    <select
                                        value={formData.city}
                                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                        className="w-full px-5 py-3.5 bg-[#F4F4F4] border border-transparent rounded-[16px] text-[14px] focus:bg-white outline-none appearance-none cursor-pointer"
                                    >
                                        {cities.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M1 1L5 5L9 1" stroke="#939393" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            <div className="flex-1 space-y-1.5">
                                <label className="text-[12px] font-semibold text-[#555555] ml-1">State</label>
                                <div className="relative">
                                    <select
                                        value={formData.state}
                                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                        className="w-full px-5 py-3.5 bg-[#F4F4F4] border border-transparent rounded-[16px] text-[14px] focus:bg-white outline-none appearance-none cursor-pointer"
                                    >
                                        <option value="State" disabled>State</option>
                                        {states.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M1 1L5 5L9 1" stroke="#939393" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Manager Name */}
                        <div className="space-y-1.5">
                            <label className="text-[12px] font-semibold text-[#555555] ml-1">{entityName} Manager Name</label>
                            <input
                                type="text"
                                placeholder={`Enter ${entityName.toLowerCase()} manager name`}
                                value={formData.managerName}
                                onChange={(e) => setFormData({ ...formData, managerName: e.target.value })}
                                className="w-full px-5 py-3.5 bg-[#F4F4F4] border border-transparent rounded-[16px] text-[14px] focus:bg-white focus:border-primary/20 outline-none transition-all placeholder:text-gray-400"
                            />
                        </div>

                        {/* Manager Phone */}
                        <div className="space-y-1.5">
                            <label className="text-[12px] font-semibold text-[#555555] ml-1">{entityName} Manager Phone</label>
                            <input
                                type="text"
                                placeholder={`Enter ${entityName.toLowerCase()} manager phone`}
                                value={formData.managerPhone}
                                onChange={(e) => setFormData({ ...formData, managerPhone: e.target.value })}
                                className="w-full px-5 py-3.5 bg-[#F4F4F4] border border-transparent rounded-[16px] text-[14px] focus:bg-white focus:border-primary/20 outline-none transition-all placeholder:text-gray-400"
                            />
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex w-full gap-4 mt-8">
                        <button
                            onClick={onClose}
                            className="flex-1 h-[48px] !rounded-[16px] bg-[#F4F4F4] text-[#2E2E2E] font-medium text-[16px] border-none hover:bg-[#E5E5E5] transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => onSave(formData)}
                            className="flex-1 h-[48px] !rounded-[16px] bg-[#DC0004] text-white font-medium text-[16px] border-none hover:opacity-95 transition-all active:scale-[0.98]"
                        >
                            {station ? `Edit ${isRestaurant ? 'Restaurant' : 'Station'}` : `Add ${isRestaurant ? 'Restaurant' : 'Station'}`}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddEditStationModal;
