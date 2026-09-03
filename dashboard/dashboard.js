(function () {
    const SESSION_KEY = 'dashlite.auth.session';
    const API_BASE = '/api';
    const REFRESH_INTERVAL_MS = 30000;
    const DEFAULT_SLIDE_INTERVAL_MS = 5000;
    const VISIBLE_TICKER_ROWS = 2;

    const usernameEl = document.getElementById('sidebarUsername');
    const onlineCountEl = document.getElementById('onlineCount');
    const activityFeedEl = document.getElementById('activityFeed');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebarCloseButton = document.getElementById('sidebarCloseButton');
    const dashboardSidebar = document.getElementById('dashboardSidebar');
    const dashboardBackdrop = document.getElementById('dashboardBackdrop');
    const fullscreenButton = document.getElementById('fullscreenToggle');
    const logoutButton = document.getElementById('logoutButton');
    const walletBalance = document.getElementById('walletBalance');
    const walletMenu = document.querySelector('.wallet-menu');
    const walletDropdown = document.getElementById('walletDropdown');
    const walletDepositLink = document.querySelector('[data-wallet-deposit]');
    const telegramSupportLink = document.getElementById('telegramSupportLink');
    const depositBalance = document.getElementById('depositBalance');
    const cryptoTabs = document.getElementById('cryptoTabs');
    const selectedCryptoName = document.getElementById('selectedCryptoName');
    const depositTimer = document.getElementById('depositTimer');
    const depositNetworkNote = document.getElementById('depositNetworkNote');
    const depositQr = document.getElementById('depositQr');
    const depositAddress = document.getElementById('depositAddress');
    const copyDepositAddress = document.getElementById('copyDepositAddress');
    const copyDepositStatus = document.getElementById('copyDepositStatus');
    const paidDepositButton = document.getElementById('paidDepositButton');
    const paidDepositModal = document.getElementById('paidDepositModal');
    const closePaidModal = document.getElementById('closePaidModal');
    const paidDepositForm = document.getElementById('paidDepositForm');
    const depositAmount = document.getElementById('depositAmount');
    const depositTxid = document.getElementById('depositTxid');
    const depositScreenshot = document.getElementById('depositScreenshot');
    const paidDepositStatus = document.getElementById('paidDepositStatus');
    const depositHistoryBody = document.getElementById('depositHistoryBody');
    const bonusTiers = document.getElementById('bonusTiers');
    const cartCount = document.getElementById('cartCount');
    const cartTableBody = document.getElementById('cartTableBody');
    const cartStatus = document.getElementById('cartStatus');
    const cartDiscount = document.getElementById('cartDiscount');
    const cartTotal = document.getElementById('cartTotal');
    const selectAllCartItems = document.getElementById('selectAllCartItems');
    const removeSelectedCartItems = document.getElementById('removeSelectedCartItems');
    const completeOrder = document.getElementById('completeOrder');
    const virtualCardPreview = document.getElementById('virtualCardPreview');
    const virtualCardType = document.getElementById('virtualCardType');
    const virtualCardAmount = document.getElementById('virtualCardAmount');
    const virtualCardName = document.getElementById('virtualCardName');
    const virtualCardPreviewNote = document.getElementById('virtualCardPreviewNote');
    const virtualCardForm = document.getElementById('virtualCardForm');
    const virtualCardStatus = document.getElementById('virtualCardStatus');
    const virtualCardBalance = document.getElementById('virtualCardBalance');
    const previewNetwork = document.getElementById('previewNetwork');
    const previewNumber = document.getElementById('previewNumber');
    const previewExpiry = document.getElementById('previewExpiry');
    const previewCvv = document.getElementById('previewCvv');
    const previewName = document.getElementById('previewName');
    const virtualCardsTableBody = document.getElementById('virtualCardsTableBody');
    const refreshVirtualCards = document.getElementById('refreshVirtualCards');
    const cardPurchaseStatus = document.getElementById('cardPurchaseStatus');
    const purchaseTableBody = document.getElementById('purchaseTableBody');
    const purchaseStatus = document.getElementById('purchaseStatus');
    const refreshPurchases = document.getElementById('refreshPurchases');
    const purchaseDetailsModal = document.getElementById('purchaseDetailsModal');
    const purchaseDetailsContent = document.getElementById('purchaseDetailsContent');
    const purchaseDetailsClose = document.getElementById('purchaseDetailsClose');
    const virtualCardDetailsModal = document.getElementById('virtualCardDetailsModal');
    const virtualCardDetailsContent = document.getElementById('virtualCardDetailsContent');
    const virtualCardDetailsClose = document.getElementById('virtualCardDetailsClose');
    const attentionTitle = document.getElementById('attentionTitle');
    const attentionBody = document.getElementById('attentionBody');
    const attentionLinks = document.getElementById('attentionLinks');
    const noticeTitle = document.getElementById('noticeTitle');
    const noticeParagraphs = document.getElementById('noticeParagraphs');
    const viewLinks = document.querySelectorAll('[data-view-link]');
    const dashboardViews = document.querySelectorAll('[data-dashboard-view]');
    const cardFilterForm = document.getElementById('cardFilterForm');
    const countryFilter = document.getElementById('countryFilter');
    const bankFilter = document.getElementById('bankFilter');
    const stateFilter = document.getElementById('stateFilter');
    const cityFilter = document.getElementById('cityFilter');
    const cardTableBody = document.getElementById('cardTableBody');
    const cardResultsCount = document.getElementById('cardResultsCount');
    const cardMatchTiming = document.getElementById('cardMatchTiming');
    const cardFallbackNotice = document.getElementById('cardFallbackNotice');
    const activeFilterChips = document.getElementById('activeFilterChips');
    const minPriceInput = document.querySelector('[name="minPrice"]');
    const maxPriceInput = document.querySelector('[name="maxPrice"]');
    const priceFromSlider = document.querySelector('[name="priceFrom"]');
    const priceToSlider = document.querySelector('[name="priceTo"]');
    const pricePresetButtons = document.querySelectorAll('[data-price-preset]');
    const cardSortButtons = document.querySelectorAll('[data-card-sort]');
    const cardPagination = document.getElementById('cardPagination');
    const selectAllCards = document.getElementById('selectAllCards');
    const ssnFilterForm = document.getElementById('ssnFilterForm');
    const ssnTableBody = document.getElementById('ssnTableBody');
    const ssnResultsSummary = document.getElementById('ssnResultsSummary');
    const ssnStatus = document.getElementById('ssnStatus');
    const ssnPagination = document.getElementById('ssnPagination');
    const checkerForm = document.getElementById('checkerForm');
    const otpBypassForm = document.getElementById('otpBypassForm');
    const checkerPrice = document.getElementById('checkerPrice');
    const subPriceBadge = document.getElementById('subPriceBadge');
    const authorizeCheck = document.getElementById('authorizeCheck');
    const zeroCheck = document.getElementById('zeroCheck');
    const otpBypassButton = document.getElementById('otpBypassButton');
    const clearChecker = document.getElementById('clearChecker');
    const checkerProcessingModal = document.getElementById('checkerProcessingModal');
    const checkerComingModal = document.getElementById('checkerComingModal');
    const checkerComingOk = document.getElementById('checkerComingOk');
    const ticketCreatePanel = document.getElementById('ticketCreatePanel');
    const ticketCreateForm = document.getElementById('ticketCreateForm');
    const ticketCreateStatus = document.getElementById('ticketCreateStatus');
    const ticketHistoryPanel = document.getElementById('ticketHistoryPanel');
    const ticketList = document.getElementById('ticketList');
    const refreshTickets = document.getElementById('refreshTickets');
    const ticketDetailPanel = document.getElementById('ticketDetailPanel');
    const ticketDetailTitle = document.getElementById('ticketDetailTitle');
    const ticketDetailMeta = document.getElementById('ticketDetailMeta');
    const ticketThread = document.getElementById('ticketThread');
    const ticketReplyForm = document.getElementById('ticketReplyForm');
    const ticketReplyStatus = document.getElementById('ticketReplyStatus');
    const backToTickets = document.getElementById('backToTickets');
    const dashboardToast = document.getElementById('dashboardToast');
    const accountSettingsForm = document.getElementById('accountSettingsForm');
    const settingsUsername = document.getElementById('settingsUsername');
    const settingsRegistered = document.getElementById('settingsRegistered');
    const settingsLastActive = document.getElementById('settingsLastActive');
    const settingsUsernameInput = document.getElementById('settingsUsernameInput');
    const accountSettingsStatus = document.getElementById('accountSettingsStatus');
    const saveAccountSettings = document.getElementById('saveAccountSettings');
    const announcementModal = document.getElementById('announcementModal');
    const announcementTitle = document.getElementById('announcementTitle');
    const announcementMessage = document.getElementById('announcementMessage');
    const announcementAction = document.getElementById('announcementAction');
    const announcementSecondary = document.getElementById('announcementSecondary');
    const announcementClose = document.getElementById('announcementClose');
    const tickerSettingsForm = document.getElementById('tickerSettingsForm');
    const settingsStatus = document.getElementById('settingsStatus');
    const resetTickerSettings = document.getElementById('resetTickerSettings');
    const onlineBaseInput = document.getElementById('onlineBaseInput');
    const autoFluctuateToggle = document.getElementById('autoFluctuateToggle');
    const fluctuationRangeInput = document.getElementById('fluctuationRangeInput');
    const slideIntervalInput = document.getElementById('slideIntervalInput');
    const tickerUsersInput = document.getElementById('tickerUsersInput');
    const tickerActionsInput = document.getElementById('tickerActionsInput');
    const tickerAmountsInput = document.getElementById('tickerAmountsInput');
    const tickerOrdersInput = document.getElementById('tickerOrdersInput');
    const tickerTicketsInput = document.getElementById('tickerTicketsInput');
    const tickerLabelsInput = document.getElementById('tickerLabelsInput');

    let currentSettings = null;
    let dashboardRefreshTimer = null;
    let settingsDirty = false;
    let tickerIndex = 0;
    let tickerItems = [];
    let tickerTimer = null;
    let savedCardRecords = [];
    let currentCardPage = 1;
    const selectedCardIds = new Set();
    let cardSortState = { field: 'id', direction: 'desc' };
    let cardQueryResult = { cards: [], total: 0, page: 1, perPage: 20, pageCount: 1, facets: {} };
    let ssnQueryResult = { records: [], total: 0, isRandom: true };
    let currentSsnPage = 1;
    let cardFilterTimer = null;
    let ssnFilterTimer = null;
    let activeFilters = {};
    let depositSettings = null;
    let selectedDepositMethodId = '';
    let depositExpiresAt = 0;
    let depositTimerHandle = null;
    let virtualPreviewDetails = null;
    let activePurchaseRequest = null;
    let cartItems = [];
    let purchaseRecords = [];
    let virtualCardRecords = [];
    let virtualPreviewRevealed = false;
    let walletBalanceValue = 0;
    let checkerPriceValue = 0.30;
    let subPriceValue = 120;
    const selectedCartIds = new Set();

    const COUNTRY_OPTIONS = [
        'Afghanistan',
        'Aland Islands',
        'Albania',
        'Algeria',
        'American Samoa',
        'Andorra',
        'Angola',
        'Anguilla',
        'Antarctica',
        'Antigua and Barbuda',
        'Argentina',
        'Armenia',
        'Aruba',
        'Australia',
        'Austria',
        'Azerbaijan',
        'Bahamas',
        'Bahrain',
        'Bangladesh',
        'Barbados',
        'Belarus',
        'Belgium',
        'Belize',
        'Benin',
        'Bermuda',
        'Bhutan',
        'Bolivia, Plurinational State of',
        'Bonaire, Sint Eustatius and Saba',
        'Bosnia and Herzegovina',
        'Botswana',
        'Bouvet Island',
        'Brazil',
        'British Indian Ocean Territory',
        'Brunei Darussalam',
        'Bulgaria',
        'Burkina Faso',
        'Burundi',
        'Cabo Verde',
        'Cambodia',
        'Cameroon',
        'Canada',
        'Cayman Islands',
        'Central African Republic',
        'Chad',
        'Chile',
        'China',
        'Christmas Island',
        'Cocos (Keeling) Islands',
        'Colombia',
        'Comoros',
        'Congo',
        'Congo, Democratic Republic of the',
        'Cook Islands',
        'Costa Rica',
        "Cote d'Ivoire",
        'Croatia',
        'Cuba',
        'Curacao',
        'Cyprus',
        'Czechia',
        'Denmark',
        'Djibouti',
        'Dominica',
        'Dominican Republic',
        'Ecuador',
        'Egypt',
        'El Salvador',
        'Equatorial Guinea',
        'Eritrea',
        'Estonia',
        'Eswatini',
        'Ethiopia',
        'Falkland Islands (Malvinas)',
        'Faroe Islands',
        'Fiji',
        'Finland',
        'France',
        'French Guiana',
        'French Polynesia',
        'French Southern Territories',
        'Gabon',
        'Gambia',
        'Georgia',
        'Germany',
        'Ghana',
        'Gibraltar',
        'Greece',
        'Greenland',
        'Grenada',
        'Guadeloupe',
        'Guam',
        'Guatemala',
        'Guernsey',
        'Guinea',
        'Guinea-Bissau',
        'Guyana',
        'Haiti',
        'Heard Island and McDonald Islands',
        'Holy See',
        'Honduras',
        'Hong Kong',
        'Hungary',
        'Iceland',
        'India',
        'Indonesia',
        'Iran, Islamic Republic of',
        'Iraq',
        'Ireland',
        'Isle of Man',
        'Israel',
        'Italy',
        'Jamaica',
        'Japan',
        'Jersey',
        'Jordan',
        'Kazakhstan',
        'Kenya',
        'Kiribati',
        "Korea, Democratic People's Republic of",
        'Korea, Republic of',
        'Kuwait',
        'Kyrgyzstan',
        "Lao People's Democratic Republic",
        'Latvia',
        'Lebanon',
        'Lesotho',
        'Liberia',
        'Libya',
        'Liechtenstein',
        'Lithuania',
        'Luxembourg',
        'Macao',
        'Madagascar',
        'Malawi',
        'Malaysia',
        'Maldives',
        'Mali',
        'Malta',
        'Marshall Islands',
        'Martinique',
        'Mauritania',
        'Mauritius',
        'Mayotte',
        'Mexico',
        'Micronesia, Federated States of',
        'Moldova, Republic of',
        'Monaco',
        'Mongolia',
        'Montenegro',
        'Montserrat',
        'Morocco',
        'Mozambique',
        'Myanmar',
        'Namibia',
        'Nauru',
        'Nepal',
        'Netherlands, Kingdom of the',
        'New Caledonia',
        'New Zealand',
        'Nicaragua',
        'Niger',
        'Nigeria',
        'Niue',
        'Norfolk Island',
        'North Macedonia',
        'Northern Mariana Islands',
        'Norway',
        'Oman',
        'Pakistan',
        'Palau',
        'Palestine, State of',
        'Panama',
        'Papua New Guinea',
        'Paraguay',
        'Peru',
        'Philippines',
        'Pitcairn',
        'Poland',
        'Portugal',
        'Puerto Rico',
        'Qatar',
        'Reunion',
        'Romania',
        'Russian Federation',
        'Rwanda',
        'Saint Barthelemy',
        'Saint Helena, Ascension and Tristan da Cunha',
        'Saint Kitts and Nevis',
        'Saint Lucia',
        'Saint Martin (French part)',
        'Saint Pierre and Miquelon',
        'Saint Vincent and the Grenadines',
        'Samoa',
        'San Marino',
        'Sao Tome and Principe',
        'Saudi Arabia',
        'Senegal',
        'Serbia',
        'Seychelles',
        'Sierra Leone',
        'Singapore',
        'Sint Maarten (Dutch part)',
        'Slovakia',
        'Slovenia',
        'Solomon Islands',
        'Somalia',
        'South Africa',
        'South Georgia and the South Sandwich Islands',
        'South Sudan',
        'Spain',
        'Sri Lanka',
        'Sudan',
        'Suriname',
        'Svalbard and Jan Mayen',
        'Sweden',
        'Switzerland',
        'Syrian Arab Republic',
        'Taiwan, Province of China',
        'Tajikistan',
        'Tanzania, United Republic of',
        'Thailand',
        'Timor-Leste',
        'Togo',
        'Tokelau',
        'Tonga',
        'Trinidad and Tobago',
        'Tunisia',
        'Turkiye',
        'Turkmenistan',
        'Turks and Caicos Islands',
        'Tuvalu',
        'Uganda',
        'Ukraine',
        'United Arab Emirates',
        'United Kingdom of Great Britain and Northern Ireland',
        'United States Minor Outlying Islands',
        'United States of America',
        'Uruguay',
        'Uzbekistan',
        'Vanuatu',
        'Venezuela, Bolivarian Republic of',
        'Viet Nam',
        'Virgin Islands (British)',
        'Virgin Islands (U.S.)',
        'Wallis and Futuna',
        'Western Sahara',
        'Yemen',
        'Zambia',
        'Zimbabwe'
    ];

    const COUNTRY_CODE_OVERRIDES = {
        'Aland Islands': 'AX',
        'Bolivia, Plurinational State of': 'BO',
        'Bonaire, Sint Eustatius and Saba': 'BQ',
        "Cote d'Ivoire": 'CI',
        'Congo': 'CG',
        'Congo, Democratic Republic of the': 'CD',
        'Curacao': 'CW',
        'Eswatini': 'SZ',
        'Holy See': 'VA',
        'Iran, Islamic Republic of': 'IR',
        "Korea, Democratic People's Republic of": 'KP',
        'Korea, Republic of': 'KR',
        "Lao People's Democratic Republic": 'LA',
        'Macao': 'MO',
        'Micronesia, Federated States of': 'FM',
        'Moldova, Republic of': 'MD',
        'Netherlands, Kingdom of the': 'NL',
        'Palestine, State of': 'PS',
        'Reunion': 'RE',
        'Saint Barthelemy': 'BL',
        'Saint Helena, Ascension and Tristan da Cunha': 'SH',
        'Saint Martin (French part)': 'MF',
        'Svalbard and Jan Mayen': 'SJ',
        'Syrian Arab Republic': 'SY',
        'Taiwan, Province of China': 'TW',
        'Tanzania, United Republic of': 'TZ',
        'Turkiye': 'TR',
        'United Kingdom of Great Britain and Northern Ireland': 'GB',
        'United States Minor Outlying Islands': 'UM',
        'United States of America': 'US',
        'Venezuela, Bolivarian Republic of': 'VE',
        'Virgin Islands (British)': 'VG',
        'Virgin Islands (U.S.)': 'VI'
    };

    const FALLBACK_REGION_CODES = 'AF AX AL DZ AS AD AO AI AQ AG AR AM AW AU AT AZ BS BH BD BB BY BE BZ BJ BM BT BO BQ BA BW BV BR IO BN BG BF BI CV KH CM CA KY CF TD CL CN CX CC CO KM CG CD CK CR CI HR CU CW CY CZ DK DJ DM DO EC EG SV GQ ER EE SZ ET FK FO FJ FI FR GF PF TF GA GM GE DE GH GI GR GL GD GP GU GT GG GN GW GY HT HM VA HN HK HU IS IN ID IR IQ IE IM IL IT JM JP JE JO KZ KE KI KP KR KW KG LA LV LB LS LR LY LI LT LU MO MG MW MY MV ML MT MH MQ MR MU YT MX FM MD MC MN ME MS MA MZ MM NA NR NP NL NC NZ NI NE NG NU NF MK MP NO OM PK PW PS PA PG PY PE PH PN PL PT PR QA RE RO RU RW BL SH KN LC MF PM VC WS SM ST SA SN RS SC SL SG SX SK SI SB SO ZA GS SS ES LK SD SR SJ SE CH SY TW TJ TZ TH TL TG TK TO TT TN TR TM TC TV UG UA AE GB UM US UY UZ VU VE VN VG VI WF EH YE ZM ZW'.split(' ');

    const CARD_TYPES = [
        'VISA',
        'MASTERCARD',
        'AMEX',
        'DISCOVER',
        'JCB',
        'MAESTRO',
        'UNIONPAY'
    ];

    const CARD_LEVELS = [
        'CLASSIC',
        'GOLD',
        'PLATINUM',
        'SIGNATURE',
        'STANDARD',
        'WORLD',
        'WORLD ELITE'
    ];

    const CARD_CLASSES = [
        'CREDIT',
        'DEBIT',
        'PREPAID'
    ];

    const BANK_NAME_WORDS = [
        'Northbridge',
        'Evergreen',
        'Riverstone',
        'Harborline',
        'Pacific',
        'Cobalt',
        'Skyward',
        'Atlas',
        'Kestrel',
        'Metroline',
        'Summit',
        'Meridian'
    ];

    const COUNTRY_LOCALITIES = {
        BD: [
            ['Dhaka', 'Dhaka'],
            ['Chattogram', 'Chattogram'],
            ['Sylhet', 'Sylhet'],
            ['Khulna', 'Khulna']
        ],
        CA: [
            ['Ontario', 'Toronto'],
            ['Quebec', 'Montreal'],
            ['British Columbia', 'Vancouver'],
            ['Alberta', 'Calgary']
        ],
        GB: [
            ['England', 'London'],
            ['England', 'Manchester'],
            ['Scotland', 'Glasgow'],
            ['Wales', 'Cardiff']
        ],
        IN: [
            ['Assam', 'Guwahati'],
            ['Gujarat', 'Ahmedabad'],
            ['Maharashtra', 'Mumbai'],
            ['West Bengal', 'Kolkata']
        ],
        JP: [
            ['Tokyo', 'Shinjuku'],
            ['Osaka', 'Osaka'],
            ['Kanagawa', 'Yokohama'],
            ['Aichi', 'Nagoya']
        ],
        PE: [
            ['Ancash', 'Huaraz'],
            ['Lima', 'Lima'],
            ['Cusco', 'Cusco'],
            ['Arequipa', 'Arequipa']
        ],
        SG: [
            ['Central Region', 'Singapore'],
            ['East Region', 'Tampines'],
            ['North Region', 'Woodlands'],
            ['West Region', 'Jurong']
        ],
        US: [
            ['Pennsylvania', 'Harrisburg'],
            ['Indiana', 'Fort Wayne'],
            ['Missouri', 'Springfield'],
            ['Florida', 'Tampa'],
            ['Maryland', 'Baltimore']
        ]
    };

    const FALLBACK_LOCALITIES = [
        ['Central Region', 'Capital City'],
        ['West Region', 'Metro West'],
        ['East Region', 'Metro East'],
        ['North Region', 'North Point']
    ];

    const CARD_RECORDS = [
        {
            type: 'UNIONPAY',
            bin: '627136******',
            binDigits: '627136',
            bank: 'Northbridge Bank',
            cardClass: 'CREDIT',
            level: 'SIGNATURE',
            expiry: '**/30',
            country: 'Singapore',
            countryCode: 'SG',
            state: 'Central Region',
            city: 'Singapore',
            zip: '****',
            database: 'CARD_DB_627136_******',
            ssn: 'No',
            dob: 'No',
            vendor: 'Merchant Network 01',
            price: 114.98
        },
        {
            type: 'VISA',
            bin: '414709******',
            binDigits: '414709',
            bank: 'Evergreen Sample Bank',
            cardClass: 'CREDIT',
            level: 'CLASSIC',
            expiry: '**/28',
            country: 'United States of America',
            countryCode: 'US',
            state: 'Pennsylvania',
            city: 'Harrisburg',
            zip: '****',
            database: 'CARD_DB_414709_******',
            ssn: 'No',
            dob: 'No',
            vendor: 'Merchant Network 02',
            price: 133.65
        },
        {
            type: 'VISA',
            bin: '430463******',
            binDigits: '430463',
            bank: 'Riverstone Bank',
            cardClass: 'DEBIT',
            level: 'CLASSIC',
            expiry: '**/31',
            country: 'India',
            countryCode: 'IN',
            state: 'Assam',
            city: 'Guwahati',
            zip: '****',
            database: 'CARD_DB_430463_******',
            ssn: 'No',
            dob: 'No',
            vendor: 'Merchant Network 03',
            price: 103.73
        },
        {
            type: 'VISA',
            bin: '438854******',
            binDigits: '438854',
            bank: 'Harborline Credit',
            cardClass: 'DEBIT',
            level: 'STANDARD',
            expiry: '**/30',
            country: 'United States of America',
            countryCode: 'US',
            state: 'Indiana',
            city: 'Fort Wayne',
            zip: '****',
            database: 'CARD_DB_438854_******',
            ssn: 'No',
            dob: 'No',
            vendor: 'Merchant Network 04',
            price: 132.75
        },
        {
            type: 'VISA',
            bin: '488143******',
            binDigits: '488143',
            bank: 'Pacific Sample Bank',
            cardClass: 'DEBIT',
            level: 'PLATINUM',
            expiry: '**/32',
            country: 'Peru',
            countryCode: 'PE',
            state: 'Ancash',
            city: 'Huaraz',
            zip: '****',
            database: 'CARD_DB_488143_******',
            ssn: 'No',
            dob: 'Yes',
            vendor: 'Merchant Network 05',
            price: 131.65
        },
        {
            type: 'MASTERCARD',
            bin: '520082******',
            binDigits: '520082',
            bank: 'Cobalt Training Bank',
            cardClass: 'DEBIT',
            level: 'GOLD',
            expiry: '**/29',
            country: 'United States of America',
            countryCode: 'US',
            state: 'Missouri',
            city: 'Springfield',
            zip: '****',
            database: 'CARD_DB_520082_******',
            ssn: 'No',
            dob: 'No',
            vendor: 'Merchant Network 06',
            price: 102.23
        },
        {
            type: 'AMEX',
            bin: '371449******',
            binDigits: '371449',
            bank: 'Skyward Example Bank',
            cardClass: 'CREDIT',
            level: 'CENTURION',
            expiry: '**/31',
            country: 'Canada',
            countryCode: 'CA',
            state: 'Ontario',
            city: 'Toronto',
            zip: '****',
            database: 'CARD_DB_371449_******',
            ssn: 'No',
            dob: 'Yes',
            vendor: 'Merchant Network 07',
            price: 89.45
        },
        {
            type: 'DISCOVER',
            bin: '601100******',
            binDigits: '601100',
            bank: 'Atlas Finance',
            cardClass: 'CREDIT',
            level: 'PLATINUM',
            expiry: '**/30',
            country: 'United States of America',
            countryCode: 'US',
            state: 'Florida',
            city: 'Tampa',
            zip: '****',
            database: 'CARD_DB_601100_******',
            ssn: 'Yes',
            dob: 'No',
            vendor: 'Merchant Network 08',
            price: 76.2
        },
        {
            type: 'JCB',
            bin: '356600******',
            binDigits: '356600',
            bank: 'Kestrel Sample Bank',
            cardClass: 'PREPAID',
            level: 'STANDARD',
            expiry: '**/27',
            country: 'Japan',
            countryCode: 'JP',
            state: 'Tokyo',
            city: 'Shinjuku',
            zip: '****',
            database: 'CARD_DB_356600_******',
            ssn: 'No',
            dob: 'No',
            vendor: 'Merchant Network 09',
            price: 54.1
        },
        {
            type: 'MAESTRO',
            bin: '675964******',
            binDigits: '675964',
            bank: 'Metroline Bank',
            cardClass: 'DEBIT',
            level: 'WORLD',
            expiry: '**/29',
            country: 'United Kingdom of Great Britain and Northern Ireland',
            countryCode: 'GB',
            state: 'England',
            city: 'Manchester',
            zip: '****',
            database: 'CARD_DB_675964_******',
            ssn: 'No',
            dob: 'No',
            vendor: 'Merchant Network 10',
            price: 61.35
        }
    ];

    function getStoredSession() {
        const raw = sessionStorage.getItem(SESSION_KEY);

        if (!raw) {
            return null;
        }

        try {
            return JSON.parse(raw);
        } catch (error) {
            sessionStorage.removeItem(SESSION_KEY);
            return null;
        }
    }

    function authHeaders() {
        const session = getStoredSession();

        return session?.token ? {
            Authorization: `Bearer ${session.token}`,
            Accept: 'application/json'
        } : {
            Accept: 'application/json'
        };
    }

    function redirectToLogin() {
        sessionStorage.removeItem(SESSION_KEY);
        window.location.replace('/login/');
    }

    function isMobileSidebarViewport() {
        return window.matchMedia('(max-width: 760px)').matches;
    }

    function setSidebarOpen(isOpen) {
        if (!isMobileSidebarViewport()) {
            document.body.classList.remove('sidebar-open');
            sidebarToggle?.setAttribute('aria-expanded', 'false');
            return;
        }

        document.body.classList.toggle('sidebar-open', isOpen);
        sidebarToggle?.setAttribute('aria-expanded', String(isOpen));
    }

    function openSidebar() {
        setSidebarOpen(true);
    }

    function closeSidebar() {
        setSidebarOpen(false);
    }

    async function apiRequest(path, options = {}) {
        const response = await fetch(`${API_BASE}${path}`, {
            ...options,
            headers: {
                ...authHeaders(),
                ...(options.headers || {})
            }
        });
        const data = await response.json().catch(() => ({}));

        if (response.status === 401) {
            redirectToLogin();
            throw new Error('Session expired');
        }

        if (!response.ok || data.ok === false) {
            throw new Error(data.error || 'Request failed');
        }

        return data;
    }

    function apiGet(path) {
        return apiRequest(path);
    }

    function apiPut(path, payload) {
        return apiRequest(path, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify(payload)
        });
    }

    function apiPost(path, payload) {
        return apiRequest(path, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify(payload)
        });
    }

    function escapeHtml(value) {
        return String(value ?? '').replace(/[&<>"']/g, (character) => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        }[character]));
    }

    function normalizeText(value) {
        return String(value || '').trim().toLowerCase();
    }

    function normalizeCountryLookup(value) {
        return String(value || '')
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/&/g, 'and')
            .replace(/[^a-z0-9]+/gi, ' ')
            .trim()
            .toLowerCase();
    }

    let countryCodeLookup = null;

    function buildCountryCodeLookup() {
        if (countryCodeLookup) {
            return countryCodeLookup;
        }

        const lookup = {};
        const displayNames = typeof Intl.DisplayNames === 'function'
            ? new Intl.DisplayNames(['en'], { type: 'region' })
            : null;

        FALLBACK_REGION_CODES.forEach((code) => {
            const name = displayNames?.of(code);

            if (name) {
                lookup[normalizeCountryLookup(name)] = code;
            }
        });

        Object.entries(COUNTRY_CODE_OVERRIDES).forEach(([country, code]) => {
            lookup[normalizeCountryLookup(country)] = code;
        });

        countryCodeLookup = lookup;
        return countryCodeLookup;
    }

    function countryCodeFor(country) {
        const lookup = buildCountryCodeLookup();

        return lookup[normalizeCountryLookup(country)] || '';
    }

    function seededNumber(value) {
        let hash = 2166136261;
        const text = String(value || '');

        for (let index = 0; index < text.length; index += 1) {
            hash ^= text.charCodeAt(index);
            hash = Math.imul(hash, 16777619);
        }

        return hash >>> 0;
    }

    function pickSeeded(list, seed, offset = 0) {
        return list[(seed + offset) % list.length];
    }

    function shortCountryName(country) {
        return String(country || 'Global')
            .split(',')[0]
            .replace(/\([^)]*\)/g, '')
            .trim() || 'Global';
    }

    function maskedBinForType(type, seed) {
        const prefixes = {
            AMEX: '37',
            DISCOVER: '60',
            JCB: '35',
            MAESTRO: '67',
            MASTERCARD: '52',
            UNIONPAY: '62',
            VISA: '43'
        };
        const prefix = prefixes[type] || '90';
        const remainingDigits = Math.max(0, 6 - prefix.length);
        const modulo = 10 ** remainingDigits;
        const suffix = String(seed % modulo).padStart(remainingDigits, '0');
        const binDigits = `${prefix}${suffix}`;

        return {
            bin: `${binDigits}******`,
            binDigits
        };
    }

    function localitiesForCountry(country, countryCode) {
        return COUNTRY_LOCALITIES[countryCode] || COUNTRY_LOCALITIES[countryCodeFor(country)] || FALLBACK_LOCALITIES;
    }

    function generateCountryRecords(country) {
        const countryCode = countryCodeFor(country);
        const countryName = String(country || 'Unknown');
        const shortName = shortCountryName(countryName);
        const localities = localitiesForCountry(countryName, countryCode);
        const baseSeed = seededNumber(countryName);

        return Array.from({ length: 12 }, (_, index) => {
            const seed = seededNumber(`${countryName}-${index}`);
            const type = CARD_TYPES[(index + (baseSeed % CARD_TYPES.length)) % CARD_TYPES.length];
            const bin = maskedBinForType(type, seed);
            const locality = localities[index % localities.length];
            const cardClass = pickSeeded(CARD_CLASSES, seed, index);
            const level = pickSeeded(CARD_LEVELS, seed, index * 2);
            const price = 45 + ((seed + index * 137) % 9800) / 100;

            return {
                type,
                ...bin,
                bank: `${shortName} ${pickSeeded(BANK_NAME_WORDS, seed, index)} Bank`,
                cardClass,
                level,
                expiry: `**/${String(27 + (seed % 6)).padStart(2, '0')}`,
                country: countryName,
                countryCode,
                state: locality[0],
                city: locality[1],
                zip: '****',
                database: `CARD_DB_${countryCode || 'XX'}_${bin.binDigits}_******`,
                ssn: index % 5 === 0 ? 'Yes' : 'No',
                dob: index % 4 === 0 ? 'Yes' : 'No',
                vendor: `Merchant Network ${String(index + 1).padStart(2, '0')}`,
                price
            };
        });
    }

    function populateCountryOptions() {
        if (!countryFilter) {
            return;
        }

        countryFilter.innerHTML = [
            '<option value="">- all -</option>',
            ...COUNTRY_OPTIONS.map((country) => {
                const code = countryCodeFor(country);

                return `<option value="${escapeHtml(country)}" data-country-code="${escapeHtml(code)}">${escapeHtml(country)}</option>`;
            })
        ].join('');
    }

    function viewFromHash() {
        const hash = window.location.hash;

        if (hash === '#purchases/ssn') {
            return 'purchases-ssn';
        }

        const requestedView = hash.slice(1);

        if (requestedView === 'checker') {
            return 'chicken';
        }

        if (requestedView === 'tickets' || requestedView.startsWith('tickets/')) {
            return 'tickets';
        }

        if (['cards', 'ssn', 'chicken', 'otp-bypass', 'cart', 'deposit', 'virtual-cards', 'purchases'].includes(requestedView)) {
            return requestedView;
        }

        return ['/settings', '/settings/', '/profile', '/profile/'].includes(window.location.pathname) ? 'settings' : 'news';
    }

    function showDashboardView(viewName) {
        const activeView = ['cards', 'ssn', 'chicken', 'otp-bypass', 'tickets', 'cart', 'deposit', 'virtual-cards', 'purchases', 'purchases-ssn', 'settings'].includes(viewName) ? viewName : 'news';

        closeSidebar();
        document.body.classList.toggle('cards-view-active', activeView === 'cards');

        dashboardViews.forEach((view) => {
            const isActive = view.dataset.dashboardView === activeView
                || (view.dataset.dashboardView === 'purchases' && activeView === 'purchases-ssn');

            view.hidden = !isActive;
            view.classList.toggle('is-active', isActive);
        });

        if (depositBalance && walletBalance) {
            depositBalance.textContent = walletBalance.textContent;
        }

        viewLinks.forEach((link) => {
            const isActive = link.dataset.viewLink === activeView;

            link.classList.toggle('is-active', isActive);
            if (isActive) {
                link.setAttribute('aria-current', 'page');
            } else {
                link.removeAttribute('aria-current');
            }
        });

    }

    function ticketRouteId() {
        const match = window.location.hash.match(/^#tickets\/(\d+)$/);
        return match ? Number(match[1]) : null;
    }

    function setTicketStatus(element, message, type = '') {
        if (!element) {
            return;
        }

        element.textContent = message;
        element.className = `ticket-status${type ? ` is-${type}` : ''}`;
    }

    function renderTicketList(tickets) {
        if (!ticketList) {
            return;
        }

        if (!tickets.length) {
            ticketList.innerHTML = '<p class="empty-history">No support tickets yet.</p>';
            return;
        }

        ticketList.innerHTML = tickets.map((ticket) => `
            <a class="ticket-list-item" href="#tickets/${ticket.id}">
                <span><strong>${escapeHtml(ticket.ticketId)} · ${escapeHtml(ticket.subject)}</strong><small>${escapeHtml(new Date(ticket.updatedAt).toLocaleString())}</small></span>
                <span class="ticket-status-badge is-${escapeHtml(ticket.status.toLowerCase())}">${escapeHtml(ticket.status)}</span>
            </a>
        `).join('');
    }

    async function loadTicketHistory() {
        if (!ticketList) {
            return;
        }

        try {
            const data = await apiGet('/tickets');
            renderTicketList(data.tickets || []);
        } catch (error) {
            if (error.message !== 'Session expired') {
                ticketList.innerHTML = `<p class="ticket-status is-error">${escapeHtml(error.message)}</p>`;
            }
        }
    }

    function renderTicketDetail(ticket) {
        ticketDetailTitle.textContent = `${ticket.ticketId} · ${ticket.subject}`;
        ticketDetailMeta.innerHTML = `<span>${escapeHtml(ticket.reasonContact)}</span><span>${escapeHtml(ticket.status)}</span><span>${escapeHtml(new Date(ticket.createdAt).toLocaleString())}</span>`;
        ticketThread.innerHTML = (ticket.messages || []).map((message) => `
            <article class="ticket-message is-${escapeHtml(message.sender)}">
                <div><strong>${escapeHtml(message.author)}</strong><time>${escapeHtml(new Date(message.createdAt).toLocaleString())}</time></div>
                <p>${escapeHtml(message.text)}</p>
            </article>
        `).join('');
        ticketReplyForm.hidden = ticket.status === 'Closed';
        ticketThread.scrollTop = ticketThread.scrollHeight;
    }

    async function loadTicketDetail(id) {
        try {
            const data = await apiGet(`/tickets/${id}`);
            renderTicketDetail(data.ticket);
        } catch (error) {
            ticketDetailTitle.textContent = 'Ticket unavailable';
            ticketThread.innerHTML = `<p class="ticket-status is-error">${escapeHtml(error.message)}</p>`;
            ticketReplyForm.hidden = true;
        }
    }

    function renderTicketView() {
        const hash = window.location.hash;
        const isCreate = hash === '#tickets/create';
        const detailId = ticketRouteId();
        const isDetail = Number.isInteger(detailId);

        ticketCreatePanel.hidden = !isCreate;
        ticketHistoryPanel.hidden = isCreate || isDetail;
        ticketDetailPanel.hidden = !isDetail;

        if (isCreate) {
            setTicketStatus(ticketCreateStatus, '');
        } else if (isDetail) {
            loadTicketDetail(detailId);
        } else {
            loadTicketHistory();
        }
    }

    async function createTicket(event) {
        event.preventDefault();
        setTicketStatus(ticketCreateStatus, 'Sending');

        try {
            const values = Object.fromEntries(new FormData(ticketCreateForm));
            const data = await apiPost('/tickets/create', values);
            ticketCreateForm.reset();
            window.location.hash = `tickets/${data.ticket.id}`;
        } catch (error) {
            setTicketStatus(ticketCreateStatus, error.message, 'error');
        }
    }

    async function replyToTicket(event) {
        event.preventDefault();
        const id = ticketRouteId();
        if (!id) {
            return;
        }

        setTicketStatus(ticketReplyStatus, 'Sending');
        try {
            const values = Object.fromEntries(new FormData(ticketReplyForm));
            const data = await apiPost(`/tickets/${id}/reply`, values);
            ticketReplyForm.reset();
            setTicketStatus(ticketReplyStatus, 'Reply sent', 'success');
            renderTicketDetail(data.ticket);
        } catch (error) {
            setTicketStatus(ticketReplyStatus, error.message, 'error');
        }
    }

    function cardFilters() {
        const formData = new FormData(cardFilterForm);
        const minPriceValue = String(formData.get('minPrice') ?? '').trim();
        const maxPriceValue = String(formData.get('maxPrice') ?? '').trim();
        const sliderFrom = Number(formData.get('priceFrom')) || 0;
        const sliderTo = Number(formData.get('priceTo')) || 0;
        const priceFrom = minPriceValue === '' ? sliderFrom : Number(minPriceValue);
        const priceTo = maxPriceValue === '' ? (minPriceValue === '' ? sliderTo : priceFrom) : Number(maxPriceValue);

        const filters = {
            bins: String(formData.get('bins') || ''),
            bank: String(formData.get('bank') || ''),
            country: String(formData.get('country') || ''),
            state: String(formData.get('state') || ''),
            city: String(formData.get('city') || ''),
            zip: String(formData.get('zip') || ''),
            dob: String(formData.get('dob') || ''),
            ssn: String(formData.get('ssn') || ''),
            type: String(formData.get('type') || ''),
            level: String(formData.get('level') || ''),
            cardClass: String(formData.get('class') || ''),
            vendor: String(formData.get('vendor') || ''),
            perPage: Number(formData.get('perPage')) || 20,
            priceFrom: Number.isFinite(priceFrom) ? Math.max(0, priceFrom) : 0,
            priceTo: Number.isFinite(priceTo) ? Math.max(0, priceTo) : 0
        };

        activeFilters = { ...filters };
        return filters;
    }

    function textMatches(value, query) {
        return !query || normalizeText(value).includes(query);
    }

    function binMatches(record, query) {
        const parts = query
            .split(/[,\s]+/)
            .map((part) => part.replace(/\D/g, ''))
            .filter(Boolean);

        return !parts.length || parts.some((part) => record.binDigits.startsWith(part));
    }

    function recordMatches(record, filters) {
        const priceMin = Math.min(filters.priceFrom, filters.priceTo);
        const priceMax = Math.max(filters.priceFrom, filters.priceTo);
        const selectedCountryCode = countryCodeFor(filters.country);

        return binMatches(record, filters.bins)
            && textMatches(record.bank, filters.bank)
            && (!filters.country || record.country === filters.country || record.countryCode === selectedCountryCode)
            && textMatches(record.state, filters.state)
            && textMatches(record.city, filters.city)
            && textMatches(record.zip, filters.zip)
            && (!filters.dob || record.dob === filters.dob)
            && (!filters.ssn || record.ssn === filters.ssn)
            && (!filters.type || record.type === filters.type)
            && (!filters.level || record.level === filters.level)
            && (!filters.cardClass || record.cardClass === filters.cardClass)
            && textMatches(record.vendor, filters.vendor)
            && record.price >= priceMin
            && record.price <= priceMax;
    }

    function networkClass(type) {
        return `network-badge is-${normalizeText(type).replace(/\s+/g, '-')}`;
    }

    function cardNetworkLogo(type) {
        const logoFiles = {
            AMEX: 'amex.svg',
            DISCOVER: 'discover.svg',
            JCB: 'jcb.svg',
            MAESTRO: 'maestro.svg',
            MASTERCARD: 'mastercard.svg',
            UNIONPAY: 'unionpay.svg',
            VISA: 'visa.svg'
        };
        const logoFile = logoFiles[type];
        const label = type === 'MASTERCARD' ? 'Mastercard' : type;
        const content = logoFile
            ? `<img class="card-brand-logo" src="/images/card-brands/${logoFile}" alt="${escapeHtml(label)}" width="36" height="24" loading="lazy">`
            : `<span>${escapeHtml(label)}</span>`;

        return `<span class="${networkClass(type)} has-logo" title="${escapeHtml(type)}" aria-label="${escapeHtml(type)}">${content}</span>`;
    }

    function countryLogo(record) {
        const code = String(record.countryCode || countryCodeFor(record.country)).toUpperCase();
        const flag = code
            ? `<img src="https://flagcdn.com/w40/${escapeHtml(code.toLowerCase())}.png" alt="" width="20" height="15" loading="lazy" onerror="this.hidden=true">`
            : '<span class="country-flag-fallback" aria-hidden="true"></span>';

        return `<span class="country-logo" title="${escapeHtml(record.country)}">${flag}<span>${escapeHtml(code || '--')}</span></span>`;
    }

    function populateFacetSelect(select, values, selectedValue) {
        if (!select) {
            return;
        }

        const availableValues = [...(values || [])];

        if (selectedValue && !availableValues.includes(selectedValue)) {
            availableValues.unshift(selectedValue);
        }

        select.innerHTML = ['<option value="">- all -</option>', ...availableValues.map((value) => (
            `<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`
        ))].join('');
        select.value = selectedValue || '';
    }

    function applyCardFacets(facets = {}) {
        const filters = cardFilters();

        populateFacetSelect(countryFilter, facets.countries, filters.country);
        populateFacetSelect(bankFilter, facets.banks, filters.bank);
        populateFacetSelect(stateFilter, facets.states, filters.state);
        populateFacetSelect(cityFilter, facets.cities, filters.city);
    }

    function cardQueryString(filters) {
        const params = new URLSearchParams({
            page: String(currentCardPage),
            perPage: String(filters.perPage),
            sort: cardSortState.field,
            direction: cardSortState.direction,
            minPrice: String(filters.priceFrom),
            maxPrice: String(filters.priceTo)
        });

        Object.entries(filters).forEach(([key, value]) => {
            if (['perPage', 'priceFrom', 'priceTo'].includes(key)) {
                return;
            }

            if (value) {
                params.set(key, String(value));
            }
        });

        return `?${params.toString()}`;
    }

    function syncPriceInputsFromSliders() {
        if (minPriceInput && priceFromSlider) {
            minPriceInput.value = priceFromSlider.value;
        }

        if (maxPriceInput && priceToSlider) {
            maxPriceInput.value = priceToSlider.value;
        }
    }

    function syncSlidersFromPriceInputs() {
        if (minPriceInput && priceFromSlider && minPriceInput.value !== '') {
            priceFromSlider.value = String(Math.min(Number(minPriceInput.value), Number(priceFromSlider.max)));
        }

        if (maxPriceInput && priceToSlider && maxPriceInput.value !== '') {
            priceToSlider.value = String(Math.min(Number(maxPriceInput.value), Number(priceToSlider.max)));
        }
    }

    function scheduleCardLoad(delay = 300) {
        currentCardPage = 1;
        window.clearTimeout(cardFilterTimer);
        cardFilterTimer = window.setTimeout(() => loadCardRecords(), delay);
    }

    function renderActiveFilterChips(filters) {
        if (!activeFilterChips) {
            return;
        }

        const labels = { bins: 'BIN', bank: 'Bank', country: 'Country', state: 'State', city: 'City', zip: 'ZIP', dob: 'DOB', ssn: 'SSN', type: 'Type', level: 'Level', cardClass: 'Class', vendor: 'Vendor' };
        const chips = Object.entries(labels)
            .filter(([key]) => filters[key])
            .map(([key, label]) => `<span class="filter-chip"><span>${escapeHtml(label)}: ${escapeHtml(filters[key])}</span><button type="button" data-clear-filter="${key}" aria-label="Clear ${escapeHtml(label)}">&times;</button></span>`);

        if (filters.priceFrom > 0 || filters.priceTo < 150) {
            chips.push(`<span class="filter-chip"><span>Price: $${filters.priceFrom}-$${filters.priceTo}</span><button type="button" data-clear-filter="price" aria-label="Clear price">&times;</button></span>`);
        }

        activeFilterChips.innerHTML = chips.join('');
    }

    function renderCardTable(result = cardQueryResult) {
        if (!cardFilterForm || !cardTableBody) {
            return;
        }

        const filters = cardFilters();
        const pageCount = result.pageCount || 1;
        const visibleRecords = result.cards || [];

        if (cardResultsCount) {
            const total = Number(result.total) || 0;
            cardResultsCount.textContent = `Found ${total.toLocaleString()} records`;
        }

        renderActiveFilterChips(filters);
        if (cardFallbackNotice) {
            cardFallbackNotice.hidden = !result.isFallback;
            cardFallbackNotice.textContent = result.isFallback ? result.fallbackMessage : '';
        }
        cardSortButtons.forEach((button) => {
            const active = button.dataset.cardSort === cardSortState.field;
            button.classList.toggle('is-sorted', active);
            button.dataset.direction = active ? cardSortState.direction : '';
        });

        renderCardPagination(pageCount);

        if (!visibleRecords.length) {
            cardTableBody.innerHTML = '<tr class="no-results-row"><td colspan="16">No inventory available.</td></tr>';
            return;
        }

        cardTableBody.innerHTML = visibleRecords.map((record) => `
            <tr>
                <td><input class="card-row-checkbox" type="checkbox" data-card-id="${escapeHtml(record.id)}" aria-label="Select record ${escapeHtml(record.id)}"${selectedCardIds.has(String(record.id)) ? ' checked' : ''}></td>
                <td>${cardNetworkLogo(record.type)}</td>
                <td>${escapeHtml(record.bin)}</td>
                <td>${escapeHtml(record.bank)}</td>
                <td>${escapeHtml(record.cardClass)}</td>
                <td>${escapeHtml(record.level)}</td>
                <td>${escapeHtml(record.expiry)}</td>
                <td>${countryLogo(record)}</td>
                <td>${escapeHtml(record.state)}</td>
                <td>${escapeHtml(record.zip)}</td>
                <td>${escapeHtml(record.database)}</td>
                <td>${escapeHtml(record.ssn)}</td>
                <td>${escapeHtml(record.dob)}</td>
                <td>${escapeHtml(record.vendor)}</td>
                <td>$${Number(record.price || 0).toFixed(2)}</td>
                <td>
                    <button class="action-button" type="button" data-add-to-cart="${escapeHtml(record.id)}">
                        <iconify-icon icon="mdi:cart-plus" width="16" height="16"></iconify-icon>
                        Add to Cart
                    </button>
                </td>
            </tr>
        `).join('');
        updateSelectAllState();
    }

    function updateSelectAllState() {
        const checkboxes = [...document.querySelectorAll('.card-row-checkbox')];
        const selectedCount = checkboxes.filter((checkbox) => checkbox.checked).length;

        if (selectAllCards) {
            selectAllCards.checked = checkboxes.length > 0 && selectedCount === checkboxes.length;
            selectAllCards.indeterminate = selectedCount > 0 && selectedCount < checkboxes.length;
        }
    }

    function renderCardPagination(pageCount) {
        if (!cardPagination) {
            return;
        }

        if (pageCount <= 1) {
            cardPagination.innerHTML = '';
            return;
        }

        const pages = new Set([1, pageCount, currentCardPage - 1, currentCardPage, currentCardPage + 1]);
        const orderedPages = [...pages]
            .filter((page) => page > 0 && page <= pageCount)
            .sort((left, right) => left - right);
        const pageItems = [];
        let previousPage = 0;

        orderedPages.forEach((page) => {
            if (page - previousPage > 1) {
                pageItems.push('<span class="card-pagination-gap" aria-hidden="true">...</span>');
            }

            pageItems.push(`<button class="card-page-button${page === currentCardPage ? ' is-active' : ''}" type="button" data-card-page="${page}" aria-label="Go to page ${page}"${page === currentCardPage ? ' aria-current="page"' : ''}>${page}</button>`);
            previousPage = page;
        });

        cardPagination.innerHTML = `
            <button class="card-page-button card-page-previous" type="button" data-card-page="${Math.max(1, currentCardPage - 1)}" aria-label="Previous page"${currentCardPage === 1 ? ' disabled' : ''}>Previous</button>
            <span class="card-page-list">${pageItems.join('')}</span>
            <button class="card-page-button card-page-next" type="button" data-card-page="${Math.min(pageCount, currentCardPage + 1)}" aria-label="Next page"${currentCardPage === pageCount ? ' disabled' : ''}>Next</button>
        `;
    }

    function renderSession(session) {
        const user = session?.user || getStoredSession()?.user;
        const username = user?.username || 'User';

        if (usernameEl) {
            usernameEl.textContent = username;
        }

        if (settingsUsername) {
            settingsUsername.textContent = username;
        }
        if (settingsUsernameInput) {
            settingsUsernameInput.value = username;
        }
        if (settingsRegistered) {
            settingsRegistered.textContent = formatAccountDate(user?.createdAt, false);
        }
        if (settingsLastActive) {
            settingsLastActive.textContent = formatAccountDate(user?.lastLoginAt, true);
        }
    }

    function formatAccountDate(value, includeTime) {
        if (!value) {
            return '-';
        }

        const date = new Date(value);
        if (Number.isNaN(date.getTime())) {
            return '-';
        }

        const datePart = date.toISOString().slice(0, 10);
        return includeTime ? `${datePart} ${date.toISOString().slice(11, 19)}` : datePart;
    }

    function setStatus(message, type = '') {
        if (!settingsStatus) {
            return;
        }

        settingsStatus.textContent = message;
        settingsStatus.classList.toggle('is-success', type === 'success');
        settingsStatus.classList.toggle('is-error', type === 'error');
    }

    function renderOnlineCount(value) {
        if (!onlineCountEl) {
            return;
        }

        onlineCountEl.textContent = `${Math.max(0, Number(value) || 0)} Users Online`;
    }

    function liveOnlineCount() {
        return Number(currentSettings?.onlineBase) || 0;
    }

    function renderNoticeText(value) {
        return escapeHtml(value).replace(/\bONLY\b/g, '<strong class="accent-red">ONLY</strong>');
    }

    function renderDashboardContent(content = {}) {
        if (attentionTitle && content.attentionTitle) {
            attentionTitle.textContent = content.attentionTitle;
        }

        if (attentionBody && content.attentionBody) {
            attentionBody.textContent = content.attentionBody;
        }

        if (attentionLinks && Array.isArray(content.attentionLinks)) {
            attentionLinks.innerHTML = content.attentionLinks.map((link) => {
                const isRed = link.tone === 'red';
                const toneClass = isRed ? ' class="accent-red"' : '';
                const href = escapeHtml(link.href || '#');
                const externalAttrs = /^https?:\/\//i.test(link.href || '') ? ' target="_blank" rel="noreferrer"' : '';

                return `<li><span${toneClass}>${escapeHtml(link.label)}:</span> <a${toneClass} href="${href}"${externalAttrs}>${escapeHtml(link.text)}</a></li>`;
            }).join('');
        }

        if (noticeTitle && content.noticeTitle) {
            noticeTitle.textContent = content.noticeTitle;
        }

        if (noticeParagraphs && Array.isArray(content.noticeParagraphs)) {
            noticeParagraphs.innerHTML = content.noticeParagraphs
                .map((paragraph) => `<p>${renderNoticeText(paragraph)}</p>`)
                .join('');
        }

            if (virtualCardPreviewNote && content.virtualCardNote) {
                virtualCardPreviewNote.textContent = content.virtualCardNote;
            }
    }

    function visibleTickerItems() {
        const count = Math.min(VISIBLE_TICKER_ROWS, tickerItems.length);

        return Array.from({ length: count }, (_, index) => tickerItems[(tickerIndex + index) % tickerItems.length]);
    }

    function renderFeed(animate = false) {
        if (!activityFeedEl) {
            return;
        }

        if (!tickerItems.length) {
            activityFeedEl.innerHTML = '<div class="ticker-list"><p>No live activity yet.</p></div>';
            return;
        }

        if (animate) {
            activityFeedEl.classList.remove('is-transitioning');
        }

        activityFeedEl.innerHTML = `
            <div class="ticker-list">
                ${visibleTickerItems().map((item) => `
                    <p class="ticker-item">
                        <strong>@${escapeHtml(item.actor)}</strong>
                        ${escapeHtml(item.message)}
                        <a href="#">${escapeHtml(item.target)}</a>
                    </p>
                `).join('')}
            </div>
        `;

        if (animate) {
            window.requestAnimationFrame(() => {
                activityFeedEl.classList.add('is-transitioning');
                window.setTimeout(() => activityFeedEl.classList.remove('is-transitioning'), 460);
            });
        }
    }

    function stopTicker() {
        if (tickerTimer) {
            window.clearInterval(tickerTimer);
            tickerTimer = null;
        }
    }

    function startTicker() {
        stopTicker();

        const interval = Math.max(
            1500,
            Number(currentSettings?.slideIntervalMs) || DEFAULT_SLIDE_INTERVAL_MS
        );

        tickerTimer = window.setInterval(() => {
            if (tickerItems.length > 1) {
                tickerIndex = (tickerIndex + 1) % tickerItems.length;
                renderFeed(true);
            }

            renderOnlineCount(liveOnlineCount());
        }, interval);
    }

    function listToTextarea(list) {
        return Array.isArray(list) ? list.join('\n') : '';
    }

    function textareaToList(element) {
        return String(element?.value || '')
            .split(/\r?\n/)
            .map((item) => item.trim())
            .filter(Boolean);
    }

    function templatesToTextarea(templates) {
        return Array.isArray(templates)
            ? templates.map((template) => `${template.message} | ${template.targetPool} | ${template.status}`).join('\n')
            : '';
    }

    function normalizeTargetPool(value) {
        const pool = String(value || '').trim().toLowerCase();
        return ['amounts', 'orders', 'tickets', 'labels'].includes(pool) ? pool : 'labels';
    }

    function textareaToTemplates(element) {
        return String(element?.value || '')
            .split(/\r?\n/)
            .map((line) => line.trim())
            .filter(Boolean)
            .map((line) => {
                const [message, targetPool = 'labels', status = 'Active'] = line.split('|').map((part) => part.trim());

                return {
                    message,
                    targetPool: normalizeTargetPool(targetPool),
                    status
                };
            })
            .filter((template) => template.message);
    }

    function populateSettings(settings, force = false) {
        if (!settings || !tickerSettingsForm || (settingsDirty && !force)) {
            return;
        }

        onlineBaseInput.value = settings.onlineBase ?? 80;
        autoFluctuateToggle.checked = Boolean(settings.autoFluctuate);
        fluctuationRangeInput.value = settings.fluctuationRange ?? 5;
        slideIntervalInput.value = settings.slideIntervalMs ?? DEFAULT_SLIDE_INTERVAL_MS;
        tickerUsersInput.value = listToTextarea(settings.usernames);
        tickerActionsInput.value = templatesToTextarea(settings.activityTemplates);
        tickerAmountsInput.value = listToTextarea(settings.amounts);
        tickerOrdersInput.value = listToTextarea(settings.orders);
        tickerTicketsInput.value = listToTextarea(settings.tickets);
        tickerLabelsInput.value = listToTextarea(settings.labels);
        settingsDirty = false;
        setStatus('Synced', 'success');
    }

    function collectSettings() {
        return {
            onlineBase: Number(onlineBaseInput.value),
            autoFluctuate: Boolean(autoFluctuateToggle.checked),
            fluctuationRange: Number(fluctuationRangeInput.value),
            slideIntervalMs: Number(slideIntervalInput.value),
            usernames: textareaToList(tickerUsersInput),
            activityTemplates: textareaToTemplates(tickerActionsInput),
            amounts: textareaToList(tickerAmountsInput),
            orders: textareaToList(tickerOrdersInput),
            tickets: textareaToList(tickerTicketsInput),
            labels: textareaToList(tickerLabelsInput)
        };
    }

    function applyDashboardData(data, options = {}) {
        renderSession(data.session);

        currentSettings = data.settings || currentSettings;
        if (telegramSupportLink && currentSettings?.telegramUrl) {
            telegramSupportLink.href = currentSettings.telegramUrl;
        }
        if (checkerPrice && data.checkerSettings) {
            checkerPriceValue = Number(data.checkerSettings.price || 0);
            checkerPrice.textContent = `Price: $${checkerPriceValue.toFixed(2)}`;
        }
        tickerItems = Array.isArray(data.items) ? data.items : [];
        tickerIndex = options.preserveTicker && tickerItems.length ? tickerIndex % tickerItems.length : 0;

        renderFeed(false);
        renderOnlineCount(data.onlineUsers || 0);
        renderDashboardContent({
            ...(data.dashboardContent || currentSettings?.dashboardContent),
            virtualCardNote: data.settings?.virtualCardNote || data.dashboardContent?.virtualCardNote || currentSettings?.virtualCardNote
        });
        populateSettings(currentSettings, Boolean(options.forceSettings));
        startTicker();

        if (walletBalance) {
            setWalletBalance(data.walletBalance);
        }

        if (cartCount) {
            cartCount.textContent = String(data.cartCount ?? 3);
        }
    }

    async function loadDashboardData(options = {}) {
        try {
            const data = await apiGet('/dashboard/news');
            applyDashboardData(data, options);
            const subPriceData = await apiGet('/settings/sub-price');
            subPriceValue = Number(subPriceData.price || 0);
            if (subPriceBadge) {
                subPriceBadge.textContent = `Price: $${subPriceValue.toFixed(2)}`;
            }
        } catch (error) {
            if (error.message !== 'Session expired') {
                if (activityFeedEl) {
                    activityFeedEl.innerHTML = '<div class="ticker-list"><p>Unable to load live activity.</p></div>';
                }

                setStatus('Offline', 'error');
            }
        }
    }

    async function loadAnnouncementAlert() {
        try {
            const data = await apiGet('/announcement-alert');
            const alert = data.alert;

            if (!alert?.is_enabled) {
                return;
            }

            announcementTitle.textContent = alert.title;
            announcementMessage.textContent = alert.message;
            announcementAction.textContent = alert.action_text;
            announcementAction.href = alert.action_link || '#';
            announcementAction.hidden = !alert.action_text;
            announcementSecondary.textContent = alert.secondary_text || 'Close';
            announcementModal.hidden = false;
        } catch (error) {
            if (error.message !== 'Session expired') {
                return;
            }
        }
    }

    function dismissAnnouncementAlert() {
        announcementModal.hidden = true;
    }

    async function saveAccountProfile(event) {
        event.preventDefault();
        const formData = new FormData(accountSettingsForm);
        accountSettingsStatus.textContent = 'Saving...';
        accountSettingsStatus.className = 'settings-status';
        saveAccountSettings.disabled = true;

        try {
            const data = await apiPost('/user/update-profile', {
                current_password: formData.get('current_password'),
                new_password: formData.get('new_password'),
                confirm_new_password: formData.get('confirm_new_password')
            });
            accountSettingsStatus.textContent = data.message || 'Password updated successfully.';
            accountSettingsStatus.classList.add('is-success');
            sessionStorage.removeItem(SESSION_KEY);
            window.setTimeout(() => window.location.replace('/login/'), 700);
        } catch (error) {
            accountSettingsStatus.textContent = error.message || 'Unable to save changes';
            accountSettingsStatus.classList.add('is-error');
            saveAccountSettings.disabled = false;
        }
    }

    async function loadCardRecords() {
        const startedAt = performance.now();

        try {
            const data = await apiGet(`/dashboard/cards${cardQueryString(cardFilters())}`);
            cardQueryResult = data;
            currentCardPage = data.page || currentCardPage;
            applyCardFacets(data.facets);
            renderCardTable(data);

            if (cardMatchTiming) {
                const elapsed = Number.isFinite(data.matchMs) ? data.matchMs : performance.now() - startedAt;
                cardMatchTiming.textContent = ` in ${Math.max(0, Math.round(elapsed))}ms · Page ${data.page || currentCardPage} of ${data.pageCount || 1}`;
            }
        } catch (error) {
            cardQueryResult = { cards: [], total: 0, page: 1, pageCount: 1 };
            renderCardTable(cardQueryResult);

            if (cardMatchTiming) {
                cardMatchTiming.textContent = ' · Unable to load';
            }
        }
    }

    function ssnQueryString() {
        const params = new URLSearchParams(new FormData(ssnFilterForm));

        [...params.keys()].forEach((key) => {
            if (!params.get(key)) {
                params.delete(key);
            }
        });

        return params.toString() ? `?${params.toString()}` : '';
    }

    function maskSsnLocation(value) {
        const text = String(value || '');

        return text.length > 2 ? `${text.slice(0, 1)}${'*'.repeat(Math.max(3, text.length - 1))}` : '***';
    }

    function showDashboardToast(message, type = '') {
        if (!dashboardToast) {
            return;
        }

        dashboardToast.textContent = message;
        dashboardToast.className = `dashboard-toast${type ? ` is-${type}` : ''}`;
        dashboardToast.hidden = false;
        window.clearTimeout(showDashboardToast.timer);
        showDashboardToast.timer = window.setTimeout(() => {
            dashboardToast.hidden = true;
        }, 4200);
    }

    function setWalletBalance(value) {
        const normalizedValue = typeof value === 'number'
            ? value
            : Number(String(value || '').replace(/[^\d.-]/g, ''));

        walletBalanceValue = Number.isFinite(normalizedValue) ? normalizedValue : 0;
        if (walletBalance) {
            walletBalance.textContent = `$${walletBalanceValue.toFixed(2)}`;
        }
        if (depositBalance) {
            depositBalance.textContent = `$${walletBalanceValue.toFixed(2)}`;
        }
    }

    function passesLuhnCheck(value) {
        const digits = String(value || '').replace(/\D/g, '');
        let checksum = 0;
        let shouldDouble = false;

        if (digits.length < 12) {
            return false;
        }

        for (let index = digits.length - 1; index >= 0; index -= 1) {
            let digit = Number(digits[index]);
            if (shouldDouble) {
                digit *= 2;
                if (digit > 9) {
                    digit -= 9;
                }
            }
            checksum += digit;
            shouldDouble = !shouldDouble;
        }

        return checksum % 10 === 0;
    }

    function validateCheckerForm(form) {
        if (!form) {
            return false;
        }

        const cardNumber = form.elements.cardNumber || form.elements.subCardNumber;
        const expiry = form.elements.expiry || form.elements.subExpiry;
        const cvv = form.elements.cvv || form.elements.subCvv;
        const expiryValue = String(expiry?.value || '').trim();
        const cvvValue = String(cvv?.value || '').trim();
        const expiryIsValid = /^(0[1-9]|1[0-2])\/\d{2}$/.test(expiryValue);
        const cvvIsValid = /^\d{3,4}$/.test(cvvValue);

        cardNumber?.setCustomValidity(passesLuhnCheck(cardNumber.value) ? '' : 'Enter a valid card number.');
        expiry?.setCustomValidity(expiryIsValid ? '' : 'Enter an expiry date in MM/YY format.');
        cvv?.setCustomValidity(cvvIsValid ? '' : 'Enter a valid CVV2.');

        return form.reportValidity();
    }

    async function simulateChecker(sourceButton) {
        const actionButtons = [authorizeCheck, zeroCheck, otpBypassButton].filter(Boolean);
        const form = sourceButton === otpBypassButton ? otpBypassForm : checkerForm;
        const featurePrice = sourceButton === otpBypassButton ? subPriceValue : checkerPriceValue;

        if (!checkerProcessingModal || !checkerComingModal || sourceButton?.disabled || actionButtons.some((button) => button.disabled)) {
            return;
        }

        if (!validateCheckerForm(form)) {
            return;
        }

        if (walletBalanceValue < featurePrice) {
            showDashboardToast('Insufficient wallet balance. Please add funds.', 'error');
            return;
        }

        actionButtons.forEach((button) => {
            button.disabled = true;
        });

        try {
            const chargePath = sourceButton === otpBypassButton ? '/dashboard/sub-charge' : '/checker/charge';
            const data = await apiPost(chargePath);

            setWalletBalance(data.walletBalance);
        } catch (error) {
            actionButtons.forEach((button) => {
                button.disabled = false;
            });
            if (error.message !== 'Session expired') {
                showDashboardToast(error.message, 'error');
            }
            return;
        }

        checkerProcessingModal.hidden = false;

        window.setTimeout(() => {
            checkerProcessingModal.hidden = true;
            checkerComingModal.hidden = false;
            checkerComingOk.focus();
        }, 10000);
    }

    authorizeCheck?.addEventListener('click', () => simulateChecker(authorizeCheck));
    zeroCheck?.addEventListener('click', () => simulateChecker(zeroCheck));
    otpBypassButton?.addEventListener('click', () => simulateChecker(otpBypassButton));
    clearChecker?.addEventListener('click', () => {
        checkerForm?.reset();
    });
    checkerComingOk?.addEventListener('click', () => {
        checkerComingModal.hidden = true;
        [authorizeCheck, zeroCheck, otpBypassButton].filter(Boolean).forEach((button) => {
            button.disabled = false;
        });
    });
    document.querySelectorAll('[data-coming-soon-nav]').forEach((link) => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            checkerComingModal.hidden = false;
            checkerComingOk?.focus();
        });
    });
    checkerComingModal?.addEventListener('click', (event) => {
        if (event.target === checkerComingModal) {
            checkerComingOk.click();
        }
    });

    function renderSsnPagination(pageCount) {
        if (!ssnPagination) {
            return;
        }

        if (pageCount <= 1) {
            ssnPagination.innerHTML = '';
            return;
        }

        const pages = new Set([1, pageCount, currentSsnPage - 1, currentSsnPage, currentSsnPage + 1]);
        const orderedPages = [...pages].filter((page) => page > 0 && page <= pageCount).sort((left, right) => left - right);
        const pageItems = [];
        let previousPage = 0;

        orderedPages.forEach((page) => {
            if (page - previousPage > 1) {
                pageItems.push('<span class="card-pagination-gap" aria-hidden="true">...</span>');
            }
            pageItems.push(`<button class="card-page-button${page === currentSsnPage ? ' is-active' : ''}" type="button" data-ssn-page="${page}" aria-label="Go to SSN page ${page}"${page === currentSsnPage ? ' aria-current="page"' : ''}>${page}</button>`);
            previousPage = page;
        });

        ssnPagination.innerHTML = `<button class="card-page-button" type="button" data-ssn-page="${Math.max(1, currentSsnPage - 1)}"${currentSsnPage === 1 ? ' disabled' : ''}>Previous</button><span class="card-page-list">${pageItems.join('')}</span><button class="card-page-button" type="button" data-ssn-page="${Math.min(pageCount, currentSsnPage + 1)}"${currentSsnPage === pageCount ? ' disabled' : ''}>Next</button>`;
    }

    function renderSsnTable(result = ssnQueryResult) {
        if (!ssnTableBody) {
            return;
        }

        const records = Array.isArray(result.records) ? result.records : [];

        if (ssnResultsSummary) {
            ssnResultsSummary.textContent = result.isRandom
                ? `Showing ${records.length} random active records`
                : `${Number(result.total || 0).toLocaleString()} matching records`;
        }

        renderSsnPagination(Number(result.pageCount) || 1);

        if (!records.length) {
            ssnTableBody.replaceChildren();
            const emptyRow = document.createElement('tr');
            emptyRow.innerHTML = '<td colspan="7" class="empty-history">No matching active records.</td>';
            ssnTableBody.append(emptyRow);
            return;
        }

        const rowsTemplate = document.createElement('template');
        rowsTemplate.innerHTML = records.map((record) => `
            <tr>
                <td>${escapeHtml(record.firstName)}</td>
                <td>${escapeHtml(record.lastName)}</td>
                <td>${escapeHtml(record.dob)}</td>
                <td>${escapeHtml(maskSsnLocation(record.city))}</td>
                <td>${escapeHtml(record.state)}</td>
                <td>${escapeHtml(maskSsnLocation(record.zip))}</td>
                <td><button class="action-button" type="button" data-buy-ssn="${escapeHtml(record.id)}">Buy $${Number(record.price || 1).toFixed(2)}</button></td>
            </tr>
        `).join('');
        const rowsFragment = document.createDocumentFragment();
        rowsFragment.append(rowsTemplate.content.cloneNode(true));
        ssnTableBody.replaceChildren(rowsFragment);
    }

    function scheduleSsnSearch() {
        window.clearTimeout(ssnFilterTimer);
        ssnFilterTimer = window.setTimeout(() => {
            currentSsnPage = 1;
            loadSsnRecords();
        }, 250);
    }

    async function loadSsnRecords() {
        if (!ssnFilterForm || !ssnTableBody) {
            return;
        }

        ssnTableBody.innerHTML = '<tr><td colspan="7" class="empty-history">Loading SSN records...</td></tr>';

        try {
            const query = ssnQueryString();
            const separator = query ? '&' : '?';
            ssnQueryResult = await apiGet(`/dashboard/ssn${query}${separator}page=${currentSsnPage}`);
            currentSsnPage = ssnQueryResult.page || currentSsnPage;
            renderSsnTable(ssnQueryResult);
            if (ssnStatus) {
                ssnStatus.textContent = ssnQueryResult.isRandom ? 'Showing random active inventory' : 'Search complete';
            }
        } catch (error) {
            ssnQueryResult = { records: [], total: 0, isRandom: false };
            renderSsnTable(ssnQueryResult);
            if (ssnStatus) {
                ssnStatus.textContent = error.message || 'Unable to load SSN records';
            }
        }
    }

    function renderDepositTimer() {
        if (!depositTimer) {
            return;
        }

        const remaining = Math.max(0, depositExpiresAt - Date.now());
        const minutes = Math.floor(remaining / 60000);
        const seconds = Math.floor((remaining % 60000) / 1000);

        depositTimer.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        depositTimer.classList.toggle('is-expired', remaining === 0);
    }

    function startDepositTimer() {
        window.clearInterval(depositTimerHandle);
        renderDepositTimer();
        depositTimerHandle = window.setInterval(renderDepositTimer, 1000);
    }

    function selectDepositMethod(methodId) {
        const activeMethods = depositSettings?.methods?.filter((candidate) => candidate.active !== false) || [];
        const method = activeMethods.find((candidate) => candidate.id === methodId) || activeMethods[0];

        if (!method) {
            return;
        }

        selectedDepositMethodId = method.id;
        selectedCryptoName.textContent = `${method.name} (${method.symbol}${method.network ? ` · ${method.network}` : ''})`;
        depositNetworkNote.textContent = method.networkNote;
        depositAddress.value = method.address;
        depositQr.src = method.qrImage;
        depositQr.alt = `${method.name} wallet QR code`;
        depositExpiresAt = Date.now() + (Number(depositSettings.paymentWindowMinutes) || 40) * 60000;
        startDepositTimer();

        cryptoTabs.querySelectorAll('.payment-tab').forEach((tab) => {
            const isActive = tab.dataset.methodId === method.id;
            tab.classList.toggle('is-active', isActive);
            tab.setAttribute('aria-selected', String(isActive));
        });
    }

    function renderDepositSettings(settings) {
        depositSettings = { ...settings, methods: settings.methods.filter((method) => method.active !== false) };
        cryptoTabs.innerHTML = depositSettings.methods.map((method, index) => `
            <button class="payment-tab${index === 0 ? ' is-active' : ''}" type="button" role="tab" aria-selected="${index === 0}" data-method-id="${escapeHtml(method.id)}">
                ${escapeHtml(method.name)}
            </button>
        `).join('');
        bonusTiers.innerHTML = depositSettings.bonusTiers.map((tier) => `
            <div><span>From $${Number(tier.threshold).toLocaleString()} </span><strong>+${escapeHtml(tier.percent)}% Bonus</strong></div>
        `).join('');
        cryptoTabs.querySelectorAll('.payment-tab').forEach((tab) => {
            tab.addEventListener('click', () => selectDepositMethod(tab.dataset.methodId));
        });
        selectDepositMethod(selectedDepositMethodId || depositSettings.methods[0]?.id);
    }

    function renderDepositHistory(deposits) {
        if (!depositHistoryBody) {
            return;
        }

        if (!deposits.length) {
            depositHistoryBody.innerHTML = '<tr><td colspan="7" class="empty-history">No deposit orders yet.</td></tr>';
            return;
        }

        depositHistoryBody.innerHTML = deposits.map((deposit) => `
            <tr>
                <td>#${escapeHtml(deposit.id)}</td>
                <td><span class="deposit-status is-${escapeHtml(deposit.status.toLowerCase())}">${escapeHtml(deposit.status)}</span></td>
                <td>${escapeHtml(new Date(deposit.date).toLocaleString())}</td>
                <td>${escapeHtml(deposit.method)}</td>
                <td>$${Number(deposit.amount).toFixed(2)}</td>
                <td>$${Number(deposit.value).toFixed(2)}${deposit.bonus ? ` (+$${Number(deposit.bonus).toFixed(2)})` : ''}</td>
                <td title="${escapeHtml(deposit.wallet)}">${escapeHtml(deposit.wallet.slice(0, 12))}...</td>
            </tr>
        `).join('');
    }

    async function loadDepositData() {
        try {
            const data = await apiGet('/dashboard/deposit');
            renderDepositSettings(data.settings);
            renderDepositHistory(data.deposits || []);
            const balance = `$${Number(data.walletBalance || 0).toFixed(2)}`;

            walletBalance.textContent = balance;
            depositBalance.textContent = balance;
        } catch (error) {
            if (error.message !== 'Session expired') {
                depositNetworkNote.textContent = error.message || 'Unable to load deposit settings.';
            }
        }
    }

    function formatVirtualCardNumber(number) {
        return String(number || '').replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim();
    }

    function generatePreviewNumber(type) {
        const prefix = type === 'MASTERCARD' ? '52' : '4';
        let number = prefix;

        while (number.length < 15) number += Math.floor(Math.random() * 10);

        let checksum = 0;
        let doubleDigit = true;
        for (let index = number.length - 1; index >= 0; index -= 1) {
            let digit = Number(number[index]);
            if (doubleDigit) {
                digit *= 2;
                if (digit > 9) digit -= 9;
            }
            checksum += digit;
            doubleDigit = !doubleDigit;
        }

        return number + ((10 - (checksum % 10)) % 10);
    }

    function maskVirtualCardCvv(cvv) {
        const value = String(cvv || '');
        return value ? `${value.charAt(0)}**` : '***';
    }

    function maskVirtualCardExpiry(expiry) {
        return '**/**';
    }

    function updateVirtualCardPreview({ regenerate = false } = {}) {
        const type = virtualCardType?.value || 'VISA';
        if (regenerate || !virtualPreviewDetails || virtualPreviewDetails.type !== type) {
            virtualPreviewDetails = {
                type,
                number: generatePreviewNumber(type),
                expiry: (() => {
                    const date = new Date();
                    date.setFullYear(date.getFullYear() + 3);
                    return `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getFullYear()).slice(-2)}`;
                })(),
                cvv: String(Math.floor(100 + Math.random() * 900))
            };
        }

        virtualCardPreview?.classList.toggle('is-mastercard', type === 'MASTERCARD');
        virtualCardPreview?.classList.toggle('is-visa', type === 'VISA');
        previewNetwork.textContent = type === 'MASTERCARD' ? 'MASTERCARD' : 'VISA';
        const hasAssignedCredentials = virtualPreviewDetails.number && virtualPreviewDetails.expiry && virtualPreviewDetails.cvv;
        previewNumber.textContent = hasAssignedCredentials ? `**** **** **** ${String(virtualPreviewDetails.number).slice(-4)}` : '**** **** **** ****';
        previewExpiry.textContent = hasAssignedCredentials
            ? virtualPreviewRevealed ? virtualPreviewDetails.expiry : maskVirtualCardExpiry(virtualPreviewDetails.expiry)
            : 'MM/YY';
        previewCvv.textContent = hasAssignedCredentials
            ? virtualPreviewRevealed ? virtualPreviewDetails.cvv : maskVirtualCardCvv(virtualPreviewDetails.cvv)
            : '***';
        previewName.textContent = (virtualCardName?.value || 'CARDHOLDER NAME').trim().toUpperCase();
    }

    function renderVirtualCards(cards) {
        if (!virtualCardsTableBody) return;
        if (!cards.length) {
            virtualCardsTableBody.innerHTML = '<tr><td colspan="9" class="empty-history">No virtual cards yet.</td></tr>';
            return;
        }

        virtualCardsTableBody.innerHTML = cards.map((card) => `
            <tr>
                <td>#${escapeHtml(card.id)}</td>
                <td>${escapeHtml(card.type)}</td>
                <td>$${Number(card.amount).toFixed(2)}</td>
                <td>${escapeHtml(card.name)}</td>
                <td class="virtual-card-sensitive">${escapeHtml(card.masked_number || '**** **** **** ****')}</td>
                <td>${escapeHtml(maskVirtualCardExpiry(card.expiry))}</td>
                <td class="virtual-card-sensitive">${escapeHtml(card.masked_cvv || maskVirtualCardCvv(card.cvv))}</td>
                <td><span class="deposit-status is-${escapeHtml(String(card.status || '').toLowerCase())}">${escapeHtml(card.status)}</span></td>
                <td><button class="admin-button" type="button" data-view-card="${escapeHtml(card.id)}">View</button></td>
            </tr>
        `).join('');
    }

    function showVirtualCardDetails(card) {
        if (!virtualCardDetailsModal || !virtualCardDetailsContent || !card) {
            return;
        }

        const detailRows = [
            ['Card ID', `#${card.id}`],
            ['Type', card.type],
            ['Amount', `$${Number(card.amount || 0).toFixed(2)}`],
            ['Cardholder', card.name],
            ['Number', card.masked_number || card.number || '**** **** **** ****'],
            ['Expiry', card.expiry || card.masked_expiry || 'MM/YY'],
            ['CVV', card.cvv || card.masked_cvv || '***'],
            ['Status', card.status]
        ];

        virtualCardDetailsContent.innerHTML = `
            <dl class="purchase-details-list">
                ${detailRows.map(([label, value]) => `<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(String(value || '-'))}</dd></div>`).join('')}
            </dl>
        `;
        virtualCardDetailsModal.hidden = false;
    }

    async function viewVirtualCard(cardId, button) {
        if (!cardId) {
            return;
        }

        button.disabled = true;
        try {
            const data = await apiGet(`/virtual-cards/${cardId}/reveal`);
            const card = data.card;
            const recordIndex = virtualCardRecords.findIndex((record) => String(record.id) === String(cardId));
            if (recordIndex >= 0) {
                virtualCardRecords[recordIndex] = { ...virtualCardRecords[recordIndex], ...card };
            }
            if (card.status === 'Active' && card.number) {
                virtualPreviewRevealed = true;
                virtualPreviewDetails = { type: card.type, number: card.number, expiry: card.expiry, cvv: card.cvv };
                updateVirtualCardPreview();
            }
            showVirtualCardDetails(card);
        } catch (error) {
            if (error.message !== 'Session expired') {
                showDashboardToast(error.message || 'Unable to load card details', 'error');
            }
        } finally {
            button.disabled = false;
        }
    }

    function closeVirtualCardDetails() {
        if (virtualCardDetailsModal) {
            virtualCardDetailsModal.hidden = true;
        }
    }

    async function loadVirtualCards() {
        try {
            const data = await apiGet('/dashboard/virtual-cards');
            virtualCardRecords = Array.isArray(data.cards) ? data.cards : [];
            renderVirtualCards(virtualCardRecords);
            if (virtualCardBalance) virtualCardBalance.textContent = `$${Number(data.walletBalance || 0).toFixed(2)}`;
        } catch (error) {
            if (error.message !== 'Session expired' && virtualCardStatus) virtualCardStatus.textContent = error.message;
        }
    }

    async function createVirtualCard(event) {
        event.preventDefault();
        virtualCardStatus.textContent = 'Creating...';

        try {
            const data = await apiPost('/dashboard/virtual-cards', {
                type: virtualCardType.value,
                amount: virtualCardAmount.value,
                name: virtualCardName.value
            });
            virtualCardStatus.textContent = 'Request submitted. Awaiting admin approval.';
            setWalletBalance(data.walletBalance);
            virtualCardBalance.textContent = `$${Number(data.walletBalance || 0).toFixed(2)}`;
            virtualPreviewRevealed = false;
            virtualPreviewDetails = data.card;
            virtualCardName.value = data.card.name;
            updateVirtualCardPreview();
            await loadVirtualCards();
        } catch (error) {
            virtualCardStatus.textContent = error.message || 'Unable to create card';
        }
    }

    function renderPurchases(purchases) {
        if (!purchaseTableBody) return;

        const visiblePurchases = viewFromHash() === 'purchases-ssn'
            ? purchases.filter((purchase) => purchase.category === 'SSN')
            : purchases;

        if (!visiblePurchases.length) {
            purchaseTableBody.innerHTML = '<tr><td colspan="7" class="empty-history">No completed purchases yet.</td></tr>';
            return;
        }

        purchaseTableBody.innerHTML = visiblePurchases.map((purchase) => `
            <tr>
                <td>#${escapeHtml(purchase.id)}</td>
                <td>
                    <strong>${escapeHtml(purchase.itemName)}</strong>
                    ${purchase.note ? `<small>${escapeHtml(purchase.note)}</small>` : ''}
                    ${purchase.ssnDetails ? `<small class="purchase-sensitive">SSN: ${escapeHtml(purchase.ssnDetails.ssnNumber)} · DOB: ${escapeHtml(purchase.ssnDetails.dob)} · ${escapeHtml(purchase.ssnDetails.city)}, ${escapeHtml(purchase.ssnDetails.state)} ${escapeHtml(purchase.ssnDetails.zip)}</small>` : ''}
                </td>
                <td>${escapeHtml(new Date(purchase.date).toLocaleString())}</td>
                <td><span class="deposit-status is-${escapeHtml(String(purchase.status || '').toLowerCase())}">${escapeHtml(purchase.status)}</span></td>
                <td>$${Number(purchase.amount || 0).toFixed(2)}</td>
                <td>${escapeHtml(purchase.reference)}</td>
                <td><button class="admin-button" type="button" data-view-purchase="${escapeHtml(purchase.id)}">View</button></td>
            </tr>
        `).join('');
    }

    function showPurchaseDetails(purchase) {
        if (!purchaseDetailsModal || !purchaseDetailsContent || !purchase) {
            return;
        }

        const detailRows = [
            ['Order ID', `#${purchase.id}`],
            ['Item', purchase.itemName],
            ['Category', purchase.category],
            ['Status', purchase.status],
            ['Total', `$${Number(purchase.amount || 0).toFixed(2)}`],
            ['Reference', purchase.reference],
            ['Date', new Date(purchase.date).toLocaleString()]
        ];
        const details = purchase.details || purchase.adminNote || purchase.note;

        purchaseDetailsContent.innerHTML = `
            <dl class="purchase-details-list">
                ${detailRows.map(([label, value]) => `<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value || '-')}</dd></div>`).join('')}
            </dl>
            ${details ? `<div class="purchase-details-note"><strong>Details</strong><p>${escapeHtml(details)}</p></div>` : ''}
            ${purchase.ssnDetails ? `<div class="purchase-details-note"><strong>Record Details</strong><p>${escapeHtml(`${purchase.ssnDetails.firstName || ''} ${purchase.ssnDetails.lastName || ''} · DOB: ${purchase.ssnDetails.dob || '-'} · ${purchase.ssnDetails.city || ''}, ${purchase.ssnDetails.state || ''} ${purchase.ssnDetails.zip || ''}`)}</p></div>` : ''}
        `;
        purchaseDetailsModal.hidden = false;
        purchaseDetailsClose?.focus();
    }

    function closePurchaseDetails() {
        if (purchaseDetailsModal) {
            purchaseDetailsModal.hidden = true;
        }
    }

    async function loadPurchases(options = {}) {
        if (!options.silent && purchaseStatus) {
            purchaseStatus.textContent = 'Loading purchases...';
            purchaseStatus.classList.remove('is-error', 'is-success');
        }

        try {
            const data = await apiGet('/dashboard/purchases');
            purchaseRecords = data.purchases || [];
            renderPurchases(purchaseRecords);
            if (walletBalance) {
                walletBalance.textContent = `$${Number(data.walletBalance || 0).toFixed(2)}`;
            }
            if (purchaseStatus && !options.silent) {
                purchaseStatus.textContent = '';
            }
        } catch (error) {
            if (error.message !== 'Session expired' && purchaseStatus) {
                purchaseStatus.textContent = error.message || 'Unable to load purchases';
                purchaseStatus.classList.add('is-error');
            }
        }
    }

    async function buySsn(ssnId, button) {
        if (activePurchaseRequest) {
            return;
        }

        activePurchaseRequest = String(ssnId);
        button.disabled = true;

        try {
            const data = await apiPost('/dashboard/ssn/purchase', { ssnId });
            walletBalance.textContent = `$${Number(data.walletBalance || 0).toFixed(2)}`;
            showDashboardToast('Purchase Successful! Check My Purchases.', 'success');
            await loadSsnRecords();
            window.location.hash = 'purchases/ssn';
            await loadPurchases();
        } catch (error) {
            const message = error.message || 'Unable to complete purchase';
            showDashboardToast(message, 'error');
            button.disabled = false;
        } finally {
            activePurchaseRequest = null;
        }
    }

    function selectedCartItems() {
        return cartItems.filter((item) => selectedCartIds.has(String(item.id)));
    }

    function updateCartSummary() {
        const subtotal = selectedCartItems().reduce((sum, item) => sum + Number(item.price || 0), 0);
        const discount = Number((subtotal * 0.03).toFixed(2));
        if (cartDiscount) cartDiscount.textContent = `$${discount.toFixed(2)}`;
        if (cartTotal) cartTotal.textContent = `$${(subtotal - discount).toFixed(2)}`;
        if (selectAllCartItems) {
            selectAllCartItems.checked = cartItems.length > 0 && selectedCartIds.size === cartItems.length;
            selectAllCartItems.indeterminate = selectedCartIds.size > 0 && selectedCartIds.size < cartItems.length;
        }
    }

    function renderCart(items) {
        cartItems = items || [];
        selectedCartIds.forEach((id) => {
            if (!cartItems.some((item) => String(item.id) === id)) selectedCartIds.delete(id);
        });
        if (!cartTableBody) return;
        cartTableBody.innerHTML = cartItems.length ? cartItems.map((item) => `
            <tr>
                <td><input type="checkbox" class="cart-row-checkbox" data-cart-id="${escapeHtml(item.id)}" aria-label="Select ${escapeHtml(item.type)} card"${selectedCartIds.has(String(item.id)) ? ' checked' : ''}></td>
                <td>${escapeHtml(item.bin)}</td><td>${escapeHtml(item.bank)}</td><td>${escapeHtml(item.type)}</td>
                <td>${escapeHtml(item.country)}</td><td>$${Number(item.price).toFixed(2)}</td>
                <td><button class="action-button" type="button" data-remove-cart="${escapeHtml(item.id)}">Remove</button></td>
            </tr>`).join('') : '<tr><td colspan="7" class="empty-history">Your cart is empty.</td></tr>';
        updateCartSummary();
        if (cartCount) cartCount.textContent = String(cartItems.length);
    }

    async function loadCart() {
        try {
            const data = await apiGet('/dashboard/cart');
            renderCart(data.items || []);
            if (walletBalance) walletBalance.textContent = `$${Number(data.walletBalance || 0).toFixed(2)}`;
            if (cartStatus) cartStatus.textContent = '';
        } catch (error) {
            if (cartStatus && error.message !== 'Session expired') cartStatus.textContent = error.message;
        }
    }

    async function removeCartItems(ids) {
        if (!ids.length) return;
        const data = await apiRequest('/dashboard/cart', { method: 'DELETE', headers: { 'Content-Type': 'application/json; charset=utf-8' }, body: JSON.stringify({ cardIds: ids }) });
        renderCart(data.items || []);
    }

    async function checkoutCart() {
        const ids = [...selectedCartIds];
        if (!ids.length) {
            if (cartStatus) cartStatus.textContent = 'Select at least one item.';
            return;
        }
        completeOrder.disabled = true;
        if (cartStatus) cartStatus.textContent = 'Processing order...';
        try {
            const data = await apiPost('/dashboard/cart/checkout', { cardIds: ids });
            if (walletBalance) walletBalance.textContent = `$${Number(data.walletBalance || 0).toFixed(2)}`;
            window.location.href = '/purchases/cvv';
        } catch (error) {
            if (cartStatus) cartStatus.textContent = error.message;
            completeOrder.disabled = false;
        }
    }

    async function addToCart(cardId, button) {
        if (!cardId || activePurchaseRequest) {
            return;
        }

        activePurchaseRequest = String(cardId);
        if (button) {
            button.disabled = true;
        }
        if (cardPurchaseStatus) {
            cardPurchaseStatus.textContent = 'Adding card to cart...';
            cardPurchaseStatus.classList.remove('is-error', 'is-success');
        }

        try {
            const data = await apiPost('/dashboard/cart', { cardId });

            if (cartCount) cartCount.textContent = String(data.cartCount || 0);
            window.location.href = '/cart';
        } catch (error) {
            if (cardPurchaseStatus) {
                cardPurchaseStatus.textContent = error.message || 'Unable to complete purchase';
                cardPurchaseStatus.classList.add('is-error');
            }
        } finally {
            activePurchaseRequest = null;
            if (button) {
                button.disabled = false;
            }
        }
    }

    function closeDepositModal() {
        paidDepositModal.hidden = true;
        paidDepositStatus.textContent = '';
        paidDepositForm.reset();
    }

    async function saveTickerSettings(event) {
        event.preventDefault();
        setStatus('Saving');

        try {
            const data = await apiPut('/admin/ticker-settings', collectSettings());
            currentSettings = data.settings;
            settingsDirty = false;
            populateSettings(currentSettings, true);
            setStatus('Saved', 'success');
            await loadDashboardData({
                forceSettings: true
            });
        } catch (error) {
            setStatus(error.message || 'Save failed', 'error');
        }
    }

    async function toggleFullscreen() {
        if (!document.fullscreenElement) {
            await document.documentElement.requestFullscreen?.();
            return;
        }

        await document.exitFullscreen?.();
    }

    const session = getStoredSession();

    if (!session?.token) {
        redirectToLogin();
        return;
    }

    renderSession(session);
    loadAnnouncementAlert();
    populateCountryOptions();
    showDashboardView(viewFromHash());
    updateVirtualCardPreview({ regenerate: true });
    renderCardTable();
    loadDashboardData();
    loadCardRecords();
    if (viewFromHash() === 'ssn') {
        loadSsnRecords();
    }
    if (viewFromHash() === 'deposit') {
        loadDepositData();
    }
    if (viewFromHash() === 'virtual-cards') {
        loadVirtualCards();
    }
    if (viewFromHash().startsWith('purchases')) {
        loadPurchases();
    }
    if (viewFromHash() === 'cart') {
        loadCart();
    }
    if (viewFromHash() === 'tickets') {
        renderTicketView();
    }
    dashboardRefreshTimer = window.setInterval(() => loadDashboardData({
        preserveTicker: true
    }).then(() => {
        if (viewFromHash() === 'cards') {
            return loadCardRecords();
        }

        if (viewFromHash() === 'deposit') {
            return loadDepositData();
        }

        if (viewFromHash().startsWith('purchases')) {
            return loadPurchases({ silent: true });
        }

        if (viewFromHash() === 'cart') {
            return loadCart();
        }

        if (viewFromHash() === 'ssn') {
            return loadSsnRecords();
        }

        if (viewFromHash() === 'tickets' && !ticketRouteId()) {
            return loadTicketHistory();
        }

        return undefined;
    }), REFRESH_INTERVAL_MS);

    viewLinks.forEach((link) => {
        link.addEventListener('click', () => {
            showDashboardView(link.dataset.viewLink);
        });
    });
    sidebarToggle?.addEventListener('click', () => {
        if (document.body.classList.contains('sidebar-open')) {
            closeSidebar();
        } else {
            openSidebar();
        }
    });
    sidebarCloseButton?.addEventListener('click', closeSidebar);
    dashboardBackdrop?.addEventListener('click', closeSidebar);
    dashboardSidebar?.addEventListener('click', (event) => {
        if (event.target.closest('a[href]')) {
            closeSidebar();
        }
    });
    window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeSidebar();
        }
    });
    window.addEventListener('resize', () => {
        if (!isMobileSidebarViewport()) {
            closeSidebar();
        }
    });
    closeSidebar();
    window.addEventListener('hashchange', () => {
        const view = viewFromHash();

        showDashboardView(view);
        if (view === 'deposit') {
            loadDepositData();
        }
        if (view === 'virtual-cards') {
            loadVirtualCards();
        }
        if (view.startsWith('purchases')) {
            loadPurchases();
        }
        if (view === 'cart') {
            loadCart();
        }
        if (view === 'ssn') {
            loadSsnRecords();
        }
        if (view === 'tickets') {
            renderTicketView();
        }
    });
    ticketCreateForm?.addEventListener('submit', createTicket);
    ticketReplyForm?.addEventListener('submit', replyToTicket);
    accountSettingsForm?.addEventListener('submit', saveAccountProfile);
    announcementClose?.addEventListener('click', dismissAnnouncementAlert);
    announcementSecondary?.addEventListener('click', dismissAnnouncementAlert);
    announcementAction?.addEventListener('click', () => {
        announcementModal.hidden = true;
    });
    refreshTickets?.addEventListener('click', loadTicketHistory);
    backToTickets?.addEventListener('click', () => {
        window.location.hash = 'tickets';
    });
    ssnFilterForm?.addEventListener('submit', (event) => {
        event.preventDefault();
        window.clearTimeout(ssnFilterTimer);
        currentSsnPage = 1;
        loadSsnRecords();
    });
    ssnFilterForm?.addEventListener('reset', () => window.setTimeout(() => {
        window.clearTimeout(ssnFilterTimer);
        currentSsnPage = 1;
        loadSsnRecords();
    }, 0));
    ssnFilterForm?.addEventListener('input', scheduleSsnSearch);
    ssnFilterForm?.addEventListener('change', scheduleSsnSearch);
    ssnPagination?.addEventListener('click', (event) => {
        const button = event.target.closest('[data-ssn-page]');
        if (!button || button.disabled) {
            return;
        }
        currentSsnPage = Number(button.dataset.ssnPage) || 1;
        loadSsnRecords();
    });
    ssnTableBody?.addEventListener('click', (event) => {
        const button = event.target.closest('[data-buy-ssn]');

        if (button) {
            buySsn(button.dataset.buySsn, button);
        }
    });
    walletBalance?.addEventListener('click', () => {
        const isOpen = !walletDropdown?.hidden;

        if (walletDropdown) {
            walletDropdown.hidden = isOpen;
        }
        walletBalance.setAttribute('aria-expanded', String(!isOpen));
    });
    walletDepositLink?.addEventListener('click', () => {
        if (walletDropdown) {
            walletDropdown.hidden = true;
        }
        walletBalance?.setAttribute('aria-expanded', 'false');
        showDashboardView('deposit');
    });
    copyDepositAddress?.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(depositAddress.value);
            copyDepositStatus.textContent = 'Address copied';
        } catch (error) {
            depositAddress.select();
            document.execCommand('copy');
            copyDepositStatus.textContent = 'Address copied';
        }
    });
    paidDepositButton?.addEventListener('click', () => {
        paidDepositModal.hidden = false;
        depositAmount.min = String(depositSettings?.minimumAmount || 0);
        depositAmount.focus();
    });
    closePaidModal?.addEventListener('click', closeDepositModal);
    paidDepositModal?.addEventListener('click', (event) => {
        if (event.target === paidDepositModal) {
            closeDepositModal();
        }
    });
    paidDepositForm?.addEventListener('submit', async (event) => {
        event.preventDefault();
        paidDepositStatus.textContent = 'Submitting...';

        try {
            const screenshot = depositScreenshot.files[0]
                ? await new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.addEventListener('load', () => resolve(reader.result));
                    reader.addEventListener('error', reject);
                    reader.readAsDataURL(depositScreenshot.files[0]);
                })
                : '';
            await apiPost('/dashboard/deposits', {
                methodId: selectedDepositMethodId,
                amount: depositAmount.value,
                txid: depositTxid.value,
                screenshot
            });
            closeDepositModal();
            await loadDepositData();
        } catch (error) {
            paidDepositStatus.textContent = error.message || 'Unable to submit deposit';
        }
    });
    virtualCardType?.addEventListener('change', () => updateVirtualCardPreview({ regenerate: true }));
    virtualCardName?.addEventListener('input', updateVirtualCardPreview);
    virtualCardForm?.addEventListener('submit', createVirtualCard);
    refreshVirtualCards?.addEventListener('click', loadVirtualCards);
    refreshPurchases?.addEventListener('click', () => loadPurchases());
    virtualCardsTableBody?.addEventListener('click', (event) => {
        const button = event.target.closest('[data-view-card]');
        if (!button) return;

        viewVirtualCard(button.dataset.viewCard, button);
    });
    virtualCardDetailsClose?.addEventListener('click', closeVirtualCardDetails);
    virtualCardDetailsModal?.addEventListener('click', (event) => {
        if (event.target === virtualCardDetailsModal) {
            closeVirtualCardDetails();
        }
    });
    purchaseTableBody?.addEventListener('click', (event) => {
        const button = event.target.closest('[data-view-purchase]');
        const purchase = purchaseRecords.find((record) => String(record.id) === button?.dataset.viewPurchase);

        if (purchase) {
            showPurchaseDetails(purchase);
        }
    });
    purchaseDetailsClose?.addEventListener('click', closePurchaseDetails);
    purchaseDetailsModal?.addEventListener('click', (event) => {
        if (event.target === purchaseDetailsModal) {
            closePurchaseDetails();
        }
    });
    cardTableBody?.addEventListener('click', (event) => {
        const button = event.target.closest('[data-add-to-cart]');

        if (!button) {
            return;
        }

        addToCart(button.dataset.addToCart, button);
    });
    selectAllCartItems?.addEventListener('change', () => {
        cartItems.forEach((item) => {
            const id = String(item.id);
            if (selectAllCartItems.checked) selectedCartIds.add(id);
            else selectedCartIds.delete(id);
        });
        renderCart(cartItems);
    });
    cartTableBody?.addEventListener('change', (event) => {
        const checkbox = event.target.closest('.cart-row-checkbox');
        if (!checkbox) return;
        if (checkbox.checked) selectedCartIds.add(String(checkbox.dataset.cartId));
        else selectedCartIds.delete(String(checkbox.dataset.cartId));
        updateCartSummary();
    });
    cartTableBody?.addEventListener('click', async (event) => {
        const button = event.target.closest('[data-remove-cart]');
        if (!button) return;
        button.disabled = true;
        try { await removeCartItems([button.dataset.removeCart]); } catch (error) { if (cartStatus) cartStatus.textContent = error.message; }
    });
    removeSelectedCartItems?.addEventListener('click', async () => {
        try { await removeCartItems([...selectedCartIds]); } catch (error) { if (cartStatus) cartStatus.textContent = error.message; }
    });
    completeOrder?.addEventListener('click', checkoutCart);
    document.addEventListener('click', (event) => {
        if (walletMenu && !walletMenu.contains(event.target)) {
            walletDropdown?.setAttribute('hidden', '');
            walletBalance?.setAttribute('aria-expanded', 'false');
        }
    });
    cardFilterForm?.addEventListener('input', (event) => {
        if (event.target === priceFromSlider || event.target === priceToSlider) {
            syncPriceInputsFromSliders();
        } else if (event.target === minPriceInput || event.target === maxPriceInput) {
            syncSlidersFromPriceInputs();
        }

        scheduleCardLoad();
    });
    cardFilterForm?.addEventListener('change', (event) => {
        activeFilters = { ...activeFilters, [event.target.name]: event.target.value };
        if (event.target === priceFromSlider || event.target === priceToSlider || event.target === minPriceInput || event.target === maxPriceInput) {
            scheduleCardLoad();
            return;
        }

        currentCardPage = 1;
        loadCardRecords();
    });
    cardFilterForm?.addEventListener('reset', () => {
        window.setTimeout(() => {
            syncPriceInputsFromSliders();
            currentCardPage = 1;
            cardSortState = { field: 'id', direction: 'desc' };
            loadCardRecords();
        }, 0);
    });
    pricePresetButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const price = button.dataset.pricePreset;

            if (!price || !minPriceInput || !maxPriceInput) {
                return;
            }

            minPriceInput.value = price;
            maxPriceInput.value = price;
            syncSlidersFromPriceInputs();
            currentCardPage = 1;
            window.clearTimeout(cardFilterTimer);
            loadCardRecords();
        });
    });
    cardPagination?.addEventListener('click', (event) => {
        const pageButton = event.target.closest('[data-card-page]');

        if (!pageButton || pageButton.disabled) {
            return;
        }

        currentCardPage = Number(pageButton.dataset.cardPage) || 1;
        loadCardRecords();
        cardPagination.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
    selectAllCards?.addEventListener('change', () => {
        document.querySelectorAll('.card-row-checkbox').forEach((checkbox) => {
            checkbox.checked = selectAllCards.checked;
            const cardId = String(checkbox.dataset.cardId);

            if (selectAllCards.checked) {
                selectedCardIds.add(cardId);
            } else {
                selectedCardIds.delete(cardId);
            }
        });
        updateSelectAllState();
    });
    cardTableBody?.addEventListener('change', (event) => {
        const checkbox = event.target.closest('.card-row-checkbox');

        if (!checkbox) {
            return;
        }

        const cardId = String(checkbox.dataset.cardId);
        if (checkbox.checked) {
            selectedCardIds.add(cardId);
        } else {
            selectedCardIds.delete(cardId);
        }
        updateSelectAllState();
    });
    cardSortButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const field = button.dataset.cardSort;

            cardSortState = {
                field,
                direction: cardSortState.field === field && cardSortState.direction === 'asc' ? 'desc' : 'asc'
            };
            currentCardPage = 1;
            loadCardRecords();
        });
    });
    activeFilterChips?.addEventListener('click', (event) => {
        const clearButton = event.target.closest('[data-clear-filter]');

        if (!clearButton) {
            return;
        }

        const field = clearButton.dataset.clearFilter;
        const input = field === 'country' ? countryFilter : field === 'bank' ? bankFilter : field === 'state' ? stateFilter : field === 'city' ? cityFilter : cardFilterForm.elements[field];

        if (field === 'price') {
            cardFilterForm.elements.priceFrom.value = 0;
            cardFilterForm.elements.priceTo.value = 150;
        } else if (input) {
            input.value = '';
        }

        currentCardPage = 1;
        loadCardRecords();
    });
    fullscreenButton?.addEventListener('click', toggleFullscreen);
    tickerSettingsForm?.addEventListener('input', () => {
        settingsDirty = true;
        setStatus('Unsaved');
    });
    tickerSettingsForm?.addEventListener('submit', saveTickerSettings);
    resetTickerSettings?.addEventListener('click', () => {
        settingsDirty = false;
        loadDashboardData({
            forceSettings: true
        });
    });
    logoutButton?.addEventListener('click', () => {
        stopTicker();
        window.clearInterval(depositTimerHandle);

        if (dashboardRefreshTimer) {
            window.clearInterval(dashboardRefreshTimer);
        }

        sessionStorage.removeItem(SESSION_KEY);
        window.location.replace('/login/');
    });
}());
