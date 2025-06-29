
import React from 'react';

interface QRCodeProps {
  url: string;
  label: string;
  className?: string;
}

export const QRCode: React.FC<QRCodeProps> = ({ url, label, className = '' }) => {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="border border-gray-300 rounded bg-white p-1 w-12 h-12 flex items-center justify-center">
        {/* Simulation simplifiée d'un QR code */}
        <div className="grid grid-cols-4 grid-rows-4 gap-0.5 w-10 h-10">
          {Array.from({ length: 16 }).map((_, i) => (
            <div 
              key={i} 
              className={`${Math.random() > 0.6 ? 'bg-black' : 'bg-white'} ${
                (i === 0 || i === 3 || i === 12 || i === 15) ? 'bg-black' : ''
              }`}
            />
          ))}
        </div>
      </div>
      <span className="text-xs mt-1">{label}</span>
    </div>
  );
};
