import React, { useState, useEffect } from "react";
import "./styles/App.css";
import Sidebar from "./components/Sidebar";
import NavBar from "./components/NavBar";
import ContentComponent from "./Layouts/ContentComponent";
import { FloatButton } from "antd";
import { ConfigProvider } from "antd";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "../createClient";
import logoImage from "./assets/gridsofflogo.png"; 


function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    // Fetch the current user session and update the state
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Subscribe to changes in the authentication state
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    // Unsubscribe from the authentication state changes when the component is unmounted
    return () => subscription.unsubscribe();
  }, []);

  return (
    <>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#28282B",
            borderRadius: 5,
            colorPrimaryBg: "white",
          },
        }}
      >
        <div>
          {/* Render authentication UI if no session */}
          {!session ? (
            <div className="authContainer">
              <div className="logo-container">
              <img src={logoImage} alt="Grids Logo" className="logo-img" />
              </div>
              <div className="logo-container">
              <p className="logo-title">Grids</p>
              </div>
              <div className="logo-container">
              <p className="logo-title">Private application from BAH Software &copy;</p>
              </div>
              <Auth
                supabaseClient={supabase}
                appearance={{
                  theme: ThemeSupa,
                  variables: {
                    default: {
                      colors: {
                        brand: "#28282B",
                        brandAccent: "#28282B",
                      },
                    },
                  },
                }}
                providers={[]}
                showLinks={false}
              />
            </div>
          ) : (
            <div>
              {/* Main layout container */}
              <div>
                <div>
                  <NavBar />
                </div>
                <div>
                  <Sidebar />
                </div>
              </div>
              {/* Back to top button */}
              <FloatButton.BackTop />
            </div>
          )}
        </div>
      </ConfigProvider>
    </>
  );
}

export default App;


