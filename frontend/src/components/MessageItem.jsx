import React, { useState, useRef, useEffect } from 'react';

const MessageItem = ({ message, onEditMessage, onDeleteMessage }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(message.contenido);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (content.trim()) {
        onEditMessage(message.id, content);
      }
      setIsEditing(false);
    } else if (e.key === 'Escape') {
      setContent(message.contenido);
      setIsEditing(false);
    } else if (e.key === 'Backspace' && content === '') {
      e.preventDefault();
      onDeleteMessage(message.id);
    }
  };

  const handleBlur = () => {
    if (content.trim()) {
      onEditMessage(message.id, content);
    }
    setIsEditing(false);
  };

  return (
    <div 
      className="group min-h-[24px] px-2 hover:bg-gray-50 flex items-center"
      onClick={() => setIsEditing(true)}
    >
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          className="w-full bg-transparent outline-none py-1"
          placeholder="Type something..."
        />
      ) : (
        <div className="w-full py-1 cursor-text">
          {content || <span className="text-gray-400">Type something...</span>}
        </div>
      )}
    </div>
  );
};

export default MessageItem;