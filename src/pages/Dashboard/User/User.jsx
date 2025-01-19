import React, { useState, useEffect, useContext } from "react";
import { Typography, Button, Avatar, Spin, notification } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom"; 
import { HomeContext } from "../../../Context/HomeContext";
import axios from 'axios';
import "./User.css";
import baseUrl from "../../../../apiConfig";

const { Title, Text } = Typography;

const CashierDetails = () => {
  const [cashier, setCashier] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { setIsAuthenticated, isAuthenticated } = useContext(HomeContext);

  const fetchToken = async () => {
    return localStorage.getItem('accessToken');
  };

  useEffect(() => {
    const fetchCashierDetails = async () => {
      try {
        const token = await fetchToken();
        if (!token) {
          notification.error({
            message: 'Authentication Error',
            description: 'No access token found. Please log in.',
          });
          navigate('/login');
          return;
        }

        const response = await axios.get(`${baseUrl}:3003/employee`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log('Cashier details:', response.data);
        setCashier(response.data);
      } catch (error) {
        console.error('Error fetching cashier details:', error);
        notification.error({
          message: 'Error',
          description: 'Failed to load cashier details.',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCashierDetails();
  }, [isAuthenticated, navigate]);


  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    setIsAuthenticated(false);
    console.log("Logging out...");
    navigate('/landing'); 
  };

  const {
    employee_name: name,
    employee_email: email,
    photo_url: photoUrl,
    role,
  } = cashier;

  return (
    <div className="cashier-details-container">
      {loading ? (
        <div className="loading-spinner">
          <Spin size="large" />
        </div>
      ) : (
        <div className="cashier-details-content">
          <div className="cashier-info">
            <Title level={3}>{name || 'Unknown'}</Title>

            <div className="cashier-info-row">
              <Text strong>Email:</Text>
              <Text>{email || 'Not provided'}</Text>
            </div>
            
            <hr />

            <div className="cashier-info-row">
              <Text strong>Role:</Text>
              <Text>{role || 'Not specified'}</Text>
            </div>

            <Button type="primary" danger onClick={handleLogout} className="logout-button">
              Logout
            </Button>
          </div>

          <div className="cashier-avatar">
            <Avatar
              size={180}
              src={photoUrl || null}
              icon={<UserOutlined />}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CashierDetails;