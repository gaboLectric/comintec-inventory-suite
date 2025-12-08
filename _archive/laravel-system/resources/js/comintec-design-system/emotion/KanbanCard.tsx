import React from 'react';
import styled from '@emotion/styled';

export type EmotionKanbanCard = {
  id: string;
  title: string;
  subtitle?: string;
  meta?: string;
};

const StyledCard = styled.div<{ dragging?: boolean }>(({ theme, dragging }) => ({
  width: '100%',
  marginBottom: '8px',
  background: theme.background.secondary,
  border: `1px solid ${theme.background.quaternary}`,
  borderRadius: 'var(--radius-md)',
  boxShadow:
    '0px 4px 8px 0px rgba(0, 0, 0, 0.08), 0px 0px 4px 0px rgba(0, 0, 0, 0.08)',
  position: 'relative',
  transform: dragging ? 'scale(1.02)' : undefined,
  zIndex: dragging ? 10 : undefined,
}));

const StyledTitle = styled.div(({ theme }) => ({
  color: theme.font.color.primary,
  fontSize: 'var(--font-size-sm)',
  fontWeight: 500,
}));

const StyledSubtitle = styled.div(({ theme }) => ({
  color: theme.font.color.secondary,
  fontSize: 'var(--font-size-xs)',
}));

const StyledMeta = styled.div(({ theme }) => ({
  color: theme.font.color.extraLight,
  fontSize: '11px',
}));

export const KanbanCard: React.FC<{ card: EmotionKanbanCard; dragging?: boolean }>
= ({ card, dragging }) => (
  <StyledCard dragging={dragging}>
    <div style={{ padding: '0 8px', paddingTop: 8 }}>
      <StyledTitle>{card.title}</StyledTitle>
      {card.subtitle && <StyledSubtitle>{card.subtitle}</StyledSubtitle>}
    </div>
    {card.meta && (
      <div style={{ padding: '0 8px', paddingBottom: 8, paddingTop: 4 }}>
        <StyledMeta>{card.meta}</StyledMeta>
      </div>
    )}
  </StyledCard>
);
