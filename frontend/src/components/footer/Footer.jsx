import React from 'react';
import { MessageCircle, ArrowUpRight } from 'lucide-react';

const SALES_PHONE = import.meta.env.VITE_WHATSAPP_SALES_PHONE;
const SUPPORT_PHONE = import.meta.env.VITE_WHATSAPP_SUPPORT_PHONE;
const SALES_PHONE_LABEL = import.meta.env.VITE_WHATSAPP_SALES_PHONE_LABEL;
const SUPPORT_PHONE_LABEL = import.meta.env.VITE_WHATSAPP_SUPPORT_PHONE_LABEL;
const LINKEDIN_URL = import.meta.env.VITE_LINKEDIN_URL;

export default function Footer() {
  const whatsappContacts = [
    { label: 'WhatsApp 1', phoneDigits: SALES_PHONE, phoneDisplay: SALES_PHONE_LABEL },
    { label: 'WhatsApp 2', phoneDigits: SUPPORT_PHONE, phoneDisplay: SUPPORT_PHONE_LABEL }
  ];

  return (
    <footer className="relative mt-20 border-t border-cyan-500/20 bg-black">
      <div className="container mx-auto px-4 py-10">
        <div className="grid gap-8 md:grid-cols-[1.2fr_1fr_0.9fr] md:items-start">
          <div>
            <p className="font-cyber text-2xl text-white tracking-wider">SHORT <span className="text-cyan-400">CIRKUIT</span></p>
            <p className="mt-3 max-w-md text-sm text-gray-600">
              Gob. Loza 1724, Villa Carlos Paz, Córdoba, Argentina.
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-cyan-300/90">Contacto WhatsApp</p>
            <div className="mt-4 space-y-3">
              {whatsappContacts.map((contact) => (
                <a
                  key={`${contact.label}-${contact.phoneDigits}`}
                  href={`https://wa.me/${contact.phoneDigits}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2 transition-colors hover:border-cyan-400/40 hover:bg-cyan-500/10"
                >
                  <div className="flex items-center gap-2">
                    <MessageCircle size={16} className="text-cyan-300" />
                    <div>
                      <p className="text-[11px] uppercase tracking-wide text-gray-400">{contact.label}</p>
                      <p className="text-sm font-semibold text-white">{contact.phoneDisplay}</p>
                    </div>
                  </div>
                  <ArrowUpRight size={15} className="text-cyan-300 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              ))}
            </div>
          </div>

          <div className="md:text-right">
            <p className="text-xs uppercase tracking-[0.18em] text-gray-600">Créditos</p>
            <p className="mt-3 text-[11px] uppercase tracking-wider text-gray-500">Desarrollo web</p>
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-flex items-center gap-1.5 text-sm text-gray-300 underline decoration-cyan-400/60 decoration-2 underline-offset-4 transition-colors hover:text-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 rounded-sm"
              aria-label="Ir al LinkedIn de Stefano Tommasi"
              title="Ir a LinkedIn"
            >
              Stefano Tommasi
              <ArrowUpRight size={13} />
            </a>
          </div>
        </div>

        <div className="mt-8 border-t border-white/10 pt-4 text-center text-xs text-gray-500">
          &copy; {new Date().getFullYear()} Short Cirkuit. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
