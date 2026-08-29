python -c "
import json
i = 0
with open(r'C:\Users\ammar\.gemini\antigravity\brain\4b58ac3d-6106-4e5a-9836-a4e336d3b3ce\.system_generated\logs\transcript_full.jsonl', 'r', encoding='utf-8') as f:
    for line in f:
        data = json.loads(line)
        if data.get('type') == 'PLANNER_RESPONSE':
            if 'tool_calls' in data:
                for tc in data['tool_calls']:
                    if tc['name'] == 'run_command':
                        cmd = tc['args'].get('CommandLine', '')
                        if 'Set-Content' in cmd and 'App.css' in cmd:
                            with open(f'c:\\Users\\ammar\\frontend-project\\cmd_{i}.ps1', 'w', encoding='utf-8') as out:
                                out.write(cmd)
                            i += 1
"