#!/usr/bin/env python3
import re
import sys
from pathlib import Path


def build_injection(url: str, image_url: str, title: str, description: str) -> str:
    esc_title = title.replace('"', "&quot;")
    esc_desc = description.replace('"', "&quot;")
    json_title = title.replace('"', '\\"')
    json_desc = description.replace('"', '\\"')
    return (
        f'<meta property="og:url" content="{url}">'
        f'<meta property="og:type" content="website">'
        f'<meta property="og:title" content="{esc_title}">'
        f'<meta property="og:description" content="{esc_desc}">'
        f'<meta property="og:image" content="{image_url}">'
        f'<meta name="twitter:card" content="summary_large_image">'
        f'<meta name="twitter:title" content="{esc_title}">'
        f'<meta name="twitter:description" content="{esc_desc}">'
        f'<meta name="twitter:image" content="{image_url}">'
        f'<script type="application/ld+json">{{"@context":"https://schema.org","@type":"WebPage","name":"{json_title}","url":"{url}","description":"{json_desc}"}}</script>'
    )


def patch_file(path: Path, default_image: str) -> bool:
    text = path.read_text(encoding="utf-8", errors="ignore")
    if "</head>" not in text:
        return False

    m = re.search(r'<link rel=canonical href=([^>\s]+)>', text)
    if not m:
        m = re.search(r'<link rel="canonical" href="([^"]+)"', text)
    if not m:
        return False

    url = m.group(1).strip('"')
    title_match = re.search(r"<title>(.*?)</title>", text, re.IGNORECASE | re.DOTALL)
    title = title_match.group(1).strip() if title_match else "orioninsist"
    desc_match = re.search(r"<meta name=description content=\"([^\"]*)\"", text)
    if not desc_match:
        desc_match = re.search(r'<meta name="description" content="([^"]*)"', text)
    description = (
        desc_match.group(1).strip()
        if desc_match
        else "The personal blog of Murat Kurkoglu on cyber security, Linux, and technology."
    )

    needs = []
    if "og:image" not in text:
        needs.append("og")
    if "twitter:image" not in text:
        needs.append("tw")
    if "application/ld+json" not in text:
        needs.append("jsonld")
    if not needs:
        return False

    injection = build_injection(url, default_image, title, description)
    new_text = text.replace("</head>", injection + "</head>", 1)
    path.write_text(new_text, encoding="utf-8")
    return True


def main() -> int:
    public_dir = Path(sys.argv[1]) if len(sys.argv) > 1 else Path("public")
    default_image = (
        sys.argv[2]
        if len(sys.argv) > 2
        else "https://orioninsist.org/about/muratkurkoglu-2.webp"
    )

    patterns = [
        "tags/page/*/index.html",
        "categories/page/*/index.html",
    ]

    patched = 0
    for pattern in patterns:
        for f in public_dir.glob(pattern):
            if patch_file(f, default_image):
                patched += 1

    print(f"postprocess_alias_seo: patched {patched} files")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
