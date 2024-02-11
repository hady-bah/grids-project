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
            <div
              style={{ maxWidth: "400px", margin: "auto", marginTop: "150px"}}
            >
              <Auth
                supabaseClient={supabase}
                appearance={{ style: {
                  button: { background: '#28282B', color: 'white' },
                },}}
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












// //Pre Auth setup
// import React, { useState, useEffect } from "react";
// import "./styles/App.css";
// import Sidebar from "./components/Sidebar";
// import NavBar from "./components/NavBar";
// import ContentComponent from "./Layouts/ContentComponent";
// import { FloatButton } from 'antd';
// import { Button, ConfigProvider, Space } from 'antd';
// import { Auth } from '@supabase/auth-ui-react';
// import { ThemeSupa } from '@supabase/auth-ui-shared';
// import { supabase } from "../createClient";

// function App() {
//   const [count, setCount] = useState(0);

//   return (
//     <>
//     <ConfigProvider
//     theme={{
//       token: {
//         // Seed Token
//         colorPrimary: '#28282B',
//         borderRadius: 5,
//         colorPrimaryBg:'white'

//         // Alias Token
//         // colorBgContainer: '#f6ffed',
//       },
//     }}
//   >
//     <div>
//       <div>
//         <NavBar />
//       </div>
//       <div>
//         <Sidebar />
//       </div>
//       <FloatButton.BackTop />
//     </div>
//     </ConfigProvider>7
//     </>
//   );
// }

// export default App;
