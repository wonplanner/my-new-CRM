
import React, { useState } from 'react';
import { CustomerStatus } from '../types.js';
import { X, Save, User, Phone } from 'lucide-react';

const CustomerForm = ({ customer, allCustomers, onClose, onSubmit }) => {
  const [formData, setFormData] = useState(
    customer || {
      name: '',
      phone: '',
      address: '',
      birthDate: '',
      status: CustomerStatus.ACTIVE,
      contracts: [],
      history: [],
      relationships: []
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return alert('필수 입력');
    onSubmit({ ...formData, id: formData.id || Date.now().toString(), createdAt: formData.createdAt || new Date().toISOString() });
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div className="bg-white w-full max-w-xl rounded-[40px] p-8">
        <div className="flex justify-between mb-8"><h2 className="text-2xl font-black">고객 정보</h2><button onClick={onClose}><X size={24} /></button></div>
        <form onSubmit={handleSubmit} className="space-y-6">
           <input type="text" placeholder="이름" className="w-full p-4 bg-gray-50 rounded-2xl" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
           <input type="text" placeholder="전화번호" className="w-full p-4 bg-gray-50 rounded-2xl" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
           <div className="flex gap-2">
              {Object.values(CustomerStatus).map(s => <button type="button" key={s} onClick={() => setFormData({...formData, status: s})} className={`flex-1 py-3 rounded-xl font-bold ${formData.status === s ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>{s}</button>)}
           </div>
           <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black shadow-xl">저장하기</button>
        </form>
      </div>
    </div>
  );
};

export default CustomerForm;
