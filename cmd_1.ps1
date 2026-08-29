python -c "
import json
with open(r'C:\Users\ammar\.gemini\antigravity\brain\4b58ac3d-6106-4e5a-9836-a4e336d3b3ce\.system_generated\logs\transcript.jsonl', 'r', encoding='utf-8') as f:
    for line in f:
        if 'Set-Content -Path ''src\App.css''' in line or 'App.css' in line:
            print(line[:200])
"