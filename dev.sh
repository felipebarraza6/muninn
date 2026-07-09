#!/bin/bash
# Iniciar Clinical Chatflow en modo desarrollo con hot reload
# Puerto: 3001

echo "🚀 Iniciando Clinical Chatflow - Modo Desarrollo"
echo "================================================="
echo "URL: http://localhost:3001"
echo "Hot Reload: Activado"
echo ""

# Verificar que node_modules existe
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias..."
    bun install
fi

# Limpiar build anterior
rm -rf dist

# Iniciar Vite en modo desarrollo (NO preview, NO build)
echo "📝 Modo desarrollo activado - Los cambios se aplicarán automáticamente"
bunx vite --host 0.0.0.0 --port 3001 --strictPort
