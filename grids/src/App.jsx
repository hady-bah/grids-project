//Pre Auth setup
import React, { useState } from "react";
import "./styles/App.css";
import Sidebar from "./components/Sidebar";
import NavBar from "./components/NavBar";
import ContentComponent from "./Layouts/ContentComponent";
import { FloatButton } from 'antd';
import { Button, ConfigProvider, Space } from 'antd';



function App() {
  const [count, setCount] = useState(0);

  return (
    <>
    <ConfigProvider
    theme={{
      token: {
        // Seed Token
        colorPrimary: '#28282B',
        borderRadius: 5,
        colorPrimaryBg:'white'
        

        // Alias Token
        // colorBgContainer: '#f6ffed',
      },
    }}
  >
    <div>
      <div>
        <NavBar />
      </div>
      <div>
        <Sidebar />
      </div>
      <FloatButton.BackTop />
    </div>
    </ConfigProvider>7
    </>
  );
}

export default App;