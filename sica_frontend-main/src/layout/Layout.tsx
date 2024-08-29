// Archivo: Layout.tsx
// Path: /src/layout/Layout.tsx

import React, { useState } from 'react';
import Header from '../components/base/Header';
import Sidebar from '../components/base/Sidebar';
import Content from '../components/base/Content';
import { Box } from '@mui/material';
import { Route } from 'wouter';

interface LayoutProps {
  routes: { 
    path: string; 
    name: string; 
    component?: React.FC<any>; 
    menuOnly?: boolean; 
    subroutes?: { path: string; name: string; component: React.FC<any> }[] 
  }[];
}

const Layout: React.FC<LayoutProps> = ({ routes }) => {
  const [collapsed, setCollapsed] = useState(false);

  const handleDrawerToggle = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', padding:3, backgroundColor:'#00708F' }}>
      <Header handleDrawerToggle={handleDrawerToggle} />
      <Sidebar collapsed={collapsed} routes={routes} />
      <Content>
        {routes.map((route) => (
          <React.Fragment key={route.path}>
            <Route path={route.path}>
              {() => {
                const Component = route.component;
                return Component ? <Component /> : null;
              }}
            </Route>
            {route.subroutes?.map((subroute) => (
              <Route key={subroute.path} path={subroute.path}>
                {() => {
                  const SubComponent = subroute.component;
                  return SubComponent ? <SubComponent /> : null;
                }}
              </Route>
            ))}
          </React.Fragment>
        ))}
      </Content>
    </Box>
  );
};

export default Layout;
