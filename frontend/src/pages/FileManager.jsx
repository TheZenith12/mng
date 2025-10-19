import React, { useEffect, useState } from 'react'

function FileManager() {
  const [files, setFiles] = useState([])

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('http://localhost:5000/api/admin/files')
        if (!res.ok) throw new Error('Failed to fetch files')
        const data = await res.json()
        setFiles(data)
      } catch {
        setFiles([])
      }
    }
    load()
  }, [])

  async function uploadFile(e) {
    const file = e.target.files[0]
    if (!file) return
    const formData = new FormData()
    formData.append('file', file)
    try {
      const res = await fetch('http://localhost:5000/api/admin/files', {
        method: 'POST',
        body: formData
      })
      if (!res.ok) throw new Error('Upload failed')
      const newFile = await res.json()
      setFiles([newFile, ...files])
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Files</h2>
        <label className="px-3 py-1 border rounded cursor-pointer">
          Upload
          <input type="file" className="hidden" onChange={uploadFile} />
        </label>
      </div>

      <div className="space-y-2">
        {files.map(f => (
          <div key={f._id} className="p-3 bg-white rounded flex justify-between items-center">
            <div>
              <div className="font-medium">{f.originalName}</div>
              <div className="text-sm text-gray-500">{f.size} bytes</div>
            </div>
            <a href={f.url} target="_blank" rel="noreferrer" className="px-3 py-1 border rounded">Open</a>
          </div>
        ))}
        {files.length === 0 && <div className="text-gray-500">No files uploaded.</div>}
      </div>
    </div>
  )
}

export default FileManager
