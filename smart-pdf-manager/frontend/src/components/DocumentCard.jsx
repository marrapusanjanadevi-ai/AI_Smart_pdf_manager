import React from 'react'
import { Calendar, Trash2, FileText, Edit2 } from 'lucide-react'

const DocumentCard = ({ doc, onDelete, onRename, onSelect, selected }) => {
  return (
    <div className={`bg-white border text-left p-4 rounded-2xl shadow-sm hover:shadow-md transition-all group relative hover:-translate-y-1 ${selected ? 'border-primary ring-2 ring-primary bg-primary/5' : 'border-gray-100'}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3 w-10/12">
          {onSelect && (
            <input 
              type="checkbox" 
              checked={selected || false} 
              onChange={() => onSelect(doc.id)}
              className="mr-2 w-4 h-4 text-primary rounded focus:ring-primary cursor-pointer shrink-0"
            />
          )}
          <a
            href={`http://${window.location.hostname}:8000/uploads/${encodeURIComponent(doc.file_name)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 bg-red-50 text-red-500 rounded-xl shrink-0 hover:bg-red-100 transition-colors cursor-pointer"
          >
            <FileText size={20} />
          </a>
          <div className="truncate w-full">
            <a
              href={`http://${window.location.hostname}:8000/uploads/${encodeURIComponent(doc.file_name)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-gray-800 truncate block hover:text-primary transition-colors cursor-pointer"
              title={doc.file_name}
            >
              {doc.file_name}
            </a>
            <div className="flex items-center mt-1 text-xs text-gray-500 space-x-2">
              <span className="flex items-center"><Calendar size={12} className="mr-1"/> {new Date(doc.upload_date).toLocaleDateString()}</span>
              {doc.file_size && (
                <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full font-medium">{(doc.file_size / 1024 / 1024).toFixed(2)} MB</span>
              )}
              {doc.tags && (
                <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full font-medium">{doc.tags}</span>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col space-y-2 shrink-0">
          {onRename && (
            <button onClick={() => onRename(doc.id, doc.file_name)} className="text-gray-300 hover:text-indigo-500 transition-colors p-1 z-10" title="Rename Document">
              <Edit2 size={16} />
            </button>
          )}
          {onDelete && (
            <button onClick={() => onDelete(doc.id)} className="text-gray-300 hover:text-red-500 transition-colors p-1 z-10" title="Delete Document">
              <Trash2 size={18} />
            </button>
          )}
        </div>
      </div>
      {doc.summary && (
        <p className="mt-4 text-sm text-gray-600 line-clamp-2 leading-relaxed">{doc.summary}</p>
      )}
    </div>
  )
}

export default DocumentCard
