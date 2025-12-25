import re

# Read the file as text
with open('ifit_supplements.json', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix trailing commas before closing brackets in arrays
# This regex finds commas followed by optional whitespace and a closing bracket
content = re.sub(r',(\s*\n\s*])', r'\1', content)

# Remove all 150x150 image lines
lines = content.split('\n')
filtered_lines = []
skip_next_comma = False

for i, line in enumerate(lines):
    # Check if this line contains a 150x150 image
    if '150x150' in line:
        skip_next_comma = True
        continue
    
    # If previous line was 150x150 and this is just a comma, skip it
    if skip_next_comma and line.strip() == ',':
        skip_next_comma = False
        continue
    
    skip_next_comma = False
    filtered_lines.append(line)

content = '\n'.join(filtered_lines)

# Fix any remaining trailing commas
content = re.sub(r',(\s*\n\s*])', r'\1', content)

# Fix double empty lines in images arrays
content = re.sub(r'(\s*\n){3,}(\s*])', r'\n\2', content)

# Write back
with open('ifit_supplements.json', 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed ifit_supplements.json:")
print("- Removed all 150x150 images")
print("- Fixed trailing commas")
print("- Cleaned up formatting")
