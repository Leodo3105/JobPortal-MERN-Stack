import React from 'react';
import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-blue-600">
            Job<span className="text-gray-800">Portal</span>
          </h1>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Chào mừng đến với JobPortal
          </h2>
          <p className="text-gray-600 mb-4">
            Dự án trang web tìm kiếm việc làm sử dụng MERN Stack.
          </p>
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded">
            Bắt đầu ngay
          </button>
        </div>
      </main>
    </div>
  );
}

export default App;