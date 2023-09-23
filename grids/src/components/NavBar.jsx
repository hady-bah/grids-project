import React from 'react';
import { LaptopOutlined, NotificationOutlined, UserOutlined } from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import { Divider } from 'antd';
import Logo from "../images/GridsIcon.png";
import { Typography } from 'antd';
import '../styles/nav.css';

const { Header, Content, Sider } = Layout;
const { Title } = Typography;

function NavBar() {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <>
    <div className="blured-navbar">

    </div>
    </>
  );
}

export default NavBar;





