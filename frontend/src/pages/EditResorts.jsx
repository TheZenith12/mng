import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

function EditResort() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const isEdit = !!id

  useEffect(() => {
    if (isEdit) {
      fetch(`http://localhost:5000/api/admin/resorts/${id}`)
        .then(res => res.json())
        .then(data => {
          setName(data.name)
          setDescription(data.description)
        })
        .catch(() => {})
    }
  }, [id])

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      const method = isEdit ? 'PUT' : 'POST'
      const url = isEdit
        ? `http://localhost:5000/api/admin/resorts/${id}`
        : 'http://localhost:5000/api/admin/resorts'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description })
      })
      if (!res.ok) throw new Error('Failed to save resort')
      navigate('/resorts')
    } catch (err) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">
        {isEdit ? 'Edit Resort' : 'Create Resort'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          className="w-full p-2 border rounded"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Resort name"
        />
        <textarea
          className="w-full p-2 border rounded"
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Description"
        />
        <div className="flex gap-2">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default EditResort
