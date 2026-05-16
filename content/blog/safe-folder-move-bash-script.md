+++
title = 'Safe Folder Move Bash Script'
date = '2026-05-16T21:24:52+03:00'
lastmod = '2026-05-16T21:24:52+03:00'
draft = false

# SEO REQUIRED
# - title: clear promise, no clickbait
# - description: 140-160 chars, user intent focused
# - summary: 1-2 sentences, concrete value
# - slug: short, readable, topic-focused
# - canonicalURL: set if this content is republished elsewhere
# - cover.alt: descriptive image alt text
# - keywords/tags/categories: only truly relevant terms
author = "Murat Kurkoglu"
description = "A simple Bash script with demo, dry-run, and apply modes to safely move a folder along with its contents."
slug = "safe-folder-move-bash-script"
canonicalURL = ""

summary = "This post shows a safe Bash workflow for moving a folder into another folder completely and in a controlled way: demo first, then dry-run, and finally a confirmed apply."
canonicalURL = ""
keywords = ["move folder bash script", "linux move folder", "move folder in terminal"]
tags = ["bash", "linux", "terminal", "folder-move"]
categories = ["Bash Scripts"]


ShowReadingTime = true
ShowWordCount = true
ShowToc = true
TocOpen = true
ShowBreadCrumbs = true
ShowPostNavLinks = true
ShowShareButtons = true
ShowCodeCopyButtons = true

[cover]
  image = ""
  alt = ""
  caption = ""
  relative = true

# PUBLISH CHECKLIST
# [ ] One search intent only (single problem)
# [ ] Intro explains problem + solution + target reader
# [ ] Includes real examples/commands/output
# [ ] Includes 3-8 relevant internal links
# [ ] Includes external links only to authoritative sources
# [ ] Includes "when to use / when not to use"
# [ ] Includes risks and rollback notes if technical
# [ ] Updated lastmod when content changes
+++

**Move a folder into another folder in a controlled way, including all files and subfolders.**

# PROBLEM

Moving a folder in the terminal looks easy:

```bash
mv source destination/
```

But real folders come with real risk. You can mistype the destination, the destination may already contain a folder with the same name, the move may not happen the way you expect, or you may run the command without seeing what will happen first.

Example:

You want to move a project folder into `backup/`. But if `backup/project` already exists, a plain `mv` can produce an outcome you did not intend. That is why it is safer to preview the result first.

━━━━━━━━━━━━━━━━━━

# SOLUTION

This script splits the folder move into three steps:

- `--demo`: Runs a safe demo using fake data
- `--dry-run`: Shows what would happen for a real folder, but does not move anything
- `--apply`: Performs the real move only when `--yes` confirmation is provided

This way, you see the outcome first and apply the move intentionally.

━━━━━━━━━━━━━━━━━━

# WHAT IT DOES

- Checks whether the source folder exists
- Checks whether the destination parent folder exists
- Stops if a folder with the same name already exists at the destination
- Does not modify any files in dry-run mode
- Moves the folder with all contents in apply mode
- Prints readable terminal output like `[INFO]`, `[DRY-RUN]`, `[OK]`, `[DONE]`

━━━━━━━━━━━━━━━━━━

# BENEFITS

- Reduces manual `mv` mistakes
- Shows the outcome before touching real files
- Makes the folder-move flow clear for videos, READMEs, and blog posts
- Builds a safer terminal habit for beginners
- Lets you try the script without using your own files thanks to demo mode

Main takeaway:

Running a dry-run before moving a folder is one of the simplest and most effective safety steps in the terminal.

━━━━━━━━━━━━━━━━━━



# SAFETY MODEL

This script has three clear modes:

```bash
./safe-folder-move.sh --demo
./safe-folder-move.sh --dry-run /path/to/source /path/to/destination-parent
./safe-folder-move.sh --apply /path/to/source /path/to/destination-parent --yes
```

Demo mode runs only inside `demo/`.
Dry-run mode checks a real folder but does not move anything.
Apply mode performs the real move and requires `--yes`.

━━━━━━━━━━━━━━━━━━

# DEMO FIRST

Run the demo first:

```bash
chmod +x safe-folder-move.sh
./safe-folder-move.sh --demo
```

The demo creates a fake `source-project` folder inside `demo/` and moves it into `archive/`. It does not touch your own files.

━━━━━━━━━━━━━━━━━━

# TEST ON YOUR FOLDER

For a real folder, run dry-run first:

```bash
./safe-folder-move.sh --dry-run /home/murat/project /home/murat/backup
```

This command only shows:

```text
/home/murat/project would be moved to /home/murat/backup/project.
```

No files are moved.

━━━━━━━━━━━━━━━━━━

# APPLY FOR REAL

After checking the dry-run output, perform the real move:

```bash
./safe-folder-move.sh --apply /home/murat/project /home/murat/backup --yes
```

This command moves the `project` folder and all its contents into `backup/project`.

━━━━━━━━━━━━━━━━━━

# REQUIREMENTS

- Bash
- Standard Unix tools: `mkdir`, `mv`, `find`, `basename`

No extra packages are required.

━━━━━━━━━━━━━━━━━━

# SCRIPT

Save as: `safe-folder-move.sh`

```bash
#!/usr/bin/env bash
set -euo pipefail

SCRIPT_NAME="$(basename "$0")"
DEMO_DIR="demo"

usage() {
  cat <<EOF
Usage:
  ./$SCRIPT_NAME --demo
  ./$SCRIPT_NAME --dry-run /path/to/source-folder /path/to/destination-parent
  ./$SCRIPT_NAME --apply /path/to/source-folder /path/to/destination-parent --yes
  ./$SCRIPT_NAME --install-deps
EOF
}

install_deps() {
  echo "[INFO] Checking dependencies..."
  echo "[OK] No external dependencies are required"
  echo "[DONE] Dependency check completed"
}

require_source_dir() {
  local source_dir="$1"

  if [[ ! -d "$source_dir" ]]; then
    echo "[ERROR] Source folder not found: $source_dir"
    exit 1
  fi

  if [[ ! -r "$source_dir" ]]; then
    echo "[ERROR] Source folder is not readable: $source_dir"
    exit 1
  fi
}

require_destination_parent() {
  local destination_parent="$1"

  if [[ ! -d "$destination_parent" ]]; then
    echo "[ERROR] Destination parent folder not found: $destination_parent"
    exit 1
  fi

  if [[ ! -w "$destination_parent" ]]; then
    echo "[ERROR] Destination parent folder is not writable: $destination_parent"
    exit 1
  fi
}

destination_path_for() {
  local source_dir="$1"
  local destination_parent="$2"
  local folder_name

  folder_name="$(basename "$source_dir")"
  printf "%s/%s\n" "$destination_parent" "$folder_name"
}

print_tree() {
  local root="$1"
  find "$root" -print | sort
}

validate_move() {
  local source_dir="$1"
  local destination_parent="$2"
  local destination_path

  require_source_dir "$source_dir"
  require_destination_parent "$destination_parent"

  destination_path="$(destination_path_for "$source_dir" "$destination_parent")"

  if [[ -e "$destination_path" ]]; then
    echo "[ERROR] Destination already exists: $destination_path"
    echo "[INFO] Choose another destination parent or rename the source folder first"
    exit 1
  fi
}

run_demo() {
  echo "[INFO] Starting demo..."
  rm -rf -- "$DEMO_DIR"
  mkdir -p "$DEMO_DIR/source-project/docs" "$DEMO_DIR/source-project/assets" "$DEMO_DIR/archive"
  printf "hello\n" > "$DEMO_DIR/source-project/README.md"
  printf "notes\n" > "$DEMO_DIR/source-project/docs/notes.txt"
  printf "logo placeholder\n" > "$DEMO_DIR/source-project/assets/logo.txt"

  echo "[DEMO] Creating sample data in: $DEMO_DIR/"
  echo "[BEFORE] Demo folder tree:"
  print_tree "$DEMO_DIR"

  validate_move "$DEMO_DIR/source-project" "$DEMO_DIR/archive"
  mv -- "$DEMO_DIR/source-project" "$DEMO_DIR/archive/"

  echo "[OK] Moved source-project into archive/"
  echo "[AFTER] Demo folder tree:"
  print_tree "$DEMO_DIR"
  echo "[DONE] Demo completed"
}

run_dry_run() {
  local source_dir="$1"
  local destination_parent="$2"
  local destination_path

  echo "[INFO] Dry-run mode"
  validate_move "$source_dir" "$destination_parent"
  destination_path="$(destination_path_for "$source_dir" "$destination_parent")"

  echo "[DRY-RUN] Source: $source_dir"
  echo "[DRY-RUN] Destination: $destination_path"
  echo "[DRY-RUN] This folder would be moved with all contents"
  echo "[DONE] Dry-run completed"
}

run_apply() {
  local source_dir="$1"
  local destination_parent="$2"
  local confirm="${3:-}"
  local destination_path

  if [[ "$confirm" != "--yes" ]]; then
    echo "[ERROR] Apply mode requires explicit confirmation"
    echo "        ./$SCRIPT_NAME --apply \"$source_dir\" \"$destination_parent\" --yes"
    exit 1
  fi

  echo "[WARN] Apply mode can move real files"
  echo "[WARN] Run --dry-run first and check the output before applying"

  validate_move "$source_dir" "$destination_parent"
  destination_path="$(destination_path_for "$source_dir" "$destination_parent")"
  mv -- "$source_dir" "$destination_parent/"

  echo "[OK] Moved folder to: $destination_path"
  echo "[DONE] Apply completed"
}

main() {
  case "${1:-}" in
    --demo)
      run_demo
      ;;
    --dry-run)
      if [[ $# -lt 3 ]]; then
        usage
        exit 1
      fi
      run_dry_run "$2" "$3"
      ;;
    --apply)
      if [[ $# -lt 3 ]]; then
        usage
        exit 1
      fi
      run_apply "$2" "$3" "${4:-}"
      ;;
    --install-deps)
      install_deps
      ;;
    -h|--help|"")
      usage
      ;;
    *)
      echo "[ERROR] Unknown option: $1"
      usage
      exit 1
      ;;
  esac
}

main "$@"
```

━━━━━━━━━━━━━━━━━━

# EXPECTED DEMO OUTPUT

```text
[INFO] Starting demo...
[DEMO] Creating sample data in: demo/
[BEFORE] Demo folder tree:
demo
demo/archive
demo/source-project
demo/source-project/README.md
demo/source-project/assets
demo/source-project/assets/logo.txt
demo/source-project/docs
demo/source-project/docs/notes.txt
[OK] Moved source-project into archive/
[AFTER] Demo folder tree:
demo
demo/archive
demo/archive/source-project
demo/archive/source-project/README.md
demo/archive/source-project/assets
demo/archive/source-project/assets/logo.txt
demo/archive/source-project/docs
demo/archive/source-project/docs/notes.txt
[DONE] Demo completed
```

━━━━━━━━━━━━━━━━━━

# OUTPUT FORMAT

- `[INFO]` general info
- `[DEMO]` data created only for the demo
- `[BEFORE]` state before the action
- `[AFTER]` state after the action
- `[DRY-RUN]` action preview without applying
- `[OK]` successful step
- `[WARN]` risk / something to pay attention to
- `[ERROR]` error
- `[DONE]` completed

━━━━━━━━━━━━━━━━━━

# CUSTOMIZE

- Use your own folder name instead of `source-project`
- Provide the destination parent folder (the folder that will contain the moved folder)
- If a destination folder with the same name exists, the script will not move anything
- For extra safety, you can add checks before moving (disk space, checksum, etc.)

━━━━━━━━━━━━━━━━━━

# TROUBLESHOOTING

## Destination already exists

A folder with the same name already exists at the destination. Check the destination folder and choose a different destination parent if needed.

## Source folder not found

The source folder path is incorrect. Using an absolute path is safer.

## Permission denied

The source must be readable and the destination parent must be writable. Check permissions.

## Apply does not run

Apply mode intentionally requires `--yes`:

```bash
./safe-folder-move.sh --apply /source /destination --yes
```

━━━━━━━━━━━━━━━━━━

# FINAL CHECKLIST

- `./safe-folder-move.sh --demo` works
- Demo only operates inside `demo/`
- Dry-run does not modify real files
- Apply will not run without `--yes`
- The script stops if a destination folder with the same name exists
- The blog post is not just code
- Terminal output is readable for video

━━━━━━━━━━━━━━━━━━
