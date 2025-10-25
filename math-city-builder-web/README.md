#  Math City Builder - Web Edition

A browser-based 3D city building game with educational math challenges. Students solve multiplication problems to earn bonuses when placing buildings!

##  Features

- **All 204 Kenney Assets** - Uses your complete collection of 3D models
- **Math Challenges** - Multiplication (1-12  1-12) before each building placement
- **3x Reward** - Correct answers give 3x the building cost as bonus
- **Category Filtering** - Browse by Roads, Residential, Commercial, or Industrial
- **Full 3D Graphics** - Beautiful Three.js rendering
- **Works Anywhere** - No installation, runs in any modern browser
- **Touch Support** - Works on tablets and Chromebooks

##  Controls

| Action | Control |
|--------|---------|
| Open Building Menu | **M** key |
| Place Building | **Click** on ground (triggers math challenge) |
| Rotate Building | **R** key |
| Remove Building | **Delete** or **Backspace** key |
| Rotate Camera | **Left Click + Drag** |
| Zoom | **Mouse Wheel** |
| Pan Camera | **Right Click + Drag** |

##  How to Run

### Option 1: Simple Local Server (Recommended)

1. Open PowerShell in this folder
2. Run one of these commands:

**Python:**
```powershell
python -m http.server 8000
```

**Node.js:**
```powershell
npx http-server -p 8000
```

3. Open browser to: http://localhost:8000

### Option 2: VS Code Live Server

1. Install "Live Server" extension in VS Code
2. Right-click `index.html`
3. Select "Open with Live Server"

### Option 3: Deploy to Website

Copy all files to any web server. Students just visit the URL!

##  File Structure

```
math-city-builder-web/
 index.html          # Main HTML file
 game.js             # Game logic (Three.js)
 structures.json     # Database of all 204 buildings
 extract_structures.py  # Tool to rebuild structures.json
 README.md           # This file
```

##  Customization

### Change Starting Cash
Edit `game.js`, line with `cash: 100`  change to any amount

### Change Math Difficulty
Edit `game.js`, look for:
```javascript
const num1 = Math.floor(Math.random() * 12) + 1;
const num2 = Math.floor(Math.random() * 12) + 1;
```
Change `12` to max number you want (e.g., `10` for 1-10 times tables)

### Change Reward Multiplier
Edit `game.js`, look for:
```javascript
const bonus = structure.price * 3;
```
Change `3` to any multiplier

### Rebuild Structure Database
If you modify structure prices in Godot:
```powershell
python extract_structures.py
```

##  Educational Benefits

1. **Math Practice** - Students solve 100s of multiplication problems
2. **Spatial Reasoning** - Planning city layouts
3. **Resource Management** - Budgeting with limited cash
4. **Categorization** - Understanding building types
5. **Cause & Effect** - Correct answers = more resources

##  Browser Compatibility

-  Chrome/Edge (Recommended)
-  Firefox
-  Safari
-  Works on iPads, Chromebooks, tablets

##  Troubleshooting

**Problem: Models don't load**
- Make sure you're running a local server (not file://)
- Check that the `../assets/kenney-city-builder/models/` path is correct

**Problem: Black screen**
- Open browser console (F12) and check for errors
- Make sure Three.js is loading (check Network tab)

**Problem: No buildings in menu**
- Run `extract_structures.py` to rebuild `structures.json`
- Check that `structures.json` exists

##  Current Stats

- **Total Structures**: 164 (extracted from your Godot project)
- **Categories**: 4 (Roads, Residential, Commercial, Industrial)
- **Starting Cash**: $100
- **Math Challenge**: Multiplication (1-12)
- **Correct Answer Bonus**: 3x building cost

##  For Teachers

### Classroom Use
- Share the URL with students
- No installation required
- Works on school Chromebooks
- No login needed
- Completely offline-capable (just copy files)

### Learning Objectives
- Master multiplication facts (1-12)
- Practice mental math
- Apply math to real-world scenarios
- Develop problem-solving skills

### Differentiation
- Easy: Change to 1-5 times tables
- Medium: 1-10 times tables (current)
- Hard: 1-12 times tables
- Expert: Add division or mixed operations

##  Next Steps

Want to add more features? Here are some ideas:
- Save/load cities (localStorage)
- Leaderboards
- Different math operations (addition, subtraction, division)
- Time challenges
- Multiplayer mode
- Export city as image
- Different themes (winter, desert, etc.)

##  License

Uses Kenney assets - check their licensing for distribution.

---

Made with  for teaching math through gaming!