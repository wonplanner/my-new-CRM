
import React, { useState } from 'react';
import { X, Send, Copy } from 'lucide-react';

const BulkSmsModal = ({ selectedCustomers, onClose }) => {
  const [message, setMessage] = useState('');
  const handleSend = () => {
    const phones = selectedCustomers.map(c => c.phone.replace(/[^0-9]/g, '')).join(',');
    window.location.href = `sms:${phones}&body=${encodeURIComponent(message)}`;
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div className="bg-white w-full max-w-lg rounded-[32px] p-6 space-y-6">
        <div className="flex justify-between items-center"><h2 className="text-lg font-black">단체 메시지 ({selectedCustomers.length}명)</h2><button onClick={onClose}><X size={20} /></button></div>
        <textarea placeholder="내용을 입력하세요." className="w-full h-32 p-4 bg-gray-50 rounded-2xl outline-none" value={message} onChange={e => setMessage(e.target.value)} />
        <button onClick={handleSend} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black">메시지 앱 연동</button>
      </div>
    </div>
  );
};

export default BulkSmsModal;
