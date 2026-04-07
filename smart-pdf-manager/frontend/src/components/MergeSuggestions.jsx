import React, { useState } from 'react'
import axios from 'axios'
import { FileUp, Link as LinkIcon, AlertCircle } from 'lucide-react'

const MergeSuggestions = ({ suggestions }) => {
  const [merging, setMerging] = useState(null)
  const [success, setSuccess] = useState(null)
  
  const handleMerge = async (doc1_id, doc2_id, idx, default_name_1, default_name_2) => {
    const customName = window.prompt("Enter a name for the merged PDF:", `merged_${default_name_1}`)
    if (customName === null) return // cancelled
    if (!customName.trim()) {
      alert("Please enter a valid file name.")
      return
    }

    setMerging(idx)
    try {
      await axios.post(`http://${window.location.hostname}:8000/merge`, { 
        doc1_id, 
        doc2_id,
        merged_file_name: customName.trim()
      })
      setSuccess(idx)
    } catch (error) {
      console.error("Merge error", error)
      alert("Failed to merge. Make sure the backend endpoint is functioning.")
    } finally {
      setMerging(null)
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {suggestions.map((s, idx) => {
        const isSuccess = success === idx
        const isMerging = merging === idx

        return (
          <div key={idx} className={`bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 p-5 rounded-2xl flex flex-col justify-between transition-all ${isSuccess ? 'opacity-50 pointer-events-none' : ''}`}>
            <div>
              <div className="flex items-center text-indigo-600 mb-3 space-x-2 font-medium bg-indigo-100/50 w-fit px-3 py-1 rounded-full text-xs">
                <AlertCircle size={14} />
                <span>{(s.similarity * 100).toFixed(0)}% Match</span>
              </div>
              <p className="text-sm font-medium text-gray-800 bg-white px-3 py-2 rounded-lg border border-gray-100 mb-2 truncate" title={s.doc1.file_name}>{s.doc1.file_name}</p>
              <div className="flex justify-center -my-3 z-10 relative">
                <div className="bg-indigo-100 text-indigo-500 p-1.5 rounded-full border-2 border-white">
                  <LinkIcon size={14} />
                </div>
              </div>
              <p className="text-sm font-medium text-gray-800 bg-white px-3 py-2 rounded-lg border border-gray-100 mt-2 truncate" title={s.doc2.file_name}>{s.doc2.file_name}</p>
            </div>
            
            <button 
              onClick={() => handleMerge(s.doc1.id, s.doc2.id, idx, s.doc1.file_name, s.doc2.file_name)}
              disabled={isMerging || isSuccess}
              className={`mt-5 w-full py-2.5 rounded-xl text-sm font-bold shadow-sm transition-all focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                ${isSuccess ? 'bg-green-500 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}
              `}
            >
              {isSuccess ? 'Merged Successfully' : isMerging ? 'Merging...' : 'Merge Documents'}
            </button>
          </div>
        )
      })}
    </div>
  )
}

export default MergeSuggestions
