import type { RegisteredUserLocation } from '@/pages/Components/Dashboard/Maps';
import { Users, ShieldAlert, HeartPulse } from '@/pages/Components/Dashboard/Icons';

interface CitizensListViewProps {
    registeredUsers: RegisteredUserLocation[];
    onSelectHousehold?: (household: RegisteredUserLocation) => void;
}

export default function CitizensListView({
    registeredUsers,
    onSelectHousehold,
}: CitizensListViewProps) {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-bold text-[#1F6F5F] font-display">Daftar Warga & Keluarga</h2>
                <p className="text-sm text-gray-500 mt-1">Data warga terdaftar beserta anggota keluarganya.</p>
            </div>

            <div className="bg-white rounded-xl border border-[#EEEEEE] overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-600">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-[#EEEEEE]">
                            <tr>
                                <th scope="col" className="px-6 py-4">Keluarga / Kepala Keluarga</th>
                                <th scope="col" className="px-6 py-4">Alamat & Kontak</th>
                                <th scope="col" className="px-6 py-4">Anggota & Kerentanan</th>
                                <th scope="col" className="px-6 py-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#EEEEEE]">
                            {registeredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                        Belum ada warga yang terdaftar
                                    </td>
                                </tr>
                            ) : (
                                registeredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 align-top">
                                            <div className="font-bold text-gray-900">{user.name}</div>
                                            <div className="text-xs text-gray-500 mt-1">
                                                {user.no_kk ? `No. KK: ${user.no_kk}` : `ID: #${user.id}`}
                                            </div>
                                            {user.is_vulnerable && (
                                                <span className="inline-flex items-center gap-1 mt-2 rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-800">
                                                    <ShieldAlert className="w-3 h-3" />
                                                    Prioritas Rentan ({user.vulnerable_count} Jiwa)
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 align-top">
                                            <div className="max-w-[200px] truncate" title={user.home_address ?? 'Alamat belum dilengkapi'}>
                                                {user.home_address ?? 'Alamat belum dilengkapi'}
                                            </div>
                                            <div className="text-xs font-medium text-gray-900 mt-2">
                                                {user.whatsapp_number ? user.whatsapp_number : 'Tidak ada no WA'}
                                            </div>
                                            <div className="text-xs text-gray-400 mt-1 font-mono">
                                                {user.latitude.toFixed(4)}, {user.longitude.toFixed(4)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 align-top">
                                            <div className="flex items-center gap-2 mb-3">
                                                <span className="flex items-center gap-1 text-xs font-medium bg-gray-100 px-2 py-1 rounded-md">
                                                    <Users className="w-3 h-3 text-gray-500" />
                                                    {user.total_members} Anggota
                                                </span>
                                                <span className="flex items-center gap-1 text-xs font-medium bg-purple-50 text-purple-700 px-2 py-1 rounded-md">
                                                    <HeartPulse className="w-3 h-3" />
                                                    {user.vulnerable_count} Rentan
                                                </span>
                                            </div>
                                            {user.members && user.members.length > 0 && (
                                                <ul className="space-y-2 mt-2">
                                                    {user.members.map((member, idx) => (
                                                        <li key={idx} className="text-xs flex items-start gap-2 bg-white border border-gray-100 rounded p-2">
                                                            <div className="flex-1">
                                                                <span className="font-semibold">{member.name}</span>
                                                                <span className="text-gray-400 ml-1">({member.role})</span>
                                                                {member.is_vulnerable && (
                                                                    <div className="text-[10px] text-purple-600 font-medium mt-0.5">
                                                                        {member.vulnerability_category}
                                                                        {member.comorbidity_notes ? ` - ${member.comorbidity_notes}` : ''}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 align-top text-right whitespace-nowrap">
                                            {onSelectHousehold && (
                                                <button
                                                    type="button"
                                                    onClick={() => onSelectHousehold(user)}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1F6F5F] hover:bg-[#2FA084] text-white text-xs font-bold shadow-2xs transition-colors cursor-pointer"
                                                >
                                                    <span>Lihat Pop-up Detail</span>
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

