// // Archivo: App.tsx
// // Path: /src/App.tsx

// import React from 'react';
// import { Router } from 'wouter';
// import Layout from './layout/Layout';
// import routes from './routes';
// import { Route } from 'react-router-dom';

// const App: React.FC = () => {
//   return (
//     <Router>
//       <Layout routes={routes} />
//     </Router>
//   );
// };

// export default App;
// App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Usa react-router-dom en lugar de wouter
import Layout from './layout/Layout';
import routes from './routes';

const App: React.FC = () => {
  return (
    <Router>
      <Layout routes={routes} />
    </Router>
  );
};

export default App;
