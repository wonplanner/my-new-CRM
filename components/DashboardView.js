
import React, { useState, useEffect } from 'react';
import { Sparkles, Wand2, RefreshCw, Clock, CheckCircle, Users, FileText, CheckCircle2, ChevronRight, Settings, X, Plus, Trash2 } from 'lucide-react';

const DashboardView = ({ userName, notices, onAddNotice, onDeleteNotice, totalCustomers, activeContracts, aiInsights, onGenerateAiInsights, isAiLoading, lastAiUpdate }) => {
  const [showNoticeEditor, setShowNoticeEditor] = useState(false);
  const [newNoticeContent, setNewNoticeContent] = useState('');

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-10 animate-in fade-in">
      <header className="space-y-2">
        <h2 className="text-3xl font-black text-gray-900">반가워요, <span className="text-blue-600">{userName}</span> 님!</h2>
        <p className="text-gray-500 font-medium">오늘도 힘차게 업무를 시작해 볼까요?</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="bg-white rounded-[40px] p-8 shadow-sm border border-indigo-100 relative min-h-[300px] flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <span className="bg-indigo-50 text-indigo-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase"><Wand2 size={14} className="inline mr-1" /> AI 인사이트</span>
            <button onClick={onGenerateAiInsights} disabled={isAiLoading} className="text-indigo-500"><RefreshCw size={18} className={isAiLoading ? 'animate-spin' : ''} /></button>
          </div>
          <div className="flex-1">
            {isAiLoading ? (
               <div className="flex flex-col items-center justify-center h-full"><p className="text-xs font-black text-indigo-600">데이터 분석 중...</p></div>
            ) : aiInsights ? (
               <div className="bg-gray-50 p-5 rounded-3xl border border-gray-100"><p className="text-[13px] font-medium text-gray-700 whitespace-pre-wrap">{aiInsights}</p></div>
            ) : (
               <div className="text-center py-10 flex flex-col items-center justify-center">
                 <button onClick={onGenerateAiInsights} className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-black shadow-xl">분석 보고서 생성</button>
               </div>
            )}
          </div>
        </section>
        
        <section className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-[40px] text-white flex flex-col justify-between h-[300px]">
          <div className="flex items-center justify-between">
            <span className="bg-white/20 px-4 py-1.5 rounded-full text-[10px] font-black uppercase">리마인더</span>
            <button onClick={() => setShowNoticeEditor(true)}><Settings size={20} /></button>
          </div>
          <p className="text-xl font-bold">"{notices[0]?.content || '등록된 일정이 없습니다.'}"</p>
          <div className="text-xs opacity-60">총 {notices.length}개의 리마인더가 있습니다.</div>
        </section>
      </div>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center"><Users size={24} /></div>
          <div><p className="text-[10px] font-black text-gray-400">전체 고객</p><p className="text-2xl font-black text-gray-900">{totalCustomers}명</p></div>
        </div>
        <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center"><FileText size={24} /></div>
          <div><p className="text-[10px] font-black text-gray-400">유지 계약</p><p className="text-2xl font-black text-gray-900">{activeContracts}건</p></div>
        </div>
      </section>

      {showNoticeEditor && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="bg-white w-full max-w-lg rounded-[32px] p-6">
             <div className="flex justify-between mb-4"><h3 className="font-bold">리마인더 설정</h3><button onClick={() => setShowNoticeEditor(false)}><X size={20} /></button></div>
             <div className="space-y-2 mb-4">
                {notices.map(n => <div key={n.id} className="flex justify-between p-3 bg-gray-50 rounded-xl"><span>{n.content}</span><button onClick={() => onDeleteNotice(n.id)}><Trash2 size={16} /></button></div>)}
             </div>
             <button onClick={() => setShowNoticeEditor(false)} className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold">완료</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardView;
