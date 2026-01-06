import { useState, useEffect } from 'react';
import TodoItem from './components/TodoItem';
import DownloadModal from './components/DownloadModal';
import './App.css';

// Simple UUID generator helper
const generateUUID = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

function App() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('todo-tasks');
    return saved ? JSON.parse(saved) : [];
  });
  const [inputValue, setInputValue] = useState('');
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('todo-tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!inputValue.trim()) return;
    const newTask = {
      id: generateUUID(),
      text: inputValue,
      completed: false,
      createdAt: Date.now()
    };
    setTasks([newTask, ...tasks]);
    setInputValue('');
  };

  const toggleComplete = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const editTask = (id, newText) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, text: newText } : task
    ));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') addTask();
  };

  const handleExport = (filename) => {
    const csvContent = "data:text/csv;charset=utf-8,"
      + "Status,Task\n"
      + tasks.map(t => `${t.completed ? 'Completed' : 'Pending'},"${t.text.replace(/"/g, '""')}"`).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setIsDownloadModalOpen(false);
  };

  const copyCompletedToClipboard = async () => {
    const completedTasks = tasks.filter(task => task.completed);

    if (completedTasks.length === 0) {
      alert("No completed tasks to copy!");
      return;
    }

    const tableHTML = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office"
            xmlns:x="urn:schemas-microsoft-com:office:excel"
            xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta http-equiv="content-type" content="text/html; charset=utf-8"/>
      </head>
      <body>
        <table style="font-family: Calibri, sans-serif; border-collapse: collapse; width: 100%;">
          <tbody>
            ${completedTasks.map(t => `
              <tr>
                <td style="border: 1px solid #000; padding: 5px;">${t.text}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </body>
      </html>
    `;

    try {
      const blobHtml = new Blob([tableHTML], { type: "text/html" });
      const blobText = new Blob([completedTasks.map(t => t.text).join('\n')], { type: "text/plain" });

      const data = [new ClipboardItem({
        "text/html": blobHtml,
        "text/plain": blobText,
      })];

      await navigator.clipboard.write(data);
      alert("Completed tasks copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy:", err);
      // Fallback for simple text if HTML fails (rare in modern browsers)
      try {
        await navigator.clipboard.writeText(completedTasks.map(t => t.text).join('\n'));
        alert("Copied as plain text (HTML copy failed)!");
      } catch (e) {
        alert("Failed to copy to clipboard.");
      }
    }
  };

  return (
    <div className="app-container">
      <header>
        <h1>To-Do List</h1>
        <p className="subtitle">Stay organized, focused, and get things done.</p>
        <div className="header-actions">
          <button
            className="action-btn"
            onClick={copyCompletedToClipboard}
            title="Copy Completed Tasks to Excel"
            aria-label="Copy Completed Tasks to Excel"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
          </button>
          <button
            className="action-btn"
            onClick={() => setIsDownloadModalOpen(true)}
            title="Download Tasks"
            aria-label="Download Tasks"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
          </button>
        </div>
      </header>

      <div className="input-group">
        <input
          type="text"
          placeholder="Add a new task..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button className="add-btn" onClick={addTask}>
          Add
        </button>
      </div>

      <div className="todo-list">
        {tasks.length > 0 ? (
          tasks.map(task => (
            <TodoItem
              key={task.id}
              task={task}
              toggleComplete={toggleComplete}
              deleteTask={deleteTask}
              editTask={editTask}
            />
          ))
        ) : (
          <div className="empty-state">
            <p>No tasks yet. Add one above!</p>
          </div>
        )}
      </div>
      <DownloadModal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
        onDownload={handleExport}
      />
    </div>
  );
}

export default App;
