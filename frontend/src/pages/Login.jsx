import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const { login } = useContext(AuthContext);
  const [form, setForm] = useState({ email:'', password:'' });
  const [error, setError] = useState('');
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      await login(form);
      nav('/'); // эсвэл admin бол admin dashboard руу
    } catch (err) {
      setError(err.response?.data?.message || 'Алдаа');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-purple-50 p-6">
      <form onSubmit={submit} className="w-full max-w-md bg-white p-6 rounded-xl shadow">
        <h2 className="text-2xl font-bold mb-4 text-center">Нэвтрэх</h2>
        {error && <div className="text-red-600 mb-2">{error}</div>}
        <input required value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="Email" className="w-full p-3 border rounded mb-3" />
        <input required type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder="Нууц үг" className="w-full p-3 border rounded mb-3" />
        <button className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded font-semibold">Нэвтрэх</button>
      </form>
    </div>
  );
}
