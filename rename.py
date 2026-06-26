import os

def replace_in_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            
        new_content = content.replace("Cebate Uno", "El Buen Cebar")
        new_content = new_content.replace("Cebate <span>Uno</span>", "El Buen <span>Cebar</span>")
        new_content = new_content.replace("cebateuno_cart", "elbuencebar_cart")
        new_content = new_content.replace("cebateuno.store", "elbuencebar.com")
        new_content = new_content.replace("instagram.com/cebateuno", "instagram.com/buencebar")
        new_content = new_content.replace("@cebateuno", "@buencebar")
        new_content = new_content.replace("cebateuno", "elbuencebar")
        new_content = new_content.replace("CEBATE UNO", "EL BUEN CEBAR")
        
        if new_content != content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Updated: {filepath}")
    except Exception as e:
        print(f"Error reading {filepath}: {e}")

root_dir = r"C:\Users\usuario\.gemini\antigravity\scratch\cebateuno-store"
for root, dirs, files in os.walk(root_dir):
    for file in files:
        if file.endswith(('.html', '.js', '.svg')):
            replace_in_file(os.path.join(root, file))
