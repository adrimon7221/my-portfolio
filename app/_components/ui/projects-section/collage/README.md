# Collage Components Architecture

Esta carpeta contiene los componentes modulares para los collages de imágenes de proyectos.

## Estructura

```
collage/
├── mobile/              # Componentes específicos para layout mobile
│   ├── FirstCollageMobile.tsx
│   ├── SecondCollageMobile.tsx
│   ├── ThirdCollageMobile.tsx
│   ├── GenericCollageMobile.tsx
│   └── index.ts
├── desktop/             # Componentes específicos para layout desktop
│   ├── FirstCollageDesktop.tsx
│   ├── SecondCollageDesktop.tsx
│   ├── ThirdCollageDesktop.tsx
│   └── index.ts
├── ClipPathImage.tsx    # Componente reutilizable para imágenes con clipPath
├── DecorativeCircleWrapper.tsx  # Wrapper para círculo decorativo
├── helpers.ts           # Funciones helper (getCollageType)
├── index.ts            # Barrel exports
└── README.md
```

## Componentes Principales

### Mobile Collages

- **FirstCollageMobile**: Collage con imagen roja (L shape) + verde + azul
- **SecondCollageMobile**: Collage con imagen amarilla + celeste + gris
- **ThirdCollageMobile**: Collage con blanco + lima + rosado
- **GenericCollageMobile**: Layout genérico para otros collages

### Desktop Collages

- **FirstCollageDesktop**: Versión desktop del primer collage
- **SecondCollageDesktop**: Versión desktop del segundo collage
- **ThirdCollageDesktop**: Versión desktop del tercer collage

### Componentes Reutilizables

- **DecorativeCircleWrapper**: Maneja el posicionamiento y animaciones del círculo decorativo
- **ClipPathImage**: Componente para imágenes con SVG clipPath

## Helpers

- **getCollageType**: Identifica el tipo de collage basado en el array de imágenes

## Constantes

Los clipPaths están definidos en `app/_constants/clipPaths.ts` para fácil mantenimiento y reutilización.

## Uso

El componente principal `ProjectImageCollage` automáticamente selecciona el collage apropiado basado en:
- El número de imágenes
- El contenido de la primera imagen (rojo, amarillo, blanco)

## Mejoras Futuras

- Extraer más constantes de estilos a archivos separados
- Crear componentes para imágenes individuales reutilizables
- Agregar tests unitarios para cada collage

