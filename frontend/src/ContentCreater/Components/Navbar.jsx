import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-gradient-to-r from-[#2ECC71] to-[#1ea85a] text-white px-8 py-5 flex justify-between items-center shadow-lg">
      <h1 className="text-2xl font-bold drop-shadow-md">Content Creator Dashboard</h1>
      <div className="space-x-6">
        <Link to="/" className="hover:text-white/80 hover:underline transition-all font-semibold">Home</Link>
        <Link to="/content-creator" className="hover:text-white/80 hover:underline transition-all font-semibold">Dashboard</Link>
      </div>
    </nav>
  );
};

export default Navbar;
