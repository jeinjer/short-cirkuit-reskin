import React, { useState } from 'react';
import { X, Upload } from 'lucide-react';
import { toast } from 'sonner';

export default function EditProductModal({ product, onClose, onSave }) {
    const [images, setImages] = useState(product.gallery || []);
    const [mainImage, setMainImage] = useState(product.imageUrl);
    const [loading, setLoading] = useState(false);

    const processImage = async (file) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0);
                    const webpData = canvas.toDataURL('image/webp', 0.8);
                    resolve(webpData);
                };
            };
        });
    };

    const handleFileChange = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length + images.length > 3) return toast.error("Máximo 3 imágenes en galería");
        
        setLoading(true);
        try {
            const processed = await Promise.all(files.map(processImage));
            if(!mainImage && processed.length > 0) setMainImage(processed[0]);
            setImages([...images, ...processed]);
        } catch(e) { toast.error("Error al procesar imágenes"); } 
        finally { setLoading(false); }
    };

    const handleSave = () => {
        onSave({ imageUrl: mainImage, gallery: images, isActive: product.isActive });
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-[#13131a] border border-white/10 rounded-2xl w-full max-w-lg p-6 relative shadow-2xl" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white cursor-pointer"><X/></button>
                <h3 className="text-xl font-bold text-white mb-4">Editar Imágenes: <span className="text-cyan-400">{product.sku}</span></h3>
                
                <div className="space-y-4 mb-6">
                    <div className="border-2 border-dashed border-white/20 rounded-xl p-6 text-center hover:border-cyan-500/50 transition-colors relative cursor-pointer group">
                        <input type="file" multiple accept=".jpg,.jpeg,.png" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                        <div className="group-hover:scale-105 transition-transform">
                            <Upload className="mx-auto text-gray-500 mb-2 group-hover:text-cyan-400"/>
                            <p className="text-sm text-gray-400">Arrastra o click para subir (JPG, PNG)</p>
                            <p className="text-xs text-gray-600 mt-1">Se convertirán a WebP automáticamente</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-4 gap-2">
                        {loading && <div className="col-span-4 text-center text-xs text-cyan-500 animate-pulse">Procesando...</div>}
                        
                        {mainImage && (
                            <div className="relative aspect-square bg-white rounded-lg overflow-hidden border-2 border-cyan-500 shadow-lg shadow-cyan-500/20">
                                <img src={mainImage} className="w-full h-full object-contain" alt=""/>
                                <div className="absolute bottom-0 w-full bg-cyan-600 text-[8px] text-center text-white py-0.5">PRINCIPAL</div>
                            </div>
                        )}
                        
                        {images.filter(img => img !== mainImage).map((img, idx) => (
                            <div key={idx} className="relative aspect-square bg-white rounded-lg overflow-hidden group border border-transparent hover:border-white/50 transition-all">
                                <img src={img} className="w-full h-full object-contain" alt=""/>
                                <button onClick={() => setMainImage(img)} className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center text-xs text-white cursor-pointer font-bold">USAR</button>
                                <button onClick={() => setImages(images.filter(i => i !== img))} className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-bl shadow-md hover:bg-red-600 cursor-pointer"><X size={10}/></button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg text-gray-400 hover:bg-white/5 cursor-pointer transition-colors">Cancelar</button>
                    <button onClick={handleSave} className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-bold shadow-lg shadow-cyan-900/20 cursor-pointer transition-all active:scale-95">Guardar Cambios</button>
                </div>
            </div>
        </div>
    );
};