import React from 'react'
import { BrowserRouter,Routes, Route, Link } from 'react-router-dom';
import Home from './Home';
import Dashboard from './Dashboard';
import Grids from './Grids';

function ContentComponent() {
  return (
    <div>
      <Routes>
        <Route path = "/" element = {<Home/>}></Route>
        <Route path = "/dashboard" element = {<Dashboard/>}></Route>
        <Route path = "/grids" element = {<Grids/>}></Route>
      </Routes>
    </div>
  )
}

export default ContentComponent