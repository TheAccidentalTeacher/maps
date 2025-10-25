import csv
import json
import re

# Pricing strategy for 189 buildings (targeting $1M city with 2000 problems)
# Average building = $1,000,000 / 150 buildings = ~$6,667
# Distribution: 40% roads ($50-300), 30% suburban ($500-2000), 20% commercial ($1500-5000), 10% industrial ($3000-10000)

PRICING = {
    'city-roads': {
        'base': 50,
        'max': 500,
        'category': 'roads',
        'description': 'Infrastructure & streets'
    },
    'suburban': {
        'base': 500,
        'max': 2500,
        'category': 'residential',
        'description': 'Houses & neighborhoods'
    },
    'commercial': {
        'base': 1500,
        'max': 6000,
        'category': 'commercial',
        'description': 'Shops & businesses'
    },
    'industrial': {
        'base': 3000,
        'max': 12000,
        'category': 'industrial',
        'description': 'Factories & warehouses'
    }
}

def extract_category(relative_path):
    """Extract category from path like 'assets\\kenney-city-builder\\models\\Textures\\city-roads\\...'"""
    parts = relative_path.split('\\')
    for cat in PRICING.keys():
        if cat in parts:
            return cat
    return 'city-roads'  # default

def generate_display_name(filename):
    """Convert 'road-bend-barrier.glb' -> 'Road Bend Barrier'"""
    name = filename.replace('.glb', '').replace('-', ' ').replace('_', ' ')
    return ' '.join(word.capitalize() for word in name.split())

def calculate_price(category, index, total_in_category):
    """Calculate price based on category and position (earlier = cheaper)"""
    config = PRICING.get(category, PRICING['city-roads'])
    
    # Linear progression within category (first items cheaper)
    price_range = config['max'] - config['base']
    price = config['base'] + (price_range * index / max(total_in_category - 1, 1))
    
    # Round to nearest $50 for clean pricing
    return round(price / 50) * 50

def main():
    # Read CSV inventory
    with open('glb-inventory.csv', 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        rows = list(reader)
    
    # Group by category
    by_category = {}
    for row in rows:
        cat = extract_category(row['RelativePath'])
        if cat not in by_category:
            by_category[cat] = []
        by_category[cat].append(row)
    
    # Generate structures
    structures = []
    for cat, items in by_category.items():
        # Sort alphabetically for consistent pricing
        items.sort(key=lambda x: x['Name'])
        
        for i, item in enumerate(items):
            price = calculate_price(cat, i, len(items))
            
            structure = {
                'id': f"{PRICING[cat]['category']}_{len(structures):03d}",
                'name': generate_display_name(item['Name']),
                'category': PRICING[cat]['category'],
                'price': price,
                'modelPath': '../' + item['RelativePath'].replace('\\', '/'),  # Relative to math-city-builder/index.html
                'width': 1,  # Default 1x1 tile
                'height': 1,
                'thumbnail': f"thumbnails/{item['Name'].replace('.glb', '.png')}"
            }
            structures.append(structure)
    
    # Sort by category (roads first for test building), then price
    category_order = {'roads': 0, 'residential': 1, 'commercial': 2, 'industrial': 3}
    structures.sort(key=lambda x: (category_order.get(x['category'], 99), x['price']))
    
    # Write JSON
    with open('structures.json', 'w', encoding='utf-8') as f:
        json.dump(structures, f, indent=2)
    
    # Print stats
    print(f"✅ Generated structures.json with {len(structures)} buildings")
    print("\nBreakdown by category:")
    for cat in ['roads', 'residential', 'commercial', 'industrial']:
        count = sum(1 for s in structures if s['category'] == cat)
        prices = [s['price'] for s in structures if s['category'] == cat]
        if prices:
            print(f"  {cat.capitalize():12s}: {count:3d} buildings (${min(prices):,} - ${max(prices):,})")
    
    total_value = sum(s['price'] for s in structures)
    avg_price = total_value / len(structures)
    print(f"\nTotal if built all: ${total_value:,}")
    print(f"Average price: ${avg_price:,.0f}")
    print(f"Buildings needed for $1M: ~{1_000_000 / avg_price:.0f}")

if __name__ == '__main__':
    main()
