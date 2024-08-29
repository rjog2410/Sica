// Archivo: Sidebar.tsx
// Path: /src/components/base/Sidebar.tsx

import React from 'react';
import { Drawer, List, ListItemButton, ListItemText, Collapse } from '@mui/material';
import { Link, useLocation } from 'wouter';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

interface SidebarProps {
  collapsed: boolean;
  routes: { 
    path: string; 
    name: string; 
    component?: React.FC<any>; 
    menuOnly?: boolean; 
    subroutes?: { path: string; name: string; component: React.FC<any> }[] 
  }[];
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, routes }) => {
  const [open, setOpen] = React.useState<string | null>(null);
  const [location] = useLocation();

  const handleClick = (name: string) => {
    setOpen(open === name ? null : name);
  };

  return (
    <Drawer
      variant="persistent"
      sx={{
        width: collapsed ? 0 : 240,
        flexShrink: 0,
        height: 'calc(100vh - 64px)',
        marginTop: '64px',
        overflowX: 'hidden',

        '& .MuiDrawer-paper': {
          backgroundColor: '#E3E3E3', // Color de fondo del sidebar

          width: collapsed ? 0 : 240,
          height: 'calc(100vh - 64px)',
          transition: 'width 0.3s ease',
          boxSizing: 'border-box',
          marginTop: '64px',
          ...(collapsed && {
            visibility: 'hidden',
          }),
        },
      }}
      open={!collapsed}
    >
      <List>
        {routes.map((route) => (
          <React.Fragment key={route.name}>
            <ListItemButton
              component={route.menuOnly ? 'div' : Link}
              href={route.menuOnly ? undefined : route.path}
              selected={!route.menuOnly && location === route.path}
              onClick={() => handleClick(route.name)}
              sx={{
                '&:hover': {
                  backgroundColor: '#01243D', // Color de fondo al hacer hover
                  color: 'white', // Color del texto al hacer hover
                },
                '&.Mui-selected': {
                  backgroundColor: '#00708F', // Color de fondo cuando está seleccionado
                  color: '#fff', // Color de texto cuando está seleccionado
                  borderWidth:1,
                  '& .MuiListItemIcon-root, & .MuiListItemText-root': {
                    color: 'white', // Color de los íconos y texto cuando está seleccionado
                  },
                },
              }}
            >
              <ListItemText primary={route.name} />
              {route.subroutes ? (open === route.name ? <ExpandLess /> : <ExpandMore />) : null}
            </ListItemButton>
            {route.subroutes && (
              <Collapse in={open === route.name} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {route.subroutes.map((subroute) => (
                    <ListItemButton
                      key={subroute.name}
                      component={Link}
                      href={subroute.path}
                      selected={location === subroute.path}
              sx={{
                '&:hover': {
                  backgroundColor: '#01243D', // Color de fondo al hacer hover
                  color: 'white', // Color del texto al hacer hover
                },
                '&.Mui-selected': {
                  backgroundColor: '#00708F', // Color de fondo cuando está seleccionado
                  color: '#fff', // Color de texto cuando está seleccionado
                  '& .MuiListItemIcon-root, & .MuiListItemText-root': {
                    color: '#fff', // Color de los íconos y texto cuando está seleccionado
                  },
                },
              }}
                    >
                      <ListItemText primary={subroute.name} />
                    </ListItemButton>
                  ))}
                </List>
              </Collapse>
            )}
          </React.Fragment>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
















// import React from 'react';
// import { Drawer, List, ListItemButton, ListItemText, Collapse } from '@mui/material';
// import { Link, useLocation } from 'wouter';
// import ExpandLess from '@mui/icons-material/ExpandLess';
// import ExpandMore from '@mui/icons-material/ExpandMore';

// interface SidebarProps {
//   collapsed: boolean;
//   routes: { 
//     path: string; 
//     name: string; 
//     component?: React.FC<any>; 
//     menuOnly?: boolean; 
//     subroutes?: { path: string; name: string; component: React.FC<any> }[] 
//   }[];
// }

// const Sidebar: React.FC<SidebarProps> = ({ collapsed, routes }) => {
//   const [open, setOpen] = React.useState<string | null>(null);
//   const [location] = useLocation();

//   const handleClick = (name: string) => {
//     setOpen(open === name ? null : name);
//   };

//   return (
//     <Drawer
//       variant="persistent"
//       sx={{
//         width: collapsed ? 0 : 240,
//         flexShrink: 0,
//         height: 'calc(100vh - 64px)',
//         marginTop: '64px',
//         overflowX: 'hidden',
//         backgroundColor: '#f5f5f5', // Color de fondo del sidebar
//         '& .MuiDrawer-paper': {
//           width: collapsed ? 0 : 240,
//           height: 'calc(100vh - 64px)',
//           transition: 'width 0.3s ease',
//           boxSizing: 'border-box',
//           marginTop: '64px',
//           backgroundColor: '#f5f5f5', // Color de fondo del drawer
//           color: '#333', // Color del texto
//           ...(collapsed && {
//             visibility: 'hidden',
//           }),
//         },
//       }}
//       open={!collapsed}
//     >
//       <List>
//         {routes.map((route) => (
//           <React.Fragment key={route.name}>
//             <ListItemButton
//               component={route.menuOnly ? 'div' : Link}
//               href={route.menuOnly ? undefined : route.path}
//               selected={!route.menuOnly && location === route.path}
//               onClick={() => handleClick(route.name)}
//               sx={{
//                 '&:hover': {
//                   backgroundColor: '#e0e0e0', // Color de fondo al hacer hover
//                   color: '#000', // Color del texto al hacer hover
//                 },
//                 '&.Mui-selected': {
//                   backgroundColor: '#1976d2', // Color de fondo cuando está seleccionado
//                   color: '#fff', // Color de texto cuando está seleccionado
//                   '& .MuiListItemIcon-root, & .MuiListItemText-root': {
//                     color: '#fff', // Color de los íconos y texto cuando está seleccionado
//                   },
//                 },
//               }}
//             >
//               <ListItemText primary={route.name} />
//               {route.subroutes ? (open === route.name ? <ExpandLess /> : <ExpandMore />) : null}
//             </ListItemButton>
//             {route.subroutes && (
//               <Collapse in={open === route.name} timeout="auto" unmountOnExit>
//                 <List component="div" disablePadding>
//                   {route.subroutes.map((subroute) => (
//                     <ListItemButton
//                       key={subroute.name}
//                       component={Link}
//                       href={subroute.path}
//                       selected={location === subroute.path}
//                       sx={{
//                         paddingLeft: 4,
//                         '&:hover': {
//                           backgroundColor: '#e0e0e0', // Color de fondo para subruta al hacer hover
//                           color: '#000', // Color de texto para subruta al hacer hover
//                         },
//                         '&.Mui-selected': {
//                           backgroundColor: '#1976d2', // Color de fondo para subruta seleccionada
//                           color: '#fff', // Color de texto para subruta seleccionada
//                         },
//                       }}
//                     >
//                       <ListItemText primary={subroute.name} />
//                     </ListItemButton>
//                   ))}
//                 </List>
//               </Collapse>
//             )}
//           </React.Fragment>
//         ))}
//       </List>
//     </Drawer>
//   );
// };

// export default Sidebar;
