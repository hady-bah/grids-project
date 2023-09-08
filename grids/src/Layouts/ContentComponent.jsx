import React from 'react'
import { BrowserRouter,Routes, Route, Link } from 'react-router-dom';
import Home from '../components/Home';
import Dashboard from '../components/Dashboard';
import Grids from '../components/Grids';
import Receipt from '../components/Receipt';
import Transfers from '../components/Transfers';

function ContentComponent() {
  return (
    <div>
      <Routes>
        <Route path = "/" element = {<Home/>}></Route>
        <Route path = "/dashboard" element = {<Dashboard/>}></Route>
        <Route path = "/transfers" element = {<Transfers/>}></Route>
        <Route path = "/receipt" element = {<Receipt/>}></Route>
      </Routes>
    </div>
  )
}

export default ContentComponent