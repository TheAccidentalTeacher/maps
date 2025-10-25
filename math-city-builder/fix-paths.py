import json

# Load structures.json
with open('structures.json', 'r') as f:
    data = json.load(f)

# Fix all the paths
for item in data:
    old_path = item['modelPath']
    new_path = old_path.replace('/Textures/city-roads/Models/GLB format/', '/roads/')
    new_path = new_path.replace('/Textures/city-commercial/Models/GLB format/', '/commercial/')
    new_path = new_path.replace('/Textures/city-industrial/Models/GLB format/', '/industrial/')
    new_path = new_path.replace('/Textures/city-suburban/Models/GLB format/', '/suburban/')
    item['modelPath'] = new_path

# Save back
with open('structures.json', 'w') as f:
    json.dump(data, f, indent=2)

print(f"✅ Fixed paths for {len(data)} structures")
