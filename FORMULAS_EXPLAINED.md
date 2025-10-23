# ROI Calculator - All Formulas Explained Simply

## 📊 **Calculator 1: Tool Consolidation Value**

### What it does:
Shows the total market cost of security tools you could replace.

### Formula:
```
Market Value = Sum of (Each Tool Price × Number of Workloads)
```

### Example:
- You select: Runtime Security ($150/workload) + CSPM ($100/workload)
- You have: 800 workloads
- Calculation: 
  - Runtime: $150 × 800 = $120,000
  - CSPM: $100 × 800 = $80,000
  - **Total: $200,000** (this is what those tools cost per year)

---

## 🔔 **Calculator 2: Alert Reduction Savings**

### What it does:
Calculates money saved by reducing security alerts by 90% (from thousands down to hundreds).

### Formula:
```
Step 1: Annual Findings = Workloads × 1,800 findings/month × 12 months
Step 2: High/Critical = Annual Findings × 28%
Step 3: Current Hours = High/Critical × 3 minutes ÷ 60
Step 4: Current Cost = Current Hours × Hourly Rate
Step 5: Sweet Hours = Current Hours × 10% (90% reduction means only 10% remain)
Step 6: Sweet Cost = Sweet Hours × Hourly Rate
Step 7: SAVINGS = Current Cost - Sweet Cost
```

### Example (800 workloads, $35/hour):
```
Step 1: 800 × 1,800 × 12 = 17,280,000 findings/year
Step 2: 17,280,000 × 28% = 4,838,400 high/critical
Step 3: 4,838,400 × 3 min ÷ 60 = 241,920 hours currently
Step 4: 241,920 × $35 = $8,467,200 current cost
Step 5: 241,920 × 10% = 24,192 hours with Sweet
Step 6: 24,192 × $35 = $846,720 with Sweet
Step 7: $8,467,200 - $846,720 = $7,620,480 SAVED
```

---

## ⏱️ **Calculator 3: MTTR Reduction Value**

### What it does:
Calculates money saved by resolving incidents faster (3 hours down to 5 minutes).

### Formula:
```
Step 1: Annual Incidents = Monthly Incidents × 12 
        (OR if blank, use default: Workloads × 12 incidents/workload/year)
Step 2: Current Hours = Annual Incidents × 3 hours (benchmark MTTR)
Step 3: Current Cost = Current Hours × Hourly Rate
Step 4: Sweet Hours = Annual Incidents × 5 minutes ÷ 60 (Sweet's MTTR)
Step 5: Sweet Cost = Sweet Hours × Hourly Rate
Step 6: Hours Saved = Current Hours - Sweet Hours
Step 7: SAVINGS = Current Cost - Sweet Cost
```

### Example A: User enters 100 monthly incidents, $35/hour:
```
Step 1: 100 × 12 = 1,200 incidents/year
Step 2: 1,200 × 3 = 3,600 hours currently
Step 3: 3,600 × $35 = $126,000 current cost
Step 4: 1,200 × (5÷60) = 100 hours with Sweet
Step 5: 100 × $35 = $3,500 with Sweet
Step 6: 3,600 - 100 = 3,500 hours saved
Step 7: $126,000 - $3,500 = $122,500 SAVED
```

### Example B: User leaves monthly incidents blank (uses default), 800 workloads, $35/hour:
```
Step 1: 800 × 12 = 9,600 incidents/year (default)
Step 2: 9,600 × 3 = 28,800 hours currently
Step 3: 28,800 × $35 = $1,008,000 current cost
Step 4: 9,600 × (5÷60) = 800 hours with Sweet
Step 5: 800 × $35 = $28,000 with Sweet
Step 6: 28,800 - 800 = 28,000 hours saved
Step 7: $1,008,000 - $28,000 = $980,000 SAVED
```

---

## 💰 **Total Annual Value**

```
Total = Market Value + Alert Reduction Savings + MTTR Reduction Savings
```

Using examples above:
```
$200,000 + $7,620,480 + $980,000 = $8,800,480 total annual value
```

---

## 🔑 **Key Assumptions**

### Tool Consolidation:
- Tool prices are industry averages per workload per year
- Based on public vendor pricing benchmarks

### Alert Reduction:
- 1,800 findings per workload per month (actual customer data)
- 3 minutes to review each finding
- 28% of findings are high/critical priority
- Sweet reduces alerts by 90% through AI correlation

### MTTR Reduction:
- 12 incidents per workload per year (industry average, adjustable)
- 3 hours = Industry benchmark MTTR
- 5 minutes = Sweet's MTTR with automation
- 98% time reduction per incident

---

## ❓ **What's Broken? Let me know:**
1. Which calculator seems wrong?
2. What number doesn't make sense?
3. What did you expect to see?

