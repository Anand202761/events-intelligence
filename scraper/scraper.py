import requests
from bs4 import BeautifulSoup
import json
import os
from datetime import datetime
from sites import SITES, KEYWORDS

# ─────────────────────────────────────────────
# CATEGORY → SHORT TYPE TAG  (for UI badge)
# ─────────────────────────────────────────────
CATEGORY_TAG = {
    "internship":        "INTERN",
    "conference":        "CONF",
    "webinar":           "WEBINAR",
    "seminar":           "SEMINAR",
    "paper presentation":"PAPER",
    "workshop":          "WORKSHOP",
    "hackathon":         "HACK",
    "research exposure": "REP",
}

# ─────────────────────────────────────────────
# SCRAPE A SINGLE SITE
# ─────────────────────────────────────────────
def scrape_site(site_info):
    url   = site_info["url"]
    name  = site_info["name"]
    found = []

    try:
        response = requests.get(
            url, timeout=12,
            headers={"User-Agent": "Mozilla/5.0 (compatible; EventBot/1.0)"}
        )
        response.raise_for_status()
        soup = BeautifulSoup(response.text, "html.parser")

        # look inside <a>, <li>, <p>, headings
        tags = soup.find_all(["a", "li", "p", "h2", "h3", "h4", "span"])

        for tag in tags:
            raw_text = tag.get_text(separator=" ", strip=True)
            lower    = raw_text.lower()

            for kw in KEYWORDS:
                if kw in lower:
                    # resolve the link
                    href = tag.get("href", "") if tag.name == "a" else ""
                    if href.startswith("http"):
                        event_url = href
                    elif href.startswith("/"):
                        event_url = url.rstrip("/") + href
                    else:
                        event_url = url

                    title = raw_text[:150].strip()
                    if len(title) < 8:          # skip trivial one-word hits
                        continue

                    found.append({
                        "title":      title,
                        "url":        event_url,
                        "institute":  name,
                        "category":   kw,
                        "type":       CATEGORY_TAG.get(kw, kw[:6].upper()),
                        "source":     url,
                        "scanned_at": datetime.utcnow().isoformat() + "Z",
                    })
                    break   # don't double-count the same tag for multiple keywords

    except requests.exceptions.RequestException as e:
        print(f"  ⚠  Could not reach {url}: {e}")

    return found


# ─────────────────────────────────────────────
# MAIN
# ─────────────────────────────────────────────
def main():
    all_events = []

    for site in SITES:
        print(f"🔍  Scraping {site['name']} …")
        events = scrape_site(site)
        all_events.extend(events)
        print(f"    → {len(events)} hits")

    # ── deduplicate by title ──
    seen, unique = set(), []
    for e in all_events:
        key = e["title"].lower()
        if key not in seen:
            seen.add(key)
            unique.append(e)

    # ── FILTER OUT OLD EVENTS ──
    from datetime import datetime
    current_year = datetime.utcnow().year
    
    def is_relevant(event):
        title = event["title"].lower()
        
        # Reject if title starts with an old year (e.g. "2009-", "2011-", "2014-")
        import re
        year_match = re.match(r'^(20\d{2})', title)
        if year_match:
            year = int(year_match.group(1))
            if year < current_year:
                return False
        
        # Reject if title contains old year anywhere like "Workshop 2022"
        years_in_title = re.findall(r'20\d{2}', title)
        for y in years_in_title:
            if int(y) < current_year:
                return False
        
        return True

    filtered = [e for e in unique if is_relevant(e)]

    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(filtered, f, indent=2, ensure_ascii=False)

    print(f"\n✅  Done — {len(filtered)} relevant events saved (removed {len(unique)-len(filtered)} old ones)")
