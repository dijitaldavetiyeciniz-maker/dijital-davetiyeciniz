import React from 'react';

type InvitationCardProps = {
  brideName?: string;
  groomName?: string;
  eventDate?: string;
};

export function InvitationCard({ brideName, groomName, eventDate }: InvitationCardProps) {
  return (
    <div className="invitation-card">
      <div className="invitation-inner">
        <p className="invitation-small">Together with their families</p>
        <h1>
          {brideName || "Elif"} <span>&</span> {groomName || "Kerem"}
        </h1>
        <p className="invitation-date">
          {eventDate || "12.09.2026"}
        </p>
      </div>
    </div>
  );
}
