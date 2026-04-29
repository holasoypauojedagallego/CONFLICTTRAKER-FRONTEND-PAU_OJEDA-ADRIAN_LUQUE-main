# Conflict Tracker Fullstack

Muy buenas, esta es mi entrega de la práctica de Fullstack. He pasado la aplicación de local a una infraestructura real en la nube, separando el proyecto en tres capas (base de datos, backend, y frontend) conectadas entre sí para que sea funcional al 100%.

###  Enlaces
* **Frontend (Vercel):** https://conflicttraker-frontend-pau-ojeda.vercel.app/
* **Backend (Railway):** https://conflicttraker-pauojeda-adrianluque-main-production.up.railway.app/

###  La Arquitectura
He separado el proyecto en 3 siguiendo el esquema que del moddle para asegurar que cada capa sea independiente:
* **Base de datos:** Base de datos PostgreSQL alojada en **Supabase**. He usado el Connection Pooler para que la API no pierda la conexión.
* **Backend:** API REST con Spring Boot desplegada en **Railway**.
* **Frontend:** Vue 3 optimizada para producción y desplegada en **Vercel**.

###  Variables de Entorno
Para que el proyecto sea funcional y seguro, he configurado estas variables de entorno en los paneles de control:

**En Railway (Backend):**
* `DB_URL`: La URL JDBC de mi instancia en Supabase.
* `DB_USERNAME`: El usuario de la base de datos.
* `DB_PASSWORD`: La contraseña alfanumérica.

**En Vercel (Frontend):**
* `VITE_API_URL`: La URL de la API en Railway (sin la barra final).

###  Erroes y soluciones
Ha habido complicaciones, pero también he hayado las soluciones:

1. **El Dialecto de Hibernate:** Al conectar con Supabase, Spring no reconocía el dialecto del dump de la base de datos. Lo solucioné descargandome la base de datos en texto plano.
2. **Fallo conexión con Backend:** Desde el Frontend, al intentar conectar con el backend me daba un error, y era porque habia guardado en la variable de entorno acabada en '/', (con la barra final), y claro la URL al final era esta: (https://conflicttraker-pauojeda-adrianluque-main-production.up.railway.app/api/v1//conflicts).
3. **SPA Routing (Error 404):** Al refrescar la página en un conflicto en Vercel me daba error 404. He creado el archivo **`vercel.json`** para que en caso de que se refresque la página, vuelva al **`index`**.
4. **Seguridad CORS:** He cambiado los permisos (antes eran 'http://localhost/5173') y he configurado el `@CrossOrigin` con mi URL de Vercel para cumplir con los requisitos de seguridad en producción.