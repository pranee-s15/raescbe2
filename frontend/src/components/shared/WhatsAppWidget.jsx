const WHATSAPP_NUMBER = '919363126467';
const WHATSAPP_MESSAGE = encodeURIComponent("Hello Raes Boutique, I'd like to know more about your collections.");

const WhatsAppWidget = () => (
  <a
    href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`}
    target="_blank"
    rel="noreferrer"
    aria-label="Chat on WhatsApp"
    className="fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-full bg-[#25D366] px-4 py-3 text-white shadow-[0_18px_38px_rgba(37,211,102,0.32)] transition hover:scale-[1.03] hover:shadow-[0_22px_46px_rgba(37,211,102,0.38)]"
  >
    <span className="hidden text-sm font-medium md:block">WhatsApp</span>
    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/14">
      <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
        <path d="M19.05 4.94A9.9 9.9 0 0 0 12.03 2c-5.5 0-9.97 4.47-9.97 9.98 0 1.76.46 3.48 1.34 5l-1.42 5.2 5.32-1.4a9.93 9.93 0 0 0 4.74 1.21h.01c5.5 0 9.97-4.48 9.97-9.98 0-2.66-1.04-5.16-2.97-7.07ZM12.04 20.3h-.01a8.26 8.26 0 0 1-4.2-1.15l-.3-.18-3.16.83.84-3.08-.2-.31a8.24 8.24 0 0 1-1.27-4.4c0-4.56 3.72-8.28 8.3-8.28 2.2 0 4.28.86 5.84 2.43a8.2 8.2 0 0 1 2.43 5.84c0 4.56-3.72 8.28-8.27 8.28Zm4.54-6.2c-.25-.12-1.47-.73-1.7-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.79.98-.15.17-.3.19-.55.06-.25-.12-1.06-.39-2.01-1.24-.74-.66-1.24-1.47-1.39-1.72-.15-.25-.02-.38.11-.5.11-.11.25-.3.37-.45.12-.15.17-.25.25-.41.08-.17.04-.31-.02-.44-.06-.12-.56-1.35-.77-1.85-.2-.47-.4-.41-.56-.42h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1s.9 2.44 1.02 2.61c.12.17 1.76 2.68 4.25 3.76.59.26 1.06.41 1.42.53.6.19 1.15.16 1.59.1.49-.07 1.47-.6 1.68-1.19.21-.59.21-1.09.15-1.19-.06-.1-.23-.17-.48-.29Z" />
      </svg>
    </span>
  </a>
);

export default WhatsAppWidget;
