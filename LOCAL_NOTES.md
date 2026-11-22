# Local Development Notes

This file is for local development only - **DO NOT COMMIT TO GIT**

## Project Overview
Python-copier appears to be a web-based Python learning platform with:
- Interactive Python execution (pythonchik.js, pygui.js)
- Course management (course.js, modules.js)
- Game elements (games.js, gamerules.js, turtle.js)
- AI integration (pychik-ai.js)
- Internationalization (i18n.js, lang/)

## Local Setup
```bash
# Install dependencies
npm install

# Start development server
npm start
```

## Important Files
- `index.html` - Main entry point
- `app.js` - Core application logic
- `pythonchik.js` - Python interpreter UI
- `course.js` - Course/content management
- `i18n.js` - Internationalization (Ukrainian/English/Russian)

## Local Config
Add your local environment variables in `.env.local` (gitignored):
```
# Example local config
DEBUG=true
LOCAL_API_URL=http://localhost:3000
```

## Notes for Development
- This is a PWA (Progressive Web App) - check `manifest.json` and `sw.js`
- Uses Capacitor for mobile builds (`capacitor.config.json`)
- Multiple CSS files for different themes/components
- Large codebase - consider modularizing further

---
*Created by Claude Code for local development reference*