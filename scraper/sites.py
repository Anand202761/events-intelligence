# ──────────────────────────────────────────────────────────
#  SITES TO TRACK
#  Add / remove entries freely.
#  "name" is displayed in the UI as the institute tag.
# ──────────────────────────────────────────────────────────
SITES = [
    # IISc
    {"name": "IISc", "url": "https://iisc.ac.in"},
    {"name": "IISc Events", "url": "https://iisc.ac.in/events/"},
    {"name": "IISc MRDG", "url": "https://mrdg.iisc.ac.in/"},

    # IISER Pune
    {"name": "IISER Pune", "url": "https://iiserpune.ac.in"},
    {"name": "IISER Pune Events", "url": "https://iiserpune.ac.in/events"},
    {"name": "IISER Pune Biology", "url": "https://www.iiserpune.ac.in/research/department/biology"},

    # IISER Kolkata
    {"name": "IISER Kolkata", "url": "https://iiserkol.ac.in"},
    {"name": "IISER Kolkata Events", "url": "https://www.iiserkol.ac.in/~web/en/events/"},

    # IISER Bhopal
    {"name": "IISER Bhopal", "url": "https://iiserb.ac.in"},
    {"name": "IISER Bhopal Biology", "url": "https://iiserb.ac.in/department/biological-sciences"},

    # IISER Mohali
    {"name": "IISER Mohali", "url": "https://iisermohali.ac.in"},
    {"name": "IISER Mohali Events", "url": "https://www.iisermohali.ac.in/events"},

    # IIT Madras
    {"name": "IIT Madras", "url": "https://iitm.ac.in"},
    {"name": "IIT Madras BT Dept", "url": "https://biotech.iitm.ac.in/"},
    {"name": "IIT Madras Events", "url": "https://iitm.ac.in/happenings/events-and-conferences"},

    # IIT Bombay
    {"name": "IIT Bombay", "url": "https://iitb.ac.in"},
    {"name": "IIT Bombay Biotech", "url": "https://www.bio.iitb.ac.in/"},

    # IIT Delhi
    {"name": "IIT Delhi", "url": "https://iitd.ac.in"},
    {"name": "IIT Delhi DBEB", "url": "https://dbeb.iitd.ac.in/"},

    # IIT Kanpur
    {"name": "IIT Kanpur", "url": "https://iitk.ac.in"},
    {"name": "IIT Kanpur Biotech", "url": "https://www.iitk.ac.in/bsbe/"},

    # IIT Kharagpur
    {"name": "IIT Kharagpur", "url": "https://iitkgp.ac.in"},
    {"name": "IIT KGP BioTech", "url": "https://www.iitkgp.ac.in/department/BT"},

    # IISER TVM
    {"name": "IISER TVM", "url": "https://iisertvm.ac.in"},
    {"name": "IISER TVM Events", "url": "https://iisertvm.ac.in/events"},

    # NCBS Bangalore (pure biotech research institute)
    {"name": "NCBS", "url": "https://www.ncbs.res.in/"},
    {"name": "NCBS Events", "url": "https://www.ncbs.res.in/events"},

    # InStem
    {"name": "InStem", "url": "https://www.instem.res.in/"},
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
    "internship",
    "conference",
    "webinar",
    "seminar",
    "paper presentation",
    "workshop",
    "hackathon",
    "research exposure",
]
