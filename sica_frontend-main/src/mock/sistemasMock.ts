import { Sistema } from "../types";

export const mockFetchSistemas = async (): Promise<Sistema[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                { sis_clave: 'FIDUCIA', sis_nombre: 'SISTEMA DE FIDEICOMISOS' },
                { sis_clave: 'CONFID', sis_nombre: 'CONTABILIDAD FIDUCIARIA' },
                { sis_clave: 'TAS', sis_nombre: 'TECNOLOGIA ASESORIA Y SISTEMAS' },
                { sis_clave: 'SIRAC', sis_nombre: 'SISTEMA DE RECUPERACION Y ADMON CARTERA' },
                { sis_clave: 'GVAL', sis_nombre: 'GUARDA VALORES' },
                { sis_clave: 'SIPE', sis_nombre: 'SISTEMA DE INVERSIONES Y PRESTAMOS' },
                { sis_clave: 'MECA', sis_nombre: 'MERCADO DE CAPITALES' },
                { sis_clave: 'SIDECA', sis_nombre: 'SISTEMA DERIVADOS Y CAMBIOS' },
                { sis_clave: 'LOBORH', sis_nombre: 'SISTEMA DE ADMINISTRACION CAPITAL HUMANO' },
            ]);
        }, 1000); // Simula un retraso de 1 segundo
    });
};

export const mockFetchSistemaByClave = async (sis_clave: string): Promise<Sistema | null> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const sistemas: Sistema[] = [
                { sis_clave: 'FIDUCIA', sis_nombre: 'SISTEMA DE FIDEICOMISOS' },
                { sis_clave: 'CONFID', sis_nombre: 'CONTABILIDAD FIDUCIARIA' },
                { sis_clave: 'TAS', sis_nombre: 'TECNOLOGIA ASESORIA Y SISTEMAS' },
                { sis_clave: 'SIRAC', sis_nombre: 'SISTEMA DE RECUPERACION Y ADMON CARTERA' },
                { sis_clave: 'GVAL', sis_nombre: 'GUARDA VALORES' },
                { sis_clave: 'SIPE', sis_nombre: 'SISTEMA DE INVERSIONES Y PRESTAMOS' },
                { sis_clave: 'MECA', sis_nombre: 'MERCADO DE CAPITALES' },
                { sis_clave: 'SIDECA', sis_nombre: 'SISTEMA DERIVADOS Y CAMBIOS' },
                { sis_clave: 'LOBORH', sis_nombre: 'SISTEMA DE ADMINISTRACION CAPITAL HUMANO' },
            ];

            const sistema = sistemas.find(s => s.sis_clave === sis_clave);
            resolve(sistema || null);
        }, 1000); // Simula un retraso de 1 segundo
    });
};

export const mockDeleteSistema = async (sis_clave: string): Promise<string | null> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(sis_clave);
        }, 500);
    });
};

export const mockDeleteMultipleSistemas = async (sis_claves: string[]): Promise<string[] | null> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(sis_claves);
        }, 1000);
    });
};

export const mockCreateOrUpdateSistema = async (sistema: Sistema): Promise<string | null> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(sistema.sis_clave);
        }, 1000);
    });
};
