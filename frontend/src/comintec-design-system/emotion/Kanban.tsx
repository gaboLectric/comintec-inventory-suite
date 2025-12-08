import React, { useState } from 'react';
import styled from '@emotion/styled';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { KanbanColumn as Column, type EmotionKanbanColumn } from './KanbanColumn';

function reorder<T>(list: T[], startIndex: number, endIndex: number): T[] {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
}

function move(
  source: EmotionKanbanColumn,
  destination: EmotionKanbanColumn,
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

const BoardContainer = styled.div({ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' });
const Header = styled.div(({ theme }) => ({ position: 'sticky', top: 0, zIndex: 2, background: theme.background.primary }));
const Columns = styled.div({ display: 'flex', minHeight: '100%', position: 'relative' });

export const Kanban: React.FC<{ initial: { columns: EmotionKanbanColumn[] } }>
= ({ initial }) => {
  const [columns, setColumns] = useState<EmotionKanbanColumn[]>(initial.columns);

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceColumn = columns.find((c) => c.id === source.droppableId);
    const destColumn = columns.find((c) => c.id === destination.droppableId);
    if (!sourceColumn || !destColumn) return;

    if (sourceColumn === destColumn) {
      const columnIndex = columns.indexOf(sourceColumn);
      const updated = reorder(sourceColumn.items, source.index, destination.index);
      const next = [...columns];
      next[columnIndex] = { ...sourceColumn, items: updated };
      setColumns(next);
    } else {
      const moved = move(sourceColumn, destColumn, source.index, destination.index);
      const next = columns.map((c) =>
        c.id === sourceColumn.id ? { ...c, items: moved[sourceColumn.id] } :
        c.id === destColumn.id ? { ...c, items: moved[destColumn.id] } : c,
      );
      setColumns(next);
    }
  };

  return (
    <BoardContainer>
      <Header>
        <div style={{ padding: '8px', color: 'var(--font-color-secondary)', fontSize: 'var(--font-size-sm)' }}>Kanban</div>
      </Header>
      <div style={{ flex: 1, overflow: 'auto', position: 'relative' }}>
        <DragDropContext onDragEnd={onDragEnd}>
          <Columns>
            {columns.map((col, i) => (
              <Column key={col.id} column={col} index={i} />
            ))}
          </Columns>
        </DragDropContext>
      </div>
    </BoardContainer>
  );
};
