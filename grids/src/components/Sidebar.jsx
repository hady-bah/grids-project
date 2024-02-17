import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ContentComponent from '../Layouts/ContentComponent';
import {
  BarChartOutlined,
  AppstoreOutlined,
  SnippetsOutlined,
  HomeOutlined,
  TeamOutlined,
  EnvironmentOutlined,
  FileSearchOutlined,
} from '@ant-design/icons';
import { Layout, Menu, theme } from 'antd';
import '../styles/nav.css';

const { Sider, Content } = Layout;

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const items = [
  getItem('Dashboard', '/', <BarChartOutlined />),
  getItem('Transfers', '/transfers', <FileSearchOutlined />),
  getItem('New Transfer', '/receipt', <SnippetsOutlined />),
  getItem('Places', '/places', <EnvironmentOutlined />),
  getItem('Customers', '/customers', <TeamOutlined />),
];

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <>
      <div style={{ display: 'flex' }}>
        <Layout>
          <Sider
            theme="dark"
            style={{
              overflow: 'auto',
              height: '100vh',
              position: 'fixed',
              paddingTop: '20px',
              backgroundColor: 'black', // Change the background color
              color: 'white', // Change the text color
            }}
          >
            <div className="demo-logo-vertical" />
            <Menu
              onClick={({ key }) => {
                navigate(key);
              }}
              theme="dark"
              defaultSelectedKeys={[location.pathname]}
              mode="inline"
              items={items}
              style={{
                backgroundColor: 'black', // Change the background color
                color: 'white', // Change the text color
              }}
            />
          </Sider>
          <Layout className="site-layout">
            <Content
              style={{
                marginLeft: 200,
                paddingTop: '100px',
                overflowX: 'hidden',
                backgroundColor: 'rgba(255, 255, 255)',
              }}
            >
              <div
                style={{
                  padding: 30,
                }}
              >
                <ContentComponent />
              </div>
            </Content>
          </Layout>
        </Layout>
      </div>
    </>
  );
}

export default Sidebar;