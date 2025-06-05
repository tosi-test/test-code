import { useState } from 'react';
import { Button } from './components/ui/button';
import {
  DndContext,
  useDraggable,
  useDroppable,
  DragEndEvent,
} from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

interface Task {
  id: string;
  text: string;
}

interface Column {
  id: string;
  title: string;
  tasks: Task[];
}

const initialBoard: Column[] = [
  { id: 'todo', title: 'To Do', tasks: [ { id: '1', text: 'First task' } ] },
  { id: 'inprogress', title: 'In Progress', tasks: [] },
  { id: 'done', title: 'Done', tasks: [] },
];

function TaskItem({ task, columnId }: { task: Task; columnId: string }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `${columnId}-${task.id}`,
    data: { columnId, taskId: task.id },
  });
  const style = transform
    ? { transform: CSS.Translate.toString(transform) }
    : undefined;
  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      className="cursor-grab rounded bg-white p-2 shadow"
    >
      {task.text}
    </div>
  );
}

function ColumnContainer({
  column,
  children,
}: {
  column: Column;
  children: React.ReactNode;
}) {
  const { setNodeRef } = useDroppable({ id: column.id });
  return (
    <div ref={setNodeRef} className="flex-1 rounded border bg-gray-50 p-2">
      {children}
    </div>
  );
}

export default function App() {
  const [board, setBoard] = useState<Column[]>(initialBoard);
  const [newTaskId, setNewTaskId] = useState(2);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    const sourceColumnId = active.data.current?.columnId as string | undefined;
    const taskId = active.data.current?.taskId as string | undefined;
    const targetColumnId = over.id as string;
    if (!sourceColumnId || !taskId) return;
    if (sourceColumnId === targetColumnId) return;

    setBoard((prev) => {
      const sourceColumn = prev.find((c) => c.id === sourceColumnId);
      const targetColumn = prev.find((c) => c.id === targetColumnId);
      if (!sourceColumn || !targetColumn) return prev;

      const taskIndex = sourceColumn.tasks.findIndex((t) => t.id === taskId);
      if (taskIndex === -1) return prev;

      const [task] = sourceColumn.tasks.splice(taskIndex, 1);
      targetColumn.tasks.push(task);
      return [...prev];
    });
  };

  const addTask = () => {
    setBoard((prev) => {
      const todo = prev.find((c) => c.id === 'todo');
      if (!todo) return prev;
      todo.tasks.push({ id: String(newTaskId), text: `Task ${newTaskId}` });
      return [...prev];
    });
    setNewTaskId((id) => id + 1);
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="flex gap-4 p-4">
        {board.map((column) => (
          <ColumnContainer key={column.id} column={column}>
            <h2 className="mb-2 text-lg font-bold">{column.title}</h2>
            <div className="space-y-2">
              {column.tasks.map((task) => (
                <TaskItem key={task.id} task={task} columnId={column.id} />
              ))}
              {column.id === 'todo' && (
                <Button onClick={addTask} className="w-full">
                  Add Task
                </Button>
              )}
            </div>
          </ColumnContainer>
        ))}
      </div>
    </DndContext>
  );
}
