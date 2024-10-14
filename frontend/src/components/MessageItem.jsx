// frontend/src/components/MessageItem.jsx

import React, { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

function MessageItem({ message, tags, onAddTag, onEditMessage, onDeleteMessage }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(message.contenido);
  const [showCopiedNote, setShowCopiedNote] = useState(false);  // Nuevo estado para la nota
  const clickTimeoutRef = useRef(null);

  // Manejo del click con doble función (editar o copiar)
  const handleClick = () => {
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
      clickTimeoutRef.current = null;
      setIsEditing(true);  // Doble clic para editar
    } else {
      clickTimeoutRef.current = setTimeout(() => {
        navigator.clipboard.writeText(message.contenido);
        setShowCopiedNote(true);  // Mostrar la mini-nota
        setTimeout(() => setShowCopiedNote(false), 1500);  // Ocultar mini-nota tras 1.5 segundos
        clickTimeoutRef.current = null;
      }, 300);  // Un solo clic para copiar
    }
  };

  // Función para confirmar la edición
  const handleEdit = () => {
    if (isEditing) {
      onEditMessage(message.id, editedContent);
      setIsEditing(false);
    }
  };

  return (
    <div className="relative bg-white p-4 rounded-lg shadow-md mb-4 cursor-pointer" onClick={handleClick}>
      {isEditing ? (
        <input
          className="w-full p-2 border rounded"
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
          onBlur={handleEdit}  // Al perder el foco, confirmar la edición
        />
      ) : (
        <p className="break-words">{message.contenido}</p>  // Mostrar el contenido normal si no está en edición
      )}

      {/* Mini-nota que se muestra al copiar */}
      {showCopiedNote && (
        <div className="absolute bottom-2 right-4 p-2 bg-gray-700 text-white text-sm rounded-lg">
          Copied to clipboard!
        </div>
      )}

      {/* Controles: Selector de tags, editar, eliminar */}
      <div className="mt-2 flex justify-end items-center space-x-3">
        <select 
          onChange={(e) => onAddTag(message.id, e.target.value)}
          className="p-1 border rounded text-sm bg-gray-100"
        >
          <option value="">Add tag</option>
          {tags.map(tag => (
            <option key={tag.id} value={tag.nombre}>{tag.nombre}</option>
          ))}
        </select>

        {/* Botón de editar */}
        <button 
          onClick={(e) => {
            e.stopPropagation(); // Evitar que el clic sobre el botón dispare la función del mensaje
            setIsEditing(!isEditing);
          }} 
          className="text-blue-500 hover:text-blue-700"
        >
          <FontAwesomeIcon icon={faEdit} />
        </button>

        {/* Botón de eliminar */}
        <button 
          onClick={(e) => {
            e.stopPropagation(); // Evitar que el clic sobre el botón dispare la función del mensaje
            onDeleteMessage(message.id);
          }} 
          className="text-red-500 hover:text-red-700"
        >
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </div>
    </div>
  );
}

export default MessageItem;
