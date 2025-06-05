import { useState } from 'react';
import { Button } from './components/ui/button';

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

export default function App() {
  const [board, setBoard] = useState<Column[]>(initialBoard);
  const [newTaskId, setNewTaskId] = useState(2);

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    columnId: string,
    taskId: string
  ) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({ columnId, taskId }));
  };

  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    targetColumnId: string
  ) => {
    e.preventDefault();
    const data = JSON.parse(e.dataTransfer.getData('text/plain')) as {
      columnId: string;
      taskId: string;
    };
    if (!data) return;
    setBoard((prev) => {
      const sourceColumn = prev.find((c) => c.id === data.columnId);
      const targetColumn = prev.find((c) => c.id === targetColumnId);
      if (!sourceColumn || !targetColumn) return prev;

      const taskIndex = sourceColumn.tasks.findIndex((t) => t.id === data.taskId);
      if (taskIndex === -1) return prev;

      const [task] = sourceColumn.tasks.splice(taskIndex, 1);
      targetColumn.tasks.push(task);
      return [...prev];
    });
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
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
    <div className="flex gap-4 p-4">
      {board.map((column) => (
        <div
          key={column.id}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, column.id)}
          className="flex-1 rounded border bg-gray-50 p-2"
        >
          <h2 className="mb-2 text-lg font-bold">{column.title}</h2>
          <div className="space-y-2">
            {column.tasks.map((task) => (
              <div
                key={task.id}
                draggable
                onDragStart={(e) => handleDragStart(e, column.id, task.id)}
                className="cursor-grab rounded bg-white p-2 shadow"
              >
                {task.text}
              </div>
            ))}
            {column.id === 'todo' && (
              <Button onClick={addTask} className="w-full">Add Task</Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
