import React, { useState } from 'react'
import { UploadCloud, File, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import axios from 'axios'

const UploadPage = () => {
  const [files, setFiles] = useState([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [uploadProgress, setUploadProgress] = useState({})
  const [error, setError] = useState(null)
  
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(Array.from(e.target.files))
      setError(null)
      setUploadProgress({})
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files)
      const pdfs = droppedFiles.filter(f => f.type === 'application/pdf')
      
      if (pdfs.length === 0) {
        setError("Please drop valid PDF files.")
        return
      }
      setFiles(pdfs)
      setError(null)
      setUploadProgress({})
    }
  }

  const handleUpload = async () => {
    if (!files || files.length === 0) return
    
    setIsProcessing(true)
    setError(null)
    
    try {
      for (const file of files) {
        const formData = new FormData()
        formData.append("file", file)
        
        setUploadProgress(prev => ({ ...prev, [file.name]: 'processing' }))
        
        await axios.post(`http://${window.location.hostname}:8000/upload`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        })
        
        setUploadProgress(prev => ({ ...prev, [file.name]: 'done' }))
      }
    } catch (err) {
      setError(err.response?.data?.detail || "An error occurred during processing.")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto py-8 animate-in fade-in duration-500">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Add Documents</h2>
        <p className="text-gray-500">Select single or multiple PDFs to process and add to your library.</p>
      </div>

      <div 
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-3xl p-10 text-center transition-all bg-white relative overflow-hidden
          ${isProcessing ? 'border-primary bg-blue-50/50' : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'}
        `}
      >
        <div className="relative z-10 flex flex-col items-center">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors
            ${files.length > 0 ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}
          `}>
            {files.length > 0 ? <File size={30} /> : <UploadCloud size={30} />}
          </div>
          
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {files.length > 0 ? `${files.length} document(s) selected` : 'Drag & drop your PDFs here'}
          </h3>

          <input 
            type="file"
            id="file-upload" 
            className="hidden" 
            accept="application/pdf"
            multiple
            onChange={handleFileChange}
            disabled={isProcessing}
          />
          <label 
            htmlFor="file-upload"
            className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50 cursor-pointer shadow-sm transition-all focus:ring-4 focus:ring-gray-100 disabled:opacity-50 mt-4"
          >
            Browse files
          </label>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-xl flex items-center text-sm font-medium border border-red-100">
          <AlertCircle size={18} className="mr-2" />
          {error}
        </div>
      )}

      {files.length > 0 && (
        <div className="mt-6 flex flex-col space-y-4">
          <div className="space-y-3 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
            <h4 className="font-semibold text-sm text-gray-700 mb-2 border-b border-gray-100 pb-2">Selected Files</h4>
            {files.map(f => (
              <div key={f.name} className="flex items-center justify-between text-sm">
                <span className="truncate text-gray-600 w-3/4 flex items-center">
                  <File size={14} className="mr-2 text-indigo-400 shrink-0"/> {f.name}
                </span>
                <span className="font-medium text-xs">
                  {!uploadProgress[f.name] && <span className="text-gray-400">Ready</span>}
                  {uploadProgress[f.name] === 'processing' && <span className="text-indigo-600 flex items-center"><Loader2 size={12} className="animate-spin mr-1"/> Processing...</span>}
                  {uploadProgress[f.name] === 'done' && <span className="text-emerald-600 flex items-center"><CheckCircle size={12} className="mr-1"/> Complete</span>}
                </span>
              </div>
            ))}
          </div>

          <button
            onClick={handleUpload}
            disabled={isProcessing || Object.values(uploadProgress).every(s => s === 'done')}
            className={`w-full py-4 rounded-xl text-white font-medium flex items-center justify-center transition-all shadow-sm
              ${isProcessing || Object.values(uploadProgress).every(s => s === 'done') ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-md'}
            `}
          >
            {isProcessing ? 'Processing Documents...' : 'Start Upload'}
          </button>
        </div>
      )}
    </div>
  )
}

export default UploadPage
