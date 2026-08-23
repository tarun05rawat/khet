from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
import os
import tempfile
import subprocess
import json
import re
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

app = Flask(__name__)
CORS(app, origins=["*"])  # In production, restrict this to your frontend domain

# --- Config ---
GEMINI_API_KEY = os.getenv("GOOGLE_API_KEY")
if not GEMINI_API_KEY:
    raise RuntimeError("GOOGLE_API_KEY environment variable not set")
genai.configure(api_key=GEMINI_API_KEY)

# Render's default install path after shell install
TECTONIC_BIN = "/opt/render/project/.cargo/bin/tectonic"

# --- Constants ---
SYSTEM_PROMPT = """
You are a Grant Reporting Assistant working on behalf of Fourth & Hope — a nonprofit organization based in Woodland and Yolo County, California.

Mission Summary:
• Fourth & Hope provides food, shelter, clothing, and addiction recovery services to those in need.
• The organization operates under Charitable Choice, welcoming everyone and offering a safe, non-discriminatory, faith-based environment.
• Core values: Compassion, Faith, Integrity, Service, and Stewardship.

About Fourth & Hope:
• Founded in 1985, it evolved from community-led food distribution efforts.
• Services include a 100-bed emergency shelter, a 44-bed residential treatment center (Walter’s House), hot meal programs, permanent supportive housing, substance use recovery, employment services, and more.

Your goal is to generate a professional grant report in LaTeX format. The report must include:

Formatting Notes:
• Use 12-point Times or similar, 1-inch margins.
• Number the pages.
• Do not include binders or folders; single staple or paperclip is sufficient.
• Mail original and send electronic copy to communityrelations@imf.org.

Output only the content between \\begin{document} and \\end{document}.
Do NOT include \\documentclass, \\usepackage, or other preamble.
"""

MOCK_DATA = {
    "reportPeriod": "Q1 2025",
    "dateGenerated": "April 19, 2025",
    "kpis": {
        "totalServed": 487,
        "mealsServed": 3120,
        "bedOccupancyRate": 0.92,
        "permanentHousingTransitions": 18,
        "programCompletions": 14,
        "jobPlacements": 11,
        "volunteerHours": 203,
        "budgetAllocated": 60000,
        "budgetSpent": 57240
    },
    "highlights": [
        "Expanded kitchen team to provide vegetarian meal options.",
        "4 program graduates returned as volunteer mentors.",
        "Launched 'Hope Garden' therapy initiative in partnership with local church."
    ],
    "goalsNextQuarter": [
        "Pilot new job training workshop for shelter residents.",
        "Increase bed capacity by 10%.",
        "Implement digital intake forms for faster check-ins."
    ]
}

def fix_unclosed_braces(text: str) -> str:
    """Auto-close common LaTeX commands with missing closing braces."""
    patterns = [r"\\textbf\{", r"\\textit\{", r"\\section\{", r"\\subsection\{", r"\\emph\{"]
    for pattern in patterns:
        openings = len(re.findall(pattern, text))
        closings = text.count("}")
        if closings < openings:
            text += "}" * (openings - closings)
    return text

@app.route("/generate-report", methods=["POST"])
def generate_report():
    try:
        # Generate LaTeX body from Gemini
        model = genai.GenerativeModel("gemini-2.0-flash")
        contents = [
            {"role": "user", "parts": [{"text": SYSTEM_PROMPT}]},
            {"role": "user", "parts": [{"text": json.dumps(MOCK_DATA, indent=2)}]}
        ]
        response = model.generate_content(contents)
        raw_body = response.candidates[0].content.parts[0].text

        if not raw_body:
            raise ValueError("No LaTeX body returned by Gemini")

        # Sanitize LaTeX body
        body_tex = raw_body
        for pattern in [
            r"^\\documentclass.*$",
            r"^\\usepackage.*$",
            r"^\\geometry.*$",
            r"^\\pagenumbering.*$",
            r"^\\title.*$",
            r"^\\author.*$",
            r"^\\date.*$",
            r"^\\maketitle.*$",
            r"^\\begin\{document\}.*$",
            r"^\\end\{document\}.*$",
        ]:
            body_tex = re.sub(pattern, "", body_tex, flags=re.MULTILINE)

        body_tex = re.sub(r"(?<!\\)&", r"\\&", body_tex)
        body_tex = body_tex.replace("“", "\"").replace("”", "\"").replace("‘", "'").replace("’", "'")
        body_tex = fix_unclosed_braces(body_tex)

        # Wrap in full document
        full_tex = f"""
\\documentclass[12pt]{{article}}
\\usepackage[margin=1in]{{geometry}}
\\usepackage{{hyperref}}
\\usepackage{{graphicx}}
\\pagenumbering{{arabic}}

\\title{{Grant Report: {MOCK_DATA['reportPeriod']}}}
\\author{{Fourth \\& Hope}}
\\date{{{MOCK_DATA['dateGenerated']}}}

\\begin{{document}}
\\maketitle

{body_tex.strip()}

\\end{{document}}
""".strip()

        # Compile to PDF
        with tempfile.TemporaryDirectory() as tmpdir:
            tex_path = os.path.join(tmpdir, "report.tex")
            pdf_path = os.path.join(tmpdir, "report.pdf")

            with open(tex_path, "w") as f:
                f.write(full_tex)

            result = subprocess.run(
                [TECTONIC_BIN, tex_path],
                cwd=tmpdir,
                capture_output=True,
                text=True
            )

            if result.returncode != 0:
                print("🚨 Tectonic stderr:\n", result.stderr)
                print("📄 LaTeX (first 20 lines):\n", "\n".join(full_tex.splitlines()[:20]))
                return jsonify({
                    "error": "Tectonic compilation failed.",
                    "stderr": result.stderr
                }), 500

            if not os.path.exists(pdf_path):
                return jsonify({"error": "PDF not generated."}), 500

            return send_file(pdf_path, as_attachment=True, download_name="FourthAndHope_Q1-2025.pdf")

    except Exception as e:
        print("🔥 Exception:", e)
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080)
