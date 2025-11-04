# Sweet Security ROI Calculator

A modern, interactive web calculator for estimating ROI from security tool consolidation, MTTR reduction, and vulnerability prioritization.

## 📁 Project Structure

```
roi-calc/
├── index.html          # Main HTML structure (clean, semantic markup)
├── styles.css          # All CSS styling and animations
├── calculator.js       # All JavaScript logic and calculations
├── config.js           # Constants, weights, and configuration
├── README.md           # This file
└── FORMULAS_EXPLAINED.md  # Detailed calculation formulas
```

## 🏗️ Architecture

### Separation of Concerns

The codebase is organized into four main files for maximum maintainability:

#### 1. `index.html` - Structure Only
- Clean, semantic HTML5
- No inline styles or scripts
- Accordion-based section layout
- Accessible form inputs
- References external CSS and JS

#### 2. `styles.css` - All Styling
- **CSS Variables** for theming
- **Component-based** organization
- **Responsive design** (mobile-first)
- **Smooth animations** (popIn, slideIn, countUp, spin)
- **Modern UI patterns** (collapsible sections, loading spinners)

Key sections:
- Base styles & reset
- Hero section
- Section accordion system
- Form inputs & controls
- Security tools grid
- Calculation results display
- Sidebar ROI summary
- Animations & transitions
- Media queries

#### 3. `calculator.js` - All Logic
ES6 module with clear functional organization:

**State Management:**
- Selected tools tracking
- Calculation results storage
- Animation state tracking

**Core Functions:**
- `calculateConsolidation()` - Tool consolidation ROI
- `calculateMTTRSavings()` - MTTR reduction value
- `calculateVulnSavings()` - Vulnerability prioritization ROI
- `updateSidebar()` - Aggregate results display

**UI Helpers:**
- Section accordion control
- Workload sync across inputs
- Loading spinners
- Smooth scrolling
- Result animations

#### 4. `config.js` - Configuration
All constants and configuration in one place:

- **MTTR_CONFIG** - MTTR calculation constants
- **VULN_CONFIG** - Vulnerability calculation constants
- **CONSOLIDATION_WEIGHTS** - Environment and vendor weights
- **SECURITY_TOOLS** - Tool catalog with pricing
- **UI_CONFIG** - Timing, delays, defaults

## 🎨 Design Principles

### 1. **Modularity**
Each file has a single, clear responsibility. Makes updates and debugging easy.

### 2. **Readability**
- Descriptive variable names
- Comments explaining complex logic
- Consistent formatting
- Clear section headers

### 3. **Maintainability**
- All constants in `config.js` - change once, apply everywhere
- All styles in `styles.css` - no inline styles
- All logic in `calculator.js` - no inline event handlers (except for simplicity)

### 4. **Performance**
- Minimal DOM manipulation
- Efficient event listeners
- CSS animations over JS
- Lazy loading with delays

## 🔧 Key Features

### Accordion Navigation
- Only one section open at a time
- Auto-expand next section after calculation
- Preview calculated values in collapsed state

### Weighted Calculations
Deterministic formulas based on:
- Cloud environment (AWS, Azure, GCP, etc.)
- Current CNAPP vendor stack
- Workload count
- Industry benchmarks

### User Experience
- **Loading spinners** during calculations (800ms delay)
- **Smooth animations** on results
- **Pop-in effects** on first view
- **Auto-sync** workload inputs across sections
- **Smart defaults** with manual override options

### Responsive Design
- Desktop: side-by-side layout with sticky sidebar
- Tablet: stacked layout
- Mobile: single column, optimized inputs

## 🚀 How to Use

### For Development
1. Open `index.html` in a modern browser
2. Or serve with a local server:
   ```bash
   python3 -m http.server 8000
   # Then open http://localhost:8000
   ```

### For Deployment
Upload all files to your web server. Ensure:
- All 4 files are in the same directory
- Server supports ES6 modules
- HTTPS enabled (recommended)

## 🔢 Calculation Methods

### Tool Consolidation Value
```
totalValue = baseToolValue × workloads × environmentWeight × vendorWeight
```

**Weights:**
- Environment: AWS (1.15), Azure (1.10), GCP (1.05), Multi-cloud (1.25), etc.
- Vendor: Wiz (1.25), Orca (1.20), Prisma (1.15), etc. (highest applies)

### MTTR Reduction Value
```
savings = (currentCost - sweetCost)
currentCost = annualIncidents × 3 hours × hourlyRate
sweetCost = annualIncidents × 0.083 hours × hourlyRate
```

### Vulnerability Prioritization ROI
```
savings = vulnerabilities × 0.99684 × 10 hours × $100/hour
```

See `FORMULAS_EXPLAINED.md` for detailed breakdowns.

## 🎯 Future Enhancements

Potential improvements:
- [ ] Add data export (PDF/CSV)
- [ ] Save/load calculator state
- [ ] More granular customization options
- [ ] A/B testing for different assumptions
- [ ] Integration with CRM/demo booking
- [ ] Multi-language support
- [ ] Dark mode theme

## 📝 Code Style Guidelines

### JavaScript
- ES6+ features (modules, arrow functions, const/let)
- Descriptive function names (verbs)
- Single responsibility functions
- Comments for complex logic

### CSS
- BEM-inspired naming (but simplified)
- Component-based organization
- CSS variables for theming
- Mobile-first media queries

### HTML
- Semantic elements
- Accessible forms (labels, proper input types)
- No inline styles or scripts
- Clean indentation

## 🐛 Debugging

### Common Issues

**Calculator not working?**
- Check browser console for errors
- Ensure all 4 files are in same directory
- Verify browser supports ES6 modules (most modern browsers do)

**Styles not loading?**
- Check `styles.css` path in `index.html`
- Clear browser cache
- Verify file permissions

**Numbers not updating?**
- Check that inputs have valid values (min="1")
- Look for JavaScript errors in console
- Verify `config.js` is loaded

## 📄 License

Proprietary - Sweet Security

---

**Last Updated:** November 2025  
**Maintainer:** Sweet Security Engineering Team  
**Version:** 2.0 (Refactored)

