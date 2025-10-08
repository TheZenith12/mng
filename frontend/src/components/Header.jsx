import React from "react";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold tracking-wider hover:text-yellow-300 transition">
          Монголын Амралтын Газрууд
        </Link>
        <nav className="space-x-4">
          <Link to="/" className="hover:text-yellow-300 transition">Home</Link>
          <Link to="/about" className="hover:text-yellow-300 transition">About</Link>
          <Link to="/auth" className="hover:text-yellow-300 transition">Newtreh</Link>
        </nav>
      </div>
    </header>
  );
}
