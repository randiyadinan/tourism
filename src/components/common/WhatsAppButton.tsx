import React from 'react';
import { useLocation } from 'react-router-dom';
import { getWhatsAppChatUrl, WHATSAPP_MESSAGES } from '../../config/whatsapp';

/**
 * Official SVG WhatsApp Icon
 */
export const WhatsAppIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.888 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

interface WhatsAppButtonProps {
  message?: string;
  className?: string;
  variant?: 'floating' | 'button' | 'card';
  label?: string;
}

/**
 * Reusable WhatsApp Contact Button
 */
export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  message,
  className = '',
  variant = 'button',
  label = 'Chat on WhatsApp'
}) => {
  const chatUrl = getWhatsAppChatUrl(message);

  if (variant === 'card') {
    return (
      <a
        href={chatUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Start WhatsApp conversation with LankaVoyage Concierge"
        className={`flex items-center gap-3.5 p-4 rounded-2xl bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 text-[#0B3D2E] transition-all group ${className}`}
      >
        <div className="w-10 h-10 rounded-xl bg-[#25D366] text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform shrink-0">
          <WhatsAppIcon className="w-5 h-5 fill-white" />
        </div>
        <div className="flex-1 min-w-0">
          <span className="font-bold text-xs sm:text-sm text-[#062C22] block truncate">WhatsApp Direct Chat</span>
          <span className="text-[11px] text-[#176B52] block truncate">Instant response & custom proposal</span>
        </div>
      </a>
    );
  }

  return (
    <a
      href={chatUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with LankaVoyage Concierge on WhatsApp"
      className={`inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all ${className}`}
    >
      <WhatsAppIcon className="w-4 h-4 fill-white" />
      <span>{label}</span>
    </a>
  );
};

/**
 * Floating WhatsApp Contact Button across all public pages
 */
export const FloatingWhatsAppButton: React.FC = () => {
  const location = useLocation();
  const pathname = location.pathname;

  // Don't render inside Admin portal to prevent obstructing table actions
  if (pathname.startsWith('/admin')) {
    return null;
  }

  // Determine smart pre-filled message based on active route
  let smartMessage = WHATSAPP_MESSAGES.general;
  if (pathname.startsWith('/transfers')) {
    smartMessage = WHATSAPP_MESSAGES.transfers;
  } else if (pathname.startsWith('/contact')) {
    smartMessage = WHATSAPP_MESSAGES.contact;
  } else if (pathname.startsWith('/tours/')) {
    const tourSlug = pathname.replace('/tours/', '').replace(/-/g, ' ');
    smartMessage = WHATSAPP_MESSAGES.tour(tourSlug.toUpperCase());
  } else if (pathname.startsWith('/destinations/')) {
    const destSlug = pathname.replace('/destinations/', '').replace(/-/g, ' ');
    smartMessage = WHATSAPP_MESSAGES.destination(destSlug.toUpperCase());
  }

  const chatUrl = getWhatsAppChatUrl(smartMessage);

  return (
    <aside aria-label="WhatsApp quick chat" className="fixed bottom-6 right-6 z-40 flex items-center group">
      {/* Accessible Hover / Focus Tooltip */}
      <div 
        role="tooltip"
        className="mr-3 px-3.5 py-1.5 rounded-full bg-[#062C22] text-white text-xs font-semibold shadow-lg hidden md:flex items-center gap-1.5 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap border border-white/10"
      >
        <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
        <span>Chat with us on WhatsApp</span>
      </div>

      {/* Floating Action Button */}
      <a
        href={chatUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with LankaVoyage 24/7 Concierge on WhatsApp (Opens in new tab)"
        className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white flex items-center justify-center shadow-[0_8px_25px_-4px_rgba(37,211,102,0.6)] hover:scale-105 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-[#25D366]/40"
      >
        <WhatsAppIcon className="w-7 h-7 fill-white drop-shadow-sm" />
      </a>
    </aside>
  );
};
