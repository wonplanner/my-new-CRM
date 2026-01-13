
import React, { useState } from 'react';
import { CustomerStatus, HistoryType } from '../types.js';
import { ArrowLeft, Edit, Trash2, User, PhoneCall, MessageCircle, FileText, History, Network } from 'lucide-react';

const CustomerDetail = ({ customer, onClose, onEdit, onDelete, allCustomers, onUpdate, onSelectCustomer }) => {
  const [activeTab, setActiveTab] = useState('info');

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="px-6 pt-12 pb-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <button onClick={onClose} className="text-blue-500 font-bold"><ArrowLeft size={20} className="inline mr-1" />목록</button>
          <div className="flex gap-2">
            <button onClick={onEdit} className="p-2 bg-blue-50 text-blue-600 rounded-xl"><Edit size={20} /></button>
            <button onClick={onDelete} className="p-2 bg-red-50 text-red-600 rounded-xl"><Trash2 size={20} /></button>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-blue-600 rounded-[32px] flex items-center justify-center text-white font-black text-3xl">{customer.name[0]}</div>
          <div><h2 className="text-3xl font-black text-gray-900">{customer.name}</h2><p className="text-gray-500 font-bold">{customer.phone}</p></div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-6">
        <p className="text-gray-600 font-medium">고객 관리 상세 정보가 표시됩니다.</p>
        <div className="mt-10 grid grid-cols-2 gap-4">
           <button onClick={() => window.location.href=`tel:${customer.phone}`} className="bg-green-500 text-white py-4 rounded-2xl font-black flex flex-col items-center gap-2"><PhoneCall size={20} />전화</button>
           <button className="bg-[#FEE500] text-[#3A1D1D] py-4 rounded-2xl font-black flex flex-col items-center gap-2"><MessageCircle size={20} />카톡</button>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetail;
