# ──────────────────────────────────────────────────────────
#  SITES TO TRACK
#  Add / remove entries freely.
#  "name" is displayed in the UI as the institute tag.
# ──────────────────────────────────────────────────────────
SITES = [
    {"name": "IISc",         "url": "https://iisc.ac.in"},
    {"name": "IISER Pune",   "url": "https://iiserpune.ac.in"},
    {"name": "IISER Kolkata","url": "https://iiserkol.ac.in"},
    {"name": "IISER Bhopal", "url": "https://iiserb.ac.in"},
    {"name": "IISER Mohali", "url": "https://iisermohali.ac.in"},
    {"name": "IIT Madras",   "url": "https://iitm.ac.in"},
    {"name": "IIT Bombay",   "url": "https://iitb.ac.in"},
    {"name": "IIT Delhi",    "url": "https://iitd.ac.in"},
    {"name": "IIT Kanpur",   "url": "https://iitk.ac.in"},
    {"name": "IIT Kharagpur","url": "https://iitkgp.ac.in"},
]

# ──────────────────────────────────────────────────────────
#  KEYWORDS TO SEARCH FOR ON EACH PAGE
#  Lower-case only — the scraper does .lower() comparison.
# ──────────────────────────────────────────────────────────
KEYWORDS = [
    # These MUST appear alongside a biotech context
    "biotechnology internship",
    "biotech internship",
    "biology internship",
    "life sciences internship",
    "biotechnology workshop",
    "biotech workshop",
    "biology workshop",
    "biochemistry workshop",
    "biotechnology conference",
    "biology conference",
    "life sciences conference",
    "biotechnology seminar",
    "biology seminar",
    "biotech seminar",
    "biotechnology webinar",
    "biology webinar",
    "paper presentation biotechnology",
    "paper presentation biology",
    "biotech hackathon",
    "biology hackathon",
    "research exposure biotechnology",
    "research exposure biology",
    "summer research biology",
    "summer research biotech",
    "SRFP",           # IISC/IISER Summer Research Fellowship
    "SRF biotechnology",
    "microbiology",
    "genomics",
    "proteomics",
    "CRISPR",
    "bioinformatics",
]
