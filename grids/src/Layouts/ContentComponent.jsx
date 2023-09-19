import React from 'react'
import { BrowserRouter,Routes, Route, Link } from 'react-router-dom';
import Home from '../components/Home';
import Dashboard from '../components/Dashboard';
import Grids from '../components/Grids';
import Receipt from '../components/Receipt';
import Transfers from '../components/Transfers';
import NewGrid from '../components/NewGrid';
import ComingSoon from '../components/ComingSoon';

function ContentComponent() {
  return (
    <div>
      <Routes>
        <Route path = "/" element = {<ComingSoon/>}></Route>
        <Route path = "/dashboard" element = {<Dashboard/>}></Route>
        <Route path = "/transfers" element = {<Transfers/>}></Route>
        <Route path = "/receipt" element = {<Receipt/>}></Route>
        <Route path = "/newgrid" element = {<ComingSoon/>}></Route>
        <Route path = "/newcustomer" element = {<ComingSoon/>}></Route>
        <Route path = "/customerlist" element = {<ComingSoon/>}></Route>
      </Routes>
    </div>
  )
}

export default ContentComponent