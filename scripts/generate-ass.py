#!/usr/bin/env python3
"""Generate properly synced ASS subtitle files from Whisper SRT."""

import re
import sys

def parse_srt(path):
    """Parse SRT file into list of {index, start_s, end_s, text}."""
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    blocks = re.split(r'\n\n+', content.strip())
    entries = []
    for block in blocks:
        lines = block.strip().split('\n')
        if len(lines) < 3:
            continue
        try:
            idx = int(lines[0])
        except ValueError:
            continue

        tc_match = re.match(r'(\d+):(\d+):(\d+),(\d+)\s*-->\s*(\d+):(\d+):(\d+),(\d+)', lines[1])
        if not tc_match:
            continue

        g = tc_match.groups()
        start_s = int(g[0])*3600 + int(g[1])*60 + int(g[2]) + int(g[3])/1000
        end_s = int(g[4])*3600 + int(g[5])*60 + int(g[6]) + int(g[7])/1000
        text = ' '.join(lines[2:]).strip()

        entries.append({'index': idx, 'start': start_s, 'end': end_s, 'text': text})

    return entries

def refine_text(text):
    """Clean up spoken Korean to written Korean."""
    # Remove leading spaces
    text = text.strip()
    # Fix known proper nouns
    replacements = {
        '안태흡': 'ANTIEGG',
        '안티애그': 'ANTIEGG',
        '안티에그': 'ANTIEGG',
        '챗지피티': 'ChatGPT',
        '챗GPT': 'ChatGPT',
        '오픈에이아이': 'OpenAI',
        '오픈 에이아이': 'OpenAI',
        '제미나이': 'Gemini',
        '제미니': 'Gemini',
        '클로드': 'Claude',
        '논리지': '날리지',
        '널리지': '날리지',
        '옵시디안': '옵시디언',
        'TE옵스': 'TalentOps',
    }
    for old, new in replacements.items():
        text = text.replace(old, new)

    # Remove filler words
    fillers = ['어 ', '음 ', '그래서 뭐냐면 ', '근데 뭐냐면 ', '뭐냐 하면 ']
    for f in fillers:
        text = text.replace(f, '')

    # Clean up
    text = re.sub(r'\s+', ' ', text).strip()

    return text

def extract_segments(entries, segments):
    """Extract SRT entries for given time segments and remap to output time."""
    result = []
    output_offset = 0.0

    for seg_start, seg_end in segments:
        for entry in entries:
            # Check if entry overlaps with segment
            if entry['end'] <= seg_start or entry['start'] >= seg_end:
                continue

            # Clamp to segment bounds
            e_start = max(entry['start'], seg_start)
            e_end = min(entry['end'], seg_end)

            # Remap to output time
            out_start = output_offset + (e_start - seg_start)
            out_end = output_offset + (e_end - seg_start)

            text = refine_text(entry['text'])
            if not text:
                continue

            duration = out_end - out_start
            # Skip very short overlaps (< 0.5s)
            if duration < 0.5:
                continue

            # Split long entries into multiple 2-line chunks (max ~45 chars)
            if len(text) > 50 and duration > 2.0:
                chunks = split_into_chunks(text)
                # Proportional timing based on character count
                total_chars = sum(len(c) for c in chunks)
                t = out_start
                for chunk in chunks:
                    ratio = len(chunk) / total_chars
                    chunk_dur = max(1.2, duration * ratio)  # min 1.2s per chunk
                    result.append({
                        'start': t,
                        'end': min(t + chunk_dur, out_end),
                        'text': chunk
                    })
                    t += chunk_dur
            else:
                result.append({'start': out_start, 'end': out_end, 'text': text})

        output_offset += (seg_end - seg_start)

    return result

def split_at_natural_break(text):
    """Split text into 2 lines at a natural Korean sentence break."""
    if len(text) <= 24:
        return text

    # Priority 1: split at sentence-ending particles + space
    break_patterns = [
        # Connective endings (Korean grammar natural breaks)
        '되고 ', '하고 ', '있고 ', '었고 ', '했고 ',
        '되는 ', '하는 ', '있는 ', '었는 ', '했는 ',
        '되면 ', '하면 ', '있으면 ', '었으면 ',
        '해서 ', '돼서 ', '있어서 ', '었어서 ',
        '인데 ', '는데 ', '었는데 ', '했는데 ',
        '지만 ', '었지만 ',
        '니까 ', '으니까 ',
        '거든요. ', '잖아요. ', '거예요. ',
        '합니다. ', '됩니다. ', '있습니다. ',
        # Comma-like breaks
        '그래서 ', '그리고 ', '근데 ', '하지만 ',
        # Object/subject markers as break points
    ]

    best_pos = -1
    best_score = float('inf')
    mid = len(text) / 2

    for pattern in break_patterns:
        pos = text.find(pattern)
        while pos != -1:
            break_at = pos + len(pattern)
            # Score: distance from midpoint (prefer closer to middle)
            score = abs(break_at - mid)
            # Penalize very uneven splits (< 30% on either side)
            ratio = break_at / len(text)
            if ratio < 0.25 or ratio > 0.75:
                score += 100
            if score < best_score:
                best_score = score
                best_pos = break_at
            pos = text.find(pattern, pos + 1)

    if best_pos > 0:
        return text[:best_pos].rstrip() + '\\N' + text[best_pos:].lstrip()

    # Fallback: split at nearest space to midpoint
    mid = len(text) // 2
    space_pos = text.rfind(' ', max(0, mid - 12), mid + 12)
    if space_pos > 0:
        return text[:space_pos] + '\\N' + text[space_pos+1:]

    return text

def split_into_chunks(text, max_chars=45):
    """Split long text into multiple subtitle entries, each max 2 lines."""
    # Try splitting at sentence-ending patterns first
    sentence_ends = ['. ', '요. ', '다. ', '죠. ', '데. ', '고. ']
    chunks = []
    remaining = text

    while len(remaining) > max_chars:
        best_pos = -1
        for pattern in sentence_ends:
            pos = remaining.find(pattern, 15, max_chars + 5)
            if pos != -1:
                best_pos = pos + len(pattern)
                break

        if best_pos == -1:
            # Fallback: split at connective endings
            for pattern in ['되고 ', '하고 ', '해서 ', '인데 ', '지만 ', '니까 ', '거든요 ']:
                pos = remaining.find(pattern, 15, max_chars + 5)
                if pos != -1:
                    best_pos = pos + len(pattern)
                    break

        if best_pos == -1:
            # Last resort: split at space near midpoint
            mid = min(max_chars, len(remaining) // 2)
            space_pos = remaining.rfind(' ', max(10, mid - 15), mid + 15)
            if space_pos > 0:
                best_pos = space_pos + 1
            else:
                best_pos = max_chars

        chunks.append(remaining[:best_pos].strip())
        remaining = remaining[best_pos:].strip()

    if remaining:
        chunks.append(remaining)

    return chunks

def format_ass_time(seconds):
    """Format seconds to ASS time: H:MM:SS.cc"""
    h = int(seconds // 3600)
    m = int((seconds % 3600) // 60)
    s = int(seconds % 60)
    cs = int((seconds % 1) * 100)
    return f"{h}:{m:02d}:{s:02d}.{cs:02d}"

def generate_ass(subtitle_entries, title="ANTIEGG Shortform"):
    """Generate ASS file content."""
    header = f"""[Script Info]
Title: {title}
ScriptType: v4.00+
WrapStyle: 0
ScaledBorderAndShadow: yes
YCbCr Matrix: TV.709
PlayResX: 1080
PlayResY: 1920

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV
Style: Default,SUIT,58,&H00FFFFFF,&H000000FF,&H00000000,&H96000000,-1,0,0,0,100,100,0,0,1,3,4,2,40,40,80

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""

    events = []
    for entry in subtitle_entries:
        start = format_ass_time(entry['start'])
        end = format_ass_time(entry['end'])
        # Split long text into 2 lines at natural sentence breaks
        text = entry['text']
        if len(text) > 24 and '\\N' not in text:
            text = split_at_natural_break(text)
        text = text.replace('\n', '\\N')
        events.append(f"Dialogue: 0,{start},{end},Default,,0,0,0,,{text}")

    return header + '\n'.join(events) + '\n'


# Parse source SRT
srt_entries = parse_srt('/tmp/sample-transcript.srt')

# Define shortform segments: list of (start_seconds, end_seconds) in playback order
shortforms = {
    'hook-001': {
        'title': 'ANTIEGG Hook 001 - Ontology',
        'segments': [
            (283, 292),   # Hook: 4:43-4:52
            (222, 271),   # Context: 3:42-4:31
        ]
    },
    'hook-002': {
        'title': 'ANTIEGG Hook 002 - Feedback Loop',
        'segments': [
            (699, 705),   # Hook: 11:39-11:45
            (669, 699),   # Context: 11:09-11:39
            (705, 724),   # Climax: 11:45-12:04
        ]
    },
    'hook-003': {
        'title': 'ANTIEGG Hook 003 - CEO Staff',
        'segments': [
            (64, 69),     # Hook: 1:04-1:09
            (45, 64),     # Context: 0:45-1:04
            (69, 100),    # Specs: 1:09-1:40
            (116, 124),   # Climax: 1:56-2:04
        ]
    },
    'process-001': {
        'title': 'ANTIEGG Process 001 - 5 Layers',
        'segments': [
            (116, 167),   # Sequential: 1:56-2:47
        ]
    },
    'process-002': {
        'title': 'ANTIEGG Process 002 - Ontology',
        'segments': [
            (205, 292),   # Sequential: 3:25-4:52
        ]
    },
    'process-003': {
        'title': 'ANTIEGG Process 003 - Agent Team',
        'segments': [
            (302, 369),   # Sequential: 5:02-6:09
        ]
    },
}

for name, config in shortforms.items():
    entries = extract_segments(srt_entries, config['segments'])
    ass_content = generate_ass(entries, config['title'])
    output_path = f'/tmp/{name}.ass'
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(ass_content)
    print(f"Generated {output_path}: {len(entries)} subtitle entries")
