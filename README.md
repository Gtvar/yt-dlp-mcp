# MCP Youtube Download Service

**MCP-пакет для завантаження відео та аудіо з YouTube**

---

## Опис

Цей MCP-пакет надає інструменти для інтеграції завантаження відео та аудіо з YouTube у LLM-додатки через Model Context Protocol (MCP). Працює як локальний сервер на Node.js/TypeScript із використанням yt-dlp та ffmpeg.

---

## Основні можливості
- Отримання метаданих відео з YouTube
- Завантаження відео або аудіо у різних форматах (mp4, m4a, ogg, opus, mp3)
- Гнучка конфігурація директорії збереження
- Валідація параметрів (Zod)
- Обробка помилок (UserError)
- Офлайнові юніт-тести

---

## Встановлення та запуск як MCP-пакет

1. Встановіть залежності:
   ```bash
   npm install
   ```
2. Переконайтесь, що yt-dlp та ffmpeg встановлені у системі та доступні у PATH.
3. Запустіть MCP-сервер:
   ```bash
   npm start
   ```
4. Додайте сервер у свій LLM/MCP-клієнт (наприклад, Cursor, Open Interpreter, тощо) через stdio або HTTP (SSE) транспорт.

---

## Інтеграція у LLM/MCP

- Додавайте цей сервер як MCP endpoint у вашому LLM-клієнті (див. документацію вашого клієнта щодо підключення MCP-серверів).
- Після підключення ви зможете викликати MCP-інструменти:
  - `get_video_info` — отримати метадані відео
  - `download_video` — завантажити відео або аудіо

---

## Приклади MCP-запитів

### Отримати інформацію про відео
```json
{
  "tool": "get_video_info",
  "params": {
    "url": "https://www.youtube.com/watch?v=..."
  }
}
```

### Завантажити відео
```json
{
  "tool": "download_video",
  "params": {
    "url": "https://www.youtube.com/watch?v=...",
    "output_path": "/шлях/до/папки/%(title)s.%(ext)s",
    "extract_audio_only": false
  }
}
```

### Завантажити лише аудіо
```json
{
  "tool": "download_video",
  "params": {
    "url": "https://www.youtube.com/watch?v=...",
    "output_path": "/шлях/до/папки/%(title)s.%(ext)s",
    "extract_audio_only": true,
    "audio_container_preference": "mp3"
  }
}
```

---

## Конфігурація
- Директорія для збереження файлів задається через змінну середовища `YTDL_OUTPUT_DIR` або у параметрах API.
- Формат імені файлу: `%(title)s.%(ext)s` (рекомендується для унікальності).

---

## Відомі проблеми
- YouTube періодично змінює захист, через що yt-dlp може тимчасово не працювати (див. [yt-dlp issues](https://github.com/yt-dlp/yt-dlp/issues)).
- Якщо виникає помилка nsig extraction — спробуйте оновити yt-dlp (`yt-dlp -U`).

---

## Ліцензія
MIT
