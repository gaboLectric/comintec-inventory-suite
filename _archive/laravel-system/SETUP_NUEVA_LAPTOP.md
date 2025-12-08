# 🚀 Setup en Nueva Laptop

## Requisitos previos
- Docker y Docker Compose instalados
- Git (opcional, si usas repositorio)

## Opción A: Transferir con USB/Nube (más rápido)

### 1. Comprimir el proyecto (en laptop actual)
```bash
cd ~/development
tar -czvf inventario-mod.tar.gz "inventario mod" --exclude='node_modules' --exclude='vendor'
```

### 2. En la nueva laptop
```bash
# Descomprimir
tar -xzvf inventario-mod.tar.gz
cd "inventario mod/modern-system"

# Levantar contenedores (instala dependencias automáticamente)
docker compose up -d --build
```

## Opción B: Usando Git

### 1. Clonar el repositorio
```bash
git clone <URL_DEL_REPO> "inventario mod"
cd "inventario mod/modern-system"
```

### 2. Crear archivo .env
```bash
cp .env.example .env
# O copiar el .env original desde la otra laptop
```

### 3. Copiar la base de datos (IMPORTANTE)
Copiar el archivo `database/database.sqlite` desde la laptop original.

Si no tienes la base de datos, crear una nueva:
```bash
touch database/database.sqlite
```

### 4. Levantar los contenedores
```bash
docker compose up -d --build
```

### 5. Si es base de datos nueva, ejecutar migraciones
```bash
docker exec modern-backend php artisan migrate --seed
```

## Verificar que funciona

- **Backend**: http://localhost:8000
- **Frontend**: http://localhost:5173

## Credenciales por defecto
- **Usuario**: `admin`
- **Contraseña**: `admin123`

## Comandos útiles

```bash
# Ver logs
docker compose logs -f

# Reiniciar
docker compose restart

# Detener
docker compose down

# Reconstruir
docker compose up -d --build
```

## Solución de problemas

### Permisos en Linux
```bash
sudo chown -R $USER:$USER .
chmod -R 777 storage bootstrap/cache
```

### Limpiar y reconstruir
```bash
docker compose down -v
docker compose up -d --build
```
