import { COLORS } from '../../constants/colors';
import { Check } from 'lucide-react';

const StaffTableRow = ({ member, isSelected, onToggle }) => {
    return (
        <tr className={`border-b border-gray-50 transition-colors group ${isSelected ? 'bg-gray-50/50' : 'hover:bg-gray-50/30'}`}>
            <td className="py-4 pl-5 pr-3">
                <div
                    onClick={() => onToggle(member.id)}
                    className={`w-[18px] h-[18px] rounded-[4px] border flex items-center justify-center cursor-pointer transition-all ${isSelected
                            ? 'bg-primary border-primary'
                            : 'border-gray-300 group-hover:border-primary/40'
                        }`}
                >
                    {isSelected && <Check className="text-white w-3 h-3" strokeWidth={5} />}
                </div>
            </td>
            <td className="py-4 px-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100">
                    {member.image ? (
                        <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-primary text-white font-bold text-[14px]">
                            {member.name.charAt(0).toUpperCase()}
                        </div>
                    )}
                </div>
            </td>
            <td className="py-4 px-3 min-w-[140px]">
                <span className="text-[14px] font-medium text-dark leading-tight">{member.name}</span>
            </td>
            <td className="py-4 px-3 min-w-[130px]">
                <span className="text-[13px] text-[#555555] font-onest font-medium">{member.phone}</span>
            </td>
            <td className="py-4 px-3 min-w-[180px]">
                <span className="text-[13px] text-[#555555] font-onest font-medium">{member.email}</span>
            </td>
            <td className="py-4 px-3 min-w-[100px]">
                <span className="text-[13px] text-[#555555] font-onest lowercase first-letter:uppercase font-medium">{member.role}</span>
            </td>
            <td className="py-4 px-3 min-w-[140px]">
                <span className="text-[13px] text-[#555555] font-onest font-medium">{member.shift}</span>
            </td>
            <td className="py-4 px-3 min-w-[110px] pr-5">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#E6F7F0] w-max border border-[#D1F1E3]">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#35C682]"></div>
                    <span className="text-[11px] font-bold text-[#35C682] leading-none uppercase tracking-wide">{member.permission}</span>
                </div>
            </td>
        </tr>
    );
};

export default StaffTableRow;
