function todayISO() {
      const d = new Date();
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return year + '-' + month + '-' + day;
    }

    function isFutureDate(dateStr) {
      if (!dateStr) return false;
      return dateStr > todayISO();
    }

    const SAMPLE_RECORDS = [
      {
        id: 1,
        date: "2026-07-24",
        plantation_type: "Coconut Plantation",
        category: "business",
        workers: [
          { name: "Sherwin", job_description: "Weeding", full_days: 0, half_days: 1, daily_wage: 350, payment_period: "daily", paid: false, work_dates: ["2026-07-24"] },
          { name: "Jimmy", job_description: "Hauling", full_days: 0, half_days: 1, daily_wage: 350, payment_period: "daily", paid: false, work_dates: ["2026-07-24"] }
        ],
        total_workers: 2,
        full_days: 0,
        half_days: 2,
        daily_wage: 350,
        labor_cost: 350,
        items: [],
        items_total: 0,
        yield_kg: 0,
        revenue: 0,
        cost_per_kg: 0,
        total_expenditure: 350,
        activity_date: "2026-07-24",
        activity_description: "Weeding and hauling coconuts"
      },
      {
        id: 2,
        date: "2026-07-20",
        plantation_type: "Coconut Plantation",
        category: "business",
        workers: [
          { name: "Sherwin", job_description: "Weeding", full_days: 1, half_days: 0, daily_wage: 350, payment_period: "daily", paid: false, work_dates: ["2026-07-20"] },
          { name: "Jeric", job_description: "Weeding", full_days: 1, half_days: 0, daily_wage: 350, payment_period: "daily", paid: false, work_dates: ["2026-07-20"] },
          { name: "Tatay", job_description: "Weeding", full_days: 0, half_days: 1, daily_wage: 350, payment_period: "daily", paid: false, work_dates: ["2026-07-20"] }
        ],
        total_workers: 3,
        full_days: 2,
        half_days: 1,
        daily_wage: 350,
        labor_cost: 875,
        items: [],
        items_total: 0,
        yield_kg: 0,
        revenue: 0,
        cost_per_kg: 0,
        total_expenditure: 875,
        activity_date: "2026-07-20",
        activity_description: "Weeding coconut plantation"
      }
    ];

    const SAMPLE_PERSONAL_RECORDS = [
      {
        id: 1,
        date: "2026-07-06",
        category: "personal",
        items: [
          { name: "Cigarettes", quantity: 50, unit: "pcs", price_per_unit: 2.5, cost: 125 },
          { name: "Gasoline", quantity: 2, unit: "liter", price_per_unit: 85, cost: 170 },
          { name: "Barbecue", quantity: 3, unit: "kg", price_per_unit: 10, cost: 30 }
        ],
        total_expenditure: 325
      }
    ];

    const SAMPLE_GROSS_SALES = {};

    const SAMPLE_STARTING_CAPITAL = {
      "Coconut Plantation": 5000,
      "Lanzones Plantation": 5000,
      "Durian Plantation": 5000,
      "Maize Production — Right Bank": 5000,
      "Maize Production — Left Bank": 5000,
      "Maize Production — Upper Valley": 5000,
      "String Beans Plantation": 7000,
      "Tomato Plantation": 0,
      "Potato Plantation": 0,
      "Squash Production": 0,
      "Eggplant Farming": 0,
      "Zucchini Plantation": 0,
      "Rambutan Plantation": 3000,
      "Peanut Production": 0,
      "Tuber Farming": 0
    };

    const SAMPLE_CASH_ADVANCES = [];

    // Starting catalog baked into the site so a brand-new visitor's browser has something to
    // show in the Shop before they've ever interacted with the app. Use the "📤 Publish catalog"
    // button in the Products tab to regenerate this array, then paste it here and redeploy.
    const DEFAULT_PRODUCTS = [];

    const DB_NAME = 'PlantationLedgerProDB';
    const DB_VERSION = 3;
    const RECORDS_PER_PAGE = 50;
    const AUTO_SAVE_INTERVAL = 30000;
    const UNDO_TIMEOUT = 30000;

    const PLANTATION_TYPES = [
      "Coconut Plantation",
      "Lanzones Plantation",
      "Durian Plantation",
      "Maize Production — Right Bank",
      "Maize Production — Left Bank",
      "Maize Production — Upper Valley",
      "String Beans Plantation",
      "Tomato Plantation",
      "Potato Plantation",
      "Squash Production",
      "Eggplant Farming",
      "Zucchini Plantation",
      "Rambutan Plantation",
      "Peanut Production",
      "Tuber Farming"
    ];

    const DEFAULT_WAGE = 350.0;
    const STORAGE_KEY = "plantation-records-pro-v3";
    const PERSONAL_STORAGE_KEY = "plantation-personal-pro-v3";
    const SALES_STORAGE_KEY = "plantation-net-sales-pro-v3";
    const DRAFT_KEY = "plantation-draft-pro-v3";
    const CAPITAL_STORAGE_KEY = "plantation-capital-pro-v3";
    const ADVANCE_STORAGE_KEY = "plantation-advances-pro-v3";
    const INVENTORY_STORAGE_KEY = "plantation-inventory-pro-v3";
    const PAYSLIP_STORAGE_KEY = "plantation-payslips-pro-v3";
    const PLANNING_STORAGE_KEY = "plantation-planning-pro-v3";
    const BUDGET_STORAGE_KEY = "plantation-budgets-pro-v3";
    const WEATHER_STORAGE_KEY = "plantation-weather-cache-v3";
    const WEATHER_LOCATION_KEY = "plantation-weather-location-v3";
    const HARVEST_SHARE_STORAGE_KEY = "plantation-harvest-share-pct-v3";

    // Default worker share of Net Sales, per plantation. The owner keeps the remainder.
    // Maize: 30% to workers / 70% to owner. String Beans: 40% to workers / 60% to owner.
    // Every other plantation defaults to 0% (no harvest share) until a percentage is set
    // in the Shares tab — at which point sharing activates automatically for that plantation.
    const DEFAULT_HARVEST_SHARE_PCT = {
      "Coconut Plantation": 0,
      "Lanzones Plantation": 0,
      "Durian Plantation": 0,
      "Maize Production — Right Bank": 0.30,
      "Maize Production — Left Bank": 0.30,
      "Maize Production — Upper Valley": 0.30,
      "String Beans Plantation": 0.40,
      "Tomato Plantation": 0,
      "Potato Plantation": 0,
      "Squash Production": 0,
      "Eggplant Farming": 0,
      "Zucchini Plantation": 0,
      "Rambutan Plantation": 0,
      "Peanut Production": 0,
      "Tuber Farming": 0
    };

    const DEV_PHASE_TYPES = ["Tomato Plantation", "Potato Plantation"];

    const DEFAULT_STARTING_CAPITAL = {
      "Coconut Plantation": 5000,
      "Lanzones Plantation": 5000,
      "Durian Plantation": 5000,
      "Maize Production — Right Bank": 5000,
      "Maize Production — Left Bank": 5000,
      "Maize Production — Upper Valley": 5000,
      "String Beans Plantation": 7000,
      "Tomato Plantation": 0,
      "Potato Plantation": 0,
      "Squash Production": 0,
      "Eggplant Farming": 0,
      "Zucchini Plantation": 0,
      "Rambutan Plantation": 3000,
      "Peanut Production": 0,
      "Tuber Farming": 0
    };

    const UNIT_OPTIONS = [
      { value: "kg", label: "Kilogram (kg)" },
      { value: "pcs", label: "Piece (pcs)" },
      { value: "serving", label: "Serving (srv)" },
      { value: "liter", label: "Liter (L)" },
      { value: "ml", label: "Milliliter (ml)" },
      { value: "bottle", label: "Bottle" },
      { value: "sack", label: "Sack" },
      { value: "gallon", label: "Gallon" }
    ];

    let db = null;
    let dbReady = false;
    let records = [];
    let personalRecords = [];
    let grossSales = {};
    let startingCapital = {};
    let capitalEntries = [];
    let cashAdvances = [];
    let harvestSharePct = {};
    let nextId = 1;
    let nextPersonalId = 1;
    let nextCapitalId = 1;
    let nextAdvanceId = 1;
    let editingId = null;
    let editingPersonalId = null;
    let currentCategory = 'business';
    let currentPage = 1;
    let filteredRecords = [];
    let chartInstances = {};
    let deletedRecord = null;
    let undoTimeout = null;
    let isFormDirty = false;
    let isLoading = false;
    let workerRowSeq = 0;
    let itemRowSeq = 0;
    let pItemRowSeq = 0;
    let activityWorkerRowSeq = 0;
    let toastTimer = null;
    let autoSaveTimer = null;
    let pendingDeleteId = null;
    let pendingDeleteIsPersonal = false;
    let pendingCapitalDeleteId = null;
    let pendingAdvanceDeleteId = null;
    let inventoryItems = [];
    let nextInventoryId = 1;
    let pendingInventoryDeleteId = null;
    let payslips = [];
    let nextPayslipId = 1;
    let payrollPreview = null;
    let planningTasks = [];
    let nextPlanningId = 1;
    let pendingPlanningDeleteId = null;
    let monthlyBudgets = {};
    let weatherLocation = null;
    let weatherCache = null;
    let editingAdvanceId = null;
    let editingActivityId = null;
    let selectedPlantationType = null;
    let plantationPricing = {};
    let plantationSales = [];
    let nextSaleId = 1;
    let editingSaleId = null;
    let pendingSaleDeleteId = null;
    let activityRecords = [];
    let nextActivityId = 1;
    let lastWorkerHistoryEntries = [];
    let lastWorkerHistoryName = '';
    let pendingActivityPhoto = null; // base64 data URL for the journal entry currently being edited
    let pendingActivityVideo = null; // base64 data URL for an uploaded (offline-playable) video
    const MAX_VIDEO_BYTES = 40 * 1024 * 1024; // ~40MB soft cap for on-device video storage

    // ---------- Shop / Products / Orders ----------
    const PRODUCTS_STORAGE_KEY = "plantation-products-v3";
    const ORDERS_STORAGE_KEY = "plantation-orders-v3";
    const OWNER_WHATSAPP = "639757841228"; // 0975 784 1228 in international format, no + or leading 0
    const OWNER_PHONE_DISPLAY = "0975 784 1228";
    const OWNER_EMAIL = "pansensoyglenn150@gmail.com";
    let products = [];
    let nextProductId = 1;
    let editingProductId = null;
    let pendingProductPhoto = null;
    let pendingProductDeleteId = null;
    let cart = {}; // { productId: quantity }
    let orders = [];
    let nextOrderId = 1;
    let pendingOrderDeleteId = null;

    // ---------- Owner access gate ----------
    // Views a visitor can reach without unlocking. Everything else (Dashboard, Records,
    // Workers, Capital, Loans, Payroll, Products, Orders, etc.) requires the owner PIN.
    // This is a soft, client-side barrier for casual visitors — not real account security,
    // since the code that enforces it ships to everyone's browser either way.
    const PUBLIC_VIEWS = ['about', 'shop'];
    const OWNER_PIN_KEY = 'owner-pin-hash-v1';
    const OWNER_UNLOCKED_KEY = 'valley-creeks-owner-unlocked';
    let ownerPinHash = null;
    let ownerUnlocked = false;
    let pendingNavigationTarget = null;

    function isPrivateView(viewName) {
      return !PUBLIC_VIEWS.includes(viewName);
    }

    async function sha256Hex(str) {
      const enc = new TextEncoder().encode(str);
      const buf = await crypto.subtle.digest('SHA-256', enc);
      return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
    }

    async function loadOwnerPin() {
      try {
        const res = await window.storage.get(OWNER_PIN_KEY, false);
        if (res && res.value) ownerPinHash = res.value;
      } catch (e) {
        ownerPinHash = null;
      }
      ownerUnlocked = localStorage.getItem(OWNER_UNLOCKED_KEY) === '1';
      applyLockUI();
    }

    // ---------- One-time migration: old "Maize Production" → "Maize Production — Right Bank" ----------
    // Maize was split into three sections. Any data still tagged with the old plain name
    // (from before the split) is moved onto Right Bank automatically, once, on next load.
    const MAIZE_MIGRATION_KEY = 'migrated-maize-sections-v1';
    const LEGACY_MAIZE_NAME = 'Maize Production';
    const NEW_MAIZE_RIGHT_BANK = 'Maize Production — Right Bank';

    async function migrateLegacyMaizeData() {
      try {
        const already = await window.storage.get(MAIZE_MIGRATION_KEY, false);
        if (already && already.value === '1') return;
      } catch (e) { /* proceed — safer to check than to skip silently */ }

      let touchedRecords = false;
      records.forEach(r => {
        if (r.plantation_type === LEGACY_MAIZE_NAME) { r.plantation_type = NEW_MAIZE_RIGHT_BANK; touchedRecords = true; }
      });
      if (touchedRecords) await saveToStorage();

      let touchedCapital = false;
      if (startingCapital[LEGACY_MAIZE_NAME] !== undefined) {
        startingCapital[NEW_MAIZE_RIGHT_BANK] = startingCapital[LEGACY_MAIZE_NAME];
        delete startingCapital[LEGACY_MAIZE_NAME];
        touchedCapital = true;
      }
      capitalEntries.forEach(c => {
        if (c.plantation_type === LEGACY_MAIZE_NAME) { c.plantation_type = NEW_MAIZE_RIGHT_BANK; touchedCapital = true; }
      });
      if (touchedCapital) await saveCapitalToStorage();

      let touchedAdvances = false;
      cashAdvances.forEach(a => {
        if (a.plantation_type === LEGACY_MAIZE_NAME) { a.plantation_type = NEW_MAIZE_RIGHT_BANK; touchedAdvances = true; }
      });
      if (touchedAdvances) await saveAdvancesToStorage();

      let touchedShare = false;
      if (harvestSharePct[LEGACY_MAIZE_NAME] !== undefined) {
        harvestSharePct[NEW_MAIZE_RIGHT_BANK] = harvestSharePct[LEGACY_MAIZE_NAME];
        delete harvestSharePct[LEGACY_MAIZE_NAME];
        touchedShare = true;
      }
      if (touchedShare) await saveHarvestSharePctsToStorage();

      let touchedLoans = false;
      lenderLoans.forEach(l => {
        if (l.plantation_type === LEGACY_MAIZE_NAME) { l.plantation_type = NEW_MAIZE_RIGHT_BANK; touchedLoans = true; }
      });
      if (touchedLoans) await saveLoansToStorage();

      let touchedPricing = false;
      if (plantationPricing[LEGACY_MAIZE_NAME] !== undefined) {
        plantationPricing[NEW_MAIZE_RIGHT_BANK] = plantationPricing[LEGACY_MAIZE_NAME];
        delete plantationPricing[LEGACY_MAIZE_NAME];
        touchedPricing = true;
      }
      if (touchedPricing) await savePlantationPricingToStorage();

      let touchedSales = false;
      plantationSales.forEach(s => {
        if (s.plantation_type === LEGACY_MAIZE_NAME) { s.plantation_type = NEW_MAIZE_RIGHT_BANK; touchedSales = true; }
      });
      if (touchedSales) await savePlantationSalesToStorage();

      let touchedBudget = false;
      if (monthlyBudgets[LEGACY_MAIZE_NAME] !== undefined) {
        monthlyBudgets[NEW_MAIZE_RIGHT_BANK] = monthlyBudgets[LEGACY_MAIZE_NAME];
        delete monthlyBudgets[LEGACY_MAIZE_NAME];
        touchedBudget = true;
      }
      if (touchedBudget) await saveBudgetsToStorage();

      let touchedGross = false;
      if (grossSales[LEGACY_MAIZE_NAME] !== undefined) {
        grossSales[NEW_MAIZE_RIGHT_BANK] = (grossSales[NEW_MAIZE_RIGHT_BANK] || 0) + grossSales[LEGACY_MAIZE_NAME];
        delete grossSales[LEGACY_MAIZE_NAME];
        touchedGross = true;
      }
      if (touchedGross) await saveSalesToStorage();

      let touchedPlanning = false;
      planningTasks.forEach(t => {
        if (t.plantation_type === LEGACY_MAIZE_NAME) { t.plantation_type = NEW_MAIZE_RIGHT_BANK; touchedPlanning = true; }
      });
      if (touchedPlanning) await savePlanningToStorage();

      let touchedProducts = false;
      products.forEach(p => {
        if (p.plantation_type === LEGACY_MAIZE_NAME) { p.plantation_type = NEW_MAIZE_RIGHT_BANK; touchedProducts = true; }
      });
      if (touchedProducts) await saveProductsToStorage();

      let touchedActivities = false;
      activityRecords.forEach(a => {
        if (a.plantation_type === LEGACY_MAIZE_NAME) { a.plantation_type = NEW_MAIZE_RIGHT_BANK; touchedActivities = true; }
      });
      if (touchedActivities) {
        await window.storage.set('activity-records', JSON.stringify({ records: activityRecords, nextId: nextActivityId }), false);
      }

      const anyTouched = touchedRecords || touchedCapital || touchedAdvances || touchedShare || touchedLoans ||
        touchedPricing || touchedSales || touchedBudget || touchedGross || touchedPlanning || touchedProducts || touchedActivities;

      try {
        await window.storage.set(MAIZE_MIGRATION_KEY, '1', false);
      } catch (e) { /* best-effort marker — worst case this re-checks next load, which is harmless */ }

      if (anyTouched) {
        showToast('✅ Old "Maize Production" data moved to "Maize Production — Right Bank"', 'success', 5000);
      }
    }

    function openOwnerGate() {
      const title = document.getElementById('owner-gate-title');
      const text = document.getElementById('owner-gate-text');
      const confirmField = document.getElementById('owner-gate-confirm-field');
      const pinInput = document.getElementById('owner-gate-pin');
      const confirmInput = document.getElementById('owner-gate-pin-confirm');
      document.getElementById('owner-gate-error').style.display = 'none';
      pinInput.value = '';
      confirmInput.value = '';
      if (!ownerPinHash) {
        title.textContent = '🔐 Set an Owner PIN';
        text.textContent = 'No PIN is set yet on this device. Choose one now to protect your business data — you\'ll use it to log in here going forward.';
        confirmField.style.display = '';
      } else {
        title.textContent = '🔒 Owner Login';
        text.textContent = 'Enter your PIN to access the farm management dashboard.';
        confirmField.style.display = 'none';
      }
      document.getElementById('owner-gate-modal').classList.add('open');
      pinInput.focus();
    }

    function closeOwnerGate() {
      document.getElementById('owner-gate-modal').classList.remove('open');
      pendingNavigationTarget = null;
    }

    async function submitOwnerGate() {
      const pin = document.getElementById('owner-gate-pin').value;
      if (!pin || pin.length < 4) {
        showToast('⚠️ PIN must be at least 4 characters', 'error');
        return;
      }
      if (!ownerPinHash) {
        const confirmPin = document.getElementById('owner-gate-pin-confirm').value;
        if (pin !== confirmPin) {
          document.getElementById('owner-gate-error').textContent = 'PINs don\'t match. Try again.';
          document.getElementById('owner-gate-error').style.display = '';
          return;
        }
        ownerPinHash = await sha256Hex(pin);
        try {
          await window.storage.set(OWNER_PIN_KEY, ownerPinHash, false);
        } catch (e) {
          showToast('⚠️ Failed to save PIN', 'error');
          return;
        }
        showToast('✅ Owner PIN set — keep it somewhere safe', 'success');
      } else {
        const hash = await sha256Hex(pin);
        if (hash !== ownerPinHash) {
          document.getElementById('owner-gate-error').textContent = 'That PIN doesn\'t match. Try again.';
          document.getElementById('owner-gate-error').style.display = '';
          return;
        }
      }
      ownerUnlocked = true;
      localStorage.setItem(OWNER_UNLOCKED_KEY, '1');
      applyLockUI();
      document.getElementById('owner-gate-modal').classList.remove('open');
      const target = pendingNavigationTarget || 'dashboard';
      pendingNavigationTarget = null;
      navigateTo(target);
      refreshAll();
    }

    function lockApp() {
      ownerUnlocked = false;
      localStorage.removeItem(OWNER_UNLOCKED_KEY);
      applyLockUI();
      navigateTo('shop');
      showToast('🔒 Locked — private tabs are hidden again', 'success');
    }

    function handleOwnerAccessClick() {
      if (ownerUnlocked) {
        lockApp();
      } else {
        openOwnerGate();
      }
    }

    function applyLockUI() {
      document.body.classList.toggle('owner-locked', !ownerUnlocked);
      const link = document.getElementById('owner-access-link');
      const linkMobile = document.getElementById('owner-access-link-mobile');
      const label = ownerUnlocked ? '🔓 Lock app' : '🔒 Owner Login';
      if (link) link.textContent = label;
      if (linkMobile) linkMobile.textContent = label;
      const searchInput = document.getElementById('global-search-input');
      if (searchInput) {
        searchInput.disabled = !ownerUnlocked;
        searchInput.placeholder = ownerUnlocked ? '🔍 Search everything…' : '🔒 Owner login required to search';
      }
      const badge = document.getElementById('record-count-badge');
      if (badge && !ownerUnlocked) badge.textContent = 'Valley and Creeks Farm';
      const statsCard = document.getElementById('vertical-ag-stats');
      if (statsCard && !ownerUnlocked) {
        statsCard.innerHTML = `<div class="empty-state" style="grid-column:1/-1;padding:20px;"><span class="glyph">🔒</span>Farm statistics are only visible to the owner. <a href="#" onclick="event.preventDefault();openOwnerGate();" style="color:var(--blue-bright);">Log in</a> to view them.</div>`;
      }
      const footer = document.querySelector('.bottom-indicators');
      if (footer) footer.style.display = ownerUnlocked ? '' : 'none';
    }


    function peso(n) {
      return "₱" + Number(n || 0).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    function round2(n) {
      return Math.round(n * 100) / 100;
    }

    function escapeHtml(text) {
      if (!text) return '';
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }

    function laborCostOf(w) {
      return (w.full_days + w.half_days * 0.5) * w.daily_wage;
    }

    function laborDaysOf(w) {
      return w.full_days + w.half_days * 0.5;
    }

    function expenditureFor(type) {
      return records.filter(r => r.plantation_type === type).reduce((s, r) => s + r.total_expenditure, 0);
    }

    // Sum of every "Sell Produce" customer sale (quantity × current price) logged for a plantation.
    // This is the most concrete, literal "quantity + total cost" figure the app has for a plantation.
    function plantationSalesTotalFor(type) {
      return round2(plantationSales.filter(s => s.plantation_type === type).reduce((s, x) => s + x.total, 0));
    }

    // The Gross Sales figure actually used everywhere in the app (Reports, Shares, Dashboard, PDF/CSV
    // exports, alerts). Priority order, so encoding a quantity anywhere automatically flows through
    // without re-entering it manually:
    //   1. Sum of recorded Sell Produce sales for the plantation (most concrete — real customer sales)
    //   2. The Encode Yield & Pricing override (Total Yield × Current Price per kg)
    //   3. The manual fallback figure typed into the Reports tab (kept for plantations with no sales yet)
    function computeGrossSalesFor(type) {
      const salesTotal = plantationSalesTotalFor(type);
      if (salesTotal > 0) return salesTotal;
      const override = plantationPricing[type];
      if (override && override.totalYield > 0) {
        return round2(override.totalYield * (override.currentPricePerKg || 0));
      }
      return grossSales[type] || 0;
    }

    function grossSalesSourceLabelFor(type) {
      if (plantationSalesTotalFor(type) > 0) return 'from Sell Produce sales';
      const override = plantationPricing[type];
      if (override && override.totalYield > 0) return 'from Encoded Yield & Pricing';
      if ((grossSales[type] || 0) > 0) return 'manual fallback';
      return 'not set yet';
    }

    function netSalesFor(type) {
      return round2(computeGrossSalesFor(type) - expenditureFor(type));
    }

    function unitOptionsHtml(selected) {
      return UNIT_OPTIONS.map(u =>
        `<option value="${u.value}" ${selected === u.value ? 'selected' : ''}>${u.label}</option>`
      ).join('');
    }
    function openDB() {
      return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onupgradeneeded = (ev) => {
          const db = ev.target.result;
          if (!db.objectStoreNames.contains('records')) {
            db.createObjectStore('records', { keyPath: 'key' });
          }
        };
        request.onsuccess = (ev) => {
          db = ev.target.result;
          dbReady = true;
          resolve(db);
        };
        request.onerror = (ev) => {
          console.error('IndexedDB error:', ev.target.error);
          reject(ev.target.error);
        };
      });
    }

    window.storage = {
      get: async (key, parse = true) => {
        if (!dbReady) await openDB();
        return new Promise((resolve, reject) => {
          const tx = db.transaction('records', 'readonly');
          const store = tx.objectStore('records');
          const req = store.get(key);
          req.onsuccess = () => {
            const result = req.result;
            if (result) {
              resolve({ value: result.value });
            } else {
              resolve(null);
            }
          };
          req.onerror = (ev) => reject(ev.target.error);
        });
      },
      set: async (key, value, parse = true) => {
        if (!dbReady) await openDB();
        return new Promise((resolve, reject) => {
          const tx = db.transaction('records', 'readwrite');
          const store = tx.objectStore('records');
          const req = store.put({ key, value });
          req.onsuccess = () => resolve();
          req.onerror = (ev) => reject(ev.target.error);
        });
      }
    };

    async function seedDataIfEmpty() {
      try {
        const res = await window.storage.get(STORAGE_KEY, false);
        if (!res || !res.value) {
          console.log('🌱 Seeding business records...');
          records = SAMPLE_RECORDS;
          nextId = Math.max(...records.map(r => r.id)) + 1;
          await saveToStorage();
        }

        const res2 = await window.storage.get(PERSONAL_STORAGE_KEY, false);
        if (!res2 || !res2.value) {
          console.log('🌱 Seeding personal records...');
          personalRecords = SAMPLE_PERSONAL_RECORDS;
          nextPersonalId = Math.max(...personalRecords.map(r => r.id)) + 1;
          await savePersonalToStorage();
        }

        const res3 = await window.storage.get(SALES_STORAGE_KEY, false);
        if (!res3 || !res3.value) {
          console.log('🌱 Seeding gross sales...');
          grossSales = SAMPLE_GROSS_SALES;
          await saveSalesToStorage();
        }

        const res4 = await window.storage.get(CAPITAL_STORAGE_KEY, false);
        if (!res4 || !res4.value) {
          console.log('🌱 Seeding starting capital...');
          startingCapital = SAMPLE_STARTING_CAPITAL;
          await saveCapitalToStorage();
        }

        const res5 = await window.storage.get(ADVANCE_STORAGE_KEY, false);
        if (!res5 || !res5.value) {
          console.log('🌱 Seeding cash advances...');
          cashAdvances = SAMPLE_CASH_ADVANCES;
          nextAdvanceId = cashAdvances.length ? Math.max(...cashAdvances.map(a => a.id)) + 1 : 1;
          await saveAdvancesToStorage();
        }
      } catch (e) {
        console.warn('Seed data check failed:', e);
      }
    }

    async function loadRecords() {
      setLoading(true);
      try {
        const res = await window.storage.get(STORAGE_KEY, false);
        if (res && res.value) {
          const parsed = JSON.parse(res.value);
          records = parsed.records || [];
          nextId = parsed.nextId || (records.length ? Math.max(...records.map(r => r.id)) + 1 : 1);
        }
      } catch (e) {
        console.warn('Failed to load records:', e);
        records = [];
        nextId = 1;
      }

      try {
        const res2 = await window.storage.get(PERSONAL_STORAGE_KEY, false);
        if (res2 && res2.value) {
          const parsed2 = JSON.parse(res2.value);
          personalRecords = parsed2.records || [];
          nextPersonalId = parsed2.nextId || (personalRecords.length ? Math.max(...personalRecords.map(r => r.id)) + 1 : 1);
        }
      } catch (e) {
        console.warn('Failed to load personal records:', e);
        personalRecords = [];
        nextPersonalId = 1;
      }

      try {
        const res3 = await window.storage.get(SALES_STORAGE_KEY, false);
        if (res3 && res3.value) {
          grossSales = JSON.parse(res3.value) || {};
        }
      } catch (e) {
        console.warn('Failed to load gross sales:', e);
        grossSales = {};
      }

      setLoading(false);
      refreshAll();
    }

    async function loadCapitalAndAdvances() {
      try {
        const res = await window.storage.get(CAPITAL_STORAGE_KEY, false);
        if (res && res.value) {
          const parsed = JSON.parse(res.value);
          startingCapital = parsed.startingCapital || {};
          capitalEntries = parsed.capitalEntries || [];
          nextCapitalId = parsed.nextCapitalId || (capitalEntries.length ? Math.max(...capitalEntries.map(c => c.id)) + 1 : 1);
        }
      } catch (e) {
        console.warn('Failed to load capital data:', e);
      }
      let needsSave = false;
      PLANTATION_TYPES.forEach(type => {
        if (startingCapital[type] === undefined) {
          startingCapital[type] = DEFAULT_STARTING_CAPITAL[type] ?? 0;
          needsSave = true;
        }
      });
      if (needsSave) await saveCapitalToStorage();

      try {
        const res2 = await window.storage.get(ADVANCE_STORAGE_KEY, false);
        if (res2 && res2.value) {
          const parsed2 = JSON.parse(res2.value);
          cashAdvances = parsed2.advances || [];
          nextAdvanceId = parsed2.nextId || (cashAdvances.length ? Math.max(...cashAdvances.map(a => a.id)) + 1 : 1);
        }
      } catch (e) {
        console.warn('Failed to load cash advances:', e);
        cashAdvances = [];
        nextAdvanceId = 1;
      }
    }

    async function loadHarvestSharePcts() {
      try {
        const res = await window.storage.get(HARVEST_SHARE_STORAGE_KEY, false);
        if (res && res.value) harvestSharePct = JSON.parse(res.value) || {};
      } catch (e) {
        console.warn('Failed to load harvest share percentages:', e);
        harvestSharePct = {};
      }
      let needsSave = false;
      PLANTATION_TYPES.forEach(type => {
        if (harvestSharePct[type] === undefined) {
          harvestSharePct[type] = DEFAULT_HARVEST_SHARE_PCT[type] ?? 0;
          needsSave = true;
        }
      });
      if (needsSave) await saveHarvestSharePctsToStorage();
    }

    async function saveHarvestSharePctsToStorage() {
      try {
        await window.storage.set(HARVEST_SHARE_STORAGE_KEY, JSON.stringify(harvestSharePct), false);
        return true;
      } catch (e) {
        console.error('Save harvest share pct error:', e);
        showToast('⚠️ Failed to save share percentages.', 'error');
        return false;
      }
    }

    async function saveToStorage() {
      try {
        await window.storage.set(STORAGE_KEY, JSON.stringify({ records, nextId }), false);
        return true;
      } catch (e) {
        console.error('Save error:', e);
        showToast('⚠️ Failed to save data. Please check your browser settings.', 'error');
        return false;
      }
    }

    async function savePersonalToStorage() {
      try {
        await window.storage.set(PERSONAL_STORAGE_KEY, JSON.stringify({ records: personalRecords, nextId: nextPersonalId }),
          false);
        return true;
      } catch (e) {
        console.error('Save personal error:', e);
        showToast('⚠️ Failed to save personal data.', 'error');
        return false;
      }
    }

    async function saveSalesToStorage() {
      try {
        await window.storage.set(SALES_STORAGE_KEY, JSON.stringify(grossSales), false);
        return true;
      } catch (e) {
        console.error('Save sales error:', e);
        showToast('⚠️ Failed to save Gross Sales.', 'error');
        return false;
      }
    }

    async function saveCapitalToStorage() {
      try {
        await window.storage.set(CAPITAL_STORAGE_KEY, JSON.stringify({ startingCapital, capitalEntries, nextCapitalId }),
          false);
        return true;
      } catch (e) {
        console.error('Save capital error:', e);
        showToast('⚠️ Failed to save capital data.', 'error');
        return false;
      }
    }

    async function saveAdvancesToStorage() {
      try {
        await window.storage.set(ADVANCE_STORAGE_KEY, JSON.stringify({ advances: cashAdvances, nextId: nextAdvanceId }),
          false);
        return true;
      } catch (e) {
        console.error('Save advances error:', e);
        showToast('⚠️ Failed to save cash advance data.', 'error');
        return false;
      }
    }

    async function loadExtras() {
      try {
        const res = await window.storage.get(INVENTORY_STORAGE_KEY, false);
        if (res && res.value) {
          const parsed = JSON.parse(res.value);
          inventoryItems = parsed.items || [];
          nextInventoryId = parsed.nextId || (inventoryItems.length ? Math.max(...inventoryItems.map(i => i.id)) + 1 : 1);
        }
      } catch (e) { console.warn('Failed to load inventory:', e); }

      try {
        const res2 = await window.storage.get(PAYSLIP_STORAGE_KEY, false);
        if (res2 && res2.value) {
          const parsed2 = JSON.parse(res2.value);
          payslips = parsed2.payslips || [];
          nextPayslipId = parsed2.nextId || (payslips.length ? Math.max(...payslips.map(p => p.id)) + 1 : 1);
        }
      } catch (e) { console.warn('Failed to load payslips:', e); }

      try {
        const res3 = await window.storage.get(PLANNING_STORAGE_KEY, false);
        if (res3 && res3.value) {
          const parsed3 = JSON.parse(res3.value);
          planningTasks = parsed3.tasks || [];
          nextPlanningId = parsed3.nextId || (planningTasks.length ? Math.max(...planningTasks.map(t => t.id)) + 1 : 1);
        }
      } catch (e) { console.warn('Failed to load planning tasks:', e); }

      try {
        const res4 = await window.storage.get(BUDGET_STORAGE_KEY, false);
        if (res4 && res4.value) {
          monthlyBudgets = JSON.parse(res4.value) || {};
        }
      } catch (e) { console.warn('Failed to load budgets:', e); }
    }

    async function saveInventoryToStorage() {
      try {
        await window.storage.set(INVENTORY_STORAGE_KEY, JSON.stringify({ items: inventoryItems, nextId: nextInventoryId }), false);
        return true;
      } catch (e) {
        console.error('Save inventory error:', e);
        showToast('⚠️ Failed to save inventory data.', 'error');
        return false;
      }
    }

    async function savePayslipsToStorage() {
      try {
        await window.storage.set(PAYSLIP_STORAGE_KEY, JSON.stringify({ payslips, nextId: nextPayslipId }), false);
        return true;
      } catch (e) {
        console.error('Save payslips error:', e);
        showToast('⚠️ Failed to save payslip data.', 'error');
        return false;
      }
    }

    async function savePlanningToStorage() {
      try {
        await window.storage.set(PLANNING_STORAGE_KEY, JSON.stringify({ tasks: planningTasks, nextId: nextPlanningId }), false);
        return true;
      } catch (e) {
        console.error('Save planning error:', e);
        showToast('⚠️ Failed to save planning tasks.', 'error');
        return false;
      }
    }

    async function saveBudgetsToStorage() {
      try {
        await window.storage.set(BUDGET_STORAGE_KEY, JSON.stringify(monthlyBudgets), false);
        return true;
      } catch (e) {
        console.error('Save budgets error:', e);
        showToast('⚠️ Failed to save budgets.', 'error');
        return false;
      }
    }

    function setLoading(loading) {
      isLoading = loading;
      const overlay = document.getElementById('loading-overlay');
      if (loading) {
        overlay.classList.add('open');
      } else {
        overlay.classList.remove('open');
      }
    }

    function showToast(msg, type = 'info', duration = 3000) {
      const t = document.getElementById('toast');
      t.innerHTML = msg;
      t.className = 'toast';
      if (type === 'error') t.classList.add('error');
      if (type === 'success') t.classList.add('success');
      if (type === 'undo') t.classList.add('undo');
      t.classList.add('show');
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => t.classList.remove('show'), duration);
    }

    function showUndoToast(record, type = 'business') {
      const msg =
        `🗑️ ${type === 'business' ? 'Record' : 'Personal expense'} #${record.id} deleted. `;
      const undoBtn = `<button onclick="undoDelete()">↩ Undo</button>`;
      showToast(msg + undoBtn, 'undo', UNDO_TIMEOUT);
    }

    function markDirty() {
      isFormDirty = true;
      const dot = document.getElementById('auto-save-dot');
      dot.className = 'dot saving';
      document.getElementById('auto-save-text').textContent = 'Unsaved changes';
    }

    function updateAutoSaveIndicator() {
      const dot = document.getElementById('auto-save-dot');
      const text = document.getElementById('auto-save-text');
      if (isFormDirty) {
        dot.className = 'dot saving';
        text.textContent = 'Unsaved changes';
      } else {
        dot.className = 'dot';
        text.textContent = 'Auto-save';
      }
    }

    function populateTypeDropdowns() {
      const fType = document.getElementById('f-type');
      fType.innerHTML = PLANTATION_TYPES.map(t => `<option>${t}</option>`).join('');
      const sType = document.getElementById('s-type');
      sType.innerHTML = `<option value="">All plantation types</option>` +
        PLANTATION_TYPES.map(t => `<option>${t}</option>`).join('');
      const capType = document.getElementById('cap-type');
      if (capType) capType.innerHTML = PLANTATION_TYPES.map(t => `<option>${t}</option>`).join('');
      const advType = document.getElementById('adv-type');
      if (advType) advType.innerHTML = `<option value="">— none —</option>` + PLANTATION_TYPES.map(t => `<option>${t}</option>`).join('');
      const invUnit = document.getElementById('inv-unit');
      if (invUnit) invUnit.innerHTML = unitOptionsHtml();
      const prType = document.getElementById('pr-type');
      if (prType) prType.innerHTML = `<option value="">All plantations</option>` + PLANTATION_TYPES.map(t => `<option>${t}</option>`).join('');
      const planType = document.getElementById('plan-type');
      if (planType) planType.innerHTML = PLANTATION_TYPES.map(t => `<option>${t}</option>`).join('');
      const activityPlantation = document.getElementById('activity-plantation');
      if (activityPlantation) activityPlantation.innerHTML = `<option value="">— general / not specific —</option>` + PLANTATION_TYPES.map(t => `<option>${t}</option>`).join('');
      const prodPlantation = document.getElementById('prod-plantation');
      if (prodPlantation) prodPlantation.innerHTML = `<option value="">— none —</option>` + PLANTATION_TYPES.map(t => `<option>${t}</option>`).join('');
      const prodUnit = document.getElementById('prod-unit');
      if (prodUnit) prodUnit.innerHTML = unitOptionsHtml();
    }
    function enhancePlantationSelect(id) {
      const select = document.getElementById(id);
      if (!select || select.dataset.customized === '1') return;
      select.dataset.customized = '1';

      const wrap = document.createElement('div');
      wrap.className = 'custom-select-wrap';
      select.parentNode.insertBefore(wrap, select);
      wrap.appendChild(select);

      select.style.position = 'absolute';
      select.style.opacity = '0';
      select.style.pointerEvents = 'none';
      select.style.height = '1px';
      select.style.width = '1px';
      select.style.overflow = 'hidden';
      select.tabIndex = -1;

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'custom-select-btn';
      btn.setAttribute('aria-haspopup', 'listbox');
      wrap.appendChild(btn);

      const menu = document.createElement('div');
      menu.className = 'custom-select-menu';
      menu.setAttribute('role', 'listbox');
      wrap.appendChild(menu);

      function refreshLabel() {
        btn.textContent = select.options[select.selectedIndex] ? select.options[select.selectedIndex].text : '';
      }

      function buildMenu() {
        menu.innerHTML = '';
        [...select.options].forEach((opt, idx) => {
          const item = document.createElement('div');
          item.className = 'custom-select-option' + (idx === select.selectedIndex ? ' selected' : '');
          item.setAttribute('role', 'option');
          item.textContent = opt.text;
          item.onclick = () => {
            select.selectedIndex = idx;
            refreshLabel();
            menu.classList.remove('open');
            btn.classList.remove('open');
            select.dispatchEvent(new Event('change', { bubbles: true }));
          };
          menu.appendChild(item);
        });
      }

      btn.onclick = (e) => {
        e.stopPropagation();
        const willOpen = !menu.classList.contains('open');
        document.querySelectorAll('.custom-select-menu.open').forEach(m => m.classList.remove('open'));
        document.querySelectorAll('.custom-select-btn.open').forEach(b => b.classList.remove('open'));
        if (willOpen) {
          buildMenu();
          menu.classList.add('open');
          btn.classList.add('open');
        }
      };

      select._refreshCustomLabel = refreshLabel;
      refreshLabel();
    }

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.custom-select-wrap')) {
        document.querySelectorAll('.custom-select-menu.open').forEach(m => m.classList.remove('open'));
        document.querySelectorAll('.custom-select-btn.open').forEach(b => b.classList.remove('open'));
      }
    });

    function plantationEmoji(type) {
      const map = {
        "Coconut Plantation": "🥥",
        "Lanzones Plantation": "🫐",
        "Durian Plantation": "🌰",
        "Maize Production — Right Bank": "🌽",
        "Maize Production — Left Bank": "🌽",
        "Maize Production — Upper Valley": "🌽",
        "String Beans Plantation": "🫛",
        "Tomato Plantation": "🍅",
        "Potato Plantation": "🥔",
        "Squash Production": "🎃",
        "Eggplant Farming": "🍆",
        "Zucchini Plantation": "🥒",
        "Rambutan Plantation": "🍒",
        "Peanut Production": "🥜",
        "Tuber Farming": "🍠"
      };
      return map[type] || "🌴";
    }

    function populatePlantationSubmenu() {
      const out = document.getElementById('plantation-submenu');
      const sidebarOut = document.getElementById('sidebar-plantation-submenu');
      const rawItemsHtml = PLANTATION_TYPES.map(type =>
        `<a class="submenu-item" data-plantation="${escapeHtml(type)}">${plantationEmoji(type)} ${type}</a>`
      ).join('');
      if (out) out.innerHTML = rawItemsHtml;
      if (sidebarOut) {
        sidebarOut.innerHTML = PLANTATION_TYPES.map(type =>
          `<a class="sidebar-link submenu-item" data-plantation="${escapeHtml(type)}">${plantationEmoji(type)} ${type}</a>`
        ).join('');
      }
      document.querySelectorAll('#plantation-submenu a.submenu-item, #sidebar-plantation-submenu a.submenu-item').forEach(link => {
        link.addEventListener('click', function(e) {
          e.preventDefault();
          const type = this.getAttribute('data-plantation');
          showPlantationDetail(type);
          document.getElementById('hamburgerDropdown').classList.remove('open');
          document.getElementById('hamburgerBtn').setAttribute('aria-expanded', 'false');
          document.querySelectorAll('.hamburger-dropdown a, .sidebar-link').forEach(a => a.classList.remove('active'));
          document.querySelectorAll(`[data-plantation="${type.replace(/"/g, '\\"')}"]`).forEach(a => a.classList.add('active'));
        });
      });
    }

    // Keeps the sidebar and the mobile hamburger menu highlighting the current section in sync.
    function syncNavActiveStates(viewName) {
      document.querySelectorAll('.hamburger-dropdown a[data-view], .sidebar-link[data-view]').forEach(el => {
        el.classList.toggle('active', el.getAttribute('data-view') === viewName);
      });
    }

    function workerRowTemplate(id, w = {}) {
      const paymentPeriod = w.payment_period || "daily";
      const isPaid = !!w.paid;
      return `
      <div class="dyn-row worker-row" data-row-id="${id}" role="listitem">
        <div><label for="w-name-${id}">Name</label><input type="text" id="w-name-${id}" class="w-name" value="${escapeHtml(w.name || '')}" placeholder="Worker name" required onchange="markDirty()"></div>
        <div><label for="w-job-${id}">Job</label><input type="text" id="w-job-${id}" class="w-job" value="${escapeHtml(w.job_description || '')}" placeholder="e.g. Harvesting" onchange="markDirty()"></div>
        <div><label for="w-full-${id}">Days</label><input type="number" id="w-full-${id}" class="w-full" value="${w.full_days ?? 0}" min="0" step="0.5" oninput="updateTotals();markDirty()"></div>
        <div><label for="w-period-${id}">Payment</label>
          <select id="w-period-${id}" class="w-period" onchange="updateTotals();markDirty()">
            <option value="daily" ${paymentPeriod === 'daily' ? 'selected' : ''}>Daily</option>
            <option value="weekly" ${paymentPeriod === 'weekly' ? 'selected' : ''}>Weekly</option>
            <option value="monthly" ${paymentPeriod === 'monthly' ? 'selected' : ''}>Monthly</option>
          </select>
        </div>
        <div><label for="w-wage-${id}">Wage (₱)</label><input type="number" id="w-wage-${id}" class="w-wage" value="${w.daily_wage ?? document.getElementById('f-wage').value}" min="0" step="0.01" oninput="updateTotals();markDirty()"></div>
        <div><label for="w-paid-${id}">Paid?</label><button type="button" id="w-paid-${id}" class="paid-toggle-btn w-paid ${isPaid ? 'is-paid' : ''}" data-paid="${isPaid ? '1' : '0'}" onclick="toggleWorkerRowPaid(this)">${isPaid ? '✓ Paid' : 'Unpaid'}</button></div>
        <button class="remove-btn" onclick="removeRow(this)" title="Remove worker" aria-label="Remove worker">✕</button>
      </div>`;
    }

    function toggleWorkerRowPaid(btn) {
      const paid = btn.dataset.paid === '1';
      btn.dataset.paid = paid ? '0' : '1';
      btn.classList.toggle('is-paid', !paid);
      btn.textContent = !paid ? '✓ Paid' : 'Unpaid';
      markDirty();
    }

    function itemRowTemplate(id, it = {}) {
      return `
      <div class="dyn-row item-row" data-row-id="${id}" role="listitem">
        <div><label for="i-name-${id}">Item</label><input type="text" id="i-name-${id}" class="i-name" value="${escapeHtml(it.name || '')}" placeholder="e.g. Fertilizer" required onchange="markDirty()"></div>
        <div><label for="i-qty-${id}">Qty</label><input type="number" id="i-qty-${id}" class="i-qty" value="${it.quantity ?? 0}" min="0" step="0.01" oninput="updateItemCost(this);markDirty()"></div>
        <div><label for="i-unit-${id}">Unit</label>
          <select id="i-unit-${id}" class="i-unit" onchange="updateItemCost(this);markDirty()">
            ${unitOptionsHtml(it.unit)}
          </select>
        </div>
        <div><label for="i-price-${id}">Price per unit (₱)</label><input type="number" id="i-price-${id}" class="i-price" value="${it.price_per_unit ?? 0}" min="0" step="0.01" oninput="updateItemCost(this);markDirty()"></div>
        <div><label for="i-cost-${id}">Total cost (₱)</label><input type="number" id="i-cost-${id}" class="i-cost" value="${it.cost ?? 0}" min="0" step="0.01" readonly style="background:var(--void);cursor:default;"></div>
        <button class="remove-btn" onclick="removeRow(this)" title="Remove item" aria-label="Remove item">✕</button>
      </div>`;
    }

    function personalItemRowTemplate(id, it = {}) {
      return `
      <div class="dyn-row item-row" data-row-id="${id}" role="listitem">
        <div><label for="pi-name-${id}">Item / description</label><input type="text" id="pi-name-${id}" class="pi-name" value="${escapeHtml(it.name || '')}" placeholder="e.g. Groceries" required onchange="markDirty()"></div>
        <div><label for="pi-qty-${id}">Qty</label><input type="number" id="pi-qty-${id}" class="pi-qty" value="${it.quantity ?? 0}" min="0" step="0.01" oninput="updatePersonalItemCost(this);markDirty()"></div>
        <div><label for="pi-unit-${id}">Unit</label>
          <select id="pi-unit-${id}" class="pi-unit" onchange="updatePersonalItemCost(this);markDirty()">
            ${unitOptionsHtml(it.unit)}
          </select>
        </div>
        <div><label for="pi-price-${id}">Price per unit (₱)</label><input type="number" id="pi-price-${id}" class="pi-price" value="${it.price_per_unit ?? 0}" min="0" step="0.01" oninput="updatePersonalItemCost(this);markDirty()"></div>
        <div><label for="pi-cost-${id}">Total cost (₱)</label><input type="number" id="pi-cost-${id}" class="pi-cost" value="${it.cost ?? 0}" min="0" step="0.01" readonly style="background:var(--void);cursor:default;"></div>
        <button class="remove-btn" onclick="removeRow(this)" title="Remove item" aria-label="Remove item">✕</button>
      </div>`;
    }

    function addWorkerRow(w = {}) {
      workerRowSeq++;
      document.getElementById('worker-rows').insertAdjacentHTML('beforeend', workerRowTemplate(workerRowSeq, w));
      updateTotals();
      markDirty();
    }

    function addItemRow(it = {}) {
      itemRowSeq++;
      document.getElementById('item-rows').insertAdjacentHTML('beforeend', itemRowTemplate(itemRowSeq, it));
      const row = document.querySelector(`#item-rows .dyn-row[data-row-id="${itemRowSeq}"]`);
      if (row) updateItemCost(row.querySelector('.i-qty'));
      updateTotals();
      markDirty();
    }

    function addPersonalItemRow(it = {}) {
      pItemRowSeq++;
      document.getElementById('p-item-rows').insertAdjacentHTML('beforeend', personalItemRowTemplate(pItemRowSeq, it));
      const row = document.querySelector(`#p-item-rows .dyn-row[data-row-id="${pItemRowSeq}"]`);
      if (row) updatePersonalItemCost(row.querySelector('.pi-qty'));
      updatePersonalTotals();
      markDirty();
    }

    function removeRow(btn) {
      btn.closest('.dyn-row').remove();
      updateTotals();
      markDirty();
    }

    function collectWorkers() {
      return [...document.querySelectorAll('#worker-rows .dyn-row')].map(row => {
        const name = row.querySelector('.w-name').value.trim();
        if (!name) return null;
        return {
          name,
          job_description: row.querySelector('.w-job').value.trim() || "General Labor",
          full_days: Math.max(0, parseFloat(row.querySelector('.w-full').value) || 0),
          half_days: 0,
          daily_wage: Math.max(0, parseFloat(row.querySelector('.w-wage').value) || DEFAULT_WAGE),
          payment_period: row.querySelector('.w-period').value || "daily",
          paid: row.querySelector('.w-paid')?.dataset.paid === '1',
          work_dates: [document.getElementById('f-date').value || todayISO()]
        };
      }).filter(Boolean);
    }

    function collectItems() {
      return [...document.querySelectorAll('#item-rows .dyn-row')].map(row => {
        const name = row.querySelector('.i-name').value.trim();
        if (!name) return null;
        const qty = Math.max(0, parseFloat(row.querySelector('.i-qty').value) || 0);
        const unit = row.querySelector('.i-unit').value;
        const price = Math.max(0, parseFloat(row.querySelector('.i-price').value) || 0);
        const cost = parseFloat(row.querySelector('.i-cost').value) || 0;
        return { name, quantity: qty, unit, price_per_unit: price, cost };
      }).filter(Boolean);
    }

    function collectPersonalItems() {
      return [...document.querySelectorAll('#p-item-rows .dyn-row')].map(row => {
        const name = row.querySelector('.pi-name').value.trim();
        if (!name) return null;
        const qty = Math.max(0, parseFloat(row.querySelector('.pi-qty').value) || 0);
        const unit = row.querySelector('.pi-unit').value;
        const price = Math.max(0, parseFloat(row.querySelector('.pi-price').value) || 0);
        const cost = parseFloat(row.querySelector('.pi-cost').value) || 0;
        return { name, quantity: qty, unit, price_per_unit: price, cost };
      }).filter(Boolean);
    }

    function updateItemCost(el) {
      const row = el.closest('.dyn-row');
      const qty = parseFloat(row.querySelector('.i-qty').value) || 0;
      const price = parseFloat(row.querySelector('.i-price').value) || 0;
      const cost = round2(qty * price);
      row.querySelector('.i-cost').value = cost;
      updateTotals();
    }

    function updatePersonalItemCost(el) {
      const row = el.closest('.dyn-row');
      const qty = parseFloat(row.querySelector('.pi-qty').value) || 0;
      const price = parseFloat(row.querySelector('.pi-price').value) || 0;
      const cost = round2(qty * price);
      row.querySelector('.pi-cost').value = cost;
      updatePersonalTotals();
    }

    function updateTotals() {
      const workers = collectWorkers();
      const items = collectItems();
      const labor = workers.reduce((s, w) => s + laborCostOf(w), 0);
      const itemsTotal = items.reduce((s, i) => s + i.cost, 0);
      const yieldVal = parseFloat(document.getElementById('f-yield').value) || 0;
      const pricePerKg = parseFloat(document.getElementById('f-price-per-kg').value) || 0;
      const revenue = parseFloat(document.getElementById('f-revenue').value) || 0;

      document.getElementById('t-labor').textContent = peso(labor);
      document.getElementById('t-items').textContent = peso(itemsTotal);
      document.getElementById('t-yield').textContent = yieldVal + ' kg';
      document.getElementById('t-price-per-kg').textContent = peso(pricePerKg);
      document.getElementById('t-revenue').textContent = peso(revenue);
      document.getElementById('t-grand').textContent = peso(labor + itemsTotal);
      document.getElementById('worker-count-label').textContent = `(${workers.length})`;
      document.getElementById('item-count-label').textContent = `(${items.length})`;
    }

    function updateGrossIncomePreview() {
      const yieldVal = Math.max(0, parseFloat(document.getElementById('f-yield').value) || 0);
      const pricePerKg = Math.max(0, parseFloat(document.getElementById('f-price-per-kg').value) || 0);
      document.getElementById('f-revenue').value = round2(yieldVal * pricePerKg);
    }

    function updatePersonalTotals() {
      const items = collectPersonalItems();
      const total = items.reduce((s, i) => s + i.cost, 0);
      document.getElementById('p-t-grand').textContent = peso(total);
      document.getElementById('p-item-count-label').textContent = `(${items.length})`;
    }

    function setCategory(cat) {
      currentCategory = cat;
      const businessBtn = document.getElementById('cat-business-btn');
      const personalBtn = document.getElementById('cat-personal-btn');
      businessBtn.className = cat === 'business' ? 'active-business' : '';
      personalBtn.className = cat === 'personal' ? 'active-personal' : '';
      businessBtn.setAttribute('aria-pressed', cat === 'business' ? 'true' : 'false');
      personalBtn.setAttribute('aria-pressed', cat === 'personal' ? 'true' : 'false');
      document.getElementById('business-fields').style.display = cat === 'business' ? '' : 'none';
      document.getElementById('personal-fields').style.display = cat === 'personal' ? '' : 'none';
      if (cat === 'business') {
        document.getElementById('form-title').textContent = editingId ? `Editing record #${editingId}` :
          "Record a day's expenditure";
      } else {
        document.getElementById('form-title').textContent = editingPersonalId ?
          `Editing personal expense #${editingPersonalId}` :
          "Record a personal expense";
      }
    }

    function resetForm() {
      editingId = null;
      editingPersonalId = null;
      isFormDirty = false;
      setCategory('business');
      document.getElementById('save-btn').textContent = "Save record";
      document.getElementById('f-type').value = PLANTATION_TYPES[0];
      document.getElementById('f-type')._refreshCustomLabel?.();
      document.getElementById('f-date').value = todayISO();
      document.getElementById('f-wage').value = DEFAULT_WAGE;
      document.getElementById('f-yield').value = 0;
      document.getElementById('f-price-per-kg').value = 0;
      document.getElementById('f-revenue').value = 0;
      document.getElementById('worker-rows').innerHTML = '';
      document.getElementById('item-rows').innerHTML = '';
      addWorkerRow();
      addItemRow();
      updateTotals();
      updateAutoSaveIndicator();

      document.getElementById('p-date').value = todayISO();
      document.getElementById('p-item-rows').innerHTML = '';
      addPersonalItemRow();
      updatePersonalTotals();
      localStorage.removeItem(DRAFT_KEY);
    }

    function confirmClearForm() {
      if (!isFormDirty && !editingId && !editingPersonalId) {
        resetForm();
        return;
      }
      document.getElementById('confirm-modal-title').textContent = 'Clear form?';
      document.getElementById('confirm-modal-text').textContent = 'You have unsaved changes. Are you sure you want to clear the form?';
      document.getElementById('confirm-yes').textContent = 'Clear';
      document.getElementById('confirm-yes').onclick = () => {
        resetForm();
        document.getElementById('confirm-modal').classList.remove('open');
        showToast('Form cleared', 'info');
      };
      document.getElementById('confirm-modal').classList.add('open');
    }

    function validateBusinessForm() {
      let valid = true;
      const workers = collectWorkers();
      const items = collectItems();

      if (workers.length === 0 && items.length === 0) {
        showToast('⚠️ Add at least one worker or item first', 'error');
        valid = false;
      }

      const emptyWorkers = workers.filter(w => !w.name || w.name.trim() === '');
      if (emptyWorkers.length > 0) {
        showToast('⚠️ All workers must have a name', 'error');
        valid = false;
      }

      const emptyItems = items.filter(i => !i.name || i.name.trim() === '');
      if (emptyItems.length > 0) {
        showToast('⚠️ All items must have a name', 'error');
        valid = false;
      }

      const date = document.getElementById('f-date').value;
      if (isFutureDate(date)) {
        showToast('⚠️ Date cannot be in the future', 'error');
        valid = false;
      }

      return valid;
    }
    async function saveRecord() {
      if (isLoading) return;

      if (currentCategory === 'personal') {
        await savePersonalRecord();
        return;
      }

      if (!validateBusinessForm()) return;

      const type = document.getElementById('f-type').value;
      const date = document.getElementById('f-date').value || todayISO();
      const dailyWage = Math.max(0, parseFloat(document.getElementById('f-wage').value) || DEFAULT_WAGE);
      const workers = collectWorkers();
      const items = collectItems();
      const yieldVal = Math.max(0, parseFloat(document.getElementById('f-yield').value) || 0);
      const pricePerKg = Math.max(0, parseFloat(document.getElementById('f-price-per-kg').value) || 0);
      const revenue = Math.max(0, parseFloat(document.getElementById('f-revenue').value) || 0);

      if (!editingId) {
        const dupes = workers.filter(w => records.some(r =>
          r.date === date && r.plantation_type === type &&
          r.workers.some(rw => rw.name.toLowerCase() === w.name.toLowerCase() && rw.job_description.toLowerCase() === w.job_description.toLowerCase())
        ));
        if (dupes.length > 0) {
          const names = [...new Set(dupes.map(w => `${w.name} (${w.job_description})`))].join(', ');
          const proceed = confirm(`⚠️ ${names} already has an entry for ${type} on ${date}. Save anyway?`);
          if (!proceed) return;
        }
      }

      setLoading(true);

      const laborCost = round2(workers.reduce((s, w) => s + laborCostOf(w), 0));
      const itemsTotal = round2(items.reduce((s, i) => s + i.cost, 0));

      const record = {
        id: editingId ?? nextId,
        date,
        plantation_type: type,
        category: 'business',
        workers,
        total_workers: workers.length,
        full_days: workers.reduce((s, w) => s + w.full_days, 0),
        half_days: workers.reduce((s, w) => s + w.half_days, 0),
        daily_wage: dailyWage,
        labor_cost: laborCost,
        items,
        items_total: itemsTotal,
        yield_kg: yieldVal,
        price_per_kg: pricePerKg,
        revenue: revenue,
        cost_per_kg: yieldVal > 0 ? round2((laborCost + itemsTotal) / yieldVal) : 0,
        total_expenditure: round2(laborCost + itemsTotal)
      };

      let success = false;
      if (editingId) {
        const idx = records.findIndex(r => r.id === editingId);
        if (idx !== -1) {
          records[idx] = record;
          success = await saveToStorage();
          if (success) showToast(`✅ Record #${editingId} updated`, 'success');
        }
      } else {
        record.id = nextId++;
        records.push(record);
        success = await saveToStorage();
        if (success) showToast(`✅ Business record #${record.id} saved`, 'success');
      }

      setLoading(false);

      if (success) {
        isFormDirty = false;
        resetForm();
        refreshAll();
      }
    }

    async function savePersonalRecord() {
      if (isLoading) return;

      const items = collectPersonalItems();
      if (items.length === 0) {
        showToast('⚠️ Add at least one personal item first', 'error');
        return;
      }

      const emptyItems = items.filter(i => !i.name || i.name.trim() === '');
      if (emptyItems.length > 0) {
        showToast('⚠️ All personal items must have a name', 'error');
        return;
      }

      const date = document.getElementById('p-date').value || todayISO();
      if (isFutureDate(date)) {
        showToast('⚠️ Date cannot be in the future', 'error');
        return;
      }

      setLoading(true);

      const total = round2(items.reduce((s, i) => s + i.cost, 0));
      const record = { id: editingPersonalId ?? nextPersonalId, date, category: 'personal', items,
      total_expenditure: total };

      let success = false;
      if (editingPersonalId) {
        const idx = personalRecords.findIndex(r => r.id === editingPersonalId);
        if (idx !== -1) {
          personalRecords[idx] = record;
          success = await savePersonalToStorage();
          if (success) showToast(`✅ Personal expense #${editingPersonalId} updated`, 'success');
        }
      } else {
        record.id = nextPersonalId++;
        personalRecords.push(record);
        success = await savePersonalToStorage();
        if (success) showToast(`✅ Personal expense #${record.id} saved`, 'success');
      }

      setLoading(false);

      if (success) {
        isFormDirty = false;
        resetForm();
        refreshAll();
      }
    }

    function generateWorkerReceiptHtml(worker, date, plantation, description) {
      const periodLabel = worker.payment_period === "weekly" ? "Weekly" : worker.payment_period === "monthly" ? "Monthly" : "Daily";
      const amount = laborCostOf(worker);
      const days = worker.full_days + worker.half_days * 0.5;
      const workDates = worker.work_dates || [date];
      
      return `
        <div class="receipt-print" id="receipt-${worker.name.replace(/\s/g, '')}">
          <div class="header">
            <h2>🌿 Cool Misty Farm</h2>
            <p>Valley and Creeks Plantation</p>
            <p>${plantation}</p>
            <p>${date}</p>
          </div>
          <div class="line"></div>
          <div class="row"><span>Worker:</span><span><strong>${escapeHtml(worker.name)}</strong></span></div>
          <div class="row"><span>Job:</span><span>${escapeHtml(worker.job_description || 'General Labor')}</span></div>
          <div class="row"><span>Payment Period:</span><span>${periodLabel}</span></div>
          <div class="row"><span>Daily Wage:</span><span>${peso(worker.daily_wage)}</span></div>
          <div class="row"><span>Days Worked:</span><span>${days}</span></div>
          <div class="row"><span>Work Dates:</span><span>${workDates.join(', ')}</span></div>
          <div class="line"></div>
          <div class="row total"><span>Total Amount Due:</span><span>${peso(amount)}</span></div>
          <div class="line"></div>
          <div class="footer">
            <p>Activity: ${escapeHtml(description || 'Farm Work')}</p>
            <p>Generated: ${todayISO()}</p>
            <p>Thank you for your hard work! 🌱</p>
          </div>
        </div>
      `;
    }

    function viewRecordReceipts(id) {
      const record = records.find(r => r.id === id);
      if (!record) return;
      if (!record.workers || record.workers.length === 0) {
        showToast('⚠️ No workers logged on this record', 'error');
        return;
      }

      let receiptsHtml = '<div class="card"><h2>🧾 Worker Receipts</h2><p style="color:var(--muted);font-size:12px;">Click the print button below or use Ctrl+P to print each receipt.</p>';
      record.workers.forEach((w, idx) => {
        receiptsHtml += generateWorkerReceiptHtml(w, record.date, record.plantation_type, record.workers.map(x => x.job_description).join(', '));
        if (idx < record.workers.length - 1) receiptsHtml += '<div style="margin: 20px 0; border-top: 2px dashed var(--border);"></div>';
      });
      receiptsHtml += `<div class="btn-row"><button class="btn-primary" onclick="window.print()">🖨️ Print Receipts</button></div></div>`;

      const existingReceipts = document.getElementById('records-receipts-display');
      if (existingReceipts) existingReceipts.remove();

      const receiptDiv = document.createElement('div');
      receiptDiv.id = 'records-receipts-display';
      receiptDiv.innerHTML = receiptsHtml;
      document.getElementById('view-records').appendChild(receiptDiv);
      receiptDiv.scrollIntoView({ behavior: 'smooth' });
    }

    // Extracts an 11-char YouTube video ID from most common URL shapes (watch?v=, youtu.be/, shorts/, embed/).
    // Used only to build an embed (iframe) URL — nothing is ever fetched, downloaded, or re-hosted.
    function extractYouTubeId(url) {
      if (!url) return null;
      const patterns = [
        /(?:youtube\.com\/watch\?v=|youtube\.com\/shorts\/|youtube\.com\/embed\/|youtu\.be\/)([a-zA-Z0-9_-]{11})/
      ];
      for (const re of patterns) {
        const m = url.match(re);
        if (m) return m[1];
      }
      return null;
    }

    function youtubeEmbedHtml(url) {
      const id = extractYouTubeId(url);
      if (!id) return '';
      return `<div class="journal-video-wrap"><iframe src="https://www.youtube.com/embed/${id}" title="YouTube video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy"></iframe></div>`;
    }

    // Renders an uploaded video (base64 data URL) with a native <video> player.
    // This is stored on-device and plays with zero internet connection.
    function uploadedVideoHtml(dataUrl) {
      if (!dataUrl) return '';
      return `<video class="journal-video-native" controls playsinline preload="metadata" src="${dataUrl}"></video>`;
    }

    document.addEventListener('DOMContentLoaded', () => {
      const photoInput = document.getElementById('activity-photo');
      if (photoInput) {
        photoInput.addEventListener('change', () => {
          const file = photoInput.files && photoInput.files[0];
          const preview = document.getElementById('activity-photo-preview');
          if (!file) { pendingActivityPhoto = null; if (preview) preview.innerHTML = ''; return; }
          if (!file.type.startsWith('image/')) {
            showToast('⚠️ Please choose an image file', 'error');
            photoInput.value = '';
            return;
          }
          const reader = new FileReader();
          reader.onload = (e) => {
            pendingActivityPhoto = e.target.result;
            if (preview) preview.innerHTML = `<img class="journal-photo-preview-thumb" src="${pendingActivityPhoto}" alt="Photo preview">`;
          };
          reader.readAsDataURL(file);
        });
      }

      const videoInput = document.getElementById('activity-video-file');
      if (videoInput) {
        videoInput.addEventListener('change', () => {
          const file = videoInput.files && videoInput.files[0];
          const preview = document.getElementById('activity-video-file-preview');
          if (!file) { pendingActivityVideo = null; if (preview) preview.innerHTML = ''; return; }
          if (!file.type.startsWith('video/')) {
            showToast('⚠️ Please choose a video file', 'error');
            videoInput.value = '';
            return;
          }
          if (file.size > MAX_VIDEO_BYTES) {
            showToast(`⚠️ That video is too large to store on-device (limit ~${Math.round(MAX_VIDEO_BYTES / 1024 / 1024)}MB). Try a shorter clip or lower resolution.`, 'error', 5000);
            videoInput.value = '';
            return;
          }
          const reader = new FileReader();
          reader.onload = (e) => {
            pendingActivityVideo = e.target.result;
            if (preview) preview.innerHTML = `<video class="journal-video-preview-thumb" src="${pendingActivityVideo}" controls playsinline preload="metadata"></video>`;
          };
          reader.readAsDataURL(file);
        });
      }
    });

    async function saveActivity() {
      const date = document.getElementById('activity-date').value || todayISO();
      const description = document.getElementById('activity-description').value.trim();
      const plantation = document.getElementById('activity-plantation').value;
      const youtubeUrlRaw = document.getElementById('activity-youtube').value.trim();

      if (!description) {
        showToast('⚠️ Please write a diary entry first', 'error');
        return;
      }

      if (isFutureDate(date)) {
        showToast('⚠️ Date cannot be in the future', 'error');
        return;
      }

      if (youtubeUrlRaw && !extractYouTubeId(youtubeUrlRaw)) {
        showToast('⚠️ That doesn\'t look like a valid YouTube link', 'error');
        return;
      }

      setLoading(true);
      try {
        const image = pendingActivityPhoto !== null ? pendingActivityPhoto :
          (editingActivityId ? (activityRecords.find(a => a.id === editingActivityId)?.image || null) : null);
        const video = pendingActivityVideo !== null ? pendingActivityVideo :
          (editingActivityId ? (activityRecords.find(a => a.id === editingActivityId)?.video || null) : null);
        if (editingActivityId) {
          const idx = activityRecords.findIndex(a => a.id === editingActivityId);
          if (idx !== -1) {
            activityRecords[idx] = { ...activityRecords[idx], date, description, plantation_type: plantation, image, video, youtube_url: youtubeUrlRaw || null };
          }
          await window.storage.set('activity-records', JSON.stringify({ records: activityRecords, nextId: nextActivityId }), false);
          showToast(`✅ Diary entry updated`, 'success');
        } else {
          const activity = {
            id: nextActivityId++,
            date,
            description,
            plantation_type: plantation,
            image,
            video,
            youtube_url: youtubeUrlRaw || null,
            workers: [],
            total_workers: 0,
            labor_cost: 0,
            total_expenditure: 0
          };
          activityRecords.push(activity);
          await window.storage.set('activity-records', JSON.stringify({ records: activityRecords, nextId: nextActivityId }), false);
          showToast(`✅ Diary entry saved for ${date}`, 'success');
        }
        clearActivityForm();
        renderActivities();
      } catch (e) {
        console.error(e);
        showToast('⚠️ Failed to save diary entry — the video may be too large for this device\'s storage.', 'error', 5000);
      }
      setLoading(false);
    }

    function editActivity(id) {
      const a = activityRecords.find(x => x.id === id);
      if (!a) return;
      editingActivityId = id;
      document.getElementById('activity-date').value = a.date;
      document.getElementById('activity-plantation').value = a.plantation_type || '';
      document.getElementById('activity-plantation')._refreshCustomLabel?.();
      document.getElementById('activity-description').value = a.description;
      document.getElementById('activity-youtube').value = a.youtube_url || '';
      const photoInput = document.getElementById('activity-photo');
      const preview = document.getElementById('activity-photo-preview');
      if (photoInput) photoInput.value = '';
      pendingActivityPhoto = null;
      if (preview) preview.innerHTML = a.image ? `<img class="journal-photo-preview-thumb" src="${a.image}" alt="Current photo">` : '';
      const videoInput = document.getElementById('activity-video-file');
      const videoPreview = document.getElementById('activity-video-file-preview');
      if (videoInput) videoInput.value = '';
      pendingActivityVideo = null;
      if (videoPreview) videoPreview.innerHTML = a.video ? `<video class="journal-video-preview-thumb" src="${a.video}" controls playsinline preload="metadata"></video>` : '';
      document.getElementById('activity-save-btn').textContent = 'Update entry';
      document.getElementById('activity-cancel-btn').style.display = '';
      navigateTo('activities');
      document.getElementById('activity-description').scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    function clearActivityForm() {
      editingActivityId = null;
      pendingActivityPhoto = null;
      pendingActivityVideo = null;
      document.getElementById('activity-description').value = '';
      document.getElementById('activity-youtube').value = '';
      const photoInput = document.getElementById('activity-photo');
      const preview = document.getElementById('activity-photo-preview');
      if (photoInput) photoInput.value = '';
      if (preview) preview.innerHTML = '';
      const videoInput = document.getElementById('activity-video-file');
      const videoPreview = document.getElementById('activity-video-file-preview');
      if (videoInput) videoInput.value = '';
      if (videoPreview) videoPreview.innerHTML = '';
      document.getElementById('activity-save-btn').textContent = 'Save entry';
      document.getElementById('activity-cancel-btn').style.display = 'none';
    }

    function renderActivities() {
      const out = document.getElementById('activity-records');
      document.getElementById('activity-count-label').textContent = `(${activityRecords.length})`;

      if (activityRecords.length === 0) {
        out.innerHTML = `<div class="empty-state"><span class="glyph">📅</span>No diary entries yet. Write your first entry above.</div>`;
        return;
      }

      const list = [...activityRecords].sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id);
      out.innerHTML = list.map(a => `
        <div style="margin-bottom:22px;padding-bottom:18px;border-bottom:1px dashed var(--border);">
          <h3 style="margin-bottom:6px;">${a.date}${a.plantation_type ? ` <span class="tag" style="text-transform:none;letter-spacing:0;">${a.plantation_type}</span>` : ''}</h3>
          ${a.image ? `<img class="journal-photo" src="${a.image}" alt="Journal photo for ${a.date}">` : ''}
          ${a.video ? uploadedVideoHtml(a.video) : ''}
          ${a.video ? `<div class="offline-video-badge">📴 Plays offline — saved on this device</div>` : ''}
          ${a.youtube_url ? youtubeEmbedHtml(a.youtube_url) : ''}
          ${a.youtube_url ? `<div class="online-video-badge">🌐 Requires internet — streamed from YouTube</div>` : ''}
          <p>${escapeHtml(a.description).replace(/\n/g, '<br>')}</p>
          <div class="btn-row" style="margin-top:0;">
            <button class="btn-ghost btn-sm" onclick="editActivity(${a.id})">Edit entry</button>
            <button class="btn-primary btn-sm" onclick="shareActivity(${a.id})">📤 Share</button>
            <button class="btn-danger btn-sm" onclick="deleteActivity(${a.id})">Delete entry</button>
          </div>
        </div>
      `).join('');
    }

    // ---------- Sharing (Daily Journal entries) ----------
    // A plain web app cannot post directly into Facebook, Instagram, or YouTube feeds — those
    // require a registered developer app and OAuth review with each platform. What genuinely
    // works, and what this uses: the device's native Share Sheet (Web Share API), which lets the
    // person pick Facebook, Instagram, Messenger, WhatsApp, etc. — the same sheet used when
    // sharing a photo from the gallery. On desktop/unsupported browsers it falls back to
    // downloading the media plus copying the caption so it can be attached manually.
    function dataUrlToFile(dataUrl, filename) {
      const [header, base64] = dataUrl.split(',');
      const mimeMatch = header.match(/data:(.*?);base64/);
      const mime = mimeMatch ? mimeMatch[1] : 'application/octet-stream';
      const bin = atob(base64);
      const arr = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
      return new File([arr], filename, { type: mime });
    }

    function downloadDataUrl(dataUrl, filename) {
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }

    async function shareActivity(id) {
      const a = activityRecords.find(x => x.id === id);
      if (!a) return;

      const caption = `${a.date}${a.plantation_type ? ' · ' + a.plantation_type : ''} — ${a.description}`.slice(0, 500);
      const shareTitle = 'Valley and Creeks Farm — Journal Entry';

      // Prefer the native OS share sheet with the actual media attached (works for
      // Facebook, Instagram, WhatsApp, Messenger, etc. on supporting mobile browsers).
      try {
        if (navigator.share) {
          const files = [];
          if (a.video) files.push(dataUrlToFile(a.video, `journal-${a.date}.mp4`));
          else if (a.image) files.push(dataUrlToFile(a.image, `journal-${a.date}.jpg`));

          const shareData = { title: shareTitle, text: caption };
          if (files.length && navigator.canShare && navigator.canShare({ files })) {
            shareData.files = files;
          }
          await navigator.share(shareData);
          return;
        }
      } catch (e) {
        if (e && e.name === 'AbortError') return; // user cancelled the share sheet
        console.warn('Web Share failed, falling back:', e);
      }

      // Fallback for desktop / browsers without Web Share support: download the media
      // and copy the caption so it can be attached manually in Facebook, Instagram, or
      // uploaded to YouTube Studio.
      openShareFallback(a, caption);
    }

    function openShareFallback(a, caption) {
      const existing = document.getElementById('share-fallback-modal');
      if (existing) existing.remove();

      const modal = document.createElement('div');
      modal.id = 'share-fallback-modal';
      modal.className = 'modal-backdrop open';
      modal.innerHTML = `
        <div class="modal">
          <h3>📤 Share this entry</h3>
          <p>Your browser doesn't support direct device sharing. Facebook, Instagram, and YouTube don't accept posts straight from a web page — download the media below, then attach it in the app of your choice.</p>
          <div class="btn-row">
            ${a.video ? `<button class="btn-primary btn-sm" id="share-download-video">⬇ Download video</button>` : ''}
            ${a.image ? `<button class="btn-primary btn-sm" id="share-download-photo">⬇ Download photo</button>` : ''}
            <button class="btn-ghost btn-sm" id="share-copy-caption">📋 Copy caption</button>
            <button class="btn-fuchsia btn-sm" id="share-facebook">📘 Open Facebook</button>
          </div>
          <div class="btn-row">
            <button class="btn-ghost" id="share-fallback-close">Close</button>
          </div>
        </div>`;
      document.body.appendChild(modal);

      document.getElementById('share-download-video')?.addEventListener('click', () => {
        downloadDataUrl(a.video, `journal-${a.date}.mp4`);
        showToast('⬇ Video downloaded — attach it in the app you want to post to', 'success');
      });
      document.getElementById('share-download-photo')?.addEventListener('click', () => {
        downloadDataUrl(a.image, `journal-${a.date}.jpg`);
        showToast('⬇ Photo downloaded — attach it in the app you want to post to', 'success');
      });
      document.getElementById('share-copy-caption')?.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(caption);
          showToast('📋 Caption copied', 'success');
        } catch (e) {
          showToast('⚠️ Could not copy — select and copy the text manually', 'error');
        }
      });
      document.getElementById('share-facebook')?.addEventListener('click', () => {
        // Facebook's share dialog only accepts a public URL, not local media — this opens
        // the composer for the person to paste the caption and attach the downloaded file.
        window.open('https://www.facebook.com/', '_blank', 'noopener');
      });
      document.getElementById('share-fallback-close')?.addEventListener('click', () => modal.remove());
      modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
    }

    async function deleteActivity(id) {
      if (!confirm('Delete this diary entry?')) return;
      activityRecords = activityRecords.filter(a => a.id !== id);
      if (editingActivityId === id) clearActivityForm();
      await window.storage.set('activity-records', JSON.stringify({ records: activityRecords, nextId: nextActivityId }), false);
      renderActivities();
      showToast('🗑️ Diary entry deleted', 'success');
    }

    async function loadActivities() {
      try {
        const res = await window.storage.get('activity-records', false);
        if (res && res.value) {
          const parsed = JSON.parse(res.value);
          activityRecords = parsed.records || [];
          nextActivityId = parsed.nextId || (activityRecords.length ? Math.max(...activityRecords.map(a => a.id)) + 1 : 1);
        }
      } catch (e) {
        console.warn('Failed to load activities:', e);
        activityRecords = [];
        nextActivityId = 1;
      }
    }

    function confirmDelete(id) {
      pendingDeleteId = id;
      pendingDeleteIsPersonal = false;
      const r = records.find(x => x.id === id);
      document.getElementById('confirm-modal-title').textContent = 'Delete record?';
      document.getElementById('confirm-modal-text').textContent =
        `Record #${id} — ${r.plantation_type} on ${r.date} (${peso(r.total_expenditure)}) will be permanently removed.`;
      document.getElementById('confirm-yes').textContent = 'Delete';
      document.getElementById('confirm-yes').onclick = executeDelete;
      document.getElementById('confirm-modal').classList.add('open');
    }

    function confirmDeletePersonal(id) {
      pendingDeleteId = id;
      pendingDeleteIsPersonal = true;
      const r = personalRecords.find(x => x.id === id);
      document.getElementById('confirm-modal-title').textContent = 'Delete personal expense?';
      document.getElementById('confirm-modal-text').textContent =
        `Personal expense #${id} on ${r.date} (${peso(r.total_expenditure)}) will be permanently removed.`;
      document.getElementById('confirm-yes').textContent = 'Delete';
      document.getElementById('confirm-yes').onclick = executeDelete;
      document.getElementById('confirm-modal').classList.add('open');
    }

    async function executeDelete() {
      document.getElementById('confirm-modal').classList.remove('open');
      setLoading(true);
      if (pendingDeleteIsPersonal) {
        const r = personalRecords.find(x => x.id === pendingDeleteId);
        deletedRecord = { type: 'personal', record: r };
        personalRecords = personalRecords.filter(r => r.id !== pendingDeleteId);
        await savePersonalToStorage();
        showUndoToast(r, 'personal');
      } else {
        const r = records.find(x => x.id === pendingDeleteId);
        deletedRecord = { type: 'business', record: r };
        records = records.filter(r => r.id !== pendingDeleteId);
        await saveToStorage();
        showUndoToast(r, 'business');
      }
      setLoading(false);
      refreshAll();
      clearTimeout(undoTimeout);
      undoTimeout = setTimeout(() => {
        deletedRecord = null;
      }, UNDO_TIMEOUT);
    }

    function undoDelete() {
      if (!deletedRecord) {
        showToast('⚠️ No deleted record to undo', 'error');
        return;
      }
      if (deletedRecord.type === 'personal') {
        personalRecords.push(deletedRecord.record);
        savePersonalToStorage();
        showToast(`↩️ Restored personal expense #${deletedRecord.record.id}`, 'success');
      } else {
        records.push(deletedRecord.record);
        saveToStorage();
        showToast(`↩️ Restored record #${deletedRecord.record.id}`, 'success');
      }
      deletedRecord = null;
      clearTimeout(undoTimeout);
      refreshAll();
    }

    function editRecord(id) {
      const r = records.find(x => x.id === id);
      if (!r) return;
      editingId = id;
      editingPersonalId = null;
      setCategory('business');
      document.getElementById('form-title').textContent = `Editing record #${id}`;
      document.getElementById('save-btn').textContent = "Update record";
      document.getElementById('f-type').value = r.plantation_type;
      document.getElementById('f-type')._refreshCustomLabel?.();
      document.getElementById('f-date').value = r.date;
      document.getElementById('f-wage').value = r.daily_wage;
      document.getElementById('f-yield').value = r.yield_kg || 0;
      document.getElementById('f-price-per-kg').value = r.price_per_kg || 0;
      document.getElementById('f-revenue').value = r.revenue || 0;
      document.getElementById('worker-rows').innerHTML = '';
      document.getElementById('item-rows').innerHTML = '';
      r.workers.forEach(w => addWorkerRow(w));
      r.items.forEach(i => addItemRow(i));
      if (r.workers.length === 0) addWorkerRow();
      if (r.items.length === 0) addItemRow();
      updateTotals();
      isFormDirty = false;
      updateAutoSaveIndicator();
      navigateTo('add');
    }

    function editPersonalRecord(id) {
      const r = personalRecords.find(x => x.id === id);
      if (!r) return;
      editingPersonalId = id;
      editingId = null;
      setCategory('personal');
      document.getElementById('form-title').textContent = `Editing personal expense #${id}`;
      document.getElementById('save-btn').textContent = "Update record";
      document.getElementById('p-date').value = r.date;
      document.getElementById('p-item-rows').innerHTML = '';
      r.items.forEach(i => addPersonalItemRow(i));
      if (r.items.length === 0) addPersonalItemRow();
      updatePersonalTotals();
      isFormDirty = false;
      updateAutoSaveIndicator();
      navigateTo('add');
    }

    async function toggleRecordWorkerPaid(recordId, workerIndex) {
      const rec = records.find(r => r.id === recordId);
      if (!rec || !rec.workers[workerIndex]) return;
      rec.workers[workerIndex].paid = !rec.workers[workerIndex].paid;
      const success = await saveToStorage();
      if (success) {
        showToast(rec.workers[workerIndex].paid ? `✅ Marked ${rec.workers[workerIndex].name} as paid` : `↩️ Marked ${rec.workers[workerIndex].name} as unpaid`, 'success');
        refreshAll();
      }
    }

    function clearFilters() {
      document.getElementById('s-type').value = '';
      document.getElementById('s-from').value = '';
      document.getElementById('s-to').value = '';
      document.getElementById('s-worker').value = '';
      document.getElementById('s-min-amount').value = '';
      document.getElementById('s-max-amount').value = '';
      currentPage = 1;
      renderRecords();
    }

    function getFilteredRecords() {
      const type = document.getElementById('s-type').value;
      const from = document.getElementById('s-from').value;
      const to = document.getElementById('s-to').value;
      const worker = document.getElementById('s-worker').value.trim().toLowerCase();
      const minAmount = parseFloat(document.getElementById('s-min-amount').value) || 0;
      const maxAmount = parseFloat(document.getElementById('s-max-amount').value) || Infinity;

      let list = [...records];
      if (type) list = list.filter(r => r.plantation_type === type);
      if (from) list = list.filter(r => r.date >= from);
      if (to) list = list.filter(r => r.date <= to);
      if (worker) list = list.filter(r => r.workers.some(w => w.name.toLowerCase().includes(worker)));
      if (minAmount > 0) list = list.filter(r => r.total_expenditure >= minAmount);
      if (maxAmount < Infinity) list = list.filter(r => r.total_expenditure <= maxAmount);
      list.sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id);
      return list;
    }

    function renderRecords() {
      filteredRecords = getFilteredRecords();
      const totalRecords = filteredRecords.length;
      const totalPages = Math.ceil(totalRecords / RECORDS_PER_PAGE);

      if (currentPage > totalPages) currentPage = Math.max(1, totalPages);

      const start = (currentPage - 1) * RECORDS_PER_PAGE;
      const end = Math.min(start + RECORDS_PER_PAGE, totalRecords);
      const pageItems = filteredRecords.slice(start, end);

      document.getElementById('records-count-label').textContent = `(${totalRecords})`;

      const out = document.getElementById('records-table');
      if (totalRecords === 0) {
        out.innerHTML =
          `<div class="empty-state"><span class="glyph">🌾</span>No records match — try a new record or clear filters.</div>`;
        return;
      }

      let html = `<div class="table-wrapper"><table>
        <thead><tr>
          <th>ID</th><th>Date</th><th>Type</th><th>Yield</th><th>Revenue</th><th>Workers</th><th>Items</th><th class="num">Total</th><th>Actions</th>
        </tr></thead>
        <tbody>`;

      pageItems.forEach(r => {
        html += `
          <tr>
            <td class="num">#${r.id}</td>
            <td>${r.date}</td>
            <td><span class="tag">${r.plantation_type}</span></td>
            <td>${r.yield_kg ? r.yield_kg + ' kg' : '—'}</td>
            <td>${r.revenue ? peso(r.revenue) : '—'}</td>
            <td class="mini-list">${r.workers.map((w, wi) => `<div>${escapeHtml(w.name)} — ${escapeHtml(w.job_description)} · ${peso(laborCostOf(w))} ${w.paid ? '<span class="tag profit">Paid</span>' : '<span class="tag loss">Unpaid</span>'} <button class="btn-ghost btn-sm" style="padding:2px 8px;min-height:22px;font-size:10px;" onclick="toggleRecordWorkerPaid(${r.id}, ${wi})">${w.paid ? 'Mark unpaid' : 'Mark paid'}</button></div>`).join('') || '<div>—</div>'}</td>
            <td class="mini-list">${r.items.map(i => `<div>${escapeHtml(i.name)}: ${i.quantity} ${i.unit} × ${peso(i.price_per_unit)} = ${peso(i.cost)}</div>`).join('') || '<div>—</div>'}</td>
            <td class="num">${peso(r.total_expenditure)}</td>
            <td class="actions-cell">
              <button class="btn-ghost btn-sm" onclick="editRecord(${r.id})" aria-label="Edit record #${r.id}">Edit</button>
              <button class="btn-ghost btn-sm" onclick="viewRecordReceipts(${r.id})" aria-label="View receipts for record #${r.id}">🧾 Receipts</button>
              <button class="btn-danger btn-sm" onclick="confirmDelete(${r.id})" aria-label="Delete record #${r.id}">Delete</button>
            </td>
          </tr>`;
      });

      html += `</tbody></table></div>`;

      if (totalPages > 1) {
        html += `<div class="pagination" role="navigation" aria-label="Pagination">`;
        html +=
          `<button onclick="changePage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''} aria-label="Previous page">‹</button>`;
        for (let i = 1; i <= totalPages; i++) {
          html +=
            `<button onclick="changePage(${i})" class="${i === currentPage ? 'active' : ''}" aria-label="Page ${i}" ${i === currentPage ? 'aria-current="page"' : ''}>${i}</button>`;
        }
        html +=
          `<button onclick="changePage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''} aria-label="Next page">›</button>`;
        html += `</div>`;
      }

      out.innerHTML = html;
    }

    function changePage(page) {
      const totalPages = Math.ceil(getFilteredRecords().length / RECORDS_PER_PAGE);
      if (page < 1 || page > totalPages) return;
      currentPage = page;
      renderRecords();
    }
    function populateQuickDates() {
      const dates = [...new Set(records.map(r => r.date))].sort();
      const sel = document.getElementById('d-quick');
      sel.innerHTML = `<option value="">Jump to a recorded date…</option>` +
        dates.map(d =>
          `<option value="${d}">${d} (${records.filter(r => r.date === d).length} record(s))</option>`).join('');
    }

    function pickQuickDate() {
      const v = document.getElementById('d-quick').value;
      if (v) { document.getElementById('d-date').value = v;
        renderDateSummary(); }
    }

    function renderDateSummary() {
      const date = document.getElementById('d-date').value;
      const out = document.getElementById('date-summary-out');
      if (!date) {
        out.innerHTML =
          `<div class="card"><div class="empty-state"><span class="glyph">📅</span>Please select a date.</div></div>`;
        return;
      }

      const recs = records.filter(r => r.date === date);
      const acts = activityRecords.filter(a => a.date === date);

      if (recs.length === 0 && acts.length === 0) {
        const dates = [...new Set(records.map(r => r.date))].sort();
        out.innerHTML = `<div class="card"><div class="empty-state"><span class="glyph">📭</span>
          No business records or diary entries for ${date}.
          ${dates.length ? `<div style="margin-top:8px;font-size:12.5px;">Try: ${dates.slice(0, 5).join(', ')}${dates.length > 5 ? ` (+${dates.length - 5} more)` : ''}</div>` : ''}
          </div></div>`;
        return;
      }

      const laborTotal = recs.reduce((s, r) => s + r.labor_cost, 0);
      const itemsTotal = recs.reduce((s, r) => s + r.items_total, 0);
      const grand = laborTotal + itemsTotal;
      const totalYield = recs.reduce((s, r) => s + (r.yield_kg || 0), 0);
      const totalRevenue = recs.reduce((s, r) => s + (r.revenue || 0), 0);

      const workerMap = {};
      recs.forEach(r => {
        r.workers.forEach(w => {
          if (!workerMap[w.name]) workerMap[w.name] = { job: w.job_description, full: 0, half: 0, cost: 0,
            records: [] };
          workerMap[w.name].full += w.full_days;
          workerMap[w.name].half += w.half_days;
          workerMap[w.name].cost += laborCostOf(w);
          workerMap[w.name].records.push(r.id);
        });
      });

      const itemRows = recs.flatMap(r => r.items.map(i => ({ ...i, plantation: r.plantation_type, record_id: r.id })));

      out.innerHTML = `
        <div class="card">
          <h2>Summary for ${date}</h2>
          <div class="grid cols-4">
            <div class="stat-card"><div class="label">Business Records</div><div class="value">${recs.length}</div></div>
            <div class="stat-card"><div class="label">Diary Entries</div><div class="value">${acts.length}</div></div>
            <div class="stat-card"><div class="label">Labor cost</div><div class="value">${peso(laborTotal)}</div></div>
            <div class="stat-card accent"><div class="label">Total expenditure</div><div class="value">${peso(grand)}</div></div>
            ${totalYield > 0 ? `<div class="stat-card good"><div class="label">Total Yield</div><div class="value">${totalYield} kg</div></div>` : ''}
            ${totalRevenue > 0 ? `<div class="stat-card good"><div class="label">Total Revenue</div><div class="value">${peso(totalRevenue)}</div></div>` : ''}
          </div>
        </div>

        ${acts.length > 0 ? `
        <div class="card essay">
          <h2>Diary entries <span class="n">(${acts.length})</span></h2>
          ${acts.map(a => `<h3>${a.date}${a.plantation_type ? ` <span class="tag" style="text-transform:none;letter-spacing:0;">${a.plantation_type}</span>` : ''}</h3><p>${escapeHtml(a.description).replace(/\n/g, '<br>')}</p>`).join('')}
        </div>` : ''}

        <div class="card">
          <h2>Items purchased <span class="n">(${itemRows.length})</span></h2>
          ${itemRows.length === 0 ? `<div class="empty-state">None purchased on this date.</div>` : `
          <div class="table-wrapper"><table><thead><tr><th>Item</th><th>Qty</th><th>Unit</th><th>Price/unit</th><th>Plantation</th><th>Record</th><th class="num">Cost</th></tr></thead>
          <tbody>${itemRows.map(i => `<tr><td>${escapeHtml(i.name)}</td><td>${i.quantity}</td><td>${i.unit}</td><td>${peso(i.price_per_unit)}</td><td><span class="tag">${i.plantation}</span></td><td>#${i.record_id}</td><td class="num">${peso(i.cost)}</td></tr>`).join('')}</tbody></table></div>`}
        </div>

        <div class="card">
          <h2>Workers / labor <span class="n">(${Object.keys(workerMap).length})</span></h2>
          ${Object.keys(workerMap).length === 0 ? `<div class="empty-state">No workers logged on this date.</div>` : `
          <div class="table-wrapper"><table><thead><tr><th>Name</th><th>Job</th><th class="num">Full days</th><th class="num">Half days</th><th class="num">Labor cost</th><th>Records</th></tr></thead>
          <tbody>${Object.entries(workerMap).sort((a, b) => a[0].localeCompare(b[0])).map(([name, info]) => `
            <tr><td>${escapeHtml(name)}</td><td>${escapeHtml(info.job)}</td><td class="num">${info.full}</td><td class="num">${info.half}</td>
            <td class="num">${peso(info.cost)}</td><td class="mini-list">${info.records.map(id => `#${id}`).join(', ')}</td></tr>`).join('')}</tbody></table></div>`}
        </div>
      `;
    }

    function populateQuickWorkers() {
      const names = [...new Set(records.flatMap(r => r.workers.map(w => w.name)))].sort((a, b) => a.localeCompare(b));
      const sel = document.getElementById('w-quick');
      sel.innerHTML = `<option value="">Jump to a known worker…</option>` +
        names.map(n => `<option value="${n}">${escapeHtml(n)}</option>`).join('');
    }

    function pickQuickWorker() {
      const v = document.getElementById('w-quick').value;
      if (v) { document.getElementById('w-name').value = v;
        renderWorkerHistory(); }
    }

    function renderWorkerHistory() {
      const nameQuery = document.getElementById('w-name').value.trim().toLowerCase();
      const out = document.getElementById('worker-history-out');
      if (!nameQuery) {
        out.innerHTML =
          `<div class="card"><div class="empty-state"><span class="glyph">👷</span>Enter a worker name to search.</div></div>`;
        return;
      }

      const entries = [];
      records.forEach(r => {
        r.workers.forEach((w, wi) => {
          if (w.name.toLowerCase().includes(nameQuery)) {
            entries.push({
              date: r.date,
              record_id: r.id,
              worker_index: wi,
              name: w.name,
              job: w.job_description,
              full: w.full_days,
              half: w.half_days,
              wage: w.daily_wage,
              cost: laborCostOf(w),
              yield: r.yield_kg || 0,
              revenue: r.revenue || 0,
              payment_period: w.payment_period || "daily",
              paid: !!w.paid
            });
          }
        });
      });
      entries.sort((a, b) => a.date.localeCompare(b.date));

      if (entries.length === 0) {
        out.innerHTML =
          `<div class="card"><div class="empty-state"><span class="glyph">👷</span>No records found containing a worker matching "${escapeHtml(nameQuery)}".</div></div>`;
        return;
      }

      lastWorkerHistoryEntries = entries;
      lastWorkerHistoryName = entries[0].name;

      const totalLabor = entries.reduce((s, e) => s + e.cost, 0);
      const totalFull = entries.reduce((s, e) => s + e.full, 0);
      const totalHalf = entries.reduce((s, e) => s + e.half, 0);
      const dates = [...new Set(entries.map(e => e.date))];
      const paidEntries = entries.filter(e => e.paid);
      const unpaidEntries = entries.filter(e => !e.paid);
      const totalPaid = paidEntries.reduce((s, e) => s + e.cost, 0);
      const totalUnpaid = unpaidEntries.reduce((s, e) => s + e.cost, 0);
      const unpaidDates = unpaidEntries.map(e => e.date);
      const advanceInfo = computeAdvanceWorkerTotals().find(a => a.name === entries[0].name);
      const outstandingAdvance = advanceInfo ? advanceInfo.outstanding : 0;
      const advanceDeduction = round2(Math.min(totalUnpaid, outstandingAdvance));
      const netDue = round2(totalUnpaid - advanceDeduction);

      out.innerHTML = `
        <div class="card">
          <h2>${escapeHtml(entries[0].name)} — employment history</h2>
          <div class="grid cols-4">
            <div class="stat-card"><div class="label">Dates worked</div><div class="value">${dates.length}</div></div>
            <div class="stat-card"><div class="label">Full days</div><div class="value">${totalFull}</div></div>
            <div class="stat-card"><div class="label">Half days</div><div class="value">${totalHalf}</div></div>
            <div class="stat-card accent"><div class="label">Total labor cost</div><div class="value">${peso(totalLabor)}</div></div>
          </div>
        </div>
        <div class="card">
          <h2>💰 Total Payment <span class="n">paid vs. outstanding</span></h2>
          <div class="grid cols-3">
            <div class="stat-card good"><div class="label">Total paid</div><div class="value">${peso(totalPaid)}</div><div class="sub">${paidEntries.length} date(s)</div></div>
            <div class="stat-card bad"><div class="label">Total outstanding</div><div class="value">${peso(totalUnpaid)}</div><div class="sub">${unpaidEntries.length} date(s)</div></div>
            <div class="stat-card accent"><div class="label">Grand total</div><div class="value">${peso(totalLabor)}</div><div class="sub">all logged work</div></div>
          </div>
          ${outstandingAdvance > 0 ? `
          <div class="grid cols-2" style="margin-top:12px;">
            <div class="stat-card"><div class="label">Cash advance deducted</div><div class="value" style="color:var(--warning);">− ${peso(advanceDeduction)}</div><div class="sub">outstanding advance: ${peso(outstandingAdvance)}</div></div>
            <div class="stat-card good"><div class="label">Net amount due</div><div class="value">${peso(netDue)}</div><div class="sub">outstanding minus advance</div></div>
          </div>` : ''}
          <div class="net-sales-readout" style="margin-top:10px;">
            ${unpaidDates.length ? `Unpaid dates: <b class="neg">${unpaidDates.join(', ')}</b>` : `All logged work for this worker is marked paid.`}
            ${outstandingAdvance > 0 ? `<br>Cash advance automatically deducted from what's due — see Advances tab for full history.` : ''}
          </div>
          <div class="btn-row">
            <button class="btn-primary btn-sm" onclick="printWorkerPaymentReceipt()">🖨️ Print Receipt</button>
          </div>
        </div>
        <div class="card">
          <h2>Details by date</h2>
          <div class="table-wrapper"><table>
            <thead><tr><th>Date</th><th>Record</th><th>Job description</th><th class="num">Days</th><th class="num">Payment</th><th class="num">Daily wage</th><th class="num">Labor cost</th><th>Status</th><th></th></tr></thead>
            <tbody>${entries.map(e => `
              <tr><td>${e.date}</td><td>#${e.record_id}</td><td>${escapeHtml(e.job)}</td>
              <td class="num">${e.full}</td><td class="num">${e.payment_period}</td><td class="num">${peso(e.wage)}</td><td class="num">${peso(e.cost)}</td>
              <td>${e.paid ? '<span class="tag profit">Paid</span>' : '<span class="tag loss">Unpaid</span>'}</td>
              <td class="actions-cell"><button class="btn-ghost btn-sm" onclick="toggleRecordWorkerPaid(${e.record_id}, ${e.worker_index});renderWorkerHistory();">${e.paid ? 'Mark unpaid' : 'Mark paid'}</button></td>
              </tr>`).join('')}</tbody>
          </table></div>
        </div>
      `;
    }

    function printWorkerPaymentReceipt() {
      if (!lastWorkerHistoryEntries.length) {
        showToast('⚠️ Search for a worker first', 'error');
        return;
      }
      const entries = lastWorkerHistoryEntries;
      const name = lastWorkerHistoryName;
      const totalLabor = entries.reduce((s, e) => s + e.cost, 0);
      const totalPaid = entries.filter(e => e.paid).reduce((s, e) => s + e.cost, 0);
      const totalUnpaid = totalLabor - totalPaid;
      const advanceInfo = computeAdvanceWorkerTotals().find(a => a.name === name);
      const outstandingAdvance = advanceInfo ? advanceInfo.outstanding : 0;
      const advanceDeduction = round2(Math.min(totalUnpaid, outstandingAdvance));
      const netDue = round2(totalUnpaid - advanceDeduction);

      const html = `<div class="receipt-print" id="worker-payment-receipt">
        <div class="header">
          <h2>🌿 Cool Misty Farm</h2>
          <p>Valley and Creeks Plantation</p>
          <p>Worker Payment Receipt</p>
        </div>
        <div class="line"></div>
        <div class="row"><span>Worker:</span><span><strong>${escapeHtml(name)}</strong></span></div>
        <div class="row"><span>Dates worked:</span><span>${[...new Set(entries.map(e => e.date))].length}</span></div>
        <div class="line"></div>
        ${entries.map(e => `<div class="row"><span>${e.date} (${escapeHtml(e.job)})</span><span>${peso(e.cost)} ${e.paid ? '✓' : '(unpaid)'}</span></div>`).join('')}
        <div class="line"></div>
        <div class="row"><span>Total paid:</span><span>${peso(totalPaid)}</span></div>
        <div class="row"><span>Total outstanding:</span><span>${peso(totalUnpaid)}</span></div>
        ${advanceDeduction > 0 ? `<div class="row"><span>Cash advance deducted:</span><span>− ${peso(advanceDeduction)}</span></div>` : ''}
        <div class="row total"><span>${advanceDeduction > 0 ? 'Net Amount Due' : 'Grand Total'}:</span><span>${peso(advanceDeduction > 0 ? netDue : totalLabor)}</span></div>
        <div class="footer">
          <p>Generated: ${todayISO()}</p>
          <p>Thank you for your hard work! 🌱</p>
        </div>
      </div>
      <div class="btn-row" style="justify-content:center;"><button class="btn-primary" onclick="window.print()">🖨️ Print</button></div>`;

      const existing = document.getElementById('worker-receipt-display');
      if (existing) existing.remove();
      const div = document.createElement('div');
      div.id = 'worker-receipt-display';
      div.className = 'card';
      div.innerHTML = html;
      document.getElementById('worker-history-out').appendChild(div);
      div.scrollIntoView({ behavior: 'smooth' });
    }

    function renderBusiness() {
      document.getElementById('business-count-label').textContent = `(${records.length})`;
      document.getElementById('business-records-count-label').textContent = `(${records.length})`;

      const total = records.reduce((s, r) => s + r.total_expenditure, 0);
      const laborTotal = records.reduce((s, r) => s + r.labor_cost, 0);
      const itemsTotal = records.reduce((s, r) => s + r.items_total, 0);
      const avg = records.length ? total / records.length : 0;

      document.getElementById('business-stats').innerHTML = `
        <div class="stat-card"><div class="label">Business records</div><div class="value">${records.length}</div></div>
        <div class="stat-card"><div class="label">Labor cost</div><div class="value">${peso(laborTotal)}</div></div>
        <div class="stat-card"><div class="label">Items cost</div><div class="value">${peso(itemsTotal)}</div></div>
        <div class="stat-card accent"><div class="label">Total Expenditure</div><div class="value">${peso(total)}</div></div>
      `;

      const byType = {};
      records.forEach(r => byType[r.plantation_type] = (byType[r.plantation_type] || 0) + r.total_expenditure);
      document.getElementById('business-by-type').innerHTML = barRows(byType, total);

      const out = document.getElementById('business-table');
      if (records.length === 0) {
        out.innerHTML =
          `<div class="empty-state"><span class="glyph">🏭</span>No business expenses logged yet.</div>`;
        return;
      }
      const list = [...records].sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id);
      out.innerHTML = `<div class="table-wrapper"><table>
        <thead><tr><th>ID</th><th>Date</th><th>Type</th><th>Yield</th><th>Revenue</th><th class="num">Workers</th><th class="num">Items</th><th class="num">Total</th><th></th></tr></thead>
        <tbody>
          ${list.map(r => `
            <tr>
              <td class="num">#${r.id}</td>
              <td>${r.date}</td>
              <td><span class="tag">${r.plantation_type}</span></td>
              <td>${r.yield_kg ? r.yield_kg + ' kg' : '—'}</td>
              <td>${r.revenue ? peso(r.revenue) : '—'}</td>
              <td class="num">${r.workers.length}</td>
              <td class="num">${r.items.length}</td>
              <td class="num">${peso(r.total_expenditure)}</td>
              <td class="actions-cell">
                <button class="btn-ghost btn-sm" onclick="editRecord(${r.id})" aria-label="Edit record #${r.id}">Edit</button>
                <button class="btn-ghost btn-sm" onclick="viewRecordReceipts(${r.id})" aria-label="View receipts for record #${r.id}">🧾 Receipts</button>
                <button class="btn-danger btn-sm" onclick="confirmDelete(${r.id})" aria-label="Delete record #${r.id}">Delete</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table></div>`;
    }

    function renderPersonal() {
      document.getElementById('personal-count-label').textContent = `(${personalRecords.length})`;
      const total = personalRecords.reduce((s, r) => s + r.total_expenditure, 0);
      const avg = personalRecords.length ? total / personalRecords.length : 0;
      document.getElementById('personal-stats').innerHTML = `
        <div class="stat-card"><div class="label">Personal expenses</div><div class="value">${personalRecords.length}</div></div>
        <div class="stat-card accent"><div class="label">Total Expenditure</div><div class="value">${peso(total)}</div></div>
        <div class="stat-card"><div class="label">Average per entry</div><div class="value">${peso(avg)}</div></div>
      `;

      const out = document.getElementById('personal-table');
      if (personalRecords.length === 0) {
        out.innerHTML =
          `<div class="empty-state"><span class="glyph">👤</span>No personal expenses logged yet.</div>`;
        return;
      }
      const list = [...personalRecords].sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id);
      out.innerHTML = `<div class="table-wrapper"><table>
        <thead><tr><th>ID</th><th>Date</th><th>Items</th><th class="num">Total</th><th></th></tr></thead>
        <tbody>
          ${list.map(r => `
            <tr>
              <td class="num">#${r.id}</td>
              <td>${r.date}</td>
              <td class="mini-list">${r.items.map(i => `<div>${escapeHtml(i.name)}: ${i.quantity} ${i.unit} × ${peso(i.price_per_unit)} = ${peso(i.cost)}</div>`).join('') || '<div>—</div>'}</td>
              <td class="num">${peso(r.total_expenditure)}</td>
              <td class="actions-cell">
                <button class="btn-ghost btn-sm" onclick="editPersonalRecord(${r.id})" aria-label="Edit personal expense #${r.id}">Edit</button>
                <button class="btn-danger btn-sm" onclick="confirmDeletePersonal(${r.id})" aria-label="Delete personal expense #${r.id}">Delete</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table></div>`;
    }
    function computeHarvestShares(plantationType) {
      const pct = harvestSharePct[plantationType] || 0;
      const gross = computeGrossSalesFor(plantationType);
      const sales = netSalesFor(plantationType);
      const pool = round2(sales * pct);
      const ownerAmount = round2(sales - pool);

      const workerDays = {};
      records.filter(r => r.plantation_type === plantationType).forEach(r => {
        r.workers.forEach(w => {
          const days = laborDaysOf(w);
          if (!workerDays[w.name]) workerDays[w.name] = 0;
          workerDays[w.name] += days;
        });
      });

      const totalDays = Object.values(workerDays).reduce((s, d) => s + d, 0);

      const shares = Object.entries(workerDays).map(([name, days]) => {
        const proportion = totalDays > 0 ? days / totalDays : 0;
        return { name, days, proportion, share: round2(pool * proportion) };
      }).sort((a, b) => b.share - a.share);

      return { pct, gross, sales, pool, ownerAmount, totalDays, shares };
    }

    function renderShareTable(elId, plantationType) {
      const { pct, gross, sales, pool, ownerAmount, totalDays, shares } = computeHarvestShares(plantationType);
      const out = document.getElementById(elId);
      if (!out) return;

      if (gross === 0) {
        out.innerHTML = `<div class="empty-state"><span class="glyph">🌴</span>No Gross Sales recorded yet for ${plantationType}. Log a Sell Produce sale, encode Yield &amp; Pricing for this plantation, or set a manual fallback figure in the Reports tab.</div>`;
        return;
      }
      if (sales <= 0) {
        out.innerHTML = `<div class="empty-state"><span class="glyph">🌴</span>Net Sales for ${plantationType} is ${peso(sales)} (Gross Sales ${peso(gross)} − Expenditure). No share pool until Net Sales is positive.</div>`;
        return;
      }
      if (shares.length === 0) {
        out.innerHTML = `<div class="empty-state"><span class="glyph">👷</span>No worker labor-days logged yet for ${plantationType}.</div>`;
        return;
      }

      out.innerHTML = `
        <div class="table-wrapper"><table>
          <thead><tr><th>Worker</th><th class="num">Labor-days</th><th class="num">% of pool</th><th class="num">Share (₱)</th></tr></thead>
          <tbody>
            ${shares.map(s => `
              <tr>
                <td>${escapeHtml(s.name)}</td>
                <td class="num">${s.days}</td>
                <td class="num">${(s.proportion * 100).toFixed(1)}%</td>
                <td class="num">${peso(s.share)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table></div>
        <div class="totals-strip">
          <div class="t">Gross Sales<b>${peso(gross)}</b></div>
          <div class="t">Net Sales<b>${peso(sales)}</b></div>
          <div class="t">Workers' pool (${(pct * 100).toFixed(0)}%)<b>${peso(pool)}</b></div>
          <div class="t">Owner's share (${(100 - pct * 100).toFixed(0)}%)<b>${peso(ownerAmount)}</b></div>
          <div class="t">Total labor-days<b>${totalDays}</b></div>
          <div class="t grand">Sum of worker shares<b>${peso(shares.reduce((s, x) => s + x.share, 0))}</b></div>
        </div>
      `;
    }

    function renderSharePctInputs() {
      const introEl = document.getElementById('shares-intro-text');
      if (introEl) {
        introEl.textContent =
          "Set what percentage of each plantation's Net Sales (Gross Sales minus that plantation's Total Expenditure) goes to workers as a harvest share — the remainder stays with you as the owner. Gross Sales flows in automatically the moment you encode a quantity for that plantation, whether through Sell Produce or Encode Yield & Pricing, so there's nothing to re-enter here. Set a percentage below and the share pool plus each worker's cut appears automatically wherever that plantation has a positive Net Sales. Each worker's cut is proportional to the labor-days (full days + half days × 0.5) they logged there.";
      }
      const out = document.getElementById('share-pct-inputs');
      if (!out) return;
      out.innerHTML = PLANTATION_TYPES.map(type => {
        const pctValue = Math.round((harvestSharePct[type] ?? 0) * 1000) / 10;
        return `
        <div class="field">
          <label for="share-pct-${type}">${type} — Worker share (%)</label>
          <input type="number" min="0" max="100" step="0.1" class="share-pct-input" id="share-pct-${type}" data-type="${type}" value="${pctValue}">
        </div>`;
      }).join('');
    }

    async function saveHarvestSharePcts() {
      document.querySelectorAll('.share-pct-input').forEach(inp => {
        const pctPercent = Math.min(100, Math.max(0, parseFloat(inp.value) || 0));
        harvestSharePct[inp.dataset.type] = round2(pctPercent) / 100;
      });
      const success = await saveHarvestSharePctsToStorage();
      if (success) {
        showToast('✅ Worker share percentages updated', 'success');
        renderShares();
      }
    }

    function renderShares() {
      renderSharePctInputs();

      const active = PLANTATION_TYPES
        .map(type => ({ type, ...computeHarvestShares(type) }))
        .filter(d => d.pct > 0);

      const summaryOut = document.getElementById('share-summary-cards');
      if (summaryOut) {
        if (active.length === 0) {
          summaryOut.innerHTML = `<div class="empty-state"><span class="glyph">📊</span>No plantation currently has a worker share percentage set above 0% — set one above to switch on harvest sharing for it.</div>`;
        } else {
          summaryOut.innerHTML = active.map(d => `
            <div class="plantation-total-card">
              <div class="p-name">${plantationEmoji(d.type)} ${d.type} <span class="share-pct-badge">${(d.pct * 100).toFixed(0)}% to workers</span></div>
              <div class="p-total">${peso(d.pool)}</div>
              <div class="p-meta">${(d.pct * 100).toFixed(0)}% of ${peso(d.sales)} Net Sales (Gross ${peso(d.gross)}) · ${d.shares.length} worker${d.shares.length !== 1 ? 's' : ''}</div>
              <div class="p-meta">Owner keeps ${(100 - d.pct * 100).toFixed(0)}% = ${peso(d.ownerAmount)}</div>
            </div>
          `).join('');
        }
      }

      const tablesOut = document.getElementById('share-tables-out');
      if (!tablesOut) return;
      if (active.length === 0) {
        tablesOut.innerHTML = '';
        return;
      }
      tablesOut.innerHTML = active.map(d => {
        const safeId = 'share-table-' + d.type.replace(/[^a-zA-Z0-9]+/g, '-');
        return `
        <div class="card">
          <h2>${plantationEmoji(d.type)} ${d.type} — ${(d.pct * 100).toFixed(0)}% worker share <span class="n">(${d.shares.length} worker${d.shares.length !== 1 ? 's' : ''})</span></h2>
          <div id="${safeId}"></div>
        </div>`;
      }).join('');

      active.forEach(d => {
        const safeId = 'share-table-' + d.type.replace(/[^a-zA-Z0-9]+/g, '-');
        renderShareTable(safeId, d.type);
      });
    }

    function computeCapitalFor(type) {
      const existing = startingCapital[type] || 0;
      const entries = capitalEntries.filter(c => c.plantation_type === type);
      const additional = entries.reduce((s, c) => s + c.amount, 0);
      const spent = records.filter(r => r.plantation_type === type).reduce((s, r) => s + r.total_expenditure, 0);
      const current = round2(existing + additional - spent);
      return { existing, additional, entries, spent, current };
    }

    function renderCapitalInputs() {
      const out = document.getElementById('capital-inputs');
      out.innerHTML = PLANTATION_TYPES.map(type => {
        const isDev = DEV_PHASE_TYPES.includes(type);
        return `
        <div class="field">
          <label for="cap-${type}">${type} — Existing Capital (₱) ${isDev ? '<span class="tag">🚧 In development</span>' : ''}</label>
          <input type="number" min="0" step="0.01" class="cap-existing-input" id="cap-${type}" data-type="${type}" value="${startingCapital[type] ?? 0}">
        </div>`;
      }).join('');
    }

    async function saveStartingCapital() {
      document.querySelectorAll('.cap-existing-input').forEach(inp => {
        startingCapital[inp.dataset.type] = Math.max(0, parseFloat(inp.value) || 0);
      });
      const success = await saveCapitalToStorage();
      if (success) {
        showToast("✅ Existing Capital updated", 'success');
        renderCapital();
      }
    }

    function renderCapitalCards() {
      const out = document.getElementById('capital-cards');
      let grandExisting = 0,
        grandAdditional = 0,
        grandSpent = 0,
        grandCurrent = 0;
      out.innerHTML = PLANTATION_TYPES.map(type => {
        const isDev = DEV_PHASE_TYPES.includes(type);
        const { existing, additional, spent, current } = computeCapitalFor(type);
        grandExisting += existing;
        grandAdditional += additional;
        grandSpent += spent;
        grandCurrent += current;
        return `
          <div class="plantation-total-card">
            <div class="p-name">${type} ${isDev ? '<span class="tag">🚧 In development</span>' : ''}</div>
            <div class="p-total ${current < 0 ? '' : ''}" style="${current < 0 ? 'color:var(--bad);' : ''}">${peso(current)}</div>
            <div class="p-meta">Existing ${peso(existing)} + Additional/Loans ${peso(additional)} − Spent ${peso(spent)}</div>
          </div>
        `;
      }).join('');

      document.getElementById('capital-grand-strip').innerHTML = `
        <div class="t">Total Existing Capital<b>${peso(grandExisting)}</b></div>
        <div class="t">Total Additional/Loans<b>${peso(grandAdditional)}</b></div>
        <div class="t">Total Expenditure<b>${peso(grandSpent)}</b></div>
        <div class="t grand">Total Current Capital<b>${peso(grandCurrent)}</b></div>
      `;
    }

    async function addCapitalEntry() {
      const type = document.getElementById('cap-type').value;
      const kind = document.getElementById('cap-kind').value;
      const amount = Math.max(0, parseFloat(document.getElementById('cap-amount').value) || 0);
      const date = document.getElementById('cap-date').value || todayISO();
      const note = document.getElementById('cap-note').value.trim();

      if (amount <= 0) {
        showToast('⚠️ Enter an amount greater than zero', 'error');
        return;
      }

      const entry = { id: nextCapitalId++, plantation_type: type, kind, amount, date, note };
      capitalEntries.push(entry);
      const success = await saveCapitalToStorage();
      if (success) {
        showToast(`✅ ${kind === 'loan' ? 'Loan' : 'Additional capital'} of ${peso(amount)} added for ${type}`,
        'success');
        document.getElementById('cap-amount').value = '';
        document.getElementById('cap-note').value = '';
        renderCapital();
      }
    }

    function confirmDeleteCapitalEntry(id) {
      pendingCapitalDeleteId = id;
      const e = capitalEntries.find(c => c.id === id);
      document.getElementById('confirm-modal-title').textContent = 'Delete this entry?';
      document.getElementById('confirm-modal-text').textContent =
        `${e.kind === 'loan' ? 'Loan' : 'Additional capital'} of ${peso(e.amount)} for ${e.plantation_type} on ${e.date} will be permanently removed.`;
      document.getElementById('confirm-yes').textContent = 'Delete';
      document.getElementById('confirm-yes').onclick = async () => {
        document.getElementById('confirm-modal').classList.remove('open');
        capitalEntries = capitalEntries.filter(c => c.id !== pendingCapitalDeleteId);
        await saveCapitalToStorage();
        showToast('🗑️ Entry deleted', 'success');
        renderCapital();
      };
      document.getElementById('confirm-modal').classList.add('open');
    }

    function renderCapitalEntriesTable() {
      document.getElementById('capital-entries-count-label').textContent = `(${capitalEntries.length})`;
      const out = document.getElementById('capital-entries-table');
      if (capitalEntries.length === 0) {
        out.innerHTML =
          `<div class="empty-state"><span class="glyph">💰</span>No additional capital or loans logged yet.</div>`;
        return;
      }
      const list = [...capitalEntries].sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id);
      out.innerHTML = `<div class="table-wrapper"><table>
        <thead><tr><th>ID</th><th>Date</th><th>Plantation</th><th>Type</th><th class="num">Amount</th><th>Note</th><th></th></tr></thead>
        <tbody>
          ${list.map(e => `
            <tr>
              <td class="num">#${e.id}</td>
              <td>${e.date}</td>
              <td><span class="tag">${e.plantation_type}</span></td>
              <td>${e.kind === 'loan' ? '<span class="tag loss">Loan</span>' : '<span class="tag profit">Additional Capital</span>'}</td>
              <td class="num">${peso(e.amount)}</td>
              <td class="mini-list">${e.note ? escapeHtml(e.note) : '—'}</td>
              <td class="actions-cell"><button class="btn-danger btn-sm" onclick="confirmDeleteCapitalEntry(${e.id})" aria-label="Delete capital entry #${e.id}">Delete</button></td>
            </tr>
          `).join('')}
        </tbody>
      </table></div>`;
    }

    function renderCapital() {
      renderCapitalInputs();
      renderCapitalCards();
      renderCapitalEntriesTable();
    }

    function computeAdvanceWorkerTotals() {
      const totals = {};
      cashAdvances.forEach(a => {
        if (!totals[a.name]) totals[a.name] = { borrowed: 0, repaid: 0 };
        totals[a.name].borrowed += a.amount;
        if (a.repaid) totals[a.name].repaid += a.amount;
      });
      return Object.entries(totals).map(([name, t]) => ({
        name,
        borrowed: t.borrowed,
        repaid: t.repaid,
        outstanding: round2(t.borrowed - t.repaid)
      })).sort((a, b) => b.outstanding - a.outstanding);
    }

    async function saveAdvance() {
      const name = document.getElementById('adv-name').value.trim();
      const amount = Math.max(0, parseFloat(document.getElementById('adv-amount').value) || 0);
      const date = document.getElementById('adv-date').value || todayISO();
      const type = document.getElementById('adv-type').value;
      const note = document.getElementById('adv-note').value.trim();

      if (!name) {
        showToast('⚠️ Enter the worker\'s name', 'error');
        return;
      }
      if (amount <= 0) {
        showToast('⚠️ Enter an amount greater than zero', 'error');
        return;
      }
      if (isFutureDate(date)) {
        showToast('⚠️ Date cannot be in the future', 'error');
        return;
      }

      let success = false;
      if (editingAdvanceId) {
        const idx = cashAdvances.findIndex(a => a.id === editingAdvanceId);
        if (idx !== -1) {
          cashAdvances[idx] = { ...cashAdvances[idx], name, amount, date, plantation_type: type, note };
          success = await saveAdvancesToStorage();
          if (success) showToast(`✅ Cash advance #${editingAdvanceId} updated`, 'success');
        }
      } else {
        const advance = { id: nextAdvanceId++, name, amount, date, plantation_type: type, note, repaid: false };
        cashAdvances.push(advance);
        success = await saveAdvancesToStorage();
        if (success) showToast(`✅ Cash advance for ${name} recorded`, 'success');
      }

      if (success) {
        cancelEditAdvance();
        renderAdvances();
      }
    }

    function editAdvance(id) {
      const a = cashAdvances.find(x => x.id === id);
      if (!a) return;
      editingAdvanceId = id;
      document.getElementById('adv-name').value = a.name;
      document.getElementById('adv-amount').value = a.amount;
      document.getElementById('adv-date').value = a.date;
      document.getElementById('adv-type').value = a.plantation_type || '';
      document.getElementById('adv-note').value = a.note || '';
      document.getElementById('adv-save-btn').textContent = 'Update cash advance';
      document.getElementById('adv-cancel-btn').style.display = '';
    }

    function cancelEditAdvance() {
      editingAdvanceId = null;
      document.getElementById('adv-name').value = '';
      document.getElementById('adv-amount').value = '';
      document.getElementById('adv-date').value = todayISO();
      document.getElementById('adv-type').value = '';
      document.getElementById('adv-note').value = '';
      document.getElementById('adv-save-btn').textContent = '+ Add cash advance';
      document.getElementById('adv-cancel-btn').style.display = 'none';
    }

    async function toggleAdvanceRepaid(id) {
      const idx = cashAdvances.findIndex(a => a.id === id);
      if (idx === -1) return;
      cashAdvances[idx].repaid = !cashAdvances[idx].repaid;
      await saveAdvancesToStorage();
      showToast(cashAdvances[idx].repaid ? '✅ Marked as repaid' : '↩️ Marked as outstanding', 'success');
      renderAdvances();
    }

    function confirmDeleteAdvance(id) {
      pendingAdvanceDeleteId = id;
      const a = cashAdvances.find(x => x.id === id);
      document.getElementById('confirm-modal-title').textContent = 'Delete cash advance?';
      document.getElementById('confirm-modal-text').textContent =
        `Cash advance of ${peso(a.amount)} for ${a.name} on ${a.date} will be permanently removed.`;
      document.getElementById('confirm-yes').textContent = 'Delete';
      document.getElementById('confirm-yes').onclick = async () => {
        document.getElementById('confirm-modal').classList.remove('open');
        cashAdvances = cashAdvances.filter(a => a.id !== pendingAdvanceDeleteId);
        await saveAdvancesToStorage();
        showToast('🗑️ Cash advance deleted', 'success');
        renderAdvances();
      };
      document.getElementById('confirm-modal').classList.add('open');
    }

    function renderAdvanceWorkerSummary() {
      const out = document.getElementById('advance-worker-summary');
      const totals = computeAdvanceWorkerTotals();
      if (totals.length === 0) {
        out.innerHTML =
          `<div class="empty-state"><span class="glyph">👷</span>No cash advances logged yet.</div>`;
        return;
      }
      out.innerHTML = `<div class="table-wrapper"><table>
        <thead><tr><th>Worker</th><th class="num">Total borrowed</th><th class="num">Repaid</th><th class="num">Outstanding</th></tr></thead>
        <tbody>
          ${totals.map(t => `
            <tr>
              <td>${escapeHtml(t.name)}</td>
              <td class="num">${peso(t.borrowed)}</td>
              <td class="num">${peso(t.repaid)}</td>
              <td class="num">${t.outstanding > 0 ? `<span class="tag loss">${peso(t.outstanding)}</span>` : peso(t.outstanding)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table></div>`;
    }

    function renderAdvances() {
      document.getElementById('advances-count-label').textContent = `(${cashAdvances.length})`;
      renderAdvanceWorkerSummary();
      const out = document.getElementById('advances-table');
      if (cashAdvances.length === 0) {
        out.innerHTML =
          `<div class="empty-state"><span class="glyph">💵</span>No cash advances logged yet.</div>`;
        return;
      }
      const list = [...cashAdvances].sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id);
      out.innerHTML = `<div class="table-wrapper"><table>
        <thead><tr><th>ID</th><th>Date</th><th>Worker</th><th>Plantation</th><th class="num">Amount</th><th>Note</th><th>Status</th><th></th></tr></thead>
        <tbody>
          ${list.map(a => `
            <tr>
              <td class="num">#${a.id}</td>
              <td>${a.date}</td>
              <td>${escapeHtml(a.name)}</td>
              <td>${a.plantation_type ? `<span class="tag">${a.plantation_type}</span>` : '—'}</td>
              <td class="num">${peso(a.amount)}</td>
              <td class="mini-list">${a.note ? escapeHtml(a.note) : '—'}</td>
              <td>${a.repaid ? '<span class="tag profit">Repaid</span>' : '<span class="tag loss">Outstanding</span>'}</td>
              <td class="actions-cell">
                <button class="btn-ghost btn-sm" onclick="toggleAdvanceRepaid(${a.id})" aria-label="${a.repaid ? 'Mark as unpaid' : 'Mark as repaid'}">${a.repaid ? 'Mark unpaid' : 'Mark repaid'}</button>
                <button class="btn-ghost btn-sm" onclick="editAdvance(${a.id})" aria-label="Edit advance #${a.id}">Edit</button>
                <button class="btn-danger btn-sm" onclick="confirmDeleteAdvance(${a.id})" aria-label="Delete advance #${a.id}">Delete</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table></div>`;
    }
    function renderNetSalesInputs() {
      const out = document.getElementById('net-sales-inputs');
      out.innerHTML = PLANTATION_TYPES.map(type => {
        const auto = computeGrossSalesFor(type);
        const ns = netSalesFor(type);
        const sourceLabel = grossSalesSourceLabelFor(type);
        return `
        <div class="field">
          <label for="ns-${type}">${type} — Manual fallback Gross Sales (₱)</label>
          <input type="number" min="0" step="0.01" class="ns-input" id="ns-${type}" data-type="${type}" value="${grossSales[type] ?? 0}">
          <div class="net-sales-readout">Gross Sales in use: <b>${peso(auto)}</b> <span style="color:var(--faint)">(${sourceLabel})</span> · Net Sales: <b class="${ns < 0 ? 'neg' : ''}">${peso(ns)}</b></div>
        </div>
      `;
      }).join('');
    }

    async function saveNetSales() {
      document.querySelectorAll('.ns-input').forEach(inp => {
        grossSales[inp.dataset.type] = Math.max(0, parseFloat(inp.value) || 0);
      });
      const success = await saveSalesToStorage();
      if (success) {
        showToast("✅ Manual fallback Gross Sales updated", 'success');
        renderReports();
      }
    }

    function renderPlantationTotals() {
      const out = document.getElementById('plantation-totals');
      const today = todayISO();
      out.innerHTML = PLANTATION_TYPES.map(type => {
        const recs = records.filter(r => r.plantation_type === type);
        const total = recs.reduce((s, r) => s + r.total_expenditure, 0);
        const workerCount = recs.reduce((s, r) => s + r.workers.length, 0);
        const dates = recs.map(r => r.date).sort();
        const rangeText = dates.length ? `${dates[0]} → ${today}` : `No records yet`;
        const gross = computeGrossSalesFor(type);
        const netSales = netSalesFor(type);
        const totalYield = recs.reduce((s, r) => s + (r.yield_kg || 0), 0);
        return `
          <div class="plantation-total-card">
            <div class="p-name">${type}</div>
            <div class="p-total">${peso(total)}</div>
            <div class="p-meta">${recs.length} record${recs.length !== 1 ? 's' : ''} · ${workerCount} worker log${workerCount !== 1 ? 's' : ''}</div>
            ${totalYield > 0 ? `<div class="p-meta">Total yield: ${totalYield} kg</div>` : ''}
            <div class="p-range">${rangeText}</div>
            <div class="p-profit ${netSales >= 0 ? 'pos' : 'neg'}">Gross Sales ${peso(gross)} − Expenditure ${peso(total)} = <strong>Net Sales ${peso(netSales)}</strong></div>
            ${totalYield > 0 ? `<div class="p-meta">Cost per kg: ${peso(round2(total / totalYield))}</div>` : ''}
          </div>
        `;
      }).join('');
    }

    function computeItemPurchaseTally() {
      const tally = {};
      const addFrom = (list) => {
        list.forEach(r => {
          r.items.forEach(i => {
            if (!i.name) return;
            const key = i.name.trim().toLowerCase();
            if (!key) return;
            if (!tally[key]) tally[key] = { name: i.name.trim(), count: 0, totalQty: 0, totalCost: 0, units: {} };
            tally[key].count += 1;
            tally[key].totalQty += (i.quantity || 0);
            tally[key].totalCost += (i.cost || 0);
            const u = i.unit || '';
            tally[key].units[u] = (tally[key].units[u] || 0) + (i.quantity || 0);
          });
        });
      };
      addFrom(records);
      addFrom(personalRecords);
      return Object.values(tally).sort((a, b) => b.count - a.count || b.totalCost - a.totalCost);
    }

    function computeTopItem() {
      const arr = computeItemPurchaseTally();
      return arr.length ? arr[0] : null;
    }

    function barRows(map, total, sortByKey = false) {
      let entries = Object.entries(map);
      entries = sortByKey ? entries.sort((a, b) => a[0].localeCompare(b[0])) : entries.sort((a, b) => b[1] - a[1]);
      const max = entries.length ? Math.max(...entries.map(e => e[1])) : 1;
      if (entries.length === 0) return `<div class="empty-state">No data yet.</div>`;
      return entries.map(([key, val]) => `
        <div class="bar-row">
          <div class="label" title="${key}">${key}</div>
          <div class="bar-track"><div class="bar-fill" style="width:${(val / max * 100).toFixed(1)}%"></div></div>
          <div class="amt">${peso(val)}</div>
        </div>`).join('');
    }

    function renderReports() {
      renderNetSalesInputs();
      renderPlantationTotals();

      const total = records.reduce((s, r) => s + r.total_expenditure, 0);
      const totalLabor = records.reduce((s, r) => s + r.labor_cost, 0);
      const totalItems = records.reduce((s, r) => s + r.items_total, 0);
      const totalWorkers = records.reduce((s, r) => s + r.workers.length, 0);
      const avg = records.length ? total / records.length : 0;
      const totalGross = PLANTATION_TYPES.reduce((s, t) => s + computeGrossSalesFor(t), 0);
      const totalNetSales = PLANTATION_TYPES.reduce((s, t) => s + netSalesFor(t), 0);
      const totalYield = records.reduce((s, r) => s + (r.yield_kg || 0), 0);

      document.getElementById('stat-cards').innerHTML = `
        <div class="stat-card"><div class="label">Business records</div><div class="value">${records.length}</div></div>
        <div class="stat-card"><div class="label">Labor cost</div><div class="value">${peso(totalLabor)}</div></div>
        <div class="stat-card"><div class="label">Items cost</div><div class="value">${peso(totalItems)}</div></div>
        <div class="stat-card accent"><div class="label">Business expenditure</div><div class="value">${peso(total)}</div></div>
        <div class="stat-card"><div class="label">Total Gross Sales</div><div class="value">${peso(totalGross)}</div></div>
        <div class="stat-card ${totalNetSales >= 0 ? 'good' : 'bad'}"><div class="label">Total Net Sales / Profit</div><div class="value">${peso(totalNetSales)}</div></div>
        <div class="stat-card"><div class="label">Total yield</div><div class="value">${totalYield} kg</div></div>
        <div class="stat-card"><div class="label">Average per record</div><div class="value">${peso(avg)}</div></div>
      `;

      const byType = {};
      records.forEach(r => byType[r.plantation_type] = (byType[r.plantation_type] || 0) + r.total_expenditure);
      document.getElementById('report-by-type').innerHTML = barRows(byType, total);

      const byMonth = {};
      records.forEach(r => { const m = r.date.slice(0, 7);
        byMonth[m] = (byMonth[m] || 0) + r.total_expenditure; });
      document.getElementById('report-by-month').innerHTML = barRows(byMonth, total, true);

      const byWorker = {};
      records.forEach(r => r.workers.forEach(w => byWorker[w.name] = (byWorker[w.name] || 0) + laborCostOf(w)));
      const topWorkers = Object.entries(byWorker).sort((a, b) => b[1] - a[1]).slice(0, 10);
      const maxWorker = topWorkers.length ? topWorkers[0][1] : 1;
      document.getElementById('report-top-workers').innerHTML = topWorkers.length ? `
        ${topWorkers.map(([name, cost]) => `
          <div class="bar-row">
            <div class="label" title="${name}">${escapeHtml(name)}</div>
            <div class="bar-track"><div class="bar-fill" style="width:${(cost / maxWorker * 100).toFixed(1)}%"></div></div>
            <div class="amt">${peso(cost)}</div>
          </div>`).join('')}
      ` : `<div class="empty-state">No worker data yet.</div>`;

      const topItems = computeItemPurchaseTally().slice(0, 10);
      const maxItemCount = topItems.length ? topItems[0].count : 1;
      document.getElementById('report-top-items').innerHTML = topItems.length ? `
        ${topItems.map(it => {
          const unitSummary = Object.entries(it.units).map(([u, q]) => `${q} ${u || 'unit'}`).join(', ');
          return `
          <div class="bar-row">
            <div class="label" title="${it.name}">${escapeHtml(it.name)}</div>
            <div class="bar-track"><div class="bar-fill" style="width:${(it.count / maxItemCount * 100).toFixed(1)}%"></div></div>
            <div class="amt">${it.count}× · ${peso(it.totalCost)}</div>
          </div>`;
        }).join('')}
      ` : `<div class="empty-state">No item purchases logged yet.</div>`;

      if (records.length === 0) {
        document.getElementById('report-by-type').innerHTML = `<div class="empty-state">No records yet.</div>`;
        document.getElementById('report-by-month').innerHTML = `<div class="empty-state">No records yet.</div>`;
      }

      renderCharts();
      renderYieldRevenueChart();
    }

    function renderYieldRevenueChart() {
      const canvas = document.getElementById('yieldRevenueChart');
      if (!canvas) return;

      const data = PLANTATION_TYPES.map(type => {
        const recs = records.filter(r => r.plantation_type === type);
        const totalYield = recs.reduce((s, r) => s + (r.yield_kg || 0), 0);
        const override = plantationPricing[type];
        const totalRevenue = (override && override.totalYield > 0)
          ? round2(override.totalYield * (override.currentPricePerKg || 0))
          : round2(recs.reduce((s, r) => s + (r.revenue || 0), 0));
        return { type, totalYield, totalRevenue };
      }).filter(d => d.totalYield > 0 || d.totalRevenue > 0);

      if (chartInstances.yieldRevenue) { chartInstances.yieldRevenue.destroy(); chartInstances.yieldRevenue = null; }

      if (data.length === 0) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
      }

      const ctx = canvas.getContext('2d');
      chartInstances.yieldRevenue = new Chart(ctx, {
        data: {
          labels: data.map(d => d.type),
          datasets: [
            {
              type: 'bar',
              label: 'Yield (kg)',
              data: data.map(d => d.totalYield),
              backgroundColor: 'rgba(75,139,190,0.6)',
              borderColor: '#4b8bbe',
              borderWidth: 1,
              yAxisID: 'yYield'
            },
            {
              type: 'bar',
              label: 'Gross Income (₱)',
              data: data.map(d => d.totalRevenue),
              backgroundColor: 'rgba(255,108,196,0.6)',
              borderColor: '#ff6cc4',
              borderWidth: 1,
              yAxisID: 'yRevenue'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { labels: { color: '#e9edf5' } }
          },
          scales: {
            yYield: {
              type: 'linear',
              position: 'left',
              ticks: { color: '#8991ab', callback: v => v + ' kg' },
              grid: { color: 'rgba(42,46,66,0.5)' }
            },
            yRevenue: {
              type: 'linear',
              position: 'right',
              ticks: { color: '#8991ab', callback: v => '₱' + v },
              grid: { display: false }
            },
            x: { ticks: { color: '#8991ab', font: { size: 9 } } }
          }
        }
      });
    }

    function renderDashboard() {
      const total = records.reduce((s, r) => s + r.total_expenditure, 0);
      const totalYield = records.reduce((s, r) => s + (r.yield_kg || 0), 0);
      const totalRevenue = records.reduce((s, r) => s + (r.revenue || 0), 0);
      const totalNetSales = PLANTATION_TYPES.reduce((s, t) => s + netSalesFor(t), 0);
      const personalTotal = personalRecords.reduce((s, r) => s + r.total_expenditure, 0);

      document.getElementById('dashboard-stats').innerHTML = `
        <div class="stat-card"><div class="label">Total Business Records</div><div class="value">${records.length}</div></div>
        <div class="stat-card"><div class="label">Total Business Expenses</div><div class="value">${peso(total)}</div></div>
        <div class="stat-card good"><div class="label">Total Yield</div><div class="value">${totalYield} kg</div></div>
        <div class="stat-card ${totalNetSales >= 0 ? 'good' : 'bad'}"><div class="label">Net Sales / Profit</div><div class="value">${peso(totalNetSales)}</div></div>
        <div class="stat-card"><div class="label">Diary Entries</div><div class="value">${activityRecords.length}</div></div>
        <div class="stat-card"><div class="label">Total Personal Expenses</div><div class="value personal">${peso(personalTotal)}</div></div>
        <div class="stat-card"><div class="label">Total Business and Personal Expenses</div><div class="value merged">${peso(total + personalTotal)}</div></div>
      `;

      renderCharts();
      renderWeather();
    }

    function renderDailyChart() {
      const byDate = {};
      records.forEach(r => {
        if (!byDate[r.date]) byDate[r.date] = { expenditure: 0, earnings: 0 };
        byDate[r.date].expenditure += r.total_expenditure;
        byDate[r.date].earnings += (r.revenue || 0);
      });
      const dates = Object.keys(byDate).sort().slice(-30);
      const label = document.getElementById('daily-chart-range-label');
      if (label) {
        label.textContent = dates.length ? `${dates[0]} → ${dates[dates.length - 1]}` : 'no activity yet';
      }
      const canvas = document.getElementById('dailyChart');
      if (!canvas) return;
      if (dates.length === 0) {
        if (chartInstances.daily) { chartInstances.daily.destroy();
          chartInstances.daily = null; }
        return;
      }

      const ctx = canvas.getContext('2d');
      if (chartInstances.daily) chartInstances.daily.destroy();
      chartInstances.daily = new Chart(ctx, {
        data: {
          labels: dates,
          datasets: [
            {
              type: 'bar',
              label: 'Expenditure',
              data: dates.map(d => byDate[d].expenditure),
              backgroundColor: 'rgba(226,104,95,0.55)',
              borderColor: '#e2685f',
              borderWidth: 1,
              order: 2
            },
            {
              type: 'line',
              label: 'Earnings',
              data: dates.map(d => byDate[d].earnings),
              borderColor: '#4caf82',
              backgroundColor: 'rgba(76,175,130,0.15)',
              borderWidth: 2,
              tension: 0.3,
              pointRadius: 3,
              fill: true,
              order: 1
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { labels: { color: '#e9edf5' } }
          },
          scales: {
            y: {
              ticks: { color: '#8991ab', callback: v => '₱' + v },
              grid: { color: 'rgba(42,46,66,0.5)' }
            },
            x: { ticks: { color: '#8991ab', font: { size: 9 } } }
          }
        }
      });
    }

    function renderCharts() {
      renderDailyChart();

      const monthlyData = {};
      records.forEach(r => {
        const m = r.date.slice(0, 7);
        monthlyData[m] = (monthlyData[m] || 0) + r.total_expenditure;
      });
      const months = Object.keys(monthlyData).sort();
      const monthlyValues = months.map(m => monthlyData[m]);

      if (Object.keys(monthlyData).length > 0) {
        const ctx = document.getElementById('monthlyChart').getContext('2d');
        if (chartInstances.monthly) chartInstances.monthly.destroy();
        chartInstances.monthly = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: months,
            datasets: [{
              label: 'Monthly Expenditure',
              data: monthlyValues,
              backgroundColor: 'rgba(75, 139, 190, 0.6)',
              borderColor: '#4b8bbe',
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { labels: { color: '#e9edf5' } }
            },
            scales: {
              y: {
                ticks: { color: '#8991ab', callback: v => '₱' + v },
                grid: { color: 'rgba(42,46,66,0.5)' }
              },
              x: { ticks: { color: '#8991ab' } }
            }
          }
        });
      }

      const plantationData = {};
      records.forEach(r => {
        plantationData[r.plantation_type] = (plantationData[r.plantation_type] || 0) + r.total_expenditure;
      });
      const plantationLabels = Object.keys(plantationData);
      const plantationValues = Object.values(plantationData);

      if (plantationLabels.length > 0) {
        const ctx2 = document.getElementById('plantationChart').getContext('2d');
        if (chartInstances.plantation) chartInstances.plantation.destroy();
        chartInstances.plantation = new Chart(ctx2, {
          type: 'doughnut',
          data: {
            labels: plantationLabels,
            datasets: [{
              data: plantationValues,
              backgroundColor: [
                '#4b8bbe', '#6fb1e0', '#e6399b', '#ff6cc4',
                '#4caf82', '#e2685f', '#f5a623', '#9c7bd6', '#3fbfb0', '#d6a24b'
              ]
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'right',
                labels: { color: '#e9edf5', font: { size: 11 } }
              }
            }
          }
        });
      }

      const profitData = PLANTATION_TYPES.map(type => {
        const spend = records.filter(r => r.plantation_type === type).reduce((s, r) => s + r.total_expenditure, 0);
        const ns = netSalesFor(type);
        return { type, profit: ns };
      }).filter(d => d.profit !== 0 || records.some(r => r.plantation_type === d.type));

      if (profitData.length > 0) {
        const ctx3 = document.getElementById('profitChart').getContext('2d');
        if (chartInstances.profit) chartInstances.profit.destroy();
        chartInstances.profit = new Chart(ctx3, {
          type: 'bar',
          data: {
            labels: profitData.map(d => d.type),
            datasets: [{
              label: 'Net Sales / Profit',
              data: profitData.map(d => d.profit),
              backgroundColor: profitData.map(d => d.profit >= 0 ? 'rgba(76,175,130,0.6)' :
                'rgba(226,104,95,0.6)'),
              borderColor: profitData.map(d => d.profit >= 0 ? '#4caf82' : '#e2685f'),
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { labels: { color: '#e9edf5' } }
            },
            scales: {
              y: {
                ticks: { color: '#8991ab', callback: v => '₱' + v },
                grid: { color: 'rgba(42,46,66,0.5)' }
              },
              x: { ticks: { color: '#8991ab', font: { size: 10 } } }
            }
          }
        });
      }
    }
    function exportCSV() {
      if (records.length === 0) { showToast("📭 No business records to export", 'error'); return; }
      const rows = [
        ["ID", "Date", "Plantation Type", "Worker Name", "Job Description", "Days", "Payment Period",
          "Worker Daily Wage", "Paid", "Worker Labor Cost", "Items Count", "Items Total", "Total Expenditure",
          "Yield (kg)", "Revenue"
        ]
      ];
      records.forEach(r => {
        if (r.workers.length) {
          r.workers.forEach(w => {
            rows.push([r.id, r.date, r.plantation_type, w.name, w.job_description, w.full_days, w.payment_period || "daily",
              w.daily_wage, w.paid ? "Paid" : "Unpaid", round2(laborCostOf(w)), r.items.length, r.items_total, r.total_expenditure,
              r.yield_kg || 0, r.revenue || 0
            ]);
          });
        } else {
          rows.push([r.id, r.date, r.plantation_type, "", "", 0, "daily", r.daily_wage, "", 0, r.items.length,
            r.items_total, r.total_expenditure, r.yield_kg || 0, r.revenue || 0
          ]);
        }
      });
      downloadCSV(rows, 'plantation_business_export.csv');
      showToast("✅ Business CSV exported", 'success');
    }

    function exportPersonalCSV() {
      if (personalRecords.length === 0) { showToast("📭 No personal expenses to export", 'error'); return; }
      const rows = [
        ["ID", "Date", "Item", "Qty", "Unit", "Price/Unit", "Cost"]
      ];
      personalRecords.forEach(r => {
        if (r.items.length) {
          r.items.forEach(i => rows.push([r.id, r.date, i.name, i.quantity, i.unit, i.price_per_unit, i.cost]));
        } else {
          rows.push([r.id, r.date, "", 0, "", 0, r.total_expenditure]);
        }
      });
      downloadCSV(rows, 'personal_expenses_export.csv');
      showToast("✅ Personal CSV exported", 'success');
    }

    function exportFilteredCSV() {
      const filtered = getFilteredRecords();
      if (filtered.length === 0) { showToast("📭 No records match the current filters", 'error'); return; }
      const rows = [
        ["ID", "Date", "Plantation Type", "Worker Name", "Job Description", "Days", "Payment Period",
          "Worker Daily Wage", "Paid", "Worker Labor Cost", "Items Count", "Items Total", "Total Expenditure",
          "Yield (kg)", "Revenue"
        ]
      ];
      filtered.forEach(r => {
        if (r.workers.length) {
          r.workers.forEach(w => {
            rows.push([r.id, r.date, r.plantation_type, w.name, w.job_description, w.full_days, w.payment_period || "daily",
              w.daily_wage, w.paid ? "Paid" : "Unpaid", round2(laborCostOf(w)), r.items.length, r.items_total, r.total_expenditure,
              r.yield_kg || 0, r.revenue || 0
            ]);
          });
        } else {
          rows.push([r.id, r.date, r.plantation_type, "", "", 0, "daily", r.daily_wage, "", 0, r.items.length,
            r.items_total, r.total_expenditure, r.yield_kg || 0, r.revenue || 0
          ]);
        }
      });
      downloadCSV(rows, 'plantation_filtered_export.csv');
      showToast("✅ Filtered CSV exported", 'success');
    }

    function exportBackup() {
      const data = {
        version: 3,
        exported: new Date().toISOString(),
        records: records,
        personalRecords: personalRecords,
        netSales: grossSales,
        nextId: nextId,
        nextPersonalId: nextPersonalId,
        startingCapital: startingCapital,
        capitalEntries: capitalEntries,
        nextCapitalId: nextCapitalId,
        cashAdvances: cashAdvances,
        nextAdvanceId: nextAdvanceId,
        harvestSharePct: harvestSharePct,
        lenderLoans: lenderLoans,
        nextLoanId: nextLoanId,
        plantationPricing: plantationPricing,
        plantationSales: plantationSales,
        nextSaleId: nextSaleId,
        activityRecords: activityRecords,
        nextActivityId: nextActivityId
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `plantation_backup_${todayISO()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast("✅ Full backup downloaded", 'success');
    }

    function importBackup(event) {
      const file = event.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const data = JSON.parse(e.target.result);
          if (!data.records || !data.personalRecords) {
            showToast('⚠️ Invalid backup file format', 'error');
            return;
          }
          setLoading(true);
          records = data.records || [];
          personalRecords = data.personalRecords || [];
          grossSales = data.netSales || {};
          nextId = data.nextId || (records.length ? Math.max(...records.map(r => r.id)) + 1 : 1);
          nextPersonalId = data.nextPersonalId || (personalRecords.length ? Math.max(...personalRecords.map(r =>
            r.id)) + 1 : 1);
          startingCapital = data.startingCapital || startingCapital;
          capitalEntries = data.capitalEntries || capitalEntries;
          nextCapitalId = data.nextCapitalId || nextCapitalId;
          cashAdvances = data.cashAdvances || cashAdvances;
          nextAdvanceId = data.nextAdvanceId || nextAdvanceId;
          harvestSharePct = data.harvestSharePct || harvestSharePct;
          lenderLoans = data.lenderLoans || lenderLoans;
          nextLoanId = data.nextLoanId || nextLoanId;
          plantationPricing = data.plantationPricing || plantationPricing;
          plantationSales = data.plantationSales || plantationSales;
          nextSaleId = data.nextSaleId || (plantationSales.length ? Math.max(...plantationSales.map(s => s.id)) + 1 : 1);
          activityRecords = data.activityRecords || activityRecords;
          nextActivityId = data.nextActivityId || (activityRecords.length ? Math.max(...activityRecords.map(a => a.id)) + 1 : 1);
          PLANTATION_TYPES.forEach(type => {
            if (startingCapital[type] === undefined) startingCapital[type] = DEFAULT_STARTING_CAPITAL[
              type] ?? 0;
            if (harvestSharePct[type] === undefined) harvestSharePct[type] = DEFAULT_HARVEST_SHARE_PCT[type] ?? 0;
          });

          await saveToStorage();
          await savePersonalToStorage();
          await saveSalesToStorage();
          await saveCapitalToStorage();
          await saveAdvancesToStorage();
          await saveHarvestSharePctsToStorage();
          await saveLoansToStorage();
          await savePlantationPricingToStorage();
          await savePlantationSalesToStorage();
          await window.storage.set('activity-records', JSON.stringify({ records: activityRecords, nextId: nextActivityId }), false);
          setLoading(false);
          refreshAll();
          showToast(`✅ Backup restored: ${records.length} business, ${personalRecords.length} personal records, ${activityRecords.length} diary entries`,
            'success');
        } catch (err) {
          setLoading(false);
          showToast('⚠️ Failed to import backup: ' + err.message, 'error');
        }
      };
      reader.readAsText(file);
      event.target.value = '';
    }

    function downloadCSV(rows, filename) {
      const csv = rows.map(row => row.map(cell => {
        const s = String(cell);
        return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
      }).join(',')).join('\n');
      const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }

    function saveDraft() {
      if (!isFormDirty && !editingId && !editingPersonalId) return;

      const draft = {
        category: currentCategory,
        type: document.getElementById('f-type')?.value,
        date: document.getElementById('f-date')?.value,
        wage: document.getElementById('f-wage')?.value,
        yield: document.getElementById('f-yield')?.value,
        pricePerKg: document.getElementById('f-price-per-kg')?.value,
        revenue: document.getElementById('f-revenue')?.value,
        workers: collectWorkers(),
        items: collectItems(),
        personalDate: document.getElementById('p-date')?.value,
        personalItems: collectPersonalItems(),
        editingId: editingId,
        editingPersonalId: editingPersonalId
      };

      localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
      const dot = document.getElementById('auto-save-dot');
      dot.className = 'dot';
      document.getElementById('auto-save-text').textContent = 'Draft saved';
    }

    function checkDraft() {
      const draftData = localStorage.getItem(DRAFT_KEY);
      if (!draftData) return;

      try {
        const draft = JSON.parse(draftData);
        const hasContent = draft.workers?.length > 0 || draft.items?.length > 0 || draft.personalItems?.length > 0;
        if (hasContent) {
          showToast('💾 Draft found. Click "Load draft" to restore.', 'info', 4000);
        }
      } catch (e) {}
    }

    function loadDraft() {
      const draftData = localStorage.getItem(DRAFT_KEY);
      if (!draftData) {
        showToast('📭 No draft found', 'info');
        return;
      }

      try {
        const draft = JSON.parse(draftData);

        if (draft.category === 'personal') {
          setCategory('personal');
          if (draft.personalDate) document.getElementById('p-date').value = draft.personalDate;
          document.getElementById('p-item-rows').innerHTML = '';
          draft.personalItems?.forEach(i => addPersonalItemRow(i));
          if (draft.personalItems?.length === 0) addPersonalItemRow();
          updatePersonalTotals();
          if (draft.editingPersonalId) {
            editingPersonalId = draft.editingPersonalId;
            document.getElementById('form-title').textContent =
              `Editing personal expense #${draft.editingPersonalId}`;
            document.getElementById('save-btn').textContent = "Update record";
          }
        } else {
          setCategory('business');
          if (draft.type) { document.getElementById('f-type').value = draft.type; document.getElementById('f-type')._refreshCustomLabel?.(); }
          if (draft.date) document.getElementById('f-date').value = draft.date;
          if (draft.wage) document.getElementById('f-wage').value = draft.wage;
          if (draft.yield) document.getElementById('f-yield').value = draft.yield;
          if (draft.pricePerKg) document.getElementById('f-price-per-kg').value = draft.pricePerKg;
          if (draft.revenue) document.getElementById('f-revenue').value = draft.revenue;
          document.getElementById('worker-rows').innerHTML = '';
          document.getElementById('item-rows').innerHTML = '';
          draft.workers?.forEach(w => addWorkerRow(w));
          draft.items?.forEach(i => addItemRow(i));
          if (draft.workers?.length === 0) addWorkerRow();
          if (draft.items?.length === 0) addItemRow();
          updateTotals();
          if (draft.editingId) {
            editingId = draft.editingId;
            document.getElementById('form-title').textContent = `Editing record #${draft.editingId}`;
            document.getElementById('save-btn').textContent = "Update record";
          }
        }

        isFormDirty = false;
        updateAutoSaveIndicator();
        showToast('✅ Draft loaded', 'success');
      } catch (e) {
        showToast('⚠️ Failed to load draft', 'error');
      }
    }

    function updateBottomIndicators() {
      const businessTotal = records.reduce((s, r) => s + r.total_expenditure, 0);
      const personalTotal = personalRecords.reduce((s, r) => s + r.total_expenditure, 0);
      document.getElementById('bottom-business-total').textContent = peso(businessTotal);
      document.getElementById('bottom-personal-total').textContent = peso(personalTotal);
      document.getElementById('bottom-merged-total').textContent = peso(businessTotal + personalTotal);

      const topItem = computeTopItem();
      document.getElementById('bottom-top-item').textContent = topItem ? topItem.name : '—';
      document.getElementById('bottom-top-item-sub').textContent = topItem ?
        `${topItem.count}× purchased · ${peso(topItem.totalCost)}` :
        'no purchases yet';
    }
    async function saveInventoryItem() {
      const name = document.getElementById('inv-name').value.trim();
      const unit = document.getElementById('inv-unit').value;
      const stock = Math.max(0, parseFloat(document.getElementById('inv-stock').value) || 0);
      const threshold = Math.max(0, parseFloat(document.getElementById('inv-threshold').value) || 0);
      const supplier = document.getElementById('inv-supplier').value.trim();

      if (!name) {
        showToast('⚠️ Enter an item name', 'error');
        return;
      }

      const existingIdx = inventoryItems.findIndex(i => i.name.toLowerCase() === name.toLowerCase());
      if (existingIdx !== -1) {
        inventoryItems[existingIdx] = { ...inventoryItems[existingIdx], name, unit, stock, threshold, supplier };
      } else {
        inventoryItems.push({ id: nextInventoryId++, name, unit, stock, threshold, supplier });
      }

      const success = await saveInventoryToStorage();
      if (success) {
        showToast(`✅ Inventory updated for ${name}`, 'success');
        document.getElementById('inv-name').value = '';
        document.getElementById('inv-stock').value = '';
        document.getElementById('inv-threshold').value = '';
        document.getElementById('inv-supplier').value = '';
        renderInventory();
      }
    }

    function editInventoryItem(id) {
      const item = inventoryItems.find(i => i.id === id);
      if (!item) return;
      document.getElementById('inv-name').value = item.name;
      document.getElementById('inv-unit').value = item.unit;
      document.getElementById('inv-stock').value = item.stock;
      document.getElementById('inv-threshold').value = item.threshold;
      document.getElementById('inv-supplier').value = item.supplier || '';
    }

    function confirmDeleteInventoryItem(id) {
      pendingInventoryDeleteId = id;
      const item = inventoryItems.find(i => i.id === id);
      document.getElementById('confirm-modal-title').textContent = 'Delete inventory item?';
      document.getElementById('confirm-modal-text').textContent = `"${item.name}" will be removed from your inventory list.`;
      document.getElementById('confirm-yes').textContent = 'Delete';
      document.getElementById('confirm-yes').onclick = async () => {
        document.getElementById('confirm-modal').classList.remove('open');
        inventoryItems = inventoryItems.filter(i => i.id !== pendingInventoryDeleteId);
        await saveInventoryToStorage();
        showToast('🗑️ Inventory item deleted', 'success');
        renderInventory();
      };
      document.getElementById('confirm-modal').classList.add('open');
    }

    function renderInventory() {
      document.getElementById('inventory-count-label').textContent = `(${inventoryItems.length})`;
      const out = document.getElementById('inventory-table');
      if (inventoryItems.length === 0) {
        out.innerHTML = `<div class="empty-state"><span class="glyph">📦</span>No inventory items tracked yet — add one above.</div>`;
        return;
      }
      const purchaseTally = computeItemPurchaseTally();
      const tallyMap = {};
      purchaseTally.forEach(t => tallyMap[t.name.toLowerCase()] = t);
      const list = [...inventoryItems].sort((a, b) => a.name.localeCompare(b.name));
      out.innerHTML = `<div class="table-wrapper"><table>
        <thead><tr><th>Item</th><th class="num">Current stock</th><th class="num">Reorder point</th><th>Supplier</th><th class="num">Total ever purchased</th><th></th></tr></thead>
        <tbody>
          ${list.map(i => {
            const low = i.stock <= i.threshold;
            const everBought = tallyMap[i.name.toLowerCase()];
            return `
            <tr>
              <td>${escapeHtml(i.name)} ${low ? '<span class="tag loss">⚠ Reorder</span>' : ''}</td>
              <td class="num">${i.stock} ${i.unit}</td>
              <td class="num">${i.threshold} ${i.unit}</td>
              <td>${i.supplier ? escapeHtml(i.supplier) : '—'}</td>
              <td class="num">${everBought ? `${everBought.totalQty} ${i.unit}` : '—'}</td>
              <td class="actions-cell">
                <button class="btn-ghost btn-sm" onclick="editInventoryItem(${i.id})" aria-label="Edit ${escapeHtml(i.name)}">Edit</button>
                <button class="btn-danger btn-sm" onclick="confirmDeleteInventoryItem(${i.id})" aria-label="Delete ${escapeHtml(i.name)}">Delete</button>
              </td>
            </tr>`;
          }).join('')}
        </tbody>
      </table></div>`;
    }

    function computePayroll() {
      const from = document.getElementById('pr-from').value;
      const to = document.getElementById('pr-to').value;
      const type = document.getElementById('pr-type').value;

      if (!from || !to) {
        showToast('⚠️ Pick a period start and end date', 'error');
        return;
      }
      if (from > to) {
        showToast('⚠️ Period start must be before period end', 'error');
        return;
      }

      let recs = records.filter(r => r.date >= from && r.date <= to);
      if (type) recs = recs.filter(r => r.plantation_type === type);

      const workerData = {};
      recs.forEach(r => {
        r.workers.forEach((w, wi) => {
          if (!workerData[w.name]) workerData[w.name] = { gross: 0, alreadyPaid: 0, unpaidGross: 0, unpaidEntries: [] };
          const cost = laborCostOf(w);
          workerData[w.name].gross += cost;
          if (w.paid) {
            workerData[w.name].alreadyPaid += cost;
          } else {
            workerData[w.name].unpaidGross += cost;
            workerData[w.name].unpaidEntries.push({ recordId: r.id, workerIndex: wi });
          }
        });
      });

      const advanceTotals = computeAdvanceWorkerTotals();
      const advanceMap = {};
      advanceTotals.forEach(a => advanceMap[a.name] = a.outstanding);

      const rows = Object.entries(workerData).map(([name, d]) => {
        const outstanding = advanceMap[name] || 0;
        const deduction = Math.min(d.unpaidGross, outstanding);
        return {
          name,
          gross: round2(d.gross),
          alreadyPaid: round2(d.alreadyPaid),
          unpaidGross: round2(d.unpaidGross),
          deduction: round2(deduction),
          net: round2(d.unpaidGross - deduction),
          unpaidEntries: d.unpaidEntries
        };
      }).filter(r => r.unpaidGross > 0).sort((a, b) => b.unpaidGross - a.unpaidGross);

      payrollPreview = { from, to, type, rows };

      const card = document.getElementById('payroll-preview-card');
      const rangeLabel = document.getElementById('payroll-preview-range');
      const out = document.getElementById('payroll-preview-table');

      if (rows.length === 0) {
        card.style.display = '';
        rangeLabel.textContent = `(${from} → ${to}${type ? ' · ' + type : ''})`;
        out.innerHTML = `<div class="empty-state"><span class="glyph">🧾</span>No unpaid labor for this period${type ? ' on ' + type : ''} — everything logged is already marked paid, or there's no labor logged.</div>`;
        return;
      }

      card.style.display = '';
      rangeLabel.textContent = `(${from} → ${to}${type ? ' · ' + type : ''})`;
      out.innerHTML = `<div class="table-wrapper"><table>
        <thead><tr><th>Worker</th><th class="num">Already paid</th><th class="num">Unpaid (due)</th><th class="num">Advance deducted</th><th class="num">Net pay</th></tr></thead>
        <tbody>
          ${rows.map(r => `
            <tr>
              <td>${escapeHtml(r.name)}</td>
              <td class="num">${r.alreadyPaid > 0 ? `<span class="tag profit">${peso(r.alreadyPaid)}</span>` : peso(0)}</td>
              <td class="num">${peso(r.unpaidGross)}</td>
              <td class="num">${r.deduction > 0 ? `<span class="tag loss">${peso(r.deduction)}</span>` : peso(0)}</td>
              <td class="num"><strong>${peso(r.net)}</strong></td>
            </tr>
          `).join('')}
        </tbody>
      </table></div>
      <div class="totals-strip">
        <div class="t">Already paid<b>${peso(rows.reduce((s, r) => s + r.alreadyPaid, 0))}</b></div>
        <div class="t">Total unpaid due<b>${peso(rows.reduce((s, r) => s + r.unpaidGross, 0))}</b></div>
        <div class="t">Total deducted<b>${peso(rows.reduce((s, r) => s + r.deduction, 0))}</b></div>
        <div class="t grand">Total net pay<b>${peso(rows.reduce((s, r) => s + r.net, 0))}</b></div>
      </div>`;
    }

    async function savePayslips() {
      if (!payrollPreview || payrollPreview.rows.length === 0) {
        showToast('⚠️ Compute a payroll preview first', 'error');
        return;
      }
      const { from, to, type, rows } = payrollPreview;
      const issued = todayISO();

      rows.forEach(r => {
        payslips.push({
          id: nextPayslipId++,
          worker: r.name,
          periodStart: from,
          periodEnd: to,
          plantation_type: type || null,
          gross: r.unpaidGross,
          deducted: r.deduction,
          net: r.net,
          issued_date: issued
        });
      });

      rows.filter(r => r.deduction > 0).forEach(r => {
        let remaining = r.deduction;
        cashAdvances.filter(a => a.name === r.name && !a.repaid).forEach(a => {
          if (remaining <= 0) return;
          if (a.amount <= remaining) {
            a.repaid = true;
            remaining -= a.amount;
          }
        });
      });

      rows.forEach(r => {
        r.unpaidEntries.forEach(ue => {
          const rec = records.find(x => x.id === ue.recordId);
          if (rec && rec.workers[ue.workerIndex]) {
            rec.workers[ue.workerIndex].paid = true;
          }
        });
      });

      await saveToStorage();
      await savePayslipsToStorage();
      await saveAdvancesToStorage();
      showToast(`✅ ${rows.length} payslip(s) saved for ${from} → ${to} — those workers are now marked paid`, 'success');
      document.getElementById('payroll-preview-card').style.display = 'none';
      payrollPreview = null;
      renderPayrollHistory();
      renderAdvances();
      refreshAll();
    }

    function renderPayrollHistory() {
      document.getElementById('payslip-history-count-label').textContent = `(${payslips.length})`;
      const out = document.getElementById('payslip-history-table');
      if (payslips.length === 0) {
        out.innerHTML = `<div class="empty-state"><span class="glyph">🧾</span>No payslips saved yet.</div>`;
        return;
      }
      const list = [...payslips].sort((a, b) => b.periodEnd.localeCompare(a.periodEnd) || b.id - a.id);
      out.innerHTML = `<div class="table-wrapper"><table>
        <thead><tr><th>Worker</th><th>Period</th><th>Plantation</th><th class="num">Gross</th><th class="num">Deducted</th><th class="num">Net</th><th>Issued</th></tr></thead>
        <tbody>
          ${list.map(p => `
            <tr>
              <td>${escapeHtml(p.worker)}</td>
              <td>${p.periodStart} → ${p.periodEnd}</td>
              <td>${p.plantation_type ? `<span class="tag">${p.plantation_type}</span>` : 'All'}</td>
              <td class="num">${peso(p.gross)}</td>
              <td class="num">${peso(p.deducted)}</td>
              <td class="num"><strong>${peso(p.net)}</strong></td>
              <td>${p.issued_date}</td>
            </tr>
          `).join('')}
        </tbody>
      </table></div>`;
    }

    async function addPlanningTask() {
      const title = document.getElementById('plan-title').value.trim();
      const type = document.getElementById('plan-type').value;
      const date = document.getElementById('plan-date').value;
      const note = document.getElementById('plan-note').value.trim();

      if (!title) {
        showToast('⚠️ Enter a task name', 'error');
        return;
      }
      if (!date) {
        showToast('⚠️ Pick a due date', 'error');
        return;
      }

      planningTasks.push({ id: nextPlanningId++, title, plantation_type: type, due_date: date, note, done: false });
      await savePlanningToStorage();
      showToast(`✅ Task "${title}" added`, 'success');
      document.getElementById('plan-title').value = '';
      document.getElementById('plan-note').value = '';
      renderPlanning();
    }

    async function togglePlanningDone(id) {
      const idx = planningTasks.findIndex(t => t.id === id);
      if (idx === -1) return;
      planningTasks[idx].done = !planningTasks[idx].done;
      await savePlanningToStorage();
      renderPlanning();
      renderDashboard();
    }

    function confirmDeletePlanningTask(id) {
      pendingPlanningDeleteId = id;
      const t = planningTasks.find(x => x.id === id);
      document.getElementById('confirm-modal-title').textContent = 'Delete task?';
      document.getElementById('confirm-modal-text').textContent = `"${t.title}" will be permanently removed.`;
      document.getElementById('confirm-yes').textContent = 'Delete';
      document.getElementById('confirm-yes').onclick = async () => {
        document.getElementById('confirm-modal').classList.remove('open');
        planningTasks = planningTasks.filter(x => x.id !== pendingPlanningDeleteId);
        await savePlanningToStorage();
        showToast('🗑️ Task deleted', 'success');
        renderPlanning();
      };
      document.getElementById('confirm-modal').classList.add('open');
    }

    function renderPlanningTable() {
      document.getElementById('planning-count-label').textContent = `(${planningTasks.length})`;
      const out = document.getElementById('planning-table');
      if (planningTasks.length === 0) {
        out.innerHTML = `<div class="empty-state"><span class="glyph">🗓️</span>No tasks logged yet — add one above.</div>`;
        return;
      }
      const today = todayISO();
      const list = [...planningTasks].sort((a, b) => a.due_date.localeCompare(b.due_date));
      out.innerHTML = `<div class="table-wrapper"><table>
        <thead><tr><th></th><th>Task</th><th>Plantation</th><th>Due date</th><th>Note</th><th></th></tr></thead>
        <tbody>
          ${list.map(t => {
            const overdue = !t.done && t.due_date < today;
            return `
            <tr style="${t.done ? 'opacity:.5;' : ''}">
              <td><input type="checkbox" ${t.done ? 'checked' : ''} onchange="togglePlanningDone(${t.id})" aria-label="Mark ${escapeHtml(t.title)} done"></td>
              <td>${escapeHtml(t.title)} ${overdue ? '<span class="tag loss">Overdue</span>' : ''}</td>
              <td><span class="tag">${t.plantation_type}</span></td>
              <td>${t.due_date}</td>
              <td class="mini-list">${t.note ? escapeHtml(t.note) : '—'}</td>
              <td class="actions-cell"><button class="btn-danger btn-sm" onclick="confirmDeletePlanningTask(${t.id})" aria-label="Delete ${escapeHtml(t.title)}">Delete</button></td>
            </tr>`;
          }).join('')}
        </tbody>
      </table></div>`;
    }

    function currentMonthKey() {
      return todayISO().slice(0, 7);
    }

    function renderBudgetInputs() {
      document.getElementById('budget-month-label').textContent = `(${currentMonthKey()})`;
      const out = document.getElementById('budget-inputs');
      out.innerHTML = PLANTATION_TYPES.map(type => `
        <div class="field">
          <label for="budget-${type}">${type} — Monthly budget (₱)</label>
          <input type="number" min="0" step="0.01" class="budget-input" id="budget-${type}" data-type="${type}" value="${monthlyBudgets[type] ?? 0}">
        </div>
      `).join('');
    }

    async function saveBudgets() {
      document.querySelectorAll('.budget-input').forEach(inp => {
        monthlyBudgets[inp.dataset.type] = Math.max(0, parseFloat(inp.value) || 0);
      });
      const success = await saveBudgetsToStorage();
      if (success) {
        showToast('✅ Budgets updated', 'success');
        renderBudgetComparison();
      }
    }

    function renderBudgetComparison() {
      const month = currentMonthKey();
      const out = document.getElementById('budget-comparison');
      const rows = PLANTATION_TYPES.filter(t => (monthlyBudgets[t] || 0) > 0).map(type => {
        const actual = records.filter(r => r.plantation_type === type && r.date.startsWith(month))
          .reduce((s, r) => s + r.total_expenditure, 0);
        const budget = monthlyBudgets[type] || 0;
        const pct = budget > 0 ? (actual / budget * 100) : 0;
        return { type, budget, actual, pct };
      });

      if (rows.length === 0) {
        out.innerHTML = `<div class="empty-state">Set a monthly budget above to see comparisons.</div>`;
        return;
      }

      out.innerHTML = rows.map(r => `
        <div class="bar-row">
          <div class="label" title="${r.type}">${r.type}</div>
          <div class="bar-track"><div class="bar-fill" style="width:${Math.min(100, r.pct).toFixed(1)}%; ${r.pct > 100 ? 'background:var(--bad);' : ''}"></div></div>
          <div class="amt">${peso(r.actual)} / ${peso(r.budget)}</div>
        </div>
      `).join('');
    }

    function renderPlanning() {
      renderBudgetInputs();
      renderBudgetComparison();
      renderPlanningTable();
    }
    function computeAlerts() {
      const alerts = [];
      const today = todayISO();

      PLANTATION_TYPES.forEach(type => {
        const { current } = computeCapitalFor(type);
        if (current < 0) {
          alerts.push({ level: 'bad', glyph: '💸', title: `${type} capital is negative`,
            detail: `Current Capital: ${peso(current)} — consider injecting additional capital or a loan.` });
        }
        const ns = netSalesFor(type);
        if (computeGrossSalesFor(type) > 0 && ns < 0) {
          alerts.push({ level: 'bad', glyph: '📉', title: `${type} Net Sales is negative`,
            detail: `Net Sales: ${peso(ns)} — expenditure has outpaced Gross Sales for this plantation.` });
        }
      });

      computeAdvanceWorkerTotals().forEach(a => {
        if (a.outstanding <= 0) return;
        const oldestUnpaid = cashAdvances.filter(c => c.name === a.name && !c.repaid)
          .sort((x, y) => x.date.localeCompare(y.date))[0];
        if (!oldestUnpaid) return;
        const daysOld = Math.floor((new Date(today) - new Date(oldestUnpaid.date)) / 86400000);
        if (daysOld >= 14) {
          alerts.push({ level: 'warning', glyph: '💵', title: `${a.name} has an unpaid cash advance`,
            detail: `${peso(a.outstanding)} outstanding, oldest borrowed ${daysOld} days ago (${oldestUnpaid.date}).` });
        }
      });

      lenderLoans.filter(l => !l.paid).forEach(l => {
        const daysOld = Math.floor((new Date(today) - new Date(l.date)) / 86400000);
        if (daysOld >= 30) {
          const totals = computeLoanTotals(l);
          alerts.push({ level: 'warning', glyph: '💳', title: `Loan from ${l.lender} is still unpaid`,
            detail: `${peso(totals.totalPayable)} total owed (principal ${peso(l.principal)} + ${l.interestRate}% interest), borrowed ${daysOld} days ago (${l.date}).` });
        }
      });

      inventoryItems.forEach(i => {
        if (i.stock <= i.threshold) {
          alerts.push({ level: 'warning', glyph: '📦', title: `${i.name} is low on stock`,
            detail: `${i.stock} ${i.unit} left, reorder point is ${i.threshold} ${i.unit}${i.supplier ? ' · supplier: ' + i.supplier : ''}.` });
        }
      });

      planningTasks.forEach(t => {
        if (!t.done && t.due_date < today) {
          const daysOverdue = Math.floor((new Date(today) - new Date(t.due_date)) / 86400000);
          alerts.push({ level: 'warning', glyph: '🗓️', title: `"${t.title}" is overdue`,
            detail: `${t.plantation_type} — was due ${t.due_date} (${daysOverdue} day${daysOverdue !== 1 ? 's' : ''} ago).` });
        }
      });

      const unpaidTotal = {};
      records.forEach(r => {
        r.workers.forEach(w => {
          if (!w.paid) unpaidTotal[w.name] = (unpaidTotal[w.name] || 0) + laborCostOf(w);
        });
      });
      Object.entries(unpaidTotal).forEach(([name, amt]) => {
        if (amt > 0) {
          alerts.push({ level: 'warning', glyph: '🧾', title: `${name} has unpaid labor`,
            detail: `${peso(amt)} in logged work is not yet marked paid — visit the Workers tab or Payroll to settle it.` });
        }
      });

      return alerts;
    }

    function renderAlerts() {
      const alerts = computeAlerts();
      const card = document.getElementById('alerts-card');
      const listEl = document.getElementById('alerts-list');
      if (alerts.length === 0) {
        card.style.display = 'none';
        return;
      }
      card.style.display = '';
      document.getElementById('alerts-count-label').textContent = `(${alerts.length})`;
      listEl.innerHTML = alerts.map(a => `
        <div class="alert-row ${a.level}">
          <span class="glyph">${a.glyph}</span>
          <div class="body"><b>${escapeHtml(a.title)}</b><span>${escapeHtml(a.detail)}</span></div>
        </div>
      `).join('');
    }

    function exportPDFReport() {
      if (typeof window.jspdf === 'undefined') {
        showToast('⚠️ PDF library still loading — try again in a moment', 'error');
        return;
      }
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();
      let y = 16;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text('Valley and Creeks Farm — P&L Report', 14, y);
      y += 6;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text(`Generated ${todayISO()}`, 14, y);
      y += 10;

      const total = records.reduce((s, r) => s + r.total_expenditure, 0);
      const totalGross = PLANTATION_TYPES.reduce((s, t) => s + computeGrossSalesFor(t), 0);
      const totalNetSales = PLANTATION_TYPES.reduce((s, t) => s + netSalesFor(t), 0);
      const personalTotal = personalRecords.reduce((s, r) => s + r.total_expenditure, 0);
      const totalLoansOwed = lenderLoans.filter(l => !l.paid).reduce((s, l) => s + computeLoanTotals(l).totalPayable, 0);

      doc.setFont('helvetica', 'bold');
      doc.text('Overview', 14, y);
      y += 6;
      doc.setFont('helvetica', 'normal');
      [
        `Business expenditure: ${peso(total)}`,
        `Personal expenditure: ${peso(personalTotal)}`,
        `Total Gross Sales: ${peso(totalGross)}`,
        `Total Net Sales / Profit: ${peso(totalNetSales)}`,
        `Total owed to lenders (unpaid loans): ${peso(totalLoansOwed)}`
      ].forEach(line => { doc.text(line, 14, y); y += 6; });
      y += 4;

      doc.setFont('helvetica', 'bold');
      doc.text('By plantation', 14, y);
      y += 6;
      doc.setFont('helvetica', 'normal');
      PLANTATION_TYPES.forEach(type => {
        const spent = expenditureFor(type);
        const gross = computeGrossSalesFor(type);
        if (spent === 0 && gross === 0) return;
        const ns = netSalesFor(type);
        doc.text(`${type}: expenditure ${peso(spent)} · gross sales ${peso(gross)} · net sales ${peso(ns)}`, 14, y);
        y += 6;
        if (y > 270) { doc.addPage(); y = 16; }
      });

      y += 4;
      doc.setFont('helvetica', 'bold');
      doc.text('Top workers by labor cost', 14, y);
      y += 6;
      doc.setFont('helvetica', 'normal');
      const byWorker = {};
      records.forEach(r => r.workers.forEach(w => byWorker[w.name] = (byWorker[w.name] || 0) + laborCostOf(w)));
      Object.entries(byWorker).sort((a, b) => b[1] - a[1]).slice(0, 10).forEach(([name, cost]) => {
        doc.text(`${name}: ${peso(cost)}`, 14, y);
        y += 6;
        if (y > 270) { doc.addPage(); y = 16; }
      });

      doc.save(`valley-and-creeks-farm-report-${todayISO()}.pdf`);
      showToast('✅ PDF report downloaded', 'success');
    }

    const WEATHER_CODE_MAP = {
      0: ['☀️', 'Clear sky'], 1: ['🌤️', 'Mostly clear'], 2: ['⛅', 'Partly cloudy'], 3: ['☁️', 'Overcast'],
      45: ['🌫️', 'Fog'], 48: ['🌫️', 'Rime fog'],
      51: ['🌦️', 'Light drizzle'], 53: ['🌦️', 'Drizzle'], 55: ['🌧️', 'Dense drizzle'],
      61: ['🌦️', 'Light rain'], 63: ['🌧️', 'Rain'], 65: ['🌧️', 'Heavy rain'],
      66: ['🌧️', 'Freezing rain'], 67: ['🌧️', 'Heavy freezing rain'],
      71: ['🌨️', 'Light snow'], 73: ['🌨️', 'Snow'], 75: ['❄️', 'Heavy snow'],
      80: ['🌦️', 'Light showers'], 81: ['🌧️', 'Showers'], 82: ['⛈️', 'Violent showers'],
      95: ['⛈️', 'Thunderstorm'], 96: ['⛈️', 'Thunderstorm w/ hail'], 99: ['⛈️', 'Severe thunderstorm w/ hail']
    };

    function weatherCodeInfo(code) {
      return WEATHER_CODE_MAP[code] || ['🌡️', 'Unknown'];
    }

    async function loadWeatherSettings() {
      try {
        const res = await window.storage.get(WEATHER_LOCATION_KEY, false);
        if (res && res.value) weatherLocation = JSON.parse(res.value);
      } catch (e) { weatherLocation = null; }
      try {
        const res2 = await window.storage.get(WEATHER_STORAGE_KEY, false);
        if (res2 && res2.value) weatherCache = JSON.parse(res2.value);
      } catch (e) { weatherCache = null; }

      if (weatherLocation) {
        const latEl = document.getElementById('wx-lat');
        const lonEl = document.getElementById('wx-lon');
        if (latEl) latEl.value = weatherLocation.lat;
        if (lonEl) lonEl.value = weatherLocation.lon;
      }
    }

    function useMyLocationForWeather() {
      if (!navigator.geolocation) {
        showToast('⚠️ Location isn\'t available on this device/browser', 'error');
        return;
      }
      showToast('📍 Getting your location…', 'info');
      navigator.geolocation.getCurrentPosition(async (pos) => {
        document.getElementById('wx-lat').value = pos.coords.latitude.toFixed(4);
        document.getElementById('wx-lon').value = pos.coords.longitude.toFixed(4);
        await saveWeatherLocation();
      }, (err) => {
        showToast('⚠️ Could not get location: ' + err.message, 'error');
      }, { timeout: 10000 });
    }

    async function saveWeatherLocation() {
      const lat = parseFloat(document.getElementById('wx-lat').value);
      const lon = parseFloat(document.getElementById('wx-lon').value);
      if (isNaN(lat) || isNaN(lon)) {
        showToast('⚠️ Enter a valid latitude and longitude', 'error');
        return;
      }
      weatherLocation = { lat, lon };
      try {
        await window.storage.set(WEATHER_LOCATION_KEY, JSON.stringify(weatherLocation), false);
      } catch (e) { /* best-effort */ }
      await fetchWeather();
    }

    async function fetchWeather() {
      if (!weatherLocation) {
        renderWeather();
        return;
      }
      if (!navigator.onLine) {
        renderWeather();
        return;
      }
      try {
        const { lat, lon } = weatherLocation;
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto&forecast_days=4`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('Weather fetch failed');
        const data = await res.json();
        weatherCache = { data, fetched_at: new Date().toISOString(), lat, lon };
        try {
          await window.storage.set(WEATHER_STORAGE_KEY, JSON.stringify(weatherCache), false);
        } catch (e) { /* best-effort cache write */ }
      } catch (e) {
        console.warn('Weather fetch failed, falling back to cache:', e);
      }
      renderWeather();
    }

    function renderWeather() {
      const out = document.getElementById('weather-out');
      const label = document.getElementById('weather-updated-label');
      if (!out) return;

      if (!weatherLocation) {
        label.textContent = '';
        out.innerHTML = `<div class="empty-state"><span class="glyph">📍</span>Set your farm's coordinates above (or tap "Use my location") to see weather.</div>`;
        return;
      }

      if (!weatherCache || !weatherCache.data) {
        label.textContent = '';
        out.innerHTML = `<div class="empty-state"><span class="glyph">🌡️</span>${navigator.onLine ? 'Fetching weather…' : 'No cached weather yet — connect once to fetch it, then it\'ll be available offline.'}</div>`;
        return;
      }

      const isStale = !navigator.onLine;
      const fetchedDate = new Date(weatherCache.fetched_at);
      label.textContent = isStale
        ? `⚠ offline — showing cached data from ${fetchedDate.toLocaleString()}`
        : `updated ${fetchedDate.toLocaleString()}`;

      const cur = weatherCache.data.current;
      const daily = weatherCache.data.daily;
      const [curEmoji, curDesc] = weatherCodeInfo(cur.weather_code);

      let html = `
        <div class="plantation-total-card" style="margin-bottom:14px;">
          <div class="p-name">Current conditions</div>
          <div class="p-total">${curEmoji} ${Math.round(cur.temperature_2m)}°C</div>
          <div class="p-meta">${curDesc} · Humidity ${cur.relative_humidity_2m}% · Wind ${Math.round(cur.wind_speed_10m)} km/h</div>
        </div>
        <div class="grid cols-4">`;

      for (let i = 0; i < daily.time.length; i++) {
        const [emoji, desc] = weatherCodeInfo(daily.weather_code[i]);
        const d = new Date(daily.time[i]);
        const dayLabel = i === 0 ? 'Today' : d.toLocaleDateString(undefined, { weekday: 'short' });
        html += `
          <div class="stat-card">
            <div class="label">${dayLabel}</div>
            <div class="value" style="font-size:22px;">${emoji}</div>
            <div class="sub">${desc}</div>
            <div class="sub">${Math.round(daily.temperature_2m_max[i])}° / ${Math.round(daily.temperature_2m_min[i])}°C</div>
            <div class="sub">💧 ${daily.precipitation_probability_max[i]}%</div>
          </div>`;
      }
      html += `</div>`;

      if (isStale) {
        html += `<div style="font-size:11px;color:var(--faint);margin-top:10px;">Reconnect to the internet to refresh this automatically.</div>`;
      }

      out.innerHTML = html;
    }

    window.addEventListener('online', () => {
      if (weatherLocation) fetchWeather();
    });
    const LOAN_STORAGE_KEY = "plantation-lender-loans-v3";
    let lenderLoans = [];
    let nextLoanId = 1;
    let editingLoanId = null;

    async function loadLoans() {
      try {
        const res = await window.storage.get(LOAN_STORAGE_KEY, false);
        if (res && res.value) {
          const parsed = JSON.parse(res.value);
          lenderLoans = parsed.loans || [];
          nextLoanId = parsed.nextId || (lenderLoans.length ? Math.max(...lenderLoans.map(l => l.id)) + 1 : 1);
        }
      } catch (e) {
        console.warn('Failed to load lender loans:', e);
        lenderLoans = [];
        nextLoanId = 1;
      }
    }

    async function saveLoansToStorage() {
      try {
        await window.storage.set(LOAN_STORAGE_KEY, JSON.stringify({ loans: lenderLoans, nextId: nextLoanId }), false);
        return true;
      } catch (e) {
        console.error('Save lender loans error:', e);
        showToast('⚠️ Failed to save loan data.', 'error');
        return false;
      }
    }

    function computeLoanTotals(loan) {
      const interestAmount = round2(loan.principal * (loan.interestRate / 100));
      const totalPayable = round2(loan.principal + interestAmount);
      return { interestAmount, totalPayable };
    }

    function updateLoanPreview() {
      const principal = Math.max(0, parseFloat(document.getElementById('loan-principal').value) || 0);
      const rate = Math.max(0, parseFloat(document.getElementById('loan-rate').value) || 0);
      const { interestAmount, totalPayable } = computeLoanTotals({ principal, interestRate: rate });
      const out = document.getElementById('loan-preview');
      if (!out) return;
      if (principal <= 0) {
        out.innerHTML = '';
        return;
      }
      out.innerHTML = `Interest: <b>${peso(interestAmount)}</b> (${rate}% of ${peso(principal)}) &nbsp;·&nbsp; Total to pay lender: <b>${peso(totalPayable)}</b>`;
    }

    async function saveLoan() {
      const lender = document.getElementById('loan-lender').value.trim();
      const principal = Math.max(0, parseFloat(document.getElementById('loan-principal').value) || 0);
      const rate = Math.max(0, parseFloat(document.getElementById('loan-rate').value) || 0);
      const date = document.getElementById('loan-date').value || todayISO();
      const type = document.getElementById('loan-type').value;
      const note = document.getElementById('loan-note').value.trim();

      if (!lender) {
        showToast('⚠️ Enter the lender\'s name', 'error');
        return;
      }
      if (principal <= 0) {
        showToast('⚠️ Enter a principal amount greater than zero', 'error');
        return;
      }
      if (isFutureDate(date)) {
        showToast('⚠️ Date cannot be in the future', 'error');
        return;
      }

      let success = false;
      if (editingLoanId) {
        const idx = lenderLoans.findIndex(l => l.id === editingLoanId);
        if (idx !== -1) {
          lenderLoans[idx] = { ...lenderLoans[idx], lender, principal, interestRate: rate, date, plantation_type: type, note };
          success = await saveLoansToStorage();
          if (success) showToast(`✅ Loan #${editingLoanId} updated`, 'success');
        }
      } else {
        const loan = { id: nextLoanId++, lender, principal, interestRate: rate, date, plantation_type: type, note, paid: false };
        lenderLoans.push(loan);
        success = await saveLoansToStorage();
        if (success) showToast(`✅ Loan from ${lender} recorded`, 'success');
      }

      if (success) {
        cancelEditLoan();
        renderLoans();
      }
    }

    function editLoan(id) {
      const l = lenderLoans.find(x => x.id === id);
      if (!l) return;
      editingLoanId = id;
      document.getElementById('loan-lender').value = l.lender;
      document.getElementById('loan-principal').value = l.principal;
      document.getElementById('loan-rate').value = l.interestRate;
      document.getElementById('loan-date').value = l.date;
      document.getElementById('loan-type').value = l.plantation_type || '';
      document.getElementById('loan-note').value = l.note || '';
      document.getElementById('loan-save-btn').textContent = 'Update loan';
      document.getElementById('loan-cancel-btn').style.display = '';
      updateLoanPreview();
    }

    function cancelEditLoan() {
      editingLoanId = null;
      document.getElementById('loan-lender').value = '';
      document.getElementById('loan-principal').value = '';
      document.getElementById('loan-rate').value = '';
      document.getElementById('loan-date').value = todayISO();
      document.getElementById('loan-type').value = '';
      document.getElementById('loan-note').value = '';
      document.getElementById('loan-save-btn').textContent = '+ Add loan';
      document.getElementById('loan-cancel-btn').style.display = 'none';
      document.getElementById('loan-preview').innerHTML = '';
    }

    async function toggleLoanPaid(id) {
      const idx = lenderLoans.findIndex(l => l.id === id);
      if (idx === -1) return;
      lenderLoans[idx].paid = !lenderLoans[idx].paid;
      await saveLoansToStorage();
      showToast(lenderLoans[idx].paid ? '✅ Marked as fully paid' : '↩️ Marked as outstanding', 'success');
      renderLoans();
    }

    let pendingLoanDeleteId = null;
    function confirmDeleteLoan(id) {
      pendingLoanDeleteId = id;
      const l = lenderLoans.find(x => x.id === id);
      document.getElementById('confirm-modal-title').textContent = 'Delete loan?';
      document.getElementById('confirm-modal-text').textContent =
        `The loan from ${l.lender} (${peso(l.principal)} at ${l.interestRate}%) will be permanently removed.`;
      document.getElementById('confirm-yes').textContent = 'Delete';
      document.getElementById('confirm-yes').onclick = async () => {
        document.getElementById('confirm-modal').classList.remove('open');
        lenderLoans = lenderLoans.filter(l => l.id !== pendingLoanDeleteId);
        await saveLoansToStorage();
        showToast('🗑️ Loan deleted', 'success');
        renderLoans();
      };
      document.getElementById('confirm-modal').classList.add('open');
    }

    function renderLoanLenderSummary() {
      const out = document.getElementById('loan-lender-summary');
      if (!out) return;
      const byLender = {};
      lenderLoans.forEach(l => {
        const { totalPayable } = computeLoanTotals(l);
        if (!byLender[l.lender]) byLender[l.lender] = { totalPayable: 0, outstanding: 0, count: 0 };
        byLender[l.lender].totalPayable += totalPayable;
        byLender[l.lender].outstanding += l.paid ? 0 : totalPayable;
        byLender[l.lender].count += 1;
      });
      const entries = Object.entries(byLender).sort((a, b) => b[1].outstanding - a[1].outstanding);
      if (entries.length === 0) {
        out.innerHTML = `<div class="empty-state"><span class="glyph">💳</span>No lender loans logged yet.</div>`;
        return;
      }
      out.innerHTML = `<div class="table-wrapper"><table>
        <thead><tr><th>Lender</th><th class="num">Loans</th><th class="num">Total payable</th><th class="num">Still owed</th></tr></thead>
        <tbody>
          ${entries.map(([lender, t]) => `
            <tr>
              <td>${escapeHtml(lender)}</td>
              <td class="num">${t.count}</td>
              <td class="num">${peso(t.totalPayable)}</td>
              <td class="num">${t.outstanding > 0 ? `<span class="tag loss">${peso(t.outstanding)}</span>` : peso(0)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table></div>`;
    }

    function renderLoans() {
      const countLabel = document.getElementById('loans-count-label');
      if (countLabel) countLabel.textContent = `(${lenderLoans.length})`;
      renderLoanLenderSummary();
      const out = document.getElementById('loans-table');
      if (!out) return;
      if (lenderLoans.length === 0) {
        out.innerHTML = `<div class="empty-state"><span class="glyph">💳</span>No lender loans logged yet — add one above.</div>`;
        return;
      }
      const list = [...lenderLoans].sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id);
      out.innerHTML = `<div class="table-wrapper"><table>
        <thead><tr><th>ID</th><th>Date</th><th>Lender</th><th class="num">Principal</th><th class="num">Rate</th><th class="num">Interest</th><th class="num">Total payable</th><th>Plantation</th><th>Note</th><th>Status</th><th></th></tr></thead>
        <tbody>
          ${list.map(l => {
            const { interestAmount, totalPayable } = computeLoanTotals(l);
            return `
            <tr>
              <td class="num">#${l.id}</td>
              <td>${l.date}</td>
              <td>${escapeHtml(l.lender)}</td>
              <td class="num">${peso(l.principal)}</td>
              <td class="num">${l.interestRate}%</td>
              <td class="num">${peso(interestAmount)}</td>
              <td class="num"><strong>${peso(totalPayable)}</strong></td>
              <td>${l.plantation_type ? `<span class="tag">${l.plantation_type}</span>` : '—'}</td>
              <td class="mini-list">${l.note ? escapeHtml(l.note) : '—'}</td>
              <td>${l.paid ? '<span class="tag profit">Paid</span>' : '<span class="tag loss">Outstanding</span>'}</td>
              <td class="actions-cell">
                <button class="btn-ghost btn-sm" onclick="toggleLoanPaid(${l.id})" aria-label="${l.paid ? 'Mark as unpaid' : 'Mark as paid'}">${l.paid ? 'Mark unpaid' : 'Mark paid'}</button>
                <button class="btn-ghost btn-sm" onclick="editLoan(${l.id})" aria-label="Edit loan #${l.id}">Edit</button>
                <button class="btn-danger btn-sm" onclick="confirmDeleteLoan(${l.id})" aria-label="Delete loan #${l.id}">Delete</button>
              </td>
            </tr>`;
          }).join('')}
        </tbody>
      </table></div>`;
    }
    const PLANTATION_PRICING_KEY = "plantation-pricing-override-v3";

    async function loadPlantationPricing() {
      try {
        const res = await window.storage.get(PLANTATION_PRICING_KEY, false);
        if (res && res.value) plantationPricing = JSON.parse(res.value) || {};
      } catch (e) {
        console.warn('Failed to load plantation pricing overrides:', e);
        plantationPricing = {};
      }
    }

    async function savePlantationPricingToStorage() {
      try {
        await window.storage.set(PLANTATION_PRICING_KEY, JSON.stringify(plantationPricing), false);
        return true;
      } catch (e) {
        console.error('Save plantation pricing error:', e);
        showToast('⚠️ Failed to save yield & pricing.', 'error');
        return false;
      }
    }

    const PLANTATION_SALES_KEY = "plantation-sales-v3";

    async function loadPlantationSales() {
      try {
        const res = await window.storage.get(PLANTATION_SALES_KEY, false);
        if (res && res.value) {
          const parsed = JSON.parse(res.value);
          plantationSales = parsed.sales || [];
          nextSaleId = parsed.nextId || (plantationSales.length ? Math.max(...plantationSales.map(s => s.id)) + 1 : 1);
        }
      } catch (e) {
        console.warn('Failed to load plantation sales:', e);
        plantationSales = [];
        nextSaleId = 1;
      }
    }

    async function savePlantationSalesToStorage() {
      try {
        await window.storage.set(PLANTATION_SALES_KEY, JSON.stringify({ sales: plantationSales, nextId: nextSaleId }), false);
        return true;
      } catch (e) {
        console.error('Save plantation sales error:', e);
        showToast('⚠️ Failed to save sale.', 'error');
        return false;
      }
    }

    function updateSalePreview() {
      const qty = Math.max(0, parseFloat(document.getElementById('sale-quantity').value) || 0);
      const price = Math.max(0, parseFloat(document.getElementById('sale-price').value) || 0);
      const out = document.getElementById('sale-preview');
      if (!out) return;
      if (qty <= 0 || price <= 0) { out.innerHTML = ''; return; }
      out.innerHTML = `Total Cost = ${qty} kg × ${peso(price)} = <b>${peso(round2(qty * price))}</b>`;
    }

    async function saveSale() {
      if (!selectedPlantationType) return;
      const customer = document.getElementById('sale-customer').value.trim();
      const location = document.getElementById('sale-location').value.trim();
      const cellphone = document.getElementById('sale-cellphone').value.trim();
      const quantity = Math.max(0, parseFloat(document.getElementById('sale-quantity').value) || 0);
      const price = Math.max(0, parseFloat(document.getElementById('sale-price').value) || 0);
      const date = document.getElementById('sale-date').value || todayISO();

      if (!customer) {
        showToast('⚠️ Enter the customer\'s name', 'error');
        return;
      }
      if (quantity <= 0) {
        showToast('⚠️ Enter a quantity greater than zero', 'error');
        return;
      }
      if (price <= 0) {
        showToast('⚠️ Enter a current price greater than zero', 'error');
        return;
      }
      if (isFutureDate(date)) {
        showToast('⚠️ Date cannot be in the future', 'error');
        return;
      }

      const total = round2(quantity * price);
      let success = false;
      if (editingSaleId) {
        const idx = plantationSales.findIndex(s => s.id === editingSaleId);
        if (idx !== -1) {
          plantationSales[idx] = { ...plantationSales[idx], customer_name: customer, location, cellphone, quantity, price_per_unit: price, total, date };
          success = await savePlantationSalesToStorage();
          if (success) showToast(`✅ Sale #${editingSaleId} updated`, 'success');
        }
      } else {
        const sale = {
          id: nextSaleId++,
          plantation_type: selectedPlantationType,
          customer_name: customer, location, cellphone,
          quantity, price_per_unit: price, total, date
        };
        plantationSales.push(sale);
        success = await savePlantationSalesToStorage();
        if (success) showToast(`✅ Sale to ${customer} recorded — ${peso(total)} (now flowing into Reports as Gross Sales)`, 'success');
      }

      if (success) {
        cancelEditSale();
        renderPlantationSales(selectedPlantationType);
        renderPlantationDetail(selectedPlantationType);
      }
    }

    function editSale(id) {
      const s = plantationSales.find(x => x.id === id);
      if (!s) return;
      editingSaleId = id;
      document.getElementById('sale-customer').value = s.customer_name;
      document.getElementById('sale-location').value = s.location || '';
      document.getElementById('sale-cellphone').value = s.cellphone || '';
      document.getElementById('sale-quantity').value = s.quantity;
      document.getElementById('sale-price').value = s.price_per_unit;
      document.getElementById('sale-date').value = s.date;
      updateSalePreview();
      document.getElementById('sale-save-btn').textContent = 'Update sale';
      document.getElementById('sale-cancel-btn').style.display = '';
      document.getElementById('sale-customer').scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    function cancelEditSale() {
      editingSaleId = null;
      document.getElementById('sale-customer').value = '';
      document.getElementById('sale-location').value = '';
      document.getElementById('sale-cellphone').value = '';
      document.getElementById('sale-quantity').value = '';
      document.getElementById('sale-price').value = '';
      document.getElementById('sale-date').value = todayISO();
      document.getElementById('sale-preview').innerHTML = '';
      document.getElementById('sale-save-btn').textContent = '+ Record sale';
      document.getElementById('sale-cancel-btn').style.display = 'none';
    }

    function confirmDeleteSale(id) {
      pendingSaleDeleteId = id;
      const s = plantationSales.find(x => x.id === id);
      document.getElementById('confirm-modal-title').textContent = 'Delete sale?';
      document.getElementById('confirm-modal-text').textContent =
        `The sale of ${s.quantity} kg to ${s.customer_name} on ${s.date} (${peso(s.total)}) will be permanently removed.`;
      document.getElementById('confirm-yes').textContent = 'Delete';
      document.getElementById('confirm-yes').onclick = async () => {
        document.getElementById('confirm-modal').classList.remove('open');
        plantationSales = plantationSales.filter(x => x.id !== pendingSaleDeleteId);
        await savePlantationSalesToStorage();
        showToast('🗑️ Sale deleted', 'success');
        renderPlantationSales(selectedPlantationType);
        renderPlantationDetail(selectedPlantationType);
      };
      document.getElementById('confirm-modal').classList.add('open');
    }

    function renderPlantationSales(type) {
      if (!type) return;
      const sales = plantationSales.filter(s => s.plantation_type === type).sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id);
      const totalSales = round2(sales.reduce((s, x) => s + x.total, 0));
      const totalQty = round2(sales.reduce((s, x) => s + x.quantity, 0));

      document.getElementById('pd-sales-count-label').textContent = `(${sales.length})`;
      document.getElementById('sale-totals-strip').innerHTML = `
        <div class="t">Sales recorded<b>${sales.length}</b></div>
        <div class="t">Total quantity sold<b>${totalQty} kg</b></div>
        <div class="t grand">Total Sales<b>${peso(totalSales)}</b></div>
      `;

      const out = document.getElementById('pd-sales-table');
      if (sales.length === 0) {
        out.innerHTML = `<div class="empty-state"><span class="glyph">🛒</span>No sales logged yet for ${escapeHtml(type)}.</div>`;
        return;
      }
      out.innerHTML = `<div class="table-wrapper"><table>
        <thead><tr><th>ID</th><th>Date</th><th>Customer</th><th>Location</th><th>Cellphone</th><th class="num">Quantity</th><th class="num">Current Price</th><th class="num">Total Cost</th><th></th></tr></thead>
        <tbody>
          ${sales.map(s => `
            <tr>
              <td class="num">#${s.id}</td>
              <td>${s.date}</td>
              <td>${escapeHtml(s.customer_name)}</td>
              <td>${s.location ? escapeHtml(s.location) : '—'}</td>
              <td>${s.cellphone ? escapeHtml(s.cellphone) : '—'}</td>
              <td class="num">${s.quantity} kg</td>
              <td class="num">${peso(s.price_per_unit)}</td>
              <td class="num"><strong>${peso(s.total)}</strong></td>
              <td class="actions-cell">
                <button class="btn-ghost btn-sm" onclick="editSale(${s.id})" aria-label="Edit sale #${s.id}">Edit</button>
                <button class="btn-danger btn-sm" onclick="confirmDeleteSale(${s.id})" aria-label="Delete sale #${s.id}">Delete</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      <div class="totals-strip"><div class="t grand">Total Sales for ${escapeHtml(type)}<b>${peso(totalSales)}</b></div></div>
      </div>`;
    }

    function updatePlantationPricingPreview() {
      const yieldVal = Math.max(0, parseFloat(document.getElementById('pd-in-yield').value) || 0);
      const currentPrice = Math.max(0, parseFloat(document.getElementById('pd-in-current-price').value) || 0);
      const out = document.getElementById('pd-pricing-preview');
      if (!out) return;
      if (yieldVal <= 0) { out.innerHTML = ''; return; }
      out.innerHTML = `Gross Income = ${yieldVal} kg × ${peso(currentPrice)} = <b>${peso(round2(yieldVal * currentPrice))}</b>`;
    }

    async function savePlantationPricingOverride() {
      if (!selectedPlantationType) return;
      const yieldVal = Math.max(0, parseFloat(document.getElementById('pd-in-yield').value) || 0);
      const price = Math.max(0, parseFloat(document.getElementById('pd-in-price').value) || 0);
      const currentPrice = Math.max(0, parseFloat(document.getElementById('pd-in-current-price').value) || 0);

      if (yieldVal <= 0) {
        showToast('⚠️ Enter a Total Yield greater than zero', 'error');
        return;
      }

      plantationPricing[selectedPlantationType] = { totalYield: yieldVal, pricePerKg: price, currentPricePerKg: currentPrice };
      const success = await savePlantationPricingToStorage();
      if (success) {
        showToast(`✅ Yield & pricing saved for ${selectedPlantationType} — now flowing into Reports as Gross Sales`, 'success');
        renderPlantationDetail(selectedPlantationType);
      }
    }

    async function clearPlantationPricingOverride() {
      if (!selectedPlantationType) return;
      delete plantationPricing[selectedPlantationType];
      const success = await savePlantationPricingToStorage();
      if (success) {
        document.getElementById('pd-in-yield').value = '';
        document.getElementById('pd-in-price').value = '';
        document.getElementById('pd-in-current-price').value = '';
        document.getElementById('pd-pricing-preview').innerHTML = '';
        showToast('↩️ Cleared — now using totals from logged records', 'success');
        renderPlantationDetail(selectedPlantationType);
      }
    }

    function showPlantationDetail(type) {
      if (!ownerUnlocked) {
        pendingNavigationTarget = 'plantation-detail';
        openOwnerGate();
        return;
      }
      selectedPlantationType = type;
      const override = plantationPricing[type];
      document.getElementById('pd-in-yield').value = override ? override.totalYield : '';
      document.getElementById('pd-in-price').value = override ? override.pricePerKg : '';
      document.getElementById('pd-in-current-price').value = override ? override.currentPricePerKg : '';
      updatePlantationPricingPreview();
      cancelEditSale();
      renderPlantationDetail(type);
      renderPlantationSales(type);
      navigateTo('plantation-detail');
    }

    function renderPlantationDetail(type) {
      if (!type) return;
      const recs = records.filter(r => r.plantation_type === type).sort((a, b) => a.date.localeCompare(b.date));
      const laborCost = recs.reduce((s, r) => s + r.labor_cost, 0);
      const itemsCost = recs.reduce((s, r) => s + r.items_total, 0);
      const totalExpenditure = round2(laborCost + itemsCost);

      const override = plantationPricing[type];
      const usingOverride = !!(override && override.totalYield > 0);

      const recordedYield = recs.reduce((s, r) => s + (r.yield_kg || 0), 0);
      const recordedGrossIncome = round2(recs.reduce((s, r) => s + (r.revenue || 0), 0));

      let totalYield, pricePerKgDisplay, totalGrossIncome;
      if (usingOverride) {
        totalYield = override.totalYield;
        pricePerKgDisplay = override.pricePerKg || 0;
        totalGrossIncome = round2(override.totalYield * (override.currentPricePerKg || 0));
      } else {
        totalYield = recordedYield;
        pricePerKgDisplay = totalYield > 0 ? round2(recordedGrossIncome / totalYield) : 0;
        totalGrossIncome = recordedGrossIncome;
      }

      const autoGrossSales = computeGrossSalesFor(type);
      const netIncome = round2(totalGrossIncome - totalExpenditure);
      const costPct = totalGrossIncome > 0 ? round2((totalExpenditure / totalGrossIncome) * 100) : 0;
      const costPerKg = totalYield > 0 ? round2(totalExpenditure / totalYield) : 0;

      document.getElementById('pd-title').innerHTML = `${plantationEmoji(type)} ${escapeHtml(type)} <span class="n">plantation detail</span>`;

      document.getElementById('pd-stats').innerHTML = `
        <div class="stat-card good"><div class="label">Total Yield / Quantity</div><div class="value">${totalYield} kg</div>${costPerKg > 0 ? `<div class="sub">cost/kg: ${peso(costPerKg)}</div>` : ''}${usingOverride ? '<div class="sub">✏️ encoded value</div>' : ''}</div>
        <div class="stat-card"><div class="label">Price per kg</div><div class="value">${peso(pricePerKgDisplay)}</div><div class="sub">${usingOverride ? 'encoded value' : 'blended across all harvests'}</div></div>
        <div class="stat-card accent"><div class="label">Total Expenditure</div><div class="value">${peso(totalExpenditure)}</div><div class="sub">labor ${peso(laborCost)} + items ${peso(itemsCost)}</div></div>
        <div class="stat-card ${netIncome >= 0 ? 'good' : 'bad'}"><div class="label">Total Gross Income</div><div class="value">${peso(totalGrossIncome)}</div><div class="sub">${usingOverride ? 'Encoded Yield × Current Price per kg' : 'Yield × Price per kg, all harvests'}</div></div>
      `;

      document.getElementById('pd-formula').innerHTML =
        `Net Income = Total Gross Income − Total Expenditure = ${peso(totalGrossIncome)} − ${peso(totalExpenditure)} = <b class="${netIncome < 0 ? 'neg' : ''}">${peso(netIncome)}</b>` +
        ` &nbsp;·&nbsp; Cost as a share of income: <b>${costPct}%</b>` +
        `<div style="margin-top:6px;">Gross Sales feeding the Reports tab for this plantation: <b>${peso(autoGrossSales)}</b> <span style="color:var(--faint)">(${grossSalesSourceLabelFor(type)}, automatic — nothing to re-enter)</span></div>`;

      const itemRows = recs.flatMap(r => r.items.map(i => ({ ...i, date: r.date, record_id: r.id })));
      const itemsOut = document.getElementById('pd-items-table');
      document.getElementById('pd-items-count-label').textContent = `(${itemRows.length})`;
      itemsOut.innerHTML = itemRows.length === 0 ? `<div class="empty-state">No items purchased for this plantation yet.</div>` : `
        <div class="table-wrapper"><table>
          <thead><tr><th>Date</th><th>Item</th><th class="num">Qty</th><th>Unit</th><th class="num">Price/unit</th><th class="num">Cost</th><th>Record</th></tr></thead>
          <tbody>${itemRows.map(i => `<tr><td>${i.date}</td><td>${escapeHtml(i.name)}</td><td class="num">${i.quantity}</td><td>${i.unit}</td><td class="num">${peso(i.price_per_unit)}</td><td class="num">${peso(i.cost)}</td><td>#${i.record_id}</td></tr>`).join('')}</tbody>
        </table></div>`;

      const recOut = document.getElementById('pd-records-table');
      document.getElementById('pd-records-count-label').textContent = `(${recs.length})`;
      let tableHtml = '';
      if (recs.length === 0) {
        tableHtml = `<div class="empty-state">No records for this plantation yet.</div>`;
      } else {
        tableHtml = `<div class="table-wrapper"><table>
          <thead><tr><th>ID</th><th>Date</th><th>Yield</th><th class="num">Gross Income</th><th class="num">Workers</th><th class="num">Expenditure</th></tr></thead>
          <tbody>`;
        [...recs].sort((a,b) => b.date.localeCompare(a.date)).forEach(r => {
          tableHtml += `<tr><td class="num">#${r.id}</td><td>${r.date}</td><td>${r.yield_kg ? r.yield_kg + ' kg' : '—'}</td><td class="num">${r.revenue ? peso(r.revenue) : '—'}</td><td class="num">${r.workers.length}</td><td class="num">${peso(r.total_expenditure)}</td></tr>`;
        });
        tableHtml += `</tbody></table></div>`;
      }
      recOut.innerHTML = tableHtml;

      const byMonth = {};
      recs.forEach(r => {
        const m = r.date.slice(0, 7);
        if (!byMonth[m]) byMonth[m] = { expenditure: 0, income: 0 };
        byMonth[m].expenditure += r.total_expenditure;
        byMonth[m].income += (r.revenue || 0);
      });
      const months = Object.keys(byMonth).sort();
      const rangeLabel = document.getElementById('pd-chart-range-label');
      if (rangeLabel) rangeLabel.textContent = months.length ? `${months[0]} → ${months[months.length - 1]}` : 'no activity yet';

      const canvas = document.getElementById('pdChart');
      if (canvas) {
        if (chartInstances.pd) { chartInstances.pd.destroy(); chartInstances.pd = null; }
        if (months.length > 0) {
          const monthlyExpenditure = months.map(m => byMonth[m].expenditure);
          const monthlyNet = months.map(m => round2(byMonth[m].income - byMonth[m].expenditure));
          const ctx = canvas.getContext('2d');
          chartInstances.pd = new Chart(ctx, {
            data: {
              labels: months,
              datasets: [
                {
                  type: 'bar',
                  label: 'Expenditure',
                  data: monthlyExpenditure,
                  backgroundColor: 'rgba(226,104,95,0.55)',
                  borderColor: '#e2685f',
                  borderWidth: 1
                },
                {
                  type: 'line',
                  label: 'Net Income',
                  data: monthlyNet,
                  borderColor: '#4caf82',
                  backgroundColor: 'rgba(76,175,130,0.15)',
                  borderWidth: 2,
                  tension: 0.3,
                  pointRadius: 3,
                  fill: true
                }
              ]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { labels: { color: '#e9edf5' } } },
              scales: {
                y: { ticks: { color: '#8991ab', callback: v => '₱' + v }, grid: { color: 'rgba(42,46,66,0.5)' } },
                x: { ticks: { color: '#8991ab', font: { size: 9 } } }
              }
            }
          });
        }
      }
    }

    // ---------- Products (owner-managed catalog) ----------
    async function loadProducts() {
      try {
        const res = await window.storage.get(PRODUCTS_STORAGE_KEY, false);
        if (res && res.value) {
          const parsed = JSON.parse(res.value);
          products = parsed.products || [];
          nextProductId = parsed.nextId || (products.length ? Math.max(...products.map(p => p.id)) + 1 : 1);
        } else if (DEFAULT_PRODUCTS.length > 0) {
          // First-ever visit on this device/browser — seed from the published catalog
          // baked into this file, so the Shop isn't empty for a brand-new visitor.
          products = DEFAULT_PRODUCTS.map(p => ({ ...p }));
          nextProductId = Math.max(...products.map(p => p.id), 0) + 1;
          await saveProductsToStorage();
        }
      } catch (e) {
        console.warn('Failed to load products:', e);
        products = [];
        nextProductId = 1;
      }
    }

    async function saveProductsToStorage() {
      try {
        await window.storage.set(PRODUCTS_STORAGE_KEY, JSON.stringify({ products, nextId: nextProductId }), false);
        return true;
      } catch (e) {
        console.error('Save products error:', e);
        showToast('⚠️ Failed to save product — the photo may be too large.', 'error');
        return false;
      }
    }

    function openPublishCatalogModal() {
      const code = 'const CATALOG = ' + JSON.stringify(products, null, 2) + ';';
      document.getElementById('publish-catalog-code').value = code;
      const warning = document.getElementById('publish-catalog-warning');
      const hasPhotos = products.some(p => p.photo);
      if (hasPhotos) {
        warning.textContent = '⚠️ Some products have photos attached. Photos are embedded as text and can make script.js large — fine for a few products, but consider smaller images if your catalog grows.';
        warning.style.display = '';
      } else {
        warning.style.display = 'none';
      }
      document.getElementById('publish-catalog-modal').classList.add('open');
    }

    async function copyPublishCatalogCode() {
      const code = document.getElementById('publish-catalog-code').value;
      try {
        await navigator.clipboard.writeText(code);
        showToast('📋 Copied — paste it over the CATALOG line in shop/script.js', 'success');
      } catch (e) {
        showToast('⚠️ Could not copy automatically — select the text and copy manually', 'error');
      }
    }

    document.addEventListener('DOMContentLoaded', () => {
      const prodPhotoInput = document.getElementById('prod-photo');
      if (prodPhotoInput) {
        prodPhotoInput.addEventListener('change', () => {
          const file = prodPhotoInput.files && prodPhotoInput.files[0];
          const preview = document.getElementById('prod-photo-preview');
          if (!file) { pendingProductPhoto = null; if (preview) preview.innerHTML = ''; return; }
          if (!file.type.startsWith('image/')) {
            showToast('⚠️ Please choose an image file', 'error');
            prodPhotoInput.value = '';
            return;
          }
          const reader = new FileReader();
          reader.onload = (e) => {
            pendingProductPhoto = e.target.result;
            if (preview) preview.innerHTML = `<img class="journal-photo-preview-thumb" src="${pendingProductPhoto}" alt="Product photo preview">`;
          };
          reader.readAsDataURL(file);
        });
      }
    });

    async function saveProduct() {
      const name = document.getElementById('prod-name').value.trim();
      const plantation = document.getElementById('prod-plantation').value;
      const unit = document.getElementById('prod-unit').value;
      const price = Math.max(0, parseFloat(document.getElementById('prod-price').value) || 0);
      const stock = Math.max(0, parseFloat(document.getElementById('prod-stock').value) || 0);
      const active = document.getElementById('prod-active').value === '1';
      const description = document.getElementById('prod-description').value.trim();

      if (!name) {
        showToast('⚠️ Enter a product name', 'error');
        return;
      }
      if (price <= 0) {
        showToast('⚠️ Enter a price greater than zero', 'error');
        return;
      }

      const photo = pendingProductPhoto !== null ? pendingProductPhoto :
        (editingProductId ? (products.find(p => p.id === editingProductId)?.photo || null) : null);

      let success = false;
      if (editingProductId) {
        const idx = products.findIndex(p => p.id === editingProductId);
        if (idx !== -1) {
          products[idx] = { ...products[idx], name, plantation_type: plantation, unit, price, stock, active, description, photo };
          success = await saveProductsToStorage();
          if (success) showToast(`✅ Product #${editingProductId} updated`, 'success');
        }
      } else {
        products.push({ id: nextProductId++, name, plantation_type: plantation, unit, price, stock, active, description, photo });
        success = await saveProductsToStorage();
        if (success) showToast(`✅ ${name} added to the catalog`, 'success');
      }

      if (success) {
        cancelEditProduct();
        renderProducts();
        renderShop();
      }
    }

    function editProduct(id) {
      const p = products.find(x => x.id === id);
      if (!p) return;
      editingProductId = id;
      document.getElementById('product-form-title').textContent = `✏️ Editing ${p.name}`;
      document.getElementById('prod-name').value = p.name;
      document.getElementById('prod-plantation').value = p.plantation_type || '';
      document.getElementById('prod-plantation')._refreshCustomLabel?.();
      document.getElementById('prod-unit').value = p.unit;
      document.getElementById('prod-unit')._refreshCustomLabel?.();
      document.getElementById('prod-price').value = p.price;
      document.getElementById('prod-stock').value = p.stock;
      document.getElementById('prod-active').value = p.active ? '1' : '0';
      document.getElementById('prod-description').value = p.description || '';
      const photoInput = document.getElementById('prod-photo');
      const preview = document.getElementById('prod-photo-preview');
      if (photoInput) photoInput.value = '';
      pendingProductPhoto = null;
      if (preview) preview.innerHTML = p.photo ? `<img class="journal-photo-preview-thumb" src="${p.photo}" alt="Current photo">` : '';
      document.getElementById('prod-save-btn').textContent = 'Update product';
      document.getElementById('prod-cancel-btn').style.display = '';
      navigateTo('products');
      document.getElementById('prod-name').scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    function cancelEditProduct() {
      editingProductId = null;
      pendingProductPhoto = null;
      document.getElementById('product-form-title').textContent = '🛍️ Add a product';
      document.getElementById('prod-name').value = '';
      document.getElementById('prod-price').value = '';
      document.getElementById('prod-stock').value = '';
      document.getElementById('prod-active').value = '1';
      document.getElementById('prod-description').value = '';
      const photoInput = document.getElementById('prod-photo');
      const preview = document.getElementById('prod-photo-preview');
      if (photoInput) photoInput.value = '';
      if (preview) preview.innerHTML = '';
      document.getElementById('prod-save-btn').textContent = '+ Add product';
      document.getElementById('prod-cancel-btn').style.display = 'none';
    }

    function confirmDeleteProduct(id) {
      pendingProductDeleteId = id;
      const p = products.find(x => x.id === id);
      document.getElementById('confirm-modal-title').textContent = 'Delete product?';
      document.getElementById('confirm-modal-text').textContent = `"${p.name}" will be removed from your catalog and the Shop.`;
      document.getElementById('confirm-yes').textContent = 'Delete';
      document.getElementById('confirm-yes').onclick = async () => {
        document.getElementById('confirm-modal').classList.remove('open');
        products = products.filter(p => p.id !== pendingProductDeleteId);
        await saveProductsToStorage();
        showToast('🗑️ Product deleted', 'success');
        renderProducts();
        renderShop();
      };
      document.getElementById('confirm-modal').classList.add('open');
    }

    function renderProducts() {
      const out = document.getElementById('products-table');
      document.getElementById('products-count-label').textContent = `(${products.length})`;
      if (!out) return;
      if (products.length === 0) {
        out.innerHTML = `<div class="empty-state"><span class="glyph">🛍️</span>No products encoded yet — add one above.</div>`;
        return;
      }
      const list = [...products].sort((a, b) => a.name.localeCompare(b.name));
      out.innerHTML = `<div class="table-wrapper"><table>
        <thead><tr><th>Product</th><th>Plantation</th><th class="num">Price</th><th class="num">Stock</th><th>Status</th><th></th></tr></thead>
        <tbody>
          ${list.map(p => `
            <tr>
              <td>${escapeHtml(p.name)}</td>
              <td>${p.plantation_type ? `<span class="tag">${p.plantation_type}</span>` : '—'}</td>
              <td class="num">${peso(p.price)} / ${p.unit}</td>
              <td class="num">${p.stock} ${p.unit}</td>
              <td>${p.active ? '<span class="tag profit">Available</span>' : '<span class="tag loss">Hidden</span>'}</td>
              <td class="actions-cell">
                <button class="btn-ghost btn-sm" onclick="editProduct(${p.id})" aria-label="Edit ${escapeHtml(p.name)}">Edit</button>
                <button class="btn-danger btn-sm" onclick="confirmDeleteProduct(${p.id})" aria-label="Delete ${escapeHtml(p.name)}">Delete</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table></div>`;
    }

    // ---------- Shop (customer-facing storefront + cart) ----------
    function renderShop() {
      const grid = document.getElementById('shop-product-grid');
      if (!grid) return;
      const available = products.filter(p => p.active && p.stock > 0);
      if (available.length === 0) {
        grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1;"><span class="glyph">🛒</span>Nothing available to order right now — check back soon.</div>`;
      } else {
        grid.innerHTML = available.map(p => {
          const qty = cart[p.id] || 0;
          return `
          <div class="product-card">
            ${p.photo ? `<img class="product-photo" src="${p.photo}" alt="${escapeHtml(p.name)}">` : `<div class="product-photo product-photo-placeholder">${plantationEmoji(p.plantation_type || '')}</div>`}
            <div class="product-name">${escapeHtml(p.name)}</div>
            ${p.description ? `<div class="product-desc">${escapeHtml(p.description)}</div>` : ''}
            <div class="product-price">${peso(p.price)} <span class="product-unit">/ ${p.unit}</span></div>
            <div class="product-stock">${p.stock} ${p.unit} available</div>
            <div class="qty-stepper">
              <button class="btn-ghost btn-sm" onclick="changeCartQty(${p.id}, -1)" aria-label="Decrease quantity">−</button>
              <span class="qty-value">${qty}</span>
              <button class="btn-ghost btn-sm" onclick="changeCartQty(${p.id}, 1)" aria-label="Increase quantity">+</button>
            </div>
          </div>`;
        }).join('');
      }
      renderCart();
    }

    function changeCartQty(productId, delta) {
      const p = products.find(x => x.id === productId);
      if (!p) return;
      const current = cart[productId] || 0;
      const next = Math.max(0, Math.min(p.stock, current + delta));
      if (next === 0) delete cart[productId];
      else cart[productId] = next;
      renderShop();
    }

    function cartTotal() {
      return round2(Object.entries(cart).reduce((sum, [id, qty]) => {
        const p = products.find(x => x.id === parseInt(id, 10));
        return sum + (p ? p.price * qty : 0);
      }, 0));
    }

    function renderCart() {
      const itemsOut = document.getElementById('cart-items');
      const countLabel = document.getElementById('cart-count-label');
      const totalsStrip = document.getElementById('cart-totals-strip');
      const checkoutCard = document.getElementById('checkout-card');
      if (!itemsOut) return;

      const entries = Object.entries(cart).map(([id, qty]) => ({ product: products.find(x => x.id === parseInt(id, 10)), qty }))
        .filter(e => e.product);

      countLabel.textContent = `(${entries.reduce((s, e) => s + e.qty, 0)} item${entries.reduce((s, e) => s + e.qty, 0) !== 1 ? 's' : ''})`;

      if (entries.length === 0) {
        itemsOut.innerHTML = `<div class="empty-state"><span class="glyph">🧺</span>Your cart is empty — add something from the Shop above.</div>`;
        totalsStrip.style.display = 'none';
        checkoutCard.style.display = 'none';
        return;
      }

      itemsOut.innerHTML = `<div class="table-wrapper"><table>
        <thead><tr><th>Item</th><th class="num">Qty</th><th class="num">Price</th><th class="num">Subtotal</th><th></th></tr></thead>
        <tbody>
          ${entries.map(e => `
            <tr>
              <td>${escapeHtml(e.product.name)}</td>
              <td class="num">${e.qty} ${e.product.unit}</td>
              <td class="num">${peso(e.product.price)}</td>
              <td class="num">${peso(round2(e.product.price * e.qty))}</td>
              <td class="actions-cell"><button class="btn-danger btn-sm" onclick="changeCartQty(${e.product.id}, -${e.qty})" aria-label="Remove ${escapeHtml(e.product.name)}">Remove</button></td>
            </tr>
          `).join('')}
        </tbody>
      </table></div>`;
      document.getElementById('cart-grand-total').textContent = peso(cartTotal());
      totalsStrip.style.display = '';
      checkoutCard.style.display = '';
    }

    function formatOrderMessage(order) {
      const lines = [
        `🌾 New order — Valley and Creeks Farm`,
        ``,
        `Customer: ${order.customer_name}`,
        `Cellphone: ${order.cellphone}`,
        `Address: ${order.address}`,
        order.notes ? `Notes: ${order.notes}` : null,
        ``,
        `Items:`,
        ...order.items.map(i => `- ${i.name}: ${i.qty} ${i.unit} × ${peso(i.price)} = ${peso(round2(i.qty * i.price))}`),
        ``,
        `Order total: ${peso(order.total)}`,
        `Order date: ${order.date}`
      ].filter(Boolean);
      return lines.join('\n');
    }

    async function placeOrder(method) {
      const entries = Object.entries(cart).map(([id, qty]) => ({ product: products.find(x => x.id === parseInt(id, 10)), qty }))
        .filter(e => e.product);
      if (entries.length === 0) {
        showToast('⚠️ Your cart is empty', 'error');
        return;
      }
      const name = document.getElementById('order-name').value.trim();
      const cellphone = document.getElementById('order-cellphone').value.trim();
      const address = document.getElementById('order-address').value.trim();
      const notes = document.getElementById('order-notes').value.trim();

      if (!name) { showToast('⚠️ Enter your full name', 'error'); return; }
      if (!cellphone) { showToast('⚠️ Enter your cellphone number', 'error'); return; }
      if (!address) { showToast('⚠️ Enter your delivery address', 'error'); return; }

      const order = {
        id: nextOrderId++,
        date: todayISO(),
        customer_name: name,
        cellphone,
        address,
        notes,
        items: entries.map(e => ({ product_id: e.product.id, name: e.product.name, unit: e.product.unit, qty: e.qty, price: e.product.price })),
        total: cartTotal(),
        status: 'pending'
      };

      orders.push(order);
      await saveOrdersToStorage();
      renderOrders();

      const message = formatOrderMessage(order);
      if (method === 'email') {
        const subject = encodeURIComponent(`New order from ${name} — Valley and Creeks Farm`);
        const body = encodeURIComponent(message);
        window.open(`mailto:${OWNER_EMAIL}?subject=${subject}&body=${body}`, '_blank');
      } else {
        const text = encodeURIComponent(message);
        window.open(`https://wa.me/${OWNER_WHATSAPP}?text=${text}`, '_blank', 'noopener');
      }

      showToast(`✅ Order ready — check the ${method === 'email' ? 'email' : 'WhatsApp'} window to send it`, 'success', 5000);

      cart = {};
      document.getElementById('order-name').value = '';
      document.getElementById('order-cellphone').value = '';
      document.getElementById('order-address').value = '';
      document.getElementById('order-notes').value = '';
      renderShop();
    }

    // ---------- Orders (owner-side local log) ----------
    async function loadOrders() {
      try {
        const res = await window.storage.get(ORDERS_STORAGE_KEY, false);
        if (res && res.value) {
          const parsed = JSON.parse(res.value);
          orders = parsed.orders || [];
          nextOrderId = parsed.nextId || (orders.length ? Math.max(...orders.map(o => o.id)) + 1 : 1);
        }
      } catch (e) {
        console.warn('Failed to load orders:', e);
        orders = [];
        nextOrderId = 1;
      }
    }

    async function saveOrdersToStorage() {
      try {
        await window.storage.set(ORDERS_STORAGE_KEY, JSON.stringify({ orders, nextId: nextOrderId }), false);
        return true;
      } catch (e) {
        console.error('Save orders error:', e);
        showToast('⚠️ Failed to save order log.', 'error');
        return false;
      }
    }

    async function setOrderStatus(id, status) {
      const idx = orders.findIndex(o => o.id === id);
      if (idx === -1) return;
      orders[idx].status = status;
      await saveOrdersToStorage();
      renderOrders();
      showToast(`✅ Order #${id} marked ${status}`, 'success');
    }

    function confirmDeleteOrder(id) {
      pendingOrderDeleteId = id;
      document.getElementById('confirm-modal-title').textContent = 'Delete order log?';
      document.getElementById('confirm-modal-text').textContent = `Order #${id} will be permanently removed from this local log.`;
      document.getElementById('confirm-yes').textContent = 'Delete';
      document.getElementById('confirm-yes').onclick = async () => {
        document.getElementById('confirm-modal').classList.remove('open');
        orders = orders.filter(o => o.id !== pendingOrderDeleteId);
        await saveOrdersToStorage();
        showToast('🗑️ Order deleted', 'success');
        renderOrders();
      };
      document.getElementById('confirm-modal').classList.add('open');
    }

    function renderOrders() {
      const out = document.getElementById('orders-table');
      if (!out) return;
      if (orders.length === 0) {
        out.innerHTML = `<div class="empty-state"><span class="glyph">🧾</span>No orders logged on this device yet.</div>`;
        return;
      }
      const list = [...orders].sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id);
      out.innerHTML = `<div class="table-wrapper"><table>
        <thead><tr><th>ID</th><th>Date</th><th>Customer</th><th>Contact</th><th>Items</th><th class="num">Total</th><th>Status</th><th></th></tr></thead>
        <tbody>
          ${list.map(o => `
            <tr>
              <td class="num">#${o.id}</td>
              <td>${o.date}</td>
              <td>${escapeHtml(o.customer_name)}<div style="color:var(--faint);font-size:11px;">${escapeHtml(o.address)}</div></td>
              <td>${escapeHtml(o.cellphone)}</td>
              <td class="mini-list">${o.items.map(i => `<div>${escapeHtml(i.name)} × ${i.qty}</div>`).join('')}</td>
              <td class="num">${peso(o.total)}</td>
              <td>${o.status === 'fulfilled' ? '<span class="tag profit">Fulfilled</span>' : o.status === 'cancelled' ? '<span class="tag loss">Cancelled</span>' : '<span class="tag warning">Pending</span>'}</td>
              <td class="actions-cell">
                ${o.status !== 'fulfilled' ? `<button class="btn-ghost btn-sm" onclick="setOrderStatus(${o.id}, 'fulfilled')">Mark fulfilled</button>` : ''}
                ${o.status !== 'cancelled' ? `<button class="btn-ghost btn-sm" onclick="setOrderStatus(${o.id}, 'cancelled')">Cancel</button>` : ''}
                <button class="btn-danger btn-sm" onclick="confirmDeleteOrder(${o.id})">Delete</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table></div>`;
    }

    function refreshAll() {
      if (ownerUnlocked) {
        document.getElementById('record-count-badge').textContent =
          `${records.length} business · ${personalRecords.length} personal · ${activityRecords.length} diary`;
      }
      const activeView = document.querySelector('.view.active')?.id?.replace('view-', '');
      if (activeView === 'records') renderRecords();
      if (activeView === 'reports') renderReports();
      if (activeView === 'bydate') { populateQuickDates();
        renderDateSummary(); }
      if (activeView === 'workers') populateQuickWorkers();
      if (activeView === 'business') renderBusiness();
      if (activeView === 'personal') renderPersonal();
      if (activeView === 'shares') renderShares();
      if (activeView === 'capital') renderCapital();
      if (activeView === 'advances') renderAdvances();
      if (activeView === 'loans') renderLoans();
      if (activeView === 'inventory') renderInventory();
      if (activeView === 'products') renderProducts();
      if (activeView === 'shop') renderShop();
      if (activeView === 'orders') renderOrders();
      if (activeView === 'payroll') renderPayrollHistory();
      if (activeView === 'planning') renderPlanning();
      if (activeView === 'activities') renderActivities();
      if (activeView === 'plantation-detail' && selectedPlantationType) { renderPlantationDetail(selectedPlantationType); renderPlantationSales(selectedPlantationType); }
      if (activeView === 'dashboard') { renderDashboard();
        renderAlerts(); }
      if (ownerUnlocked) updateBottomIndicators();

      if (!ownerUnlocked) return; // stats below reveal financial totals — owner-only

      const total = records.reduce((s, r) => s + r.total_expenditure, 0);
      const totalYield = records.reduce((s, r) => s + (r.yield_kg || 0), 0);
      const totalNetSales = PLANTATION_TYPES.reduce((s, t) => s + netSalesFor(t), 0);
      const personalTotal = personalRecords.reduce((s, r) => s + r.total_expenditure, 0);
      const mergedTotal = total + personalTotal;

      document.getElementById('vertical-ag-stats').innerHTML = `
        <div class="stat-card"><div class="label">📋 Total Records</div><div class="value">${records.length}</div></div>
        <div class="stat-card"><div class="label">📔 Diary Entries</div><div class="value">${activityRecords.length}</div></div>
        <div class="stat-card"><div class="label">💰 Total Business Expenses</div><div class="value">${peso(total)}</div></div>
        <div class="stat-card good"><div class="label">🌾 Total Yield</div><div class="value">${totalYield} kg</div></div>
        <div class="stat-card ${totalNetSales >= 0 ? 'good' : 'bad'}"><div class="label">📈 Net Sales</div><div class="value">${peso(totalNetSales)}</div></div>
        <div class="stat-card"><div class="label">👤 Total Personal Expenses</div><div class="value personal">${peso(personalTotal)}</div></div>
        <div class="stat-card"><div class="label">📊 Total Business and Personal Expenses</div><div class="value merged">${peso(mergedTotal)}</div></div>
      `;
    }

    function switchToAccountTab() {
      navigateTo('business');
    }

    // ---------- Global search ----------
    function buildGlobalSearchIndex(query) {
      const q = query.trim().toLowerCase();
      if (!q) return [];
      const results = [];

      records.forEach(r => {
        const workerNames = r.workers.map(w => w.name).join(' ');
        const jobDescs = r.workers.map(w => w.job_description).join(' ');
        const itemNames = r.items.map(i => i.name).join(' ');
        const haystack = `${r.plantation_type} ${r.date} ${workerNames} ${jobDescs} ${itemNames}`.toLowerCase();
        if (haystack.includes(q)) {
          results.push({
            group: 'Business record', icon: '📋',
            label: `#${r.id} · ${r.plantation_type} · ${r.date}`,
            sub: `${peso(r.total_expenditure)} · ${r.workers.length} worker(s), ${r.items.length} item(s)`,
            action: () => editRecord(r.id)
          });
        }
      });

      personalRecords.forEach(r => {
        const itemNames = r.items.map(i => i.name).join(' ');
        const haystack = `${r.date} ${itemNames}`.toLowerCase();
        if (haystack.includes(q)) {
          results.push({
            group: 'Personal expense', icon: '👤',
            label: `#${r.id} · ${r.date}`,
            sub: `${peso(r.total_expenditure)} · ${r.items.map(i => i.name).join(', ') || 'no items'}`,
            action: () => editPersonalRecord(r.id)
          });
        }
      });

      activityRecords.forEach(a => {
        const haystack = `${a.date} ${a.plantation_type || ''} ${a.description}`.toLowerCase();
        if (haystack.includes(q)) {
          results.push({
            group: 'Diary entry', icon: '📔',
            label: `${a.date}${a.plantation_type ? ' · ' + a.plantation_type : ''}`,
            sub: a.description.slice(0, 70) + (a.description.length > 70 ? '…' : ''),
            action: () => editActivity(a.id)
          });
        }
      });

      cashAdvances.forEach(a => {
        const haystack = `${a.name} ${a.note || ''} ${a.plantation_type || ''}`.toLowerCase();
        if (haystack.includes(q)) {
          results.push({
            group: 'Cash advance', icon: '💵',
            label: `${a.name} · ${peso(a.amount)}`,
            sub: `${a.date} · ${a.repaid ? 'Repaid' : 'Outstanding'}`,
            action: () => { navigateTo('advances'); renderAdvances(); }
          });
        }
      });

      lenderLoans.forEach(l => {
        const haystack = `${l.lender} ${l.note || ''} ${l.plantation_type || ''}`.toLowerCase();
        if (haystack.includes(q)) {
          results.push({
            group: 'Lender loan', icon: '💳',
            label: `${l.lender} · ${peso(l.principal)}`,
            sub: `${l.date} · ${l.paid ? 'Paid' : 'Outstanding'}`,
            action: () => { navigateTo('loans'); renderLoans(); }
          });
        }
      });

      inventoryItems.forEach(i => {
        const haystack = `${i.name} ${i.supplier || ''}`.toLowerCase();
        if (haystack.includes(q)) {
          results.push({
            group: 'Inventory', icon: '📦',
            label: i.name,
            sub: `${i.stock} ${i.unit} on hand · reorder at ${i.threshold} ${i.unit}`,
            action: () => { navigateTo('inventory'); renderInventory(); }
          });
        }
      });

      plantationSales.forEach(s => {
        const haystack = `${s.customer_name} ${s.location || ''} ${s.cellphone || ''} ${s.plantation_type}`.toLowerCase();
        if (haystack.includes(q)) {
          results.push({
            group: 'Sale', icon: '🛒',
            label: `${s.customer_name} · ${peso(s.total)}`,
            sub: `${s.plantation_type} · ${s.date} · ${s.quantity} kg`,
            action: () => showPlantationDetail(s.plantation_type)
          });
        }
      });

      // Unique worker names (jump to employment history)
      const workerNamesSeen = new Set();
      records.forEach(r => r.workers.forEach(w => {
        const key = w.name.toLowerCase();
        if (key.includes(q) && !workerNamesSeen.has(key)) {
          workerNamesSeen.add(key);
          const totalCost = records.reduce((s, rr) => s + rr.workers.filter(ww => ww.name === w.name).reduce((s2, ww) => s2 + laborCostOf(ww), 0), 0);
          results.push({
            group: 'Worker', icon: '👷',
            label: w.name,
            sub: `Total labor cost logged: ${peso(totalCost)} — view employment history`,
            action: () => { navigateTo('workers'); document.getElementById('w-name').value = w.name; renderWorkerHistory(); }
          });
        }
      }));

      PLANTATION_TYPES.forEach(type => {
        if (type.toLowerCase().includes(q)) {
          results.push({
            group: 'Plantation', icon: plantationEmoji(type),
            label: type,
            sub: `${peso(expenditureFor(type))} total expenditure — open plantation detail`,
            action: () => showPlantationDetail(type)
          });
        }
      });

      return results.slice(0, 40);
    }

    function renderGlobalSearch() {
      const input = document.getElementById('global-search-input');
      const menu = document.getElementById('global-search-results');
      const query = input.value;
      if (!query.trim()) { menu.classList.remove('open'); menu.innerHTML = ''; return; }

      const results = buildGlobalSearchIndex(query);
      if (results.length === 0) {
        menu.innerHTML = `<div class="custom-select-option" style="cursor:default;">No matches for "${escapeHtml(query)}"</div>`;
        menu.classList.add('open');
        return;
      }

      let lastGroup = null;
      menu.innerHTML = results.map((r, idx) => {
        const groupHeader = r.group !== lastGroup ? `<div class="submenu-label" style="border-top:${idx === 0 ? 'none' : '1px solid var(--border)'};">${r.icon} ${r.group.toUpperCase()}</div>` : '';
        lastGroup = r.group;
        return `${groupHeader}<div class="custom-select-option" data-result-idx="${idx}">
          <div style="font-weight:600;">${escapeHtml(r.label)}</div>
          <div style="color:var(--faint);font-size:11px;margin-top:2px;">${escapeHtml(r.sub)}</div>
        </div>`;
      }).join('');

      menu.querySelectorAll('[data-result-idx]').forEach(el => {
        el.addEventListener('click', () => {
          const idx = parseInt(el.getAttribute('data-result-idx'), 10);
          results[idx].action();
          menu.classList.remove('open');
          input.value = '';
        });
      });

      menu.classList.add('open');
    }

    function setupAutoSave() {
      autoSaveTimer = setInterval(() => {
        if (isFormDirty) {
          saveDraft();
        }
      }, AUTO_SAVE_INTERVAL);

      window.addEventListener('beforeunload', (e) => {
        if (isFormDirty) {
          saveDraft();
          e.preventDefault();
          e.returnValue = 'You have unsaved changes. They have been saved as a draft.';
        }
      });
    }

    ['owner-gate-pin', 'owner-gate-pin-confirm'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('keydown', (e) => { if (e.key === 'Enter') submitOwnerGate(); });
    });

    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.key === 'f') {
        const searchInput = document.getElementById('s-worker');
        if (searchInput) {
          e.preventDefault();
          searchInput.focus();
        }
      }
      if (e.key === 'Escape') {
        const active = document.activeElement;
        if (active && (active.id === 's-worker' || active.id === 's-type' || active.id === 's-from' ||
            active.id === 's-to' || active.id === 's-min-amount' || active.id === 's-max-amount')) {
          clearFilters();
        }
      }
    });

    document.getElementById('confirm-no').onclick = () => document.getElementById('confirm-modal').classList.remove(
    'open');

    function navigateTo(viewName) {
      if (isPrivateView(viewName) && !ownerUnlocked) {
        pendingNavigationTarget = viewName;
        openOwnerGate();
        return;
      }
      const tab = document.querySelector(`.tab[data-view="${viewName}"]`);
      if (tab) tab.click();
      else {
        document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
        const target = document.getElementById('view-' + viewName);
        if (target) target.classList.add('active');
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        const matchingTab = document.querySelector(`.tab[data-view="${viewName}"]`);
        if (matchingTab) matchingTab.classList.add('active');
      }
    }

    document.getElementById('homeBtn').onclick = () => navigateTo('dashboard');

    (function setupGlobalSearch() {
      const input = document.getElementById('global-search-input');
      const menu = document.getElementById('global-search-results');
      let debounceTimer = null;
      input.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(renderGlobalSearch, 120);
      });
      input.addEventListener('focus', () => { if (input.value.trim()) renderGlobalSearch(); });
      document.addEventListener('click', (e) => {
        if (!e.target.closest('#global-search-wrap')) menu.classList.remove('open');
      });
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && document.activeElement === input) {
          input.value = '';
          menu.classList.remove('open');
          input.blur();
        }
      });
    })();

    document.getElementById('hamburgerBtn').onclick = function(e) {
      e.stopPropagation();
      const dropdown = document.getElementById('hamburgerDropdown');
      const isOpen = dropdown.classList.toggle('open');
      this.setAttribute('aria-expanded', isOpen);
    };

    document.addEventListener('click', function(e) {
      const dropdown = document.getElementById('hamburgerDropdown');
      const btn = document.getElementById('hamburgerBtn');
      if (!btn.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
      }
    });

    document.querySelectorAll('.hamburger-dropdown > a').forEach(link => {
      link.addEventListener('click', function(e) {
        const view = this.getAttribute('data-view');
        if (!view) return; // real hyperlink (e.g. Shop) — let the browser navigate normally
        e.preventDefault();
        navigateTo(view);
        if (view === 'loans') renderLoans();
        if (view === 'activities') renderActivities();
        document.getElementById('hamburgerDropdown').classList.remove('open');
        document.getElementById('hamburgerBtn').setAttribute('aria-expanded', 'false');
      });
    });

    // Sidebar links (persistent desktop navigation) mirror the hamburger dropdown's behavior.
    document.querySelectorAll('.sidebar-link[data-view]').forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        const view = this.getAttribute('data-view');
        if (view) {
          navigateTo(view);
          if (view === 'loans') renderLoans();
          if (view === 'activities') renderActivities();
        }
      });
    });

    document.querySelectorAll('.tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');
        const viewId = 'view-' + tab.dataset.view;
        document.getElementById(viewId).classList.add('active');
        syncNavActiveStates(tab.dataset.view);
        if (tab.dataset.view === 'records') renderRecords();
        if (tab.dataset.view === 'reports') renderReports();
        if (tab.dataset.view === 'bydate') { populateQuickDates();
          renderDateSummary(); }
        if (tab.dataset.view === 'workers') populateQuickWorkers();
        if (tab.dataset.view === 'business') renderBusiness();
        if (tab.dataset.view === 'personal') renderPersonal();
        if (tab.dataset.view === 'shares') renderShares();
        if (tab.dataset.view === 'capital') renderCapital();
        if (tab.dataset.view === 'advances') renderAdvances();
        if (tab.dataset.view === 'inventory') renderInventory();
        if (tab.dataset.view === 'products') renderProducts();
        if (tab.dataset.view === 'shop') renderShop();
        if (tab.dataset.view === 'orders') renderOrders();
        if (tab.dataset.view === 'payroll') renderPayrollHistory();
        if (tab.dataset.view === 'planning') renderPlanning();
        if (tab.dataset.view === 'activities') renderActivities();
        if (tab.dataset.view === 'dashboard') { renderDashboard();
          renderAlerts(); }
        if (tab.dataset.view === 'add') checkDraft();
        if (tab.dataset.view === 'about') { /* about is default active */ }
      });
    });

    populateTypeDropdowns();
    populatePlantationSubmenu();
    syncNavActiveStates('about');
    ['f-type', 's-type', 'cap-type', 'adv-type', 'pr-type', 'plan-type', 'activity-plantation', 'loan-type']
      .forEach(enhancePlantationSelect);
    document.getElementById('f-date').value = todayISO();
    document.getElementById('p-date').value = todayISO();
    document.getElementById('d-date').value = todayISO();
    document.getElementById('cap-date').value = todayISO();
    document.getElementById('adv-date').value = todayISO();
    document.getElementById('plan-date').value = todayISO();
    document.getElementById('loan-date').value = todayISO();
    document.getElementById('activity-date').value = todayISO();
    document.getElementById('sale-date').value = todayISO();
    document.getElementById('loan-type').innerHTML = `<option value="">— none —</option>` + PLANTATION_TYPES.map(t => `<option>${t}</option>`).join('');
    document.getElementById('pr-from').value = todayISO();
    document.getElementById('pr-to').value = todayISO();
    addWorkerRow();
    addItemRow();
    addPersonalItemRow();

    openDB().then(async () => {
      await seedDataIfEmpty();
      await loadRecords();
      await loadCapitalAndAdvances();
      await loadHarvestSharePcts();
      await loadExtras();
      await loadLoans();
      await loadPlantationPricing();
      await loadPlantationSales();
      await loadWeatherSettings();
      await loadActivities();
      await loadProducts();
      await loadOrders();
      await loadOwnerPin();
      await migrateLegacyMaizeData();
      refreshAll();
      fetchWeather();
      setupAutoSave();
    }).catch(async err => {
      console.warn('IndexedDB not available, using localStorage fallback.');
      showToast('⚠️ Using localStorage fallback. Data will persist but may be less reliable.', 'error', 5000);
      try {
        const data = localStorage.getItem(STORAGE_KEY);
        if (data) {
          const parsed = JSON.parse(data);
          records = parsed.records || [];
          nextId = parsed.nextId || 1;
        } else {
          records = SAMPLE_RECORDS;
          nextId = Math.max(...records.map(r => r.id)) + 1;
          localStorage.setItem(STORAGE_KEY, JSON.stringify({ records, nextId }));
        }

        const personalData = localStorage.getItem(PERSONAL_STORAGE_KEY);
        if (personalData) {
          const parsed = JSON.parse(personalData);
          personalRecords = parsed.records || [];
          nextPersonalId = parsed.nextId || 1;
        } else {
          personalRecords = SAMPLE_PERSONAL_RECORDS;
          nextPersonalId = Math.max(...personalRecords.map(r => r.id)) + 1;
          localStorage.setItem(PERSONAL_STORAGE_KEY, JSON.stringify({ records: personalRecords, nextId: nextPersonalId }));
        }

        const salesData = localStorage.getItem(SALES_STORAGE_KEY);
        if (salesData) {
          grossSales = JSON.parse(salesData) || {};
        } else {
          grossSales = SAMPLE_GROSS_SALES;
          localStorage.setItem(SALES_STORAGE_KEY, JSON.stringify(grossSales));
        }

        const capitalData = localStorage.getItem(CAPITAL_STORAGE_KEY);
        if (capitalData) {
          const parsed = JSON.parse(capitalData);
          startingCapital = parsed.startingCapital || {};
          capitalEntries = parsed.capitalEntries || [];
          nextCapitalId = parsed.nextCapitalId || 1;
        } else {
          startingCapital = SAMPLE_STARTING_CAPITAL;
          capitalEntries = [];
          nextCapitalId = 1;
          localStorage.setItem(CAPITAL_STORAGE_KEY, JSON.stringify({ startingCapital, capitalEntries, nextCapitalId }));
        }

        PLANTATION_TYPES.forEach(type => {
          if (startingCapital[type] === undefined) startingCapital[type] = DEFAULT_STARTING_CAPITAL[type] ?? 0;
        });

        const advanceData = localStorage.getItem(ADVANCE_STORAGE_KEY);
        if (advanceData) {
          const parsed = JSON.parse(advanceData);
          cashAdvances = parsed.advances || [];
          nextAdvanceId = parsed.nextId || 1;
        } else {
          cashAdvances = SAMPLE_CASH_ADVANCES;
          nextAdvanceId = cashAdvances.length ? Math.max(...cashAdvances.map(a => a.id)) + 1 : 1;
          localStorage.setItem(ADVANCE_STORAGE_KEY, JSON.stringify({ advances: cashAdvances, nextId: nextAdvanceId }));
        }

        const shareData = localStorage.getItem(HARVEST_SHARE_STORAGE_KEY);
        if (shareData) {
          harvestSharePct = JSON.parse(shareData) || {};
        } else {
          harvestSharePct = { ...DEFAULT_HARVEST_SHARE_PCT };
          localStorage.setItem(HARVEST_SHARE_STORAGE_KEY, JSON.stringify(harvestSharePct));
        }
        PLANTATION_TYPES.forEach(type => {
          if (harvestSharePct[type] === undefined) harvestSharePct[type] = DEFAULT_HARVEST_SHARE_PCT[type] ?? 0;
        });

        const loanData = localStorage.getItem(LOAN_STORAGE_KEY);
        if (loanData) {
          const parsed = JSON.parse(loanData);
          lenderLoans = parsed.loans || [];
          nextLoanId = parsed.nextId || 1;
        } else {
          lenderLoans = [];
          nextLoanId = 1;
          localStorage.setItem(LOAN_STORAGE_KEY, JSON.stringify({ loans: lenderLoans, nextId: nextLoanId }));
        }

        const pricingData = localStorage.getItem(PLANTATION_PRICING_KEY);
        if (pricingData) {
          plantationPricing = JSON.parse(pricingData) || {};
        } else {
          plantationPricing = {};
          localStorage.setItem(PLANTATION_PRICING_KEY, JSON.stringify(plantationPricing));
        }

        const plantationSalesData = localStorage.getItem(PLANTATION_SALES_KEY);
        if (plantationSalesData) {
          const parsed = JSON.parse(plantationSalesData);
          plantationSales = parsed.sales || [];
          nextSaleId = parsed.nextId || (plantationSales.length ? Math.max(...plantationSales.map(s => s.id)) + 1 : 1);
        } else {
          plantationSales = [];
          nextSaleId = 1;
          localStorage.setItem(PLANTATION_SALES_KEY, JSON.stringify({ sales: plantationSales, nextId: nextSaleId }));
        }

        const activityData = localStorage.getItem('activity-records');
        if (activityData) {
          const parsed = JSON.parse(activityData);
          activityRecords = parsed.records || [];
          nextActivityId = parsed.nextId || (activityRecords.length ? Math.max(...activityRecords.map(a => a.id)) + 1 : 1);
        } else {
          activityRecords = [];
          nextActivityId = 1;
          localStorage.setItem('activity-records', JSON.stringify({ records: activityRecords, nextId: nextActivityId }));
        }
      } catch (e) {
        console.error('LocalStorage fallback error:', e);
      }
      await loadOwnerPin();
      await migrateLegacyMaizeData();
      refreshAll();
      setupAutoSave();
    });

    console.log('🌱 Valley and Creeks Farm initialized');
    console.log(`📊 ${records.length} business records, ${personalRecords.length} personal records, ${activityRecords.length} diary entries`);
    console.log('💡 Keyboard shortcuts: Ctrl+F to search, Esc to clear filters');
