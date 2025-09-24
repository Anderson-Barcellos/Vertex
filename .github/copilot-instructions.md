# UltraSound Report GE - Copilot Instructions

**ALWAYS FOLLOW THESE INSTRUCTIONS FIRST.** Only search for additional information or use alternative approaches if the information here is incomplete or found to be in error.

## About This Codebase

UltraSound Report GE is a professional ultrasound report generation system built with React 19, TypeScript, Vite, and Tailwind CSS. It provides an intelligent interface for creating standardized ultrasound reports following CBR (Brazilian College of Radiology) guidelines.

## Quick Setup and Validation

### Prerequisites
Install Node.js 20.16+ and npm 9.2+ before proceeding.

### Bootstrap the Repository
```bash
npm install
```
**Time:** ~15 seconds (472 packages). Dependencies install cleanly with no vulnerabilities.

### Build the Application
```bash
npm run build
```
**Time:** ~15 seconds total. NEVER CANCEL - set timeout to 60+ minutes for safety. The build succeeds consistently and generates optimized production assets in `dist/`.

### Start Development Server
```bash
npm run dev
```
**Access:** http://127.0.0.1:8134
**Time:** Starts in ~1 second. Server runs indefinitely until stopped.

### Validate Build and Functionality
```bash
# Build for production
npm run build

# Test production build
npm run preview
```
**Preview Access:** http://127.0.0.1:4173

## Testing and Validation

### Manual Validation Requirements
**ALWAYS perform these validation steps after making changes:**

1. **Start Development Server:**
   ```bash
   npm run dev
   ```

2. **Complete User Workflow Test:**
   - Navigate to http://127.0.0.1:8134
   - Verify landing page loads with 8 exam types
   - Click "Abdome Total" card
   - Verify exam interface loads with 3-column layout
   - Click any organ button (e.g., "Fígado")
   - Verify organ findings panel opens on the right
   - Select any finding checkbox
   - Verify finding appears in middle "Selected Findings" panel
   - Verify "Generate Report" button becomes enabled
   - Test "Add details" functionality if available

3. **Cross-Browser Validation:**
   - Test in Chrome/Chromium
   - Verify all interactive elements work
   - Check responsive design at different screen sizes

### Linting
```bash
npm run lint
```
**ALWAYS run before committing.** ESLint configuration exists and will show code quality issues. Current codebase has some linting warnings (unused variables, typescript issues) but these do not prevent the application from running.

**Note:** If ESLint config is missing, refer to the working `eslint.config.js` in the repository root.

## Architecture and Project Structure

### Technology Stack
- **Frontend:** React 19 with TypeScript
- **Build Tool:** Vite 6.3.6  
- **Styling:** Tailwind CSS v4 + Radix UI components
- **Routing:** React Router DOM v7
- **Icons:** Phosphor Icons + Lucide React

### Key Directories
```
src/
├── components/           # React components
│   ├── ui/              # Reusable UI components (Radix-based)
│   ├── Sidebar.tsx      # Organ navigation sidebar
│   ├── OrganSection.tsx # Findings selection for organs
│   ├── ReportCanvas.tsx # Report preview area
│   └── SelectedFindingsPanel.tsx # Selected findings display
├── pages/               # Main application pages
│   ├── LandingPage.tsx  # Exam type selection
│   ├── AbdomeTotalExam.tsx # Main exam interface
│   └── BreastExam.tsx   # Breast exam (in development)
├── data/                # Medical data definitions
│   ├── organs.ts        # Abdomen organ definitions following CBR
│   └── breastOrgans.ts  # Breast exam definitions
├── services/            # Business logic
│   └── reportGenerator.ts # Report generation logic
├── types/               # TypeScript type definitions
└── styles/              # CSS and styling files
```

### Important Files
- `vite.config.ts` - Vite configuration with proxy settings
- `tailwind.config.js` - Tailwind configuration with custom theme
- `package.json` - Dependencies and scripts
- `CLAUDE.md` - Detailed technical documentation
- `README.md` - Project overview and setup guide

## Available Scripts

| Command | Purpose | Time | Notes |
|---------|---------|------|-------|
| `npm run dev` | Start development server | ~1s | Port 8134, never times out |
| `npm run build` | Production build | ~15s | NEVER CANCEL - set 60+ min timeout |
| `npm run preview` | Preview production build | ~1s | Port 4173 |
| `npm run lint` | Run ESLint | ~5s | Always run before committing |
| `npm run kill` | Kill server on port 8133 | <1s | Used for Apache proxy cleanup |

## Development Workflow

### Making Changes to Components
1. **Always test the complete user workflow** after component changes
2. **Key components to test after changes:**
   - `LandingPage.tsx` - Test all exam type cards
   - `AbdomeTotalExam.tsx` - Test 3-column layout and state management
   - `Sidebar.tsx` - Test organ navigation
   - `OrganSection.tsx` - Test finding selection and details
   - `SelectedFindingsPanel.tsx` - Test finding display and removal

### Adding New Medical Data
1. **Edit data files:** `src/data/organs.ts` or `src/data/breastOrgans.ts`
2. **Follow CBR conventions** for medical terminology
3. **Test finding selection and report generation** after changes
4. **Verify TypeScript types** are properly maintained

### UI Component Changes
1. **Always test responsive design** on different screen sizes
2. **Verify Tailwind classes** compile correctly
3. **Test both light and dark themes** if applicable
4. **Check accessibility** (proper ARIA labels, keyboard navigation)

## Common Issues and Solutions

### Development Server Issues
- **Port 8134 in use:** Run `npm run kill` or `fuser -k 8134/tcp`
- **WebSocket errors:** Ignore wss://ultrassom.ai:8133 errors in console (production config)
- **Build fails:** Check TypeScript errors and dependency versions

### Linting Issues
- **ESLint config missing:** Use the `eslint.config.js` file in repository root
- **TypeScript errors:** Focus on unused variables and explicit `any` types
- **Import/export issues:** Verify all imports have proper file extensions

### Production Deployment
- **Build optimization:** Assets are automatically minified and optimized
- **Environment configuration:** Check `vite.config.ts` for proxy settings
- **SSL/HTTPS:** Production uses Apache proxy on port 8133 with Let's Encrypt

## Key Application Features

### Three-Column Interface
1. **Left Sidebar:** Organ navigation with icons
2. **Middle Panel:** Selected findings with details
3. **Right Canvas:** Report preview and generation

### Medical Workflow
1. **Exam Selection:** 8 ultrasound modalities (only Abdome Total fully implemented)
2. **Organ Navigation:** Click organs to view available findings
3. **Finding Selection:** Checkbox-based selection with CBR-compliant descriptions
4. **Detail Configuration:** Dynamic fields for measurements, location, severity
5. **Report Generation:** AI-powered structured report creation

### Dynamic Finding Details
- **Measurements:** Configurable size/dimension fields
- **Location:** Anatomical location dropdowns specific to each organ
- **Severity:** Graduated severity scales (mild, moderate, severe)
- **Multiple Instances:** Support for multiple findings of the same type

## Testing Checklist

Before pushing changes, ALWAYS verify:
- [ ] `npm run build` completes successfully
- [ ] `npm run lint` shows no new errors
- [ ] Development server starts and responds
- [ ] Landing page loads with all 8 exam cards
- [ ] Abdome Total exam interface loads correctly
- [ ] Organ selection opens findings panel
- [ ] Finding selection updates middle panel
- [ ] Generate Report button becomes enabled with selections
- [ ] Application is responsive on mobile/tablet screens
- [ ] No console errors in browser developer tools

## Production Configuration Notes

The application is designed to work with an Apache reverse proxy configuration. Development runs on port 8134, while production uses Apache on port 8133 with SSL termination. The `vite.config.ts` includes specific settings for this architecture.

**NEVER modify the HMR settings in vite.config.ts** unless you understand the Apache proxy implications documented in `CLAUDE.md`.

## Documentation References

- **Technical Details:** See `CLAUDE.md` for comprehensive technical documentation
- **Setup Guide:** See `README.md` for user-facing setup instructions
- **Medical Guidelines:** CBR (Colégio Brasileiro de Radiologia) standards implemented throughout
- **Component Architecture:** Radix UI + Tailwind CSS pattern used consistently

Remember: This is a medical application. Always prioritize accuracy, usability, and professional medical standards in any changes.