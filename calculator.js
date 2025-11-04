/**
 * Sweet ROI Calculator - Main JavaScript Logic
 * Handles all calculations, UI updates, and user interactions
 */

import { 
  MTTR_CONFIG, 
  VULN_CONFIG, 
  CONSOLIDATION_WEIGHTS, 
  UI_CONFIG 
} from './config.js';

// =========================
// State Management
// =========================
let selectedTools = new Set();
let marketValueReplaced = 0;
let mttrSavings = 0;
let vulnSavings = 0;

// Track if breakdowns have been shown before (for animations)
let consolidationShownBefore = false;
let mttrShownBefore = false;
let vulnShownBefore = false;

// Track if user manually overrode monthly incidents
let userOverrodeIncidents = false;

// =========================
// DOM Element References
// =========================
const workloadsInput = document.getElementById('workloads');
const workloadsMTTR = document.getElementById('workloadsMTTR');
const workloadsVuln = document.getElementById('workloadsVuln');
const monthlyIncidents = document.getElementById('monthlyIncidents');

// =========================
// Section Toggle & Navigation
// =========================

/**
 * Toggle section accordion (only one section open at a time)
 */
function toggleSection(sectionId) {
  const section = document.getElementById('section-' + sectionId);
  const allSections = document.querySelectorAll('.section');
  
  // If clicking on an already open section, don't collapse it
  if (!section.classList.contains('collapsed')) {
    return;
  }
  
  // Collapse all other sections
  allSections.forEach(s => {
    if (s !== section) {
      s.classList.add('collapsed');
    }
  });
  
  // Expand clicked section
  section.classList.remove('collapsed');
  
  // Smooth scroll to section after animation starts
  setTimeout(() => {
    const yOffset = -20; // 20px offset from top
    const element = section;
    const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
    
    window.scrollTo({ top: y, behavior: 'smooth' });
  }, 150);
}

/**
 * Update section preview when calculation completes
 */
function updateSectionPreview(sectionId, value) {
  const previewEl = document.getElementById('preview-' + sectionId);
  const section = document.getElementById('section-' + sectionId);
  if (value > 0) {
    previewEl.textContent = '$' + value.toLocaleString();
    section.classList.add('has-result');
  } else {
    previewEl.textContent = '';
    section.classList.remove('has-result');
  }
}

// =========================
// Workload Sync & Management
// =========================

/**
 * Update monthly incidents based on workloads (if not manually overridden)
 */
function updateMonthlyIncidents() {
  if (!userOverrodeIncidents) {
    const workloads = parseInt(workloadsMTTR.value) || 0;
    monthlyIncidents.value = workloads * MTTR_CONFIG.INCIDENTS_PER_WORKLOAD_MONTH;
  }
}

/**
 * Sync all workload fields across sections
 */
function syncWorkloads(sourceValue) {
  workloadsInput.value = sourceValue;
  workloadsMTTR.value = sourceValue;
  workloadsVuln.value = sourceValue;
  updateMonthlyIncidents();
  updateEstimatedVulns(); // Auto-update vulnerability estimate
  updateConsolidationButton();
}

// =========================
// Tool Selection
// =========================

/**
 * Initialize tool card click handlers
 */
function initializeToolSelection() {
  document.querySelectorAll('.tool-card').forEach(card => {
    card.addEventListener('click', function() {
      const tool = this.dataset.tool;
      
      if (selectedTools.has(tool)) {
        selectedTools.delete(tool);
        this.classList.remove('selected');
      } else {
        selectedTools.add(tool);
        this.classList.add('selected');
      }
      
      updateConsolidationButton();
    });
  });
}

/**
 * Update consolidation button state based on inputs
 */
function updateConsolidationButton() {
  const btn = document.getElementById('consolidationBtn');
  const workloads = parseInt(workloadsInput.value) || 0;
  
  if (selectedTools.size > 0 && workloads > 0) {
    btn.disabled = false;
    btn.textContent = 'Calculate';
  } else {
    btn.disabled = true;
    btn.textContent = 'Select tools and enter workloads';
  }
}

// =========================
// Tool Consolidation Calculator
// =========================

/**
 * Calculate tool consolidation ROI using weighted formula
 */
function calculateConsolidation() {
  const workloads = parseInt(workloadsInput.value) || 0;
  
  if (selectedTools.size === 0 || workloads === 0) return;
  
  // Add calculating state and show spinner
  const breakdownDiv = document.getElementById('consolidationBreakdown');
  const spinner = document.getElementById('consolidationSpinner');
  breakdownDiv.classList.add('calculating');
  spinner.classList.add('show');
  
  // Delay calculation for suspense
  setTimeout(() => {
    // Hide spinner
    spinner.classList.remove('show');
    
    // Calculate base tool value (sum of data-price attributes)
    let baseToolValue = 0;
    selectedTools.forEach(tool => {
      const card = document.querySelector(`[data-tool="${tool}"]`);
      const price = parseInt(card.dataset.price);
      baseToolValue += price;
    });
    
    // Get environment weight
    const cloudEnvironment = document.getElementById('cloudEnvironment').value;
    const environmentWeight = CONSOLIDATION_WEIGHTS.environment[cloudEnvironment] || 
                             CONSOLIDATION_WEIGHTS.environment.default;
    
    // Get vendor weight (highest single vendor, not cumulative)
    const cnappCheckboxes = document.querySelectorAll('input[name="cnappTools"]:checked');
    let vendorWeight = CONSOLIDATION_WEIGHTS.vendor.default;
    cnappCheckboxes.forEach(checkbox => {
      const weight = CONSOLIDATION_WEIGHTS.vendor[checkbox.value] || 
                    CONSOLIDATION_WEIGHTS.vendor.default;
      if (weight > vendorWeight) {
        vendorWeight = weight;
      }
    });
    
    // Apply weighted formula
    marketValueReplaced = baseToolValue * workloads * environmentWeight * vendorWeight;
    
    // Display only the estimated value
    const estimateEl = document.getElementById('consolidationEstimate');
    estimateEl.classList.add('animating');
    estimateEl.textContent = `$${marketValueReplaced.toLocaleString()}`;
    setTimeout(() => estimateEl.classList.remove('animating'), UI_CONFIG.ANIMATION_DURATION);
    
    // Add pop-in animation to title only on first show
    if (!consolidationShownBefore) {
      const titleEl = document.getElementById('consolidationTitle');
      titleEl.classList.add('animate-once');
      consolidationShownBefore = true;
    }
    
    breakdownDiv.classList.remove('calculating');
    breakdownDiv.classList.add('show');
    
    // Update section preview
    updateSectionPreview('consolidation', marketValueReplaced);
    
    // Scroll to the breakdown after a short delay
    setTimeout(() => {
      const yOffset = -100;
      const y = breakdownDiv.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }, UI_CONFIG.SCROLL_DELAY);
    
    // Update sidebar with delay
    updateSidebar();
  }, UI_CONFIG.CALCULATION_DELAY);
}

// =========================
// MTTR Reduction Calculator
// =========================

/**
 * Calculate MTTR reduction savings
 */
function calculateMTTRSavings() {
  const workloads = parseInt(workloadsMTTR.value) || 0;
  const hourlyRate = parseFloat(document.getElementById('hourlyRateMTTR').value) || 
                     MTTR_CONFIG.DEFAULT_HOURLY_RATE;
  const monthlyIncidentsValue = parseInt(monthlyIncidents.value) || 0;
  
  if (workloads === 0) return;
  
  // Show spinner
  const spinner = document.getElementById('mttrSpinner');
  spinner.classList.add('show');
  
  // Delay calculation for suspense
  setTimeout(() => {
    // Hide spinner
    spinner.classList.remove('show');
    
    // Calculate annual incidents from monthly
    const annualIncidents = monthlyIncidentsValue * 12;
    
    // Calculate current time spent (benchmark MTTR)
    const currentTotalHours = annualIncidents * MTTR_CONFIG.BENCHMARK_MTTR_HOURS;
    const currentCost = currentTotalHours * hourlyRate;
    
    // Calculate Sweet time spent (optimized MTTR)
    const sweetTotalHours = annualIncidents * MTTR_CONFIG.SWEET_MTTR_HOURS;
    const sweetCost = sweetTotalHours * hourlyRate;
    
    // Calculate time saved
    const hoursSaved = currentTotalHours - sweetTotalHours;
    
    // Calculate savings
    mttrSavings = currentCost - sweetCost;
    
    // Build compact calculation explanation
    const stepsHTML = `
      <div style="font-size: 14px; color: var(--muted); line-height: 1.6; text-align: center;">
        Reducing MTTR from <strong style="color: var(--ink);">3 hours to 5 minutes</strong> across 
        <strong style="color: var(--ink);">${annualIncidents.toLocaleString()} annual incidents</strong> 
        saves <strong style="color: var(--ink);">${hoursSaved.toLocaleString()} hours</strong> 
        @ $${hourlyRate}/hr.
      </div>
    `;
    
    document.getElementById('mttrCalculationSteps').innerHTML = stepsHTML;
    
    // Display the final value
    const estimateEl = document.getElementById('mttrEstimateValue');
    estimateEl.classList.add('animating');
    estimateEl.textContent = `$${Math.round(mttrSavings).toLocaleString()}`;
    setTimeout(() => estimateEl.classList.remove('animating'), UI_CONFIG.ANIMATION_DURATION);
    
    // Show breakdown
    const breakdownDiv = document.getElementById('mttrBreakdown');
    breakdownDiv.classList.add('show');
    
    // Add pop-in animation to title only on first show
    if (!mttrShownBefore) {
      const titleEl = document.getElementById('mttrTitle');
      titleEl.classList.add('animate-once');
      mttrShownBefore = true;
    }
    
    // Update section preview
    updateSectionPreview('mttr', mttrSavings);
    
    // Update sidebar
    updateSidebar();
    
    // Scroll to the breakdown
    setTimeout(() => {
      const yOffset = -100;
      const y = breakdownDiv.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }, UI_CONFIG.SCROLL_DELAY);
  }, UI_CONFIG.CALCULATION_DELAY);
}

// =========================
// Vulnerability Prioritization Calculator
// =========================

/**
 * Update estimated vulnerabilities based on workloads
 */
function updateEstimatedVulns() {
  const workloadsVulnInput = document.getElementById('workloadsVuln');
  const vulnEstimatedInput = document.getElementById('vulnEstimated');
  
  // If vulnEstimated is in readonly mode, auto-calculate from workloads
  if (vulnEstimatedInput.hasAttribute('readonly')) {
    const workloads = parseInt(workloadsVulnInput.value) || 0;
    const estimated = Math.round(workloads * VULN_CONFIG.VULNS_PER_WORKLOAD);
    vulnEstimatedInput.value = estimated;
  }
}

/**
 * Toggle manual editing mode for vulnerability count
 */
function toggleManualVulnEdit() {
  const vulnEstimatedInput = document.getElementById('vulnEstimated');
  const btn = document.getElementById('manualEditBtn');
  
  if (vulnEstimatedInput.hasAttribute('readonly')) {
    vulnEstimatedInput.removeAttribute('readonly');
    vulnEstimatedInput.style.background = 'white';
    vulnEstimatedInput.focus();
    btn.textContent = 'Lock';
    btn.classList.add('editing');
  } else {
    vulnEstimatedInput.setAttribute('readonly', 'readonly');
    vulnEstimatedInput.style.background = '#f5f5f5';
    btn.textContent = 'Enter manually';
    btn.classList.remove('editing');
  }
}

/**
 * Calculate vulnerability prioritization savings
 */
function calculateVulnSavings() {
  const vulnsBefore = parseInt(document.getElementById('vulnEstimated').value) || 0;
  if (vulnsBefore === 0) return;
  
  // Show spinner
  const spinner = document.getElementById('vulnSpinner');
  const breakdownDiv = document.getElementById('vulnBreakdown');
  spinner.classList.add('show');
  breakdownDiv.classList.add('calculating');
  
  // Delay calculation for suspense
  setTimeout(() => {
    // Hide spinner
    spinner.classList.remove('show');
    
    // Calculate all values
    const vulnsIgnored = Math.round(vulnsBefore * VULN_CONFIG.VULN_REDUCTION_RATE);
    const vulnsCritical = vulnsBefore - vulnsIgnored;
    const hoursSaved = Math.round(vulnsIgnored * VULN_CONFIG.HOURS_PER_VULN);
    vulnSavings = vulnsIgnored * VULN_CONFIG.HOURS_PER_VULN * VULN_CONFIG.ENGINEER_HOURLY_COST;
    
    // Display main estimated value
    const estimateEl = document.getElementById('vulnEstimate');
    estimateEl.classList.add('animating');
    estimateEl.textContent = `$${Math.round(vulnSavings).toLocaleString()}`;
    setTimeout(() => estimateEl.classList.remove('animating'), UI_CONFIG.ANIMATION_DURATION);
    
    // Populate inline explanation with animated numbers
    animateNumber('vulnFrom', vulnsBefore);
    animateNumber('vulnTo', vulnsCritical);
    animateNumber('vulnHoursSaved', hoursSaved);
    
    // Add pop-in animation to title only on first show
    if (!vulnShownBefore) {
      const titleEl = document.getElementById('vulnTitle');
      titleEl.classList.add('animate-once');
      vulnShownBefore = true;
    }
    
    breakdownDiv.classList.remove('calculating');
    breakdownDiv.classList.add('show');
    
    // Update section preview
    updateSectionPreview('vuln', vulnSavings);
    
    // Scroll to the breakdown after a short delay
    setTimeout(() => {
      const yOffset = -100;
      const y = breakdownDiv.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }, UI_CONFIG.SCROLL_DELAY);
    
    // Update sidebar
    updateSidebar();
  }, UI_CONFIG.CALCULATION_DELAY);
}

// =========================
// Sidebar Updates
// =========================

/**
 * Update sidebar with all calculation results
 */
function updateSidebar() {
  // Update consolidation item
  if (marketValueReplaced > 0) {
    document.getElementById('consolidationItem').style.display = 'flex';
    const consolidationValueEl = document.getElementById('consolidationValue');
    consolidationValueEl.classList.add('animating');
    consolidationValueEl.textContent = `$${marketValueReplaced.toLocaleString()}`;
    setTimeout(() => consolidationValueEl.classList.remove('animating'), UI_CONFIG.ANIMATION_DURATION);
    document.getElementById('consolidationDesc').textContent = `Estimated savings from ${selectedTools.size} tools`;
    
    // Clean summary - no detailed breakdown
    document.getElementById('consolidationCalc').innerHTML = '';
  } else {
    document.getElementById('consolidationItem').style.display = 'none';
  }
  
  // Update MTTR item
  if (mttrSavings > 0) {
    document.getElementById('mttrItem').style.display = 'flex';
    const mttrValueEl = document.getElementById('mttrValue');
    mttrValueEl.classList.add('animating');
    mttrValueEl.textContent = `$${Math.round(mttrSavings).toLocaleString()}`;
    setTimeout(() => mttrValueEl.classList.remove('animating'), UI_CONFIG.ANIMATION_DURATION);
    
    const workloads = parseInt(workloadsMTTR.value) || 0;
    const hourlyRate = parseFloat(document.getElementById('hourlyRateMTTR').value) || 
                       MTTR_CONFIG.DEFAULT_HOURLY_RATE;
    const monthlyIncidentsValue = parseInt(monthlyIncidents.value) || 0;
    
    const annualIncidents = monthlyIncidentsValue * 12;
    const currentHours = Math.round(annualIncidents * MTTR_CONFIG.BENCHMARK_MTTR_HOURS);
    const sweetHours = Math.round(annualIncidents * MTTR_CONFIG.SWEET_MTTR_HOURS);
    const hoursSaved = currentHours - sweetHours;
    
    document.getElementById('mttrDesc').textContent = `${hoursSaved.toLocaleString()} hours saved annually`;
    
    document.getElementById('mttrCalc').innerHTML = `
      <div class="bill-calc-row">
        <span class="bill-calc-label">MTTR improvement:</span>
        <span class="bill-calc-value">3 hrs → 5 min</span>
      </div>
      <div class="bill-calc-row">
        <span class="bill-calc-label">Hours saved:</span>
        <span class="bill-calc-value">${hoursSaved.toLocaleString()} hrs</span>
      </div>
      <div class="bill-calc-formula">@ $${hourlyRate}/hour</div>
    `;
  } else {
    document.getElementById('mttrItem').style.display = 'none';
  }
  
  // Update vulnerability item
  if (vulnSavings > 0) {
    document.getElementById('vulnItem').style.display = 'flex';
    const vulnValueEl = document.getElementById('vulnValue');
    vulnValueEl.classList.add('animating');
    vulnValueEl.textContent = `$${Math.round(vulnSavings).toLocaleString()}`;
    setTimeout(() => vulnValueEl.classList.remove('animating'), UI_CONFIG.ANIMATION_DURATION);
    
    const vulnsBefore = parseInt(document.getElementById('vulnEstimated').value) || 0;
    document.getElementById('vulnDesc').textContent = 
      `${Math.round(vulnsBefore * VULN_CONFIG.VULN_REDUCTION_RATE).toLocaleString()} vulnerabilities deprioritized`;
    
    // Add calculation breakdown
    document.getElementById('vulnCalc').innerHTML = `
      <div class="bill-calc-row">
        <span class="bill-calc-label">Reduction rate:</span>
        <span class="bill-calc-value">99.684%</span>
      </div>
      <div class="bill-calc-row">
        <span class="bill-calc-label">Time saved:</span>
        <span class="bill-calc-value">${Math.round(vulnSavings / VULN_CONFIG.ENGINEER_HOURLY_COST).toLocaleString()} hrs</span>
      </div>
      <div class="bill-calc-formula">@ $${VULN_CONFIG.ENGINEER_HOURLY_COST}/hour</div>
    `;
  } else {
    document.getElementById('vulnItem').style.display = 'none';
  }
  
  // Update total with animation
  const total = marketValueReplaced + mttrSavings + vulnSavings;
  const totalEl = document.getElementById('totalSavings');
  totalEl.classList.add('animating');
  totalEl.textContent = `$${Math.round(total).toLocaleString()}`;
  setTimeout(() => totalEl.classList.remove('animating'), UI_CONFIG.ANIMATION_DURATION);
}

// =========================
// Animation Helpers
// =========================

/**
 * Animate a number counting up
 */
function animateNumber(elementId, finalValue, duration = 800) {
  const element = document.getElementById(elementId);
  if (!element) return;
  
  const startValue = 0;
  const startTime = performance.now();
  
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Ease out cubic
    const easeProgress = 1 - Math.pow(1 - progress, 3);
    const currentValue = Math.round(startValue + (finalValue - startValue) * easeProgress);
    
    element.textContent = currentValue.toLocaleString();
    
    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }
  
  requestAnimationFrame(update);
}

/**
 * Animate currency counting up
 */
function animateCurrency(elementId, finalValue, duration = 800) {
  const element = document.getElementById(elementId);
  if (!element) return;
  
  const startValue = 0;
  const startTime = performance.now();
  
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Ease out cubic
    const easeProgress = 1 - Math.pow(1 - progress, 3);
    const currentValue = Math.round(startValue + (finalValue - startValue) * easeProgress);
    
    element.textContent = '$' + currentValue.toLocaleString();
    
    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }
  
  requestAnimationFrame(update);
}

// =========================
// UI Helpers
// =========================

/**
 * Toggle additional details collapsible section
 */
function toggleAdditionalDetails() {
  const toggle = document.getElementById('additionalDetailsToggle');
  const content = document.getElementById('additionalDetailsContent');
  
  toggle.classList.toggle('active');
  content.classList.toggle('show');
}

/**
 * Open precise estimate (redirect to demo)
 */
function openPreciseEstimate() {
  redirectToDemo();
}

/**
 * Redirect to demo booking page
 */
function redirectToDemo() {
  alert('Redirect to book a demo page will be here');
  // Future: window.location.href = 'https://your-demo-booking-url.com';
}

// =========================
// Event Listeners
// =========================

/**
 * Initialize all event listeners
 */
function initializeEventListeners() {
  // Workload input sync
  workloadsInput.addEventListener('input', () => {
    syncWorkloads(workloadsInput.value);
  });
  
  workloadsMTTR.addEventListener('input', () => {
    syncWorkloads(workloadsMTTR.value);
  });
  
  workloadsVuln.addEventListener('input', () => {
    syncWorkloads(workloadsVuln.value);
  });
  
  // Track manual changes to monthly incidents
  monthlyIncidents.addEventListener('input', () => {
    userOverrodeIncidents = true;
  });
  
  // Reset override flag when monthly incidents is cleared
  monthlyIncidents.addEventListener('focus', function() {
    if (this.value === '') {
      userOverrodeIncidents = false;
      updateMonthlyIncidents();
    }
  });
}

// =========================
// Initialization
// =========================

/**
 * Initialize the calculator on page load
 */
function init() {
  initializeToolSelection();
  initializeEventListeners();
  // Don't set default values - let user fill them in
  // syncWorkloads will be called when user inputs a value
}

// Run initialization when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// =========================
// Global Function Exports
// (for inline onclick handlers)
// =========================
window.toggleSection = toggleSection;
window.calculateConsolidation = calculateConsolidation;
window.calculateMTTRSavings = calculateMTTRSavings;
window.updateEstimatedVulns = updateEstimatedVulns;
window.toggleManualVulnEdit = toggleManualVulnEdit;
window.calculateVulnSavings = calculateVulnSavings;
window.toggleAdditionalDetails = toggleAdditionalDetails;
window.openPreciseEstimate = openPreciseEstimate;
window.redirectToDemo = redirectToDemo;
