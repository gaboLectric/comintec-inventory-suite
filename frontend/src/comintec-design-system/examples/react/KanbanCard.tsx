import React from 'react';
import type { KanbanCard as KanbanCardType } from './Kanban.types';

export const KanbanCard: React.FC<{ card: KanbanCardType; dragging?: boolean }>
= ({ card, dragging }) => {
  return (
    <div
      className={[
        'w-full mb-2',
        'transition-transform',
        dragging ? 'scale-[1.02] z-10' : '',
      ].join(' ')}
      style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--bg-quaternary)',
        borderRadius: 'var(--radius-md)',
        boxShadow:
          '0px 4px 8px 0px rgba(0,0,0,0.08), 0px 0px 4px 0px rgba(0,0,0,0.08)',
      }}
    >
      <div className="px-2 pt-2">
        <div
          className="text-sm font-medium"
          style={{ color: 'var(--font-color-primary)' }}
        >
          {card.title}
        </div>
        {card.subtitle && (
          <div
            className="text-xs"
            style={{ color: 'var(--font-color-secondary)' }}
          >
            {card.subtitle}
          </div>
        )}
      </div>
      {card.meta && (
        <div className="px-2 pb-2 pt-1">
          <div
            className="text-[11px]"
            style={{ color: 'var(--font-color-extraLight)' }}
          >
            {card.meta}
          </div>
        </div>
      )}
    </div>
  );
};
