// 🚀 Aplicación de Pronósticos Deportivos Pro - Con Vista de Partidos por Liga
class SportsPredictor {
    constructor() {
        this.currentMatch = null;
        this.teams = new Map();
        this.leagues = new Map();
        this.updateInterval = null;
        this.currentLeagueMatches = [];
        
        // 🔑 Configuración de API-Football
        this.apiConfig = {
            key: '4ecc4e48dbcc799af42a31dfbc7bdc1a',
            baseUrl: 'https://v3.football.api-sports.io',
            headers: {
                'X-RapidAPI-Key': '4ecc4e48dbcc799af42a31dfbc7bdc1a',
                'X-RapidAPI-Host': 'v3.football.api-sports.io'
            }
        };
        
        // 🏆 Ligas y equipos permitidos (Temporada 2025)
        this.allowedLeagues = {
            'laliga': {
                id: 140,
                name: 'La Liga EA Sports',
                country: 'Spain',
                season: 2025,
                flag: '🇪🇸',
                teams: [
                    'Athletic Club', 'Atlético de Madrid', 'CA Osasuna', 'Celta de Vigo', 
                    'Deportivo Alavés', 'Elche CF', 'FC Barcelona', 'Getafe CF',
                    'RCD Mallorca', 'Levante UD', 'Real Oviedo', 'Real Sociedad', 
                    'Rayo Vallecano', 'Real Betis', 'Real Madrid', 'Sevilla FC', 
                    'Valencia CF', 'Villarreal CF', 'RCD Espanyol', 'Girona FC'
                ]
            },
            'premier': {
                id: 39,
                name: 'Premier League',
                country: 'England',
                season: 2025,
                flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
                teams: [
                    'Arsenal', 'Aston Villa', 'AFC Bournemouth', 'Brentford', 
                    'Brighton & Hove Albion', 'Burnley', 'Chelsea', 'Crystal Palace',
                    'Everton', 'Fulham', 'Liverpool', 'Luton Town', 'Manchester City', 
                    'Manchester United', 'Newcastle United', 'Nottingham Forest',
                    'Sheffield United', 'Tottenham Hotspur', 'West Ham United', 'Wolverhampton Wanderers'
                ]
            },
            'fpc': {
                id: 239,
                name: 'Liga BetPlay I',
                country: 'Colombia',
                season: 2025,
                flag: '🇨🇴',
                teams: [
                    'Alianza FC', 'América de Cali', 'Atlético Bucaramanga', 'Atlético Nacional',
                    'Boyacá Chicó', 'Deportes Tolima', 'Envigado FC', 'Independiente Medellín',
                    'Junior FC', 'La Equidad', 'Millonarios FC', 'Once Caldas',
                    'Patriotas Boyacá', 'Independiente Santa Fe', 'Unión Magdalena', 'Águilas Doradas'
                ]
            }
        };
        
        this.endpoints = {
            fixtures: '/fixtures',
            teams: '/teams',
            standings: '/standings',
            players: '/players',
            injuries: '/injuries',
            statistics: '/fixtures/statistics',
            headToHead: '/fixtures/headtohead',
            predictions: '/predictions'
        };
        
        this.init();
    }

    // 🔧 Inicialización especializada
    init() {
        this.setupEventListeners();
        this.updateLeagueFilter();
        this.createMatchesDisplaySection();
        this.loadTodayMatchesFromAllowedLeagues();
        this.startRealTimeUpdates();
        this.updateLastUpdateTime();
        console.log('⚽ Aplicación inicializada con vista de partidos por liga');
    }

    // 🎛️ Actualizar filtro de ligas
    updateLeagueFilter() {
        const leagueFilter = document.getElementById('leagueFilter');
        leagueFilter.innerHTML = `
            <option value="">Todas las Ligas Disponibles</option>
            <option value="laliga">🇪🇸 La Liga EA Sports</option>
            <option value="premier">🏴󠁧󠁢󠁥󠁮󠁧󠁿 Premier League</option>
            <option value="fpc">🇨🇴 Liga BetPlay Colombia</option>
        `;
    }

    // 🏟️ Crear sección para mostrar partidos
    createMatchesDisplaySection() {
        const controlPanel = document.querySelector('.control-panel');
        
        // Crear contenedor de partidos
        const matchesSection = document.createElement('div');
        matchesSection.className = 'matches-display';
        matchesSection.id = 'matchesDisplay';
        matchesSection.innerHTML = `
            <div class="matches-header" style="display: none;">
                <h3 id="matchesTitle">📅 Partidos Disponibles</h3>
                <div class="matches-info">
                    <span id="matchesCount">0 partidos encontrados</span>
                    <button id="refreshMatches" class="refresh-btn">🔄 Actualizar</button>
                </div>
            </div>
            <div class="matches-grid" id="matchesGrid"></div>
        `;
        
        // Insertar después del panel de control
        controlPanel.parentNode.insertBefore(matchesSection, controlPanel.nextSibling);
    }

    // 📡 Configurar escuchadores de eventos
    setupEventListeners() {
        const analyzeBtn = document.getElementById('analyzeBtn');
        const teamSearch = document.getElementById('teamSearch');
        const leagueFilter = document.getElementById('leagueFilter');
        const timeFilter = document.getElementById('timeFilter');

        analyzeBtn.addEventListener('click', () => this.analyzeMatch());
        teamSearch.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.analyzeMatch();
        });
        
        // 🔥 Event listener mejorado para cambio de liga
        leagueFilter.addEventListener('change', (e) => {
            const selectedLeague = e.target.value;
            this.updateSearchPlaceholder(selectedLeague);
            
            if (selectedLeague) {
                this.showLeagueMatches(selectedLeague);
            } else {
                this.hideMatchesDisplay();
                this.loadTodayMatchesFromAllowedLeagues();
            }
        });
        
        timeFilter.addEventListener('change', (e) => {
            const selectedLeague = leagueFilter.value;
            if (selectedLeague) {
                this.showLeagueMatches(selectedLeague, e.target.value);
            }
        });

        // Event listener para actualizar partidos
        document.addEventListener('click', (e) => {
            if (e.target && e.target.id === 'refreshMatches') {
                const selectedLeague = leagueFilter.value;
                if (selectedLeague) {
                    this.showLeagueMatches(selectedLeague);
                }
            }
        });

        teamSearch.addEventListener('input', (e) => {
            this.showTeamSuggestions(e.target.value);
        });
    }

    // 🏆 Mostrar partidos de la liga seleccionada
    async showLeagueMatches(leagueKey, timeFilter = 'today') {
        const leagueInfo = this.allowedLeagues[leagueKey];
        if (!leagueInfo) return;

        this.showMatchesLoading(leagueInfo);
        
        try {
            const fixtures = await this.getLeagueFixtures(leagueInfo, timeFilter);
            const validMatches = fixtures.filter(fixture => 
                this.isValidTeamMatch(fixture, leagueKey)
            );
            
            this.currentLeagueMatches = validMatches;
            this.displayLeagueMatches(validMatches, leagueInfo);
            
            console.log(`🏆 ${leagueInfo.name}: ${validMatches.length} partidos encontrados`);
            
        } catch (error) {
            console.error(`❌ Error cargando partidos de ${leagueInfo.name}:`, error);
            this.showMatchesError(leagueInfo);
        }
    }

    // 📅 Obtener fixtures de la liga según filtro de tiempo
    async getLeagueFixtures(leagueInfo, timeFilter) {
        const today = new Date();
        let dateFrom, dateTo;
        
        switch (timeFilter) {
            case 'today':
                dateFrom = dateTo = today.toISOString().split('T')[0];
                break;
            case 'tomorrow':
                const tomorrow = new Date(today);
                tomorrow.setDate(today.getDate() + 1);
                dateFrom = dateTo = tomorrow.toISOString().split('T')[0];
                break;
            case 'week':
                dateFrom = today.toISOString().split('T')[0];
                const weekLater = new Date(today);
                weekLater.setDate(today.getDate() + 7);
                dateTo = weekLater.toISOString().split('T')[0];
                break;
            default:
                dateFrom = today.toISOString().split('T')[0];
                const threeDaysLater = new Date(today);
                threeDaysLater.setDate(today.getDate() + 3);
                dateTo = threeDaysLater.toISOString().split('T')[0];
        }

        // Primero intentar con fechas específicas
        let fixtures = await this.makeApiCall(this.endpoints.fixtures, {
            league: leagueInfo.id,
            season: leagueInfo.season,
            from: dateFrom,
            to: dateTo
        });

        // Si no hay partidos en el rango, buscar próximos partidos
        if (!fixtures.response || fixtures.response.length === 0) {
            fixtures = await this.makeApiCall(this.endpoints.fixtures, {
                league: leagueInfo.id,
                season: leagueInfo.season,
                next: 10
            });
        }

        return fixtures.response || [];
    }

    // 📋 Mostrar partidos en la interfaz
    displayLeagueMatches(matches, leagueInfo) {
        const matchesHeader = document.querySelector('.matches-header');
        const matchesTitle = document.getElementById('matchesTitle');
        const matchesCount = document.getElementById('matchesCount');
        const matchesGrid = document.getElementById('matchesGrid');

        // Mostrar header
        matchesHeader.style.display = 'flex';
        matchesTitle.textContent = `${leagueInfo.flag} ${leagueInfo.name} - Partidos`;
        matchesCount.textContent = `${matches.length} partidos encontrados`;

        if (matches.length === 0) {
            matchesGrid.innerHTML = `
                <div class="no-matches">
                    <i class="fas fa-calendar-times"></i>
                    <p>No hay partidos programados para las fechas seleccionadas</p>
                    <small>Intenta cambiar el filtro de tiempo</small>
                </div>
            `;
            return;
        }

        // Crear tarjetas de partidos
        matchesGrid.innerHTML = matches.map(match => this.createMatchCard(match)).join('');

        // Agregar event listeners a las tarjetas
        this.addMatchCardListeners();
    }

    // 🎴 Crear tarjeta de partido
    createMatchCard(match) {
        const matchDate = new Date(match.fixture.date);
        const dateStr = matchDate.toLocaleDateString('es-CO', { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric' 
        });
        const timeStr = matchDate.toLocaleTimeString('es-CO', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        
        const status = this.getMatchStatus(match.fixture.status);
        const statusClass = this.getStatusClass(match.fixture.status.short);

        return `
            <div class="match-card" data-fixture-id="${match.fixture.id}" onclick="window.sportsPredictor.selectMatchFromCard(${match.fixture.id})">
                <div class="match-status ${statusClass}">
                    <span class="status-text">${status}</span>
                    <span class="match-time">${timeStr}</span>
                </div>
                
                <div class="match-teams">
                    <div class="team home-team">
                        <img src="${match.teams.home.logo}" alt="${match.teams.home.name}" class="team-logo">
                        <span class="team-name">${match.teams.home.name}</span>
                    </div>
                    
                    <div class="match-vs">
                        <span class="vs-text">VS</span>
                        <div class="match-date">${dateStr}</div>
                    </div>
                    
                    <div class="team away-team">
                        <img src="${match.teams.away.logo}" alt="${match.teams.away.name}" class="team-logo">
                        <span class="team-name">${match.teams.away.name}</span>
                    </div>
                </div>
                
                <div class="match-info">
                    <span class="venue">🏟️ ${match.fixture.venue.name}</span>
                    <button class="analyze-btn">📊 Analizar</button>
                </div>
            </div>
        `;
    }

    // 📊 Obtener estado del partido
    getMatchStatus(status) {
        const statusMap = {
            'NS': 'Por Jugar',
            'PST': 'Pospuesto', 
            '1H': 'Primer Tiempo',
            'HT': 'Medio Tiempo',
            '2H': 'Segundo Tiempo',
            'ET': 'Tiempo Extra',
            'P': 'Penales',
            'FT': 'Finalizado',
            'AET': 'Fin T. Extra',
            'PEN': 'Fin Penales'
        };
        
        return statusMap[status.short] || status.long;
    }

    // 🎨 Obtener clase CSS para estado
    getStatusClass(statusShort) {
        const liveStatuses = ['1H', 'HT', '2H', 'ET', 'P'];
        const finishedStatuses = ['FT', 'AET', 'PEN'];
        const postponedStatuses = ['PST', 'CANC'];
        
        if (liveStatuses.includes(statusShort)) return 'live';
        if (finishedStatuses.includes(statusShort)) return 'finished';
        if (postponedStatuses.includes(statusShort)) return 'postponed';
        return 'scheduled';
    }

    // 🖱️ Agregar event listeners a tarjetas
    addMatchCardListeners() {
        const matchCards = document.querySelectorAll('.match-card');
        matchCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-3px)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
            });
        });
    }

    // ⚽ Seleccionar partido desde tarjeta
    async selectMatchFromCard(fixtureId) {
        const match = this.currentLeagueMatches.find(m => m.fixture.id === fixtureId);
        if (!match) {
            console.error('❌ Partido no encontrado');
            return;
        }

        // Llenar el campo de búsqueda
        const searchField = document.getElementById('teamSearch');
        searchField.value = `${match.teams.home.name} vs ${match.teams.away.name}`;

        // Ocultar vista de partidos
        this.hideMatchesDisplay();
        
        // Analizar el partido seleccionado
        this.showLoadingState();
        
        try {
            const matchData = await this.getDetailedMatchData(match);
            this.currentMatch = matchData;
            
            await this.updateMatchInterface(matchData);
            const analysis = await this.performRealStatisticalAnalysis(matchData);
            this.updateAnalysisInterface(analysis);
            
            const prediction = this.generateAdvancedPrediction(analysis);
            this.updatePredictionInterface(prediction);
            
            console.log('✅ Análisis completado desde tarjeta:', prediction);
            
        } catch (error) {
            console.error('❌ Error analizando desde tarjeta:', error);
            this.showErrorMessage(error.message);
        }
    }

    // 👁️ Mostrar estado de carga de partidos
    showMatchesLoading(leagueInfo) {
        const matchesHeader = document.querySelector('.matches-header');
        const matchesTitle = document.getElementById('matchesTitle');
        const matchesCount = document.getElementById('matchesCount');
        const matchesGrid = document.getElementById('matchesGrid');

        matchesHeader.style.display = 'flex';
        matchesTitle.textContent = `${leagueInfo.flag} ${leagueInfo.name}`;
        matchesCount.innerHTML = '<span class="loading"></span> Cargando partidos...';
        matchesGrid.innerHTML = `
            <div class="loading-matches">
                <div class="loading-spinner"></div>
                <p>Cargando partidos de ${leagueInfo.name}...</p>
            </div>
        `;
    }

    // ❌ Mostrar error de carga de partidos
    showMatchesError(leagueInfo) {
        const matchesGrid = document.getElementById('matchesGrid');
        const matchesCount = document.getElementById('matchesCount');
        
        matchesCount.textContent = 'Error cargando partidos';
        matchesGrid.innerHTML = `
            <div class="error-matches">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Error cargando partidos de ${leagueInfo.name}</p>
                <small>Verifica tu conexión e intenta de nuevo</small>
                <button onclick="window.sportsPredictor.showLeagueMatches('${leagueInfo.name.toLowerCase()}')" class="retry-btn">🔄 Reintentar</button>
            </div>
        `;
    }

    // 🙈 Ocultar vista de partidos
    hideMatchesDisplay() {
        const matchesHeader = document.querySelector('.matches-header');
        const matchesGrid = document.getElementById('matchesGrid');
        
        matchesHeader.style.display = 'none';
        matchesGrid.innerHTML = '';
    }

    // 💡 Actualizar placeholder de búsqueda según liga
    updateSearchPlaceholder(selectedLeague) {
        const teamSearch = document.getElementById('teamSearch');
        const placeholders = {
            'laliga': 'Ej: Real Madrid vs Barcelona, Atlético Madrid...',
            'premier': 'Ej: Manchester City vs Liverpool, Arsenal...',
            'fpc': 'Ej: Millonarios vs Nacional, América de Cali...',
            '': 'Buscar equipos o selecciona una liga para ver partidos'
        };
        
        teamSearch.placeholder = placeholders[selectedLeague] || placeholders[''];
    }

    // [Mantener todos los otros métodos anteriores...]
    // makeApiCall, findMatchByTeams, getDetailedMatchData, etc.

    // 🌐 Función genérica para llamadas a API
    async makeApiCall(endpoint, params = {}) {
        const url = new URL(this.apiConfig.baseUrl + endpoint);
        
        Object.keys(params).forEach(key => {
            if (params[key] !== null && params[key] !== undefined) {
                url.searchParams.append(key, params[key]);
            }
        });

        try {
            const response = await fetch(url.toString(), {
                method: 'GET',
                headers: this.apiConfig.headers
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.status} - ${response.statusText}`);
            }

            const data = await response.json();
            
            if (data.errors && data.errors.length > 0) {
                throw new Error(`API Error: ${JSON.stringify(data.errors)}`);
            }

            return data;
            
        } catch (error) {
            console.error('❌ Error en llamada API:', error);
            throw error;
        }
    }

    // [Incluir resto de métodos del código anterior...]
    // isValidTeamMatch, areTeamsAllowed, analyzeMatch, etc.

    isValidTeamMatch(fixture, leagueKey) {
        const homeTeam = fixture.teams.home.name;
        const awayTeam = fixture.teams.away.name;
        const allowedTeams = this.allowedLeagues[leagueKey].teams;
        
        return this.isTeamAllowed(homeTeam, allowedTeams) && 
               this.isTeamAllowed(awayTeam, allowedTeams);
    }

    isTeamAllowed(teamName, allowedTeams) {
        const normalizedTeamName = teamName.toLowerCase()
            .replace(/fc|cf|ud|cd|real|club/gi, '')
            .trim();
        
        return allowedTeams.some(allowedTeam => {
            const normalizedAllowed = allowedTeam.toLowerCase()
                .replace(/fc|cf|ud|cd|real|club/gi, '')
                .trim();
            
            return normalizedAllowed.includes(normalizedTeamName) || 
                   normalizedTeamName.includes(normalizedAllowed);
        });
    }

    startRealTimeUpdates() {
        this.updateInterval = setInterval(() => {
            this.updateLastUpdateTime();
            
            // Auto-refresh de partidos si hay una liga seleccionada
            const selectedLeague = document.getElementById('leagueFilter').value;
            if (selectedLeague && this.currentLeagueMatches.length > 0) {
                console.log(`🔄 Auto-actualizando partidos de ${this.allowedLeagues[selectedLeague].name}...`);
                this.showLeagueMatches(selectedLeague);
            }
        }, 60000); // Cada minuto para partidos
        
        console.log('🔄 Actualizaciones automáticas iniciadas');
    }

    updateLastUpdateTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('es-CO', {
            timeZone: 'America/Bogota',
            hour12: false
        });
        
        document.getElementById('lastUpdate').textContent = timeString;
    }

    // [Resto de métodos anteriores...]
}

// 🎨 Agregar estilos CSS para la vista de partidos
const matchesStyles = `
.matches-display {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 15px;
    padding: 0;
    margin: 25px 0;
    box-shadow: var(--shadow);
    overflow: hidden;
}

.matches-header {
    display: none;
    justify-content: space-between;
    align-items: center;
    padding: 20px 25px;
    background: linear-gradient(135deg, var(--primary-color), #2563eb);
    color: white;
}

.matches-header h3 {
    margin: 0;
    font-size: 1.3rem;
    font-weight: 600;
}

.matches-info {
    display: flex;
    align-items: center;
    gap: 15px;
}

.refresh-btn {
    background: rgba(255, 255, 255, 0.2);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.3);
    padding: 8px 15px;
    border-radius: 8px;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.3s ease;
}

.refresh-btn:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-1px);
}

.matches-grid {
    padding: 25px;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
    gap: 20px;
    max-height: 600px;
    overflow-y: auto;
}

.match-card {
    background: white;
    border: 2px solid var(--border-color);
    border-radius: 12px;
    padding: 15px;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
}

.match-card:hover {
    border-color: var(--primary-color);
    box-shadow: var(--shadow-lg);
}

.match-status {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    padding: 8px 12px;
    border-radius: 8px;
    font-size: 0.85rem;
    font-weight: 500;
}

.match-status.scheduled {
    background: var(--light-color);
    color: var(--text-secondary);
}

.match-status.live {
    background: var(--danger-color);
    color: white;
    animation: pulse 2s infinite;
}

.match-status.finished {
    background: var(--secondary-color);
    color: white;
}

.match-status.postponed {
    background: var(--accent-color);
    color: white;
}

.match-teams {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    gap: 15px;
    align-items: center;
    margin-bottom: 15px;
}

.team {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
}

.team-logo {
    width: 40px;
    height: 40px;
    object-fit: contain;
}

.team-name {
    font-size: 0.9rem;
    font-weight: 500;
    text-align: center;
    line-height: 1.2;
}

.match-vs {
    text-align: center;
}

.vs-text {
    font-weight: 700;
    color: var(--primary-color);
    font-size: 1.1rem;
}

.match-date {
    font-size: 0.8rem;
    color: var(--text-secondary);
    margin-top: 4px;
}

.match-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 12px;
    border-top: 1px solid var(--border-color);
}

.venue {
    font-size: 0.8rem;
    color: var(--text-secondary);
    flex: 1;
}

.analyze-btn {
    background: var(--primary-color);
    color: white;
    border: none;
    padding: 6px 12px;
    border-radius: 6px;
    font-size: 0.8rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
}

.analyze-btn:hover {
    background: #1e40af;
    transform: scale(1.05);
}

.no-matches, .loading-matches, .error-matches {
    grid-column: 1 / -1;
    text-align: center;
    padding: 40px 20px;
    color: var(--text-secondary);
}

.loading-spinner {
    width: 40px;
    height: 40px;
    border: 4px solid var(--border-color);
    border-top: 4px solid var(--primary-color);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 20px;
}

.retry-btn {
    background: var(--primary-color);
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 8px;
    font-size: 0.9rem;
    cursor: pointer;
    margin-top: 15px;
    transition: all 0.3s ease;
}

.retry-btn:hover {
    background: #1e40af;
}

@media (max-width: 768px) {
    .matches-grid {
        grid-template-columns: 1fr;
        padding: 15px;
    }
    
    .match-card {
        padding: 12px;
    }
    
    .matches-header {
        flex-direction: column;
        gap: 15px;
        text-align: center;
    }
}
`;

// Agregar estilos al head
const matchesStyleSheet = document.createElement('style');
matchesStyleSheet.textContent = matchesStyles;
document.head.appendChild(matchesStyleSheet);

// 🚀 Inicializar aplicación mejorada
document.addEventListener('DOMContentLoaded', () => {
    window.sportsPredictor = new SportsPredictor();
});

console.log(`
⚽ APLICACIÓN CON VISTA DE PARTIDOS INICIALIZADA ⚽
================================================
🔥 NUEVA FUNCIONALIDAD:
✅ Vista de partidos por liga seleccionada
✅ Partidos del día y próximos días
✅ Tarjetas interactivas de partidos
✅ Selección directa desde tarjeta
✅ Auto-refresh cada minuto
✅ Estados en tiempo real (En Vivo, Finalizado, etc.)
✅ Información de estadios y horarios

🎯 CÓMO USAR:
1. Selecciona una liga (La Liga, Premier, FPC Colombia)
2. Ve automáticamente los partidos disponibles
3. Haz clic en cualquier partido para analizarlo
4. Usa el filtro de tiempo (Hoy, Mañana, Esta Semana)
================================================
`);
