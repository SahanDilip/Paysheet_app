import React from "react";
import "./Login.css";
import { Form, Input, Button, Checkbox, message } from "antd";
import {
  UserOutlined,
  LockOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
} from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 
import baseUrl from "../../../apiConfig";
import { logos } from "../../assets/assets";


export default function Login({ setIsAuthenticated }) {
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  const onFinish = (values) => {
    if(values.username === "GrayKitchen" && values.password === "1234") {
      setIsAuthenticated(true);
      navigate("/dashboard");
    }
};
  return (
    <div className="login-container">
      {contextHolder}
      <div className="image-section">
        <img src={logos.welcome_img} alt="Welcome" />
      </div>
      <div className="form-section">
        <h1>Welcome Back! <br /> Login to your account</h1>
        <Form
          name="normal_login"
          className="login-form"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: "Please input your Username!",
              },
            ]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Username"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your Password!",
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              placeholder="Password"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button">
              Log In
            </Button>
          </Form.Item>

          <div className="remember-forgot">
            <Checkbox className="remember-me-checkbox">Remember me</Checkbox>
            <a className="login-form-forgot" href="#">
              Forgot password
            </a>
          </div>

          <div className="register-link">
            <p>
              Don't have an account? <a href="#">Register</a>
            </p>
          </div>
        </Form>
      </div>
    </div>
  );
}