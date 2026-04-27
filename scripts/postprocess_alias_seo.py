#!/usr/bin/env python3
"""
Post-process Hugo alias pages to ensure basic social image metadata exists.

Usage:
  python3 scripts/postprocess_alias_seo.py public https://example.com/default.avif
"""

from __future__ import annotations

import re
import sys
from pathlib import Path


def upsert_meta(head: str, key: str, value: str, by_property: bool) -> str:
    if by_property:
        pattern = re.compile(
            r'<meta\s+[^>]*property=["\']'
            + re.escape(key)
            + r'["\'][^>]*>',
            flags=re.IGNORECASE,
        )
        replacement = f'<meta property="{key}" content="{value}">'
    else:
        pattern = re.compile(
            r'<meta\s+[^>]*name=["\']'
            + re.escape(key)
            + r'["\'][^>]*>',
            flags=re.IGNORECASE,
        )
        replacement = f'<meta name="{key}" content="{value}">'

    if pattern.search(head):
        return pattern.sub(replacement, head, count=1)
    return head + "\n" + replacement


def process_html(path: Path, default_image_url: str) -> bool:
    html = path.read_text(encoding="utf-8", errors="ignore")

    # Keep scope narrow: only Hugo alias/redirect-like pages.
    if "http-equiv=\"refresh\"" not in html.lower():
        return False

    match = re.search(r"(?is)<head[^>]*>(.*?)</head>", html)
    if not match:
        return False

    head_inner = match.group(1)
    updated_head = upsert_meta(head_inner, "og:image", default_image_url, by_property=True)
    updated_head = upsert_meta(updated_head, "twitter:image", default_image_url, by_property=False)

    if updated_head == head_inner:
        return False

    new_html = html[: match.start(1)] + updated_head + html[match.end(1) :]
    path.write_text(new_html, encoding="utf-8")
    return True


def main() -> int:
    if len(sys.argv) < 2:
        print("Usage: postprocess_alias_seo.py <public_dir> [default_image_url]", file=sys.stderr)
        return 2

    public_dir = Path(sys.argv[1])
    default_image_url = (
        sys.argv[2] if len(sys.argv) > 2 else "https://orioninsist.org/about/muratkurkoglu-2.avif"
    )

    if not public_dir.exists():
        print(f"Directory not found: {public_dir}", file=sys.stderr)
        return 2

    changed = 0
    for html_path in public_dir.rglob("*.html"):
        if process_html(html_path, default_image_url):
            changed += 1

    print(f"Alias SEO postprocess completed. Updated files: {changed}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

