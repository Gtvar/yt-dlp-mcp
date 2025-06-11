import { FastMCP, UserError } from "fastmcp";
import { z } from "zod";
import * as services from "./services/index.js";
import { YoutubeDownloadService } from './services/YoutubeDownloadService.js';

const youtubeService = new YoutubeDownloadService(
  process.env.YTDLP_PATH || 'yt-dlp',
  process.env.YTDL_OUTPUT_DIR || '/tmp',
  process.env.FFMPEG_PATH
);

/**
 * Register all tools with the MCP server
 * 
 * @param server The FastMCP server instance
 */
export function registerTools(server: FastMCP) {
  // Greeting tool
  server.addTool({
    name: "hello_world",
    description: "A simple hello world tool",
    parameters: z.object({
      name: z.string().describe("Name to greet")
    }),
    execute: async (params) => {
      const greeting = services.GreetingService.generateGreeting(params.name);
      return greeting;
    }
  });

  // Farewell tool
  server.addTool({
    name: "goodbye",
    description: "A simple goodbye tool",
    parameters: z.object({
      name: z.string().describe("Name to bid farewell to")
    }),
    execute: async (params) => {
      const farewell = services.GreetingService.generateFarewell(params.name);
      return farewell;
    }
  });

  server.addTool({
    name: 'get_video_info',
    description: 'Отримує інформацію про відео з YouTube без завантаження',
    parameters: z.object({
      url: z.string().url(),
    }),
    execute: async (params) => {
      const res = await youtubeService.getVideoInfo(params);
      if (res.status === 'error') throw new UserError(res.message || 'Помилка');
      return {
        content: [
          {
            type: "text",
            text: `Назва: ${res.video_title}\nАвтор: ${res.uploader}\nТривалість: ${res.duration} сек\n` +
              (res.available_formats ? `Доступні формати: ${res.available_formats.map(f => f.format).join(', ')}` : '')
          }
        ]
      };
    }
  });

  server.addTool({
    name: 'download_video',
    description: 'Завантажує відео або аудіо з YouTube за допомогою yt-dlp',
    parameters: z.object({
      url: z.string().url(),
      quality_preference: z.string().optional(),
      video_container_preference: z.string().optional(),
      audio_container_preference: z.string().optional(),
      output_path: z.string().optional(),
      extract_audio_only: z.boolean().optional().default(false),
    }),
    execute: async (params) => {
      const res = await youtubeService.downloadVideo(params);
      if (res.status === 'error') throw new UserError(res.message || 'Помилка');
      return {
        content: [
          {
            type: "text",
            text: `Файл збережено: ${res.file_path || res.filename}\n` +
              (res.final_video_format ? `Формат: ${res.final_video_format}\n` : '') +
              (res.final_audio_format ? `Аудіо: ${res.final_audio_format}\n` : '')
          }
        ]
      };
    }
  });
}

