# Integración con Constantes Globales

Este documento explica cómo los componentes de collage se integran con las constantes y estilos globales del proyecto.

## Constantes Utilizadas

### Estilos Globales (`app/_constants/styles.ts`)
- ✅ **BORDER_RADIUS**: Constantes de border radius compartidas
- ✅ **SPACING**: Constantes de espaciado consistente
- ✅ **ANIMATION_CLASSES**: Clases de animación reutilizables

### Animaciones (`app/_constants/animations.ts`)
- ✅ **TRANSITION_DURATIONS**: Duraciones de transición (FAST, NORMAL, SLOW)
- ✅ **TRANSITION_TIMINGS**: Funciones de timing (EASE_OUT, EASE_IN_OUT)
- ✅ **ANIMATION_DELAYS**: Delays consistentes para animaciones

### Proyectos (`app/_constants/projects.ts`)
- ✅ **DESKTOP_CONFIG**: Configuración de layout desktop
- ✅ **MOBILE_CONFIG**: Configuración de layout mobile
- ✅ **PROJECTS_ANIMATION_DELAYS**: Delays específicos de proyectos

### ClipPaths (`app/_constants/clipPaths.ts`)
- ✅ **CLIP_PATHS**: Definiciones de clipPath SVG para collages

## Estilos CSS Globales (`app/globals.css`)

Los componentes respetan los estilos globales definidos:
- ✅ Fuentes: Open Sans para texto, Fira Code para títulos
- ✅ Smooth scrolling
- ✅ Variables globales de Tailwind

## Patrones de Uso

### Border Radius
```tsx
import { BORDER_RADIUS } from '@/app/_constants/styles';

// Usar constantes compartidas
className={BORDER_RADIUS.SMALL}  // rounded-[16px]
className={BORDER_RADIUS.LARGE}  // rounded-[21px]
```

### Transiciones
```tsx
import { TRANSITION_DURATIONS, TRANSITION_TIMINGS } from '@/app/_constants/animations';

// Usar duraciones consistentes
transition: `opacity ${TRANSITION_DURATIONS.SLOW}ms ${TRANSITION_TIMINGS.EASE_OUT}`
```

### Espaciado
```tsx
import { SPACING } from '@/app/_constants/styles';

// Usar espaciado consistente
className={SPACING.COLLAGE_GAP}
```

## Buenas Prácticas

1. **Siempre usar constantes compartidas** en lugar de valores hardcodeados
2. **Importar desde `styles.ts`** para valores compartidos entre componentes
3. **Mantener clipPaths en `clipPaths.ts`** ya que son específicos de collages
4. **Usar configuración de proyectos** para valores específicos de la sección

## Refactorización Futura

- [ ] Migrar todos los valores hardcodeados a constantes
- [ ] Crear constantes para tamaños de imagen
- [ ] Consolidar todas las animaciones en un solo lugar

