// Archivo: sidebarStyles.ts
// Path: /src/styles/sidebarStyles.ts

export const useSidebarStyles = (theme: any) => ({
  hoverStyle: {
    color: "#00708F",
    '&:hover': {
      backgroundColor: "#C4E7F6",
    },
  },
  selectedStyle: {
    backgroundColor: '#00708F',
    '&:hover': {
      backgroundColor: '#00708F',
    },
  },
  subMenuStyle: {
    backgroundColor: '#ABD2E3',
  },
  paperStyle: {
    display: 'flex',
    backgroundColor: theme?.palette?.sidebar?.background || '#FFFFFF', // Valor por defecto si `sidebar.background` es undefined
    color: theme?.palette?.menuItem?.primary || '#000000', // Valor por defecto si `menuItem.primary` es undefined
    width: 240,
    top: 64,
    height: '100%',
    overflow: 'hidden',
    borderRight: `2px solid ${theme?.palette?.sidebar?.NAFIN || '#CCCCCC'}`, // Valor por defecto si `sidebar.NAFIN` es undefined
    transition: theme?.transitions?.create(['width', 'margin'], {
      easing: theme?.transitions?.easing?.easeInOut || 'ease-in-out',
      duration: theme?.transitions?.duration?.standard || 300,
    }),
  },
  collapsedPaperStyle: {
    width: 64,
    height: '100%',
    borderRight: `2px solid ${theme?.palette?.divider || '#CCCCCC'}`, // Valor por defecto si `divider` es undefined
    transition: theme?.transitions?.create(['width', 'margin'], {
      easing: theme?.transitions?.easing?.easeInOut || 'ease-in-out',
      duration: theme?.transitions?.duration?.standard || 300,
    }),
  },
});




// export const drawerWidth = 240;
// export const collapsedWidth = 64;

// export const useSidebarStyles = (theme: any) => ({
//   hoverStyle: {
//     color: "#00708F",
//     '&:hover': {
//       backgroundColor: "#C4E7F6",
//     },
//   },
//   selectedStyle: {
//     backgroundColor: '#00708F',
//     '&:hover': {
//       backgroundColor: '#00708F',
//     },
//   },
//   subMenuStyle: {
//     backgroundColor: '#ABD2E3',
//   },
//   paperStyle: {
//     display: 'flex',
//     backgroundColor: theme.palette.sidebar.background,
//     color: theme.palette.menuItem.primary,
//     width: drawerWidth,
//     top: 64,
//     height: '100%',
//     overflow: 'hidden',
//     borderRight: `2px solid ${theme.palette.sidebar.NAFIN}`,
//     transition: theme.transitions.create(['width', 'margin'], {
//       easing: theme.transitions.easing.easeInOut,
//       duration: theme.transitions.duration.standard,
//     }),
//   },
//   collapsedPaperStyle: {
//     width: collapsedWidth,
//     height: '100%',
//     borderRight: `2px solid ${theme.palette.divider}`,
//     transition: theme.transitions.create(['width', 'margin'], {
//       easing: theme.transitions.easing.easeInOut,
//       duration: theme.transitions.duration.standard,
//     }),
//   },
//   theme: theme
// });



