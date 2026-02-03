// js/index.js - 支持弹窗详情版

// ==========================================
// 1. 数据中心
// ==========================================
const allTournaments = [
    {
        id: "event_major_2026",
        name: "GAFA Major 2026 - 主赛事",
        status: "淘汰赛阶段",
        location: "广州大学城体育馆",
        stats: { prize: "$1,000,000", teamsCount: "8 支", date: "2026.06.20" },

        teams: [
            { name: "NaVi", country: "UA", players: ["b1t", "Aleksib", "jL", "iM", "w0nderful"] },
            { name: "FaZe", country: "EU", players: ["karrigan", "rain", "broky", "ropz", "frozen"] },
            { name: "Vitality", country: "FR", players: ["ZywOo", "apEX", "Spinx", "flameZ", "mezii"] },
            { name: "Spirit", country: "RU", players: ["donk", "chopper", "magixx", "zont1x", "sh1ro"] },
            { name: "G2", country: "EU", players: ["NiKo", "m0NESY", "huNter-", "HooXi", "nexa"] },
            { name: "MOUZ", country: "EU", players: ["torzsi", "xertioN", "siuhy", "Jimpphat", "Brollan"] },
            { name: "Liquid", country: "US", players: ["Twistzz", "NAF", "YEKINDAR", "skullz", "cadiaN"] },
            { name: "VP", country: "RU", players: ["Jame", "fame", "FL1T", "n0rb3r7", "mir"] }
        ],

        prizes: [
            { rank: "1st", money: "$500,000" },
            { rank: "2nd", money: "$200,000" },
            { rank: "3-4th", money: "$80,000" }
        ],

        // 核心：赛程数据，这里我增加了 [details] 字段
        // 用来存储弹窗里需要显示的详细信息
        bracket: {
            qf1: {
                id: "qf1", w: "NaVi", s1: 2, l: "Liquid", s2: 0,
                details: {
                    maps: [
                        { name: "Mirage", s1: 13, s2: 5 },
                        { name: "Nuke", s1: 13, s2: 9 }
                    ],
                    // 模拟双方选手的 Rating 数据
                    players: [
                        { n1: "jL", r1: 1.42, n2: "Twistzz", r2: 1.05 },
                        { n1: "b1t", r1: 1.25, n2: "NAF", r2: 0.98 },
                        { n1: "w0nderful", r1: 1.15, n2: "YEKINDAR", r2: 0.85 },
                        { n1: "iM", r1: 1.08, n2: "skullz", r2: 0.82 },
                        { n1: "Aleksib", r1: 0.95, n2: "cadiaN", r2: 0.75 }
                    ]
                }
            },
            qf2: {
                id: "qf2", w: "FaZe", s1: 2, l: "VP", s2: 1,
                details: {
                    maps: [
                        { name: "Inferno", s1: 11, s2: 13 },
                        { name: "Ancient", s1: 13, s2: 7 },
                        { name: "Anubis", s1: 13, s2: 10 }
                    ],
                    players: [
                        { n1: "broky", r1: 1.35, n2: "FL1T", r2: 1.20 },
                        { n1: "ropz", r1: 1.22, n2: "Jame", r2: 1.15 },
                        { n1: "frozen", r1: 1.10, n2: "fame", r2: 1.05 },
                        { n1: "rain", r1: 1.05, n2: "n0rb3r7", r2: 0.90 },
                        { n1: "karrigan", r1: 0.88, n2: "mir", r2: 0.85 }
                    ]
                }
            },
            qf3: { id: "qf3", w: "G2", s1: 2, l: "MOUZ", s2: 0, details: null }, // 其他比赛暂时没填详细数据，避免代码太长
            qf4: { id: "qf4", w: "Spirit", s1: 2, l: "Vitality", s2: 1, details: null },
            sf1: { id: "sf1", w: "NaVi", s1: 2, l: "FaZe", s2: 1, details: null },
            sf2: { id: "sf2", w: "Spirit", s1: 2, l: "G2", s2: 1, details: null },
            final: { id: "final", t1: "NaVi", t2: "Spirit", w: "NaVi", s1: 2, l: "Spirit", s2: 1, details: null }
        }
    },
    {
        id: "event_showmatch",
        name: "美术学院杯 - 表演赛",
        status: "筹备中",
        location: "广美教学楼 C栋",
        stats: { prize: "荣誉证书", teamsCount: "2 支", date: "2026.07.01" },
        teams: [],
        prizes: [],
        bracket: null
    }
];

// 全局变量，记录当前正在浏览的赛事数据，方便弹窗调用
let currentTournament = null;

// ==========================================
// 2. 初始化
// ==========================================
window.onload = initTournamentList;

function initTournamentList() {
    const listContainer = document.getElementById('tournament-list');

    allTournaments.forEach((tour, index) => {
        const btn = document.createElement('div');
        btn.className = 'tour-card';
        if (index === 0) btn.classList.add('active');

        btn.innerHTML = `<span class="tour-name">${tour.name}</span><span class="tour-status">● ${tour.status}</span>`;

        btn.addEventListener('click', () => {
            document.querySelectorAll('.tour-card').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            loadTournamentData(tour);
        });

        listContainer.appendChild(btn);
    });

    loadTournamentData(allTournaments[0]);
}

// ==========================================
// 3. 数据渲染
// ==========================================
function loadTournamentData(data) {
    currentTournament = data; // 保存当前数据到全局

    // 基础信息
    document.getElementById('current-event-title').innerText = data.name;
    document.getElementById('current-event-subtitle').innerText = data.location;
    document.getElementById('stat-prize').innerText = data.stats.prize;
    document.getElementById('stat-teams').innerText = data.stats.teamsCount;
    document.getElementById('stat-status').innerText = data.stats.date;

    // 战队列表
    const teamsContainer = document.getElementById('teams-container');
    teamsContainer.innerHTML = '';
    if(data.teams) {
        data.teams.forEach(t => {
            const playersHtml = t.players.map(p => `<div class="player-item"><span class="player-role">P</span><span>${p}</span></div>`).join('');
            teamsContainer.innerHTML += `
                <div class="team-card">
                    <div class="team-header"><span class="team-flag">${t.country}</span><span class="team-name">${t.name}</span></div>
                    <div class="player-list">${playersHtml}</div>
                </div>`;
        });
    }

    // 奖金列表
    const prizeContainer = document.getElementById('prize-container');
    prizeContainer.innerHTML = '';
    if(data.prizes) {
        data.prizes.forEach((p, idx) => {
            prizeContainer.innerHTML += `
                <div class="prize-card ${idx === 0 ? 'rank-1' : ''}"><span class="prize-rank"># ${p.rank}</span><span class="prize-money">${p.money}</span></div>`;
        });
    }

    // 赛程图
    if (data.bracket) {
        render8TeamBracket(data.bracket);
    } else {
        document.getElementById('bracket-container').innerHTML = '<div style="color:#666; padding:40px; text-align:center;">暂无赛程信息</div>';
    }
}

// ==========================================
// 4. 赛程图绘制 (带点击事件)
// ==========================================
function render8TeamBracket(bd) {
    const container = document.getElementById('bracket-container');

    // 注意：createMatchCard 增加了第二个参数，传入 key (例如 'qf1')
    container.innerHTML = `
        <div class="bracket-column">
            ${createMatchCard(bd.qf1, 'qf1')}
            ${createMatchCard(bd.qf2, 'qf2')}
            ${createMatchCard(bd.qf3, 'qf3')}
            ${createMatchCard(bd.qf4, 'qf4')}
        </div>
        <div class="bracket-lines">
            <svg class="bracket-svg" viewBox="0 0 60 400">
                <path d="M 0,50 L 30,50 L 30,100 L 60,100" stroke="#555" stroke-width="2" fill="none" />
                <path d="M 0,150 L 30,150 L 30,100" stroke="#555" stroke-width="2" fill="none" />
                <path d="M 0,250 L 30,250 L 30,300 L 60,300" stroke="#555" stroke-width="2" fill="none" />
                <path d="M 0,350 L 30,350 L 30,300" stroke="#555" stroke-width="2" fill="none" />
            </svg>
        </div>
        <div class="bracket-column">
            ${createMatchCard(bd.sf1, 'sf1')}
            ${createMatchCard(bd.sf2, 'sf2')}
        </div>
        <div class="bracket-lines">
            <svg class="bracket-svg" viewBox="0 0 60 400">
                <path d="M 0,100 L 30,100 L 30,200 L 60,200" stroke="#555" stroke-width="2" fill="none" />
                <path d="M 0,300 L 30,300 L 30,200" stroke="#555" stroke-width="2" fill="none" />
            </svg>
        </div>
        <div class="bracket-column" style="justify-content: center;">
            ${createMatchCard(bd.final, 'final')}
        </div>
    `;
}

// 生成卡片 HTML，并绑定点击事件
function createMatchCard(match, matchKey) {
    // onclick="openMatchPopup('qf1')"
    // 当用户点击时，会调用下面的 openMatchPopup 函数，并告诉它是哪一场比赛
    return `
        <div class="match-card" onclick="openMatchPopup('${matchKey}')">
            <div class="team-row winner"><span>${match.w}</span> <span class="score">${match.s1}</span></div>
            <div class="team-row loser"><span>${match.l}</span> <span class="score">${match.s2}</span></div>
        </div>
    `;
}

// ==========================================
// 5. 弹窗逻辑 (Modal Logic)
// ==========================================

function openMatchPopup(matchKey) {
    // 1. 获取比赛数据
    const matchData = currentTournament.bracket[matchKey];
    if (!matchData) return;

    // 2. 找到弹窗和里面的元素
    const modal = document.getElementById('match-modal');
    const header = document.getElementById('modal-header-content');
    const maps = document.getElementById('modal-maps-content');
    const players = document.getElementById('modal-players-content');

    // 3. 填充头部 (A队 vs B队)
    header.innerHTML = `
        <div class="modal-team-logo">A</div>
        <span>${matchData.w}</span>
        <span class="modal-score">${matchData.s1} : ${matchData.s2}</span>
        <span>${matchData.l}</span>
        <div class="modal-team-logo">B</div>
    `;

    // 4. 填充地图数据 (如果没有详情，显示占位符)
    if (matchData.details) {
        maps.innerHTML = matchData.details.maps.map(m => `
            <div class="map-row">
                <span>11</span> <!-- 假数据，为了模仿布局 -->
                <span>${m.name}</span>
                <span class="map-score-green">${m.s1} - ${m.s2}</span>
            </div>
        `).join('');

        // 填充选手数据
        players.innerHTML = matchData.details.players.map(p => `
            <div class="player-stat-row">
                <span class="p-name">${p.n1}</span>
                <span class="p-rating ${p.r1>1.1?'high':'low'}">${p.r1}</span>
                <span class="p-rating ${p.r2>1.1?'high':'low'}">${p.r2}</span>
                <span class="p-name p-right">${p.n2}</span>
            </div>
        `).join('');
    } else {
        maps.innerHTML = '<div style="text-align:center; color:#999; padding:10px;">暂无地图详情</div>';
        players.innerHTML = '<div style="text-align:center; color:#999; padding:10px;">暂无选手数据</div>';
    }

    // 5. 显示弹窗 (CSS 设置为 flex)
    modal.style.display = 'flex';
}

function closeModal() {
    document.getElementById('match-modal').style.display = 'none';
}

// 点击弹窗外部背景也能关闭
window.onclick = function(event) {
    const modal = document.getElementById('match-modal');
    if (event.target == modal) {
        closeModal();
    }
}