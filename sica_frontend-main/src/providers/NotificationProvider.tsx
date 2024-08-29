import React, { createContext, useContext, ReactNode } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface NotificationContextType {
  notify: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void;
  notifyErrorWithStatus: (status: number, message: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const notify = (message: string, type: 'success' | 'error' | 'info' | 'warning') => {
    toast(message, { type });
  };

  const notifyErrorWithStatus = (status: number, message: string) => {
    if (status === 403) {
      notify('Necesita volver a iniciar sesión', 'error');
      // Lógica adicional para manejar el cierre de sesión
    } else {
      notify(message, 'error');
    }
  };

  return (
    <NotificationContext.Provider value={{ notify, notifyErrorWithStatus }}>
      {children}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </NotificationContext.Provider>
  );
};
