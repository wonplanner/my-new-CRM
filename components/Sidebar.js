
import React, { useState } from 'react';
import { 
  Search, UserPlus, Calendar, Tag, ChevronDown, ChevronUp, 
  HelpCircle, UserCircle, Database, Users, LogIn, Cloud, LogOut, ShieldCheck, Filter
} from 'lucide-react';
import { CustomerStatus } from '../types.js';

const PREDEFINED_TAGS = ['종합', '암', '운전자', '태아', '실손', '생명', '치아', '화재', '연금'];
const MONTHS = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));

const Sidebar = ({ 
  userProfile, currentView, setCurrentView,
  searchQuery, setSearchQuery, statusFilter, setStatusFilter, 
  birthMonth, setBirthMonth, selectedTag, setSelectedTag, onAddClick, onShowGuide, 
  onShowLogin, onLogout, isSelectionMode, onToggleSelectionMode, onResetFilters
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const getStatusBtnClass = (status) => {
    const base = "px-3 py-2.5 rounded-xl text-[11px] font-black transition-all border";
    if (statusFilter === status) {
      return `${base} bg-blue-50 text-blue-600 border-blue-500 shadow-sm`;
    }
    return `${base} bg-white border-gray-100 text-gray-400 hover:border-gray-200`;
  };

  return (
    <div className="flex flex-col h-full p-6">
      <div className="mb-8">
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-[28px] border border-gray-100">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg">
            {userProfile?.isLoggedIn ? <Cloud size={24} /> : <UserCircle size={24} />}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-sm font-black text-gray-900 truncate">
              {userProfile?.isLoggedIn ? userProfile.name : '설계사 미로그인'}
            </h1>
          </div>
        </div>
      </div>

      <nav className="mb-8 space-y-1.5">
        <button onClick={() => setCurrentView('crm')} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-black text-xs transition-all ${currentView === 'crm' ? 'bg-blue-600 text-white' : 'text-gray-500'}`}><Users size={18} /> 고객 DB</button>
        <button onClick={() => setCurrentView('data')} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-black text-xs transition-all ${currentView === 'data' ? 'bg-blue-600 text-white' : 'text-gray-500'}`}><Database size={18} /> 데이터 센터</button>
      </nav>

      <div className="space-y-6 flex-1 overflow-y-auto no-scrollbar pb-6">
        <div>
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block px-1">빠른 검색</label>
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
            <input type="text" placeholder="이름/번호" className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3.5 pl-10 pr-4 text-xs font-bold" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
        </div>

        <div>
           <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block px-1">상태 필터</label>
           <div className="grid grid-cols-2 gap-2">
             {['전체', ...Object.values(CustomerStatus)].map(status => (
               <button key={status} onClick={() => setStatusFilter(status)} className={getStatusBtnClass(status)}>{status}</button>
             ))}
           </div>
        </div>

        <button onClick={onAddClick} className="w-full bg-blue-600 text-white py-4 rounded-[22px] font-black text-sm shadow-xl shadow-blue-600/20 transition-all">신규 고객 등록</button>
      </div>
    </div>
  );
};

export default Sidebar;
