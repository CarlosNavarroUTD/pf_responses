import React, { useState } from 'react';

function AddMessageForm({ onAddMessage }) {
  const [newMessage, setNewMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddMessage(newMessage);
    setNewMessage(''); // Limpiar el formulario después de enviar
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
      <textarea
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        className="p-2 border rounded"
        placeholder="Enter your message"
        required
      />
      <button type="submit" className="p-2 bg-green-500 text-white rounded-lg">
        Add Message
      </button>
    </form>
  );
}

export default AddMessageForm;
