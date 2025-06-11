import { YoutubeDownloadService } from '../src/core/services/YoutubeDownloadService.js';
import path from 'path';
import fs from 'fs';
import { spawn } from 'child_process';

jest.mock('child_process');
jest.mock('fs');

const mockSpawn = spawn as jest.Mock;
const mockFs = fs as jest.Mocked<typeof fs>;

describe('YoutubeDownloadService (unit, offline)', () => {
  const ytDlpPath = 'yt-dlp';
  const defaultOutputDir = path.resolve(__dirname, '../tmp');
  const service = new YoutubeDownloadService(ytDlpPath, defaultOutputDir);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  function setupMockSpawn({ stdout = '', stderr = '', code = 0 }): any {
    const stdoutEvents: ((data: Buffer) => void)[] = [];
    const stderrEvents: ((data: Buffer) => void)[] = [];
    const proc: any = {
      stdout: { on: jest.fn((event, cb) => { if (event === 'data') stdoutEvents.push(cb); return proc.stdout; }) },
      stderr: { on: jest.fn((event, cb) => { if (event === 'data') stderrEvents.push(cb); return proc.stderr; }) },
      on: jest.fn((event, cb) => { if (event === 'close') setTimeout(() => cb(code), 0); return proc; }),
    };
    mockSpawn.mockReturnValue(proc);
    // емуляція подій
    setTimeout(() => {
      if (stdout) stdoutEvents.forEach(cb => cb(Buffer.from(stdout)));
      if (stderr) stderrEvents.forEach(cb => cb(Buffer.from(stderr)));
    }, 0);
    return proc;
  }

  it('getVideoInfo: повертає метадані для валідного відео', async () => {
    const fakeJson = JSON.stringify({
      title: 'Test Video',
      uploader: 'Test Uploader',
      duration: 123,
      thumbnail: 'http://img',
      formats: [{ format_id: '18' }],
    });
    setupMockSpawn({ stdout: fakeJson });
    const res = await service.getVideoInfo({ url: 'https://youtube.com/v?id=123' });
    expect(res.status).toBe('success');
    expect(res.video_title).toBe('Test Video');
    expect(res.uploader).toBe('Test Uploader');
    expect(res.duration).toBe(123);
    expect(Array.isArray(res.available_formats)).toBe(true);
  });

  it('getVideoInfo: повертає помилку для невалідного URL', async () => {
    setupMockSpawn({ code: 1, stderr: 'yt-dlp error' });
    const res = await service.getVideoInfo({ url: 'bad_url' });
    expect(res.status).toBe('error');
    expect(res.message).toContain('yt-dlp exited with code 1');
  });

  it('downloadVideo: повертає помилку для невалідного URL', async () => {
    setupMockSpawn({ code: 1, stderr: 'yt-dlp error' });
    const res = await service.downloadVideo({ url: 'bad_url' });
    expect(res.status).toBe('error');
    expect(res.message).toContain('yt-dlp exited with code 1');
  });

  it('downloadVideo: успішно повертає шлях до файлу', async () => {
    const fakeJson = JSON.stringify({
      _filename: '/tmp/test_video.mp4',
      ext: 'mp4',
      acodec: 'mp4a.40.2',
    });
    setupMockSpawn({ stdout: fakeJson });
    mockFs.existsSync.mockReturnValue(true);
    const res = await service.downloadVideo({
      url: 'https://youtube.com/v?id=123',
      output_path: '/tmp/test_video.%(ext)s',
      extract_audio_only: false,
    });
    expect(res.status).toBe('success');
    expect(res.file_path).toBe('/tmp/test_video.mp4');
    expect(res.final_video_format).toBe('mp4');
    expect(res.final_audio_format).toBe('mp4a.40.2');
  });

  it('downloadVideo: повертає помилку якщо файл не створено', async () => {
    const fakeJson = JSON.stringify({
      _filename: '/tmp/test_video.mp4',
      ext: 'mp4',
      acodec: 'mp4a.40.2',
    });
    setupMockSpawn({ stdout: fakeJson });
    mockFs.existsSync.mockReturnValue(false);
    const res = await service.downloadVideo({
      url: 'https://youtube.com/v?id=123',
      output_path: '/tmp/test_video.%(ext)s',
      extract_audio_only: false,
    });
    expect(res.status).toBe('error');
    expect(res.message).toContain('Файл не створено');
  });
}); 