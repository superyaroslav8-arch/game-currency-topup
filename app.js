/* Game data - only official public mechanisms considered */
const GAMES = [
  { id: 'freefire', name: 'Free Fire', currency: 'Алмазы (Diamonds)', hasOfficialApi: false },
  { id: 'mlbb', name: 'Mobile Legends: Bang Bang', currency: 'Алмазы (Diamonds)', hasOfficialApi: false },
  { id: 'pubgm', name: 'PUBG Mobile', currency: 'UC (Unknown Cash)', hasOfficialApi: false },
  { id: 'genshin', name: 'Genshin Impact', currency: 'Genesis Crystals / Primogems', hasOfficialApi: false },
  { id: 'roblox', name: 'Roblox', currency: 'Robux', hasOfficialApi: false },
  { id: 'fortnite', name: 'Fortnite', currency: 'V-Bucks', hasOfficialApi: false },
  { id: 'codm', name: 'Call of Duty: Mobile', currency: 'COD Points', hasOfficialApi: false },
  { id: 'brawl', name: 'Brawl Stars', currency: 'Гемы (Gems)', hasOfficialApi: false },
  { id: 'clash', name: 'Clash of Clans', currency: 'Гемы (Gems)', hasOfficialApi: false },
  { id: 'valorant', name: 'Valorant', currency: 'Valorant Points', hasOfficialApi: false },
  { id: 'honkai', name: 'Honkai: Star Rail', currency: 'Oneiric Shards / Stellar Jade', hasOfficialApi: false },
  { id: 'zenless', name: 'Zenless Zone Zero', currency: 'Monochrome / Polychrome', hasOfficialApi: false },
  { id: 'farlight', name: 'Farlight 84', currency: 'Diamonds', hasOfficialApi: false },
  { id: 'bloodstrike', name: 'Blood Strike', currency: 'Gold', hasOfficialApi: false },
  { id: 'deltaforce', name: 'Delta Force', currency: 'Delta Coins', hasOfficialApi: false }
];

// DOM elements
const gameSelect = document.getElementById('gameSelect');
const gameSearch = document.getElementById('gameSearch');
const nicknameInput = document.getElementById('nickname');
const amountInput = document.getElementById('amount');
const currencyName = document.getElementById('currencyName');
const form = document.getElementById('topupForm');
const formSection = document.getElementById('formSection');
const resultSection = document.getElementById('resultSection');
const resultContent = document.getElementById('resultContent');
const againBtn = document.getElementById('againBtn');
const historyList = document.getElementById('historyList');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');
const howModal = document.getElementById('howModal');
const howItWorksBtn = document.getElementById('howItWorksBtn');
const closeModal = document.getElementById('closeModal');
const gotItBtn = document.getElementById('gotItBtn');
const submitBtn = document.getElementById('submitBtn');

// Populate games
function populateGames(filter = '') {
  const q = filter.trim().toLowerCase();
  gameSelect.innerHTML = '';
  const filtered = GAMES.filter(g => g.name.toLowerCase().includes(q));
  
  if (filtered.length === 0) {
    const opt = document.createElement('option');
    opt.disabled = true;
    opt.textContent = 'Ничего не найдено';
    gameSelect.appendChild(opt);
    return;
  }

  filtered.forEach(g => {
    const opt = document.createElement('option');
    opt.value = g.id;
    opt.textContent = g.name;
    gameSelect.appendChild(opt);
  });
}

populateGames();

gameSearch.addEventListener('input', () => {
  populateGames(gameSearch.value);
});

gameSelect.addEventListener('change', () => {
  const game = GAMES.find(g => g.id === gameSelect.value);
  if (game) {
    currencyName.textContent = game.currency;
  } else {
    currencyName.textContent = 'валюты';
  }
});

// Modal logic
function openModal() {
  howModal.hidden = false;
  document.body.style.overflow = 'hidden';
}

function closeModalFn() {
  howModal.hidden = true;
  document.body.style.overflow = '';
  localStorage.setItem('howItWorksSeen', '1');
}

howItWorksBtn.addEventListener('click', openModal);
closeModal.addEventListener('click', closeModalFn);
gotItBtn.addEventListener('click', closeModalFn);

howModal.addEventListener('click', (e) => {
  if (e.target === howModal) closeModalFn();
});

// Show modal on first visit
if (!localStorage.getItem('howItWorksSeen')) {
  setTimeout(openModal, 400);
}

// History
function getHistory() {
  try {
    return JSON.parse(localStorage.getItem('operationHistory') || '[]');
  } catch {
    return [];
  }
}

function saveHistory(item) {
  const history = getHistory();
  history.unshift(item);
  if (history.length > 50) history.pop();
  localStorage.setItem('operationHistory', JSON.stringify(history));
  renderHistory();
}

function renderHistory() {
  const history = getHistory();
  if (history.length === 0) {
    historyList.innerHTML = '<p class="empty-history">Пока нет операций</p>';
    clearHistoryBtn.hidden = true;
    return;
  }

  clearHistoryBtn.hidden = false;
  historyList.innerHTML = history.map(item => `
    <div class="history-item">
      <div class="status ${item.status === 'success' ? 'success' : 'error'}">
        ${item.status === 'success' ? '✓ Успешно' : '✕ Недоступно'}
      </div>
      <div class="meta">
        ${item.game} · ${item.nickname} · ${item.amount} ${item.currency}<br>
        ${item.date} · ID: ${item.id}
        ${item.link ? `<br><a href="${item.link}" target="_blank" rel="noopener">Ссылка на результат</a>` : ''}
      </div>
    </div>
  `).join('');
}

clearHistoryBtn.addEventListener('click', () => {
  if (confirm('Очистить всю историю операций?')) {
    localStorage.removeItem('operationHistory');
    renderHistory();
  }
});

renderHistory();

// Generate operation ID
function generateOpId() {
  return 'OP-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).slice(2, 7).toUpperCase();
}

// Form submit - real check only
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const gameId = gameSelect.value;
  const game = GAMES.find(g => g.id === gameId);
  const nickname = nicknameInput.value.trim();
  const amount = parseInt(amountInput.value, 10);

  if (!game || !nickname || !amount || amount < 1) {
    alert('Заполните все поля корректно');
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = 'Обработка...';

  // Simulate short processing (no fake success)
  await new Promise(r => setTimeout(r, 600 + Math.random() * 400));

  const opId = generateOpId();
  const now = new Date();
  const dateStr = now.toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  // Official availability check
  // None of the popular games currently provide a free public third-party API
  // for automatic currency credit without payment or official partnership.
  // Therefore every request correctly reports unavailability.

  if (!game.hasOfficialApi) {
    // Correct official message - no fake success
    resultContent.innerHTML = `
      <div class="result-error">
        <div class="result-icon">✕</div>
        <div class="result-title">Операция недоступна</div>
        <div class="result-details">
          <p><strong>Игра:</strong> ${game.name}</p>
          <p><strong>Никнейм:</strong> ${nickname}</p>
          <p><strong>Количество:</strong> ${amount} ${game.currency}</p>
          <p><strong>Дата:</strong> ${dateStr}</p>
          <p><strong>ID операции:</strong> ${opId}</p>
          <p style="margin-top:12px;color:var(--text-muted)">
            Для этой игры автоматическое зачисление через сторонние сайты официально недоступно.
            Разработчик не предоставляет публичный API, партнёрский API или gift-code механизм для бесплатного зачисления валюты третьим лицам.
          </p>
        </div>
      </div>
    `;

    saveHistory({
      id: opId,
      game: game.name,
      nickname,
      amount,
      currency: game.currency,
      date: dateStr,
      status: 'error',
      link: null
    });
  } else {
    // This branch is ready if any game ever adds an official free public mechanism.
    // Currently no game in the list has hasOfficialApi = true.
    resultContent.innerHTML = `
      <div class="result-success">
        <div class="result-icon">✓</div>
        <div class="result-title">Готово</div>
        <div class="result-details">
          <p><strong>Игра:</strong> ${game.name}</p>
          <p><strong>Никнейм:</strong> ${nickname}</p>
          <p><strong>Количество:</strong> ${amount} ${game.currency}</p>
          <p><strong>Дата:</strong> ${dateStr}</p>
          <p><strong>ID операции:</strong> ${opId}</p>
        </div>
      </div>
    `;

    saveHistory({
      id: opId,
      game: game.name,
      nickname,
      amount,
      currency: game.currency,
      date: dateStr,
      status: 'success',
      link: null
    });
  }

  formSection.hidden = true;
  resultSection.hidden = false;
  submitBtn.disabled = false;
  submitBtn.textContent = 'Зачислить';
});

// Again button
againBtn.addEventListener('click', () => {
  resultSection.hidden = true;
  formSection.hidden = false;
  // Keep previous game and nickname for convenience, clear amount
  amountInput.value = '';
  amountInput.focus();
});

// Prevent zoom on double tap for iOS
let lastTouchEnd = 0;
document.addEventListener('touchend', function (event) {
  const now = Date.now();
  if (now - lastTouchEnd <= 300) {
    event.preventDefault();
  }
  lastTouchEnd = now;
}, false);