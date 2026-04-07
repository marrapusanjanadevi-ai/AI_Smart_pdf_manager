import React, { useEffect, useState } from 'react'
import axios from 'axios'
import DocumentCard from '../components/DocumentCard'
import { Filter, Calendar, Trash2, ShieldAlert, Search } from 'lucide-react'

const DocumentsPage = () => {
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [tagFilter, setTagFilter] = useState('')
  const [tagsList, setTagsList] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  
  // Multiple Select / Merge states
  const [selectedDocs, setSelectedDocs] = useState([])
  const [showMergeModal, setShowMergeModal] = useState(false)
  const [mergeFileName, setMergeFileName] = useState('')
  const [isMerging, setIsMerging] = useState(false)

  // Date deletion states
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  const fetchDocuments = async () => {
    setLoading(true)
    try {
      const url = tagFilter 
        ? `http://${window.location.hostname}:8000/documents?tag=${tagFilter}`
        : `http://${window.location.hostname}:8000/documents`
      const res = await axios.get(url)
      setDocuments(res.data.documents)
      
      if (!tagFilter) {
        // Extract unique tags
        const cats = [...new Set(res.data.documents.map(d => d.tags).filter(Boolean))]
        setTagsList(cats)
      }
    } catch (error) {
      console.error("Error fetching documents", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDocuments()
  }, [tagFilter])

  const handleDeleteByDate = async () => {
    if (!startDate || !endDate) {
      alert("Please select both start and end dates.")
      return
    }

    if (window.confirm(`Are you sure you want to delete all documents between ${startDate} and ${endDate}? This action cannot be undone.`)) {
      setIsDeleting(true)
      try {
        const res = await axios.delete(`http://${window.location.hostname}:8000/delete-by-date?start_date=${startDate}&end_date=${endDate}`)
        alert(res.data.message)
        fetchDocuments()
      } catch (error) {
        console.error("Delete error", error)
        alert("Failed to delete documents.")
      } finally {
        setIsDeleting(false)
      }
    }
  }

  const handleDeleteSingle = async (id) => {
    if (window.confirm("Delete this document? This cannot be undone.")) {
      try {
        await axios.delete(`http://${window.location.hostname}:8000/delete/${id}`)
        fetchDocuments()
      } catch (err) {
        alert("Failed to delete document.")
      }
    }
  }

  const handleRenameSingle = async (id, oldName) => {
    let baseName = oldName.replace(/\.pdf$/i, '')
    const newNameStr = window.prompt("Rename document to:", baseName)
    if (newNameStr === null || !newNameStr.trim()) return

    try {
      await axios.put(`http://${window.location.hostname}:8000/rename-document/${id}`, { new_name: newNameStr.trim() })
      fetchDocuments()
    } catch (err) {
      alert("Failed to rename document. A file with that name might already exist.")
    }
  }

  const handleSelectDoc = (id) => {
    setSelectedDocs(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  const handleMergeSubmit = async () => {
    if (selectedDocs.length < 2) return
    if (!mergeFileName.trim()) {
      alert("Please enter a valid file name.")
      return
    }

    setIsMerging(true)
    try {
      await axios.post(`http://${window.location.hostname}:8000/merge`, {
        doc1_id: selectedDocs[0],
        doc2_id: selectedDocs[1],
        merged_file_name: mergeFileName
      })
      setShowMergeModal(false)
      setSelectedDocs([])
      setMergeFileName('')
      fetchDocuments()
    } catch (err) {
      alert("Merge failed: " + err.message)
    } finally {
      setIsMerging(false)
    }
  }

  const handleRenameCategory = async (oldName) => {
    const newName = window.prompt(`Rename category '${oldName}' to:`)
    if (newName && newName.trim()) {
      try {
        await axios.put(`http://${window.location.hostname}:8000/rename-category`, {
          old_name: oldName,
          new_name: newName.trim()
        })
        fetchDocuments()
      } catch (err) {
        alert("Failed to rename category.")
      }
    }
  }

  return (
    <div className="animate-in fade-in duration-500 w-full max-w-5xl mx-auto pb-10">
      <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">Document Library</h2>
          <p className="text-gray-500 mt-2">Manage your uploaded files and organize them effectively.</p>
        </div>
        
        {/* Date Deletion Tool */}
        <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-end gap-3 shadow-sm w-full md:w-auto">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-red-800 mb-1 flex items-center"><ShieldAlert size={12} className="mr-1"/> Delete by Date</label>
            <div className="flex items-center space-x-2">
              <input 
                type="date" 
                value={startDate} 
                onChange={(e) => setStartDate(e.target.value)}
                className="text-sm border-gray-200 rounded-lg p-2 bg-white text-gray-700 shadow-sm focus:ring-red-500 focus:border-red-500"
              />
              <span className="text-gray-400 font-medium">to</span>
              <input 
                type="date" 
                value={endDate} 
                onChange={(e) => setEndDate(e.target.value)}
                className="text-sm border-gray-200 rounded-lg p-2 bg-white text-gray-700 shadow-sm focus:ring-red-500 focus:border-red-500"
              />
            </div>
          </div>
          <button 
            onClick={handleDeleteByDate}
            disabled={isDeleting || !startDate || !endDate}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg shadow disabled:opacity-50 transition-colors w-full sm:w-auto flex items-center justify-center h-[38px]"
          >
            {isDeleting ? 'Deleting...' : <Trash2 size={16} />}
          </button>
        </div>
      </header>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-between">
        <div className="flex flex-wrap items-center gap-2 bg-white p-2 rounded-xl border border-gray-100 shadow-sm grow-0">
          <Filter size={16} className="text-gray-400 mx-2 shrink-0" />
          <button 
            onClick={() => setTagFilter('')}
            className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${!tagFilter ? 'bg-darker text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            All
          </button>
          {tagsList.map(t => (
            <div key={t} className="flex items-center flex-nowrap bg-white border border-gray-100 rounded-lg overflow-hidden group">
              <button 
                onClick={() => setTagFilter(t)}
                className={`px-3 py-1.5 text-sm font-medium transition-colors ${tagFilter === t ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                {t}
              </button>
              <button 
                onClick={() => handleRenameCategory(t)}
                className="px-2 py-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 border-l border-gray-100 transition-colors"
                title="Rename Category"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
              </button>
            </div>
          ))}
        </div>
        
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm"
            placeholder="Search files by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-pulse">
          {[1,2,3,4].map(i => <div key={i} className="h-32 bg-white border border-gray-100 shadow-sm rounded-2xl w-full"></div>)}
        </div>
      ) : documents.filter(d => d.file_name.toLowerCase().includes(searchQuery.toLowerCase())).length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 auto-rows-max">
          {documents
            .filter(d => d.file_name.toLowerCase().includes(searchQuery.toLowerCase()))
            .map(doc => (
            <DocumentCard key={doc.id} doc={doc} onDelete={handleDeleteSingle} onRename={handleRenameSingle} onSelect={handleSelectDoc} selected={selectedDocs.includes(doc.id)} />
          ))}
        </div>
      ) : (
        <div className="bg-white border-2 border-dashed border-gray-200 rounded-3xl p-12 text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-400">
            <Filter size={24} />
          </div>
          <h4 className="text-lg font-medium text-gray-900 mb-1">No documents found</h4>
          <p className="text-gray-500 text-sm">No files uploaded yet, or none match the selected filters.</p>
        </div>
      )}

      {/* Floating Merge Action */}
      {selectedDocs.length >= 2 && (
        <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-white px-6 py-4 rounded-full shadow-2xl border border-gray-200 flex items-center space-x-6 z-40 animate-in slide-in-from-bottom-10">
          <span className="font-semibold text-gray-800"><span className="text-indigo-600">{selectedDocs.length}</span> documents selected</span>
          <button 
            onClick={() => setShowMergeModal(true)}
            className="px-6 py-2 bg-indigo-600 text-white rounded-xl shadow hover:bg-indigo-700 transition"
          >
            Merge PDFs
          </button>
        </div>
      )}

      {/* Merge Modal */}
      {showMergeModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-center items-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Merge Documents</h3>
            <p className="text-gray-500 text-sm mb-6">You've selected {selectedDocs.length} PDFs (Note: merging currently supports the first 2 selected). Give your new merged document a name.</p>
            
            <input 
              type="text" 
              placeholder="e.g. Q3_Finance_Report.pdf" 
              value={mergeFileName}
              onChange={(e) => setMergeFileName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl mb-6 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            
            <div className="flex space-x-3 justify-end">
              <button 
                onClick={() => setShowMergeModal(false)}
                className="px-5 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-xl"
              >
                Cancel
              </button>
              <button 
                onClick={handleMergeSubmit}
                disabled={isMerging}
                className="px-5 py-2 flex items-center bg-indigo-600 text-white font-medium hover:bg-indigo-700 rounded-xl disabled:opacity-50"
              >
                {isMerging ? 'Merging...' : 'Confirm Merge'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DocumentsPage
