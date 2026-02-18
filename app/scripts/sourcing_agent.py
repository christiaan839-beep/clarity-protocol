import json
import random
from datetime import datetime

# ═══════════════════════════════════════════════════════════════
# SOVEREIGN LOGISTICS AGENT
# "The Environmental Bodyguard"
# ═══════════════════════════════════════════════════════════════

# Mock Data for Simulation (Replacing Google Places API for demo)
LOCATIONS_DB = [
    {
        "name": "The Primal Butcher",
        "type": "butcher",
        "lat_offset": 0.01, "lng_offset": 0.01,
        "website_content": "100% Grass-fed regeneratively raised beef. No hormones. Tallow available."
    },
    {
        "name": "Industrial Feedlot Cafe",
        "type": "restaurant",
        "lat_offset": -0.02, "lng_offset": 0.005,
        "website_content": "Try our famous fries cooked in canola oil. Soybean fed chicken."
    },
    {
        "name": "Pure Springs Market",
        "type": "market",
        "lat_offset": 0.005, "lng_offset": -0.01,
        "website_content": "Local farmer's market. Raw dairy. A Greener World certified. Pasture-raised eggs."
    },
    {
        "name": "Seed Oil Palace",
        "type": "restaurant",
        "lat_offset": 0.03, "lng_offset": 0.02,
        "website_content": "Deep fried everything. Vegetable oil blend."
    },
    {
        "name": "Sovereign Steakhouse",
        "type": "restaurant",
        "lat_offset": -0.01, "lng_offset": -0.02,
        "website_content": "Cooked in tallow. Grass-fed steaks. Organic wines. No seed oils used in kitchen."
    }
]

# SEARCH PARAMETERS
KEYWORDS_SAFE = ['Regenerative Organic', 'Grass-fed', 'Raw dairy', 'Pasture-raised', 'Tallow', 'No seed oils']
KEYWORDS_TOXIC = ['canola', 'soybean', 'sunflower', 'vegetable oil', 'corn oil']

def verify_source(location):
    """
    Simulates the AI verification module scanning website text.
    """
    content = location['website_content'].lower()
    
    # Check for Toxins (Via Negativa)
    for toxin in KEYWORDS_TOXIC:
        if toxin in content:
            return "HAZARD"
            
    # Check for Sovereign Approval
    score = 0
    tags = []
    
    if "grass-fed" in content: tags.append("GRASS-FED")
    if "regenerative" in content: tags.append("ROC")
    if "tallow" in content: tags.append("TALLOW")
    if "raw dairy" in content: tags.append("RAW DAIRY")
    
    if len(tags) > 0:
        return "SAFE"
    
    return "NEUTRAL" # Noise

def generate_map_data():
    """
    Generates the sovereign_map.json
    """
    print("LOGISTICS AGENT: Initiating Tactical Sweep...")
    results = []
    
    for loc in LOCATIONS_DB:
        status = verify_source(loc)
        
        # We only want to present Safe or Warn about Hazards near client
        # High value = Filter out the noise
        
        entry = {
            "id": random.randint(1000, 9999),
            "name": loc['name'],
            "type": status.lower(),
            # Simulating relative coordinates
            "lat": 34.05 + float(loc['lat_offset']),
            "lng": -118.24 + float(loc['lng_offset']),
            "desc": loc['website_content'],
            "last_verified": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "tags": []  # Initialize to prevent type inference issues
        }
        
        if status == "SAFE":
            entry['tags'] = ["VERIFIED SOVEREIGN"]
            results.append(entry)
            print(f"  [+] APPROVED: {loc['name']}")
            
        elif status == "HAZARD":
            entry['tags'] = ["TOXIN ALERT"]
            results.append(entry)
            print(f"  [!] HAZARD: {loc['name']}")

    output = {
        "generated_at": datetime.now().isoformat(),
        "total_sources": len(results),
        "locations": results
    }
    
    with open('../sovereign_map.json', 'w') as f:
        json.dump(output, f, indent=4)
        print("LOGISTICS AGENT: Map updated. Data deployed to sovereign_map.json")

if __name__ == "__main__":
    generate_map_data()
