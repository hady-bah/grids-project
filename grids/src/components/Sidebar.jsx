import React, { useState } from 'react';
import { BrowserRouter,Routes, Route, Link, useNavigate } from 'react-router-dom';
import ContentComponent from '../Layouts/ContentComponent';
import {
  FundOutlined,
  AppstoreOutlined,
  SnippetsOutlined,
  HomeOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import '../styles/nav.css';
const { Header, Content, Footer, Sider } = Layout;
function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}
const items = [
  getItem('Home', "/", <HomeOutlined />),
  getItem('Dashboard', '/dashboard', <FundOutlined />),
  getItem('Grids', 'sub1', <AppstoreOutlined />,[
    getItem('Transfer 2.0', '/transfers'),
    getItem('Add new', '/newgrid'),

  ]),
  getItem('Receipt', '/receipt', <SnippetsOutlined />),
  // getItem('Admins', 'sub2', <UserOutlined />, [
  //   getItem('Hady Bah', '/hadybah'),
  //   getItem('Abdourahamane Ly', '/abdourahamanely'),
  //   getItem('Amadou Diallo', '/amadoudiallo'),
  //   getItem('Abdoulaye Diallo', '/abdoulayediallo'),
  //   getItem('Alpha Diallo', '/alphadiallo'),
  // ]),
  getItem('Customers', "/customers", <TeamOutlined />),
];

function Sidebar() {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();


  return (
    <>
    <div style={{display:'flex'}}>
    <Layout>
        <Sider  theme="dark" style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          paddingTop:'20px',
          // borderInlineEnd: '1px solid rgba(5, 5, 5, 0.06)', 
        }}>
            <div className="demo-logo-vertical" />
            <Menu
            onClick={({key})=>{
                navigate(key)
            }} 
            theme="dark" 
            defaultSelectedKeys={['1']} 
            mode="inline" 
            items={items} />
        </Sider>
        <Layout
        className="site-layout">
        <Content 
          style={{ 
            marginLeft: 200, 
            paddingTop:'100px',
            overflowX: 'hidden',
            backgroundColor: 'rgba(255, 255, 255)', 
          }}
        >
          <div
            style={{
              padding: 30,
              
            }}
          >
            <ContentComponent/>
          </div>
        </Content>
        </Layout>
        </Layout>
    </div>
    </>
  )
}

export default Sidebar