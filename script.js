// GLOBAL APP MEMORY STORAGE ARRAYS & CONFIGURATION STATE ENTITIES
let state = {
    profile: {
        name: "Eco Guardian",
        ageGroup: "adult-young",
        location: "Global Citizen",
        goal: "net-zero",
        theme: "light"
    },
    logs: [],
    streak: 0,
    points: 0,
    lastLoggedDateStr: ""
};

// Static Ecological conversion impact factor coefficients metrics parameters
const CARBON_FACTORS = {
    transport: 0.21,   // kg CO2e per single driven km
    electricity: 0.45, // kg CO2e per single consumed kWh
    water: 0.0003,     // kg CO2e per single tracked liter usage 
    waste: 1.25,       // kg CO2e per single kg unsorted thrown garbage trash dump
    diet: {
        "vegan": 1.5,       // Base constant flat offset score scaling weight factor equivalent per day
        "vegetarian": 2.2,
        "balanced": 3.8,
        "heavy-meat": 6.5
    }
};

// CHART OBJECT REFERENCE HANDLES FOR RENDER DESTRUCTION HOOKS
let trendChartRef = null;
let categoryChartRef = null;

// SEED INITIALIZER PIPELINE ON DOCUMENT DOM READY LIFECYCLE HOOK
window.addEventListener('DOMContentLoaded', () => {
    loadStateFromLocalStorage();
    applyThemeDefaults();
    initializeFormInputListeners();
    refreshApplicationInterfaceMetricsUI();
});

// REFRESH INTERFACE LIFECYCLE MAIN DISPATCHER
function refreshApplicationInterfaceMetricsUI() {
    renderKPIWidgets();
    renderChartsTelemetry();
    renderLogsTable();
    renderAchievementsGrid();
    updateGamificationDisplays();
    
    // Set dynamic profile display text names inputs values indicators
    document.getElementById('welcome-title').innerText = `Welcome back, ${state.profile.name || "Eco Guardian"}!`;
    document.getElementById('profile-name').value = state.profile.name || "";
    document.getElementById('profile-age-group').value = state.profile.ageGroup || "adult-young";
    document.getElementById('profile-location').value = state.profile.location || "";
    document.getElementById('profile-goal').value = state.profile.goal || "net-zero";
}

// LOCAL STORAGE LOAD CONTEXT RUNTIME PIPELINE
function loadStateFromLocalStorage() {
    try {
        const storedProfile = localStorage.getItem('ecotrack_profile');
        const storedLogs = localStorage.getItem('ecotrack_logs');
        const storedStreak = localStorage.getItem('ecotrack_streak');
        const storedPoints = localStorage.getItem('ecotrack_points');
        const storedLastDate = localStorage.getItem('ecotrack_last_date');

        if (storedProfile) state.profile = JSON.parse(storedProfile);
        if (storedLogs) {
            state.logs = JSON.parse(storedLogs);
        } else {
            // Populate mock historical telemetry seed data for initial demonstration profile
            state.logs = [
                { id: "seed-1", date: getOffsetDateString(4), desc: "Weekly local supermarket grocery supply collection trip", transport: 24, electricity: 6.2, water: 120, waste: 1.5, diet: "balanced", carbon: 12.3 },
                { id: "seed-2", date: getOffsetDateString(3), desc: "Remote workday household utility run", transport: 0, electricity: 14.5, water: 210, waste: 0.8, diet: "vegetarian", carbon: 8.9 },
                { id: "seed-3", date: getOffsetDateString(2), desc: "Weekend family drive commute trip log details", transport: 65, electricity: 8.1, water: 180, waste: 3.2, diet: "heavy-meat", carbon: 28.2 },
                { id: "seed-4", date: getOffsetDateString(1), desc: "Conservation efforts day focus challenge execution", transport: 8, electricity: 4.1, water: 90, waste: 0, diet: "vegan", carbon: 3.5 }
            ];
        }
        if (storedStreak) state.streak = parseInt(storedStreak, 10);
        if (storedPoints) state.points = parseInt(storedPoints, 10);
        if (storedLastDate) state.lastLoggedDateStr = storedLastDate;
    } catch (e) {
        console.error("Critical storage interface corruption crash failure. Resetting defaults safely.", e);
    }
}

function saveStateToLocalStorage() {
    localStorage.setItem('ecotrack_profile', JSON.stringify(state.profile));
    localStorage.setItem('ecotrack_logs', JSON.stringify(state.logs));
    localStorage.setItem('ecotrack_streak', state.streak.toString());
    localStorage.setItem('ecotrack_points', state.points.toString());
    localStorage.setItem('ecotrack_last_date', state.lastLoggedDateStr);
}

// THEME HANDLING DEFAULTS ENGINE CONTROLS
function applyThemeDefaults() {
    if (state.profile.theme === 'dark' || (!('ecotrack_profile' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
        state.profile.theme = 'dark';
    } else {
        document.documentElement.classList.remove('dark');
        state.profile.theme = 'light';
    }
}

function toggleDarkMode() {
    if (document.documentElement.classList.contains('dark')) {
        document.documentElement.classList.remove('dark');
        state.profile.theme = 'light';
    } else {
        document.documentElement.classList.add('dark');
        state.profile.theme = 'dark';
    }
    saveStateToLocalStorage();
    showToastNotification("Theme context style adjusted successfully!", "info");
    renderChartsTelemetry(); // Redraw chart matching theme colors
}

// SECTION SWITCHER ROUTING CONTROLLER
function switchSection(sectionId) {
    document.querySelectorAll('.app-section').forEach(section => {
        section.classList.remove('active');
    });
    const targetSection = document.getElementById(sectionId);
    if (targetSection) targetSection.classList.add('active');

    // Toggle selected state menu list navigation styles triggers
    document.querySelectorAll('.nav-btn').forEach(btn => {
        if (btn.getAttribute('data-nav') === sectionId) {
            btn.className = "nav-btn w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-eco-600 bg-eco-50 dark:bg-eco-950/30 dark:text-eco-400 font-semibold";
        } else {
            btn.className = "nav-btn w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800/50";
        }
    });
}

// REAL-TIME MATHEMATICAL FORMULATION MATRIX CALCULATION PIPELINE ENGINE
function calculateCarbonEquivalentMetric(trans, electric, water, waste, dietKey) {
    let carbonNetVal = 0;
    carbonNetVal += (parseFloat(trans) || 0) * CARBON_FACTORS.transport;
    carbonNetVal += (parseFloat(electric) || 0) * CARBON_FACTORS.electricity;
    carbonNetVal += (parseFloat(water) || 0) * CARBON_FACTORS.water;
    carbonNetVal += (parseFloat(waste) || 0) * CARBON_FACTORS.waste;
    carbonNetVal += CARBON_FACTORS.diet[dietKey] || CARBON_FACTORS.diet["balanced"];
    return parseFloat(carbonNetVal.toFixed(2));
}

// LIVE FEEDBACK ON KEY INPUT LOOPS FORM LISTENER BINDINGS SETUP INITIALIZER
function initializeFormInputListeners() {
    const inputs = ['calc-trans', 'calc-electric', 'calc-water', 'calc-waste', 'calc-diet'];
    inputs.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('input', runLiveRealTimeCalculatorEnginePreview);
        }
    });
    runLiveRealTimeCalculatorEnginePreview();
}

function runLiveRealTimeCalculatorEnginePreview() {
    const trans = document.getElementById('calc-trans').value;
    const electric = document.getElementById('calc-electric').value;
    const water = document.getElementById('calc-water').value;
    const waste = document.getElementById('calc-waste').value;
    const diet = document.getElementById('calc-diet').value;

    const computedTotal = calculateCarbonEquivalentMetric(trans, electric, water, waste, diet);
    document.getElementById('live-calc-total').innerText = computedTotal.toFixed(2);

    // Re-render intelligent analytics insight blocks dynamically based on input metrics
    const insightsBox = document.getElementById('calculator-insights-box');
    let insightHTML = "";

    if (computedTotal > 25) {
        insightHTML += `<p class="text-rose-500 font-medium"><i class="fa-solid fa-triangle-exclamation"></i> High Emissions Footprint detected. Driven vehicles or intensive diets are creating heavy pressure indexes.</p>`;
    } else if (computedTotal > 0) {
        insightHTML += `<p class="text-eco-600 font-medium"><i class="fa-solid fa-circle-check"></i> Great baseline tracking standard profile matches optimized sustainable limits guidelines.</p>`;
    }

    if ((parseFloat(trans) || 0) > 40) {
        insightHTML += `<p>• Transport metrics exceed daily target rules. Consider carpooling, cycling alternatives, or transitioning short trips to mass public transit networks.</p>`;
    }
    if ((parseFloat(electric) || 0) > 15) {
        insightHTML += `<p>• High daily power consumption profile. Unplug idle vampire electronics, maximize reliance on LEDs or natural lumens, and configure smart climate timers.</p>`;
    }
    if ((parseFloat(water) || 0) > 250) {
        insightHTML += `<p>• Water volumes exceed safe benchmark targets. Inspect utility pipelines for leakage configurations and reduce shower runtime intervals.</p>`;
    }
    if (diet === 'heavy-meat') {
        insightHTML += `<p>• Livestock processing remains heavily greenhouse gas resource-intensive. Substituting even one meat meal daily creates immense compounding reductions over time.</p>`;
    }

    if (!insightHTML) {
        insightHTML = `<p class="italic text-slate-400">Fill in the metrics on the left side to compile instant ecological impact feedback analysis updates.</p>`;
    }

    insightsBox.innerHTML = insightHTML;
}

// CALCULATOR SUBMIT TRIGGER FUNCTION HANDLING EVENT LOG ENTRIES COMMIT
function calculateFootprintEvent(e) {
    e.preventDefault();
    const trans = parseFloat(document.getElementById('calc-trans').value) || 0;
    const electric = parseFloat(document.getElementById('calc-electric').value) || 0;
    const water = parseFloat(document.getElementById('calc-water').value) || 0;
    const waste = parseFloat(document.getElementById('calc-waste').value) || 0;
    const diet = document.getElementById('calc-diet').value;

    const computedTotal = calculateCarbonEquivalentMetric(trans, electric, water, waste, diet);

    processDailyStreakValidationMetrics();

    const newLogEntry = {
        id: "log-" + Date.now(),
        date: getCurrentDateString(),
        desc: `Calculator Intake Log Entry [Diet Profile Weight: ${diet.toUpperCase()}]`,
        transport: trans,
        electricity: electric,
        water: water,
        waste: waste,
        diet: diet,
        carbon: computedTotal
    };

    state.logs.unshift(newLogEntry);
    state.points += 25; // Award eco points
    
    saveStateToLocalStorage();
    refreshApplicationInterfaceMetricsUI();
    resetCalculatorForm();
    showToastNotification("Eco footprint metrics computed and added to activity logs successfully! (+25 XP)", "success");
}

function resetCalculatorForm() {
    document.getElementById('calc-form').reset();
    runLiveRealTimeCalculatorEnginePreview();
}

// STREAK VALIDATION SUB SYSTEM MECHANICS INTERFACE TRACKER
function processDailyStreakValidationMetrics() {
    const todayStr = getCurrentDateString();
    if (state.lastLoggedDateStr !== todayStr) {
        if (state.lastLoggedDateStr === getOffsetDateString(1)) {
            state.streak += 1;
        } else if (state.lastLoggedDateStr === "") {
            state.streak = 1;
        } else {
            state.streak = 1; // Missed days reset condition
        }
        state.lastLoggedDateStr = todayStr;
    }
}

// RENDER METHOD WIDGET PACKS DATA TO METRICS INDICATORS
function renderKPIWidgets() {
    let totalCarbonToday = 0;
    let totalEnergy = 0;
    let totalWater = 0;
    let totalWaste = 0;

    const todayStr = getCurrentDateString();
    const todayLogs = state.logs.filter(l => l.date === todayStr);

    if (todayLogs.length > 0) {
        todayLogs.forEach(l => {
            totalCarbonToday += l.carbon;
            totalEnergy += l.electricity;
            totalWater += l.water;
            totalWaste += l.waste;
        });
    } else if (state.logs.length > 0) {
        // Fallback aggregate mean averages if current date holds no logged logs
        let aggregateCarbon = 0;
        state.logs.forEach(l => {
            aggregateCarbon += l.carbon;
            totalEnergy += l.electricity;
            totalWater += l.water;
            totalWaste += l.waste;
        });
        totalCarbonToday = aggregateCarbon / state.logs.length;
        totalEnergy = totalEnergy / state.logs.length;
        totalWater = totalWater / state.logs.length;
        totalWaste = totalWaste / state.logs.length;
    }

    // Adjust eco performance index relative to dynamic threshold marks calculations limits targets
    let sustainabilityScore = 100 - (totalCarbonToday * 2.5);
    if (sustainabilityScore < 15) sustainabilityScore = 15;
    if (sustainabilityScore > 100) sustainabilityScore = 100;

    document.getElementById('kpi-eco-score').innerText = `${Math.round(sustainabilityScore)}/100`;
    document.getElementById('kpi-carbon').innerHTML = `${totalCarbonToday.toFixed(2)} <span class="text-sm font-medium">kg</span>`;
    document.getElementById('kpi-energy').innerHTML = `${totalEnergy.toFixed(1)} <span class="text-sm font-medium">kWh</span>`;
    document.getElementById('kpi-water').innerHTML = `${totalWater.toFixed(0)} <span class="text-sm font-medium">L</span>`;
    document.getElementById('kpi-waste').innerHTML = `${totalWaste.toFixed(1)} <span class="text-sm font-medium">kg</span>`;
}

// GAMIFICATION & REWARD LEVEL DISPLAY HANDLING LOGIC PIPELINE
function updateGamificationDisplays() {
    const currentXP = state.points;
    const levelIndex = Math.floor(currentXP / 100) + 1;
    const xpTowardsNextLevel = currentXP % 100;

    let titleStr = "Eco Novice Explorer";
    if (levelIndex >= 5) titleStr = "Carbon Neutral Overlord";
    else if (levelIndex >= 3) titleStr = "Climate Mitigation Sage";
    else if (levelIndex >= 2) titleStr = "Dedicated Eco Guardian";

    document.getElementById('sidebar-user-level').innerText = `Lvl ${levelIndex} ${titleStr}`;
    document.getElementById('sidebar-xp-display').innerText = `${xpTowardsNextLevel} / 100 XP`;
    document.getElementById('sidebar-xp-bar').style.width = `${xpTowardsNextLevel}%`;

    document.getElementById('streak-counter-sidebar').innerText = `${state.streak} Day Streak`;
    document.getElementById('dashboard-streak-txt').innerText = `${state.streak} Days Active`;
    document.getElementById('dashboard-points-txt').innerText = `${state.points} GP / XP Points`;

    if (currentXP >= 400) {
        document.getElementById('dashboard-badge-milestone').innerText = "Absolute Net Zero Master Elite Status Unlocked";
        document.getElementById('badge-milestone-progress').style.width = "100%";
    } else {
        const nextBadgeXPThreshold = 100 * levelIndex;
        const progressPercentage = (xpTowardsNextLevel / 100) * 100;
        document.getElementById('dashboard-badge-milestone').innerText = `Next Milestone Reward at ${nextBadgeXPThreshold} total points`;
        document.getElementById('badge-milestone-progress').style.width = `${progressPercentage}%`;
    }
}

// CORE REWARD SYSTEM MILESTONES DATA MAP RENDERING
function renderAchievementsGrid() {
    const achievementsGrid = document.getElementById('achievements-grid');
    const currentXP = state.points;

    const milestones = [
        { name: "Eco Recruit Initialized", desc: "Created account platform tracking node profiles.", requiredXP: 0, icon: "fa-seedling", color: "text-emerald-500 bg-emerald-100 dark:bg-emerald-950/40" },
        { name: "Carbon Analyst", desc: "Logged tracking entry data points metrics transactions.", requiredXP: 25, icon: "fa-calculator", color: "text-blue-500 bg-blue-100 dark:bg-blue-950/40" },
        { name: "Conservation Enthusiast", desc: "Crossed 100 total point rewards threshold marks safely.", requiredXP: 100, icon: "fa-bolt", color: "text-amber-500 bg-amber-100 dark:bg-amber-950/40" },
        { name: "Streak Legend Champion", desc: "Maintained multiple verification cycles actions.", requiredXP: 200, icon: "fa-fire", color: "text-orange-500 bg-orange-100 dark:bg-orange-950/40" },
        { name: "Climate Elite Hero Status", desc: "Advanced carbon tracker profile intelligence scaling metrics.", requiredXP: 400, icon: "fa-earth-americas", color: "text-purple-500 bg-purple-100 dark:bg-purple-950/40" }
    ];

    achievementsGrid.innerHTML = "";

    milestones.forEach(m => {
        const isUnlocked = currentXP >= m.requiredXP;
        const opacityClass = isUnlocked ? "opacity-100 scale-100" : "opacity-40 scale-95 saturate-50 grayscale";
        const borderClass = isUnlocked ? "border-emerald-500/30 bg-white dark:bg-slate-800" : "border-slate-200 dark:border-slate-800 bg-slate-100/40 dark:bg-slate-900/40";

        achievementsGrid.innerHTML += `
            <div class="p-3 border rounded-xl flex flex-col items-center text-center space-y-1.5 transition-all ${opacityClass} ${borderClass}">
                <div class="w-10 h-10 rounded-full flex items-center justify-center text-base ${m.color}">
                    <i class="fa-solid ${m.icon}"></i>
                </div>
                <h5 class="font-bold text-[11px] leading-tight">${m.name}</h5>
                <p class="text-[9px] text-slate-400 leading-tight">${m.desc}</p>
                <span class="text-[9px] font-bold mt-1 px-1.5 py-0.5 rounded ${isUnlocked ? 'bg-eco-100 text-eco-700 dark:bg-eco-950/40 dark:text-eco-400' : 'bg-slate-200 text-slate-500 dark:bg-slate-700'}">
                    ${isUnlocked ? 'Unlocked' : `Locked (${m.requiredXP} XP)`}
                </span>
            </div>
        `;
    });
}

// TELEMETRY VISUALIZATION CHARTS GENERATION ENGINE VIA CHART JS WRAPPERS
function renderChartsTelemetry() {
    const isDark = document.documentElement.classList.contains('dark');
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)';
    const textColor = isDark ? '#94a3b8' : '#64748b';

    // Reverse items array to maintain chronological mapping order (left-to-right)
    const chronologicalLogs = [...state.logs].slice(0, 7).reverse();
    const labels = chronologicalLogs.map(l => l.date);
    const carbonData = chronologicalLogs.map(l => l.carbon);

    let transportSum = 0, electricSum = 0, waterSum = 0, wasteSum = 0;
    state.logs.forEach(l => {
        transportSum += (l.transport * CARBON_FACTORS.transport);
        electricSum += (l.electricity * CARBON_FACTORS.electricity);
        waterSum += (l.water * CARBON_FACTORS.water);
        wasteSum += (l.waste * CARBON_FACTORS.waste);
    });

    const finalLabels = labels.length > 0 ? labels : [getCurrentDateString()];
    const finalCarbonData = carbonData.length > 0 ? carbonData : [0];

    // --- 1. TREND LINE CHART ---
    if (trendChartRef) trendChartRef.destroy();
    const ctxTrend = document.getElementById('trendChart');
    if (ctxTrend) {
        trendChartRef = new Chart(ctxTrend.getContext('2d'), {
            type: 'line',
            data: {
                labels: finalLabels,
                datasets: [{
                    label: 'Emissions Yield Profile (kg CO₂e)',
                    data: finalCarbonData,
                    borderColor: '#22c55e',
                    backgroundColor: 'rgba(34, 197, 94, 0.1)',
                    borderWidth: 2.5,
                    tension: 0.35,
                    fill: true,
                    pointBackgroundColor: '#16a34a'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { grid: { color: gridColor }, ticks: { color: textColor, font: { size: 10 } } },
                    y: { grid: { color: gridColor }, ticks: { color: textColor, font: { size: 10 } } }
                }
            }
        });
    }

    // --- 2. BREAKDOWN DOUGHNUT CHART ---
    if (categoryChartRef) categoryChartRef.destroy();
    const ctxCat = document.getElementById('categoryChart');
    if (ctxCat) {
        const totalSlicesSum = transportSum + electricSum + waterSum + wasteSum;
        const doughnutDataArray = totalSlicesSum === 0 ? [25, 25, 25, 25] : [transportSum, electricSum, waterSum, wasteSum];

        categoryChartRef = new Chart(ctxCat.getContext('2d'), {
            type: 'doughnut',
            data: {
                labels: ['Transit', 'Electricity Grid', 'Water Supply', 'Waste Disposal'],
                datasets: [{
                    data: doughnutDataArray,
                    backgroundColor: ['#3b82f6', '#f59e0b', '#06b6d4', '#78716c'],
                    borderWidth: isDark ? 2 : 1,
                    borderColor: isDark ? '#1e293b' : '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { color: textColor, font: { size: 10 }, boxWidth: 12 }
                    }
                },
                cutout: '65%'
            }
        });
    }
}

// HISTORICAL CRUD TABLE RENDERING ENGINE
function renderLogsTable() {
    const tableBody = document.getElementById('logs-table-body');
    const emptyState = document.getElementById('logs-empty-state');
    
    const searchKeyword = document.getElementById('log-search-input').value.toLowerCase();
    const dietFilter = document.getElementById('log-filter-diet').value;
    const sortOrder = document.getElementById('log-sort-order').value;

    let filteredLogs = [...state.logs];

    if (searchKeyword) {
        filteredLogs = filteredLogs.filter(l => l.desc.toLowerCase().includes(searchKeyword));
    }

    if (dietFilter !== 'all') {
        filteredLogs = filteredLogs.filter(l => l.diet === dietFilter);
    }

    if (sortOrder === 'oldest') {
        filteredLogs.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (sortOrder === 'highest-carbon') {
        filteredLogs.sort((a, b) => b.carbon - a.carbon);
    } else {
        filteredLogs.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    if (filteredLogs.length === 0) {
        tableBody.innerHTML = "";
        emptyState.classList.remove('hidden');
        return;
    } else {
        emptyState.classList.add('hidden');
    }

    tableBody.innerHTML = "";
    filteredLogs.forEach(l => {
        tableBody.innerHTML += `
            <tr class="hover:bg-slate-100/60 dark:hover:bg-slate-800/40 transition-colors border-b border-slate-200 dark:border-slate-800">
                <td class="p-4 font-medium text-slate-400 whitespace-nowrap">${l.date}</td>
                <td class="p-4 font-semibold text-slate-700 dark:text-slate-300 max-w-xs truncate" title="${l.desc}">${l.desc}</td>
                <td class="p-4">${l.transport}</td>
                <td class="p-4">${l.electricity}</td>
                <td class="p-4">${l.water}</td>
                <td class="p-4">${l.waste}</td>
                <td class="p-4"><span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">${l.diet}</span></td>
                <td class="p-4 font-bold text-rose-500">${l.carbon.toFixed(2)}</td>
                <td class="p-4 text-center whitespace-nowrap space-x-1">
                    <button onclick="openEditManualLogModal('${l.id}')" class="px-2 py-1 text-blue-500 hover:bg-blue-500/10 rounded transition-all" title="Edit entry"><i class="fa-solid fa-pen-to-square"></i></button>
                    <button onclick="deleteLogEntryTransaction('${l.id}')" class="px-2 py-1 text-rose-500 hover:bg-rose-500/10 rounded transition-all" title="Delete entry"><i class="fa-solid fa-trash-can"></i></button>
                </td>
            </tr>
        `;
    });
}

// CRUD ENTRIES MODAL CONTAINER HOOK FUNCTIONS
function openAddManualLogModal() {
    document.getElementById('modal-log-form').reset();
    document.getElementById('modal-edit-id').value = "";
    document.getElementById('modal-title-context').innerText = "Insert Historical Environmental Track Entry";
    document.getElementById('manual-log-modal').classList.remove('hidden');
}

function openEditManualLogModal(id) {
    const entry = state.logs.find(l => l.id === id);
    if (!entry) return;

    document.getElementById('modal-edit-id').value = entry.id;
    document.getElementById('modal-log-desc').value = entry.desc;
    document.getElementById('modal-log-trans').value = entry.transport;
    document.getElementById('modal-log-electric').value = entry.electricity;
    document.getElementById('modal-log-water').value = entry.water;
    document.getElementById('modal-log-waste').value = entry.waste;
    document.getElementById('modal-log-diet').value = entry.diet;

    document.getElementById('modal-title-context').innerText = "Modify Existing Environmental Tracking Record";
    document.getElementById('manual-log-modal').classList.remove('hidden');
}

function closeAddManualLogModal() {
    document.getElementById('manual-log-modal').classList.add('hidden');
}

function handleManualLogFormSubmit(e) {
    e.preventDefault();
    const editId = document.getElementById('modal-edit-id').value;
    const desc = document.getElementById('modal-log-desc').value;
    const trans = parseFloat(document.getElementById('modal-log-trans').value) || 0;
    const electric = parseFloat(document.getElementById('modal-log-electric').value) || 0;
    const water = parseFloat(document.getElementById('modal-log-water').value) || 0;
    const waste = parseFloat(document.getElementById('modal-log-waste').value) || 0;
    const diet = document.getElementById('modal-log-diet').value;

    const carbon = calculateCarbonEquivalentMetric(trans, electric, water, waste, diet);

    if (editId) {
        const logIndex = state.logs.findIndex(l => l.id === editId);
        if (logIndex !== -1) {
            state.logs[logIndex] = { ...state.logs[logIndex], desc, transport: trans, electricity: electric, water: water, waste: waste, diet, carbon };
            showToastNotification("Historical environmental telemetry item log transaction updated successfully!", "success");
        }
    } else {
        processDailyStreakValidationMetrics();
        const newEntry = {
            id: "log-" + Date.now(),
            date: getCurrentDateString(),
            desc, transport: trans, electricity: electric, water: water, waste: waste, diet, carbon
        };
        state.logs.unshift(newEntry);
        state.points += 15;
        showToastNotification("Manual entry committed onto storage tracking nodes layers (+15 XP)", "success");
    }

    saveStateToLocalStorage();
    refreshApplicationInterfaceMetricsUI();
    closeAddManualLogModal();
}

function deleteLogEntryTransaction(id) {
    if (confirm("Are you absolutely sure you want to permanently purge this sustainability log record?")) {
        state.logs = state.logs.filter(l => l.id !== id);
        saveStateToLocalStorage();
        refreshApplicationInterfaceMetricsUI();
        showToastNotification("Selected transaction data purged from platform logs records.", "info");
    }
}

// CHAT SUBMIT SIMULATION HANDLING
function handleChatSubmit(e) {
    e.preventDefault();
    const inputField = document.getElementById('chat-user-msg');
    const messageText = inputField.value.trim();
    if (!messageText) return;

    appendChatBubbleElement(messageText, true);
    inputField.value = "";

    const indicator = document.getElementById('ai-typing-indicator');
    indicator.classList.remove('hidden');

    setTimeout(() => {
        indicator.classList.add('hidden');
        const aiResponseText = generateContextualMockAIResponseString(messageText);
        appendChatBubbleElement(aiResponseText, false);
        state.points += 5; 
        updateGamificationDisplays();
    }, 850);
}

function sendQuickChatPrompt(promptText) {
    document.getElementById('chat-user-msg').value = promptText;
    const dummyEvent = { preventDefault: () => {} };
    handleChatSubmit(dummyEvent);
}

function appendChatBubbleElement(text, isUser = false) {
    const container = document.getElementById('chat-messages-container');
    const alignmentClass = isUser ? "justify-end ml-auto" : "justify-start";
    const bgClass = isUser ? "bg-eco-600 text-white rounded-br-none" : "bg-white dark:bg-slate-800 rounded-tl-none border border-slate-100 dark:border-slate-800/80";
    const iconClass = isUser ? "fa-user text-eco-200" : "fa-robot text-white";
    const iconWrapperBg = isUser ? "bg-eco-700" : "bg-eco-500";

    const htmlBubbleTemplate = `
        <div class="flex gap-3 max-w-[85%] ${alignmentClass}">
            ${!isUser ? `<div class="w-7 h-7 rounded-lg ${iconWrapperBg} flex items-center justify-center text-[10px] ${iconClass} shrink-0"><i class="fa-solid ${iconClass}"></i></div>` : ''}
            <div class="${bgClass} p-3 rounded-2xl text-xs shadow-sm leading-relaxed">
                ${text}
            </div>
            ${isUser ? `<div class="w-7 h-7 rounded-lg ${iconWrapperBg} flex items-center justify-center text-[10px] ${iconClass} shrink-0"><i class="fa-solid ${iconClass}"></i></div>` : ''}
        </div>
    `;

    container.innerHTML += htmlBubbleTemplate;
    container.scrollTop = container.scrollHeight;
}

function generateContextualMockAIResponseString(msg) {
    const lowerMsg = msg.toLowerCase();
    if (lowerMsg.includes('energy') || lowerMsg.includes('power') || lowerMsg.includes('electricity')) {
        return `<strong>Household Energy Optimization Matrix Guidelines:</strong><br><br>1. Replace legacy lighting with Energy-Star rated LED units to trim power burden by up to 75%.<br>2. Enable eco saving protocols across idle home electronics networks.<br>3. Review your telemetry metric widgets daily to identify abnormal usage spikes.`;
    }
    if (lowerMsg.includes('diet') || lowerMsg.includes('vegan') || lowerMsg.includes('meat') || lowerMsg.includes('food')) {
        return `<strong>Ecological Dietary Lifecycle Variance Analysis:</strong><br><br>High-density cattle beef production fields create intense carbon pressure (~6.5kg CO₂e factor). Transitioning target routine selections towards seasonal agriculture or strict plant-based options decreases daily food-associated emissions by up to 60%.`;
    }
    if (lowerMsg.includes('plastic') || lowerMsg.includes('waste') || lowerMsg.includes('recycle')) {
        return `<strong>Zero-Waste Structural Abatement Gameplan:</strong><br><br>1. Eliminate single-use transport wrappers entirely by keeping long-life woven cloth options handy.<br>2. Clean structural glass or aluminum metal drink cans thoroughly before placing them in municipal sort filters to avoid cross-contamination.<br>3. Leverage the EcoTrack 'AI Object Vision' module feature to determine correct local reuse avenues instantly.`;
    }
    return `Interesting inquiry analysis points noted! Protecting ecosystem stability requires active optimization of our footprints. Based on your current profile goals targeting [${state.profile.goal.toUpperCase()}], maintaining regular daily telemetry logging tracking helps preserve baseline ecosystem equilibrium states safely.`;
}

function clearChatHistory() {
    document.getElementById('chat-messages-container').innerHTML = `
        <div class="flex gap-3 max-w-[85%]">
            <div class="w-7 h-7 rounded-lg bg-eco-500 flex items-center justify-center text-white text-xs shrink-0"><i class="fa-solid fa-robot"></i></div>
            <div class="bg-white dark:bg-slate-800 p-3 rounded-2xl rounded-tl-none text-xs shadow-sm">Chat log buffers cleared cleanly. Let's restart optimization forecasting queries!</div>
        </div>
    `;
    showToastNotification("Chat conversational stream context data cleared successfully.", "info");
}

// COMPUTER VISION IMAGE ANALYSIS MOCK Feature
function previewVisionImage(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(event) {
        document.getElementById('vision-img-element').src = event.target.result;
        document.getElementById('vision-preview-container').classList.remove('hidden');
        document.getElementById('vision-status-box').innerText = "Image file loaded into local analysis memory buffers. Ready to execute neural net classification pipeline scan routines.";
        document.getElementById('vision-results-box').classList.add('hidden');
    };
    reader.readAsDataURL(file);
}

function removeVisionImage() {
    document.getElementById('vision-file-input').value = "";
    document.getElementById('vision-preview-container').classList.add('hidden');
    document.getElementById('vision-status-box').innerHTML = "Awaiting image classification ingestion stream pipeline execution...";
    document.getElementById('vision-results-box').classList.add('hidden');
}

function runMockVisionAnalysis() {
    const fileInput = document.getElementById('vision-file-input');
    if (fileInput.files.length === 0) {
        showToastNotification("Error context constraint: Upload or drag an image asset file before processing analysis.", "error");
        return;
    }

    document.getElementById('vision-status-box').innerHTML = `<i class="fa-solid fa-circle-notch animate-spin text-eco-500 text-lg"></i> Running Tensor Matrix Material Prediction Models...`;
    document.getElementById('vision-results-box').classList.add('hidden');

    setTimeout(() => {
        document.getElementById('vision-status-box').classList.add('hidden');
        const resultsBox = document.getElementById('vision-results-box');
        resultsBox.classList.remove('hidden');

        const mocks = [
            { label: "High-Density Polyethylene (HDPE Plastic Bottle)", conf: "97.2%", tips: "• Class 2 Recyclable. Rinse fluids safely, flatten shape profiles, and compress structures to optimize transport volume metrics space limits. Keep caps screwed down tightly." },
            { label: "Corrugated Cardboard Packaging Box Container", conf: "99.1%", tips: "• Pure Cellulose Fiber Bio-Material. Remove adhesive packing tape straps elements entirely before crushing panels flat. Protect against rain moisture exposure to prevent pulp decay rejection bugs." },
            { label: "Degradable Organic Food Core Material Waste Scraps", conf: "94.6%", tips: "• Do NOT discard into standard landfill trash bins. Route toward enclosed aeration backyard compost chambers to produce rich fertilizer and prevent anaerobic toxic methane gas off-gassing fields." }
        ];

        const pickedSelection = mocks[Math.floor(Math.random() * mocks.length)];
        document.getElementById('vision-detected-label').innerText = pickedSelection.label;
        document.getElementById('vision-confidence-txt').innerText = `${pickedSelection.conf} AI Match`;
        document.getElementById('vision-recommendation-tips').innerHTML = pickedSelection.tips;

        state.points += 30; 
        updateGamificationDisplays();
        showToastNotification("Neural Net Material Classifier analysis cycle parsed successfully (+30 XP)", "success");
    }, 1200);
}

// PROFILE CONFIGURATION SAVING INTERFACE
function saveProfileSettingsEvent(e) {
    e.preventDefault();
    state.profile.name = document.getElementById('profile-name').value.trim() || "Eco Guardian";
    state.profile.ageGroup = document.getElementById('profile-age-group').value;
    state.profile.location = document.getElementById('profile-location').value.trim() || "Global Citizen";
    state.profile.goal = document.getElementById('profile-goal').value;

    saveStateToLocalStorage();
    refreshApplicationInterfaceMetricsUI();
    showToastNotification("User identity settings preferences saved locally.", "success");
}

function clearAllDataWipeReset() {
    if (confirm("CRITICAL WARNING: This completely wipes all historical tracking logs, point totals, levels, and local profile configurations permanently. Proceed?")) {
        localStorage.clear();
        state.profile = { name: "Eco Guardian", ageGroup: "adult-young", location: "Global Citizen", goal: "net-zero", theme: "light" };
        state.logs = [];
        state.streak = 0;
        state.points = 0;
        state.lastLoggedDateStr = "";
        
        applyThemeDefaults();
        refreshApplicationInterfaceMetricsUI();
        showToastNotification("Local storage tracking nodes database cleared cleanly. System reset complete.", "info");
    }
}

// TELEMETRY REPORTS EXPORTS ENGINE (CSV FORMATTER)
function exportToCSV() {
    if (state.logs.length === 0) {
        showToastNotification("Data export warning: No historical transaction logs exist to generate CSV records rows stream maps.", "error");
        return;
    }

    let csvPayloadContent = "Date,Description,Vehicle Distance (km),Electricity Usage (kWh),Water Usage (L),Waste Produced (kg),Diet Profile Weight,Net Carbon Equivalent Emissions (kg CO2e)\n";
    
    state.logs.forEach(l => {
        const escapedDesc = l.desc.replace(/"/g, '""');
        csvPayloadContent += `"${l.date}","${escapedDesc}",${l.transport},${l.electricity},${l.water},${l.waste},"${l.diet}",${l.carbon}\n`;
    });

    const blob = new Blob([csvPayloadContent], { type: 'text/csv;charset=utf-8;' });
    const temporaryLinkUrlElement = document.createElement("a");
    const compiledFilenameStr = `EcoTrack_AI_Sustainability_Report_${getCurrentDateString()}.csv`;
    
    if (navigator.msSaveBlob) { 
        navigator.msSaveBlob(blob, compiledFilenameStr);
    } else {
        temporaryLinkUrlElement.href = URL.createObjectURL(blob);
        temporaryLinkUrlElement.setAttribute("download", compiledFilenameStr);
        temporaryLinkUrlElement.style.visibility = 'hidden';
        document.body.appendChild(temporaryLinkUrlElement);
        temporaryLinkUrlElement.click();
        document.body.removeChild(temporaryLinkUrlElement);
    }
    showToastNotification("CSV Sustainability logs telemetry compiled and download stream initiated.", "success");
}

function triggerPrintReport() {
    window.print();
}

// FLOATING TOAST NOTIFICATION UTILITY PIPELINE
function showToastNotification(text, type = "success") {
    const toastContainer = document.getElementById('toast-container');
    const targetId = "toast-" + Date.now();

    let bgIconColors = "bg-emerald-500 text-white";
    let iconGlyph = "fa-circle-check";
    if (type === "info") {
        bgIconColors = "bg-blue-500 text-white";
        iconGlyph = "fa-circle-info";
    } else if (type === "error") {
        bgIconColors = "bg-rose-500 text-white";
        iconGlyph = "fa-circle-xmark";
    }

    const toastNodeHTMLStr = `
        <div id="${targetId}" class="pointer-events-auto flex items-center gap-3 p-3 bg-white dark:bg-slate-800 text-xs shadow-xl rounded-xl border border-slate-200 dark:border-slate-700 max-w-sm transition-all duration-300 transform translate-x-10 opacity-0">
            <div class="w-6 h-6 rounded-lg ${bgIconColors} flex items-center justify-center shrink-0"><i class="fa-solid ${iconGlyph}"></i></div>
            <div class="font-semibold text-slate-700 dark:text-slate-200">${text}</div>
        </div>
    `;

    toastContainer.insertAdjacentHTML('beforeend', toastNodeHTMLStr);
    
    setTimeout(() => {
        const node = document.getElementById(targetId);
        if (node) node.classList.remove('translate-x-10', 'opacity-0');
    }, 50);

    setTimeout(() => {
        const node = document.getElementById(targetId);
        if (node) {
            node.classList.add('opacity-0', 'scale-90');
            setTimeout(() => { node.remove(); }, 300);
        }
    }, 3500);
}

// CHRONOLOGICAL DATE MANAGEMENT STRUCTURAL ALTERNATIVE HELPERS UTILITY BLOCK
function getCurrentDateString() {
    const date = new Date();
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
}

function getOffsetDateString(daysOffsetCount) {
    const date = new Date();
    date.setDate(date.getDate() - daysOffsetCount);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
}