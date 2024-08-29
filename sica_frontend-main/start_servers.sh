#!/bin/bash

# Función para iniciar el frontend
start_frontend() {
  echo "Iniciando el frontend..."
  npm run dev
}

# Función para iniciar el backend
start_backend() {
  echo "Iniciando el backend..."
  cd backend
  ./setup_and_run.sh
}

# Iniciar el frontend en segundo plano
start_frontend &

# Iniciar el backend en segundo plano
start_backend &

# Esperar a que los procesos en segundo plano terminen
wait
