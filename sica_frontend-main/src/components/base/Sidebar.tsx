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
          backgroundColor: '#E3E3E3',
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
            {/* Si es un menú padre o tiene subrutas, muestra el botón con ExpandMore */}
            <ListItemButton
              component={route.menuOnly ? 'div' : Link}
              href={route.menuOnly ? undefined : route.path}
              selected={!route.menuOnly && location === route.path}
              onClick={() => handleClick(route.name)}
              sx={{
                '&:hover': {
                  backgroundColor: '#01243D',
                  color: 'white',
                },
                '&.Mui-selected': {
                  backgroundColor: '#00708F',
                  color: '#fff',
                  borderWidth: 1,
                  '& .MuiListItemIcon-root, & .MuiListItemText-root': {
                    color: 'white',
                  },
                },
              }}
            >
              <ListItemText primary={route.name} />
              {/* Mostrar ExpandMore solo si tiene subrutas */}
              {route.subroutes && route.subroutes.length > 0 ? (
                open === route.name ? <ExpandLess /> : <ExpandMore />
              ) : null}
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
                        paddingLeft: 4,
                        '&:hover': {
                          backgroundColor: '#01243D',
                          color: 'white',
                        },
                        '&.Mui-selected': {
                          backgroundColor: '#00708F',
                          color: '#fff',
                          '& .MuiListItemIcon-root, & .MuiListItemText-root': {
                            color: '#fff',
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















