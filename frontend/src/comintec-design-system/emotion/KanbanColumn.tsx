import React from 'react';
import styled from '@emotion/styled';
import { Droppable, Draggable, DroppableProvided } from '@hello-pangea/dnd';
import { KanbanCard, type EmotionKanbanCard } from './KanbanCard';

export type EmotionKanbanColumn = {
  id: string;
  title: string;
  items: EmotionKanbanCard[];
};

const StyledColumn = styled.div<{ hasLeftBorder?: boolean }>(({ theme, hasLeftBorder }) => ({
  display: 'flex',
  flexDirection: 'column',
  minWidth: 200,
  maxWidth: 280,
  height: '100%',
  padding: 'var(--space-2)',
  paddingTop: 0,
  background: theme.background.primary,
  borderLeft: hasLeftBorder ? `1px solid ${theme.border.color.light}` : undefined,
}));

const StyledHeader = styled.div({
  position: 'sticky',
  top: 0,
  zIndex: 1,
  background: 'transparent',
  paddingTop: '8px',
  paddingBottom: '8px',
});

const StyledTitle = styled.div(({ theme }) => ({
  color: theme.font.color.primary,
  fontSize: 'var(--font-size-sm)',
  fontWeight: 500,
}));

const StyledCount = styled.div(({ theme }) => ({
  color: theme.font.color.secondary,
  fontSize: 'var(--font-size-xs)',
  padding: '2px 8px',
  borderRadius: 999,
  background: theme.background.secondary,
  border: `1px solid ${theme.border.color.light}`,
}));

const StyledNewButtonContainer = styled.div({ paddingTop: '16px', paddingBottom: '32px' });

export const KanbanColumn: React.FC<{ column: EmotionKanbanColumn; index: number }>
= ({ column, index }) => {
  return (
    <StyledColumn hasLeftBorder={index > 0}>
      <StyledHeader>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <StyledTitle>{column.title}</StyledTitle>
          <StyledCount>{column.items.length}</StyledCount>
        </div>
      </StyledHeader>
      <Droppable droppableId={column.id}>
        {(dp: DroppableProvided) => (
          <div ref={dp.innerRef} {...dp.droppableProps} style={{ display: 'flex', flex: 1, flexDirection: 'column' }}>
            {column.items.map((card, i) => (
              <Draggable key={card.id} draggableId={card.id} index={i}>
                {(draggableProvided, draggableSnapshot) => (
                  <div
                    ref={draggableProvided.innerRef}
                    {...draggableProvided.draggableProps}
                    {...draggableProvided.dragHandleProps}
                  >
                    <KanbanCard card={card} dragging={draggableSnapshot.isDragging} />
                  </div>
                )}
              </Draggable>
            ))}
            {dp.placeholder}
          </div>
        )}
      </Droppable>
      <StyledNewButtonContainer>
        <button
          style={{
            width: '100%',
            fontSize: 'var(--font-size-xs)',
            padding: '4px 8px',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--font-color-secondary)',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color-light)',
            transition: 'var(--clickable-bg-transition)',
          }}
          onClick={() => {}}
        >
          + Nuevo
        </button>
      </StyledNewButtonContainer>
    </StyledColumn>
  );
};
