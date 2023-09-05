import React from 'react'
import { LaptopOutlined, NotificationOutlined, UserOutlined } from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
const { Header, Content, Sider } = Layout;
import { Divider } from 'antd';
import Logo from "../images/GridsIcon.png";
import { Typography } from 'antd';

const { Title } = Typography;

function NavBar() {
    const {
        token: { colorBgContainer },
      } = theme.useToken();
  return (
    <Layout>
      <Header
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div className="demo-logo" />
        <Menu theme="dark" mode="horizontal"/>
        <img
            src={Logo}
            alt="Logo"
            style={{ width: "35px", height: "auto", marginLeft: "-35px", padding:'0px'}}
          />
          <Title level={4} style={{color:'white'}}>Grids</Title>
      </Header>
    </Layout>
  )
}

export default NavBar