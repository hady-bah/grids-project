import React from 'react'
import { LaptopOutlined, NotificationOutlined, UserOutlined } from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
const { Header, Content, Sider } = Layout;
import { Divider } from 'antd';
import Logo from "../images/GridsIcon.png";
import { Typography } from 'antd';
import '../styles/nav.css'

const { Title } = Typography;

function NavBar() {
    const {
        token: { colorBgContainer },
      } = theme.useToken();
  return (
    <>
    <Layout>
      <Header
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position:'fixed',
          height: '50px',
    width: '100%', 
    zIndex: 1,
         
        }}
      >
        <div className="demo-logo" />
        <Menu theme="dark" mode="horizontal"/>
        <img
            src={Logo}
            alt="Logo"
            style={{ width: "35px", height: "auto"}}
          />
          <Title level={4} style={{color:'white'}}>Grids</Title>
      </Header>
    </Layout>

    </>

  )
}

export default NavBar


