/**
 * =========================================================================
 * LankaVoyage Official WhatsApp Business Configuration
 * =========================================================================
 * 
 * TO UPDATE THE CLIENT WHATSAPP NUMBER:
 * Change the value of WHATSAPP_BUSINESS_NUMBER below (or configure VITE_WHATSAPP_NUMBER in .env).
 * Format: Country code + phone number without '+' or leading zeros (e.g. '94771234567').
 */
export const WHATSAPP_BUSINESS_NUMBER = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_WHATSAPP_NUMBER) || '94770000000'; // PLACEHOLDER: Replace with client's real WhatsApp number

export const WHATSAPP_MESSAGES = {
  general: 'Hello LankaVoyage, I would like to know more about your Sri Lanka travel packages.',
  contact: 'Hello LankaVoyage, I would like to contact your travel team.',
  tour: (tourTitle: string) => `Hello LankaVoyage, I am interested in the ${tourTitle} tour. Could you please provide more details?`,
  destination: (destinationName: string) => `Hello LankaVoyage, I would like to know more about travelling to ${destinationName}.`,
  transfers: 'Hello LankaVoyage, I would like to inquire about private airport transfers and chauffeur services.'
};

/**
 * Builds the official WhatsApp click-to-chat URL
 * Format: https://wa.me/<PHONE_NUMBER>?text=<ENCODED_MESSAGE>
 */
export function getWhatsAppChatUrl(message?: string, phoneNumber?: string): string {
  const phone = (phoneNumber || WHATSAPP_BUSINESS_NUMBER).replace(/[^0-9]/g, '');
  const text = message || WHATSAPP_MESSAGES.general;
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}
