export interface DownloadVideoParams {
  url: string;
  quality_preference?: string;
  video_container_preference?: string;
  audio_container_preference?: string;
  output_path?: string;
  extract_audio_only?: boolean;
}

export interface DownloadVideoResult {
  status: 'success' | 'error';
  message: string;
  file_path?: string;
  filename?: string;
  final_video_format?: string;
  final_audio_format?: string;
  metadata?: any;
}

export interface GetVideoInfoParams {
  url: string;
}

export interface GetVideoInfoResult {
  status: 'success' | 'error';
  video_title?: string;
  uploader?: string;
  duration?: number;
  thumbnail_url?: string;
  available_formats?: any[];
  message?: string;
} 