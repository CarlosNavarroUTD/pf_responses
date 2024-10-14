import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Edit, Trash2, Plus, PlusCircle } from 'lucide-react';

export default function MessageInterface() {
  const [messages, setMessages] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState(null);
  const tagSectionRefs = useRef({});

  useEffect(() => {
    fetchMessages();
    fetchTags();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/respuestas/', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
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
      const response = await fetch('http://127.0.0.1:8000/api/tags/', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch tags');
      const data = await response.json();
      setTags(data);
    } catch (error) {
      console.error('Error fetching tags:', error);
      alert('Failed to fetch tags. Please try again.');
    }
  };

  const handleTagClick = (tagId) => {
    setSelectedTag(tagId);
    const sectionRef = tagSectionRefs.current[tagId];
    if (sectionRef) {
      sectionRef.scrollIntoView({ behavior: 'smooth' });
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
      if (!response.ok) throw new Error('Failed to add tag');
      await fetchMessages();
      alert('Tag added successfully.');
    } catch (error) {
      console.error('Error adding tag:', error);
      alert('Failed to add tag. Please try again.');
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
      if (!response.ok) throw new Error('Failed to delete message');
      await fetchMessages();
      alert('Message deleted successfully.');
    } catch (error) {
      console.error('Error deleting message:', error);
      alert('Failed to delete message. Please try again.');
    }
  };

  const handleAddNewNote = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/respuestas/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ contenido: "New note", tags_list: [] })
      });
      if (!response.ok) throw new Error('Failed to add new note');
      await fetchMessages();
      alert('New note added successfully.');
    } catch (error) {
      console.error('Error adding new note:', error);
      alert('Failed to add new note. Please try again.');
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Side Menu */}
      <div className="w-16 bg-white shadow-md overflow-y-auto">
        {tags.map(tag => (
          <button
            key={tag.id}
            className="w-full p-2 hover:bg-gray-100 focus:outline-none"
            onClick={() => handleTagClick(tag.nombre)}
          >
            <span className="text-2xl">{tag.nombre.charAt(0).toUpperCase()}</span>
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <button
          onClick={handleAddNewNote}
          className="mb-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md flex items-center"
        >
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Note
        </button>
        {tags.map(tag => (
          <motion.div
            key={tag.id}
            ref={el => tagSectionRefs.current[tag.nombre] = el}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold mb-4">{tag.nombre}</h2>
            {messages.filter(msg => msg.tags.includes(tag.nombre)).map(message => (
              <MessageItem
                key={message.id}
                message={message}
                onAddTag={handleAddTag}
                onEditMessage={handleEditMessage}
                onDeleteMessage={handleDeleteMessage}
                tags={tags}
              />
            ))}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function MessageItem({ message, onAddTag, onEditMessage, onDeleteMessage, tags }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(message.contenido);
  const clickTimeoutRef = useRef(null);

  const handleClick = () => {
    if (clickTimeoutRef.current) {
      // Double click detected
      clearTimeout(clickTimeoutRef.current);
      clickTimeoutRef.current = null;
      setIsEditing(true);
    } else {
      // Single click
      clickTimeoutRef.current = setTimeout(() => {
        navigator.clipboard.writeText(message.contenido);
        alert('The message has been copied to your clipboard.');
        clickTimeoutRef.current = null;
      }, 300); // 300ms delay to detect double click
    }
  };

  const handleEdit = () => {
    if (isEditing) {
      onEditMessage(message.id, editedContent);
    }
    setIsEditing(!isEditing);
  };

  return (
    <motion.div
      className="bg-white p-4 rounded-lg shadow-md mb-4 flex items-center justify-between"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex-1" onClick={handleClick}>
        {isEditing ? (
          <input
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="w-full p-1 border rounded"
            onBlur={handleEdit}
            autoFocus
          />
        ) : (
          <p>{message.contenido}</p>
        )}
      </div>
      <div className="flex space-x-2">
        <div className="relative">
          <button
            className="text-gray-400 hover:text-blue-300 focus:outline-none"
            onClick={() => document.getElementById(`popover-${message.id}`).classList.toggle('hidden')}
          >
            <Plus className="h-4 w-4" />
          </button>
          <div id={`popover-${message.id}`} className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg hidden">
            <div className="p-2">
              <h4 className="font-medium mb-2">Add Tag</h4>
              <div className="grid grid-cols-2 gap-2">
                {tags.map(tag => (
                  <button
                    key={tag.id}
                    className="p-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
                    onClick={() => onAddTag(message.id, tag.nombre)}
                  >
                    {tag.nombre}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        <button
          className="text-gray-400 hover:text-yellow-300 focus:outline-none"
          onClick={handleEdit}
        >
          <Edit className="h-4 w-4" />
        </button>
        <button
          className="text-gray-400 hover:text-red-300 focus:outline-none"
          onClick={() => onDeleteMessage(message.id)}
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
}