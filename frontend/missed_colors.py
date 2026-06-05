import os

js_path = r'd:/Clg/Depression-App-Fullstack/Depression-App-Fullstack/frontend/src/app.js'

with open(js_path, 'r', encoding='utf-8') as f:
    js_content = f.read()

# Missed dark mode replacements
js_content = js_content.replace('rgba(255,255,255,.04)', 'rgba(0,0,0,.04)')
js_content = js_content.replace('rgba(255,255,255,0.04)', 'rgba(0,0,0,.04)')
js_content = js_content.replace('rgba(255,179,71,.3)', 'rgba(217,119,6,.3)')
js_content = js_content.replace('rgba(255,179,71,.15)', 'rgba(217,119,6,.15)')
js_content = js_content.replace('rgba(255,255,255,.2)', 'rgba(0,0,0,.2)')
js_content = js_content.replace('rgba(255,255,255,.8)', 'rgba(0,0,0,.8)')
js_content = js_content.replace('color:#fff', 'color:var(--text-1)')
js_content = js_content.replace('color: #fff', 'color: var(--text-1)')
js_content = js_content.replace('color: white', 'color: var(--text-1)')
js_content = js_content.replace('color:white', 'color:var(--text-1)')
js_content = js_content.replace('color:#ffffff', 'color:var(--text-1)')
js_content = js_content.replace('color: #ffffff', 'color: var(--text-1)')

with open(js_path, 'w', encoding='utf-8') as f:
    f.write(js_content)

print("Missed colors updated.")
