import React from 'react'
import { BrowserRouter,Routes, Route, Link } from 'react-router-dom';
import Dashboard from '../components/Dashboard';
import ReceiptLayout from './ReceiptLayout';
import Transfers from '../components/Transfers';
import ComingSoon from '../components/ComingSoon';
import Places from '../components/Places';
import Customers from '../components/Customers';

function ContentComponent() {
  return (
    <div>
      <Routes>
        <Route path = "/" element = {<Dashboard/>}></Route>
        <Route path = "/transfers" element = {<Transfers/>}></Route>
        <Route path = "/receipt" element = {<ReceiptLayout/>}></Route>
        {/* <Route path = "/newgrid" element = {<ComingSoon/>}></Route> */}
        <Route path = "/customers" element = {<Customers/>}></Route>
        <Route path = "/places" element = {<Places/>}></Route>
      </Routes>
    </div>
  )
}

export default ContentComponent