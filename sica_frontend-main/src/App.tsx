// Archivo: App.tsx
// Path: /src/App.tsx

import React from 'react';
import { Router } from 'wouter';
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
