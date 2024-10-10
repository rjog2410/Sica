// Archivo: Layout.tsx
// Path: /src/layout/Layout.tsx

import React, { useState } from 'react';
import Header from '../components/base/Header';
import Sidebar from '../components/base/Sidebar';
import Content from '../components/base/Content';
import { Box } from '@mui/material';
import { Route } from 'wouter';
import useAuthStore from '../store/authStore';

interface LayoutProps {
  routes: {
    path: string;
    name: string;
    component?: React.FC<any>;
    menuOnly?: boolean;
    subroutes?: { path: string; name: string; component: React.FC<any> }[];
    hidden: false
  }[];
}

const Layout: React.FC<LayoutProps> = ({ routes }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useAuthStore();

  const handleDrawerToggle = () => {
    setCollapsed(!collapsed);
  };

  // Función para verificar si el usuario tiene permiso para ver una ruta
  // const userHasPermissionForRoute = (routePath: string) => {
  //   return user?.permissions.includes(routePath); // Filtramos rutas según los permisos
  // };

  const userHasPermissionForRoute = (routePath: string, subroutes: { path: string }[] | undefined) => {
    const { user } = useAuthStore.getState();

    if (routePath === '/' || routePath === '/home') return true;

    if (!user || !user.permissions) return false;

    if (user.permissions.includes(routePath)) return true;

    if (subroutes && subroutes.length > 0) {
      return subroutes.some(subroute => user.permissions.includes(subroute.path));
    }

    return false;
  };

  const filterSubroutesWithPermissions = (subroutes: { path: string }[]) => {
    const { user } = useAuthStore.getState();
    if (!user || !user.permissions) return [];

    // Devolver solo las subrutas que tienen permisos
    return subroutes.filter(subroute => user.permissions.includes(subroute.path));
  };


//   //VERSION FINAL
//   return (
//     <Box sx={{ display: 'flex', height: '100vh', padding: 3, backgroundColor: '#00708F' }}>
//       <Header handleDrawerToggle={handleDrawerToggle} />
//       <Sidebar
//         collapsed={collapsed}
//         routes={routes
//           .filter(route => userHasPermissionForRoute(route.path, route.subroutes)) // Filtrar rutas principales
//           .map(route => ({
//             ...route,
//             subroutes: filterSubroutesWithPermissions(route.subroutes || []), // Filtrar subrutas permitidas
//           }))}
//       />
//       <Content>
//         {routes.map((route) => (
//           <React.Fragment key={route.path}>
//             <Route path={route.path}>
//               {() => {
//                 const Component = route.component;
//                 return Component ? <Component /> : null;
//               }}
//             </Route>
//             {route.subroutes?.map((subroute) => (
//               <Route key={subroute.path} path={subroute.path}>
//                 {() => {
//                   const SubComponent = subroute.component;
//                   return SubComponent ? <SubComponent /> : null;
//                 }}
//               </Route>
//             ))}
//           </React.Fragment>
//         ))}
//       </Content>
//     </Box>
//   );
// };

// export default Layout;


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