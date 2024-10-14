// frontend/src/components/Modal.jsx

import React from 'react';

function Modal({ onClose, children }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-lg">
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded">
          X
        </button>
        {children}
      </div>
    </div>
  );
}

export default Modal;
