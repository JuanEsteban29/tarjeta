# Los XV de Karlet - Una Noche de Misterio

Invitación digital interactiva y cinemática para los XV años de **Karlet Alvarado**.
Inspirada en el universo enigmático del País de las Maravillas (Wonderland), adaptada a un tema de misterio gótico-victoriano con bruma animada, música ambiental y diseño mobile-first.

## Características

- **Diseño Misterioso & Enigmático:** Paleta obsidiana y oro viejo con animaciones de niebla y marcos victorianos.
- **Música Automática (Autoplay):** Se reproduce la música de Alicia en el País de las Maravillas inmediatamente al ingresar / con la primera interacción del usuario.
- **Encuadre Fotográfico de Alta Calidad:** Fotos adaptadas a sus proporciones originales con esquinas ornamentales y viñeta interna.
- **100% Responsivo para Teléfonos:** Adaptado para iPhone y Android con botones cómodos y sin desbordes horizontales.
- **Cuenta Regresiva en Tiempo Real:** Días, horas, minutos y segundos hacia el 11 de diciembre de 2026.
- **Confirmación por WhatsApp (RSVP):** Modal integrado para confirmar nombre y número de acompañantes.
- **Enlace a Google Maps:** Acceso directo a la ubicación de Granja Mano Vieja.

## Estructura de Archivos

```
├── index.html                  # Página principal de la invitación
├── css/
│   └── style.css              # Estilos visuales, animaciones de niebla y diseño mobile
├── js/
│   └── main.js                # Lógica interactiva, autoplay de música y cuenta regresiva
└── assets/
    ├── images/                # Fotografías e ilustraciones con marcos enigmáticos
    └── music/
        └── alices-theme.mp3   # Canción de fondo ("Alice's Theme")
```

## Configurar el número de WhatsApp

En el archivo `js/main.js` (y en `invitacion-karlet-magica/js/main.js`), busca la línea:
```javascript
const whatsappNumber = "000000000000";
```
Reemplaza `000000000000` por el número de WhatsApp con el código de país (sin el signo `+`).
Por ejemplo, para Colombia: `"573001234567"`, para México: `"5215512345678"`, etc.

## Publicación en GitHub Pages

Para ver la invitación online:
1. Ve a tu repositorio en GitHub: [https://github.com/JuanEsteban29/tarjeta](https://github.com/JuanEsteban29/tarjeta)
2. Entra en **Settings** > **Pages**
3. En **Branch**, selecciona `main` y la carpeta `/ (root)`
4. Haz clic en **Save**. ¡Tu enlace quedará activo en `https://juanesteban29.github.io/tarjeta/`!
