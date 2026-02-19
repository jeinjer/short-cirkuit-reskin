import React from 'react';
import { MessageCircle, ArrowUpRight } from 'lucide-react';

const SALES_PHONE = import.meta.env.VITE_WHATSAPP_SALES_PHONE || '5493541536165';
const SUPPORT_PHONE = import.meta.env.VITE_WHATSAPP_SUPPORT_PHONE || '5493541536165';
const SALES_PHONE_LABEL = import.meta.env.VITE_WHATSAPP_SALES_PHONE_LABEL || '+54 9 3541 53-6165';
const SUPPORT_PHONE_LABEL = import.meta.env.VITE_WHATSAPP_SUPPORT_PHONE_LABEL || '+54 9 3541 53-6165';
const LINKEDIN_URL = import.meta.env.VITE_LINKEDIN_URL || 'https://www.linkedin.com/in/stefanotommasi15/';

export default function Footer() {
  const whatsappContacts = [
    { label: 'WhatsApp 1', phoneDigits: SALES_PHONE, phoneDisplay: SALES_PHONE_LABEL },
    { label: 'WhatsApp 2', phoneDigits: SUPPORT_PHONE, phoneDisplay: SUPPORT_PHONE_LABEL }
  ];

  return (
    <footer className="relative mt-0 border-t border-cyan-500/15 bg-[#040406]">
      <div className="container mx-auto px-4 py-6 sm:py-10">
        <div className="grid gap-5 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_0.9fr] lg:items-start">
          <div className="text-center sm:text-left">
            <p className="font-cyber text-lg sm:text-2xl text-white tracking-wider">SHORT <span className="text-cyan-400">CIRKUIT</span></p>
            <p className="mt-2 sm:mt-3 max-w-md text-xs sm:text-sm text-gray-600 mx-auto sm:mx-0">
              Gob. Loza 1724, Villa Carlos Paz, Cordoba, Argentina.
            </p>
          </div>

          <div>
            <p className="text-[11px] sm:text-xs uppercase tracking-[0.14em] sm:tracking-[0.18em] text-cyan-300/90 text-center sm:text-left">Contacto WhatsApp</p>
            <div className="mt-3 sm:mt-4 grid grid-cols-2 sm:grid-cols-1 gap-2 sm:gap-3">
              {whatsappContacts.map((contact) => (
                <a
                  key={`${contact.label}-${contact.phoneDigits}`}
                  href={`https://wa.me/${contact.phoneDigits}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-2.5 sm:px-3 py-2 sm:py-2.5 transition-colors hover:border-cyan-400/40 hover:bg-cyan-500/10"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <MessageCircle size={14} className="text-cyan-300 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase tracking-wide text-gray-400">{contact.label}</p>
                      <p className="text-xs sm:text-sm font-semibold text-white truncate">{contact.phoneDisplay}</p>
                    </div>
                  </div>
                  <ArrowUpRight size={13} className="text-cyan-300 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 shrink-0" />
                </a>
              ))}
            </div>
          </div>

          <div className="sm:col-span-2 lg:col-span-1 text-center lg:text-right pt-1">
            <p className="text-[11px] sm:text-xs uppercase tracking-[0.14em] sm:tracking-[0.18em] text-gray-600">Creditos</p>
            <p className="mt-2 sm:mt-3 text-[10px] sm:text-[11px] uppercase tracking-wider text-gray-500">Desarrollo web</p>
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-flex items-center gap-1.5 text-xs sm:text-sm text-gray-300 underline decoration-cyan-400/60 decoration-2 underline-offset-4 transition-colors hover:text-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 rounded-sm break-all lg:break-normal"
              aria-label="Ir al LinkedIn de Stefano Tommasi"
              title="Ir a LinkedIn"
            >
              Stefano Tommasi
              <ArrowUpRight size={13} />
            </a>
          </div>
        </div>

        <div className="mt-5 sm:mt-8 border-t border-white/10 pt-3 sm:pt-4 text-center text-[11px] sm:text-xs text-gray-500">
          &copy; {new Date().getFullYear()} Short Cirkuit. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
