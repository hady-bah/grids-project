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
    getItem('Add new', '/newgrid'),
    getItem('Money Transfer 2.0', '/transfers'),
    
    
  ]),
  getItem('New receipt', '/receipt', <SnippetsOutlined />),
  getItem('Admins', 'sub2', <UserOutlined />, [
    getItem('Hady Bah', '/hadybah'),
    getItem('Abdourahamane Ly', '/abdourahamanely'),
    getItem('Amadou Diallo', '/amadoudiallo'),
    getItem('Abdoulaye Diallo', '/abdoulayediallo'),
    getItem('Alpha Diallo', '/alphadiallo'),
  ]),
  getItem('Customers', 'sub3', <TeamOutlined />, [getItem('Add New', '/newcustomer'), getItem('View List', '/customerlist')]),
];

function Sidebar() {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  return (
    <div style={{display:'flex'}}>
        <Layout
        style={{
            minHeight: '100vh',
            
        }}
        >
        <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
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
        <div style={{diplay: 'flex', paddingTop: '30px', paddingLeft:'40px'}}>
        <ContentComponent />
        </div>
        </Layout>
    </div>
  )
}

export default Sidebar