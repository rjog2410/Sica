import { Rol2 } from '../types';

export const mockFetchRoles = async (): Promise<Rol2[]> => {
  return [
    {
        id: 12,
        nombre: "ADMINISTRADOR",
        pantallasId: [1,2,3],
    },
    {
        id: 13,
        nombre: "ADMINISTRADOR4",
        pantallasId: [1,3,5,7],
    },
    {
        id: 1,
        nombre: "ADMIN_MAIK",
        pantallasId: [1,2,3,9,8,12]
    }
  ];
};

export const mockFetchRolById = async (id: number): Promise<Rol2 | undefined> => {
  const roles = await mockFetchRoles();
  return roles.find(rol => rol.id === id);
};

export const mockDeleteRol = async (rol: Rol2): Promise<{ status: number; message: string }> => {
  console.log(`Rol con id ${rol.id} eliminado (mock).`);
  return { status: 200, message: 'OK' };
};

export const mockDeleteMultipleRoles = async (roles: Rol2[]): Promise<{ status: number; message: string }> => {
  console.log(`Roles eliminados (mock):`, roles);
  return { status: 200, message: 'OK' };
};

export const mockCreateOrUpdateRol = async (rol: Rol2, isUpdate: boolean = false): Promise<{ status: number; message: string }> => {
  console.log(`${isUpdate ? 'Actualizando' : 'Creando'} rol (mock):`, rol);
  return { status: 200, message: 'OK' };
};
