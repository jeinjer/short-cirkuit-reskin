import React from 'react';
import { Zap, Shield, Globe, Cpu } from 'lucide-react';

export const servicesData = [
  {
    id: 1,
    title: "SOPORTE HIGH-END",
    desc: "Diagnóstico y overclocking de élite.",
    fullDesc: "Nuestro equipo de élite no duerme. Ofrecemos diagnóstico remoto y presencial con herramientas de última generación para asegurar que tu setup nunca deje de rendir al máximo.",
    icon: <Zap className="w-6 h-6 text-yellow-400" />,
    image: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&q=80&w=800",
    color: "from-yellow-400 to-orange-500"
  },
  {
    id: 2,
    title: "GARANTÍA BLINDADA",
    desc: "RMA directo y reemplazo express.",
    fullDesc: "Olvídate de la letra chica. Nuestra garantía cubre reemplazo directo en componentes defectuosos durante 3 años. Gestionamos el RMA directamente con los fabricantes.",
    icon: <Shield className="w-6 h-6 text-cyan-400" />,
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800",
    color: "from-cyan-400 to-blue-500"
  },
  {
    id: 3,
    title: "ENVÍOS GLOBALES",
    desc: "Logística militar para tu hardware.",
    fullDesc: "Utilizamos un packaging de grado militar para asegurar que tu GPU o monitor llegue intacto. Tracking en tiempo real y seguro incluido.",
    icon: <Globe className="w-6 h-6 text-emerald-400" />,
    image: "https://images.unsplash.com/photo-1566576912906-253c721b0333?auto=format&fit=crop&q=80&w=800",
    color: "from-emerald-400 to-green-500"
  },
  {
    id: 4,
    title: "CUSTOM BUILDS",
    desc: "Ingeniería y montaje de precisión.",
    fullDesc: "No es solo armar una PC, es arte. Gestión de cables milimétrica, configuración de curvas de ventilación y pruebas de estrés intensivas.",
    icon: <Cpu className="w-6 h-6 text-purple-400" />,
    image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80&w=800",
    color: "from-purple-400 to-pink-500"
  },
];