import os
import re

html_path = 'c:/Users/Lenovo/Documents/Website_memories/index.html'
img_dir   = 'c:/Users/Lenovo/Documents/Website_memories/assets/images'

with open(html_path, 'r', encoding='utf-8') as f:
    content = f.read()

all_files = os.listdir(img_dir)

# === 1. File gallery utama: HANYA WhatsApp images ===
gallery_files = sorted([f for f in all_files
                        if 'WhatsApp' in f and f.lower().endswith(('.jpg', '.jpeg'))])

# === 2. File pas foto: semua yang BUKAN WhatsApp ===
pas_foto_files = sorted([f for f in all_files
                         if 'WhatsApp' not in f and not f.startswith('.')
                         and f.lower().endswith(('.jpg', '.jpeg', '.JPG'))])

# === Build gallery HTML (WhatsApp only) ===
gallery_html = '        <div class="masonry-grid">\n'
for i, f in enumerate(gallery_files):
    gallery_html += f'            <div class="grid-item"><img src="assets/images/{f}" alt="Kenangan {i+1}"></div>\n'
gallery_html += '        </div>'

# === Build pas foto HTML (no caption) ===
pas_foto_items = ''
for f in pas_foto_files:
    pas_foto_items += f'            <div class="grid-item"><img src="assets/images/{f}" alt="{os.path.splitext(f)[0].title()}"></div>\n'

# === Replace main gallery section ===
content = re.sub(
    r'<div class="masonry-grid">.*?</div>(?=\s*</section>)',
    gallery_html,
    content,
    count=1,
    flags=re.DOTALL
)

# === Replace pas-foto-grid section (with or without captions) ===
content = re.sub(
    r'<div class="masonry-grid pas-foto-grid">.*?</div>(?=\s*</section>)',
    f'        <div class="masonry-grid pas-foto-grid">\n{pas_foto_items}        </div>',
    content,
    count=1,
    flags=re.DOTALL
)

with open(html_path, 'w', encoding='utf-8') as f:
    f.write(content)

print(f"Gallery utama: {len(gallery_files)} foto WhatsApp")
print(f"Pas foto: {len(pas_foto_files)} foto (tanpa caption)")
print("Done!")
