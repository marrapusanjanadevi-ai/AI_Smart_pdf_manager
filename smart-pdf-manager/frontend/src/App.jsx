import React from 'react'
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import { Home, Upload, Search, FileText } from 'lucide-react'
import Dashboard from './pages/Dashboard'
import UploadPage from './pages/Upload'
import SearchPage from './pages/Search'
import DocumentsPage from './pages/Documents'

import FloatingChatbot from './components/FloatingChatbot'

const Navbar = () => {
  const location = useLocation()
  
  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/upload', label: 'Add Documents', icon: Upload },
    { path: '/documents', label: 'Docs', icon: FileText },
  ]

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50 md:sticky md:top-0 md:bg-darker md:text-white md:border-b md:h-screen md:w-64 md:flex-col md:px-0 md:pt-8 transition-colors">
      <div className="md:hidden flex justify-around items-center h-16 max-w-md mx-auto px-2">
        {navItems.map(({ path, label, icon: Icon }) => (
          <Link 
            key={path} 
            to={path}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-all
              ${location.pathname === path ? 'text-primary scale-110' : 'text-gray-500 hover:text-gray-900'}
            `}
          >
            <Icon size={24} strokeWidth={location.pathname === path ? 2.5 : 2} />
            <span className="text-[10px] font-medium">{label}</span>
          </Link>
        ))}
      </div>

      <div className="hidden md:flex flex-col h-full items-start px-6 font-sans">
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-400 mb-10 w-full text-center">AI PDF Manager</h1>
        <div className="w-full space-y-4">
          {navItems.map(({ path, label, icon: Icon }) => (
            <Link 
              key={path} 
              to={path}
              className={`flex items-center space-x-3 w-full px-4 py-3 rounded-xl transition-all
                ${location.pathname === path ? 'bg-primary/10 text-primary font-semibold' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}
              `}
            >
              <Icon size={20} />
              <span className="text-sm">{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col md:flex-row min-h-screen bg-light">
        <Navbar />
        <main className="flex-1 pb-16 md:pb-0 px-4 py-6 md:p-8 overflow-y-auto w-full max-w-5xl mx-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/documents" element={<DocumentsPage />} />
          </Routes>
          <FloatingChatbot />
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
