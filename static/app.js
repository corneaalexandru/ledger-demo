const DASHBOARD_CARD_STORAGE_KEY = "ledger-hidden-dashboard-cards";
const PRIVACY_MODE_STORAGE_KEY = "ledger-privacy-mode";
const INTELLIGENCE_THRESHOLDS_STORAGE_KEY = "ledger-intelligence-thresholds";
const INTELLIGENCE_THRESHOLDS_SCHEMA_VERSION = 2;
const PROJECT_CURRENCY_STORAGE_KEY = "ledger-project-currency";
const SIDEBAR_WIDTH_STORAGE_KEY = "ledger-sidebar-width";
const SIDEBAR_DEFAULT_WIDTH = 214;
const SIDEBAR_MIN_WIDTH = 168;
const SIDEBAR_MAX_WIDTH = 360;

const ISO_COUNTRY_CODES = [
  "AD", "AE", "AF", "AG", "AI", "AL", "AM", "AO", "AQ", "AR", "AS", "AT", "AU", "AW", "AX", "AZ",
  "BA", "BB", "BD", "BE", "BF", "BG", "BH", "BI", "BJ", "BL", "BM", "BN", "BO", "BQ", "BR", "BS",
  "BT", "BV", "BW", "BY", "BZ", "CA", "CC", "CD", "CF", "CG", "CH", "CI", "CK", "CL", "CM", "CN",
  "CO", "CR", "CU", "CV", "CW", "CX", "CY", "CZ", "DE", "DJ", "DK", "DM", "DO", "DZ", "EC", "EE",
  "EG", "EH", "ER", "ES", "ET", "FI", "FJ", "FK", "FM", "FO", "FR", "GA", "GB", "GD", "GE", "GF",
  "GG", "GH", "GI", "GL", "GM", "GN", "GP", "GQ", "GR", "GS", "GT", "GU", "GW", "GY", "HK", "HM",
  "HN", "HR", "HT", "HU", "ID", "IE", "IL", "IM", "IN", "IO", "IQ", "IR", "IS", "IT", "JE", "JM",
  "JO", "JP", "KE", "KG", "KH", "KI", "KM", "KN", "KP", "KR", "KW", "KY", "KZ", "LA", "LB", "LC",
  "LI", "LK", "LR", "LS", "LT", "LU", "LV", "LY", "MA", "MC", "MD", "ME", "MF", "MG", "MH", "MK",
  "ML", "MM", "MN", "MO", "MP", "MQ", "MR", "MS", "MT", "MU", "MV", "MW", "MX", "MY", "MZ", "NA",
  "NC", "NE", "NF", "NG", "NI", "NL", "NO", "NP", "NR", "NU", "NZ", "OM", "PA", "PE", "PF", "PG",
  "PH", "PK", "PL", "PM", "PN", "PR", "PS", "PT", "PW", "PY", "QA", "RE", "RO", "RS", "RU", "RW",
  "SA", "SB", "SC", "SD", "SE", "SG", "SH", "SI", "SJ", "SK", "SL", "SM", "SN", "SO", "SR", "SS",
  "ST", "SV", "SX", "SY", "SZ", "TC", "TD", "TF", "TG", "TH", "TJ", "TK", "TL", "TM", "TN", "TO",
  "TR", "TT", "TV", "TW", "TZ", "UA", "UG", "UM", "US", "UY", "UZ", "VA", "VC", "VE", "VG", "VI",
  "VN", "VU", "WF", "WS", "YE", "YT", "ZA", "ZM", "ZW", "XK",
];

const COUNTRY_CODE_ALIASES = {
  UAE: "AE",
  UK: "GB",
  USA: "US",
  UNITEDARABEMIRATES: "AE",
  UNITEDKINGDOM: "GB",
  UNITEDSTATES: "US",
};

const COUNTRY_NAME_OVERRIDES = {
  XK: "Kosovo",
};

const PROJECT_CURRENCY_RATES_TO_EUR = {
  EUR: 1,
  USD: 0.92,
  AED: 0.25,
  RON: 0.20,
  GBP: 1.17,
  CHF: 1.04,
  CAD: 0.67,
  AUD: 0.61,
  INR: 0.011,
  JPY: 0.006,
};

const PROJECT_CURRENCY_FALLBACK_CODES = Object.keys(PROJECT_CURRENCY_RATES_TO_EUR);

const state = {
  view: "overview",
  query: "",
  overview: null,
  accounts: null,
  transactions: null,
  trades: null,
  portfolioReturns: null,
  statementImport: null,
  globalSearch: null,
  cacheStatus: null,
  dataHealth: null,
  profile: null,
  aboutChangelog: null,
  loading: {
    overview: false,
    accounts: false,
    transactions: false,
    trades: false,
    portfolioReturns: false,
    statementImport: false,
    globalSearch: false,
    settingsDiagnostics: false,
    profile: false,
    aboutChangelog: false,
  },
  error: {
    overview: "",
    accounts: "",
    transactions: "",
    trades: "",
    portfolioReturns: "",
    statementImport: "",
    globalSearch: "",
    settingsDiagnostics: "",
    profile: "",
    aboutChangelog: "",
  },
  accountFilters: defaultAccountFilters(),
  accountOffset: 0,
  accountPageSize: 50,
  accountSort: {
    field: "balance",
    direction: "desc",
  },
  accountView: "register",
  selectedAccounts: new Set(),
  selectedAccountId: "",
  selectedAccountEditing: false,
  accountActionError: "",
  transactionFilters: defaultTransactionFilters(),
  transactionOffset: 0,
  transactionPageSize: 50,
  transactionSort: {
    field: "transaction_date",
    direction: "desc",
  },
  transactionView: "register",
  selectedTransactions: new Set(),
  selectedTransactionId: "",
  selectedTransactionEditing: false,
  transactionActionError: "",
  selectedStatementImportRecords: new Set(),
  selectedStatementImportFiles: new Set(),
  statementImportActionMessage: "",
  statementImportActionError: "",
  tradeFilters: defaultTradeFilters(),
  tradeOffset: 0,
  tradePageSize: 50,
  tradeSort: {
    field: "activity_date",
    direction: "desc",
  },
  tradeView: "register",
  selectedTrades: new Set(),
  selectedTradeId: "",
  selectedTradeEditing: false,
  tradeActionError: "",
  tradePriceRefresh: {
    loading: false,
    message: "",
    error: "",
  },
  selectedPortfolioInstruments: new Set(),
  selectedPortfolioInstrumentId: "",
  selectedPortfolioInstrumentEditing: false,
  portfolioInstrumentOverrides: {},
  deletedPortfolioInstrumentIds: new Set(),
  portfolioActionError: "",
  selectedPortfolioMipId: "",
  selectedPortfolioMipEditing: false,
  portfolioMipOverrides: {},
  portfolioMipActionError: "",
  profileActionMessage: "",
  profileActionError: "",
  selectedExitPhaseId: "",
  selectedExitPhaseEditing: false,
  exitPhaseActionError: "",
  aboutView: "copyright",
  overviewView: "insights",
  portfolioView: "overview",
  portfolioPerformanceWindow: "all",
  portfolioReturnsWindow: "all",
  reportNetWorthWindow: "all",
  reportCashFlowWindow: "all",
  cashFlowContextLines: new Set(["income", "expense"]),
  standardChartHiddenLines: new Map(),
  reportForecastYears: "10",
  monteCarloWindow: "plan",
  monteCarloScope: "plan",
  monteCarloContextLines: new Set(),
  netWorthContextLines: new Set(),
  expandedChartId: "",
  reportForecastOverrides: defaultReportForecastOverrides(),
  planningView: "targets",
  monthlyTargetOverrides: {},
  yearlyTargetOverrides: {},
  monthlyTargetSort: {
    field: "month",
    direction: "desc",
  },
  selectedMonthlyTargetMonth: "",
  selectedYearlyTargetYear: "",
  targetDetailEditing: false,
  intelligenceThresholds: readIntelligenceThresholds(),
  statement: {
    transactionId: "",
    data: null,
    loading: false,
    error: "",
  },
  dashboardCardMenuOpen: false,
  hiddenDashboardCards: readHiddenDashboardCards(),
  privacyMode: readPrivacyMode(),
  projectCurrency: readProjectCurrency(),
  periodPanelOpen: false,
  period: {
    mode: "all",
    day: currentDateKey(),
    dayMonth: currentMonthKey(),
    dayPickerMonth: "",
    month: currentMonthKey(),
    year: currentYear(),
    calendarYear: currentYear(),
    yearRangeStart: currentYear() - 5,
  },
  quickFilters: {
    accounts: {},
    transactions: {},
    trades: {},
  },
};

const PAGE_SIZE_OPTIONS = [25, 50, 100, 250, 500, "all"];

const MODERATE_INDEX_RATE = 0.06;
const NET_WORTH_CONTEXT_DEFAULT_LINES = [
  "leakage-adjusted",
  "compounding-adjusted",
  "total-income",
  "forecast",
];
const REVIEW_REQUIRED_TAB = "__review_required__";
const DELETED_TRANSACTION_TAB = "__deleted_transactions__";
const ACCOUNTABLE_TRANSACTION_TAB = "__accountable_transactions__";
const NOT_ACCOUNTABLE_TRANSACTION_TAB = "__not_accountable_transactions__";
const currencySymbolOverrides = {
  AED: "د.إ",
  AUD: "A$",
  CAD: "C$",
  CHF: "CHF",
  CNY: "¥",
  EUR: "€",
  GBP: "£",
  HKD: "HK$",
  INR: "₹",
  JPY: "¥",
  RON: "lei",
  SGD: "S$",
  USD: "$",
};

const navItems = [
  { id: "overview", label: "Overview", icon: "home" },
  { id: "accounts", label: "Accounts", icon: "wallet" },
  { id: "transactions", label: "Transactions", icon: "receipt" },
  { id: "statementImport", label: "Statements Import", icon: "paperclip" },
  { id: "trades", label: "Trades", icon: "trendUp" },
  { id: "portfolio", label: "Portfolio", icon: "pie" },
  { id: "planning", label: "Planning", icon: "target" },
  { id: "settings", label: "Settings", icon: "settings" },
  { id: "about", label: "About", icon: "info" },
];

const registerPurpose = {
  accounts_register: "Accounts, native balances, credit limits, and review state.",
  transactions_register: "Income, expenses, transfer records, categories, FX amounts, and import status.",
  trades_register: "Positions, market values, realized P/L, and unrealized P/L.",
};

const connectionItems = [
  {
    name: "Google service account",
    detail: "Configured",
    state: "Ready",
  },
  {
    name: "Environment config",
    detail: "Configured",
    state: "Ready",
  },
  {
    name: "Sheets client",
    detail: "Configured",
    state: "Ready",
  },
  {
    name: "Read API",
    detail: "Configured",
    state: "Live",
  },
];

const icons = {
  home: '<svg viewBox="0 0 24 24"><path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10.5V20h5v-5h3v5h5v-9.5"/></svg>',
  info: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 11v5"/><path d="M12 8h.01"/></svg>',
  user: '<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>',
  save: '<svg viewBox="0 0 24 24"><path d="M5 3h12l2 2v16H5z"/><path d="M8 3v6h8V3"/><path d="M8 21v-7h8v7"/></svg>',
  receipt: '<svg viewBox="0 0 24 24"><path d="M6 2h12v20l-3-2-3 2-3-2-3 2z"/><path d="M9 7h6"/><path d="M9 11h6"/><path d="M9 15h4"/></svg>',
  search: '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m16 16 4 4"/></svg>',
  filter: '<svg viewBox="0 0 24 24"><path d="M4 5h16l-6.5 7.5V18l-3 1.5v-7z"/></svg>',
  table: '<svg viewBox="0 0 24 24"><path d="M4 5h16v14H4z"/><path d="M4 10h16"/><path d="M4 15h16"/><path d="M10 5v14"/><path d="M16 5v14"/></svg>',
  target: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/><path d="M12 2v3"/><path d="M12 19v3"/><path d="M2 12h3"/><path d="M19 12h3"/></svg>',
  settings: '<svg viewBox="0 0 24 24"><path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"/><path d="M19.4 15a8.1 8.1 0 0 0 .1-1l2-1.5-2-3.5-2.4 1a7.4 7.4 0 0 0-1.7-1l-.3-2.6h-4l-.4 2.6a7.4 7.4 0 0 0-1.7 1l-2.4-1-2 3.5 2 1.5a8.1 8.1 0 0 0 .1 2l-2 1.5 2 3.5 2.4-1a7.4 7.4 0 0 0 1.7 1l.4 2.6h4l.3-2.6a7.4 7.4 0 0 0 1.7-1l2.4 1 2-3.5z"/></svg>',
  plus: '<svg viewBox="0 0 24 24"><path d="M12 5v14"/><path d="M5 12h14"/></svg>',
  refresh: '<svg viewBox="0 0 24 24"><path d="M20 12a8 8 0 0 1-13.7 5.6"/><path d="M4 12A8 8 0 0 1 17.7 6.4"/><path d="M18 3v4h-4"/><path d="M6 21v-4h4"/></svg>',
  calendar: '<svg viewBox="0 0 24 24"><path d="M5 5h14v15H5z"/><path d="M5 9h14"/><path d="M8 3v4"/><path d="M16 3v4"/><path d="M8 13h3"/><path d="M13 13h3"/><path d="M8 16h3"/></svg>',
  calendarYear: '<svg viewBox="0 0 24 24"><path d="M5 5h14v15H5z"/><path d="M5 9h14"/><path d="M8 3v4"/><path d="M16 3v4"/><path d="M8 14h8"/><path d="M8 17h5"/></svg>',
  globe: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/><path d="M4 12h16"/><path d="M12 4a12 12 0 0 1 0 16"/><path d="M12 4a12 12 0 0 0 0 16"/></svg>',
  trendUp: '<svg viewBox="0 0 24 24"><path d="m4 16 6-6 4 4 6-8"/><path d="M15 6h5v5"/></svg>',
  trendDown: '<svg viewBox="0 0 24 24"><path d="m4 8 6 6 4-4 6 8"/><path d="M15 18h5v-5"/></svg>',
  pie: '<svg viewBox="0 0 24 24"><path d="M12 4v8h8"/><path d="M20 12a8 8 0 1 1-8-8"/></svg>',
  currency: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/><path d="M8 9.5h6a2 2 0 0 1 0 4h-4a2 2 0 0 0 0 4h6"/><path d="M12 7v10"/></svg>',
  wallet: '<svg viewBox="0 0 24 24"><path d="M4 7h15a2 2 0 0 1 2 2v9H4z"/><path d="M4 7V5h13"/><path d="M16 13h5"/></svg>',
  bank: '<svg viewBox="0 0 24 24"><path d="M4 10h16"/><path d="M6 10v8"/><path d="M10 10v8"/><path d="M14 10v8"/><path d="M18 10v8"/><path d="M3 18h18"/><path d="M12 4 4 8h16z"/></svg>',
  creditCard: '<svg viewBox="0 0 24 24"><rect x="3.5" y="6" width="17" height="12" rx="2"/><path d="M3.5 10h17"/><path d="M7 14h4"/></svg>',
  phoneWallet: '<svg viewBox="0 0 24 24"><rect x="7" y="3" width="10" height="18" rx="2"/><path d="M10 7h4"/><path d="M10 15h4"/><path d="M12 18h.01"/></svg>',
  mail: '<svg viewBox="0 0 24 24"><path d="M4 6h16v12H4z"/><path d="m4 7 8 6 8-6"/></svg>',
  shield: '<svg viewBox="0 0 24 24"><path d="M12 3 5 6v5c0 4.5 2.8 8 7 10 4.2-2 7-5.5 7-10V6z"/><path d="M9 12h6"/><path d="M12 9v6"/></svg>',
  eyeOff: '<svg viewBox="0 0 24 24"><path d="m3 3 18 18"/><path d="M10.6 10.6A2 2 0 0 0 13.4 13.4"/><path d="M9.9 5.2A10.4 10.4 0 0 1 12 5c5 0 8.5 4 9.5 7a10.8 10.8 0 0 1-2.1 3.4"/><path d="M6.2 6.7A10.8 10.8 0 0 0 2.5 12c1 3 4.5 7 9.5 7a10 10 0 0 0 4.1-.9"/></svg>',
  arrowsLeftRight: '<svg viewBox="0 0 24 24"><path d="M7 7h12"/><path d="m15 3 4 4-4 4"/><path d="M17 17H5"/><path d="m9 13-4 4 4 4"/></svg>',
  bed: '<svg viewBox="0 0 24 24"><path d="M4 5v14"/><path d="M20 11v8"/><path d="M4 12h16"/><path d="M7 8h4v4H7z"/><path d="M4 19h16"/></svg>',
  briefcase: '<svg viewBox="0 0 24 24"><path d="M8 7V5h8v2"/><path d="M4 7h16v12H4z"/><path d="M4 12h16"/><path d="M10 12v2h4v-2"/></svg>',
  car: '<svg viewBox="0 0 24 24"><path d="m5 13 2-5h10l2 5"/><path d="M4 13h16v5H4z"/><path d="M7 18v2"/><path d="M17 18v2"/><circle cx="8" cy="15.5" r="1"/><circle cx="16" cy="15.5" r="1"/></svg>',
  heartPulse: '<svg viewBox="0 0 24 24"><path d="M20.5 8.5c0 5-8.5 10.5-8.5 10.5S3.5 13.5 3.5 8.5A4.5 4.5 0 0 1 12 6a4.5 4.5 0 0 1 8.5 2.5z"/><path d="M7 12h3l1-3 2 6 1-3h3"/></svg>',
  laptop: '<svg viewBox="0 0 24 24"><path d="M5 5h14v10H5z"/><path d="M3 19h18"/><path d="m8 15-1 4"/><path d="m16 15 1 4"/></svg>',
  utensils: '<svg viewBox="0 0 24 24"><path d="M7 3v8"/><path d="M4.5 3v5.5A2.5 2.5 0 0 0 7 11v10"/><path d="M9.5 3v5.5A2.5 2.5 0 0 1 7 11"/><path d="M16 3v18"/><path d="M16 3c2.2 1.6 3.5 4 3.5 6.5 0 2.4-1.1 4.2-3.5 5"/></svg>',
  wrench: '<svg viewBox="0 0 24 24"><path d="M14.5 6.5a4.5 4.5 0 0 0 5.1 5.1L10 21l-5-5 9.4-9.5z"/><path d="m6.5 17.5 2 2"/></svg>',
  fileText: '<svg viewBox="0 0 24 24"><path d="M7 3.5h7l3 3V20H7z"/><path d="M14 3.5v3h3"/><path d="M9.5 11h5"/><path d="M9.5 14h5"/><path d="M9.5 17h3"/></svg>',
  print: '<svg viewBox="0 0 24 24"><path d="M7 9V4h10v5"/><path d="M7 17H5a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2"/><path d="M7 14h10v6H7z"/><path d="M8 12h.01"/></svg>',
  externalLink: '<svg viewBox="0 0 24 24"><path d="M14 5h5v5"/><path d="m10 14 9-9"/><path d="M19 14v5H5V5h5"/></svg>',
  paperclip: '<svg viewBox="0 0 24 24"><path d="m21 8.5-9.4 9.4a5 5 0 0 1-7.1-7.1l9.6-9.6a3.5 3.5 0 0 1 5 5l-9.6 9.6a2 2 0 1 1-2.8-2.8l8.8-8.8"/></svg>',
  database: '<svg viewBox="0 0 24 24"><ellipse cx="12" cy="5" rx="7" ry="3"/><path d="M5 5v7c0 1.7 3.1 3 7 3s7-1.3 7-3V5"/><path d="M5 12v7c0 1.7 3.1 3 7 3s7-1.3 7-3v-7"/></svg>',
  plug: '<svg viewBox="0 0 24 24"><path d="M8 7h8v5a4 4 0 0 1-8 0z"/><path d="M10 2v5"/><path d="M14 2v5"/><path d="M12 16v6"/></svg>',
  gauge: '<svg viewBox="0 0 24 24"><path d="M4 14a8 8 0 0 1 16 0"/><path d="M12 14l4-5"/><path d="M7 14h.01"/><path d="M17 14h.01"/><path d="M10 20h4"/></svg>',
  scale: '<svg viewBox="0 0 24 24"><path d="M12 3v18"/><path d="M5 7h14"/><path d="m7 7-4 7h8z"/><path d="m17 7-4 7h8z"/></svg>',
  chevronLeft: '<svg viewBox="0 0 24 24"><path d="m15 18-6-6 6-6"/></svg>',
  chevronRight: '<svg viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></svg>',
  edit: '<svg viewBox="0 0 24 24"><path d="M12 20h9"/><path d="m16.5 3.5 4 4L8 20H4v-4z"/></svg>',
  copy: '<svg viewBox="0 0 24 24"><path d="M8 8h11v11H8z"/><path d="M5 16H4V4h12v1"/></svg>',
  undo: '<svg viewBox="0 0 24 24"><path d="M9 7 4 12l5 5"/><path d="M5 12h9a5 5 0 1 1 0 10h-2"/></svg>',
  trash: '<svg viewBox="0 0 24 24"><path d="M4 7h16"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M6 7l1 14h10l1-14"/><path d="M9 7V4h6v3"/></svg>',
  check: '<svg viewBox="0 0 24 24"><path d="m5 12 4 4 10-10"/></svg>',
  x: '<svg viewBox="0 0 24 24"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',
  maximize: '<svg viewBox="0 0 24 24"><path d="M8 3H3v5"/><path d="M16 3h5v5"/><path d="M21 16v5h-5"/><path d="M3 16v5h5"/><path d="M3 3l6 6"/><path d="m15 9 6-6"/><path d="m21 21-6-6"/><path d="m9 15-6 6"/></svg>',
  sun: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v3"/><path d="M12 19v3"/><path d="M4.9 4.9 7 7"/><path d="m17 17 2.1 2.1"/><path d="M2 12h3"/><path d="M19 12h3"/><path d="m4.9 19.1 2.1-2.1"/><path d="m17 7 2.1-2.1"/></svg>',
  moon: '<svg viewBox="0 0 24 24"><path d="M20 15.5A8.5 8.5 0 0 1 8.5 4 8.5 8.5 0 1 0 20 15.5z"/></svg>',
};

const elements = {
  navList: document.querySelector("#navList"),
  pageStage: document.querySelector("#pageStage"),
  sidebarResizer: document.querySelector("#sidebarResizer"),
  themeToggle: document.querySelector("#themeToggle"),
  refreshAction: document.querySelector("#refreshAction"),
  privacyAction: document.querySelector("#privacyAction"),
  search: document.querySelector("#globalSearch"),
  filterChips: document.querySelector("#activeFilterChips"),
  pagePrintControl: document.querySelector("#pagePrintControl"),
  periodControl: document.querySelector("#periodControl"),
};

let searchDebounce = null;

function defaultReportForecastOverrides() {
  return {
    monthlyFlow: "",
    annualReturnPct: "",
  };
}

function resetReportForecastOverrides() {
  state.reportForecastOverrides = defaultReportForecastOverrides();
}

function resetMonthlyTargetOverrides() {
  state.monthlyTargetOverrides = {};
  state.yearlyTargetOverrides = {};
  state.selectedMonthlyTargetMonth = "";
  state.selectedYearlyTargetYear = "";
  state.targetDetailEditing = false;
}

function resetPortfolioDetailState() {
  state.selectedPortfolioInstruments.clear();
  state.selectedPortfolioInstrumentId = "";
  state.selectedPortfolioInstrumentEditing = false;
  state.portfolioActionError = "";
  state.selectedPortfolioMipId = "";
  state.selectedPortfolioMipEditing = false;
  state.portfolioMipActionError = "";
}

const MONTHLY_TARGET_EDITABLE_FIELDS = new Set([
  "income_target_eur",
  "expense_ceiling_eur",
  "expense_target_pct",
  "savings_target_eur",
  "savings_target_pct",
]);

const YEARLY_TARGET_EDITABLE_FIELDS = new Set([
  "income_baseline_eur",
  "expense_ceiling_eur",
  "expense_target_pct",
  "target_savings_eur",
  "savings_target_pct",
]);

const TARGET_ITEM_EDITABLE_FIELDS = new Set(["target_eur"]);

function updateReportForecastOverride(control, shouldRender = true) {
  const field = control?.dataset?.reportForecastField || "";
  if (!["monthlyFlow", "annualReturnPct"].includes(field)) return;
  if (!validateFormattedNumberInput(control)) return;
  const nextValue = String(control.value || "").trim();
  state.reportForecastOverrides = {
    ...defaultReportForecastOverrides(),
    ...(state.reportForecastOverrides || {}),
    [field]: nextValue,
  };
  if (shouldRender) renderPreservingScroll();
}

function updateIntelligenceThreshold(control) {
  const field = control?.dataset?.thresholdField || "";
  const defaults = defaultIntelligenceThresholds();
  if (!Object.prototype.hasOwnProperty.call(defaults, field)) return;
  if (!validateFormattedNumberInput(control)) return;
  state.intelligenceThresholds = normalizeIntelligenceThresholds({
    ...(state.intelligenceThresholds || {}),
    [field]: numericValue(control.value, defaults[field]),
  });
  persistIntelligenceThresholds();
  if (state.view === "trades") {
    if (state.tradeView === "returns") {
      state.portfolioReturns = null;
      loadPortfolioReturns();
    } else {
      loadTrades();
    }
  } else {
    render();
  }
}

function updateMonthlyTargetOverride(control, shouldRender = true) {
  const month = control?.dataset?.monthlyTargetMonth || "";
  const field = control?.dataset?.monthlyTargetField || "";
  if (!month || !field || !MONTHLY_TARGET_EDITABLE_FIELDS.has(field)) return;
  const value = String(control.value || "").trim();
  const next = {
    ...(state.monthlyTargetOverrides || {}),
    [month]: {
      ...((state.monthlyTargetOverrides || {})[month] || {}),
    },
  };
  if (!value) {
    delete next[month][field];
  } else {
    next[month][field] = parseFormattedNumber(value);
  }
  if (!Object.keys(next[month]).length) {
    delete next[month];
  }
  state.monthlyTargetOverrides = next;
  if (shouldRender) render();
}

function updateMonthlyTargetItemOverride(control, shouldRender = true) {
  const month = control?.dataset?.monthlyTargetMonth || "";
  const group = control?.dataset?.monthlyTargetGroup || "";
  const name = control?.dataset?.monthlyTargetName || "";
  const field = control?.dataset?.monthlyTargetItemField || "";
  if (!month || !group || !name || !field || !TARGET_ITEM_EDITABLE_FIELDS.has(field)) return;
  const value = String(control.value || "").trim();
  const key = `${group}:${name}:${field}`;
  const next = {
    ...(state.monthlyTargetOverrides || {}),
    [month]: {
      ...((state.monthlyTargetOverrides || {})[month] || {}),
    },
  };
  if (!value) {
    delete next[month][key];
  } else {
    next[month][key] = parseFormattedNumber(value);
  }
  if (!Object.keys(next[month]).length) {
    delete next[month];
  }
  state.monthlyTargetOverrides = next;
  if (shouldRender) render();
}

function updateYearlyTargetOverride(control, shouldRender = true) {
  const year = control?.dataset?.yearlyTargetYear || "";
  const field = control?.dataset?.yearlyTargetField || "";
  if (isYearlyTargetLocked(year)) return;
  if (!year || !field || !YEARLY_TARGET_EDITABLE_FIELDS.has(field)) return;
  const value = String(control.value || "").trim();
  const next = {
    ...(state.yearlyTargetOverrides || {}),
    [year]: {
      ...((state.yearlyTargetOverrides || {})[year] || {}),
    },
  };
  if (!value) {
    delete next[year][field];
  } else {
    next[year][field] = parseFormattedNumber(value);
  }
  if (!Object.keys(next[year]).length) {
    delete next[year];
  }
  state.yearlyTargetOverrides = next;
  if (shouldRender) render();
}

function isYearlyTargetLocked(rowOrYear) {
  return Boolean(rowOrYear && typeof rowOrYear === "object" && rowOrYear.locked);
}

function handleFormattedNumberInput(control) {
  if (!control) return true;
  if (numberInputHasInvalidCharacters(control)) {
    control.classList.add("is-invalid");
    control.setAttribute("aria-invalid", "true");
    control.setCustomValidity("Enter a numeric value.");
    return false;
  }
  const formatted = formatEditableNumber(control.value, {
    allowNegative: control.dataset.formatAllowNegative !== "false",
  });
  if (control.value !== formatted) {
    const atEnd = control.selectionStart === control.value.length;
    control.value = formatted;
    if (atEnd) control.setSelectionRange(control.value.length, control.value.length);
  }
  return validateFormattedNumberInput(control);
}

function validateFormattedNumberInput(control) {
  if (!control) return true;
  const required = control.hasAttribute("required");
  const raw = String(control.value || "").trim();
  const valid = !numberInputHasInvalidCharacters(control) && ((!raw && !required) || Number.isFinite(parseFormattedNumber(raw)));
  control.classList.toggle("is-invalid", !valid);
  control.setAttribute("aria-invalid", valid ? "false" : "true");
  control.setCustomValidity(valid ? "" : "Enter a numeric value.");
  return valid;
}

function numberInputHasInvalidCharacters(control) {
  const raw = String(control?.value || "");
  const allowsPercent = Boolean(control?.matches?.("[data-format-percent]"));
  const pattern = allowsPercent ? /[^\d.,\-\s%]/ : /[^\d.,\-\s]/;
  return pattern.test(raw);
}

function formatEditableNumber(value, options = {}) {
  const allowNegative = options.allowNegative !== false;
  const raw = String(value ?? "");
  const negative = allowNegative && raw.trim().startsWith("-");
  const cleaned = raw.replace(/[^\d.]/g, "");
  if (!cleaned) return negative ? "-" : "";
  const [integerPart, ...decimalParts] = cleaned.split(".");
  const integer = integerPart.replace(/^0+(?=\d)/, "") || "0";
  const grouped = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const decimal = decimalParts.length ? `.${decimalParts.join("").slice(0, 4)}` : "";
  return `${negative ? "-" : ""}${grouped}${decimal}`;
}

function parseFormattedNumber(value, fallback = Number.NaN) {
  const raw = String(value ?? "").replace(/,/g, "").trim();
  if (!raw || raw === "-" || raw === ".") return fallback;
  const numeric = Number(raw);
  return Number.isFinite(numeric) ? numeric : fallback;
}

let periodMonthClickTimer = null;
let pendingPeriodMonth = "";
let overviewRequestId = 0;
let accountRequestId = 0;
let transactionRequestId = 0;
let statementImportRequestId = 0;
let tradeRequestId = 0;
let portfolioReturnsRequestId = 0;
let globalSearchRequestId = 0;
let settingsDiagnosticsRequestId = 0;
let profileRequestId = 0;
let aboutChangelogRequestId = 0;

const transactionFields = [
  ["transaction_id", "Transaction ID"],
  ["source_system", "Source System"],
  ["ledger_status", "Ledger Status"],
  ["transaction_date", "Transaction Date"],
  ["posted_date", "Posted Date"],
  ["transaction_class", "Class"],
  ["transfer_scope", "Transfer Scope"],
  ["category_id", "Category"],
  ["subcategory_id", "Subcategory"],
  ["counterparty_name", "Counterparty"],
  ["memo", "Memo"],
  ["country_code", "Country"],
  ["statement_currency", "Currency"],
  ["statement_amount", "Statement Amount"],
  ["sanitized_statement_amount", "Sanitized Amount"],
  ["amount_usd_converted", "USD Amount"],
  ["amount_eur_converted", "Project Amount"],
  ["imported_transaction", "Imported"],
  ["review_status", "Review"],
];

const tradeFields = [
  ["trade_id", "Trade ID"],
  ["account_id", "Account ID"],
  ["portfolio_id", "Portfolio"],
  ["provider_id", "Provider"],
  ["symbol", "Symbol"],
  ["asset_name", "Asset"],
  ["instrument_type", "Instrument"],
  ["trade_currency", "Currency"],
  ["quantity", "Quantity"],
  ["entry_date", "Entry Date"],
  ["entry_price", "Entry Price"],
  ["exit_date", "Exit Date"],
  ["exit_price", "Exit Price"],
  ["current_price", "Current Price"],
  ["price_as_of", "Price As Of"],
  ["fees_native", "Fees"],
  ["ledger_status", "Ledger Status"],
  ["review_status", "Review"],
  ["notes", "Notes"],
];

const accountFields = [
  ["account_id", "Account ID"],
  ["provider_id", "Provider"],
  ["account_reference", "Reference"],
  ["account_status", "Status"],
  ["capital_bucket", "Capital Bucket"],
  ["account_type", "Type"],
  ["account_currency", "Currency"],
  ["balance_native", "Native Balance"],
  ["credit_limit_native", "Credit Limit"],
  ["available_credit_native", "Available Credit"],
  ["ledger_status", "Ledger Status"],
  ["review_status", "Review"],
  ["notes", "Notes"],
];

const portfolioInstrumentFields = [
  ["portfolio_id", "Portfolio ID"],
  ["portfolio_name", "Portfolio"],
  ["provider", "Provider"],
  ["base_currency", "Base Currency"],
  ["asset_bucket", "Asset Bucket"],
  ["asset_name", "Instrument Name"],
  ["ticker", "Ticker"],
  ["exchange", "Exchange"],
  ["asset_class", "Asset Class"],
  ["isin", "ISIN"],
  ["current_value_native", "Native Value"],
  ["current_value_currency", "Native Currency"],
  ["current_value_eur", "Project Value"],
  ["target_allocation_pct", "Target Allocation"],
  ["expected_cagr_pct", "Expected CAGR"],
  ["expected_volatility_pct", "Expected Volatility"],
  ["total_fees_pct", "Fees"],
  ["achieved_pl_native", "Achieved P/L"],
  ["achieved_return_pct", "Achieved Return"],
  ["fees_paid_native", "Fees Paid"],
  ["notes", "Notes"],
];

const portfolioMipFields = [
  ["portfolio_id", "Portfolio ID"],
  ["portfolio_name", "Portfolio"],
  ["provider", "Provider"],
  ["start_date", "Start Date"],
  ["mip_phase_end_date_target", "MIP End Date"],
  ["portfolio_exit_date", "Exit Date"],
  ["contribution_type", "Contribution Type"],
  ["contribution_role", "Contribution Role"],
  ["notes", "Notes"],
];

const exitPhaseFields = [
  ["phase_name", "Phase"],
  ["start_date", "Start Date"],
  ["end_date", "End Date"],
];

try {
  init();
} catch (error) {
  renderStartupError(error);
}

function readHiddenDashboardCards() {
  try {
    const values = JSON.parse(storageGet(DASHBOARD_CARD_STORAGE_KEY) || "[]");
    return new Set(Array.isArray(values) ? values.map(String) : []);
  } catch {
    return new Set();
  }
}

function persistHiddenDashboardCards() {
  storageSet(DASHBOARD_CARD_STORAGE_KEY, JSON.stringify(Array.from(state.hiddenDashboardCards)));
}

function defaultIntelligenceThresholds() {
  return {
    concentrationWarningPct: 60,
    creditUtilizationWarningPct: 70,
    cashRunwayWarningMonths: 4,
    expenseCeilingWarningEur: 1000,
    tradeLossWarningPct: 10,
    tradePositionCapPct: 25,
    tradeStalePriceDays: 1,
  };
}

function readIntelligenceThresholds() {
  try {
    const values = JSON.parse(storageGet(INTELLIGENCE_THRESHOLDS_STORAGE_KEY) || "{}");
    if (values?._version !== INTELLIGENCE_THRESHOLDS_SCHEMA_VERSION && Number(values?.tradeStalePriceDays) === 5) {
      values.tradeStalePriceDays = 1;
    }
    return normalizeIntelligenceThresholds(values);
  } catch {
    return defaultIntelligenceThresholds();
  }
}

function normalizeIntelligenceThresholds(values = {}) {
  const defaults = defaultIntelligenceThresholds();
  return Object.fromEntries(Object.entries(defaults).map(([key, fallback]) => [
    key,
    clampValue(numericValue(values[key], fallback), key === "expenseCeilingWarningEur" ? 0 : 1, key === "tradeStalePriceDays" ? 365 : 1000000),
  ]));
}

function persistIntelligenceThresholds() {
  storageSet(INTELLIGENCE_THRESHOLDS_STORAGE_KEY, JSON.stringify({
    ...(state.intelligenceThresholds || defaultIntelligenceThresholds()),
    _version: INTELLIGENCE_THRESHOLDS_SCHEMA_VERSION,
  }));
}

function storageGet(key) {
  try {
    return globalThis.localStorage?.getItem(key) || "";
  } catch {
    return "";
  }
}

function storageSet(key, value) {
  try {
    globalThis.localStorage?.setItem(key, value);
  } catch {
    // Storage can be unavailable in embedded or privacy-restricted browsers.
  }
}

function setDashboardCardHidden(cardId, hidden) {
  const id = String(cardId || "").trim();
  if (!id) return;
  if (hidden) {
    state.hiddenDashboardCards.add(id);
  } else {
    state.hiddenDashboardCards.delete(id);
  }
  persistHiddenDashboardCards();
  render();
}

function init() {
  initTheme();
  initPrivacyMode();
  initKeyboardShortcutLabel();
  initResizableSidebar();
  renderNavigation();
  renderSidebarActions();
  bindEvents();
  render();
  loadOverview();
}

function renderStartupError(error) {
  console.error(error);
  const message = error?.message || "Unknown startup error";
  if (elements.pageStage) {
    elements.pageStage.innerHTML = errorState("Startup", message);
  }
}

function initResizableSidebar() {
  if (!elements.sidebarResizer) return;
  setSidebarWidth(readSidebarWidth(), { persist: false });
  elements.sidebarResizer.setAttribute("aria-valuemin", String(SIDEBAR_MIN_WIDTH));
  elements.sidebarResizer.setAttribute("aria-valuemax", String(SIDEBAR_MAX_WIDTH));
  elements.sidebarResizer.addEventListener("pointerdown", startSidebarResize);
  elements.sidebarResizer.addEventListener("dblclick", () => {
    setSidebarWidth(SIDEBAR_DEFAULT_WIDTH);
  });
  elements.sidebarResizer.addEventListener("keydown", (event) => {
    const step = event.shiftKey ? 24 : 8;
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      setSidebarWidth(currentSidebarWidth() + (event.key === "ArrowRight" ? step : -step));
    }
    if (event.key === "Home") {
      event.preventDefault();
      setSidebarWidth(SIDEBAR_MIN_WIDTH);
    }
    if (event.key === "End") {
      event.preventDefault();
      setSidebarWidth(SIDEBAR_MAX_WIDTH);
    }
  });
}

function readSidebarWidth() {
  const saved = Number.parseFloat(storageGet(SIDEBAR_WIDTH_STORAGE_KEY) || "");
  return clampSidebarWidth(Number.isFinite(saved) ? saved : SIDEBAR_DEFAULT_WIDTH);
}

function currentSidebarWidth() {
  const raw = getComputedStyle(document.documentElement).getPropertyValue("--sidebar-width");
  const value = Number.parseFloat(raw);
  return clampSidebarWidth(Number.isFinite(value) ? value : SIDEBAR_DEFAULT_WIDTH);
}

function clampSidebarWidth(width) {
  return Math.min(SIDEBAR_MAX_WIDTH, Math.max(SIDEBAR_MIN_WIDTH, Math.round(width)));
}

function setSidebarWidth(width, options = {}) {
  const nextWidth = clampSidebarWidth(width);
  document.documentElement.style.setProperty("--sidebar-width", `${nextWidth}px`);
  elements.sidebarResizer?.setAttribute("aria-valuenow", String(nextWidth));
  if (options.persist !== false) {
    storageSet(SIDEBAR_WIDTH_STORAGE_KEY, String(nextWidth));
  }
}

function startSidebarResize(event) {
  if (event.pointerType === "mouse" && event.button !== 0) return;
  event.preventDefault();
  const startX = event.clientX;
  const startWidth = currentSidebarWidth();
  const controller = new AbortController();
  const { signal } = controller;
  const finishResize = () => {
    document.body.classList.remove("is-resizing-sidebar");
    controller.abort();
  };

  document.body.classList.add("is-resizing-sidebar");
  try {
    event.currentTarget.setPointerCapture(event.pointerId);
  } catch {
    // Pointer capture can fail on older engines; window listeners still cover the drag.
  }
  window.addEventListener(
    "pointermove",
    (moveEvent) => {
      setSidebarWidth(startWidth + moveEvent.clientX - startX);
    },
    { signal },
  );
  window.addEventListener("pointerup", finishResize, { signal, once: true });
  window.addEventListener("pointercancel", finishResize, { signal, once: true });
}

function initTheme() {
  const theme = storageGet("ledger-theme") || "dark";
  setTheme(theme);
}

function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  storageSet("ledger-theme", theme);
  elements.themeToggle.innerHTML = `
    <span class="nav-glyph">${icons[theme === "dark" ? "moon" : "sun"]}</span>
    <span>${theme === "dark" ? "Dark Mode" : "Light Mode"}</span>
  `;
}

function readPrivacyMode() {
  return storageGet(PRIVACY_MODE_STORAGE_KEY) === "on";
}

function ledgerAppConfig() {
  return (window.LEDGER_APP_CONFIG && typeof window.LEDGER_APP_CONFIG === "object")
    ? window.LEDGER_APP_CONFIG
    : {};
}

function projectCurrencyRatesToEur() {
  const configured = ledgerAppConfig().fxRatesToEur || {};
  const rates = { ...PROJECT_CURRENCY_RATES_TO_EUR };
  Object.entries(configured).forEach(([currency, rate]) => {
    const code = normalizeCurrencyCode(currency);
    const numeric = Number(rate);
    if (code && Number.isFinite(numeric) && numeric > 0) rates[code] = numeric;
  });
  return rates;
}

function supportedProjectCurrencies() {
  const configured = Array.isArray(ledgerAppConfig().supportedProjectCurrencies)
    ? ledgerAppConfig().supportedProjectCurrencies
    : [];
  const codes = [...configured, ...Object.keys(projectCurrencyRatesToEur()), ...PROJECT_CURRENCY_FALLBACK_CODES]
    .map(normalizeCurrencyCode)
    .filter(Boolean);
  return Array.from(new Set(codes));
}

function defaultProjectCurrency() {
  const configured = normalizeCurrencyCode(ledgerAppConfig().projectCurrency);
  return supportedProjectCurrencies().includes(configured) ? configured : "EUR";
}

function readProjectCurrency() {
  const stored = normalizeCurrencyCode(storageGet(PROJECT_CURRENCY_STORAGE_KEY));
  return supportedProjectCurrencies().includes(stored) ? stored : defaultProjectCurrency();
}

function projectCurrencyCode() {
  const selected = normalizeCurrencyCode(state.projectCurrency);
  return supportedProjectCurrencies().includes(selected) ? selected : defaultProjectCurrency();
}

function projectCurrencyRateToEur(currency) {
  const code = normalizeCurrencyCode(currency) || "EUR";
  return projectCurrencyRatesToEur()[code] || 0;
}

function convertCurrencyValue(value, sourceCurrency = "EUR", targetCurrency = projectCurrencyCode()) {
  const numeric = numericValue(value);
  const source = normalizeCurrencyCode(sourceCurrency) || "EUR";
  const target = normalizeCurrencyCode(targetCurrency) || "EUR";
  if (source === target) return numeric;
  const sourceRate = projectCurrencyRateToEur(source);
  const targetRate = projectCurrencyRateToEur(target);
  if (!sourceRate || !targetRate) return numeric;
  return numeric * sourceRate / targetRate;
}

function projectMoneyValue(value, currency = "EUR", options = {}) {
  const source = normalizeCurrencyCode(currency) || "EUR";
  const target = normalizeCurrencyCode(options.targetCurrency) || projectCurrencyCode();
  const shouldConvert = options.project !== false && source === "EUR" && target !== source;
  return {
    value: shouldConvert ? convertCurrencyValue(value, source, target) : numericValue(value),
    currency: shouldConvert ? target : source,
  };
}

function setProjectCurrency(currency) {
  const normalized = normalizeCurrencyCode(currency);
  state.projectCurrency = supportedProjectCurrencies().includes(normalized) ? normalized : defaultProjectCurrency();
  storageSet(PROJECT_CURRENCY_STORAGE_KEY, state.projectCurrency);
  renderPreservingScroll();
}

function initPrivacyMode() {
  setPrivacyMode(state.privacyMode, { render: false });
}

function initKeyboardShortcutLabel() {
  const label = isMacPlatform() ? "Cmd K" : "Ctrl K";
  document.querySelectorAll(".search kbd").forEach((node) => {
    node.textContent = label;
  });
}

function isMacPlatform() {
  const platform = navigator.userAgentData?.platform || navigator.platform || "";
  return /mac|iphone|ipad|ipod/i.test(platform);
}

function setPrivacyMode(enabled, options = {}) {
  state.privacyMode = Boolean(enabled);
  document.documentElement.dataset.privacy = state.privacyMode ? "on" : "off";
  storageSet(PRIVACY_MODE_STORAGE_KEY, state.privacyMode ? "on" : "off");
  renderPrivacyAction();
  if (options.render !== false) render();
}

function renderNavigation() {
  elements.navList.innerHTML = navItems
    .map(
      (item) => `
        <button class="nav-item" data-view="${item.id}" type="button">
          <span class="nav-glyph">${icons[item.icon]}</span>
          <span>${item.label}</span>
        </button>
      `,
    )
    .join("");
}

function renderSidebarActions() {
  elements.refreshAction.innerHTML = `
    <span class="nav-glyph">${icons.refresh}</span>
    <span>Refresh</span>
  `;
  renderPrivacyAction();
}

function renderPrivacyAction() {
  if (!elements.privacyAction) return;
  elements.privacyAction.classList.toggle("is-active", state.privacyMode);
  elements.privacyAction.innerHTML = `
    <span class="nav-glyph">${icons.eyeOff}</span>
    <span>${state.privacyMode ? "Privacy On" : "Privacy"}</span>
  `;
}

function bindEvents() {
  elements.navList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-view]");
    if (!button) return;
    state.view = button.dataset.view;
    state.accountOffset = 0;
    state.selectedAccounts.clear();
    state.selectedAccountId = "";
    state.selectedAccountEditing = false;
    state.accountActionError = "";
    state.transactionOffset = 0;
    state.selectedTransactions.clear();
    state.selectedTransactionId = "";
    state.selectedTransactionEditing = false;
    state.transactionActionError = "";
    state.tradeOffset = 0;
    state.selectedTrades.clear();
    state.selectedTradeId = "";
    state.selectedTradeEditing = false;
    state.tradeActionError = "";
    resetPortfolioDetailState();
    state.expandedChartId = "";
    state.selectedMonthlyTargetMonth = "";
    state.selectedYearlyTargetYear = "";
    state.targetDetailEditing = false;
    resetStatementPanel();
    state.periodPanelOpen = false;
    state.dashboardCardMenuOpen = false;
    render();
    loadDataForView();
  });

  elements.themeToggle.addEventListener("click", () => {
    const current = document.documentElement.dataset.theme || "dark";
    setTheme(current === "dark" ? "light" : "dark");
  });

  elements.search.addEventListener("input", (event) => {
    state.query = event.target.value;
    clearTimeout(searchDebounce);
    if (state.view === "overview") return;
    searchDebounce = setTimeout(() => {
      runSearchForCurrentView();
    }, 180);
  });

  elements.search.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" || !state.query.trim()) return;
    event.preventDefault();
    clearTimeout(searchDebounce);
    runSearchForCurrentView();
  });

  elements.filterChips?.addEventListener("click", (event) => {
    const action = event.target.closest("[data-action]");
    if (!action) return;
    event.preventDefault();
    if (action.dataset.action === "remove-filter-chip") {
      removeQuickFilterChip(action.dataset.filterField || "", action.dataset.filterView || state.view);
      return;
    }
    if (action.dataset.action === "clear-filter-chips") {
      clearQuickFilterChips(action.dataset.filterView || state.view);
    }
  });

  elements.refreshAction.addEventListener("click", () => {
    resetReportForecastOverrides();
    resetMonthlyTargetOverrides();
    refreshData();
  });

  elements.privacyAction?.addEventListener("click", () => {
    setPrivacyMode(!state.privacyMode);
  });

  elements.pagePrintControl?.addEventListener("click", (event) => {
    const action = event.target.closest("[data-action='print-page']");
    if (!action) return;
    event.preventDefault();
    printCurrentPage();
  });

  elements.periodControl.addEventListener("click", (event) => {
    const modeCycleButton = event.target.closest("[data-period-mode-cycle]");
    if (modeCycleButton) {
      event.preventDefault();
      event.stopPropagation();
      cyclePeriodMode();
      return;
    }
    const stepButton = event.target.closest("[data-period-step]");
    if (stepButton) {
      event.preventDefault();
      event.stopPropagation();
      stepSelectedPeriod(Number(stepButton.dataset.periodStep || 0));
      return;
    }
    const openButton = event.target.closest("[data-period-open], .period-trigger");
    if (!openButton) return;
    state.selectedAccountId = "";
    state.selectedAccountEditing = false;
    state.accountActionError = "";
    state.selectedTransactionId = "";
    state.selectedTransactionEditing = false;
    state.transactionActionError = "";
    state.selectedTradeId = "";
    state.selectedTradeEditing = false;
    state.tradeActionError = "";
    resetPortfolioDetailState();
    state.selectedMonthlyTargetMonth = "";
    state.selectedYearlyTargetYear = "";
    state.targetDetailEditing = false;
    resetStatementPanel();
    state.periodPanelOpen = true;
    renderPreservingScroll();
  });

  elements.pageStage.addEventListener("change", (event) => {
    const projectCurrencyControl = event.target.closest("[data-project-currency]");
    if (projectCurrencyControl) {
      setProjectCurrency(projectCurrencyControl.value);
      return;
    }

    const reportForecastControl = event.target.closest("[data-report-forecast-field]");
    if (reportForecastControl) {
      updateReportForecastOverride(reportForecastControl);
      return;
    }

    const monteCarloScopeControl = event.target.closest("[data-monte-carlo-scope]");
    if (monteCarloScopeControl) {
      state.monteCarloScope = monteCarloScopeControl.value || "plan";
      renderPreservingScroll();
      return;
    }

    const monthlyTargetControl = event.target.closest("[data-monthly-target-field]");
    if (monthlyTargetControl) {
      updateMonthlyTargetOverride(monthlyTargetControl);
      return;
    }

    const monthlyTargetItemControl = event.target.closest("[data-monthly-target-item-field]");
    if (monthlyTargetItemControl) {
      updateMonthlyTargetItemOverride(monthlyTargetItemControl);
      return;
    }

    const yearlyTargetControl = event.target.closest("[data-yearly-target-field]");
    if (yearlyTargetControl) {
      updateYearlyTargetOverride(yearlyTargetControl);
      return;
    }

    const thresholdControl = event.target.closest("[data-threshold-field]");
    if (thresholdControl) {
      updateIntelligenceThreshold(thresholdControl);
      return;
    }

    const pageSizeControl = event.target.closest("[data-table-page-size]");
    if (pageSizeControl) {
      updateTablePageSize(pageSizeControl);
      return;
    }

    const control = event.target.closest("[data-transaction-filter]");
    if (control) {
      state.transactionFilters[control.dataset.transactionFilter] = control.value;
      state.transactionOffset = 0;
      state.selectedTransactions.clear();
      loadTransactions();
      return;
    }

    const editControl = event.target.closest("[data-transaction-edit-form] select, [data-transaction-edit-form] input");
    if (editControl) {
      syncTransactionEditOptions(editControl.form, editControl.name);
      return;
    }

    const accountEditControl = event.target.closest("[data-account-edit-form] select, [data-account-edit-form] input");
    if (accountEditControl) {
      syncAccountCreditFields(accountEditControl.form, accountEditControl.name);
      return;
    }

    const accountRowSelect = event.target.closest("[data-account-select]");
    if (accountRowSelect) {
      if (accountRowSelect.checked) {
        state.selectedAccounts.add(accountRowSelect.value);
      } else {
        state.selectedAccounts.delete(accountRowSelect.value);
      }
      renderPreservingScroll();
      return;
    }

    const rowSelect = event.target.closest("[data-transaction-select]");
    if (rowSelect) {
      if (rowSelect.checked) {
        state.selectedTransactions.add(rowSelect.value);
      } else {
        state.selectedTransactions.delete(rowSelect.value);
      }
      renderPreservingScroll();
      return;
    }

    const statementImportSelect = event.target.closest("[data-statement-import-select]");
    if (statementImportSelect) {
      if (statementImportSelect.checked) {
        state.selectedStatementImportRecords.add(statementImportSelect.value);
      } else {
        state.selectedStatementImportRecords.delete(statementImportSelect.value);
      }
      renderPreservingScroll();
      return;
    }

    const statementFileSelect = event.target.closest("[data-statement-file-select]");
    if (statementFileSelect) {
      if (statementFileSelect.checked) {
        state.selectedStatementImportFiles.add(statementFileSelect.value);
      } else {
        state.selectedStatementImportFiles.delete(statementFileSelect.value);
      }
      renderPreservingScroll();
      return;
    }

    const tradeRowSelect = event.target.closest("[data-trade-select]");
    if (tradeRowSelect) {
      if (tradeRowSelect.checked) {
        state.selectedTrades.add(tradeRowSelect.value);
      } else {
        state.selectedTrades.delete(tradeRowSelect.value);
      }
      renderPreservingScroll();
      return;
    }

    const portfolioInstrumentSelect = event.target.closest("[data-portfolio-instrument-select]");
    if (portfolioInstrumentSelect) {
      if (portfolioInstrumentSelect.checked) {
        state.selectedPortfolioInstruments.add(portfolioInstrumentSelect.value);
      } else {
        state.selectedPortfolioInstruments.delete(portfolioInstrumentSelect.value);
      }
      renderPreservingScroll();
      return;
    }

    const accountPageSelect = event.target.closest("[data-select-account-page]");
    if (accountPageSelect && state.accounts) {
      state.accounts.rows.forEach((row) => {
        if (accountPageSelect.checked) {
          state.selectedAccounts.add(row.account_id);
        } else {
          state.selectedAccounts.delete(row.account_id);
        }
      });
      renderPreservingScroll();
    }

    const pageSelect = event.target.closest("[data-select-page]");
    if (pageSelect && state.transactions) {
      state.transactions.rows.forEach((row) => {
        if (pageSelect.checked) {
          state.selectedTransactions.add(row.transaction_id);
        } else {
          state.selectedTransactions.delete(row.transaction_id);
        }
      });
      renderPreservingScroll();
    }

    const statementImportPageSelect = event.target.closest("[data-select-statement-import-page]");
    if (statementImportPageSelect && state.statementImport) {
      visibleStatementImportRows().filter(statementImportRowSelectable).forEach((row) => {
        const id = statementImportRecordId(row);
        if (statementImportPageSelect.checked) {
          state.selectedStatementImportRecords.add(id);
        } else {
          state.selectedStatementImportRecords.delete(id);
        }
      });
      renderPreservingScroll();
      return;
    }

    const statementFilePageSelect = event.target.closest("[data-select-statement-file-page]");
    if (statementFilePageSelect && state.statementImport) {
      visibleStatementUnsupportedRows().forEach((row) => {
        const fileName = statementFileName(row);
        if (!fileName) return;
        if (statementFilePageSelect.checked) {
          state.selectedStatementImportFiles.add(fileName);
        } else {
          state.selectedStatementImportFiles.delete(fileName);
        }
      });
      renderPreservingScroll();
      return;
    }

    const tradePageSelect = event.target.closest("[data-select-trade-page]");
    if (tradePageSelect && state.trades) {
      state.trades.rows.forEach((row) => {
        if (tradePageSelect.checked) {
          state.selectedTrades.add(row.trade_id);
        } else {
          state.selectedTrades.delete(row.trade_id);
        }
      });
      renderPreservingScroll();
    }

    const portfolioPageSelect = event.target.closest("[data-select-portfolio-page]");
    if (portfolioPageSelect && state.overview) {
      const rows = filteredPortfolioInstrumentRows(currentPortfolioInstrumentRows());
      rows.forEach((row) => {
        const id = portfolioInstrumentId(row);
        if (portfolioPageSelect.checked) {
          state.selectedPortfolioInstruments.add(id);
        } else {
          state.selectedPortfolioInstruments.delete(id);
        }
      });
      renderPreservingScroll();
    }
  });

  elements.pageStage.addEventListener("input", (event) => {
    const formattedNumberControl = event.target.closest("[data-format-number], [data-format-percent]");
    if (formattedNumberControl && !handleFormattedNumberInput(formattedNumberControl)) return;

    const reportForecastControl = event.target.closest("[data-report-forecast-field]");
    if (reportForecastControl) {
      updateReportForecastOverride(reportForecastControl, false);
      return;
    }

    const monthlyTargetControl = event.target.closest("[data-monthly-target-field]");
    if (monthlyTargetControl) {
      updateMonthlyTargetOverride(monthlyTargetControl, false);
      return;
    }

    const monthlyTargetItemControl = event.target.closest("[data-monthly-target-item-field]");
    if (monthlyTargetItemControl) {
      updateMonthlyTargetItemOverride(monthlyTargetItemControl, false);
      return;
    }

    const yearlyTargetControl = event.target.closest("[data-yearly-target-field]");
    if (yearlyTargetControl) {
      updateYearlyTargetOverride(yearlyTargetControl, false);
      return;
    }

    const accountEditControl = event.target.closest("[data-account-edit-form] input");
    if (accountEditControl) {
      syncAccountCreditFields(accountEditControl.form, accountEditControl.name);
      return;
    }

    const editControl = event.target.closest("[data-transaction-combo]");
    if (!editControl) return;
    syncTransactionEditOptions(editControl.form, editControl.name);
  });

  elements.pageStage.addEventListener("click", (event) => {
    const action = event.target.closest("[data-action]");
    if (!action) return;
    if (action.dataset.action === "print-page") {
      event.preventDefault();
      printCurrentPage();
      return;
    }
    if (action.dataset.action === "overview-tab") {
      state.overviewView = action.dataset.overviewView || "insights";
      state.expandedChartId = "";
      renderPreservingScroll();
      return;
    }
    if (action.dataset.action === "quick-filter") {
      event.preventDefault();
      event.stopPropagation();
      applyQuickTableFilter(
        action.dataset.filterValue || action.textContent || "",
        action.dataset.filterField || "",
        action.dataset.filterLabel || action.textContent || action.dataset.filterValue || "",
      );
      return;
    }
    if (action.dataset.action === "filter-category") {
      event.preventDefault();
      event.stopPropagation();
      applyCategoryFilter(action.dataset.category || "", action.dataset.transactionClass || "", action.textContent || "");
      return;
    }
    if (action.dataset.action === "filter-monthly-target") {
      event.preventDefault();
      event.stopPropagation();
      openMonthlyTargetPeriod(action.dataset);
      return;
    }
    if (action.dataset.action === "filter-monthly-target-category") {
      event.preventDefault();
      event.stopPropagation();
      applyMonthlyTargetTransactionFilter(action.dataset);
      return;
    }
    if (action.dataset.action === "filter-accounts") {
      applyAccountInsightFilter(action.dataset);
    }
    if (action.dataset.action === "filter-transactions") {
      applyTransactionInsightFilter(action.dataset);
    }
    if (action.dataset.action === "filter-trades") {
      applyTradeInsightFilter(action.dataset);
    }
    if (action.dataset.action === "heatmap-transactions") {
      event.preventDefault();
      event.stopPropagation();
      applyHeatmapFilter(action.dataset);
      return;
    }
    if (action.dataset.action === "open-global-section") {
      openGlobalSearchSection(action.dataset.viewTarget || "");
      return;
    }
    if (action.dataset.action === "open-global-result") {
      openGlobalSearchResult(action.dataset.viewTarget || "", action.dataset.resultId || "");
      return;
    }
    if (action.dataset.action === "clear-search") {
      clearSearch();
      return;
    }
    if (action.dataset.action === "open-monthly-target") {
      state.selectedMonthlyTargetMonth = action.dataset.monthlyTargetMonth || "";
      state.selectedYearlyTargetYear = "";
      state.targetDetailEditing = false;
      renderPreservingScroll();
      return;
    }
    if (action.dataset.action === "open-yearly-target") {
      state.selectedYearlyTargetYear = action.dataset.yearlyTargetYear || "";
      state.selectedMonthlyTargetMonth = "";
      state.targetDetailEditing = false;
      renderPreservingScroll();
      return;
    }
    if (action.dataset.action === "edit-target-detail") {
      if (state.selectedYearlyTargetYear && isYearlyTargetLocked(state.selectedYearlyTargetYear)) {
        state.targetDetailEditing = false;
        renderPreservingScroll();
        return;
      }
      state.targetDetailEditing = true;
      renderPreservingScroll();
      return;
    }
    if (action.dataset.action === "save-target-detail") {
      state.targetDetailEditing = false;
      renderPreservingScroll();
      return;
    }
    if (action.dataset.action === "cancel-target-edit") {
      state.targetDetailEditing = false;
      renderPreservingScroll();
      return;
    }
    if (action.dataset.action === "close-target-detail") {
      state.selectedMonthlyTargetMonth = "";
      state.selectedYearlyTargetYear = "";
      state.targetDetailEditing = false;
      renderPreservingScroll();
      return;
    }
    if (action.dataset.action === "open-account") {
      if (event.target.closest("input, button, select, a")) return;
      state.periodPanelOpen = false;
      state.selectedAccountId = action.dataset.accountId || "";
      state.selectedAccountEditing = false;
      state.accountActionError = "";
      renderPreservingScroll();
    }
    if (action.dataset.action === "open-transaction") {
      if (event.target.closest("input, button, select, a")) return;
      state.periodPanelOpen = false;
      resetStatementPanel();
      state.selectedTransactionId = action.dataset.transactionId || "";
      state.selectedTransactionEditing = false;
      state.transactionActionError = "";
      renderPreservingScroll();
    }
    if (action.dataset.action === "open-trade") {
      if (event.target.closest("input, button, select, a")) return;
      state.periodPanelOpen = false;
      state.selectedTradeId = action.dataset.tradeId || "";
      state.selectedTradeEditing = false;
      state.tradeActionError = "";
      renderPreservingScroll();
    }
    if (action.dataset.action === "open-portfolio-instrument") {
      if (event.target.closest("input, button, select, a")) return;
      state.periodPanelOpen = false;
      state.selectedPortfolioInstrumentId = action.dataset.portfolioInstrumentId || "";
      state.selectedPortfolioInstrumentEditing = false;
      state.portfolioActionError = "";
      renderPreservingScroll();
    }
    if (action.dataset.action === "open-portfolio-mip") {
      if (event.target.closest("input, button, select, a")) return;
      state.periodPanelOpen = false;
      state.selectedPortfolioMipId = action.dataset.portfolioMipId || "";
      state.selectedPortfolioMipEditing = false;
      state.portfolioMipActionError = "";
      renderPreservingScroll();
    }
    if (action.dataset.action === "open-exit-phase") {
      if (event.target.closest("input, button, select, a")) return;
      state.periodPanelOpen = false;
      state.selectedExitPhaseId = action.dataset.exitPhaseId || "";
      state.selectedExitPhaseEditing = false;
      state.exitPhaseActionError = "";
      renderPreservingScroll();
    }
    if (action.dataset.action === "close-transaction") {
      state.selectedTransactionId = "";
      state.selectedTransactionEditing = false;
      state.transactionActionError = "";
      renderPreservingScroll();
    }
    if (action.dataset.action === "close-account") {
      state.selectedAccountId = "";
      state.selectedAccountEditing = false;
      state.accountActionError = "";
      renderPreservingScroll();
    }
    if (action.dataset.action === "close-trade") {
      state.selectedTradeId = "";
      state.selectedTradeEditing = false;
      state.tradeActionError = "";
      renderPreservingScroll();
    }
    if (action.dataset.action === "close-portfolio-instrument") {
      state.selectedPortfolioInstrumentId = "";
      state.selectedPortfolioInstrumentEditing = false;
      state.portfolioActionError = "";
      renderPreservingScroll();
    }
    if (action.dataset.action === "close-portfolio-mip") {
      state.selectedPortfolioMipId = "";
      state.selectedPortfolioMipEditing = false;
      state.portfolioMipActionError = "";
      renderPreservingScroll();
    }
    if (action.dataset.action === "close-exit-phase") {
      state.selectedExitPhaseId = "";
      state.selectedExitPhaseEditing = false;
      state.exitPhaseActionError = "";
      renderPreservingScroll();
    }
    if (action.dataset.action === "show-statement") {
      event.preventDefault();
      event.stopPropagation();
      showTransactionStatement(action.dataset.transactionId || "");
      return;
    }
    if (action.dataset.action === "close-statement") {
      resetStatementPanel();
      renderPreservingScroll();
    }
    if (action.dataset.action === "edit-transaction") {
      state.selectedTransactionEditing = true;
      state.transactionActionError = "";
      renderPreservingScroll();
    }
    if (action.dataset.action === "edit-account") {
      state.selectedAccountEditing = true;
      state.accountActionError = "";
      renderPreservingScroll();
    }
    if (action.dataset.action === "attach-statement") {
      event.preventDefault();
      event.stopPropagation();
      const input = document.querySelector("[data-statement-attachment-input]");
      if (input) {
        input.value = "";
        input.click();
      }
      return;
    }
    if (action.dataset.action === "cancel-transaction-edit") {
      state.selectedTransactionEditing = false;
      state.transactionActionError = "";
      renderPreservingScroll();
    }
    if (action.dataset.action === "cancel-account-edit") {
      state.selectedAccountEditing = false;
      state.accountActionError = "";
      renderPreservingScroll();
    }
    if (action.dataset.action === "edit-trade") {
      state.selectedTradeEditing = true;
      state.tradeActionError = "";
      renderPreservingScroll();
    }
    if (action.dataset.action === "cancel-trade-edit") {
      state.selectedTradeEditing = false;
      state.tradeActionError = "";
      renderPreservingScroll();
    }
    if (action.dataset.action === "edit-portfolio-instrument") {
      state.selectedPortfolioInstrumentEditing = true;
      state.portfolioActionError = "";
      renderPreservingScroll();
    }
    if (action.dataset.action === "cancel-portfolio-instrument-edit") {
      state.selectedPortfolioInstrumentEditing = false;
      state.portfolioActionError = "";
      renderPreservingScroll();
    }
    if (action.dataset.action === "edit-portfolio-mip") {
      state.selectedPortfolioMipEditing = true;
      state.portfolioMipActionError = "";
      renderPreservingScroll();
    }
    if (action.dataset.action === "cancel-portfolio-mip-edit") {
      state.selectedPortfolioMipEditing = false;
      state.portfolioMipActionError = "";
      renderPreservingScroll();
    }
    if (action.dataset.action === "edit-exit-phase") {
      state.selectedExitPhaseEditing = true;
      state.exitPhaseActionError = "";
      renderPreservingScroll();
    }
    if (action.dataset.action === "cancel-exit-phase-edit") {
      state.selectedExitPhaseEditing = false;
      state.exitPhaseActionError = "";
      renderPreservingScroll();
    }
    if (action.dataset.action === "duplicate-transaction") {
      duplicateTransaction(action.dataset.transactionId || state.selectedTransactionId);
    }
    if (action.dataset.action === "duplicate-account") {
      duplicateAccount(action.dataset.accountId || state.selectedAccountId);
    }
    if (action.dataset.action === "duplicate-trade") {
      duplicateTrade(action.dataset.tradeId || state.selectedTradeId);
    }
    if (action.dataset.action === "duplicate-portfolio-instrument") {
      duplicatePortfolioInstrument(action.dataset.portfolioInstrumentId || state.selectedPortfolioInstrumentId);
    }
    if (action.dataset.action === "add-transaction") {
      addTransaction();
    }
    if (action.dataset.action === "add-account") {
      addAccount();
    }
    if (action.dataset.action === "add-trade") {
      addTrade();
    }
    if (action.dataset.action === "refresh-trade-prices") {
      refreshTradePrices();
      return;
    }
    if (action.dataset.action === "upload-statement-import") {
      event.preventDefault();
      const input = document.querySelector("[data-statement-import-input]");
      if (input) {
        input.value = "";
        input.click();
      }
      return;
    }
    if (action.dataset.action === "refresh-statement-import") {
      previewStatementImport();
      return;
    }
    if (action.dataset.action === "clear-statement-import") {
      clearStatementImport();
      return;
    }
    if (action.dataset.action === "clear-selected-statement-import") {
      clearSelectedStatementImport();
      return;
    }
    if (action.dataset.action === "apply-statement-import") {
      applyStatementImport();
      return;
    }
    if (action.dataset.action === "add-portfolio-instrument") {
      addPortfolioInstrument();
    }
    if (action.dataset.action === "add-portfolio-mip") {
      addPortfolioMip();
    }
    if (action.dataset.action === "reset-intelligence-thresholds") {
      state.intelligenceThresholds = defaultIntelligenceThresholds();
      persistIntelligenceThresholds();
      if (state.view === "trades") {
        if (state.tradeView === "returns") {
          state.portfolioReturns = null;
          loadPortfolioReturns();
        } else {
          loadTrades();
        }
      } else {
        render();
      }
      return;
    }
    if (action.dataset.action === "duplicate-selected-transactions") {
      duplicateSelectedTransactions();
    }
    if (action.dataset.action === "duplicate-selected-accounts") {
      duplicateSelectedAccounts();
    }
    if (action.dataset.action === "duplicate-selected-trades") {
      duplicateSelectedTrades();
    }
    if (action.dataset.action === "duplicate-selected-portfolio-instruments") {
      duplicateSelectedPortfolioInstruments();
    }
    if (action.dataset.action === "restore-transaction") {
      restoreTransaction(action.dataset.transactionId || state.selectedTransactionId);
    }
    if (action.dataset.action === "restore-account") {
      restoreAccount(action.dataset.accountId || state.selectedAccountId);
    }
    if (action.dataset.action === "restore-trade") {
      restoreTrade(action.dataset.tradeId || state.selectedTradeId);
    }
    if (action.dataset.action === "restore-selected-transactions") {
      restoreSelectedTransactions();
    }
    if (action.dataset.action === "restore-selected-accounts") {
      restoreSelectedAccounts();
    }
    if (action.dataset.action === "restore-selected-trades") {
      restoreSelectedTrades();
    }
    if (action.dataset.action === "delete-transaction") {
      deleteTransaction(action.dataset.transactionId || state.selectedTransactionId);
    }
    if (action.dataset.action === "delete-account") {
      deleteAccount(action.dataset.accountId || state.selectedAccountId);
    }
    if (action.dataset.action === "delete-trade") {
      deleteTrade(action.dataset.tradeId || state.selectedTradeId);
    }
    if (action.dataset.action === "delete-portfolio-instrument") {
      deletePortfolioInstrument(action.dataset.portfolioInstrumentId || state.selectedPortfolioInstrumentId);
    }
    if (action.dataset.action === "delete-portfolio-mip") {
      deletePortfolioMip(action.dataset.portfolioMipId || state.selectedPortfolioMipId);
    }
    if (action.dataset.action === "delete-selected-transactions") {
      deleteSelectedTransactions();
    }
    if (action.dataset.action === "delete-selected-accounts") {
      deleteSelectedAccounts();
    }
    if (action.dataset.action === "delete-selected-trades") {
      deleteSelectedTrades();
    }
    if (action.dataset.action === "delete-selected-portfolio-instruments") {
      deleteSelectedPortfolioInstruments();
    }
    if (action.dataset.action === "permanently-delete-transaction") {
      permanentlyDeleteTransactions([action.dataset.transactionId || state.selectedTransactionId]);
    }
    if (action.dataset.action === "permanently-delete-account") {
      permanentlyDeleteAccounts([action.dataset.accountId || state.selectedAccountId]);
    }
    if (action.dataset.action === "permanently-delete-trade") {
      permanentlyDeleteTrades([action.dataset.tradeId || state.selectedTradeId]);
    }
    if (action.dataset.action === "permanently-delete-selected-transactions") {
      permanentlyDeleteTransactions(Array.from(state.selectedTransactions));
    }
    if (action.dataset.action === "permanently-delete-selected-accounts") {
      permanentlyDeleteAccounts(Array.from(state.selectedAccounts));
    }
    if (action.dataset.action === "permanently-delete-selected-trades") {
      permanentlyDeleteTrades(Array.from(state.selectedTrades));
    }
    if (action.dataset.action === "close-period") {
      state.periodPanelOpen = false;
      render();
    }
    if (action.dataset.action === "set-period-mode") {
      updatePeriod("mode", action.dataset.periodMode || "month");
    }
    if (action.dataset.action === "set-period-day") {
      updatePeriod("day", action.dataset.periodDay || state.period.day);
    }
    if (action.dataset.action === "step-period-day-month") {
      stepPeriodDayMonth(Number(action.dataset.step || 0));
    }
    if (action.dataset.action === "set-period-month") {
      handlePeriodMonthClick(action.dataset.periodMonth || state.period.month);
      return;
    }
    if (action.dataset.action === "step-period-calendar-year") {
      stepPeriodCalendarYear(Number(action.dataset.step || 0));
    }
    if (action.dataset.action === "set-period-year") {
      updatePeriod("year", action.dataset.periodYear || String(state.period.year));
    }
    if (action.dataset.action === "step-period-year-range") {
      stepPeriodYearRange(Number(action.dataset.step || 0));
    }
    if (action.dataset.action === "transaction-tab") {
      const transactionClass = action.dataset.transactionClass || "";
      state.transactionView = "register";
      state.transactionFilters = {
        ...filtersForPeriod(),
        transaction_class: transactionClass,
      };
      state.transactionOffset = 0;
      state.selectedTransactions.clear();
      state.selectedTransactionId = "";
      state.selectedTransactionEditing = false;
      state.transactionActionError = "";
      resetStatementPanel();
      loadTransactions();
    }
    if (action.dataset.action === "transaction-insights-tab") {
      state.transactionView = "insights";
      state.query = "";
      if (elements.search) elements.search.value = "";
      state.transactionFilters = emptyTransactionFilters(filtersForPeriod());
      state.transactionOffset = 0;
      state.selectedTransactions.clear();
      state.selectedTransactionId = "";
      state.selectedTransactionEditing = false;
      state.transactionActionError = "";
      state.selectedMonthlyTargetMonth = "";
      state.selectedYearlyTargetYear = "";
      state.targetDetailEditing = false;
      resetStatementPanel();
      loadTransactions();
    }
    if (action.dataset.action === "transaction-monthly-targets-tab") {
      state.transactionView = "monthlyTargets";
      state.query = "";
      if (elements.search) elements.search.value = "";
      state.transactionFilters = emptyTransactionFilters(filtersForPeriod());
      state.transactionOffset = 0;
      state.selectedTransactions.clear();
      state.selectedTransactionId = "";
      state.selectedTransactionEditing = false;
      state.transactionActionError = "";
      state.selectedMonthlyTargetMonth = "";
      state.selectedYearlyTargetYear = "";
      state.targetDetailEditing = false;
      resetStatementPanel();
      loadTransactions();
    }
    if (action.dataset.action === "transaction-yearly-targets-tab") {
      state.transactionView = "monthlyTargets";
      state.query = "";
      if (elements.search) elements.search.value = "";
      state.transactionFilters = emptyTransactionFilters();
      state.transactionOffset = 0;
      state.selectedTransactions.clear();
      state.selectedTransactionId = "";
      state.selectedTransactionEditing = false;
      state.transactionActionError = "";
      state.selectedMonthlyTargetMonth = "";
      state.selectedYearlyTargetYear = "";
      state.targetDetailEditing = false;
      resetStatementPanel();
      state.periodPanelOpen = false;
      if (!transactionPayloadHasScope(state.transactions, "targets")) {
        loadTransactions();
      } else {
        render();
      }
    }
    if (action.dataset.action === "account-tab") {
      state.accountView = "register";
      state.accountFilters = defaultAccountFilters({
        account_status: action.dataset.accountStatus || "",
        review_status: action.dataset.reviewStatus || "",
        ledger_status: action.dataset.ledgerStatus || "",
      });
      state.accountOffset = 0;
      state.selectedAccounts.clear();
      state.selectedAccountId = "";
      state.selectedAccountEditing = false;
      state.accountActionError = "";
      loadAccounts();
    }
    if (action.dataset.action === "account-insights-tab") {
      state.accountView = "insights";
      state.accountOffset = 0;
      state.selectedAccounts.clear();
      state.selectedAccountId = "";
      state.selectedAccountEditing = false;
      state.accountActionError = "";
      if (!state.accounts) {
        loadAccounts();
      } else {
        render();
      }
    }
    if (action.dataset.action === "trade-tab") {
      state.tradeView = "register";
      state.tradeFilters = defaultTradeFilters({
        position_status: action.dataset.positionStatus || "",
        review_status: action.dataset.reviewStatus || "",
        ledger_status: action.dataset.ledgerStatus || "",
      });
      state.tradeOffset = 0;
      state.selectedTrades.clear();
      state.selectedTradeId = "";
      state.selectedTradeEditing = false;
      state.tradeActionError = "";
      loadTrades();
    }
    if (action.dataset.action === "trade-insights-tab") {
      state.tradeView = "insights";
      state.tradeOffset = 0;
      state.selectedTrades.clear();
      state.selectedTradeId = "";
      state.selectedTradeEditing = false;
      state.tradeActionError = "";
      if (!state.trades) {
        loadTrades();
      } else {
        render();
      }
    }
    if (action.dataset.action === "trade-returns-tab") {
      state.tradeView = "returns";
      state.tradeOffset = 0;
      state.expandedChartId = "";
      state.selectedTrades.clear();
      state.selectedTradeId = "";
      state.selectedTradeEditing = false;
      state.tradeActionError = "";
      if (!state.portfolioReturns) {
        loadPortfolioReturns();
      } else {
        render();
      }
    }
    if (action.dataset.action === "portfolio-tab") {
      const nextPortfolioView = action.dataset.portfolioView || "overview";
      state.portfolioView = nextPortfolioView === "treemap" ? "overview" : nextPortfolioView;
      state.expandedChartId = "";
      state.selectedPortfolioInstruments.clear();
      state.selectedPortfolioInstrumentId = "";
      state.selectedPortfolioInstrumentEditing = false;
      state.portfolioActionError = "";
      render();
      return;
    }
    if (action.dataset.action === "portfolio-performance-window") {
      state.portfolioPerformanceWindow = action.dataset.portfolioPerformanceWindow || "all";
      renderPreservingScroll();
      return;
    }
    if (action.dataset.action === "trade-returns-window" || action.dataset.action === "portfolio-returns-window") {
      state.portfolioReturnsWindow = action.dataset.portfolioReturnsWindow || "all";
      renderPreservingScroll();
      return;
    }
		    if (action.dataset.action === "planning-tab") {
      state.planningView = action.dataset.planningView || "targets";
      state.expandedChartId = "";
      state.selectedMonthlyTargetMonth = "";
      state.selectedYearlyTargetYear = "";
      state.targetDetailEditing = false;
      state.selectedPortfolioMipId = "";
      state.selectedPortfolioMipEditing = false;
      state.portfolioMipActionError = "";
      render();
    }
    if (action.dataset.action === "retry-profile") {
      loadProfile({ force: true });
      return;
    }
    if (action.dataset.action === "about-tab") {
      state.aboutView = action.dataset.aboutView || "copyright";
      if (state.aboutView === "changelog") loadAboutChangelog();
      renderPreservingScroll();
      return;
    }
    if (action.dataset.action === "report-net-worth-window") {
      state.reportNetWorthWindow = action.dataset.reportNetWorthWindow || "all";
      renderPreservingScroll();
      return;
    }
    if (action.dataset.action === "report-cash-flow-window") {
      state.reportCashFlowWindow = action.dataset.reportCashFlowWindow || "all";
      renderPreservingScroll();
      return;
    }
    if (action.dataset.action === "toggle-cash-flow-context-line") {
      const lineId = action.dataset.lineId || "";
      if (!lineId) return;
      if (state.cashFlowContextLines.has(lineId)) {
        if (state.cashFlowContextLines.size > 1) state.cashFlowContextLines.delete(lineId);
      } else {
        state.cashFlowContextLines.add(lineId);
      }
      renderPreservingScroll();
      return;
    }
    if (action.dataset.action === "toggle-standard-chart-line") {
      const chartId = action.dataset.chartId || state.expandedChartId || "";
      const lineId = action.dataset.lineId || "";
      if (!chartId || !lineId) return;
      const hiddenLines = standardChartHiddenLineSet(chartId);
      if (hiddenLines.has(lineId)) {
        hiddenLines.delete(lineId);
      } else {
        const activeButtons = [...document.querySelectorAll('[data-action="toggle-standard-chart-line"]')]
          .filter((button) => (button.dataset.chartId || "") === chartId && button.getAttribute("aria-pressed") === "true");
        if (activeButtons.length <= 1) return;
        hiddenLines.add(lineId);
      }
      renderPreservingScroll();
      return;
    }
    if (action.dataset.action === "report-forecast-years") {
      state.reportForecastYears = action.dataset.reportForecastYears || "10";
      renderPreservingScroll();
      return;
    }
    if (action.dataset.action === "monte-carlo-window") {
      state.monteCarloWindow = action.dataset.monteCarloWindow || "plan";
      renderPreservingScroll();
      return;
    }
    if (action.dataset.action === "toggle-monte-carlo-context-line") {
      const lineId = action.dataset.lineId || "";
      if (!lineId) return;
      if (state.monteCarloContextLines.has(lineId)) {
        state.monteCarloContextLines.delete(lineId);
      } else {
        state.monteCarloContextLines.add(lineId);
      }
      renderPreservingScroll();
      return;
    }
    if (action.dataset.action === "toggle-net-worth-context-line") {
      const lineId = action.dataset.lineId || "";
      if (!lineId) return;
      if (state.netWorthContextLines.has(lineId)) {
        state.netWorthContextLines.delete(lineId);
      } else {
        state.netWorthContextLines.add(lineId);
      }
      renderPreservingScroll();
      return;
    }
    if (action.dataset.action === "open-chart-modal") {
      state.expandedChartId = action.dataset.chartId || "";
      if (state.expandedChartId === "overview-net-worth") {
        state.reportNetWorthWindow = "36";
        state.reportForecastYears = "3";
        state.netWorthContextLines = new Set(NET_WORTH_CONTEXT_DEFAULT_LINES);
      }
      if (state.expandedChartId === "overview-cash-flow") {
        state.cashFlowContextLines = new Set(["income", "expense"]);
      }
      renderPreservingScroll();
      return;
    }
    if (action.dataset.action === "close-chart-modal") {
      state.expandedChartId = "";
      renderPreservingScroll();
      return;
    }
    if (action.dataset.action === "sort-transactions") {
      updateTransactionSort(action.dataset.sort || "transaction_date");
      loadTransactions();
    }
    if (action.dataset.action === "sort-accounts") {
      updateAccountSort(action.dataset.sort || "balance");
      loadAccounts();
    }
    if (action.dataset.action === "sort-trades") {
      updateTradeSort(action.dataset.sort || "activity_date");
      loadTrades();
    }
    if (action.dataset.action === "sort-monthly-targets") {
      event.preventDefault();
      event.stopPropagation();
      updateMonthlyTargetSort(action.dataset.sort || "month");
      renderPreservingScroll();
      return;
    }
    if (action.dataset.action === "clear-selection") {
      state.selectedTransactions.clear();
      render();
    }
    if (action.dataset.action === "clear-account-selection") {
      state.selectedAccounts.clear();
      render();
    }
    if (action.dataset.action === "clear-trade-selection") {
      state.selectedTrades.clear();
      render();
    }
    if (action.dataset.action === "clear-portfolio-selection") {
      state.selectedPortfolioInstruments.clear();
      render();
    }
    if (action.dataset.action === "previous-page") {
      state.transactionOffset = Math.max(0, state.transactionOffset - tablePageStep(transactionLimit()));
      loadTransactions();
    }
    if (action.dataset.action === "previous-account-page") {
      state.accountOffset = Math.max(0, state.accountOffset - tablePageStep(accountLimit()));
      loadAccounts();
    }
    if (action.dataset.action === "next-page") {
      state.transactionOffset += tablePageStep(transactionLimit());
      loadTransactions();
    }
    if (action.dataset.action === "next-account-page") {
      state.accountOffset += tablePageStep(accountLimit());
      loadAccounts();
    }
    if (action.dataset.action === "previous-trade-page") {
      state.tradeOffset = Math.max(0, state.tradeOffset - tablePageStep(tradeLimit()));
      loadTrades();
    }
    if (action.dataset.action === "next-trade-page") {
      state.tradeOffset += tablePageStep(tradeLimit());
      loadTrades();
    }
    if (action.dataset.action === "refresh-data") {
      resetReportForecastOverrides();
      resetMonthlyTargetOverrides();
      refreshData();
    }
    if (action.dataset.action === "toggle-dashboard-menu") {
      event.preventDefault();
      state.dashboardCardMenuOpen = !state.dashboardCardMenuOpen;
      render();
    }
    if (action.dataset.action === "hide-dashboard-card") {
      event.preventDefault();
      setDashboardCardHidden(action.dataset.dashboardCard || "", true);
    }
    if (action.dataset.action === "show-all-dashboard-cards") {
      event.preventDefault();
      state.hiddenDashboardCards.clear();
      persistHiddenDashboardCards();
      render();
    }
  });

  elements.pageStage.addEventListener("change", (event) => {
    const toggle = event.target.closest("[data-dashboard-card-toggle]");
    if (!toggle) return;
    setDashboardCardHidden(toggle.dataset.dashboardCard || "", !toggle.checked);
  });

  elements.pageStage.addEventListener("dblclick", (event) => {
    const action = event.target.closest("[data-action='set-period-month']");
    if (!action) return;
    event.preventDefault();
    openPeriodDayPicker(action.dataset.periodMonth || state.period.month);
  });

  elements.pageStage.addEventListener("submit", (event) => {
    const form = event.target.closest("[data-transaction-edit-form]");
    const accountForm = event.target.closest("[data-account-edit-form]");
    const tradeForm = event.target.closest("[data-trade-edit-form]");
    const portfolioInstrumentForm = event.target.closest("[data-portfolio-instrument-edit-form]");
    const portfolioMipForm = event.target.closest("[data-portfolio-mip-edit-form]");
    const exitPhaseForm = event.target.closest("[data-exit-phase-edit-form]");
    const profileForm = event.target.closest("[data-profile-form]");
    const monthlyTargetForm = event.target.closest("[data-monthly-target-edit-form]");
    const yearlyTargetForm = event.target.closest("[data-yearly-target-edit-form]");
    if (profileForm) {
      event.preventDefault();
      saveProfile(profileForm);
      return;
    }
    if (monthlyTargetForm || yearlyTargetForm) {
      event.preventDefault();
      state.targetDetailEditing = false;
      render();
      return;
    }
    if (accountForm) {
      event.preventDefault();
      saveAccount(accountForm);
      return;
    }
    if (form) {
      event.preventDefault();
      saveTransaction(form);
      return;
    }
    if (tradeForm) {
      event.preventDefault();
      saveTrade(tradeForm);
      return;
    }
    if (portfolioInstrumentForm) {
      event.preventDefault();
      savePortfolioInstrument(portfolioInstrumentForm);
      return;
    }
    if (portfolioMipForm) {
      event.preventDefault();
      savePortfolioMip(portfolioMipForm);
      return;
    }
    if (exitPhaseForm) {
      event.preventDefault();
      saveExitPhase(exitPhaseForm);
    }
  });

  elements.pageStage.addEventListener("input", (event) => {
    const form = event.target.closest("[data-transaction-edit-form]");
    if (!form) return;
    syncTransactionComputedFields(form, event.target.name || "");
  });

  elements.pageStage.addEventListener("change", (event) => {
    const importInput = event.target.closest("[data-statement-import-input]");
    if (importInput) {
      uploadStatementImportFiles(importInput.files);
      importInput.value = "";
      return;
    }

    const input = event.target.closest("[data-statement-attachment-input]");
    if (!input) return;
    attachStatementFiles(input.files);
  });

  elements.pageStage.addEventListener("keydown", (event) => {
    const reportForecastControl = event.target.closest("[data-report-forecast-field]");
    if (reportForecastControl && event.key === "Enter") {
      event.preventDefault();
      updateReportForecastOverride(reportForecastControl);
      reportForecastControl.blur();
      return;
    }

    const thresholdControl = event.target.closest("[data-threshold-field]");
    if (thresholdControl && event.key === "Enter") {
      event.preventDefault();
      updateIntelligenceThreshold(thresholdControl);
      thresholdControl.blur();
      return;
    }

    if (event.key !== "Enter" && event.key !== " ") return;
    const accountRow = event.target.closest("[data-action='open-account']");
    const row = event.target.closest("[data-action='open-transaction']");
    const tradeRow = event.target.closest("[data-action='open-trade']");
    const portfolioInstrumentRow = event.target.closest("[data-action='open-portfolio-instrument']");
    const portfolioMipRow = event.target.closest("[data-action='open-portfolio-mip']");
    const exitPhaseRow = event.target.closest("[data-action='open-exit-phase']");
    const monthlyTargetFilterRow = event.target.closest("[data-action='filter-monthly-target']");
    const monthlyTargetCategoryFilterRow = event.target.closest("[data-action='filter-monthly-target-category']");
    const monthlyTargetRow = event.target.closest("[data-action='open-monthly-target']");
    const yearlyTargetRow = event.target.closest("[data-action='open-yearly-target']");
    if (!accountRow && !row && !tradeRow && !portfolioInstrumentRow && !portfolioMipRow && !exitPhaseRow && !monthlyTargetFilterRow && !monthlyTargetCategoryFilterRow && !monthlyTargetRow && !yearlyTargetRow) return;
    event.preventDefault();
    state.periodPanelOpen = false;
    if (accountRow) {
      state.selectedAccountId = accountRow.dataset.accountId || "";
      state.selectedAccountEditing = false;
      state.accountActionError = "";
    } else if (tradeRow) {
      state.selectedTradeId = tradeRow.dataset.tradeId || "";
      state.selectedTradeEditing = false;
      state.tradeActionError = "";
    } else if (portfolioInstrumentRow) {
      state.selectedPortfolioInstrumentId = portfolioInstrumentRow.dataset.portfolioInstrumentId || "";
      state.selectedPortfolioInstrumentEditing = false;
      state.portfolioActionError = "";
    } else if (portfolioMipRow) {
      state.selectedPortfolioMipId = portfolioMipRow.dataset.portfolioMipId || "";
      state.selectedPortfolioMipEditing = false;
      state.portfolioMipActionError = "";
    } else if (exitPhaseRow) {
      state.selectedExitPhaseId = exitPhaseRow.dataset.exitPhaseId || "";
      state.selectedExitPhaseEditing = false;
      state.exitPhaseActionError = "";
    } else if (monthlyTargetFilterRow) {
      openMonthlyTargetPeriod(monthlyTargetFilterRow.dataset);
      return;
    } else if (monthlyTargetCategoryFilterRow) {
      applyMonthlyTargetTransactionFilter(monthlyTargetCategoryFilterRow.dataset);
      return;
    } else if (monthlyTargetRow) {
      state.selectedMonthlyTargetMonth = monthlyTargetRow.dataset.monthlyTargetMonth || "";
      state.selectedYearlyTargetYear = "";
      state.targetDetailEditing = false;
    } else if (yearlyTargetRow) {
      state.selectedYearlyTargetYear = yearlyTargetRow.dataset.yearlyTargetYear || "";
      state.selectedMonthlyTargetMonth = "";
      state.targetDetailEditing = false;
    } else {
      resetStatementPanel();
      state.selectedTransactionId = row.dataset.transactionId || "";
      state.selectedTransactionEditing = false;
      state.transactionActionError = "";
    }
    renderPreservingScroll();
  });

  document.addEventListener("keydown", handleCommandSearch, true);
  document.addEventListener("click", handleOutsideDetailPanel);
  document.addEventListener("click", handleDashboardMenuOutsideClick);
}

function handleDashboardMenuOutsideClick(event) {
  if (!state.dashboardCardMenuOpen) return;
  const target = event.target;
  if (!(target instanceof Element)) return;
  if (target.closest("[data-dashboard-card-menu], [data-action='toggle-dashboard-menu']")) return;
  state.dashboardCardMenuOpen = false;
  renderPreservingScroll();
}

function handleOutsideDetailPanel(event) {
  if (!hasOpenDetailPanel()) return;
  const path = typeof event.composedPath === "function" ? event.composedPath() : [];
  if (path.includes(elements.periodControl)) return;
  if (path.some((node) => node instanceof Element && node.matches(".details-panel, [data-detail-panel]"))) return;
  if (path.some((node) => node instanceof Element && node.matches("[data-action='open-chart-modal']"))) return;
  if (path.some((node) => node instanceof Element && node.matches("[data-action='open-account']"))) return;
  if (path.some((node) => node instanceof Element && node.matches("[data-action='open-transaction']"))) return;
  if (path.some((node) => node instanceof Element && node.matches("[data-action='open-trade']"))) return;
  if (path.some((node) => node instanceof Element && node.matches("[data-action='open-exit-phase']"))) return;
  if (path.some((node) => node instanceof Element && node.matches("[data-action='add-account'], [data-action='add-transaction'], [data-action='add-trade'], [data-action='add-portfolio-instrument'], [data-action='add-portfolio-mip']"))) return;
  if (path.some((node) => node instanceof Element && node.matches("[data-action='duplicate-account'], [data-action='duplicate-transaction'], [data-action='duplicate-trade'], [data-action='duplicate-portfolio-instrument'], [data-action='duplicate-selected-portfolio-instruments']"))) return;
  if (path.some((node) => node instanceof Element && node.matches("[data-action='open-monthly-target'], [data-action='open-yearly-target']"))) return;
  if (path.some((node) => node instanceof Element && node.matches("[data-action='show-statement']"))) return;

  const target = event.target;
  if (!(target instanceof Element)) return;
  if (target.closest(".details-panel")) return;
  if (target.closest("[data-detail-panel]")) return;
  if (target.closest(".period-control")) return;
  if (target.closest("[data-action='open-chart-modal']")) return;
  if (target.closest("[data-action='open-account']")) return;
  if (target.closest("[data-action='open-transaction']")) return;
  if (target.closest("[data-action='open-trade']")) return;
  if (target.closest("[data-action='open-exit-phase']")) return;
  if (target.closest("[data-action='add-account'], [data-action='add-transaction'], [data-action='add-trade'], [data-action='add-portfolio-instrument'], [data-action='add-portfolio-mip']")) return;
  if (target.closest("[data-action='duplicate-account'], [data-action='duplicate-transaction'], [data-action='duplicate-trade'], [data-action='duplicate-portfolio-instrument'], [data-action='duplicate-selected-portfolio-instruments']")) return;
  if (target.closest("[data-action='open-portfolio-instrument'], [data-action='open-portfolio-mip'], [data-action='open-exit-phase']")) return;
  if (target.closest("[data-action='open-monthly-target'], [data-action='open-yearly-target']")) return;
  if (target.closest("[data-action='show-statement']")) return;
  closeOpenDetailPanel();
}

function hasOpenDetailPanel() {
  return Boolean(
    state.periodPanelOpen
    || state.selectedAccountId
    || state.selectedTransactionId
    || state.selectedTradeId
    || state.selectedPortfolioInstrumentId
    || state.selectedPortfolioMipId
    || state.selectedExitPhaseId
    || state.selectedMonthlyTargetMonth
    || state.selectedYearlyTargetYear
    || state.expandedChartId
    || state.statement.transactionId,
  );
}

function closeOpenDetailPanel() {
  if (!hasOpenDetailPanel()) return;
  state.periodPanelOpen = false;
  state.selectedAccountId = "";
  state.selectedAccountEditing = false;
  state.accountActionError = "";
  state.selectedTransactionId = "";
  state.selectedTransactionEditing = false;
  state.transactionActionError = "";
  state.selectedTradeId = "";
  state.selectedTradeEditing = false;
  state.tradeActionError = "";
  state.selectedPortfolioInstrumentId = "";
  state.selectedPortfolioInstrumentEditing = false;
  state.portfolioActionError = "";
  state.selectedPortfolioMipId = "";
  state.selectedPortfolioMipEditing = false;
  state.portfolioMipActionError = "";
  state.selectedExitPhaseId = "";
  state.selectedExitPhaseEditing = false;
  state.exitPhaseActionError = "";
  state.selectedMonthlyTargetMonth = "";
  state.selectedYearlyTargetYear = "";
  state.targetDetailEditing = false;
  state.expandedChartId = "";
  resetStatementPanel();
  renderPreservingScroll();
}

function resetStatementPanel() {
  state.statement = {
    transactionId: "",
    data: null,
    loading: false,
    error: "",
  };
}

function markOverviewStale() {
  state.overview = null;
  state.globalSearch = null;
  state.error.overview = "";
  state.error.globalSearch = "";
}

function handleCommandSearch(event) {
  if (event.key === "Escape" && state.expandedChartId) {
    state.expandedChartId = "";
    renderPreservingScroll();
    return;
  }
  const key = String(event.key || "").toLowerCase();
  if ((event.metaKey || event.ctrlKey) && event.altKey && (key === "p" || event.code === "KeyP")) {
    event.preventDefault();
    event.stopPropagation();
    cyclePeriodMode();
    return;
  }
  if (!(event.metaKey || event.ctrlKey) || (key !== "k" && event.code !== "KeyK")) return;
  event.preventDefault();
  event.stopPropagation();
  elements.search.focus();
  elements.search.select();
  elements.search.closest(".search")?.classList.add("is-command-active");
  window.setTimeout(() => elements.search.closest(".search")?.classList.remove("is-command-active"), 450);
}

function runSearchForCurrentView() {
  resetSearchResultState();
  if (state.view === "overview") {
    if (state.query.trim()) {
      state.view = "search";
      render();
      loadGlobalSearch();
    } else {
      render();
    }
    return;
  }
  if (state.view === "search") {
    loadGlobalSearch();
    return;
  }
  if (state.view === "accounts") {
    loadAccounts();
    return;
  }
  if (state.view === "transactions") {
    loadTransactions();
    return;
  }
  if (state.view === "trades") {
    if (state.tradeView === "returns") {
      state.portfolioReturns = null;
      state.error.portfolioReturns = "";
      loadPortfolioReturns();
    } else {
      loadTrades();
    }
    return;
  }
  if (state.view === "portfolio") {
    render();
    return;
  }
  render();
}

function resetSearchResultState() {
  state.accountOffset = 0;
  state.selectedAccounts.clear();
  state.selectedAccountId = "";
  state.selectedAccountEditing = false;
  state.accountActionError = "";
  state.transactionOffset = 0;
  state.selectedTransactions.clear();
  state.selectedTransactionId = "";
  state.selectedTransactionEditing = false;
  state.transactionActionError = "";
  state.tradeOffset = 0;
  state.selectedTrades.clear();
  state.selectedTradeId = "";
  state.selectedTradeEditing = false;
  state.tradeActionError = "";
  state.portfolioReturns = null;
  state.error.portfolioReturns = "";
  resetStatementPanel();
}

function clearSearch() {
  state.query = "";
  if (elements.search) elements.search.value = "";
  state.globalSearch = null;
  state.error.globalSearch = "";
  runSearchForCurrentView();
}

function applyQuickTableFilter(value, field = "", label = value) {
  const query = String(value || "").trim();
  if (!query) return;
  const appliedFilter = applyStructuredQuickFilter(field, query);
  if (appliedFilter) {
    setQuickFilterChip(appliedFilter.view, appliedFilter.field, appliedFilter.value, label || query);
    renderActiveFilterChips();
    return;
  }
  state.query = query;
  if (elements.search) elements.search.value = query;
  resetSearchResultState();
  resetPortfolioDetailState();
  state.periodPanelOpen = false;
  state.dashboardCardMenuOpen = false;
  runSearchForCurrentView();
}

function applyStructuredQuickFilter(field, value) {
  const filterField = String(field || "").trim();
  const filterValue = String(value || "").trim();
  if (!filterField || !filterValue) return false;
  clearSearchStateOnly();

  if (state.view === "transactions") {
    const nextValue = taxonomyFilterValue(filterField, filterValue);
    if (filterField === "posted_date" || filterField === "transaction_date") {
      state.transactionFilters.date_from = filterValue;
      state.transactionFilters.date_to = filterValue;
      syncPeriodFromTransactionQuickFilter("date", filterValue);
    } else if (filterField === "transaction_month") {
      const range = transactionDateRangeFromQuickFilter(filterValue, "month");
      if (!range) return false;
      state.transactionFilters.date_from = range.dateFrom;
      state.transactionFilters.date_to = range.dateTo;
      syncPeriodFromTransactionQuickFilter("month", filterValue);
    } else if (filterField === "transaction_year") {
      const range = transactionDateRangeFromQuickFilter(filterValue, "year");
      if (!range) return false;
      state.transactionFilters.date_from = range.dateFrom;
      state.transactionFilters.date_to = range.dateTo;
      syncPeriodFromTransactionQuickFilter("year", filterValue);
    } else if (Object.prototype.hasOwnProperty.call(state.transactionFilters, filterField)) {
      state.transactionFilters[filterField] = nextValue;
    } else {
      return false;
    }
    state.transactionOffset = 0;
    state.transactionView = "register";
    state.selectedTransactions.clear();
    state.selectedTransactionId = "";
    resetStatementPanel();
    loadTransactions();
    const dateRangeField = transactionQuickFilterDateField(filterField);
    return {
      view: "transactions",
      field: dateRangeField || filterField,
      value: dateRangeField ? filterValue : nextValue,
    };
  }

  if (state.view === "accounts" && Object.prototype.hasOwnProperty.call(state.accountFilters, filterField)) {
    state.accountFilters[filterField] = filterValue;
    state.accountOffset = 0;
    state.accountView = "register";
    state.selectedAccounts.clear();
    state.selectedAccountId = "";
    loadAccounts();
    return {
      view: "accounts",
      field: filterField,
      value: filterValue,
    };
  }

  if (state.view === "trades") {
    if (Object.prototype.hasOwnProperty.call(state.tradeFilters, filterField)) {
      state.tradeFilters[filterField] = filterValue;
    } else {
      return false;
    }
    state.tradeOffset = 0;
    state.tradeView = "register";
    state.selectedTrades.clear();
    state.selectedTradeId = "";
    loadTrades();
    return {
      view: "trades",
      field: filterField,
      value: filterValue,
    };
  }

  return false;
}

function transactionQuickFilterDateField(field) {
  if (field === "posted_date" || field === "transaction_date") return "date";
  if (field === "transaction_month") return "month";
  if (field === "transaction_year") return "year";
  return "";
}

function syncPeriodFromTransactionQuickFilter(scope = "", value = "") {
  const raw = String(value || "").trim();
  if (scope === "date" && /^\d{4}-\d{2}-\d{2}$/.test(raw)) {
    state.period.mode = "day";
    state.period.day = raw;
    state.period.dayMonth = raw.slice(0, 7);
    state.period.dayPickerMonth = "";
    state.period.month = state.period.dayMonth;
    state.period.year = Number(raw.slice(0, 4)) || state.period.year;
    state.period.calendarYear = state.period.year;
    return true;
  }
  if (scope === "month" && /^\d{4}-\d{2}$/.test(raw)) {
    state.period.mode = "month";
    state.period.dayPickerMonth = "";
    state.period.dayMonth = raw;
    state.period.month = raw;
    state.period.year = Number(raw.slice(0, 4)) || state.period.year;
    state.period.calendarYear = state.period.year;
    return true;
  }
  if (scope === "year" && /^\d{4}$/.test(raw)) {
    state.period.mode = "year";
    state.period.dayPickerMonth = "";
    state.period.year = Number(raw) || state.period.year;
    state.period.calendarYear = state.period.year;
    state.period.yearRangeStart = yearRangeStartFor(state.period.year);
    return true;
  }
  return false;
}

function transactionDateRangeFromQuickFilter(value, scope) {
  const raw = String(value || "").trim();
  if (scope === "month" && /^\d{4}-\d{2}$/.test(raw)) {
    return {
      dateFrom: `${raw}-01`,
      dateTo: monthEndKey(raw),
    };
  }
  if (scope === "year" && /^\d{4}$/.test(raw)) {
    return {
      dateFrom: `${raw}-01-01`,
      dateTo: `${raw}-12-31`,
    };
  }
  return null;
}

function transactionDateChipFields() {
  return ["date", "month", "year"];
}

function quickFilterRegisterView(view = state.view) {
  return ["accounts", "transactions", "trades"].includes(view) ? view : "";
}

function setQuickFilterChip(view, field, value, label = value) {
  const filterView = quickFilterRegisterView(view);
  const filterField = String(field || "").trim();
  const filterValue = String(value || "").trim();
  if (!filterView || !filterField || !filterValue) return;
  const filterLabel = String(label || value || "").replace(/\s+/g, " ").trim() || filterValue;
  if (filterView === "transactions" && transactionDateChipFields().includes(filterField)) {
    transactionDateChipFields().forEach((dateField) => {
      delete state.quickFilters[filterView][dateField];
    });
  }
  state.quickFilters[filterView][filterField] = {
    view: filterView,
    field: filterField,
    value: filterValue,
    label: filterLabel,
  };
}

function renderActiveFilterChips() {
  if (!elements.filterChips) return;
  const view = quickFilterRegisterView();
  const chips = activeQuickFilterChips(view);
  elements.filterChips.hidden = !chips.length;
  elements.filterChips.innerHTML = chips.length ? `
    ${chips.map((chip) => filterChipHtml(chip)).join("")}
    <button
      class="clear-filter-button"
      data-action="clear-filter-chips"
      data-filter-view="${safe(view)}"
      type="button"
      ${tooltipAttrs("Clear table filters")}
    >
      <span data-icon="x"></span>
    </button>
  ` : "";
  paintIcons(elements.filterChips);
}

function activeQuickFilterChips(view = state.view) {
  const filterView = quickFilterRegisterView(view);
  if (!filterView) return [];
  const store = state.quickFilters[filterView] || {};
  const chipsByField = Object.entries(store).reduce((chips, [field, chip]) => {
    if (quickFilterMatchesState(filterView, chip)) {
      chips.set(field, chip);
    } else {
      delete store[field];
    }
    return chips;
  }, new Map());
  Object.entries(registerFilterState(filterView)).forEach(([field, value]) => {
    const normalizedValue = String(value || "").trim();
    if (!normalizedValue || chipsByField.has(field)) return;
    chipsByField.set(field, {
      view: filterView,
      field,
      value: normalizedValue,
      label: registerFilterChipLabel(filterView, field, normalizedValue),
    });
  });
  return Array.from(chipsByField.values());
}

function quickFilterMatchesState(view, chip = {}) {
  const field = String(chip.field || "").trim();
  const value = String(chip.value || "").trim();
  if (!field || !value) return false;
  if (view === "transactions") {
    if (field === "date") {
      return state.transactionFilters.date_from === value && state.transactionFilters.date_to === value;
    }
    if (field === "month") {
      const range = transactionDateRangeFromQuickFilter(value, "month");
      return Boolean(range && state.transactionFilters.date_from === range.dateFrom && state.transactionFilters.date_to === range.dateTo);
    }
    if (field === "year") {
      const range = transactionDateRangeFromQuickFilter(value, "year");
      return Boolean(range && state.transactionFilters.date_from === range.dateFrom && state.transactionFilters.date_to === range.dateTo);
    }
    return String(state.transactionFilters[field] || "") === value;
  }
  if (view === "accounts") return String(state.accountFilters[field] || "") === value;
  if (view === "trades") return String(state.tradeFilters[field] || "") === value;
  return false;
}

function registerFilterState(view) {
  if (view === "transactions") {
    return Object.fromEntries(
      Object.entries(state.transactionFilters).filter(([field]) => !["date_from", "date_to"].includes(field)),
    );
  }
  if (view === "accounts") return state.accountFilters || {};
  if (view === "trades") return state.tradeFilters || {};
  return {};
}

function registerFilterChipLabel(view, field, value) {
  if (field === "transaction_class") return transactionTypeFilterLabel(value);
  if (field === "category_id" || field === "subcategory_id") return taxonomyLabel(value);
  if (field === "country_code") return countryOptionLabel(value);
  if (field === "portfolio_id") return displayPortfolioId(value);
  return labelize(value);
}

function filterChipHtml(chip) {
  const fieldLabel = quickFilterChipFieldLabel(chip.view, chip.field);
  const valueLabel = quickFilterValueLabel(chip);
  return `
    <button
      class="filter-chip"
      data-action="remove-filter-chip"
      data-filter-view="${safe(chip.view)}"
      data-filter-field="${safe(chip.field)}"
      type="button"
      ${tooltipAttrs(`Remove ${fieldLabel} filter`)}
    >
      <span class="filter-chip-icon" data-icon="${safe(quickFilterIcon(chip.field))}"></span>
      <span class="filter-chip-copy">
        <span class="filter-chip-field">${safe(fieldLabel)}</span>
        <span class="filter-chip-value">${safe(valueLabel)}</span>
      </span>
      <span class="filter-chip-remove" aria-hidden="true" data-icon="x"></span>
    </button>
  `;
}

function quickFilterChipFieldLabel(view, field) {
  const label = quickFilterFieldLabel(view, field);
  if (field === "capital_bucket") return "Bucket";
  if (field === "transaction_class") return "Type";
  return label;
}

function quickFilterFieldLabel(view, field) {
  if (view === "transactions") {
    const labels = {
      date: "Date",
      month: "Month",
      year: "Year",
      source_system: "Account",
      country_code: "Country",
      statement_currency: "Currency",
      category_id: "Category",
      subcategory_id: "Subcategory",
      transaction_class: "Type",
    };
    if (labels[field]) return labels[field];
  }
  const fields = view === "accounts" ? accountFields : view === "trades" ? tradeFields : transactionFields;
  const match = fields.find(([key]) => key === field);
  return match ? match[1] : labelize(field);
}

function quickFilterValueLabel(chip = {}) {
  if (chip.field === "date") return formatDisplayDate(chip.value);
  if (chip.field === "month") return monthLabel(chip.value);
  if (chip.field === "year") return chip.value;
  if (chip.field === "category_id" || chip.field === "subcategory_id") return taxonomyLabel(chip.value);
  if (chip.field === "country_code") return chip.label || chip.value;
  if (chip.field === "portfolio_id") return displayPortfolioId(chip.value);
  if (chip.field === "phase_id") return chip.label || displayPhaseId(chip.value);
  return chip.label || labelize(chip.value);
}

function quickFilterIcon(field) {
  if (field === "date" || field === "month" || field === "year" || field === "entry_date" || field === "exit_date" || field === "price_as_of") return "calendar";
  if (field === "country_code") return "globe";
  if (field === "statement_currency" || field === "account_currency" || field === "trade_currency") return "currency";
  if (field === "category_id" || field === "subcategory_id" || field === "instrument_type" || field === "account_type") return "pie";
  if (field === "source_system" || field === "provider_id" || field === "account_id" || field === "portfolio_id") return "wallet";
  return "filter";
}

function removeQuickFilterChip(field, view = state.view) {
  const filterView = quickFilterRegisterView(view);
  const filterField = String(field || "").trim();
  if (!filterView || !filterField) return;
  clearQuickFilterField(filterView, filterField);
  delete state.quickFilters[filterView][filterField];
  reloadQuickFilterView(filterView);
}

function clearQuickFilterChips(view = state.view) {
  const filterView = quickFilterRegisterView(view);
  if (!filterView) return;
  activeQuickFilterChips(filterView).forEach((chip) => clearQuickFilterField(filterView, chip.field));
  state.quickFilters[filterView] = {};
  reloadQuickFilterView(filterView);
}

function clearQuickFilterField(view, field) {
  if (view === "transactions") {
    if (transactionDateChipFields().includes(field)) {
      const periodFilters = filtersForPeriod();
      state.transactionFilters.date_from = periodFilters.date_from;
      state.transactionFilters.date_to = periodFilters.date_to;
      return;
    }
    if (Object.prototype.hasOwnProperty.call(state.transactionFilters, field)) {
      state.transactionFilters[field] = "";
    }
    return;
  }
  if (view === "accounts" && Object.prototype.hasOwnProperty.call(state.accountFilters, field)) {
    state.accountFilters[field] = "";
    return;
  }
  if (view === "trades" && Object.prototype.hasOwnProperty.call(state.tradeFilters, field)) {
    state.tradeFilters[field] = "";
  }
}

function reloadQuickFilterView(view) {
  if (view === "transactions") {
    state.transactionOffset = 0;
    state.transactionView = "register";
    state.selectedTransactions.clear();
    state.selectedTransactionId = "";
    state.selectedTransactionEditing = false;
    state.transactionActionError = "";
    resetStatementPanel();
    loadTransactions();
    return;
  }
  if (view === "accounts") {
    state.accountOffset = 0;
    state.accountView = "register";
    state.selectedAccounts.clear();
    state.selectedAccountId = "";
    state.selectedAccountEditing = false;
    state.accountActionError = "";
    loadAccounts();
    return;
  }
  if (view === "trades") {
    state.tradeOffset = 0;
    state.tradeView = "register";
    state.selectedTrades.clear();
    state.selectedTradeId = "";
    state.selectedTradeEditing = false;
    state.tradeActionError = "";
    loadTrades();
  }
}

function updateTablePageSize(control) {
  const view = quickFilterRegisterView(control?.dataset?.tablePageSize || state.view);
  const size = normalizePageSize(control?.value);
  if (!view || !size) return;
  if (view === "transactions") {
    state.transactionPageSize = size;
    state.transactionOffset = 0;
  } else if (view === "accounts") {
    state.accountPageSize = size;
    state.accountOffset = 0;
  } else if (view === "trades") {
    state.tradePageSize = size;
    state.tradeOffset = 0;
  }
  reloadQuickFilterView(view);
}

function normalizePageSize(value) {
  if (String(value || "").toLowerCase() === "all") return "all";
  const size = Number(value);
  return PAGE_SIZE_OPTIONS.includes(size) ? size : 50;
}

function transactionTypeFilterLabel(value) {
  const labels = {
    [ACCOUNTABLE_TRANSACTION_TAB]: "Accountable",
    [NOT_ACCOUNTABLE_TRANSACTION_TAB]: "Not Accountable",
    [REVIEW_REQUIRED_TAB]: "Review Required",
    [DELETED_TRANSACTION_TAB]: "Deleted",
  };
  return labels[value] || taxonomyLabel(value);
}

function clearSearchStateOnly() {
  state.query = "";
  if (elements.search) elements.search.value = "";
  state.globalSearch = null;
  state.error.globalSearch = "";
  resetPortfolioDetailState();
  state.periodPanelOpen = false;
  state.dashboardCardMenuOpen = false;
}

function quickFilterControl(value, label = value, options = "") {
  const text = String(label ?? "").trim();
  const filterValue = String(value ?? "").trim();
  const className = typeof options === "string" ? options : (options.className || "");
  const field = typeof options === "object" ? options.field || "" : "";
  if (!text || !filterValue || text === "-") return safe(text || "-");
  return `
    <button
      class="table-link ${safe(className)}"
      data-action="quick-filter"
      data-filter-value="${safe(filterValue)}"
      ${field ? `data-filter-field="${safe(field)}"` : ""}
      type="button"
    >${safe(text)}</button>
  `;
}

function quickFilterHtml(value, html = "", options = "") {
  const filterValue = String(value ?? "").trim();
  const className = typeof options === "string" ? options : (options.className || "");
  const field = typeof options === "object" ? options.field || "" : "";
  if (!filterValue || filterValue === "-") return html || "-";
  return `
    <button
      class="table-link ${safe(className)}"
      data-action="quick-filter"
      data-filter-value="${safe(filterValue)}"
      ${field ? `data-filter-field="${safe(field)}"` : ""}
      type="button"
    >${html}</button>
  `;
}

function render(options = {}) {
  const scrollPosition = options.preserveScroll ? captureScrollPosition() : null;
  document.querySelectorAll("[data-view]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.view === state.view);
  });

  const config = topbarConfig();
  elements.search.placeholder = config.search;
  renderPagePrintControl();
  elements.periodControl.innerHTML = periodTrigger();
  renderActiveFilterChips();

  const views = {
    overview: renderOverview,
    search: renderGlobalSearchPage,
    accounts: renderAccounts,
    transactions: renderTransactions,
    statementImport: renderStatementImport,
	    trades: renderTrades,
	    portfolio: renderPortfolio,
	    planning: renderPlanning,
	    settings: renderSettings,
      about: renderAbout,
	  };

  elements.pageStage.innerHTML = `${(views[state.view] || renderOverview)()}${periodDetailsPanel()}`;
  paintIcons();
  restoreScrollPosition(scrollPosition);
}

function renderPreservingScroll() {
  render({ preserveScroll: true });
}

function captureScrollPosition() {
  const scrollingElement = document.scrollingElement || document.documentElement;
  const workspace = document.querySelector(".workspace");
  return {
    windowX: window.scrollX,
    windowY: window.scrollY,
    documentTop: scrollingElement?.scrollTop || 0,
    workspaceTop: workspace?.scrollTop || 0,
  };
}

function restoreScrollPosition(position) {
  if (!position) return;
  const apply = () => {
    const scrollingElement = document.scrollingElement || document.documentElement;
    const workspace = document.querySelector(".workspace");
    if (scrollingElement) scrollingElement.scrollTop = position.documentTop;
    if (document.documentElement) document.documentElement.scrollTop = position.documentTop;
    if (document.body) document.body.scrollTop = position.documentTop;
    if (workspace) workspace.scrollTop = position.workspaceTop;
    window.scrollTo(position.windowX, position.windowY);
  };
  apply();
  window.requestAnimationFrame(apply);
  window.requestAnimationFrame(() => window.requestAnimationFrame(apply));
  window.setTimeout(apply, 0);
}

function topbarConfig() {
  if (state.view === "search") {
    return {
      search: "Search all registers...",
    };
  }

  if (state.view === "accounts") {
    return {
      search: "Search accounts, providers, references...",
    };
  }

  if (state.view === "transactions") {
    return {
      search: "Search transactions, accounts, categories...",
    };
  }

  if (state.view === "statementImport") {
    return {
      search: "Search imported statements...",
    };
  }

  if (state.view === "trades") {
    return {
      search: "Search trades, symbols, providers...",
    };
  }

  if (state.view === "portfolio") {
    return {
      search: "Search portfolio instruments, providers, phases...",
    };
  }

	  if (state.view === "planning") {
	    return {
	      search: "Search goals, plans, report templates...",
	    };
	  }

  if (state.view === "settings") {
    return {
      search: "Search settings, source truth, connections...",
    };
  }

  if (state.view === "about") {
    return {
      search: "Search license, changelog, and contact...",
    };
  }

  return {
    search: "Search all registers...",
  };
}

function periodTrigger() {
  const icon = periodTriggerIcon();
  const canStep = state.period.mode !== "all";
  const nextMode = nextPeriodMode();
  const shortcut = periodModeShortcutLabel();
  return `
    <button
      class="period-mode-cycle-button"
      type="button"
      data-period-mode-cycle="true"
      ${tooltipAttrs(`Switch to ${periodModeLabel(nextMode)} view (${shortcut})`)}
    >
      <span aria-hidden="true">${icons[periodModeIcon(nextMode)]}</span>
    </button>
    <div class="period-stepper ${canStep ? "" : "is-disabled"}">
      <button class="period-step-button" type="button" data-period-step="-1" aria-label="${safe(periodStepLabel(-1))}" ${canStep ? "" : "disabled"}>
        ${icons.chevronLeft}
      </button>
      <button class="period-trigger ${state.periodPanelOpen ? "is-active" : ""}" type="button" data-period-open="true" aria-label="Open reporting period">
        <span class="period-trigger-icon" aria-hidden="true">${icons[icon]}</span>
        <strong>${safe(periodTriggerLabel())}</strong>
      </button>
      <button class="period-step-button" type="button" data-period-step="1" aria-label="${safe(periodStepLabel(1))}" ${canStep ? "" : "disabled"}>
        ${icons.chevronRight}
      </button>
    </div>
  `;
}

function periodTriggerIcon() {
  const scope = transactionPeriodScope();
  if (scope) return scope.icon;
  return periodModeIcon(state.period.mode);
}

function periodModeIcon(mode) {
  if (mode === "day") return "calendar";
  if (mode === "year") return "calendarYear";
  if (mode === "all") return "globe";
  return "calendar";
}

function periodModeShortcutLabel() {
  return `${isMacPlatform() ? "Cmd Option P" : "Ctrl Alt P"}`;
}

function periodTriggerLabel() {
  const scope = transactionPeriodScope();
  if (scope) return scope.label;
  if (state.period.mode === "day") return formatDisplayDate(state.period.day);
  if (state.period.mode === "year") return String(state.period.year);
  if (state.period.mode === "all") return "All";
  return monthLabel(state.period.month);
}

function periodDetailsPanel() {
  if (!state.periodPanelOpen) return "";
  const showDayPicker = Boolean(state.period.dayPickerMonth) || state.period.mode === "day";
  return `
    ${detailPanel(
      "Reporting Period",
      periodValueLabel(),
      `
        <div class="period-drawer">
          <div class="period-mode-selector" aria-label="Period type">
            ${periodModeButton("month", "Month", "Monthly view", "calendar")}
            ${periodModeButton("year", "Year", "Annual view", "calendarYear")}
            ${periodModeButton("all", "All years", "Full history", "globe")}
          </div>
          ${showDayPicker ? periodDayPicker() : ""}
          ${!showDayPicker && state.period.mode === "month" ? periodMonthPicker() : ""}
          ${state.period.mode === "year" ? periodYearPicker() : ""}
          ${state.period.mode === "all" ? periodAllYearsPanel() : ""}
          <p>The selected period sets the insight dashboards and the default Transactions date window.</p>
        </div>
      `,
      "close-period",
      "Period details",
    )}
  `;
}

function periodModeButton(mode, label, detail, icon) {
  const activeMode = state.period.mode === "day" || state.period.dayPickerMonth ? "month" : state.period.mode;
  const active = activeMode === mode;
  return `
    <button class="${active ? "is-active" : ""}" data-action="set-period-mode" data-period-mode="${safe(mode)}" type="button" aria-pressed="${active}">
      <span class="period-mode-icon" aria-hidden="true">${icons[icon]}</span>
      <span class="period-mode-copy">
        <strong>${safe(label)}</strong>
        <em>${safe(detail)}</em>
      </span>
    </button>
  `;
}

function periodDayPicker() {
  const selectedDay = state.period.day || currentDateKey();
  const selectedMonth = state.period.dayPickerMonth || state.period.dayMonth || selectedDay.slice(0, 7) || currentMonthKey();
  const [year, month] = selectedMonth.split("-").map(Number);
  const firstDate = new Date(year, month - 1, 1);
  const daysInMonth = new Date(year, month, 0).getDate();
  const leadingBlanks = (firstDate.getDay() + 6) % 7;
  const days = Array.from({ length: daysInMonth }, (_, index) => index + 1);
  return `
    <section class="period-calendar" aria-label="Day picker">
      <div class="period-calendar-head">
        <button class="period-nav-button" data-action="step-period-day-month" data-step="-1" type="button" aria-label="Previous month">
          ${icons.chevronLeft}
        </button>
        <strong>${monthLabel(selectedMonth)}</strong>
        <button class="period-nav-button" data-action="step-period-day-month" data-step="1" type="button" aria-label="Next month">
          ${icons.chevronRight}
        </button>
      </div>
      <div class="period-weekdays">${["M", "T", "W", "T", "F", "S", "S"].map((day) => `<span>${day}</span>`).join("")}</div>
      <div class="period-day-grid">
        ${Array.from({ length: leadingBlanks }, () => "<span></span>").join("")}
        ${days.map((day) => {
          const value = `${selectedMonth}-${String(day).padStart(2, "0")}`;
          const active = state.period.mode === "day" && value === selectedDay;
          return `
            <button class="period-day-button ${active ? "is-active" : ""}" data-action="set-period-day" data-period-day="${safe(value)}" type="button" aria-pressed="${active}">
              ${day}
            </button>
          `;
        }).join("")}
      </div>
    </section>
  `;
}

function periodMonthPicker() {
  const selectedMonth = state.period.month || currentMonthKey();
  const [selectedYear, selectedMonthNumber] = selectedMonth.split("-").map(Number);
  const calendarYear = Number(state.period.calendarYear || selectedYear || currentYear());
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `
    <section class="period-calendar" aria-label="Month picker">
      <div class="period-calendar-head">
        <button class="period-nav-button" data-action="step-period-calendar-year" data-step="-1" type="button" aria-label="Previous year">
          ${icons.chevronLeft}
        </button>
        <strong>${calendarYear}</strong>
        <button class="period-nav-button" data-action="step-period-calendar-year" data-step="1" type="button" aria-label="Next year">
          ${icons.chevronRight}
        </button>
      </div>
      <div class="period-month-grid">
        ${months.map((month, index) => {
          const monthNumber = index + 1;
          const value = `${calendarYear}-${String(monthNumber).padStart(2, "0")}`;
          const active = selectedYear === calendarYear && selectedMonthNumber === monthNumber;
          return `
            <button class="period-month-button ${active ? "is-active" : ""}" data-action="set-period-month" data-period-month="${safe(value)}" type="button" aria-pressed="${active}">
              <strong>${safe(month)}</strong>
              <span>${String(monthNumber).padStart(2, "0")}</span>
            </button>
          `;
        }).join("")}
      </div>
    </section>
  `;
}

function periodYearPicker() {
  const selectedYear = Number(state.period.year || currentYear());
  const start = Number(state.period.yearRangeStart || selectedYear - 5);
  const years = Array.from({ length: 12 }, (_, index) => start + index);
  return `
    <section class="period-calendar" aria-label="Year picker">
      <div class="period-calendar-head">
        <button class="period-nav-button" data-action="step-period-year-range" data-step="-12" type="button" aria-label="Previous year range">
          ${icons.chevronLeft}
        </button>
        <strong>${start} - ${start + 11}</strong>
        <button class="period-nav-button" data-action="step-period-year-range" data-step="12" type="button" aria-label="Next year range">
          ${icons.chevronRight}
        </button>
      </div>
      <div class="period-year-grid">
        ${years.map((year) => {
          const active = year === selectedYear;
          return `
            <button class="period-year-button ${active ? "is-active" : ""}" data-action="set-period-year" data-period-year="${year}" type="button" aria-pressed="${active}">
              ${year}
            </button>
          `;
        }).join("")}
      </div>
    </section>
  `;
}

function periodAllYearsPanel() {
  return `
    <section class="period-all-panel">
      <strong>Full history</strong>
      <span>Includes every dated ledger row available in the connected source truth.</span>
    </section>
  `;
}

function periodModeLabel(mode = state.period.mode) {
  if (mode === "day") return "Day";
  if (mode === "year") return "Year";
  if (mode === "all") return "All years";
  return "Month";
}

function periodValueLabel() {
  if (state.period.mode === "day") return formatDisplayDate(state.period.day);
  if (state.period.mode === "year") return String(state.period.year);
  if (state.period.mode === "all") return "Full history";
  return monthLabel(state.period.month);
}

function renderOverview() {
  const needsFullScope = !overviewHasScope("full");
  if (state.loading.overview && (!state.overview || needsFullScope)) return loadingState("Loading overview");
  if (state.error.overview && (!state.overview || needsFullScope)) return errorState("Overview", state.error.overview);

  const data = state.overview;
  if (!data) return loadingState("Loading overview");

  const accounts = data.accounts;
  const transactions = data.transactions;
  const trades = data.trades || {};
  const portfolio = data.portfolio || {};
  const netWorth = accounts.net_worth_eur || 0;
  const ytdNet = transactions.ytd_net_eur || 0;
  const dashboardCards = overviewDashboardCards(accounts, transactions, trades);
  const strategicCards = overviewStrategicCards(accounts, transactions, trades, portfolio);
  const systemInsights = overviewSystemInsights(accounts, transactions, trades, portfolio);
  const insightCards = overviewUnifiedInsightCards(strategicCards, systemInsights, dashboardCards, accounts, transactions, trades, portfolio);
  const body = state.overviewView === "charts"
    ? overviewChartsDashboard(data)
    : overviewInsightsDashboard(insightCards, accounts, transactions);

  return `
    <section class="overview-intro">
      <div class="net-worth-block">
        <div class="section-kicker">Net Worth</div>
        <h1 class="hero-value">${formatCurrency(netWorth, "EUR")}</h1>
        <div class="hero-delta ${ytdNet >= 0 ? "positive" : "negative"}">
          <span>${ytdNet >= 0 ? "+" : ""}${formatCurrency(ytdNet, "EUR")}</span>
          <span>YTD net flow</span>
        </div>
      </div>
    </section>

    ${overviewTabs()}
    ${body}
		  `;
}

function overviewTabs() {
  const tabs = [
    { id: "insights", label: "Insights" },
    { id: "charts", label: "Charts" },
  ];
  return `
    <nav class="transaction-tabs overview-tabs" aria-label="Overview sections">
      ${tabs.map((tab) => `
        <button
          class="${state.overviewView === tab.id ? "is-active" : ""}"
          data-action="overview-tab"
          data-overview-view="${safe(tab.id)}"
          type="button"
        >${safe(tab.label)}</button>
      `).join("")}
    </nav>
  `;
}

function overviewInsightsDashboard(insightCards = [], accounts = {}, transactions = {}) {
  return `
    <section class="overview-section overview-insights-section">
      <section class="overview-insight-grid">
        ${insightCards.map((card) => metricCard(card.label, card.value, card.meta, card.note, card.icon, card)).join("")}
      </section>
    </section>
  `;
}

function overviewUnifiedInsightCards(strategicCards = [], systemInsights = [], dashboardCards = [], accounts = {}, transactions = {}, trades = {}, portfolio = {}) {
  const cards = [
    ...strategicCards.map((card) => ({ ...card, compact: true })),
    ...overviewRelevantSystemInsightCards(systemInsights),
    ...dashboardCards.map((card) => ({ ...card, compact: true })),
  ];
  const seen = new Set();
  return cards
    .filter((card) => {
      const key = card.id || kebabCase(card.label || "insight");
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .map((card) => overviewInsightCardWithSparkline(card, accounts, transactions, trades, portfolio));
}

function overviewInsightCardWithSparkline(card = {}, accounts = {}, transactions = {}, trades = {}, portfolio = {}) {
  if (Array.isArray(card.sparkline) && card.sparkline.filter((value) => Number.isFinite(Number(value))).length >= 2) return card;
  const series = transactions.monthly_series || [];
  const title = String(card.label || "").toLowerCase();
  const id = String(card.id || "");
  const liquidCapital = numericValue(accounts.liquid_capital_eur);
  const expensePoints = recentCompletedMonthlyValues(series, "expense_eur", 24);

  let sparkline = [];
  if (title.includes("savings rate")) {
    sparkline = monthlySavingsRateSeries(series, 24);
  } else if (title.includes("liquidity") || title.includes("runway")) {
    sparkline = expensePoints.map((expense) => liquidCapital - (numericValue(expense) * 6));
  } else if (title.includes("overspending") || id.includes("overspending") || id.includes("target-breach")) {
    sparkline = recentMonthlyTargetValues(transactions.monthly_targets, "structural_overspending_eur", 24);
  } else if (title.includes("monthly surplus") || title.includes("investable surplus")) {
    sparkline = monthlyNetFlowSeries(series, 24);
  } else if (title.includes("credit")) {
    sparkline = overviewReferenceSparkline(creditUtilizationData(accounts.credit_cards).pct);
  } else if (title.includes("investment share")) {
    sparkline = overviewReferenceSparkline(percentOf(breakdownAmount(accounts.by_bucket, ["investment", "investments"]), accounts.net_worth_eur));
  } else if (title.includes("investment return")) {
    const investmentCapital = breakdownAmount(accounts.by_bucket, ["investment", "investments"]);
    const realizedGains = numericValue(trades.realized_pl_eur, currencyTotal(trades.realized_pl_by_currency));
    const unrealizedGains = numericValue(trades.unrealized_pl_eur, currencyTotal(trades.unrealized_pl_by_currency));
    sparkline = overviewReferenceSparkline(percentOf(realizedGains + unrealizedGains, investmentCapital));
  }

  return {
    ...card,
    sparkline: sparkline.filter((value) => Number.isFinite(Number(value))).length >= 2
      ? sparkline
      : overviewReferenceSparkline(displayMetricNumber(card.value)),
  };
}

function recentMonthlyTargetValues(targets = [], key = "", count = 24) {
  return targets
    .filter((row) => row.month)
    .sort((a, b) => String(a.month).localeCompare(String(b.month)))
    .slice(-count)
    .map((row) => numericValue(row[key]));
}

function overviewReferenceSparkline(value = 1, count = 12) {
  const numeric = numericValue(value, 1);
  return Array.from({ length: Math.max(2, count) }, () => Number.isFinite(numeric) ? numeric : 1);
}

function displayMetricNumber(value) {
  const raw = String(value ?? "").replace(/[^\d.-]/g, "");
  const numeric = Number(raw);
  return Number.isFinite(numeric) ? numeric : 1;
}

function overviewRelevantSystemInsightCards(signals = []) {
  const excluded = ["leads spending", "capital system is stable"];
  return signals
    .filter((item) => {
      const title = String(item.title || "").toLowerCase();
      if (excluded.some((term) => title.includes(term))) return false;
      return signalSeverity(item) >= 2 || /liquidity|deployment|overspending|concentration|savings/.test(title);
    })
    .slice(0, 4)
    .map((item) => {
      const parts = overviewSignalCardParts(item);
      return dashboardCard(
        `signal-${kebabCase(item.title || "insight")}`,
        item.title || "Insight",
        parts.value,
        parts.meta,
        parts.note,
        item.icon,
        { tone: item.tone, compact: true },
      );
    });
}

function overviewChartsDashboard(data = {}) {
  const accounts = data.accounts || {};
  const transactions = data.transactions || {};
  const portfolio = data.portfolio || {};
  return `
    <section class="overview-section overview-charts-section">
      <section class="reports-chart-grid overview-chart-grid">
        ${chartPanel(reportNetWorthOverTime(accounts, transactions, portfolio, { chartId: "overview-net-worth" }))}
        ${chartPanel(reportCashFlowChart(transactions, { chartId: "overview-cash-flow" }))}
        ${chartPanel(planningMonteCarloChart(portfolio, accounts, { chartId: "overview-monte-carlo" }))}
        ${chartPanel(reportNetWorthForecast(accounts, transactions, portfolio, { chartId: "overview-net-worth-forecast" }))}
      </section>
    </section>
    ${overviewExpandedChart(data)}
  `;
}

function overviewExpandedChart(data = {}) {
  const chartId = state.expandedChartId || "";
  if (!chartId || state.view !== "overview") return "";
  const accounts = data.accounts || {};
  const transactions = data.transactions || {};
  const portfolio = data.portfolio || {};
  if (chartId === "overview-net-worth") {
    return expandedChartShell(
      "Net Worth Over Time",
      reportNetWorthOverTime(accounts, transactions, portfolio, { chartId, expanded: true }),
    );
  }
  if (chartId === "overview-cash-flow") {
    return expandedChartShell(
      "Cash Flow",
      reportCashFlowChart(transactions, { chartId, expanded: true }),
    );
  }
  if (chartId === "overview-monte-carlo") {
    return expandedChartShell(
      "Monte Carlo Projection",
      planningMonteCarloChart(portfolio, accounts, { chartId, expanded: true }),
    );
  }
  if (chartId === "overview-net-worth-forecast") {
    return expandedChartShell(
      "Net Worth Forecast",
      reportNetWorthForecast(accounts, transactions, portfolio, { chartId, expanded: true }),
    );
  }
  return "";
}

function renderGlobalSearchPage() {
  return `
    <section class="transactions-head">
      <h1>Global Search</h1>
    </section>
    ${globalSearchSection(true)}
  `;
}

function globalSearchSection(showEmpty = false) {
  const query = state.query.trim();
  if (!query) {
    return showEmpty
      ? panel("Global Search", emptyState("Search from Overview to scan accounts, transactions, and trades together."), "full")
      : "";
  }
  if (state.loading.globalSearch && !state.globalSearch) {
    return panel("Global Search", `<div class="global-search-state"><div class="loader"></div><strong>Searching every register</strong></div>`, "full");
  }
  if (state.error.globalSearch && !state.globalSearch) {
    return panel("Global Search", `<p class="drawer-error">${safe(state.error.globalSearch)}</p>`, "full");
  }

  const data = state.globalSearch || {};
  if (state.loading.globalSearch && data.query !== query) {
    return panel("Global Search", `<div class="global-search-state"><div class="loader"></div><strong>Searching every register</strong></div>`, "full");
  }
  const resultCount = (data.accounts?.total || 0) + (data.transactions?.total || 0) + (data.trades?.total || 0);
  return panel(
    "Global Search",
    `
      <div class="global-search-head">
        <span>${formatNumber(resultCount)} matches for <strong>${safe(query)}</strong></span>
      </div>
      <div class="global-search-grid">
        ${globalSearchCard("Accounts", "accounts", data.accounts, globalAccountResults(data.accounts?.rows || []))}
        ${globalSearchCard("Transactions", "transactions", data.transactions, globalTransactionResults(data.transactions?.rows || []))}
        ${globalSearchCard("Trades", "trades", data.trades, globalTradeResults(data.trades?.rows || []))}
      </div>
    `,
    "full",
  );
}

function globalSearchCard(title, view, payload = {}, rowsHtml = "") {
  const total = payload?.total || 0;
  return `
    <article class="global-result-card">
      <header>
        <div>
          <strong>${safe(title)}</strong>
          <span>${formatNumber(total)} matches</span>
        </div>
        <button class="table-action-button" data-action="open-global-section" data-view-target="${safe(view)}" type="button">
          Open
        </button>
      </header>
      <div class="global-result-list">
        ${rowsHtml || emptyState("No matching rows.")}
      </div>
    </article>
  `;
}

function globalAccountResults(rows = []) {
  return rows.map((row) => `
    <button class="global-result-row" data-action="open-global-result" data-view-target="accounts" data-result-id="${safe(row.account_id)}" type="button">
      ${accountTypeMark(row)}
      <span>
        <strong>${safe(row.account_reference || row.account_id)}</strong>
        <small>${safe([row.provider_id, labelize(row.account_type), row.account_currency].filter(Boolean).join(" · "))}</small>
      </span>
      <em>${formatAccountMoney(row.amount_eur_converted, "EUR")}</em>
    </button>
  `).join("");
}

function globalTransactionResults(rows = []) {
  return rows.map((row) => `
    <button class="global-result-row" data-action="open-global-result" data-view-target="transactions" data-result-id="${safe(row.transaction_id)}" type="button">
      <span class="global-result-icon" aria-hidden="true">${icons.receipt}</span>
      <span>
        <strong>${safe(row.memo || row.counterparty_name || row.transaction_id)}</strong>
        <small>${safe([formatDisplayDate(transactionPrimaryDate(row)), taxonomyLabel(row.transaction_class), countryName(row.country_code)].filter(Boolean).join(" · "))}</small>
      </span>
      <em>${signedCurrency(row)}</em>
    </button>
  `).join("");
}

function globalTradeResults(rows = []) {
  return rows.map((row) => `
    <button class="global-result-row" data-action="open-global-result" data-view-target="trades" data-result-id="${safe(row.trade_id)}" type="button">
      ${instrumentMark(row)}
      <span>
        <strong>${safe(row.symbol || row.trade_id)}</strong>
        <small>${safe([row.provider_id, labelize(row.instrument_type), row.trade_currency].filter(Boolean).join(" · "))}</small>
      </span>
      <em>${formatTradeMoney(row.current_market_value_native, row.trade_currency)}</em>
    </button>
  `).join("");
}

function registerSearchHits(title, data = {}) {
  return "";
}

function renderAccounts() {
  if (state.loading.accounts && !state.accounts) return loadingState("Loading accounts");
  if (state.error.accounts && !state.accounts) return errorState("Accounts", state.error.accounts);

  const data = state.accounts;
  const summary = data?.summary || {};
  const rows = data?.rows || [];
  const isLoading = state.loading.accounts;

  return `
    <section class="transactions-head">
      <h1>Accounts</h1>
    </section>
    ${accountTabs()}
    ${state.accountView === "insights" ? accountInsightsDashboard(data) : `
    ${registerSearchHits("Accounts", data)}
    <section class="transaction-metrics">
      ${accountMetrics(summary, data)}
    </section>
    ${panel(
      isLoading ? "Accounts Loading" : "Accounts",
      accountTable(rows, data),
      "full",
      accountTableActions(),
    )}
    ${accountDetailsPanel(rows)}
    `}
  `;
}

function renderTransactions() {
  if (state.loading.transactions && !state.transactions) return loadingState("Loading transactions");
  if (state.error.transactions && !state.transactions) return errorState("Transactions", state.error.transactions);

  const data = state.transactions;
  const summary = data?.summary || {};
  const filters = data?.filters || {};
  const rows = data?.rows || [];
  const isLoading = state.loading.transactions;
  const activeClass = state.transactionFilters.transaction_class || "";
  normalizeTransactionTargetView(data?.insights || {});

  return `
    <section class="transactions-head">
      <h1>Transactions</h1>
    </section>
    ${transactionTabs(filters.transaction_classes || [], data?.insights || {})}
    ${state.transactionView === "insights" ? transactionInsightsDashboard(data) : state.transactionView === "monthlyTargets" ? transactionMonthlyTargetsDashboard(data) : `
    ${registerSearchHits("Transactions", data)}
    <section class="transaction-metrics">
      ${transactionMetrics(summary, activeClass, data)}
    </section>
    ${panel(
      isLoading ? "Transactions Loading" : "Transactions",
      transactionTable(rows, data),
      "full",
      transactionTableActions(),
    )}
    ${transactionDetailsPanel(rows)}
    ${transactionStatementPanel()}
    `}
  `;
}

function renderTrades() {
  if (state.tradeView === "returns") {
    const returnsData = state.portfolioReturns || state.trades || {
      insights: {},
      summary: {},
      insight_tables: {},
      rows: [],
    };
    return `
      <section class="transactions-head">
        <h1>Trades</h1>
      </section>
      ${tradeTabs()}
      ${portfolioReturnsDashboard({}, returnsData)}
    `;
  }

  if (state.loading.trades && !state.trades) return loadingState("Loading trades");
  if (state.error.trades && !state.trades) return errorState("Trades", state.error.trades);
  const data = state.trades;
  const summary = data?.summary || {};
  const rows = data?.rows || [];
  const isLoading = state.loading.trades;

  return `
    <section class="transactions-head">
      <h1>Trades</h1>
    </section>
    ${tradeTabs()}
    ${state.tradeView === "insights" ? tradeInsightsDashboard(data) : `
    ${registerSearchHits("Trades", data)}
    ${tradePriceRefreshNotice()}
    <section class="transaction-metrics">
      ${tradeMetrics(summary, data)}
    </section>
    ${panel(
      isLoading ? "Trades Loading" : "Trades",
      tradeTable(rows, data),
      "full",
      tradeTableActions(),
    )}
    ${tradeDetailsPanel(rows)}
    `}
  `;
}

function tradePriceRefreshNotice() {
  const status = state.tradePriceRefresh || {};
  if (status.loading) return `<p class="inline-status">Refreshing market prices...</p>`;
  if (status.error) return `<p class="inline-status is-error">${safe(status.error)}</p>`;
  if (status.message) return `<p class="inline-status">${safe(status.message)}</p>`;
  return "";
}

function renderPortfolio() {
  const needsFullScope = !overviewHasScope("full");
  if (state.loading.overview && (!state.overview || needsFullScope)) return loadingState("Loading portfolio");
  if (state.error.overview && (!state.overview || needsFullScope)) return errorState("Portfolio", state.error.overview);

  const data = state.overview;
  if (!data) return loadingState("Loading portfolio");
  const portfolio = data.portfolio || {};
  const body = state.portfolioView === "portfolio-performance"
    ? portfolioPortfolioPerformanceDashboard(portfolio)
    : state.portfolioView === "performance"
      ? portfolioPerformanceDashboard(portfolio)
      : portfolioDashboard(portfolio);

  return `
    <section class="transactions-head">
      <h1>Portfolio</h1>
    </section>
    ${portfolioTabs()}
    ${body}
  `;
}

function portfolioTabs() {
  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "portfolio-performance", label: "Performance" },
    { id: "performance", label: "Funding" },
  ];
  return `
    <nav class="transaction-tabs portfolio-tabs" aria-label="Portfolio sections">
      ${tabs.map((tab) => `
        <button
          class="${state.portfolioView === tab.id ? "is-active" : ""}"
          data-action="portfolio-tab"
          data-portfolio-view="${safe(tab.id)}"
          type="button"
        >${safe(tab.label)}</button>
      `).join("")}
    </nav>
  `;
}

function renderPlanning() {
  const needsFullScope = !overviewHasScope("full");
  if (state.loading.overview && (!state.overview || needsFullScope)) return loadingState("Loading planning");
  if (state.error.overview && (!state.overview || needsFullScope)) return errorState("Planning", state.error.overview);

  const data = state.overview;
  if (!data) return loadingState("Loading planning");
  if (!["targets", "exit", "mip"].includes(state.planningView)) {
    state.planningView = "targets";
  }

  return `
    <section class="transactions-head">
      <h1>Planning</h1>
    </section>
    ${planningTabs()}
    ${planningDashboard(data)}
  `;
}

function planningDashboard(data = {}) {
  const transactions = data.transactions || {};
  const planning = data.planning || planningPayloadFromTransactions(transactions);

  return `
    ${state.planningView === "targets"
      ? planningTargetsDashboard(planning)
      : state.planningView === "exit"
        ? planningExitStrategyDashboard(data.portfolio || {}, planning)
        : state.planningView === "mip"
          ? planningMonthlyInvestmentDashboard(data.portfolio || {})
          : planningTargetsDashboard(planning)}
  `;
}

function planningTabs() {
  const tabs = [
    { id: "targets", label: "Targets" },
    { id: "exit", label: "Exit Strategy" },
    { id: "mip", label: "Monthly Plan" },
  ];
  return `
    <nav class="transaction-tabs planning-tabs" aria-label="Planning sections">
      ${tabs.map((tab) => `
        <button
          class="${state.planningView === tab.id ? "is-active" : ""}"
          data-action="planning-tab"
          data-planning-view="${safe(tab.id)}"
          type="button"
        >${safe(tab.label)}</button>
      `).join("")}
    </nav>
  `;
}

function planningPayloadFromTransactions(transactions = {}) {
  return {
    summary: transactions.capital_targets || {},
    yearly_targets: transactions.yearly_targets || [],
    monthly_targets: transactions.monthly_targets || [],
    exit_strategy: {},
    monte_carlo: {},
  };
}

function renderPagePrintControl() {
  if (!elements.pagePrintControl) return;
  const label = pagePrintLabel();
  elements.pagePrintControl.innerHTML = label
    ? iconActionButton("print-page", "print", label, { className: "page-print-button" })
    : "";
}

function pagePrintLabel() {
  return {
    overview: "Print overview to PDF",
    accounts: "Print accounts to PDF",
    transactions: "Print transactions to PDF",
    trades: "Print trades to PDF",
    portfolio: "Print portfolio to PDF",
    planning: "Print planning to PDF",
  }[state.view] || "";
}

let activePrintTitle = "";
let activePrintMeta = "";
let originalDocumentTitle = "";

function printCurrentPage() {
  preparePrintDocument();
  requestAnimationFrame(() => window.print());
}

function preparePrintDocument() {
  if (!originalDocumentTitle) originalDocumentTitle = document.title || "Ledger";
  activePrintTitle = printDocumentTitle();
  activePrintMeta = printDocumentMeta();
  document.title = activePrintTitle;
  document.body.dataset.printTitle = activePrintTitle;
  document.body.dataset.printMeta = activePrintMeta;
}

function restorePrintDocument() {
  if (originalDocumentTitle) document.title = originalDocumentTitle;
  originalDocumentTitle = "";
  activePrintTitle = "";
  activePrintMeta = "";
  delete document.body.dataset.printTitle;
  delete document.body.dataset.printMeta;
}

function printDocumentTitle() {
  return `Ledger - ${printPageName()} - ${currentDateKey()}`;
}

function printDocumentMeta() {
  return [printViewName(), periodValueLabel(), `Generated ${currentDateKey()}`]
    .filter(Boolean)
    .join(" · ");
}

function printPageName() {
  const base = navItems.find((item) => item.id === state.view)?.label || labelize(state.view || "Report");
  const view = printViewName();
  return view && view !== base ? `${base} ${view}` : base;
}

function printViewName() {
  if (state.view === "overview") return state.overviewView === "charts" ? "Charts" : "Insights";
  if (state.view === "accounts") return labelize(state.accountView || "accounts");
  if (state.view === "transactions") return labelize(state.transactionView || "transactions");
  if (state.view === "trades") return labelize(state.tradeView || "trades");
  if (state.view === "portfolio") return labelize(state.portfolioView || "portfolio");
  if (state.view === "planning") return labelize(state.planningView || "planning");
  return "";
}

window.addEventListener("beforeprint", preparePrintDocument);
window.addEventListener("afterprint", restorePrintDocument);

function chartExpandButton(chartId, label = "Open expanded chart") {
  if (!chartId) return "";
  return `
    <button class="icon-button chart-expand-button" data-action="open-chart-modal" data-chart-id="${safe(chartId)}" type="button" ${tooltipAttrs(label)}>
      <span data-icon>${icons.maximize}</span>
    </button>
  `;
}

function expandedChartShell(title, body) {
  return `
    <div class="chart-modal-backdrop" role="presentation">
      <section class="chart-modal" data-detail-panel role="dialog" aria-modal="true" aria-label="${safe(title)}">
        <header class="chart-modal-header">
          <h2>${safe(title)}</h2>
          <button class="icon-button" data-action="close-chart-modal" type="button" ${tooltipAttrs("Close expanded chart")}>
            <span data-icon>${icons.x}</span>
          </button>
        </header>
        <div class="chart-modal-body">
          ${body}
        </div>
      </section>
    </div>
  `;
}

function chartDetailGrid(items = []) {
  const visibleItems = items.filter((item) => item && (item.label || item.value || item.detail));
  if (!visibleItems.length) return "";
  return `
    <div class="chart-detail-grid">
      ${visibleItems.map((item) => `
        <article>
          <span>${safe(item.label || "")}</span>
          <strong>${item.valueHtml || safe(item.value || "")}</strong>
          ${item.detail ? `<em>${safe(item.detail)}</em>` : ""}
        </article>
      `).join("")}
    </div>
  `;
}

function chartValueRange(low = "", high = "") {
  const label = `${low} to ${high}`;
  return `
    <span class="chart-value-range" aria-label="${safe(label)}">${safe(`${low} - ${high}`)}</span>
  `;
}

function chartPanel(body = "") {
  return `
    <section class="panel report-chart-panel compact-chart-panel">
      ${body}
    </section>
  `;
}

function compactChartCard(options = {}) {
  const label = options.label || "Chart";
  const iconKey = options.icon || panelIcon(label) || metricIcon(label);
  const hasValue = options.value !== null && options.value !== undefined && String(options.value) !== "";
  const sparklineValues = Array.isArray(options.sparkline) ? options.sparkline : [];
  const sparklineId = options.sparklineId || chartSparklineId(options.chartId, label);
  const deltas = metricDeltaHtml(options.metrics || []);
  const periodControl = compactChartPeriodControl(options.periodControl || {});
  const chart = compactStandardChart(options, sparklineValues, sparklineId, label);
  return `
    <article class="metric-card chart-compact-card">
      <div class="chart-compact-tools">
        ${periodControl}
        ${chartExpandButton(options.chartId, options.expandLabel || `Expand ${label}`)}
      </div>
      <div class="metric-card-head">
        <span class="metric-card-icon" aria-hidden="true">${icons[iconKey] || icons.target}</span>
        <span class="metric-card-label">${safe(label)}</span>
      </div>
      <strong class="${hasValue ? "" : "is-empty"}">${hasValue ? safe(options.value) : "&nbsp;"}</strong>
      ${options.meta ? `<small>${safe(options.meta)}</small>` : ""}
      ${chart}
      ${deltas}
      ${options.note ? `<em>${safe(options.note)}</em>` : ""}
    </article>
  `;
}

function compactStandardChart(options = {}, sparklineValues = [], sparklineId = "actual", label = "Chart") {
  if (state.privacyMode) return "";
  const chart = options.chart || {};
  if (chart.html) return chart.html;
  const series = Array.isArray(chart.series) && chart.series.length
    ? chart.series
    : [{
        id: chart.id || sparklineId || "actual",
        label: chart.label || label,
        points: compactChartPoints(options.chartPoints || chart.points, sparklineValues),
      }];
  const chartValues = series.flatMap((item) => (item.points || []).map((point) => numericValue(point?.value)).filter((value) => Number.isFinite(value)));
  if (chartValues.length < 2) return "";
  const chartMin = Math.min(...chartValues);
  const yMin = chart.yMin !== undefined ? chart.yMin : (chartMin >= 0 ? 0 : undefined);
  const className = ["chart-compact-standard", chart.className || sparklineId].filter(Boolean).join(" ");
  return standardLineChart({
    ariaLabel: chart.ariaLabel || label,
    bands: chart.bands || [],
    className,
    currency: chart.currency || "EUR",
    height: chart.height || 320,
    labelIndexes: chart.labelIndexes || standardChartLabelIndexes(Math.max(...series.map((item) => (item.points || []).length)), chart.labelCount || 4),
    markers: chart.markers || [],
    padding: chart.padding || { top: 18, right: 18, bottom: 38, left: 70 },
    regions: chart.regions || [],
    series,
    showLastDot: chart.showLastDot !== false,
    showPoints: Boolean(chart.showPoints),
    tickCount: chart.tickCount || 4,
    tooltipContext: chart.tooltipContext || {},
    tooltipFormatter: chart.tooltipFormatter || standardChartTooltip,
    width: chart.width || 1120,
    xLabelFormatter: chart.xLabelFormatter || shortMonthLabel,
    yMax: chart.yMax,
    yMin,
    yValueFormatter: chart.yValueFormatter,
  });
}

function compactChartPoints(points = [], fallbackValues = []) {
  const sourcePoints = Array.isArray(points) && points.length
    ? points
    : fallbackValues.map((value, index) => ({ label: String(index + 1), value }));
  return sourcePoints
    .map((point, index) => {
      if (point && typeof point === "object") {
        return {
          ...point,
          label: point.label || point.month || String(index + 1),
          value: point.value,
        };
      }
      return { label: String(index + 1), value: point };
    })
    .filter((point) => chartHasValue(point.value));
}

function chartSparklineId(chartId = "", label = "") {
  const key = String(chartId || label || "").toLowerCase();
  if (key.includes("cash-flow")) return "net";
  if (key.includes("forecast")) return "forecast";
  if (key.includes("monte-carlo")) return "p50";
  if (key.includes("monthly-plan") || key.includes("monthly-funding")) return "actual";
  if (key.includes("cumulative-contribution")) return "actual";
  if (key.includes("investment-return")) return "portfolio-total";
  if (key.includes("investment-value")) return "known-value";
  if (key.includes("return-monthly")) return "monthly-realized";
  if (key.includes("return-timeline") || key.includes("realized")) return "realized";
  return "actual";
}

function planningTargetsDashboard(planning = {}) {
  const rows = planningTargetRows(planning);
  const summary = yearlyTargetsSummary(rows, planning.summary || {});
  return `
    <section class="transaction-metrics planning-target-metrics">
      ${transactionMetric("Capital Retention Target", formatWholeCurrency(summary.target_savings_eur || 0, "EUR"), `${formatPercent(summary.target_savings_pct || 0)} of income baseline`)}
      ${transactionMetric("Actual Capital Retention", signedWholeAmount(summary.actual_savings_eur || 0, "EUR"), `${signedPercent(summary.actual_savings_pct || 0)} of income baseline`)}
      ${transactionMetric("Structural Overspending", formatWholeCurrency(summary.structural_overspending_eur || 0, "EUR"), "above modeled expense ceilings")}
      ${transactionMetric("Expense Ratio", formatPercent(summary.actual_expense_pct || 0), "actual spending / income baseline")}
    </section>
    <section class="planning-target-grid">
      ${panel("Capital Targets", yearlyTargetsTable(rows), "full")}
    </section>
    ${yearlyTargetDetailsPanel(rows)}
  `;
}

function planningTargetRows(planning = {}) {
  const yearlyRows = applyYearlyTargetOverrides(planning.yearly_targets || []);
  const monthlyRows = applyMonthlyTargetOverrides(
    applyYearlyTargetOverridesToMonthlyTargets(
      planning.monthly_targets || [],
      planning.yearly_targets || [],
    ),
  );
  if (!monthlyRows.length) return yearlyRows;
  const monthlyAggregates = aggregateMonthlyTargetRowsByYear(monthlyRows);
  return yearlyRows.map((row) => {
    if (row.source !== "monthly_targets") return row;
    return monthlyAggregates.get(String(row.year || "")) || row;
  });
}

function aggregateMonthlyTargetRowsByYear(rows = []) {
  const groups = rows.reduce((yearRows, row) => {
    const year = String(row.month || "").slice(0, 4);
    if (!year) return yearRows;
    if (!yearRows.has(year)) yearRows.set(year, []);
    yearRows.get(year).push(row);
    return yearRows;
  }, new Map());
  return new Map(
    Array.from(groups.entries()).map(([year, yearRows]) => [
      year,
      yearlyTargetFromMonthlyTargetRows(year, yearRows),
    ]),
  );
}

function yearlyTargetFromMonthlyTargetRows(year, rows = []) {
  const income = rows.reduce((sum, row) => sum + numericValue(row.income_target_eur), 0);
  const expenseCeiling = rows.reduce((sum, row) => sum + numericValue(row.expense_ceiling_eur), 0);
  const targetSavings = rows.reduce((sum, row) => sum + numericValue(row.savings_target_eur), 0);
  const actualExpenses = rows.reduce((sum, row) => sum + numericValue(row.actual_expense_eur), 0);
  const structuralOverspending = rows.reduce((sum, row) => sum + numericValue(row.structural_overspending_eur), 0);
  const actualSavings = moneyRound(income - actualExpenses);
  return {
    year: Number(year),
    source: "monthly_targets",
    income_target_label: "Monthly target model",
    income_baseline_eur: moneyRound(income),
    expense_ceiling_eur: moneyRound(expenseCeiling),
    target_savings_eur: moneyRound(targetSavings),
    actual_expenses_eur: moneyRound(actualExpenses),
    actual_savings_eur: actualSavings,
    structural_overspending_eur: moneyRound(structuralOverspending),
    expense_target_pct: income ? moneyRound(percentOf(expenseCeiling, income)) : 0,
    savings_target_pct: income ? moneyRound(percentOf(targetSavings, income)) : 0,
    actual_expense_pct: income ? moneyRound(percentOf(actualExpenses, income)) : 0,
    actual_savings_pct: income ? moneyRound(percentOf(actualSavings, income)) : 0,
    status: structuralOverspending > 0 ? "above_ceiling" : "on_target",
  };
}

function yearlyTargetsTable(rows = []) {
  if (!rows.length) return emptyState("No yearly targets available.");
  return `
    <section class="minimal-table-wrap planning-target-table-wrap">
      <table class="minimal-table planning-target-table">
        <thead>
          <tr>
            <th>Year</th>
            <th class="align-right">Income Baseline</th>
            <th class="align-right">Expense Ceiling</th>
            <th class="align-right">Target Savings</th>
            <th class="align-right">Actual Expenses</th>
            <th class="align-right">Actual Savings</th>
            <th class="align-right">Structural Overspending</th>
          </tr>
        </thead>
        <tbody>
          ${rows.map((row) => `
            <tr class="clickable-row ${String(state.selectedYearlyTargetYear) === String(row.year) ? "is-selected" : ""}" data-action="open-yearly-target" data-yearly-target-year="${safe(row.year)}" tabindex="0">
              <td>
                <span class="target-period-cell">
                  <span class="table-main">${safe(row.year)}</span>
                  ${yearlyTargetProgressBar(row)}
                </span>
              </td>
              <td class="align-right">
                <span class="table-main">${safe(formatWholeCurrency(row.income_baseline_eur || 0, "EUR"))}</span>
                <span class="table-sub">${safe(row.income_target_label || "Income baseline")}</span>
              </td>
              <td class="align-right">
                <span class="table-main">${safe(formatWholeCurrency(row.expense_ceiling_eur || 0, "EUR"))}</span>
                <span class="table-sub">${safe(formatPercent(row.expense_target_pct || 0))}</span>
              </td>
              <td class="align-right">
                <span class="table-main">${safe(formatWholeCurrency(row.target_savings_eur || 0, "EUR"))}</span>
                <span class="table-sub">${safe(formatPercent(row.savings_target_pct || 0))}</span>
              </td>
              <td class="align-right">
                <span class="table-main">${safe(formatWholeCurrency(row.actual_expenses_eur || 0, "EUR"))}</span>
                <span class="table-sub">${safe(formatPercent(row.actual_expense_pct || 0))}</span>
              </td>
              <td class="align-right">
                <span class="table-main ${signedClass(row.actual_savings_eur)}">${safe(signedWholeAmount(row.actual_savings_eur || 0, "EUR"))}</span>
                <span class="table-sub">${safe(signedPercent(row.actual_savings_pct || 0))}</span>
              </td>
              <td class="align-right">
                <span class="table-main ${numericValue(row.structural_overspending_eur) ? "negative" : ""}">${safe(formatWholeCurrency(row.structural_overspending_eur || 0, "EUR"))}</span>
                <span class="table-sub">${safe(row.status === "above_ceiling" ? "above ceiling" : "on target")}</span>
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </section>
  `;
}

function applyYearlyTargetOverrides(rows = []) {
  return rows.map((row) => {
    if (isYearlyTargetLocked(row)) return normalizeYearlyTargetRow(row, {});
    const year = String(row.year || "");
    const overrides = (state.yearlyTargetOverrides || {})[year] || {};
    const editableOverrides = Object.fromEntries(
      Object.entries(overrides).filter(([key]) => YEARLY_TARGET_EDITABLE_FIELDS.has(key)),
    );
    return normalizeYearlyTargetRow({ ...row, ...editableOverrides }, editableOverrides);
  });
}

function normalizeYearlyTargetRow(row = {}, overrides = {}) {
  const income = numericValue(row.income_baseline_eur);
  const actualExpenses = numericValue(row.actual_expenses_eur);
  const next = { ...row };
  if (!Object.prototype.hasOwnProperty.call(overrides, "expense_ceiling_eur")) {
    next.expense_ceiling_eur = moneyRound(income * numericValue(next.expense_target_pct) / 100);
  } else if (income) {
    next.expense_target_pct = moneyRound(percentOf(next.expense_ceiling_eur, income));
  }
  if (!Object.prototype.hasOwnProperty.call(overrides, "target_savings_eur")) {
    next.target_savings_eur = moneyRound(income * numericValue(next.savings_target_pct) / 100);
  } else if (income) {
    next.savings_target_pct = moneyRound(percentOf(next.target_savings_eur, income));
  }
  next.actual_savings_eur = moneyRound(income - actualExpenses);
  next.actual_expense_pct = income ? moneyRound(percentOf(actualExpenses, income)) : 0;
  next.actual_savings_pct = income ? moneyRound(percentOf(next.actual_savings_eur, income)) : 0;
  next.structural_overspending_eur = moneyRound(Math.max(actualExpenses - numericValue(next.expense_ceiling_eur), 0));
  next.status = numericValue(next.structural_overspending_eur) > 0 ? "above_ceiling" : "on_target";
  if (row.locked) {
    next.structural_overspending_eur = moneyRound(row.structural_overspending_eur || 0);
    next.status = numericValue(next.structural_overspending_eur) > 0 ? "above_ceiling" : "on_target";
  }
  return next;
}

function yearlyTargetsSummary(rows = [], fallback = {}) {
  if (!rows.length) return fallback || {};
  const income = rows.reduce((sum, row) => sum + numericValue(row.income_baseline_eur), 0);
  const targetSavings = rows.reduce((sum, row) => sum + numericValue(row.target_savings_eur), 0);
  const actualSavings = rows.reduce((sum, row) => sum + numericValue(row.actual_savings_eur), 0);
  const actualExpenses = rows.reduce((sum, row) => sum + numericValue(row.actual_expenses_eur), 0);
  const structuralOverspending = rows.reduce((sum, row) => sum + numericValue(row.structural_overspending_eur), 0);
  return {
    ...fallback,
    income_baseline_eur: moneyRound(income),
    target_savings_eur: moneyRound(targetSavings),
    actual_savings_eur: moneyRound(actualSavings),
    actual_expenses_eur: moneyRound(actualExpenses),
    structural_overspending_eur: moneyRound(structuralOverspending),
    target_savings_pct: income ? moneyRound(percentOf(targetSavings, income)) : 0,
    actual_savings_pct: income ? moneyRound(percentOf(actualSavings, income)) : 0,
    actual_expense_pct: income ? moneyRound(percentOf(actualExpenses, income)) : 0,
  };
}

function yearlyTargetDetailsPanel(rows = []) {
  const row = rows.find((entry) => String(entry.year) === String(state.selectedYearlyTargetYear));
  if (!row) return "";
  const locked = isYearlyTargetLocked(row);
  const actions = locked
    ? ""
    : state.targetDetailEditing
    ? `<button class="icon-button" data-action="save-target-detail" type="submit" form="yearly-target-form" ${tooltipAttrs("Save target")}>${icons.check || icons.plus}</button>`
    : `<button class="icon-button" data-action="edit-target-detail" type="button" ${tooltipAttrs("Edit target")}>${icons.edit || icons.settings}</button>`;
  return detailPanel(
    "Target",
    String(row.year),
    !locked && state.targetDetailEditing ? yearlyTargetEditForm(row) : yearlyTargetDetails(row),
    "close-target-detail",
    "Target details",
    actions,
  );
}

function yearlyTargetDetails(row = {}) {
  return `
    <dl>
      ${detailItem("Income Baseline", formatWholeCurrency(row.income_baseline_eur || 0, "EUR"))}
      ${detailItem("Expense Ceiling", `${formatWholeCurrency(row.expense_ceiling_eur || 0, "EUR")} · ${formatPercent(row.expense_target_pct || 0)}`)}
      ${detailItem("Savings Target", `${formatWholeCurrency(row.target_savings_eur || 0, "EUR")} · ${formatPercent(row.savings_target_pct || 0)}`)}
      ${detailItem("Actual Expenses", `${formatWholeCurrency(row.actual_expenses_eur || 0, "EUR")} · ${formatPercent(row.actual_expense_pct || 0)}`)}
      ${detailItem("Actual Savings", `${signedWholeAmount(row.actual_savings_eur || 0, "EUR")} · ${signedPercent(row.actual_savings_pct || 0)}`)}
      ${detailItem("Structural Overspending", formatWholeCurrency(row.structural_overspending_eur || 0, "EUR"))}
    </dl>
  `;
}

function yearlyTargetEditForm(row = {}) {
  return `
    <form class="drawer-form" id="yearly-target-form" data-yearly-target-edit-form>
      ${targetEditInput("Income Baseline", "yearly", row.year, "income_baseline_eur", row.income_baseline_eur, "EUR")}
      ${targetEditInput("Expense Ceiling", "yearly", row.year, "expense_ceiling_eur", row.expense_ceiling_eur, "EUR")}
      ${targetEditInput("Expense Target", "yearly", row.year, "expense_target_pct", row.expense_target_pct, "%")}
      ${targetEditInput("Savings Target", "yearly", row.year, "savings_target_pct", row.savings_target_pct, "%")}
      <p class="drawer-note">Changes update Planning and Transactions targets until the data is refreshed.</p>
    </form>
  `;
}

function defaultPortfolioInstrumentValues() {
  return {
    portfolio_id: "p1",
    portfolio_name: "Portfolio 1",
    provider: "IBKR",
    base_currency: "EUR",
    asset_bucket: "core_liquid_market",
    asset_name: "New Portfolio Instrument",
    ticker: "NEW",
    exchange: "Internal",
    asset_class: "ETF",
    isin: "",
    notes: "",
    current_value_native: 0,
    current_value_currency: "EUR",
    current_value_eur: 0,
    target_allocation_pct: 0,
    expected_cagr_pct: 5,
    total_fees_pct: 0,
    achieved_pl_native: 0,
    achieved_return_pct: 0,
    fees_paid_native: 0,
  };
}

function defaultPortfolioMipValues() {
  return {
    portfolio_id: "p_new",
    portfolio_name: "Portfolio",
    provider: "IBKR",
    start_date: currentDateKey(),
    mip_phase_end_date_target: "2035-12-31",
    portfolio_exit_date: "2050-12-31",
    contribution_type: "mip",
    contribution_role: "self",
    notes: "",
    phase_contributions: {
      ph1: 0,
      ph2: 0,
      ph3: 0,
      ph4: 0,
      ph5: 0,
      ph6: 0,
    },
  };
}

function portfolioDashboard(portfolio = {}) {
  const rawInstruments = currentPortfolioInstrumentRows(portfolio);
  const mipRows = currentPortfolioMipRows(portfolio);
  const queryActive = Boolean(state.query.trim());
  const instruments = filteredPortfolioInstrumentRows(rawInstruments);
  const filteredMipRows = queryActive ? portfolioMipRowsForVisibleInstruments(mipRows, instruments) : mipRows;
  const summary = portfolioSummaryFromRows(portfolio.summary || {}, instruments, filteredMipRows);
  const performance = portfolioPerformanceSummaryFromInstruments(instruments);
  const instrumentLabel = `${formatNumber(summary.instruments || 0)} ${summary.instruments === 1 ? "instrument" : "instruments"}${queryActive ? " shown" : ""}`;
  return `
    <section class="transaction-metrics portfolio-metrics">
      ${transactionMetric("Strategy Value", formatWholeCurrency(summary.current_value_eur || 0, "EUR"), instrumentLabel)}
      ${transactionMetric("Lifetime P/L", signedWholeAmount(performance.profit_loss_eur, "EUR"), `${formatWholeCurrency(performance.cost_base_eur, "EUR")} historical cost`)}
      ${transactionMetric("Historical Return", signedPercent(performance.return_pct), "realized + open vs deployed cost")}
      ${transactionMetric("Monthly Plan", formatWholeCurrency(summary.monthly_contribution_eur || 0, "EUR"), queryActive ? "filtered contribution plan" : "current exit phase")}
    </section>
    ${panel("Portfolio Instruments", portfolioInstrumentTable(instruments), "full", portfolioInstrumentTableActions(instruments))}
    ${portfolioInstrumentDetailsPanel(rawInstruments)}
  `;
}

function portfolioTreemapDashboard(portfolio = {}) {
  const rawInstruments = currentPortfolioInstrumentRows(portfolio);
  const queryActive = Boolean(state.query.trim());
  const instruments = filteredPortfolioInstrumentRows(rawInstruments);
  const mipRows = currentPortfolioMipRows(portfolio);
  const summary = portfolioSummaryFromRows(portfolio.summary || {}, instruments, queryActive ? portfolioMipRowsForVisibleInstruments(mipRows, instruments) : mipRows);
  const performance = portfolioPerformanceSummaryFromInstruments(instruments);
  const items = instruments
    .map((row) => {
      const id = portfolioInstrumentId(row);
      const value = Math.abs(numericValue(row.current_value_eur));
      const label = row.ticker && row.ticker !== "N/A" ? row.ticker : row.asset_name || row.portfolio_name || "Instrument";
      return {
        action: "open-portfolio-instrument",
        dataAttrs: `data-portfolio-instrument-id="${safe(id)}"`,
        detail: [row.asset_name && row.asset_name !== label ? row.asset_name : "", labelize(row.provider), labelize(row.asset_class || row.asset_bucket)].filter(Boolean).join(" · "),
        group: portfolioReferenceLabel(row.portfolio_id || row.portfolio_name || "portfolio"),
        label,
        sublabel: formatWholeCurrency(value, "EUR"),
        value,
      };
    })
    .filter((item) => item.value > 0);
  const largest = items.slice().sort((a, b) => b.value - a.value)[0];
  return `
    <section class="transaction-metrics portfolio-metrics">
      ${transactionMetric("Strategy Value", formatWholeCurrency(summary.current_value_eur || 0, "EUR"), `${formatNumber(summary.instruments || 0)} instruments${queryActive ? " shown" : ""}`)}
      ${transactionMetric("Lifetime P/L", signedWholeAmount(performance.profit_loss_eur, "EUR"), `${formatWholeCurrency(performance.cost_base_eur, "EUR")} historical cost`)}
      ${transactionMetric("Largest Tile", largest ? largest.label : "-", largest ? largest.sublabel : "no current value")}
      ${transactionMetric("Monthly Plan", formatWholeCurrency(summary.monthly_contribution_eur || 0, "EUR"), queryActive ? "filtered contribution plan" : "current exit phase")}
    </section>
	    ${treemapSection(
	      items,
	      {
	        ariaLabel: "Portfolio instrument allocation treemap",
	        emptyLabel: "No positive portfolio instrument values are available.",
	        metricLabel: "instruments",
	        totalLabel: "Shown strategy value",
	      },
	    )}
    ${portfolioInstrumentDetailsPanel(rawInstruments)}
  `;
}

function portfolioPortfolioPerformanceDashboard(portfolio = {}) {
  const performance = portfolio.performance || {};
  const rows = portfolioPerformanceByPortfolioRows(portfolio);
  const summary = portfolioPerformanceByPortfolioSummary(rows);
  const queryActive = Boolean(state.query.trim());
  return `
    <section class="transaction-metrics portfolio-metrics">
      ${transactionMetric("Current Value", formatWholeCurrency(summary.current_value_eur || 0, "EUR"), `${formatNumber(summary.portfolios || 0)} ${summary.portfolios === 1 ? "portfolio" : "portfolios"}${queryActive ? " shown" : ""}`)}
      ${transactionMetric("Historical Cost", formatWholeCurrency(summary.cost_base_eur || 0, "EUR"), "deployed cost basis")}
      ${transactionMetric("Lifetime P/L", signedWholeAmount(summary.profit_loss_eur || 0, "EUR"), `${signedPercent(summary.return_pct || 0)} historical return`)}
      ${transactionMetric("Monthly Plan", formatWholeCurrency(summary.monthly_contribution_eur || 0, "EUR"), queryActive ? "filtered contribution plan" : "current exit phase")}
    </section>
    <section class="reports-chart-grid portfolio-chart-grid">
      ${chartPanel(portfolioInvestmentReturnPathChart(performance, rows, { chartId: "portfolio-investment-return-path" }))}
      ${chartPanel(portfolioInvestmentValuePathChart(performance, rows, { chartId: "portfolio-investment-value-path" }))}
    </section>
    ${panel("Portfolio Performance", portfolioPortfolioPerformanceTable(rows), "full")}
    ${portfolioPerformanceExpandedChart(portfolio)}
  `;
}

function portfolioPerformanceDashboard(portfolio = {}) {
  const performance = portfolio.performance || {};
  const rows = filteredPortfolioPerformanceRows(performance.portfolios || [], portfolio);
  const summary = portfolioPerformanceSummary(rows, performance.summary || {});
  const monthlyRows = portfolioPerformanceMonthlyRows(performance, rows, summary);
  const windowedMonthlyRows = portfolioPerformanceVisibleMonthlyRows(monthlyRows);
  const queryActive = Boolean(state.query.trim());
  return `
    <section class="transaction-metrics portfolio-performance-metrics">
      ${transactionMetric("Paid In", formatWholeCurrency(summary.contributed_eur || 0, "EUR"), queryActive ? "filtered paid-in capital" : "reported paid-in capital")}
      ${transactionMetric("Current Value", formatWholeCurrency(summary.current_value_eur || 0, "EUR"), `${formatNumber(rows.length)} portfolios`)}
      ${transactionMetric("Achieved", signedWholeAmount(summary.achieved_pl_eur || 0, "EUR"), `${signedPercent(summary.achieved_return_pct || 0)} vs paid in`)}
      ${transactionMetric("Plan Completion", formatPercent(summary.plan_completion_pct || 0), `${signedWholeAmount(summary.contribution_gap_eur || 0, "EUR")} funding gap vs plan to date`)}
    </section>
    <section class="reports-chart-grid portfolio-chart-grid">
      ${chartPanel(portfolioCumulativeContributionChart(windowedMonthlyRows, { chartId: "portfolio-cumulative-contributions" }))}
      ${chartPanel(portfolioMonthlyContributionChart(windowedMonthlyRows, { chartId: "portfolio-monthly-plan" }))}
    </section>
    <section class="planning-target-grid portfolio-performance-grid">
      ${panel("Portfolio Funding", portfolioPerformanceTable(rows, portfolio), "full")}
    </section>
    ${portfolioFundingExpandedChart(portfolio)}
  `;
}

function portfolioReturnsDashboard(portfolio = {}, data = {}) {
  if (state.loading.portfolioReturns && !state.portfolioReturns) {
    return loadingState("Loading trade returns");
  }
  if (state.error.portfolioReturns && !state.portfolioReturns) {
    return errorState("Trade returns", state.error.portfolioReturns);
  }
  const insights = portfolioReturnsInsights(data);
  const tables = portfolioReturnsTables(data);
  const summary = portfolioReturnsSummary(insights, portfolio);
  return `
    ${portfolioReturnsActions()}
    <section class="transaction-metrics portfolio-return-metrics">
      ${transactionMetric("Total P/L", signedWholeAmount(summary.total_pl_eur || 0, "EUR"), `${signedPercent(summary.total_return_pct || 0)} on trade capital`)}
      ${transactionMetric("Realized P/L", signedWholeAmount(summary.realized_pl_eur || 0, "EUR"), `${signedPercent(summary.realized_pl_pct || 0)} closed return`)}
      ${transactionMetric("Unrealized P/L", signedWholeAmount(summary.unrealized_pl_eur || 0, "EUR"), `${signedPercent(summary.unrealized_pl_pct || 0)} active return`)}
      ${transactionMetric("Active Market Value", formatWholeCurrency(summary.market_value_eur || 0, "EUR"), `${formatNumber(summary.active_positions || 0)} active positions`)}
    </section>
    <section class="reports-chart-grid portfolio-chart-grid portfolio-return-chart-grid">
      ${chartPanel(portfolioReturnTimelineChart(data, { chartId: "portfolio-return-timeline" }))}
      ${chartPanel(portfolioReturnMonthlyChart(data, { chartId: "portfolio-return-monthly" }))}
    </section>
    <section class="insight-panel-grid portfolio-return-grid">
      ${panel("Active Exposure", portfolioReturnsActiveExposureBars(data))}
      ${panel("Cost & Fees", portfolioReturnsCapitalBars(data))}
      ${panel("Year Performance", tradePerformanceBars(tables.performance_by_year || [], "period"))}
    </section>
    ${portfolioReturnsExpandedChart(portfolio, data)}
  `;
}

function portfolioReturnsActions() {
  const refreshingPrices = Boolean(state.tradePriceRefresh?.loading);
  return `
    <div class="selection-inline" aria-live="polite">
      ${tradePriceRefreshNotice()}
      <button class="table-action-button" data-action="refresh-trade-prices" type="button" ${refreshingPrices ? "disabled" : ""}>
        <span data-icon="refresh"></span>
        <span>${refreshingPrices ? "Refreshing Prices" : "Refresh Prices"}</span>
      </button>
    </div>
  `;
}

function portfolioFundingExpandedChart(portfolio = {}) {
  const chartId = state.expandedChartId || "";
  if (!chartId || state.view !== "portfolio" || state.portfolioView !== "performance") return "";
  const performance = portfolio.performance || {};
  const rows = filteredPortfolioPerformanceRows(performance.portfolios || [], portfolio);
  const summary = portfolioPerformanceSummary(rows, performance.summary || {});
  const monthlyRows = portfolioPerformanceVisibleMonthlyRows(portfolioPerformanceMonthlyRows(performance, rows, summary));
  if (chartId === "portfolio-cumulative-contributions") {
    return expandedChartShell(
      "Cumulative Contributions",
      portfolioCumulativeContributionChart(monthlyRows, { chartId, expanded: true }),
    );
  }
  if (chartId === "portfolio-monthly-plan") {
    return expandedChartShell(
      "Monthly Funding Progress",
      portfolioMonthlyContributionChart(monthlyRows, { chartId, expanded: true }),
    );
  }
  return "";
}

function portfolioPerformanceExpandedChart(portfolio = {}) {
  const chartId = state.expandedChartId || "";
  if (!chartId || state.view !== "portfolio" || state.portfolioView !== "portfolio-performance") return "";
  const performance = portfolio.performance || {};
  const rows = portfolioPerformanceByPortfolioRows(portfolio);
  if (chartId === "portfolio-investment-return-path") {
    return expandedChartShell(
      "Investment Return Over Time",
      portfolioInvestmentReturnPathChart(performance, rows, { chartId, expanded: true }),
    );
  }
  if (chartId === "portfolio-investment-value-path") {
    return expandedChartShell(
      "Investment Value Path",
      portfolioInvestmentValuePathChart(performance, rows, { chartId, expanded: true }),
    );
  }
  return "";
}

function portfolioReturnsExpandedChart(portfolio = {}, data = {}) {
  const chartId = state.expandedChartId || "";
  if (!chartId || state.view !== "trades" || state.tradeView !== "returns") return "";
  if (chartId === "portfolio-return-timeline") {
    return expandedChartShell(
      "Realized P/L Over Time",
      portfolioReturnTimelineChart(data, { chartId, expanded: true }),
    );
  }
  if (chartId === "portfolio-return-monthly") {
    return expandedChartShell(
      "Monthly Realized P/L",
      portfolioReturnMonthlyChart(data, { chartId, expanded: true }),
    );
  }
  return "";
}

function portfolioReturnsInsights(data = {}) {
  return data?.insights || data?.summary || {};
}

function portfolioReturnsTables(data = {}) {
  return data?.insight_tables || {};
}

function portfolioReturnsSummary(insights = {}, portfolio = {}) {
  const realized = currencyRowsTotal(insights.realized_pl_by_currency) || numericValue(insights.realized_pl_eur);
  const unrealized = currencyRowsTotal(insights.unrealized_pl_by_currency) || numericValue(insights.unrealized_pl_eur);
  const marketValue = currencyRowsTotal(insights.market_value_by_currency) || numericValue(portfolio?.performance?.summary?.current_value_eur);
  const activeCost = numericValue(insights.active_cost_basis_eur);
  const closedCost = numericValue(insights.closed_cost_basis_eur);
  const totalCost = activeCost + closedCost;
  return {
    active_positions: numericValue(insights.active_positions),
    market_value_eur: moneyRound(marketValue),
    realized_pl_eur: moneyRound(realized),
    unrealized_pl_eur: moneyRound(unrealized),
    total_pl_eur: moneyRound(realized + unrealized),
    realized_pl_pct: numericValue(insights.realized_pl_pct),
    unrealized_pl_pct: numericValue(insights.unrealized_pl_pct),
    total_return_pct: totalCost ? moneyRound(percentOf(realized + unrealized, totalCost)) : 0,
  };
}

function portfolioReturnsActiveExposureBars(data = {}) {
  const insights = portfolioReturnsInsights(data);
  const activeRows = (data?.rows || []).filter((row) => String(row.position_status || "").toLowerCase() === "active");
  const buckets = new Map();
  activeRows.forEach((row) => {
    const marketValue = Math.abs(numericValue(row.current_market_value_native));
    if (!marketValue) return;
    const symbol = row.symbol || "";
    const label = symbol || row.asset_name || row.trade_id || "Position";
    const portfolioId = row.portfolio_id || "";
    const providerId = row.provider_id || "";
    const currency = row.trade_currency || "EUR";
    const key = [label, portfolioId, providerId, currency].join("|");
    const bucket = buckets.get(key) || {
      symbol,
      label,
      portfolioId,
      providerId,
      currency,
      marketValue: 0,
      unrealized: 0,
      rows: 0,
    };
    bucket.marketValue += marketValue;
    bucket.unrealized += numericValue(row.unrealized_pl_native);
    bucket.rows += 1;
    buckets.set(key, bucket);
  });
  const exposureRows = Array.from(buckets.values()).sort((a, b) => b.marketValue - a.marketValue);
  const marketTotal = currencyRowsTotal(insights.market_value_by_currency)
    || exposureRows.reduce((sum, row) => sum + Math.abs(numericValue(row.marketValue)), 0);
  return insightBars(
    exposureRows.map((row) => {
      const costBasis = row.marketValue - row.unrealized;
      const returnPct = costBasis ? percentOf(row.unrealized, costBasis) : 0;
      const details = [
        row.providerId || "",
        displayPortfolioId(row.portfolioId),
        `${signedWholeAmount(row.unrealized, row.currency)} unrealized`,
        signedPercent(returnPct),
      ].filter(Boolean);
      const attrs = ['data-position-status="active"'];
      if (row.symbol) attrs.push(`data-symbol="${safe(row.symbol)}"`);
      return {
        label: row.label,
        value: formatWholeCurrency(row.marketValue, row.currency),
        detail: details.join(" · "),
        icon: row.unrealized >= 0 ? "trendUp" : "trendDown",
        share: percentOf(row.marketValue, marketTotal),
        action: "filter-trades",
        dataAttrs: attrs.join(" "),
      };
    }),
    "No active exposure available.",
  );
}

function portfolioReturnsCompositionBars(data = {}) {
  const insights = portfolioReturnsInsights(data);
  const summary = portfolioReturnsSummary(insights);
  const activeCost = numericValue(insights.active_cost_basis_eur);
  const closedCost = numericValue(insights.closed_cost_basis_eur);
  const totalFees = portfolioReturnsFeeTotal(data);
  const total = [
    summary.realized_pl_eur,
    summary.unrealized_pl_eur,
    summary.market_value_eur,
    totalFees,
  ].reduce((sum, value) => sum + Math.abs(numericValue(value)), 0);
  const items = [
    {
      label: "Realized P/L",
      value: signedWholeAmount(summary.realized_pl_eur, "EUR"),
      detail: `${formatWholeCurrency(closedCost, "EUR")} closed cost · ${signedPercent(summary.realized_pl_pct)} closed return`,
      icon: summary.realized_pl_eur >= 0 ? "trendUp" : "trendDown",
      share: percentOf(Math.abs(summary.realized_pl_eur), total),
      action: "filter-trades",
      dataAttrs: 'data-position-status="closed"',
    },
    {
      label: "Unrealized P/L",
      value: signedWholeAmount(summary.unrealized_pl_eur, "EUR"),
      detail: `${formatWholeCurrency(activeCost, "EUR")} active cost · ${signedPercent(summary.unrealized_pl_pct)} active return`,
      icon: summary.unrealized_pl_eur >= 0 ? "trendUp" : "trendDown",
      share: percentOf(Math.abs(summary.unrealized_pl_eur), total),
      action: "filter-trades",
      dataAttrs: 'data-position-status="active"',
    },
    {
      label: "Active Market Value",
      value: formatWholeCurrency(summary.market_value_eur, "EUR"),
      detail: `${formatNumber(summary.active_positions || 0)} active positions`,
      icon: "wallet",
      share: percentOf(summary.market_value_eur, total),
      action: "filter-trades",
      dataAttrs: 'data-position-status="active"',
    },
    {
      label: "Fees Paid",
      value: signedWholeAmount(-totalFees, "EUR"),
      detail: "reported trade fees",
      icon: "receipt",
      share: percentOf(totalFees, total),
    },
  ].filter((item) => Math.abs(numericValue(item.share)) || item.label === "Fees Paid");
  return insightBars(items, "No return composition available.");
}

function portfolioReturnsCapitalBars(data = {}) {
  const insights = portfolioReturnsInsights(data);
  const summary = portfolioReturnsSummary(insights);
  const activeCost = numericValue(insights.active_cost_basis_eur);
  const closedCost = numericValue(insights.closed_cost_basis_eur);
  const totalFees = portfolioReturnsFeeTotal(data);
  const total = Math.abs(activeCost) + Math.abs(closedCost) + Math.abs(summary.market_value_eur) + Math.abs(totalFees);
  return insightBars([
    {
      label: "Closed Cost",
      value: formatWholeCurrency(closedCost, "EUR"),
      detail: `${signedPercent(summary.realized_pl_pct || 0)} realized return`,
      icon: "receipt",
      share: percentOf(closedCost, total),
      action: "filter-trades",
      dataAttrs: 'data-position-status="closed"',
    },
    {
      label: "Active Cost",
      value: formatWholeCurrency(activeCost, "EUR"),
      detail: `${signedPercent(summary.unrealized_pl_pct || 0)} active return`,
      icon: "wallet",
      share: percentOf(activeCost, total),
      action: "filter-trades",
      dataAttrs: 'data-position-status="active"',
    },
    {
      label: "Active Market Value",
      value: formatWholeCurrency(summary.market_value_eur, "EUR"),
      detail: `${formatNumber(summary.active_positions || 0)} active positions`,
      icon: "trendUp",
      share: percentOf(summary.market_value_eur, total),
      action: "filter-trades",
      dataAttrs: 'data-position-status="active"',
    },
    {
      label: "Fees Paid",
      value: signedWholeAmount(-totalFees, "EUR"),
      detail: "reported trade fees",
      icon: "receipt",
      share: percentOf(totalFees, total),
    },
  ], "No cost basis available.");
}

function portfolioReturnsFeeTotal(data = {}) {
  const tables = portfolioReturnsTables(data);
  const periodRows = [
    ...(tables.performance_by_year || []),
    ...(tables.performance_by_month || []),
  ];
  const preferredRows = tables.performance_by_year?.length ? tables.performance_by_year : periodRows;
  const tableFees = preferredRows.reduce((sum, row) => sum + numericValue(row.fees_eur), 0);
  if (tableFees) return tableFees;
  return (data?.rows || []).reduce((sum, row) => sum + numericValue(row.fees_native), 0);
}

function normalizedPortfolioReturnsWindow() {
  const selected = String(state.portfolioReturnsWindow || "all");
  return monthlyTrendHistoryOptions().some((option) => option.value === selected) ? selected : "3";
}

function portfolioReturnsWindowSelector() {
  return reportChartSelector(
    "trade-returns-window",
    "portfolioReturnsWindow",
    normalizedPortfolioReturnsWindow(),
    monthlyTrendHistoryOptions(),
    "Trade returns period",
  );
}

function portfolioReturnsVisibleRows(rows = []) {
  const sorted = [...rows].sort((a, b) => String(a.period || a.month || "").localeCompare(String(b.period || b.month || "")));
  const monthCount = reportHistoryMonthCount(normalizedPortfolioReturnsWindow());
  return monthCount === Infinity ? sorted : sorted.slice(-monthCount);
}

function portfolioReturnTimelineRows(data = {}) {
  const splitRows = portfolioReturnSplitRows(data);
  if (splitRows.length) {
    return portfolioReturnsVisibleRows(splitRows).map((row) => ({
      month: row.period,
      pl_eur: moneyRound(numericValue(row.realized_eur) + numericValue(row.unrealized_eur)),
      trades: numericValue(row.trades),
      fees_eur: numericValue(row.fees_eur),
      return_pct: 0,
    }));
  }
  const performanceRows = portfolioReturnsTables(data).performance_by_month || [];
  if (performanceRows.length) {
    return portfolioReturnsVisibleRows(performanceRows).map((row) => ({
      month: row.period,
      pl_eur: numericValue(row.pl_eur),
      trades: numericValue(row.trades),
      fees_eur: numericValue(row.fees_eur),
      return_pct: numericValue(row.return_pct),
    }));
  }
  return [];
}

function portfolioReturnTimelineChart(data = {}, options = {}) {
  const expanded = Boolean(options.expanded);
  const chartId = options.chartId || "";
  const rows = portfolioReturnTimelineRows(data);
  if (rows.length < 2) return emptyState("Return history needs at least two months.");
  let cumulative = 0;
  const points = rows.map((row) => {
    cumulative += numericValue(row.pl_eur);
    return {
      label: row.month,
      value: moneyRound(cumulative),
      monthly_pl_eur: numericValue(row.pl_eur),
      trades: numericValue(row.trades),
      fees_eur: numericValue(row.fees_eur),
      return_pct: numericValue(row.return_pct),
    };
  });
  const last = points[points.length - 1];
  const totalTrades = rows.reduce((sum, row) => sum + numericValue(row.trades), 0);
  const totalFees = rows.reduce((sum, row) => sum + numericValue(row.fees_eur), 0);
  const domain = zeroBaselineDomain(points.map((point) => point.value));
  if (!expanded) {
    return compactChartCard({
      chartId,
      expandLabel: "Expand realized P/L over time",
      icon: "trendUp",
      label: "Realized P/L Over Time",
      value: signedWholeAmount(last.value || 0, "EUR"),
      meta: `${formatNumber(totalTrades)} closed trades · cumulative realized P/L`,
      chartPoints: points,
      chart: {
        ariaLabel: "Trade profit and loss over time",
        className: "realized",
        tooltipFormatter: portfolioReturnTimelineTooltip,
        ...domain,
      },
      periodControl: {
        action: "trade-returns-window",
        dataKey: "portfolioReturnsWindow",
        selectedValue: normalizedPortfolioReturnsWindow(),
        options: monthlyTrendHistoryOptions(),
        ariaLabel: "P/L period",
      },
      metrics: [
        { value: signedWholeAmount(last.monthly_pl_eur || 0, "EUR"), label: "latest month" },
        { value: formatWholeCurrency(totalFees, "EUR"), label: "fees" },
      ],
      note: `${monthLabel(points[0].label)} - ${monthLabel(last.label)}`,
    });
  }
  return `
    <div class="report-chart-summary">
      <div class="report-chart-summary-main">
        <span>${safe(monthLabel(points[0].label))} - ${safe(monthLabel(last.label))}</span>
        <strong>${signedWholeAmount(last.value || 0, "EUR")}</strong>
        <em>${formatNumber(totalTrades)} closed trades · cumulative realized P/L</em>
      </div>
      ${portfolioReturnsWindowSelector()}
    </div>
    ${chartDetailGrid([
      { label: "Cumulative Realized", value: signedWholeAmount(last.value || 0, "EUR"), detail: "closed trades by exit month" },
      { label: "Latest Month", value: signedWholeAmount(last.monthly_pl_eur || 0, "EUR"), detail: monthLabel(last.label) },
      { label: "Trades", value: formatNumber(totalTrades), detail: "rows in selected period" },
      { label: "Fees", value: formatWholeCurrency(totalFees, "EUR"), detail: "reported trade fees" },
    ])}
    ${standardLineChartWithControls({
      ariaLabel: "Trade profit and loss over time",
      className: "portfolio-return-chart expanded-chart",
      currency: "EUR",
      height: 420,
      labelIndexes: standardChartLabelIndexes(points.length, 4),
      padding: { top: 18, right: 18, bottom: 38, left: 70 },
      series: [
        { id: "realized", label: "Realized P/L", points },
      ],
      showLastDot: true,
      tickCount: 4,
      tooltipFormatter: portfolioReturnTimelineTooltip,
      width: 1120,
      xLabelFormatter: shortMonthLabel,
      ...domain,
    }, {
      chartId,
      note: "closed trades by exit month; current unrealized is shown separately",
      ariaLabel: "Realized P/L chart lines",
    })}
  `;
}

function portfolioReturnTimelineTooltip(point = {}) {
  return [
    monthLabel(point.label || ""),
    `Cumulative: ${signedWholeAmount(point.value || 0, "EUR")}`,
    `Month P/L: ${signedWholeAmount(point.monthly_pl_eur || 0, "EUR")}`,
    `${formatNumber(point.trades || 0)} trades · ${formatWholeCurrency(point.fees_eur || 0, "EUR")} fees`,
  ].join("\n");
}

function portfolioReturnMonthlyChart(data = {}, options = {}) {
  const expanded = Boolean(options.expanded);
  const chartId = options.chartId || "";
  const rows = portfolioReturnTimelineRows(data);
  if (rows.length < 2) return emptyState("Monthly return history needs at least two months.");
  const points = rows.map((row) => ({
    label: row.month,
    value: numericValue(row.pl_eur),
    trades: numericValue(row.trades),
    fees_eur: numericValue(row.fees_eur),
    return_pct: numericValue(row.return_pct),
  }));
  const last = points[points.length - 1];
  const totalPl = points.reduce((sum, point) => sum + numericValue(point.value), 0);
  const nonZeroMonths = points.filter((point) => numericValue(point.value)).length;
  const positiveMonths = points.filter((point) => numericValue(point.value) > 0).length;
  const negativeMonths = points.filter((point) => numericValue(point.value) < 0).length;
  const totalTrades = rows.reduce((sum, row) => sum + numericValue(row.trades), 0);
  const totalFees = rows.reduce((sum, row) => sum + numericValue(row.fees_eur), 0);
  const domain = zeroBaselineDomain(points.map((point) => point.value));
  if (!expanded) {
    return compactChartCard({
      chartId,
      expandLabel: "Expand monthly realized P/L",
      icon: "trendUp",
      label: "Monthly Realized P/L",
      value: signedWholeAmount(last.value || 0, "EUR"),
      meta: `${formatNumber(nonZeroMonths)} active months · last closed month`,
      chartPoints: points,
      chart: {
        ariaLabel: "Monthly realized trade profit and loss",
        className: "monthly-realized",
        showPoints: true,
        tooltipFormatter: portfolioReturnMonthlyTooltip,
        ...domain,
      },
      periodControl: {
        action: "trade-returns-window",
        dataKey: "portfolioReturnsWindow",
        selectedValue: normalizedPortfolioReturnsWindow(),
        options: monthlyTrendHistoryOptions(),
        ariaLabel: "Monthly P/L period",
      },
      metrics: [
        { value: signedWholeAmount(totalPl || 0, "EUR"), label: "cumulative" },
        { value: formatWholeCurrency(totalFees, "EUR"), label: "fees" },
      ],
      note: `${monthLabel(points[0].label)} - ${monthLabel(last.label)}`,
    });
  }
  return `
    <div class="report-chart-summary">
      <div class="report-chart-summary-main">
        <span>${safe(monthLabel(points[0].label))} - ${safe(monthLabel(last.label))}</span>
        <strong>${signedWholeAmount(last.value || 0, "EUR")}</strong>
        <em>${formatNumber(nonZeroMonths)} active months · last closed month</em>
      </div>
      ${portfolioReturnsWindowSelector()}
    </div>
    ${chartDetailGrid([
      { label: "Cumulative Realized", value: signedWholeAmount(totalPl || 0, "EUR"), detail: `${formatNumber(totalTrades)} closed trades` },
      { label: "Latest Closed Month", value: signedWholeAmount(last.value || 0, "EUR"), detail: monthLabel(last.label) },
      { label: "Positive Months", value: formatNumber(positiveMonths), detail: `${formatNumber(negativeMonths)} negative months` },
      { label: "Fees", value: formatWholeCurrency(totalFees, "EUR"), detail: "reported trade fees" },
    ])}
    ${standardLineChartWithControls({
      ariaLabel: "Monthly realized trade profit and loss",
      className: "portfolio-return-chart expanded-chart",
      currency: "EUR",
      height: 420,
      labelIndexes: standardChartLabelIndexes(points.length, 4),
      padding: { top: 18, right: 18, bottom: 38, left: 70 },
      series: [
        { id: "monthly-realized", label: "Monthly P/L", points, showPoints: true },
      ],
      showLastDot: true,
      tickCount: 4,
      tooltipFormatter: portfolioReturnMonthlyTooltip,
      width: 1120,
      xLabelFormatter: shortMonthLabel,
      ...domain,
    }, {
      chartId,
      note: "period result by exit month, not cumulative",
      ariaLabel: "Monthly P/L chart lines",
    })}
  `;
}

function portfolioReturnMonthlyTooltip(point = {}) {
  return [
    monthLabel(point.label || ""),
    `Month P/L: ${signedWholeAmount(point.value || 0, "EUR")}`,
    `${formatNumber(point.trades || 0)} trades · ${formatWholeCurrency(point.fees_eur || 0, "EUR")} fees`,
  ].join("\n");
}

function portfolioReturnSplitRows(data = {}) {
  const rows = data?.rows || [];
  const buckets = new Map();
  rows.forEach((row) => {
    const status = String(row.position_status || "").toLowerCase();
    if (status !== "closed") return;
    const dateValue = row.exit_date || row._sort_date;
    const period = String(dateValue || "").slice(0, 7);
    if (!/^\d{4}-\d{2}$/.test(period)) return;
    const bucket = buckets.get(period) || {
      period,
      realized_eur: 0,
      unrealized_eur: 0,
      fees_eur: 0,
      trades: 0,
    };
    bucket.realized_eur += numericValue(row.realized_pl_native);
    bucket.fees_eur += numericValue(row.fees_native);
    bucket.trades += 1;
    buckets.set(period, bucket);
  });
  const rowsOut = Array.from(buckets.values())
    .sort((a, b) => String(a.period).localeCompare(String(b.period)))
    .map((row) => ({
      ...row,
      realized_eur: moneyRound(row.realized_eur),
      unrealized_eur: moneyRound(row.unrealized_eur),
      fees_eur: moneyRound(row.fees_eur),
    }));
  return completePortfolioReturnMonths(rowsOut);
}

function completePortfolioReturnMonths(rows = []) {
  if (!rows.length) return [];
  const byPeriod = new Map(rows.map((row) => [String(row.period), row]));
  const start = String(rows[0].period || currentMonthKey());
  const end = String(rows[rows.length - 1].period || start);
  const monthTotal = Math.max(0, monthKeyDistance(start, end));
  return Array.from({ length: monthTotal + 1 }, (_, index) => {
    const period = shiftMonthKey(start, index);
    return byPeriod.get(period) || {
      period,
      realized_eur: 0,
      unrealized_eur: 0,
      fees_eur: 0,
      trades: 0,
    };
  });
}

function portfolioReturnSplitChart(data = {}, options = {}) {
  const expanded = Boolean(options.expanded);
  const chartId = options.chartId || "";
  const insights = portfolioReturnsInsights(data);
  const summary = portfolioReturnsSummary(insights);
  const currentUnrealized = numericValue(summary.unrealized_pl_eur);
  const totalPl = numericValue(summary.total_pl_eur);
  if (!expanded) {
    return portfolioReturnCompositionCard(summary, chartId);
  }
  return `
    <div class="report-chart-summary">
      <div class="report-chart-summary-main">
        <span>Current P/L split</span>
        <strong>${signedWholeAmount(totalPl || 0, "EUR")}</strong>
        <em>${signedWholeAmount(summary.realized_pl_eur || 0, "EUR")} locked in · ${signedWholeAmount(currentUnrealized, "EUR")} still open</em>
      </div>
    </div>
    ${portfolioReturnCompositionBreakdown(summary)}
  `;
}

function portfolioReturnCompositionCard(summary = {}, chartId = "") {
  const realized = numericValue(summary.realized_pl_eur);
  const unrealized = numericValue(summary.unrealized_pl_eur);
  const totalPl = numericValue(summary.total_pl_eur);
  return `
    <article class="metric-card chart-compact-card return-composition-card">
      <div class="chart-compact-tools">
        ${chartExpandButton(chartId, "Expand P/L composition")}
      </div>
      <div class="metric-card-head">
        <span class="metric-card-icon" aria-hidden="true">${icons.target}</span>
        <span class="metric-card-label">P/L Composition</span>
      </div>
      <strong>${signedWholeAmount(totalPl || 0, "EUR")}</strong>
      <small>${signedWholeAmount(realized, "EUR")} locked in · ${signedWholeAmount(unrealized, "EUR")} still open</small>
      ${portfolioReturnCompositionStrip(summary)}
      ${metricDeltaHtml([
        { value: signedWholeAmount(realized, "EUR"), label: "realized" },
        { value: signedWholeAmount(unrealized, "EUR"), label: "unrealized" },
      ])}
      <p class="composition-note">This is today’s split, not another time-series.</p>
    </article>
  `;
}

function portfolioReturnCompositionBreakdown(summary = {}) {
  const realized = numericValue(summary.realized_pl_eur);
  const unrealized = numericValue(summary.unrealized_pl_eur);
  const totalPl = numericValue(summary.total_pl_eur);
  const totalSplit = Math.abs(realized) + Math.abs(unrealized);
  if (!totalSplit) return emptyState("No P/L split available.");
  const realizedShare = percentOf(Math.abs(realized), totalSplit);
  const unrealizedShare = percentOf(Math.abs(unrealized), totalSplit);
  const splitCards = [
    {
      className: "is-realized",
      label: "Realized P/L",
      value: signedWholeAmount(realized, "EUR"),
      numericValue: realized,
      detail: "Closed positions",
      metaValue: formatPercent(realizedShare),
      footer: `${signedPercent(summary.realized_pl_pct || 0)} closed return`,
    },
    {
      className: "is-unrealized",
      label: "Current Unrealized",
      value: signedWholeAmount(unrealized, "EUR"),
      numericValue: unrealized,
      detail: "Active mark-to-market",
      metaValue: formatPercent(unrealizedShare),
      footer: `${signedPercent(summary.unrealized_pl_pct || 0)} open return`,
    },
    {
      className: "is-market",
      label: "Active Market Value",
      value: formatWholeCurrency(summary.market_value_eur || 0, "EUR"),
      numericValue: numericValue(summary.market_value_eur),
      detail: "Current open-position value",
      metaValue: formatNumber(summary.active_positions || 0),
      footer: `${signedPercent(summary.unrealized_pl_pct || 0)} active return`,
    },
  ];
  return `
    <section class="pl-composition-layout" aria-label="P/L composition">
      <div class="pl-composition-rail">
        <span class="is-realized" style="width:${realizedShare.toFixed(2)}%"></span>
        <span class="is-unrealized" style="width:${unrealizedShare.toFixed(2)}%"></span>
      </div>
      <div class="pl-composition-key">
        <span><i class="is-realized"></i><strong>Realized</strong><b>${formatPercent(realizedShare)}</b></span>
        <span><i class="is-unrealized"></i><strong>Open</strong><b>${formatPercent(unrealizedShare)}</b></span>
      </div>
      <div class="pl-composition-grid">
        ${splitCards.map((item) => `
          <article class="pl-composition-card ${safe(item.className)}">
            <div>
              <span>${safe(item.label)}</span>
              <strong class="${signedClass(item.numericValue)}">${safe(item.value)}</strong>
              <em>${safe(item.detail)}</em>
            </div>
            <div class="pl-composition-card-meta">
              <b>${safe(item.metaValue)}</b>
              <small>${safe(item.footer)}</small>
            </div>
          </article>
        `).join("")}
      </div>
    </section>
  `;
}

function portfolioReturnCompositionStrip(summary = {}) {
  const realized = numericValue(summary.realized_pl_eur);
  const unrealized = numericValue(summary.unrealized_pl_eur);
  const total = Math.abs(realized) + Math.abs(unrealized);
  if (!total) return "";
  return `
    <div class="return-composition-strip" aria-label="P/L composition">
      <span class="is-realized" style="width:${Math.max(2, percentOf(Math.abs(realized), total)).toFixed(2)}%"></span>
      <span class="is-unrealized" style="width:${Math.max(2, percentOf(Math.abs(unrealized), total)).toFixed(2)}%"></span>
    </div>
  `;
}

function portfolioReturnCompositionBars(summary = {}) {
  const realized = numericValue(summary.realized_pl_eur);
  const unrealized = numericValue(summary.unrealized_pl_eur);
  const total = Math.abs(realized) + Math.abs(unrealized);
  return insightBars([
    {
      label: "Realized P/L",
      value: signedWholeAmount(realized, "EUR"),
      detail: "closed positions",
      icon: realized >= 0 ? "trendUp" : "trendDown",
      share: percentOf(Math.abs(realized), total || Math.abs(realized) || 1),
      shareLabel: signedPercent(summary.realized_pl_pct || 0),
    },
    {
      label: "Unrealized P/L",
      value: signedWholeAmount(unrealized, "EUR"),
      detail: "active mark-to-market",
      icon: unrealized >= 0 ? "trendUp" : "trendDown",
      share: percentOf(Math.abs(unrealized), total || Math.abs(unrealized) || 1),
      shareLabel: signedPercent(summary.unrealized_pl_pct || 0),
    },
  ], "No P/L split available.");
}

function zeroBaselineDomain(values = []) {
  const numericValues = values.map((value) => numericValue(value)).filter((value) => Number.isFinite(value));
  const minValue = Math.min(0, ...numericValues);
  const maxValue = Math.max(0, ...numericValues);
  if (minValue === maxValue) {
    return { yMin: 0, yMax: 1 };
  }
  return { yMin: minValue, yMax: maxValue };
}

function filteredPortfolioPerformanceRows(rows = [], portfolio = {}) {
  const normalizedRows = rows.map((row) => ({
    ...row,
    label: portfolioPerformanceLabel(row, rows),
  }));
  return state.query.trim()
    ? filterRows(normalizedRows, ["portfolio_id", "portfolio_name", "label", "provider", "contribution_type", "contribution_role"])
    : normalizedRows;
}

function portfolioPerformanceLabel(row = {}, rows = []) {
  return portfolioScopeLabel(row, rows);
}

function portfolioPerformanceSummary(rows = [], fallback = {}) {
  if (!rows.length) return {
    current_value_eur: 0,
    contributed_eur: 0,
    plan_to_date_eur: 0,
    contribution_gap_eur: 0,
    achieved_pl_eur: 0,
    achieved_return_pct: 0,
    plan_completion_pct: 0,
  };
  const currentValue = rows.reduce((sum, row) => sum + numericValue(row.current_value_eur), 0);
  const contributed = rows.reduce((sum, row) => sum + numericValue(row.contributed_eur), 0);
  const planToDate = rows.reduce((sum, row) => sum + numericValue(row.plan_to_date_eur), 0);
  const achieved = currentValue - contributed;
  return {
    ...fallback,
    current_value_eur: moneyRound(currentValue),
    contributed_eur: moneyRound(contributed),
    plan_to_date_eur: moneyRound(planToDate),
    contribution_gap_eur: moneyRound(contributed - planToDate),
    achieved_pl_eur: moneyRound(achieved),
    achieved_return_pct: contributed ? moneyRound(percentOf(achieved, contributed)) : 0,
    plan_completion_pct: planToDate ? moneyRound(percentOf(contributed, planToDate)) : 0,
  };
}

function portfolioPerformanceMonthlyRows(performance = {}, selectedRows = [], summary = {}) {
  const selectedIds = new Set(selectedRows.map((row) => String(row.portfolio_id || "")).filter(Boolean));
  const rows = selectedIds.size
    ? (performance.portfolio_monthly_series || []).filter((row) => selectedIds.has(String(row.portfolio_id || "")))
    : (performance.monthly_series || []);
  if (!selectedIds.size) return reconcilePortfolioFundingRows(rows, summary);
  const byMonth = new Map();
  rows.forEach((row) => {
    const month = row.month;
    if (!month) return;
    const bucket = byMonth.get(month) || {
      month,
      actual_eur: 0,
      planned_eur: 0,
      cumulative_actual_eur: 0,
      cumulative_planned_eur: 0,
    };
    bucket.actual_eur += numericValue(row.actual_eur);
    bucket.planned_eur += numericValue(row.planned_eur);
    byMonth.set(month, bucket);
  });
  let cumulativeActual = 0;
  let cumulativePlanned = 0;
  const monthlyRows = Array.from(byMonth.values())
    .sort((a, b) => String(a.month).localeCompare(String(b.month)))
    .map((row) => {
      cumulativeActual += numericValue(row.actual_eur);
      cumulativePlanned += numericValue(row.planned_eur);
      return {
        ...row,
        cumulative_actual_eur: moneyRound(cumulativeActual),
        cumulative_planned_eur: moneyRound(cumulativePlanned),
      };
    });
  return reconcilePortfolioFundingRows(monthlyRows, summary);
}

function reconcilePortfolioFundingRows(rows = [], summary = {}) {
  const sortedRows = [...rows]
    .filter((row) => row.month)
    .sort((a, b) => String(a.month).localeCompare(String(b.month)));
  if (!sortedRows.length) return [];
  const reportedPaidIn = numericValue(summary.contributed_eur);
  const matchedPaidIn = numericValue(sortedRows[sortedRows.length - 1]?.cumulative_actual_eur);
  const adjustment = moneyRound(reportedPaidIn - matchedPaidIn);
  return sortedRows.map((row, index) => {
    const isLast = index === sortedRows.length - 1;
    const cumulativeMatched = moneyRound(numericValue(row.cumulative_actual_eur));
    const cumulativePaidIn = moneyRound(cumulativeMatched + (isLast ? adjustment : 0));
    return {
      ...row,
      actual_eur: moneyRound(numericValue(row.actual_eur)),
      planned_eur: moneyRound(numericValue(row.planned_eur)),
      cumulative_actual_eur: cumulativeMatched,
      cumulative_matched_eur: cumulativeMatched,
      cumulative_paid_in_eur: cumulativePaidIn,
      cumulative_unlinked_paid_in_eur: isLast ? adjustment : 0,
      cumulative_planned_eur: moneyRound(numericValue(row.cumulative_planned_eur)),
    };
  });
}

function normalizedPortfolioPerformanceWindow() {
  const selected = String(state.portfolioPerformanceWindow || "all");
  return monthlyTrendHistoryOptions().some((option) => option.value === selected) ? selected : "3";
}

function portfolioPerformanceVisibleMonthlyRows(rows = []) {
  const historyWindow = normalizedPortfolioPerformanceWindow();
  const monthCount = reportHistoryMonthCount(historyWindow);
  return monthCount === Infinity ? rows : rows.slice(-monthCount);
}

function portfolioPerformanceWindowSelector() {
  return reportChartSelector(
    "portfolio-performance-window",
    "portfolioPerformanceWindow",
    normalizedPortfolioPerformanceWindow(),
    monthlyTrendHistoryOptions(),
    "Portfolio funding period",
  );
}

function portfolioCumulativeContributionChart(rows = [], options = {}) {
  const expanded = Boolean(options.expanded);
  const chartId = options.chartId || "";
  const points = rows.filter((row) => row.month);
  if (points.length < 2) return emptyState("Contribution history needs at least two months.");
  const last = points[points.length - 1];
  const paidIn = numericValue(last.cumulative_paid_in_eur ?? last.cumulative_actual_eur);
  const matched = numericValue(last.cumulative_matched_eur ?? last.cumulative_actual_eur);
  const unlinked = moneyRound(paidIn - matched);
  const unlinkedJoin = unlinked >= 0 ? "+" : "-";
  const reconciliationLabel = Math.abs(unlinked) >= 1
    ? `${formatWholeCurrency(matched, "EUR")} linked ${unlinkedJoin} ${formatWholeCurrency(Math.abs(unlinked), "EUR")} unlinked`
    : "linked transfers reconcile to paid in";
  const plannedToDate = numericValue(last.cumulative_planned_eur);
  const completion = plannedToDate ? percentOf(paidIn, plannedToDate) : 0;
  if (!expanded) {
    return compactChartCard({
      chartId,
      expandLabel: "Expand cumulative contributions",
      icon: "trendUp",
      label: "Cumulative Contributions",
      value: formatWholeCurrency(paidIn, "EUR"),
      meta: `${formatWholeCurrency(plannedToDate, "EUR")} planned to date`,
      chartPoints: points.map((point) => ({
        label: point.month,
        value: point.cumulative_paid_in_eur ?? point.cumulative_actual_eur,
      })),
      chart: {
        ariaLabel: "Cumulative portfolio contributions",
        className: "actual",
        yMin: 0,
      },
      periodControl: {
        action: "portfolio-performance-window",
        dataKey: "portfolioPerformanceWindow",
        selectedValue: normalizedPortfolioPerformanceWindow(),
        options: monthlyTrendHistoryOptions(),
        ariaLabel: "Funding period",
      },
      metrics: [
        { value: formatPercent(completion), label: "completion" },
        { value: signedWholeAmount(paidIn - plannedToDate, "EUR"), label: "funding gap" },
      ],
      note: `${monthLabel(points[0].month)} - ${monthLabel(last.month)} · ${reconciliationLabel}`,
    });
  }
  return `
    <div class="report-chart-summary">
      <div class="report-chart-summary-main">
        <span>${safe(monthLabel(points[0].month))} - ${safe(monthLabel(last.month))}</span>
        <strong>${formatWholeCurrency(paidIn, "EUR")}</strong>
        <em>${formatWholeCurrency(plannedToDate, "EUR")} planned to date · ${safe(reconciliationLabel)}</em>
      </div>
      ${portfolioPerformanceWindowSelector()}
    </div>
    ${chartDetailGrid([
      { label: "Paid In", value: formatWholeCurrency(paidIn, "EUR"), detail: "matched and reported contributions" },
      { label: "Plan To Date", value: formatWholeCurrency(plannedToDate, "EUR"), detail: "monthly plan through selected period" },
      { label: "Funding Gap", value: signedWholeAmount(paidIn - plannedToDate, "EUR"), detail: "paid in minus plan to date" },
      { label: "Reconciliation", value: formatWholeCurrency(matched, "EUR"), detail: reconciliationLabel },
    ])}
    ${standardLineChartWithControls({
      ariaLabel: "Cumulative portfolio contributions",
      className: "portfolio-contribution-chart expanded-chart",
      currency: "EUR",
      height: 420,
      labelIndexes: standardChartLabelIndexes(points.length, 4),
      padding: { top: 18, right: 18, bottom: 38, left: 70 },
      series: [
        { id: "actual", label: "Paid in", points: points.map((point) => ({ label: point.month, value: point.cumulative_paid_in_eur ?? point.cumulative_actual_eur })) },
        { id: "plan", label: "Planned", points: points.map((point) => ({ label: point.month, value: point.cumulative_planned_eur })) },
      ],
      showLastDot: true,
      tickCount: 4,
      width: 1120,
      xLabelFormatter: shortMonthLabel,
      yMin: 0,
    }, {
      chartId,
      note: "reported paid-in capital vs plan to date",
      ariaLabel: "Portfolio contribution chart lines",
    })}
  `;
}

function portfolioMonthlyContributionChart(rows = [], options = {}) {
  const expanded = Boolean(options.expanded);
  const chartId = options.chartId || "";
  const points = rows.filter((row) => row.month);
  if (points.length < 2) return emptyState("Monthly contribution history needs at least two months.");
  const last = points[points.length - 1];
  const plannedInView = points.reduce((sum, point) => sum + numericValue(point.planned_eur), 0);
  const actualInView = points.reduce((sum, point) => sum + numericValue(point.actual_eur), 0);
  const currentGap = numericValue(last.actual_eur) - numericValue(last.planned_eur);
  if (!expanded) {
    return compactChartCard({
      chartId,
      expandLabel: "Expand monthly funding progress",
      icon: "target",
      label: "Monthly Funding Progress",
      value: formatWholeCurrency(last.actual_eur || 0, "EUR"),
      meta: `${formatWholeCurrency(last.planned_eur || 0, "EUR")} monthly target`,
      chartPoints: points.map((point) => ({
        label: point.month,
        value: point.actual_eur,
      })),
      chart: {
        ariaLabel: "Monthly portfolio contribution performance",
        className: "actual",
        yMin: 0,
      },
      periodControl: {
        action: "portfolio-performance-window",
        dataKey: "portfolioPerformanceWindow",
        selectedValue: normalizedPortfolioPerformanceWindow(),
        options: monthlyTrendHistoryOptions(),
        ariaLabel: "Funding period",
      },
      metrics: [
        { value: signedWholeAmount(currentGap, "EUR"), label: "monthly gap" },
        { value: formatPercent(percentOf(actualInView, plannedInView)), label: "view hit" },
      ],
      note: `${monthLabel(points[0].month)} - ${monthLabel(last.month)} · ${formatWholeCurrency(plannedInView, "EUR")} planned in view`,
    });
  }
  return `
    <div class="report-chart-summary">
      <div class="report-chart-summary-main">
        <span>${safe(monthLabel(points[0].month))} - ${safe(monthLabel(last.month))}</span>
        <strong>${formatWholeCurrency(last.actual_eur || 0, "EUR")}</strong>
        <em>${formatWholeCurrency(last.planned_eur || 0, "EUR")} monthly target · ${formatWholeCurrency(plannedInView, "EUR")} planned in view</em>
      </div>
      ${portfolioPerformanceWindowSelector()}
    </div>
    ${chartDetailGrid([
      { label: "Actual This Month", value: formatWholeCurrency(last.actual_eur || 0, "EUR"), detail: monthLabel(last.month) },
      { label: "Target This Month", value: formatWholeCurrency(last.planned_eur || 0, "EUR"), detail: signedWholeAmount(currentGap, "EUR") + " monthly gap" },
      { label: "Actual In View", value: formatWholeCurrency(actualInView, "EUR"), detail: `${formatPercent(percentOf(actualInView, plannedInView))} of planned` },
      { label: "Planned In View", value: formatWholeCurrency(plannedInView, "EUR"), detail: `${formatNumber(points.length)} months` },
    ])}
    ${portfolioMonthlyContributionBarChart(points, { expanded: true })}
    ${chartLegend([["actual", "Actual"], ["plan", "Target"]], "monthly linked transfers vs target")}
  `;
}

function portfolioMonthlyContributionBarChart(points = [], options = {}) {
  const expanded = Boolean(options.expanded);
  const width = expanded ? 1120 : 760;
  const height = expanded ? 420 : 280;
  const padding = { top: 18, right: 18, bottom: 38, left: 70 };
  const values = points.flatMap((point) => [point.actual_eur, point.planned_eur]).map(numericValue);
  if (!values.length) return emptyState("No monthly contribution data available.");
  const rawMax = Math.max(...values, 0);
  const yScale = niceChartScale(0, rawMax + Math.max(rawMax * 0.08, 1), 4);
  const maxValue = yScale.max;
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;
  const range = maxValue || 1;
  const yForValue = (value) => padding.top + (1 - (numericValue(value) / range)) * plotHeight;
  const xForIndex = (index) => padding.left + (points.length === 1 ? 0 : (index / (points.length - 1)) * plotWidth);
  const yTicks = yScale.ticks.slice().reverse().map((value) => ({
    value,
    y: yForValue(value),
  }));
  const labelIndexes = standardChartLabelIndexes(points.length, 4);
  const slotWidth = plotWidth / Math.max(points.length, 1);
  const barWidth = Math.max(3, Math.min(18, slotWidth * 0.32));
  const zeroY = yForValue(0);
  const planPath = points.map((point, index) => `${xForIndex(index).toFixed(2)},${yForValue(point.planned_eur).toFixed(2)}`).join(" ");
  const planMarkers = "";
  const hoverWidth = Math.max(12, Math.min(38, slotWidth));
  const hoverTargets = points.map((point, index) => {
    const x = xForIndex(index);
    const edgeClass = x < width * 0.18 ? "edge-left" : x > width * 0.82 ? "edge-right" : "";
    const tooltip = [
      monthLabel(point.month || ""),
      `Actual: ${formatWholeCurrency(point.actual_eur || 0, "EUR")}`,
      `Target: ${formatWholeCurrency(point.planned_eur || 0, "EUR")}`,
      `Gap: ${signedWholeAmount(numericValue(point.actual_eur) - numericValue(point.planned_eur), "EUR")}`,
    ].join("\n");
    return `
      <span
        class="report-chart-hit report-chart-column-hit ${edgeClass}"
        data-tooltip="${safe(tooltip)}"
        style="left: ${(x / width * 100).toFixed(3)}%; top: ${((padding.top + plotHeight / 2) / height * 100).toFixed(3)}%; width: ${(hoverWidth / width * 100).toFixed(3)}%; height: ${(plotHeight / height * 100).toFixed(3)}%;"
      ></span>
    `;
  }).join("");

  return `
    <div class="standard-line-chart portfolio-monthly-chart${expanded ? " expanded-chart" : ""}" role="img" aria-label="Monthly portfolio contribution performance">
      <svg viewBox="0 0 ${width} ${height}" preserveAspectRatio="none">
        ${yTicks.map((tick) => `
          <line class="report-chart-grid" x1="${padding.left}" y1="${tick.y.toFixed(2)}" x2="${width - padding.right}" y2="${tick.y.toFixed(2)}"></line>
          <text class="report-chart-y" x="${padding.left - 12}" y="${(tick.y + 4).toFixed(2)}" text-anchor="end">${safe(formatChartAxisCurrency(tick.value, "EUR"))}</text>
        `).join("")}
        ${points.map((point, index) => {
          const x = xForIndex(index);
          const actualY = yForValue(point.actual_eur);
          return `<rect class="standard-chart-bar actual" x="${(x - barWidth / 2).toFixed(2)}" y="${actualY.toFixed(2)}" width="${barWidth.toFixed(2)}" height="${Math.max(0, zeroY - actualY).toFixed(2)}" rx="2" ry="2"></rect>`;
        }).join("")}
        <polyline class="standard-chart-line plan" points="${safe(planPath)}"></polyline>
        ${planMarkers}
        ${labelIndexes.map((index) => {
          const point = points[index];
          if (!point) return "";
          return `<text class="report-chart-x" x="${xForIndex(index).toFixed(2)}" y="${height - 10}" text-anchor="${index === 0 ? "start" : index === points.length - 1 ? "end" : "middle"}">${safe(shortMonthLabel(point.month))}</text>`;
        }).join("")}
      </svg>
      <div class="report-chart-hover-layer" aria-hidden="true">
        ${hoverTargets}
      </div>
    </div>
  `;
}

function portfolioPerformanceTable(rows = [], portfolio = {}) {
  if (!rows.length) return emptyState("No portfolio performance rows match the current search.");
  return `
    <section class="minimal-table-wrap planning-target-table-wrap portfolio-performance-table-wrap">
      <table class="minimal-table planning-target-table portfolio-performance-table">
        <thead>
          <tr>
            <th>Portfolio</th>
            <th class="align-right">Paid In</th>
            <th class="align-right">Current Value</th>
            <th class="align-right">Achieved</th>
            <th class="align-right">Plan To Date</th>
            <th class="align-right">Completion</th>
          </tr>
        </thead>
        <tbody>
          ${rows.map((row) => `
            <tr>
              <td>
	                <span class="table-main">${safe(portfolioPerformanceLabel(row, rows))}</span>
	                <span class="table-sub">${[
	                  displayPortfolioId(row.portfolio_id),
	                  labelize(row.provider),
	                  displayContributionType(row.contribution_type || "investment"),
	                  labelize(row.contribution_role || "self"),
	                  formatPlural(row.contribution_count || 0, "transfer"),
                ].filter(Boolean).map(safe).join(" · ")}</span>
              </td>
              <td class="align-right">
                <span class="table-main">${formatWholeCurrency(row.contributed_eur || 0, "EUR")}</span>
                <span class="table-sub">${row.latest_contribution_date ? `latest ${safe(formatDisplayDate(row.latest_contribution_date))}` : "no matched transfers"}</span>
              </td>
              <td class="align-right">${formatWholeCurrency(row.current_value_eur || 0, "EUR")}</td>
              <td class="align-right">
                <span class="table-main ${signedClass(row.achieved_pl_eur)}">${signedWholeAmount(row.achieved_pl_eur || 0, "EUR")}</span>
                <span class="table-sub">${signedPercent(row.achieved_return_pct || 0)} vs paid in</span>
              </td>
              <td class="align-right">${formatWholeCurrency(row.plan_to_date_eur || 0, "EUR")}</td>
              <td class="align-right">
                <span class="table-main">${formatPercent(row.plan_completion_pct || 0)}</span>
                <span class="table-sub">${signedWholeAmount(row.contribution_gap_eur || 0, "EUR")} funding gap</span>
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </section>
  `;
}

function filteredPortfolioInstrumentRows(rows = []) {
  return state.query.trim() ? filterRows(rows, portfolioInstrumentFilterFields()) : rows;
}

function portfolioInstrumentFilterFields() {
  return [
    "portfolio_id",
    "portfolio_name",
    "provider",
    "asset_name",
    "ticker",
    "asset_class",
    "asset_bucket",
    "exchange",
    "isin",
  ];
}

function portfolioMipRowsForVisibleInstruments(mipRows = [], visibleInstruments = []) {
  const visiblePortfolioIds = new Set(visibleInstruments.map((row) => String(row.portfolio_id || "").trim()).filter(Boolean));
  const directMatches = filterRows(mipRows, portfolioMipFilterFields());
  const rowsById = new Map(directMatches.map((row) => [portfolioMipId(row), row]));
  mipRows.forEach((row) => {
    const portfolioId = String(row.portfolio_id || "").trim();
    if (portfolioId && visiblePortfolioIds.has(portfolioId)) {
      rowsById.set(portfolioMipId(row), row);
    }
  });
  return Array.from(rowsById.values());
}

function portfolioMipFilterFields() {
  return [
    "portfolio_id",
    "portfolio_name",
    "provider",
    "contribution_type",
    "contribution_role",
    "notes",
  ];
}

function currentPortfolioInstrumentRows(portfolio = state.overview?.portfolio || {}) {
  return applyPortfolioInstrumentOverrides(portfolio.instruments || []);
}

function applyPortfolioInstrumentOverrides(rows = []) {
  const overrides = state.portfolioInstrumentOverrides || {};
  const deleted = state.deletedPortfolioInstrumentIds || new Set();
  const nextRows = rows.map((row) => {
    const id = portfolioInstrumentId(row);
    return {
      ...row,
      _portfolio_instrument_id: id,
      ...(overrides[id] || {}),
    };
  });
  Object.entries(overrides).forEach(([id, row]) => {
    if (nextRows.some((entry) => portfolioInstrumentId(entry) === id)) return;
    nextRows.push({
      ...defaultPortfolioInstrumentValues(),
      ...row,
      _portfolio_instrument_id: id,
      _is_custom: true,
    });
  });
  return recalculatePortfolioInstrumentAllocations(nextRows.filter((row) => !deleted.has(portfolioInstrumentId(row))));
}

function recalculatePortfolioInstrumentAllocations(rows = []) {
  const totals = rows.reduce((acc, row) => {
    const key = String(row.portfolio_id || "").trim() || "portfolio";
    acc[key] = acc[key] || { value: 0, target: 0, achieved: 0, planToDate: 0, contributed: 0, fundingGap: 0 };
    acc[key].value += numericValue(row.current_value_eur);
    acc[key].target += numericValue(row.target_allocation_pct);
    acc[key].achieved += numericValue(row.achieved_pl_eur);
    acc[key].planToDate = Math.max(acc[key].planToDate, numericValue(row.funding_plan_to_date_eur));
    acc[key].contributed = Math.max(acc[key].contributed, numericValue(row.portfolio_contributed_eur));
    acc[key].fundingGap = Math.max(acc[key].fundingGap, numericValue(row.portfolio_funding_gap_eur));
    return acc;
  }, {});
  const nextRows = rows.map((row) => {
    const key = String(row.portfolio_id || "").trim() || "portfolio";
    const total = totals[key] || { value: 0, target: 0, achieved: 0, planToDate: 0, contributed: 0, fundingGap: 0 };
    const targetTotal = total.target || 100;
    const currentValue = numericValue(row.current_value_eur);
    const currentAllocation = total.value ? percentOf(currentValue, total.value) : 0;
    const targetShare = numericValue(row.target_allocation_pct) / targetTotal;
    const targetValue = total.value * targetShare;
    const targetPct = targetShare * 100;
    const fundingTargetToDate = total.planToDate * targetShare;
    const fundingShortfall = fundingTargetToDate - currentValue;
    const fundingBacklog = Math.max(0, fundingShortfall);
    const contributed = total.contributed || Math.max(0, total.value - total.achieved);
    const fundingGap = total.fundingGap || Math.max(0, total.planToDate - contributed);
    return {
      ...row,
      current_allocation_pct: moneyRound(currentAllocation),
      target_value_eur: moneyRound(targetValue),
      allocation_backlog_eur: moneyRound(targetValue - currentValue),
      allocation_gap_pct: moneyRound(targetPct - currentAllocation),
      funding_plan_to_date_eur: moneyRound(total.planToDate),
      funding_target_to_date_eur: moneyRound(fundingTargetToDate),
      funding_shortfall_eur: moneyRound(fundingShortfall),
      funding_backlog_eur: moneyRound(fundingBacklog),
      funding_completion_pct: fundingTargetToDate ? moneyRound(percentOf(currentValue, fundingTargetToDate)) : 0,
      portfolio_contributed_eur: moneyRound(contributed),
      portfolio_funding_gap_eur: moneyRound(fundingGap),
    };
  });
  const positiveBacklogs = nextRows.reduce((acc, row) => {
    const key = String(row.portfolio_id || "").trim() || "portfolio";
    acc[key] = (acc[key] || 0) + numericValue(row.funding_backlog_eur);
    return acc;
  }, {});
  return nextRows.map((row) => {
    const key = String(row.portfolio_id || "").trim() || "portfolio";
    const positiveBacklog = positiveBacklogs[key] || 0;
    const buyBudget = Math.min(numericValue(row.portfolio_funding_gap_eur), positiveBacklog);
    const recommendedBuy = positiveBacklog ? numericValue(row.funding_backlog_eur) * buyBudget / positiveBacklog : 0;
    return {
      ...row,
      recommended_buy_eur: moneyRound(recommendedBuy),
    };
  });
}

function portfolioSummaryFromRows(summary = {}, instruments = [], mipRows = []) {
  const currentPhaseId = summary.current_phase_id || currentPortfolioPhaseId();
  return {
    ...summary,
    current_value_eur: moneyRound(instruments.reduce((sum, row) => sum + numericValue(row.current_value_eur), 0)),
    instruments: instruments.length,
    monthly_contribution_eur: moneyRound(mipRows.reduce((sum, row) => sum + numericValue(row.current_monthly_contribution_eur ?? monthlyMipContributionForPhase(row, currentPhaseId)), 0)),
  };
}

function portfolioInstrumentId(row = {}) {
  return String(row._portfolio_instrument_id || [
    row.portfolio_id,
    row.ticker || row.symbol || row.asset_name,
  ].filter(Boolean).join("::") || `instrument:${Date.now()}`);
}

function displayPortfolioId(value) {
  return String(value || "").replace(/\bp(\d+[a-z]?)\b/gi, (_match, suffix) => `P${String(suffix).toUpperCase()}`);
}

function portfolioNameFromId(value) {
  const raw = String(value || "").trim();
  const match = raw.match(/^p(\d+)([a-z])?$/i);
  if (!match) return displayPortfolioId(raw);
  const [, number, suffix = ""] = match;
  const base = `Portfolio ${number}`;
  const normalizedSuffix = suffix.toLowerCase();
  if (normalizedSuffix === "a") return `${base} - Employee`;
  if (normalizedSuffix === "b") return `${base} - Employer`;
  return normalizedSuffix ? `${base} - ${normalizedSuffix.toUpperCase()}` : base;
}

function portfolioReferenceLabel(value) {
  const id = String(value || "").trim();
  if (!id) return "";
  const displayId = displayPortfolioId(id);
  const name = portfolioNameFromId(id);
  return name && name !== displayId ? `${name} · ${displayId}` : displayId;
}

function storedPortfolioId(value) {
  return String(value || "").trim().replace(/^P(\d+[A-Z]?)$/i, (_match, suffix) => `p${String(suffix).toLowerCase()}`);
}

function displayPhaseId(value) {
  return String(value || "").replace(/\bph(\d+)\b/gi, (_match, suffix) => `PH${suffix}`);
}

function storedPhaseId(value) {
  return String(value || "").trim().replace(/^PH(\d+)$/i, (_match, suffix) => `ph${suffix}`);
}

function displayContributionType(value) {
  const text = String(value || "").trim();
  return text.toLowerCase() === "mip" ? "MIP" : labelize(text);
}

function portfolioAllocationMainLabel(row = {}) {
  return `${formatPercent(row.target_allocation_pct || 0)} target / ${formatPercent(row.current_allocation_pct || 0)} now`;
}

function portfolioAllocationStatusLabel(row = {}) {
  const rebalanceAmount = numericValue(row.allocation_backlog_eur);
  const driftPct = numericValue(row.allocation_gap_pct);
  if (Math.abs(rebalanceAmount) < 1 && Math.abs(driftPct) < 0.1) {
    return "On target allocation";
  }
  const amountLabel = rebalanceAmount >= 0
    ? `${formatWholeCurrency(Math.abs(rebalanceAmount), "EUR")} under`
    : `${formatWholeCurrency(Math.abs(rebalanceAmount), "EUR")} over`;
  return `${signedPercent(driftPct)} drift · ${amountLabel}`;
}

function portfolioBuyNeededMainLabel(row = {}) {
  const recommendedBuy = numericValue(row.recommended_buy_eur);
  const fundingBacklog = numericValue(row.funding_backlog_eur);
  const fundingShortfall = numericValue(row.funding_shortfall_eur);
  if (recommendedBuy >= 1) {
    return `Buy ${formatWholeCurrency(recommendedBuy, "EUR")}`;
  }
  if (fundingBacklog >= 1) {
    return `${formatWholeCurrency(fundingBacklog, "EUR")} unfunded`;
  }
  if (fundingShortfall < -1) {
    return `${formatWholeCurrency(Math.abs(fundingShortfall), "EUR")} ahead`;
  }
  return "On funding target";
}

function portfolioBuyNeededSubLabel(row = {}) {
  const targetToDate = numericValue(row.funding_target_to_date_eur);
  const completion = numericValue(row.funding_completion_pct);
  if (targetToDate <= 0) {
    return "No funding target to date";
  }
  return `${formatWholeCurrency(targetToDate, "EUR")} target · ${formatPercent(completion)} funded`;
}

function portfolioPerformanceSnapshot(row = {}) {
  const profitLoss = numericValue(row.achieved_pl_eur);
  const costBase = portfolioPerformanceCostBase(row);
  const returnPct = costBase > 0
    ? percentOf(profitLoss, costBase)
    : numericValue(row.achieved_return_pct);
  return {
    cost_base_eur: moneyRound(costBase),
    profit_loss_eur: moneyRound(profitLoss),
    return_pct: moneyRound(returnPct),
  };
}

function portfolioPerformanceCostBase(row = {}) {
  const historicalCost = numericValue(row.cost_basis_eur);
  if (historicalCost > 0) return historicalCost;
  const contributed = numericValue(row.contributed_eur);
  if (contributed > 0) return contributed;
  const nativeCurrency = String(row.current_value_currency || row.base_currency || "EUR").toUpperCase();
  const nativeCost = numericValue(row.cost_basis_native);
  if (nativeCurrency === "EUR" && nativeCost > 0) return nativeCost;
  const historicalReturn = numericValue(row.achieved_return_pct);
  const historicalProfitLoss = numericValue(row.achieved_pl_eur);
  if (historicalReturn && historicalProfitLoss) {
    return Math.abs(historicalProfitLoss / (historicalReturn / 100));
  }
  const currentValue = numericValue(row.current_value_eur);
  const profitLoss = numericValue(row.achieved_pl_eur);
  return Math.max(0, currentValue - profitLoss);
}

function portfolioPerformanceSummaryFromInstruments(instruments = []) {
  const costBase = instruments.reduce((sum, row) => sum + portfolioPerformanceCostBase(row), 0);
  const profitLoss = instruments.reduce((sum, row) => sum + numericValue(row.achieved_pl_eur), 0);
  return portfolioPerformanceSnapshot({
    cost_basis_eur: costBase,
    achieved_pl_eur: profitLoss,
  });
}

function portfolioPerformanceSubLabel(row = {}) {
  const performance = portfolioPerformanceSnapshot(row);
  return `${signedPercent(performance.return_pct)} historical return`;
}

function portfolioPerformanceByPortfolioRows(portfolio = {}) {
  const rawInstruments = currentPortfolioInstrumentRows(portfolio);
  const instruments = filteredPortfolioInstrumentRows(rawInstruments);
  const mipRows = currentPortfolioMipRows(portfolio);
  const queryActive = Boolean(state.query.trim());
  const currentPhaseId = portfolio.summary?.current_phase_id || currentPortfolioPhaseId();
  const planById = new Map(mipRows.map((row) => [String(row.portfolio_id || ""), row]));
  const groups = new Map();
  const ensureGroup = (portfolioId, source = {}) => {
    const id = String(portfolioId || source.portfolio_id || "").trim();
    if (!id) return null;
    if (!groups.has(id)) {
      const plan = planById.get(id) || {};
      groups.set(id, {
        portfolio_id: id,
        portfolio_name: source.portfolio_name || plan.portfolio_name || displayPortfolioId(id),
        provider: source.provider || plan.provider || "",
        contribution_type: plan.contribution_type || source.contribution_type || "investment",
        contribution_role: plan.contribution_role || source.contribution_role || "",
        instrument_count: 0,
        current_value_eur: 0,
        cost_base_eur: 0,
        profit_loss_eur: 0,
        monthly_contribution_eur: numericValue(plan.current_monthly_contribution_eur ?? monthlyMipContributionForPhase(plan, currentPhaseId)),
        plan_to_date_eur: numericValue(plan.plan_to_date_eur),
        expected_weight_total: 0,
        expected_weighted_pct: 0,
      });
    }
    const group = groups.get(id);
    group.portfolio_name = group.portfolio_name || source.portfolio_name || displayPortfolioId(id);
    group.provider = group.provider || source.provider || "";
    return group;
  };

  instruments.forEach((instrument) => {
    const group = ensureGroup(instrument.portfolio_id, instrument);
    if (!group) return;
    const performance = portfolioPerformanceSnapshot(instrument);
    const expectedWeight = Math.max(0, numericValue(instrument.target_allocation_pct) || numericValue(instrument.current_value_eur));
    group.instrument_count += 1;
    group.current_value_eur += numericValue(instrument.current_value_eur);
    group.cost_base_eur += numericValue(performance.cost_base_eur);
    group.profit_loss_eur += numericValue(performance.profit_loss_eur);
    group.expected_weight_total += expectedWeight;
    group.expected_weighted_pct += numericValue(instrument.net_expected_cagr_pct) * expectedWeight;
  });

  if (!queryActive) {
    mipRows.forEach((row) => ensureGroup(row.portfolio_id, row));
  }

  return Array.from(groups.values())
    .map((row) => ({
      ...row,
      current_value_eur: moneyRound(row.current_value_eur),
      cost_base_eur: moneyRound(row.cost_base_eur),
      profit_loss_eur: moneyRound(row.profit_loss_eur),
      monthly_contribution_eur: moneyRound(row.monthly_contribution_eur),
      plan_to_date_eur: moneyRound(row.plan_to_date_eur),
      return_pct: row.cost_base_eur ? moneyRound(percentOf(row.profit_loss_eur, row.cost_base_eur)) : 0,
      expected_cagr_pct: row.expected_weight_total ? moneyRound(row.expected_weighted_pct / row.expected_weight_total) : 0,
    }))
    .sort((a, b) => displayPortfolioId(a.portfolio_id).localeCompare(displayPortfolioId(b.portfolio_id), undefined, { numeric: true }));
}

function portfolioPerformanceByPortfolioSummary(rows = []) {
  const currentValue = rows.reduce((sum, row) => sum + numericValue(row.current_value_eur), 0);
  const costBase = rows.reduce((sum, row) => sum + numericValue(row.cost_base_eur), 0);
  const profitLoss = rows.reduce((sum, row) => sum + numericValue(row.profit_loss_eur), 0);
  const monthlyContribution = rows.reduce((sum, row) => sum + numericValue(row.monthly_contribution_eur), 0);
  return {
    portfolios: rows.length,
    current_value_eur: moneyRound(currentValue),
    cost_base_eur: moneyRound(costBase),
    profit_loss_eur: moneyRound(profitLoss),
    monthly_contribution_eur: moneyRound(monthlyContribution),
    return_pct: costBase ? moneyRound(percentOf(profitLoss, costBase)) : 0,
  };
}

function portfolioInvestmentSelectedIds(rows = []) {
  return new Set(rows.map((row) => String(row.portfolio_id || "").trim()).filter(Boolean));
}

function portfolioInvestmentAllIds(performance = {}) {
  return new Set((performance.portfolios || []).map((row) => String(row.portfolio_id || "").trim()).filter(Boolean));
}

function portfolioInvestmentUsesAllScope(performance = {}, selectedRows = []) {
  const allIds = portfolioInvestmentAllIds(performance);
  if (!allIds.size) return true;
  const selectedIds = portfolioInvestmentSelectedIds(selectedRows);
  if (!selectedIds.size) return true;
  return Array.from(allIds).every((id) => selectedIds.has(id));
}

function portfolioInvestmentAggregateRows(performance = {}, selectedRows = []) {
  if (portfolioInvestmentUsesAllScope(performance, selectedRows)) {
    return (performance.investment_series || []).filter((row) => row?.month);
  }
  const selectedIds = portfolioInvestmentSelectedIds(selectedRows);
  const byMonth = new Map();
  (performance.portfolio_investment_series || [])
    .filter((row) => selectedIds.has(String(row.portfolio_id || "").trim()))
    .forEach((row) => {
      const month = String(row.month || "");
      if (!month) return;
      if (!byMonth.has(month)) {
        byMonth.set(month, {
          month,
          portfolio_id: "selected",
          portfolio_name: "Selected Portfolios",
          deployed_cost_eur: 0,
          known_value_eur: 0,
          realized_pl_eur: 0,
          unrealized_pl_eur: 0,
          lifetime_pl_eur: 0,
          market_value_eur: 0,
          entry_count: 0,
          closed_count: 0,
          active_count: 0,
        });
      }
      const target = byMonth.get(month);
      target.deployed_cost_eur += numericValue(row.deployed_cost_eur);
      target.known_value_eur += numericValue(row.known_value_eur);
      target.realized_pl_eur += numericValue(row.realized_pl_eur);
      target.unrealized_pl_eur += numericValue(row.unrealized_pl_eur);
      target.lifetime_pl_eur += numericValue(row.lifetime_pl_eur);
      target.market_value_eur += numericValue(row.market_value_eur);
      target.entry_count += numericValue(row.entry_count);
      target.closed_count += numericValue(row.closed_count);
      target.active_count += numericValue(row.active_count);
    });
  return Array.from(byMonth.values())
    .map((row) => ({
      ...row,
      deployed_cost_eur: moneyRound(row.deployed_cost_eur),
      known_value_eur: moneyRound(row.known_value_eur),
      realized_pl_eur: moneyRound(row.realized_pl_eur),
      unrealized_pl_eur: moneyRound(row.unrealized_pl_eur),
      lifetime_pl_eur: moneyRound(row.lifetime_pl_eur),
      market_value_eur: moneyRound(row.market_value_eur),
      return_pct: row.deployed_cost_eur ? moneyRound(percentOf(row.lifetime_pl_eur, row.deployed_cost_eur)) : 0,
    }))
    .sort((a, b) => String(a.month || "").localeCompare(String(b.month || "")));
}

function portfolioInvestmentVisibleRows(performance = {}, selectedRows = []) {
  const rows = portfolioInvestmentAggregateRows(performance, selectedRows);
  return portfolioPerformanceVisibleMonthlyRows(rows).filter((row) => row?.month);
}

function portfolioInvestmentPortfolioGroups(performance = {}, selectedRows = [], monthLabels = []) {
  const selectedIds = portfolioInvestmentSelectedIds(selectedRows);
  const allScope = portfolioInvestmentUsesAllScope(performance, selectedRows);
  const rowById = new Map(selectedRows.map((row) => [String(row.portfolio_id || "").trim(), row]));
  const groups = new Map();
  (performance.portfolio_investment_series || [])
    .filter((row) => {
      const id = String(row.portfolio_id || "").trim();
      return id && (allScope || selectedIds.has(id));
    })
    .forEach((row) => {
      const id = String(row.portfolio_id || "").trim();
      if (!groups.has(id)) groups.set(id, []);
      groups.get(id).push(row);
    });
  return Array.from(groups.entries())
    .map(([id, rows]) => {
      const meta = rowById.get(id) || rows[0] || {};
      const sourcePoints = rows
        .filter((row) => numericValue(row.deployed_cost_eur) > 0)
        .map((row) => ({
          ...row,
          label: row.month,
          value: row.return_pct,
          invested: row.deployed_cost_eur,
        }));
      return {
        id,
        label: portfolioScopeLabel(meta, selectedRows),
        lineId: portfolioInvestmentLineId(id),
        points: alignInvestmentPointsToLabels(sourcePoints, monthLabels),
      };
    })
    .filter((group) => group.points.filter((point) => chartHasValue(point.value)).length >= 2)
    .sort((a, b) => displayPortfolioId(a.id).localeCompare(displayPortfolioId(b.id), undefined, { numeric: true }))
    .slice(0, 6);
}

function portfolioInvestmentLineId(portfolioId = "") {
  const normalized = displayPortfolioId(portfolioId).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return normalized ? `portfolio-${normalized}` : "portfolio-other";
}

function alignInvestmentPointsToLabels(points = [], labels = []) {
  const byLabel = new Map();
  (points || []).forEach((point) => {
    const label = chartPointLabel(point);
    if (!label) return;
    byLabel.set(label, point);
  });
  return labels.map((label) => {
    const point = byLabel.get(label);
    return point
      ? { ...point, label, value: chartHasValue(point.value) ? point.value : null }
      : { label, value: null };
  });
}

function portfolioInvestmentSnapshotRows(rows = []) {
  return (rows || [])
    .map((row) => {
      const costBase = numericValue(row.cost_base_eur || row.cost_basis_eur || portfolioPerformanceCostBase(row));
      const profitLoss = numericValue(row.profit_loss_eur ?? row.achieved_pl_eur);
      const currentValue = numericValue(row.current_value_eur);
      const returnPct = costBase
        ? percentOf(profitLoss, costBase)
        : numericValue(row.return_pct ?? row.achieved_return_pct);
      return {
        ...row,
        cost_base_eur: moneyRound(costBase),
        current_value_eur: moneyRound(currentValue),
        profit_loss_eur: moneyRound(profitLoss),
        return_pct: moneyRound(returnPct),
      };
    })
    .filter((row) => numericValue(row.cost_base_eur) || numericValue(row.current_value_eur) || numericValue(row.profit_loss_eur));
}

function portfolioInvestmentSnapshotSummary(rows = []) {
  const snapshotRows = portfolioInvestmentSnapshotRows(rows);
  const currentValue = snapshotRows.reduce((sum, row) => sum + numericValue(row.current_value_eur), 0);
  const costBase = snapshotRows.reduce((sum, row) => sum + numericValue(row.cost_base_eur), 0);
  const profitLoss = snapshotRows.reduce((sum, row) => sum + numericValue(row.profit_loss_eur), 0);
  return {
    rows: snapshotRows,
    current_value_eur: moneyRound(currentValue),
    cost_base_eur: moneyRound(costBase),
    profit_loss_eur: moneyRound(profitLoss),
    return_pct: costBase ? moneyRound(percentOf(profitLoss, costBase)) : 0,
  };
}

function portfolioInvestmentReturnSnapshotChart(selectedRows = []) {
  const summary = portfolioInvestmentSnapshotSummary(selectedRows);
  if (!summary.rows.length) return emptyState("No portfolio performance data matches the current view.");
  return `
    <div class="report-chart-summary">
      <div class="report-chart-summary-main">
        <span>Current performance snapshot</span>
        <strong class="${signedClass(summary.return_pct)}">${signedPercent(summary.return_pct || 0)}</strong>
        <em>${signedWholeAmount(summary.profit_loss_eur || 0, "EUR")} lifetime P/L · ${formatWholeCurrency(summary.cost_base_eur || 0, "EUR")} historical cost</em>
      </div>
    </div>
    ${portfolioInvestmentSnapshotBars(summary.rows, "return")}
  `;
}

function portfolioInvestmentExposureSnapshotChart(selectedRows = []) {
  const summary = portfolioInvestmentSnapshotSummary(selectedRows);
  if (!summary.rows.length) return emptyState("No current portfolio value data matches the current view.");
  return `
    <div class="report-chart-summary">
      <div class="report-chart-summary-main">
        <span>Current exposure snapshot</span>
        <strong>${formatWholeCurrency(summary.current_value_eur || 0, "EUR")}</strong>
        <em>${signedWholeAmount(summary.profit_loss_eur || 0, "EUR")} lifetime P/L · ${signedPercent(summary.return_pct || 0)} historical return</em>
      </div>
    </div>
    ${portfolioInvestmentSnapshotBars(summary.rows, "exposure")}
  `;
}

function portfolioInvestmentSnapshotBars(rows = [], mode = "return") {
  const snapshotRows = portfolioInvestmentSnapshotRows(rows);
  if (!snapshotRows.length) return emptyState("No portfolio snapshot data available.");
  const byReturn = mode === "return";
  const totalValue = snapshotRows.reduce((sum, row) => sum + numericValue(row.current_value_eur), 0);
  const rankedRows = [...snapshotRows]
    .sort((a, b) => {
      const left = byReturn ? Math.abs(numericValue(a.return_pct)) : numericValue(a.current_value_eur);
      const right = byReturn ? Math.abs(numericValue(b.return_pct)) : numericValue(b.current_value_eur);
      return right - left;
    })
    .slice(0, 6);
  const maxValue = Math.max(1, ...rankedRows.map((row) => byReturn ? Math.abs(numericValue(row.return_pct)) : numericValue(row.current_value_eur)));
  return `
    <div class="portfolio-snapshot-visual" aria-label="${byReturn ? "Portfolio return snapshot" : "Portfolio exposure snapshot"}">
      ${rankedRows.map((row) => {
        const value = byReturn ? Math.abs(numericValue(row.return_pct)) : numericValue(row.current_value_eur);
        const width = Math.max(3, Math.min(100, percentOf(value, maxValue)));
        const share = totalValue ? percentOf(numericValue(row.current_value_eur), totalValue) : 0;
        const label = portfolioScopeLabel(row, snapshotRows);
        const mainValue = byReturn ? signedPercent(row.return_pct || 0) : formatWholeCurrency(row.current_value_eur || 0, "EUR");
        const detail = byReturn
          ? `${signedWholeAmount(row.profit_loss_eur || 0, "EUR")} P/L · ${formatWholeCurrency(row.cost_base_eur || 0, "EUR")} cost`
          : `${formatPercent(share)} of value · ${signedPercent(row.return_pct || 0)} return`;
        return `
          <div class="portfolio-snapshot-row">
            <div class="portfolio-snapshot-label">
              <strong>${safe(label)}</strong>
              <span>${safe(displayPortfolioId(row.portfolio_id))}${row.provider ? ` · ${safe(row.provider)}` : ""}</span>
            </div>
            <div class="portfolio-snapshot-meter">
              <div class="portfolio-snapshot-track">
                <span class="${signedClass(row.return_pct)}" style="width:${width.toFixed(2)}%"></span>
              </div>
              <small>${safe(detail)}</small>
            </div>
            <div class="portfolio-snapshot-value">
              <strong class="${byReturn ? signedClass(row.return_pct) : ""}">${safe(mainValue)}</strong>
            </div>
          </div>
        `;
      }).join("")}
    </div>
  `;
}

function portfolioInvestmentReturnPathChart(performance = {}, selectedRows = [], options = {}) {
  const expanded = Boolean(options.expanded);
  const chartId = options.chartId || "";
  const rows = portfolioInvestmentVisibleRows(performance, selectedRows);
  const points = rows
    .filter((row) => numericValue(row.deployed_cost_eur) > 0)
    .map((row) => ({
      ...row,
      label: row.month,
      value: row.return_pct,
      invested: row.deployed_cost_eur,
    }));
  const snapshot = portfolioInvestmentSnapshotSummary(selectedRows);
  if (points.length < 2) {
    if (expanded) return portfolioInvestmentReturnSnapshotChart(selectedRows);
    return compactChartCard({
      chartId,
      expandLabel: "Expand investment return over time",
      icon: "trendUp",
      label: "Investment Return Over Time",
      value: signedPercent(snapshot.return_pct || 0),
      meta: `${signedWholeAmount(snapshot.profit_loss_eur || 0, "EUR")} lifetime P/L`,
      periodControl: {
        action: "portfolio-performance-window",
        dataKey: "portfolioPerformanceWindow",
        selectedValue: normalizedPortfolioPerformanceWindow(),
        options: monthlyTrendHistoryOptions(),
        ariaLabel: "Performance period",
      },
      metrics: [
        { value: formatWholeCurrency(snapshot.cost_base_eur || 0, "EUR"), label: "historical cost" },
        { value: formatNumber(snapshot.rows.length), label: snapshot.rows.length === 1 ? "portfolio" : "portfolios" },
      ],
      note: "Open for the current portfolio snapshot.",
    });
  }
  const first = points[0];
  const last = points[points.length - 1];
  const monthLabels = rows.map((row) => row.month).filter(Boolean);
  const portfolioGroups = portfolioInvestmentPortfolioGroups(performance, selectedRows, monthLabels);
  const portfolioSeries = portfolioGroups.map((group) => ({
    id: group.lineId,
    label: group.label,
    points: group.points,
  }));
  const series = [
    {
      id: "portfolio-total",
      label: portfolioInvestmentUsesAllScope(performance, selectedRows) ? "All investments" : "Selected portfolios",
      points: alignInvestmentPointsToLabels(points, monthLabels),
    },
    ...portfolioSeries,
  ];
  if (!expanded) {
    return compactChartCard({
      chartId,
      expandLabel: "Expand investment return over time",
      icon: "trendUp",
      label: "Investment Return Over Time",
      value: signedPercent(last.return_pct || 0),
      meta: `${signedWholeAmount(last.lifetime_pl_eur || 0, "EUR")} lifetime P/L · ${formatWholeCurrency(last.deployed_cost_eur || 0, "EUR")} deployed`,
      chartPoints: points,
      chart: {
        ariaLabel: "Investment return over time",
        className: "portfolio-total",
        tooltipContext: { valueFormatter: signedPercent },
        yMin: Math.min(0, ...points.map((point) => numericValue(point.value))),
        yValueFormatter: formatPercent,
      },
      periodControl: {
        action: "portfolio-performance-window",
        dataKey: "portfolioPerformanceWindow",
        selectedValue: normalizedPortfolioPerformanceWindow(),
        options: monthlyTrendHistoryOptions(),
        ariaLabel: "Performance period",
      },
      metrics: [
        { value: signedWholeAmount(last.lifetime_pl_eur || 0, "EUR"), label: "lifetime P/L" },
        { value: formatWholeCurrency(last.deployed_cost_eur || 0, "EUR"), label: "deployed" },
      ],
      note: `${monthLabel(first.month)} - ${monthLabel(last.month)} · open for portfolio lines`,
    });
  }
  return `
    <div class="report-chart-summary">
      <div class="report-chart-summary-main">
        <span>${safe(monthLabel(first.month))} - ${safe(monthLabel(last.month))}</span>
        <strong class="${signedClass(last.return_pct)}">${signedPercent(last.return_pct || 0)}</strong>
        <em>${signedWholeAmount(last.lifetime_pl_eur || 0, "EUR")} lifetime P/L · ${formatWholeCurrency(last.deployed_cost_eur || 0, "EUR")} deployed</em>
      </div>
      ${portfolioPerformanceWindowSelector()}
    </div>
    ${standardLineChartWithControls({
      ariaLabel: "Investment return over time by portfolio",
      className: "portfolio-investment-return-chart expanded-chart",
      height: 420,
      labelIndexes: standardChartLabelIndexes(monthLabels.length, 4),
      padding: { top: 18, right: 18, bottom: 38, left: 70 },
      series,
      showLastDot: true,
      tickCount: 4,
      tooltipContext: {
        investedLabel: "Deployed cost",
        valueFormatter: signedPercent,
      },
      width: 1120,
      xLabelFormatter: shortMonthLabel,
      yMin: Math.min(0, ...points.map((point) => numericValue(point.value))),
      yValueFormatter: formatPercent,
    }, {
      chartId,
      note: "ledger-estimated monthly path from trade entries, closed P/L, and latest open-position prices",
      ariaLabel: "Investment return chart lines",
    })}
  `;
}

function portfolioInvestmentValuePathChart(performance = {}, selectedRows = [], options = {}) {
  const expanded = Boolean(options.expanded);
  const chartId = options.chartId || "";
  const rows = portfolioInvestmentVisibleRows(performance, selectedRows)
    .filter((row) => numericValue(row.deployed_cost_eur) > 0 || numericValue(row.known_value_eur) > 0);
  const snapshot = portfolioInvestmentSnapshotSummary(selectedRows);
  if (rows.length < 2) {
    if (expanded) return portfolioInvestmentExposureSnapshotChart(selectedRows);
    return compactChartCard({
      chartId,
      expandLabel: "Expand investment value path",
      icon: "wallet",
      label: "Investment Value Path",
      value: formatWholeCurrency(snapshot.current_value_eur || 0, "EUR"),
      meta: `${signedWholeAmount(snapshot.profit_loss_eur || 0, "EUR")} lifetime P/L`,
      periodControl: {
        action: "portfolio-performance-window",
        dataKey: "portfolioPerformanceWindow",
        selectedValue: normalizedPortfolioPerformanceWindow(),
        options: monthlyTrendHistoryOptions(),
        ariaLabel: "Performance period",
      },
      metrics: [
        { value: formatWholeCurrency(snapshot.cost_base_eur || 0, "EUR"), label: "historical cost" },
        { value: signedPercent(snapshot.return_pct || 0), label: "return" },
      ],
      note: "Open for the current value snapshot.",
    });
  }
  const first = rows[0];
  const last = rows[rows.length - 1];
  const gain = numericValue(last.known_value_eur) - numericValue(last.deployed_cost_eur);
  if (!expanded) {
    return compactChartCard({
      chartId,
      expandLabel: "Expand investment value path",
      icon: "wallet",
      label: "Investment Value Path",
      value: formatWholeCurrency(last.known_value_eur || 0, "EUR"),
      meta: `${signedWholeAmount(gain, "EUR")} vs deployed cost`,
      chartPoints: rows.map((row) => ({
        ...row,
        label: row.month,
        value: row.known_value_eur,
      })),
      chart: {
        ariaLabel: "Investment value path",
        className: "known-value",
        yMin: 0,
      },
      periodControl: {
        action: "portfolio-performance-window",
        dataKey: "portfolioPerformanceWindow",
        selectedValue: normalizedPortfolioPerformanceWindow(),
        options: monthlyTrendHistoryOptions(),
        ariaLabel: "Performance period",
      },
      metrics: [
        { value: formatWholeCurrency(last.deployed_cost_eur || 0, "EUR"), label: "deployed" },
        { value: formatWholeCurrency(last.market_value_eur || 0, "EUR"), label: "active value" },
      ],
      note: `${monthLabel(first.month)} - ${monthLabel(last.month)} · open for value vs cost`,
    });
  }
  return `
    <div class="report-chart-summary">
      <div class="report-chart-summary-main">
        <span>${safe(monthLabel(first.month))} - ${safe(monthLabel(last.month))}</span>
        <strong>${formatWholeCurrency(last.known_value_eur || 0, "EUR")}</strong>
        <em>${signedWholeAmount(gain, "EUR")} vs deployed cost · ${formatWholeCurrency(last.market_value_eur || 0, "EUR")} active market value</em>
      </div>
      ${portfolioPerformanceWindowSelector()}
    </div>
    ${standardLineChartWithControls({
      ariaLabel: "Investment value versus historical cost",
      className: "portfolio-investment-value-chart expanded-chart",
      currency: "EUR",
      height: 420,
      labelIndexes: standardChartLabelIndexes(rows.length, 4),
      padding: { top: 18, right: 18, bottom: 38, left: 70 },
      series: [
        { id: "known-value", label: "Known value", points: rows.map((row) => ({ ...row, label: row.month, value: row.known_value_eur })) },
        { id: "deployed-cost", label: "Historical cost", points: rows.map((row) => ({ ...row, label: row.month, value: row.deployed_cost_eur })) },
      ],
      showLastDot: true,
      tickCount: 4,
      width: 1120,
      xLabelFormatter: shortMonthLabel,
      yMin: 0,
    }, {
      chartId,
      note: "known value equals deployed cost plus realized P/L and the latest open-position snapshot",
      ariaLabel: "Investment value chart lines",
    })}
  `;
}

function portfolioPortfolioPerformanceTable(rows = []) {
  if (!rows.length) return emptyState("No portfolio performance rows match the current search.");
  return `
    <section class="minimal-table-wrap planning-target-table-wrap portfolio-performance-table-wrap">
      <table class="minimal-table planning-target-table portfolio-performance-table">
        <thead>
          <tr>
            <th>Portfolio</th>
            <th class="align-right">Current Value</th>
            <th class="align-right">Historical Cost</th>
            <th class="align-right">Lifetime P/L</th>
            <th class="align-right">Historical Return</th>
            <th class="align-right">Expected</th>
            <th class="align-right">Monthly Plan</th>
          </tr>
        </thead>
        <tbody>
          ${rows.map((row) => `
            <tr>
              <td>
                <span class="table-main">${safe(portfolioScopeLabel(row, rows))}</span>
                <span class="table-sub">${[
                  displayPortfolioId(row.portfolio_id),
                  labelize(row.provider),
                  formatPlural(row.instrument_count || 0, "instrument"),
                ].filter(Boolean).map(safe).join(" · ")}</span>
              </td>
              <td class="align-right">
                <span class="table-main">${formatWholeCurrency(row.current_value_eur || 0, "EUR")}</span>
                <span class="table-sub">current strategy value</span>
              </td>
              <td class="align-right">
                <span class="table-main">${formatWholeCurrency(row.cost_base_eur || 0, "EUR")}</span>
                <span class="table-sub">deployed cost basis</span>
              </td>
              <td class="align-right">
                <span class="table-main ${signedClass(row.profit_loss_eur)}">${signedWholeAmount(row.profit_loss_eur || 0, "EUR")}</span>
                <span class="table-sub">realized + open</span>
              </td>
              <td class="align-right">
                <span class="table-main ${signedClass(row.return_pct)}">${signedPercent(row.return_pct || 0)}</span>
                <span class="table-sub">vs historical cost</span>
              </td>
              <td class="align-right">
                <span class="table-main">${formatPercent(row.expected_cagr_pct || 0)}</span>
                <span class="table-sub">net expected CAGR</span>
              </td>
              <td class="align-right">
                <span class="table-main">${formatWholeCurrency(row.monthly_contribution_eur || 0, "EUR")}</span>
                <span class="table-sub">${row.plan_to_date_eur ? `${formatWholeCurrency(row.plan_to_date_eur, "EUR")} plan to date` : "current phase"}</span>
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </section>
  `;
}

function portfolioMetaLine(row = {}) {
  return [
    row.portfolio_id ? quickFilterControl(row.portfolio_id, displayPortfolioId(row.portfolio_id), { field: "portfolio_id" }) : "",
    row.provider ? quickFilterControl(row.provider, labelize(row.provider), { field: "provider" }) : "",
  ].filter(Boolean).join(" · ");
}

function portfolioNativeValueLabel(row = {}) {
  const currency = String(row.current_value_currency || row.base_currency || "EUR").toUpperCase();
  const eur = moneyRound(row.current_value_eur || 0);
  const native = moneyRound(row.current_value_native || 0);
  if (!currency || currency === "EUR" || Math.abs(native) < 0.01 || Math.abs(eur - native) < 0.01) {
    return "";
  }
  return `${formatWholeCurrency(native, currency)} native`;
}

function portfolioInstrumentTable(rows = []) {
  if (!rows.length) return emptyState("No portfolio instruments match the current search.");
  const allVisibleSelected = rows.length > 0 && rows.every((row) => state.selectedPortfolioInstruments.has(portfolioInstrumentId(row)));
  return `
    <section class="minimal-table-wrap transactions-table-wrap portfolio-table-wrap">
      <table class="minimal-table portfolio-table">
        <thead>
          <tr>
            <th>
              <input
                aria-label="Select visible portfolio instruments"
                data-select-portfolio-page
                type="checkbox"
                ${allVisibleSelected ? "checked" : ""}
              />
            </th>
            <th>Instrument</th>
            <th>Portfolio</th>
            <th class="align-right">Value</th>
            <th class="align-right">Performance</th>
            <th class="align-right">Buy</th>
            <th class="align-right">Allocation</th>
          </tr>
        </thead>
        <tbody>
          ${rows.map((row) => {
            const id = portfolioInstrumentId(row);
            const nativeValueLabel = portfolioNativeValueLabel(row);
            return `
            <tr class="clickable-row ${state.selectedPortfolioInstrumentId === id ? "is-selected" : ""}" data-action="open-portfolio-instrument" data-portfolio-instrument-id="${safe(id)}" tabindex="0">
              <td>
                <input
                  aria-label="Select ${safe(row.ticker || row.asset_name || "portfolio instrument")}"
                  data-portfolio-instrument-select
                  type="checkbox"
                  value="${safe(id)}"
                  ${state.selectedPortfolioInstruments.has(id) ? "checked" : ""}
                />
              </td>
              <td class="portfolio-instrument-cell">${portfolioInstrumentNameCell(row)}</td>
	              <td class="portfolio-book-cell">
		                <span class="table-main">${quickFilterControl(row.portfolio_name || row.portfolio_id, row.portfolio_name || displayPortfolioId(row.portfolio_id))}</span>
		                <span class="table-sub">${portfolioMetaLine(row)}</span>
		              </td>
	              <td class="portfolio-current-value-cell align-right">
	                <span class="table-main">${formatWholeCurrency(row.current_value_eur || 0, "EUR")}</span>
	                ${nativeValueLabel ? `<span class="table-sub">${safe(nativeValueLabel)}</span>` : ""}
              </td>
              <td class="portfolio-performance-cell align-right">
                <span class="table-main ${signedClass(row.achieved_pl_eur)}">${signedWholeAmount(row.achieved_pl_eur || 0, "EUR")}</span>
                <span class="table-sub">${safe(portfolioPerformanceSubLabel(row))}</span>
              </td>
              <td class="portfolio-buy-needed-cell align-right">
                <span class="table-main">${safe(portfolioBuyNeededMainLabel(row))}</span>
                <span class="table-sub">${safe(portfolioBuyNeededSubLabel(row))}</span>
              </td>
	              <td class="portfolio-allocation-cell align-right">
	                <span class="table-main">${safe(portfolioAllocationMainLabel(row))}</span>
	                <span class="table-sub">${safe(portfolioAllocationStatusLabel(row))}</span>
	              </td>
	            </tr>
            `;
          }).join("")}
        </tbody>
      </table>
    </section>
  `;
}

function portfolioInstrumentNameCell(row = {}) {
  const ticker = String(row.ticker || row.symbol || "").trim().toUpperCase();
  const assetName = String(row.asset_name || "").trim();
  if (ticker && ticker !== "N/A") {
    return `
      <span class="table-main">${quickFilterControl(ticker, ticker, { field: "ticker" })}</span>
      ${assetName ? `<span class="table-sub">${quickFilterControl(assetName, assetName, { field: "asset_name" })}</span>` : ""}
    `;
  }
  return `
    <span class="table-main">${quickFilterControl(assetName || "N/A", assetName || "N/A", { field: assetName ? "asset_name" : "ticker" })}</span>
    <span class="table-sub">Ticker N/A</span>
  `;
}

function portfolioInstrumentTableActions() {
  const selected = state.selectedPortfolioInstruments.size;
  const selectionActions = selected ? `
    <span>${formatNumber(selected)} selected</span>
    <button class="table-action-button" data-action="clear-portfolio-selection" type="button">Clear</button>
    <button class="table-action-button" data-action="duplicate-selected-portfolio-instruments" type="button">
      <span data-icon="copy"></span>
      <span>Duplicate</span>
    </button>
    <button class="table-action-button is-danger" data-action="delete-selected-portfolio-instruments" type="button">
      <span data-icon="trash"></span>
      <span>Delete</span>
    </button>
  ` : "";
  return `
    <div class="selection-inline" aria-live="polite">
      ${selectionActions}
      <button class="table-action-button primary-inline-action" data-action="add-portfolio-instrument" type="button">
        <span data-icon="plus"></span>
        <span>Add Instrument</span>
      </button>
    </div>
  `;
}

function currentPortfolioMipRows(portfolio = state.overview?.portfolio || {}) {
  return applyPortfolioMipOverrides(portfolio.portfolios || portfolio.exit_strategy?.plan || [], portfolio.exit_strategy?.phases || []);
}

function applyPortfolioMipOverrides(rows = [], phases = []) {
  const overrides = state.portfolioMipOverrides || {};
  const nextRows = rows.map((row) => {
    const id = portfolioMipId(row);
    return normalizePortfolioMipRow({
      ...row,
      _portfolio_mip_id: id,
      ...(overrides[id] || {}),
    }, phases);
  });
  Object.entries(overrides).forEach(([id, row]) => {
    if (nextRows.some((entry) => portfolioMipId(entry) === id)) return;
    nextRows.push(normalizePortfolioMipRow({
      ...defaultPortfolioMipValues(),
      ...row,
      _portfolio_mip_id: id,
      _is_custom: true,
    }, phases));
  });
  return nextRows;
}

function portfolioMipId(row = {}) {
  return String(row._portfolio_mip_id || [
    row.portfolio_id,
    row.contribution_type,
    row.contribution_role,
  ].filter(Boolean).join("::") || `mip:${Date.now()}`);
}

function normalizePortfolioMipRow(row = {}, phases = []) {
  const phaseIds = portfolioPhaseIds(phases);
  const contributions = { ...(row.phase_contributions || {}) };
  phaseIds.forEach((phaseId) => {
    const value = row[phaseId] ?? contributions[phaseId] ?? 0;
    contributions[phaseId] = numericValue(value);
  });
  const currentPhaseId = currentPortfolioPhaseId();
  return {
    ...row,
    phase_contributions: contributions,
    current_monthly_contribution_eur: moneyRound(contributions[currentPhaseId] ?? row.current_monthly_contribution_eur ?? 0),
  };
}

function portfolioPhaseIds(phases = []) {
  const values = (phases || []).map((phase) => phase.phase_id).filter(Boolean);
  return values.length ? values : ["ph1", "ph2", "ph3", "ph4", "ph5", "ph6"];
}

function currentPortfolioPhaseId() {
  return state.overview?.portfolio?.summary?.current_phase_id || state.overview?.portfolio?.exit_strategy?.current_phase?.phase_id || "ph1";
}

function monthlyMipContributionForPhase(row = {}, phaseId = currentPortfolioPhaseId()) {
  return numericValue(row.phase_contributions?.[phaseId] ?? row[phaseId] ?? 0);
}

function portfolioMipTable(rows = [], phases = []) {
  if (!rows.length) return emptyState("No monthly investment plan rows available.");
  const rowsWithCapital = rows.map((row) => {
    const id = portfolioMipId(row);
    return {
      row,
      id,
      planCapital: portfolioMipPlanCapital(row, phases),
      futurePlanCapital: portfolioMipFuturePlanCapital(row, phases),
    };
  });
  const totalPlanCapital = rowsWithCapital.reduce((sum, item) => sum + numericValue(item.planCapital), 0);
  return `
    <section class="minimal-table-wrap planning-target-table-wrap portfolio-mip-table-wrap">
      <table class="minimal-table planning-target-table portfolio-mip-table">
        <thead>
          <tr>
            <th>Portfolio</th>
            <th>Date Window</th>
            <th class="align-right">Current Monthly Deployment</th>
            <th class="align-right">Total Plan Capital</th>
            <th class="align-right">Weighted Return</th>
          </tr>
        </thead>
        <tbody>
          ${rowsWithCapital.map((item) => {
            const { row, id, planCapital, futurePlanCapital } = item;
            const windowMonths = monthsBetweenInclusive(row.start_date, row.portfolio_exit_date);
            const planShare = percentOf(planCapital, totalPlanCapital);
            return `
	              <tr class="clickable-row ${state.selectedPortfolioMipId === id ? "is-selected" : ""}" data-action="open-portfolio-mip" data-portfolio-mip-id="${safe(id)}" tabindex="0">
		                <td>
		                  <span class="table-main">${safe(row.portfolio_name || displayPortfolioId(row.portfolio_id))}</span>
		                  <span class="table-sub">${[
	                        displayPortfolioId(row.portfolio_id),
	                        labelize(row.provider),
	                        displayContributionType(row.contribution_type || "investment"),
	                        labelize(row.contribution_role || "self"),
	                        formatPlural(row.instrument_count || 0, "instrument"),
                      ].filter(Boolean).map(safe).join(" · ")}</span>
	                </td>
	                <td>
	                  <span class="table-main">${formatDisplayDate(row.start_date)} - ${formatDisplayDate(row.portfolio_exit_date)}</span>
	                  <span class="table-sub">${formatPlural(windowMonths, "month")}</span>
	                </td>
	                <td class="align-right">${formatWholeCurrency(row.current_monthly_contribution_eur || 0, "EUR")}</td>
	                <td class="align-right">
                    <span class="table-main">${formatWholeCurrency(planCapital, "EUR")}</span>
                    <span class="table-sub">${formatPercent(planShare)} of plan · ${formatWholeCurrency(futurePlanCapital, "EUR")} remaining</span>
                  </td>
	                <td class="align-right">${formatPercent(row.weighted_cagr_pct || 0)}</td>
	              </tr>
            `;
          }).join("")}
        </tbody>
      </table>
    </section>
  `;
}

function portfolioMipPlanCapital(row = {}, phases = []) {
  const phaseRows = phases.length
    ? phases
    : [{ phase_id: currentPortfolioPhaseId(), start_date: row.start_date, end_date: row.portfolio_exit_date }];
  const total = phaseRows.reduce((sum, phase) => {
    const months = overlappingMonthsInclusive(row.start_date, row.portfolio_exit_date, phase.start_date, phase.end_date);
    return sum + monthlyMipContributionForPhase(row, phase.phase_id) * months;
  }, 0);
  if (total) return moneyRound(total);
  return moneyRound(numericValue(row.current_monthly_contribution_eur) * monthsBetweenInclusive(row.start_date, row.portfolio_exit_date));
}

function portfolioMipFuturePlanCapital(row = {}, phases = []) {
  const nextMonthStart = `${addMonthsToMonthKey(currentMonthKey(), 1)}-01`;
  const startDate = laterIsoDate(row.start_date, nextMonthStart);
  const phaseRows = phases.length
    ? phases
    : [{ phase_id: currentPortfolioPhaseId(), start_date: startDate, end_date: row.portfolio_exit_date }];
  const total = phaseRows.reduce((sum, phase) => {
    const months = overlappingMonthsInclusive(startDate, row.portfolio_exit_date, phase.start_date, phase.end_date);
    return sum + monthlyMipContributionForPhase(row, phase.phase_id) * months;
  }, 0);
  if (total) return moneyRound(total);
  return moneyRound(numericValue(row.current_monthly_contribution_eur) * monthsBetweenInclusive(startDate, row.portfolio_exit_date));
}

function laterIsoDate(first, second) {
  const firstDate = dateValue(first);
  const secondDate = dateValue(second);
  if (!firstDate) return second;
  if (!secondDate) return first;
  return isoDate(new Date(Math.max(firstDate.getTime(), secondDate.getTime())));
}

function planningExitStrategyDashboard(portfolio = {}) {
  const exitStrategy = portfolio.exit_strategy || {};
  const monteCarlo = portfolio.monte_carlo || {};
  const mipRows = currentPortfolioMipRows(portfolio);
  const phaseRows = exitStrategyPhaseRowsFromMip(exitStrategy.phases || [], mipRows);
  const summary = portfolioSummaryFromRows(portfolio.summary || {}, currentPortfolioInstrumentRows(portfolio), mipRows);
  const currentPhaseDate = formatDisplayDate(exitStrategy.current_phase?.start_date);
  const currentPhaseDetail = [displayPhaseId(summary.current_phase_id), currentPhaseDate].filter(Boolean).join(" · ");
  const simulationBase = numericValue(monteCarlo.base_value_eur ?? summary.current_value_eur);
  const unassignedBase = numericValue(monteCarlo.unassigned_invested_base_eur);
  const simulationBaseDetail = unassignedBase
    ? `${formatWholeCurrency(unassignedBase, "EUR")} unassigned investment base`
    : "mapped strategy instruments";
  return `
    <section class="transaction-metrics planning-target-metrics">
      ${transactionMetric("Current Phase", summary.current_phase_name || "-", currentPhaseDetail)}
      ${transactionMetric("Current Monthly Deployment", formatWholeCurrency(summary.monthly_contribution_eur || 0, "EUR"), "current contribution plan")}
      ${transactionMetric("Target Horizon", formatDisplayDate(summary.strategy_end_date || "2050-12-31"), "exit plan end date")}
      ${transactionMetric("Strategy Base", formatWholeCurrency(simulationBase, "EUR"), simulationBaseDetail)}
    </section>
    <section class="planning-target-grid exit-strategy-grid">
      ${panel("Exit Strategy", exitStrategyPhaseTable(phaseRows), "full")}
    </section>
    ${exitStrategyPhaseDetailsPanel(phaseRows)}
  `;
}

function planningMonthlyInvestmentDashboard(portfolio = {}) {
  const exitStrategy = portfolio.exit_strategy || {};
  const mipRows = currentPortfolioMipRows(portfolio);
  const instruments = currentPortfolioInstrumentRows(portfolio);
  const summary = portfolioSummaryFromRows(portfolio.summary || {}, instruments, mipRows);
  const weightedReturn = monteCarloWeightedReturn(instruments);
  return `
    <section class="transaction-metrics planning-target-metrics">
      ${transactionMetric("Current Monthly Deployment", formatWholeCurrency(summary.monthly_contribution_eur || 0, "EUR"), "current contribution plan")}
      ${transactionMetric("Portfolios", formatNumber(mipRows.length), `${formatNumber(summary.instruments || 0)} instruments`)}
      ${transactionMetric("Weighted Return", formatPercent(weightedReturn || 0), "instrument expectation")}
      ${transactionMetric("Target Horizon", formatDisplayDate(summary.strategy_end_date || "2050-12-31"), "plan end date")}
    </section>
    <section class="planning-target-grid exit-strategy-grid">
      ${panel("Monthly Investment Plan", portfolioMipTable(mipRows, exitStrategy.phases || []), "full", portfolioMipTableActions())}
    </section>
    ${portfolioMipDetailsPanel(mipRows, exitStrategy.phases || [])}
  `;
}

function portfolioMipTableActions() {
  return `
    <div class="selection-inline" aria-live="polite">
      <button class="table-action-button primary-inline-action" data-action="add-portfolio-mip" type="button">
        <span data-icon="plus"></span>
        <span>Add Portfolio</span>
      </button>
    </div>
  `;
}

function exitStrategyPhaseRowsFromMip(phases = [], mipRows = []) {
  let cumulative = 0;
  return (phases || []).map((phase) => {
    const months = numericValue(phase.months, monthsBetweenInclusive(phase.start_date, phase.end_date));
    const monthly = mipRows.reduce((sum, row) => sum + monthlyMipContributionForPhase(row, phase.phase_id), 0);
    const phaseCapital = monthly * months;
    cumulative += phaseCapital;
    return {
      ...phase,
      months,
      monthly_contribution_eur: moneyRound(monthly),
      phase_contribution_eur: moneyRound(phaseCapital),
      cumulative_contribution_eur: moneyRound(cumulative),
    };
  });
}

function monthsBetweenInclusive(startDate, endDate) {
  const start = new Date(`${startDate || ""}T00:00:00`);
  const end = new Date(`${endDate || ""}T00:00:00`);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return 0;
  return Math.max(0, (end.getFullYear() - start.getFullYear()) * 12 + end.getMonth() - start.getMonth() + 1);
}

function overlappingMonthsInclusive(startA, endA, startB, endB) {
  const startOne = dateValue(startA);
  const endOne = dateValue(endA);
  const startTwo = dateValue(startB);
  const endTwo = dateValue(endB);
  if (!startOne || !endOne || !startTwo || !endTwo) return 0;
  const start = new Date(Math.max(startOne.getTime(), startTwo.getTime()));
  const end = new Date(Math.min(endOne.getTime(), endTwo.getTime()));
  if (start > end) return 0;
  return monthsBetweenInclusive(isoDate(start), isoDate(end));
}

function dateValue(value) {
  const date = new Date(`${value || ""}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function exitStrategyPhaseTable(rows = []) {
  if (!rows.length) return emptyState("No exit phases available.");
  return `
    <section class="minimal-table-wrap planning-target-table-wrap">
      <table class="minimal-table planning-target-table">
        <thead>
          <tr>
            <th>Phase</th>
            <th>Date Window</th>
            <th class="align-right">Monthly Deployment</th>
            <th class="align-right">Phase Capital</th>
            <th class="align-right">Cumulative Capital</th>
          </tr>
        </thead>
        <tbody>
          ${rows.map((row) => `
            <tr class="clickable-row ${state.selectedExitPhaseId === row.phase_id ? "is-selected" : ""}" data-action="open-exit-phase" data-exit-phase-id="${safe(row.phase_id)}" tabindex="0">
	              <td>
	                <span class="table-main">${safe(row.phase_name)}</span>
	                <span class="table-sub">${safe(displayPhaseId(row.phase_id))}</span>
	              </td>
              <td>
                <span class="table-main">${formatDisplayDate(row.start_date)} - ${formatDisplayDate(row.end_date)}</span>
                <span class="table-sub">${formatPlural(row.months || 0, "month")}</span>
              </td>
              <td class="align-right">${formatWholeCurrency(row.monthly_contribution_eur || 0, "EUR")}</td>
              <td class="align-right">${formatWholeCurrency(row.phase_contribution_eur || 0, "EUR")}</td>
              <td class="align-right">${formatWholeCurrency(row.cumulative_contribution_eur || 0, "EUR")}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </section>
  `;
}

function portfolioPlanBars(rows = []) {
  const maxValue = Math.max(1, ...rows.map((row) => numericValue(row.current_value_eur) + numericValue(row.current_monthly_contribution_eur) * 12));
  return insightBars(
    rows.map((row) => ({
      label: portfolioScopeLabel(row, rows),
      value: formatWholeCurrency(row.current_value_eur || 0, "EUR"),
      detail: `${labelize(row.provider)} · ${formatWholeCurrency(row.current_monthly_contribution_eur || 0, "EUR")}/mo · ${formatPercent(row.weighted_cagr_pct || 0)} return`,
      icon: insightIconFor(row.contribution_type || "investment", "account-type"),
      share: percentOf(numericValue(row.current_value_eur) + numericValue(row.current_monthly_contribution_eur) * 12, maxValue),
    })),
    "No portfolio plan rows available.",
  );
}

function phaseCapitalBars(rows = []) {
  const maxValue = Math.max(1, ...rows.map((row) => numericValue(row.p50_eur)));
  return insightBars(
    rows.map((row) => ({
      label: row.phase_name || displayPhaseId(row.phase_id),
      value: formatWholeCurrency(row.p50_eur || 0, "EUR"),
      detail: `${formatWholeCurrency(row.p10_eur || 0, "EUR")} low · ${formatWholeCurrency(row.p90_eur || 0, "EUR")} high`,
      icon: "target",
      share: percentOf(row.p50_eur || 0, maxValue),
    })),
    "No phase simulation available.",
  );
}

function reportHistoryOptions() {
  return [
    { value: "1d", label: "1D" },
    { value: "7d", label: "7D" },
    { value: "1", label: "1M" },
    { value: "3", label: "3M" },
    { value: "6", label: "6M" },
    { value: "12", label: "1Y" },
    { value: "24", label: "2Y" },
    { value: "36", label: "3Y" },
    { value: "60", label: "5Y" },
    { value: "180", label: "15Y" },
    { value: "all", label: "All" },
  ];
}

function netWorthHistoryOptions() {
  return reportHistoryOptions().filter((option) => !["1d", "7d"].includes(option.value));
}

function reportForecastOptions() {
  return [
    { value: "1m", label: "1M" },
    { value: "3m", label: "3M" },
    { value: "6m", label: "6M" },
    { value: "1", label: "1Y" },
    { value: "2", label: "2Y" },
    { value: "3", label: "3Y" },
    { value: "5", label: "5Y" },
    { value: "10", label: "10Y" },
    { value: "15", label: "15Y" },
  ];
}

function dataAttributeName(dataKey = "") {
  return String(dataKey || "")
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .toLowerCase();
}

function compactChartPeriodControl(control = {}) {
  const action = control.action || "";
  const dataKey = control.dataKey || "";
  const options = Array.isArray(control.options) ? control.options : [];
  if (!action || !dataKey || !options.length) return "";
  const selectedValue = String(control.selectedValue ?? "");
  const dataAttribute = dataAttributeName(dataKey);
  return `
    <div class="chart-compact-period" role="group" aria-label="${safe(control.ariaLabel || "Chart period")}">
      ${options.map((option) => {
        const value = String(option.value);
        return `
          <button
            class="${selectedValue === value ? "is-active" : ""}"
            data-action="${safe(action)}"
            data-${safe(dataAttribute)}="${safe(value)}"
            type="button"
          >${safe(option.label)}</button>
        `;
      }).join("")}
    </div>
  `;
}

function reportChartSelector(action, dataKey, selectedValue, options = [], ariaLabel = "Chart period") {
  const dataAttribute = dataAttributeName(dataKey);
  return `
    <div class="report-chart-selector" role="group" aria-label="${safe(ariaLabel)}">
      ${options.map((option) => {
        const value = String(option.value);
        return `
          <button
            class="${String(selectedValue) === value ? "is-active" : ""}"
            data-action="${safe(action)}"
            data-${safe(dataAttribute)}="${safe(value)}"
            type="button"
          >${safe(option.label)}</button>
        `;
      }).join("")}
    </div>
  `;
}

function chartControlCluster(label = "", controlHtml = "") {
  if (!controlHtml) return "";
  return `
    <div class="chart-control-cluster">
      <span>${safe(label)}</span>
      ${controlHtml}
    </div>
  `;
}

function normalizedReportHistoryWindow(field = "reportNetWorthWindow") {
  const selected = String(state[field] || "all");
  const options = field === "reportCashFlowWindow"
    ? reportCashFlowHistoryOptions()
    : field === "reportNetWorthWindow"
      ? netWorthHistoryOptions()
      : reportHistoryOptions();
  return options.some((option) => option.value === selected) ? selected : "all";
}

function reportHistoryMonthCount(historyWindow = "all", options = {}) {
  const value = String(historyWindow || "all");
  if (value === "all") return Infinity;
  if (value === "1d" || value === "7d") return 2;
  const minimumMonths = Math.max(1, Math.round(numericValue(options.minimumMonths, 2)));
  return Math.max(minimumMonths, numericValue(value, 36));
}

function reportCashFlowHistoryOptions() {
  return reportHistoryOptions().filter((option) => !["1d", "7d"].includes(option.value));
}

function monthlyTrendHistoryOptions() {
  return reportCashFlowHistoryOptions().filter((option) => option.value !== "1");
}

function normalizedReportForecastYears() {
  const selected = String(state.reportForecastYears || "10");
  const option = reportForecastOptions().find((entry) => entry.value === selected);
  return option?.value || "10";
}

function normalizedForecastMonthCount(forecastYears) {
  const value = String(forecastYears || "10").trim().toLowerCase();
  const months = value.endsWith("m")
    ? numericValue(value.replace("m", ""), 1)
    : numericValue(value, 10) * 12;
  return Math.max(1, Math.min(180, Math.round(months)));
}

function monteCarloWindowOptions() {
  return [
    { value: "1", label: "1Y" },
    { value: "2", label: "2Y" },
    { value: "3", label: "3Y" },
    { value: "5", label: "5Y" },
    { value: "10", label: "10Y" },
    { value: "15", label: "15Y" },
    { value: "plan", label: "Plan" },
  ];
}

function normalizedMonteCarloWindow() {
  const selected = String(state.monteCarloWindow || "plan");
  return monteCarloWindowOptions().some((option) => option.value === selected) ? selected : "plan";
}

function monteCarloVisiblePoints(points = []) {
  const selected = normalizedMonteCarloWindow();
  if (selected === "plan") return points;
  return points.slice(0, normalizedForecastMonthCount(Number(selected)) + 1);
}

function optionalPercentValue(value) {
  if (value === null || value === undefined || value === "") return null;
  const raw = String(value).replace("%", "").replace(/,/g, "").trim();
  if (!raw) return null;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : null;
}

function percentNumericValue(value, fallback = 0) {
  const parsed = optionalPercentValue(value);
  return parsed === null ? fallback : parsed;
}

function monteCarloScopeOptions(portfolio = {}) {
  const instruments = currentPortfolioInstrumentRows(portfolio);
  const mipRows = currentPortfolioMipRows(portfolio);
  const portfolioOptions = new Map();
  mipRows.forEach((row) => {
    const id = String(row.portfolio_id || "").trim();
    if (!id || portfolioOptions.has(id)) return;
    portfolioOptions.set(id, portfolioScopeLabel(row, mipRows));
  });
  instruments.forEach((row) => {
    const id = String(row.portfolio_id || "").trim();
    if (!id || portfolioOptions.has(id)) return;
    portfolioOptions.set(id, portfolioScopeLabel(row, mipRows));
  });

  const instrumentOptions = instruments.map((row) => {
    const id = portfolioInstrumentId(row);
    const symbol = row.ticker && row.ticker !== "N/A" ? row.ticker : row.asset_name || id;
    const portfolioLabel = row.portfolio_name || displayPortfolioId(row.portfolio_id) || "";
    return {
      value: `instrument:${id}`,
      label: `${symbol}${portfolioLabel ? ` · ${portfolioLabel}` : ""}`,
    };
  });

  return [
    { value: "plan", label: "Plan" },
    ...Array.from(portfolioOptions.entries()).map(([id, label]) => ({
      value: `portfolio:${id}`,
      label,
    })),
    ...instrumentOptions,
  ];
}

function normalizedMonteCarloScope(portfolio = {}) {
  const selected = String(state.monteCarloScope || "plan");
  return monteCarloScopeOptions(portfolio).some((option) => option.value === selected) ? selected : "plan";
}

function monteCarloScopeSelect(portfolio = {}, selected = normalizedMonteCarloScope(portfolio)) {
  const options = monteCarloScopeOptions(portfolio);
  if (options.length <= 1) return "";
  return `
    <select class="report-chart-select" data-monte-carlo-scope aria-label="Simulation scope">
      ${options.map((option) => `
        <option value="${safe(option.value)}" ${option.value === selected ? "selected" : ""}>${safe(option.label)}</option>
      `).join("")}
    </select>
  `;
}

function monteCarloScopeRows(portfolio = {}, selected = "plan") {
  const allInstruments = currentPortfolioInstrumentRows(portfolio);
  const allMipRows = currentPortfolioMipRows(portfolio);

  if (selected.startsWith("portfolio:")) {
    const portfolioId = selected.slice("portfolio:".length);
    const instruments = allInstruments.filter((row) => String(row.portfolio_id || "") === portfolioId);
    const mipRows = allMipRows.filter((row) => String(row.portfolio_id || "") === portfolioId);
    const label = mipRows[0] ? portfolioScopeLabel(mipRows[0], allMipRows) : instruments[0]?.portfolio_name || displayPortfolioId(portfolioId);
    return { contributionMultiplier: 1, instruments, mipRows, scopeLabel: label };
  }

  if (selected.startsWith("instrument:")) {
    const instrumentId = selected.slice("instrument:".length);
    const instrument = allInstruments.find((row) => portfolioInstrumentId(row) === instrumentId);
    if (instrument) {
      const portfolioId = String(instrument.portfolio_id || "");
      const portfolioInstruments = allInstruments.filter((row) => String(row.portfolio_id || "") === portfolioId);
      const targetTotal = portfolioInstruments.reduce((sum, row) => sum + numericValue(row.target_allocation_pct), 0);
      const valueTotal = portfolioInstruments.reduce((sum, row) => sum + numericValue(row.current_value_eur), 0);
      const targetShare = targetTotal ? numericValue(instrument.target_allocation_pct) / targetTotal : 0;
      const valueShare = valueTotal ? numericValue(instrument.current_value_eur) / valueTotal : 0;
      const contributionMultiplier = clampValue(targetShare || valueShare || 1, 0, 1);
      return {
        contributionMultiplier,
        instruments: [instrument],
        mipRows: allMipRows.filter((row) => String(row.portfolio_id || "") === portfolioId),
        scopeLabel: instrument.ticker && instrument.ticker !== "N/A" ? instrument.ticker : instrument.asset_name || "Instrument",
      };
    }
  }

  return {
    contributionMultiplier: 1,
    instruments: allInstruments,
    mipRows: allMipRows,
    scopeLabel: "Plan",
  };
}

function portfolioScopeLabel(row = {}, rows = []) {
  const id = String(row.portfolio_id || "").trim();
  const base = row.portfolio_name || displayPortfolioId(id) || "Portfolio";
  const duplicateName = rows.filter((entry) => String(entry.portfolio_name || "").trim() === String(row.portfolio_name || "").trim()).length > 1;
  if (!duplicateName) return base;
  const role = contributionRoleLabel(row);
  return role ? `${base} - ${role}` : `${base} - ${displayPortfolioId(id)}`;
}

function contributionRoleLabel(row = {}) {
  const role = String(row.contribution_role || "").trim().toLowerCase();
  const type = String(row.contribution_type || "").trim().toLowerCase();
  if (type === "pension" && role === "self") return "Employee";
  if (!role) return "";
  return labelize(role);
}

function monteCarloInstrumentReturn(row = {}) {
  const explicit = optionalPercentValue(row.net_expected_cagr_pct);
  if (explicit !== null) return clampValue(explicit, -20, 30);
  const gross = percentNumericValue(row.expected_cagr_pct, 5);
  const fees = percentNumericValue(row.total_fees_pct, 0);
  return clampValue(gross - fees, -20, 30);
}

function monteCarloInstrumentVolatility(row = {}) {
  const explicit = optionalPercentValue(row.expected_volatility_pct);
  if (explicit !== null) return clampValue(explicit, 2, 60);
  const text = `${row.asset_class || ""} ${row.asset_bucket || ""} ${row.asset_name || ""}`.toLowerCase();
  if (text.includes("pension") || text.includes("insurance")) return 6;
  if (text.includes("global equity") || text.includes("all-world")) return 14;
  if (
    text.includes("nasdaq")
    || text.includes("tech")
    || text.includes("semiconductor")
    || text.includes("robot")
    || text.includes("uranium")
    || text.includes("nuclear")
    || text.includes("quantum")
    || text.includes("data center")
    || text.includes("defence")
  ) return 24;
  return 12;
}

function monteCarloWeightedMetric(instruments = [], metricFn = () => 0, fallback = 0) {
  const rows = instruments.filter(Boolean);
  if (!rows.length) return fallback;
  const valueTotal = rows.reduce((sum, row) => sum + Math.max(0, numericValue(row.current_value_eur)), 0);
  const targetTotal = rows.reduce((sum, row) => sum + Math.max(0, numericValue(row.target_allocation_pct)), 0);
  let weightTotal = 0;
  const weighted = rows.reduce((sum, row) => {
    const weight = valueTotal
      ? Math.max(0, numericValue(row.current_value_eur))
      : Math.max(0, numericValue(row.target_allocation_pct));
    weightTotal += weight;
    return sum + metricFn(row) * weight;
  }, 0);
  const divisor = weightTotal || targetTotal || rows.length;
  if (!divisor) return fallback;
  return weightTotal ? weighted / divisor : average(rows.map(metricFn));
}

function monteCarloWeightedReturn(instruments = []) {
  return monteCarloWeightedMetric(instruments, monteCarloInstrumentReturn, 5);
}

function monteCarloWeightedVolatility(instruments = []) {
  return monteCarloWeightedMetric(instruments, monteCarloInstrumentVolatility, 14);
}

function monthKeyFromDate(value, fallback = currentMonthKey()) {
  const raw = String(value || "").trim();
  const match = raw.match(/^(\d{4})-(\d{2})/);
  return match ? `${match[1]}-${match[2]}` : fallback;
}

function monthKeyDistance(startMonth, endMonth) {
  const [startYear, start] = String(startMonth || currentMonthKey()).split("-").map(Number);
  const [endYear, end] = String(endMonth || startMonth || currentMonthKey()).split("-").map(Number);
  if (!startYear || !start || !endYear || !end) return 0;
  return (endYear - startYear) * 12 + (end - start);
}

function monteCarloHorizonMonths(mipRows = [], phases = []) {
  const current = currentMonthKey();
  const planExitMonths = mipRows
    .map((row) => monthKeyFromDate(row.portfolio_exit_date || row.mip_phase_end_date_target, ""))
    .filter(Boolean);
  const phaseExitMonths = phases.map((phase) => monthKeyFromDate(phase.end_date, "")).filter(Boolean);
  const exitMonths = planExitMonths.length ? planExitMonths : phaseExitMonths;
  const target = exitMonths.length ? exitMonths.sort().at(-1) : addMonthsToMonthKey(current, 120);
  return Math.max(12, monthKeyDistance(current, target));
}

function phaseIdForMonthKey(phases = [], monthKey = currentMonthKey()) {
  const found = phases.find((phase) => {
    const start = monthKeyFromDate(phase.start_date, "0000-01");
    const end = monthKeyFromDate(phase.end_date, "9999-12");
    return monthKey >= start && monthKey <= end;
  });
  return found?.phase_id || currentPortfolioPhaseId();
}

function monteCarloContributionForMonth(mipRows = [], phases = [], monthKey = currentMonthKey(), multiplier = 1) {
  const phaseId = phaseIdForMonthKey(phases, monthKey);
  return mipRows.reduce((sum, row) => {
    const start = monthKeyFromDate(row.start_date, "0000-01");
    const exit = monthKeyFromDate(row.portfolio_exit_date, "9999-12");
    if (monthKey < start || monthKey > exit) return sum;
    return sum + (monthlyMipContributionForPhase(row, phaseId) * multiplier);
  }, 0);
}

function backendMonteCarloProjectionModel(portfolio = {}) {
  const source = portfolio.monte_carlo || {};
  const rows = Array.isArray(source.points) ? source.points : [];
  if (rows.length < 2) return null;
  const base = Math.max(0, numericValue(source.base_value_eur || rows[0]?.p50));
  let plannedContributions = 0;
  const points = rows.map((row, index) => {
    if (index > 0) plannedContributions += numericValue(row.contribution_eur);
    return {
      month: row.month,
      invested: moneyRound(plannedContributions),
      p10: moneyRound(numericValue(row.p10)),
      p50: moneyRound(numericValue(row.p50)),
      p90: moneyRound(numericValue(row.p90)),
    };
  });
  return {
    expected_return_pct: numericValue(source.expected_return_pct),
    expected_volatility_pct: numericValue(source.expected_volatility_pct),
    points,
    scope_label: "Plan",
    starting_base_eur: base,
    actual_invested_base_eur: numericValue(source.actual_invested_base_eur),
    unassigned_invested_base_eur: numericValue(source.unassigned_invested_base_eur),
    correlation_model: source.correlation_model || "",
    simulation_count: numericValue(source.simulation_count || 0),
    simulation_kind: "stochastic",
  };
}

function monteCarloProjectionModel(portfolio = {}, selectedScope = normalizedMonteCarloScope(portfolio)) {
  if (selectedScope === "plan") {
    const backendModel = backendMonteCarloProjectionModel(portfolio);
    if (backendModel) return backendModel;
  }
  const phases = portfolio.exit_strategy?.phases || [];
  const scope = monteCarloScopeRows(portfolio, selectedScope);
  const summary = portfolioSummaryFromRows(portfolio.summary || {}, scope.instruments, scope.mipRows);
  const fullSummary = portfolioSummaryFromRows(portfolio.summary || {}, currentPortfolioInstrumentRows(portfolio), currentPortfolioMipRows(portfolio));
  const scopedValue = scope.instruments.reduce((sum, row) => sum + numericValue(row.current_value_eur), 0);
  const strategyBase = numericValue(summary.current_value_eur || fullSummary.current_value_eur || scopedValue);
  const base = selectedScope === "plan"
    ? strategyBase
    : scopedValue;
  const expectedReturnPct = monteCarloWeightedReturn(scope.instruments);
  const volatilityPct = monteCarloWeightedVolatility(scope.instruments);
  const monthlyReturn = monthlyRateFromAnnual(expectedReturnPct / 100);
  const months = monteCarloHorizonMonths(scope.mipRows, phases);
  const points = [];
  let p50 = Math.max(0, base);
  let plannedContributions = 0;

  for (let index = 0; index <= months; index += 1) {
    const month = addMonthsToMonthKey(currentMonthKey(), index);
    const years = index / 12;
    const band = clampValue((volatilityPct / 100) * Math.sqrt(Math.max(0.08, years)) * 0.52, 0.02, 0.74);
    points.push({
      month,
      invested: moneyRound(plannedContributions),
      p10: moneyRound(Math.max(0, p50 * (1 - band))),
      p50: moneyRound(p50),
      p90: moneyRound(p50 * (1 + band)),
    });

    if (index === months) continue;
    const nextMonth = addMonthsToMonthKey(currentMonthKey(), index + 1);
    const contribution = monteCarloContributionForMonth(scope.mipRows, phases, nextMonth, scope.contributionMultiplier);
    plannedContributions = Math.max(0, plannedContributions + contribution);
    p50 = Math.max(0, (p50 * (1 + monthlyReturn)) + contribution);
  }

  return {
    expected_return_pct: expectedReturnPct,
    points,
    scope_label: scope.scopeLabel,
    starting_base_eur: base,
    simulation_count: 0,
    simulation_kind: "projection_band",
  };
}

function reportCashFlowChart(transactions = {}, options = {}) {
  const expanded = Boolean(options.expanded);
  const chartId = options.chartId || "";
  const historyWindow = normalizedReportHistoryWindow("reportCashFlowWindow");
  const points = reportCashFlowPoints(transactions, historyWindow);
  if (!points.length) return emptyState("No cash flow data available.");
  const chartModel = cashFlowChartModel(points);
  const last = points[points.length - 1];
  const periodLabel = reportPointRangeLabel(points);
  const incomeInView = points.reduce((sum, point) => sum + numericValue(point.income), 0);
  const expenseInView = points.reduce((sum, point) => sum + numericValue(point.expense), 0);
  const retainedInView = incomeInView - expenseInView;
  const expenseRatio = percentOf(expenseInView, incomeInView);
  if (!expanded) {
    return compactChartCard({
      chartId,
      expandLabel: "Expand cash flow",
      icon: "currency",
      label: "Cash Flow",
      value: signedWholeAmount(retainedInView, "EUR"),
      meta: `${formatWholeCurrency(incomeInView, "EUR")} income · ${formatWholeCurrency(expenseInView, "EUR")} expenses`,
      chartPoints: points.map((point) => ({
        ...point,
        value: point.net,
      })),
      chart: {
        ariaLabel: "Cash flow",
        className: "net",
        tooltipFormatter: cashFlowTooltip,
        xLabelFormatter: cashFlowAxisLabel,
      },
      periodControl: {
        action: "report-cash-flow-window",
        dataKey: "reportCashFlowWindow",
        selectedValue: String(historyWindow),
        options: reportCashFlowHistoryOptions(),
        ariaLabel: "Cash flow period",
      },
      metrics: [
        { value: formatWholeCurrency(incomeInView, "EUR"), label: "income" },
        { value: formatWholeCurrency(expenseInView, "EUR"), label: "expenses" },
        { value: signedWholeAmount(last.net, "EUR"), label: "latest net" },
      ],
      note: `${periodLabel} · ${formatPlural(points.length, "month")}`,
    });
  }
  const partialNote = chartModel.note
    ? `<p class="report-chart-note">${safe(chartModel.note)}</p>`
    : "";
  return `
    <div class="report-chart-summary">
      <div class="report-chart-summary-main">
        <span>${safe(periodLabel)}</span>
        <strong>${signedWholeAmount(retainedInView, "EUR")}</strong>
        <em>${formatWholeCurrency(incomeInView, "EUR")} income · ${formatWholeCurrency(expenseInView, "EUR")} expenses · ${formatPercent(expenseRatio)} expense ratio</em>
      </div>
      <div class="report-chart-actions">
        ${chartControlCluster(
          "Period",
          reportChartSelector("report-cash-flow-window", "reportCashFlowWindow", String(historyWindow), reportCashFlowHistoryOptions(), "Cash flow period"),
        )}
      </div>
    </div>
    ${chartDetailGrid([
      { label: "Income In View", value: formatWholeCurrency(incomeInView, "EUR"), detail: formatPlural(points.length, "month") },
      { label: "Expenses In View", value: formatWholeCurrency(expenseInView, "EUR"), detail: `${formatPercent(expenseRatio)} of income` },
      { label: "Retained In View", value: signedWholeAmount(retainedInView, "EUR"), detail: `${formatPercent(percentOf(retainedInView, incomeInView))} retained` },
      { label: "Latest Month", value: signedWholeAmount(last.net, "EUR"), detail: monthLabel(last.label) },
    ])}
    ${reportCashFlowLineChart(chartModel.points, { expanded: true })}
    ${partialNote}
    ${cashFlowContextLineControls(points)}
  `;
}

function reportPointRangeLabel(points = []) {
  const first = points[0];
  const last = points[points.length - 1];
  const firstLabel = monthLabel(first?.label || first?.month || "");
  const lastLabel = monthLabel(last?.label || last?.month || "");
  if (!firstLabel || firstLabel === lastLabel) return lastLabel || firstLabel || "";
  return `${firstLabel} - ${lastLabel}`;
}

function reportCashFlowPoints(transactions = {}, historyWindow = "36") {
  const yearlyTargets = new Map((transactions.yearly_targets || []).map((row) => [String(row.year), row]));
  const monthlyTargets = new Map((transactions.monthly_targets || []).map((row) => [row.month, row]));
  const points = (transactions.monthly_series || [])
    .filter((row) => row?.month)
    .map((row) => {
      const income = numericValue(row.income_eur);
      const expense = numericValue(row.expense_eur);
      const monthlyTarget = monthlyTargets.get(row.month) || {};
      const yearlyTarget = yearlyTargets.get(String(row.month).slice(0, 4)) || {};
      const yearExpensePct = numericValue(yearlyTarget.expense_target_pct);
      const annualIncomeBaseline = numericValue(yearlyTarget.income_baseline_eur);
      const annualExpenseCeiling = numericValue(yearlyTarget.expense_ceiling_eur);
      const plannedIncome = numericValue(monthlyTarget.income_target_eur || monthlyTarget.income_baseline_eur)
        || (annualIncomeBaseline ? annualIncomeBaseline / 12 : income);
      const plannedExpense = numericValue(monthlyTarget.expense_ceiling_eur)
        || (annualExpenseCeiling ? annualExpenseCeiling / 12 : plannedIncome * yearExpensePct / 100);
      return {
        label: row.month,
        income,
        expense,
        net: income - expense,
        planned_income: plannedIncome,
        planned_expense: plannedExpense,
      };
    });
  const monthCount = reportHistoryMonthCount(historyWindow, { minimumMonths: 1 });
  return monthCount === Infinity ? points : points.slice(-monthCount);
}

function cashFlowChartModel(points = []) {
  if (points.length > 96) {
    const aggregated = aggregateCashFlowPoints(points, "year");
    const partial = aggregated[aggregated.length - 1];
    return {
      points: aggregated,
      note: partial?.is_partial
        ? `${cashFlowBucketLabel(partial.label, "year")} is partial (${formatPlural(partial.source_count, "month")} of 12), so the latest annual point is not annualized.`
        : "",
    };
  }
  if (points.length > 48) {
    const aggregated = aggregateCashFlowPoints(points, "quarter");
    const partial = aggregated[aggregated.length - 1];
    return {
      points: aggregated,
      note: partial?.is_partial
        ? `${cashFlowBucketLabel(partial.label, "quarter")} is partial (${formatPlural(partial.source_count, "month")} of 3), so the latest quarterly point is not annualized.`
        : "",
    };
  }
  return { points, note: "" };
}

function aggregateCashFlowPoints(points = [], granularity = "year") {
  const buckets = new Map();
  points.forEach((point) => {
    const key = cashFlowBucketKey(point.label, granularity);
    if (!key) return;
    const bucket = buckets.get(key) || {
      label: key,
      income: 0,
      expense: 0,
      planned_income: 0,
      planned_expense: 0,
      source_count: 0,
    };
    bucket.income += numericValue(point.income);
    bucket.expense += numericValue(point.expense);
    bucket.planned_income += numericValue(point.planned_income);
    bucket.planned_expense += numericValue(point.planned_expense);
    bucket.source_count += 1;
    buckets.set(key, bucket);
  });
  return [...buckets.values()]
    .sort((a, b) => String(a.label).localeCompare(String(b.label)))
    .map((bucket) => {
      const income = bucket.income;
      const expense = bucket.expense;
      const expectedCount = granularity === "quarter" ? 3 : 12;
      return {
        ...bucket,
        income,
        expense,
        planned_income: bucket.planned_income,
        planned_expense: bucket.planned_expense,
        net: income - expense,
        expected_count: expectedCount,
        is_partial: bucket.source_count < expectedCount,
        period_label: cashFlowBucketLabel(bucket.label, granularity),
      };
    });
}

function cashFlowBucketKey(label = "", granularity = "year") {
  const [year, month] = String(label || "").split("-").map(Number);
  if (!year || !month) return "";
  if (granularity === "quarter") {
    return `${year}-Q${Math.floor((month - 1) / 3) + 1}`;
  }
  return String(year);
}

function cashFlowBucketLabel(label = "", granularity = "year") {
  if (granularity === "quarter") {
    return String(label).replace("-", " ");
  }
  return String(label);
}

function cashFlowAxisLabel(point = {}) {
  const label = typeof point === "string" ? point : String(point.label || "");
  if (/^\d{4}$/.test(label)) return label;
  const quarter = label.match(/^(\d{4})-Q([1-4])$/);
  if (quarter) return `Q${quarter[2]} ${quarter[1]}`;
  return shortMonthLabel(label);
}

function cashFlowTooltip(point = {}, context = {}) {
  const seriesId = context.series?.id || "";
  const incomeShare = ["expense", "plan-expense"].includes(seriesId)
    ? ` · ${formatPercent(percentOf(point.value || 0, point.income || 0))} of income`
    : "";
  const period = point.period_label || monthLabel(point.label || "");
  const partialNote = point.is_partial
    ? `${formatPlural(point.source_count, "month")} in partial period`
    : "";
  return [
    period,
    `${context.series?.label || "Value"}: ${formatWholeCurrency(point.value || 0, "EUR")}${incomeShare}`,
    partialNote,
  ].filter(Boolean).join("\n");
}

function cashFlowLineDefinitions() {
  return [
    { id: "income", label: "Income", field: "income", detail: "actual inflow", group: "Actuals" },
    { id: "expense", label: "Expenses", field: "expense", detail: "actual spend", group: "Actuals" },
    { id: "net", label: "Net cash flow", field: "net", detail: "income minus expenses", group: "Actuals" },
    { id: "plan-income", label: "Planned income", field: "planned_income", detail: "target inflow", group: "Plan" },
    { id: "plan-expense", label: "Planned expenses", field: "planned_expense", detail: "target spend", group: "Plan" },
  ];
}

function activeCashFlowLineIds() {
  if (!(state.cashFlowContextLines instanceof Set) || !state.cashFlowContextLines.size) {
    state.cashFlowContextLines = new Set(["income", "expense"]);
  }
  return state.cashFlowContextLines;
}

function cashFlowLineSeries(points = []) {
  const active = activeCashFlowLineIds();
  return cashFlowLineDefinitions()
    .filter((definition) => active.has(definition.id))
    .map((definition) => ({
      id: definition.id,
      label: definition.label,
      points: points.map((point) => ({
        label: point.label,
        income: numericValue(point.income),
        is_partial: Boolean(point.is_partial),
        period_label: point.period_label,
        source_count: numericValue(point.source_count),
        value: numericValue(point[definition.field]),
      })),
    }));
}

function cashFlowContextLineControls(points = []) {
  const items = cashFlowLineDefinitions().map((definition) => ({
    id: definition.id,
    label: definition.label,
    value: points.reduce((sum, point) => sum + numericValue(point[definition.field]), 0),
    detail: definition.detail,
    group: definition.group,
  }));
  return chartLineToggleGroups([
    { label: "Actuals", items: items.filter((item) => item.group === "Actuals") },
    { label: "Plan", items: items.filter((item) => item.group === "Plan") },
  ], activeCashFlowLineIds(), "toggle-cash-flow-context-line", "Cash flow chart lines");
}

function reportCashFlowLineChart(points = [], options = {}) {
  const expanded = Boolean(options.expanded);
  const width = expanded ? 1120 : 760;
  const height = expanded ? 420 : 280;
  const series = cashFlowLineSeries(points);
  const active = activeCashFlowLineIds();
  if (!series.length) return emptyState("Select at least one cash flow line.");
  return standardLineChart({
    ariaLabel: "Cash flow",
    className: `report-cash-flow-chart${expanded ? " expanded-chart" : ""}`,
    currency: "EUR",
    height,
    labelIndexes: standardChartLabelIndexes(points.length, 4),
    padding: { top: 18, right: 18, bottom: 38, left: 70 },
    series,
    showLastDot: true,
    tickCount: 4,
    tooltipFormatter: cashFlowTooltip,
    width,
    xLabelFormatter: cashFlowAxisLabel,
    yMin: active.has("net") ? undefined : 0,
  });
}

function planningMonteCarloChart(portfolio = {}, accounts = {}, options = {}) {
  const expanded = Boolean(options.expanded);
  const chartId = options.chartId || "";
  const selectedWindow = normalizedMonteCarloWindow();
  const selectedScope = normalizedMonteCarloScope(portfolio);
  const model = monteCarloProjectionModel(portfolio, selectedScope);
  const points = monteCarloVisiblePoints(model.points || []);
  if (points.length < 2) return emptyState("Monte Carlo simulation needs portfolio strategy data.");
  const first = points[0];
  const last = points[points.length - 1];
  const plannedCapital = numericValue(last.invested);
  const scopeInvestmentBase = selectedScope === "plan"
    ? numericValue(model.starting_base_eur ?? first.p50)
    : numericValue(first.p50);
  const actualInvestmentReference = selectedScope === "plan"
    ? numericValue(model.actual_invested_base_eur || scopeInvestmentBase)
    : scopeInvestmentBase;
  const totalCapitalAtWork = plannedCapital + scopeInvestmentBase;
  const expectedReturn = totalCapitalAtWork ? signedPercent(percentOf(numericValue(last.p50) - totalCapitalAtWork, totalCapitalAtWork)) : "";
  const conservativeReturn = totalCapitalAtWork ? signedPercent(percentOf(numericValue(last.p10) - totalCapitalAtWork, totalCapitalAtWork)) : "";
  const upsideReturn = totalCapitalAtWork ? signedPercent(percentOf(numericValue(last.p90) - totalCapitalAtWork, totalCapitalAtWork)) : "";
  const contributionLabel = selectedWindow === "plan" ? "remaining" : "planned in view";
  const referenceMetaLabel = selectedScope === "plan" ? "actual invested" : "current value";
  const showLikelyRange = state.monteCarloContextLines.has("projection-band");
  const showInvestmentReference = state.monteCarloContextLines.has("actual-base");
  const summaryParts = [
    model.scope_label || "Plan",
    `${formatWholeCurrency(plannedCapital, "EUR")} ${contributionLabel}`,
    expectedReturn ? `${expectedReturn} expected` : "",
  ].filter(Boolean);
  const investedLabel = selectedWindow === "plan" ? "Remaining planned contributions" : "Planned in view";
  if (!expanded) {
    return compactChartCard({
      chartId,
      expandLabel: "Expand Monte Carlo projection",
      icon: "trendUp",
      label: "Monte Carlo Projection",
      value: formatWholeCurrency(last.p50 || 0, "EUR"),
      meta: [
        `${formatWholeCurrency(plannedCapital, "EUR")} ${contributionLabel}`,
        actualInvestmentReference ? `${formatWholeCurrency(actualInvestmentReference, "EUR")} ${referenceMetaLabel}` : "",
      ].filter(Boolean).join(" · "),
      chartPoints: points.map((point) => ({
        ...point,
        label: point.month,
        value: point.p50,
      })),
      chart: {
        ariaLabel: "Monte Carlo projection",
        className: "p50",
        tooltipContext: { investedLabel, showReturnPercent: true },
        tooltipFormatter: standardChartTooltip,
        yMin: 0,
      },
      periodControl: {
        action: "monte-carlo-window",
        dataKey: "monteCarloWindow",
        selectedValue: String(selectedWindow),
        options: monteCarloWindowOptions(),
        ariaLabel: "Simulation period",
      },
      metrics: [
        expectedReturn ? { value: expectedReturn, label: "expected" } : null,
        conservativeReturn ? { value: conservativeReturn, label: "low" } : null,
        upsideReturn ? { value: upsideReturn, label: "high" } : null,
      ].filter(Boolean),
      note: `${monthLabel(first.month)} - ${monthLabel(last.month)} · ${model.scope_label || "Plan"}`,
    });
  }
  const controls = `
    ${monteCarloScopeSelect(portfolio, selectedScope)}
    ${reportChartSelector("monte-carlo-window", "monteCarloWindow", String(selectedWindow), monteCarloWindowOptions(), "Simulation period")}
  `;
  const actualSeries = actualInvestmentReference && showInvestmentReference
    ? [{
        id: "actual-base",
        label: selectedScope === "plan" ? "Actual invested" : "Current value",
        noReturnPercent: true,
        pointIndexes: [0],
        showPoints: true,
        points: points.map((point) => ({ label: point.month, value: actualInvestmentReference, invested: point.invested })),
      }]
    : [];
  const rangeSeries = showLikelyRange
    ? [
        { id: "p10", label: "Low range", lineVisible: false, points: points.map((point) => ({ label: point.month, value: point.p10, invested: point.invested })) },
        { id: "p90", label: "High range", lineVisible: false, points: points.map((point) => ({ label: point.month, value: point.p90, invested: point.invested })) },
      ]
    : [];
  const rangeBands = showLikelyRange
    ? [{
        id: "projection-band",
        lower: points.map((point) => ({ label: point.month, value: point.p10 })),
        upper: points.map((point) => ({ label: point.month, value: point.p90 })),
      }]
    : [];
  const details = expanded ? chartDetailGrid([
    { label: "Future Contributions", value: formatWholeCurrency(plannedCapital, "EUR"), detail: selectedScope === "plan" ? "planned from strategy" : (model.scope_label || "selected scope") },
    { label: "Expected Value", value: formatWholeCurrency(last.p50 || 0, "EUR"), detail: `${expectedReturn || "0%"} vs simulated inputs` },
    {
      label: "Likely Range",
      valueHtml: chartValueRange(
        formatShortCurrency(last.p10 || 0, "EUR"),
        formatShortCurrency(last.p90 || 0, "EUR"),
      ),
      detail: "low to high simulation",
    },
  ]) : "";
  return `
    <div class="report-chart-summary monte-carlo-summary">
      <div class="report-chart-summary-main">
        <span>${safe(monthLabel(first.month))} - ${safe(monthLabel(last.month))}</span>
        <strong>${formatWholeCurrency(last.p50 || 0, "EUR")}</strong>
        <em class="monte-carlo-summary-line">
          ${summaryParts.map((part) => `<span>${safe(part)}</span>`).join("")}
        </em>
      </div>
      <div class="report-chart-actions">
        ${controls}
      </div>
    </div>
    ${details}
    ${standardLineChart({
      ariaLabel: "Monte Carlo projection",
      className: `monte-carlo-chart${expanded ? " expanded-chart" : ""}`,
      currency: "EUR",
      height: expanded ? 420 : 280,
      labelIndexes: standardChartLabelIndexes(points.length, 4),
      padding: { top: 18, right: 18, bottom: 38, left: 70 },
      bands: rangeBands,
      series: [
        { id: "p50", label: "Expected", points: points.map((point) => ({ label: point.month, value: point.p50, invested: point.invested })) },
        ...rangeSeries,
        ...actualSeries,
      ],
      tickCount: 4,
      tooltipContext: { investedLabel, showReturnPercent: true },
      tooltipFormatter: standardChartTooltip,
      width: expanded ? 1120 : 760,
      xLabelFormatter: shortMonthLabel,
      yMin: 0,
      showPoints: false,
    })}
    ${monteCarloContextLineControls(last, actualInvestmentReference, selectedScope, model)}
  `;
}

function monteCarloContextLineControls(last = {}, actualInvestmentReference = 0, selectedScope = "plan", model = {}) {
  const legendNote = model.simulation_kind === "stochastic"
    ? `${model.scope_label || "Plan"} · ${formatNumber(model.simulation_count || 0)} correlated paths · ${formatPercent(model.expected_return_pct || 0)} return`
    : `${model.scope_label || "Plan"} · ${formatPercent(model.expected_return_pct || 0)} return`;
  return chartLineToggleControls(
    [
      {
        id: "p50",
        label: "Expected",
        valueLabel: legendNote,
        readOnly: true,
      },
      {
        id: "projection-band",
        label: "Likely range",
        valueLabel: `${formatShortCurrency(last.p10 || 0, "EUR")} - ${formatShortCurrency(last.p90 || 0, "EUR")}`,
        detail: "simulation band",
      },
      {
        id: "actual-base",
        label: selectedScope === "plan" ? "Actual invested" : "Current value",
        value: actualInvestmentReference,
        detail: "reference line",
      },
    ].filter((item) => item.id !== "actual-base" || numericValue(item.value) > 0),
    state.monteCarloContextLines,
    "toggle-monte-carlo-context-line",
    "Monte Carlo reference lines",
  );
}

function reportNetWorthForecast(accounts = {}, transactions = {}, portfolio = {}, options = {}) {
  const expanded = Boolean(options.expanded);
  const chartId = options.chartId || "";
  const forecastYears = normalizedReportForecastYears();
  const model = reportForecastModel(accounts, transactions, forecastYears, portfolio);
  if (model.points.length < 2) return emptyState("Forecast needs at least one current net worth value.");

  const first = numericValue(model.points[0]?.value);
  const last = numericValue(model.points[model.points.length - 1]?.value);
  const firstLabel = model.points[0]?.label || currentMonthKey();
  const lastLabel = model.points[model.points.length - 1]?.label || firstLabel;
  const monthlyFlowValue = reportForecastInputValue(
    "monthlyFlow",
    model.baseCashFlow,
    0,
  );
  const annualReturnValue = reportForecastInputValue("annualReturnPct", model.annualReturn * 100, 1);
  const monthlyFlowNumber = reportForecastOverrideNumber(monthlyFlowValue) ?? 0;
  const annualReturnNumber = reportForecastOverrideNumber(annualReturnValue) ?? 0;
  const monthlyFlowLabel = model.cashFlowOverrideActive ? "manual monthly net flow" : (model.cashFlowSource || "observed monthly net flow");
  const finalRetention = chartPointRetentionPct(model.points[model.points.length - 1]);
  if (!expanded) {
    return compactChartCard({
      chartId,
      expandLabel: "Expand net worth forecast",
      icon: "trendUp",
      label: "Net Worth Forecast",
      value: formatWholeCurrency(last, "EUR"),
      meta: `${signedWholeAmount(last - first, "EUR")} forecast · ${signedWholeAmount(monthlyFlowNumber, "EUR")} monthly net flow`,
      chartPoints: model.points,
      chart: {
        ariaLabel: "Net worth forecast",
        className: "forecast",
        yMin: 0,
      },
      periodControl: {
        action: "report-forecast-years",
        dataKey: "reportForecastYears",
        selectedValue: String(forecastYears),
        options: reportForecastOptions(),
        ariaLabel: "Forecast period",
      },
      metrics: [
        { value: signedWholeAmount(monthlyFlowNumber, "EUR"), label: "monthly net" },
        { value: formatPercent(annualReturnNumber), label: "return" },
        finalRetention !== null ? { value: formatPercent(finalRetention), label: "retention" } : null,
      ].filter(Boolean),
      note: `${monthLabel(firstLabel)} - ${monthLabel(lastLabel)} · ${monthlyFlowLabel}`,
    });
  }
  const controls = `
    ${reportForecastControls(monthlyFlowValue, annualReturnValue)}
    ${reportChartSelector("report-forecast-years", "reportForecastYears", String(forecastYears), reportForecastOptions(), "Forecast period")}
  `;
  const details = expanded ? chartDetailGrid([
    { label: "Monthly Net Flow", value: signedWholeAmount(monthlyFlowNumber, "EUR"), detail: monthlyFlowLabel },
    { label: "Income Baseline", value: formatWholeCurrency(model.incomeBaseline || 0, "EUR"), detail: "recurring monthly income" },
    { label: "Expense Baseline", value: formatWholeCurrency(model.expenseBaseline || 0, "EUR"), detail: "recurring monthly spend" },
    { label: "Investable Capital", value: formatWholeCurrency(model.investable || 0, "EUR"), detail: `${formatPercent(numericValue(model.investableShare) * 100)} of net worth` },
  ]) : "";
  return `
    <div class="report-chart-summary">
      <div class="report-chart-summary-main">
        <span>${safe(monthLabel(firstLabel))} - ${safe(monthLabel(lastLabel))}</span>
        <strong>${formatWholeCurrency(last, "EUR")}</strong>
        <em>${[
          `${signedWholeAmount(last - first, "EUR")} forecast`,
          `${signedWholeAmount(monthlyFlowNumber, "EUR")} ${monthlyFlowLabel}`,
          `${formatPercent(annualReturnNumber)} return`,
          finalRetention !== null ? `${formatPercent(finalRetention)} retention` : "",
        ].filter(Boolean).map(safe).join(" · ")}</em>
      </div>
      <div class="report-chart-actions">
        ${controls}
      </div>
    </div>
    ${details}
    ${reportLineChart(model.points, {
      ariaLabel: "Net worth forecast",
      className: `report-forecast-chart${expanded ? " expanded-chart" : ""}`,
      id: "forecast",
      label: "Forecast",
      labelCount: 4,
      lineControls: {
        chartId: "report-net-worth-forecast",
        note: [
          "deterministic net worth forecast",
          finalRetention !== null ? `${formatPercent(finalRetention)} retention` : "",
        ].filter(Boolean).join(" · "),
        ariaLabel: "Net worth forecast chart lines",
      },
      showPoints: false,
      tickCount: 4,
      ...(expanded ? { height: 420, width: 1120 } : {}),
    })}
  `;
}

function reportForecastSimulationPoints(portfolio = {}, pointCount = 0) {
  if (!currentPortfolioInstrumentRows(portfolio).length) return null;
  const model = monteCarloProjectionModel(portfolio, "plan");
  const points = (model.points || []).slice(0, Math.max(0, Number(pointCount) || 0));
  if (points.length < 2) return null;
  return {
    expected: points.map((point) => ({ label: point.month, value: point.p50 })),
    conservative: points.map((point) => ({ label: point.month, value: point.p10 })),
    upside: points.map((point) => ({ label: point.month, value: point.p90 })),
    simulationCount: model.simulation_count,
    simulationKind: model.simulation_kind,
  };
}

function reportForecastControls(monthlyFlowValue, annualReturnValue) {
  return `
    <div class="report-forecast-controls" aria-label="Forecast assumptions">
      <label class="report-forecast-control">
        <span class="report-forecast-control-label">Monthly net flow</span>
        <span class="report-forecast-input-shell">
          <span aria-hidden="true">€</span>
          <input
            aria-label="Monthly net forecast flow"
            autocomplete="off"
            data-format-number
            data-report-forecast-field="monthlyFlow"
            inputmode="decimal"
            type="text"
            value="${safe(monthlyFlowValue)}"
          />
        </span>
      </label>
      <label class="report-forecast-control">
        <span class="report-forecast-control-label">Return</span>
        <span class="report-forecast-input-shell compact">
          <input
            aria-label="Annual return percentage"
            autocomplete="off"
            data-format-percent
            data-report-forecast-field="annualReturnPct"
            inputmode="decimal"
            type="text"
            value="${safe(annualReturnValue)}"
          />
          <span>%</span>
        </span>
      </label>
    </div>
  `;
}

function reportForecastModel(accounts = {}, transactions = {}, forecastYears = 10, portfolio = {}) {
  const netWorth = numericValue(accounts.net_worth_eur);
  const history = reportForecastHistory(transactions.monthly_series || []);
  const assumptions = reportForecastApplyOverrides(reportForecastAssumptions(accounts, transactions, history, portfolio));
  const monthlyReturn = monthlyRateFromAnnual(assumptions.annualReturn);
  const months = normalizedForecastMonthCount(forecastYears);
  let value = netWorth;
  let investableCapital = assumptions.investable;
  let cumulativeIncome = reportForecastStartingCumulativeIncome(transactions, history);
  const points = [];
  const cashFlows = [];

  for (let index = 0; index <= months; index += 1) {
    const monthKey = addMonthsToMonthKey(currentMonthKey(), index);
    points.push({
      cumulativeIncome,
      label: monthKey,
      retentionPct: netWorthRetentionPct(value, cumulativeIncome),
      value,
    });

    if (index === months) continue;
    const projectedCashFlow = reportForecastCashFlowForMonth(monthKey, index, assumptions);
    const returnAmount = Math.max(0, investableCapital) * monthlyReturn;
    value += projectedCashFlow + returnAmount;
    investableCapital += returnAmount + (Math.max(0, projectedCashFlow) * assumptions.investableShare);
    cumulativeIncome += Math.max(0, numericValue(assumptions.incomeBaseline));
    cashFlows.push(projectedCashFlow);
  }

  return {
    ...assumptions,
    averageMonthlyCashFlow: average(cashFlows),
    points,
  };
}

function reportForecastStartingCumulativeIncome(transactions = {}, history = []) {
  const direct = transactionTotal(transactions, "lifetime_income_eur", "income_eur");
  if (direct > 0) return direct;
  return seriesTotal(history, "income");
}

function reportForecastHistory(series = []) {
  const currentMonth = currentMonthKey();
  return series
    .filter((row) => row?.month && row.month < currentMonth)
    .map((row) => ({
      month: row.month,
      income: numericValue(row.income_eur),
      expense: numericValue(row.expense_eur),
      net: numericValue(row.net_eur),
    }))
    .filter((row) => row.income || row.expense || row.net)
    .sort((a, b) => a.month.localeCompare(b.month));
}

function reportForecastAssumptions(accounts = {}, transactions = {}, history = [], portfolio = {}) {
  const netWorth = numericValue(accounts.net_worth_eur);
  const recent = history.slice(-36);
  const recent12 = recent.slice(-12);
  const recurringIncome = reportForecastRecurringValue(recent12, recent, "income")
    || averageMonthlyIncome(transactions.monthly_series, 12);
  const recurringExpense = reportForecastRecurringValue(recent12, recent, "expense")
    || averageMonthlyExpense(transactions.monthly_series, 12);
  const structuralNet = recurringIncome - recurringExpense;
  const observedNet = median(recent12.map((row) => row.net)) || median(recent.map((row) => row.net));
  const observedBaseCashFlow = reportForecastCashFlowCap(
    observedNet ? (observedNet * 0.55) + (structuralNet * 0.45) : structuralNet,
    recurringIncome,
    recurringExpense,
  );
  const portfolioInstruments = currentPortfolioInstrumentRows(portfolio);
  const portfolioMipRows = currentPortfolioMipRows(portfolio);
  const portfolioSummary = portfolioSummaryFromRows(portfolio.summary || {}, portfolioInstruments, portfolioMipRows);
  const mipMonthly = numericValue(portfolioSummary.monthly_contribution_eur);
  const hasObservedCashFlow = Boolean(history.length);
  const baseCashFlow = hasObservedCashFlow
    ? observedBaseCashFlow
    : reportForecastCashFlowCap(mipMonthly, Math.max(recurringIncome, mipMonthly), recurringExpense);
  const cashFlowSource = hasObservedCashFlow
    ? "observed monthly net flow"
    : "monthly contribution plan fallback";
  const investable = reportForecastInvestableCapital(accounts);
  const investableShare = netWorth > 0 ? clampValue(investable / netWorth, 0, 0.85) : 0;
  const volatility = standardDeviation(recent12.map((row) => row.net));
  const volatilityPenalty = recurringIncome > 0 ? clampValue(volatility / recurringIncome, 0, 0.5) * 0.012 : 0.006;
  const portfolioReturnPct = monteCarloWeightedReturn(portfolioInstruments);
  const annualReturn = portfolioInstruments.length
    ? clampValue((portfolioReturnPct || 5) / 100, -0.02, 0.11)
    : clampValue(0.016 + (investableShare * 0.036) - volatilityPenalty, 0.004, 0.048);

  return {
    annualReturn,
    baseCashFlow,
    cashFlowSource,
    cashFlowTrend: reportForecastCashFlowTrend(recent, baseCashFlow),
    expenseBaseline: recurringExpense,
    incomeBaseline: recurringIncome,
    investable,
    investableShare,
    seasonality: reportForecastSeasonality(recent, baseCashFlow),
  };
}

function reportForecastApplyOverrides(assumptions = {}) {
  const overrides = reportForecastOverrideValues();
  const hasMonthlyFlow = Number.isFinite(overrides.monthlyFlow);
  const hasAnnualReturn = Number.isFinite(overrides.annualReturn);
  return {
    ...assumptions,
    annualReturn: hasAnnualReturn ? clampValue(overrides.annualReturn, -0.95, 0.5) : assumptions.annualReturn,
    baseCashFlow: hasMonthlyFlow ? overrides.monthlyFlow : assumptions.baseCashFlow,
    cashFlowOverrideActive: hasMonthlyFlow,
    cashFlowSource: hasMonthlyFlow ? "manual monthly net flow" : assumptions.cashFlowSource,
    cashFlowTrend: hasMonthlyFlow ? 0 : assumptions.cashFlowTrend,
    returnOverrideActive: hasAnnualReturn,
    seasonality: hasMonthlyFlow ? Array.from({ length: 12 }, () => 0) : assumptions.seasonality,
  };
}

function reportForecastOverrideValues() {
  const source = {
    ...defaultReportForecastOverrides(),
    ...(state.reportForecastOverrides || {}),
  };
  const annualReturnPct = reportForecastOverrideNumber(source.annualReturnPct);
  return {
    annualReturn: annualReturnPct === null ? null : annualReturnPct / 100,
    monthlyFlow: reportForecastOverrideNumber(source.monthlyFlow),
  };
}

function reportForecastOverrideNumber(value) {
  const raw = String(value ?? "").trim();
  if (!raw) return null;
  const numeric = Number(raw.replace(/,/g, ""));
  return Number.isFinite(numeric) ? numeric : null;
}

function reportForecastInputValue(field, algorithmValue, fractionDigits = 0) {
  const raw = String(state.reportForecastOverrides?.[field] ?? "").trim();
  return formatEditableNumber(raw || formatNumberForInput(algorithmValue, fractionDigits));
}

function reportForecastRecurringValue(recent = [], longer = [], key) {
  const recentValues = recent.map((row) => row[key]).filter((value) => value > 0);
  const longerValues = longer.map((row) => row[key]).filter((value) => value > 0);
  const recentMedian = median(recentValues);
  const longerMedian = median(longerValues);
  const recentAverage = average(recentValues);
  if (recentMedian && longerMedian) return (recentMedian * 0.55) + (longerMedian * 0.3) + (recentAverage * 0.15);
  return recentMedian || longerMedian || recentAverage || 0;
}

function reportForecastCashFlowCap(value, income = 0, expense = 0) {
  const numeric = numericValue(value);
  if (numeric > 0 && income > 0) return Math.min(numeric, income * 0.65);
  if (numeric < 0 && expense > 0) return Math.max(numeric, -expense * 1.25);
  return numeric;
}

function reportForecastCashFlowTrend(history = [], baseCashFlow = 0) {
  const rows = history.slice(-24);
  if (rows.length < 12) return 0;
  const midpoint = Math.floor(rows.length / 2);
  const earlier = median(rows.slice(0, midpoint).map((row) => row.net));
  const later = median(rows.slice(midpoint).map((row) => row.net));
  const monthlyTrend = (later - earlier) / Math.max(1, rows.length / 2);
  return clampValue(monthlyTrend, -Math.abs(baseCashFlow) * 0.018, Math.abs(baseCashFlow) * 0.018);
}

function reportForecastSeasonality(history = [], baseCashFlow = 0) {
  const rows = history.slice(-48);
  const baseline = median(rows.map((row) => row.net)) || baseCashFlow;
  const maxAdjustment = Math.max(Math.abs(baseCashFlow) * 0.28, 250);
  return Array.from({ length: 12 }, (_value, index) => {
    const month = String(index + 1).padStart(2, "0");
    const sameMonth = rows.filter((row) => String(row.month || "").slice(5, 7) === month).map((row) => row.net);
    if (sameMonth.length < 2) return 0;
    return clampValue(median(sameMonth) - baseline, -maxAdjustment, maxAdjustment);
  });
}

function reportForecastCashFlowForMonth(monthKey, index, assumptions = {}) {
  if (assumptions.cashFlowOverrideActive) return numericValue(assumptions.baseCashFlow);
  const monthIndex = Math.max(0, Number(String(monthKey || "").slice(5, 7)) - 1);
  const seasonal = assumptions.seasonality?.[monthIndex] || 0;
  const trend = numericValue(assumptions.cashFlowTrend) * index;
  return reportForecastCashFlowCap(
    numericValue(assumptions.baseCashFlow) + seasonal + trend,
    numericValue(assumptions.incomeBaseline),
    numericValue(assumptions.expenseBaseline),
  );
}

function reportForecastInvestableCapital(accounts = {}) {
  const rows = accounts.by_bucket || [];
  return Math.max(0, breakdownAmount(rows, ["investment"]) + breakdownAmount(rows, ["trading_capital", "trading capital"]));
}

function clampValue(value, min, max) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return min;
  return Math.min(max, Math.max(min, numeric));
}

function monthlyRateFromAnnual(annualRate) {
  const rate = numericValue(annualRate);
  return rate ? Math.pow(1 + rate, 1 / 12) - 1 : 0;
}

function addMonthsToMonthKey(value, months) {
  const [year, month] = String(value || currentMonthKey()).split("-").map(Number);
  const date = new Date(year, month - 1 + Number(months || 0), 1);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function reportNetWorthOverTime(accounts = {}, transactions = {}, portfolio = {}, options = {}) {
  const expanded = Boolean(options.expanded);
  const chartId = options.chartId || "";
  const historyWindow = normalizedReportHistoryWindow("reportNetWorthWindow");
  const points = reportNetWorthSeries(accounts, transactions, historyWindow);
  const hasTrend = points.length >= 2;
  const fallbackPoints = hasTrend ? points : reportNetWorthSeries(accounts, transactions, "all");
  const fallbackLast = points[points.length - 1] || fallbackPoints[fallbackPoints.length - 1] || {
    month: currentMonthKey(),
    value: accounts.net_worth_eur,
  };
  const chartPoints = points.length ? points : [{
    cumulativeIncome: numericValue(fallbackLast.cumulativeIncome),
    month: fallbackLast.month || currentMonthKey(),
    retentionPct: chartPointRetentionPct(fallbackLast),
    value: numericValue(fallbackLast.value),
  }];
  const chartFirstPoint = chartPoints[0] || fallbackLast;
  const chartLastPoint = chartPoints[chartPoints.length - 1] || fallbackLast;

  const first = hasTrend ? points[0].value : numericValue(chartFirstPoint.value);
  const last = hasTrend ? points[points.length - 1].value : numericValue(chartLastPoint.value);
  const change = last - first;
  const leakageModel = netWorthLeakageContext(accounts, transactions);
  const forecastModel = expanded ? reportForecastModel(accounts, transactions, normalizedReportForecastYears(), portfolio) : {};
  const contextSeries = expanded ? netWorthContextSeries(chartPoints, leakageModel, transactions) : [];
  const forecastSeries = expanded ? netWorthForecastContextSeries(forecastModel) : [];
  const extraSeries = [...contextSeries, ...forecastSeries];
  const forecastAnnotations = netWorthForecastChartAnnotations(forecastSeries[0]);
  const domainPoints = extraSeries.length
    ? [...chartPoints, ...extraSeries.flatMap((item) => item.points || [])]
    : chartPoints;
  const historySelector = chartControlCluster(
    "History",
    reportChartSelector("report-net-worth-window", "reportNetWorthWindow", String(historyWindow), netWorthHistoryOptions(), "Historical period"),
  );
  const forecastSelector = forecastSeries.length
    ? chartControlCluster(
        "Forecast",
        reportChartSelector("report-forecast-years", "reportForecastYears", String(normalizedReportForecastYears()), reportForecastOptions(), "Forecast period"),
      )
    : "";
  if (!expanded) {
    return compactChartCard({
      chartId,
      expandLabel: "Expand net worth history",
      icon: "wallet",
      label: "Net Worth Over Time",
      value: formatWholeCurrency(last, "EUR"),
      meta: hasTrend ? `${signedWholeAmount(change, "EUR")} across ${formatNumber(points.length)} months` : "Needs at least two months",
      chartPoints: hasTrend ? points.map((point) => ({
        ...point,
        label: point.month || point.label,
      })) : [],
      chart: {
        ariaLabel: "Net worth over time",
        className: "actual",
        ...netWorthChartDomain(points, historyWindow),
      },
      periodControl: {
        action: "report-net-worth-window",
        dataKey: "reportNetWorthWindow",
        selectedValue: String(historyWindow),
        options: netWorthHistoryOptions(),
        ariaLabel: "Net worth history period",
      },
      metrics: hasTrend ? trendDeltaItems(points.map((point) => point.value)).slice(0, 3) : [],
      note: hasTrend
        ? `${monthLabel(points[0].month)} - ${monthLabel(points[points.length - 1].month)}`
        : "Select a longer period to draw the chart",
    });
  }
  if (!hasTrend) {
    return `
      <div class="report-chart-summary">
        <div class="report-chart-summary-main">
          <span>${safe(monthLabel(chartLastPoint.month || chartLastPoint.label))}</span>
          <strong>${formatWholeCurrency(last, "EUR")}</strong>
          <em>1 month selected · history trend needs 2+ months</em>
        </div>
        <div class="report-chart-actions">
          ${historySelector}
          ${forecastSelector}
        </div>
      </div>
      ${chartDetailGrid([
        { label: "Current Net Worth", value: formatWholeCurrency(last, "EUR"), detail: "latest reconciled value" },
        { label: "Period Change", value: "-", detail: "needs 2+ months" },
        { label: "Start Value", value: formatWholeCurrency(first, "EUR"), detail: monthLabel(chartFirstPoint.month || chartFirstPoint.label) },
        { label: "Window", value: monthLabel(chartLastPoint.month || chartLastPoint.label), detail: "selected month" },
      ])}
      ${reportLineChart(chartPoints, {
        className: "report-net-worth-chart expanded-chart",
        axisPoints: netWorthCombinedAxisPoints(chartPoints, extraSeries),
        extraSeries,
        height: 420,
        markers: forecastAnnotations.markers,
        regions: forecastAnnotations.regions,
        tooltipContext: { currentValue: last },
        tooltipFormatter: reportNetWorthHistoryTooltip,
        width: 1120,
        ...netWorthChartDomain(domainPoints, historyWindow),
      })}
      ${netWorthContextLineControls(leakageModel, transactions, forecastModel)}
    `;
  }
  return `
    <div class="report-chart-summary">
      <div class="report-chart-summary-main">
        <span>${safe(monthLabel(points[0].month))} - ${safe(monthLabel(points[points.length - 1].month))}</span>
        <strong>${formatWholeCurrency(last, "EUR")}</strong>
        <em>${signedWholeAmount(change, "EUR")} across ${formatNumber(points.length)} months</em>
      </div>
      <div class="report-chart-actions">
        ${historySelector}
        ${forecastSelector}
      </div>
    </div>
    ${chartDetailGrid([
      { label: "Current Net Worth", value: formatWholeCurrency(last, "EUR"), detail: "latest reconciled value" },
      { label: "Period Change", value: signedWholeAmount(change, "EUR"), detail: `${formatNumber(points.length)} months` },
      { label: "Start Value", value: formatWholeCurrency(first, "EUR"), detail: monthLabel(points[0].month) },
      { label: "Window", value: monthLabel(points[points.length - 1].month), detail: "latest data point" },
    ])}
    ${reportLineChart(points, {
      className: "report-net-worth-chart expanded-chart",
      axisPoints: netWorthCombinedAxisPoints(points, extraSeries),
      extraSeries,
      height: 420,
      markers: forecastAnnotations.markers,
      regions: forecastAnnotations.regions,
      tooltipContext: { currentValue: last },
      tooltipFormatter: reportNetWorthHistoryTooltip,
      width: 1120,
      ...netWorthChartDomain(domainPoints, historyWindow),
    })}
    ${netWorthContextLineControls(leakageModel, transactions, forecastModel)}
  `;
}

function netWorthChartDomain(points = [], historyWindow = "all") {
  const focusedWindow = ["1", "3", "6", "12"].includes(String(historyWindow || ""));
  if (!focusedWindow) return { yMin: 0 };
  const values = points.map((point) => numericValue(point.value)).filter((value) => Number.isFinite(value));
  if (!values.length) return { yMin: 0 };
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = Math.max(1, max - min);
  const padding = Math.max(span * 0.35, Math.abs(max) * 0.001, 500);
  return {
    yMin: Math.max(0, min - padding),
    yMax: max + padding,
  };
}

function reportNetWorthSeries(accounts = {}, transactions = {}, historyWindow = "36") {
  const allMonthly = (transactions.monthly_series || [])
    .filter((row) => row && row.month)
    .sort((a, b) => String(a.month).localeCompare(String(b.month)));
  if (!allMonthly.length) return [];

  const currentNetWorth = numericValue(accounts.net_worth_eur);
  let cumulativeNetFlow = 0;
  let cumulativeIncome = 0;
  const cumulative = allMonthly.map((row) => {
    cumulativeNetFlow += numericValue(row.net_eur);
    cumulativeIncome += numericValue(row.income_eur);
    return {
      cumulativeIncome,
      month: row.month,
      value: cumulativeNetFlow,
    };
  });
  const finalCumulative = numericValue(cumulative[cumulative.length - 1]?.value);
  const scale = finalCumulative ? currentNetWorth / finalCumulative : 0;
  const fullSeries = cumulative.map((point, index) => {
    const rawValue = index === 0 ? 0 : point.value * scale;
    const value = currentNetWorth >= 0 ? Math.max(0, rawValue) : rawValue;
    return {
      cumulativeIncome: point.cumulativeIncome,
      month: point.month,
      retentionPct: netWorthRetentionPct(value, point.cumulativeIncome),
      value,
    };
  });
  fullSeries[fullSeries.length - 1].value = currentNetWorth;
  fullSeries[fullSeries.length - 1].retentionPct = netWorthRetentionPct(
    currentNetWorth,
    fullSeries[fullSeries.length - 1].cumulativeIncome,
  );

  const monthCount = reportHistoryMonthCount(historyWindow);
  return monthCount === Infinity ? fullSeries : fullSeries.slice(-monthCount);
}

function netWorthRetentionPct(value, cumulativeIncome) {
  const income = numericValue(cumulativeIncome);
  if (income <= 0) return null;
  return moneyRound(percentOf(value, income));
}

function netWorthLeakageContext(accounts = {}, transactions = {}) {
  const grossInflow = transactionTotal(transactions, "lifetime_income_eur", "income_eur");
  const capitalConsumption = transactionTotal(transactions, "lifetime_expense_eur", "expense_eur");
  const theoreticalRetained = grossInflow - capitalConsumption;
  const actualRetained = numericValue(accounts.net_worth_eur);
  const capitalLedgerGap = actualRetained - theoreticalRetained;
  const ledgerGap = Math.max(0, -capitalLedgerGap);
  const structuralOverspending = Math.max(0, numericValue(transactions.capital_targets?.structural_overspending_eur));
  const structuralLeakage = ledgerGap + structuralOverspending;
  const compoundingYears = yearsInMonthlySeries(transactions.monthly_series);
  const leakageTimeline = netWorthTimedLeakageTimeline(transactions, structuralLeakage);
  const compoundingDeficit = Math.max(structuralLeakage, numericValue(leakageTimeline.finalCompoundingLift));
  return {
    compoundingDeficit,
    compoundingYears,
    leakageTimeline,
    ledgerGap,
    structuralLeakage,
    structuralOverspending,
  };
}

function netWorthContextSeries(points = [], leakageModel = {}, transactions = {}) {
  if (!points.length || !(state.netWorthContextLines instanceof Set)) return [];
  const series = [];
  const structuralLeakage = numericValue(leakageModel.structuralLeakage);
  const compoundingDeficit = numericValue(leakageModel.compoundingDeficit);
  const leakageTimeline = leakageModel.leakageTimeline || netWorthTimedLeakageTimeline(transactions, structuralLeakage);
  const totalIncomePoints = netWorthCumulativeIncomePoints(points, transactions);
  const totalIncome = numericValue(totalIncomePoints[totalIncomePoints.length - 1]?.value);
  if (state.netWorthContextLines.has("leakage-adjusted") && structuralLeakage > 0) {
    series.push({
      id: "leakage-adjusted",
      label: "Leakage-adjusted",
      points: netWorthCounterfactualPoints(points, leakageTimeline, "structural"),
    });
  }
  if (state.netWorthContextLines.has("compounding-adjusted") && compoundingDeficit > 0) {
    series.push({
      id: "compounding-adjusted",
      label: "Compounding-adjusted",
      points: netWorthCounterfactualPoints(points, leakageTimeline, "compounding"),
    });
  }
  if (state.netWorthContextLines.has("total-income") && totalIncome > 0) {
    series.push({
      id: "total-income",
      label: "Total income",
      points: totalIncomePoints,
    });
  }
  return series;
}

function netWorthForecastContextSeries(forecastModel = {}) {
  if (!(state.netWorthContextLines instanceof Set) || !state.netWorthContextLines.has("forecast")) return [];
  const points = Array.isArray(forecastModel.points) ? forecastModel.points : [];
  if (points.length < 2) return [];
  return [{
    id: "forecast",
    label: "Net worth forecast",
    points: points.map((point) => ({
      cumulativeIncome: point.cumulativeIncome,
      label: point.label || point.month,
      retentionPct: point.retentionPct,
      value: point.value,
    })),
  }];
}

function netWorthCombinedAxisPoints(points = [], extraSeries = []) {
  const labels = [];
  const seen = new Set();
  const addPoint = (point = {}) => {
    const label = chartPointLabel(point);
    if (!label || seen.has(label)) return;
    seen.add(label);
    labels.push(label);
  };
  points.forEach(addPoint);
  extraSeries.forEach((series) => (series.points || []).forEach(addPoint));
  const sorted = labels.every((label) => /^\d{4}-\d{2}$/.test(label))
    ? [...labels].sort((a, b) => a.localeCompare(b))
    : labels;
  return sorted.map((label) => ({ label }));
}

function netWorthForecastChartAnnotations(forecastSeries = {}) {
  const points = (forecastSeries?.points || []).filter((point) => chartPointLabel(point));
  if (points.length < 2) return { markers: [], regions: [] };
  const startLabel = chartPointLabel(points[0]);
  const endLabel = chartPointLabel(points[points.length - 1]);
  return {
    markers: [{ id: "today", label: startLabel, text: "Today" }],
    regions: [{ id: "forecast-region", startLabel, endLabel }],
  };
}

function netWorthCumulativeIncomePoints(points = [], transactions = {}) {
  const monthly = (transactions.monthly_series || [])
    .filter((row) => row && row.month)
    .sort((a, b) => String(a.month).localeCompare(String(b.month)));
  const cumulativeByMonth = new Map();
  let cumulativeIncome = 0;
  monthly.forEach((row) => {
    cumulativeIncome += numericValue(row.income_eur);
    cumulativeByMonth.set(String(row.month), cumulativeIncome);
  });
  return points.map((point) => {
    const month = String(point.month || point.label || "");
    return {
      label: month,
      value: numericValue(cumulativeByMonth.get(month)),
    };
  });
}

function netWorthTimedLeakageTimeline(transactions = {}, structuralLeakage = 0) {
  const leakage = Math.max(0, numericValue(structuralLeakage));
  const monthly = (transactions.monthly_series || [])
    .filter((row) => row && row.month)
    .sort((a, b) => String(a.month).localeCompare(String(b.month)));
  const byMonth = new Map();
  if (!monthly.length || leakage <= 0) {
    return {
      byMonth,
      finalCompoundingLift: 0,
      finalStructuralLift: 0,
    };
  }

  let weights = monthly.map((row) => Math.max(0, numericValue(row.net_eur, numericValue(row.income_eur) - numericValue(row.expense_eur))));
  let totalWeight = weights.reduce((total, value) => total + value, 0);
  if (totalWeight <= 0) {
    weights = monthly.map((row) => Math.max(0, numericValue(row.income_eur)));
    totalWeight = weights.reduce((total, value) => total + value, 0);
  }

  const monthlyReturn = monthlyRateFromAnnual(MODERATE_INDEX_RATE);
  let cumulativeIncome = 0;
  let cumulativeLeakage = 0;
  let compoundedLeakage = 0;
  monthly.forEach((row, index) => {
    cumulativeIncome += numericValue(row.income_eur);
    const allocation = totalWeight > 0 ? leakage * weights[index] / totalWeight : 0;
    compoundedLeakage *= 1 + monthlyReturn;
    cumulativeLeakage += allocation;
    compoundedLeakage += allocation;
    const structuralLift = Math.min(leakage, cumulativeLeakage);
    byMonth.set(String(row.month), {
      allocation,
      compoundingLift: Math.max(structuralLift, compoundedLeakage),
      cumulativeIncome,
      structuralLift,
    });
  });

  const finalMonth = String(monthly[monthly.length - 1]?.month || "");
  const final = byMonth.get(finalMonth) || {};
  return {
    byMonth,
    finalCompoundingLift: numericValue(final.compoundingLift),
    finalStructuralLift: numericValue(final.structuralLift),
  };
}

function netWorthCounterfactualPoints(points = [], leakageTimeline = {}, mode = "structural") {
  const byMonth = leakageTimeline.byMonth instanceof Map ? leakageTimeline.byMonth : new Map();
  return points.map((point) => {
    const month = String(point.month || point.label || "");
    const context = byMonth.get(month) || {};
    const baseValue = numericValue(point.value);
    const lift = mode === "compounding"
      ? numericValue(context.compoundingLift)
      : numericValue(context.structuralLift);
    const value = baseValue + lift;
    const incomeCap = numericValue(context.cumulativeIncome);
    const cappedValue = incomeCap > 0 ? Math.max(baseValue, Math.min(value, incomeCap)) : value;
    return {
      cumulativeIncome: incomeCap,
      label: month,
      retentionPct: netWorthRetentionPct(cappedValue, incomeCap),
      value: cappedValue,
    };
  });
}

function netWorthContextLineControls(leakageModel = {}, transactions = {}, forecastModel = {}) {
  const forecastPoints = Array.isArray(forecastModel.points) ? forecastModel.points : [];
  const forecastFirst = numericValue(forecastPoints[0]?.value);
  const forecastLast = numericValue(forecastPoints[forecastPoints.length - 1]?.value);
  const forecastGain = Math.max(0, forecastLast - forecastFirst);
  const forecastReturn = forecastFirst > 0 ? percentOf(forecastGain, forecastFirst) : 0;
  const forecastRetention = chartPointRetentionPct(forecastPoints[forecastPoints.length - 1]);
  const forecastOption = reportForecastOptions().find((option) => String(option.value) === String(normalizedReportForecastYears()));
  const referenceItems = [
    {
      id: "leakage-adjusted",
      label: "Leakage",
      value: numericValue(leakageModel.structuralLeakage),
      valueLabel: chartCompactAmount(numericValue(leakageModel.structuralLeakage)),
      detail: "ledger gap + overspending",
    },
    {
      id: "compounding-adjusted",
      label: "Deficit",
      value: numericValue(leakageModel.compoundingDeficit),
      valueLabel: chartCompactAmount(numericValue(leakageModel.compoundingDeficit)),
      detail: "leakage + missed compounding",
    },
    {
      id: "total-income",
      label: "Income",
      value: transactionTotal(transactions, "lifetime_income_eur", "income_eur"),
      valueLabel: chartCompactAmount(transactionTotal(transactions, "lifetime_income_eur", "income_eur")),
      detail: "cumulative inflow",
    },
  ].filter((item) => item.value > 0);
  const projectionItems = [
    {
      id: "forecast",
      label: "Forecast",
      value: forecastLast,
      valueLabel: [
        chartCompactAmount(forecastLast),
        forecastGain > 0 ? chartCompactSignedAmount(forecastGain) : "",
        forecastReturn > 0 ? signedPercent(forecastReturn) : "",
        forecastRetention !== null ? `${formatPercent(forecastRetention)} ret.` : "",
      ].filter(Boolean).join(" · "),
      detail: `${forecastOption?.label || "10Y"} deterministic`,
    },
  ].filter((item) => item.value > 0);
  return chartLineToggleControls(
    [...referenceItems, ...projectionItems],
    state.netWorthContextLines,
    "toggle-net-worth-context-line",
    "Net worth reference lines",
  );
}

function standardChartHiddenLineSet(chartId = "") {
  const key = String(chartId || "standard-chart");
  if (!(state.standardChartHiddenLines instanceof Map)) {
    state.standardChartHiddenLines = new Map();
  }
  if (!state.standardChartHiddenLines.has(key)) {
    state.standardChartHiddenLines.set(key, new Set());
  }
  return state.standardChartHiddenLines.get(key);
}

function standardChartActiveLineIds(chartId = "", series = []) {
  const ids = (series || []).map((item) => String(item?.id || "")).filter(Boolean);
  const hiddenLines = standardChartHiddenLineSet(chartId);
  const active = new Set(ids.filter((id) => !hiddenLines.has(id)));
  if (!active.size && ids.length) {
    hiddenLines.delete(ids[0]);
    active.add(ids[0]);
  }
  return active;
}

function visibleStandardChartSeries(chartId = "", series = []) {
  const active = standardChartActiveLineIds(chartId, series);
  return (series || []).filter((item) => active.has(String(item?.id || "")));
}

function standardLineChartWithControls(options = {}, controls = {}) {
  const series = (options.series || []).filter((item) => item && item.id);
  const chartId = controls.chartId || options.chartId || options.ariaLabel || "standard-chart";
  const visibleSeries = series.length > 1 ? visibleStandardChartSeries(chartId, series) : series;
  return `
    ${standardLineChart({ ...options, series: visibleSeries })}
    ${standardChartLineControls(chartId, series, controls)}
  `;
}

function standardChartLineControls(chartId = "", series = [], controls = {}) {
  const visibleSeries = (series || []).filter((item) => item && item.id && item.label);
  const note = controls.note || "";
  if (!visibleSeries.length) return note ? `<div class="chart-line-toggle-note">${safe(note)}</div>` : "";
  const activeIds = standardChartActiveLineIds(chartId, visibleSeries);
  const hasMultiple = visibleSeries.length > 1;
  const items = visibleSeries.map((item) => ({
    id: item.id,
    label: item.label,
    chartId,
    detail: item.detail || "",
    value: item.value,
    valueLabel: item.valueLabel,
    readOnly: !hasMultiple,
  }));
  return `
    ${chartLineToggleControls(
      items,
      activeIds,
      "toggle-standard-chart-line",
      controls.ariaLabel || "Chart lines",
    )}
    ${note ? `<div class="chart-line-toggle-note">${safe(note)}</div>` : ""}
  `;
}

function chartLineToggleControls(items = [], activeSet = new Set(), action = "", ariaLabel = "Chart reference lines") {
  if (!items.length || !action) return "";
  const activeLines = activeSet instanceof Set ? activeSet : new Set();
  return `
    <div class="chart-line-toggle-row" aria-label="${safe(ariaLabel)}">
      ${items.map((item) => chartLineToggleButton(item, activeLines, action)).join("")}
    </div>
  `;
}

function chartLineToggleGroups(groups = [], activeSet = new Set(), action = "", ariaLabel = "Chart reference lines") {
  const visibleGroups = groups.filter((group) => Array.isArray(group.items) && group.items.length);
  if (!visibleGroups.length || !action) return "";
  const activeLines = activeSet instanceof Set ? activeSet : new Set();
  return `
    <div class="chart-line-toggle-panel" aria-label="${safe(ariaLabel)}">
      ${visibleGroups.map((group) => `
        <div class="chart-line-toggle-group">
          <span class="chart-line-toggle-group-title">${safe(group.label || "")}</span>
          <div class="chart-line-toggle-row">
            ${group.items.map((item) => chartLineToggleButton(item, activeLines, action)).join("")}
          </div>
        </div>
      `).join("")}
    </div>
  `;
}

function chartLineToggleButton(item = {}, activeLines = new Set(), action = "") {
  const readOnly = Boolean(item.readOnly);
  const active = readOnly || activeLines.has(item.id);
  const hasValueLabel = item.valueLabel !== undefined && item.valueLabel !== null && item.valueLabel !== "";
  const hasValue = item.value !== undefined && item.value !== null && Number.isFinite(Number(item.value));
  const valueLabel = hasValueLabel ? item.valueLabel : hasValue ? formatWholeCurrency(item.value || 0, "EUR") : "";
  const controlLabel = [item.label, valueLabel, item.detail].filter(Boolean).join(" · ");
  const chartIdAttr = item.chartId ? `data-chart-id="${safe(item.chartId)}"` : "";
  if (readOnly) {
    return `
      <span
        class="chart-line-toggle is-active is-static"
        aria-label="${safe(controlLabel)}"
        title="${safe(controlLabel)}"
      >
        <i class="${safe(item.id)}" aria-hidden="true"></i>
        <span>${safe(item.label)}</span>
        ${valueLabel ? `<strong>${safe(valueLabel)}</strong>` : ""}
        ${item.detail ? `<em>${safe(item.detail)}</em>` : ""}
      </span>
    `;
  }
  return `
    <button
      class="chart-line-toggle ${active ? "is-active" : ""}"
      data-action="${safe(action)}"
      data-line-id="${safe(item.id)}"
      ${chartIdAttr}
      type="button"
      aria-pressed="${active ? "true" : "false"}"
      aria-label="${safe(`Toggle ${controlLabel}`)}"
      title="${safe(controlLabel)}"
    >
      <i class="${safe(item.id)}" aria-hidden="true"></i>
      <span>${safe(item.label)}</span>
      ${valueLabel ? `<strong>${safe(valueLabel)}</strong>` : ""}
      ${item.detail ? `<em>${safe(item.detail)}</em>` : ""}
    </button>
  `;
}

function chartCompactAmount(value, currency = "EUR") {
  return formatShortCurrency(value, currency);
}

function chartCompactSignedAmount(value, currency = "EUR") {
  const numeric = numericValue(value);
  return `${numeric >= 0 ? "+" : "-"}${chartCompactAmount(Math.abs(numeric), currency)}`;
}

function chartSeriesShortLabel(series = {}) {
  const id = String(series?.id || "");
  const label = series?.label || "Value";
  if (id === "actual" && /net worth/i.test(label)) return "Net Worth";
  const labels = {
    "actual": "Actual",
    "compounding-adjusted": "Deficit add-back",
    "forecast": "Forecast",
    "known-value": "Value",
    "leakage-adjusted": "Leakage add-back",
    "monthly-realized": "Monthly P/L",
    "net": "Net",
    "p50": "Expected",
    "portfolio-total": "Total",
    "realized": "Realized P/L",
    "total-income": "Income",
  };
  return labels[id] || label;
}

function chartPointRetentionPct(point = {}) {
  const value = Number(point?.retentionPct);
  return Number.isFinite(value) ? value : null;
}

function chartRetentionTooltipLine(point = {}) {
  const retention = chartPointRetentionPct(point);
  return retention === null ? "" : `Retention: ${formatPercent(retention)}`;
}

function chartRetentionInline(point = {}) {
  const retention = chartPointRetentionPct(point);
  return retention === null ? "" : ` · ${formatPercent(retention)} ret.`;
}

function reportNetWorthHistoryTooltip(point = {}, context = {}) {
  const currency = context.currency || "EUR";
  const value = numericValue(point.value);
  const currentValue = numericValue(context.currentValue);
  if (context.series?.id === "forecast") {
    return [
      monthLabel(point.label || ""),
      `Forecast: ${formatWholeCurrency(value, currency)}`,
      `${signedWholeAmount(value - currentValue, currency)} vs current net worth`,
      chartRetentionTooltipLine(point),
    ].filter(Boolean).join("\n");
  }
  const share = currentValue ? percentOf(value, currentValue) : 0;
  return [
    monthLabel(point.label || ""),
    formatWholeCurrency(value, currency),
    `${formatPercent(share)} of current net worth`,
    chartRetentionTooltipLine(point),
  ].filter(Boolean).join("\n");
}

function reportLineChart(points = [], options = {}) {
  const {
    ariaLabel = "Net worth over time",
    axisPoints = [],
    className = "report-line-chart",
    id = "actual",
    label = "Net Worth",
    labelCount = 4,
    lineControls = null,
    extraSeries = [],
    height = 280,
    markers = [],
    regions = [],
    showLastDot = true,
    showPoints = false,
    tickCount = 5,
    tooltipContext = {},
    tooltipFormatter = standardChartTooltip,
    width = 760,
    yMin,
    yMax,
  } = options;
  const axisLabels = (axisPoints || []).map(chartPointLabel).filter(Boolean);
  const shouldAlignAxis = axisLabels.length > 0;
  const primaryPoints = points.map((point) => ({
    ...point,
    label: point.month || point.label,
    value: point.value,
  }));
  const chartSeries = [
    {
      id,
      label,
      points: shouldAlignAxis ? alignChartPointsToLabels(primaryPoints, axisLabels) : primaryPoints,
    },
    ...extraSeries.map((item) => ({
      ...item,
      points: shouldAlignAxis ? alignChartPointsToLabels(item.points || [], axisLabels) : (item.points || []).map((point) => ({
        ...point,
        label: point.month || point.label,
        value: point.value,
      })),
    })),
  ];
  const labelSourceLength = shouldAlignAxis ? axisLabels.length : points.length;
  const chartOptions = {
    ariaLabel,
    className,
    currency: "EUR",
    height,
    labelIndexes: standardChartLabelIndexes(labelSourceLength, labelCount),
    markers,
    padding: { top: 18, right: 18, bottom: 38, left: 70 },
    regions,
    series: chartSeries,
    showLastDot,
    showPoints,
    tickCount,
    tooltipContext,
    tooltipFormatter,
    width,
    xLabelFormatter: shortMonthLabel,
    yMin,
    yMax,
  };
  return lineControls
    ? standardLineChartWithControls(chartOptions, { chartId: lineControls.chartId || id, ...lineControls })
    : standardLineChart(chartOptions);
}

function chartPointLabel(point = {}) {
  return String(point?.month || point?.label || "");
}

function chartHasValue(value) {
  if (value === null || value === undefined || value === "") return false;
  return Number.isFinite(Number(value));
}

function niceChartScale(rawMin, rawMax, tickCount = 5) {
  let min = Number(rawMin);
  let max = Number(rawMax);
  if (!Number.isFinite(min)) min = 0;
  if (!Number.isFinite(max)) max = min + 1;
  if (min === max) {
    const padding = Math.max(Math.abs(max) * 0.08, 1);
    min -= padding;
    max += padding;
  }
  if (min > max) [min, max] = [max, min];

  const targetTicks = Math.max(2, Math.round(Number(tickCount) || 5));
  const span = Math.max(max - min, 1);
  let step = niceChartStep(span / Math.max(1, targetTicks - 1));
  let niceMin = Math.floor(min / step) * step;
  let niceMax = Math.ceil(max / step) * step;
  if (min >= 0 && niceMin < 0) niceMin = 0;
  if (max <= 0 && niceMax > 0) niceMax = 0;

  let ticks = chartTicksForScale(niceMin, niceMax, step);
  while (ticks.length > 7) {
    step = niceChartStep(step * 1.75);
    niceMin = Math.floor(min / step) * step;
    niceMax = Math.ceil(max / step) * step;
    if (min >= 0 && niceMin < 0) niceMin = 0;
    if (max <= 0 && niceMax > 0) niceMax = 0;
    ticks = chartTicksForScale(niceMin, niceMax, step);
  }
  while (ticks.length < 3 && step > 0) {
    step = niceChartStep(step / 2.5);
    niceMin = Math.floor(min / step) * step;
    niceMax = Math.ceil(max / step) * step;
    if (min >= 0 && niceMin < 0) niceMin = 0;
    if (max <= 0 && niceMax > 0) niceMax = 0;
    ticks = chartTicksForScale(niceMin, niceMax, step);
    if (ticks.length >= 3) break;
  }

  return {
    min: niceMin,
    max: niceMax === niceMin ? niceMin + step : niceMax,
    ticks: ticks.length ? ticks : [niceMin, niceMax],
  };
}

function niceChartStep(value) {
  const numeric = Math.abs(Number(value));
  if (!Number.isFinite(numeric) || numeric <= 0) return 1;
  const exponent = Math.floor(Math.log10(numeric));
  const power = 10 ** exponent;
  const fraction = numeric / power;
  const niceFraction = fraction <= 1
    ? 1
    : fraction <= 2
      ? 2
      : fraction <= 3
        ? 2.5
        : fraction <= 5
          ? 5
          : 10;
  return niceFraction * power;
}

function chartTicksForScale(min, max, step) {
  const ticks = [];
  const precision = chartStepPrecision(step);
  const limit = Math.max(2, Math.ceil((max - min) / step) + 2);
  for (let index = 0; index < limit; index += 1) {
    const value = Number((min + step * index).toFixed(precision));
    if (value > max + step * 0.25) break;
    ticks.push(Math.abs(value) < 1 / (10 ** precision || 1) ? 0 : value);
  }
  if (!ticks.length || ticks[ticks.length - 1] < max - step * 0.25) {
    ticks.push(Number(max.toFixed(precision)));
  }
  return ticks;
}

function chartStepPrecision(step) {
  const text = String(step);
  if (text.includes("e-")) return Math.min(8, Number(text.split("e-")[1]) + 2);
  const decimal = text.split(".")[1];
  return decimal ? Math.min(8, decimal.length + 1) : 2;
}

function alignChartPointsToLabels(points = [], labels = []) {
  const byLabel = new Map();
  (points || []).forEach((point) => {
    const label = chartPointLabel(point);
    if (!label) return;
    byLabel.set(label, point);
  });
  return labels.map((label) => {
    const point = byLabel.get(label);
    return {
      ...(point || {}),
      label,
      value: point && chartHasValue(point.value) ? point.value : null,
    };
  });
}

function standardChartPointIndexes(length = 0) {
  const total = Math.max(0, Math.round(Number(length) || 0));
  if (!total) return [];
  const step = total <= 360 ? 1 : Math.ceil(total / 180);
  const indexes = [];
  for (let index = 0; index < total; index += step) indexes.push(index);
  if (indexes[indexes.length - 1] !== total - 1) indexes.push(total - 1);
  return indexes;
}

function standardLineChart(options = {}) {
  const {
    ariaLabel = "Line chart",
    bands = [],
    className = "",
    currency = "EUR",
    height = 320,
    markers = [],
    padding = { top: 18, right: 70, bottom: 38, left: 70 },
    regions = [],
    series = [],
    showLastDot = false,
    showPoints = false,
    tickCount = 5,
    tooltipContext = {},
    tooltipFormatter = standardChartTooltip,
    width = 900,
    xLabelFormatter = (label) => label,
    yValueFormatter = (value) => formatChartAxisCurrency(value, currency),
    yMin,
    yMax,
  } = options;
  const values = [
    ...series.flatMap((item) => (item.points || []).filter((point) => chartHasValue(point?.value)).map((point) => numericValue(point.value))),
    ...bands.flatMap((band) => [...(band.lower || []), ...(band.upper || [])].filter((point) => chartHasValue(point?.value)).map((point) => numericValue(point.value))),
  ];
  if (!values.length) return emptyState("No chart data available.");

  const rawMin = Math.min(...values);
  const rawMax = Math.max(...values);
  const paddingValue = Math.max((rawMax - rawMin) * 0.08, Math.abs(rawMax) * 0.015, 1);
  const requestedMin = Number.isFinite(Number(yMin)) ? Number(yMin) : rawMin - paddingValue;
  const requestedMax = Number.isFinite(Number(yMax)) ? Number(yMax) : rawMax + paddingValue;
  const yScale = niceChartScale(requestedMin, requestedMax, tickCount);
  const minValue = yScale.min;
  const maxValue = yScale.max;
  const range = maxValue - minValue || 1;
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;
  const longestPoints = series.reduce((best, item) => ((item.points || []).length > best.length ? item.points : best), []);
  const axisLabels = longestPoints.map(chartPointLabel);
  const labelIndexes = options.labelIndexes || standardChartLabelIndexes(longestPoints.length);
  const xForIndex = (index, length) => padding.left + (length === 1 ? 0 : (index / (length - 1)) * plotWidth);
  const yForValue = (value) => padding.top + (1 - ((numericValue(value) - minValue) / range)) * plotHeight;
  const xForLabel = (label) => {
    const index = axisLabels.indexOf(String(label || ""));
    return index >= 0 ? xForIndex(index, longestPoints.length) : null;
  };
  const yTicks = yScale.ticks.slice().reverse().map((value) => ({
    value,
    y: yForValue(value),
  }));
  const hoverTargets = longestPoints.map((anchorPoint, index) => {
    const items = series
      .map((item) => ({ series: item, point: (item.points || [])[index], points: item.points || [] }))
      .filter((item) => item.point && chartHasValue(item.point.value));
    if (!items.length) return "";
    const anchor = items[0];
    const x = xForIndex(index, longestPoints.length);
    const y = yForValue(anchor.point.value);
    const tooltip = items.length === 1
      ? tooltipFormatter(anchor.point, {
          baseValue: numericValue(anchor.points[0]?.value),
          currency,
          index,
          previousPoint: anchor.points[index - 1],
          series: anchor.series,
          ...tooltipContext,
        })
      : standardGroupedChartTooltip(anchorPoint, items, { currency, ...tooltipContext });
    const edgeClass = x < width * 0.18 ? "edge-left" : x > width * 0.82 ? "edge-right" : "";
    return `
      <span
        class="report-chart-hit ${edgeClass}"
        data-tooltip="${safe(tooltip)}"
        style="left: ${(x / width * 100).toFixed(3)}%; top: ${(y / height * 100).toFixed(3)}%;"
      ></span>
    `;
  }).join("");

  return `
    <div class="standard-line-chart ${safe(className)}" role="img" aria-label="${safe(ariaLabel)}">
      <svg viewBox="0 0 ${width} ${height}" preserveAspectRatio="none">
        ${yTicks.map((tick) => `
          <line class="report-chart-grid" x1="${padding.left}" y1="${tick.y.toFixed(2)}" x2="${width - padding.right}" y2="${tick.y.toFixed(2)}"></line>
          <text class="report-chart-y" x="${padding.left - 12}" y="${(tick.y + 4).toFixed(2)}" text-anchor="end">${safe(yValueFormatter(tick.value))}</text>
        `).join("")}
        ${regions.map((region) => {
          const startX = xForLabel(region.startLabel);
          const endX = xForLabel(region.endLabel);
          if (startX === null || endX === null) return "";
          const x = Math.min(startX, endX);
          const regionWidth = Math.abs(endX - startX);
          if (regionWidth < 1) return "";
          return `<rect class="standard-chart-region ${safe(region.id || "")}" x="${x.toFixed(2)}" y="${padding.top}" width="${regionWidth.toFixed(2)}" height="${plotHeight.toFixed(2)}"></rect>`;
        }).join("")}
        ${bands.map((band) => {
          const lower = band.lower || [];
          const upper = band.upper || [];
          const length = Math.min(lower.length, upper.length);
          if (length < 2) return "";
          const upperPath = upper.slice(0, length).map((point, index) => `${xForIndex(index, length).toFixed(2)},${yForValue(point.value).toFixed(2)}`);
          const lowerPath = lower.slice(0, length).map((point, index) => `${xForIndex(index, length).toFixed(2)},${yForValue(point.value).toFixed(2)}`).reverse();
          return `<polygon class="standard-chart-band ${safe(band.id || "")}" points="${safe([...upperPath, ...lowerPath].join(" "))}"></polygon>`;
        }).join("")}
        ${series.map((item) => {
          const points = item.points || [];
          const segments = [];
          let segment = [];
          points.forEach((point, index) => {
            if (!point || !chartHasValue(point.value)) {
              if (segment.length) {
                segments.push(segment);
                segment = [];
              }
              return;
            }
            segment.push(`${xForIndex(index, points.length).toFixed(2)},${yForValue(point.value).toFixed(2)}`);
          });
          if (segment.length) segments.push(segment);
          let lastIndex = -1;
          for (let index = points.length - 1; index >= 0; index -= 1) {
            if (chartHasValue(points[index]?.value)) {
              lastIndex = index;
              break;
            }
          }
          const last = lastIndex >= 0 ? points[lastIndex] : null;
          const markerIndexes = Array.isArray(item.pointIndexes)
            ? item.pointIndexes
            : standardChartPointIndexes(points.length);
          const pointMarkers = (showPoints || item.showPoints) ? markerIndexes.map((index) => {
            const point = points[index];
            if (!point || !chartHasValue(point.value)) return "";
            return `<circle class="standard-chart-point ${safe(item.id || "")}" cx="${xForIndex(index, points.length).toFixed(2)}" cy="${yForValue(point.value).toFixed(2)}" r="2.2"></circle>`;
          }).join("") : "";
          if (item.lineVisible === false) return "";
          return `
            ${segments.map((path) => `<polyline class="standard-chart-line ${safe(item.id || "")}" points="${safe(path.join(" "))}"></polyline>`).join("")}
            ${pointMarkers}
            ${showLastDot && last ? `<circle class="report-chart-dot ${safe(item.id || "")}" cx="${xForIndex(lastIndex, points.length).toFixed(2)}" cy="${yForValue(last.value).toFixed(2)}" r="3"></circle>` : ""}
          `;
        }).join("")}
        ${markers.map((marker) => {
          const markerX = xForLabel(marker.label);
          if (markerX === null) return "";
          const label = safe(marker.text || "");
          const anchor = markerX < width * 0.2 ? "start" : markerX > width * 0.8 ? "end" : "middle";
          const textX = markerX < width * 0.2 ? markerX + 4 : markerX > width * 0.8 ? markerX - 4 : markerX;
          return `
            <line class="standard-chart-marker ${safe(marker.id || "")}" x1="${markerX.toFixed(2)}" y1="${padding.top}" x2="${markerX.toFixed(2)}" y2="${(height - padding.bottom).toFixed(2)}"></line>
            ${label ? `<text class="standard-chart-marker-label ${safe(marker.id || "")}" x="${textX.toFixed(2)}" y="${Math.max(10, padding.top - 6).toFixed(2)}" text-anchor="${anchor}">${label}</text>` : ""}
          `;
        }).join("")}
        ${labelIndexes.map((index) => {
          const point = longestPoints[index];
          if (!point) return "";
          return `<text class="report-chart-x" x="${xForIndex(index, longestPoints.length).toFixed(2)}" y="${height - 10}" text-anchor="${index === 0 ? "start" : index === longestPoints.length - 1 ? "end" : "middle"}">${safe(xLabelFormatter(point.label))}</text>`;
        }).join("")}
      </svg>
      <div class="report-chart-hover-layer" aria-hidden="true">
        ${hoverTargets}
      </div>
    </div>
  `;
}

function standardChartTooltip(point = {}, context = {}) {
  const currency = context.currency || "EUR";
  const formatter = context.valueFormatter || ((value) => formatWholeCurrency(value, currency));
  const value = numericValue(point.value);
  const baseValue = numericValue(context.baseValue);
  const change = value - baseValue;
  const changePercent = baseValue ? percentOf(change, baseValue) : 0;
  const changeLine = context.valueFormatter
    ? `${signedPercent(change)} vs first point`
    : `${signedWholeAmount(change, currency)} · ${signedPercent(changePercent)}`;
  return [
    monthLabel(point.label || ""),
    `${context.series ? `${chartSeriesShortLabel(context.series)}: ` : ""}${formatter(value)}`,
    changeLine,
    chartRetentionTooltipLine(point),
  ].filter(Boolean).join("\n");
}

function standardGroupedChartTooltip(label, items = [], context = {}) {
  const currency = context.currency || "EUR";
  const formatter = context.valueFormatter || ((value) => formatWholeCurrency(value, currency));
  const anchorPoint = typeof label === "object" && label ? label : {};
  const labelText = anchorPoint.label || label || "";
  const invested = numericValue(anchorPoint.invested ?? items[0]?.point?.invested);
  const investedLabel = context.investedLabel || "Invested";
  const investedLine = invested ? [`${investedLabel}: ${formatWholeCurrency(invested, currency)}`] : [];
  const showReturnPercent = Boolean(context.showReturnPercent && invested);
  return [
    monthLabel(labelText),
    ...investedLine,
    ...items.map((item) => {
      const value = numericValue(item.point?.value);
      const returnPercent = showReturnPercent && !item.series?.noReturnPercent ? ` (${signedPercent(percentOf(value - invested, invested))})` : "";
      return `${chartSeriesShortLabel(item.series)}: ${formatter(value)}${returnPercent}${chartRetentionInline(item.point)}`;
    }),
  ].join("\n");
}

function chartLegend(items = [], note = "") {
  if (!items.length && !note) return "";
  return `
    <div class="report-chart-legend" aria-hidden="true">
      ${items.map(([id, label]) => `<span><i class="${safe(id)}"></i>${safe(label)}</span>`).join("")}
      ${note ? `<em>${safe(note)}</em>` : ""}
    </div>
  `;
}

function standardChartLabelIndexes(length = 0, maxLabels = 4) {
  const count = Math.max(0, Number(length || 0));
  if (!count) return [];
  if (count === 1) return [0];
  const labels = Math.max(2, Number(maxLabels || 4));
  return [...new Set(Array.from({ length: labels }, (_value, index) => Math.round((index / (labels - 1)) * (count - 1))))];
}

function renderStatementImport() {
  if (state.loading.statementImport && !state.statementImport) return loadingState("Loading statement import");
  if (state.error.statementImport && !state.statementImport) return errorState("Statements Import", state.error.statementImport);

  const data = state.statementImport || {};
  const rows = data.rows || [];
  const unsupportedRows = data.unsupported_rows || [];
  const visibleRows = visibleStatementImportRows();
  const visibleUnsupportedRows = visibleStatementUnsupportedRows();
  const isBusy = state.loading.statementImport;
  const queuedCount = rows.length + unsupportedRows.length;
  const selectedImportCount = statementImportSelectedRecordIds(rows).length;
  const selectedDeleteCount = statementImportSelectedFileNames(rows, unsupportedRows).length;
  const canImport = !isBusy && selectedImportCount > 0;
  const canClearSelected = !isBusy && selectedDeleteCount > 0;
  const canClear = !isBusy && queuedCount > 0;

  return `
    <section class="transactions-head">
      <h1>Statements Import</h1>
    </section>
    <nav class="transaction-tabs statement-import-commandbar" aria-label="Statement import actions">
      <input data-statement-import-input type="file" multiple accept=".eml,.pdf,.csv,.tsv,.txt,message/rfc822,application/pdf,text/csv,text/tab-separated-values,text/plain" hidden aria-hidden="true" />
      <button data-action="upload-statement-import" type="button" ${isBusy ? "disabled" : ""}>
        <span data-icon="paperclip"></span>
        <span>Upload</span>
      </button>
      <button data-action="refresh-statement-import" type="button" ${isBusy ? "disabled" : ""}>
        <span data-icon="refresh"></span>
        <span>Preview</span>
      </button>
      <button data-action="clear-selected-statement-import" type="button" ${canClearSelected ? "" : "disabled"}>
        <span data-icon="trash"></span>
        <span>Delete Selected</span>
      </button>
      <button data-action="clear-statement-import" type="button" ${canClear ? "" : "disabled"}>
        <span data-icon="x"></span>
        <span>Clear All</span>
      </button>
      <button class="${canImport ? "is-active" : ""}" data-action="apply-statement-import" type="button" ${canImport ? "" : "disabled"}>
        <span data-icon="check"></span>
        <span>Import Selected</span>
      </button>
    </nav>
    <section class="settings-summary">
      ${inlineStat("Parsed", formatNumber(data.parsed_transactions || 0), "transactions")}
      ${inlineStat("Importable", formatNumber(data.importable || 0), "ready")}
      ${inlineStat("Duplicates", formatNumber(data.duplicates || 0), "skipped")}
      ${inlineStat("Unsupported", formatNumber(data.unsupported_files || 0), "files")}
    </section>
    ${statementImportStatus()}
    ${statementImportSection("Import Queue", statementImportTable(visibleRows, Boolean(statementImportQuery() && rows.length)))}
    ${visibleUnsupportedRows.length ? statementImportSection("Unsupported Files", statementUnsupportedTable(visibleUnsupportedRows)) : ""}
  `;
}

function statementImportRowMatches(row = {}, query = "") {
  if (!query) return true;
  return [
    row.import_decision,
    row.decision_reason,
    row.match_basis,
    row.source_type,
    row.source_file,
    row.file_name,
    row.suffix,
    row.proposed_transaction_id,
    row.duplicate_transaction_id,
    row.transaction_id,
    row.memo,
    row.transaction_class,
    row.category_id,
    row.subcategory_id,
    row.account_id,
    row.country_code,
    row.statement_currency,
    row.statement_amount,
    row.sanitized_statement_amount,
    row.posted_date,
    row.transaction_date,
  ].some((value) => String(value || "").toLowerCase().includes(query));
}

function statementImportSection(title, body) {
  const icon = panelIcon(title);
  return `
    <section class="statement-import-section">
      <header class="panel-header">
        <h2>${icon ? `<span class="panel-title-icon" aria-hidden="true">${icons[icon]}</span>` : ""}<span>${safe(title)}</span></h2>
      </header>
      ${body}
    </section>
  `;
}

function statementImportStatus() {
  const messages = [];
  const selectedImportCount = statementImportSelectedRecordIds().length;
  const selectedFileCount = statementImportSelectedFileNames().length;
  if (selectedImportCount || selectedFileCount) {
    const parts = [];
    if (selectedImportCount) parts.push(`${formatNumber(selectedImportCount)} selected to import`);
    if (selectedFileCount) parts.push(`${formatNumber(selectedFileCount)} selected file${selectedFileCount === 1 ? "" : "s"}`);
    messages.push(`<div class="statement-import-status">${safe(parts.join(" · "))}</div>`);
  }
  if (state.statementImportActionMessage) messages.push(`<div class="statement-import-status">${safe(state.statementImportActionMessage)}</div>`);
  if (state.statementImportActionError) messages.push(`<div class="statement-import-status is-error">${safe(state.statementImportActionError)}</div>`);
  if (state.loading.statementImport) messages.push(`<div class="statement-import-status">Working...</div>`);
  return messages.join("");
}

function statementImportQuery() {
  return state.query.trim().toLowerCase();
}

function visibleStatementImportRows() {
  const rows = state.statementImport?.rows || [];
  const query = statementImportQuery();
  return query ? rows.filter((row) => statementImportRowMatches(row, query)) : rows;
}

function visibleStatementUnsupportedRows() {
  const rows = state.statementImport?.unsupported_rows || [];
  const query = statementImportQuery();
  return query ? rows.filter((row) => statementImportRowMatches(row, query)) : rows;
}

function statementImportRecordId(row = {}) {
  return String(row.import_record_id || "").trim();
}

function statementImportRowSelectable(row = {}) {
  return Boolean(statementImportRecordId(row));
}

function statementImportRowImportable(row = {}) {
  return row.import_decision === "import" && Boolean(statementImportRecordId(row));
}

function statementFileName(row = {}) {
  return statementFileLabel(row.file_name || row.source_file || "");
}

function statementImportSelectedRecordIds(rows = state.statementImport?.rows || []) {
  const validIds = new Set(rows.filter(statementImportRowImportable).map(statementImportRecordId));
  return Array.from(state.selectedStatementImportRecords).filter((id) => validIds.has(id));
}

function statementImportSelectedFileNames(
  _rows = state.statementImport?.rows || [],
  unsupportedRows = state.statementImport?.unsupported_rows || []
) {
  const fileNames = new Set();
  unsupportedRows.forEach((row) => {
    const name = statementFileName(row);
    if (name && state.selectedStatementImportFiles.has(name)) fileNames.add(name);
  });
  _rows.forEach((row) => {
    if (!state.selectedStatementImportRecords.has(statementImportRecordId(row))) return;
    const name = statementFileName(row);
    if (name) fileNames.add(name);
  });
  return Array.from(fileNames);
}

function setStatementImportData(data, options = {}) {
  state.statementImport = data || {};
  syncStatementImportSelection(options);
}

function syncStatementImportSelection(options = {}) {
  const rows = state.statementImport?.rows || [];
  const unsupportedRows = state.statementImport?.unsupported_rows || [];
  const importableIds = new Set(rows.filter(statementImportRowImportable).map(statementImportRecordId));
  state.selectedStatementImportRecords = options.selectImportable
    ? new Set(importableIds)
    : new Set(Array.from(state.selectedStatementImportRecords).filter((id) => importableIds.has(id)));

  const queuedUnsupportedFileNames = new Set(unsupportedRows.map(statementFileName).filter(Boolean));
  state.selectedStatementImportFiles = new Set(
    Array.from(state.selectedStatementImportFiles).filter((fileName) => queuedUnsupportedFileNames.has(fileName))
  );
}

function statementImportTable(rows = [], isFiltered = false) {
  if (!rows.length) return emptyState(isFiltered ? "No statement transactions match the current search." : "No statement transactions are queued.");
  const selectableRows = rows.filter(statementImportRowSelectable);
  const allVisibleSelected = selectableRows.length > 0 && selectableRows.every((row) => state.selectedStatementImportRecords.has(statementImportRecordId(row)));
  return `
    <section class="minimal-table-wrap statement-import-table-wrap">
      <table class="minimal-table statement-import-table">
        <thead>
          <tr>
            <th class="check-cell"><input data-select-statement-import-page type="checkbox" ${allVisibleSelected ? "checked" : ""} ${selectableRows.length ? "" : "disabled"} aria-label="Select visible statement transactions" /></th>
            <th>Decision</th>
            <th>Transaction Date</th>
            <th>Memo</th>
            <th class="align-right">Amount</th>
            <th>Class</th>
            <th>Match</th>
            <th>Transaction</th>
          </tr>
        </thead>
        <tbody>
          ${rows.map((row) => {
            const recordId = statementImportRecordId(row);
            const canSelect = statementImportRowSelectable(row);
            return `
            <tr>
              <td class="check-cell">
                <input
                  data-statement-import-select
                  type="checkbox"
                  value="${safe(recordId)}"
                  ${state.selectedStatementImportRecords.has(recordId) ? "checked" : ""}
                  ${canSelect ? "" : "disabled"}
                  aria-label="Select statement transaction"
                />
              </td>
              <td><span class="status-chip ${safe(row.import_decision)}">${safe(statementDecisionLabel(row.import_decision))}</span></td>
              <td>${safe(formatDisplayDate(row.transaction_date || row.posted_date || row.occurred_at))}</td>
              <td>
                <span class="table-main">${safe(row.memo || "-")}</span>
                <span class="table-sub">${safe(statementFileLabel(row.source_file) || row.source_type || "")}</span>
              </td>
              <td class="align-right">${formatCurrency(numericValue(row.sanitized_statement_amount || row.statement_amount), row.statement_currency || "EUR")}</td>
              <td>${safe(taxonomyLabel(row.transaction_class || "-"))}</td>
              <td>
                <span class="table-main">${safe(statementMatchLabel(row))}</span>
                <span class="table-sub">${safe(row.match_basis || row.decision_reason || "")}</span>
              </td>
              <td>${safe(row.proposed_transaction_id || row.duplicate_transaction_id || "-")}</td>
            </tr>
          `;
          }).join("")}
        </tbody>
      </table>
    </section>
  `;
}

function statementUnsupportedTable(rows = []) {
  const selectableRows = rows.filter((row) => Boolean(statementFileName(row)));
  const allVisibleSelected = selectableRows.length > 0 && selectableRows.every((row) => state.selectedStatementImportFiles.has(statementFileName(row)));
  return `
    <section class="minimal-table-wrap statement-import-table-wrap">
      <table class="minimal-table statement-import-table statement-unsupported-table">
        <thead>
          <tr>
            <th class="check-cell"><input data-select-statement-file-page type="checkbox" ${allVisibleSelected ? "checked" : ""} ${selectableRows.length ? "" : "disabled"} aria-label="Select visible unsupported statement files" /></th>
            <th>File</th>
            <th>Type</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${rows.map((row) => {
            const fileName = statementFileName(row);
            return `
            <tr>
              <td class="check-cell">
                <input
                  data-statement-file-select
                  type="checkbox"
                  value="${safe(fileName)}"
                  ${state.selectedStatementImportFiles.has(fileName) ? "checked" : ""}
                  ${fileName ? "" : "disabled"}
                  aria-label="Select unsupported statement file"
                />
              </td>
              <td>
                <span class="table-main statement-file-name">${safe(statementFileLabel(row.file_name) || "-")}</span>
                <span class="table-sub">${safe(row.source_type || "Needs a supported parser")}</span>
              </td>
              <td>${safe(String(row.suffix || "").replace(".", "").toUpperCase() || "File")}</td>
              <td><span class="status-chip">Unsupported</span></td>
            </tr>
          `;
          }).join("")}
        </tbody>
      </table>
    </section>
  `;
}

function statementFileLabel(value = "") {
  return String(value || "").split(/[\\/]/).filter(Boolean).pop() || "";
}

function statementDecisionLabel(decision = "") {
  if (decision === "import") return "Import";
  if (decision === "skip_duplicate") return "Duplicate";
  return labelize(decision || "review");
}

function statementMatchLabel(row = {}) {
  const confidence = numericValue(row.match_confidence, Number.NaN);
  if (!Number.isFinite(confidence)) return row.decision_reason || "-";
  return `${formatPercent(confidence * 100)} confidence`;
}

function renderSettings() {
  if (state.loading.overview && !state.overview) return loadingState("Loading settings");
  if (state.error.overview && !state.overview) return errorState("Settings", state.error.overview);

  const stats = filterRows(sourceStats(), ["name", "purpose", "status"]);
  const connections = filterRows(connectionItems, ["name", "detail", "state"]);
  const overview = state.overview || {};
  const accounts = overview.accounts || {};
  const transactions = overview.transactions || {};
  const projectCurrency = state.projectCurrency || "EUR";
  const netWorth = projectCurrencyAccountValue(accounts, "net_worth");

  return `
    <section class="transactions-head settings-head">
      <h1>Settings</h1>
    </section>
    <section class="settings-page">
      ${settingsDashboard({ accounts, connections, netWorth, projectCurrency, stats, transactions })}
    </section>
  `;
}

function settingsDashboard(context = {}) {
  return settingsInsightGrid([
    settingsProfileForm(),
    ...settingsProjectCards(context),
    ...settingsSourceTruthCards(context),
    ...settingsSyncCards(),
    ...settingsConnectionsCards(context),
    ...settingsThresholdCards(),
    ...settingsPreferencesCards(),
  ], "settings-all-grid settings-line-grid");
}

function renderAbout() {
  return `
    <section class="transactions-head settings-head">
      <h1>About</h1>
    </section>
    ${settingsAboutTabs()}
    <section class="settings-page">
      ${state.aboutView === "changelog" ? settingsChangelogPanel() : settingsCopyrightPanel()}
    </section>
  `;
}

function settingsAboutTabs() {
  const tabs = [
    { id: "copyright", label: "Copyright & License" },
    { id: "changelog", label: "Changelog" },
  ];
  return `
    <nav class="transaction-tabs settings-about-tabs" aria-label="About sections">
      ${tabs.map((tab) => `
        <button
          class="${state.aboutView === tab.id ? "is-active" : ""}"
          data-action="about-tab"
          data-about-view="${safe(tab.id)}"
          type="button"
        >${safe(tab.label)}</button>
      `).join("")}
    </nav>
  `;
}

function settingsCopyrightPanel() {
  const currentYear = new Date().getFullYear();
  return settingsInsightGrid([
    settingsDocumentListCard([
      ["Product", "Ledger", "Personal finance workspace for source-truth review, portfolio planning, and reporting."],
      ["Copyright", `Copyright (c) ${currentYear} Alexandru Cornea. All rights reserved.`, "Ownership and notices apply to the application, documentation, and distributed assets unless separately stated."],
    {
      label: "Contact",
      valueHtml: '<a class="settings-row-link" href="mailto:contact@alexandru-cornea.com">contact@alexandru-cornea.com</a>',
      note: "Use this address for support, licensing, security disclosures, and permission requests.",
    },
      ["License", "Repository license controls use", "If a LICENSE file or written agreement is provided, that license governs. Otherwise, no rights are granted beyond personal evaluation or internal use expressly permitted by the owner."],
      ["Public Package", "User-owned data model", "Ledger Public is distributed without private data or credentials. Users are responsible for their own Google Sheet, service-account file, backups, and access controls."],
      ["Disclaimer", "No financial advice", "Information generated by Ledger is for recordkeeping and planning support only. It is not investment, tax, legal, accounting, or financial advice."],
      ["Warranty", "Provided as is", "The software is provided without warranties of merchantability, fitness for a particular purpose, accuracy, availability, or non-infringement, to the maximum extent permitted by law."],
      ["Third-party Services", "Separate terms apply", "Google Sheets, market-data providers, libraries, brokers, banks, and other connected services remain governed by their own terms and privacy policies."],
    ]),
  ], "settings-document-grid");
}

function settingsChangelogPanel() {
  if (state.loading.aboutChangelog && !state.aboutChangelog) {
    return settingsInsightGrid([
      settingsMetricCard({ label: "Changelog", value: "Loading", meta: "", note: "Loading updates.", icon: "fileText" }),
    ]);
  }
  if (state.error.aboutChangelog && !state.aboutChangelog) {
    return settingsInsightGrid([
      settingsMetricCard({ label: "Changelog", value: "Unable to load", meta: state.error.aboutChangelog, note: "Updates could not be loaded.", icon: "fileText", tone: "negative" }),
    ]);
  }
  const changelog = state.aboutChangelog || {};
  const body = changelog.body || "# Changelog\n\nNo changelog entries are available.";
  return settingsInsightGrid([
    settingsDocumentCard(markdownDocument(changelogBodyWithoutTitle(body))),
  ]);
}

function changelogBodyWithoutTitle(markdown = "") {
  return String(markdown || "").replace(/^\s*#\s+Changelog\s*(?:\r?\n)+/i, "");
}

function settingsProfileForm() {
  if (state.loading.profile && !state.profile) {
    return settingsMetricCard({ label: "Profile", value: "Loading", meta: "local profile", note: "Loading profile settings.", icon: "user" });
  }
  if (state.error.profile && !state.profile) {
    return settingsMetricCard({
      label: "Profile",
      value: "Unable to load data",
      meta: state.error.profile,
      note: "Update or restart the Ledger server so the profile endpoint is available.",
      icon: "user",
      tone: "negative",
      actionsHtml: `
        <button class="small-button" data-action="retry-profile" type="button">
          <span data-icon="refresh"></span>
          <span>Retry</span>
        </button>
      `,
    });
  }
  const profile = state.profile?.profile || {};
  const updated = profile.updated_at ? profile.updated_at.replace("T", " ").replace("Z", " UTC") : "Not saved";
  const status = state.profileActionError
    ? `<p class="inline-status is-error">${safe(state.profileActionError)}</p>`
    : state.profileActionMessage
      ? `<p class="inline-status">${safe(state.profileActionMessage)}</p>`
      : "";
  return `
    <form class="settings-profile-form" data-profile-form>
      ${[
        settingsMetricCard({ label: "Name", valueHtml: settingsProfileInput("name", profile.name || "", "text", "given-name"), meta: "Profile", note: "Given name shown in local profile settings.", icon: "user", className: "settings-input-card" }),
        settingsMetricCard({ label: "Surname", valueHtml: settingsProfileInput("surname", profile.surname || "", "text", "family-name"), meta: "Profile", note: "Family name shown in local profile settings.", icon: "user", className: "settings-input-card" }),
        settingsMetricCard({ label: "Email", valueHtml: settingsProfileInput("email", profile.email || "", "email", "email"), meta: "Contact", note: "Email stored only in the local profile file.", icon: "mail", className: "settings-input-card" }),
        settingsMetricCard({
          label: "Profile Status",
          value: "Local profile",
          meta: `Updated: ${updated}`,
          note: "Saved locally for display and contact details only.",
          icon: "check",
          actionsHtml: `
            <button class="small-button" type="submit" ${state.loading.profile ? "disabled" : ""}>
              <span data-icon="save"></span>
              <span>${state.loading.profile ? "Saving" : "Save profile"}</span>
            </button>
            ${status}
          `,
        }),
      ].join("")}
    </form>
  `;
}

function settingsProfileInput(name, value = "", type = "text", autocomplete = "off", placeholder = "") {
  return `
    <input
      name="${safe(name)}"
      type="${safe(type)}"
      value="${safe(value)}"
      autocomplete="${safe(autocomplete)}"
      ${placeholder ? `placeholder="${safe(placeholder)}"` : ""}
    />
  `;
}

function settingsInsightGrid(cards, className = "") {
  return `<section class="overview-insight-grid settings-insight-grid ${safe(className)}">${cards.join("")}</section>`;
}

function settingsMetricCard({ label, value = "", meta = "", note = "", icon = "", valueHtml = "", metaHtml = "", noteHtml = "", actionsHtml = "", tone = "", className = "" } = {}) {
  const iconKey = icon || panelIcon(label) || metricIcon(label);
  const hasValue = value !== null && value !== undefined && String(value) !== "";
  const classes = ["metric-card", "settings-metric-card", tone ? `is-${tone}` : "", className].filter(Boolean).join(" ");
  return `
    <article class="${classes}">
      <div class="metric-card-head">
        <span class="metric-card-icon" aria-hidden="true">${icons[iconKey] || icons.target}</span>
        <span class="metric-card-label">${safe(label || "")}</span>
      </div>
      ${valueHtml ? `<div class="settings-card-value">${valueHtml}</div>` : `<strong class="${hasValue ? "" : "is-empty"}">${hasValue ? safe(value) : "&nbsp;"}</strong>`}
      ${metaHtml || (meta ? `<small>${safe(meta)}</small>` : "")}
      ${noteHtml || (note ? `<em>${safe(note)}</em>` : "")}
      ${actionsHtml ? `<div class="settings-card-actions">${actionsHtml}</div>` : ""}
    </article>
  `;
}

function settingsDocumentCard(bodyHtml = "") {
  return `
    <article class="metric-card settings-metric-card settings-document-card settings-document-body-card">
      ${bodyHtml}
    </article>
  `;
}

function settingsDocumentListCard(rows = []) {
  const normalizedRows = rows.map((row) => Array.isArray(row)
    ? { label: row[0], value: row[1], note: row[2] }
    : row);
  return settingsDocumentCard(`
    <ul class="settings-document-list">
      ${normalizedRows.map((row) => `
        <li>
          <span class="settings-document-label">${safe(row.label || "")}</span>
          <span class="settings-document-value">${row.valueHtml || safe(displayDetailValue(row.value))}</span>
          ${row.note ? `<span class="settings-document-note">${safe(row.note)}</span>` : ""}
        </li>
      `).join("")}
    </ul>
  `);
}

function settingsRowsToMetricCards(rows, icon = "settings") {
  const normalizedRows = rows.map((row) => Array.isArray(row)
    ? { label: row[0], value: row[1], note: row[2] }
    : row);
  return normalizedRows.map((row) => settingsMetricCard({
    label: row.label,
    value: row.value,
    valueHtml: row.valueHtml || "",
    meta: row.meta || "",
    note: row.note || "",
    icon: row.icon || icon,
    tone: row.tone || "",
    className: row.className || "",
  }));
}

function settingsProjectCards({ accounts = {}, netWorth = 0, projectCurrency = "EUR" } = {}) {
  return [
    settingsMetricCard({ label: "Project Currency", valueHtml: settingsProjectCurrencyControl(projectCurrencyCode()), meta: "Display baseline", note: "Used across summaries, charts, reports, and printouts. Native source rows stay in their original currencies.", icon: "currency", className: "settings-input-card" }),
    settingsMetricCard({ label: "Current Net Worth", value: formatWholeCurrency(netWorth, projectCurrency, { project: false }), meta: "selected project currency", note: "Current capital position from source truth accounts.", icon: "wallet" }),
    settingsMetricCard({ label: "Currency Coverage", value: supportedProjectCurrencies().join(" / "), meta: "conversion table", note: "Currencies supported by the shared conversion table.", icon: "currency" }),
  ];
}

function settingsSourceTruthCards({ stats = [], transactions = {} } = {}) {
  const sourceRows = stats.reduce((total, item) => total + numericValue(item.rows), 0);
  const registerCards = stats.length
    ? stats.map((row, index) => settingsMetricCard({
      label: settingsSourceRegisterLabel(row, index),
      value: `${formatNumber(row.rows)} rows`,
      meta: `${formatNumber(row.columns)} cols · ${row.status || "Ready"}`,
      note: row.purpose || "Source truth register loaded from the active data store.",
      icon: "database",
    }))
    : [settingsMetricCard({ label: "Source Truth", value: "No registers", meta: "not available", note: "No source truth registers are available.", icon: "database" })];
  return [
    settingsMetricCard({ label: "Source Rows", value: formatNumber(sourceRows), meta: "live registers", note: "Rows currently loaded from source truth registers.", icon: "database" }),
    ...registerCards,
    settingsMetricCard({ label: "Open Review", value: formatNumber(transactions.review_open ?? transactions.review_required ?? 0), meta: "transactions", note: "Transactions still requiring manual review.", icon: "target" }),
    settingsDataHealthCard(),
    settingsMetricCard({ label: "Imports", value: "Local attachments", meta: "statements", note: "Statements are linked to transactions and preserved in the project.", icon: "paperclip" }),
  ];
}

function settingsSourceRegisterLabel(row = {}, index = 0) {
  const raw = row.name || row.sheet_name || row.sheet || row.register || row.table || row.id || "";
  return raw ? labelize(raw) : `Source Register ${index + 1}`;
}

function settingsSyncCards() {
  const cache = state.cacheStatus || {};
  const snapshot = cache.snapshot || {};
  const memorySheets = Array.isArray(cache.memory) ? cache.memory.length : 0;
  const snapshotLabel = snapshot.mode === "google_sheets"
    ? "Google Sheets"
    : snapshot.path
      ? "SQLite ready"
      : "Runtime store";
  const snapshotMeta = snapshot.mode === "google_sheets"
    ? "google sheet cache"
    : snapshot.path
      ? "local cache"
      : "runtime store";
  return [
    settingsMetricCard({ label: "Refresh Policy", value: "Manual refresh", meta: "sidebar refresh", note: "Use refresh when Google Sheets changes.", icon: "refresh" }),
    settingsMetricCard({ label: "Memory Cache", value: `${formatNumber(memorySheets)} sheets`, meta: `TTL ${formatNumber(cache.ttl_seconds || 0)} seconds`, note: "Live in-memory cache for loaded sheets.", icon: "database" }),
    settingsMetricCard({ label: "Snapshot Cache", value: snapshotLabel, meta: snapshotMeta, note: "Startup snapshot store for faster reloads.", icon: "database" }),
    settingsMetricCard({ label: "Refresh Now", value: "Source truth", meta: "manual action", note: "Refresh all loaded ledger data.", icon: "refresh", actionsHtml: settingsRefreshButton() }),
    settingsMetricCard({ label: "Portfolio Instruments", value: "Manual values refresh", meta: "prices", note: "Updates active instrument prices and brokerage account investment totals.", icon: "trendUp" }),
    settingsMetricCard({ label: "Refresh Portfolio Values", value: refreshingPricesLabel(), meta: "manual action", note: "Refresh active instrument values.", icon: "trendUp", actionsHtml: settingsPortfolioRefreshButton() }),
  ];
}

function settingsDataHealthCard() {
  const health = state.dataHealth || {};
  const healthValue = state.loading.settingsDiagnostics
    ? "Checking"
    : `${formatNumber(health.issue_count || 0)} issues`;
  const healthNote = health.ok === false
    ? Object.entries(health.counts || {}).map(([key, value]) => `${labelize(key)} ${formatNumber(value)}`).slice(0, 3).join(" · ")
    : "No active data-health issues reported.";
  return settingsMetricCard({
    label: "Data Health",
    value: healthValue,
    meta: health.ok === false ? "needs review" : "ready",
    note: healthNote,
    icon: "check",
    tone: health.ok === false ? "negative" : "",
  });
}

function refreshingPricesLabel() {
  const status = state.tradePriceRefresh || {};
  if (status.loading) return "Refreshing";
  if (status.error) return "Needs retry";
  if (status.message) return "Updated";
  return "Ready";
}

function settingsRefreshButton() {
  return `
    <button class="small-button" data-action="refresh-data" type="button">
      <span data-icon="refresh"></span>
      <span>Refresh now</span>
    </button>
  `;
}

function settingsPortfolioRefreshButton() {
  const refreshingPrices = Boolean(state.tradePriceRefresh?.loading);
  return `
    ${tradePriceRefreshNotice()}
    <button class="small-button" data-action="refresh-trade-prices" type="button" ${refreshingPrices ? "disabled" : ""}>
      <span data-icon="refresh"></span>
      <span>${refreshingPrices ? "Refreshing values" : "Refresh portfolio values"}</span>
    </button>
  `;
}

function settingsConnectionsCards({ connections = [] } = {}) {
  const cards = connections.map((row) => settingsMetricCard({
    label: row.name,
    value: row.state,
    meta: row.detail,
    note: "Connection dependency used by Ledger.",
    icon: "plug",
  }));
  return cards.length ? cards : [
    settingsMetricCard({ label: "Connections", value: "No connections", meta: "not available", note: "No connection items are available.", icon: "plug" }),
  ];
}

function settingsThresholdCards() {
  const values = state.intelligenceThresholds || defaultIntelligenceThresholds();
  const rows = [
    ["Concentration warning", "concentrationWarningPct", "%", "Provider share of net worth before concentration risk is flagged."],
    ["Credit utilization warning", "creditUtilizationWarningPct", "%", "Used credit share before utilization is flagged."],
    ["Cash runway warning", "cashRunwayWarningMonths", "months", "Liquid capital runway floor."],
    ["Expense ceiling severity", "expenseCeilingWarningEur", "EUR", "Overspending amount before ceiling breaches are high-priority."],
    ["Trade loss warning", "tradeLossWarningPct", "%", "Active unrealized loss threshold."],
    ["Trade position cap", "tradePositionCapPct", "%", "Active position share threshold."],
    ["Stale price warning", "tradeStalePriceDays", "days", "Market price age threshold."],
  ];
  return [
    ...rows.map(([label, field, suffix, note]) => settingsMetricCard({
      label,
      valueHtml: `
        <div class="target-detail-input settings-threshold-input">
          <input
            data-threshold-field="${safe(field)}"
            data-format-number
            inputmode="decimal"
            type="text"
            value="${safe(formatEditableNumber(values[field] ?? defaultIntelligenceThresholds()[field]))}"
          />
          <em>${safe(suffix)}</em>
        </div>
      `,
      meta: "",
      note,
      icon: "target",
      className: "settings-input-card",
    })),
    settingsMetricCard({
      label: "Reset Thresholds",
      value: "Defaults",
      meta: "local settings",
      note: "Restore the default intelligence thresholds.",
      icon: "undo",
      actionsHtml: `
        <button class="small-button" data-action="reset-intelligence-thresholds" type="button">
          <span data-icon="undo"></span>
          <span>Reset thresholds</span>
        </button>
      `,
    }),
  ];
}

function settingsPreferencesCards() {
  return settingsRowsToMetricCards([
    ["Theme", document.documentElement.dataset.theme === "dark" ? "Dark" : "Light", "Toggle from the sidebar."],
    ["Reporting period", periodValueLabel(), "Controls Overview and default Transactions scope."],
    ["Manual entries", "Review required", "New and duplicated transactions are kept visible for review."],
  ], "settings");
}

function settingsProjectCurrencyControl(selected = "EUR") {
  return `
    <select class="settings-select" data-project-currency aria-label="Project currency">
      ${supportedProjectCurrencies().map((currency) => `
        <option value="${safe(currency)}" ${currency === selected ? "selected" : ""}>${safe(currencyOptionLabel(currency, projectCurrencyName(currency)))}</option>
      `).join("")}
    </select>
  `;
}

function projectCurrencyName(currency = "") {
  return {
    EUR: "Euro",
    USD: "US Dollar",
    AED: "UAE Dirham",
    RON: "Romanian Leu",
    GBP: "British Pound",
    CHF: "Swiss Franc",
    CAD: "Canadian Dollar",
    AUD: "Australian Dollar",
    INR: "Indian Rupee",
    JPY: "Japanese Yen",
  }[normalizeCurrencyCode(currency)] || currencyName(currency);
}

function projectCurrencyAccountValue(accounts = {}, key = "net_worth") {
  const selectedCurrency = projectCurrencyCode();
  const currency = selectedCurrency.toLowerCase();
  const selected = accounts[`${key}_${currency}`];
  if (selected !== undefined && selected !== null && selected !== "") return selected;
  return convertCurrencyValue(accounts[`${key}_eur`] ?? 0, "EUR", selectedCurrency);
}

function pageTitle(title, tabs = []) {
  return `
    <section class="page-title">
      <div>
        <nav class="breadcrumb"><span>Ledger</span><span>/</span><span>${safe(title)}</span></nav>
        <h1>${safe(title)}</h1>
      </div>
      <nav class="page-tabs">
        ${tabs.map((tab, index) => `<button class="${index === 0 ? "is-active" : ""}" type="button">${safe(tab)}</button>`).join("")}
      </nav>
    </section>
  `;
}

function panel(title, body, variant = "", actions = "") {
  const icon = panelIcon(title);
  return `
    <section class="panel ${variant}">
      <header class="panel-header">
        <h2>${icon ? `<span class="panel-title-icon" aria-hidden="true">${icons[icon]}</span>` : ""}<span>${safe(title)}</span></h2>
        ${actions ? `<div class="panel-actions">${actions}</div>` : ""}
      </header>
      ${body}
    </section>
  `;
}

function panelIcon(title) {
  return {
    "Income Heatmap": "trendUp",
    "Spending Heatmap": "trendDown",
    "Allocation": "pie",
    "Currency Exposure": "currency",
    "Top Accounts by Value": "wallet",
    "Provider Breakdown": "bank",
    "Account Type Mix": "pie",
    "Credit Utilization": "creditCard",
    "Category Spend": "pie",
    "Income Sources": "trendUp",
    "Currency Flow": "currency",
    "Market Value by Currency": "currency",
    "Realized P/L by Currency": "trendUp",
    "Unrealized P/L by Currency": "trendUp",
    "Trades by Provider": "bank",
    "Instrument Mix": "pie",
    "Trade Attention": "target",
    "Net Worth Over Time": "trendUp",
    "Net Worth Forecast": "trendUp",
    "Cash Flow": "currency",
    "Portfolio Instruments": "pie",
    "Monte Carlo Projection": "trendUp",
    "Exit Strategy": "target",
    "Portfolio Plan": "pie",
    "Phase Capital Path": "trendUp",
    "Global Search": "search",
    "Statements Import": "paperclip",
    "Import Queue": "receipt",
    "Unsupported Files": "fileText",
    "Project": "settings",
    "Profile": "user",
    "Project Snapshot": "target",
    "Source Truth": "database",
    "Connections": "plug",
    "Data & Sync": "refresh",
    "Intelligence Thresholds": "target",
    "Preferences": "settings",
    "Copyright & License": "info",
    "Changelog": "fileText",
    "Accounts Loading": "wallet",
    "Accounts": "wallet",
    "Transactions Loading": "receipt",
    "Transactions": "receipt",
    "Trades Loading": "trendUp",
    "Trades": "trendUp",
    "Planning Loading": "target",
    "Planning": "target",
    "Portfolio Funding": "pie",
    "P/L Over Time": "trendUp",
    "Realized vs Unrealized": "trendUp",
    "Active Exposure": "pie",
    "Return Composition": "trendUp",
    "Instrument Returns": "trendUp",
    "Year Performance": "trendUp",
    "Return Attention": "target",
  }[title] || "";
}

function railMetric(label, value, note) {
  return metricCard(label, value, note);
}

function inlineStat(label, value, note) {
  return metricCard(label, value, note);
}

function allocationBars(rows = [], netWorth = 0) {
  return barBreakdown(rows, netWorth, "eur", {
    detail: (row) => nativeCurrencySummaryOrBlank(row.native_amounts),
    action: "filter-accounts",
    dataKey: "capitalBucket",
    iconContext: "allocation",
  });
}

function exposureBars(rows = [], netWorth = 0) {
  return barBreakdown(rows, netWorth, "eur", {
    detail: (row) => nativeCurrencySummaryOrBlank(row.native_amounts),
    action: "filter-accounts",
    dataKey: "accountCurrency",
    iconContext: "currency",
  });
}

function topAccountsBars(rows = []) {
  const visible = rows.filter((row) => Number(row.amount_eur || 0) > 0).slice(0, 5);
  return insightBars(
    visible.map((row) => ({
      label: accountDisplayName(row),
      value: formatWholeCurrency(row.amount_eur, "EUR"),
      detail: [labelize(row.provider_id), formatWholeCurrency(row.native_amount ?? row.amount_eur, row.currency || "EUR")].filter(Boolean).join(" · "),
      icon: insightIconFor(row.account_type || row.capital_bucket || row.provider_id, "account"),
      share: row.pct_of_net || 0,
      action: "filter-accounts",
      dataAttrs: `data-account-id="${safe(row.account_id || "")}"`,
    })),
    "No accounts available.",
  );
}

function accountDisplayName(row = {}) {
  const reference = String(row.account_reference || "").trim();
  if (reference && !accountReferenceLooksLikeStatus(reference, row)) return reference;
  return row.account_id || [labelize(row.provider_id), row.currency].filter(Boolean).join(" · ") || "Unnamed account";
}

function accountReferenceLooksLikeStatus(value, row = {}) {
  const statusValues = new Set(["active", "inactive", "closed", "deleted", "accountable", "not_accountable", "review_done", "review_required"]);
  const normalized = canonicalTaxonomyValue(value);
  const rowStatus = String(row.account_status || "").trim().toLowerCase();
  return statusValues.has(normalized) || Boolean(rowStatus && normalized === rowStatus);
}

function barBreakdown(rows = [], netWorth = 0, key = "eur", options = {}) {
  const visible = rows.filter((row) => Number(row[key] || 0) > 0).slice(0, 5);
  return insightBars(
    visible.map((row) => {
      const secondaryValue = options.secondaryKey ? numericValue(row[options.secondaryKey]) : 0;
      const detail = typeof options.detail === "function"
        ? options.detail(row)
        : secondaryValue
          ? formatWholeCurrency(secondaryValue, options.secondaryCurrency || "USD")
          : "";
      return {
        label: labelize(row.name),
        value: formatWholeCurrency(row[key], key === "usd" ? "USD" : "EUR"),
        detail,
        icon: insightIconFor(row.name, options.iconContext || ""),
        share: percentOf(row[key], netWorth),
        action: options.action || "",
        dataAttrs: options.action && options.dataKey ? `data-${kebabCase(options.dataKey)}="${safe(row.name || "")}"` : "",
      };
    }),
    "No values available.",
  );
}

function insightBars(items = [], emptyLabel = "No values available.") {
  const visible = items.filter((item) => item && item.label).slice(0, 6);
  if (!visible.length) return emptyState(emptyLabel);
  return `
    <div class="minimal-bars insight-bars">
      ${visible.map((item) => {
        const share = Math.abs(numericValue(item.share));
        const width = Math.max(2, Math.min(100, share));
        const tag = item.action ? "button" : "article";
        const attrs = item.action
          ? `type="button" data-action="${safe(item.action)}" ${item.dataAttrs || ""}`
          : "";
        return `
          <${tag} ${attrs}>
            <div class="bar-row">
              <span class="bar-primary">
                <span class="bar-row-icon" aria-hidden="true">${insightIconSvg(item)}</span>
                <span class="bar-label">
                  <strong>${safe(item.label)}</strong>
                  ${item.detail ? `<small>${safe(item.detail)}</small>` : ""}
                </span>
              </span>
              <span class="bar-value">
                <strong>${safe(item.value || "")}</strong>
                ${Number.isFinite(Number(item.share)) && item.shareLabel !== "" ? `<small>${safe(item.shareLabel || formatPercent(item.share))}</small>` : ""}
              </span>
            </div>
            <i style="width:${width}%"></i>
          </${tag}>
        `;
      }).join("")}
    </div>
  `;
}

function insightIconSvg(item = {}) {
  return icons[item.icon] || icons[insightIconFor(item.label, item.iconContext || "")] || icons.wallet;
}

function insightIconFor(label = "", context = "") {
  const value = normalizeInsightIconValue(label);
  if (context === "currency" || /^[A-Z]{3}$/.test(String(label || ""))) return "currency";
  if (context === "provider" || context === "income-source") {
    if (value.includes("revolut")) return "phoneWallet";
    if (value.includes("ibkr") || value.includes("interactive brokers")) return "trendUp";
    if (value.includes("manual")) return "edit";
    if (value.includes("mashreq") || value.includes("adcb") || value.includes("ing") || value.includes("wise")) return "bank";
    return "briefcase";
  }
  if (context === "account-type" || context === "account") {
    if (value.includes("credit")) return "creditCard";
    if (value.includes("wallet")) return "phoneWallet";
    if (value.includes("brokerage") || value.includes("trading") || value.includes("investment")) return "trendUp";
    if (value.includes("emergency") || value.includes("pension")) return "shield";
    if (value.includes("receivable")) return "receipt";
    if (value.includes("bank")) return "bank";
  }
  if (context === "allocation") {
    if (value.includes("investment") || value.includes("trading")) return "trendUp";
    if (value.includes("reserve")) return "wallet";
    if (value.includes("receivable")) return "receipt";
    if (value.includes("liability")) return "creditCard";
  }
  if (context === "instrument") {
    if (value.includes("etf") || value.includes("etp")) return "pie";
    if (value.includes("stock") || value.includes("equity")) return "trendUp";
  }
  if (value.includes("food") || value.includes("restaurant") || value.includes("dining")) return "utensils";
  if (value.includes("electronic") || value.includes("software") || value.includes("device")) return "laptop";
  if (value.includes("transfer") || value.includes("exchange") || value.includes("topup") || value.includes("deposit")) return "arrowsLeftRight";
  if (value.includes("accommodation") || value.includes("hotel") || value.includes("rental") || value.includes("housing")) return "bed";
  if (value.includes("transport") || value.includes("taxi") || value.includes("travel")) return "car";
  if (value.includes("clinic") || value.includes("pharmacy") || value.includes("physio") || value.includes("medical") || value.includes("medicine") || value.includes("massage")) return "heartPulse";
  if (value.includes("service") || value.includes("barber") || value.includes("repair")) return "wrench";
  if (value.includes("bank charge") || value.includes("fee")) return "receipt";
  if (value.includes("interest") || value.includes("cashback") || value.includes("salary") || value.includes("income")) return "trendUp";
  return context === "category" ? "pie" : "wallet";
}

function normalizeInsightIconValue(value = "") {
  return String(value || "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function activityHeatmap(payload = {}, type = "expense") {
  const items = payload.items || [];
  if (!items.length) return emptyState("No period activity.");
  const granularity = payload.granularity || "day";
  const transactionClass = type === "income" ? "income" : "expense";
  const maxValue = Math.max(1, ...items.map((row) => Number(row.amount_eur || 0)));
  const isDayGrid = granularity === "day";
  const firstDate = new Date(`${String(payload.label || currentMonthKey()).slice(0, 7)}-01T00:00:00`);
  const leadingBlanks = isDayGrid && !Number.isNaN(firstDate.getTime()) ? (firstDate.getDay() + 6) % 7 : 0;
  return `
    <div class="heatmap-summary">
      <strong>${formatCurrency(payload.total_eur || 0, "EUR")}</strong>
    </div>
    ${isDayGrid ? `<div class="heatmap-weekdays">${["M", "T", "W", "T", "F", "S", "S"].map((day) => `<span>${day}</span>`).join("")}</div>` : ""}
    <div class="activity-heatmap ${safe(payload.granularity || "day")} ${safe(type)}">
      ${Array.from({ length: leadingBlanks }, () => "<span class=\"is-empty\"></span>").join("")}
      ${items
        .map((row) => {
          const intensity = Math.ceil((Number(row.amount_eur || 0) / maxValue) * 5);
          const rangeLabel = heatmapRangeLabel(row.date, granularity);
          const amountLabel = formatCurrency(row.amount_eur || 0, "EUR");
          const tooltip = `${rangeLabel}: ${amountLabel}`;
          return `
            <button
              class="heat-${intensity}"
              data-action="heatmap-transactions"
              data-heatmap-date="${safe(row.date || "")}"
              data-heatmap-granularity="${safe(granularity)}"
              data-transaction-class="${safe(transactionClass)}"
              ${tooltipAttrs(tooltip)}
              type="button"
            >${safe(row.label)}</button>
          `;
        })
        .join("")}
    </div>
  `;
}

function overviewStrategicCards(accounts = {}, transactions = {}, trades = {}, portfolio = {}) {
  const series = transactions.monthly_series || [];
  const completeNetWorthPoints = reportNetWorthSeries(accounts, transactions, "all").filter((point) => point.month < currentMonthKey());
  const netWorthPoints = (completeNetWorthPoints.length ? completeNetWorthPoints : reportNetWorthSeries(accounts, transactions, "all"))
    .map((point) => numericValue(point.value))
    .slice(-24);
  const netFlowPoints = monthlyNetFlowSeries(series, 24);
  const savingsRatePoints = monthlySavingsRateSeries(series, 24);
  const expensePoints = recentCompletedMonthlyValues(series, "expense_eur", 24);
  const averageIncome = averageMonthlyIncome(series, 12);
  const averageSpend = averageMonthlyExpense(series, 12);
  const monthlySurplus = averageIncome - averageSpend;
  const liquidCapital = numericValue(accounts.liquid_capital_eur);
  const cashRunway = averageSpend > 0 ? liquidCapital / averageSpend : 0;
  const ytdNet = numericValue(transactions.ytd_net_eur);
  const ytdIncome = numericValue(transactions.ytd_income_eur);
  const ytdSavingsRate = percentOf(ytdNet, ytdIncome);

  return [
    dashboardCard(
      "strategic-net-worth",
      "Net Worth",
      formatWholeCurrency(accounts.net_worth_eur || 0, "EUR"),
      `${signedWholeAmount(ytdNet, "EUR")} YTD net flow`,
      "Balance-sheet anchor from accounts and positions.",
      "wallet",
      {
        delta: trendDeltaItems(netWorthPoints),
        sparkline: netWorthPoints,
        tone: "strategic",
      },
    ),
    dashboardCard(
      "strategic-monthly-surplus",
      "Monthly Surplus",
      signedWholeAmount(monthlySurplus, "EUR"),
      "12-month income minus expenses",
      "Recurring capital before discretionary allocation.",
      monthlySurplus >= 0 ? "trendUp" : "trendDown",
      {
        delta: trendDeltaItems(netFlowPoints),
        sparkline: netFlowPoints,
        tone: monthlySurplus >= 0 ? "positive" : "negative",
      },
    ),
    dashboardCard(
      "strategic-savings-rate",
      "Savings Rate",
      formatPercent(ytdSavingsRate),
      "YTD retained income",
      "Recorded income retained after expenses.",
      ytdSavingsRate >= 0 ? "trendUp" : "trendDown",
      {
        delta: trendDeltaItems(savingsRatePoints, { mode: "point" }),
        sparkline: savingsRatePoints,
        tone: ytdSavingsRate >= 0 ? "positive" : "negative",
      },
    ),
    dashboardCard(
      "strategic-cash-runway",
      "Cash Runway",
      cashRunway ? `${formatRunway(cashRunway)} months` : "-",
      `${formatWholeCurrency(liquidCapital, "EUR")} liquid`,
      "Liquid capital divided by rolling spend.",
      "sun",
      {
        delta: trendDeltaItems(runwaySeriesFromExpenses(expensePoints, liquidCapital)),
        sparkline: runwaySeriesFromExpenses(expensePoints, liquidCapital),
        tone: cashRunway >= 6 ? "positive" : "negative",
      },
    ),
  ];
}

function overviewSystemInsights(accounts = {}, transactions = {}, trades = {}, portfolio = {}) {
  const series = transactions.monthly_series || [];
  const thresholds = state.intelligenceThresholds || defaultIntelligenceThresholds();
  const insights = [];
  const savingsRates = monthlySavingsRateSeries(series, 24);
  const savingsBaseline = rollingBaselineDelta(savingsRates, "point");
  const largestExpense = largestExpenseCategory(transactions);
  const averageSpend = averageMonthlyExpense(series, 12);
  const averageIncome = averageMonthlyIncome(series, 12);
  const liquidCapital = numericValue(accounts.liquid_capital_eur);
  const topAccount = largestAccountExposureData(accounts);
  const summary = overviewPortfolioSummary(portfolio);
  const monthlyDeployment = numericValue(summary.monthly_contribution_eur);
  const monthlySurplus = averageIncome - averageSpend;
  const structuralOverspending = numericValue(transactions.capital_targets?.structural_overspending_eur);

  if (savingsBaseline && Math.abs(savingsBaseline.delta) >= 1) {
    insights.push(overviewSignal(
      savingsBaseline.delta >= 0 ? "Savings rate above baseline" : "Savings rate below baseline",
      `${signedMetricDelta(savingsBaseline.delta, "point")} vs rolling baseline`,
      savingsBaseline.delta >= 0 ? "trendUp" : "trendDown",
      savingsBaseline.delta >= 0 ? "positive" : "negative",
    ));
  }

  if (largestExpense.amount > 0) {
    insights.push(overviewSignal(
      `${largestExpense.category} leads spending`,
      `${formatWholeCurrency(largestExpense.amount, "EUR")} · ${formatPercent(largestExpense.share)} of period expenses`,
      "pie",
    ));
  }

  if (averageSpend > 0) {
    const reserveTarget = averageSpend * 6;
    const reserveDelta = liquidCapital - reserveTarget;
    if (reserveDelta > 1000) {
      insights.push(overviewSignal(
        "Idle liquidity above reserve target",
        `${formatWholeCurrency(reserveDelta, "EUR")} over six-month spend reserve`,
        "wallet",
      ));
    } else if (reserveDelta < -1000) {
      insights.push(overviewSignal(
        "Liquidity below reserve target",
        `${formatWholeCurrency(Math.abs(reserveDelta), "EUR")} below six-month spend reserve`,
        "sun",
        "negative",
      ));
    }
  }

  if (topAccount.pct >= thresholds.concentrationWarningPct * 0.75) {
    insights.push(overviewSignal(
      `${topAccount.provider} concentration remains elevated`,
      `${formatPercent(topAccount.pct)} of net worth in one provider`,
      "scale",
      topAccount.pct >= thresholds.concentrationWarningPct ? "negative" : "",
      topAccount.pct >= thresholds.concentrationWarningPct ? 4 : 2,
    ));
  }

  if (monthlyDeployment > 0 && monthlySurplus > 0) {
    const deploymentGap = monthlySurplus - monthlyDeployment;
    const gapPct = percentOf(deploymentGap, monthlySurplus);
    if (Math.abs(gapPct) >= 8) {
      insights.push(overviewSignal(
        deploymentGap >= 0 ? "Deployment below observed surplus" : "Deployment exceeds observed surplus",
        `${signedWholeAmount(deploymentGap, "EUR")} gap versus rolling monthly surplus`,
        deploymentGap >= 0 ? "target" : "trendDown",
        deploymentGap >= 0 ? "" : "negative",
      ));
    }
  }

  if (structuralOverspending > thresholds.expenseCeilingWarningEur) {
    insights.push(overviewSignal(
      "Structural overspending requires review",
      `${formatWholeCurrency(structuralOverspending, "EUR")} above planning ceilings · leakage component`,
      "trendDown",
      "negative",
      5,
    ));
  }

  return overviewSignalFallback(sortOverviewSignals(insights), "Capital system is stable", "Rule checks did not detect a material planning variance.").slice(0, 5);
}

function overviewSignalPanel(title, signals = []) {
  const panelClass = kebabCase(title);
  if (panelClass === "system-insights") {
    return `
      <section class="overview-signal-panel ${safe(panelClass)}">
        <div class="overview-section-head">
          <span class="section-kicker">${safe(title)}</span>
        </div>
        <section class="insight-strip dashboard-card-grid overview-signal-card-grid">
          ${signals.map((item) => overviewSignalMetricCard(item)).join("")}
        </section>
      </section>
    `;
  }
  return `
    <section class="overview-signal-panel ${safe(panelClass)}">
      <div class="overview-section-head">
        <span class="section-kicker">${safe(title)}</span>
      </div>
      <div class="overview-signal-list">
        ${signals.map((item, index) => `
          <article class="overview-signal ${index === 0 ? "is-primary" : ""} ${safe(item.tone || "")}">
            <span class="overview-signal-icon" aria-hidden="true">${icons[item.icon] || icons.target}</span>
            <span class="overview-signal-copy">
              <span class="overview-signal-topline">
                <strong>${safe(item.title)}</strong>
                <small>${safe(overviewSignalSeverityLabel(item))}</small>
              </span>
              <em>${safe(item.detail)}</em>
            </span>
          </article>
        `).join("")}
      </div>
    </section>
  `;
}

function overviewSignalMetricCard(item = {}) {
  const parts = overviewSignalCardParts(item);
  return metricCard(
    item.title || "Insight",
    parts.value,
    parts.meta,
    parts.note,
    item.icon,
    { tone: item.tone },
  );
}

function overviewSignalCardParts(item = {}) {
  const detail = String(item.detail || "").trim();
  const severity = overviewSignalSeverityLabel(item);
  if (!detail) return { value: severity, meta: "system signal", note: "" };
  if (detail.includes(" · ")) {
    const [value, ...rest] = detail.split(" · ").map((part) => part.trim()).filter(Boolean);
    return { value: value || severity, meta: rest.join(" · "), note: `${severity} priority` };
  }
  const match = detail.match(/^([+\-]?(?:(?:[A-Z]{3})\s*)?(?:[$€£])?\d[\d,.]*(?:\s?(?:%|pts?|months?))?)\s+(.+)$/i);
  if (match) return { value: match[1], meta: match[2], note: `${severity} priority` };
  return { value: severity, meta: detail, note: "" };
}

function overviewSignal(title, detail, icon = "target", tone = "", severity = 1) {
  return { title, detail, icon, tone, severity };
}

function overviewSignalSeverityLabel(item = {}) {
  if (item.tone === "positive") return "Stable";
  const severity = signalSeverity(item);
  if (severity >= 5) return "Critical";
  if (severity >= 4) return "High";
  if (severity >= 2) return "Watch";
  return "Info";
}

function sortOverviewSignals(items = []) {
  return [...items].sort((a, b) => signalSeverity(b) - signalSeverity(a));
}

function signalSeverity(item = {}) {
  if (Number.isFinite(Number(item.severity))) return Number(item.severity);
  if (item.tone === "negative") return 3;
  if (item.tone === "positive") return 0;
  return 1;
}

function overviewSignalFallback(items = [], title, detail) {
  return items.length ? items : [overviewSignal(title, detail, "check", "positive")];
}

function overviewPortfolioSummary(portfolio = {}) {
  const instruments = currentPortfolioInstrumentRows(portfolio);
  const mipRows = currentPortfolioMipRows(portfolio);
  return portfolioSummaryFromRows(portfolio.summary || {}, instruments, mipRows);
}

function monthlyNetFlowSeries(series = [], count = 24) {
  return recentCompletedMonthlyRows(series, count).map((row) => {
    const income = numericValue(row.income_eur);
    const expense = numericValue(row.expense_eur);
    return numericValue(row.net_eur, income - expense);
  });
}

function monthlySavingsRateSeries(series = [], count = 24) {
  return recentCompletedMonthlyRows(series, count).map((row) => {
    const income = numericValue(row.income_eur);
    const expense = numericValue(row.expense_eur);
    const net = numericValue(row.net_eur, income - expense);
    return income ? clampValue(percentOf(net, income), -100, 100) : null;
  }).filter((value) => value !== null);
}

function runwaySeriesFromExpenses(expenses = [], liquidCapital = 0) {
  return expenses.map((expense) => {
    const value = numericValue(expense);
    return value > 0 ? liquidCapital / value : 0;
  });
}

function trendDeltaItems(values = [], options = {}) {
  const mode = options.mode || "percent";
  const lowerIsBetter = Boolean(options.lowerIsBetter);
  const numbers = values.map((value) => Number(value)).filter((value) => Number.isFinite(value));
  if (numbers.length < 2) return [];
  const current = numbers.at(-1);
  const items = [
    trendDeltaItem(current, numbers.at(-13), "YoY", mode, lowerIsBetter),
    trendDeltaItem(current, numbers.at(-2), "vs previous period", mode, lowerIsBetter),
  ];
  const baseline = rollingBaselineDelta(numbers, mode, lowerIsBetter);
  if (baseline) items.push({ ...baseline, label: "vs rolling baseline" });
  return items.filter(Boolean).slice(0, 3);
}

function trendDeltaItem(current, previous, label, mode = "percent", lowerIsBetter = false) {
  if (!Number.isFinite(current) || !Number.isFinite(previous)) return null;
  if (mode !== "point" && previous === 0) return null;
  const delta = mode === "point" ? current - previous : percentOf(current - previous, previous);
  if (!Number.isFinite(delta) || Math.abs(delta) < 0.1) return null;
  const positive = lowerIsBetter ? delta <= 0 : delta >= 0;
  return {
    delta,
    value: signedMetricDelta(delta, mode),
    label,
    tone: positive ? "positive" : "negative",
  };
}

function rollingBaselineDelta(values = [], mode = "percent", lowerIsBetter = false) {
  const numbers = values.map((value) => Number(value)).filter((value) => Number.isFinite(value));
  if (numbers.length < 4) return null;
  const current = numbers.at(-1);
  const baselineValues = numbers.slice(Math.max(0, numbers.length - 13), -1);
  const baseline = average(baselineValues);
  return trendDeltaItem(current, baseline, "vs rolling baseline", mode, lowerIsBetter);
}

function signedMetricDelta(value, mode = "percent") {
  const numeric = Number(value || 0);
  const sign = numeric >= 0 ? "+" : "-";
  if (mode === "point") {
    return `${sign}${formatPercent(Math.abs(numeric)).replace("%", "")} pts`;
  }
  return `${sign}${formatPercent(Math.abs(numeric))}`;
}

function metricDeltaHtml(items = []) {
  if (state.privacyMode || !items.length) return "";
  return `
    <div class="metric-delta-strip">
      ${items.map((item) => `
        <span class="metric-delta ${safe(item.tone || "")}">
          <strong>${safe(item.value)}</strong>
          <em>${safe(item.label)}</em>
        </span>
      `).join("")}
    </div>
  `;
}

function microSparkline(values = [], seriesId = "") {
  if (state.privacyMode) return "";
  const numbers = values.map((value) => Number(value)).filter((value) => Number.isFinite(value));
  if (numbers.length < 2) return "";
  const width = 120;
  const height = 28;
  const min = Math.min(...numbers);
  const max = Math.max(...numbers);
  const range = max - min;
  const points = numbers.map((value, index) => {
    const x = numbers.length === 1 ? 0 : (index / (numbers.length - 1)) * width;
    const y = range ? height - ((value - min) / range) * height : height / 2;
    return `${x.toFixed(2)},${y.toFixed(2)}`;
  }).join(" ");
  const className = ["metric-sparkline", seriesId].filter(Boolean).join(" ");
  return `<svg class="${safe(className)}" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none" aria-hidden="true"><polyline points="${points}"></polyline></svg>`;
}

function overviewDashboardCards(accounts = {}, transactions = {}, trades = {}) {
  const grossInflow = transactionTotal(transactions, "lifetime_income_eur", "income_eur");
  const capitalConsumption = transactionTotal(transactions, "lifetime_expense_eur", "expense_eur");
  const theoreticalRetained = grossInflow - capitalConsumption;
  const actualRetained = numericValue(accounts.net_worth_eur);
  const capitalLeakage = actualRetained - theoreticalRetained;
  const structuralOverspending = numericValue(transactions.capital_targets?.structural_overspending_eur);
  const realizedGains = numericValue(trades.realized_pl_eur, currencyTotal(trades.realized_pl_by_currency));
  const unrealizedGains = numericValue(trades.unrealized_pl_eur, currencyTotal(trades.unrealized_pl_by_currency));
  const leakageContext = netWorthLeakageContext(accounts, transactions);
  const totalCompoundingDeficit = -numericValue(leakageContext.compoundingDeficit);
  const netWorth = numericValue(accounts.net_worth_eur);
  const liquidCapital = numericValue(accounts.liquid_capital_eur);
  const nonLiquidCapital = numericValue(accounts.non_liquid_capital_eur, netWorth - liquidCapital);
  const reviewOpen = numericValue(transactions.review_open, transactions.review_required);

  return [
    dashboardCard("liquid-capital", "Liquid Capital", formatWholeCurrency(liquidCapital, "EUR"), `${formatPercent(percentOf(liquidCapital, netWorth))} of net worth`, "Cash-like capital and liquid reserves available without selling long-term positions.", "wallet"),
    dashboardCard("non-liquid-capital", "Non Liquid Capital", formatWholeCurrency(nonLiquidCapital, "EUR"), `${formatPercent(percentOf(nonLiquidCapital, netWorth))} of net worth`, "Capital held in investments, pensions, receivables, and other less liquid buckets.", "wallet"),
    creditUtilizationRiskCard(accounts.credit_cards),
    investmentShareRiskCard(accounts),
    dashboardCard("needs-review", "Review", formatNumber(reviewOpen), "live sheets", "Transactions still requiring manual review in the source truth.", "target"),
    dataQualityCard(transactions),
    unreviewedImpactCard(transactions),
    manualEntryCard(transactions),
    targetBreachMonthsCard(transactions),
    transactionAnomalyCard(transactions),
    recurringPatternCard(transactions),
    tradeMarketExposureCard(trades),
    dashboardCard("capital-ledger-gap", "Capital Ledger Gap", signedWholeAmount(capitalLeakage, "EUR"), capitalPercent(capitalLeakage, grossInflow), "Leakage component when negative: expected retained capital minus current net worth.", "trendDown"),
    dashboardCard("structural-overspending", "Structural Overspending", signedWholeAmount(-structuralOverspending, "EUR"), capitalPercent(-structuralOverspending, grossInflow), "Leakage component from spending above the annual ceilings defined in Planning.", "trendDown"),
    dashboardCard("compounding-deficit", "Compounding Deficit", signedWholeAmount(totalCompoundingDeficit, "EUR"), capitalPercent(totalCompoundingDeficit, grossInflow), `Deficit = leakage plus estimated missed compounding at ${(MODERATE_INDEX_RATE * 100).toFixed(0)}% per year.`, "trendDown"),
    dashboardCard("realized-capital-gains", "Realized Capital Gains", signedWholeAmount(realizedGains, "EUR"), capitalPercent(realizedGains, grossInflow), "Closed-position gains already crystallized in trading history.", "trendUp"),
    dashboardCard("unrealized-capital-gains", "Unrealized Capital Gains", signedWholeAmount(unrealizedGains, "EUR"), capitalPercent(unrealizedGains, grossInflow), "Open-position mark-to-market gain or loss.", "trendUp"),
    ...dashboardInsightCards(accounts, transactions, trades, realizedGains, unrealizedGains),
  ];
}

function creditUtilizationRiskCard(cards = []) {
  const credit = creditUtilizationData(cards);
  const thresholds = state.intelligenceThresholds || defaultIntelligenceThresholds();
  return dashboardCard(
    "credit-utilization",
    "Credit Utilization",
    credit.limit ? formatPercent(credit.pct) : "-",
    credit.limit ? `${credit.usedLabel} used` : "no known limits",
    `Used credit across cards with known limits; warning threshold is ${formatPercent(thresholds.creditUtilizationWarningPct)}.`,
    "creditCard",
    { tone: credit.pct >= thresholds.creditUtilizationWarningPct ? "negative" : "" },
  );
}

function investmentShareRiskCard(accounts = {}) {
  const netWorth = numericValue(accounts.net_worth_eur);
  const investmentCapital = breakdownAmount(accounts.by_bucket, ["investment", "investments"]);
  const share = percentOf(investmentCapital, netWorth);
  return dashboardCard(
    "investment-share",
    "Investment Share",
    formatPercent(share),
    formatWholeCurrency(investmentCapital, "EUR"),
    "Capital currently allocated to investment buckets.",
    "pie",
    { tone: share >= 75 ? "negative" : "" },
  );
}

function dashboardCard(id, label, value, meta = "", note = "", icon = "", extra = {}) {
  return { id, label, value, meta, note, icon, ...extra };
}

function dashboardToolbar(cards = [], title = "Insights") {
  const hiddenCount = cards.filter((card) => state.hiddenDashboardCards.has(card.id)).length;
  return `
    <div class="dashboard-toolbar">
      <span class="section-kicker">${safe(title)}</span>
      <div class="dashboard-customize">
        <button class="icon-button dashboard-customize-button" data-action="toggle-dashboard-menu" type="button" aria-expanded="${state.dashboardCardMenuOpen}" ${tooltipAttrs("Customize diagnostics")}>
          <span data-icon="settings"></span>
        </button>
        ${state.dashboardCardMenuOpen ? dashboardCardMenu(cards, hiddenCount) : ""}
      </div>
    </div>
  `;
}

function dashboardCardMenu(cards = [], hiddenCount = 0) {
  return `
    <div class="dashboard-card-menu" data-dashboard-card-menu>
      <div class="dashboard-card-menu-head">
        <strong>Dashboard Cards</strong>
        ${hiddenCount ? `<button class="table-action-button" data-action="show-all-dashboard-cards" type="button">Show all</button>` : ""}
      </div>
      <div class="dashboard-card-menu-list">
        ${cards.map((card) => {
          const checked = !state.hiddenDashboardCards.has(card.id);
          return `
            <label>
              <input type="checkbox" data-dashboard-card-toggle data-dashboard-card="${safe(card.id)}" ${checked ? "checked" : ""}>
              <span>${safe(card.label)}</span>
            </label>
          `;
        }).join("")}
      </div>
    </div>
  `;
}

function dashboardCardGrid(cards = []) {
  const visibleCards = cards.filter((card) => !state.hiddenDashboardCards.has(card.id));
  if (!visibleCards.length) {
    return `<div class="dashboard-empty">${emptyState("All insight cards are hidden. Use the gear menu to restore them.")}</div>`;
  }
  return visibleCards
    .map((card) => metricCard(card.label, card.value, card.meta, card.note, card.icon, {
      id: card.id,
      hideable: true,
      delta: card.delta,
      sparkline: card.sparkline,
      tone: card.tone,
    }))
    .join("");
}

function dashboardInsightCards(accounts = {}, transactions = {}, trades = {}, realizedGains = 0, unrealizedGains = 0) {
  const series = transactions.monthly_series || [];
  const investmentCapital = breakdownAmount(accounts.by_bucket, ["investment", "investments"]);
  const investmentReturn = percentOf(realizedGains + unrealizedGains, investmentCapital);

  return [
    fxExposureOutsideBaseCard(accounts),
    expenseVolatilityCard(series),
    recurringSpendBaselineCard(series),
    investableSurplusCard(series),
    liabilityRatioCard(accounts),
    creditHeadroomCard(accounts.credit_cards),
    categoryConcentrationCard(transactions),
    incomeVolatilityCard(series),
    positiveCashflowMonthsCard(series),
    dashboardCard("investment-return-ytd", "Investment Return (YTD)", signedPercent(investmentReturn), "realized + unrealized", "Gain rate versus current investment capital.", "trendUp"),
    tradeStalenessCard(trades),
  ];
}

function dataQualityCard(transactions = {}) {
  const total = numericValue(transactions.total);
  const issueCount = numericValue(transactions.review_open)
    + numericValue(transactions.uncategorized)
    + numericValue(transactions.missing_core_fields);
  const score = total ? Math.max(0, 100 - percentOf(issueCount, total)) : 0;
  return dashboardCard(
    "data-quality-score",
    "Data Quality Score",
    formatPercent(score),
    `${formatNumber(issueCount)} checks`,
    "Review, category, and required-field checks across active rows.",
    "check",
  );
}

function manualEntryCard(transactions = {}) {
  const total = numericValue(transactions.total);
  const manual = numericValue(transactions.imported_no);
  return dashboardCard(
    "manual-entry-ratio",
    "Manual Entry Ratio",
    formatPercent(percentOf(manual, total)),
    `${formatNumber(manual)} rows`,
    "Transactions not linked to imported source files.",
    "edit",
  );
}

function unreviewedImpactCard(transactions = {}) {
  const openRows = numericValue(transactions.review_open);
  const amount = numericValue(transactions.review_open_amount_eur);
  return dashboardCard(
    "unreviewed-capital-impact",
    "Unreviewed Capital Impact",
    formatWholeCurrency(amount, "EUR"),
    `${formatNumber(openRows)} open rows`,
    "Capital value still waiting for manual review.",
    "target",
  );
}

function targetBreachMonthsCard(transactions = {}) {
  const targets = transactions.monthly_targets || [];
  const breached = targets.filter((row) => numericValue(row.structural_overspending_eur) > 0);
  const amount = breached.reduce((sum, row) => sum + numericValue(row.structural_overspending_eur), 0);
  return dashboardCard(
    "target-breach-months",
    "Target Breach Months",
    formatNumber(breached.length),
    `${formatWholeCurrency(amount, "EUR")} over ceilings`,
    "Monthly planning targets currently above their expense ceiling.",
    "target",
  );
}

function transactionAnomalyCard(transactions = {}) {
  const rows = transactions.monthly_anomalies || [];
  const top = rows[0] || {};
  return dashboardCard(
    "spend-anomaly-watch",
    "Spend Anomaly Watch",
    formatNumber(rows.length),
    top.month ? `${monthLabel(top.month)} · ${formatWholeCurrency(top.delta_eur || 0, "EUR")} delta` : "no abnormal months",
    "Months where spending moved materially above baseline.",
    "trendDown",
  );
}

function recurringPatternCard(transactions = {}) {
  const rows = transactions.recurring_candidates || [];
  const top = rows[0] || {};
  return dashboardCard(
    "recurring-patterns",
    "Recurring Patterns",
    formatNumber(rows.length),
    top.name ? `${top.name} · ${formatWholeCurrency(top.average_amount_eur || 0, "EUR")} avg` : "no recurring pattern",
    "Detected repeat merchants or categories worth periodic review.",
    "calendar",
  );
}

function tradeMarketExposureCard(trades = {}) {
  const marketValue = currencyRowsTotal(trades.market_value_by_currency);
  const activePositions = numericValue(trades.active_positions);
  return dashboardCard(
    "active-trade-exposure",
    "Active Trade Exposure",
    formatWholeCurrency(marketValue, "EUR"),
    `${formatNumber(activePositions)} open positions`,
    "Marked-to-market value of currently active trade positions.",
    "trendUp",
  );
}

function tradeStalenessCard(trades = {}) {
  const stalePositions = numericValue(trades.stale_price_positions);
  const staleDays = numericValue(trades.stale_price_days, state.intelligenceThresholds.tradeStalePriceDays);
  const latest = trades.latest_price_as_of ? formatDisplayDate(trades.latest_price_as_of) : "";
  return dashboardCard(
    "trade-price-freshness",
    "Trade Price Freshness",
    formatNumber(stalePositions),
    stalePositions ? `older than ${formatNumber(staleDays)} days` : latest ? `latest ${latest}` : "no active prices",
    "Open positions whose price dates are older than the configured threshold.",
    "calendar",
  );
}

function fxExposureOutsideBaseCard(accounts = {}) {
  const netWorth = numericValue(accounts.net_worth_eur);
  const projectCurrency = projectCurrencyCode();
  const nonProject = (accounts.by_currency || [])
    .filter((row) => String(row.name || row.label || row.currency || "").toUpperCase() !== projectCurrency)
    .reduce((total, row) => total + Math.abs(numericValue(row.eur)), 0);
  return dashboardCard(
    "fx-exposure-outside-eur",
    "FX Exposure Outside Project Currency",
    formatWholeCurrency(nonProject, "EUR"),
    `${formatPercent(percentOf(nonProject, netWorth))} of net worth`,
    "Capital exposed to source currencies outside the selected project currency.",
    "currency",
  );
}

function expenseVolatilityCard(series = []) {
  const expenses = recentMonthlyValues(series, "expense_eur", 12).filter((value) => value > 0);
  const avgExpense = average(expenses);
  const volatility = avgExpense ? (standardDeviation(expenses) / avgExpense) * 100 : 0;
  return dashboardCard(
    "expense-volatility",
    "Expense Volatility",
    formatPercent(volatility),
    `${formatWholeCurrency(avgExpense, "EUR")} avg`,
    "Rolling variation in monthly accountable expenses.",
    "gauge",
  );
}

function recurringSpendBaselineCard(series = []) {
  const expenses = recentMonthlyValues(series, "expense_eur", 12).filter((value) => value > 0);
  const baseline = median(expenses);
  return dashboardCard(
    "recurring-spend-baseline",
    "Recurring Spend Baseline",
    formatWholeCurrency(baseline, "EUR"),
    "12-month median",
    "Conservative baseline for recurring or normal monthly spend.",
    "calendar",
  );
}

function investableSurplusCard(series = []) {
  const monthlyIncome = average(recentMonthlyValues(series, "income_eur", 12));
  const monthlyExpense = average(recentMonthlyValues(series, "expense_eur", 12));
  const surplus = monthlyIncome - monthlyExpense;
  return dashboardCard(
    "investable-surplus",
    "Investable Surplus",
    signedWholeAmount(surplus, "EUR"),
    "avg income - avg spend",
    "Estimated monthly surplus before discretionary allocation.",
    surplus >= 0 ? "trendUp" : "trendDown",
  );
}

function liabilityRatioCard(accounts = {}) {
  const liabilities = numericValue(accounts.liabilities_eur);
  const assets = numericValue(accounts.assets_eur);
  return dashboardCard(
    "liability-ratio",
    "Liability Ratio",
    formatPercent(percentOf(liabilities, assets)),
    formatWholeCurrency(liabilities, "EUR"),
    "Liabilities relative to total reported assets.",
    "scale",
  );
}

function creditHeadroomCard(cards = []) {
  const withLimits = cards.filter((card) => numericValue(card.credit_limit_native) > 0);
  const totalLimit = withLimits.reduce((total, card) => total + creditCardReportingAmount(card, "credit_limit"), 0);
  const totalAvailable = withLimits.reduce((total, card) => total + creditCardReportingAmount(card, "available_credit"), 0);
  return dashboardCard(
    "available-credit-headroom",
    "Available Credit Headroom",
    totalLimit ? formatWholeCurrency(totalAvailable, "EUR") : "-",
    totalLimit ? `${formatPercent(percentOf(totalAvailable, totalLimit))} available` : "",
    "Unused credit capacity across cards with known limits.",
    "wallet",
  );
}

function categoryConcentrationCard(transactions = {}) {
  const largestExpense = largestExpenseCategory(transactions);
  return dashboardCard(
    "category-concentration",
    "Category Concentration",
    formatPercent(largestExpense.share),
    `${largestExpense.category} · ${formatWholeCurrency(largestExpense.amount, "EUR")}`,
    "Share of period spending held by the largest category.",
    "pie",
  );
}

function incomeVolatilityCard(series = []) {
  const incomes = recentMonthlyValues(series, "income_eur", 12).filter((value) => value > 0);
  const avgIncome = average(incomes);
  const volatility = avgIncome ? (standardDeviation(incomes) / avgIncome) * 100 : 0;
  return dashboardCard(
    "income-volatility",
    "Income Volatility",
    formatPercent(volatility),
    `${formatWholeCurrency(avgIncome, "EUR")} avg`,
    "Rolling variation in monthly accountable income.",
    "gauge",
  );
}

function positiveCashflowMonthsCard(series = []) {
  const rows = recentMonthlyRows(series, 12);
  const positive = rows.filter((row) => numericValue(row.net_eur) >= 0).length;
  return dashboardCard(
    "positive-cashflow-months",
    "Positive Cashflow Months",
    rows.length ? `${formatNumber(positive)} / ${formatNumber(rows.length)}` : "-",
    rows.length ? formatPercent(percentOf(positive, rows.length)) : "",
    "Months in the rolling window where income covered spending.",
    "calendar",
  );
}

function largestAccountExposure(accounts = {}) {
  const exposure = largestAccountExposureData(accounts);
  return {
    value: exposure.amount ? formatPercent(exposure.pct) : "-",
    meta: exposure.amount ? `${exposure.provider} · ${formatWholeCurrency(exposure.amount, "EUR")}` : "",
  };
}

function largestAccountExposureData(accounts = {}) {
  const row = (accounts.top_accounts || []).find((item) => numericValue(item.amount_eur) > 0) || {};
  const amount = numericValue(row.amount_eur);
  const pct = numericValue(row.pct_of_net, percentOf(amount, accounts.net_worth_eur));
  const provider = row.provider_id ? labelize(row.provider_id) : "No account";
  return { amount, pct, provider };
}

function creditUtilization(cards = []) {
  const credit = creditUtilizationData(cards);
  return {
    value: credit.limit ? formatPercent(credit.pct) : "-",
    meta: credit.limit ? `${credit.usedLabel} used` : "",
  };
}

function creditUtilizationData(cards = []) {
  const withLimits = cards.filter((card) => numericValue(card.credit_limit_native) > 0);
  const totalLimit = withLimits.reduce((total, card) => total + creditCardReportingAmount(card, "credit_limit"), 0);
  const totalUsed = withLimits.reduce((total, card) => total + creditCardReportingAmount(card, "used_credit"), 0);
  const usedLabel = formatWholeCurrency(totalUsed, "EUR");
  return {
    limit: totalLimit,
    used: totalUsed,
    usedLabel,
    pct: percentOf(totalUsed, totalLimit),
  };
}

function creditCardReportingAmount(card = {}, field) {
  const eurKey = `${field}_eur`;
  const nativeKey = `${field}_native`;
  const eurValue = numericValue(card[eurKey], Number.NaN);
  if (Number.isFinite(eurValue) && eurValue) return eurValue;
  if (String(card.currency || "").toUpperCase() === "EUR") return numericValue(card[nativeKey]);
  return 0;
}

function metricCard(label, value, meta = "", note = "", icon = "", options = {}) {
  const iconKey = icon || metricIcon(label);
  const hasValue = value !== null && value !== undefined && String(value) !== "";
  const cardAttrs = options.id ? ` data-dashboard-card="${safe(options.id)}"` : "";
  const cardClasses = [
    "metric-card",
    options.compact ? "is-compact" : "",
    options.tone ? `is-${options.tone}` : "",
  ].filter(Boolean).join(" ");
  const sparkline = Array.isArray(options.sparkline) ? microSparkline(options.sparkline) : "";
  const deltas = metricDeltaHtml(options.delta || []);
  const hideControl = options.hideable && options.id
    ? `
      <button class="metric-card-hide" data-action="hide-dashboard-card" data-dashboard-card="${safe(options.id)}" type="button" aria-label="Hide" ${tooltipAttrs("Hide")}>
        ${icons.x}
      </button>
    `
    : "";
  return `
    <article class="${cardClasses}"${cardAttrs}>
      ${hideControl}
      <div class="metric-card-head">
        <span class="metric-card-icon" aria-hidden="true">${icons[iconKey] || icons.target}</span>
        <span class="metric-card-label">${safe(label)}</span>
      </div>
      <strong class="${hasValue ? "" : "is-empty"}">${hasValue ? safe(value) : "&nbsp;"}</strong>
      ${meta ? `<small>${safe(meta)}</small>` : ""}
      ${sparkline}
      ${deltas}
      ${note ? `<em>${safe(note)}</em>` : ""}
    </article>
  `;
}

function metricIcon(label) {
  const value = String(label || "").toLowerCase();
  if (value.includes("income") || value.includes("inflow") || value.includes("saving") || value.includes("return") || value.includes("gain")) return "trendUp";
  if (value.includes("expense") || value.includes("spend") || value.includes("consumption") || value.includes("leakage") || value.includes("deficit") || value.includes("overspending")) return "trendDown";
  if (value.includes("retained") || value.includes("worth") || value.includes("capital")) return "wallet";
  if (value.includes("runway")) return "sun";
  if (value.includes("transaction")) return "receipt";
  if (value.includes("review")) return "target";
  if (value.includes("currency")) return "currency";
  if (value.includes("account")) return "database";
  return "target";
}

function capitalPercent(value, base) {
  if (!base) return "";
  const percent = (numericValue(value) / Math.abs(numericValue(base))) * 100;
  return `${percent >= 0 ? "+" : "-"}${formatPercent(Math.abs(percent))} of inflow`;
}

function transactionTotal(transactions = {}, directKey, seriesKey) {
  const direct = Number(transactions[directKey]);
  if (Number.isFinite(direct)) return direct;
  return seriesTotal(transactions.monthly_series, seriesKey);
}

function seriesTotal(series = [], key) {
  return series.reduce((total, item) => total + numericValue(item[key]), 0);
}

function currencyTotal(rows = [], currency = "EUR") {
  const preferred = rows.find((row) => String(row.currency || "").toUpperCase() === currency);
  if (preferred) return numericValue(preferred.amount);
  return rows.reduce((total, row) => total + numericValue(row.amount), 0);
}

function currencyRowsTotal(rows = [], currency = "EUR") {
  return currencyTotal(rows, currency);
}

function yearsInMonthlySeries(series = []) {
  const months = series.filter((item) => item.month).length;
  return Math.max(0, (months - 1) / 12);
}

function averageMonthlyExpense(series = [], count = 12) {
  const rows = recentMonthlyRows(series, count);
  if (!rows.length) return 0;
  return rows.reduce((total, item) => total + numericValue(item.expense_eur), 0) / rows.length;
}

function averageMonthlyIncome(series = [], count = 12) {
  const rows = recentMonthlyRows(series, count);
  if (!rows.length) return 0;
  return rows.reduce((total, item) => total + numericValue(item.income_eur), 0) / rows.length;
}

function recentMonthlyRows(series = [], count = 12) {
  return series.filter((item) => item.month).slice(-count);
}

function recentCompletedMonthlyRows(series = [], count = 12) {
  const currentMonth = currentMonthKey();
  const rows = series.filter((item) => item.month && item.month < currentMonth);
  return (rows.length ? rows : recentMonthlyRows(series, count)).slice(-count);
}

function recentMonthlyValues(series = [], key, count = 12) {
  return recentMonthlyRows(series, count).map((item) => numericValue(item[key]));
}

function recentCompletedMonthlyValues(series = [], key, count = 12) {
  return recentCompletedMonthlyRows(series, count).map((item) => numericValue(item[key]));
}

function average(values = []) {
  const numbers = values.map((value) => numericValue(value)).filter((value) => Number.isFinite(value));
  if (!numbers.length) return 0;
  return numbers.reduce((total, value) => total + value, 0) / numbers.length;
}

function median(values = []) {
  const numbers = values.map((value) => numericValue(value)).filter((value) => Number.isFinite(value)).sort((a, b) => a - b);
  if (!numbers.length) return 0;
  const middle = Math.floor(numbers.length / 2);
  return numbers.length % 2 ? numbers[middle] : (numbers[middle - 1] + numbers[middle]) / 2;
}

function standardDeviation(values = []) {
  const numbers = values.map((value) => numericValue(value)).filter((value) => Number.isFinite(value));
  if (numbers.length < 2) return 0;
  const mean = average(numbers);
  const variance = numbers.reduce((total, value) => total + ((value - mean) ** 2), 0) / numbers.length;
  return Math.sqrt(variance);
}

function monthlySpendChange(series = []) {
  return monthlyValueChange(series, "expense_eur");
}

function monthlyValueChange(series = [], key) {
  const rows = series.filter((item) => item.month);
  if (rows.length < 2) return 0;
  const previous = numericValue(rows.at(-2)[key]);
  const current = numericValue(rows.at(-1)[key]);
  return percentOf(current - previous, previous);
}

function largestExpenseCategory(transactions = {}) {
  const row = (transactions.category_spend || [])[0] || {};
  const amount = numericValue(row.amount_eur);
  return {
    category: row.category ? taxonomyLabel(row.category) : "-",
    amount,
    share: percentOf(amount, transactions.current_month_expense_eur || transactions.ytd_expense_eur),
  };
}

function breakdownAmount(rows = [], names = []) {
  const targets = new Set(names.map((name) => String(name).toLowerCase()));
  const match = rows.find((row) => targets.has(String(row.name || "").toLowerCase()));
  return numericValue(match?.eur);
}

function accountInsightsDashboard(data = {}) {
  const insights = data?.insights || {};
  const tables = data?.insight_tables || {};
  const netWorth = numericValue(insights.net_worth_eur);
  return `
    <section class="transaction-metrics account-insight-metrics">
      ${transactionMetric("Net Worth", formatWholeCurrency(netWorth, "EUR"), `${formatNumber(insights.active_accounts || 0)} active accounts`)}
      ${transactionMetric("Assets", formatWholeCurrency(insights.assets_eur || 0, "EUR"), "positive balances")}
      ${transactionMetric("Liabilities", formatWholeCurrency(insights.liabilities_eur || 0, "EUR"), "active liabilities")}
      ${transactionMetric("Liquid Capital", formatWholeCurrency(insights.liquid_capital_eur || 0, "EUR"), "reserve + trading capital")}
    </section>

    <section class="insight-panel-grid account-insight-bars">
      ${panel("Account Type Mix", accountTypeBreakdownBars(tables.account_type_breakdown || []))}
      ${panel("Provider Breakdown", accountProviderBreakdownBars(tables.provider_breakdown || []))}
      ${panel("Top Accounts by Value", topAccountsBars(insights.top_accounts))}
    </section>

    <section class="insight-panel-grid">
      ${panel("Allocation", allocationBars(insights.by_bucket, netWorth))}
      ${panel("Currency Exposure", exposureBars(insights.by_currency, netWorth))}
      ${panel("Credit Utilization", accountCreditBars(tables.credit_cards || []))}
    </section>
  `;
}

function accountProviderBreakdownBars(rows = []) {
  return insightBars(
    rows.map((row) => ({
      label: labelize(row.provider_id),
      value: formatWholeCurrency(row.amount_eur || 0, "EUR"),
      detail: [formatPlural(row.accounts || 0, "account"), nativeCurrencySummaryOrBlank(row.native_amounts)].filter(Boolean).join(" · "),
      icon: insightIconFor(row.provider_id, "provider"),
      share: row.pct_of_net || 0,
      action: "filter-accounts",
      dataAttrs: `data-provider-id="${safe(row.provider_id || "")}"`,
    })),
    "No provider exposure available.",
  );
}

function accountTypeBreakdownBars(rows = []) {
  return insightBars(
    rows.map((row) => ({
      label: labelize(row.account_type),
      value: formatWholeCurrency(row.amount_eur || 0, "EUR"),
      detail: [formatPlural(row.accounts || 0, "account"), nativeCurrencySummaryOrBlank(row.native_amounts)].filter(Boolean).join(" · "),
      icon: insightIconFor(row.account_type, "account-type"),
      share: row.pct_of_net || 0,
      action: "filter-accounts",
      dataAttrs: `data-account-type="${safe(row.account_type || "")}"`,
    })),
    "No account type exposure available.",
  );
}

function accountCreditBars(rows = []) {
  const visible = rows.filter((row) => numericValue(row.credit_limit_native) > 0);
  return insightBars(
    visible.map((row) => {
      const used = clampValue(row.utilization_pct || 0, 0, 100);
      const available = clampValue(100 - used, 0, 100);
      return {
        label: accountDisplayName(row),
        value: `Used ${formatPercent(used)}`,
        detail: `${labelize(row.provider_id)} · Available ${formatPercent(available)} · ${formatWholeCurrency(row.available_credit_native || 0, row.currency || "")}`,
        icon: "creditCard",
        share: used,
        shareLabel: "",
        action: "filter-accounts",
        dataAttrs: `data-account-id="${safe(row.account_id || "")}"`,
      };
    }),
    "No credit facilities with limits available.",
  );
}

function accountInsightTable(headers = [], rows = [], rowCells, emptyLabel = "No rows available.") {
  if (!rows.length) return emptyState(emptyLabel);
  return `
    <section class="minimal-table-wrap account-insight-table-wrap">
      <table class="minimal-table account-insight-table">
        <thead>
          <tr>${headers.map((header, index) => `<th class="${index > 0 ? "align-right" : ""}">${safe(header)}</th>`).join("")}</tr>
        </thead>
        <tbody>
          ${rows.map((row) => `
            <tr>
              ${rowCells(row).map((cell, index) => `<td class="${index > 0 ? "align-right" : ""}">${cell}</td>`).join("")}
            </tr>
          `).join("")}
        </tbody>
      </table>
    </section>
  `;
}

function transactionInsightsDashboard(data = {}) {
  const insights = data?.insights || {};
  const income = numericValue(insights.current_month_income_eur);
  const expenses = numericValue(insights.current_month_expense_eur);
  const net = numericValue(insights.current_month_net_eur);
  return `
    <section class="transaction-metrics transaction-insight-metrics">
      ${transactionMetric("Total Income", formatCurrency(income, "EUR"), "selected period")}
      ${transactionMetric("Total Expenses", formatCurrency(expenses, "EUR"), percentOfIncomeNote(expenses, income))}
      ${transactionMetric("Net Flow", signedAmount(net, "EUR"), percentOfIncomeNote(net, income, { signed: true, fallback: `${formatNumber(insights.total || 0)} rows` }))}
      ${transactionMetric("Review", formatNumber(insights.review_open || 0), "transactions")}
    </section>

    <section class="overview-split lower heatmap-pair transaction-insight-heatmaps">
      ${panel("Income Heatmap", activityHeatmap(insights.income_heatmap, "income"))}
      ${panel("Spending Heatmap", activityHeatmap(insights.spending_heatmap, "expense"))}
    </section>

    <section class="insight-panel-grid transaction-insight-grid">
      ${panel("Income Sources", transactionIncomeSourceBars(insights.income_sources || []))}
      ${panel("Category Spend", transactionCategorySpendBars(insights.category_spend || []))}
      ${panel("Currency Flow", transactionCurrencyFlowBars(insights.currency_flow || []))}
    </section>
  `;
}

function transactionMonthlyTargetsDashboard(data = {}) {
  const insights = data?.insights || {};
  const planning = planningPayloadFromTransactions(insights);
  const targets = applyYearlyTargetOverridesToMonthlyTargets(
    planning.monthly_targets || [],
    planning.yearly_targets || [],
  );
  const summary = planning.summary || {};
  const selection = monthlyTargetPeriodSelection(targets, summary);
  if (!selection.available) {
    return emptyState(selection.message || "No monthly target model is available for this period.");
  }
  const selectedTargets = applyMonthlyTargetOverrides(selection.rows);
  const totalIncome = selectedTargets.reduce((sum, row) => sum + numericValue(row.income_target_eur), 0);
  const totalActualIncome = selectedTargets.reduce((sum, row) => sum + numericValue(row.actual_income_eur), 0);
  const totalCeiling = selectedTargets.reduce((sum, row) => sum + numericValue(row.expense_ceiling_eur), 0);
  const plannedRetained = selectedTargets.reduce((sum, row) => sum + numericValue(row.savings_target_eur), 0);
  const comparableRows = selectedTargets.filter((row) => monthlyTargetActualsAreDue(row));
  const comparablePlannedRetained = comparableRows.reduce((sum, row) => sum + numericValue(row.savings_target_eur), 0);
  const actualRetained = comparableRows.reduce((sum, row) => sum + monthlyTargetActualRetained(row), 0);
  const retentionGap = comparableRows.length ? moneyRound(actualRetained - comparablePlannedRetained) : null;
  const overspending = selectedTargets.reduce((sum, row) => sum + numericValue(row.structural_overspending_eur), 0);
  const targetRatio = totalIncome ? percentOf(totalCeiling, totalIncome) : numericValue(selectedTargets[0]?.expense_target_pct);
  const plannedRetainedRatio = totalIncome ? percentOf(plannedRetained, totalIncome) : numericValue(selectedTargets[0]?.savings_target_pct);
  const actualRetainedRatio = totalActualIncome ? percentOf(actualRetained, totalActualIncome) : null;
  const incomeDetail = monthlyTargetIncomeMetricDetail(selection.detail, totalActualIncome, totalIncome, selectedTargets);
  const isFilteredMonth = selection.mode === "month";
  const showAggregatePanels = !isFilteredMonth && selectedTargets.length > 1;
  const aggregatePanels = showAggregatePanels
    ? `
      ${panel("Income Category Model", monthlyTargetIncomeCategoryModel(selectedTargets))}
      ${panel("Expense Category Model", monthlyTargetCategoryModel(selectedTargets))}
      ${panel("Top Months Above Ceiling", monthlyTargetAboveCeiling(selectedTargets))}
    `
    : "";
  return `
    <section class="transaction-metrics monthly-target-metrics">
      ${transactionMetric("Income Baseline", formatWholeCurrency(totalIncome, "EUR"), incomeDetail)}
      ${transactionMetric("Expense Ceiling", formatWholeCurrency(totalCeiling, "EUR"), `${formatPercent(targetRatio)} target ratio`)}
      ${transactionMetric("Planned Retained", formatWholeCurrency(plannedRetained, "EUR"), `${formatPercent(plannedRetainedRatio)} planned`)}
      ${transactionMetric("Actual Retained", signedWholeAmount(actualRetained, "EUR"), monthlyTargetActualRetainedMetricDetail(actualRetainedRatio))}
      ${transactionMetric("Retention Gap", retentionGap === null ? "-" : signedWholeAmount(retentionGap, "EUR"), monthlyTargetRetentionGapMetricDetail(comparableRows.length))}
      ${transactionMetric("Spend Above Ceiling", formatWholeCurrency(overspending, "EUR"), "actual spend above ceiling")}
    </section>
    <section class="monthly-target-grid${showAggregatePanels ? "" : " monthly-target-grid-single"}">
      ${aggregatePanels}
      ${panel(selection.title, monthlyTargetsTable(selectedTargets), "full")}
    </section>
  `;
}

function monthlyTargetIncomeMetricDetail(baseDetail, actualIncome, incomeTarget, rows = []) {
  const usesModeledIncome = rows.some((row) => row.income_target_basis === "modeled");
  if (usesModeledIncome && Math.abs(actualIncome - incomeTarget) >= 1) {
    return `${baseDetail} · ${formatWholeCurrency(actualIncome, "EUR")} recorded`;
  }
  return baseDetail;
}

function monthlyTargetActualRetainedMetricDetail(actualRetainedRatio) {
  if (actualRetainedRatio === null || actualRetainedRatio === undefined) {
    return "no recorded income yet";
  }
  return `${formatPercent(actualRetainedRatio)} of recorded income`;
}

function monthlyTargetRetentionGapMetricDetail(hasComparablePlan) {
  return hasComparablePlan ? "actual minus recorded-period plan" : "not recorded yet";
}

function monthlyTargetActualsAreDue(row = {}) {
  const actualIncome = numericValue(row.actual_income_eur);
  const actualExpense = numericValue(row.actual_expense_eur);
  if (actualIncome || actualExpense) return true;
  const month = String(row.month || "");
  return Boolean(month) && month <= currentMonthKey();
}

function monthlyTargetActualRetained(row = {}) {
  return moneyRound(numericValue(row.actual_income_eur) - numericValue(row.actual_expense_eur));
}

function monthlyTargetActualRetainedPct(row = {}) {
  const actualIncome = numericValue(row.actual_income_eur);
  if (!actualIncome) return null;
  return moneyRound(percentOf(monthlyTargetActualRetained(row), actualIncome));
}

function monthlyTargetRetentionGap(row = {}) {
  if (!monthlyTargetActualsAreDue(row)) return null;
  return moneyRound(monthlyTargetActualRetained(row) - numericValue(row.savings_target_eur));
}

function transactionYearlyTargetsDashboard(planning = {}) {
  const rows = transactionYearlyTargetRows(planning.yearly_targets || []);
  return planningTargetsDashboard({ ...planning, yearly_targets: rows });
}

function transactionYearlyTargetRows(rows = []) {
  if (state.period.mode === "all") return rows;
  const year = state.period.mode === "year"
    ? Number(state.period.year || currentYear())
    : Number(String(state.period.mode === "day" ? state.period.day : state.period.month).slice(0, 4));
  return rows.filter((row) => Number(row.year) === year);
}

function monthlyTargetPeriodSelection(targets = [], summary = {}) {
  const allTargets = [...targets].sort((a, b) => String(a.month || "").localeCompare(String(b.month || "")));
  if (!allTargets.length) {
    return {
      available: false,
      rows: [],
      title: "Targets",
      detail: "no target model",
      mode: "empty",
      message: "No monthly target model is available yet.",
    };
  }
  if (state.period.mode === "all") {
    return {
      available: true,
      rows: allTargets,
      title: "All Monthly Targets",
      detail: "all years target model",
      mode: "all",
    };
  }
  if (state.period.mode === "year") {
    const year = Number(state.period.year || currentYear());
    const rows = allTargets.filter((row) => String(row.month || "").startsWith(`${year}-`));
    return {
      available: rows.length > 0,
      rows,
      title: `${year} Targets`,
      detail: `${year} target model`,
      mode: "year",
      message: `No monthly targets available for ${year}.`,
    };
  }
  const selectedMonth = state.period.mode === "day" ? String(state.period.day || currentDateKey()).slice(0, 7) : String(state.period.month || currentMonthKey());
  const rows = allTargets.filter((row) => row.month === selectedMonth);
  return {
    available: rows.length > 0,
    rows,
    title: `${monthLabel(selectedMonth)} Targets`,
    detail: `${monthLabel(selectedMonth)} target model`,
    mode: "month",
    message: `No monthly targets available for ${monthLabel(selectedMonth)}.`,
  };
}

function applyMonthlyTargetOverrides(rows = []) {
  return rows.map((row) => {
    const overrides = (state.monthlyTargetOverrides || {})[row.month] || {};
    const editableOverrides = Object.fromEntries(
      Object.entries(overrides).filter(([key]) => {
        if (!key.includes(":")) return MONTHLY_TARGET_EDITABLE_FIELDS.has(key);
        const parts = key.split(":");
        return parts.length === 3 && TARGET_ITEM_EDITABLE_FIELDS.has(parts[2]);
      }),
    );
    const incomeCategories = monthlyTargetIncomeCategories(row).map((category) => {
      const key = `income_categories:${category.category || "income"}:target_eur`;
      return Object.prototype.hasOwnProperty.call(editableOverrides, key)
        ? { ...category, target_eur: editableOverrides[key] }
        : category;
    });
    const categories = (row.categories || []).map((category) => {
      const key = `categories:${category.category || "uncategorized"}:target_eur`;
      return Object.prototype.hasOwnProperty.call(editableOverrides, key)
        ? { ...category, target_eur: editableOverrides[key] }
        : category;
    });
    const simpleOverrides = Object.fromEntries(
      Object.entries(editableOverrides).filter(([key]) => !key.includes(":")),
    );
    return normalizeMonthlyTargetRow({ ...row, ...simpleOverrides, income_categories: incomeCategories, categories }, editableOverrides);
  });
}

function applyYearlyTargetOverridesToMonthlyTargets(rows = [], yearlyRows = []) {
  const yearlyOverrides = state.yearlyTargetOverrides || {};
  if (!rows.length || !Object.keys(yearlyOverrides).length) return rows;

  const yearlyTargets = new Map(
    applyYearlyTargetOverrides(yearlyRows).map((row) => [String(row.year || ""), row]),
  );
  const rowsByYear = rows.reduce((groups, row) => {
    const year = String(row.month || "").slice(0, 4);
    if (!year) return groups;
    if (!groups.has(year)) groups.set(year, []);
    groups.get(year).push(row);
    return groups;
  }, new Map());
  const projectedRows = new Map();

  rowsByYear.forEach((yearRows, year) => {
    const overrides = yearlyOverrides[year] || {};
    if (!Object.keys(overrides).length) return;
    const yearlyTarget = yearlyTargets.get(year);
    if (!yearlyTarget) return;
    const incomeDistribution = Object.prototype.hasOwnProperty.call(overrides, "income_baseline_eur")
      ? distributeMoney(numericValue(yearlyTarget.income_baseline_eur), yearRows.length)
      : null;
    yearRows.forEach((row, index) => {
      projectedRows.set(
        row.month,
        projectMonthlyTargetFromYearlyTarget(row, yearlyTarget, overrides, incomeDistribution?.[index]),
      );
    });
  });

  return rows.map((row) => projectedRows.get(row.month) || row);
}

function projectMonthlyTargetFromYearlyTarget(row = {}, yearlyTarget = {}, overrides = {}, distributedIncome = null) {
  const hasSavingsOverride = Object.prototype.hasOwnProperty.call(overrides, "target_savings_eur")
    || Object.prototype.hasOwnProperty.call(overrides, "savings_target_pct");
  const expensePct = numericValue(yearlyTarget.expense_target_pct, row.expense_target_pct);
  const savingsPct = hasSavingsOverride
    ? numericValue(yearlyTarget.savings_target_pct, row.savings_target_pct)
    : moneyRound(Math.max(0, 100 - expensePct));
  const income = distributedIncome === null || distributedIncome === undefined
    ? numericValue(row.income_target_eur)
    : distributedIncome;
  const expenseCeiling = moneyRound(income * expensePct / 100);
  const incomeCategories = scaledTargetCategories(monthlyTargetIncomeCategories(row), income);
  const expenseCategories = scaledTargetCategories(row.categories || [], expenseCeiling);
  return normalizeMonthlyTargetRow({
    ...row,
    income_target_eur: moneyRound(income),
    income_target_basis: distributedIncome === null || distributedIncome === undefined ? row.income_target_basis : "modeled",
    expense_target_pct: moneyRound(expensePct),
    savings_target_pct: moneyRound(savingsPct),
    income_categories: incomeCategories,
    categories: expenseCategories,
  }, hasSavingsOverride ? { savings_target_pct: savingsPct } : {});
}

function monthlyTargetsTable(rows = []) {
  if (!rows.length) return emptyState("No monthly targets available.");
  const sortedRows = sortedMonthlyTargetRows(rows);
  return `
    <section class="minimal-table-wrap monthly-target-table-wrap">
      <table class="minimal-table monthly-target-table">
        <thead>
          <tr>
            <th>${monthlyTargetSortHeader("Month", "month")}</th>
            <th class="align-right">${monthlyTargetSortHeader("Income Baseline", "income_target_eur")}</th>
            <th class="align-right">${monthlyTargetSortHeader("Expense Ceiling", "expense_ceiling_eur")}</th>
            <th class="align-right">${monthlyTargetSortHeader("Planned Retained", "savings_target_eur")}</th>
            <th class="align-right">${monthlyTargetSortHeader("Actual Retained", "actual_retained_eur")}</th>
            <th class="align-right">${monthlyTargetSortHeader("Retention Gap", "retention_gap_eur")}</th>
            <th class="align-right">${monthlyTargetSortHeader("Actual Expenses", "actual_expense_eur")}</th>
            <th class="align-right">${monthlyTargetSortHeader("Structural Overspending", "structural_overspending_eur")}</th>
          </tr>
        </thead>
        <tbody>
          ${sortedRows.map((row) => monthlyTargetTableRow(row, sortedRows.length === 1)).join("")}
        </tbody>
      </table>
    </section>
  `;
}

function sortedMonthlyTargetRows(rows = []) {
  const sort = state.monthlyTargetSort || { field: "month", direction: "desc" };
  const field = sort.field || "month";
  const direction = sort.direction === "asc" ? "asc" : "desc";
  return [...rows].sort((left, right) => compareMonthlyTargetRows(left, right, field, direction));
}

function compareMonthlyTargetRows(left = {}, right = {}, field = "month", direction = "desc") {
  const leftValue = monthlyTargetSortValue(left, field);
  const rightValue = monthlyTargetSortValue(right, field);
  const leftEmpty = leftValue === null || leftValue === undefined || leftValue === "";
  const rightEmpty = rightValue === null || rightValue === undefined || rightValue === "";
  if (leftEmpty && !rightEmpty) return 1;
  if (!leftEmpty && rightEmpty) return -1;

  let comparison = field === "month"
    ? String(leftValue || "").localeCompare(String(rightValue || ""))
    : numericValue(leftValue) - numericValue(rightValue);
  if (direction === "desc") comparison *= -1;
  if (comparison) return comparison;
  return String(right.month || "").localeCompare(String(left.month || ""));
}

function monthlyTargetSortValue(row = {}, field = "month") {
  if (field === "month") return row.month || "";
  if (field === "actual_retained_eur") {
    return monthlyTargetActualsAreDue(row) ? monthlyTargetActualRetained(row) : null;
  }
  if (field === "retention_gap_eur") return monthlyTargetRetentionGap(row);
  return numericValue(row[field]);
}

function monthlyTargetTableRow(row = {}, includeDetails = false) {
  return `
    <tr class="clickable-row" data-action="filter-monthly-target" data-monthly-target-month="${safe(row.month || "")}" tabindex="0">
      <td>
        <span class="target-period-cell">
          <span class="table-main">${safe(monthLabel(row.month))}</span>
          ${monthlyTargetProgressBar(row)}
        </span>
      </td>
      <td class="align-right">${targetAmountCell(row.income_target_eur, "EUR", monthlyTargetIncomeCellDetail(row))}</td>
      <td class="align-right">
        ${targetAmountCell(row.expense_ceiling_eur, "EUR", `${formatPercent(row.expense_target_pct || 0)} ceiling`)}
      </td>
      <td class="align-right">
        ${targetAmountCell(row.savings_target_eur, "EUR", `${formatPercent(row.savings_target_pct || 0)} planned`)}
      </td>
      <td class="align-right">
        ${targetAmountCell(monthlyTargetActualRetained(row), "EUR", monthlyTargetActualRetainedCellDetail(row), { signed: true, empty: !monthlyTargetActualsAreDue(row) })}
      </td>
      <td class="align-right">
        ${targetAmountCell(monthlyTargetRetentionGap(row), "EUR", monthlyTargetRetentionGapCellDetail(row), { signed: true, empty: !monthlyTargetActualsAreDue(row) })}
      </td>
      <td class="align-right">${targetAmountCell(row.actual_expense_eur, "EUR", monthlyTargetActualExpenseCellDetail(row))}</td>
      <td class="align-right ${numericValue(row.structural_overspending_eur) ? "negative" : ""}">${targetAmountCell(row.structural_overspending_eur, "EUR", numericValue(row.structural_overspending_eur) ? "above ceiling" : "on target")}</td>
    </tr>
    ${includeDetails ? monthlyTargetCategoryDetailRows(row) : ""}
  `;
}

function monthlyTargetIncomeCellDetail(row = {}) {
  const actualIncome = numericValue(row.actual_income_eur);
  const targetIncome = numericValue(row.income_target_eur);
  if (row.income_target_basis === "modeled" && Math.abs(actualIncome - targetIncome) >= 1) {
    return `${formatWholeCurrency(actualIncome, "EUR")} recorded`;
  }
  return "Income baseline";
}

function monthlyTargetActualExpenseCellDetail(row = {}) {
  const delta = numericValue(row.actual_expense_reconciliation_delta_eur);
  if (Math.abs(delta) >= 0.01) {
    return `${formatWholeCurrency(delta, "EUR")} category delta`;
  }
  return "category reconciled";
}

function monthlyTargetActualRetainedCellDetail(row = {}) {
  if (!monthlyTargetActualsAreDue(row)) return "not recorded yet";
  const pct = monthlyTargetActualRetainedPct(row);
  if (pct === null) return "no recorded income";
  return `${formatPercent(pct)} actual retained`;
}

function monthlyTargetRetentionGapCellDetail(row = {}) {
  if (!monthlyTargetActualsAreDue(row)) return "not recorded yet";
  return "actual minus planned";
}

function monthlyTargetCategoryDetailRows(row = {}) {
  const incomeRows = monthlyTargetIncomeCategories(row);
  const expenseRows = row.categories || [];
  return `
    ${monthlyTargetCategoryGroupRow("Income Category Model", incomeRows.length)}
    ${incomeRows.map((category) => monthlyTargetCategoryDetailRow(row, category, "income")).join("")}
    ${monthlyTargetCategoryGroupRow("Expense Category Model", expenseRows.length)}
    ${expenseRows.map((category) => monthlyTargetCategoryDetailRow(row, category, "expense")).join("")}
  `;
}

function monthlyTargetCategoryGroupRow(label, count = 0) {
  if (!count) return "";
  return `
    <tr class="monthly-target-category-group-row">
      <td></td>
      <td colspan="7">
        <span class="table-sub">${safe(label)}</span>
      </td>
    </tr>
  `;
}

function monthlyTargetCategoryDetailRow(row = {}, category = {}, mode = "expense") {
  const categoryLabel = taxonomyLabel(category.category || mode);
  const categoryOverspending = monthlyTargetCategoryOverspending(category, mode);
  return `
    <tr class="clickable-row monthly-target-category-row" data-action="filter-monthly-target-category" data-monthly-target-month="${safe(row.month || "")}" data-category="${safe(category.category || "")}" data-transaction-class="${safe(mode)}" tabindex="0">
      <td></td>
      <td colspan="4">
        <span class="monthly-target-category-cell">
          <span class="monthly-target-category-name">
            <span class="bar-row-icon" aria-hidden="true">${icons[insightIconFor(category.category || mode, "category")] || icons.pie}</span>
            <span>
              <span class="table-main">${safe(categoryLabel)}</span>
              <span class="table-sub">${safe(formatWholeCurrency(category.actual_eur || 0, "EUR"))} ${safe(mode === "expense" ? "actual spend" : "actual income")}</span>
            </span>
          </span>
          ${monthlyTargetCategoryProgressBar(category, mode)}
        </span>
      </td>
      <td class="align-right">${targetAmountCell(category.target_eur, "EUR", mode === "income" ? "income target" : "expense target")}</td>
      <td class="align-right">${targetAmountCell(category.actual_eur, "EUR", mode === "expense" ? "actual spend" : "actual income")}</td>
      <td class="align-right ${mode === "expense" && categoryOverspending > 0 ? "negative" : ""}">
        ${mode === "expense"
          ? targetAmountCell(categoryOverspending, "EUR", categoryOverspending > 0 ? "above category ceiling" : "on target")
          : `
            <span class="table-main">${safe(formatPercent(category.share_pct || 0))}</span>
            <span class="table-sub">of income model</span>
          `}
      </td>
    </tr>
  `;
}

function monthlyTargetCategoryProgressBar(category = {}, mode = "expense") {
  return targetProgressBar({
    target: category.target_eur,
    actual: category.actual_eur,
    className: `is-${mode === "income" ? "income" : "expense"}`,
  });
}

function monthlyTargetProgressBar(row = {}) {
  return targetProgressBar({
    target: row.savings_target_eur,
    actual: monthlyTargetActualRetained(row),
    actualAvailable: monthlyTargetActualsAreDue(row),
    className: "is-retention is-compact",
  });
}

function yearlyTargetProgressBar(row = {}) {
  return targetProgressBar({
    target: row.target_savings_eur,
    actual: row.actual_savings_eur,
    className: "is-retention is-compact",
  });
}

function targetProgressBar({ target = 0, actual = 0, actualAvailable = true, className = "" } = {}) {
  const targetValue = Math.max(0, numericValue(target));
  const actualValue = actualAvailable ? Math.max(0, numericValue(actual)) : 0;
  const cappedActual = targetValue > 0 ? Math.min(actualValue, targetValue) : 0;
  const overAmount = actualAvailable ? Math.max(actualValue - targetValue, 0) : 0;
  const basis = Math.max(targetValue, actualValue, 1);
  const plannedPct = clampValue(percentOf(targetValue, basis), 0, 100);
  const achievedPct = clampValue(percentOf(cappedActual, basis), 0, 100);
  const overPct = clampValue(percentOf(overAmount, basis), 0, 100);
  const overLeftPct = plannedPct;
  const status = !actualAvailable || !actualValue
    ? "empty"
    : actualValue > targetValue
      ? "over"
      : "active";
  const classes = ["target-progress-strip", className, `is-${status}`].filter(Boolean).join(" ");
  return `
    <span class="${safe(classes)}" style="--planned-pct: ${plannedPct}%; --achieved-pct: ${achievedPct}%; --over-left-pct: ${overLeftPct}%; --over-pct: ${overPct}%;" aria-hidden="true">
      <span class="target-progress-planned"></span>
      <span class="target-progress-achieved"></span>
      <span class="target-progress-over"></span>
    </span>
  `;
}

function monthlyTargetCategoryOverspending(category = {}, mode = "expense") {
  if (mode !== "expense") return 0;
  return moneyRound(Math.max(numericValue(category.actual_eur) - numericValue(category.target_eur), 0));
}

function targetAmountCell(value, currency = "EUR", detail = "", options = {}) {
  if (options.empty) {
    return `
      <span class="table-main">-</span>
      ${detail ? `<span class="table-sub">${safe(detail)}</span>` : ""}
    `;
  }
  const numeric = numericValue(value);
  const amount = options.signed ? signedWholeAmount(numeric, currency) : formatWholeCurrency(numeric, currency);
  return `
    <span class="table-main ${options.signed ? signedClass(numeric) : ""}">${safe(amount)}</span>
    ${detail ? `<span class="table-sub">${safe(detail)}</span>` : ""}
  `;
}

function targetInputValue(value) {
  const amount = numericValue(value);
  if (!amount) return "0";
  return Number.isInteger(amount) ? String(amount) : String(Number(amount.toFixed(2)));
}

function monthlyTargetIncomeCategories(row = {}) {
  if (Array.isArray(row.income_categories) && row.income_categories.length) {
    return row.income_categories;
  }
  return (row.income_sources || []).map((source) => ({
    category: source.category || source.source || "income",
    target_eur: source.target_eur,
    actual_eur: source.actual_eur,
    share_pct: source.share_pct,
  }));
}

function normalizeMonthlyTargetRow(row = {}, overrides = {}) {
  const next = { ...row };
  const incomeCategoryEdited = hasMonthlyTargetItemOverride(overrides, "income_categories");
  const expenseCategoryEdited = hasMonthlyTargetItemOverride(overrides, "categories");
  if (Array.isArray(next.income_categories)) {
    next.income_categories = withTargetSharePercentages(next.income_categories);
  }
  if (Array.isArray(next.categories)) {
    next.categories = withTargetSharePercentages(next.categories);
  }
  if (incomeCategoryEdited) {
    next.income_target_eur = moneyRound(sumCategoryTargets(monthlyTargetIncomeCategories(next)));
  }
  if (expenseCategoryEdited) {
    next.expense_ceiling_eur = moneyRound(sumCategoryTargets(next.categories || []));
  }
  const income = numericValue(next.income_target_eur);
  const actualExpense = numericValue(next.actual_expense_eur);
  const expenseCeilingEdited = Object.prototype.hasOwnProperty.call(overrides, "expense_ceiling_eur") || expenseCategoryEdited;
  const savingsAmountEdited = Object.prototype.hasOwnProperty.call(overrides, "savings_target_eur");
  const savingsPctEdited = Object.prototype.hasOwnProperty.call(overrides, "savings_target_pct");
  if (!expenseCeilingEdited) {
    next.expense_ceiling_eur = moneyRound(income * numericValue(next.expense_target_pct) / 100);
  } else if (income) {
    next.expense_target_pct = moneyRound(percentOf(next.expense_ceiling_eur, income));
  }
  const expenseCeiling = numericValue(next.expense_ceiling_eur);
  if (!savingsAmountEdited && !savingsPctEdited) {
    next.savings_target_eur = moneyRound(income - expenseCeiling);
    next.savings_target_pct = income ? moneyRound(percentOf(next.savings_target_eur, income)) : 0;
  } else if (!savingsAmountEdited) {
    next.savings_target_eur = moneyRound(income * numericValue(next.savings_target_pct) / 100);
  } else if (income) {
    next.savings_target_pct = moneyRound(percentOf(next.savings_target_eur, income));
  }
  if (!Object.prototype.hasOwnProperty.call(overrides, "structural_overspending_eur")) {
    next.structural_overspending_eur = moneyRound(Math.max(actualExpense - numericValue(next.expense_ceiling_eur), 0));
  }
  return refreshMonthlyTargetCategoryTotals(next);
}

function hasMonthlyTargetItemOverride(overrides = {}, group = "") {
  return Object.keys(overrides || {}).some((key) => key.startsWith(`${group}:`));
}

function sumCategoryTargets(categories = []) {
  return categories.reduce((sum, category) => sum + numericValue(category.target_eur), 0);
}

function refreshMonthlyTargetCategoryTotals(row = {}) {
  const categories = row.categories || [];
  const actualExpense = numericValue(row.actual_expense_eur);
  const categoryTargetTotal = sumCategoryTargets(categories);
  const categoryActualTotal = categories.reduce((sum, category) => sum + numericValue(category.actual_eur), 0);
  return {
    ...row,
    expense_category_target_total_eur: moneyRound(categoryTargetTotal),
    actual_expense_category_total_eur: moneyRound(categoryActualTotal),
    actual_expense_reconciliation_delta_eur: moneyRound(actualExpense - categoryActualTotal),
  };
}

function scaledTargetCategories(categories = [], targetTotal = 0) {
  if (!categories.length) return [];
  const total = moneyRound(targetTotal);
  const targetBasisTotal = sumCategoryTargets(categories);
  const actualBasisTotal = categories.reduce((sum, category) => sum + numericValue(category.actual_eur), 0);
  const basisTotal = targetBasisTotal || actualBasisTotal;
  let allocated = 0;
  const scaled = categories.map((category, index) => {
    const basisValue = targetBasisTotal ? numericValue(category.target_eur) : numericValue(category.actual_eur);
    const share = basisTotal ? basisValue / basisTotal : 1 / categories.length;
    const target = index === categories.length - 1 ? moneyRound(total - allocated) : moneyRound(total * share);
    allocated = moneyRound(allocated + target);
    return { ...category, target_eur: target };
  });
  return withTargetSharePercentages(scaled);
}

function distributeMoney(total = 0, count = 0) {
  if (!count) return [];
  const cents = Math.round(numericValue(total) * 100);
  const base = Math.trunc(cents / count);
  let remainder = cents - base * count;
  return Array.from({ length: count }, () => {
    const adjustment = remainder === 0 ? 0 : remainder > 0 ? 1 : -1;
    remainder -= adjustment;
    return (base + adjustment) / 100;
  });
}

function withTargetSharePercentages(categories = []) {
  const total = sumCategoryTargets(categories);
  return categories.map((category) => ({
    ...category,
    target_eur: moneyRound(category.target_eur || 0),
    share_pct: total ? moneyRound(percentOf(category.target_eur, total)) : 0,
  }));
}

function moneyRound(value) {
  return Number(numericValue(value).toFixed(2));
}

function monthlyTargetCategoryTags(categories = [], mode = "expense") {
  if (!categories.length) return `<span class="table-sub">No category baseline</span>`;
  return `
    <span class="monthly-target-tags">
      ${categories.slice(0, 3).map((category) => `
        <span class="monthly-target-tag">
          <span class="bar-row-icon" aria-hidden="true">${icons[insightIconFor(category.category || mode, "category")] || icons.pie}</span>
          <span>${safe(taxonomyLabel(category.category || mode))}</span>
          <strong>${safe(formatWholeCurrency(category.target_eur || 0, "EUR"))}</strong>
        </span>
      `).join("")}
    </span>
  `;
}

function monthlyTargetIncomeCategoryModel(rows = []) {
  const totals = new Map();
  rows.forEach((row) => {
    monthlyTargetIncomeCategories(row).forEach((category) => {
      const key = category.category || "income";
      const existing = totals.get(key) || { category: key, target: 0, actual: 0 };
      existing.target += numericValue(category.target_eur);
      existing.actual += numericValue(category.actual_eur);
      totals.set(key, existing);
    });
  });
  const values = Array.from(totals.values()).sort((a, b) => b.target - a.target).slice(0, 6);
  const totalTarget = values.reduce((sum, row) => sum + row.target, 0);
  return insightBars(
    values.map((row) => ({
      label: taxonomyLabel(row.category),
      value: formatWholeCurrency(row.target, "EUR"),
      detail: `${formatWholeCurrency(row.actual, "EUR")} actual income`,
      icon: insightIconFor(row.category, "category"),
      share: percentOf(row.target, totalTarget),
      action: "filter-category",
      dataAttrs: `data-category="${safe(row.category)}" data-transaction-class="income"`,
    })),
    "No income category model available.",
  );
}

function monthlyTargetCategoryModel(rows = []) {
  const totals = new Map();
  rows.forEach((row) => {
    (row.categories || []).forEach((category) => {
      const key = category.category || "uncategorized";
      const existing = totals.get(key) || { category: key, target: 0, actual: 0 };
      existing.target += numericValue(category.target_eur);
      existing.actual += numericValue(category.actual_eur);
      totals.set(key, existing);
    });
  });
  const values = Array.from(totals.values()).sort((a, b) => b.target - a.target).slice(0, 6);
  const totalTarget = values.reduce((sum, row) => sum + row.target, 0);
  return insightBars(
    values.map((row) => ({
      label: taxonomyLabel(row.category),
      value: formatWholeCurrency(row.target, "EUR"),
      detail: `${formatWholeCurrency(row.actual, "EUR")} actual spend`,
      icon: insightIconFor(row.category, "category"),
      share: percentOf(row.target, totalTarget),
      action: "filter-category",
      dataAttrs: `data-category="${safe(row.category)}" data-transaction-class="expense"`,
    })),
    "No category target model available.",
  );
}

function monthlyTargetAboveCeiling(rows = []) {
  const values = rows
    .filter((row) => numericValue(row.structural_overspending_eur) > 0)
    .sort((a, b) => numericValue(b.structural_overspending_eur) - numericValue(a.structural_overspending_eur))
    .slice(0, 6);
  const totalOverspending = rows.reduce((sum, row) => sum + numericValue(row.structural_overspending_eur), 0);
  return insightBars(
    values.map((row) => ({
      label: monthLabel(row.month),
      value: formatWholeCurrency(row.structural_overspending_eur, "EUR"),
      detail: `${formatWholeCurrency(row.actual_expense_eur || 0, "EUR")} actual spend`,
      icon: "trendDown",
      share: percentOf(row.structural_overspending_eur, totalOverspending),
      action: "filter-monthly-target",
      dataAttrs: `data-monthly-target-month="${safe(row.month || "")}"`,
    })),
    "No months above ceiling.",
  );
}

function monthlyTargetNotes(rows = []) {
  const activeRows = rows.filter((row) => numericValue(row.actual_income_eur) || numericValue(row.actual_expense_eur));
  const overspent = rows.filter((row) => numericValue(row.structural_overspending_eur) > 0);
  const averageCeiling = average(rows.map((row) => numericValue(row.expense_ceiling_eur)));
  return insightBars(
    [
      {
        label: "Actual months",
        value: formatNumber(activeRows.length),
        detail: "months with ledger activity",
        icon: "calendar",
        share: percentOf(activeRows.length, rows.length),
      },
      {
        label: "Above ceiling",
        value: formatNumber(overspent.length),
        detail: "months requiring structural review",
        icon: "trendDown",
        share: percentOf(overspent.length, rows.length),
      },
      {
        label: "Average ceiling",
        value: formatWholeCurrency(averageCeiling, "EUR"),
        detail: "monthly expense ceiling",
        icon: "target",
        share: 100,
      },
    ],
    "No target notes available.",
  );
}

function monthlyTargetDetailsPanel(rows = []) {
  const row = rows.find((entry) => entry.month === state.selectedMonthlyTargetMonth);
  if (!row) return "";
  const actions = state.targetDetailEditing
    ? `<button class="icon-button" data-action="save-target-detail" type="submit" form="monthly-target-form" ${tooltipAttrs("Save target")}>${icons.check}</button>`
    : `<button class="icon-button" data-action="edit-target-detail" type="button" ${tooltipAttrs("Edit target")}>${icons.edit}</button>`;
  return detailPanel(
    "Target",
    monthLabel(row.month),
    state.targetDetailEditing ? monthlyTargetEditForm(row) : monthlyTargetDetails(row),
    "close-target-detail",
    "Target details",
    actions,
  );
}

function monthlyTargetDetails(row = {}) {
  return `
    <dl>
      ${detailItem("Income Baseline", formatWholeCurrency(row.income_target_eur || 0, "EUR"))}
      ${detailItem("Recorded Income", formatWholeCurrency(row.actual_income_eur || 0, "EUR"))}
      ${detailItem("Target Basis", row.income_target_basis === "modeled" ? "Modeled income floor" : "Recorded income")}
      ${detailItem("Expense Ceiling", `${formatWholeCurrency(row.expense_ceiling_eur || 0, "EUR")} · ${formatPercent(row.expense_target_pct || 0)}`)}
      ${detailItem("Planned Retained", `${formatWholeCurrency(row.savings_target_eur || 0, "EUR")} · ${formatPercent(row.savings_target_pct || 0)} planned`)}
      ${detailItem("Actual Retained", monthlyTargetActualsAreDue(row) ? `${signedWholeAmount(monthlyTargetActualRetained(row), "EUR")} · ${monthlyTargetActualRetainedCellDetail(row)}` : "Not recorded yet")}
      ${detailItem("Retention Gap", monthlyTargetActualsAreDue(row) ? `${signedWholeAmount(monthlyTargetRetentionGap(row), "EUR")} · actual minus planned` : "Not recorded yet")}
      ${detailItem("Actual Expenses", formatWholeCurrency(row.actual_expense_eur || 0, "EUR"))}
      ${detailItem("Structural Overspending", formatWholeCurrency(row.structural_overspending_eur || 0, "EUR"))}
      ${detailSectionHtml("Income Categories", targetDetailCategoryList(monthlyTargetIncomeCategories(row), "income"))}
      ${detailSectionHtml("Expense Categories", targetDetailCategoryList(row.categories || [], "expense"))}
    </dl>
  `;
}

function monthlyTargetEditForm(row = {}) {
  return `
    <form class="drawer-form target-edit-form" id="monthly-target-form" data-monthly-target-edit-form>
      ${targetEditInput("Income Baseline", "monthly", row.month, "income_target_eur", row.income_target_eur, "EUR")}
      ${targetEditInput("Expense Ceiling", "monthly", row.month, "expense_ceiling_eur", row.expense_ceiling_eur, "EUR")}
      ${targetEditInput("Expense Target", "monthly", row.month, "expense_target_pct", row.expense_target_pct, "%")}
      ${targetEditInput("Savings Target", "monthly", row.month, "savings_target_pct", row.savings_target_pct, "%")}
      <div class="field-wide target-edit-group">
        <span>Income Categories</span>
        ${targetCategoryEditors(monthlyTargetIncomeCategories(row), row.month, "income_categories")}
      </div>
      <div class="field-wide target-edit-group">
        <span>Expense Categories</span>
        ${targetCategoryEditors(row.categories || [], row.month, "categories")}
      </div>
      <p class="drawer-note">Changes are local scenario edits and reset when the data is refreshed.</p>
    </form>
  `;
}

function targetEditInput(label, scope, key, field, value, suffix = "EUR") {
  const dataAttrs = scope === "yearly"
    ? `data-yearly-target-year="${safe(key)}" data-yearly-target-field="${safe(field)}"`
    : `data-monthly-target-month="${safe(key)}" data-monthly-target-field="${safe(field)}"`;
  return `
    <label>
      <span>${safe(label)}</span>
      <div class="target-detail-input">
        <input ${dataAttrs} data-format-${suffix === "%" ? "percent" : "number"} inputmode="decimal" type="text" value="${safe(formatEditableNumber(targetInputValue(value)))}" />
        <em>${safe(suffix)}</em>
      </div>
    </label>
  `;
}

function targetDetailCategoryList(categories = [], mode = "expense") {
  if (!categories.length) return "-";
  return `
    <div class="target-detail-list">
      ${categories.map((category) => `
        <span>
          <i aria-hidden="true">${icons[insightIconFor(category.category || mode, "category")] || icons.pie}</i>
          <strong>${safe(taxonomyLabel(category.category || mode))}</strong>
          <em>${safe(`${formatWholeCurrency(category.target_eur || 0, "EUR")} target · ${formatWholeCurrency(category.actual_eur || 0, "EUR")} actual`)}</em>
        </span>
      `).join("")}
    </div>
  `;
}

function targetCategoryEditors(categories = [], month = "", group = "categories") {
  if (!categories.length) return `<p class="drawer-note">No category baseline available.</p>`;
  return `
    <div class="target-category-editor-list">
      ${categories.map((category) => `
        <label>
          <span>${safe(taxonomyLabel(category.category || "uncategorized"))}</span>
          <div class="target-detail-input">
            <input
              data-monthly-target-month="${safe(month)}"
              data-monthly-target-group="${safe(group)}"
              data-monthly-target-name="${safe(category.category || "uncategorized")}"
              data-monthly-target-item-field="target_eur"
              data-format-number
              inputmode="decimal"
              type="text"
              value="${safe(formatEditableNumber(targetInputValue(category.target_eur || 0)))}"
            />
            <em>EUR</em>
          </div>
        </label>
      `).join("")}
    </div>
  `;
}

function transactionCategorySpendBars(rows = []) {
  const total = rows.reduce((sum, item) => sum + numericValue(item.amount_eur), 0);
  return insightBars(
    rows.map((row) => {
      const amount = numericValue(row.amount_eur);
      return {
        label: taxonomyLabel(row.category || "uncategorized"),
        value: formatWholeCurrency(amount, "EUR"),
        detail: [nativeCurrencySummaryOrBlank(row.native_amounts), formatPlural(row.count || 0, "row")].filter(Boolean).join(" · "),
        icon: insightIconFor(row.category || "uncategorized", "category"),
        share: percentOf(amount, total),
        action: "filter-category",
        dataAttrs: `data-category="${safe(row.category || "")}" data-transaction-class="expense"`,
      };
    }),
    "No category spending for the selected period.",
  );
}

function transactionIncomeSourceBars(rows = []) {
  const total = rows.reduce((sum, item) => sum + numericValue(item.amount_eur), 0);
  return insightBars(
    rows.map((row) => {
      const amount = numericValue(row.amount_eur);
      return {
        label: labelize(row.name || "-"),
        value: formatWholeCurrency(amount, "EUR"),
        detail: [nativeCurrencySummaryOrBlank(row.native_amounts), formatPlural(row.count || 0, "row")].filter(Boolean).join(" · "),
        icon: insightIconFor(row.name || "-", "income-source"),
        share: percentOf(amount, total),
        action: "filter-transactions",
        dataAttrs: `data-income-source="${safe(row.name || "")}" data-transaction-class="income"`,
      };
    }),
    "No income sources for the selected period.",
  );
}

function transactionCurrencyFlowBars(rows = []) {
  const total = rows.reduce((sum, item) => sum + Math.abs(numericValue(item.net_eur)), 0);
  return insightBars(
    rows.map((row) => {
      const net = numericValue(row.net_eur);
      return {
        label: row.currency || "-",
        value: signedWholeAmount(net, "EUR"),
        detail: `${signedWholeAmount(row.net_native || 0, row.currency || "EUR")} native · ${formatPlural(row.count || 0, "row")}`,
        icon: "currency",
        share: percentOf(Math.abs(net), total),
        action: "filter-transactions",
        dataAttrs: `data-statement-currency="${safe(row.currency || "")}"`,
      };
    }),
    "No currency flow for the selected period.",
  );
}

function transactionAnomalyBars(rows = []) {
  return insightBars(
    rows.map((row) => ({
      label: monthLabel(row.month),
      value: `+${formatWholeCurrency(row.delta_eur || 0, "EUR")}`,
      detail: `${formatWholeCurrency(row.expense_eur || 0, "EUR")} vs ${formatWholeCurrency(row.baseline_eur || 0, "EUR")} baseline`,
      icon: row.severity === "high" ? "trendDown" : "target",
      share: Math.min(100, Math.abs(numericValue(row.delta_pct))),
    })),
    "No abnormal spending months detected.",
  );
}

function transactionRecurringBars(rows = []) {
  const total = rows.reduce((sum, row) => sum + numericValue(row.average_amount_eur), 0);
  return insightBars(
    rows.map((row) => ({
      label: row.name || taxonomyLabel(row.category || "expense"),
      value: formatWholeCurrency(row.average_amount_eur || 0, "EUR"),
      detail: `${formatPlural(row.months || 0, "month")} · ${signedPercent(row.trend_pct || 0)} trend · ${taxonomyLabel(row.category || "expense")}`,
      icon: insightIconFor(row.category || row.name || "expense", "category"),
      share: percentOf(row.average_amount_eur || 0, total),
      action: "filter-transactions",
      dataAttrs: row.name ? `data-income-source="${safe(row.name)}" data-transaction-class="expense"` : `data-category="${safe(row.category || "")}" data-transaction-class="expense"`,
    })),
    "No recurring spend candidates detected.",
  );
}

function accountTabs() {
  const values = [
    { label: "All Accounts", accountStatus: "", reviewStatus: "", ledgerStatus: "" },
    { label: "Active", accountStatus: "active", reviewStatus: "", ledgerStatus: "" },
    { label: "Inactive", accountStatus: "inactive", reviewStatus: "", ledgerStatus: "" },
    { label: "Review", accountStatus: "", reviewStatus: "open", ledgerStatus: "" },
    { label: "Deleted", accountStatus: "", reviewStatus: "", ledgerStatus: "deleted" },
  ];
  const [allTab, ...otherTabs] = values;
  return `
    <nav class="transaction-tabs register-tabs" aria-label="Accounts register filters">
      ${accountTabButton(allTab)}
      <button
        class="${state.accountView === "insights" ? "is-active" : ""}"
        data-action="account-insights-tab"
        type="button"
      >Insights</button>
      ${otherTabs
        .map((tab) => `
          ${accountTabButton(tab)}
        `)
        .join("")}
    </nav>
  `;
}

function accountTabButton(tab) {
  return `
    <button
      class="${accountTabIsActive(tab) ? "is-active" : ""}"
      data-action="account-tab"
      data-account-status="${safe(tab.accountStatus)}"
      data-review-status="${safe(tab.reviewStatus)}"
      data-ledger-status="${safe(tab.ledgerStatus)}"
      type="button"
    >${safe(tab.label)}</button>
  `;
}

function accountTabIsActive(tab) {
  return (
    state.accountView === "register"
    &&
    state.accountFilters.account_status === tab.accountStatus
    && state.accountFilters.review_status === tab.reviewStatus
    && state.accountFilters.ledger_status === tab.ledgerStatus
  );
}

function accountMetrics(summary = {}, data = {}) {
  const activeStatus = state.accountFilters.account_status;
  if (state.accountFilters.ledger_status === "deleted") {
    return transactionMetric("Deleted", formatNumber(data?.total || 0), "recoverable rows");
  }
  if (state.accountFilters.review_status === "open") {
    return transactionMetric("Review", formatNumber(data?.total || 0), "accounts");
  }
  if (activeStatus === "active") {
    return [
      transactionMetric("Active Accounts", formatNumber(summary.active_accounts || 0), `${formatNumber(data?.total || 0)} rows`),
      transactionMetric("Assets", formatWholeCurrency(summary.assets_eur || 0, "EUR"), "positive balances"),
      transactionMetric("Liabilities", formatWholeCurrency(summary.liabilities_eur || 0, "EUR"), "negative balances"),
    ].join("");
  }
  if (activeStatus === "inactive") {
    return transactionMetric("Inactive Accounts", formatNumber(summary.inactive_accounts || 0), `${formatNumber(data?.total || 0)} rows`);
  }
  return [
    transactionMetric("Net Worth", formatWholeCurrency(summary.net_worth_eur || 0, "EUR"), `${formatNumber(summary.accounts || 0)} accounts`),
    transactionMetric("Assets", formatWholeCurrency(summary.assets_eur || 0, "EUR"), "active accounts"),
    transactionMetric("Liabilities", formatWholeCurrency(summary.liabilities_eur || 0, "EUR"), "active accounts"),
    transactionMetric("Review", formatNumber(summary.review_open || 0), "accounts"),
  ].join("");
}

function accountTreemapDashboard(data = {}) {
  const rows = data?.rows || [];
  const summary = data?.summary || {};
  const treemapRows = rows.filter((row) => String(row.ledger_status || "").toLowerCase() !== "deleted");
  const referenceCounts = accountTreemapReferenceCounts(treemapRows);
  const items = treemapRows
    .map((row) => {
      const balance = numericValue(row.amount_eur_converted);
      const value = Math.abs(balance);
      const group = labelize(row.capital_bucket || row.account_type || "uncategorized");
      const label = accountTreemapLabel(row, referenceCounts);
      return {
        action: "filter-accounts",
        dataAttrs: `data-account-id="${safe(row.account_id || "")}"`,
        detail: [labelize(row.provider_id), currencyText(row.account_currency)].filter(Boolean).join(" · "),
        group,
        label,
        sublabel: formatWholeCurrency(balance, "EUR"),
        value,
      };
    })
    .filter((item) => item.value > 0);
  const largest = items.slice().sort((a, b) => b.value - a.value)[0];
  return `
    <section class="transaction-metrics">
	      ${accountMetrics(summary, data)}
	      ${transactionMetric("Treemap Rows", formatNumber(items.length), "nonzero balances")}
	      ${transactionMetric("Largest Tile", largest ? largest.label : "-", largest ? largest.sublabel : "no nonzero balance")}
	    </section>
		    ${treemapSection(
		      items,
		      {
		        ariaLabel: "Account allocation treemap",
		        emptyLabel: "No account balances are available for the current filters.",
		        metricLabel: "accounts",
		        totalLabel: "Shown account balance",
		      },
			    )}
	  `;
}

function accountTreemapReferenceCounts(rows = []) {
  return rows.reduce((counts, row) => {
    const label = accountTreemapBaseLabel(row);
    const providerKey = accountTreemapProviderKey(row);
    const currencyKey = accountTreemapCurrencyKey(row);
    incrementMapCount(counts.base, label);
    incrementMapCount(counts.provider, `${label}||${providerKey}`);
    incrementMapCount(counts.providerCurrency, `${label}||${providerKey}||${currencyKey}`);
    return counts;
  }, {
    base: new Map(),
    provider: new Map(),
    providerCurrency: new Map(),
  });
}

function accountTreemapBaseLabel(row = {}) {
  return row.account_reference || row.account_id || "Account";
}

function accountTreemapLabel(row = {}, referenceCounts = new Map()) {
  const base = accountTreemapBaseLabel(row);
  if ((referenceCounts.base?.get(base) || 0) <= 1) return base;
  const provider = accountTreemapProviderKey(row);
  const currency = accountTreemapCurrencyKey(row);
  const providerSignature = `${base}||${provider}`;
  const currencySignature = `${providerSignature}||${currency}`;
  const suffix = provider && (referenceCounts.provider?.get(providerSignature) || 0) === 1
    ? provider
    : provider && currency && (referenceCounts.providerCurrency?.get(currencySignature) || 0) === 1
      ? `${provider} · ${currency}`
      : compactRecordSuffix(row.account_id);
  return suffix ? `${base} · ${suffix}` : base;
}

function accountTreemapProviderKey(row = {}) {
  return labelize(row.provider_id || "");
}

function accountTreemapCurrencyKey(row = {}) {
  return currencyText(row.account_currency);
}

function incrementMapCount(map, key) {
  map.set(key, (map.get(key) || 0) + 1);
}

function compactRecordSuffix(value = "") {
  const raw = String(value || "").trim();
  if (!raw) return "";
  const parts = raw.split(/[_\s-]+/).filter(Boolean);
  const suffix = parts.length ? parts[parts.length - 1] : raw;
  return suffix.length > 8 ? suffix.slice(-8) : suffix;
}

function currencyText(value) {
  const code = String(value || "").trim().toUpperCase();
  return code || "";
}

function treemapChart(items = [], options = {}) {
  const visibleItems = (items || [])
    .map((item) => ({ ...item, value: Math.abs(numericValue(item.value)) }))
    .filter((item) => item.value > 0)
    .sort((a, b) => b.value - a.value);
  if (!visibleItems.length) return emptyState(options.emptyLabel || "No treemap data available.");
  const valueFormatter = typeof options.valueFormatter === "function"
    ? options.valueFormatter
    : (value) => formatWholeCurrency(value, "EUR");
  const total = visibleItems.reduce((sum, item) => sum + item.value, 0);
  const packedItems = treemapVisibleItems(visibleItems, total, valueFormatter);
  const groups = treemapGroupedItems(packedItems, valueFormatter);
  const groupClassByName = new Map(groups.map((group, index) => [group.name, `treemap-color-${(index % 8) + 1}`]));
  const layoutBounds = treemapLayoutBounds();
  const laidOutGroups = treemapNormalizeLayout(treemapSquarifyLayout(groups, layoutBounds), layoutBounds);
  return `
    <section class="treemap-dashboard" aria-label="${safe(options.ariaLabel || "Treemap")}">
      <div class="treemap-canvas">
        ${laidOutGroups.map((group) => treemapGroup(group, total, valueFormatter, groupClassByName, layoutBounds.aspect)).join("")}
      </div>
    </section>
  `;
}

function treemapSection(items = [], options = {}) {
  return `
    <section class="treemap-section">
      ${treemapChart(items, options)}
    </section>
  `;
}

const TREEMAP_MAX_ITEMS_PER_GROUP = 6;
const TREEMAP_MAX_TOTAL_ITEMS = 32;
const TREEMAP_GLOBAL_TAIL_SHARE = 0.005;
const TREEMAP_TAIL_SHARE = 0.02;
const TREEMAP_MIN_ASPECT = 1.15;
const TREEMAP_MAX_ASPECT = 4.2;

function treemapLayoutBounds() {
  const stageWidth = elements.pageStage?.clientWidth || document.querySelector(".workspace")?.clientWidth || window.innerWidth || 1440;
  const targetHeight = Math.min(820, Math.max(520, (window.innerHeight || 900) * 0.62));
  const aspect = Math.min(TREEMAP_MAX_ASPECT, Math.max(TREEMAP_MIN_ASPECT, stageWidth / Math.max(1, targetHeight)));
  return { x: 0, y: 0, width: 100 * aspect, height: 100, aspect };
}

function treemapVisibleItems(items = [], total = 0, valueFormatter = formatWholeCurrency) {
  const sorted = items.slice().sort((a, b) => numericValue(b.value) - numericValue(a.value));
  const visibleTotal = Math.max(0, numericValue(total));
  const tailThreshold = visibleTotal * TREEMAP_GLOBAL_TAIL_SHARE;
  const firstTailIndex = sorted.findIndex((item, index) => index >= 6 && numericValue(item.value) < tailThreshold);
  const visibleLimit = Math.min(
    firstTailIndex >= 0 ? firstTailIndex : sorted.length,
    TREEMAP_MAX_TOTAL_ITEMS,
  );
  const visible = sorted.slice(0, visibleLimit);
  const remainder = sorted.slice(visibleLimit);
  const remainderValue = remainder.reduce((sum, item) => sum + numericValue(item.value), 0);
  if (remainderValue <= 0) return visible;
  if (remainder.length <= 1 && visibleTotal && remainderValue / visibleTotal < TREEMAP_GLOBAL_TAIL_SHARE) {
    return visible;
  }
  return visible.concat({
    group: "Other",
    label: `Other ${formatNumber(remainder.length)}`,
    sublabel: valueFormatter(remainderValue),
    detail: `${formatNumber(remainder.length)} smaller items`,
    value: remainderValue,
    aggregate: true,
  });
}

function treemapGroupedItems(items = [], valueFormatter = formatWholeCurrency) {
  const groups = new Map();
  items.forEach((item) => {
    const name = item.group || "Uncategorized";
    const existing = groups.get(name) || { name, value: 0, items: [] };
    existing.value += numericValue(item.value);
    existing.items.push(item);
    groups.set(name, existing);
  });
  return Array.from(groups.values())
    .map((group) => ({
      ...group,
      items: treemapVisibleGroupItems(group.items, group.value, valueFormatter),
    }))
    .sort((a, b) => b.value - a.value);
}

function treemapVisibleGroupItems(items = [], groupValue = 0, valueFormatter = formatWholeCurrency) {
  const sorted = items.slice().sort((a, b) => numericValue(b.value) - numericValue(a.value));
  const groupTotal = Math.max(0, numericValue(groupValue));
  const tailThreshold = groupTotal * TREEMAP_TAIL_SHARE;
  const firstTailIndex = sorted.findIndex((item, index) => index >= 2 && numericValue(item.value) < tailThreshold);
  const visibleLimit = firstTailIndex >= 0
    ? Math.min(firstTailIndex, TREEMAP_MAX_ITEMS_PER_GROUP - 1)
    : Math.min(sorted.length, TREEMAP_MAX_ITEMS_PER_GROUP);
  const visible = sorted.slice(0, visibleLimit);
  const remainder = sorted.slice(visibleLimit);
  const remainderValue = remainder.reduce((sum, item) => sum + numericValue(item.value), 0);
  if (remainderValue <= 0) return visible;
  const group = sorted[0]?.group || "Uncategorized";
  return visible.concat({
    group,
    label: `Other ${formatNumber(remainder.length)}`,
    sublabel: valueFormatter(remainderValue),
    detail: `${formatNumber(remainder.length)} smaller items`,
    value: remainderValue,
    aggregate: true,
  });
}

function treemapGroups(items = []) {
  return treemapGroupedItems(items).map(({ name, value }) => ({ name, value }));
}

function treemapGroup(group = {}, total = 0, valueFormatter = formatWholeCurrency, groupClassByName = new Map(), chartAspect = 1) {
  const colorClass = groupClassByName.get(group.name || "Uncategorized") || "treemap-color-1";
  const area = Math.max(0, numericValue(group.width) * numericValue(group.height));
  const shortestSide = Math.min(Math.max(0, numericValue(group.width)), Math.max(0, numericValue(group.height)));
  const sizeClass = area < 2 || shortestSide < 4
    ? "is-tiny"
    : area < 7 || shortestSide < 8
      ? "is-small"
      : "";
  const groupAspect = Math.min(
    TREEMAP_MAX_ASPECT,
    Math.max(0.45, (numericValue(group.width) / Math.max(1, numericValue(group.height))) * numericValue(chartAspect, 1)),
  );
  const tileBounds = { x: 0, y: 0, width: 100 * groupAspect, height: 100, aspect: groupAspect };
  const tiles = treemapNormalizeLayout(treemapSquarifyLayout(group.items || [], tileBounds), tileBounds);
  const scopedColorMap = new Map([[group.name || "Uncategorized", colorClass]]);
  const label = `${group.name || "Uncategorized"}: ${valueFormatter(group.value || 0)} · ${formatPercent(percentOf(group.value, total))}`;
  return `
    <section class="treemap-group ${safe(colorClass)} ${safe(sizeClass)}" style="${safe(treemapStyle(group))}" aria-label="${safe(label)}">
      <div class="treemap-group-body">
        ${tiles.map((tile, index) => treemapTile(tile, total, scopedColorMap, index, tiles.length, group)).join("")}
      </div>
    </section>
  `;
}

function treemapSquarifyLayout(items = [], rect = {}) {
  const source = (items || []).filter((item) => numericValue(item.value) > 0);
  if (!source.length) return [];
  const total = source.reduce((sum, item) => sum + treemapLayoutValue(item), 0);
  const area = numericValue(rect.width, 100) * numericValue(rect.height, 100);
  if (!total || !area) return [];
  const scaled = source.map((item) => ({
    ...item,
    _area: treemapLayoutValue(item) / total * area,
  }));
  if (scaled.length === 1) return [{ ...scaled[0], ...rect }];
  return treemapSquarifyRows(scaled, {
    x: numericValue(rect.x),
    y: numericValue(rect.y),
    width: numericValue(rect.width, 100),
    height: numericValue(rect.height, 100),
  });
}

function treemapNormalizeLayout(items = [], bounds = {}) {
  const width = Math.max(1, numericValue(bounds.width, 100));
  const height = Math.max(1, numericValue(bounds.height, 100));
  return (items || []).map((item) => ({
    ...item,
    x: (numericValue(item.x) / width) * 100,
    y: (numericValue(item.y) / height) * 100,
    width: (numericValue(item.width) / width) * 100,
    height: (numericValue(item.height) / height) * 100,
  }));
}

function treemapLayoutValue(item = {}) {
  const override = item.layoutValue;
  if (override !== undefined && override !== null && String(override).trim() !== "") {
    return Math.max(0, numericValue(override));
  }
  return Math.max(0, numericValue(item.value));
}

function treemapSquarifyRows(items = [], rect = {}) {
  const remaining = items.slice();
  const laidOut = [];
  let row = [];
  let currentRect = { ...rect };

  while (remaining.length) {
    const item = remaining[0];
    const side = Math.min(currentRect.width, currentRect.height);
    const nextRow = row.concat(item);
    if (!row.length || treemapWorstRatio(nextRow, side) <= treemapWorstRatio(row, side)) {
      row = nextRow;
      remaining.shift();
    } else {
      const result = treemapLayoutRow(row, currentRect);
      laidOut.push(...result.items);
      currentRect = result.remainingRect;
      row = [];
    }
  }
  if (row.length) {
    laidOut.push(...treemapLayoutRow(row, currentRect).items);
  }
  return laidOut.map(({ _area, ...item }) => item);
}

function treemapWorstRatio(row = [], side = 1) {
  if (!row.length || side <= 0) return Infinity;
  const areas = row.map((item) => Math.max(0, numericValue(item._area)));
  const sum = areas.reduce((total, value) => total + value, 0);
  const min = Math.min(...areas);
  const max = Math.max(...areas);
  if (!sum || !min || !max) return Infinity;
  const sideSquared = side * side;
  const sumSquared = sum * sum;
  return Math.max((sideSquared * max) / sumSquared, sumSquared / (sideSquared * min));
}

function treemapLayoutRow(row = [], rect = {}) {
  const rowArea = row.reduce((total, item) => total + numericValue(item._area), 0);
  if (!row.length || !rowArea || rect.width <= 0 || rect.height <= 0) {
    return { items: [], remainingRect: rect };
  }
  const items = [];
  if (rect.width >= rect.height) {
    const columnWidth = Math.min(rect.width, rowArea / rect.height);
    let y = rect.y;
    row.forEach((item, index) => {
      const height = index === row.length - 1
        ? Math.max(0, rect.y + rect.height - y)
        : Math.min(rect.y + rect.height - y, numericValue(item._area) / columnWidth);
      items.push({ ...item, x: rect.x, y, width: columnWidth, height });
      y += height;
    });
    return {
      items,
      remainingRect: {
        x: rect.x + columnWidth,
        y: rect.y,
        width: Math.max(0, rect.width - columnWidth),
        height: rect.height,
      },
    };
  }
  const rowHeight = Math.min(rect.height, rowArea / rect.width);
  let x = rect.x;
  row.forEach((item, index) => {
    const width = index === row.length - 1
      ? Math.max(0, rect.x + rect.width - x)
      : Math.min(rect.x + rect.width - x, numericValue(item._area) / rowHeight);
    items.push({ ...item, x, y: rect.y, width, height: rowHeight });
    x += width;
  });
  return {
    items,
    remainingRect: {
      x: rect.x,
      y: rect.y + rowHeight,
      width: rect.width,
      height: Math.max(0, rect.height - rowHeight),
    },
  };
}

function treemapStyle(rect = {}) {
  return [
    `left:${Math.max(0, numericValue(rect.x)).toFixed(3)}%`,
    `top:${Math.max(0, numericValue(rect.y)).toFixed(3)}%`,
    `width:${Math.max(0, numericValue(rect.width)).toFixed(3)}%`,
    `height:${Math.max(0, numericValue(rect.height)).toFixed(3)}%`,
  ].join("; ");
}

function treemapHoverCard(tile = {}, amount = "", shareLabel = "") {
  const rows = [
    ["Amount", amount],
    ["Share", `${shareLabel} of shown value`],
    ["Group", tile.group || ""],
    ["Details", tile.detail || ""],
  ].filter(([, value]) => String(value || "").trim());
  return `
    <span class="treemap-hover-card" aria-hidden="true">
      <span class="treemap-hover-card-title">${safe(tile.label || "Item")}</span>
      ${rows.map(([label, value]) => `
        <span class="treemap-hover-card-row">
          <span>${safe(label)}</span>
          <strong>${safe(value)}</strong>
        </span>
      `).join("")}
    </span>
  `;
}

function treemapTile(tile = {}, total = 0, groupClassByName = new Map(), index = 0, itemCount = 1, parentRect = {}) {
  const colorClass = groupClassByName.get(tile.group || "Uncategorized") || "treemap-color-1";
  const depthClass = `treemap-depth-${Math.min(5, Math.max(1, Math.floor((numericValue(index) / Math.max(1, numericValue(itemCount) - 1)) * 5) + 1))}`;
  const share = percentOf(tile.value, total);
  const style = treemapStyle(tile);
  const amount = tile.sublabel || formatWholeCurrency(tile.value, "EUR");
  const shareLabel = formatPercent(share);
  const displayWidth = numericValue(tile.width) * Math.max(0, numericValue(parentRect.width, 100)) / 100;
  const displayHeight = numericValue(tile.height) * Math.max(0, numericValue(parentRect.height, 100)) / 100;
  const globalX = numericValue(parentRect.x) + numericValue(tile.x) * Math.max(0, numericValue(parentRect.width, 100)) / 100;
  const globalY = numericValue(parentRect.y) + numericValue(tile.y) * Math.max(0, numericValue(parentRect.height, 100)) / 100;
  const area = Math.max(0, displayWidth * displayHeight);
  const shortestSide = Math.min(Math.max(0, displayWidth), Math.max(0, displayHeight));
  const sizeClass = area < 3 || shortestSide < 2.8
    ? "is-tiny"
    : area < 24 || shortestSide < 9
      ? "is-small"
      : area < 52 || shortestSide < 14
        ? "is-compact"
        : "";
  const tooltipClass = `${globalX > 62 ? " is-tooltip-left" : ""}${globalY > 58 ? " is-tooltip-above" : ""}`;
  const content = `
    <strong>${safe(amount)}</strong>
    <em>${safe(shareLabel)}</em>
    ${treemapHoverCard(tile, amount, shareLabel)}
  `;
  const attrs = [
    `class="treemap-tile ${safe(colorClass)} ${safe(depthClass)} ${safe(sizeClass)}${safe(tooltipClass)}${tile.aggregate ? " is-aggregate" : ""}"`,
    `style="${safe(style)}"`,
    `aria-label="${safe(`${tile.label || "Item"} · ${amount} · ${shareLabel}${tile.detail ? ` · ${tile.detail}` : ""}`)}"`,
    tile.action ? `data-action="${safe(tile.action)}"` : "",
    tile.dataAttrs || "",
  ].filter(Boolean).join(" ");
  if (tile.action === "open-portfolio-instrument") {
    return `<div ${attrs} role="button" tabindex="0">${content}</div>`;
  }
  if (!tile.action) {
    return `<div ${attrs}>${content}</div>`;
  }
  return `<button ${attrs} type="button">${content}</button>`;
}

function accountTableActions() {
  const selected = state.selectedAccounts.size;
  const deletedTab = state.accountFilters.ledger_status === "deleted";
  const selectionActions = selected ? `
    <span>${formatNumber(selected)} selected</span>
    <button class="table-action-button" data-action="clear-account-selection" type="button">Clear</button>
    ${deletedTab ? `
      <button class="table-action-button" data-action="restore-selected-accounts" type="button">
        <span data-icon="undo"></span>
        <span>Restore</span>
      </button>
      <button class="table-action-button is-danger" data-action="permanently-delete-selected-accounts" type="button">
        <span data-icon="trash"></span>
        <span>Delete Forever</span>
      </button>
    ` : `
      <button class="table-action-button" data-action="duplicate-selected-accounts" type="button">
        <span data-icon="copy"></span>
        <span>Duplicate</span>
      </button>
      <button class="table-action-button is-danger" data-action="delete-selected-accounts" type="button">
        <span data-icon="trash"></span>
        <span>Delete</span>
      </button>
    `}
  ` : "";
  const addAction = deletedTab ? "" : `
    <button class="table-action-button is-primary" data-action="add-account" type="button">
      <span data-icon="plus"></span>
      <span>Add Account</span>
    </button>
  `;
  if (!selectionActions && !addAction) return "";
  return `
    <div class="selection-inline" aria-live="polite">
      ${selectionActions}
      ${addAction}
    </div>
  `;
}

function accountTable(rows, data) {
  const start = data && data.total ? data.offset + 1 : 0;
  const end = data ? Math.min(data.offset + data.limit, data.total) : 0;
  const canGoBack = data && data.offset > 0;
  const canGoForward = data && data.offset + data.limit < data.total;
  const allVisibleSelected = rows.length > 0 && rows.every((row) => state.selectedAccounts.has(row.account_id));

  return `
    <section class="minimal-table-wrap transactions-table-wrap">
      <table class="minimal-table transactions-table accounts-table">
        <thead>
          <tr>
            <th class="check-cell account-check-cell"><input data-select-account-page type="checkbox" ${allVisibleSelected ? "checked" : ""} aria-label="Select visible accounts" /></th>
            <th class="account-reference-col">${accountSortHeader("Account", "reference")}</th>
            <th class="account-provider-col">${accountSortHeader("Provider", "provider")}</th>
            <th class="account-status-col">${accountSortHeader("Status", "status")}</th>
            <th class="account-bucket-col">${accountSortHeader("Bucket", "bucket")}</th>
            <th class="account-type-col">${accountSortHeader("Type", "type")}</th>
            <th class="account-currency-col">${accountSortHeader("Currency", "currency")}</th>
            <th class="account-money-col align-right">${accountSortHeader("Native Balance", "native_balance")}</th>
            <th class="account-money-col align-right">${accountSortHeader(`${projectCurrencyCode()} Value`, "balance")}</th>
          </tr>
        </thead>
        <tbody>
          ${rows.length ? rows.map((row) => `
            <tr class="clickable-row ${state.selectedAccountId === row.account_id ? "is-selected" : ""}" data-action="open-account" data-account-id="${safe(row.account_id)}" tabindex="0">
              <td class="check-cell account-check-cell">
                <input
                  data-account-select
                  type="checkbox"
                  value="${safe(row.account_id)}"
                  ${state.selectedAccounts.has(row.account_id) ? "checked" : ""}
                  aria-label="Select ${safe(row.account_id)}"
                />
              </td>
              <td class="account-reference-col">
                <span class="instrument-cell">
                  ${accountTypeMark(row)}
                  <span>
                    <span class="table-main">${quickFilterControl(row.account_reference || row.account_id)}</span>
                    <span class="table-sub">${quickFilterControl(row.account_id, row.account_id, { field: "account_id" })}</span>
                  </span>
                </span>
              </td>
              <td class="account-provider-col">${quickFilterControl(row.provider_id || "-", labelize(row.provider_id), { field: "provider_id" })}</td>
              <td class="account-status-col">${quickFilterHtml(row.ledger_status === "deleted" ? "deleted" : row.account_status, accountStatusInline(row), { field: row.ledger_status === "deleted" ? "ledger_status" : "account_status" })}</td>
              <td class="account-bucket-col">${quickFilterControl(row.capital_bucket, labelize(row.capital_bucket), { field: "capital_bucket" })}</td>
              <td class="account-type-col">${quickFilterControl(row.account_type, labelize(row.account_type), { field: "account_type" })}</td>
              <td class="account-currency-col">${quickFilterHtml(row.account_currency, currencyCell(row.account_currency), { field: "account_currency" })}</td>
              <td class="account-money-col align-right ${signedClass(row.balance_native)}">${formatAccountMoney(row.balance_native, row.account_currency, { project: false })}</td>
              <td class="account-money-col align-right ${signedClass(row.amount_eur_converted)}">${formatAccountMoney(row.amount_eur_converted, "EUR")}</td>
            </tr>
          `).join("") : emptyRow(9)}
        </tbody>
      </table>
    </section>
    <footer class="table-footer">
      <span>${data ? `${formatNumber(start)}-${formatNumber(end)} of ${formatNumber(data.total)}` : "0 results"}</span>
      <div>
        ${pageSizeControl("accounts")}
        <button class="small-button" data-action="previous-account-page" type="button" ${canGoBack ? "" : "disabled"}>Previous</button>
        <button class="small-button" data-action="next-account-page" type="button" ${canGoForward ? "" : "disabled"}>Next</button>
      </div>
    </footer>
  `;
}

function accountTypeMark(row) {
  const type = String(row.account_type || "").trim().toLowerCase();
  const iconByType = {
    bank_account: "bank",
    brokerage_account: "trendUp",
    cash_account: "currency",
    credit_card: "creditCard",
    credit_facility: "creditCard",
    digital_wallet: "phoneWallet",
    emergency_fund: "shield",
    investment_account: "pie",
    loan_liability: "scale",
    mortgage_liability: "home",
    pension_investment_account: "pie",
    private_receivable: "fileText",
    real_estate: "home",
    savings_account: "bank",
  };
  const icon = icons[iconByType[type] || "wallet"] || icons.wallet;
  return `<span class="account-type-mark" aria-hidden="true">${icon}</span>`;
}

function accountStatusInline(row) {
  const isDeleted = row.ledger_status === "deleted";
  const status = isDeleted ? "deleted" : String(row.account_status || "").trim().toLowerCase();
  return `
    <span class="status-inline ${safe(status)}">
      <span class="status-dot ${safe(status)}" aria-hidden="true"></span>
      <span>${safe(labelize(status || "unknown"))}</span>
    </span>
  `;
}

function transactionTabs(classes = [], insights = {}) {
  const priority = ["income", "expense", "transfer"];
  const classValues = Array.from(new Set(classes.map(canonicalTaxonomyValue).filter(Boolean)));
  const values = [
    ACCOUNTABLE_TRANSACTION_TAB,
    NOT_ACCOUNTABLE_TRANSACTION_TAB,
    ...priority,
    ...classValues.filter((item) => !priority.includes(item)),
    REVIEW_REQUIRED_TAB,
    DELETED_TRANSACTION_TAB,
  ];
  const labels = {
    "": "All Transactions",
    [ACCOUNTABLE_TRANSACTION_TAB]: "Accountable",
    [NOT_ACCOUNTABLE_TRANSACTION_TAB]: "Not Accountable",
    [REVIEW_REQUIRED_TAB]: "Review",
    [DELETED_TRANSACTION_TAB]: "Deleted",
  };
  const targetTab = `
    <button
      class="${state.transactionView === "monthlyTargets" ? "is-active" : ""}"
      data-action="transaction-monthly-targets-tab"
      type="button"
    >Targets</button>
  `;
  return `
    <nav class="transaction-tabs" aria-label="Transaction classes">
      ${transactionTabButton("", labels)}
      <button
        class="${state.transactionView === "insights" ? "is-active" : ""}"
        data-action="transaction-insights-tab"
        type="button"
      >Insights</button>
      ${targetTab}
      ${values
        .map((value) => transactionTabButton(value, labels))
        .join("")}
    </nav>
  `;
}

function normalizeTransactionTargetView(insights = {}) {
  return insights;
}

function transactionPayloadHasScope(data = {}, scope = "register") {
  if (!data || data.scope !== scope) return false;
  if (["insights", "targets", "monthly_targets"].includes(scope)) {
    return Boolean(data.insights && Object.keys(data.insights).length);
  }
  return true;
}

function transactionMonthlyTargetsAvailableForPeriod(insights = {}) {
  const targets = insights.capital_targets?.monthly_targets || [];
  if (!targets.length) return false;
  if (state.period.mode === "all") return true;
  if (state.period.mode === "year") {
    const year = Number(state.period.year || currentYear());
    return targets.some((row) => String(row.month || "").startsWith(`${year}-`));
  }
  const selectedMonth = state.period.mode === "day"
    ? String(state.period.day || "").slice(0, 7)
    : String(state.period.month || currentMonthKey()).slice(0, 7);
  return targets.some((row) => row.month === selectedMonth);
}

function transactionTabButton(value, labels = {}) {
  return `
      <button
        class="${state.transactionView === "register" && state.transactionFilters.transaction_class === value ? "is-active" : ""}"
        data-action="transaction-tab"
        data-transaction-class="${safe(value)}"
        type="button"
      >${safe(labels[value] || taxonomyLabel(value))}</button>
  `;
}

function transactionMetric(label, value, note) {
  return metricCard(label, value, note);
}

function accountableNote(notAccountableValue) {
  const notAccountable = numericValue(notAccountableValue);
  if (!notAccountable) return "accountable";
  return `accountable · ${formatCurrency(notAccountable, "EUR")} not accountable`;
}

function percentOfIncomeNote(value, income, options = {}) {
  const incomeValue = numericValue(income);
  if (!incomeValue) return options.fallback || "selected period";
  const percent = percentOf(value, incomeValue);
  const label = options.signed ? signedPercent(percent) : formatPercent(Math.abs(percent));
  return `${label} of ${options.denominatorLabel || "income"}`;
}

function combineMetricNotes(...notes) {
  return notes.filter(Boolean).join(" · ");
}

function transactionMetrics(summary = {}, activeClass = "", data = {}) {
  const isNotAccountableTab = activeClass === NOT_ACCOUNTABLE_TRANSACTION_TAB;
  const income = numericValue(isNotAccountableTab ? summary.not_accountable_income_eur : summary.income_eur);
  const expenses = numericValue(isNotAccountableTab ? summary.not_accountable_expense_eur : summary.expense_eur);
  const net = isNotAccountableTab
    ? numericValue(summary.not_accountable_net_eur, income - expenses)
    : numericValue(summary.net_eur);
  const total = numericValue(isNotAccountableTab ? summary.not_accountable_total_eur : summary.total_eur);
  const transactionsMetric = transactionMetric(
    "Transactions",
    formatNumber(summary.filtered ?? 0),
    `${formatNumber(data?.unfiltered_total || 0)} total`,
  );

  if (activeClass === DELETED_TRANSACTION_TAB) {
    return [
      transactionMetric("Deleted", formatNumber(summary.filtered ?? 0), "recycle bin"),
      transactionsMetric,
    ].join("");
  }

  if (activeClass === REVIEW_REQUIRED_TAB) {
    const reviewAmount = numericValue(
      summary.review_open_amount_eur,
      numericValue(summary.total_eur) + numericValue(summary.not_accountable_total_eur),
    );
    return [
      transactionMetric("Review", formatNumber(summary.filtered ?? 0), reviewBreakdownNote(summary)),
      transactionMetric("Review Total", formatCurrency(reviewAmount, "EUR"), "project amount under review"),
      transactionsMetric,
    ].join("");
  }

  if (activeClass === ACCOUNTABLE_TRANSACTION_TAB || activeClass === NOT_ACCOUNTABLE_TRANSACTION_TAB) {
    return [
      transactionMetric("Total Income", formatCurrency(income, "EUR"), activeClass === ACCOUNTABLE_TRANSACTION_TAB ? "accountable" : "not accountable"),
      transactionMetric("Total Expenses", formatCurrency(expenses, "EUR"), percentOfIncomeNote(expenses, income)),
      transactionMetric("Net Flow", signedAmount(net, "EUR"), combineMetricNotes(percentOfIncomeNote(net, income, { signed: true, fallback: "" }), `${formatNumber(summary.filtered ?? 0)} rows`)),
      transactionsMetric,
    ].join("");
  }

  if (activeClass === "income") {
    return [
      transactionMetric("Total Income", formatCurrency(summary.income_eur || 0, "EUR"), accountableNote(summary.not_accountable_income_eur)),
      transactionsMetric,
    ].join("");
  }

  if (activeClass === "expense") {
    return [
      transactionMetric("Total Expenses", formatCurrency(summary.expense_eur || 0, "EUR"), accountableNote(summary.not_accountable_expense_eur)),
      transactionsMetric,
    ].join("");
  }

  if (activeClass) {
    return [
      transactionMetric(`Total ${taxonomyLabel(activeClass)}`, formatCurrency(total, "EUR"), accountableNote(summary.not_accountable_total_eur)),
      transactionsMetric,
    ].join("");
  }

  return [
    transactionMetric("Total Income", formatCurrency(summary.income_eur || 0, "EUR"), accountableNote(summary.not_accountable_income_eur)),
    transactionMetric("Total Expenses", formatCurrency(expenses, "EUR"), combineMetricNotes(percentOfIncomeNote(expenses, income), accountableNote(summary.not_accountable_expense_eur))),
    transactionMetric("Net Flow", signedAmount(net, "EUR"), combineMetricNotes(percentOfIncomeNote(net, income, { signed: true, fallback: "" }), `${formatNumber(summary.filtered ?? 0)} rows`)),
    transactionsMetric,
  ].join("");
}

function reviewBreakdownNote(summary = {}) {
  const required = numericValue(summary.review_required);
  if (!required) return "requires review";
  return `${formatNumber(required)} require review`;
}

function tradeTabs() {
  const values = [
    { label: "All Trades", positionStatus: "", reviewStatus: "", ledgerStatus: "" },
    { label: "Active", positionStatus: "active", reviewStatus: "", ledgerStatus: "" },
    { label: "Closed", positionStatus: "closed", reviewStatus: "", ledgerStatus: "" },
    { label: "Review", positionStatus: "", reviewStatus: "open", ledgerStatus: "" },
    { label: "Deleted", positionStatus: "", reviewStatus: "", ledgerStatus: "deleted" },
  ];
  const [allTab, ...otherTabs] = values;
  return `
    <nav class="transaction-tabs trade-tabs" aria-label="Trades register filters">
      ${tradeTabButton(allTab)}
      <button
        class="${state.tradeView === "insights" ? "is-active" : ""}"
        data-action="trade-insights-tab"
        type="button"
      >Insights</button>
      <button
        class="${state.tradeView === "returns" ? "is-active" : ""}"
        data-action="trade-returns-tab"
        type="button"
      >Returns</button>
      ${otherTabs
        .map((tab) => tradeTabButton(tab))
        .join("")}
    </nav>
  `;
}

function tradeTabButton(tab) {
  return `
    <button
      class="${tradeTabIsActive(tab) ? "is-active" : ""}"
      data-action="trade-tab"
      data-position-status="${safe(tab.positionStatus)}"
      data-review-status="${safe(tab.reviewStatus)}"
      data-ledger-status="${safe(tab.ledgerStatus)}"
      type="button"
    >${safe(tab.label)}</button>
  `;
}

function tradeTabIsActive(tab) {
  return (
    state.tradeView === "register"
    && state.tradeFilters.position_status === tab.positionStatus
    && state.tradeFilters.review_status === tab.reviewStatus
    && state.tradeFilters.ledger_status === tab.ledgerStatus
  );
}

function tradeMetrics(summary = {}, data = {}) {
  const marketValue = currencyRowsTotal(summary.market_value_by_currency);
  const realized = currencyRowsTotal(summary.realized_pl_by_currency);
  const unrealized = currencyRowsTotal(summary.unrealized_pl_by_currency);
  const activeStatus = state.tradeFilters.position_status;
  if (state.tradeFilters.ledger_status === "deleted") {
    return transactionMetric("Deleted", formatNumber(data?.total || 0), "recoverable rows");
  }
  if (state.tradeFilters.review_status === "open") {
    return transactionMetric("Review", formatNumber(data?.total || 0), "trades");
  }
  if (activeStatus === "active") {
    return [
      transactionMetric("Active Positions", formatNumber(summary.active_positions || 0), `${formatNumber(data?.total || 0)} rows`),
      transactionMetric("Market Value", formatWholeCurrency(marketValue, "EUR"), "active positions"),
      transactionMetric("Unrealized P/L", signedWholeAmount(unrealized, "EUR"), `${signedPercent(summary.unrealized_pl_pct)} return`),
    ].join("");
  }
  if (activeStatus === "closed") {
    return [
      transactionMetric("Closed Positions", formatNumber(summary.closed_positions || 0), `${formatNumber(data?.total || 0)} rows`),
      transactionMetric("Realized P/L", signedWholeAmount(realized, "EUR"), `${signedPercent(summary.realized_pl_pct)} return`),
    ].join("");
  }
  return [
    transactionMetric("Active Positions", formatNumber(summary.active_positions || 0), `${formatNumber(summary.closed_positions || 0)} closed`),
    transactionMetric("Market Value", formatWholeCurrency(marketValue, "EUR"), "active positions"),
    transactionMetric("Realized P/L", signedWholeAmount(realized, "EUR"), `${signedPercent(summary.realized_pl_pct)} return`),
    transactionMetric("Unrealized P/L", signedWholeAmount(unrealized, "EUR"), `${signedPercent(summary.unrealized_pl_pct)} return`),
  ].join("");
}

function tradeTreemapDashboard(data = {}) {
  const rows = data?.rows || [];
  const summary = data?.summary || {};
  const currencies = Array.from(new Set(rows.map((row) => normalizeCurrencyCode(row.trade_currency)).filter(Boolean)));
  const exposureCurrency = currencies.length === 1 ? currencies[0] : "";
  const rawItems = rows
    .filter((row) => String(row.ledger_status || "").toLowerCase() !== "deleted")
    .map((row) => {
      const value = tradeTreemapValue(row);
      const label = row.symbol || row.asset_name || row.trade_id || "Trade";
      const group = row.portfolio_id ? portfolioReferenceLabel(row.portfolio_id) : labelize(row.instrument_type || row.provider_id || "unassigned");
      const dataAttrs = row.symbol
        ? `data-symbol="${safe(row.symbol || "")}" data-position-status="${safe(row.position_status || "")}"`
        : `data-trade-id="${safe(row.trade_id || "")}"`;
      return {
        action: "filter-trades",
        dataAttrs,
        detail: [labelize(row.provider_id), labelize(row.instrument_type), labelize(row.position_status)].filter(Boolean).join(" · "),
        group,
        label,
        sublabel: formatTradeMoney(value, row.trade_currency || "EUR"),
        tradeCurrency: row.trade_currency || "EUR",
        value,
      };
    })
    .filter((item) => item.value > 0);
  const items = coalescedTradeTreemapItems(rawItems);
  const largest = items.slice().sort((a, b) => b.value - a.value)[0];
  return `
    <section class="transaction-metrics trade-treemap-metrics">
      ${tradeMetrics(summary, data)}
      ${transactionMetric("Treemap Rows", formatNumber(items.length), "market or cost sized")}
      ${transactionMetric("Largest Tile", largest ? largest.label : "-", largest ? largest.sublabel : "no exposure")}
    </section>
	    ${treemapSection(
	      items,
	      {
	        ariaLabel: "Trade exposure treemap",
		        emptyLabel: "No trade exposure is available for the current filters.",
		        metricLabel: "trade rows",
		        totalLabel: exposureCurrency ? "Shown exposure" : "Shown mixed exposure",
		        valueFormatter: (value) => exposureCurrency
		          ? formatWholeCurrency(value, exposureCurrency)
		          : `${formatNumber(Math.round(numericValue(value)))} mixed`,
		      },
		    )}
	  `;
}

function coalescedTradeTreemapItems(items = []) {
  const groups = new Map();
  items.forEach((item) => {
    const key = [
      item.group || "",
      item.label || "",
      item.detail || "",
      item.action || "",
      item.dataAttrs || "",
      item.tradeCurrency || "",
    ].join("||");
    const existing = groups.get(key) || { ...item, count: 0, value: 0 };
    existing.count += 1;
    existing.value += numericValue(item.value);
    existing.sublabel = formatTradeMoney(existing.value, item.tradeCurrency || "EUR");
    groups.set(key, existing);
  });
  return Array.from(groups.values()).map((item) => {
    if (item.count <= 1) return item;
    return {
      ...item,
      detail: [item.detail, `${formatNumber(item.count)} rows`].filter(Boolean).join(" · "),
    };
  });
}

function tradeTreemapValue(row = {}) {
  const market = Math.abs(numericValue(row.current_market_value_native));
  if (market) return market;
  const cost = Math.abs(numericValue(row.quantity) * numericValue(row.entry_price));
  if (cost) return cost;
  return Math.abs(numericValue(row.realized_pl_native) + numericValue(row.unrealized_pl_native));
}

function tradeInsightsDashboard(data = {}) {
  const insights = data?.insights || data?.summary || {};
  const tables = data?.insight_tables || {};
  const marketValue = currencyRowsTotal(insights.market_value_by_currency);
  const realized = currencyRowsTotal(insights.realized_pl_by_currency);
  const unrealized = currencyRowsTotal(insights.unrealized_pl_by_currency);
  return `
    <section class="transaction-metrics trade-insight-metrics">
      ${transactionMetric("Active Positions", formatNumber(insights.active_positions || 0), `${formatNumber(insights.closed_positions || 0)} closed`)}
      ${transactionMetric("Market Value", formatWholeCurrency(marketValue, "EUR"), "active positions")}
      ${transactionMetric("Realized P/L", signedWholeAmount(realized, "EUR"), `${signedPercent(insights.realized_pl_pct)} return`)}
      ${transactionMetric("Unrealized P/L", signedWholeAmount(unrealized, "EUR"), `${signedPercent(insights.unrealized_pl_pct)} return`)}
    </section>

    <section class="insight-panel-grid trade-insight-grid">
      ${panel("Month Performance", tradePerformanceBars(tables.performance_by_month || [], "period"))}
      ${panel("Instrument Performance", tradePerformanceBars(tables.instrument_performance || [], "instrument"))}
      ${panel("Position Watchlist", tradePositionWatchlistBars(data))}
    </section>
  `;
}

function tradeCurrencyBars(rows = [], signed = false, positionStatus = "") {
  const total = rows.reduce((sum, row) => sum + Math.abs(numericValue(row.amount)), 0);
  return insightBars(
    rows.map((row) => {
      const amount = numericValue(row.amount);
      return {
        label: row.currency || "-",
        value: signed ? signedWholeAmount(amount, row.currency || "EUR") : formatWholeCurrency(amount, row.currency || "EUR"),
        detail: signed ? "native P/L" : "native market value",
        icon: "currency",
        share: percentOf(Math.abs(amount), total),
        action: "filter-trades",
        dataAttrs: `data-trade-currency="${safe(row.currency || "")}" data-position-status="${safe(positionStatus)}"`,
      };
    }),
    "No trade currency exposure available.",
  );
}

function tradeBreakdownBars(rows = [], key = "name", dataKey = "") {
  const total = rows.reduce((sum, row) => sum + Math.abs(numericValue(row.amount_eur)), 0);
  return insightBars(
    rows.map((row) => {
      const amount = numericValue(row.amount_eur);
      return {
        label: labelize(row[key] || row.name || "-"),
        value: formatWholeCurrency(amount, "EUR"),
        detail: `${formatNumber(row.trades || 0)} trades · ${nativeCurrencySummary(row.native_amounts)}`,
        icon: insightIconFor(row[key] || row.name || "-", key === "provider_id" ? "provider" : "instrument"),
        share: percentOf(Math.abs(amount), total),
        action: "filter-trades",
        dataAttrs: dataKey ? `data-${kebabCase(dataKey)}="${safe(row[key] || row.name || "")}"` : "",
      };
    }),
    "No trade breakdown available.",
  );
}

function tradePerformanceBars(rows = [], key = "period") {
  const total = rows.reduce((sum, row) => sum + Math.abs(numericValue(row.pl_eur)), 0);
  return insightBars(
    rows.map((row) => {
      const pl = numericValue(row.pl_eur);
      const detail = key === "period"
        ? [
          `${signedPercent(row.return_pct || 0)} realized return`,
          `${formatNumber(row.trades || 0)} closed ${numericValue(row.trades) === 1 ? "trade" : "trades"}`,
          `${formatWholeCurrency(row.fees_eur || 0, "EUR")} fees`,
        ].join(" · ")
        : `${signedPercent(row.return_pct || 0)} return · ${formatWholeCurrency(row.market_value_eur || 0, "EUR")} market · ${formatWholeCurrency(row.fees_eur || 0, "EUR")} fees`;
      return {
        label: key === "period" ? performancePeriodLabel(row[key]) : row[key] || "-",
        value: signedWholeAmount(pl, "EUR"),
        detail,
        icon: pl >= 0 ? "trendUp" : "trendDown",
        share: percentOf(Math.abs(pl), total),
      };
    }),
    "No trade performance available.",
  );
}

function performancePeriodLabel(value) {
  const raw = String(value || "");
  if (/^\d{4}-\d{2}$/.test(raw)) return shortMonthLabel(raw);
  return raw || "-";
}

function tradePositionWatchlistBars(data = {}) {
  const tables = data?.insight_tables || {};
  const insights = data?.insights || data?.summary || {};
  const activeRows = (data?.rows || []).filter((row) => row.position_status === "active");
  const marketTotal = currencyRowsTotal(insights.market_value_by_currency)
    || activeRows.reduce((sum, row) => sum + Math.abs(numericValue(row.current_market_value_native)), 0);
  const attentionRows = tables.attention || [];
  const maxAttentionTrades = Math.max(1, ...attentionRows.map((row) => numericValue(row.trades)));
  const items = attentionRows.slice(0, 2).map((row) => ({
    label: row.name || "-",
    value: formatNumber(row.trades || 0),
    detail: row.note || "",
    icon: "target",
    share: percentOf(row.trades || 0, maxAttentionTrades),
    action: "filter-trades",
    dataAttrs: tradeAttentionDataAttrs(row.name || ""),
  }));

  const byMarketValue = [...activeRows].sort((a, b) => Math.abs(numericValue(b.current_market_value_native)) - Math.abs(numericValue(a.current_market_value_native)));
  const largestExposure = byMarketValue[0];
  if (largestExposure) {
    const value = Math.abs(numericValue(largestExposure.current_market_value_native));
    items.push({
      label: "Largest Exposure",
      value: formatWholeCurrency(value, largestExposure.trade_currency || "EUR"),
      detail: `${tradePositionLabel(largestExposure)} · ${formatPercent(percentOf(value, marketTotal))} of active market`,
      icon: "pie",
      share: percentOf(value, marketTotal),
      action: "filter-trades",
      dataAttrs: tradePositionFilterDataAttrs(largestExposure),
    });
  }

  const worstReturn = activeRows
    .filter((row) => Number.isFinite(numericValue(row.unrealized_pl_pct)))
    .sort((a, b) => numericValue(a.unrealized_pl_pct) - numericValue(b.unrealized_pl_pct))[0];
  if (worstReturn) {
    items.push({
      label: "Worst Active Return",
      value: signedPercent(worstReturn.unrealized_pl_pct || 0),
      detail: `${tradePositionLabel(worstReturn)} · ${signedWholeAmount(worstReturn.unrealized_pl_native || 0, worstReturn.trade_currency || "EUR")} unrealized`,
      icon: numericValue(worstReturn.unrealized_pl_pct) < 0 ? "trendDown" : "trendUp",
      share: Math.min(100, Math.abs(numericValue(worstReturn.unrealized_pl_pct))),
      action: "filter-trades",
      dataAttrs: tradePositionFilterDataAttrs(worstReturn),
    });
  }

  const bestReturn = activeRows
    .filter((row) => Number.isFinite(numericValue(row.unrealized_pl_pct)))
    .sort((a, b) => numericValue(b.unrealized_pl_pct) - numericValue(a.unrealized_pl_pct))[0];
  if (bestReturn && bestReturn !== worstReturn) {
    items.push({
      label: "Best Active Return",
      value: signedPercent(bestReturn.unrealized_pl_pct || 0),
      detail: `${tradePositionLabel(bestReturn)} · ${signedWholeAmount(bestReturn.unrealized_pl_native || 0, bestReturn.trade_currency || "EUR")} unrealized`,
      icon: numericValue(bestReturn.unrealized_pl_pct) >= 0 ? "trendUp" : "trendDown",
      share: Math.min(100, Math.abs(numericValue(bestReturn.unrealized_pl_pct))),
      action: "filter-trades",
      dataAttrs: tradePositionFilterDataAttrs(bestReturn),
    });
  }

  if (insights.latest_price_as_of || insights.oldest_price_as_of) {
    const stalePositions = numericValue(insights.stale_price_positions);
    const staleDays = numericValue(insights.stale_price_days, state.intelligenceThresholds.tradeStalePriceDays);
    items.push({
      label: "Price Freshness",
      value: stalePositions ? `${formatNumber(stalePositions)} stale` : "Fresh",
      detail: [
        insights.latest_price_as_of ? `Latest ${formatDisplayDate(insights.latest_price_as_of)}` : "",
        insights.oldest_price_as_of ? `oldest ${formatDisplayDate(insights.oldest_price_as_of)}` : "",
        `limit ${formatNumber(staleDays)} days`,
      ].filter(Boolean).join(" · "),
      icon: "calendar",
      share: stalePositions ? Math.max(8, 100 - stalePositions * 20) : 100,
      shareLabel: stalePositions ? "review" : "current",
      action: stalePositions ? "filter-trades" : "",
      dataAttrs: stalePositions ? 'data-quality-signal="stale_price" data-position-status="active"' : "",
    });
  }

  return insightBars(items.slice(0, 6), "No active position signals.");
}

function tradePositionLabel(row = {}) {
  return row.symbol || row.asset_name || row.trade_id || "Position";
}

function tradePositionFilterDataAttrs(row = {}) {
  const attrs = ['data-position-status="active"'];
  if (row.symbol) {
    attrs.push(`data-symbol="${safe(row.symbol)}"`);
  } else if (row.trade_id) {
    attrs.push(`data-trade-id="${safe(row.trade_id)}"`);
  }
  return attrs.join(" ");
}

function tradeAttentionBars(rows = []) {
  const maxTrades = Math.max(1, ...rows.map((row) => numericValue(row.trades)));
  return insightBars(
    rows.map((row) => ({
      label: row.name || "-",
      value: formatNumber(row.trades || 0),
      detail: row.note || "",
      icon: "target",
      share: percentOf(row.trades || 0, maxTrades),
      action: "filter-trades",
      dataAttrs: tradeAttentionDataAttrs(row.name || ""),
    })),
    "No trade attention signals.",
  );
}

function tradeAttentionDataAttrs(name) {
  const key = String(name || "").trim().toLowerCase();
  if (key === "needs review") return 'data-review-status="open"';
  if (key === "deleted") return 'data-ledger-status="deleted"';
  if (key === "missing price") return 'data-quality-signal="missing_price" data-position-status="active"';
  if (key === "missing market value") return 'data-quality-signal="missing_market_value" data-position-status="active"';
  if (key === "unrealized loss") return 'data-position-status="active"';
  if (key === "position size") return 'data-position-status="active"';
  if (key === "price stale") return 'data-position-status="active"';
  return "";
}

function nativeCurrencySummary(rows = []) {
  const visible = rows.filter((row) => numericValue(row.amount)).slice(0, 2);
  if (!visible.length) return "no native value";
  return visible.map((row) => formatWholeCurrency(row.amount, row.currency || "EUR")).join(" · ");
}

function nativeCurrencySummaryOrBlank(rows = []) {
  const summary = nativeCurrencySummary(rows || []);
  return summary === "no native value" ? "" : summary;
}

function tradeTableActions() {
  const selected = state.selectedTrades.size;
  const deletedTab = state.tradeFilters.ledger_status === "deleted";
  const refreshingPrices = Boolean(state.tradePriceRefresh?.loading);
  const selectionActions = selected ? `
    <span>${formatNumber(selected)} selected</span>
    <button class="table-action-button" data-action="clear-trade-selection" type="button">Clear</button>
    ${deletedTab ? `
      <button class="table-action-button" data-action="restore-selected-trades" type="button">
        <span data-icon="undo"></span>
        <span>Restore</span>
      </button>
      <button class="table-action-button is-danger" data-action="permanently-delete-selected-trades" type="button">
        <span data-icon="trash"></span>
        <span>Delete Forever</span>
      </button>
    ` : `
      <button class="table-action-button" data-action="duplicate-selected-trades" type="button">
        <span data-icon="copy"></span>
        <span>Duplicate</span>
      </button>
      <button class="table-action-button is-danger" data-action="delete-selected-trades" type="button">
        <span data-icon="trash"></span>
        <span>Delete</span>
      </button>
    `}
  ` : "";
  const addAction = deletedTab ? "" : `
    <button class="table-action-button" data-action="refresh-trade-prices" type="button" ${refreshingPrices ? "disabled" : ""}>
      <span data-icon="refresh"></span>
      <span>${refreshingPrices ? "Refreshing Prices" : "Refresh Prices"}</span>
    </button>
    <button class="table-action-button is-primary" data-action="add-trade" type="button">
      <span data-icon="plus"></span>
      <span>Add Trade</span>
    </button>
  `;
  if (!selectionActions && !addAction) return "";
  return `
    <div class="selection-inline" aria-live="polite">
      ${selectionActions}
      ${addAction}
    </div>
  `;
}

function tradeTable(rows, data) {
  const start = data && data.total ? data.offset + 1 : 0;
  const end = data ? Math.min(data.offset + data.limit, data.total) : 0;
  const canGoBack = data && data.offset > 0;
  const canGoForward = data && data.offset + data.limit < data.total;
  const columnCount = 13;
  const allVisibleSelected = rows.length > 0 && rows.every((row) => state.selectedTrades.has(row.trade_id));

  return `
    <section class="minimal-table-wrap transactions-table-wrap">
      <table class="minimal-table transactions-table trades-table">
        <thead>
          <tr>
            <th class="check-cell trade-check-cell"><input data-select-trade-page type="checkbox" ${allVisibleSelected ? "checked" : ""} aria-label="Select visible trades" /></th>
            <th class="trade-instrument-col">${tradeSortHeader("Symbol", "symbol")}</th>
            <th class="trade-asset-col">Asset</th>
            <th class="trade-provider-col">${tradeSortHeader("Provider", "provider")}</th>
            <th class="trade-type-col">Type</th>
            <th class="trade-quantity-col align-right">Qty</th>
            <th class="trade-date-col">${tradeSortHeader("Entry Date", "entry_date")}</th>
            <th class="trade-money-col align-right">Cost Basis / Entry</th>
            <th class="trade-date-col">${tradeSortHeader("Price As Of", "price_as_of")}</th>
            <th class="trade-money-col align-right">${tradeSortHeader("Market Value", "market_value")}</th>
            <th class="trade-money-col align-right">${tradeSortHeader("Realized P/L", "realized_pl")}</th>
            <th class="trade-money-col align-right">${tradeSortHeader("Unrealized P/L", "unrealized_pl")}</th>
            <th class="trade-return-col align-right">Return %</th>
          </tr>
        </thead>
        <tbody>
          ${rows.length ? rows.map((row) => `
            <tr class="clickable-row ${state.selectedTradeId === row.trade_id ? "is-selected" : ""}" data-action="open-trade" data-trade-id="${safe(row.trade_id)}" tabindex="0">
              <td class="check-cell trade-check-cell">
                <input
                  data-trade-select
                  type="checkbox"
                  value="${safe(row.trade_id)}"
                  ${state.selectedTrades.has(row.trade_id) ? "checked" : ""}
                  aria-label="Select ${safe(row.trade_id)}"
                />
              </td>
              <td class="trade-instrument-col">${tradeInstrumentCell(row)}</td>
	              <td class="trade-asset-col">
	                <span class="table-main">${quickFilterControl(row.asset_name || "-", row.asset_name || "-", { field: "asset_name" })}</span>
	                <span class="table-sub">${tradePortfolioReference(row)}</span>
	              </td>
              <td class="trade-provider-col">${quickFilterControl(row.provider_id, labelize(row.provider_id), { field: "provider_id" })}</td>
              <td class="trade-type-col">${quickFilterControl(row.instrument_type, labelize(row.instrument_type), { field: "instrument_type" })}</td>
              <td class="trade-quantity-col align-right">${formatQuantity(row.quantity)}</td>
              <td class="trade-date-col">
                <span class="table-main">${quickFilterControl(row.entry_date, formatDisplayDate(row.entry_date), { field: "entry_date" })}</span>
              </td>
              <td class="trade-money-col align-right">${tradeCostBasisCell(row)}</td>
              <td class="trade-date-col">
                <span class="table-main">${quickFilterControl(row.price_as_of || row.exit_date || row.entry_date, formatDisplayDate(row.price_as_of || row.exit_date || row.entry_date), { field: row.price_as_of ? "price_as_of" : row.exit_date ? "exit_date" : "entry_date" })}</span>
              </td>
              <td class="trade-money-col align-right">${formatTradeMoney(row.current_market_value_native, row.trade_currency)}</td>
              <td class="trade-money-col align-right ${signedClass(row.realized_pl_native)}">${tradePlCell(row.realized_pl_native, row.realized_pl_pct, row.trade_currency)}</td>
              <td class="trade-money-col align-right ${signedClass(row.unrealized_pl_native)}">${tradePlCell(row.unrealized_pl_native, row.unrealized_pl_pct, row.trade_currency)}</td>
              <td class="trade-return-col align-right ${signedClass(tradeReturnPct(row))}">${signedPercent(tradeReturnPct(row))}</td>
            </tr>
          `).join("") : emptyRow(columnCount)}
        </tbody>
      </table>
    </section>
    <footer class="table-footer">
      <span>${data ? `${formatNumber(start)}-${formatNumber(end)} of ${formatNumber(data.total)}` : "0 results"}</span>
      <div>
        ${pageSizeControl("trades")}
        <button class="small-button" data-action="previous-trade-page" type="button" ${canGoBack ? "" : "disabled"}>Previous</button>
        <button class="small-button" data-action="next-trade-page" type="button" ${canGoForward ? "" : "disabled"}>Next</button>
      </div>
    </footer>
  `;
}

function tradePortfolioReference(row = {}) {
  if (row.portfolio_id) {
    return quickFilterControl(row.portfolio_id, portfolioReferenceLabel(row.portfolio_id), { field: "portfolio_id" });
  }
  if (row.account_id) {
    return quickFilterControl(row.account_id, row.account_id, { field: "account_id" });
  }
  return "-";
}

function tradeInstrumentCell(row) {
  return `
    <span class="trade-symbol-cell">
      <span class="table-main">${quickFilterControl(row.symbol || row.trade_id, row.symbol || row.trade_id, { field: row.symbol ? "symbol" : "trade_id" })}</span>
      <span class="table-sub trade-subline">${quickFilterHtml(row.position_status, tradeStatusInline(row), { field: "position_status" })}<span>${safe(row.trade_id || "")}</span></span>
    </span>
  `;
}

function tradeCostBasisCell(row = {}) {
  const quantity = numericValue(row.quantity);
  const entryPrice = numericValue(row.entry_price);
  const costBasis = quantity * entryPrice;
  const detail = quantity && entryPrice
    ? `${formatNumber(quantity)} units @ ${formatTradePrice(entryPrice, row.trade_currency)}`
    : "entry price";
  return `
    <span class="table-main">${costBasis ? formatTradeMoney(costBasis, row.trade_currency) : "-"}</span>
    <span class="table-sub">${safe(detail)}</span>
  `;
}

function tradeReturnPct(row = {}) {
  const active = String(row.position_status || "").toLowerCase() === "active";
  const pct = active ? row.unrealized_pl_pct : row.realized_pl_pct;
  return numericValue(pct);
}

function instrumentMark(row) {
  const brand = instrumentBrand(row);
  return `<span class="instrument-mark ${safe(brand.className)}" aria-hidden="true">${safe(brand.label)}</span>`;
}

function instrumentBrand(row) {
  const text = `${row.asset_name || ""} ${row.symbol || ""}`.toLowerCase();
  const known = [
    ["vanguard", "V", "brand-vanguard"],
    ["ishares", "iS", "brand-ishares"],
    ["blackrock", "BLK", "brand-ishares"],
    ["vaneck", "VE", "brand-vaneck"],
    ["xtrackers", "X", "brand-xtrackers"],
    ["wisdomtree", "WT", "brand-wisdomtree"],
    ["global x", "GX", "brand-globalx"],
    ["amundi", "A", "brand-amundi"],
    ["invesco", "IV", "brand-invesco"],
  ];
  const match = known.find(([needle]) => text.includes(needle));
  if (match) return { label: match[1], className: match[2] };
  const symbol = String(row.symbol || row.trade_id || "?").replace(/[^a-z0-9]/gi, "").toUpperCase();
  return { label: symbol.slice(0, 2) || "TR", className: "brand-standard" };
}

function tradeStatusInline(row) {
  const isDeleted = row.ledger_status === "deleted";
  const status = isDeleted ? "deleted" : String(row.position_status || "").trim().toLowerCase();
  return `
    <span class="status-inline ${safe(status)}">
      <span class="status-dot ${safe(status)}" aria-hidden="true"></span>
      <span>${safe(labelize(status || "unknown"))}</span>
    </span>
  `;
}

function transactionTableActions() {
  const selected = state.selectedTransactions.size;
  const deletedTab = state.transactionFilters.transaction_class === DELETED_TRANSACTION_TAB;
  const selectionActions = selected ? `
    <span>${formatNumber(selected)} selected</span>
    <button class="table-action-button" data-action="clear-selection" type="button">Clear</button>
    ${deletedTab ? `
      <button class="table-action-button" data-action="restore-selected-transactions" type="button">
        <span data-icon="undo"></span>
        <span>Restore</span>
      </button>
      <button class="table-action-button is-danger" data-action="permanently-delete-selected-transactions" type="button">
        <span data-icon="trash"></span>
        <span>Delete Forever</span>
      </button>
    ` : `
      <button class="table-action-button" data-action="duplicate-selected-transactions" type="button">
        <span data-icon="copy"></span>
        <span>Duplicate</span>
      </button>
      <button class="table-action-button is-danger" data-action="delete-selected-transactions" type="button">
        <span data-icon="trash"></span>
        <span>Delete</span>
      </button>
    `}
  ` : "";
  const addAction = deletedTab ? "" : `
    <button class="table-action-button is-primary" data-action="add-transaction" type="button">
      <span data-icon="plus"></span>
      <span>Add Transaction</span>
    </button>
  `;
  if (!selectionActions && !addAction) return "";
  return `
    <div class="selection-inline" aria-live="polite">
      ${selectionActions}
      ${addAction}
    </div>
  `;
}

function transactionTable(rows, data) {
  const start = data && data.total ? data.offset + 1 : 0;
  const end = data ? Math.min(data.offset + data.limit, data.total) : 0;
  const canGoBack = data && data.offset > 0;
  const canGoForward = data && data.offset + data.limit < data.total;
  const allVisibleSelected = rows.length > 0 && rows.every((row) => state.selectedTransactions.has(row.transaction_id));

  return `
    <section class="minimal-table-wrap transactions-table-wrap">
      <table class="minimal-table transactions-table">
        <thead>
          <tr>
            <th class="check-cell"><input data-select-page type="checkbox" ${allVisibleSelected ? "checked" : ""} aria-label="Select visible transactions" /></th>
            <th class="statement-cell">Source</th>
            <th>${sortHeader("Date", "transaction_date")}</th>
            <th>Description</th>
            <th>${sortHeader("Category", "category")}</th>
            <th>${sortHeader("Account", "account")}</th>
            <th>Country</th>
            <th>Currency</th>
            <th class="align-right">${sortHeader("Project Amount", "amount")}</th>
            <th class="align-right">${sortHeader("Statement Amount", "native_amount")}</th>
          </tr>
        </thead>
        <tbody>
          ${rows.length ? rows.map((row) => {
            const primaryDate = transactionPrimaryDate(row);
            const postedDateSubline = transactionPostedDateSubline(row);
            return `
              <tr class="clickable-row ${state.selectedTransactionId === row.transaction_id ? "is-selected" : ""}" data-action="open-transaction" data-transaction-id="${safe(row.transaction_id)}" tabindex="0">
              <td class="check-cell">
                <input
                  data-transaction-select
                  type="checkbox"
                  value="${safe(row.transaction_id)}"
                  ${state.selectedTransactions.has(row.transaction_id) ? "checked" : ""}
                  aria-label="Select ${safe(row.transaction_id)}"
                />
              </td>
              <td class="statement-cell">${statementCell(row)}</td>
              <td>
                <span class="table-main">${transactionDateFilterControl(primaryDate)}</span>
                ${postedDateSubline ? `<span class="table-sub">${safe(postedDateSubline)}</span>` : ""}
              </td>
              <td>${transactionDescriptionCell(row)}</td>
              <td>${categoryCell(row)}</td>
              <td>${quickFilterControl(row.source_system, labelize(row.source_system), { field: "source_system" })}</td>
              <td>${quickFilterHtml(row.country_code, countryCell(row.country_code), { field: "country_code" })}</td>
              <td>${quickFilterHtml(row.statement_currency, currencyCell(row.statement_currency), { field: "statement_currency" })}</td>
              <td class="align-right ${amountClass(row)}">${signedCurrency(row)}</td>
              <td class="align-right ${amountClass(row)}">${signedNativeCurrency(row)}</td>
            </tr>
            `;
          }).join("") : emptyRow(10)}
        </tbody>
      </table>
    </section>
    <footer class="table-footer">
      <span>${data ? `${formatNumber(start)}-${formatNumber(end)} of ${formatNumber(data.total)}` : "0 results"}</span>
      <div>
        ${pageSizeControl("transactions")}
        <button class="small-button" data-action="previous-page" type="button" ${canGoBack ? "" : "disabled"}>Previous</button>
        <button class="small-button" data-action="next-page" type="button" ${canGoForward ? "" : "disabled"}>Next</button>
      </div>
    </footer>
  `;
}

function pageSizeControl(view) {
  const current = view === "transactions"
    ? transactionLimit()
    : view === "accounts"
      ? accountLimit()
      : tradeLimit();
  return `
    <label class="page-size-control">
      <span>Rows</span>
      <select data-table-page-size="${safe(view)}" aria-label="${safe(labelize(view))} rows per page">
        ${PAGE_SIZE_OPTIONS.map((size) => `
          <option value="${safe(size)}" ${current === size ? "selected" : ""}>${size === "all" ? "All" : size}</option>
        `).join("")}
      </select>
    </label>
  `;
}

function transactionPrimaryDate(row = {}) {
  const transactionDate = String(row.transaction_date || "").trim();
  const postedDate = String(row.posted_date || "").trim();
  return transactionDate || postedDate;
}

function transactionDateFilterControl(value) {
  const raw = String(value || "").trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
    return quickFilterControl(raw, formatDisplayDate(raw), { field: "transaction_date" });
  }
  const date = new Date(`${raw}T00:00:00`);
  if (Number.isNaN(date.getTime())) {
    return quickFilterControl(raw, formatDisplayDate(raw), { field: "transaction_date" });
  }
  const monthKey = raw.slice(0, 7);
  const year = raw.slice(0, 4);
  const month = date.toLocaleDateString("en-US", { month: "short" });
  const day = String(date.getDate());
  const fullDate = formatDisplayDate(raw);
  const monthRangeLabel = monthLabel(monthKey);
  return `
    <span class="split-date-filter" aria-label="${safe(fullDate)}">
      <button
        class="table-link date-part"
        data-action="quick-filter"
        data-filter-field="transaction_month"
        data-filter-label="${safe(monthRangeLabel)}"
        data-filter-value="${safe(monthKey)}"
        type="button"
        ${tooltipAttrs(`Filter month ${monthRangeLabel}`)}
      >${safe(month)}</button>
      <button
        class="table-link date-part"
        data-action="quick-filter"
        data-filter-field="transaction_date"
        data-filter-label="${safe(fullDate)}"
        data-filter-value="${safe(raw)}"
        type="button"
        ${tooltipAttrs(`Filter date ${fullDate}`)}
      >${safe(day)}</button><span class="date-comma">,</span>
      <button
        class="table-link date-part"
        data-action="quick-filter"
        data-filter-field="transaction_year"
        data-filter-label="${safe(year)}"
        data-filter-value="${safe(year)}"
        type="button"
        ${tooltipAttrs(`Filter year ${year}`)}
      >${safe(year)}</button>
    </span>
  `;
}

function transactionPostedDateSubline(row = {}) {
  const postedDate = String(row.posted_date || "").trim();
  if (!postedDate || postedDate === transactionPrimaryDate(row)) return "";
  return `posted ${formatDisplayDate(postedDate)}`;
}

function transactionDescriptionCell(row = {}) {
  const id = String(row.transaction_id || "").trim();
  const primary = String(row.memo || "").trim() || String(row.counterparty_name || "").trim() || id;
  const secondary = [row.counterparty_name, id]
    .map((value) => String(value || "").trim())
    .find((value) => value && value !== primary);
  return `
    <span class="table-main">${quickFilterControl(primary, primary, { field: primary === id ? "transaction_id" : "" })}</span>
    ${secondary ? `<span class="table-sub">${quickFilterControl(secondary, secondary, { field: secondary === id ? "transaction_id" : "" })}</span>` : ""}
  `;
}

function statementCell(row) {
  if (!row.has_statement) return `<span class="statement-placeholder" aria-hidden="true"></span>`;
  return `
    <button
      class="statement-button"
      data-action="show-statement"
      data-transaction-id="${safe(row.transaction_id)}"
      type="button"
      ${tooltipAttrs(`Show imported statement for ${row.transaction_id}`)}
    >
      <span data-icon="fileText"></span>
    </button>
  `;
}

function sortHeader(label, field) {
  const active = state.transactionSort.field === field;
  const direction = active ? state.transactionSort.direction : "";
  return `
    <button class="sort-button ${active ? "is-active" : ""}" data-action="sort-transactions" data-sort="${safe(field)}" type="button" aria-label="Sort transactions by ${safe(label)}">
      <span>${safe(label)}</span>
      ${sortIndicator(active, direction)}
    </button>
  `;
}

function accountSortHeader(label, field) {
  const active = state.accountSort.field === field;
  const direction = active ? state.accountSort.direction : "";
  return `
    <button class="sort-button ${active ? "is-active" : ""}" data-action="sort-accounts" data-sort="${safe(field)}" type="button" aria-label="Sort accounts by ${safe(label)}">
      <span>${safe(label)}</span>
      ${sortIndicator(active, direction)}
    </button>
  `;
}

function tradeSortHeader(label, field) {
  const active = state.tradeSort.field === field;
  const direction = active ? state.tradeSort.direction : "";
  return `
    <button class="sort-button ${active ? "is-active" : ""}" data-action="sort-trades" data-sort="${safe(field)}" type="button" aria-label="Sort trades by ${safe(label)}">
      <span>${safe(label)}</span>
      ${sortIndicator(active, direction)}
    </button>
  `;
}

function monthlyTargetSortHeader(label, field) {
  const active = state.monthlyTargetSort.field === field;
  const direction = active ? state.monthlyTargetSort.direction : "";
  return `
    <button class="sort-button ${active ? "is-active" : ""}" data-action="sort-monthly-targets" data-sort="${safe(field)}" type="button" aria-label="Sort monthly targets by ${safe(label)}">
      <span>${safe(label)}</span>
      ${sortIndicator(active, direction)}
    </button>
  `;
}

function sortIndicator(active, direction) {
  return `<span class="sort-indicator" aria-hidden="true">${active ? (direction === "asc" ? "↑" : "↓") : "↕"}</span>`;
}

function accountDetailsPanel(rows = []) {
  if (!state.selectedAccountId) return "";
  const row = rows.find((item) => item.account_id === state.selectedAccountId);
  if (!row) return "";
  const isEditing = state.selectedAccountEditing;
  return detailPanel(
    isEditing ? "Edit Account" : "Account Details",
    row.account_reference || row.account_id,
    isEditing ? accountEditForm(row) : `
      <dl>
        ${detailItem("Account ID", row.account_id)}
        ${detailItemHtml("Status", accountStatusInline(row))}
        ${detailItem("Provider", row.provider_id)}
        ${detailItem("Reference", row.account_reference)}
        ${detailItem("Capital Bucket", labelize(row.capital_bucket))}
        ${detailItem("Type", labelize(row.account_type))}
        ${detailItemHtml("Currency", currencyCell(row.account_currency))}
        ${detailItem("Native Balance", formatAccountMoney(row.balance_native, row.account_currency, { project: false }))}
        ${detailItem("Project Value", formatAccountMoney(row.amount_eur_converted, "EUR"))}
        ${detailItem("USD Value", formatAccountMoney(row.amount_usd_converted, "USD", { project: false }))}
        ${detailItem("Credit Limit", formatAccountMoney(row.credit_limit_native, row.account_currency, { project: false }))}
        ${detailItem("Available Credit", formatAccountMoney(row.available_credit_native, row.account_currency, { project: false }))}
        ${detailItem("Ledger Status", labelize(row.ledger_status))}
        ${detailItem("Review", labelize(row.review_status))}
        ${detailItem("Notes", row.notes)}
      </dl>
      ${state.accountActionError ? `<p class="drawer-error">${safe(state.accountActionError)}</p>` : ""}
    `,
    "close-account",
    "Account details",
    accountDetailActions(row, isEditing),
  );
}

function tradeDetailsPanel(rows = []) {
  if (!state.selectedTradeId) return "";
  const row = rows.find((item) => item.trade_id === state.selectedTradeId);
  if (!row) return "";
  const isEditing = state.selectedTradeEditing;
  return detailPanel(
    isEditing ? "Edit Trade" : "Trade Details",
    row.symbol || row.trade_id,
    isEditing ? tradeEditForm(row) : `
      <dl>
        ${detailItem("Trade ID", row.trade_id)}
        ${detailItemHtml("Status", tradeStatusInline(row))}
        ${detailItem("Provider", labelize(row.provider_id))}
        ${detailItem("Portfolio", portfolioReferenceLabel(row.portfolio_id))}
        ${detailItem("Account", row.account_id)}
        ${detailItem("Symbol", row.symbol)}
        ${detailItem("Asset", row.asset_name)}
        ${detailItem("Instrument", labelize(row.instrument_type))}
        ${detailItemHtml("Currency", currencyCell(row.trade_currency))}
        ${detailItem("Quantity", formatQuantity(row.quantity))}
        ${detailItem("Entry Date", formatDisplayDate(row.entry_date))}
        ${detailItem("Entry Price", formatTradePrice(row.entry_price, row.trade_currency))}
        ${detailItem("Exit Date", formatDisplayDate(row.exit_date))}
        ${detailItem("Exit Price", formatTradePrice(row.exit_price, row.trade_currency))}
        ${detailItem("Current Price", formatTradePrice(row.current_price, row.trade_currency))}
        ${detailItem("Price As Of", formatDisplayDate(row.price_as_of))}
        ${detailItem("Market Value", formatTradeMoney(row.current_market_value_native, row.trade_currency))}
        ${detailItem("Realized P/L", tradePlLabel(row.realized_pl_native, row.realized_pl_pct, row.trade_currency))}
        ${detailItem("Unrealized P/L", tradePlLabel(row.unrealized_pl_native, row.unrealized_pl_pct, row.trade_currency))}
        ${detailItem("Fees", formatTradeMoney(row.fees_native, row.trade_currency))}
        ${detailItem("Ledger Status", labelize(row.ledger_status))}
        ${detailItem("Review", labelize(row.review_status))}
        ${detailItem("Notes", row.notes)}
      </dl>
      ${state.tradeActionError ? `<p class="drawer-error">${safe(state.tradeActionError)}</p>` : ""}
    `,
    "close-trade",
    "Trade details",
    tradeDetailActions(row, isEditing),
  );
}

function transactionDetailsPanel(rows = []) {
  if (!state.selectedTransactionId) return "";
  const row = rows.find((item) => item.transaction_id === state.selectedTransactionId);
  if (!row) return "";
  const isEditing = state.selectedTransactionEditing;
  const primaryDate = transactionPrimaryDate(row);
  const postedDate = String(row.posted_date || "").trim();
  const hasDifferentPostedDate = postedDate && postedDate !== primaryDate;
  return detailPanel(
    isEditing ? "Edit Transaction" : "Transaction Details",
    row.memo || row.transaction_id,
    isEditing ? transactionEditForm(row) : `
      <input data-statement-attachment-input type="file" multiple hidden aria-hidden="true" />
      <dl>
        ${detailItem("Transaction ID", row.transaction_id)}
        ${detailItem(row.transaction_date ? "Transaction Date" : "Date", formatDisplayDate(primaryDate))}
        ${hasDifferentPostedDate ? detailItem("Posted", formatDisplayDate(postedDate)) : ""}
        ${detailItem("Class", taxonomyLabel(row.transaction_class))}
        ${detailItem("Category", taxonomyLabel(row.category_id))}
        ${detailItem("Subcategory", taxonomyLabel(row.subcategory_id))}
        ${detailItem("Account", labelize(row.source_system))}
        ${detailItem("Counterparty", row.counterparty_name)}
        ${detailItemHtml("Country", countryCell(row.country_code))}
        ${detailItemHtml("Currency", currencyCell(row.statement_currency))}
        ${detailItem("Native Amount", signedNativeCurrency(row))}
        ${detailItem("Project Amount", signedCurrency(row))}
        ${detailItem("Ledger Status", labelize(row.ledger_status))}
        ${detailItem("Review", labelize(row.review_status))}
      </dl>
      ${state.transactionActionError ? `<p class="drawer-error">${safe(state.transactionActionError)}</p>` : ""}
    `,
    "close-transaction",
    "Transaction details",
    transactionDetailActions(row, isEditing),
  );
}

function transactionStatementPanel() {
  if (!state.statement.transactionId) return "";
  const data = state.statement.data || {};
  const title = state.statement.loading ? "Loading statement" : state.statement.error ? "Statement unavailable" : "Imported Statement";
  const heading = data.memo || data.file_name || state.statement.transactionId;
  return detailPanel(
    title,
    heading,
    statementPanelBody(data),
    "close-statement",
    "Imported statement",
  );
}

function statementPanelBody(data) {
  if (state.statement.loading) {
    return `<div class="drawer-loading"><div class="loader"></div><strong>Loading source statement</strong></div>`;
  }
  if (state.statement.error) {
    return `<p class="drawer-error">${safe(state.statement.error)}</p>`;
  }
  const preview = data.preview || {};
  return `
    <dl>
      ${detailItem("Transaction ID", data.transaction_id)}
      ${detailItem("Source", labelize(data.source))}
      ${detailItem("Type", labelize(data.source_type))}
      ${detailItem("Statement Date", data.statement_date)}
      ${detailItem("Occurred At", data.occurred_at)}
      ${detailItemHtml("Native Amount", statementNativeAmount(data.currency, data.amount))}
      ${statementFileDetailItem((data.attachments || []).length > 1 ? "Files" : "File", data)}
    </dl>
    ${statementPreview(preview, data)}
  `;
}

function statementFileDetailItem(label, data = {}) {
  return `
    <div>
      <dt>${safe(label)}</dt>
      <dd>${statementFileDetail(data)}</dd>
    </div>
  `;
}

function statementFileDetail(data = {}) {
  const attachments = Array.isArray(data.attachments) && data.attachments.length
    ? data.attachments
    : [data];
  return `
    <span class="statement-file-list">
      ${attachments.map((attachment) => {
        const fileName = attachment.file_name || "-";
        return `
          <span class="statement-file-detail">
            <span>${safe(fileName)}</span>
            ${attachment.file_url ? `
              <a class="icon-button statement-open-button" href="${safe(attachment.file_url)}" target="_blank" rel="noopener" ${tooltipAttrs("Open source in browser")}>
                <span data-icon="externalLink"></span>
              </a>
            ` : ""}
          </span>
        `;
      }).join("")}
    </span>
  `;
}

function statementPreview(preview, data) {
  const body = preview.body || "";
  if (body) {
    return `
      <section class="statement-preview-section">
        <span class="section-kicker">Preview</span>
        ${preview.subject ? `<strong>${safe(preview.subject)}</strong>` : ""}
        ${preview.from || preview.date ? `<p>${safe([preview.from, preview.date].filter(Boolean).join(" · "))}</p>` : ""}
        <pre class="statement-preview">${safe(body)}</pre>
      </section>
    `;
  }
  if (String(data.content_type || "").includes("pdf") && data.file_url) {
    return `<iframe class="statement-frame" src="${safe(data.file_url)}" title="Imported statement source"></iframe>`;
  }
  return `<p class="drawer-note">Preview is not available for this file type. Open the source file to inspect it.</p>`;
}

function iconActionButton(action, icon, label, options = {}) {
  const className = options.className ? ` ${options.className}` : "";
  const accountId = options.accountId ? ` data-account-id="${safe(options.accountId)}"` : "";
  const transactionId = options.transactionId ? ` data-transaction-id="${safe(options.transactionId)}"` : "";
  const tradeId = options.tradeId ? ` data-trade-id="${safe(options.tradeId)}"` : "";
  const portfolioInstrumentIdValue = options.portfolioInstrumentId ? ` data-portfolio-instrument-id="${safe(options.portfolioInstrumentId)}"` : "";
  const portfolioMipIdValue = options.portfolioMipId ? ` data-portfolio-mip-id="${safe(options.portfolioMipId)}"` : "";
  const exitPhaseIdValue = options.exitPhaseId ? ` data-exit-phase-id="${safe(options.exitPhaseId)}"` : "";
  return `
    <button class="icon-button${className}" data-action="${safe(action)}"${accountId}${transactionId}${tradeId}${portfolioInstrumentIdValue}${portfolioMipIdValue}${exitPhaseIdValue} type="button" ${tooltipAttrs(label)}>
      <span data-icon="${safe(icon)}"></span>
    </button>
  `;
}

function tooltipAttrs(label) {
  const text = safe(label);
  return `aria-label="${text}" data-tooltip="${text}"`;
}

function transactionDetailActions(row, isEditing) {
  const isDeleted = row.ledger_status === "deleted";
  if (isDeleted) {
    return `
      ${iconActionButton("restore-transaction", "undo", "Restore transaction", { transactionId: row.transaction_id })}
      ${iconActionButton("permanently-delete-transaction", "trash", "Delete transaction forever", { transactionId: row.transaction_id, className: "is-danger" })}
    `;
  }
  return `
    ${isEditing ? "" : `
      ${iconActionButton("duplicate-transaction", "copy", "Duplicate transaction", { transactionId: row.transaction_id })}
      ${row.has_statement ? `
        ${iconActionButton("show-statement", "fileText", "View statement attachments", { transactionId: row.transaction_id })}
      ` : ""}
      ${iconActionButton("attach-statement", "paperclip", "Add statement attachment", { transactionId: row.transaction_id })}
      ${iconActionButton("edit-transaction", "edit", "Edit transaction")}
    `}
    ${iconActionButton("delete-transaction", "trash", "Delete transaction", { transactionId: row.transaction_id, className: "is-danger" })}
  `;
}

function accountDetailActions(row, isEditing) {
  const isDeleted = row.ledger_status === "deleted";
  if (isDeleted) {
    return `
      ${iconActionButton("restore-account", "undo", "Restore account", { accountId: row.account_id })}
      ${iconActionButton("permanently-delete-account", "trash", "Delete account forever", { accountId: row.account_id, className: "is-danger" })}
    `;
  }
  return `
    ${isEditing ? "" : `
      ${iconActionButton("duplicate-account", "copy", "Duplicate account", { accountId: row.account_id })}
      ${iconActionButton("edit-account", "edit", "Edit account")}
    `}
    ${iconActionButton("delete-account", "trash", "Delete account", { accountId: row.account_id, className: "is-danger" })}
  `;
}

function tradeDetailActions(row, isEditing) {
  const isDeleted = row.ledger_status === "deleted";
  if (isDeleted) {
    return `
      ${iconActionButton("restore-trade", "undo", "Restore trade", { tradeId: row.trade_id })}
      ${iconActionButton("permanently-delete-trade", "trash", "Delete trade forever", { tradeId: row.trade_id, className: "is-danger" })}
    `;
  }
  return `
    ${isEditing ? "" : `
      ${iconActionButton("duplicate-trade", "copy", "Duplicate trade", { tradeId: row.trade_id })}
      ${iconActionButton("edit-trade", "edit", "Edit trade")}
    `}
    ${iconActionButton("delete-trade", "trash", "Delete trade", { tradeId: row.trade_id, className: "is-danger" })}
  `;
}

function accountEditForm(row) {
  return `
    <form class="drawer-form account-edit-form" data-account-edit-form data-account-id="${safe(row.account_id)}">
      ${accountFields.map(([key, label]) => accountFieldInput(key, label, row)).join("")}
      ${state.accountActionError ? `<p class="drawer-error">${safe(state.accountActionError)}</p>` : ""}
      <div class="drawer-actions">
        <button class="small-button drawer-secondary-action" data-action="cancel-account-edit" type="button">
          <span data-icon="x"></span>
          <span>Cancel</span>
        </button>
        <button class="small-button primary-button drawer-save-button" type="submit">
          <span data-icon="check"></span>
          <span>Save Changes</span>
        </button>
      </div>
    </form>
  `;
}

function accountFieldInput(key, label, row) {
  const value = row[key];
  const comboOptions = accountComboOptions(key);
  const selectOptions = accountSelectOptions(key);
  const className = accountWideFields().has(key) ? " class=\"field-wide\"" : "";
  if (comboOptions) {
    const listId = `account-${safe(row.account_id)}-${safe(key)}-options`;
    return `
      <label${className}>
        <span>${safe(label)}</span>
        <input name="${safe(key)}" type="text" value="${safe(value ?? "")}" list="${listId}" autocomplete="off" />
        <datalist id="${listId}">
          ${datalistOptionsHtml(comboOptions, key)}
        </datalist>
      </label>
    `;
  }
  if (selectOptions) {
    return `
      <label${className}>
        <span>${safe(label)}</span>
        <select name="${safe(key)}" autocomplete="off">
          ${selectOptionsHtml(selectOptions, value, key)}
        </select>
      </label>
    `;
  }

  const type = accountNumericFields().has(key) ? "number" : "text";
  const step = type === "number" ? " step=\"any\"" : "";
  return `
    <label${className}>
      <span>${safe(label)}</span>
      <input name="${safe(key)}" type="${type}"${step} value="${safe(value ?? "")}" autocomplete="off" />
    </label>
  `;
}

function accountComboOptions(key) {
  const options = state.accounts?.edit_options || state.accounts?.filters || {};
  const optionsByField = {
    provider_id: options.provider_ids || [],
    capital_bucket: options.capital_buckets || [],
    account_type: options.account_types || [],
  };
  return optionsByField[key] || null;
}

function accountSelectOptions(key) {
  const options = state.accounts?.edit_options || state.accounts?.filters || {};
  const optionsByField = {
    account_status: withDefaultOptions(options.account_statuses, ["active", "inactive"]),
    account_currency: withDefaultOptions(options.account_currencies, ["EUR", "USD", "AED", "RON"]),
    ledger_status: withDefaultOptions(options.ledger_statuses, ["accountable", "not_accountable", "deleted"]),
    review_status: withDefaultOptions(options.review_statuses, ["review_required", "review_done"]),
  };
  return optionsByField[key] || null;
}

function withDefaultOptions(options = [], defaults = []) {
  return Array.from(new Set([...(options || []), ...defaults].filter(Boolean)));
}

function optionValues(options = []) {
  return (options || []).map((option) => optionValue(option)).filter(Boolean);
}

function preferredOptionValue(options = [], preferred = "", fallback = "") {
  const values = optionValues(options);
  return values.includes(preferred) ? preferred : values[0] || fallback;
}

function accountNumericFields() {
  return new Set([
    "balance_native",
    "credit_limit_native",
    "available_credit_native",
  ]);
}

function accountWideFields() {
  return new Set([
    "account_id",
    "account_reference",
    "notes",
  ]);
}

function tradeEditForm(row) {
  return `
    <form class="drawer-form trade-edit-form" data-trade-edit-form data-trade-id="${safe(row.trade_id)}">
      ${tradeFields.map(([key, label]) => tradeFieldInput(key, label, row)).join("")}
      ${state.tradeActionError ? `<p class="drawer-error">${safe(state.tradeActionError)}</p>` : ""}
      <div class="drawer-actions">
        <button class="small-button drawer-secondary-action" data-action="cancel-trade-edit" type="button">
          <span data-icon="x"></span>
          <span>Cancel</span>
        </button>
        <button class="small-button primary-button drawer-save-button" type="submit">
          <span data-icon="check"></span>
          <span>Save Changes</span>
        </button>
      </div>
    </form>
  `;
}

function tradeFieldInput(key, label, row) {
  const value = row[key];
  const comboOptions = tradeComboOptions(key);
  const selectOptions = tradeSelectOptions(key);
  const className = tradeWideFields().has(key) ? " class=\"field-wide\"" : "";
  if (comboOptions) {
    const listId = `trade-${safe(row.trade_id)}-${safe(key)}-options`;
    return `
      <label${className}>
        <span>${safe(label)}</span>
        <input name="${safe(key)}" type="text" value="${safe(value ?? "")}" list="${listId}" autocomplete="off" />
        <datalist id="${listId}">
          ${datalistOptionsHtml(comboOptions, key)}
        </datalist>
      </label>
    `;
  }
  if (selectOptions) {
    return `
      <label${className}>
        <span>${safe(label)}</span>
        <select name="${safe(key)}" autocomplete="off">
          ${selectOptionsHtml(selectOptions, value, key)}
        </select>
      </label>
    `;
  }

  const type = key.endsWith("_date") || key === "price_as_of" ? "date" : tradeNumericFields().has(key) ? "number" : "text";
  const step = type === "number" ? " step=\"any\"" : "";
  return `
    <label${className}>
      <span>${safe(label)}</span>
      <input name="${safe(key)}" type="${type}"${step} value="${safe(value ?? "")}" autocomplete="off" />
    </label>
  `;
}

function tradeComboOptions(key) {
  const options = state.trades?.edit_options || state.trades?.filters || {};
  const optionsByField = {
    provider_id: options.provider_ids || [],
  };
  return optionsByField[key] || null;
}

function tradeSelectOptions(key) {
  const options = state.trades?.edit_options || state.trades?.filters || {};
  const optionsByField = {
    instrument_type: options.instrument_types || [],
    trade_currency: options.trade_currencies || [],
    ledger_status: withDefaultOptions(options.ledger_statuses, ["accountable", "not_accountable", "deleted"]),
    review_status: withDefaultOptions(options.review_statuses, ["review_required", "review_done"]),
  };
  return optionsByField[key] || null;
}

function tradeNumericFields() {
  return new Set([
    "quantity",
    "entry_price",
    "exit_price",
    "current_price",
    "fees_native",
  ]);
}

function tradeWideFields() {
  return new Set([
    "trade_id",
    "asset_name",
    "notes",
  ]);
}

function transactionEditForm(row) {
  return `
    <form class="drawer-form transaction-edit-form" data-transaction-edit-form data-transaction-id="${safe(row.transaction_id)}">
      ${transactionFields.map(([key, label]) => transactionFieldInput(key, label, row)).join("")}
      ${state.transactionActionError ? `<p class="drawer-error">${safe(state.transactionActionError)}</p>` : ""}
      <div class="drawer-actions">
        <button class="small-button drawer-secondary-action" data-action="cancel-transaction-edit" type="button">
          <span data-icon="x"></span>
          <span>Cancel</span>
        </button>
        <button class="small-button primary-button drawer-save-button" type="submit">
          <span data-icon="check"></span>
          <span>Save Changes</span>
        </button>
      </div>
    </form>
  `;
}

function transactionFieldInput(key, label, row) {
  const value = row[key];
  const comboOptions = transactionComboOptions(key, row);
  const className = transactionWideFields().has(key) ? " class=\"field-wide\"" : "";
  if (comboOptions) {
    const listId = `transaction-${safe(row.transaction_id)}-${safe(key)}-options`;
    const inputValue = comboInputValue(value, key);
    return `
      <label${className}>
        <span>${safe(label)}</span>
        <input
          name="${safe(key)}"
          type="text"
          value="${safe(inputValue)}"
          list="${listId}"
          data-transaction-combo
          ${transactionSelectDataAttribute(key)}
          autocomplete="off"
        />
        <datalist id="${listId}">
          ${datalistOptionsHtml(comboOptions, key)}
        </datalist>
      </label>
    `;
  }
  const selectOptions = transactionSelectOptions(key, row);
  if (selectOptions) {
    return `
      <label${className}>
        <span>${safe(label)}</span>
        <select name="${safe(key)}"${transactionSelectDataAttribute(key)} autocomplete="off">
          ${selectOptionsHtml(selectOptions, value, key)}
        </select>
      </label>
    `;
  }

  const type = key.endsWith("_date") ? "date" : transactionNumericFields().has(key) ? "number" : "text";
  const step = type === "number" ? " step=\"any\"" : "";
  const isDerivedFx = transactionDerivedFxFields().has(key);
  const isSanitizedAmount = key === "sanitized_statement_amount";
  const isReadonlyFx = isDerivedFx && !isMainCurrency(row.statement_currency);
  const readonly = isReadonlyFx || isSanitizedAmount ? " readonly disabled" : "";
  const readonlyClass = isReadonlyFx || isSanitizedAmount ? " is-readonly" : "";
  const readonlyTitle = isReadonlyFx || isSanitizedAmount
    ? ` title="${safe(isSanitizedAmount ? "Sanitized amount is calculated from the statement amount." : "Converted amounts are recalculated from native amount, date, and currency.")}"`
    : "";
  const fxAttribute = isDerivedFx ? " data-fx-derived-field" : "";
  const sanitizedAttribute = isSanitizedAmount ? " data-sanitized-amount-field" : "";
  return `
    <label${className}>
      <span>${safe(label)}</span>
      <input name="${safe(key)}" type="${type}"${step} value="${safe(value ?? "")}" autocomplete="off"${readonly}${readonlyTitle}${fxAttribute}${sanitizedAttribute} class="${readonlyClass.trim()}" />
    </label>
  `;
}

function transactionComboOptions(key, row = {}) {
  const options = state.transactions?.edit_options || state.transactions?.filters || {};
  if (key === "source_system") return options.source_systems || [];
  if (key === "transaction_class") return options.transaction_classes || [];
  if (key === "transfer_scope") return options.transfer_scopes || [];
  if (key === "category_id") return categoryOptionsForSubcategory(row.subcategory_id);
  if (key === "subcategory_id") return subcategoryOptionsForCategory(row.category_id);
  if (key === "country_code") return countryOptions();
  return null;
}

function transactionSelectOptions(key, row = {}) {
  const options = state.transactions?.edit_options || state.transactions?.filters || {};
  const optionsByField = {
    ledger_status: withDefaultOptions(options.ledger_statuses, ["accountable", "not_accountable", "deleted"]),
    statement_currency: options.currencies || [],
    imported_transaction: options.imported_values || [],
    review_status: withDefaultOptions(options.review_statuses, ["review_required", "review_done"]),
  };
  return optionsByField[key] || null;
}

function transactionSelectDataAttribute(key) {
  if (key === "category_id") return " data-category-select";
  if (key === "subcategory_id") return " data-subcategory-select";
  if (key === "statement_currency") return " data-statement-currency-select";
  return "";
}

function selectOptionsHtml(options, selectedValue, key) {
  return [
    `<option value=""></option>`,
    ...withSelectedOption(options, selectedValue).map((option) => {
      const value = optionValue(option);
      return `<option value="${safe(value)}"${value === String(selectedValue ?? "") ? " selected" : ""}>${safe(optionLabel(option, key))}</option>`;
    }),
  ].join("");
}

function datalistOptionsHtml(options, key) {
  return withSelectedOption(options).map((option) => {
    const value = optionValue(option);
    const label = optionLabel(option, key);
    if (taxonomyFields.has(key)) return `<option value="${safe(label)}"></option>`;
    return `<option value="${safe(value)}" label="${safe(label)}"></option>`;
  }).join("");
}

function withSelectedOption(options = [], selectedValue = "") {
  const selected = String(selectedValue ?? "");
  if (!selected) return options;
  if (options.some((option) => optionValue(option) === selected)) return options;
  return [{ value: selected }, ...options];
}

function optionValue(option) {
  if (option && typeof option === "object") return String(option.value || option.code || option.id || "");
  return String(option ?? "");
}

function optionLabel(option, key = "") {
  if (option && typeof option === "object") {
    const code = option.code || option.value || option.id || "";
    const name = option.name || option.official_name || "";
    if (key === "country_code") return countryOptionLabel(code, name);
    if (isCurrencyField(key)) return currencyOptionLabel(code, name);
    if (option.label) return option.label;
    if (taxonomyFields.has(key)) return taxonomyLabel(code);
    return name ? `${code} · ${name}` : labelize(code);
  }
  const value = String(option ?? "");
  if (key === "country_code") return countryOptionLabel(value);
  if (isCurrencyField(key)) return currencyOptionLabel(value);
  if (taxonomyFields.has(key)) return taxonomyLabel(value);
  return labelize(value);
}

function isCurrencyField(key = "") {
  return ["statement_currency", "account_currency", "trade_currency", "base_currency", "current_value_currency"].includes(key);
}

function comboInputValue(value, key = "") {
  const text = String(value ?? "");
  if (!text) return "";
  if (key === "country_code") return countryCodeFromInput(text) || text.toUpperCase();
  return taxonomyFields.has(key) ? taxonomyLabel(text) : text;
}

function categoryPairs() {
  return state.transactions?.filters?.category_pairs || [];
}

function categoryOptionsForSubcategory(subcategory = "") {
  const selectedSubcategory = canonicalTaxonomyValue(subcategory);
  const matches = categoryPairs()
    .filter((pair) => !selectedSubcategory || pair.subcategory === selectedSubcategory)
    .map((pair) => pair.category)
    .filter(Boolean);
  const fallback = state.transactions?.filters?.categories || [];
  return Array.from(new Set(matches.length ? matches : fallback)).sort();
}

function subcategoryOptionsForCategory(category = "") {
  const selectedCategory = canonicalTaxonomyValue(category);
  const matches = categoryPairs()
    .filter((pair) => !selectedCategory || pair.category === selectedCategory)
    .map((pair) => pair.subcategory)
    .filter(Boolean);
  const fallback = state.transactions?.filters?.subcategories || [];
  return Array.from(new Set(matches.length ? matches : fallback)).sort();
}

function syncTransactionEditOptions(form, changedName) {
  if (!form) return;
  const category = form.elements.category_id;
  const subcategory = form.elements.subcategory_id;

  if (category && subcategory && changedName === "category_id") {
    const options = subcategoryOptionsForCategory(category.value);
    replaceSelectOptions(subcategory, options, subcategory.value, "subcategory_id");
  }

  if (category && subcategory && changedName === "subcategory_id") {
    const options = categoryOptionsForSubcategory(subcategory.value);
    const current = category.value || (options.length === 1 ? options[0] : "");
    replaceSelectOptions(category, options, current, "category_id");
  }

  if (changedName === "statement_currency") {
    syncTransactionFxReadonly(form);
  }
  syncTransactionComputedFields(form, changedName);
}

function replaceSelectOptions(select, options, selectedValue, key) {
  if (select.tagName === "INPUT" && select.list) {
    select.list.innerHTML = datalistOptionsHtml(options, key);
  } else {
    select.innerHTML = selectOptionsHtml(options, selectedValue, key);
  }
  select.value = comboInputValue(selectedValue, key);
}

function syncTransactionFxReadonly(form) {
  const currency = String(form.elements.statement_currency?.value || "").toUpperCase();
  const readonly = !isMainCurrency(currency);
  transactionDerivedFxFields().forEach((name) => {
    const input = form.elements[name];
    if (!input) return;
    input.readOnly = readonly;
    input.disabled = readonly;
    input.classList.toggle("is-readonly", readonly);
    input.title = readonly ? "Converted amounts are recalculated from native amount, date, and currency." : "";
  });
}

function syncTransactionComputedFields(form, changedName = "") {
  if (!form) return;
  if (!changedName || changedName === "statement_amount") {
    const sanitized = form.elements.sanitized_statement_amount;
    if (sanitized) sanitized.value = sanitizedAmountValue(form.elements.statement_amount?.value);
  }
}

function sanitizedAmountValue(value) {
  const text = String(value ?? "").replace(/,/g, "").trim();
  if (!text) return "";
  const numeric = Number(text);
  if (!Number.isFinite(numeric)) return "";
  return String(Math.abs(numeric));
}

function syncAccountCreditFields(form, changedName = "") {
  if (!form || !accountCreditSyncFields().has(changedName)) return;
  const limitInput = form.elements.credit_limit_native;
  const balanceInput = form.elements.balance_native;
  const availableInput = form.elements.available_credit_native;
  if (!limitInput || !balanceInput || !availableInput) return;

  const creditLimit = decimalInputValue(limitInput.value);
  if (creditLimit === null) return;

  if (changedName === "available_credit_native") {
    const availableCredit = decimalInputValue(availableInput.value);
    if (availableCredit === null) return;
    balanceInput.value = formatMoneyInputValue(derivedCreditCardBalance(creditLimit, availableCredit));
    return;
  }

  if (changedName === "balance_native" || changedName === "credit_limit_native") {
    const balance = decimalInputValue(balanceInput.value);
    if (balance === null) {
      const availableCredit = decimalInputValue(availableInput.value);
      if (changedName === "credit_limit_native" && availableCredit !== null) {
        balanceInput.value = formatMoneyInputValue(derivedCreditCardBalance(creditLimit, availableCredit));
      }
      return;
    }
    availableInput.value = formatMoneyInputValue(derivedAvailableCredit(creditLimit, balance));
  }
}

function accountCreditSyncFields() {
  return new Set([
    "balance_native",
    "credit_limit_native",
    "available_credit_native",
  ]);
}

function derivedCreditCardBalance(creditLimit, availableCredit) {
  const usedCredit = Math.max(creditLimit - availableCredit, 0);
  return usedCredit ? -usedCredit : 0;
}

function derivedAvailableCredit(creditLimit, balance) {
  const usedCredit = Math.max(-balance, 0);
  return Math.max(creditLimit - usedCredit, 0);
}

function decimalInputValue(value) {
  const text = String(value ?? "").replace(/,/g, "").trim();
  if (!text) return null;
  const numeric = Number(text);
  return Number.isFinite(numeric) ? numeric : null;
}

function formatMoneyInputValue(value) {
  if (!Number.isFinite(value)) return "";
  const rounded = Math.round((value + Number.EPSILON) * 100) / 100;
  return rounded.toFixed(2).replace(/\.?0+$/, "");
}

function transactionNumericFields() {
  return new Set([
    "statement_amount",
    "sanitized_statement_amount",
    "amount_usd_converted",
    "amount_eur_converted",
  ]);
}

function transactionDerivedFxFields() {
  return new Set([
    "amount_usd_converted",
    "amount_eur_converted",
  ]);
}

function isMainCurrency(currency) {
  return ["EUR", "USD"].includes(String(currency || "").toUpperCase());
}

function transactionWideFields() {
  return new Set([
    "transaction_id",
    "counterparty_name",
    "memo",
  ]);
}

function detailPanel(title, heading, body, closeAction, ariaLabel, actions = "") {
  return `
    <aside class="details-panel" data-detail-panel aria-label="${safe(ariaLabel || title)}">
      <header>
        <div>
          <span class="section-kicker">${safe(title)}</span>
          <strong>${safe(heading)}</strong>
        </div>
        <div class="details-actions">
          ${actions}
          <button class="icon-button" data-action="${safe(closeAction)}" type="button" ${tooltipAttrs("Close details")}>
            <span data-icon="x"></span>
          </button>
        </div>
      </header>
      ${body}
    </aside>
  `;
}

function detailItem(label, value) {
  return `
    <div>
      <dt>${safe(label)}</dt>
      <dd>${safe(displayDetailValue(value))}</dd>
    </div>
  `;
}

function detailItemHtml(label, value) {
  return `
    <div>
      <dt>${safe(label)}</dt>
      <dd>${value || "-"}</dd>
    </div>
  `;
}

function detailSectionHtml(label, value) {
  return `
    <div class="detail-section">
      <dt>${safe(label)}</dt>
      <dd>${value || "-"}</dd>
    </div>
  `;
}

function displayDetailValue(value) {
  return value === undefined || value === null || value === "" ? "-" : value;
}

function sourceTruthTable(rows) {
  return `
    <section class="data-table-wrap">
      <table class="data-table">
        <thead>
          <tr>
            <th>Register</th>
            <th>Purpose</th>
            <th class="align-right">Rows</th>
            <th class="align-right">Columns</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${rows.length ? rows.map((row) => `
            <tr>
              <td><span class="table-main">${safe(row.name)}</span></td>
              <td>${safe(row.purpose)}</td>
              <td class="align-right">${formatNumber(row.rows)}</td>
              <td class="align-right">${formatNumber(row.columns)}</td>
              <td><span class="status-chip">${safe(row.status)}</span></td>
            </tr>
          `).join("") : emptyRow(5)}
        </tbody>
      </table>
    </section>
  `;
}

function connectionTable(rows) {
  return `
    <section class="data-table-wrap">
      <table class="data-table">
        <thead>
          <tr>
            <th>Connection</th>
            <th>Path</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${rows.length ? rows.map((row) => `
            <tr>
              <td><span class="table-main">${safe(row.name)}</span></td>
              <td><span class="table-sub">${safe(row.detail)}</span></td>
              <td><span class="status-chip">${safe(row.state)}</span></td>
            </tr>
          `).join("") : emptyRow(3)}
        </tbody>
      </table>
    </section>
  `;
}

function categoryCell(row) {
  const category = row.category_id ? taxonomyLabel(row.category_id) : "Uncategorized";
  const subcategory = row.subcategory_id ? taxonomyLabel(row.subcategory_id) : "";
  const icon = icons[insightIconFor(row.category_id || row.subcategory_id || category, "category")] || icons.pie;
  return `
    <div class="transaction-category-cell">
      <span class="transaction-category-icon" aria-hidden="true">${icon}</span>
      <span class="transaction-category-copy">
        <button class="category-link table-main" data-action="filter-category" data-category="${safe(row.category_id || "")}" type="button">${safe(category)}</button>
        ${subcategory ? `<span class="table-sub">${quickFilterControl(row.subcategory_id, subcategory, { field: "subcategory_id" })}</span>` : ""}
      </span>
    </div>
  `;
}

function loadingState(label) {
  return `
    <section class="state-panel loading-panel" aria-busy="true" aria-label="${safe(label)}">
      <div class="loading-skeleton" aria-hidden="true">
        <div class="skeleton-hero"></div>
        <div class="skeleton-metrics">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div class="skeleton-table">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
      <strong>${safe(label)}</strong>
    </section>
  `;
}

function errorState(title, message) {
  return `
    <section class="register-error-state">
      <span class="section-kicker">${safe(title)}</span>
      <strong>Unable to load data</strong>
      <p>${safe(message)}</p>
      <button class="table-action-button" data-action="refresh-data" type="button">
        <span data-icon="refresh"></span>
        <span>Retry</span>
      </button>
    </section>
  `;
}

function markdownDocument(markdown = "") {
  const lines = String(markdown || "").split(/\r?\n/);
  const blocks = [];
  let paragraph = [];
  let list = [];
  const flushParagraph = () => {
    if (!paragraph.length) return;
    blocks.push(`<p>${paragraph.map(safe).join(" ")}</p>`);
    paragraph = [];
  };
  const flushList = () => {
    if (!list.length) return;
    blocks.push(`<ul>${list.map((item) => `<li>${safe(item)}</li>`).join("")}</ul>`);
    list = [];
  };

  lines.forEach((line) => {
    const text = line.trim();
    if (!text) {
      flushParagraph();
      flushList();
      return;
    }
    const heading = text.match(/^(#{1,3})\s+(.+)$/);
    if (heading) {
      flushParagraph();
      flushList();
      const level = heading[1].length;
      blocks.push(`<h${level}>${safe(heading[2])}</h${level}>`);
      return;
    }
    const bullet = text.match(/^[-*]\s+(.+)$/);
    if (bullet) {
      flushParagraph();
      list.push(bullet[1]);
      return;
    }
    flushList();
    paragraph.push(text);
  });

  flushParagraph();
  flushList();
  return `<div class="settings-markdown">${blocks.join("")}</div>`;
}

function emptyState(message) {
  return `<div class="empty-state">${safe(message)}</div>`;
}

function emptyRow(colspan) {
  return `
    <tr class="empty-table-row">
      <td colspan="${colspan}">No matching rows.</td>
    </tr>
  `;
}

function portfolioInstrumentDetailsPanel(rows = []) {
  if (!state.selectedPortfolioInstrumentId) return "";
  const row = rows.find((item) => portfolioInstrumentId(item) === state.selectedPortfolioInstrumentId);
  if (!row) return "";
  const isEditing = state.selectedPortfolioInstrumentEditing;
  return detailPanel(
    isEditing ? "Edit Instrument" : "Instrument Details",
    row.ticker && row.ticker !== "N/A" ? row.ticker : row.asset_name || "Portfolio Instrument",
    isEditing ? portfolioInstrumentEditForm(row) : `
      <dl>
        ${detailItem("Portfolio", row.portfolio_name || displayPortfolioId(row.portfolio_id))}
        ${detailItem("Provider", labelize(row.provider))}
        ${detailItem("Instrument", row.asset_name)}
        ${detailItem("Ticker", row.ticker)}
        ${detailItem("Asset Class", labelize(row.asset_class))}
        ${detailItem("Asset Bucket", labelize(row.asset_bucket))}
        ${detailItem("Exchange", row.exchange)}
        ${detailItem("ISIN", row.isin)}
        ${detailItem("Native Value", formatWholeCurrency(row.current_value_native || 0, row.current_value_currency || row.base_currency || "EUR", { project: false }))}
        ${detailItem("Project Value", formatWholeCurrency(row.current_value_eur || 0, "EUR"))}
        ${detailItem("Recommended Buy", portfolioBuyNeededMainLabel(row))}
        ${detailItem("Funding Target To Date", formatWholeCurrency(row.funding_target_to_date_eur || 0, "EUR"))}
        ${detailItem("Full Funding Backlog", formatWholeCurrency(row.funding_backlog_eur || 0, "EUR"))}
        ${detailItem("Funding Progress", formatPercent(row.funding_completion_pct || 0))}
        ${detailItem("Portfolio Funding Gap", formatWholeCurrency(row.portfolio_funding_gap_eur || 0, "EUR"))}
        ${detailItem("Target Weight", formatPercent(row.target_allocation_pct || 0))}
        ${detailItem("Current Weight", formatPercent(row.current_allocation_pct || 0))}
        ${detailItem("Allocation Status", portfolioAllocationStatusLabel(row))}
        ${detailItem("Allocation Drift", signedPercent(row.allocation_gap_pct || 0))}
        ${detailItem("Expected CAGR", formatPercent(row.expected_cagr_pct || 0))}
        ${detailItem("Expected Volatility", formatPercent(row.expected_volatility_pct || 0))}
        ${detailItem("Net Expected CAGR", formatPercent(row.net_expected_cagr_pct || 0))}
        ${detailItem("Historical Cost", formatWholeCurrency(portfolioPerformanceSnapshot(row).cost_base_eur, "EUR"))}
        ${detailItem("Achieved P/L", signedWholeAmount(row.achieved_pl_eur || 0, "EUR"))}
        ${detailItem("Historical Return", signedPercent(portfolioPerformanceSnapshot(row).return_pct))}
        ${detailItem("Fees", formatPercent(row.total_fees_pct || 0))}
        ${detailItem("Fees Paid", formatWholeCurrency(row.fees_paid_native || 0, row.current_value_currency || row.base_currency || "EUR"))}
        ${detailItem("Notes", row.notes)}
      </dl>
      ${state.portfolioActionError ? `<p class="drawer-error">${safe(state.portfolioActionError)}</p>` : ""}
    `,
    "close-portfolio-instrument",
    "Portfolio instrument details",
    portfolioInstrumentDetailActions(row, isEditing),
  );
}

function portfolioInstrumentDetailActions(row, isEditing) {
  const id = portfolioInstrumentId(row);
  return `
    ${isEditing ? "" : `
      ${iconActionButton("duplicate-portfolio-instrument", "copy", "Duplicate instrument", { portfolioInstrumentId: id })}
      ${iconActionButton("edit-portfolio-instrument", "edit", "Edit instrument", { portfolioInstrumentId: id })}
    `}
    ${iconActionButton("delete-portfolio-instrument", "trash", "Delete instrument", { portfolioInstrumentId: id, className: "is-danger" })}
  `;
}

function portfolioInstrumentEditForm(row) {
  const id = portfolioInstrumentId(row);
  return `
    <form class="drawer-form portfolio-instrument-edit-form" data-portfolio-instrument-edit-form data-portfolio-instrument-id="${safe(id)}">
      ${portfolioInstrumentFields.map(([key, label]) => portfolioInstrumentFieldInput(key, label, row)).join("")}
      ${state.portfolioActionError ? `<p class="drawer-error">${safe(state.portfolioActionError)}</p>` : ""}
      <p class="drawer-note">Changes are saved to the portfolio strategy model and recalculate planning, forecast, and simulation views.</p>
      <div class="drawer-actions">
        <button class="small-button drawer-secondary-action" data-action="cancel-portfolio-instrument-edit" type="button">
          <span data-icon="x"></span>
          <span>Cancel</span>
        </button>
        <button class="small-button primary-button drawer-save-button" type="submit">
          <span data-icon="check"></span>
          <span>Save Changes</span>
        </button>
      </div>
    </form>
  `;
}

function portfolioInstrumentFieldInput(key, label, row) {
  const type = portfolioInstrumentNumericFields().has(key) ? "number" : "text";
  const step = type === "number" ? " step=\"any\"" : "";
  const className = portfolioInstrumentWideFields().has(key) ? " class=\"field-wide\"" : "";
  const value = key === "portfolio_id" ? displayPortfolioId(row[key]) : row[key];
  return `
    <label${className}>
      <span>${safe(label)}</span>
      <input name="${safe(key)}" type="${type}"${step} value="${safe(value ?? "")}" autocomplete="off" />
    </label>
  `;
}

function portfolioInstrumentNumericFields() {
  return new Set([
    "current_value_native",
    "current_value_eur",
    "target_allocation_pct",
    "expected_cagr_pct",
    "expected_volatility_pct",
    "total_fees_pct",
    "achieved_pl_native",
    "achieved_return_pct",
    "fees_paid_native",
  ]);
}

function portfolioInstrumentWideFields() {
  return new Set([
    "asset_name",
    "notes",
  ]);
}

function exitStrategyPhaseDetailsPanel(rows = []) {
  if (!state.selectedExitPhaseId) return "";
  const row = rows.find((item) => item.phase_id === state.selectedExitPhaseId);
  if (!row) return "";
  const isEditing = state.selectedExitPhaseEditing;
  return detailPanel(
    isEditing ? "Edit Exit Phase" : "Exit Phase",
    row.phase_name || displayPhaseId(row.phase_id),
    isEditing ? exitStrategyPhaseEditForm(row) : `
      <dl>
        ${detailItem("Phase ID", displayPhaseId(row.phase_id))}
        ${detailItem("Start Date", formatDisplayDate(row.start_date))}
        ${detailItem("End Date", formatDisplayDate(row.end_date))}
        ${detailItem("Duration", formatPlural(row.months || 0, "month"))}
        ${detailItem("Monthly Deployment", formatWholeCurrency(row.monthly_contribution_eur || 0, "EUR"))}
        ${detailItem("Phase Capital", formatWholeCurrency(row.phase_contribution_eur || 0, "EUR"))}
        ${detailItem("Cumulative Capital", formatWholeCurrency(row.cumulative_contribution_eur || 0, "EUR"))}
      </dl>
      ${state.exitPhaseActionError ? `<p class="drawer-error">${safe(state.exitPhaseActionError)}</p>` : ""}
      <p class="drawer-note">Capital values are calculated from the monthly investment plan and this phase date window.</p>
    `,
    "close-exit-phase",
    "Exit strategy phase details",
    exitStrategyPhaseDetailActions(row, isEditing),
  );
}

function exitStrategyPhaseDetailActions(row, isEditing) {
  if (isEditing) return "";
  return iconActionButton("edit-exit-phase", "edit", "Edit exit phase", { exitPhaseId: row.phase_id });
}

function exitStrategyPhaseEditForm(row) {
  return `
    <form class="drawer-form exit-phase-edit-form" data-exit-phase-edit-form data-exit-phase-id="${safe(row.phase_id)}">
      <label>
        <span>Phase ID</span>
        <input name="phase_id" type="text" value="${safe(displayPhaseId(row.phase_id))}" readonly autocomplete="off" />
      </label>
      ${exitPhaseFields.map(([key, label]) => exitStrategyPhaseFieldInput(key, label, row)).join("")}
      ${state.exitPhaseActionError ? `<p class="drawer-error">${safe(state.exitPhaseActionError)}</p>` : ""}
      <p class="drawer-note">Monthly deployment stays linked to MIP rows. Phase and cumulative capital recalculate after save.</p>
      <div class="drawer-actions">
        <button class="small-button drawer-secondary-action" data-action="cancel-exit-phase-edit" type="button">
          <span data-icon="x"></span>
          <span>Cancel</span>
        </button>
        <button class="small-button primary-button drawer-save-button" type="submit">
          <span data-icon="check"></span>
          <span>Save Changes</span>
        </button>
      </div>
    </form>
  `;
}

function exitStrategyPhaseFieldInput(key, label, row) {
  const type = key.endsWith("_date") ? "date" : "text";
  return `
    <label>
      <span>${safe(label)}</span>
      <input name="${safe(key)}" type="${type}" value="${safe(row[key] ?? "")}" autocomplete="off" />
    </label>
  `;
}

function portfolioMipDetailsPanel(rows = [], phases = []) {
  if (!state.selectedPortfolioMipId) return "";
  const row = rows.find((item) => portfolioMipId(item) === state.selectedPortfolioMipId);
  if (!row) return "";
  const isEditing = state.selectedPortfolioMipEditing;
  return detailPanel(
    isEditing ? "Edit Monthly Plan" : "Monthly Investment Plan",
    row.portfolio_name || displayPortfolioId(row.portfolio_id) || "Portfolio",
    isEditing ? portfolioMipEditForm(row, phases) : `
      <dl>
        ${detailItem("Portfolio ID", displayPortfolioId(row.portfolio_id))}
        ${detailItem("Provider", labelize(row.provider))}
        ${detailItem("Contribution Type", displayContributionType(row.contribution_type))}
        ${detailItem("Contribution Role", labelize(row.contribution_role))}
        ${detailItem("Current Phase", formatWholeCurrency(row.current_monthly_contribution_eur || 0, "EUR"))}
        ${detailItem("Start Date", formatDisplayDate(row.start_date))}
        ${detailItem("MIP End Date", formatDisplayDate(row.mip_phase_end_date_target))}
        ${detailItem("Exit Date", formatDisplayDate(row.portfolio_exit_date))}
        ${portfolioPhaseIds(phases).map((phaseId) => detailItem(`${phaseId.toUpperCase()} Monthly`, formatWholeCurrency(row.phase_contributions?.[phaseId] ?? 0, "EUR"))).join("")}
        ${detailItem("Weighted Return", formatPercent(row.weighted_cagr_pct || 0))}
        ${detailItem("Notes", row.notes)}
      </dl>
      ${state.portfolioMipActionError ? `<p class="drawer-error">${safe(state.portfolioMipActionError)}</p>` : ""}
    `,
    "close-portfolio-mip",
    "Monthly investment plan details",
    portfolioMipDetailActions(row, isEditing),
  );
}

function portfolioMipDetailActions(row, isEditing) {
  const id = portfolioMipId(row);
  return isEditing ? "" : `
    ${iconActionButton("edit-portfolio-mip", "edit", "Edit monthly investment plan", { portfolioMipId: id })}
    ${iconActionButton("delete-portfolio-mip", "trash", "Delete monthly investment plan", { portfolioMipId: id, className: "is-danger" })}
  `;
}

function portfolioMipEditForm(row, phases = []) {
  const id = portfolioMipId(row);
  const phaseIds = portfolioPhaseIds(phases);
  return `
    <form class="drawer-form portfolio-mip-edit-form" data-portfolio-mip-edit-form data-portfolio-mip-id="${safe(id)}">
      ${portfolioMipFields.map(([key, label]) => portfolioMipFieldInput(key, label, row)).join("")}
      ${phaseIds.map((phaseId) => portfolioMipPhaseInput(phaseId, row)).join("")}
      ${state.portfolioMipActionError ? `<p class="drawer-error">${safe(state.portfolioMipActionError)}</p>` : ""}
      <p class="drawer-note">Changes are saved to the portfolio strategy model and recalculate planning, forecast, and simulation views.</p>
      <div class="drawer-actions">
        <button class="small-button drawer-secondary-action" data-action="cancel-portfolio-mip-edit" type="button">
          <span data-icon="x"></span>
          <span>Cancel</span>
        </button>
        <button class="small-button primary-button drawer-save-button" type="submit">
          <span data-icon="check"></span>
          <span>Save Changes</span>
        </button>
      </div>
    </form>
  `;
}

function portfolioMipFieldInput(key, label, row) {
  const type = key.includes("date") ? "date" : "text";
  const className = key === "notes" ? " class=\"field-wide\"" : "";
  const value = key === "portfolio_id" ? displayPortfolioId(row[key]) : row[key];
  return `
    <label${className}>
      <span>${safe(label)}</span>
      <input name="${safe(key)}" type="${type}" value="${safe(value ?? "")}" autocomplete="off" />
    </label>
  `;
}

function portfolioMipPhaseInput(phaseId, row) {
  return `
    <label>
      <span>${safe(phaseId.toUpperCase())} Monthly</span>
      <input name="${safe(phaseId)}" data-format-number inputmode="decimal" type="text" value="${safe(formatEditableNumber(formatNumberForInput(row.phase_contributions?.[phaseId] ?? row[phaseId] ?? 0, 2)))}" autocomplete="off" />
    </label>
  `;
}

async function loadDataForView() {
  if (state.view === "overview") {
    if (!overviewHasScope("full")) await loadOverview({ scope: "full" });
  }
  if (state.view === "search") {
    await loadGlobalSearch();
  }
  if (state.view === "settings") {
    if (!overviewHasScope("summary")) await loadOverview({ scope: "summary" });
    await loadSettingsDiagnostics();
    await loadProfile();
  }
  if (state.view === "about") {
    if (state.aboutView === "changelog") await loadAboutChangelog();
  }
  if (state.view === "portfolio" && !overviewHasScope("full")) await loadOverview({ scope: "full" });
  if (state.view === "planning" && !overviewHasScope("full")) await loadOverview({ scope: "full" });
  if (state.view === "accounts") await loadAccounts();
  if (state.view === "transactions") await loadTransactions();
  if (state.view === "statementImport") await loadStatementImport();
  if (state.view === "trades") {
    if (state.tradeView === "returns") {
      if (!state.portfolioReturns) await loadPortfolioReturns();
    } else {
      await loadTrades();
    }
  }
}

async function loadSettingsDiagnostics(options = {}) {
  if (state.loading.settingsDiagnostics) return;
  if (state.cacheStatus && state.dataHealth && !options.force) return;
  const requestId = ++settingsDiagnosticsRequestId;
  state.loading.settingsDiagnostics = true;
  state.error.settingsDiagnostics = "";
  render();
  try {
    const [cacheResult, healthResult] = await Promise.allSettled([
      fetchJson("/api/cache/status"),
      fetchJson("/api/data-health"),
    ]);
    if (requestId !== settingsDiagnosticsRequestId) return;
    if (cacheResult.status === "fulfilled") state.cacheStatus = cacheResult.value;
    if (healthResult.status === "fulfilled") state.dataHealth = healthResult.value;
    const errors = [cacheResult, healthResult]
      .filter((result) => result.status === "rejected")
      .map((result) => friendlyFetchError(result.reason));
    state.error.settingsDiagnostics = errors.join(" · ");
  } finally {
    if (requestId !== settingsDiagnosticsRequestId) return;
    state.loading.settingsDiagnostics = false;
    render();
  }
}

async function loadProfile(options = {}) {
  if (state.loading.profile) return;
  if (state.profile && !options.force) return;
  const requestId = ++profileRequestId;
  state.loading.profile = true;
  state.error.profile = "";
  render();
  try {
    const data = await fetchJson("/api/profile");
    if (requestId !== profileRequestId) return;
    state.profile = data;
  } catch (error) {
    if (requestId !== profileRequestId) return;
    state.error.profile = friendlyFetchError(error);
  } finally {
    if (requestId !== profileRequestId) return;
    state.loading.profile = false;
    render();
  }
}

async function loadAboutChangelog(options = {}) {
  if (state.loading.aboutChangelog) return;
  if (state.aboutChangelog && !options.force) return;
  const requestId = ++aboutChangelogRequestId;
  state.loading.aboutChangelog = true;
  state.error.aboutChangelog = "";
  render();
  try {
    const data = await fetchJson("/api/about/changelog");
    if (requestId !== aboutChangelogRequestId) return;
    state.aboutChangelog = data;
  } catch (error) {
    if (requestId !== aboutChangelogRequestId) return;
    try {
      const body = await fetchText("/CHANGELOG.md");
      if (requestId !== aboutChangelogRequestId) return;
      state.aboutChangelog = { ok: true, source: "CHANGELOG.md", body };
      state.error.aboutChangelog = "";
    } catch {
      state.error.aboutChangelog = friendlyFetchError(error);
    }
  } finally {
    if (requestId !== aboutChangelogRequestId) return;
    state.loading.aboutChangelog = false;
    render();
  }
}

async function loadOverview(options = {}) {
  const requestId = ++overviewRequestId;
  const scope = options.scope || overviewRequestScope();
  state.loading.overview = true;
  state.error.overview = "";
  render();
  try {
    const params = periodParams();
    params.set("scope", scope);
    const data = await fetchJson(`/api/overview?${params.toString()}`);
    if (requestId !== overviewRequestId) return;
    state.overview = data;
  } catch (error) {
    if (requestId !== overviewRequestId) return;
    state.error.overview = friendlyFetchError(error);
  } finally {
    if (requestId !== overviewRequestId) return;
    state.loading.overview = false;
    render();
  }
}

function overviewRequestScope() {
  return ["overview", "portfolio", "planning"].includes(state.view) ? "full" : "summary";
}

function overviewHasScope(scope = "summary") {
  if (!state.overview) return false;
  if (scope === "summary") return true;
  return state.overview.scope === "full";
}

async function loadGlobalSearch() {
  const query = state.query.trim();
  const requestId = ++globalSearchRequestId;
  if (!query) {
    state.globalSearch = null;
    state.error.globalSearch = "";
    state.loading.globalSearch = false;
    render();
    return;
  }

  state.loading.globalSearch = true;
  state.error.globalSearch = "";
  render();
  try {
    const [accounts, transactions, trades] = await Promise.all([
      fetchJson(`/api/accounts?${globalSearchParams("accounts").toString()}`),
      fetchJson(`/api/transactions?${globalSearchParams("transactions").toString()}`),
      fetchJson(`/api/trades?${globalSearchParams("trades").toString()}`),
    ]);
    if (requestId !== globalSearchRequestId) return;
    state.globalSearch = {
      query,
      accounts,
      transactions,
      trades,
    };
  } catch (error) {
    if (requestId !== globalSearchRequestId) return;
    state.error.globalSearch = friendlyFetchError(error);
  } finally {
    if (requestId !== globalSearchRequestId) return;
    state.loading.globalSearch = false;
    render();
  }
}

async function loadAccounts() {
  const requestId = ++accountRequestId;
  state.loading.accounts = true;
  state.error.accounts = "";
  render();
  try {
    const data = await fetchJson(`/api/accounts?${accountParams().toString()}`);
    if (requestId !== accountRequestId) return;
    state.accounts = data;
    if (
      state.selectedAccountId
      && !state.accounts.rows.some((row) => row.account_id === state.selectedAccountId)
    ) {
      state.selectedAccountId = "";
      state.selectedAccountEditing = false;
      state.accountActionError = "";
    }
    const visibleIds = new Set(state.accounts.rows.map((row) => row.account_id));
    state.selectedAccounts.forEach((accountId) => {
      if (!visibleIds.has(accountId) && state.accountOffset === 0) {
        state.selectedAccounts.delete(accountId);
      }
    });
  } catch (error) {
    if (requestId !== accountRequestId) return;
    state.error.accounts = friendlyFetchError(error);
  } finally {
    if (requestId !== accountRequestId) return;
    state.loading.accounts = false;
    render();
  }
}

async function loadTransactions(options = {}) {
  const requestId = ++transactionRequestId;
  state.loading.transactions = true;
  state.error.transactions = "";
  render(options);
  try {
    const data = await fetchJson(`/api/transactions?${transactionParams().toString()}`);
    if (requestId !== transactionRequestId) return;
    state.transactions = data;
    const activeClass = state.transactionFilters.transaction_class;
    const availableClasses = state.transactions.filters?.transaction_classes || [];
    const specialTabs = [REVIEW_REQUIRED_TAB, DELETED_TRANSACTION_TAB, ACCOUNTABLE_TRANSACTION_TAB, NOT_ACCOUNTABLE_TRANSACTION_TAB];
    if (activeClass && !specialTabs.includes(activeClass) && !availableClasses.includes(activeClass)) {
      state.transactionFilters.transaction_class = "";
      state.transactionOffset = 0;
      state.selectedTransactions.clear();
      state.selectedTransactionId = "";
      const fallbackData = await fetchJson(`/api/transactions?${transactionParams().toString()}`);
      if (requestId !== transactionRequestId) return;
      state.transactions = fallbackData;
    }
    if (
      state.selectedTransactionId
      && !state.transactions.rows.some((row) => row.transaction_id === state.selectedTransactionId)
    ) {
      state.selectedTransactionId = "";
      state.selectedTransactionEditing = false;
      state.transactionActionError = "";
    }
  } catch (error) {
    if (requestId !== transactionRequestId) return;
    state.error.transactions = friendlyFetchError(error);
  } finally {
    if (requestId !== transactionRequestId) return;
    state.loading.transactions = false;
    render(options);
  }
}

async function loadStatementImport(options = {}) {
  if (state.statementImport && !options.force) return;
  const requestId = ++statementImportRequestId;
  state.loading.statementImport = true;
  state.error.statementImport = "";
  render();
  try {
    const data = await fetchJson("/api/statements/import");
    if (requestId !== statementImportRequestId) return;
    setStatementImportData(data, { selectImportable: true });
  } catch (error) {
    if (requestId !== statementImportRequestId) return;
    state.error.statementImport = friendlyFetchError(error);
  } finally {
    if (requestId !== statementImportRequestId) return;
    state.loading.statementImport = false;
    render();
  }
}

function statementImportSummaryMessage(data, prefix) {
  const parsed = numericValue(data?.parsed_transactions);
  const importable = numericValue(data?.importable);
  const duplicates = numericValue(data?.duplicates);
  const unsupported = numericValue(data?.unsupported_files);
  const parts = [
    `${formatNumber(parsed)} parsed`,
    `${formatNumber(importable)} importable`,
    `${formatNumber(duplicates)} duplicate${duplicates === 1 ? "" : "s"}`,
  ];
  if (unsupported) parts.push(`${formatNumber(unsupported)} unsupported`);
  return `${prefix}: ${parts.join(" · ")}.`;
}

async function previewStatementImport() {
  if (state.loading.statementImport) return;
  const requestId = ++statementImportRequestId;
  state.loading.statementImport = true;
  state.error.statementImport = "";
  state.statementImportActionError = "";
  state.statementImportActionMessage = "";
  render();
  try {
    const data = await fetchJson("/api/statements/import");
    if (requestId !== statementImportRequestId) return;
    setStatementImportData(data, { selectImportable: state.selectedStatementImportRecords.size === 0 });
    state.statementImportActionMessage = statementImportSummaryMessage(data, "Preview refreshed");
  } catch (error) {
    if (requestId !== statementImportRequestId) return;
    state.statementImportActionError = friendlyActionError(error, "Unable to preview statements.");
  } finally {
    if (requestId !== statementImportRequestId) return;
    state.loading.statementImport = false;
    render();
  }
}

async function loadPortfolioReturns() {
  const requestId = ++portfolioReturnsRequestId;
  state.loading.portfolioReturns = true;
  state.error.portfolioReturns = "";
  render();
  try {
    const data = await fetchJson(`/api/trades?${portfolioReturnsParams().toString()}`);
    if (requestId !== portfolioReturnsRequestId) return;
    state.portfolioReturns = data;
  } catch (error) {
    if (requestId !== portfolioReturnsRequestId) return;
    state.error.portfolioReturns = friendlyFetchError(error);
  } finally {
    if (requestId !== portfolioReturnsRequestId) return;
    state.loading.portfolioReturns = false;
    render();
  }
}

async function loadTrades() {
  const requestId = ++tradeRequestId;
  state.loading.trades = true;
  state.error.trades = "";
  render();
  try {
    const data = await fetchJson(`/api/trades?${tradeParams().toString()}`);
    if (requestId !== tradeRequestId) return;
    state.trades = data;
    const activeStatus = state.tradeFilters.position_status;
    const availableStatuses = state.trades.filters?.position_statuses || [];
    if (activeStatus && !availableStatuses.includes(activeStatus)) {
      state.tradeFilters.position_status = "";
      state.tradeOffset = 0;
      state.selectedTrades.clear();
      state.selectedTradeId = "";
      state.selectedTradeEditing = false;
      state.tradeActionError = "";
      const fallbackData = await fetchJson(`/api/trades?${tradeParams().toString()}`);
      if (requestId !== tradeRequestId) return;
      state.trades = fallbackData;
    }
    if (
      state.selectedTradeId
      && !state.trades.rows.some((row) => row.trade_id === state.selectedTradeId)
    ) {
      state.selectedTradeId = "";
      state.selectedTradeEditing = false;
      state.tradeActionError = "";
    }
    const visibleOrKnownIds = new Set(state.trades.rows.map((row) => row.trade_id));
    state.selectedTrades.forEach((tradeId) => {
      if (!visibleOrKnownIds.has(tradeId) && state.tradeOffset === 0) {
        state.selectedTrades.delete(tradeId);
      }
    });
  } catch (error) {
    if (requestId !== tradeRequestId) return;
    state.error.trades = friendlyFetchError(error);
  } finally {
    if (requestId !== tradeRequestId) return;
    state.loading.trades = false;
    render();
  }
}

function transactionParams() {
  const params = new URLSearchParams({
    limit: String(transactionLimit()),
    offset: String(state.transactionOffset),
    sort: state.transactionSort.field,
    direction: state.transactionSort.direction,
    scope: transactionRequestScope(),
  });
  const periodFilters = filtersForPeriod();
  periodParams().forEach((value, key) => params.set(key, value));
  if (periodFilters.date_from) params.set("date_from", periodFilters.date_from);
  if (periodFilters.date_to) params.set("date_to", periodFilters.date_to);
  if (state.query.trim()) params.set("q", state.query.trim());
  Object.entries(state.transactionFilters).forEach(([key, value]) => {
    if (key === "transaction_class" && value === REVIEW_REQUIRED_TAB) {
      params.set("review_status", "open");
      return;
    }
    if (key === "transaction_class" && value === DELETED_TRANSACTION_TAB) {
      params.set("ledger_status", "deleted");
      return;
    }
    if (key === "transaction_class" && value === ACCOUNTABLE_TRANSACTION_TAB) {
      params.set("ledger_status", "accountable");
      return;
    }
    if (key === "transaction_class" && value === NOT_ACCOUNTABLE_TRANSACTION_TAB) {
      params.set("ledger_status", "not_accountable");
      return;
    }
    if (key === "ledger_status" && [
      DELETED_TRANSACTION_TAB,
      ACCOUNTABLE_TRANSACTION_TAB,
      NOT_ACCOUNTABLE_TRANSACTION_TAB,
    ].includes(state.transactionFilters.transaction_class)) {
      return;
    }
    if (key === "review_status" && state.transactionFilters.transaction_class === REVIEW_REQUIRED_TAB) {
      return;
    }
    if (value) params.set(key, value);
  });
  return params;
}

function transactionRequestScope() {
  if (state.transactionView === "insights") return "insights";
  if (state.transactionView === "monthlyTargets") return "targets";
  return "register";
}

function accountParams() {
  const params = new URLSearchParams({
    limit: String(accountLimit()),
    offset: String(state.accountOffset),
    sort: state.accountSort.field,
    direction: state.accountSort.direction,
  });
  if (state.query.trim()) params.set("q", state.query.trim());
  Object.entries(state.accountFilters).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });
  return params;
}

function tradeParams() {
  const thresholds = state.intelligenceThresholds || defaultIntelligenceThresholds();
  const params = new URLSearchParams({
    limit: String(state.tradeView === "insights" ? "all" : tradeLimit()),
    offset: String(state.tradeOffset),
    sort: state.tradeSort.field,
    direction: state.tradeSort.direction,
    loss_warn_pct: String(thresholds.tradeLossWarningPct),
    allocation_cap_pct: String(thresholds.tradePositionCapPct),
    stale_price_days: String(thresholds.tradeStalePriceDays),
  });
  if (state.query.trim()) params.set("q", state.query.trim());
  Object.entries(state.tradeFilters).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });
  return params;
}

function portfolioReturnsParams() {
  const thresholds = state.intelligenceThresholds || defaultIntelligenceThresholds();
  const params = new URLSearchParams({
    limit: "500",
    offset: "0",
    sort: "activity_date",
    direction: "desc",
    loss_warn_pct: String(thresholds.tradeLossWarningPct),
    allocation_cap_pct: String(thresholds.tradePositionCapPct),
    stale_price_days: String(thresholds.tradeStalePriceDays),
  });
  if (state.query.trim()) params.set("q", state.query.trim());
  return params;
}

function globalSearchParams(view) {
  const query = state.query.trim();
  const params = new URLSearchParams({
    limit: "5",
    offset: "0",
    q: query,
    direction: "desc",
  });
  if (view === "accounts") params.set("sort", "balance");
  if (view === "transactions") params.set("sort", "transaction_date");
  if (view === "trades") params.set("sort", "activity_date");
  return params;
}

async function refreshData() {
  markOverviewStale();
  if (state.view === "trades") {
    await refreshTradePrices();
    return;
  }
  try {
    await fetchJson("/api/refresh");
  } catch {
    // A failed refresh should not clear the visible data.
  }
  if (state.view === "accounts") {
    await loadAccounts();
  } else if (state.view === "transactions") {
    await loadTransactions();
  } else if (state.view === "trades") {
    await loadTrades();
  } else if (state.view === "statementImport") {
    await loadStatementImport({ force: true });
  } else if (state.view === "search") {
    await loadGlobalSearch();
  } else {
    await loadOverview();
  }
}

async function refreshTradePrices() {
  if (state.tradePriceRefresh?.loading) return;
  state.tradePriceRefresh = { loading: true, message: "", error: "" };
  render();
  try {
    const result = await fetchJson("/api/trades/refresh-prices", { method: "POST" });
    const updated = formatNumber(result.updated_positions || 0);
    const skipped = Number(result.skipped?.length || 0);
    const accountLinks = Number(result.brokerage_account_formulas || 0);
    const asOf = result.price_as_of ? ` through ${formatDisplayDate(result.price_as_of)}` : "";
    const accountNote = accountLinks ? `; refreshed ${formatNumber(accountLinks)} brokerage account total${accountLinks === 1 ? "" : "s"}` : "";
    state.tradePriceRefresh = {
      loading: false,
      message: skipped
        ? `Updated ${updated} active positions${asOf}${accountNote}; ${formatNumber(skipped)} skipped.`
        : `Updated ${updated} active positions${asOf}${accountNote}.`,
      error: "",
    };
    markOverviewStale();
    state.portfolioReturns = null;
    if (state.view === "trades") {
      if (state.tradeView === "returns") {
        await loadPortfolioReturns();
      } else {
        await loadTrades();
      }
    } else if (state.view === "portfolio") {
      await loadOverview();
    } else {
      await loadOverview();
    }
  } catch (error) {
    state.tradePriceRefresh = {
      loading: false,
      message: "",
      error: friendlyActionError(error, "Unable to refresh trade prices."),
    };
    render();
  }
}

async function uploadStatementImportFiles(fileList) {
  const files = Array.from(fileList || []);
  if (!files.length || state.loading.statementImport) return;

  const formData = new FormData();
  files.forEach((file) => formData.append("files", file, file.name));
  state.loading.statementImport = true;
  state.error.statementImport = "";
  state.statementImportActionError = "";
  state.statementImportActionMessage = "";
  state.statementImport = null;
  state.selectedStatementImportRecords.clear();
  state.selectedStatementImportFiles.clear();
  render();
  try {
    const data = await fetchJson("/api/statements/import/upload", {
      method: "POST",
      body: formData,
    });
    setStatementImportData(data, { selectImportable: true });
    const uploaded = numericValue(data.saved_files?.length || files.length);
    state.statementImportActionMessage = statementImportSummaryMessage(
      data,
      `Uploaded ${formatNumber(uploaded)} file${uploaded === 1 ? "" : "s"}`
    );
  } catch (error) {
    state.statementImportActionError = friendlyActionError(error, "Unable to upload statements.");
  } finally {
    state.loading.statementImport = false;
    render();
  }
}

async function applyStatementImport() {
  if (state.loading.statementImport) return;
  const recordIds = statementImportSelectedRecordIds();
  if (!recordIds.length) {
    state.statementImportActionError = "Select at least one importable row.";
    render();
    return;
  }
  const confirmed = window.confirm(`Import ${formatNumber(recordIds.length)} selected statement transaction${recordIds.length === 1 ? "" : "s"} into transactions_register?`);
  if (!confirmed) return;
  state.loading.statementImport = true;
  state.error.statementImport = "";
  state.statementImportActionError = "";
  state.statementImportActionMessage = "";
  render();
  try {
    const data = await fetchJson("/api/statements/import/apply", {
      method: "POST",
      body: JSON.stringify({ record_ids: recordIds }),
    });
    setStatementImportData(data, { selectImportable: false });
    const applied = numericValue(data.applied);
    const archivedDuplicates = numericValue(data.archived_duplicates);
    const messageParts = [];
    if (applied) messageParts.push(`Imported ${formatNumber(applied)} transaction${applied === 1 ? "" : "s"}`);
    if (archivedDuplicates) {
      messageParts.push(`cleared ${formatNumber(archivedDuplicates)} duplicate file${archivedDuplicates === 1 ? "" : "s"}`);
    }
    state.statementImportActionMessage = messageParts.length
      ? `${messageParts.join(" · ")}.`
      : statementImportSummaryMessage(data, "Nothing imported");
    markOverviewStale();
    state.transactions = null;
  } catch (error) {
    state.statementImportActionError = friendlyActionError(error, "Unable to import statements.");
  } finally {
    state.loading.statementImport = false;
    render();
  }
}

async function clearStatementImport() {
  if (state.loading.statementImport) return;
  const queuedCount = numericValue((state.statementImport?.rows || []).length + (state.statementImport?.unsupported_rows || []).length);
  const confirmed = window.confirm(`Clear ${formatNumber(queuedCount)} queued statement file${queuedCount === 1 ? "" : "s"}? Uploaded files will be removed from the import queue.`);
  if (!confirmed) return;
  state.loading.statementImport = true;
  state.error.statementImport = "";
  state.statementImportActionError = "";
  state.statementImportActionMessage = "";
  render();
  try {
    const data = await fetchJson("/api/statements/import/clear", { method: "POST" });
    setStatementImportData(data, { selectImportable: false });
    const cleared = numericValue(data.cleared_files);
    state.statementImportActionMessage = cleared
      ? `Cleared ${formatNumber(cleared)} queued file${cleared === 1 ? "" : "s"}.`
      : "Import queue is already clear.";
  } catch (error) {
    state.statementImportActionError = friendlyActionError(error, "Unable to clear statement queue.");
  } finally {
    state.loading.statementImport = false;
    render();
  }
}

async function clearSelectedStatementImport() {
  if (state.loading.statementImport) return;
  const fileNames = statementImportSelectedFileNames();
  if (!fileNames.length) {
    state.statementImportActionError = "Select at least one queued file.";
    render();
    return;
  }
  const confirmed = window.confirm(`Delete ${formatNumber(fileNames.length)} selected queued statement file${fileNames.length === 1 ? "" : "s"}?`);
  if (!confirmed) return;
  state.loading.statementImport = true;
  state.error.statementImport = "";
  state.statementImportActionError = "";
  state.statementImportActionMessage = "";
  render();
  try {
    const data = await fetchJson("/api/statements/import/clear", {
      method: "POST",
      body: JSON.stringify({ file_names: fileNames }),
    });
    setStatementImportData(data, { selectImportable: false });
    const cleared = numericValue(data.cleared_files);
    state.statementImportActionMessage = cleared
      ? `Deleted ${formatNumber(cleared)} selected file${cleared === 1 ? "" : "s"}.`
      : "No selected files were deleted.";
  } catch (error) {
    state.statementImportActionError = friendlyActionError(error, "Unable to delete selected statement files.");
  } finally {
    state.loading.statementImport = false;
    render();
  }
}

async function addTransaction() {
  const wasDeletedTab = state.transactionFilters.transaction_class === DELETED_TRANSACTION_TAB;
  try {
    const result = await fetchJson("/api/transactions", {
      method: "POST",
      body: JSON.stringify({ values: defaultNewTransactionValues() }),
    });
    const createdId = result.transaction_id || "";
    markOverviewStale();
    state.query = "";
    if (elements.search) elements.search.value = "";
    if (wasDeletedTab) {
      state.transactionFilters.transaction_class = REVIEW_REQUIRED_TAB;
    }
    state.transactionFilters.category_id = "";
    state.transactionOffset = 0;
    state.selectedTransactions.clear();
    state.selectedTransactionId = createdId;
    state.selectedTransactionEditing = true;
    state.transactionActionError = "";
    resetStatementPanel();
    await loadTransactions();
  } catch (error) {
    window.alert(friendlyActionError(error, "Unable to add transaction."));
  }
}

async function addAccount() {
  try {
    const result = await fetchJson("/api/accounts", {
      method: "POST",
      body: JSON.stringify({ values: defaultNewAccountValues() }),
    });
    const createdId = result.account_id || "";
    markOverviewStale();
    state.query = "";
    if (elements.search) elements.search.value = "";
    state.accountFilters = defaultAccountFilters();
    state.accountSort = { field: "id", direction: "desc" };
    state.accountOffset = 0;
    state.selectedAccounts.clear();
    state.selectedAccountId = createdId;
    state.selectedAccountEditing = true;
    state.accountActionError = "";
    await loadAccounts();
  } catch (error) {
    window.alert(friendlyActionError(error, "Unable to add account."));
  }
}

async function addTrade() {
  try {
    const result = await fetchJson("/api/trades", {
      method: "POST",
      body: JSON.stringify({ values: defaultNewTradeValues() }),
    });
    const createdId = result.trade_id || "";
    markOverviewStale();
    state.query = "";
    if (elements.search) elements.search.value = "";
    state.tradeFilters = defaultTradeFilters();
    state.tradeOffset = 0;
    state.selectedTrades.clear();
    state.selectedTradeId = createdId;
    state.selectedTradeEditing = true;
    state.tradeActionError = "";
    await loadTrades();
  } catch (error) {
    window.alert(friendlyActionError(error, "Unable to add trade."));
  }
}

function defaultNewTradeValues() {
  const today = currentDateKey();
  const options = state.trades?.edit_options || state.trades?.filters || {};
  return {
    provider_id: preferredOptionValue(options.provider_ids, "IBKR", "IBKR"),
    instrument_type: preferredOptionValue(options.instrument_types, "ETF", "ETF"),
    trade_currency: preferredOptionValue(options.trade_currencies, "EUR", "EUR"),
    entry_date: today,
    price_as_of: today,
    ledger_status: "accountable",
    review_status: "review_required",
  };
}

function defaultNewAccountValues() {
  const options = state.accounts?.edit_options || state.accounts?.filters || {};
  return {
    provider_id: preferredOptionValue(options.provider_ids, "", ""),
    account_status: "active",
    capital_bucket: preferredOptionValue(options.capital_buckets, "reserve", "reserve"),
    account_type: preferredOptionValue(options.account_types, "bank_account", "bank_account"),
    account_currency: preferredOptionValue(options.account_currencies, "EUR", "EUR"),
    balance_native: "0",
    ledger_status: "accountable",
    review_status: "review_required",
  };
}

async function saveTransaction(form) {
  const transactionId = form.dataset.transactionId || state.selectedTransactionId;
  const values = Object.fromEntries(new FormData(form).entries());
  taxonomyFields.forEach((field) => {
    if (Object.prototype.hasOwnProperty.call(values, field)) {
      values[field] = canonicalTaxonomyValue(values[field]);
    }
  });
  if (Object.prototype.hasOwnProperty.call(values, "country_code")) {
    values.country_code = countryCodeFromInput(values.country_code);
  }
  const currency = String(values.statement_currency || form.elements.statement_currency?.value || "").toUpperCase();
  if (!isMainCurrency(currency)) {
    transactionDerivedFxFields().forEach((name) => {
      delete values[name];
    });
  }
  state.transactionActionError = "";
  try {
    const result = await fetchJson(`/api/transactions/${encodeURIComponent(transactionId)}`, {
      method: "PATCH",
      body: JSON.stringify({ values }),
    });
    state.selectedTransactionId = result.transaction_id || values.transaction_id || transactionId;
    state.selectedTransactionEditing = false;
    state.transactionActionError = "";
    markOverviewStale();
    await loadTransactions();
  } catch (error) {
    state.transactionActionError = friendlyActionError(error, "Unable to save transaction.");
    render();
  }
}

async function saveAccount(form) {
  const accountId = form.dataset.accountId || state.selectedAccountId;
  const values = Object.fromEntries(new FormData(form).entries());
  state.accountActionError = "";
  try {
    const result = await fetchJson(`/api/accounts/${encodeURIComponent(accountId)}`, {
      method: "PATCH",
      body: JSON.stringify({ values }),
    });
    state.selectedAccountId = result.account_id || values.account_id || accountId;
    state.selectedAccountEditing = false;
    state.accountActionError = "";
    markOverviewStale();
    await loadAccounts();
  } catch (error) {
    state.accountActionError = friendlyActionError(error, "Unable to save account.");
    render();
  }
}

async function saveProfile(form) {
  const values = Object.fromEntries(new FormData(form).entries());
  state.profileActionError = "";
  state.profileActionMessage = "";
  state.loading.profile = true;
  renderPreservingScroll();
  try {
    const result = await fetchJson("/api/profile", {
      method: "PATCH",
      body: JSON.stringify({ values }),
    });
    state.profile = result;
    state.profileActionMessage = "Profile saved.";
    form.reset();
  } catch (error) {
    state.profileActionError = friendlyActionError(error, "Unable to save profile.");
  } finally {
    state.loading.profile = false;
    renderPreservingScroll();
  }
}

async function saveTrade(form) {
  const tradeId = form.dataset.tradeId || state.selectedTradeId;
  const values = Object.fromEntries(new FormData(form).entries());
  state.tradeActionError = "";
  try {
    const result = await fetchJson(`/api/trades/${encodeURIComponent(tradeId)}`, {
      method: "PATCH",
      body: JSON.stringify({ values }),
    });
    state.selectedTradeId = result.trade_id || values.trade_id || tradeId;
    state.selectedTradeEditing = false;
    state.tradeActionError = "";
    markOverviewStale();
    await loadTrades();
  } catch (error) {
    state.tradeActionError = friendlyActionError(error, "Unable to save trade.");
    render();
  }
}

async function savePortfolioInstrument(form) {
  const id = form.dataset.portfolioInstrumentId || state.selectedPortfolioInstrumentId;
  if (!id) return;
  const values = normalizePortfolioInstrumentFormValues(Object.fromEntries(new FormData(form).entries()));
  state.portfolioActionError = "";
  try {
    const result = await fetchJson(`/api/portfolio/instruments/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: JSON.stringify({ values }),
    });
    const nextId = result.portfolio_instrument_id || id;
    const nextOverrides = { ...state.portfolioInstrumentOverrides };
    delete nextOverrides[id];
    state.portfolioInstrumentOverrides = nextOverrides;
    state.deletedPortfolioInstrumentIds.delete(id);
    state.selectedPortfolioInstrumentId = nextId;
    state.selectedPortfolioInstrumentEditing = false;
    markOverviewStale();
    await loadOverview();
  } catch (error) {
    state.portfolioActionError = friendlyActionError(error, "Unable to save portfolio instrument.");
    render();
  }
}

function normalizePortfolioInstrumentFormValues(values = {}) {
  const normalized = { ...values };
  portfolioInstrumentNumericFields().forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(normalized, key)) {
      normalized[key] = numericValue(String(normalized[key]).replace(/,/g, ""));
    }
  });
  normalized.current_value_currency = String(normalized.current_value_currency || normalized.base_currency || "EUR").toUpperCase();
  normalized.base_currency = String(normalized.base_currency || "EUR").toUpperCase();
  normalized.portfolio_id = storedPortfolioId(normalized.portfolio_id);
  normalized.provider = String(normalized.provider || "").trim();
  normalized.ticker = String(normalized.ticker || "").trim().toUpperCase();
  normalized.net_expected_cagr_pct = moneyRound(numericValue(normalized.expected_cagr_pct) - numericValue(normalized.total_fees_pct));
  return normalized;
}

async function savePortfolioMip(form) {
  const id = form.dataset.portfolioMipId || state.selectedPortfolioMipId;
  if (!id) return;
  const formValues = Object.fromEntries(new FormData(form).entries());
  formValues.portfolio_id = storedPortfolioId(formValues.portfolio_id);
  const phases = state.overview?.portfolio?.exit_strategy?.phases || [];
  const phaseIds = portfolioPhaseIds(phases);
  const phaseContributions = {};
  phaseIds.forEach((phaseId) => {
    phaseContributions[phaseId] = numericValue(String(formValues[phaseId] ?? "").replace(/,/g, ""));
    delete formValues[phaseId];
  });
  const values = normalizePortfolioMipRow({
    ...formValues,
    phase_contributions: phaseContributions,
    _portfolio_mip_id: id,
    _is_custom: Boolean(state.portfolioMipOverrides[id]?._is_custom),
  }, phases);
  state.portfolioMipActionError = "";
  try {
    const result = await savePortfolioMipPayload(id, values);
    const nextId = result.portfolio_mip_id || id;
    const nextOverrides = { ...state.portfolioMipOverrides };
    delete nextOverrides[id];
    state.portfolioMipOverrides = nextOverrides;
    state.selectedPortfolioMipId = nextId;
    state.selectedPortfolioMipEditing = false;
    resetReportForecastOverrides();
    markOverviewStale();
    await loadOverview();
  } catch (error) {
    state.portfolioMipActionError = friendlyPortfolioPlanError(error);
    render();
  }
}

async function savePortfolioMipPayload(id, values) {
  const payloadValues = { ...values, _portfolio_mip_id: id };
  const endpoints = [
    "/api/portfolio/mip",
    `/api/portfolio/mip?id=${encodeURIComponent(id)}`,
    `/api/portfolio/mip/${encodeURIComponent(id)}`,
  ];
  let lastError = null;
  for (const endpoint of endpoints) {
    try {
      return await fetchJson(endpoint, {
        method: "PATCH",
        body: JSON.stringify({ values: payloadValues }),
      });
    } catch (error) {
      if (!isNotFoundError(error)) throw error;
      lastError = error;
    }
  }
  throw lastError || new Error("404 Not Found");
}

function friendlyPortfolioPlanError(error) {
  if (isNotFoundError(error)) {
    return "Unable to save monthly plan. The monthly plan save route is unavailable. Restart the Ledger UI server and try again.";
  }
  return friendlyActionError(error, "Unable to save monthly plan.");
}

function isNotFoundError(error) {
  return error?.status === 404 || String(error?.message || "").includes("404");
}

async function saveExitPhase(form) {
  const id = form.dataset.exitPhaseId || state.selectedExitPhaseId;
  if (!id) return;
  const values = Object.fromEntries(new FormData(form).entries());
  values.phase_id = storedPhaseId(values.phase_id);
  state.exitPhaseActionError = "";
  try {
    const result = await fetchJson(`/api/portfolio/phases/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: JSON.stringify({ values }),
    });
    state.selectedExitPhaseId = result.exit_phase_id || id;
    state.selectedExitPhaseEditing = false;
    resetReportForecastOverrides();
    markOverviewStale();
    await loadOverview();
  } catch (error) {
    state.exitPhaseActionError = friendlyActionError(error, "Unable to save exit phase.");
    render();
  }
}

function addPortfolioInstrument() {
  const id = `custom:${Date.now()}:${Math.random().toString(16).slice(2)}`;
  state.portfolioInstrumentOverrides = {
    ...state.portfolioInstrumentOverrides,
    [id]: {
      ...defaultPortfolioInstrumentValues(),
      _portfolio_instrument_id: id,
      _is_custom: true,
    },
  };
  state.deletedPortfolioInstrumentIds.delete(id);
  state.selectedPortfolioInstruments.clear();
  state.selectedPortfolioInstrumentId = id;
  state.selectedPortfolioInstrumentEditing = true;
  state.portfolioActionError = "";
  render();
}

function addPortfolioMip() {
  const id = `custom-mip:${Date.now()}:${Math.random().toString(16).slice(2)}`;
  const currentPlanCount = currentPortfolioMipRows().length + 1;
  state.portfolioMipOverrides = {
    ...state.portfolioMipOverrides,
    [id]: {
      ...defaultPortfolioMipValues(),
      portfolio_id: `p${currentPlanCount}`,
      portfolio_name: `Portfolio ${currentPlanCount}`,
      _portfolio_mip_id: id,
      _is_custom: true,
    },
  };
  state.selectedPortfolioMipId = id;
  state.selectedPortfolioMipEditing = true;
  state.portfolioMipActionError = "";
  render();
}

function duplicatePortfolioInstrument(portfolioInstrumentIdValue) {
  const clonedId = clonePortfolioInstrument(portfolioInstrumentIdValue);
  if (!clonedId) return;
  state.selectedPortfolioInstruments.clear();
  state.selectedPortfolioInstrumentId = clonedId;
  state.selectedPortfolioInstrumentEditing = true;
  state.portfolioActionError = "";
  render();
}

function duplicateSelectedPortfolioInstruments() {
  const ids = Array.from(state.selectedPortfolioInstruments).filter(Boolean);
  if (!ids.length) return;
  const created = ids.map((id) => clonePortfolioInstrument(id)).filter(Boolean);
  state.selectedPortfolioInstruments.clear();
  state.selectedPortfolioInstrumentId = created.length === 1 ? created[0] : "";
  state.selectedPortfolioInstrumentEditing = created.length === 1;
  state.portfolioActionError = "";
  render();
}

function clonePortfolioInstrument(portfolioInstrumentIdValue) {
  const id = portfolioInstrumentIdValue || state.selectedPortfolioInstrumentId;
  if (!id) return "";
  const source = currentPortfolioInstrumentRows().find((row) => portfolioInstrumentId(row) === id);
  if (!source) return "";
  const clonedId = `custom:${Date.now()}:${Math.random().toString(16).slice(2)}`;
  const ticker = String(source.ticker || source.symbol || "").trim();
  state.portfolioInstrumentOverrides = {
    ...state.portfolioInstrumentOverrides,
    [clonedId]: {
      ...source,
      _portfolio_instrument_id: clonedId,
      _is_custom: true,
      ticker: ticker ? `${ticker}_COPY` : "NEW",
      asset_name: `${source.asset_name || "Portfolio Instrument"} Copy`,
    },
  };
  state.deletedPortfolioInstrumentIds.delete(clonedId);
  return clonedId;
}

function deletePortfolioInstrument(portfolioInstrumentIdValue) {
  const id = portfolioInstrumentIdValue || state.selectedPortfolioInstrumentId;
  if (!id) return;
  const confirmed = window.confirm("Remove this portfolio instrument from the local planning view? It will return when live data is refreshed.");
  if (!confirmed) return;
  state.deletedPortfolioInstrumentIds.add(id);
  state.selectedPortfolioInstruments.delete(id);
  if (state.selectedPortfolioInstrumentId === id) {
    state.selectedPortfolioInstrumentId = "";
    state.selectedPortfolioInstrumentEditing = false;
  }
  state.portfolioActionError = "";
  render();
}

function deleteSelectedPortfolioInstruments() {
  const ids = Array.from(state.selectedPortfolioInstruments).filter(Boolean);
  if (!ids.length) return;
  const confirmed = window.confirm(`Remove ${formatNumber(ids.length)} selected portfolio instruments from the local planning view? They will return when live data is refreshed.`);
  if (!confirmed) return;
  ids.forEach((id) => state.deletedPortfolioInstrumentIds.add(id));
  if (ids.includes(state.selectedPortfolioInstrumentId)) {
    state.selectedPortfolioInstrumentId = "";
    state.selectedPortfolioInstrumentEditing = false;
  }
  state.selectedPortfolioInstruments.clear();
  state.portfolioActionError = "";
  render();
}

async function deletePortfolioMip(portfolioMipIdValue) {
  const id = portfolioMipIdValue || state.selectedPortfolioMipId;
  if (!id) return;
  const row = currentPortfolioMipRows().find((item) => portfolioMipId(item) === id);
  const label = row?.portfolio_name || row?.portfolio_id || id;
  const confirmed = window.confirm(`Delete ${label} from the monthly investment plan?`);
  if (!confirmed) return;

  if (state.portfolioMipOverrides[id]?._is_custom) {
    const nextOverrides = { ...state.portfolioMipOverrides };
    delete nextOverrides[id];
    state.portfolioMipOverrides = nextOverrides;
    state.selectedPortfolioMipId = "";
    state.selectedPortfolioMipEditing = false;
    state.portfolioMipActionError = "";
    render();
    return;
  }

  try {
    await fetchJson(`/api/portfolio/mip/${encodeURIComponent(id)}`, { method: "DELETE" });
    const nextOverrides = { ...state.portfolioMipOverrides };
    delete nextOverrides[id];
    state.portfolioMipOverrides = nextOverrides;
    state.selectedPortfolioMipId = "";
    state.selectedPortfolioMipEditing = false;
    state.portfolioMipActionError = "";
    resetReportForecastOverrides();
    markOverviewStale();
    await loadOverview();
  } catch (error) {
    state.portfolioMipActionError = friendlyActionError(error, "Unable to delete monthly plan.");
    render();
  }
}

function portfolioInstrumentIsCustom(id) {
  const override = state.portfolioInstrumentOverrides?.[id];
  if (override?._is_custom) return true;
  const rawRows = state.overview?.portfolio?.instruments || [];
  return !rawRows.some((row) => portfolioInstrumentId(row) === id);
}

async function duplicateTransaction(transactionId) {
  const id = transactionId || state.selectedTransactionId;
  if (!id) return;

  try {
    const result = await fetchJson(`/api/transactions/${encodeURIComponent(id)}/duplicate`, { method: "POST" });
    state.selectedTransactionId = result.transaction_id || "";
    state.selectedTransactionEditing = false;
    state.transactionActionError = "";
    state.selectedTransactions.clear();
    markOverviewStale();
    await loadTransactions();
  } catch (error) {
    state.transactionActionError = friendlyActionError(error, "Unable to duplicate transaction.");
    render();
  }
}

async function duplicateAccount(accountId) {
  const id = accountId || state.selectedAccountId;
  if (!id) return;

  try {
    const result = await fetchJson(`/api/accounts/${encodeURIComponent(id)}/duplicate`, { method: "POST" });
    state.selectedAccountId = result.account_id || "";
    state.selectedAccountEditing = false;
    state.accountActionError = "";
    state.selectedAccounts.clear();
    state.accountSort = { field: "id", direction: "desc" };
    state.accountOffset = 0;
    markOverviewStale();
    await loadAccounts();
  } catch (error) {
    state.accountActionError = friendlyActionError(error, "Unable to duplicate account.");
    render();
  }
}

async function duplicateSelectedTransactions() {
  const ids = Array.from(state.selectedTransactions).filter(Boolean);
  if (!ids.length) return;
  const confirmed = window.confirm(`Duplicate ${formatNumber(ids.length)} selected transactions in the source sheet?`);
  if (!confirmed) return;

  try {
    const result = await fetchJson("/api/transactions/duplicate", {
      method: "POST",
      body: JSON.stringify({ transaction_ids: ids }),
    });
    const created = result.created || [];
    markOverviewStale();
    state.selectedTransactions.clear();
    state.selectedTransactionId = created.length === 1 ? created[0].transaction_id || "" : "";
    state.selectedTransactionEditing = false;
    state.transactionActionError = "";
    await loadTransactions();
  } catch (error) {
    window.alert(friendlyActionError(error, "Unable to duplicate selected transactions."));
  }
}

async function duplicateSelectedAccounts() {
  const ids = Array.from(state.selectedAccounts).filter(Boolean);
  if (!ids.length) return;
  const confirmed = window.confirm(`Duplicate ${formatNumber(ids.length)} selected accounts in accounts_register?`);
  if (!confirmed) return;

  try {
    const result = await fetchJson("/api/accounts/duplicate", {
      method: "POST",
      body: JSON.stringify({ account_ids: ids }),
    });
    const created = result.created || [];
    markOverviewStale();
    state.selectedAccounts.clear();
    state.selectedAccountId = created.length === 1 ? created[0].account_id || "" : "";
    state.selectedAccountEditing = false;
    state.accountActionError = "";
    state.accountSort = { field: "id", direction: "desc" };
    state.accountOffset = 0;
    await loadAccounts();
  } catch (error) {
    window.alert(friendlyActionError(error, "Unable to duplicate selected accounts."));
  }
}

async function duplicateTrade(tradeId) {
  const id = tradeId || state.selectedTradeId;
  if (!id) return;

  try {
    const result = await fetchJson(`/api/trades/${encodeURIComponent(id)}/duplicate`, { method: "POST" });
    state.selectedTradeId = result.trade_id || "";
    state.selectedTradeEditing = false;
    state.tradeActionError = "";
    state.selectedTrades.clear();
    markOverviewStale();
    await loadTrades();
  } catch (error) {
    state.tradeActionError = friendlyActionError(error, "Unable to duplicate trade.");
    render();
  }
}

async function duplicateSelectedTrades() {
  const ids = Array.from(state.selectedTrades).filter(Boolean);
  if (!ids.length) return;
  const confirmed = window.confirm(`Duplicate ${formatNumber(ids.length)} selected trades in trades_register?`);
  if (!confirmed) return;

  try {
    const result = await fetchJson("/api/trades/duplicate", {
      method: "POST",
      body: JSON.stringify({ trade_ids: ids }),
    });
    const created = result.created || [];
    markOverviewStale();
    state.selectedTrades.clear();
    state.selectedTradeId = created.length === 1 ? created[0].trade_id || "" : "";
    state.selectedTradeEditing = false;
    state.tradeActionError = "";
    await loadTrades();
  } catch (error) {
    window.alert(friendlyActionError(error, "Unable to duplicate selected trades."));
  }
}

async function restoreAccount(accountId) {
  const id = accountId || state.selectedAccountId;
  if (!id) return;

  try {
    await fetchJson(`/api/accounts/${encodeURIComponent(id)}/restore`, { method: "POST" });
    markOverviewStale();
    state.accountActionError = "";
    state.selectedAccountId = "";
    state.selectedAccountEditing = false;
    state.selectedAccounts.delete(id);
    await loadAccounts();
  } catch (error) {
    state.accountActionError = friendlyActionError(error, "Unable to restore account.");
    render();
  }
}

async function restoreSelectedAccounts() {
  const ids = Array.from(state.selectedAccounts).filter(Boolean);
  if (!ids.length) return;

  try {
    await fetchJson("/api/accounts/restore", {
      method: "POST",
      body: JSON.stringify({ account_ids: ids }),
    });
    markOverviewStale();
    state.accountActionError = "";
    state.selectedAccounts.clear();
    if (ids.includes(state.selectedAccountId)) {
      state.selectedAccountId = "";
      state.selectedAccountEditing = false;
    }
    await loadAccounts();
  } catch (error) {
    window.alert(friendlyActionError(error, "Unable to restore selected accounts."));
  }
}

async function restoreTrade(tradeId) {
  const id = tradeId || state.selectedTradeId;
  if (!id) return;

  try {
    await fetchJson(`/api/trades/${encodeURIComponent(id)}/restore`, { method: "POST" });
    markOverviewStale();
    state.tradeActionError = "";
    state.selectedTradeId = "";
    state.selectedTradeEditing = false;
    state.selectedTrades.delete(id);
    await loadTrades();
  } catch (error) {
    state.tradeActionError = friendlyActionError(error, "Unable to restore trade.");
    render();
  }
}

async function restoreSelectedTrades() {
  const ids = Array.from(state.selectedTrades).filter(Boolean);
  if (!ids.length) return;

  try {
    await fetchJson("/api/trades/restore", {
      method: "POST",
      body: JSON.stringify({ trade_ids: ids }),
    });
    markOverviewStale();
    state.tradeActionError = "";
    state.selectedTrades.clear();
    if (ids.includes(state.selectedTradeId)) {
      state.selectedTradeId = "";
      state.selectedTradeEditing = false;
    }
    await loadTrades();
  } catch (error) {
    window.alert(friendlyActionError(error, "Unable to restore selected trades."));
  }
}

async function restoreTransaction(transactionId) {
  const id = transactionId || state.selectedTransactionId;
  if (!id) return;

  try {
    await fetchJson(`/api/transactions/${encodeURIComponent(id)}/restore`, { method: "POST" });
    markOverviewStale();
    state.transactionActionError = "";
    state.selectedTransactionId = "";
    state.selectedTransactionEditing = false;
    state.selectedTransactions.delete(id);
    await loadTransactions();
  } catch (error) {
    state.transactionActionError = friendlyActionError(error, "Unable to restore transaction.");
    render();
  }
}

async function restoreSelectedTransactions() {
  const ids = Array.from(state.selectedTransactions).filter(Boolean);
  if (!ids.length) return;

  try {
    await fetchJson("/api/transactions/restore", {
      method: "POST",
      body: JSON.stringify({ transaction_ids: ids }),
    });
    markOverviewStale();
    state.transactionActionError = "";
    state.selectedTransactions.clear();
    if (ids.includes(state.selectedTransactionId)) {
      state.selectedTransactionId = "";
      state.selectedTransactionEditing = false;
    }
    await loadTransactions();
  } catch (error) {
    window.alert(friendlyActionError(error, "Unable to restore selected transactions."));
  }
}

async function showTransactionStatement(transactionId) {
  const id = transactionId || "";
  if (!id) return;
  state.periodPanelOpen = false;
  state.selectedTransactionId = "";
  state.selectedTransactionEditing = false;
  state.transactionActionError = "";
  state.statement = {
    transactionId: id,
    data: null,
    loading: true,
    error: "",
  };
  render();

  try {
    const data = await fetchJson(`/api/transactions/${encodeURIComponent(id)}/statement`);
    state.statement = {
      transactionId: id,
      data,
      loading: false,
      error: "",
    };
  } catch (error) {
    state.statement = {
      transactionId: id,
      data: null,
      loading: false,
      error: friendlyActionError(error, "Unable to load imported statement."),
    };
  }
  render();
}

async function attachStatementFiles(fileList) {
  const id = state.selectedTransactionId;
  const files = Array.from(fileList || []);
  if (!id || !files.length) return;

  const formData = new FormData();
  files.forEach((file) => formData.append("files", file, file.name));

  try {
    const data = await fetchJson(`/api/transactions/${encodeURIComponent(id)}/statement/attachments`, {
      method: "POST",
      body: formData,
    });
    state.selectedTransactionEditing = false;
    state.transactionActionError = "";
    if (state.statement.transactionId === id) {
      state.statement = {
        transactionId: id,
        data,
        loading: false,
        error: "",
      };
    }
    await loadTransactions();
  } catch (error) {
    state.transactionActionError = friendlyActionError(error, "Unable to attach statement file.");
    render();
  }
}

async function deleteTransaction(transactionId) {
  const id = transactionId || state.selectedTransactionId;
  if (!id) return;
  const confirmed = window.confirm(`Move transaction ${id} to Deleted? It will stay in the source sheet for recovery.`);
  if (!confirmed) return;

  try {
    await fetchJson(`/api/transactions/${encodeURIComponent(id)}`, { method: "DELETE" });
    markOverviewStale();
    state.selectedTransactionId = "";
    state.selectedTransactionEditing = false;
    state.transactionActionError = "";
    state.selectedTransactions.delete(id);
    await loadTransactions();
  } catch (error) {
    state.transactionActionError = friendlyActionError(error, "Unable to delete transaction.");
    render();
  }
}

async function deleteAccount(accountId) {
  const id = accountId || state.selectedAccountId;
  if (!id) return;
  const confirmed = window.confirm(`Move account ${id} to Deleted? It will stay in the source sheet for recovery.`);
  if (!confirmed) return;

  try {
    await fetchJson(`/api/accounts/${encodeURIComponent(id)}`, { method: "DELETE" });
    markOverviewStale();
    state.selectedAccountId = "";
    state.selectedAccountEditing = false;
    state.accountActionError = "";
    state.selectedAccounts.delete(id);
    await loadAccounts();
  } catch (error) {
    state.accountActionError = friendlyActionError(error, "Unable to delete account.");
    render();
  }
}

async function deleteSelectedTransactions() {
  const ids = Array.from(state.selectedTransactions).filter(Boolean);
  if (!ids.length) return;
  const confirmed = window.confirm(`Move ${formatNumber(ids.length)} selected transactions to Deleted? They will stay in the source sheet for recovery.`);
  if (!confirmed) return;

  try {
    await fetchJson("/api/transactions", {
      method: "DELETE",
      body: JSON.stringify({ transaction_ids: ids }),
    });
    markOverviewStale();
    if (ids.includes(state.selectedTransactionId)) {
      state.selectedTransactionId = "";
      state.selectedTransactionEditing = false;
    }
    state.transactionActionError = "";
    state.selectedTransactions.clear();
    await loadTransactions();
  } catch (error) {
    window.alert(friendlyActionError(error, "Unable to delete selected transactions."));
  }
}

async function deleteSelectedAccounts() {
  const ids = Array.from(state.selectedAccounts).filter(Boolean);
  if (!ids.length) return;
  const confirmed = window.confirm(`Move ${formatNumber(ids.length)} selected accounts to Deleted? They will stay in the source sheet for recovery.`);
  if (!confirmed) return;

  try {
    await fetchJson("/api/accounts", {
      method: "DELETE",
      body: JSON.stringify({ account_ids: ids }),
    });
    markOverviewStale();
    if (ids.includes(state.selectedAccountId)) {
      state.selectedAccountId = "";
      state.selectedAccountEditing = false;
    }
    state.accountActionError = "";
    state.selectedAccounts.clear();
    await loadAccounts();
  } catch (error) {
    window.alert(friendlyActionError(error, "Unable to delete selected accounts."));
  }
}

async function deleteTrade(tradeId) {
  const id = tradeId || state.selectedTradeId;
  if (!id) return;
  const confirmed = window.confirm(`Move trade ${id} to Deleted? It will stay in the source sheet for recovery.`);
  if (!confirmed) return;

  try {
    await fetchJson(`/api/trades/${encodeURIComponent(id)}`, { method: "DELETE" });
    markOverviewStale();
    state.selectedTradeId = "";
    state.selectedTradeEditing = false;
    state.tradeActionError = "";
    state.selectedTrades.delete(id);
    await loadTrades();
  } catch (error) {
    state.tradeActionError = friendlyActionError(error, "Unable to delete trade.");
    render();
  }
}

async function deleteSelectedTrades() {
  const ids = Array.from(state.selectedTrades).filter(Boolean);
  if (!ids.length) return;
  const confirmed = window.confirm(`Move ${formatNumber(ids.length)} selected trades to Deleted? They will stay in the source sheet for recovery.`);
  if (!confirmed) return;

  try {
    await fetchJson("/api/trades", {
      method: "DELETE",
      body: JSON.stringify({ trade_ids: ids }),
    });
    markOverviewStale();
    if (ids.includes(state.selectedTradeId)) {
      state.selectedTradeId = "";
      state.selectedTradeEditing = false;
    }
    state.tradeActionError = "";
    state.selectedTrades.clear();
    await loadTrades();
  } catch (error) {
    window.alert(friendlyActionError(error, "Unable to delete selected trades."));
  }
}

async function permanentlyDeleteTransactions(transactionIds = []) {
  const ids = Array.from(transactionIds || []).filter(Boolean);
  if (!ids.length) return;
  const label = ids.length === 1 ? `transaction ${ids[0]}` : `${formatNumber(ids.length)} selected transactions`;
  const confirmed = window.confirm(`Delete ${label} forever? This removes the row from the source sheet and cannot be undone.`);
  if (!confirmed) return;

  try {
    await fetchJson("/api/transactions/permanent", {
      method: "DELETE",
      body: JSON.stringify({ transaction_ids: ids }),
    });
    markOverviewStale();
    if (ids.includes(state.selectedTransactionId)) {
      state.selectedTransactionId = "";
      state.selectedTransactionEditing = false;
    }
    if (ids.includes(state.statement.transactionId)) resetStatementPanel();
    state.transactionActionError = "";
    ids.forEach((id) => state.selectedTransactions.delete(id));
    await loadTransactions();
  } catch (error) {
    window.alert(friendlyActionError(error, "Unable to delete transactions forever."));
  }
}

async function permanentlyDeleteAccounts(accountIds = []) {
  const ids = Array.from(accountIds || []).filter(Boolean);
  if (!ids.length) return;
  const label = ids.length === 1 ? `account ${ids[0]}` : `${formatNumber(ids.length)} selected accounts`;
  const confirmed = window.confirm(`Delete ${label} forever? This removes the row from the source sheet and cannot be undone.`);
  if (!confirmed) return;

  try {
    await fetchJson("/api/accounts/permanent", {
      method: "DELETE",
      body: JSON.stringify({ account_ids: ids }),
    });
    markOverviewStale();
    if (ids.includes(state.selectedAccountId)) {
      state.selectedAccountId = "";
      state.selectedAccountEditing = false;
    }
    state.accountActionError = "";
    ids.forEach((id) => state.selectedAccounts.delete(id));
    await loadAccounts();
  } catch (error) {
    window.alert(friendlyActionError(error, "Unable to delete accounts forever."));
  }
}

async function permanentlyDeleteTrades(tradeIds = []) {
  const ids = Array.from(tradeIds || []).filter(Boolean);
  if (!ids.length) return;
  const label = ids.length === 1 ? `trade ${ids[0]}` : `${formatNumber(ids.length)} selected trades`;
  const confirmed = window.confirm(`Delete ${label} forever? This removes the row from the source sheet and cannot be undone.`);
  if (!confirmed) return;

  try {
    await fetchJson("/api/trades/permanent", {
      method: "DELETE",
      body: JSON.stringify({ trade_ids: ids }),
    });
    markOverviewStale();
    if (ids.includes(state.selectedTradeId)) {
      state.selectedTradeId = "";
      state.selectedTradeEditing = false;
    }
    state.tradeActionError = "";
    ids.forEach((id) => state.selectedTrades.delete(id));
    await loadTrades();
  } catch (error) {
    window.alert(friendlyActionError(error, "Unable to delete trades forever."));
  }
}

async function fetchJson(url, options = {}) {
  const isFormData = options.body instanceof FormData;
  const headers = {
    Accept: "application/json",
    ...(options.body && !isFormData ? { "Content-Type": "application/json" } : {}),
    ...(options.headers || {}),
  };
  const response = await fetch(url, { ...options, headers });
  if (!response.ok) {
    let message = `${response.status} ${response.statusText}`;
    try {
      const payload = await response.json();
      if (payload?.error) message = payload.error;
    } catch {
      // Fall back to the HTTP status when the response is not JSON.
    }
    const error = new Error(message);
    error.status = response.status;
    error.statusText = response.statusText;
    throw error;
  }
  return response.json();
}

async function fetchText(url, options = {}) {
  const response = await fetch(url, { ...options, headers: { Accept: "text/plain,text/markdown,*/*", ...(options.headers || {}) } });
  if (!response.ok) {
    const error = new Error(`${response.status} ${response.statusText}`);
    error.status = response.status;
    error.statusText = response.statusText;
    throw error;
  }
  const text = await response.text();
  if (/<!doctype html/i.test(text.slice(0, 80))) throw new Error("Changelog markdown was not available.");
  return text;
}

function friendlyFetchError(error) {
  return `Unable to load live data.${error.message ? ` ${error.message}` : ""}`.trim();
}

function friendlyActionError(error, fallback) {
  return `${fallback} ${error.message || ""}`.trim();
}

function updateTransactionSort(field) {
  if (state.transactionSort.field === field) {
    state.transactionSort.direction = state.transactionSort.direction === "asc" ? "desc" : "asc";
  } else {
    state.transactionSort = {
      field,
      direction: ["amount", "native_amount", "transaction_date", "posted_date"].includes(field) ? "desc" : "asc",
    };
  }
  state.transactionOffset = 0;
  state.selectedTransactions.clear();
}

function updateTradeSort(field) {
  if (state.tradeSort.field === field) {
    state.tradeSort.direction = state.tradeSort.direction === "asc" ? "desc" : "asc";
  } else {
    state.tradeSort = {
      field,
      direction: ["market_value", "realized_pl", "unrealized_pl", "activity_date", "exit_date", "price_as_of"].includes(field) ? "desc" : "asc",
    };
  }
  state.tradeOffset = 0;
  state.selectedTrades.clear();
  state.selectedTradeId = "";
  state.selectedTradeEditing = false;
  state.tradeActionError = "";
}

function updateAccountSort(field) {
  if (state.accountSort.field === field) {
    state.accountSort.direction = state.accountSort.direction === "asc" ? "desc" : "asc";
  } else {
    state.accountSort = {
      field,
      direction: ["balance", "native_balance"].includes(field) ? "desc" : "asc",
    };
  }
  state.accountOffset = 0;
  state.selectedAccounts.clear();
  state.selectedAccountId = "";
  state.selectedAccountEditing = false;
  state.accountActionError = "";
}

function updateMonthlyTargetSort(field) {
  if (state.monthlyTargetSort.field === field) {
    state.monthlyTargetSort.direction = state.monthlyTargetSort.direction === "asc" ? "desc" : "asc";
  } else {
    state.monthlyTargetSort = {
      field,
      direction: "desc",
    };
  }
}

function openGlobalSearchSection(view) {
  if (!["accounts", "transactions", "trades"].includes(view)) return;
  state.view = view;
  state.accountOffset = 0;
  state.transactionOffset = 0;
  state.tradeOffset = 0;
  state.selectedAccountId = "";
  state.selectedTransactionId = "";
  state.selectedTradeId = "";
  state.selectedAccountEditing = false;
  state.selectedTransactionEditing = false;
  state.selectedTradeEditing = false;
  if (view === "accounts") {
    state.accountView = "register";
    state.accountFilters = defaultAccountFilters();
  }
  if (view === "transactions") {
    state.transactionView = "register";
    state.transactionFilters = emptyTransactionFilters();
  }
  if (view === "trades") {
    state.tradeView = "register";
    state.tradeFilters = defaultTradeFilters();
  }
  resetStatementPanel();
  render();
  loadDataForView();
}

function openGlobalSearchResult(view, resultId) {
  if (!resultId) {
    openGlobalSearchSection(view);
    return;
  }
  if (!["accounts", "transactions", "trades"].includes(view)) return;
  state.view = view;
  state.accountOffset = 0;
  state.transactionOffset = 0;
  state.tradeOffset = 0;
  state.selectedAccountId = "";
  state.selectedTransactionId = "";
  state.selectedTradeId = "";
  state.selectedAccountEditing = false;
  state.selectedTransactionEditing = false;
  state.selectedTradeEditing = false;
  if (view === "accounts") {
    state.accountView = "register";
    state.accountFilters = defaultAccountFilters();
  }
  if (view === "transactions") {
    state.transactionView = "register";
    state.transactionFilters = emptyTransactionFilters();
  }
  if (view === "trades") {
    state.tradeView = "register";
    state.tradeFilters = defaultTradeFilters();
  }
  resetStatementPanel();
  if (view === "accounts") {
    state.selectedAccountId = resultId;
    state.accountActionError = "";
  } else if (view === "transactions") {
    state.selectedTransactionId = resultId;
    state.transactionActionError = "";
  } else if (view === "trades") {
    state.selectedTradeId = resultId;
    state.tradeActionError = "";
  }
  render();
  loadDataForView();
}

function applyCategoryFilter(category, transactionClass = "", label = "") {
  const nextCategory = taxonomyFilterValue("category_id", category);
  const nextClass = taxonomyFilterValue("transaction_class", transactionClass || state.transactionFilters.transaction_class || "");
  const currentDateFrom = state.transactionFilters.date_from;
  const currentDateTo = state.transactionFilters.date_to;
  state.view = "transactions";
  state.transactionView = "register";
  state.transactionFilters = {
    ...filtersForPeriod(),
    ...state.transactionFilters,
    category_id: nextCategory,
    transaction_class: nextClass,
  };
  if (currentDateFrom || currentDateTo) {
    state.transactionFilters.date_from = currentDateFrom;
    state.transactionFilters.date_to = currentDateTo;
  }
  if (nextCategory) {
    setQuickFilterChip("transactions", "category_id", nextCategory, label || taxonomyLabel(nextCategory));
  }
  state.transactionOffset = 0;
  state.selectedTransactions.clear();
  state.selectedTransactionId = "";
  state.selectedMonthlyTargetMonth = "";
  state.selectedYearlyTargetYear = "";
  state.targetDetailEditing = false;
  render();
  loadTransactions();
}

function openMonthlyTargetPeriod(dataset = {}) {
  const month = String(dataset.monthlyTargetMonth || dataset.month || "").slice(0, 7);
  if (!/^\d{4}-\d{2}$/.test(month)) return;
  syncPeriodFromTargetMonth(month);
  state.view = "transactions";
  state.transactionView = "monthlyTargets";
  state.query = "";
  if (elements.search) elements.search.value = "";
  state.periodPanelOpen = false;
  state.transactionFilters = emptyTransactionFilters(filtersForPeriod());
  state.transactionOffset = 0;
  state.selectedTransactions.clear();
  state.selectedTransactionId = "";
  state.selectedTransactionEditing = false;
  state.selectedMonthlyTargetMonth = "";
  state.selectedYearlyTargetYear = "";
  state.targetDetailEditing = false;
  state.transactionActionError = "";
  resetStatementPanel();
  loadTransactions();
}

function syncPeriodFromTargetMonth(month = "") {
  state.period.mode = "month";
  state.period.dayPickerMonth = "";
  state.period.dayMonth = month;
  state.period.month = month;
  state.period.year = Number(month.slice(0, 4)) || state.period.year;
  state.period.calendarYear = state.period.year;
}

function applyMonthlyTargetTransactionFilter(dataset = {}) {
  const month = String(dataset.monthlyTargetMonth || dataset.month || "").slice(0, 7);
  const range = heatmapDateRange(month, "month");
  if (range) {
    syncPeriodFromHeatmap(month, "month");
  }
  state.view = "transactions";
  state.transactionView = "register";
  state.query = "";
  if (elements.search) elements.search.value = "";
  state.periodPanelOpen = false;
  state.transactionFilters = emptyTransactionFilters({
    transaction_class: taxonomyFilterValue("transaction_class", dataset.transactionClass || ""),
    category_id: taxonomyFilterValue("category_id", dataset.category || ""),
    date_from: range?.dateFrom || filtersForPeriod().date_from,
    date_to: range?.dateTo || filtersForPeriod().date_to,
  });
  state.transactionOffset = 0;
  state.selectedTransactions.clear();
  state.selectedTransactionId = "";
  state.selectedTransactionEditing = false;
  state.selectedMonthlyTargetMonth = "";
  state.selectedYearlyTargetYear = "";
  state.targetDetailEditing = false;
  state.transactionActionError = "";
  resetStatementPanel();
  render();
  loadTransactions();
}

function applyAccountInsightFilter(dataset = {}) {
  state.view = "accounts";
  state.accountView = "register";
  state.query = "";
  elements.search.value = "";
  state.accountFilters = defaultAccountFilters({
    account_id: dataset.accountId || "",
    provider_id: dataset.providerId || "",
    capital_bucket: dataset.capitalBucket || "",
    account_type: dataset.accountType || "",
    account_currency: dataset.accountCurrency || "",
    account_status: dataset.accountStatus || "",
    review_status: dataset.reviewStatus || "",
    ledger_status: dataset.ledgerStatus || "",
    balance_sign: dataset.balanceSign || "",
  });
  state.accountOffset = 0;
  state.selectedAccounts.clear();
  state.selectedAccountId = "";
  state.selectedAccountEditing = false;
  state.accountActionError = "";
  render();
  loadAccounts();
}

function applyTransactionInsightFilter(dataset = {}) {
  const periodFilters = filtersForPeriod();
  state.view = "transactions";
  state.transactionView = "register";
  state.query = "";
  elements.search.value = "";
  state.transactionFilters = {
    ...periodFilters,
    transaction_class: taxonomyFilterValue("transaction_class", dataset.transactionClass || ""),
    category_id: taxonomyFilterValue("category_id", dataset.category || ""),
    income_source: dataset.incomeSource || "",
    statement_currency: dataset.statementCurrency || "",
    date_from: dataset.dateFrom || periodFilters.date_from,
    date_to: dataset.dateTo || periodFilters.date_to,
  };
  state.transactionOffset = 0;
  state.selectedTransactions.clear();
  state.selectedTransactionId = "";
  state.selectedTransactionEditing = false;
  state.transactionActionError = "";
  resetStatementPanel();
  render();
  loadTransactions();
}

function applyTradeInsightFilter(dataset = {}) {
  state.view = "trades";
  state.tradeView = "register";
  state.query = "";
  elements.search.value = "";
  state.tradeFilters = defaultTradeFilters({
    position_status: dataset.positionStatus || "",
    review_status: dataset.reviewStatus || "",
    ledger_status: dataset.ledgerStatus || "",
    provider_id: dataset.providerId || "",
    account_id: dataset.accountId || "",
    portfolio_id: dataset.portfolioId || "",
    instrument_type: dataset.instrumentType || "",
    trade_currency: dataset.tradeCurrency || "",
    quality_signal: dataset.qualitySignal || "",
    symbol: dataset.symbol || "",
    asset_name: dataset.assetName || "",
    trade_id: dataset.tradeId || "",
  });
  state.tradeOffset = 0;
  state.selectedTrades.clear();
  state.selectedTradeId = "";
  state.selectedTradeEditing = false;
  state.tradeActionError = "";
  render();
  loadTrades();
}

function applyHeatmapFilter(dataset) {
  const range = heatmapDateRange(dataset.heatmapDate, dataset.heatmapGranularity);
  if (!range) return;
  const stayInInsights = state.view === "transactions" && state.transactionView === "insights";
  syncPeriodFromHeatmap(dataset.heatmapDate, dataset.heatmapGranularity);
  state.view = "transactions";
  state.query = "";
  if (elements.search) elements.search.value = "";
  state.periodPanelOpen = false;
  state.transactionOffset = 0;
  state.selectedTransactions.clear();
  state.selectedTransactionId = "";
  state.selectedTransactionEditing = false;
  state.transactionActionError = "";
  resetStatementPanel();
  if (stayInInsights) {
    state.transactionView = "insights";
    state.transactionFilters = filtersForPeriod();
    loadTransactions({ preserveScroll: true });
    return;
  }
  state.transactionView = "register";
  state.transactionFilters = emptyTransactionFilters({
    transaction_class: taxonomyFilterValue("transaction_class", dataset.transactionClass || ""),
    date_from: range.dateFrom,
    date_to: range.dateTo,
  });
  render();
  loadTransactions();
}

function emptyTransactionFilters(overrides = {}) {
  return {
    source_system: "",
    transaction_class: "",
    transfer_scope: "",
    ledger_status: "",
    review_status: "",
    imported_transaction: "",
    category_id: "",
    subcategory_id: "",
    income_source: "",
    country_code: "",
    statement_currency: "",
    date_from: "",
    date_to: "",
    ...overrides,
  };
}

function defaultAccountFilters(overrides = {}) {
  return {
    account_id: "",
    provider_id: "",
    capital_bucket: "",
    account_type: "",
    account_currency: "",
    account_status: "",
    review_status: "",
    ledger_status: "",
    balance_sign: "",
    ...overrides,
  };
}

function defaultTradeFilters(overrides = {}) {
  return {
    position_status: "",
    review_status: "",
    ledger_status: "",
    provider_id: "",
    trade_id: "",
    account_id: "",
    portfolio_id: "",
    symbol: "",
    asset_name: "",
    instrument_type: "",
    trade_currency: "",
    entry_date: "",
    exit_date: "",
    price_as_of: "",
    quality_signal: "",
    ...overrides,
  };
}

function heatmapDateRange(value, granularity) {
  const raw = String(value || "");
  if (granularity === "day" && /^\d{4}-\d{2}-\d{2}$/.test(raw)) {
    return { dateFrom: raw, dateTo: raw };
  }
  if (granularity === "month" && /^\d{4}-\d{2}$/.test(raw)) {
    const [year, month] = raw.split("-").map(Number);
    return {
      dateFrom: `${raw}-01`,
      dateTo: isoDate(new Date(year, month, 0)),
    };
  }
  if (granularity === "year" && /^\d{4}$/.test(raw)) {
    return {
      dateFrom: `${raw}-01-01`,
      dateTo: `${raw}-12-31`,
    };
  }
  return null;
}

function heatmapRangeLabel(value, granularity) {
  const raw = String(value || "");
  if (granularity === "day") return formatDisplayDate(raw);
  if (granularity === "month") return monthLabel(raw);
  if (granularity === "year") return raw;
  return raw;
}

function syncPeriodFromHeatmap(value, granularity) {
  const raw = String(value || "");
  if (granularity === "day" && raw.length >= 10) {
    state.period.mode = "day";
    state.period.day = raw.slice(0, 10);
    state.period.dayMonth = raw.slice(0, 7);
    state.period.dayPickerMonth = "";
    state.period.month = state.period.dayMonth;
    state.period.year = Number(raw.slice(0, 4)) || state.period.year;
    state.period.calendarYear = state.period.year;
  }
  if (granularity === "month" && raw.length >= 7) {
    state.period.mode = "month";
    state.period.dayPickerMonth = "";
    state.period.dayMonth = raw.slice(0, 7);
    state.period.month = raw.slice(0, 7);
    state.period.year = Number(raw.slice(0, 4)) || state.period.year;
    state.period.calendarYear = state.period.year;
  }
  if (granularity === "year" && /^\d{4}$/.test(raw)) {
    state.period.mode = "year";
    state.period.dayPickerMonth = "";
    state.period.year = Number(raw);
    state.period.calendarYear = state.period.year;
    state.period.yearRangeStart = yearRangeStartFor(state.period.year);
  }
}

function nextPeriodMode(mode = state.period.mode) {
  if (mode === "month") return "year";
  if (mode === "year") return "all";
  return "month";
}

function cyclePeriodMode() {
  state.periodPanelOpen = false;
  updatePeriod("mode", nextPeriodMode());
}

function updatePeriod(key, value) {
  if (key === "mode") {
    const previousMode = state.period.mode;
    state.period.mode = value || "month";
    state.period.dayPickerMonth = "";
    if (state.period.mode === "day") {
      if (previousMode === "month" && state.period.month) {
        state.period.day = dayInMonthOrFirst(state.period.day, state.period.month);
      } else if (previousMode === "year") {
        state.period.day = `${String(state.period.year || currentYear()).padStart(4, "0")}-01-01`;
      }
      state.period.dayMonth = String(state.period.day || currentDateKey()).slice(0, 7);
      state.period.month = state.period.dayMonth;
      state.period.year = Number(state.period.day.slice(0, 4)) || state.period.year;
      state.period.calendarYear = state.period.year;
    }
    if (state.period.mode === "month") {
      state.period.calendarYear = Number(String(state.period.month).slice(0, 4)) || state.period.calendarYear;
    }
    if (state.period.mode === "year") {
      state.period.yearRangeStart = yearRangeStartFor(state.period.year);
    }
  }
  if (key === "day" && value) {
    state.period.mode = "day";
    state.period.day = value;
    state.period.dayMonth = value.slice(0, 7);
    state.period.dayPickerMonth = "";
    state.period.month = state.period.dayMonth;
    state.period.year = Number(value.slice(0, 4)) || state.period.year;
    state.period.calendarYear = state.period.year;
  }
  if (key === "month" && value) {
    state.period.mode = "month";
    state.period.dayPickerMonth = "";
    state.period.month = value;
    state.period.year = Number(value.slice(0, 4)) || state.period.year;
    state.period.calendarYear = state.period.year;
  }
  if (key === "year" && value) {
    state.period.mode = "year";
    state.period.dayPickerMonth = "";
    state.period.year = Number(value) || state.period.year;
    state.period.calendarYear = state.period.year;
    state.period.yearRangeStart = yearRangeStartFor(state.period.year);
  }
  state.transactionFilters = filtersForPeriod();
  state.transactionOffset = 0;
  state.selectedTransactions.clear();
  state.selectedTransactionId = "";
  render();
  if (state.view === "transactions") {
    loadTransactions();
  } else {
    loadOverview();
  }
}

function handlePeriodMonthClick(value) {
  if (!value) return;
  if (periodMonthClickTimer && pendingPeriodMonth === value) {
    openPeriodDayPicker(value);
    return;
  }
  window.clearTimeout(periodMonthClickTimer);
  pendingPeriodMonth = value;
  periodMonthClickTimer = window.setTimeout(() => {
    periodMonthClickTimer = null;
    const month = pendingPeriodMonth;
    pendingPeriodMonth = "";
    updatePeriod("month", month);
  }, 280);
}

function openPeriodDayPicker(value) {
  if (!value) return;
  window.clearTimeout(periodMonthClickTimer);
  periodMonthClickTimer = null;
  pendingPeriodMonth = "";
  state.period.mode = "month";
  state.period.dayPickerMonth = value;
  state.period.dayMonth = value;
  state.period.month = value;
  state.period.year = Number(value.slice(0, 4)) || state.period.year;
  state.period.calendarYear = state.period.year;
  state.transactionFilters = filtersForPeriod();
  state.transactionOffset = 0;
  state.selectedTransactions.clear();
  state.selectedTransactionId = "";
  render();
  if (state.view === "transactions") {
    loadTransactions();
  } else {
    loadOverview();
  }
}

function stepPeriodDayMonth(step) {
  const month = shiftMonthKey(state.period.dayPickerMonth || state.period.dayMonth || state.period.day?.slice(0, 7) || currentMonthKey(), step);
  if (state.period.dayPickerMonth) {
    state.period.dayPickerMonth = month;
    state.period.month = month;
  } else {
    state.period.dayMonth = month;
  }
  state.period.calendarYear = Number(month.slice(0, 4)) || state.period.calendarYear;
  render();
}

function stepPeriodCalendarYear(step) {
  state.period.calendarYear = Number(state.period.calendarYear || currentYear()) + step;
  render();
}

function stepPeriodYearRange(step) {
  state.period.yearRangeStart = Number(state.period.yearRangeStart || yearRangeStartFor(state.period.year)) + step;
  render();
}

function periodStepLabel(step) {
  const direction = Number(step) < 0 ? "previous" : "next";
  if (state.period.mode === "day") return `Go to ${direction} day`;
  if (state.period.mode === "year") return `Go to ${direction} year`;
  if (state.period.mode === "month") return `Go to ${direction} month`;
  return "Reporting period cannot be stepped";
}

function stepSelectedPeriod(step) {
  const amount = Number(step || 0);
  if (!amount || state.period.mode === "all") return;
  if (state.period.mode === "day") {
    updatePeriod("day", shiftDateKey(state.period.day || currentDateKey(), amount));
    return;
  }
  if (state.period.mode === "year") {
    updatePeriod("year", String(Number(state.period.year || currentYear()) + amount));
    return;
  }
  updatePeriod("month", shiftMonthKey(state.period.month || currentMonthKey(), amount));
}

function yearRangeStartFor(year) {
  return Number(year || currentYear()) - 5;
}

function periodParams() {
  const params = new URLSearchParams({ period: state.period.mode });
  if (state.period.mode === "day") params.set("day", state.period.day);
  if (state.period.mode === "month") params.set("month", state.period.month);
  if (state.period.mode === "year") params.set("year", String(state.period.year));
  return params;
}

function defaultNewTransactionValues() {
  const date = defaultTransactionDateForPeriod();
  const activeClass = state.transactionFilters.transaction_class || "";
  const transactionClass = isSpecialTransactionTab(activeClass) ? "" : taxonomyFilterValue("transaction_class", activeClass);
  return {
    source_system: "manual_entry",
    ledger_status: "accountable",
    transaction_date: date,
    posted_date: date,
    transaction_class: transactionClass,
    transfer_scope: "not_applicable",
    statement_currency: "EUR",
    imported_transaction: "no",
    review_status: "review_required",
  };
}

function isSpecialTransactionTab(value) {
  return [
    REVIEW_REQUIRED_TAB,
    DELETED_TRANSACTION_TAB,
    ACCOUNTABLE_TRANSACTION_TAB,
    NOT_ACCOUNTABLE_TRANSACTION_TAB,
  ].includes(value);
}

function defaultTransactionDateForPeriod() {
  if (state.period.mode === "day" && state.period.day) return state.period.day;
  if (state.period.mode === "month" && state.period.month) {
    return state.period.month === currentMonthKey() ? currentDateKey() : `${state.period.month}-01`;
  }
  if (state.period.mode === "year" && state.period.year) {
    return Number(state.period.year) === currentYear() ? currentDateKey() : `${state.period.year}-01-01`;
  }
  return currentDateKey();
}

function defaultTransactionFilters() {
  return emptyTransactionFilters();
}

function filtersForPeriod() {
  const now = new Date();
  let firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  let lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  if (state.period.mode === "day" && state.period.day) {
    firstDay = new Date(`${state.period.day}T00:00:00`);
    lastDay = firstDay;
  } else if (state.period.mode === "month" && state.period.month) {
    const [year, month] = state.period.month.split("-").map(Number);
    firstDay = new Date(year, month - 1, 1);
    lastDay = new Date(year, month, 0);
  } else if (state.period.mode === "year") {
    const year = Number(state.period.year || now.getFullYear());
    firstDay = new Date(year, 0, 1);
    lastDay = new Date(year, 11, 31);
  }

  return emptyTransactionFilters({
    date_from: state.period.mode === "all" ? "" : isoDate(firstDay),
    date_to: state.period.mode === "all" ? "" : isoDate(lastDay),
  });
}

function sourceStats() {
  const stats = state.overview?.sheet_stats || [
    { name: "accounts_register", rows: 0, columns: 15, status: "Pending" },
    { name: "transactions_register", rows: 0, columns: 19, status: "Pending" },
    { name: "trades_register", rows: 0, columns: 23, status: "Pending" },
  ];
  return stats.map((item) => ({
    ...item,
    purpose: registerPurpose[item.name] || "",
  }));
}

function filterRows(rows, keys) {
  const query = state.query.trim().toLowerCase();
  if (!query) return rows;
  return rows.filter((row) =>
    keys.some((key) => String(row[key] || "").toLowerCase().includes(query)),
  );
}

function paintIcons(root = document) {
  root.querySelectorAll("[data-icon]").forEach((node) => {
    const icon = icons[node.dataset.icon];
    if (icon) node.innerHTML = icon;
  });
}

function transactionLimit() {
  return normalizePageSize(state.transactionPageSize);
}

function accountLimit() {
  return normalizePageSize(state.accountPageSize);
}

function tradeLimit() {
  return normalizePageSize(state.tradePageSize);
}

function tablePageStep(value) {
  return value === "all" ? 0 : Number(value) || 0;
}

function amountClass(row) {
  if (row.transaction_class === "income") return "positive";
  if (row.transaction_class === "expense") return "negative";
  return "";
}

function signedClass(value) {
  const numeric = numericValue(value);
  if (numeric > 0) return "positive";
  if (numeric < 0) return "negative";
  return "";
}

function signedCurrency(row) {
  if (state.privacyMode) return privacyAmount();
  const amount = Math.abs(Number(row.amount_eur_converted || 0));
  if (row.transaction_class === "income") return `+${formatCurrency(amount, "EUR")}`;
  if (row.transaction_class === "expense") return `-${formatCurrency(amount, "EUR")}`;
  return formatCurrency(amount, "EUR");
}

function signedNativeCurrency(row) {
  if (state.privacyMode) return privacyAmount();
  const amount = Math.abs(Number(row.statement_amount || 0));
  const currency = row.statement_currency || "EUR";
  if (row.transaction_class === "income") return `+${formatCurrency(amount, currency, { project: false })}`;
  if (row.transaction_class === "expense") return `-${formatCurrency(amount, currency, { project: false })}`;
  return formatCurrency(amount, currency, { project: false });
}

function formatAccountMoney(value, currency = "EUR", options = {}) {
  return formatWholeCurrency(numericValue(value), currency || "EUR", options);
}

function formatTradeMoney(value, currency = "EUR") {
  const amount = numericValue(value);
  if (!amount) return "-";
  return formatCurrency(amount, currency || "EUR", { project: false });
}

function signedTradeMoney(value, currency = "EUR") {
  const amount = numericValue(value);
  if (!amount) return "-";
  return signedAmount(amount, currency || "EUR", { project: false });
}

function tradePlCell(value, pct, currency = "EUR") {
  const amount = signedTradeMoney(value, currency);
  return amount === "-" && !numericValue(pct) ? "-" : safe(amount);
}

function tradePlLabel(value, pct, currency = "EUR") {
  const amount = signedTradeMoney(value, currency);
  const pctValue = numericValue(pct);
  if (amount === "-" && !pctValue) return "-";
  return `${amount} (${signedPercent(pctValue)})`;
}

function formatTradePrice(value, currency = "EUR") {
  const amount = numericValue(value);
  if (!amount) return "-";
  return formatCurrency(amount, currency || "EUR", { project: false });
}

function formatQuantity(value) {
  const amount = numericValue(value);
  if (!amount) return "-";
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 6 }).format(amount);
}

function countryCell(value) {
  const code = normalizeCountryCode(value);
  if (!code) return `<span class="muted-cell">-</span>`;
  const label = countryName(code);
  return `
    <span class="display-token country-token" title="${safe(label || code)}">
      <span class="country-flag" aria-hidden="true">${safe(countryFlag(code))}</span>
      <span>${safe(code)}</span>
    </span>
  `;
}

function currencyCell(value) {
  const code = normalizeCurrencyCode(value);
  if (!code) return `<span class="muted-cell">-</span>`;
  const symbol = currencySymbol(code);
  const label = currencyName(code);
  return `
    <span class="display-token currency-token" title="${safe(label || code)}">
      <span>${safe(code)}</span>
      ${symbol ? `<span class="currency-symbol">${safe(symbol)}</span>` : ""}
    </span>
  `;
}

function statementNativeAmount(currency, amount) {
  const code = normalizeCurrencyCode(currency);
  const value = String(amount ?? "").trim();
  if (!value && !code) return "-";
  return `
    <span class="native-amount-token">
      ${code ? currencyCell(code) : ""}
      <span>${safe(value || "0")}</span>
    </span>
  `;
}

function normalizeCountryCode(value) {
  const code = String(value || "").trim().toUpperCase();
  return /^[A-Z]{2}$/.test(code) ? code : "";
}

function normalizeCurrencyCode(value) {
  const code = String(value || "").trim().toUpperCase();
  return /^[A-Z]{3}$/.test(code) ? code : "";
}

function countryFlag(code) {
  const normalized = normalizeCountryCode(code);
  if (!normalized) return "";
  return Array.from(normalized)
    .map((character) => String.fromCodePoint(127397 + character.charCodeAt(0)))
    .join("");
}

function countryDisplayName(code) {
  const normalized = normalizeCountryCode(code);
  if (!normalized) return "";
  if (COUNTRY_NAME_OVERRIDES[normalized]) return COUNTRY_NAME_OVERRIDES[normalized];
  try {
    return new Intl.DisplayNames(["en"], { type: "region" }).of(normalized) || normalized;
  } catch {
    return normalized;
  }
}

function countryOptions() {
  const byCode = new Map();
  ISO_COUNTRY_CODES.forEach((code) => {
    const normalized = normalizeCountryCode(code);
    if (normalized) byCode.set(normalized, { code: normalized, name: countryDisplayName(normalized) });
  });
  (state.transactions?.filters?.countries || []).forEach((option) => {
    const normalized = normalizeCountryCode(optionValue(option));
    if (!normalized) return;
    const sourceName = option && typeof option === "object" ? option.official_name || option.name || "" : "";
    byCode.set(normalized, { code: normalized, name: sourceName || countryDisplayName(normalized) });
  });
  return Array.from(byCode.values()).sort((left, right) => {
    const nameCompare = String(left.name || "").localeCompare(String(right.name || ""));
    return nameCompare || left.code.localeCompare(right.code);
  });
}

function countryCodeFromInput(value) {
  const text = String(value || "").trim();
  if (!text) return "";
  const direct = normalizeCountryCode(text);
  if (direct) return direct;
  const compact = text.replace(/[^A-Za-z]/g, "").toUpperCase();
  if (COUNTRY_CODE_ALIASES[compact]) return COUNTRY_CODE_ALIASES[compact];
  const delimiterMatch = text.match(/([A-Za-z]{2})\s*(?:·|-)/);
  if (delimiterMatch) {
    const normalized = normalizeCountryCode(delimiterMatch[1]);
    if (normalized) return normalized;
  }
  const lowered = text.toLowerCase();
  const match = countryOptions().find((option) => {
    const code = normalizeCountryCode(optionValue(option));
    const name = String(option.name || countryDisplayName(code)).toLowerCase();
    const label = countryOptionLabel(code, option.name).toLowerCase();
    return lowered === name || lowered === label || lowered === code.toLowerCase();
  });
  return match ? normalizeCountryCode(optionValue(match)) : "";
}

function countryName(code) {
  const normalized = normalizeCountryCode(code);
  if (!normalized) return "";
  const option = (state.transactions?.filters?.countries || []).find((item) => optionValue(item).toUpperCase() === normalized);
  return option?.official_name || option?.name || countryDisplayName(normalized);
}

function currencyName(code) {
  const normalized = normalizeCurrencyCode(code);
  const option = (state.transactions?.filters?.currencies || []).find((item) => optionValue(item).toUpperCase() === normalized);
  return option?.name || normalized;
}

function countryOptionLabel(code, name = "") {
  const normalized = normalizeCountryCode(code);
  if (!normalized) return String(code || "");
  return `${countryFlag(normalized)} ${normalized}${name ? ` · ${name}` : ""}`;
}

function currencyOptionLabel(code, name = "") {
  const normalized = normalizeCurrencyCode(code);
  if (!normalized) return String(code || "");
  const symbol = currencySymbol(normalized);
  return `${normalized}${symbol ? ` ${symbol}` : ""}${name ? ` · ${name}` : ""}`;
}

function currencySymbol(currency) {
  const code = normalizeCurrencyCode(currency);
  if (!code) return "";
  if (currencySymbolOverrides[code]) return currencySymbolOverrides[code];
  try {
    const parts = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: code,
      currencyDisplay: "narrowSymbol",
    }).formatToParts(0);
    const symbol = parts.find((part) => part.type === "currency")?.value || "";
    return symbol && symbol !== code ? symbol : "";
  } catch {
    return "";
  }
}

function formatNumber(value) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(Number(value || 0));
}

function formatPlural(value, singular, plural = `${singular}s`) {
  const count = numericValue(value);
  return `${formatNumber(count)} ${Math.abs(count) === 1 ? singular : plural}`;
}

function numericValue(value, fallback = 0) {
  const numeric = Number(String(value ?? "").replace(/,/g, ""));
  return Number.isFinite(numeric) ? numeric : fallback;
}

function formatCurrency(value, currency = "EUR", options = {}) {
  if (state.privacyMode) return privacyAmount();
  const money = projectMoneyValue(value, currency, options);
  const numeric = money.value;
  const code = money.currency;
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: code,
      maximumFractionDigits: Math.abs(numeric) >= 1000 ? 0 : 2,
    }).format(numeric);
  } catch {
    return `${code} ${formatNumberForCurrency(numeric)}`;
  }
}

function formatWholeCurrency(value, currency = "EUR", options = {}) {
  if (state.privacyMode) return privacyAmount();
  const money = projectMoneyValue(value, currency, options);
  const numeric = money.value;
  const code = money.currency;
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: code,
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
    }).format(numeric);
  } catch {
    return `${code} ${formatNumberForCurrency(numeric, 0)}`;
  }
}

function formatNumberForCurrency(value, maximumFractionDigits = 2) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits,
    minimumFractionDigits: 0,
  }).format(Number(value || 0));
}

function formatNumberForInput(value, fractionDigits = 0) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return "";
  const formatted = numeric.toFixed(Math.max(0, Number(fractionDigits) || 0));
  if (!formatted.includes(".")) return formatted;
  return formatted.replace(/(\.\d*?[1-9])0+$/, "$1").replace(/\.0+$/, "");
}

function signedAmount(value, currency = "EUR", options = {}) {
  if (state.privacyMode) return privacyAmount();
  const numeric = Number(value || 0);
  return `${numeric >= 0 ? "+" : "-"}${formatCurrency(Math.abs(numeric), currency, options)}`;
}

function signedWholeAmount(value, currency = "EUR", options = {}) {
  if (state.privacyMode) return privacyAmount();
  const numeric = Number(value || 0);
  return `${numeric >= 0 ? "+" : "-"}${formatWholeCurrency(Math.abs(numeric), currency, options)}`;
}

function signedPercent(value) {
  const numeric = Number(value || 0);
  return `${numeric >= 0 ? "+" : "-"}${formatPercent(Math.abs(numeric))}`;
}

function formatRunway(value) {
  const numeric = Number(value || 0);
  if (!Number.isFinite(numeric) || numeric <= 0) return "0";
  return numeric >= 10 ? numeric.toFixed(0) : numeric.toFixed(1);
}

function formatPercent(value) {
  const numeric = Number.isFinite(Number(value)) ? Number(value) : 0;
  return `${numeric.toFixed(Math.abs(numeric) >= 10 ? 0 : 1)}%`;
}

function percentOf(value, total) {
  const numerator = Number(value || 0);
  const denominator = Math.abs(Number(total || 0));
  return denominator ? (numerator / denominator) * 100 : 0;
}

function currentMonthKey() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

function currentDateKey() {
  return isoDate(new Date());
}

function currentYear() {
  return new Date().getFullYear();
}

function shiftMonthKey(value, step) {
  const [year, month] = String(value || currentMonthKey()).split("-").map(Number);
  const date = new Date(year, month - 1 + Number(step || 0), 1);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function shiftDateKey(value, step) {
  const [year, month, day] = String(value || currentDateKey()).split("-").map(Number);
  const date = year && month && day ? new Date(year, month - 1, day) : new Date();
  date.setDate(date.getDate() + Number(step || 0));
  return isoDate(date);
}

function monthEndKey(value) {
  const [year, month] = String(value || currentMonthKey()).split("-").map(Number);
  if (!year || !month) return currentDateKey();
  return isoDate(new Date(year, month, 0));
}

function dayInMonthOrFirst(day, month) {
  const current = String(day || currentDateKey());
  return current.startsWith(`${month}-`) ? current : `${month}-01`;
}

function monthLabel(value) {
  const [year, month] = String(value || currentMonthKey()).split("-");
  if (!year || !month) return value || "";
  const date = new Date(Number(year), Number(month) - 1, 1);
  if (Number.isNaN(date.getTime())) return value || "";
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

function shortMonthLabel(value) {
  const [year, month] = String(value || currentMonthKey()).split("-");
  if (!year || !month) return value || "";
  const date = new Date(Number(year), Number(month) - 1, 1);
  if (Number.isNaN(date.getTime())) return value || "";
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function formatShortCurrency(value, currency = "EUR", options = {}) {
  if (state.privacyMode) return privacyAmount();
  const money = projectMoneyValue(value, currency, options);
  const numeric = numericValue(money.value);
  const sign = numeric < 0 ? "-" : "";
  const abs = Math.abs(numeric);
  const code = money.currency;
  const compact = (amount) => {
    try {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: code,
        maximumFractionDigits: amount >= 100 ? 0 : 1,
      }).format(amount);
    } catch {
      return `${code} ${formatNumberForCurrency(amount, amount >= 100 ? 0 : 1)}`;
    }
  };
  if (abs >= 1_000_000) return `${sign}${compact(abs / 1_000_000)}m`;
  if (abs >= 1_000) return `${sign}${compact(abs / 1_000)}k`;
  return formatWholeCurrency(numeric, code, { project: false });
}

function formatChartAxisCurrency(value, currency = "EUR", options = {}) {
  if (state.privacyMode) return privacyAmount();
  const money = projectMoneyValue(value, currency, options);
  const numeric = numericValue(money.value);
  const sign = numeric < 0 ? "-" : "";
  const abs = Math.abs(numeric);
  const code = money.currency;
  const symbol = currencySymbol(code) || `${code} `;
  const compactValue = (amount, suffix) => {
    const fixed = amount >= 10 ? amount.toFixed(1) : amount.toFixed(2);
    return `${sign}${symbol}${fixed.replace(/\.?0+$/, "")}${suffix}`;
  };
  if (abs >= 1_000_000) return compactValue(abs / 1_000_000, "m");
  if (abs >= 1_000) return `${sign}${symbol}${formatNumber(Math.round(abs / 1000))}k`;
  return formatWholeCurrency(numeric, code, { project: false });
}

function privacyAmount() {
  return "****";
}

function transactionDateLabel() {
  const { date_from: from, date_to: to } = state.transactionFilters;
  if (!from || !to) return "All dates";
  return `${formatDisplayDate(from)} - ${formatDisplayDate(to)}`;
}

function transactionPeriodScope() {
  if (state.view !== "transactions") return null;
  const { date_from: from, date_to: to } = state.transactionFilters;
  if (!from && !to) return { icon: "globe", label: "All" };
  if (!from || !to) return null;
  if (from === to) return { icon: "calendar", label: formatDisplayDate(from) };
  if (isFullYearRange(from, to)) return { icon: "calendarYear", label: from.slice(0, 4) };
  if (isFullMonthRange(from, to)) return { icon: "calendar", label: monthLabel(from.slice(0, 7)) };
  return { icon: "calendar", label: `${formatDisplayDate(from)} - ${formatDisplayDate(to)}` };
}

function isFullMonthRange(from, to) {
  if (!/^\d{4}-\d{2}-01$/.test(from)) return false;
  const [year, month] = from.slice(0, 7).split("-").map(Number);
  return to === isoDate(new Date(year, month, 0));
}

function isFullYearRange(from, to) {
  const year = from.slice(0, 4);
  return /^\d{4}$/.test(year) && from === `${year}-01-01` && to === `${year}-12-31`;
}

function formatDisplayDate(value) {
  if (!value) return "";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function isoDate(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

const labelTokenOverrides = {
  adcb: "ADCB",
  atm: "ATM",
  cbd: "CBD",
  cfd: "CFD",
  etf: "ETF",
  ev: "EV",
  fab: "FAB",
  ibkr: "IBKR",
  ing: "ING",
  nn: "NN",
  pcr: "PCR",
  ppe: "PPE",
  touchpoints: "TouchPoints",
  usd: "USD",
  eur: "EUR",
  aed: "AED",
  gbp: "GBP",
  ron: "RON",
  omr: "OMR",
  try: "TRY",
  thb: "THB",
  tzs: "TZS",
  vnd: "VND",
};

const labelExactOverrides = {
  "capital.com": "Capital.com",
  capitaldotcom: "Capital.com",
  card_payment: "Card Payment",
  currency_exchange: "Currency Exchange",
  manual_entry: "Manual Entry",
  paypal: "PayPal",
  plus500: "Plus500",
  revolut: "Revolut",
  tastytrade: "Tastytrade",
  topup: "Top Up",
  touchpoints: "TouchPoints",
  tradezero: "TradeZero",
  traderzero: "TradeZero",
  trading212: "Trading212",
  transfers: "Transfer",
};

const taxonomyAliases = {
  expense: "expense",
  expenses: "expense",
  income: "income",
  incomes: "income",
  card_payment: "card_payment",
  card_payments: "card_payment",
  deposit: "deposit",
  deposits: "deposit",
  topup: "topup",
  topups: "topup",
  top_up: "topup",
  top_ups: "topup",
  exchange: "currency_exchange",
  exchanges: "currency_exchange",
  not_applicable: "not_applicable",
  transfer: "transfer",
  transfers: "transfer",
  wire_transfer: "transfer",
  bank_transfer: "transfer",
  uncategorized: "uncategorized",
};

const taxonomyFields = new Set(["transaction_class", "transfer_scope", "category_id", "subcategory_id"]);

function canonicalTaxonomyValue(value) {
  const normalized = String(value || "").trim().toLowerCase().replace(/[\s-]+/g, "_");
  return taxonomyAliases[normalized] || normalized;
}

function taxonomyFilterValue(field, value) {
  return taxonomyFields.has(field) ? canonicalTaxonomyValue(value) : String(value || "").trim();
}

function taxonomyLabel(value) {
  return labelize(canonicalTaxonomyValue(value));
}

function labelize(value) {
  const raw = String(value || "").trim();
  const exact = labelExactOverrides[raw.toLowerCase()];
  if (exact) return exact;
  return raw
    .split("_")
    .map((part) => labelTokenOverrides[part.toLowerCase()] || part.replace(/\b\w/g, (character) => character.toUpperCase()))
    .join(" ");
}

function kebabCase(value) {
  return String(value || "")
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
}

function safe(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
