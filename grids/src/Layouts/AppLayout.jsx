import React, { useState } from "react";
import { FloatButton } from 'antd';
import { Button, ConfigProvider, Space } from 'antd';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import NavBar from "../components/NavBar";
import Sidebar from "../components/Sidebar";



function AppLayout() {

  return (
    <>
      <div>
        <div>
          <NavBar />
        </div>
        <div>
          <Sidebar />
        </div>
      </div>
    </>
    
  );
}

export default AppLayout;
