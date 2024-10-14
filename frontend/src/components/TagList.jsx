// frontend/src/components/TagList.jsx

import React from 'react';

function TagList({ tags }) {
  const handleHover = (tagId) => {
    const section = document.getElementById(`section-${tagId}`);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="w-64 bg-white shadow-md p-4">
      <h2 className="text-xl font-bold mb-4">Tags</h2>
      <ul>
        {tags.map(tag => (
          <li key={tag.id} className="mb-2">
            <button 
              className="w-full text-left p-2 hover:bg-gray-100 rounded"
              onMouseEnter={() => handleHover(tag.id)}>
              {tag.nombre}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}


export default TagList;