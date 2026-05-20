# DocReader — Notas del proyecto

App para escuchar documentos PDF y Word usando ElevenLabs TTS.
Live: https://docread.netlify.app | Repo: https://github.com/juanfcofdz/docreader

---

## Arquitectura final

```
index.html      → Login: pide API key de ElevenLabs, la verifica y guarda en sessionStorage
app.html        → App principal: llama a ElevenLabs directamente desde el browser
netlify.toml    → Routing: / → index.html, /app → app.html
netlify/functions/
  auth.js       → Verifica APP_PASSWORD (no usado en flujo actual)
  voices.js     → Proxy de voces (no usado en flujo actual)
  tts.js        → Proxy de TTS (no usado en flujo actual)
  ping.js       → Endpoint de debug (puede eliminarse)
```

**Nota:** Las funciones serverless quedaron en el repo pero no se usan. El flujo actual llama a ElevenLabs directamente desde el browser con la API key guardada en `sessionStorage`.

---

## Cómo funciona

1. Usuario abre la app → ingresa su API key de ElevenLabs
2. La app verifica la key llamando a `/v1/voices`
3. Si es válida, guarda en `sessionStorage` y redirige a `app.html`
4. Usuario sube PDF o Word → se extrae el texto en el browser (pdf.js / mammoth.js)
5. Al dar Play, la app llama a ElevenLabs TTS por fragmentos de ~2400 chars
6. Cada fragmento se reproduce en secuencia

---

## Variables de entorno en Netlify

| Variable | Uso |
|----------|-----|
| `VARIABLE` | API key de ElevenLabs (para funciones serverless, actualmente no usadas) |
| `APP_PASSWORD` | Contraseña de acceso (para funciones serverless, actualmente no usadas) |

---

## Problemas encontrados y soluciones

### 1. Netlify Functions devuelven 402
Las funciones serverless de Netlify (plan gratuito) bloqueaban las llamadas POST con payloads grandes de audio. **Solución:** eliminar funciones del flujo y llamar a ElevenLabs directamente desde el browser.

### 2. Autoplay bloqueado en desktop (Chrome)
Chrome bloquea `audio.play()` si se llama después de una operación async larga. **Solución:** crear un `AudioContext` y reproducir un buffer silencioso inmediatamente al click del usuario para "desbloquear" el audio antes de la llamada a la API.

### 3. Voces de biblioteca no disponibles en plan free
ElevenLabs no permite usar voces de la biblioteca (community) con plan gratuito vía API. **Solución:** el selector de voces ahora agrupa "✓ Gratuitas" (premade) y "★ Tu biblioteca". Las premade funcionan en cualquier plan. Con `eleven_multilingual_v2` leen español correctamente aunque sean voces en inglés.

### 4. API key sin permisos correctos
La key debe tener habilitado:
- **De texto a voz** → Acceso
- **Voces** → Leído

### 5. Autoplay en móvil (pendiente)
En iOS/Android el audio no reproduce después de la llamada async. El AudioContext se suspende mientras espera la respuesta de ElevenLabs. **Estado:** sin resolver — necesita investigación adicional (posible solución: pre-cargar el siguiente fragmento, o usar un enfoque diferente de reproducción en móvil).

---

## Cómo hacer cambios y deployar

```bash
# Editar archivos en /Users/jff/Documents/Claude/Projects/11Labs/
cd "/Users/jff/Documents/Claude/Projects/11Labs"
git add .
git commit -m "descripción del cambio"
git push
# Netlify redeploya automáticamente al recibir el push
```

---

## Librerías usadas (todas vía CDN, sin instalación)

- **pdf.js** 3.11.174 — extrae texto de PDFs en el browser
- **mammoth.js** 1.6.0 — extrae texto de archivos Word (.docx)
- **ElevenLabs API** — TTS con modelo `eleven_multilingual_v2`
