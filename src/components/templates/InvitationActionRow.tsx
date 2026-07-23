'use client';
import React from 'react';
import { Calendar, MapPin, Camera, Loader2 } from 'lucide-react';

interface InvitationActionRowProps {
  primaryColor: string;
  textColor: string;
  textIsLight: boolean;
  showRsvp?: boolean;
  showPhotos?: boolean;
  showLocation?: boolean;
  showCalendar?: boolean;
  onRsvpClick: () => void;
  onMapClick: () => void;
  onCalendarClick: () => void;
  onPhotoUpload: (file: File) => void;
  isUploading?: boolean;
  weddingDate?: string;
  brideName?: string;
  groomName?: string;
  eventTitle?: string;
  venueName?: string;
  venueAddress?: string;
  googleMapsUrl?: string;
}

export default function InvitationActionRow({
  primaryColor,
  textColor,
  textIsLight,
  showRsvp = true,
  showPhotos = true,
  showLocation = true,
  showCalendar = true,
  onRsvpClick,
  onMapClick,
  onCalendarClick,
  onPhotoUpload,
  isUploading = false,
}: InvitationActionRowProps) {
  const btnBase = {
    borderColor: `${primaryColor}20`,
    color: primaryColor,
    backgroundColor: textIsLight ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.85)',
  };
  const labelStyle = { color: textColor };

  const activeButtons = [
    showCalendar,
    showLocation,
    showRsvp,
    showPhotos,
  ].filter(Boolean).length;

  const gridClass = activeButtons <= 2
    ? 'grid-cols-2'
    : activeButtons === 3
    ? 'grid-cols-3'
    : 'grid grid-cols-4 min-[340px]:grid-cols-4 grid-cols-2';

  return (
    <div
      data-testid="invitation-action-row"
      className={`grid ${activeButtons >= 4 ? 'grid-cols-2 min-[360px]:grid-cols-4' : activeButtons === 3 ? 'grid-cols-3' : 'grid-cols-2'} gap-2 w-full mt-8 mb-4 relative z-10`}
    >
      {showCalendar && (
        <button
          onClick={onCalendarClick}
          className="flex flex-col items-center gap-1.5 group transition-transform active:scale-95 cursor-pointer min-h-[44px]"
          aria-label="Takvime Ekle"
        >
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center border shadow-sm transition-all group-hover:scale-105"
            style={btnBase}
          >
            <Calendar className="w-5 h-5" />
          </div>
          <span className="text-[9px] font-bold tracking-wider uppercase opacity-80" style={labelStyle}>
            Takvim
          </span>
        </button>
      )}

      {showLocation && (
        <button
          onClick={onMapClick}
          className="flex flex-col items-center gap-1.5 group transition-transform active:scale-95 cursor-pointer min-h-[44px]"
          aria-label="Konuma Git"
        >
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center border shadow-sm transition-all group-hover:scale-105"
            style={btnBase}
          >
            <MapPin className="w-5 h-5" />
          </div>
          <span className="text-[9px] font-bold tracking-wider uppercase opacity-80" style={labelStyle}>
            Konum
          </span>
        </button>
      )}

      {showRsvp && (
        <button
          onClick={onRsvpClick}
          className="flex flex-col items-center gap-1.5 group transition-transform active:scale-95 cursor-pointer min-h-[44px]"
          aria-label="Katılım Bildir"
        >
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm transition-all group-hover:scale-105 text-white"
            style={{ backgroundColor: primaryColor }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span className="text-[9px] font-bold tracking-wider uppercase opacity-80" style={labelStyle}>
            LCV
          </span>
        </button>
      )}

      {showPhotos && (
        <div className="flex flex-col items-center gap-1.5 min-h-[44px]">
          <input
            type="file"
            accept="image/*"
            id="action-row-photo-upload"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onPhotoUpload(file);
            }}
            disabled={isUploading}
          />
          <label
            htmlFor="action-row-photo-upload"
            className="flex flex-col items-center gap-1.5 cursor-pointer group transition-transform active:scale-95"
          >
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center border shadow-sm transition-all group-hover:scale-105"
              style={btnBase}
            >
              {isUploading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Camera className="w-5 h-5" />
              )}
            </div>
            <span className="text-[9px] font-bold tracking-wider uppercase opacity-80" style={labelStyle}>
              Fotoğraf
            </span>
          </label>
        </div>
      )}
    </div>
  );
}
