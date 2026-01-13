
import React from 'react';
import { ShieldCheck } from 'lucide-react';

const LoginModal = ({ onLogin, onClose }) => (
  <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
    <div className="bg-white w-full max-w-sm rounded-[40px] p-8 text-center space-y-8">
      <div className="w-16 h-16 bg-blue-500 rounded-2xl mx-auto flex items-center justify-center text-white shadow-xl"><ShieldCheck size={32} /></div>
      <h2 className="text-2xl font-black">계정 로그인</h2>
      <button onClick={() => onLogin({ name: '테스트 설계사', isLoggedIn: true })} className="w-full bg-[#FEE500] text-[#3A1D1D] py-4 rounded-2xl font-black">카카오로 로그인</button>
      <button onClick={onClose} className="text-sm text-gray-400">나중에 하기</button>
    </div>
  </div>
);

export default LoginModal;
