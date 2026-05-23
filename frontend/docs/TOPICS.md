# Temas médicos — Hospital Sync

## Modelo de datos (`src/types/medicalTopic.ts`)

| Campo | Tipo | Obligatorio | Uso |
|-------|------|-------------|-----|
| `id` | string | Sí | Identificador único |
| `title` | string | Sí | Nombre del tema |
| `content` | string | No* | Apuntes (*recomendado en Mis temas) |
| `categoryId` | string | Sí | Referencia a `TopicCategory` |
| `presentationDate` | string | Sí | Fecha de exposición (`yyyy-MM-dd`) |
| `createdAt` / `updatedAt` | string | Sí | Auditoría |

### Categorías (`TopicCategory`)

| Campo | Tipo | Obligatorio |
|-------|------|-------------|
| `id` | string | Sí |
| `name` | string | Sí |

## Dónde se usa

### Mis temas (`/temas`)

- Listado en tarjetas con categoría y fecha de exposición.
- Modal crear/editar: título, categoría, fecha y contenido.
- Filtros: búsqueda, categoría, rango de fechas.
- Gestión de categorías (modal aparte).

### Calendario / ServiceDays

- Los temas se muestran el día de su `presentationDate` (si cae en un día de servicio o en rango visible).
- Filtros del calendario: período (5/10/20 semanas), temas (todos / esta semana / rango personalizado).
- Búsqueda por título: resalta días con coincidencias.

## Persistencia

- `localStorage`: `hospital-sync-topics`, `hospital-sync-categories`
- Fuente única: `TopicsContext` (`src/context/TopicsContext.tsx`)

## Reglas de negocio

1. No eliminar una categoría si tiene temas asignados (o reasignar antes).
2. `presentationDate` determina en qué celda del calendario aparece el tema.
3. Un día de servicio puede tener varios temas si comparten fecha o hay varios temas ese día.
