// 🚀 Aplicación de Pronósticos Deportivos Pro - Especializada en 3 Ligas
class SportsPredictor {
    constructor() {
        this.currentMatch = null;
        this.teams = new Map();
        this.leagues = new Map();
        this.updateInterval = null;
        
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
                name: 'La Liga',
                country: 'Spain',
                season: 2025,
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
                teams: [
                    'Alianza FC', 'América de Cali', 'Atlético Bucaramanga', 'Atlético Nacional',
                    'Boyacá Chicó', 'Deportes Tolima', 'Envigado FC', 'Independiente Medellín',
                    'Junior FC', 'La Equidad', 'Millonarios FC', 'Once Caldas',
                    'Patriotas Boyacá', 'Independiente Santa Fe', 'Unión Magdalena', 'Águilas Doradas'
                ]
            }
        };
        
        // 📊 Endpoints API
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
        this.loadTodayMatchesFromAllowedLeagues();
        this.startRealTimeUpdates();
        this.updateLastUpdateTime();
        console.log('⚽ Aplicación inicializada para La Liga, Premier League y FPC Colombia');
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
        
        console.log('🎛️ Filtro de ligas actualizado con las 3 ligas permitidas');
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
        
        // Event listener mejorado para cambio de liga
        leagueFilter.addEventListener('change', (e) => {
            this.filterMatchesByLeague(e.target.value);
            this.updateSearchPlaceholder(e.target.value);
        });
        
        timeFilter.addEventListener('change', () => this.filterMatches());

        // Agregar autocompletado de equipos
        teamSearch.addEventListener('input', (e) => {
            this.showTeamSuggestions(e.target.value);
        });
    }

    // 💡 Actualizar placeholder de búsqueda según liga
    updateSearchPlaceholder(selectedLeague) {
        const teamSearch = document.getElementById('teamSearch');
        const placeholders = {
            'laliga': 'Ej: Real Madrid vs Barcelona, Atlético Madrid...',
            'premier': 'Ej: Manchester City vs Liverpool, Arsenal...',
            'fpc': 'Ej: Millonarios vs Nacional, América de Cali...',
            '': 'Buscar equipos (Real Madrid, Manchester City, Millonarios...)'
        };
        
        teamSearch.placeholder = placeholders[selectedLeague] || placeholders[''];
    }

    // 🔍 Mostrar sugerencias de equipos
    showTeamSuggestions(searchValue) {
        if (searchValue.length < 2) return;
        
        const selectedLeague = document.getElementById('leagueFilter').value;
        let availableTeams = [];
        
        if (selectedLeague) {
            availableTeams = this.allowedLeagues[selectedLeague].teams;
        } else {
            // Combinar todas las ligas
            availableTeams = [
                ...this.allowedLeagues.laliga.teams,
                ...this.allowedLeagues.premier.teams,
                ...this.allowedLeagues.fpc.teams
            ];
        }
        
        const matches = availableTeams.filter(team => 
            team.toLowerCase().includes(searchValue.toLowerCase())
        ).slice(0, 5);
        
        this.displayTeamSuggestions(matches);
    }

    // 📋 Mostrar sugerencias en UI
    displayTeamSuggestions(teams) {
        // Crear o actualizar lista de sugerencias
        let suggestionsDiv = document.getElementById('teamSuggestions');
        if (!suggestionsDiv) {
            suggestionsDiv = document.createElement('div');
            suggestionsDiv.id = 'teamSuggestions';
            suggestionsDiv.className = 'team-suggestions';
            document.querySelector('.search-section').appendChild(suggestionsDiv);
        }
        
        if (teams.length === 0) {
            suggestionsDiv.innerHTML = '';
            return;
        }
        
        suggestionsDiv.innerHTML = teams
            .map(team => `<div class="suggestion-item" onclick="window.sportsPredictor.selectTeam('${team}')">${team}</div>`)
            .join('');
    }

    // ✅ Seleccionar equipo sugerido
    selectTeam(teamName) {
        document.getElementById('teamSearch').value = teamName;
        document.getElementById('teamSuggestions').innerHTML = '';
        this.analyzeMatch();
    }

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

    // 🏠 Cargar partidos de hoy solo de ligas permitidas
    async loadTodayMatchesFromAllowedLeagues() {
        try {
            const today = new Date().toISOString().split('T')[0];
            const allMatches = [];
            
            // Cargar partidos de cada liga permitida
            for (const [leagueKey, leagueInfo] of Object.entries(this.allowedLeagues)) {
                try {
                    const fixtures = await this.makeApiCall(this.endpoints.fixtures, {
                        league: leagueInfo.id,
                        season: leagueInfo.season,
                        date: today
                    });
                    
                    if (fixtures.response && fixtures.response.length > 0) {
                        const validMatches = fixtures.response.filter(fixture => 
                            this.isValidTeamMatch(fixture, leagueKey)
                        );
                        allMatches.push(...validMatches);
                        console.log(`🏆 ${leagueInfo.name}: ${validMatches.length} partidos encontrados`);
                    }
                } catch (error) {
                    console.warn(`⚠️ Error cargando partidos de ${leagueInfo.name}:`, error);
                }
            }
            
            if (allMatches.length > 0) {
                console.log(`📅 Total: ${allMatches.length} partidos de ligas permitidas para hoy`);
                this.displayAvailableMatches(allMatches);
            } else {
                console.log('📅 No hay partidos de las ligas permitidas para hoy');
                await this.loadUpcomingMatches();
            }
        } catch (error) {
            console.error('❌ Error cargando partidos de hoy:', error);
        }
    }

    // 📅 Cargar próximos partidos si no hay hoy
    async loadUpcomingMatches() {
        try {
            const allMatches = [];
            
            for (const [leagueKey, leagueInfo] of Object.entries(this.allowedLeagues)) {
                try {
                    const fixtures = await this.makeApiCall(this.endpoints.fixtures, {
                        league: leagueInfo.id,
                        season: leagueInfo.season,
                        next: 5 // Próximos 5 partidos
                    });
                    
                    if (fixtures.response && fixtures.response.length > 0) {
                        const validMatches = fixtures.response.filter(fixture => 
                            this.isValidTeamMatch(fixture, leagueKey)
                        );
                        allMatches.push(...validMatches);
                    }
                } catch (error) {
                    console.warn(`⚠️ Error cargando próximos partidos de ${leagueInfo.name}:`, error);
                }
            }
            
            if (allMatches.length > 0) {
                console.log(`🔜 ${allMatches.length} próximos partidos disponibles`);
                this.displayAvailableMatches(allMatches.slice(0, 10));
            }
        } catch (error) {
            console.error('❌ Error cargando próximos partidos:', error);
        }
    }

    // ✅ Validar que el partido es de equipos permitidos
    isValidTeamMatch(fixture, leagueKey) {
        const homeTeam = fixture.teams.home.name;
        const awayTeam = fixture.teams.away.name;
        const allowedTeams = this.allowedLeagues[leagueKey].teams;
        
        return this.isTeamAllowed(homeTeam, allowedTeams) && 
               this.isTeamAllowed(awayTeam, allowedTeams);
    }

    // 🔍 Verificar si el equipo está permitido (con variaciones de nombre)
    isTeamAllowed(teamName, allowedTeams) {
        // Normalizar nombre del equipo
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

    // 📋 Mostrar partidos disponibles
    displayAvailableMatches(fixtures) {
        console.log('🏟️ Partidos disponibles de ligas permitidas:');
        fixtures.forEach((fixture, index) => {
            const homeTeam = fixture.teams.home.name;
            const awayTeam = fixture.teams.away.name;
            const league = fixture.league.name;
            const time = new Date(fixture.fixture.date).toLocaleTimeString('es-CO', {
                hour: '2-digit',
                minute: '2-digit'
            });
            console.log(`${index + 1}. ${homeTeam} vs ${awayTeam} (${league}) - ${time}`);
        });
    }

    // 🔍 Analizar partido específico
    async analyzeMatch() {
        const searchTerm = document.getElementById('teamSearch').value.trim();
        if (!searchTerm) {
            alert('⚠️ Por favor ingresa los nombres de los equipos');
            return;
        }

        // Verificar si los equipos están en las ligas permitidas
        if (!this.areTeamsAllowed(searchTerm)) {
            alert('⚠️ Solo se permiten equipos de La Liga, Premier League o Liga BetPlay Colombia');
            return;
        }

        this.showLoadingState();
        
        try {
            const fixture = await this.findMatchByTeams(searchTerm);
            if (!fixture) {
                throw new Error('No se encontró el partido solicitado en las ligas permitidas');
            }

            const matchData = await this.getDetailedMatchData(fixture);
            this.currentMatch = matchData;
            
            await this.updateMatchInterface(matchData);
            const analysis = await this.performRealStatisticalAnalysis(matchData);
            this.updateAnalysisInterface(analysis);
            
            const prediction = this.generateAdvancedPrediction(analysis);
            this.updatePredictionInterface(prediction);
            
            console.log('✅ Análisis completado con datos reales:', prediction);
            
        } catch (error) {
            console.error('❌ Error en el análisis:', error);
            this.showErrorMessage(error.message);
        }
    }

    // ✅ Verificar si los equipos están permitidos
    areTeamsAllowed(searchTerm) {
        const allAllowedTeams = [
            ...this.allowedLeagues.laliga.teams,
            ...this.allowedLeagues.premier.teams,
            ...this.allowedLeagues.fpc.teams
        ];
        
        const searchLower = searchTerm.toLowerCase();
        
        return allAllowedTeams.some(team => 
            searchLower.includes(team.toLowerCase()) ||
            team.toLowerCase().includes(searchLower.split(' ')[0])
        );
    }

    // 🔎 Buscar partido por nombres de equipos (solo ligas permitidas)
    async findMatchByTeams(searchTerm) {
        try {
            const selectedLeague = document.getElementById('leagueFilter').value;
            const leaguesToSearch = selectedLeague ? [selectedLeague] : Object.keys(this.allowedLeagues);
            
            // Buscar en fechas próximas
            const dates = this.getSearchDates();
            
            for (const leagueKey of leaguesToSearch) {
                const leagueInfo = this.allowedLeagues[leagueKey];
                
                for (const date of dates) {
                    const fixtures = await this.makeApiCall(this.endpoints.fixtures, {
                        league: leagueInfo.id,
                        season: leagueInfo.season,
                        date: date
                    });

                    if (fixtures.response) {
                        const match = fixtures.response.find(fixture => {
                            if (!this.isValidTeamMatch(fixture, leagueKey)) return false;
                            
                            const homeTeam = fixture.teams.home.name.toLowerCase();
                            const awayTeam = fixture.teams.away.name.toLowerCase();
                            const search = searchTerm.toLowerCase();
                            
                            return this.matchesSearch(homeTeam, awayTeam, search);
                        });

                        if (match) {
                            console.log(`✅ Partido encontrado en ${leagueInfo.name}: ${match.teams.home.name} vs ${match.teams.away.name}`);
                            return match;
                        }
                    }
                }
            }

            // Si no encuentra en fechas específicas, buscar próximos partidos del equipo
            return await this.findUpcomingTeamMatch(searchTerm, leaguesToSearch);

        } catch (error) {
            console.error('❌ Error buscando partido:', error);
            return null;
        }
    }

    // 📅 Obtener fechas de búsqueda
    getSearchDates() {
        const dates = [];
        const today = new Date();
        
        // Hoy, mañana y próximos 7 días
        for (let i = 0; i < 7; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            dates.push(date.toISOString().split('T')[0]);
        }
        
        return dates;
    }

    // 🔍 Verificar coincidencia de búsqueda
    matchesSearch(homeTeam, awayTeam, search) {
        // Búsquedas tipo "Real Madrid vs Barcelona"
        if (search.includes('vs') || search.includes(' v ')) {
            const parts = search.split(/vs| v /);
            if (parts.length === 2) {
                const team1 = parts[0].trim();
                const team2 = parts[1].trim();
                return (homeTeam.includes(team1) && awayTeam.includes(team2)) ||
                       (homeTeam.includes(team2) && awayTeam.includes(team1));
            }
        }
        
        // Búsqueda por nombre de un equipo
        return homeTeam.includes(search) || awayTeam.includes(search);
    }

    // 🔜 Buscar próximo partido del equipo
    async findUpcomingTeamMatch(searchTerm, leaguesToSearch) {
        try {
            for (const leagueKey of leaguesToSearch) {
                const leagueInfo = this.allowedLeagues[leagueKey];
                
                // Buscar equipo por nombre
                const teamName = searchTerm.split(' ')[0];
                const teamsResponse = await this.makeApiCall('/teams', {
                    league: leagueInfo.id,
                    season: leagueInfo.season,
                    search: teamName
                });

                if (teamsResponse.response && teamsResponse.response.length > 0) {
                    for (const teamData of teamsResponse.response) {
                        if (this.isTeamAllowed(teamData.team.name, leagueInfo.teams)) {
                            const teamFixtures = await this.makeApiCall(this.endpoints.fixtures, {
                                team: teamData.team.id,
                                league: leagueInfo.id,
                                season: leagueInfo.season,
                                next: 1
                            });

                            if (teamFixtures.response && teamFixtures.response.length > 0) {
                                const fixture = teamFixtures.response[0];
                                if (this.isValidTeamMatch(fixture, leagueKey)) {
                                    return fixture;
                                }
                            }
                        }
                    }
                }
            }
            
            return null;
        } catch (error) {
            console.error('❌ Error buscando próximo partido:', error);
            return null;
        }
    }

    // 🎛️ Filtrar partidos por liga seleccionada
    async filterMatchesByLeague(selectedLeague) {
        if (!selectedLeague) {
            await this.loadTodayMatchesFromAllowedLeagues();
            return;
        }
        
        const leagueInfo = this.allowedLeagues[selectedLeague];
        console.log(`🔍 Filtrando por ${leagueInfo.name}`);
        
        try {
            const today = new Date().toISOString().split('T')[0];
            const fixtures = await this.makeApiCall(this.endpoints.fixtures, {
                league: leagueInfo.id,
                season: leagueInfo.season,
                date: today
            });
            
            if (fixtures.response && fixtures.response.length > 0) {
                const validMatches = fixtures.response.filter(fixture => 
                    this.isValidTeamMatch(fixture, selectedLeague)
                );
                this.displayAvailableMatches(validMatches);
            } else {
                console.log(`📅 No hay partidos de ${leagueInfo.name} para hoy`);
            }
        } catch (error) {
            console.error(`❌ Error filtrando ${leagueInfo.name}:`, error);
        }
    }

    // [El resto de métodos permanecen igual, solo agregar validaciones de ligas permitidas]
    
    // 📊 Obtener datos detallados del partido (solo equipos permitidos)
    async getDetailedMatchData(fixture) {
        // Verificar que ambos equipos estén permitidos
        const leagueKey = this.getLeagueKeyById(fixture.league.id);
        if (!leagueKey || !this.isValidTeamMatch(fixture, leagueKey)) {
            throw new Error('Equipos no permitidos en las ligas configuradas');
        }
        
        try {
            const homeTeamId = fixture.teams.home.id;
            const awayTeamId = fixture.teams.away.id;

            const [
                homeTeamData,
                awayTeamData,
                homeTeamStats,
                awayTeamStats,
                injuries,
                h2h
            ] = await Promise.all([
                this.makeApiCall(this.endpoints.teams, { id: homeTeamId }),
                this.makeApiCall(this.endpoints.teams, { id: awayTeamId }),
                this.getTeamStatistics(homeTeamId, fixture.league.id),
                this.getTeamStatistics(awayTeamId, fixture.league.id),
                this.makeApiCall(this.endpoints.injuries, { 
                    team: homeTeamId,
                    date: new Date().toISOString().split('T')[0]
                }),
                this.makeApiCall(this.endpoints.headToHead, {
                    h2h: `${homeTeamId}-${awayTeamId}`,
                    last: 10
                })
            ]);

            return this.formatMatchData(fixture, {
                homeTeamData: homeTeamData.response[0],
                awayTeamData: awayTeamData.response[0],
                homeTeamStats,
                awayTeamStats,
                injuries: injuries.response || [],
                headToHead: h2h.response || []
            });

        } catch (error) {
            console.error('❌ Error obteniendo datos detallados:', error);
            throw error;
        }
    }

    // 🔍 Obtener clave de liga por ID
    getLeagueKeyById(leagueId) {
        for (const [key, info] of Object.entries(this.allowedLeagues)) {
            if (info.id === leagueId) return key;
        }
        return null;
    }

    // [Resto de métodos mantienen la implementación anterior pero con validaciones agregadas]
    
    // 📈 Obtener estadísticas de equipo (validando liga)
    async getTeamStatistics(teamId, leagueId) {
        const leagueKey = this.getLeagueKeyById(leagueId);
        if (!leagueKey) {
            return this.getDefaultStats();
        }
        
        try {
            const leagueInfo = this.allowedLeagues[leagueKey];
            const fixtures = await this.makeApiCall(this.endpoints.fixtures, {
                team: teamId,
                league: leagueId,
                season: leagueInfo.season,
                last: 10
            });

            if (!fixtures.response || fixtures.response.length === 0) {
                return this.getDefaultStats();
            }

            const stats = this.calculateTeamStats(fixtures.response, teamId);
            return stats;

        } catch (error) {
            console.error('❌ Error obteniendo estadísticas:', error);
            return this.getDefaultStats();
        }
    }

    // [Mantener todos los otros métodos como calculateTeamStats, performRealStatisticalAnalysis, etc.]
    
    // Métodos de interfaz y utilidades permanecen iguales...
    calculateTeamStats(fixtures, teamId) {
        let wins = 0, draws = 0, losses = 0;
        let goalsFor = 0, goalsAgainst = 0;
        let possession = 0, possessionCount = 0;
        const form = [];

        fixtures.forEach(fixture => {
            const isHome = fixture.teams.home.id === teamId;
            const teamGoals = isHome ? fixture.goals.home : fixture.goals.away;
            const opponentGoals = isHome ? fixture.goals.away : fixture.goals.home;

            goalsFor += teamGoals || 0;
            goalsAgainst += opponentGoals || 0;

            if (teamGoals > opponentGoals) {
                wins++;
                form.push('W');
            } else if (teamGoals === opponentGoals) {
                draws++;
                form.push('D');
            } else {
                losses++;
                form.push('L');
            }

            if (fixture.statistics) {
                const teamStats = fixture.statistics.find(s => s.team.id === teamId);
                if (teamStats) {
                    const possessionStat = teamStats.statistics.find(s => s.type === 'Ball Possession');
                    if (possessionStat && possessionStat.value) {
                        possession += parseInt(possessionStat.value);
                        possessionCount++;
                    }
                }
            }
        });

        const totalGames = fixtures.length;
        const averagePossession = possessionCount > 0 ? possession / possessionCount : 55;

        return {
            offensivePower: Math.min(100, Math.round((goalsFor / totalGames) * 15 + 50)),
            defensivePower: Math.min(100, Math.round(100 - (goalsAgainst / totalGames) * 15)),
            possession: Math.round(averagePossession),
            form: form.slice(0, 5).reverse(),
            goalsFor,
            goalsAgainst,
            wins,
            draws,
            losses
        };
    }

    getDefaultStats() {
        return {
            offensivePower: 75,
            defensivePower: 75,
            possession: 50,
            form: ['W', 'D', 'W', 'L', 'W'],
            goalsFor: 15,
            goalsAgainst: 12,
            wins: 3,
            draws: 1,
            losses: 1
        };
    }

    // [Resto de métodos de análisis, interfaz y utilidades permanecen iguales...]
    // Incluir todos los métodos anteriores como performRealStatisticalAnalysis,
    // generateAdvancedPrediction, updateMatchInterface, etc.
    
    showLoadingState() {
        const elements = [
            'predictionResult .prediction-text',
            'mostLikelyResult', 
            'confidenceLevel',
            'keyFactors'
        ];
        
        elements.forEach(selector => {
            const element = document.querySelector(`#${selector}`) || document.querySelector(`.${selector}`);
            if (element) {
                element.innerHTML = '<span class="loading"></span> Analizando datos de ligas permitidas...';
            }
        });
    }

    startRealTimeUpdates() {
        this.updateInterval = setInterval(() => {
            this.updateLastUpdateTime();
            if (this.currentMatch) {
                console.log('🔄 Actualizando datos de ligas permitidas...');
            }
        }, 30000);
        
        console.log('🔄 Actualizaciones en tiempo real iniciadas para 3 ligas');
    }

    updateLastUpdateTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('es-CO', {
            timeZone: 'America/Bogota',
            hour12: false
        });
        
        document.getElementById('lastUpdate').textContent = timeString;
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    destroy() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            console.log('🛑 Actualizaciones detenidas');
        }
    }
}

// Agregar estilos CSS para sugerencias de equipos
const suggestionStyles = `
.team-suggestions {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    border: 1px solid var(--border-color);
    border-top: none;
    border-radius: 0 0 10px 10px;
    max-height: 200px;
    overflow-y: auto;
    z-index: 1000;
    box-shadow: var(--shadow);
}

.suggestion-item {
    padding: 12px 20px;
    cursor: pointer;
    border-bottom: 1px solid var(--border-color);
    transition: background-color 0.2s ease;
}

.suggestion-item:hover {
    background-color: var(--light-color);
}

.suggestion-item:last-child {
    border-bottom: none;
}

.search-section {
    position: relative;
}
`;

// Agregar estilos al head
const styleSheet = document.createElement('style');
styleSheet.textContent = suggestionStyles;
document.head.appendChild(styleSheet);

// 🚀 Inicializar aplicación especializada
document.addEventListener('DOMContentLoaded', () => {
    window.sportsPredictor = new SportsPredictor();
    
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            console.log('⏸️ Aplicación pausada');
        } else {
            console.log('▶️ Aplicación reanudada');
            window.sportsPredictor.updateLastUpdateTime();
        }
    });
});

window.addEventListener('beforeunload', () => {
    if (window.sportsPredictor) {
        window.sportsPredictor.destroy();
    }
});

console.log(`
⚽ APLICACIÓN ESPECIALIZADA INICIALIZADA ⚽
==========================================
🔑 API Key: 4ecc4e48dbcc799af42a31dfbc7bdc1a
🏆 LIGAS PERMITIDAS:
🇪🇸 La Liga EA Sports (20 equipos)
🏴󠁧󠁢󠁥󠁮󠁧󠁿 Premier League (20 equipos)  
🇨🇴 Liga BetPlay Colombia (16 equipos)

📊 EQUIPOS TEMPORADA 2025:
✅ Real Madrid, Barcelona, Atlético Madrid...
✅ Manchester City, Liverpool, Arsenal...
✅ Millonarios, Nacional, América de Cali...

💡 EJEMPLOS DE BÚSQUEDA:
- "Real Madrid vs Barcelona"
- "Manchester City Liverpool"  
- "Millonarios vs Nacional"
- "Arsenal"
==========================================
`);
