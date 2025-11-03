#!/usr/bin/env python3
"""
Script to automatically generate videos.json from example folders.

Usage:
    python3 generate_videos.py

This will:
1. Scan for all example folders containing {name}_left.mp4, {name}_middle.mp4, {name}_right.mp4
2. Use existing {name}.jpg as thumbnail (must exist in folder)
3. Create/update videos.json with the three-video structure
"""

import json
from pathlib import Path

def find_example_folders():
    """Find all folders containing the required video structure."""
    video_dir = Path(".")
    examples = []

    # Iterate through all subdirectories
    for folder in sorted(video_dir.iterdir()):
        if not folder.is_dir():
            continue

        # Skip special folders
        if folder.name in ['thumbnails', '__pycache__', '.git']:
            continue

        example_name = folder.name

        # Check for required files
        left_video = folder / f"{example_name}_left.mp4"
        middle_video = folder / f"{example_name}_middle.mp4"
        right_video = folder / f"{example_name}_right.mp4"
        thumbnail = folder / f"{example_name}.jpg"

        # Verify all required files exist
        if left_video.exists() and middle_video.exists() and right_video.exists():
            if not thumbnail.exists():
                print(f"  ⚠ Warning: Thumbnail missing for {example_name} (expected {thumbnail.name})")
                continue

            examples.append({
                'name': example_name,
                'folder': folder,
                'left_video': left_video,
                'middle_video': middle_video,
                'right_video': right_video,
                'thumbnail': thumbnail
            })
            print(f"  ✓ Found example: {example_name}")
        else:
            missing = []
            if not left_video.exists():
                missing.append(f"{example_name}_left.mp4")
            if not middle_video.exists():
                missing.append(f"{example_name}_middle.mp4")
            if not right_video.exists():
                missing.append(f"{example_name}_right.mp4")
            if missing:
                print(f"  ⚠ Skipping {example_name}: missing {', '.join(missing)}")

    return examples

def main():
    print("Scanning for example folders...")
    examples = find_example_folders()

    if not examples:
        print("\n✗ No valid example folders found!")
        print("\nExpected structure:")
        print("  example_name/")
        print("    example_name_left.mp4")
        print("    example_name_middle.mp4")
        print("    example_name_right.mp4")
        print("    example_name.jpg")
        return

    # Create JSON structure
    data = {
        "examples": [
            {
                "id": ex['name'],
                "left_video": f"resources/webpage_demo/{ex['name']}/{ex['name']}_left.mp4",
                "middle_video": f"resources/webpage_demo/{ex['name']}/{ex['name']}_middle.mp4",
                "right_video": f"resources/webpage_demo/{ex['name']}/{ex['name']}_right.mp4",
                "thumbnail": f"resources/webpage_demo/{ex['name']}/{ex['name']}.jpg"
            }
            for ex in examples
        ]
    }

    # Write videos.json
    json_path = Path(".") / "videos.json"
    with open(json_path, "w") as f:
        json.dump(data, f, indent=2)

    print(f"\n✓ Generated {json_path.name} with {len(examples)} example(s):")
    for ex in examples:
        print(f"  - {ex['name']}")

    print("\nDone! You can now reload the webpage to see the changes.")

if __name__ == "__main__":
    main()
