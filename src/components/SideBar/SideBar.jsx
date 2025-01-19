import React, { useState, useEffect } from "react";
import { HomeOutlined, HistoryOutlined } from "@ant-design/icons";
import { Layout, Menu } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import "./SideBar.css";

const { Sider } = Layout;

const items = [
  {
    key: "/dashboard",
    icon: <HomeOutlined />,
    label: "Home",
  },
  {
    key: "/dashboard/logs",
    icon: <HistoryOutlined />,
    label: "Logs",
  },
];

const SideBar = ({ onCollapse }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedKey, setSelectedKey] = useState(location.pathname);

  useEffect(() => {
    setSelectedKey(location.pathname);
  }, [location.pathname]);

  const onMenuClick = (e) => {
    setSelectedKey(e.key);
    navigate(e.key);
  };

  const handleCollapse = (value) => {
    setCollapsed(value);
    onCollapse(value);
  };

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      width={120}
      onCollapse={handleCollapse}
      theme="light"
      style={{
        overflow: "auto",
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 75,
        bottom: 0,
      }}
    >
      <Menu
        selectedKeys={[selectedKey]}
        mode="inline"
        theme="light"
        onClick={onMenuClick}
        style={{ paddingTop: 20 }}
      >
        {items.map((item) => (
          <Menu.Item
          className="menu-item"
            key={item.key}
            icon={item.icon}
            style={{ marginBottom: 1}}
          >
            <span>{item.label}</span>
          </Menu.Item>
        ))}
      </Menu>
    </Sider>
  );
};

export default SideBar;