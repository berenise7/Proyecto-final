# 📚 Literary Haven - Frontend

Frontend del proyecto Literary Haven, una plataforma full stack para amantes de la literatura. Este repositorio contiene todo el código relacionado con la interfaz de usuario.

🔗 [Repositorio Backend](https://github.com/berenise7/Proyecto-final/tree/main/back)

---

## 📗 Presentación

Hola, soy Berenise y este es mi proyecto final para el bootcamp. Literary Haven es una librería digital construida con tecnologías modernas como React, Next.js y Node.js. Este frontend está diseñado para ser rápido, responsivo y fácil de navegar, con características como búsqueda de libros, registro de libros leidos, gestión de carrito, inicio de sesión, registro y panel de usuario.

---

## ▶️ Comenzar

Si deseas probar el proyecto en tu máquina local, sigue estos pasos:

### ✅ Requisitos

- Node.js (v18 o superior)
- NPM
- Tener el backend corriendo (ver enlace más arriba)

### 📦 Instalación

```bash
git clone https://github.com/berenise7/Proyecto-final.git
cd Proyecto-final/front
npm install
```

### 🚀 Ejecutar en desarrollo

```bash
npm run dev
```

Esto levantará el proyecto en `http://localhost:3000`.

---

## 🧩 Tecnologías Utilizadas

### 📦 Dependencias principales:

- **Next.js**: Framework para React.
- **React**: Librería para construir interfaces de usuario.
- **Formik & Yup**: Manejo de formularios y validación.
- **jwt-decode**: Decodificación de tokens JWT.
- **react-icons** y **FontAwesome**: Iconografía.
- **CSS Modules**: Estilos aislados por componente.

### 🧠 Arquitectura

```
src/
│
├── api/                   # Funciones para consumir la API (books, cart, journals, orders, users)
│
├── components/            # Componentes reutilizables
│   ├── Cart/
│   ├── Footer/
│   ├── FormikComponents/
│   ├── Header/
│   └── Home/
│
├── core/
│   └──contexts/         # Context API para estados globales
│
├── pages/                 # Páginas del sitio, organizadas por ruta
│   ├── admin/
│   ├── books/
│   ├── cart/
│   ├── myaccount/
│   ├── reading-journal/
│   ├── user/
│   ├── _app.js
│   ├── _document.js
│   └── index.js
│
└── styles/                # Hojas de estilo CSS

```

---

## 🔑 Autenticación

Se gestiona mediante JWT. El usuario puede registrarse, iniciar sesión, y acceder a un panel personalizado con sus favoritos, perfil y pedidos.

---

## 📱 Responsividad

El diseño se adapta a varios tamaños de pantalla. Algunos breakpoints usados:

| Tamaño   | Dispositivo       |
| -------- | ----------------- |
| < 526px  | Móviles           |
| < 768px  | Tablets pequeños  |
| < 992px  | Tablets grandes   |
| > 1200px | Pantallas grandes |

---

## 📬 Contacto

Creado por **Berenise** como proyecto final del bootcamp.
