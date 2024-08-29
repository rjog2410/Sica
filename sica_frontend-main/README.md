## SICA - FRONTEND

# Descripción:
El sistema SICA es parte de una arquitectura basada en microservicios diseñada para ofrecer una solución modular y escalable. Este repositorio contiene el frontend del sistema, que está desarrollado utilizando tecnologías modernas para garantizar una interfaz de usuario robusta y fácil de usar.

# Estructura del Proyecto:
El código fuente está organizado de manera modular para facilitar la mantenibilidad y la escalabilidad del proyecto. A continuación, se detalla la estructura principal:

src/: Carpeta raíz del proyecto que contiene todo el código fuente.
Pages/: Carpeta que agrupa todas las pantallas y subpantallas organizadas por módulos.
Catalogos/: Primer módulo disponible para pruebas.
modales/: Contiene los componentes modales para el CRUD de los registros.
selectores/: Contiene los archivos de "decisión", donde se configura si se usan mocks o se conecta a la API. Por defecto, el sistema utiliza mocks. Para conectarse a la API real, simplemente establece el valor en "false" y edita la URL de la API.
servicios/: Contiene las funciones de peticiones a la API. En un entorno real, este es el código que se utiliza cuando se desconecta el mock.

# Uso
Requisitos Previos
Node.js (versión 14 o superior)
npm (versión 6 o superior)
Instalación de Dependencias
Antes de iniciar el proyecto, asegúrate de instalar todas las dependencias necesarias:

npm install
Ejecución del Proyecto
Para iniciar el frontend de SICA, puedes utilizar uno de los siguientes scripts:

# Levantar el proyecto:
start_SICA_front.sh: Este script está diseñado para levantar únicamente el frontend del sistema. Es ideal para el desarrollo y pruebas de la interfaz de usuario.

./start_SICA_front.sh
start_servers.sh: Este script se utiliza para levantar tanto el frontend como otros servicios asociados que puedan ser necesarios para un entorno de desarrollo más completo.

./start_servers.sh
Recomendación: Para comenzar, sugerimos utilizar start_SICA_front.sh para levantar únicamente el frontend, esto se usara para pruebas posteriores.

# Configuración de Conexión API/Mocks
El sistema está configurado por defecto para utilizar mocks. Esto es ideal para el desarrollo y pruebas sin necesidad de conectarse a una API real. Para cambiar a la API real:

1) Navega a la carpeta selectores dentro del módulo que estás trabajando, por ejemplo, src/Pages/Catalogos/selectores/.
2) Cambia el valor de useMock a false en el archivo correspondiente.
3) Asegúrate de editar la URL de la API en el archivo de servicios dentro de la carpeta servicios.

# Estructura de Carpetas
modales/: Componentes modales para la creación, actualización, eliminación y visualización de registros.
selectores/: Lógica de selección para decidir si utilizar mocks o servicios de API reales.
servicios/: Implementaciones de las llamadas a la API, que se utilizan en lugar de mocks en entornos de producción.