import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatPrice = (price: number): string => {
  // Convertimos el precio a string con 2 decimales
  const priceStr = price.toFixed(2);
  
  // Separamos la parte entera y decimal
  const [integerPart, decimalPart] = priceStr.split('.');
  
  // Agregamos los puntos como separadores de miles
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  
  // Si los decimales son .00, no los incluimos
  if (decimalPart === '00') {
    return `$${formattedInteger}`;
  }
  
  // Si no, incluimos los decimales
  return `$${formattedInteger},${decimalPart}`;
}
