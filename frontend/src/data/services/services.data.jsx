import React from 'react';
import { Wrench, Gamepad2, Gauge, ArrowUpCircle, Database } from 'lucide-react';

export const servicesData = [
  {
    id: 1,
    title: 'Limpieza & Mantenimiento',
    desc: 'Service completo para evitar ruido y sobrecalentamiento.',
    fullDesc:
      'Es el "service" completo para tu computadora. Desarmamos el equipo para quitar el polvo acumulado, cambiamos la pasta que evita que el procesador se recaliente y dejamos los ventiladores como nuevos. Ideal para que tu PC no haga ruido y te dure muchos años más.',
    icon: <Wrench className="w-6 h-6 text-cyan-300" />,
    image: '/services/limpieza.webp',
    color: 'from-cyan-400 to-blue-600'
  },
  {
    id: 2,
    title: 'Armado de PCs Gaming',
    desc: 'Armado profesional según tu presupuesto.',
    fullDesc:
      '¿Querés la PC de tus sueños para jugar o streamear? Te asesoramos para elegir los mejores componentes según tu presupuesto. La armamos con total prolijidad, configuramos todo para que rinda al máximo y te la entregamos lista para que solo tengas que instalar tus juegos.',
    icon: <Gamepad2 className="w-6 h-6 text-fuchsia-300" />,
    image: '/services/armado.webp',
    color: 'from-fuchsia-500 to-purple-600'
  },
  {
    id: 3,
    title: 'Optimización de Sistema',
    desc: 'Mejora de rendimiento, limpieza y actualización.',
    fullDesc:
      'Hacemos que tu computadora se sienta como el primer día. Eliminamos virus, borramos archivos basura que la ponen lenta y actualizamos todo el software necesario. Es la solución ideal si sentís que Windows tarda mucho en arrancar o los programas se tildan.',
    icon: <Gauge className="w-6 h-6 text-lime-300" />,
    image: '/services/optimizacion.webp',
    color: 'from-lime-400 to-emerald-600'
  },
  {
    id: 4,
    title: 'Upgrades & Mejoras',
    desc: 'Potenciación de tu PC sin gastar de más.',
    fullDesc:
      'No siempre hace falta comprar una PC nueva para ir más rápido. Te ayudamos a potenciar la que ya tenés: instalamos discos más veloces, agregamos memoria o mejoramos la placa de video para que puedas trabajar o jugar a otro nivel sin gastar de más.',
    icon: <ArrowUpCircle className="w-6 h-6 text-sky-300" />,
    image: '/services/upgrade.webp',
    color: 'from-sky-400 to-cyan-600'
  },
  {
    id: 5,
    title: 'Recuperación de Datos',
    desc: 'Rescate de archivos y respaldo preventivo.',
    fullDesc:
      '¿Borraste algo sin querer o tu disco dejó de funcionar? Hacemos todo lo posible para rescatar tus fotos, documentos de estudio o archivos de trabajo importantes. Además, te enseñamos cómo hacer copias de seguridad automáticas para que tu información esté siempre protegida.',
    icon: <Database className="w-6 h-6 text-emerald-300" />,
    image: '/services/recupero.webp',
    color: 'from-emerald-400 to-teal-600'
  }
];
