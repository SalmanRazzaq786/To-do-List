import { useState } from 'react';

function TodoItem({ task, toggleComplete, deleteTask, editTask }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(task.text);

  const handleSave = () => {
    if (editedText.trim()) {
      editTask(task.id, editedText);
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    }
  };

  return (
    <div className={`todo-item ${task.completed ? 'completed' : ''}`}>
      <div className="todo-content">
        <div 
          className="checkbox" 
          onClick={() => toggleComplete(task.id)}
        >
          {task.completed && <span>&#10003;</span>}
        </div>
        
        {isEditing ? (
          <input
            type="text"
            className="edit-input"
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            autoFocus
          />
        ) : (
          <span className="task-text" onClick={() => toggleComplete(task.id)}>
            {task.text}
          </span>
        )}
      </div>

      <div className="actions">
        <button 
          className="icon-btn edit-btn" 
          onClick={() => setIsEditing(!isEditing)}
          aria-label="Edit task"
        >
          &#9998;
        </button>
        <button 
          className="icon-btn delete-btn" 
          onClick={() => deleteTask(task.id)}
          aria-label="Delete task"
        >
          &times;
        </button>
      </div>
    </div>
  );
}

export default TodoItem;
