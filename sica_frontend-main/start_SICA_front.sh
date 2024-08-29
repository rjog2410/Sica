#!/bin/bash

function error_exit {
  echo "$1" >&2
  exit 1
}

function check_npm {
  command -v npm >/dev/null 2>&1 || error_exit "npm no está instalado. Por favor, instala Node.js y npm primero."
}

function install_dependencies {
  echo "Instalando dependencias del frontend..."
  npm install || error_exit "Error al instalar las dependencias."
}

function clean_and_install {
  echo "Limpiando caché de npm..."
  npm cache clean --force || error_exit "Error al limpiar la caché de npm."
  echo "Eliminando node_modules..."
  rm -rf node_modules || error_exit "Error al eliminar node_modules."
  install_dependencies
}

function start_frontend {
  echo "Iniciando el frontend..."
  npm run dev || error_exit "Error al iniciar el frontend."
}

function show_help {
  echo "Uso: $0 [-c] [-h]"
  echo ""
  echo "Opciones:"
  echo "  -c    Limpia la caché de npm y reinstala las dependencias."
  echo "  -h    Muestra esta ayuda."
}

while getopts "ch" opt; do
  case ${opt} in
    c )
      clean_and_install
      ;;
    h )
      show_help
      exit 0
      ;;
    \? )
      show_help
      exit 1
      ;;
  esac
done

if [ $OPTIND -eq 1 ]; then
  check_npm
  install_dependencies
  start_frontend &
  wait
fi
