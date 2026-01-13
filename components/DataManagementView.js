
import React from 'react';
import { ArrowLeft, Download, FileSpreadsheet, FileText } from 'lucide-react';

const DataManagementView = ({ totalCount, filteredCount, onExportCSV, onExportPDF, onBack }) => (
  <div className="flex-1 bg-[#F2F2F7] overflow-y-auto p-10">
    <button onClick={onBack} className="text-blue-500 font-bold mb-6"><ArrowLeft size={18} className="inline mr-1" />돌아가기</button>
    <h2 className="text-3xl font-black mb-10">데이터 관리 센터</h2>
    <div className="grid grid-cols-2 gap-6 mb-10">
       <div className="bg-white p-6 rounded-3xl shadow-sm"><strong>전체 고객</strong>: {totalCount}명</div>
       <div className="bg-white p-6 rounded-3xl shadow-sm"><strong>필터된 고객</strong>: {filteredCount}명</div>
    </div>
    <div className="flex gap-4">
       <button onClick={onExportCSV} className="flex-1 bg-green-500 text-white py-4 rounded-2xl font-black"><FileSpreadsheet size={20} className="inline mr-2" />엑셀 저장</button>
       <button onClick={onExportPDF} className="flex-1 bg-red-500 text-white py-4 rounded-2xl font-black"><FileText size={20} className="inline mr-2" />PDF 출력</button>
    </div>
  </div>
);

export default DataManagementView;
