import React, { useEffect, useState } from 'react';
import api from '../../api/axios';

export default function InquiryTable() {
  const [inquiries, setInquiries] = useState([]);

  useEffect(() => {
    api.get('/admin/inquiries').then(res => setInquiries(res.data));
  }, []);

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
      <table className="w-full text-left font-mono text-xs uppercase tracking-tighter">
        <thead className="bg-white/5 text-gray-400">
          <tr>
            <th className="p-4">Fecha</th>
            <th className="p-4">Producto</th>
            <th className="p-4">Cliente</th>
            <th className="p-4">Teléfono</th>
            <th className="p-4">Mensaje</th>
          </tr>
        </thead>
        <tbody>
          {inquiries.map(iq => (
            <tr key={iq.id} className="border-t border-white/5 hover:bg-white/2 transition-colors">
              <td className="p-4">{new Date(iq.createdAt).toLocaleDateString()}</td>
              <td className="p-4 text-cyan-400">{iq.product.name}</td>
              <td className="p-4">{iq.name}</td>
              <td className="p-4 text-green-400">{iq.phone}</td>
              <td className="p-4 text-gray-500 lowercase">{iq.message || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}