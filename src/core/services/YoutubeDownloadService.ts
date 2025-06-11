import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import {
  DownloadVideoParams,
  DownloadVideoResult,
  GetVideoInfoParams,
  GetVideoInfoResult,
} from '../types/youtubeTypes.js';

export class YoutubeDownloadService {
  private ytDlpPath: string;
  private ffmpegPath?: string;
  private defaultOutputDir: string;

  constructor(ytDlpPath: string, defaultOutputDir: string, ffmpegPath?: string) {
    this.ytDlpPath = ytDlpPath;
    this.defaultOutputDir = defaultOutputDir;
    this.ffmpegPath = ffmpegPath;
  }

  async downloadVideo(params: DownloadVideoParams & { output_dir?: string, confirm_save?: (filePath: string) => Promise<boolean> }): Promise<DownloadVideoResult> {
    const {
      url,
      quality_preference = 'best',
      video_container_preference,
      audio_container_preference,
      output_path,
      extract_audio_only = false,
      output_dir,
      confirm_save,
    } = params;
    if (!url) {
      return { status: 'error', message: 'URL is required' };
    }
    // Визначаємо директорію збереження
    const outDir = output_path
      ? path.dirname(output_path)
      : output_dir || this.defaultOutputDir || '/tmp';
    // Формуємо шаблон імені файлу з %(ext)s
    const outTemplate = output_path
      ? (output_path.includes('%(ext)s') ? output_path : output_path.replace(/\.[a-z0-9]+$/i, '.%(ext)s'))
      : path.join(outDir, '%(title)s.%(ext)s');
    // Формуємо аргументи yt-dlp
    const args = [
      url,
      '-o', outTemplate,
      '--no-playlist',
      '--print-json',
    ];
    if (extract_audio_only) {
      args.push('-x');
      if (audio_container_preference) {
        if (["m4a", "mp3", "ogg", "opus"].includes(audio_container_preference)) {
          args.push('--audio-format', audio_container_preference);
        }
      }
    } else {
      // Відео зі звуком у mp4
      args.push('-f', 'best[ext=mp4]/best');
      args.push('--merge-output-format', 'mp4');
    }
    // Запуск yt-dlp
    return new Promise((resolve) => {
      const proc = spawn(this.ytDlpPath, args);
      let stdout = '';
      let stderr = '';
      proc.stdout.on('data', (data) => {
        stdout += data.toString();
      });
      proc.stderr.on('data', (data) => {
        stderr += data.toString();
      });
      proc.on('close', async (code) => {
        if (code !== 0) {
          resolve({ status: 'error', message: `yt-dlp exited with code ${code}: ${stderr}` });
          return;
        }
        try {
          // Знаходимо всі валідні JSON-рядки
          const jsonLines = stdout.split('\n').filter(Boolean);
          let info: any = undefined;
          for (let i = jsonLines.length - 1; i >= 0; i--) {
            try {
              const obj = JSON.parse(jsonLines[i]);
              if (obj && obj._filename && obj.ext) {
                info = obj;
                break;
              }
            } catch {}
          }
          if (!info) {
            resolve({ status: 'error', message: 'Не знайдено валідний JSON з інформацією про файл у виводі yt-dlp.' });
            return;
          }
          let file_path = info._filename ? path.resolve(info._filename) : undefined;
          // Перевіряємо, що файл існує
          if (!file_path || !fs.existsSync(file_path)) {
            resolve({ status: 'error', message: `Файл не створено або не знайдено.\nstderr: ${stderr}\nstdout: ${stdout}` });
            return;
          }
          if (confirm_save && file_path) {
            const allowed = await confirm_save(file_path);
            if (!allowed) {
              try { fs.unlinkSync(file_path); } catch {}
              resolve({ status: 'error', message: 'Збереження файлу скасовано користувачем.' });
              return;
            }
          }
          resolve({
            status: 'success',
            message: extract_audio_only ? 'Аудіо успішно вилучено.' : 'Відео успішно завантажено.',
            file_path,
            filename: info._filename,
            final_video_format: info.ext,
            final_audio_format: info.acodec,
            metadata: info,
          });
        } catch (e) {
          resolve({ status: 'error', message: 'Failed to parse yt-dlp output' });
        }
      });
    });
  }

  async getVideoInfo(params: GetVideoInfoParams): Promise<GetVideoInfoResult> {
    const { url } = params;
    if (!url) {
      return { status: 'error', message: 'URL is required' };
    }
    return new Promise((resolve) => {
      const args = ['--dump-json', url];
      const proc = spawn(this.ytDlpPath, args);
      let stdout = '';
      let stderr = '';
      proc.stdout.on('data', (data) => {
        stdout += data.toString();
      });
      proc.stderr.on('data', (data) => {
        stderr += data.toString();
      });
      proc.on('close', (code) => {
        if (code !== 0) {
          resolve({ status: 'error', message: `yt-dlp exited with code ${code}: ${stderr}` });
          return;
        }
        try {
          const info = JSON.parse(stdout);
          resolve({
            status: 'success',
            video_title: info.title,
            uploader: info.uploader,
            duration: info.duration,
            thumbnail_url: info.thumbnail,
            available_formats: info.formats,
          });
        } catch (e) {
          resolve({ status: 'error', message: 'Failed to parse yt-dlp output' });
        }
      });
    });
  }
} 