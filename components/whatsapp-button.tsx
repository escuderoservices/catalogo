'use client';

import { FaWhatsapp } from 'react-icons/fa';

export function WhatsAppButton() {
  const phoneNumber = '59891284128'; // Número de WhatsApp actualizado
  const message = 'Hola Pablo, tengo una duda sobre el catalogo';

  const handleClick = () => {
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 flex items-center justify-center"
      aria-label="Contactar por WhatsApp"
    >
      <FaWhatsapp className="w-8 h-8" />
    </button>
  );
} 