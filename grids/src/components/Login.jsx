import React from 'react';
import { Button, Checkbox, Form, Input } from 'antd';
const onFinish = (values) => {
  console.log('Success:', values);
};
const onFinishFailed = (errorInfo) => {
  console.log('Failed:', errorInfo);
};
const App = () => (
  <Form
    name="basic"
    labelCol={{
      span: 8,
    }}
    wrapperCol={{
      span: 16,
    }}
    style={{
      maxWidth: 600,
    }}
    initialValues={{
      remember: true,
    }}
    onFinish={onFinish}
    onFinishFailed={onFinishFailed}
    autoComplete="off"
  >
    <Form.Item
      label="Username"
      name="username"
      rules={[
        {
          required: true,
          message: 'Please input your username!',
        },
      ]}
    >
      <Input />
    </Form.Item>

    <Form.Item
      label="Password"
      name="password"
      rules={[
        {
          required: true,
          message: 'Please input your password!',
        },
      ]}
    >
      <Input.Password />
    </Form.Item>

    <Form.Item
      name="remember"
      valuePropName="checked"
      wrapperCol={{
        offset: 8,
        span: 16,
      }}
    >
      <Checkbox>Remember me</Checkbox>
    </Form.Item>

    <Form.Item
      wrapperCol={{
        offset: 8,
        span: 16,
      }}
    >
      <Button type="primary" htmlType="submit">
        Submit
      </Button>
    </Form.Item>
  </Form>
);
export default App;


// import React from 'react';
// import { supabase } from '../../createClient';
// import { ThemeSupa } from '@supabase/auth-ui-shared';
// import { Auth } from '@supabase/auth-ui-react';
// import { useNavigate } from 'react-router-dom';

// function Login() {
//     const navigate = useNavigate();


//     supabase.auth.onAuthStateChange(async(event)=>{
//         if(event !== "SIGNED_OUT"){
//             navigate("/applayout");
//         }else{
//             navigate("/")
//         }
//         })  

    
//   return (
//     <>
//     <div>
//          <header>
//            <Auth
//              supabaseClient={supabase}
//              appearance={{theme: ThemeSupa}}
//              theme = "dark"
//            />
//          </header>
//        </div>
//     </>
//   )
// }

// export default Login

