// main.tsx
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import { NotificationProvider } from './providers/NotificationProvider';
// Ejemplo simple de cómo crear un tema con propiedades personalizadas


ReactDOM.createRoot(document.getElementById('root')!).render(
  <NotificationProvider>

<ThemeProvider theme={theme}>
  <App />
</ThemeProvider>
</NotificationProvider>

);
