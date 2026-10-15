#!/usr/bin/env python3
"""Compile fenced Typst Markdown blocks into SVG pages."""

import hashlib
import re
import subprocess
import sys
import tempfile
from pathlib import Path
from xml.etree import ElementTree

ROOT = Path(__file__).resolve().parents[1]
CONTENT = ROOT / "content"
OUTPUT = ROOT / "assets" / "generated" / "typst"

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

        if language != "typst" or not closed:
            continue

        text = "".join(body)

        # Match Hugo Goldmark's .Inner behavior.
        if text.endswith("\r\n"):
            text = text[:-2]
        elif text.endswith(("\n", "\r")):
            text = text[:-1]

        if text.strip():
            yield text


def validate_svg(path: Path):
    root = ElementTree.parse(path).getroot()

    if root.tag != "{http://www.w3.org/2000/svg}svg":
        raise RuntimeError(f"Invalid SVG: {path}")


def compile_diagram(source: str, directory: Path, digest: str):
    directory.mkdir(parents=True, exist_ok=True)

    with tempfile.TemporaryDirectory(
        prefix=".typst-build-",
        dir=directory,
    ) as temp:
        temp = Path(temp)

        input_path = temp / "diagram.typ"
        output_pattern = temp / "page-{p}.svg"

        input_path.write_text(source, encoding="utf-8")

        result = subprocess.run(
            [
                "typst",
                "compile",
                "--format",
                "svg",
                str(input_path),
                str(output_pattern),
            ],
            capture_output=True,
            text=True,
            timeout=120,
        )

        if result.returncode:
            raise RuntimeError(
                "Typst compilation failed:\n"
                + result.stderr
            )

        pages = sorted(
            temp.glob("page-*.svg"),
            key=lambda path: int(
                path.stem.removeprefix("page-")
            ),
        )

        if not pages:
            raise RuntimeError("Typst produced no SVG pages.")

        for number, page in enumerate(pages, start=1):
            validate_svg(page)

            destination = directory / f"{digest}-{number}.svg"
            page.replace(destination)

        return len(pages)


def main():
    if not CONTENT.is_dir():
        raise RuntimeError(
            f"Content directory not found: {CONTENT}"
        )

    diagrams = {}

    for markdown_file in sorted(CONTENT.rglob("*.md")):
        markdown = markdown_file.read_text(encoding="utf-8")

        for source in extract_diagrams(markdown):
            digest = hashlib.sha256(
                source.encode("utf-8")
            ).hexdigest()

            diagrams.setdefault(
                digest,
                (source, markdown_file),
            )

    OUTPUT.mkdir(parents=True, exist_ok=True)

    compiled = 0
    cached = 0

    for digest, (source, markdown_file) in diagrams.items():
        manifest = OUTPUT / f"{digest}.pages"

        if manifest.is_file():
            try:
                count = int(
                    manifest.read_text(
                        encoding="utf-8"
                    ).strip()
                )
            except ValueError:
                count = 0

            if count > 0 and all(
                (OUTPUT / f"{digest}-{number}.svg").is_file()
                for number in range(1, count + 1)
            ):
                cached += 1
                continue

        print(
            "Compiling Typst:",
            markdown_file.relative_to(ROOT),
        )

        count = compile_diagram(
            source,
            OUTPUT,
            digest,
        )

        manifest.write_text(
            str(count) + "\n",
            encoding="utf-8",
        )

        compiled += 1

    print(
        f"Typst diagrams: {len(diagrams)}"
        f" | compiled: {compiled}"
        f" | cached: {cached}"
    )


if __name__ == "__main__":
    try:
        main()
    except (
        RuntimeError,
        subprocess.TimeoutExpired,
        OSError,
        ValueError,
    ) as error:
        print(f"ERROR: {error}", file=sys.stderr)
        sys.exit(1)
