import React, { useRef, useState, useEffect } from "react";
import { LaptopOutlined, NotificationOutlined, UserOutlined, LogoutOutlined, SettingOutlined } from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme, Button, Modal, Tooltip, message} from 'antd';
import { Divider } from 'antd';
import { Typography } from 'antd';
import '../styles/nav.css';
import { supabase } from "../../createClient";
import logoImage from "../assets/gridsofflogo.png"; // Adjust the path based on your file structure


const { Header, Content, Sider } = Layout;
const { Title, Text } = Typography;

function NavBar() {
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [settingModalOpen, setSettingModalOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [session, setSession] = useState(null);
  const [userEmail, setUserEmail] = useState(null); // State to store the user's email
  const [createdAt, setCreatedAt] = useState(null);
  const [lastSignInAt, setLastSignInAt] = useState(null);
  const [updatedAt, setUpdatedAt] = useState(null);

  useEffect(() => {
    // Fetch the current user session and update the state
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);

      // Set the user's email if available in the session
      if (session?.user?.email) {
        setUserEmail(session.user.email);
        setCreatedAt(session.user.created_at);
        setLastSignInAt(session.user.last_sign_in_at);
        setUpdatedAt(session.user.updated_at);
      }
    });

    // Subscribe to changes in the authentication state
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);

      // Set the user's email if available in the session
      if (session?.user?.email) {
        setUserEmail(session.user.email);
        setCreatedAt(session.user.created_at);
        setLastSignInAt(session.user.last_sign_in_at);
        setUpdatedAt(session.user.updated_at);
      }
    });

    // Unsubscribe from the authentication state changes when the component is unmounted
    return () => subscription.unsubscribe();
  }, []);
  
  

  const handleLogout = async () => {
    // Perform logout logic using Supabase
    const { error } = await supabase.auth.signOut();

    if (error) {
      message.error("Logout error:", error.message);
    } else {
      // Close the logout modal and update any necessary state
      setLogoutModalOpen(false);
    }
  };


  return (
    <>
      <div className="blured-navbar">
          <div className="logo-container-nav">
            <span>
            <img src={logoImage} alt="Grids Logo" className="logo-img" />
            </span>
          </div>
        <div className="right-buttons-position">
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
        <p><strong>Email: </strong> {userEmail} </p>
        <p><strong>Created: </strong> {createdAt ? new Date(createdAt).toLocaleDateString('en-US', { timeZone: 'America/New_York' }) : 'N/A'}</p>
        <p><strong>Last Sign In: </strong> {lastSignInAt ? new Date(lastSignInAt).toLocaleString('en-US', { timeZone: 'America/New_York' }) : 'N/A'}</p>
      </Modal>

      <Modal
        title="Settings"
        centered
        visible={settingModalOpen}
        onOk={() => setSettingModalOpen(false)}
        onCancel={() => setSettingModalOpen(false)}
      >
        <p><strong>Software: </strong>Grids</p>
        <p><strong>Version: </strong><Text code>gOS 0.1</Text></p>
        <p><strong>Region/Time Zone: </strong>Eastern Standard Time</p>
        <p><strong>Developed By: </strong>BAH Software &copy;</p>
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

