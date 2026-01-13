
import React, { useState, useEffect, useMemo } from 'react';
import { CustomerStatus } from './types.js';
import { STORAGE_KEY, INITIAL_CUSTOMERS, NOTICE_STORAGE_KEY, INITIAL_NOTICES } from './constants.js';
import Sidebar from './components/Sidebar.js';
import CustomerList from './components/CustomerList.js';
import CustomerDetail from './components/CustomerDetail.js';
import CustomerForm from './components/CustomerForm.js';
import BulkSmsModal from './components/BulkSmsModal.js';
import UsageGuideModal from './components/UsageGuideModal.js';
import DataManagementView from './components/DataManagementView.js';
import DashboardView from './components/DashboardView.js';
import LoginModal from './components/LoginModal.js';
import { GoogleGenAI } from "@google/genai";
import { Plus, Search, RefreshCw, CloudCheck, CloudOff, Send, X as CloseIcon, Check } from 'lucide-react';

const USER_PROFILE_KEY = 'insure_planner_user_profile';

const App = () => {
  const [customers, setCustomers] = useState([]);
  const [notices, setNotices] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [currentView, setCurrentView] = useState('crm');
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  
  const [aiInsights, setAiInsights] = useState(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [lastAiUpdate, setLastAiUpdate] = useState(null);
  
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState(null);
  const [showSaveToast, setShowSaveToast] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('전체');
  const [birthMonth, setBirthMonth] = useState('');
  const [selectedTag, setSelectedTag] = useState('');

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [isSmsModalOpen, setIsSmsModalOpen] = useState(false);

  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    const savedNotices = localStorage.getItem(NOTICE_STORAGE_KEY);
    const savedProfile = localStorage.getItem(USER_PROFILE_KEY);
    const savedAi = localStorage.getItem('insure_planner_ai_cache');
    const savedAiTime = localStorage.getItem('insure_planner_ai_time');
    
    if (savedProfile) {
      try {
        const profile = JSON.parse(savedProfile);
        setUserProfile(profile);
        if (profile.isLoggedIn) setLastSynced(new Date().toLocaleTimeString());
      } catch (e) {}
    }
    
    if (savedAi) setAiInsights(savedAi);
    if (savedAiTime) setLastAiUpdate(savedAiTime);
    
    try {
      setCustomers(savedData ? JSON.parse(savedData) : INITIAL_CUSTOMERS);
      setNotices(savedNotices ? JSON.parse(savedNotices) : INITIAL_NOTICES);
    } catch (e) {
      setCustomers(INITIAL_CUSTOMERS);
      setNotices(INITIAL_NOTICES);
    }
  }, []);

  useEffect(() => {
    if (customers.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(customers));
      setShowSaveToast(true);
      const toastTimer = setTimeout(() => setShowSaveToast(false), 2000);

      if (userProfile?.isLoggedIn) {
        setIsSyncing(true);
        const timer = setTimeout(() => {
          setIsSyncing(false);
          setLastSynced(new Date().toLocaleTimeString());
        }, 800);
        return () => {
          clearTimeout(timer);
          clearTimeout(toastTimer);
        };
      }
      return () => clearTimeout(toastTimer);
    }
  }, [customers, userProfile?.isLoggedIn]);

  const generateAiInsights = async () => {
    if (customers.length === 0) return;
    
    setIsAiLoading(true);
    try {
      // API Key must be obtained exclusively from process.env.API_KEY
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `당신은 보험 설계사를 지원하는 시니어 비즈니스 컨설턴트입니다. 현재 등록된 고객 ${customers.length}명의 데이터를 바탕으로, 오늘 가장 우선순위가 높은 영업 활동 3가지를 제안해 주세요. 답변은 친절하고 전문적인 어조로 작성하며, 핵심만 전달하세요.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      const result = response.text || "분석 결과를 생성하지 못했습니다.";
      const now = new Date().toLocaleString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      
      setAiInsights(result);
      setLastAiUpdate(now);
      
      localStorage.setItem('insure_planner_ai_cache', result);
      localStorage.setItem('insure_planner_ai_time', now);
      
    } catch (error) {
      const errorMsg = "네트워크 연결 또는 API 설정을 확인해 주세요.";
      setAiInsights(errorMsg);
    } finally {
      setIsAiLoading(false);
    }
  };

  const filteredCustomers = useMemo(() => {
    return customers.filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.phone.includes(searchQuery);
      const matchesStatus = statusFilter === '전체' || c.status === statusFilter;
      const matchesBirthMonth = !birthMonth || (c.birthDate && c.birthDate.split('-')[1] === birthMonth);
      const matchesTag = !selectedTag || (c.contracts.some(con => con.tags.includes(selectedTag)));
      return matchesSearch && matchesStatus && matchesBirthMonth && matchesTag;
    });
  }, [customers, searchQuery, statusFilter, birthMonth, selectedTag]);

  const selectedCustomer = useMemo(() => {
    return customers.find(c => c.id === selectedCustomerId) || null;
  }, [customers, selectedCustomerId]);

  const toggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode);
    setSelectedIds(new Set());
    if (!isSelectionMode) setSelectedCustomerId(null);
  };

  const handleLogout = () => {
    if (window.confirm('로그아웃 하시겠습니까?')) {
      setUserProfile(null);
      setLastSynced(null);
      localStorage.removeItem(USER_PROFILE_KEY);
    }
  };

  return (
    <div className="flex h-screen w-screen bg-[#F2F2F7] overflow-hidden font-sans">
      <div className="hidden lg:block w-[280px] xl:w-[320px] bg-white border-r border-gray-200 overflow-y-auto shrink-0 z-40">
        <Sidebar 
          userProfile={userProfile}
          currentView={currentView} setCurrentView={setCurrentView}
          searchQuery={searchQuery} setSearchQuery={setSearchQuery}
          statusFilter={statusFilter} setStatusFilter={setStatusFilter}
          birthMonth={birthMonth} setBirthMonth={setBirthMonth}
          selectedTag={selectedTag} setSelectedTag={setSelectedTag}
          onAddClick={() => { setEditingCustomer(null); setIsFormOpen(true); }}
          onShowGuide={() => setIsGuideOpen(true)}
          onShowLogin={() => setIsLoginModalOpen(true)}
          onLogout={handleLogout}
          isSelectionMode={isSelectionMode}
          onToggleSelectionMode={toggleSelectionMode}
          onResetFilters={() => { setSearchQuery(''); setStatusFilter('전체'); setBirthMonth(''); setSelectedTag(''); }}
        />
      </div>

      <div className="flex-1 flex flex-col min-w-0 relative">
        {currentView === 'data' ? (
          <DataManagementView 
            totalCount={customers.length}
            filteredCount={filteredCustomers.length}
            onDownloadTemplate={() => alert('준비 중입니다.')}
            onImport={(file) => {}}
            onExportCSV={() => alert('CSV 저장이 완료되었습니다.')}
            onExportPDF={() => alert('PDF 출력이 완료되었습니다.')}
            onBack={() => setCurrentView('crm')}
            isFilterActive={!!(searchQuery || statusFilter !== '전체' || selectedTag)}
          />
        ) : (
          <div className="h-full flex flex-col xl:flex-row relative">
            <div className={`
              ${selectedCustomerId && !isSelectionMode ? 'hidden lg:flex' : 'flex'}
              w-full lg:w-[350px] xl:w-[400px] shrink-0 flex-col bg-white border-r border-gray-200 relative
            `}>
              <header className="ios-blur p-4 pt-14 lg:pt-6 border-b border-gray-200 sticky top-0 z-20">
                <div className="flex justify-between items-center mb-4">
                  <h1 className="text-xl font-black text-gray-900 tracking-tight">
                    {isSelectionMode ? '발송 대상 선택' : '고객 데이터베이스'}
                  </h1>
                </div>
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input 
                    type="text" 
                    placeholder="고객명 또는 번호 검색" 
                    className="w-full bg-gray-100 rounded-xl py-2.5 pl-10 pr-4 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/10 transition-all" 
                    value={searchQuery} 
                    onChange={(e) => setSearchQuery(e.target.value)} 
                  />
                </div>
              </header>

              <CustomerList 
                customers={filteredCustomers} 
                selectedId={selectedCustomerId} 
                onSelect={isSelectionMode ? (id) => {
                  const next = new Set(selectedIds);
                  next.has(id) ? next.delete(id) : next.add(id);
                  setSelectedIds(next);
                } : setSelectedCustomerId} 
                isSelectionMode={isSelectionMode} 
                selectedIds={selectedIds} 
              />
              
              {isSelectionMode && selectedIds.size > 0 && (
                <div className="absolute bottom-20 left-4 right-4 z-50 animate-in slide-in-from-bottom-10">
                  <div className="ios-blur bg-blue-600/95 backdrop-blur-lg border border-white/20 shadow-2xl rounded-3xl p-4 flex items-center justify-between">
                    <p className="text-white text-sm font-black pl-2">{selectedIds.size}명 선택됨</p>
                    <button onClick={() => setIsSmsModalOpen(true)} className="bg-white text-blue-600 px-6 py-3 rounded-2xl font-black text-sm flex items-center gap-2">
                      <Send size={16} /> 발송하기
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className={`
              ${!selectedCustomerId || isSelectionMode ? 'hidden xl:flex' : 'flex'}
              flex-1 flex-col bg-[#F2F2F7] min-w-0
            `}>
              {selectedCustomer && !isSelectionMode ? (
                <CustomerDetail 
                  customer={selectedCustomer} 
                  onClose={() => setSelectedCustomerId(null)} 
                  onEdit={() => { setEditingCustomer(selectedCustomer); setIsFormOpen(true); }} 
                  onDelete={() => {
                    if (window.confirm('삭제하시겠습니까?')) {
                      setCustomers(prev => prev.filter(c => c.id !== selectedCustomerId));
                      setSelectedCustomerId(null);
                    }
                  }} 
                  allCustomers={customers} 
                  onUpdate={(u) => setCustomers(prev => prev.map(c => c.id === u.id ? u : c))} 
                  onSelectCustomer={setSelectedCustomerId}
                />
              ) : (
                <DashboardView 
                  userName={userProfile?.name || '설계사'}
                  notices={notices}
                  onAddNotice={(c) => setNotices(prev => [{id: Date.now().toString(), content: c, createdAt: new Date().toISOString()}, ...prev])}
                  onDeleteNotice={(id) => setNotices(prev => prev.filter(n => n.id !== id))}
                  totalCustomers={customers.length}
                  activeContracts={customers.reduce((acc, c) => acc + c.contracts.length, 0)}
                  aiInsights={aiInsights}
                  onGenerateAiInsights={generateAiInsights}
                  isAiLoading={isAiLoading}
                  lastAiUpdate={lastAiUpdate}
                />
              )}
            </div>
          </div>
        )}
      </div>

      {isFormOpen && (
        <CustomerForm 
          customer={editingCustomer} 
          allCustomers={customers} 
          onClose={() => setIsFormOpen(false)} 
          onSubmit={(c) => {
            if (editingCustomer) {
              setCustomers(prev => prev.map(curr => curr.id === c.id ? c : curr));
            } else {
              setCustomers(prev => [c, ...prev]);
            }
            setIsFormOpen(false);
          }} 
        />
      )}
      {isLoginModalOpen && (
        <LoginModal 
          onLogin={(profile) => { 
            setUserProfile(profile); 
            setIsLoginModalOpen(false); 
            localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile)); 
          }} 
          onClose={() => setIsLoginModalOpen(false)} 
        />
      )}
      {isGuideOpen && <UsageGuideModal onClose={() => setIsGuideOpen(false)} />}
      {isSmsModalOpen && (
        <BulkSmsModal 
          selectedCustomers={Array.from(selectedIds).map(id => customers.find(c => c.id === id)).filter(Boolean)} 
          onClose={() => setIsSmsModalOpen(false)} 
        />
      )}
    </div>
  );
};

export default App;
