#!/usr/bin/env python3
"""Compile fenced D2 diagrams into content-addressed SVG files."""

import hashlib
import re
import subprocess
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CONTENT = ROOT / "content"
OUTPUT = ROOT / "assets" / "generated" / "d2"

OPENING = re.compile(r"^ {0,3}(`{3,}|~{3,})(.*)$")


def extract_diagrams(markdown: str):
    lines = markdown.splitlines(keepends=True)
    index = 0

    while index < len(lines):
        line = lines[index].rstrip("\r\n")
        match = OPENING.match(line)

        if not match:
            index += 1
            continue

        fence = match.group(1)
        marker = fence[0]
        length = len(fence)
        info = match.group(2).strip()
        language = info.split(None, 1)[0].lower() if info else ""

        if marker == "`" and "`" in info:
            index += 1
            continue

        index += 1
        body = []
        closed = False

        closing = re.compile(
            rf"^ {{0,3}}{re.escape(marker)}{{{length},}}[ \t]*$"
        )

        while index < len(lines):
            current = lines[index]

            if closing.fullmatch(current.rstrip("\r\n")):
                closed = True
                index += 1
                break

            body.append(current)
            index += 1

        if language != "d2" or not closed:
            continue

        text = "".join(body)

        # Hugo Goldmark .Inner excludes the final line terminator.
        if text.endswith("\r\n"):
            text = text[:-2]
        elif text.endswith(("\n", "\r")):
            text = text[:-1]

        if text.strip():
            yield text


def compile_diagram(source: str, output: Path):
    output.parent.mkdir(parents=True, exist_ok=True)

    with tempfile.TemporaryDirectory(
        prefix=".docs-d2-",
        dir=output.parent,
    ) as directory:
        input_path = Path(directory) / "diagram.d2"
        temp_output = Path(directory) / "diagram.svg"

        input_path.write_text(source, encoding="utf-8")

        result = subprocess.run(
            [
                "d2",
                "--layout=dagre",
                str(input_path),
                str(temp_output),
            ],
            capture_output=True,
            text=True,
            timeout=120,
        )

        if result.returncode != 0:
            raise RuntimeError(
                f"D2 compilation failed:\n{result.stderr}"
            )

        if not temp_output.is_file():
            raise RuntimeError("D2 did not produce an SVG file.")

        import xml.etree.ElementTree as ET
        root = ET.parse(temp_output).getroot()

        if root.tag != "{http://www.w3.org/2000/svg}svg":
            raise RuntimeError("D2 output is not a valid SVG.")

        temp_output.replace(output)


def main():
    if not CONTENT.is_dir():
        raise RuntimeError(f"Content directory not found: {CONTENT}")

    diagrams = {}

    for markdown_file in sorted(CONTENT.rglob("*.md")):
        markdown = markdown_file.read_text(encoding="utf-8")

        for source in extract_diagrams(markdown):
            digest = hashlib.sha256(source.encode("utf-8")).hexdigest()
            diagrams.setdefault(digest, (source, markdown_file))

    OUTPUT.mkdir(parents=True, exist_ok=True)

    built = 0
    cached = 0

    for digest, (source, markdown_file) in diagrams.items():
        output = OUTPUT / f"{digest}.svg"

        if output.is_file():
            cached += 1
            continue

        print(f"Compiling D2: {markdown_file.relative_to(ROOT)}")
        compile_diagram(source, output)
        built += 1

    print(
        f"D2 diagrams: {len(diagrams)} | "
        f"compiled: {built} | cached: {cached}"
    )


if __name__ == "__main__":
    try:
        main()
    except (RuntimeError, subprocess.TimeoutExpired, OSError) as error:
        print(f"ERROR: {error}", file=sys.stderr)
        sys.exit(1)
