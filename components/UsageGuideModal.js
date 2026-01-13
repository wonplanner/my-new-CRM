
import React from 'react';
import { X } from 'lucide-react';

const UsageGuideModal = ({ onClose }) => (
  <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
    <div className="bg-white w-full max-w-md rounded-[32px] p-8 text-center space-y-6">
      <h2 className="text-2xl font-black">사용 가이드</h2>
      <p className="text-sm text-gray-500">고객을 등록하고 AI 인사이트를 받아보세요.</p>
      <button onClick={onClose} className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-black">확인</button>
    </div>
  </div>
);

export default UsageGuideModal;
