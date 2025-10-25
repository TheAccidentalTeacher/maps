import os
import re
import json
from pathlib import Path

godot_project = Path(r"c:\Users\scoso\WEBSITES\Mr-Somers-Maps\assets\kenney-city-builder")
structures_dir = godot_project / "structures"

categories = {
    "city-roads": {"name": "Roads & Infrastructure", "price_range": 50},
    "suburban": {"name": "Residential", "price_range": 250},
    "commercial": {"name": "Commercial", "price_range": 300},
    "industrial": {"name": "Industrial", "price_range": 350}
}

structures_data = []
print("Scanning structure files...")

for tres_file in sorted(structures_dir.glob("*.tres")):
    structure_name = tres_file.stem
    with open(tres_file, encoding="utf-8") as f:
        content_file = f.read()
    
    price_match = re.search(r"price = (\d+)", content_file)
    price = int(price_match.group(1)) if price_match else 100
    
    model_match = re.search(r'path="res://models/Textures/([^"]+)"', content_file)
    
    if model_match:
        model_path = model_match.group(1)
        category = "city-roads"
        if "industrial" in model_path:
            category = "industrial"
        elif "commercial" in model_path:
            category = "commercial"
        elif "suburban" in model_path:
            category = "suburban"
        
        display_name = structure_name.replace("-", " ").title()
        
        structure_info = {
            "id": len(structures_data),
            "name": display_name,
            "filename": structure_name,
            "category": category,
            "price": price,
            "model_path": f"../assets/kenney-city-builder/models/Textures/{model_path}"
        }
        
        structures_data.append(structure_info)

output_file = Path(__file__).parent / "structures.json"
with open(output_file, "w", encoding="utf-8") as f:
    json.dump({
        "version": "1.0",
        "total_structures": len(structures_data),
        "categories": categories,
        "structures": structures_data
    }, f, indent=2)

print(f"Extracted {len(structures_data)} structures to structures.json")