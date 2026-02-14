#!/usr/bin/env python3
"""
THE CLARITY PROTOCOL - Premium PDF Builder v2
Uses Chrome headless for full CSS rendering with Google Fonts.
"""
import os, re, subprocess, markdown

SRC = "/Users/christiaanwillemdewet/.gemini/antigravity/brain/418d1443-76a8-49da-89d0-be9043efbf08"
OUT = "/Users/christiaanwillemdewet/Library/Mobile Documents/com~apple~CloudDocs/Downloads/new app/clarity_protocol/PDFs"
TMP = "/tmp/clarity_html"
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

CSS = """
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500&display=swap');

@page { size: A4; margin: 2cm 2.2cm 2.5cm 2.2cm; }
@page :first { margin: 0; }
* { margin: 0; padding: 0; box-sizing: border-box; }

body {
    font-family: 'Inter', -apple-system, sans-serif;
    font-size: 10pt; line-height: 1.75; color: #1a1a1a;
    background: white; -webkit-font-smoothing: antialiased;
}

.cover {
    width: 210mm; height: 297mm;
    background: linear-gradient(160deg, #0a0a0a 0%, #1a1a1a 40%, #2a2a2a 100%);
    display: flex; flex-direction: column; justify-content: center;
    align-items: center; text-align: center;
    page-break-after: always; position: relative; overflow: hidden;
}
.cover::before {
    content: ''; position: absolute; top: -50%; left: -50%; width: 200%; height: 200%;
    background: radial-gradient(circle at 30% 40%, rgba(255,255,255,0.03) 0%, transparent 50%),
                radial-gradient(circle at 70% 60%, rgba(255,255,255,0.02) 0%, transparent 40%);
}
.cover-brand {
    font-size: 9pt; font-weight: 500; letter-spacing: 6px;
    text-transform: uppercase; color: rgba(255,255,255,0.4);
    margin-bottom: 40px; position: relative;
}
.cover h1 {
    font-size: 32pt; font-weight: 800; color: white;
    letter-spacing: -0.5px; line-height: 1.15; max-width: 80%;
    margin-bottom: 25px; position: relative; border: none; padding: 0;
}
.cover-line { width: 60px; height: 2px; background: linear-gradient(90deg, rgba(255,255,255,0.6), rgba(255,255,255,0.1)); margin-bottom: 25px; }
.cover-subtitle { font-size: 10pt; font-weight: 300; color: rgba(255,255,255,0.5); letter-spacing: 1px; max-width: 60%; line-height: 1.6; position: relative; }
.cover-footer { position: absolute; bottom: 40px; font-size: 7pt; letter-spacing: 3px; text-transform: uppercase; color: rgba(255,255,255,0.2); }

.content { padding: 10px 0; }

h1 { font-size: 20pt; font-weight: 800; color: #0a0a0a; margin: 35px 0 12px 0; padding-bottom: 10px; border-bottom: 2.5px solid #0a0a0a; letter-spacing: -0.3px; line-height: 1.2; page-break-after: avoid; }
h2 { font-size: 15pt; font-weight: 700; color: #1a1a1a; margin: 28px 0 10px 0; padding-bottom: 7px; border-bottom: 1px solid #e0e0e0; page-break-after: avoid; }
h3 { font-size: 12pt; font-weight: 600; color: #1a1a1a; margin: 22px 0 8px 0; page-break-after: avoid; }
h4 { font-size: 10.5pt; font-weight: 600; color: #555; margin: 16px 0 6px 0; }
p { margin-bottom: 10px; }
strong { font-weight: 600; color: #0a0a0a; }
em { font-style: italic; color: #555; }

table { width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 8.5pt; page-break-inside: avoid; border: 1px solid #e0e0e0; border-radius: 4px; overflow: hidden; }
thead th, th { background: #0a0a0a; color: white; font-weight: 600; padding: 9px 12px; text-align: left; font-size: 8pt; text-transform: uppercase; letter-spacing: 0.5px; border: none; }
td { padding: 7px 12px; border-bottom: 1px solid #f0f0f0; vertical-align: top; }
tr:nth-child(even) td { background: #f7f7f7; }
tr:last-child td { border-bottom: none; }

blockquote { border-left: 3px solid #0a0a0a; margin: 18px 0; padding: 14px 20px; background: #f5f5f5; border-radius: 0 6px 6px 0; font-style: italic; color: #555; page-break-inside: avoid; }
blockquote p { margin-bottom: 0; }

code { font-family: 'JetBrains Mono', 'Menlo', monospace; background: #f0f0f0; padding: 2px 6px; border-radius: 3px; font-size: 8.5pt; color: #1a1a1a; }
pre { background: #1a1a1a; color: #e8e8e8; padding: 16px 20px; border-radius: 8px; font-size: 8pt; line-height: 1.6; overflow-wrap: break-word; white-space: pre-wrap; page-break-inside: avoid; margin: 14px 0; border: 1px solid #333; }
pre code { background: none; color: #e8e8e8; padding: 0; font-size: 8pt; }

ul, ol { margin: 8px 0 12px 0; padding-left: 22px; }
li { margin-bottom: 5px; line-height: 1.6; }
li::marker { color: #555; }
hr { border: none; height: 2px; background: linear-gradient(90deg, #0a0a0a, transparent); margin: 30px 0; }
"""

def md_to_html(md_text):
    return markdown.markdown(md_text, extensions=['tables', 'fenced_code', 'codehilite', 'toc', 'sane_lists'])

def build_html(title, html_body):
    dt = title.replace('_', ' ')
    return f"""<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><title>{dt}</title><style>{CSS}</style></head>
<body>
<div class="cover">
    <div class="cover-brand">The Clarity Protocol</div>
    <h1>{dt}</h1>
    <div class="cover-line"></div>
    <div class="cover-subtitle">Built in Cape Town. Engineered for the world.</div>
    <div class="cover-footer">CLARITY PROTOCOL</div>
</div>
<div class="content">{html_body}</div>
</body></html>"""

def chrome_pdf(html_path, pdf_path):
    cmd = [CHROME, '--headless', '--disable-gpu', '--no-sandbox',
           '--disable-software-rasterizer', '--run-all-compositor-stages-before-draw',
           f'--print-to-pdf={pdf_path}', '--print-to-pdf-no-header',
           f'file://{html_path}']
    subprocess.run(cmd, capture_output=True, text=True, timeout=30)
    return os.path.exists(pdf_path) and os.path.getsize(pdf_path) > 1000

def build_pdf(title, source_files, output_path):
    combined = ""
    for src in source_files:
        fp = os.path.join(SRC, src)
        if os.path.exists(fp):
            with open(fp, 'r', encoding='utf-8') as f:
                combined += f.read() + "\n\n---\n\n"
        else:
            print(f"     ! Missing: {src}")
    if not combined.strip():
        return False
    try:
        html_body = md_to_html(combined)
        full_html = build_html(title, html_body)
        html_path = os.path.join(TMP, f"{title}.html")
        with open(html_path, 'w', encoding='utf-8') as f:
            f.write(full_html)
        if chrome_pdf(html_path, output_path):
            kb = os.path.getsize(output_path) / 1024
            print(f"     OK  {os.path.basename(output_path)} ({kb:.0f} KB)")
            return True
        else:
            print(f"     ERR Chrome failed: {title}")
            return False
    except Exception as e:
        print(f"     ERR {title}: {e}")
        return False

PDFS = {
    "01_Mindset": [
        ("Stoic_Journaling_Syllabus", ["stoic_journal_30.md"]),
        ("Clarity_Filter_Blueprint", ["clarity_filter_blueprint.md"]),
        ("Clarity_Prompts", ["clarity_prompts.md"]),
        ("Mental_Models", ["chapter_8_inversion.md", "chapter_9_essentialism.md", "chapter_10_second_order.md"]),
        ("Clarity_Skill_Tree", ["clarity_skill_tree.md"]),
    ],
    "02_Biohacking": [
        ("System_Reset_Guide", ["system_reset_guide.md"]),
        ("Thermal_Protocol", ["thermal_protocol.md"]),
        ("Circadian_and_Light", ["chapter_6_circadian.md"]),
        ("Biohacking_Protocol", ["biohacking_protocol.md"]),
        ("Knowledge_Arsenal", ["knowledge_arsenal.md"]),
        ("Science_Annex", ["clarity_science_annex.md"]),
        ("Sleep_and_Hygiene", ["chapter_7_hygiene.md"]),
    ],
    "03_Fuel": [
        ("SA_Shopping_List", ["sa_shopping_list.md"]),
        ("SA_Recipes_and_Tracker", ["sa_recipes_tracker.md"]),
        ("HGH_Meal_Plan", ["hgh_meal_plan.md"]),
        ("Seed_Cycling_Calendar", ["seed_cycling_calendar.md"]),
        ("Nutritional_Chapters", ["chapter_1_red_list.md", "chapter_2_endocrine.md", "chapter_3_fuel.md", "chapter_4_water_paradox.md", "chapter_5_air_sanctuary.md"]),
        ("Kitchen_Audit", ["chapter_13_kitchen_audit.md"]),
        ("CNS_Recovery_Nutrition", ["cns_recovery_nutrition.md"]),
    ],
    "04_Movement": [
        ("Calisthenics_Progression_12wk", ["calisthenics_progression.md"]),
        ("Hybrid_Programs_6pack", ["hybrid_programs.md"]),
        ("Her_Phasic_Training", ["her_training_programs.md"]),
        ("Muscle_Up_and_10K_Plan", ["progression_plan.md"]),
        ("Training_Phase_4wk", ["training_phase_4week.md"]),
        ("Workout_Database_Complete", ["workout_database.md", "workout_engine_50.md"]),
        ("HGH_Workouts", ["big_six_batch.md"]),
        ("Grip_and_Hang_Workouts", ["grip_hang_batch.md"]),
        ("MetCon_Workouts", ["metcon_batch.md"]),
        ("Progress_Dashboard", ["progress_dashboard.md"]),
    ],
    "05_Launch": [
        ("Video_Scripts_and_Books", ["video_scripts.md"]),
        ("Content_Calendar_30day", ["content_calendar.md"]),
        ("Email_Sequence", ["email_sequence.md"]),
        ("Landing_Page_SA", ["landing_page.md"]),
        ("Global_Sales_Page", ["global_sales_page.md"]),
        ("Global_Funnel", ["global_funnel.md"]),
        ("Sovereignty_Ads", ["sovereignty_ads.md"]),
        ("Master_Prompt", ["master_prompt.md"]),
    ],
    "06_Complete_Guides": [
        ("Day_1_Protocol", ["day_1_protocol.md"]),
        ("Her_Edition_Complete", ["her_edition.md"]),
        ("Course_Blueprint", ["course_blueprint.md"]),
        ("Global_Roadmap", ["global_roadmap.md"]),
        ("30_Day_Reset", ["chapter_14_30_day_reset.md"]),
        ("Daily_Routine", ["chapter_12_daily_routine.md"]),
        ("Skin_Game", ["chapter_11_skin_game.md"]),
        ("Rebuild_Curriculum_12wk", ["clarity_rebuild_curriculum.md"]),
    ],
}

def main():
    os.makedirs(TMP, exist_ok=True)
    print("\n  THE CLARITY PROTOCOL - PREMIUM PDF BUILDER v2\n  Chrome Headless | Inter Font | Dark Cover Pages\n")
    total = ok = 0
    for folder, pdfs in PDFS.items():
        fp = os.path.join(OUT, folder)
        os.makedirs(fp, exist_ok=True)
        print(f"  [{folder}]")
        for name, srcs in pdfs:
            total += 1
            if build_pdf(name, srcs, os.path.join(fp, f"{name}.pdf")):
                ok += 1
        print()
    print(f"  COMPLETE: {ok}/{total} Premium PDFs")
    print(f"  Location: {OUT}\n")

if __name__ == "__main__":
    main()
