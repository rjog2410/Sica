// useErrorHandler.ts
import { useEffect } from 'react';
import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import { useNotification } from '../providers/NotificationProvider';

const useErrorHandler = () => {
  const { notify } = useNotification();
  const { reset } = useQueryErrorResetBoundary();

  useEffect(() => {
    const handleError = (error: Error) => {
      // Posponemos la llamada para asegurar que no interfiere con el renderizado
      setTimeout(() => notify(error.message, 'error'), 0);
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      handleError(event.reason);
      reset();
    };

    const handleGlobalError = (event: ErrorEvent) => {
      handleError(event.error);
      reset();
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleGlobalError);

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('error', handleGlobalError);
    };
  }, [notify, reset]);
};

export default useErrorHandler;
