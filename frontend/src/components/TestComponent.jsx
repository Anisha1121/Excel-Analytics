import React from 'react';

const TestComponent = () => {
  return (
    <div className="p-4 bg-blue-100 border border-blue-500 rounded">
      <h2 className="text-2xl font-bold text-blue-800">Test Component</h2>
      <p className="text-blue-600">If you can see this, React is working correctly.</p>
      <div className="mt-4">
        <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Test Button
        </button>
      </div>
    </div>
  );
};

export default TestComponent;
