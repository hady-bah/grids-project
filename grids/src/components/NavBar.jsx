import React, { useRef, useState, useEffect } from "react";
import { LaptopOutlined, NotificationOutlined, UserOutlined, LogoutOutlined, SettingOutlined } from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme, Button, Modal, Tooltip, } from 'antd';
import { Divider } from 'antd';
import { Typography } from 'antd';
import '../styles/nav.css';
import { supabase } from "../../createClient";

const { Header, Content, Sider } = Layout;
const { Title } = Typography;

function NavBar() {
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [settingModalOpen, setSettingModalOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  const handleLogout = async () => {
    // Perform logout logic using Supabase
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Logout error:", error.message);
    } else {
      // Close the logout modal and update any necessary state
      setLogoutModalOpen(false);
    }
  };

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
            <button className="nav-buttons" onClick={() => setLogoutModalOpen(true)}>
            <LogoutOutlined />
            </button>
          </Tooltip>
        </div>
      </div>

      <Modal
        title="User Information"
        centered
        visible={userModalOpen}
        onOk={() => setUserModalOpen(false)}
        onCancel={() => setUserModalOpen(false)}
      >
        <p>some contents...</p>
        <p>some contents...</p>
        <p>some contents...</p>
      </Modal>

      <Modal
        title="Settings"
        centered
        visible={settingModalOpen}
        onOk={() => setSettingModalOpen(false)}
        onCancel={() => setSettingModalOpen(false)}
      >
        <p>settings</p>
      </Modal>

      <Modal
        title="Log out"
        centered
        visible={logoutModalOpen}
        onOk={handleLogout}
        onCancel={() => setLogoutModalOpen(false)}
      >
        <p>Click OK to continue</p>
      </Modal>
    </>
  );
}

export default NavBar;

