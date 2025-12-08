import React from 'react';
import { Droppable, Draggable, DroppableProvided } from '@hello-pangea/dnd';
import type { KanbanCard as KanbanCardType, KanbanColumn as KanbanColumnType } from './Kanban.types';
import { KanbanCard } from './KanbanCard';

export const KanbanColumn: React.FC<{
  column: KanbanColumnType;
  index: number;
}>
= ({ column, index }) => {
  return (
    <div
      className="flex flex-col h-full"
      style={{
        minWidth: 200,
        maxWidth: 280,
        padding: 'var(--space-2)',
        paddingTop: 0,
        background: 'var(--bg-primary)',
        borderLeft: index > 0 ? '1px solid var(--border-color-light)' : undefined,
      }}
    >
      <div className="sticky top-0 z-[1] bg-transparent pt-2 pb-2">
        <div className="flex items-center justify-between">
          <div
            className="text-sm font-medium"
            style={{ color: 'var(--font-color-primary)' }}
          >
            {column.title}
          </div>
          <div
            className="text-xs px-2 py-[2px] rounded-full"
            style={{
              color: 'var(--font-color-secondary)',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color-light)',
            }}
          >
            {column.items.length}
          </div>
        </div>
      </div>

      <Droppable droppableId={column.id}>
        {(dp: DroppableProvided) => (
          <div ref={dp.innerRef} {...dp.droppableProps} className="flex-1 flex flex-col">
            {column.items.map((card: KanbanCardType, i: number) => (
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

      <div className="pt-4 pb-8">
        <button
          className="w-full text-xs px-2 py-1 rounded"
          style={{
            color: 'var(--font-color-secondary)',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color-light)',
            transition: 'var(--clickable-bg-transition)',
          }}
          onClick={() => {
            /* Host app should handle new record creation */
          }}
        >
          + Nuevo
        </button>
      </div>
    </div>
  );
};
