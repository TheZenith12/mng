import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../utils/api'

function Resorts() {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  async function fetchResorts() {
    setLoading(true)
    try {
      const res = await fetch('${api}/admin/resorts')
      if (!res.ok) throw new Error('Failed to fetch resorts')
      const data = await res.json()
      setList(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchResorts() }, [])

  async function removeResort(id) {
    if (!confirm('Are you sure to delete this resort?')) return
    try {
      const res = await fetch(`http://localhost:5000/api/admin/resorts/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')
      setList(list.filter(r => r._id !== id))
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Resorts</h2>
        <Link to="/resorts/new" className="px-3 py-1 bg-blue-600 text-white rounded">Create</Link>
      </div>

      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600">{error}</div>}

      <div className="space-y-3">
        {list.map(r => (
          <div key={r._id} className="p-4 bg-white rounded flex justify-between items-center">
            <div>
              <div className="font-semibold">{r.name}</div>
              <div className="text-sm text-gray-500">{r.description}</div>
            </div>
            <div className="flex gap-2">
              <Link to={`/resorts/edit/${r._id}`} className="px-2 py-1 border rounded">Edit</Link>
              <button onClick={() => removeResort(r._id)} className="px-2 py-1 border rounded">Delete</button>
            </div>
          </div>
        ))}

        {!loading && list.length === 0 && <div className="text-gray-500">No resorts found.</div>}
      </div>
    </div>
  )
}

export default Resorts
