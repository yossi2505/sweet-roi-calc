/**
 * ROI Calculator Configuration
 * All constants, weights, and assumptions used in calculations
 */

// =========================
// MTTR (Mean Time To Resolve) Constants
// =========================
export const MTTR_CONFIG = {
  // Incidents per workload
  INCIDENTS_PER_WORKLOAD_YEAR: 12,
  INCIDENTS_PER_WORKLOAD_MONTH: 1,
  
  // MTTR benchmarks
  BENCHMARK_MTTR_HOURS: 3,
  SWEET_MTTR_MINUTES: 5,
  SWEET_MTTR_HOURS: 5 / 60, // 0.0833 hours
  
  // Default values
  DEFAULT_HOURLY_RATE: 35,
  DEFAULT_WORKLOADS: 800
};

// =========================
// Vulnerability Prioritization Constants
// =========================
export const VULN_CONFIG = {
  VULNS_PER_WORKLOAD: 10.5,        // Average vulnerabilities per workload
  HOURS_PER_VULN: 10,              // Person-hours to remediate one vulnerability
  ENGINEER_HOURLY_COST: 100,       // $/hour for SecOps/DevOps engineer
  VULN_REDUCTION_RATE: 0.99684     // 99.684% reduction in vulnerabilities needing attention
};

// =========================
// Tool Consolidation Weights
// =========================
export const CONSOLIDATION_WEIGHTS = {
  // Cloud environment weights
  environment: {
    'aws': 1.15,
    'azure': 1.10,
    'gcp': 1.05,
    'multicloud': 1.25,
    'hybrid': 1.10,
    'onprem': 0.95,
    'default': 1.0
  },
  
  // CNAPP vendor weights (highest single vendor applies, not cumulative)
  vendor: {
    'wiz': 1.25,
    'orca': 1.20,
    'prisma': 1.15,
    'lacework': 1.10,
    'sysdig': 1.10,
    'other': 1.05,
    'none': 1.0,
    'default': 1.0
  }
};

// =========================
// Tool Catalog
// =========================
export const SECURITY_TOOLS = [
  {
    id: 'runtime',
    name: 'Runtime Security',
    description: 'CWPP & Real-Time Monitoring',
    price: 150
  },
  {
    id: 'cspm',
    name: 'Cloud Security Posture',
    description: 'CSPM & Configuration Management',
    price: 100
  },
  {
    id: 'ciem',
    name: 'Identity Management',
    description: 'CIEM & Identity Protection',
    price: 80
  },
  {
    id: 'dspm',
    name: 'Data Security',
    description: 'DSPM & Data Protection',
    price: 120
  },
  {
    id: 'api',
    name: 'API Security',
    description: 'API Discovery & Protection',
    price: 110
  },
  {
    id: 'vm',
    name: 'Vulnerability Management',
    description: 'VM & Prioritization',
    price: 90
  },
  {
    id: 'cdr',
    name: 'Detection & Response',
    description: 'CDR & SIEM Integration',
    price: 130
  },
  {
    id: 'ai',
    name: 'AI/ML Security',
    description: 'Model & Pipeline Protection',
    price: 140
  }
];

// =========================
// UI Configuration
// =========================
export const UI_CONFIG = {
  // Delays and timing
  CALCULATION_DELAY: 800,    // Suspense delay before showing results (ms)
  ANIMATION_DURATION: 400,   // Duration of animations (ms)
  SCROLL_DELAY: 300,         // Delay before scrolling to results (ms)
  NEXT_SECTION_DELAY: 1500,  // Delay before auto-expanding next section (ms)
  
  // Default input values
  DEFAULT_WORKLOADS: 800,
  DEFAULT_MONTHLY_INCIDENTS: 4000,
  DEFAULT_HOURLY_RATE: 35
};

// =========================
// Export all configs
// =========================
export default {
  MTTR_CONFIG,
  VULN_CONFIG,
  CONSOLIDATION_WEIGHTS,
  SECURITY_TOOLS,
  UI_CONFIG
};

