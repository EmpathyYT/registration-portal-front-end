python -c "
import json
with open(r'C:\Users\ammar\.gemini\antigravity\brain\4b58ac3d-6106-4e5a-9836-a4e336d3b3ce\.system_generated\logs\transcript_full.jsonl', 'r', encoding='utf-8') as f:
    for line in f:
        data = json.loads(line)
        if data.get('type') == 'PLANNER_RESPONSE':
            if 'tool_calls' in data:
                for tc in data['tool_calls']:
                    if tc['name'] == 'run_command':
                        cmd = tc['args'].get('CommandLine', '')
                        if 'Set-Content' in cmd and 'App.css' in cmd:
                            with open(r'c:\Users\ammar\frontend-project\src\App.css', 'w', encoding='utf-8') as out:
                                # We need to extract the here-string or raw string from the command
                                # Or just write the whole command to a temp file so we can see it
                                out.write(cmd)
                            print('Extracted command!')
"