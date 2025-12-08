export type KanbanCard = {
  id: string;
  title: string;
  subtitle?: string;
  meta?: string;
};

export type KanbanColumn = {
  id: string;
  title: string;
  items: KanbanCard[];
};

export type KanbanBoardState = {
  columns: KanbanColumn[];
};
