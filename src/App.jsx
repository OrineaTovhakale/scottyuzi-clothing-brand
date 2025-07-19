import { useState } from 'react'
import Header from './components/Header'
import Home from './pages/Home'
import CategoryCollections from './pages/CategoryCollections'
import Collections from './pages/Collections'
import { Routes, Route } from 'react-router-dom'



export default function App() {
  return (
    <main className="pt-[80px] overflow-hidden text-tertiary relative">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/collections/category" element={<CategoryCollections />} />
        <Route path="/collections" element={<Collections />} />
      </Routes>
    </main>
  )
}