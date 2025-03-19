import React, { useState, useEffect, useRef } from 'react';
import { Card } from './ui/card';

const MessageItem = ({ 
  message, 
  onEditMessage, 
  onDeleteMessage, 
  onCreateNewMessage,
  isLast
}) => {
  const [content, setContent] = useState(message.contenido);
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleKeyDown = async (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (content.trim() !== message.contenido) {
        await onEditMessage(message.id, content);
      }
      onCreateNewMessage(message.order + 1);
    } else if (e.key === 'Backspace' && content === '') {
      e.preventDefault();
      await onDeleteMessage(message.id);
    }
  };

  return (
    <div 
      className="group min-h-[24px] px-2 hover:bg-gray-50 flex items-center"
      onClick={() => setIsEditing(true)}
    >
      <input
        ref={inputRef}
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => {
          if (content.trim() !== message.contenido) {
            onEditMessage(message.id, content);
          }
          setIsEditing(false);
        }}
        className="w-full bg-transparent outline-none py-1"
        placeholder={isLast ? "Press Enter to add a new line..." : "Type something..."}
      />
    </div>
  );
};

const MessageBoard = () => {
  const [messages, setMessages] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/respuestas/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch messages');
      const data = await response.json();
      // Asegurarse de que los mensajes tengan un orden
      const orderedData = data.map((msg, index) => ({
        ...msg,
        order: msg.order || index
      })).sort((a, b) => a.order - b.order);
      setMessages(orderedData);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleAddMessage = async (content, order) => {
    try {
      // Primero, actualizar los órdenes de los mensajes existentes
      const updatesPromises = messages
        .filter(msg => msg.order >= order)
        .map(msg => 
          fetch(`http://127.0.0.1:8000/api/respuestas/${msg.id}/`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ order: msg.order + 1 })
          })
        );

      await Promise.all(updatesPromises);

      // Luego, crear el nuevo mensaje
      const response = await fetch('http://127.0.0.1:8000/api/respuestas/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          contenido: content || '',
          tags_list: [],
          order: order
        })
      });

      if (!response.ok) throw new Error('Failed to add message');
      await fetchMessages();
    } catch (error) {
      console.error('Error adding message:', error);
    }
  };

  const handleEditMessage = async (messageId, newContent) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/respuestas/${messageId}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ contenido: newContent })
      });
      if (!response.ok) throw new Error('Failed to edit message');
      await fetchMessages();
    } catch (error) {
      console.error('Error editing message:', error);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      // Obtener el mensaje que se va a eliminar
      const messageToDelete = messages.find(m => m.id === messageId);
      if (!messageToDelete) return;

      // Primero actualizar los órdenes de los mensajes posteriores
      const updatesPromises = messages
        .filter(msg => msg.order > messageToDelete.order)
        .map(msg =>
          fetch(`http://127.0.0.1:8000/api/respuestas/${msg.id}/`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ order: msg.order - 1 })
          })
        );

      await Promise.all(updatesPromises);

      // Luego eliminar el mensaje
      const response = await fetch(`http://127.0.0.1:8000/api/respuestas/${messageId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to delete message');
      await fetchMessages();
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const createNewMessage = (order) => {
    handleAddMessage('', order);
  };

  return (
    <Card className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4 space-y-0">
        {messages.map((message, index) => (
          <MessageItem
            key={message.id}
            message={message}
            onEditMessage={handleEditMessage}
            onDeleteMessage={handleDeleteMessage}
            onCreateNewMessage={createNewMessage}
            isLast={index === messages.length - 1}
          />
        ))}
      </div>
    </Card>
  );
};

export default MessageBoard;