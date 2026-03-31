# Dashboard Backend Contract

## Objetivo

El frontend ya puede renderizar el dashboard con fallback local, pero para mostrar datos reales completos necesita un endpoint agregado:

- `GET /appointments/dashboard/`

Si este endpoint no existe, el frontend:

- usa `GET /appointments/` para resumen parcial, tendencia mensual estimada y actividad reciente falsa
- usa `GET /appointments/stats-by-user/` para ranking por usuario
- usa `GET /appointments/count-by-user/` para estado de citas
- marca visualmente `data false` en las secciones incompletas

## Respuesta esperada

```json
{
  "summary": {
    "total": 35,
    "completed": 28,
    "pending": 5,
    "canceled": 2,
    "monthlyGoal": 50,
    "totalTrendLabel": "vs mes anterior",
    "totalTrendValue": "+12%",
    "completedTrendLabel": "esta semana",
    "completedTrendValue": "+3",
    "pendingTrendLabel": "sin cambio",
    "pendingTrendValue": "- igual",
    "canceledTrendLabel": "vs semana anterior",
    "canceledTrendValue": "-1"
  },
  "monthly_trend": [
    {
      "month": "2025-08",
      "label": "Ago",
      "created": 40,
      "completed": 30,
      "pending": 10
    },
    {
      "month": "2025-09",
      "label": "Sep",
      "created": 55,
      "completed": 45,
      "pending": 10
    }
  ],
  "status_distribution": {
    "total": 35,
    "completed": 28,
    "pending": 5,
    "canceled": 2
  },
  "ranking_by_user": [
    {
      "username": "test",
      "count": 14
    },
    {
      "username": "erick",
      "count": 4
    }
  ],
  "recent_activity": [
    {
      "id": 1,
      "type": "created",
      "username": "erick",
      "appointment_name": "Revision medica",
      "description": "optional",
      "created_at": "2026-03-30T20:15:00Z"
    },
    {
      "id": 2,
      "type": "completed",
      "username": "test",
      "appointment_name": "Consulta #34",
      "description": "optional",
      "created_at": "2026-03-30T19:40:00Z"
    }
  ],
  "data_flags": {
    "summary": true,
    "monthly": true,
    "statusDistribution": true,
    "ranking": true,
    "recentActivity": true
  }
}
```

## Campos

- `summary.total`: total de citas
- `summary.completed`: total completadas
- `summary.pending`: total pendientes
- `summary.canceled`: total canceladas
- `summary.monthlyGoal`: meta del mes
- `summary.*TrendLabel`: texto secundario del card
- `summary.*TrendValue`: badge o variacion del card
- `monthly_trend`: arreglo de los ultimos 6 meses
- `status_distribution`: conteo actual por estado
- `ranking_by_user`: ranking descendente por usuario
- `recent_activity`: acciones recientes del sistema
- `data_flags`: permite al frontend saber si una seccion es real o fallback

## Valores permitidos para `recent_activity.type`

```txt
created
updated
completed
pending
canceled
deleted
```

## Recomendaciones backend

1. Ordenar `ranking_by_user` de mayor a menor.
2. En `monthly_trend`, devolver siempre 6 puntos aunque el valor sea `0`.
3. En `recent_activity`, devolver maximo 5 a 10 items.
4. Mantener `label` del mes listo para UI, por ejemplo `Ago`, `Sep`, `Oct`.
5. Si algun bloque no puede calcularse, devolver arreglo vacio o `0` y marcar su flag en `data_flags` como `false`.

## Compatibilidad actual

El frontend ya consume:

- `GET /appointments/`
- `GET /appointments/stats-by-user/`
- `GET /appointments/count-by-user/`

Con `GET /appointments/dashboard/` se completa el dashboard sin fallback.
