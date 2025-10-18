# Servicio de Autenticación - Evidencia GA7-220501096-AA5-EV01

Proyecto simple que implementa dos endpoints para registro e inicio de sesión.

## Requisitos
- Node.js >= 14
- npm

## Instalación
1. Descomprimir la carpeta.
2. Abrir una terminal en la carpeta del proyecto.
3. Ejecutar:
   ```bash
   npm install
   ```

## Ejecutar
- Modo producción:
   ```bash
   npm start
   ```
- Modo desarrollo (con nodemon si está instalado):
   ```bash
   npm run dev
   ```

El servidor corre por defecto en `http://localhost:3000`.

## Endpoints
- `POST /register` con body JSON:
  ```json
  { "username": "usuario", "password": "clave" }
  ```
  Respuestas:
  - `201` Registro exitoso
  - `409` Usuario ya existe
  - `400` Campos requeridos

- `POST /login` con body JSON:
  ```json
  { "username": "usuario", "password": "clave" }
  ```
  Respuestas:
  - `200` { "message": "Autenticación satisfactoria" }
  - `401` { "error": "Error en la autenticación" }

## Pruebas (ejemplos usando curl)
Registrar:
```
curl -X POST http://localhost:3000/register -H "Content-Type: application/json" -d '{"username":"carlos","password":"1234"}'
```

Iniciar sesión (éxito):
```
curl -X POST http://localhost:3000/login -H "Content-Type: application/json" -d '{"username":"carlos","password":"1234"}'
```

Iniciar sesión (fallo):
```
curl -X POST http://localhost:3000/login -H "Content-Type: application/json" -d '{"username":"carlos","password":"wrong"}'
```

## Versionamiento / Enlace del repositorio
Este paquete incluye instrucciones para inicializar git y subir el proyecto a un repositorio remoto (por ejemplo GitHub).

Comandos sugeridos:
```
git init
git add .
git commit -m "Evidencia GA7-220501096-AA5-EV01 - servicio auth"
# Crear un repositorio en GitHub (por ejemplo) y luego:
git remote add origin https://github.com/<tu-usuario>/<tu-repo>.git
git push -u origin main
```

**Nota:** No se incluye un enlace a un repositorio remoto real en esta entrega. Si deseas, puedo ayudarte a crear los comandos precisos para tu cuenta GitHub o preparar una guía para subirlo desde la CLI.
