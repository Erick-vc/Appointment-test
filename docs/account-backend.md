# Account Profile Backend Contract

## Objetivo

El frontend de `Perfil` ya esta implementado y puede usar fallback local, pero para mostrar y guardar informacion real necesita este endpoint:

- `GET /users/profile/`
- `PUT /users/profile/`
- `GET /users/settings/`
- `PUT /users/settings/`
- `POST /users/change-password/`
- `POST /users/sessions/close-others/`
- `POST /users/export-data/`
- `POST /users/deactivate/`
- `DELETE /users/delete/`

## GET `/users/profile/`

Debe devolver el perfil del usuario autenticado, estadisticas personales y actividad reciente.

### Respuesta esperada

```json
{
  "profile": {
    "id": 7,
    "username": "erick",
    "first_name": "Erick",
    "last_name": "Garcia",
    "email": "erick@villacitas.com",
    "phone": "+51 999 000 000",
    "city": "Lima, Peru",
    "bio": "Gestor principal del sistema VillaCitas.",
    "role": "Administrador",
    "avatar_url": null,
    "joined_at": "2026-01-10T14:00:00Z",
    "skills": ["Admin", "React", "Node.js", "PostgreSQL"]
  },
  "stats": {
    "my_appointments": 4,
    "completed": 3,
    "pending": 1
  },
  "recent_activity": [
    {
      "id": 1,
      "type": "created",
      "title": "Creaste la cita \"Hola\"",
      "subtitle": "Descripcion opcional",
      "created_at": "2026-03-30T06:45:00Z"
    },
    {
      "id": 2,
      "type": "completed",
      "title": "Marcaste como completada \"Agregando cita\"",
      "subtitle": "Descripcion opcional",
      "created_at": "2026-03-29T20:59:00Z"
    }
  ],
  "data_flags": {
    "profile": true,
    "stats": true,
    "recent_activity": true
  }
}
```

## PUT `/users/profile/`

Actualiza la informacion editable del usuario autenticado.

### Body esperado

```json
{
  "first_name": "Erick",
  "last_name": "Garcia",
  "username": "erick",
  "email": "erick@villacitas.com",
  "phone": "+51 999 000 000",
  "city": "Lima, Peru",
  "bio": "Gestor principal del sistema VillaCitas."
}
```

### Respuesta recomendada

Puedes devolver exactamente el mismo payload de `GET /users/profile/` para que el frontend refresque todo con una sola forma.

## GET `/users/settings/`

Debe devolver las preferencias de configuracion del usuario autenticado.

### Respuesta esperada

```json
{
  "notifications": {
    "new_appointment": true,
    "completed_appointment": true,
    "pending_reminders": true,
    "canceled_appointment": true,
    "weekly_summary": true,
    "email_enabled": true,
    "product_updates": false
  },
  "appearance": {
    "dark_mode": false,
    "accent_color": "#18B889",
    "font_size": "normal",
    "language": "es"
  },
  "security": {
    "two_factor_email": false,
    "login_alerts": true
  },
  "sessions": [
    {
      "id": "current",
      "device": "Chrome · Windows 11",
      "location": "Lima, PE",
      "last_seen": "Activo ahora",
      "is_current": true
    },
    {
      "id": "android",
      "device": "Chrome · Android",
      "location": "Lima, PE",
      "last_seen": "Hace 2 horas",
      "is_current": false
    }
  ],
  "data_flags": {
    "notifications": true,
    "appearance": true,
    "security": true,
    "sessions": true
  }
}
```

## PUT `/users/settings/`

Actualiza notificaciones, apariencia y seguridad.

### Body esperado

```json
{
  "notifications": {
    "new_appointment": true,
    "completed_appointment": true,
    "pending_reminders": true,
    "canceled_appointment": true,
    "weekly_summary": true,
    "email_enabled": true,
    "product_updates": false
  },
  "appearance": {
    "dark_mode": false,
    "accent_color": "#18B889",
    "font_size": "normal",
    "language": "es"
  },
  "security": {
    "two_factor_email": false,
    "login_alerts": true
  }
}
```

## POST `/users/change-password/`

### Body esperado

```json
{
  "current_password": "actual123",
  "new_password": "nueva123456",
  "confirm_password": "nueva123456"
}
```

## POST `/users/sessions/close-others/`

Cierra todas las sesiones del usuario excepto la actual.

## POST `/users/export-data/`

Solicita una exportacion de datos del usuario.

### Respuesta sugerida

```json
{
  "message": "Exportacion iniciada",
  "status": "queued"
}
```

## POST `/users/deactivate/`

Desactiva la cuenta del usuario autenticado.

## DELETE `/users/delete/`

Elimina permanentemente la cuenta del usuario autenticado.

## Campos

- `profile.role`: string de solo lectura para UI
- `profile.avatar_url`: opcional, por ahora la UI usa iniciales si no existe
- `profile.joined_at`: fecha de registro del usuario
- `profile.skills`: etiquetas visuales del usuario
- `stats.my_appointments`: total de citas del usuario autenticado
- `stats.completed`: citas completadas del usuario
- `stats.pending`: citas pendientes o en progreso del usuario
- `recent_activity`: maximo 5 items recomendados
- `notifications.*`: toggles de alertas y email
- `appearance.dark_mode`: boolean
- `appearance.accent_color`: color hexadecimal
- `appearance.font_size`: `small | normal | large`
- `appearance.language`: por ejemplo `es` o `en`
- `security.two_factor_email`: boolean
- `security.login_alerts`: boolean
- `sessions`: sesiones activas del usuario

## Valores permitidos para `recent_activity.type`

```txt
created
updated
completed
pending
deleted
```

## Fallback actual del frontend

Si el backend no responde este endpoint:

- usa `userStore` para `id` y `username`
- usa `GET /appointments/` para calcular estadisticas y actividad local
- marca la tarjeta como `data false`

## Recomendaciones backend

1. `GET /users/profile/` debe responder con el usuario autenticado, no recibir `id`.
2. Mantener `recent_activity` ya ordenado de mas reciente a mas antiguo.
3. Si no tienes `skills`, devuelve `[]`.
4. Si no tienes `avatar_url`, devuelve `null`.
5. Si algun bloque no existe todavia, devuelve datos vacios y su flag en `false`.
6. `GET /users/settings/` debe responder con la configuracion del usuario autenticado, no recibir `id`.
7. En `sessions`, mantener la sesion actual marcada con `is_current: true`.
