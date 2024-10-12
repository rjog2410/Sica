// Archivo: routes.ts
// Path: /src/routes.ts

import ConsultaBatchPage from './pages/Administracion/ConsultaBatchPage';
import ConsultaCargaAOPage from './pages/Administracion/ConsultaCargaAOPage';
import ConsultaCargaSIFPage from './pages/Administracion/ConsultaCargaSIFPage';
import Auth from './pages/Auth';
import ColumnasPage from './pages/Catalogos/ColumnasPage';
import CuentaPage from './pages/Catalogos/CuentaPage.tsx';
import ModulosPage from './pages/Catalogos/ModulosPage';
import SistemasPage from './pages/Catalogos/SistemasPage';
import ConciliacionSaldosPage from './pages/Consultas/ConciliacionSaldosPage';
import UsuariosPage from './pages/Autenticacion/Usuarios/UsuariosPage.tsx';
import RolesPage from './pages/Autenticacion/Roles/RolesPage.tsx';
// import ConsultaDetallePage from './pages/Consultas/ConsultaDetallePage';
import Home from './pages/Home';
import ExtraccionSIFPage from './pages/Procesos/ExtraccionSIFPage';
import TraductorPage from './pages/Procesos/TraductorPage';
import ReporteConciliacionSaldosPage from './pages/Reportes/ReporteConciliacionSaldosPage';

const routes = [
  {
    path: '/',
    name: 'Home',
    menuOnly: false,
    component: Home
  },
  {
    path: '/auth',
    name: 'Auth',
    component: Auth,  // Define que el componente Auth se renderice en esta ruta
    hidden: true,
    subroutes: [
      {
        path: '/sica/Autenticacion/usuarios',
        name: 'Usuarios',
        component: UsuariosPage // Ejemplo de subruta con componente
      },
      {
        path: '/sica/autenticacion/rol',
        name: 'Roles',
        component: RolesPage 
      },
    ]
  },
  {
    path: '/sica/catalogos',
    name: 'Catalogos',
    menuOnly: true, // Añade la propiedad menuOnly para rutas que solo actúan como menú
    subroutes: [
      {
        path: '/sica/catalogos/sistemas',
        name: 'Sistemas',
        component: SistemasPage // Ejemplo de subruta con componente
      },
      {
        path: '/sica/catalogos/modulos',
        name: 'Modulos',
        component: ModulosPage // Otro ejemplo de subruta
      },
      {
        path: '/sica/catalogos/columna',
        name: 'Columnas',
        component: ColumnasPage // Otro ejemplo de subruta
      },
      {
        path: '/sica/catalogos/cuentas',
        name: 'Cuentas',
        component: CuentaPage // Otro ejemplo de subruta
      },
    ]
  },
  {
    path: '/sica/procesos',
    name: 'Procesos',
    menuOnly: true, // Añade la propiedad menuOnly para rutas que solo actúan como menú
    subroutes: [
      {
        path: '/sica/procesos/extraccionsif',
        name: 'Extraccion SIF',
        component: ExtraccionSIFPage // Ejemplo de subruta con componente
      },
      {
        path: '/sica/procesos/traductor',
        name: 'Traductor',
        component: TraductorPage // Ejemplo de subruta con componente
      },
    ]
  },
  {
    path: '/sica/consulta',
    name: 'Consulta',
    menuOnly: true, // Añade la propiedad menuOnly para rutas que solo actúan como menú
    subroutes: [
      {
        path: '/sica/consulta/conciliacion-saldos',
        name: 'Conciliacion de Saldos',
        component: ConciliacionSaldosPage
      },
      // {
      //   path: '/consulta/consulta-detalle',
      //   name: 'Consulta Detalle',
      //   component: ConsultaDetallePage 
      // },
    ]
  },
  {
    path: '/sica/reportes',
    name: 'Reportes',
    menuOnly: true, // Añade la propiedad menuOnly para rutas que solo actúan como menú
    subroutes: [
      {
        path: '/sica/reportes/conciliacion-saldos',
        name: 'Conciliacion de Saldos',
        component: ReporteConciliacionSaldosPage
      },
    ]
  },
  {
    path: '/sica/administracion',
    name: 'Administración',
    menuOnly: true, // Añade la propiedad menuOnly para rutas que solo actúan como menú
    subroutes: [
      {
        path: '/sica/administración/consulta-carga-ao',
        name: 'Consulta Carga AO',
        component: ConsultaCargaAOPage
      },
      {
        path: '/sica/administración/consulta-carga-sif',
        name: 'Consulta Carga SIF',
        component: ConsultaCargaSIFPage
      },
      {
        path: '/sica/administración/consulta-bach',
        name: 'Procesos Batch',
        component: ConsultaBatchPage
      }
    ]
  }
];

export default routes;












// // Archivo: routes.ts
// // Path: /src/routes.ts

// import Home from './pages/Home';
// import About from './pages/Home'; // Corrige las importaciones incorrectas
// import AboutDetails from './pages/Home';
// import Contact from './pages/Home';

// const routes = [
//   {
//     path: '/',
//     name: 'Home',
//     component: Home
//   },
//   {
//     path: '/about',
//     name: 'About',
//     component: About,
//     subroutes: [
//       {
//         path: '/about/details',
//         name: 'Details',
//         component: AboutDetails
//       }
//     ]
//   },
//   {
//     path: '/contact',
//     name: 'Contact',
//     component: Contact
//   },
//   {
//     path: '/menuOnly',
//     name: 'Menu Only',
//     menuOnly: true, // Añade la propiedad menuOnly para rutas que solo actúan como menú
//     subroutes: [
//       {
//         path: '/menuOnly/subroute1',
//         name: 'Subroute 1',
//         component: Contact // Ejemplo de subruta con componente
//       },
//       {
//         path: '/menuOnly/subroute2',
//         name: 'Subroute 2',
//         component: About // Otro ejemplo de subruta
//       }
//     ]
//   },
// ];

// export default routes;
