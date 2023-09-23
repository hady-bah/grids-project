import React from 'react';
import { LaptopOutlined, NotificationOutlined, UserOutlined, PoweroffOutlined } from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme, Button } from 'antd';
import { Divider } from 'antd';
import Logo from "../images/BAHSoftwareSolutionsLogo.png";
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
      <div className="logout-position">
        <button className="logout-button"><PoweroffOutlined /></button>
      </div>

    </div>
    </>
  );
}

export default NavBar;





