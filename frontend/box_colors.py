import os

js_path = r'd:/Clg/Depression-App-Fullstack/Depression-App-Fullstack/frontend/src/app.js'

with open(js_path, 'r', encoding='utf-8') as f:
    js_content = f.read()

# Replace the gradient background for the first box
old_gradient = """    background:
      linear-gradient(
        135deg,
        rgba(14,22,60,.95),
        rgba(8,15,40,.95)
      );"""
new_bg = """    background: #ffffff;"""
js_content = js_content.replace(old_gradient, new_bg)

# If it's on a single line or slightly different:
js_content = js_content.replace('rgba(14,22,60,.95)', '#ffffff')
js_content = js_content.replace('rgba(8,15,40,.95)', '#ffffff')
js_content = js_content.replace('linear-gradient(\n        135deg,\n        #ffffff,\n        #ffffff\n      )', '#ffffff')

# Replace the background for the second box
js_content = js_content.replace('background:#0f1730;', 'background:#ffffff;')
js_content = js_content.replace('background: #0f1730;', 'background: #ffffff;')

with open(js_path, 'w', encoding='utf-8') as f:
    f.write(js_content)

print("Boxes updated to white.")
