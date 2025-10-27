#!/usr/bin/env python3
"""
Script to automatically generate videos.json and thumbnails
from all MP4 files in the current directory.

Usage:
    python3 generate_videos.py

This will:
1. Scan for all *.mp4 files
2. Generate thumbnail JPGs (if not exists)
3. Create/update videos.json
"""

import json
import subprocess
from pathlib import Path

def generate_thumbnail(video_path, output_path, width=400):
    """Generate a thumbnail from a video using ffmpeg."""
    if output_path.exists():
        print(f"  ✓ Thumbnail exists: {output_path.name}")
        return

    cmd = [
        'ffmpeg', '-i', str(video_path),
        '-ss', '00:00:00.5',  # Extract at 0.5 seconds
        '-vframes', '1',
        '-vf', f'scale={width}:-1',
        str(output_path),
        '-y'
    ]

    try:
        subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
        print(f"  ✓ Generated thumbnail: {output_path.name}")
    except subprocess.CalledProcessError as e:
        print(f"  ✗ Failed to generate thumbnail for {video_path.name}: {e}")

def main():
    # Get current directory
    video_dir = Path(".")
    thumbnails_dir = video_dir / "thumbnails"

    # Create thumbnails directory if it doesn't exist
    thumbnails_dir.mkdir(exist_ok=True)

    # Find all MP4 files (sorted)
    video_files = sorted(video_dir.glob("*.mp4"))

    if not video_files:
        print("No MP4 files found in current directory!")
        return

    print(f"Found {len(video_files)} video(s):")

    # Generate thumbnails
    print("\nGenerating thumbnails...")
    for video_file in video_files:
        thumbnail_path = thumbnails_dir / f"{video_file.stem}.jpg"
        generate_thumbnail(video_file, thumbnail_path)

    # Create JSON structure
    data = {
        "videos": [
            {
                "id": video_file.stem,
                "video": f"resources/webpage_demo/{video_file.name}",
                "thumbnail": f"resources/webpage_demo/thumbnails/{video_file.stem}.jpg"
            }
            for video_file in video_files
        ]
    }

    # Write videos.json
    json_path = video_dir / "videos.json"
    with open(json_path, "w") as f:
        json.dump(data, f, indent=2)

    print(f"\n✓ Generated {json_path.name} with {len(video_files)} video(s):")
    for video in data["videos"]:
        print(f"  - {video['id']}")

    print("\nDone! You can now reload the webpage to see the changes.")

if __name__ == "__main__":
    main()
