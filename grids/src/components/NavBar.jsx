import React, { useRef, useState, useEffect } from "react";
import { LaptopOutlined, NotificationOutlined, UserOutlined, PoweroffOutlined, SettingOutlined } from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme, Button, Modal, Tooltip, } from 'antd';
import { Divider } from 'antd';
import { Typography } from 'antd';
import '../styles/nav.css';

const { Header, Content, Sider } = Layout;
const { Title } = Typography;

function NavBar() {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const [userModalOpen, setUserModalOpen] = useState(false);
  const [settingModalOpen, setSettingModalOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  return (
    <>
    <div className="blured-navbar">
      <div className="logout-position">
        <Tooltip title="User Information" placement="bottom">
          <button className="nav-buttons" onClick={() => setUserModalOpen(true)}>
            <UserOutlined />
          </button>
        </Tooltip>

        <Tooltip title="Settings" placement="bottom">
          <button className="nav-buttons" onClick={() => setSettingModalOpen(true)}>
            <SettingOutlined />
          </button>
        </Tooltip>

        <Tooltip title="Logout" placement="bottom">
          <button className="nav-buttons">
            <PoweroffOutlined />
          </button>
        </Tooltip>

      </div>

    </div>

    <Modal
        title="User Information"
        centered
        open={userModalOpen}
        onOk={() => setUserModalOpen(false)}
        onCancel={() => setUserModalOpen(false)}
        userModalOpen
      >
        <p>some contents...</p>
        <p>some contents...</p>
        <p>some contents...</p>
      </Modal>

      <Modal
        title="Settings"
        centered
        open={settingModalOpen}
        onOk={() => setSettingModalOpen(false)}
        onCancel={() => setSettingModalOpen(false)}
        userModalOpen
      >
        <p>settings</p>
        
      </Modal>

    </>
  );
}

export default NavBar;




