import React, { useState, useEffect } from "react";
import { Typography, Avatar, Modal } from "antd";
import { UserOutlined, ClockCircleOutlined } from "@ant-design/icons";

import "./header.css";
import CashierDetails from "../../pages/Dashboard/User/User";

const Header = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentTime, setCurrentTime] = useState("");


  const handleProfileClick = () => {
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  useEffect(() => {
    const updateCurrentTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString());
    };

    updateCurrentTime(); 
    const intervalId = setInterval(updateCurrentTime, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="header_" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
  <Typography.Title level={2} style={{ margin: 0 }}>
    POS System
  </Typography.Title>
  
  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
    <div
      style={{
        display: "flex",
        alignItems: "center",
        background: "#f0f2f5", 
        borderRadius: "8px",
        padding: "10px 20px",
        marginRight: "18px",
      }}
    >
      <ClockCircleOutlined
        style={{ marginRight: "8px", fontSize: "18px", color: "#1890ff" }}
      />{" "}
      {/* Clock Icon */}
      <Typography.Text
        style={{ fontSize: "16px", fontWeight: "bold", color: "#333" }}
      >
        {currentTime}
      </Typography.Text>
    </div>
    
    <Avatar
      icon={<UserOutlined />}
      size={48}
      style={{ cursor: "pointer" }} 
      onClick={handleProfileClick}
    />
  </div>

  {/* Modal for displaying CashierDetails */}
  <Modal
    title="Cashier Details"
    visible={isModalVisible}
    onCancel={handleModalClose}
    footer={null}
    width={600}
  >
    <CashierDetails/>
  </Modal>
</div>

  );
};

export default Header;