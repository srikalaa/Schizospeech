import re
import os

css_path = r'd:/Clg/Depression-App-Fullstack/Depression-App-Fullstack/frontend/src/styles.css'
js_path = r'd:/Clg/Depression-App-Fullstack/Depression-App-Fullstack/frontend/src/app.js'

def replace_colors(content):
    # Base backgrounds
    content = content.replace('#060810', '#f5f7fa')
    content = content.replace('#08090e', '#f5f7fa')
    content = content.replace('#10121b', '#ffffff')
    content = content.replace('#1c1f2e', '#f0f2f7')
    content = content.replace('#262a3d', '#e8ebf2')
    
    # Borders
    content = content.replace('rgba(255,255,255,0.05)', 'rgba(0,0,0,0.10)')
    content = content.replace('rgba(255,255,255,.05)', 'rgba(0,0,0,0.10)')
    content = content.replace('rgba(255, 255, 255, 0.05)', 'rgba(0,0,0,0.10)')
    content = content.replace('rgba(255,255,255,0.08)', 'rgba(0,0,0,0.15)')
    content = content.replace('rgba(255,255,255,.08)', 'rgba(0,0,0,0.15)')
    content = content.replace('rgba(255,255,255,0.15)', 'rgba(0,0,0,0.22)')
    content = content.replace('rgba(255,255,255,.15)', 'rgba(0,0,0,0.22)')
    content = content.replace('rgba(255,255,255,.03)', 'rgba(0,0,0,.04)')
    
    # Text colors
    content = re.sub(r'color:\s*#ffffff', 'color: #1e293b', content)
    content = re.sub(r'color:\s*#fff', 'color: #1e293b', content)
    content = re.sub(r'color:#fff', 'color:#1e293b', content)
    
    # Violet
    content = content.replace('#7c6aff', '#4338ca')
    content = content.replace('124,106,255', '67,56,202')
    content = content.replace('124, 106, 255', '67,56,202')
    
    # Cyan
    content = content.replace('#00d4ff', '#0891b2')
    content = content.replace('#00e8c0', '#0d9488')
    content = content.replace('0,212,255', '8,145,178')
    content = content.replace('0, 212, 255', '8,145,178')
    content = content.replace('0,232,192', '13,148,136')
    content = content.replace('0, 232, 192', '13,148,136')
    
    # Green/Success
    content = content.replace('#00ff88', '#059669')
    content = content.replace('0,255,136', '5,150,105')
    content = content.replace('0, 255, 136', '5,150,105')
    
    # Orange/Warning
    content = content.replace('#ffb840', '#d97706')
    content = content.replace('255,184,64', '217,119,6')
    content = content.replace('255, 184, 64', '217,119,6')
    
    content = content.replace('#ff8c42', '#ea580c')
    content = content.replace('255,140,66', '234,88,12')
    content = content.replace('255, 140, 66', '234,88,12')
    
    # Red/Pink/Severe
    content = content.replace('#ff4d6d', '#db2777')
    content = content.replace('255,77,109', '219,39,119')
    content = content.replace('255, 77, 109', '219,39,119')
    content = content.replace('#ff4d4d', '#dc2626')
    content = content.replace('255,77,77', '220,38,38')
    content = content.replace('255, 77, 77', '220,38,38')
    
    # Text variables
    content = content.replace('var(--text-1)', '#1e293b') # Make sure any raw vars mapped to light text
    content = content.replace('var(--text-2)', '#475569')
    content = content.replace('var(--text-3)', '#94a3b8')

    return content

with open(css_path, 'r', encoding='utf-8') as f:
    css_content = f.read()

# For CSS, we also want to redefine the :root variables explicitly
css_content = replace_colors(css_content)

# Fix the CSS root to guarantee correct tokens
root_light = """:root {
  --font-display: 'Syne', sans-serif;
  --font-body:    'Inter', sans-serif;
  --font-mono:    'JetBrains Mono', monospace;

  /* Base - Light backgrounds */
  --bg:           #f5f7fa;
  --bg-2:         #eef1f6;
  --surface:      #ffffff;
  --surface-2:    #f0f2f7;
  --surface-3:    #e8ebf2;

  /* Borders - visible on paper */
  --border:       rgba(0,0,0,0.10);
  --border-2:     rgba(0,0,0,0.15);
  --border-3:     rgba(0,0,0,0.22);

  /* Brand - Deep, saturated colors that print well */
  --violet:       #4338ca;
  --violet-2:     #3730a3;
  --violet-glow:  rgba(67,56,202,0.12);
  --pink:         #db2777;
  --cyan:         #0891b2;
  --teal:         #0d9488;
  --amber:        #d97706;

  /* Semantic */
  --success:      #059669;
  --warning:      #d97706;
  --danger:       #dc2626;
  --info:         #0284c7;

  /* Text - Dark for readability */
  --text-1:       #1e293b;
  --text-2:       #475569;
  --text-3:       #94a3b8;

  /* Radii */
  --r-sm:  6px;
  --r-md:  10px;
  --r-lg:  14px;
  --r-xl:  20px;
  --r-2xl: 28px;
}"""

css_content = re.sub(r':root\s*\{[^}]+\}', root_light, css_content, flags=re.MULTILINE|re.DOTALL)

with open(css_path, 'w', encoding='utf-8') as f:
    f.write(css_content)

with open(js_path, 'r', encoding='utf-8') as f:
    js_content = f.read()

js_content = replace_colors(js_content)

# A few specific fixes for app.js where text colors or variables might have been messed up by blind replacement
# Undo replacing 'var(--text-1)' if it literally replaced the variable name.
# Wait, replacing 'var(--text-1)' with its light hex value in JS inline styles is actually exactly what we want since we're converting from dark to light.
# Let's fix up some of the string replacements to ensure JS variables aren't broken.
js_content = js_content.replace('color: #1e293b', 'color: var(--text-1)')
js_content = js_content.replace('color:#1e293b', 'color:var(--text-1)')

with open(js_path, 'w', encoding='utf-8') as f:
    f.write(js_content)

print("Theme successfully updated.")
