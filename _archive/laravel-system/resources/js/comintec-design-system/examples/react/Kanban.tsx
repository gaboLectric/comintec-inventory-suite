import React, { useState } from 'react';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import type { KanbanBoardState, KanbanColumn } from './Kanban.types';
import { KanbanColumn as Column } from './KanbanColumn';

function reorder<T>(list: T[], startIndex: number, endIndex: number): T[] {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
}

function move(
  source: KanbanColumn,
  destination: KanbanColumn,
  droppableSourceIndex: number,
  droppableDestinationIndex: number,
) {
  const sourceClone = Array.from(source.items);
  const destClone = Array.from(destination.items);
  const [removed] = sourceClone.splice(droppableSourceIndex, 1);
  destClone.splice(droppableDestinationIndex, 0, removed);
  return {
    [source.id]: sourceClone,
    [destination.id]: destClone,
  } as Record<string, typeof source.items>;
}

export const Kanban: React.FC<{
  initial: KanbanBoardState;
}>
= ({ initial }) => {
  const [state, setState] = useState<KanbanBoardState>(initial);

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceColumn = state.columns.find((c) => c.id === source.droppableId);
    const destColumn = state.columns.find((c) => c.id === destination.droppableId);
    if (!sourceColumn || !destColumn) return;

    if (sourceColumn === destColumn) {
      const columnIndex = state.columns.indexOf(sourceColumn);
      const updated = reorder(sourceColumn.items, source.index, destination.index);
      const next = [...state.columns];
      next[columnIndex] = { ...sourceColumn, items: updated };
      setState({ columns: next });
    } else {
      const moved = move(sourceColumn, destColumn, source.index, destination.index);
      const next = state.columns.map((c) =>
        c.id === sourceColumn.id ? { ...c, items: moved[sourceColumn.id] } :
        c.id === destColumn.id ? { ...c, items: moved[destColumn.id] } : c,
      );
      setState({ columns: next });
    }
  };

  return (
    <div className="relative flex flex-col h-full">
      <div className="sticky top-0 z-[2]" style={{ background: 'var(--bg-primary)' }}>
        {/* Header placeholder (filters, search, aggregates) */}
        <div className="px-2 py-2 text-sm" style={{ color: 'var(--font-color-secondary)' }}>
          Kanban
        </div>
      </div>
      <div className="flex-1 overflow-auto" style={{ position: 'relative' }}>
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex" style={{ minHeight: '100%', position: 'relative' }}>
            {state.columns.map((col, i) => (
              <Column key={col.id} column={col} index={i} />
            ))}
          </div>
        </DragDropContext>
      </div>
    </div>
  );
};
