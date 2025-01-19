import React from 'react';
import { Layout } from 'antd';
import Header from '../Header/Header';
import SideBar from '../Sidebar/SideBar';
import { Outlet } from 'react-router-dom';  // This is important for rendering nested routes

const { Content: AntContent } = Layout;

const MainLayout = () => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <div style={{ position: 'sticky', top: 0, zIndex: 1, width: '100%' }}>
        <Header />
      </div>
      <Layout>
        <SideBar />
        <Layout style={{ marginLeft: '120px' }}>
          <AntContent style={{ margin: '8px 8px 0', height: '100%' }}>
            <div className="content">
              <Outlet /> 
            </div>
          </AntContent>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default MainLayout;