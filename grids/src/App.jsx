import React, { useState } from "react";
import "./styles/App.css";
import Sidebar from "./components/Sidebar";
import NavBar from "./components/NavBar";
import ContentComponent from "./Layouts/ContentComponent";
import { FloatButton } from 'antd';


function App() {
  const [count, setCount] = useState(0);

  return (
    <>
    <div>
      <div>
        <NavBar />
      </div>
      <div>
        <Sidebar />
      </div>
      <FloatButton.BackTop />
    </div>
    </>
  );
}

export default App;
