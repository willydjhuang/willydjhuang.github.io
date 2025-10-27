# Dynamic Video Loading System

The video comparison teaser section now **automatically** loads videos from the `resources/webpage_demo/` folder. No code changes needed when adding or removing videos!

## How It Works

### 1. **Automatic Discovery**
- The page fetches `resources/webpage_demo/videos.json` on load
- This JSON file contains a list of all available videos and thumbnails
- Thumbnail buttons are generated dynamically based on the JSON content

### 2. **Easy Management**
Just use the provided Python script:

```bash
cd resources/webpage_demo/
python3 generate_videos.py
```

This script:
- ✓ Finds all `*.mp4` files
- ✓ Generates thumbnails automatically (if missing)
- ✓ Updates `videos.json` with current video list
- ✓ Maintains alphabetical order

### 3. **Adding Videos**

**Before** (manual, error-prone):
1. Add MP4 file
2. Create thumbnail manually
3. Edit HTML to add thumbnail button
4. Edit JavaScript to add video source
5. Hope you didn't make typos!

**Now** (automated):
1. Drop `new_scene.mp4` into `resources/webpage_demo/`
2. Run `python3 generate_videos.py`
3. Done! Refresh webpage to see it.

### 4. **Removing Videos**

**Before**:
1. Delete MP4 file
2. Delete thumbnail
3. Edit HTML to remove button
4. Edit JavaScript to remove mapping
5. Check for leftover references

**Now**:
1. Delete `old_scene.mp4`
2. Run `python3 generate_videos.py`
3. Done! Webpage automatically updates.

## File Structure

```
superhead/
├── index.html                          # Main page (loads videos dynamically)
├── resources/
│   └── webpage_demo/
│       ├── marcel.mp4                  # Video files
│       ├── person.mp4
│       ├── wojtek.mp4
│       ├── thumbnails/
│       │   ├── marcel.jpg              # Auto-generated thumbnails
│       │   ├── person.jpg
│       │   └── wojtek.jpg
│       ├── videos.json                 # Auto-generated video list
│       ├── generate_videos.py          # Helper script
│       └── README.md                   # Documentation
└── static/
    └── js/
        └── video_comparison.js         # Comparison viewer (with fixed pixel alignment)
```

## JavaScript Implementation

The page now uses **dynamic loading**:

```javascript
// Load videos from JSON
fetch('resources/webpage_demo/videos.json')
  .then(response => response.json())
  .then(data => {
    // Build video sources mapping
    data.videos.forEach(function(item) {
      videoSources[item.id] = item.video;
    });

    // Create thumbnail buttons dynamically
    data.videos.forEach(function(item, index) {
      var thumbDiv = document.createElement('div');
      thumbDiv.className = 'teaser-thumbnail' + (index === 0 ? ' active' : '');
      thumbDiv.onclick = function() { switchTeaserVideo(item.id, this); };

      var img = document.createElement('img');
      img.src = item.thumbnail;
      img.alt = item.id;

      thumbDiv.appendChild(img);
      gallery.appendChild(thumbDiv);
    });

    // Load first video
    if (data.videos.length > 0) {
      video.src = data.videos[0].video;
    }
  });
```

## Current Videos

As of now, the system includes:
- **marcel** (1024x512)
- **person** (1024x512)
- **wojtek** (1024x512)

## Video Format Requirements

- **Container:** MP4
- **Codec:** H.264 recommended
- **Layout:** Side-by-side comparison (left method | right method)
- **Resolution:** Any (will be split in half)
  - Common: 1100x550 → splits to 550x550
  - Common: 1024x512 → splits to 512x512

## Benefits

1. **Scalability:** Add 1 video or 100 videos - same process
2. **No code editing:** Never touch HTML/JS to manage videos
3. **Auto-thumbnails:** Consistent thumbnail extraction
4. **Error prevention:** No manual typos in file paths
5. **Maintainability:** Easy to see what videos exist
6. **Version control:** `videos.json` tracks video list changes

## Advanced Usage

### Custom Thumbnails
Don't like auto-generated thumbnails? Create your own:
1. Save as `thumbnails/<name>.jpg`
2. Script will skip auto-generation for existing thumbnails
3. Run `python3 generate_videos.py` to update JSON

### Changing Thumbnail Extraction Point
Edit `generate_videos.py`:
```python
'-ss', '00:00:00.5',  # Change this timestamp
```

### Video Order
Videos are sorted **alphabetically** by filename.
To control order, use numbered prefixes:
- `01_bicycle.mp4`
- `02_garden.mp4`
- `03_kitchen.mp4`

## Bug Fixes Included

The video comparison viewer also includes fixes for:
- ✓ **Pixel-perfect alignment** for different resolutions
- ✓ **Proper canvas reinitialization** when switching videos
- ✓ **Correct source extraction** from right half using `vidWidth + colStart`
- ✓ **Integer pixel calculations** with `Math.floor()`

## Testing

To test with different video counts:
1. Add more MP4s to `webpage_demo/`
2. Run `python3 generate_videos.py`
3. Refresh page - should see all videos
4. Remove some MP4s
5. Run script again
6. Refresh page - removed videos disappear automatically
