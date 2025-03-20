import { useContext, useState } from 'react'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Auth from './pages/Auth'
import CardPage from './pages/CardPage'
import PagenotFound from './pages/PagenotFound'
import { loginresponseContext } from './context/ContextShare'
import AdminDashBoard from './pages/AdminDashBoard'


function App() {
  const {loginResponse} = useContext(loginresponseContext)

  return (
    <>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/dashboard' element={ loginResponse?<Dashboard/> :<PagenotFound/>}  />
        <Route path='/admin' element={ loginResponse?<AdminDashBoard/> :<PagenotFound/>} />
        <Route path='/login' element={<Auth/>} />
        <Route path='/register' element={<Auth register = {true} />} />
        <Route path='/page' element={ loginResponse?<CardPage/> :<PagenotFound/>} />
        <Route path='*' element={<PagenotFound/>}/>
      </Routes>

    </>
  )
}

export default App
