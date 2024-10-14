// frontend/src/components/MessageBoard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MessageList from './MessageList';
import TagList from './TagList';
import Modal from './Modal';
import AddMessageForm from './AddMessageForm';
import IconPicker from './IconPicker';

function MessageBoard() {
  const [showAddMessageModal, setShowAddMessageModal] = useState(false);
  const [messages, setMessages] = useState([]);
  const [tags, setTags] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMessages();
    fetchTags();
  }, []);

  const handleTokenExpiration = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };
  
  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://127.0.0.1:8000/api/respuestas/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.status === 401) {
        handleTokenExpiration();
        return;
      }
      if (!response.ok) throw new Error('Failed to fetch messages');
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
      alert('Failed to fetch messages. Please try again.');
    }
  };
  
  const fetchTags = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://127.0.0.1:8000/api/tags/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.status === 401) {
        handleTokenExpiration();
        return;
      }
      if (!response.ok) throw new Error('Failed to fetch tags');
      const data = await response.json();
      setTags(data);
    } catch (error) {
      console.error('Error fetching tags:', error);
      alert('Failed to fetch tags. Please try again.');
    }
  };

  const handleAddTag = async (messageId, newTag) => {
    try {
      const message = messages.find(m => m.id === messageId);
      const response = await fetch(`http://127.0.0.1:8000/api/respuestas/${messageId}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ tags_list: [...(message.tags || []), newTag] })
      });
      if (response.status === 401) {
        handleTokenExpiration();
        return;
      }
      if (!response.ok) throw new Error('Failed to add tag');
      await fetchMessages();
      alert('Tag added successfully.'); 
    } catch (error) {
      console.error('Error adding tag:', error);
      alert('Failed to add tag. Please try again.');
    }
  };
  const handleAddMessage = async (newMessage) => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/respuestas/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          contenido: newMessage, 
          tags_list: []  // Puedes enviar un array vacío si no hay tags.
        })
      });
      if (response.status === 401) {
        handleTokenExpiration();
        return;
      }
      if (!response.ok) throw new Error('Failed to add message');
      await fetchMessages();
      alert('Message added successfully.');
    } catch (error) {
      console.error('Error adding message:', error);
      alert('Failed to add message. Please try again.');
    }
  };
  
  const handleEditMessage = async (messageId, newContent) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/respuestas/${messageId}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ contenido: newContent })
      });
      if (response.status === 401) {
        handleTokenExpiration();
        return;
      }
      if (!response.ok) throw new Error('Failed to edit message');
      await fetchMessages();
      alert('Message edited successfully.');
    } catch (error) {
      console.error('Error editing message:', error);
      alert('Failed to edit message. Please try again.');
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/respuestas/${messageId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.status === 401) {
        handleTokenExpiration();
        return;
      }
      if (!response.ok) throw new Error('Failed to delete message');
      await fetchMessages();
      alert('Message deleted successfully.');
    } catch (error) {
      console.error('Error deleting message:', error);
      alert('Failed to delete message. Please try again.');
    }
  };

  return (
<div className="relative flex h-screen bg-gray-100">
  <button 
    onClick={() => setShowAddMessageModal(true)} 
    className="absolute top-4 right-4 p-2 bg-green-500 text-white rounded-lg mb-4">
    Add Message
  </button>
  
  {showAddMessageModal && (
    <Modal onClose={() => setShowAddMessageModal(false)}>
      <AddMessageForm onAddMessage={handleAddMessage} />
    </Modal>
  )}
  <IconPicker/>
  <TagList tags={tags} />
  <MessageList 
    messages={messages} 
    tags={tags}
    onAddTag={handleAddTag}
    onEditMessage={handleEditMessage}
    onDeleteMessage={handleDeleteMessage}
  />
</div>

  );
}

export default MessageBoard;