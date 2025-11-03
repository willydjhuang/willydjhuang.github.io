# Synchronized Triple Video Comparison - Implementation Guide

## Overview

The SuperHead project page now features a **synchronized triple video comparison** system where three side-by-side comparison videos share a single synchronized slider control. Moving the slider in any of the three frames will simultaneously move all three sliders.

## Changes Made

### 1. **Updated Python Script** (`resources/webpage_demo/generate_videos.py`)

**What Changed:**
- Scans for **folders** instead of individual MP4 files
- Each folder must contain:
  - `{example_name}_left.mp4`
  - `{example_name}_middle.mp4`
  - `{example_name}_right.mp4`
  - `{example_name}.jpg` (thumbnail)
- Generates JSON with the new structure: `examples` array with `left_video`, `middle_video`, `right_video`, and `thumbnail` fields

**Usage:**
```bash
cd resources/webpage_demo/
python3 generate_videos.py
```

### 2. **HTML Structure** (`index.html`)

**What Changed:**
- Replaced single video comparison with three side-by-side containers
- Each container has its own video element and canvas:
  - `videoLeft` / `videoLeftMerge`
  - `videoMiddle` / `videoMiddleMerge`
  - `videoRight` / `videoRightMerge`
- Updated JavaScript to:
  - Load from the new JSON structure (`data.examples`)
  - Initialize all three videos simultaneously
  - Switch all three videos together when thumbnail is clicked

**Key Features:**
- Safari-compatible video loading with multiple event listeners
- Synchronized video initialization
- Thumbnail gallery dynamically populated from JSON

### 3. **New JavaScript Module** (`static/js/triple_video_comparison.js`)

**Core Functionality:**

#### Global Synchronized Position
```javascript
var globalSliderPosition = 0.5;
```
- Shared across all three canvases
- Updated when any slider is moved

#### Synchronized Slider Function
```javascript
function playTripleVids(videoLeftId, videoMiddleId, videoRightId)
```
- Initializes all three video players
- Sets up event listeners on all canvases
- Draws all three comparisons using the same `globalSliderPosition`

#### Event Handling
- Mouse and touch events on any canvas update `globalSliderPosition`
- All three canvases redraw on every animation frame using the synchronized position

#### Key Functions:
- `resizeAndPlayTriple()` - Initializes the three-video system
- `stopAllPlayers()` - Cleans up when switching examples
- `drawVideoComparison()` - Renders individual video comparison
- `drawUIElements()` - Draws slider line and arrows

### 4. **CSS Updates** (`static/css/index.css`)

**What Changed:**

#### New Triple Container Layout
```css
.triple-comparison-container {
  display: flex;
  justify-content: center;
  gap: 15px;
  max-width: 1200px;
}
```

#### Video Wrapper Sizing
```css
.video-comparison-wrapper {
  flex: 1;
  max-width: 32%;
}
```

#### Canvas Styling
- Added `cursor: ew-resize` to show draggability
- `width: 100%` for responsive sizing
- Maintained border and shadow effects

#### Responsive Design
```css
@media (max-width: 1024px) {
  .triple-comparison-container {
    flex-direction: column;
  }
}
```
- Stacks vertically on smaller screens

## Folder Structure

```
resources/webpage_demo/
├── 218/
│   ├── 218_left.mp4
│   ├── 218_middle.mp4
│   ├── 218_right.mp4
│   └── 218.jpg
├── 306/
│   ├── 306_left.mp4
│   ├── 306_middle.mp4
│   ├── 306_right.mp4
│   └── 306.jpg
├── marcel/
│   ├── marcel_left.mp4
│   ├── marcel_middle.mp4
│   ├── marcel_right.mp4
│   └── marcel.jpg
├── wojtek/
│   ├── wojtek_left.mp4
│   ├── wojtek_middle.mp4
│   ├── wojtek_right.mp4
│   └── wojtek.jpg
├── generate_videos.py
└── videos.json (auto-generated)
```

## Generated JSON Structure

```json
{
  "examples": [
    {
      "id": "218",
      "left_video": "resources/webpage_demo/218/218_left.mp4",
      "middle_video": "resources/webpage_demo/218/218_middle.mp4",
      "right_video": "resources/webpage_demo/218/218_right.mp4",
      "thumbnail": "resources/webpage_demo/218/218.jpg"
    },
    ...
  ]
}
```

## How It Works

### Initialization (Page Load)
1. Fetch `videos.json`
2. Create thumbnail buttons from `examples` array
3. Load first example's three videos
4. Wait for all videos to be ready
5. Call `resizeAndPlayTriple()` to start synchronized playback

### User Interaction
1. **Moving Slider**: User moves slider on any canvas
2. **Position Update**: `globalSliderPosition` is updated (0 to 1)
3. **Synchronized Redraw**: All three canvases redraw using the new position
4. **Visual Feedback**: Slider lines and arrows move together

### Switching Examples
1. User clicks thumbnail
2. All three videos are paused
3. All canvases are cleared
4. New video sources are loaded
5. System waits for all three to be ready
6. `resizeAndPlayTriple()` is called again

## Key Features

✅ **Synchronized Sliders** - Moving one slider moves all three
✅ **Safari Compatible** - Multiple event listeners for reliability
✅ **Responsive Design** - Works on desktop and mobile
✅ **Dynamic Loading** - Videos managed via JSON file
✅ **Easy Management** - Run Python script to update content
✅ **Smooth Animation** - Uses `requestAnimationFrame` for 60fps

## Adding New Examples

1. Create folder with example name (e.g., `new_example/`)
2. Add three videos:
   - `new_example_left.mp4`
   - `new_example_middle.mp4`
   - `new_example_right.mp4`
3. Add thumbnail: `new_example.jpg`
4. Run `python3 generate_videos.py`
5. Refresh webpage

## Technical Notes

### Video Requirements
- All three videos must have **same resolution**
- All three videos must have **same duration**
- Videos are split in half (left/right comparison in each)
- Format: MP4 with H.264 codec recommended

### Performance
- Uses canvas 2D API for efficient rendering
- Hardware-accelerated drawing
- Minimal memory footprint with shared position state

### Browser Compatibility
- ✅ Chrome/Edge (full support)
- ✅ Safari (with compatibility fixes)
- ✅ Firefox (full support)
- ✅ Mobile browsers (with touch support)

## Troubleshooting

**Videos not loading:**
- Check console for errors
- Verify video paths in JSON
- Ensure videos are accessible via web server

**Sliders not synchronized:**
- Check `globalSliderPosition` is being updated
- Verify event listeners are attached to all canvases
- Check browser console for JavaScript errors

**Layout issues:**
- Verify CSS is loaded properly
- Check browser window size (responsive breakpoint at 1024px)
- Inspect element to verify flex layout is applied

## Future Enhancements

Possible improvements:
- Add playback speed control
- Add play/pause buttons
- Add frame-by-frame navigation
- Display comparison labels (method names)
- Add keyboard shortcuts for slider control
