import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import api from '../api/axios';

export default function ContactPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const product = state?.product;
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      await api.post('/inquiries', {
        ...data,
        productId: product.id
      });

      const adminPhone = "5493541XXXXXX"; // Tu número con código de país
      const wpMessage = `Hola! Mi nombre es ${data.name}. Estoy interesado en el producto: ${product.name} (SKU: ${product.sku}). Mi teléfono es ${data.phone}. Mensaje: ${data.message || 'Sin mensaje'}`;
      
      const wpUrl = `https://api.whatsapp.com/send?phone=${adminPhone}&text=${encodeURIComponent(wpMessage)}`;
      
      window.open(wpUrl, '_blank');

      toast.success("Consulta enviada con éxito");
      navigate(`/producto/${product.sku}`);
    } catch (error) {
      toast.error("Error al enviar la consulta");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-[#0a0a0c] rounded-2xl my-10 border border-gray-800">
      <h2 className="text-2xl font-bold mb-6">Consultar por {product?.name}</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input {...register("name", { required: true })} placeholder="Nombre completo" className="w-full p-3 bg-black border border-gray-700 rounded-lg" />
        <input {...register("email", { required: true })} placeholder="Correo electrónico" className="w-full p-3 bg-black border border-gray-700 rounded-lg" />
        <input {...register("phone", { required: true })} placeholder="Teléfono / WhatsApp" className="w-full p-3 bg-black border border-gray-700 rounded-lg" />
        <textarea {...register("message")} placeholder="Tu mensaje (opcional)" className="w-full p-3 bg-black border border-gray-700 rounded-lg h-32" />
        
        <button type="submit" className="w-full bg-blue-600 py-4 rounded-xl font-bold hover:bg-blue-700 transition-all">
          ENVIAR CONSULTA
        </button>
      </form>
    </div>
  );
}