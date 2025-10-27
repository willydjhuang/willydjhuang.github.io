# Video Comparison Demo

This directory contains videos for the interactive comparison teaser on the main page.

## How It Works

The webpage automatically loads all videos from this directory and creates thumbnail buttons dynamically.

### File Structure

```
webpage_demo/
├── *.mp4                    # Video files (side-by-side comparisons)
├── thumbnails/              # Auto-generated thumbnails
│   └── *.jpg
├── videos.json              # Auto-generated video list
├── generate_videos.py       # Script to regenerate videos.json
└── README.md                # This file
```

## Adding New Videos

To add new comparison videos:

1. **Add your MP4 file(s)** to this directory
   - Videos should contain side-by-side comparisons
   - Format: `<name>.mp4` (e.g., `bicycle.mp4`, `garden.mp4`)

2. **Run the generation script:**
   ```bash
   cd /path/to/webpage_demo
   python3 generate_videos.py
   ```

3. **Refresh the webpage** - the new videos will appear automatically!

## What the Script Does

The `generate_videos.py` script:
- Scans for all `*.mp4` files in this directory
- Generates thumbnail images (400px wide) at 0.5 seconds into each video
- Creates/updates `videos.json` with the video list
- Thumbnails are only generated if they don't already exist

## Removing Videos

To remove a video:

1. **Delete the MP4 file**
2. **Optionally delete** the corresponding thumbnail from `thumbnails/`
3. **Run the script again:**
   ```bash
   python3 generate_videos.py
   ```

The webpage will automatically update to show only the remaining videos.

## Manual Thumbnail Generation

If you want to create custom thumbnails instead of auto-generated ones:

1. Place your custom thumbnail as `thumbnails/<name>.jpg`
2. The script will skip auto-generation if the thumbnail already exists
3. Run `python3 generate_videos.py` to update `videos.json`

## Video Requirements

- **Format:** MP4 (H.264)
- **Layout:** Side-by-side comparison (left half | right half)
- **Resolution:** Any (common: 1100x550 or 1024x512)
- **The video will be split in half** by the comparison viewer

## Troubleshooting

**Videos not appearing on webpage?**
- Check that `videos.json` exists and is up-to-date
- Run `python3 generate_videos.py` to regenerate
- Check browser console for errors (F12)

**Thumbnails look wrong?**
- Delete the thumbnail from `thumbnails/` directory
- Run `python3 generate_videos.py` to regenerate
- Or create a custom thumbnail manually

**Need to change thumbnail extraction time?**
- Edit `generate_videos.py`
- Find the line: `-ss', '00:00:00.5'`
- Change to desired timestamp (e.g., `00:00:01.0` for 1 second)
