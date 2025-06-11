# yt-dlp-mcp

An MCP server implementation that integrates with yt-dlp, providing video and audio content download capabilities from YouTube and other platforms for LLMs.

## Features

* **Video Download**: Save videos to your specified folder with quality control
* **Audio Download**: Extract and save audio in various formats (mp3, m4a, ogg, opus)
* **Video Information**: Get metadata about videos without downloading
* **Privacy-Focused**: Direct download without tracking
* **MCP Integration**: Works with Claude Desktop and other MCP-compatible LLMs
* **Flexible Output**: Customizable output paths and file formats

## Installation

### Prerequisites

Install `yt-dlp` based on your operating system:

```bash

# macOS
brew install yt-dlp

# Linux
pip install yt-dlp
```

### With Claude Desktop

1. Open your Claude Desktop configuration file:
   - **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`

2. Add the MCP server configuration:

```json
{
  "mcpServers": {
    "yt-dlp-mcp": {
      "command": "npx",
      "args": [
        "-y",
        "@gtvar/yt-dlp-mcp"
      ]
    }
  }
}
```

3. Save the file and restart Claude Desktop

## Tool Documentation

* **get_video_info**
  * Get video metadata without downloading (title, duration, uploader, available formats)
  * Inputs:
    * `url` (string, required): URL of the video

* **download_video**
  * Download video or extract audio to specified location with quality control
  * Inputs:
    * `url` (string, required): URL of the video
    * `quality_preference` (string, optional): Video quality preference
    * `video_container_preference` (string, optional): Preferred video format
    * `audio_container_preference` (string, optional): Preferred audio format (mp3, m4a, ogg, opus)
    * `output_path` (string, optional): Custom output path with filename template
    * `extract_audio_only` (boolean, optional): Extract audio only. Defaults to false

## Usage Examples

Ask your LLM to:

```
"Get information about this video: https://youtube.com/watch?v=..."
"Download this YouTube video: https://youtube.com/watch?v=..."
"Extract audio from this video in mp3 format: https://youtube.com/watch?v=..."
"Download video with custom quality settings: https://youtube.com/watch?v=..."
"Save this video to a specific folder: https://youtube.com/watch?v=..."
```

## Manual Start

If needed, start the server manually:

```bash
npx @gtvar/yt-dlp-mcp
```

## Environment Variables

* `YTDLP_PATH` - Path to yt-dlp executable (default: 'yt-dlp')
* `YTDL_OUTPUT_DIR` - Default output directory (default: '/tmp')
* `FFMPEG_PATH` - Path to ffmpeg executable (optional)

## Requirements

* Node.js 20+
* `yt-dlp` in system PATH
* MCP-compatible LLM service (Claude Desktop, etc.)
* Optional: `ffmpeg` for additional format support


## License

MIT

## Author

gtvar
