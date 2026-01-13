
import React from 'react';
import { CustomerStatus } from '../types.js';
import { ChevronRight, Phone, CheckCircle2, Circle } from 'lucide-react';

const CustomerList = ({ customers, selectedId, onSelect, isSelectionMode, selectedIds }) => {
  return (
    <div className="flex-1 overflow-y-auto bg-white">
      {customers.length === 0 ? (
        <div className="p-8 text-center text-gray-400 mt-10"><p className="text-sm">데이터 없음</p></div>
      ) : (
        <div className="divide-y divide-gray-50">
          {customers.map(customer => {
            const isChecked = selectedIds?.has(customer.id);
            return (
              <div key={customer.id} onClick={() => onSelect(customer.id)} className={`p-4 cursor-pointer flex items-center gap-4 ${!isSelectionMode && selectedId === customer.id ? 'bg-blue-50 border-l-4 border-blue-500' : 'hover:bg-gray-50 border-l-4 border-transparent'}`}>
                {isSelectionMode && <div className={isChecked ? 'text-blue-500' : 'text-gray-300'}>{isChecked ? <CheckCircle2 size={22} fill="currentColor" /> : <Circle size={22} />}</div>}
                <div className="w-11 h-11 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 font-bold">{customer.name[0]}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline"><h3 className="text-sm font-bold text-gray-900">{customer.name}</h3><span className="text-[9px] font-black text-blue-500">{customer.status}</span></div>
                  <p className="text-[11px] text-gray-500 mt-0.5">{customer.phone}</p>
                </div>
                {!isSelectionMode && <ChevronRight size={16} className="text-gray-300" />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CustomerList;
