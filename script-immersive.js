// 🚀 Aplicación Ultra-Inmersiva con Validación de Partidos por Liga
class ImmersiveSportsPredictor {
    constructor() {
        this.currentMatch = null;
        this.userScore = 0;
        this.userLevel = 1;
        this.predictions = [];
        this.sounds = {};
        this.theme = 'dark';
        this.aiLevel = 3;
        this.isVoiceEnabled = false;
        
        // 📊 Cache de partidos por liga
        this.leagueFixtures = {
            'laliga': [],
            'premier': [],
            'fpc': []
        };
        
        // ✅ Equipos validados con partidos
        this.validatedTeams = {
            'laliga': new Set(),
            'premier': new Set(),
            'fpc': new Set()
        };
        
        // 📅 Últimas actualizaciones de fixtures
        this.lastFixtureUpdate = {
            'laliga': null,
            'premier': null,
            'fpc': null
        };
        
        // Configuración API
        this.apiConfig = {
            key: '4ecc4e48dbcc799af42a31dfbc7bdc1a',
            baseUrl: 'https://v3.football.api-sports.io',
            headers: {
                'X-RapidAPI-Key': '4ecc4e48dbcc799af42a31dfbc7bdc1a',
                'X-RapidAPI-Host': 'v3.football.api-sports.io'
            }
        };
        
        this.allowedLeagues = {
            'laliga': { 
                id: 140, 
                name: 'La Liga EA Sports', 
                country: 'Spain', 
                season: 2025, 
                flag: '🇪🇸',
                teams: [] // Se llenará dinámicamente
            },
            'premier': { 
                id: 39, 
                name: 'Premier League', 
                country: 'England', 
                season: 2025, 
                flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
                teams: [] // Se llenará dinámicamente
            },
            'fpc': { 
                id: 239, 
                name: 'Liga BetPlay I', 
                country: 'Colombia', 
                season: 2025, 
                flag: '🇨🇴',
                teams: [] // Se llenará dinámicamente
            }
        };
        
        this.init();
    }

    // 🔧 Inicialización mejorada con carga de partidos
    async init() {
        this.initParticles();
        this.initSounds();
        this.setupAdvancedEventListeners();
        this.initTheme();
        this.initUserProgress();
        this.initVoiceRecognition();
        
        // 📊 Cargar partidos de todas las ligas al inicio
        await this.loadAllLeagueFixtures();
        
        this.startImmersiveUpdates();
        
        // Efectos de carga
        await this.showWelcomeAnimation();
        
        console.log('🎮 Aplicación inicializada con validación de partidos por liga');
    }

    // 📊 Cargar partidos de todas las ligas
    async loadAllLeagueFixtures() {
        this.showToast('📊 Cargando partidos disponibles...', 'info');
        
        const loadingPromises = Object.keys(this.allowedLeagues).map(leagueKey => 
            this.loadLeagueFixtures(leagueKey)
        );
        
        try {
            await Promise.all(loadingPromises);
            this.showToast('✅ Partidos cargados correctamente', 'success');
            this.updateGlobalFixtureStats();
        } catch (error) {
            console.error('❌ Error cargando partidos:', error);
            this.showToast('⚠️ Error cargando algunos partidos', 'warning');
        }
    }

    // 🏆 Cargar partidos de una liga específica
    async loadLeagueFixtures(leagueKey) {
        const leagueInfo = this.allowedLeagues[leagueKey];
        if (!leagueInfo) return;

        try {
            // Verificar si necesita actualización (cada 30 minutos)
            const now = Date.now();
            const lastUpdate = this.lastFixtureUpdate[leagueKey];
            if (lastUpdate && (now - lastUpdate) < 30 * 60 * 1000) {
                console.log(`📋 Usando cache para ${leagueInfo.name}`);
                return;
            }

            console.log(`📡 Cargando partidos de ${leagueInfo.name}...`);
            
            // Obtener partidos de los próximos 14 días
            const fixtures = await this.getUpcomingFixtures(leagueInfo, 14);
            
            // Validar y almacenar partidos
            this.leagueFixtures[leagueKey] = fixtures;
            this.lastFixtureUpdate[leagueKey] = now;
            
            // Extraer equipos con partidos programados
            this.extractValidTeams(leagueKey, fixtures);
            
            console.log(`✅ ${leagueInfo.name}: ${fixtures.length} partidos cargados, ${this.validatedTeams[leagueKey].size} equipos activos`);
            
        } catch (error) {
            console.error(`❌ Error cargando ${leagueInfo.name}:`, error);
            // Usar datos de respaldo si falla la API
            this.loadFallbackTeams(leagueKey);
        }
    }

    // 📅 Obtener próximos partidos de una liga
    async getUpcomingFixtures(leagueInfo, days = 14) {
        const today = new Date();
        const endDate = new Date();
        endDate.setDate(today.getDate() + days);
        
        const fixtures = await this.makeApiCall(this.endpoints.fixtures, {
            league: leagueInfo.id,
            season: leagueInfo.season,
            from: today.toISOString().split('T')[0],
            to: endDate.toISOString().split('T')[0]
        });
        
        return fixtures.response || [];
    }

    // ✅ Extraer equipos válidos con partidos
    extractValidTeams(leagueKey, fixtures) {
        const validTeams = new Set();
        
        fixtures.forEach(fixture => {
            if (fixture.teams && fixture.teams.home && fixture.teams.away) {
                validTeams.add({
                    id: fixture.teams.home.id,
                    name: fixture.teams.home.name,
                    logo: fixture.teams.home.logo
                });
                validTeams.add({
                    id: fixture.teams.away.id,
                    name: fixture.teams.away.name,
                    logo: fixture.teams.away.logo
                });
            }
        });
        
        // Convertir Set a Array y actualizar la liga
        this.allowedLeagues[leagueKey].teams = Array.from(validTeams);
        this.validatedTeams[leagueKey] = validTeams;
    }

    // 🔄 Datos de respaldo si falla la API
    loadFallbackTeams(leagueKey) {
        const fallbackTeams = {
            'laliga': [
                'Real Madrid', 'FC Barcelona', 'Atlético Madrid', 'Athletic Club',
                'Real Sociedad', 'Real Betis', 'Villarreal', 'Valencia',
                'Sevilla', 'Celta de Vigo', 'Rayo Vallecano', 'Osasuna'
            ],
            'premier': [
                'Manchester City', 'Arsenal', 'Liverpool', 'Chelsea',
                'Manchester United', 'Newcastle United', 'Tottenham Hotspur', 'Brighton',
                'Aston Villa', 'West Ham United', 'Crystal Palace', 'Fulham'
            ],
            'fpc': [
                'Millonarios FC', 'Atlético Nacional', 'América de Cali', 'Independiente Santa Fe',
                'Deportes Tolima', 'Atlético Bucaramanga', 'Junior FC', 'Independiente Medellín',
                'Once Caldas', 'La Equidad', 'Boyacá Chicó', 'Envigado FC'
            ]
        };
        
        if (fallbackTeams[leagueKey]) {
            this.allowedLeagues[leagueKey].teams = fallbackTeams[leagueKey].map(name => ({ name }));
            console.log(`🔄 Usando equipos de respaldo para ${leagueKey}: ${fallbackTeams[leagueKey].length} equipos`);
        }
    }

    // 📊 Event listeners mejorados con validación
    setupAdvancedEventListeners() {
        // Botones principales
        document.getElementById('analyzeBtn').addEventListener('click', (e) => {
            this.handleButtonClick(e);
            this.analyzeMatchWithValidation();
        });

        // Toggle de tema
        document.getElementById('themeToggle').addEventListener('click', (e) => {
            this.handleButtonClick(e);
            this.toggleTheme();
        });

        // 🔥 Cambio de liga con validación
        document.getElementById('leagueFilter').addEventListener('change', async (e) => {
            const selectedLeague = e.target.value;
            this.updateSearchPlaceholder(selectedLeague);
            
            if (selectedLeague) {
                // Actualizar partidos de la liga seleccionada
                await this.refreshLeagueData(selectedLeague);
                await this.showValidatedLeagueMatches(selectedLeague);
            } else {
                this.hideMatchesDisplay();
                await this.loadTodayMatchesFromAllValidatedLeagues();
            }
        });

        // 🔍 Búsqueda con validación en tiempo real
        document.getElementById('teamSearch').addEventListener('input', (e) => {
            this.validateAndShowSuggestions(e.target.value);
        });

        // Resto de event listeners...
        this.setupOtherEventListeners();
    }

    // 🔄 Refrescar datos de liga
    async refreshLeagueData(leagueKey) {
        this.showToast(`🔄 Actualizando ${this.allowedLeagues[leagueKey].name}...`, 'info');
        
        // Forzar actualización eliminando cache
        this.lastFixtureUpdate[leagueKey] = null;
        
        try {
            await this.loadLeagueFixtures(leagueKey);
            this.showToast(`✅ ${this.allowedLeagues[leagueKey].name} actualizada`, 'success');
        } catch (error) {
            this.showToast('⚠️ Error actualizando datos', 'warning');
        }
    }

    // 🏆 Mostrar partidos validados de la liga
    async showValidatedLeagueMatches(leagueKey) {
        const leagueInfo = this.allowedLeagues[leagueKey];
        const fixtures = this.leagueFixtures[leagueKey];
        
        if (!fixtures || fixtures.length === 0) {
            this.showNoMatchesAvailable(leagueInfo);
            return;
        }

        this.showMatchesLoading(leagueInfo);
        
        try {
            // Filtrar partidos válidos (próximos 7 días por defecto)
            const timeFilter = document.getElementById('timeFilter').value;
            const filteredFixtures = this.filterFixturesByTime(fixtures, timeFilter);
            
            this.currentLeagueMatches = filteredFixtures;
            this.displayValidatedMatches(filteredFixtures, leagueInfo);
            
            // Actualizar estadísticas
            this.updateLeagueStats(leagueKey, filteredFixtures);
            
            console.log(`🏆 ${leagueInfo.name}: Mostrando ${filteredFixtures.length} partidos validados`);
            
        } catch (error) {
            console.error(`❌ Error mostrando partidos de ${leagueInfo.name}:`, error);
            this.showMatchesError(leagueInfo);
        }
    }

    // 📅 Filtrar partidos por tiempo
    filterFixturesByTime(fixtures, timeFilter) {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        
        return fixtures.filter(fixture => {
            const matchDate = new Date(fixture.fixture.date);
            const matchDay = new Date(matchDate.getFullYear(), matchDate.getMonth(), matchDate.getDate());
            
            switch (timeFilter) {
                case 'today':
                    return matchDay.getTime() === today.getTime();
                case 'tomorrow':
                    const tomorrow = new Date(today);
                    tomorrow.setDate(today.getDate() + 1);
                    return matchDay.getTime() === tomorrow.getTime();
                case 'week':
                    const weekEnd = new Date(today);
                    weekEnd.setDate(today.getDate() + 7);
                    return matchDay >= today && matchDay <= weekEnd;
                default:
                    // Próximos 3 días por defecto
                    const threeDays = new Date(today);
                    threeDays.setDate(today.getDate() + 3);
                    return matchDay >= today && matchDay <= threeDays;
            }
        });
    }

    // ✅ Validar y mostrar sugerencias
    validateAndShowSuggestions(searchValue) {
        if (searchValue.length < 2) {
            this.clearSuggestions();
            return;
        }
        
        const selectedLeague = document.getElementById('leagueFilter').value;
        let availableTeams = [];
        
        if (selectedLeague) {
            // Solo equipos con partidos en la liga seleccionada
            availableTeams = this.allowedLeagues[selectedLeague].teams.map(team => team.name);
        } else {
            // Equipos de todas las ligas con partidos
            Object.keys(this.allowedLeagues).forEach(leagueKey => {
                availableTeams.push(...this.allowedLeagues[leagueKey].teams.map(team => team.name));
            });
        }
        
        // Filtrar sugerencias
        const matches = availableTeams.filter(team => 
            team.toLowerCase().includes(searchValue.toLowerCase())
        ).slice(0, 8);
        
        // Validar si el equipo tiene partidos programados
        const validatedMatches = this.validateTeamsWithFixtures(matches, selectedLeague);
        
        this.displayValidatedSuggestions(validatedMatches, selectedLeague);
    }

    // 🔍 Validar equipos con partidos programados
    validateTeamsWithFixtures(teams, selectedLeague) {
        return teams.map(teamName => {
            const hasFixtures = this.teamHasUpcomingFixtures(teamName, selectedLeague);
            return {
                name: teamName,
                hasFixtures,
                league: selectedLeague || this.getTeamLeague(teamName)
            };
        });
    }

    // ⚽ Verificar si el equipo tiene partidos próximos
    teamHasUpcomingFixtures(teamName, leagueKey = null) {
        const leaguesToCheck = leagueKey ? [leagueKey] : Object.keys(this.leagueFixtures);
        
        for (const league of leaguesToCheck) {
            const fixtures = this.leagueFixtures[league] || [];
            const hasMatch = fixtures.some(fixture => 
                fixture.teams.home.name.toLowerCase().includes(teamName.toLowerCase()) ||
                fixture.teams.away.name.toLowerCase().includes(teamName.toLowerCase())
            );
            
            if (hasMatch) return true;
        }
        
        return false;
    }

    // 🏟️ Obtener liga de un equipo
    getTeamLeague(teamName) {
        for (const [leagueKey, leagueInfo] of Object.entries(this.allowedLeagues)) {
            const teamExists = leagueInfo.teams.some(team => 
                team.name.toLowerCase().includes(teamName.toLowerCase())
            );
            if (teamExists) return leagueKey;
        }
        return null;
    }

    // 📋 Mostrar sugerencias validadas
    displayValidatedSuggestions(validatedTeams, selectedLeague) {
        let suggestionsDiv = document.getElementById('teamSuggestions');
        if (!suggestionsDiv) {
            suggestionsDiv = document.createElement('div');
            suggestionsDiv.id = 'teamSuggestions';
            suggestionsDiv.className = 'team-suggestions-validated';
            document.querySelector('.search-section-advanced').appendChild(suggestionsDiv);
        }
        
        if (validatedTeams.length === 0) {
            suggestionsDiv.innerHTML = `
                <div class="no-suggestions">
                    <i class="fas fa-exclamation-triangle"></i>
                    <span>No se encontraron equipos con partidos programados</span>
                </div>
            `;
            return;
        }
        
        suggestionsDiv.innerHTML = validatedTeams
            .map(team => `
                <div class="suggestion-item-validated ${team.hasFixtures ? 'has-fixtures' : 'no-fixtures'}" 
                     onclick="window.sportsPredictor.selectValidatedTeam('${team.name}', '${team.league}')">
                    <div class="team-info">
                        <span class="team-name">${team.name}</span>
                        <span class="league-badge ${team.league}">${this.getLeagueBadge(team.league)}</span>
                    </div>
                    <div class="fixture-status">
                        ${team.hasFixtures ? 
                            '<i class="fas fa-calendar-check text-success"></i>' : 
                            '<i class="fas fa-calendar-times text-warning"></i>'
                        }
                    </div>
                </div>
            `).join('');
    }

    // 🏆 Obtener badge de liga
    getLeagueBadge(leagueKey) {
        const badges = {
            'laliga': '🇪🇸 La Liga',
            'premier': '🏴󠁧󠁢󠁥󠁮󠁧󠁿 Premier',
            'fpc': '🇨🇴 Liga BetPlay'
        };
        return badges[leagueKey] || '';
    }

    // ✅ Seleccionar equipo validado
    selectValidatedTeam(teamName, league) {
        document.getElementById('teamSearch').value = teamName;
        this.clearSuggestions();
        
        // Si no tiene partidos, mostrar alerta
        if (!this.teamHasUpcomingFixtures(teamName, league)) {
            this.showToast(`⚠️ ${teamName} no tiene partidos próximos programados`, 'warning');
            return;
        }
        
        // Auto-seleccionar la liga si no está seleccionada
        if (league && document.getElementById('leagueFilter').value !== league) {
            document.getElementById('leagueFilter').value = league;
            this.showValidatedLeagueMatches(league);
        }
        
        this.showToast(`✅ ${teamName} seleccionado`, 'success');
    }

    // 🧹 Limpiar sugerencias
    clearSuggestions() {
        const suggestions = document.getElementById('teamSuggestions');
        if (suggestions) {
            suggestions.innerHTML = '';
        }
    }

    // ⚽ Análizar partido con validación
    async analyzeMatchWithValidation() {
        const searchTerm = document.getElementById('teamSearch').value.trim();
        if (!searchTerm) {
            this.showToast('⚠️ Ingresa los nombres de los equipos', 'warning');
            return;
        }

        const selectedLeague = document.getElementById('leagueFilter').value;
        
        // Validar que los equipos tengan partidos programados
        const validationResult = this.validateSearchTerm(searchTerm, selectedLeague);
        
        if (!validationResult.isValid) {
            this.showValidationError(validationResult);
            return;
        }

        this.showAiThinking(true);
        this.showImmersiveLoading();
        
        try {
            // Buscar partido específico con validación
            const fixture = await this.findValidatedMatch(searchTerm, selectedLeague);
            if (!fixture) {
                throw new Error('No se encontró un partido válido con esos equipos');
            }

            const matchData = await this.getDetailedMatchData(fixture);
            this.currentMatch = matchData;
            
            // Continuar con el análisis normal...
            await this.updateMatchInterfaceImmersive(matchData);
            const analysis = await this.performAdvancedAnalysis(matchData);
            await this.updateAllVisualizations(analysis);
            
            const prediction = await this.generateImmersivePrediction(analysis);
            await this.showFinalPrediction(prediction);
            
            // Agregar puntos por análisis exitoso
            this.addScore(75);
            
            this.showToast('✅ Análisis validado completado', 'success');
            
        } catch (error) {
            console.error('❌ Error en análisis validado:', error);
            this.showToast(error.message, 'error');
        } finally {
            this.showAiThinking(false);
            this.hideImmersiveLoading();
        }
    }

    // ✅ Validar término de búsqueda
    validateSearchTerm(searchTerm, selectedLeague) {
        const terms = this.parseSearchTerm(searchTerm);
        const result = {
            isValid: false,
            teams: [],
            issues: []
        };
        
        // Validar cada término
        terms.forEach(term => {
            const hasFixtures = this.teamHasUpcomingFixtures(term, selectedLeague);
            const league = this.getTeamLeague(term);
            
            result.teams.push({
                name: term,
                hasFixtures,
                league
            });
            
            if (!hasFixtures) {
                result.issues.push(`${term} no tiene partidos próximos`);
            }
            
            if (selectedLeague && league !== selectedLeague) {
                result.issues.push(`${term} no pertenece a la liga seleccionada`);
            }
        });
        
        // El resultado es válido si al menos hay 1 equipo con partidos
        result.isValid = result.teams.some(team => team.hasFixtures) && result.issues.length === 0;
        
        return result;
    }

    // 📝 Parsear término de búsqueda
    parseSearchTerm(searchTerm) {
        // Separar por "vs", "v", "-" o espacios múltiples
        const separators = /\s+vs\s+|\s+v\s+|\s+-\s+|\s{3,}/i;
        let terms = searchTerm.split(separators);
        
        // Si no hay separadores claros, intentar dividir por palabras clave
        if (terms.length === 1) {
            const keywords = ['real', 'fc', 'atletico', 'manchester', 'barcelona'];
            const words = searchTerm.toLowerCase().split(' ');
            
            // Lógica simple para detectar dos equipos
            if (words.length >= 4) {
                const midPoint = Math.floor(words.length / 2);
                terms = [
                    words.slice(0, midPoint).join(' '),
                    words.slice(midPoint).join(' ')
                ];
            }
        }
        
        return terms.map(term => term.trim()).filter(term => term.length > 0);
    }

    // ❌ Mostrar error de validación
    showValidationError(validationResult) {
        let message = '⚠️ Problema con la búsqueda:\n';
        
        if (validationResult.issues.length > 0) {
            message += validationResult.issues.join('\n');
        } else {
            message += 'Los equipos ingresados no tienen partidos programados';
        }
        
        // Sugerir equipos alternativos
        const selectedLeague = document.getElementById('leagueFilter').value;
        if (selectedLeague && this.allowedLeagues[selectedLeague].teams.length > 0) {
            const suggestions = this.allowedLeagues[selectedLeague].teams
                .slice(0, 3)
                .map(team => team.name)
                .join(', ');
            message += `\n\n💡 Equipos disponibles en ${this.allowedLeagues[selectedLeague].name}: ${suggestions}`;
        }
        
        this.showToast(message, 'warning');
    }

    // 🔍 Buscar partido validado
    async findValidatedMatch(searchTerm, selectedLeague) {
        const terms = this.parseSearchTerm(searchTerm);
        const leaguesToSearch = selectedLeague ? [selectedLeague] : Object.keys(this.leagueFixtures);
        
        for (const leagueKey of leaguesToSearch) {
            const fixtures = this.leagueFixtures[leagueKey] || [];
            
            const match = fixtures.find(fixture => {
                const homeTeam = fixture.teams.home.name.toLowerCase();
                const awayTeam = fixture.teams.away.name.toLowerCase();
                
                // Buscar coincidencia directa o parcial
                return terms.some(term1 => 
                    terms.some(term2 => 
                        term1 !== term2 && 
                        (homeTeam.includes(term1.toLowerCase()) && awayTeam.includes(term2.toLowerCase())) ||
                        (homeTeam.includes(term2.toLowerCase()) && awayTeam.includes(term1.toLowerCase()))
                    )
                ) || terms.some(term => 
                    homeTeam.includes(term.toLowerCase()) || awayTeam.includes(term.toLowerCase())
                );
            });
            
            if (match) {
                console.log(`✅ Partido validado encontrado: ${match.teams.home.name} vs ${match.teams.away.name}`);
                return match;
            }
        }
        
        return null;
    }

    // 📊 Actualizar estadísticas globales de fixtures
    updateGlobalFixtureStats() {
        const totalMatches = Object.values(this.leagueFixtures)
            .reduce((sum, fixtures) => sum + fixtures.length, 0);
        
        const totalTeams = Object.values(this.allowedLeagues)
            .reduce((sum, league) => sum + league.teams.length, 0);
        
        // Actualizar en la interfaz
        document.getElementById('totalMatches').textContent = totalMatches;
        
        // Mostrar estadísticas en consola
        console.log(`📊 Estadísticas globales:
- Partidos cargados: ${totalMatches}
- Equipos activos: ${totalTeams}
- La Liga: ${this.leagueFixtures.laliga?.length || 0} partidos
- Premier: ${this.leagueFixtures.premier?.length || 0} partidos  
- Liga BetPlay: ${this.leagueFixtures.fpc?.length || 0} partidos`);
    }

    // 📊 Actualizar estadísticas de liga específica
    updateLeagueStats(leagueKey, fixtures) {
        const leagueInfo = this.allowedLeagues[leagueKey];
        const matchesCount = document.getElementById('matchesCount');
        
        if (matchesCount) {
            matchesCount.textContent = `${fixtures.length} partidos encontrados en ${leagueInfo.name}`;
        }
        
        // Actualizar badge de la liga con información
        const leagueOption = document.querySelector(`option[value="${leagueKey}"]`);
        if (leagueOption && fixtures.length > 0) {
            leagueOption.textContent = `${leagueInfo.flag} ${leagueInfo.name} (${fixtures.length} partidos)`;
        }
    }

    // 🚫 Mostrar cuando no hay partidos disponibles
    showNoMatchesAvailable(leagueInfo) {
        const matchesHeader = document.querySelector('.matches-header');
        const matchesGrid = document.getElementById('matchesGrid');
        
        matchesHeader.style.display = 'flex';
        document.getElementById('matchesTitle').textContent = `${leagueInfo.flag} ${leagueInfo.name}`;
        document.getElementById('matchesCount').textContent = 'Sin partidos programados';
        
        matchesGrid.innerHTML = `
            <div class="no-matches-available">
                <i class="fas fa-calendar-times"></i>
                <h3>Sin partidos programados</h3>
                <p>No hay partidos disponibles para ${leagueInfo.name} en las próximas fechas</p>
                <div class="suggestions">
                    <p><strong>💡 Sugerencias:</strong></p>
                    <ul>
                        <li>Verifica tu conexión a internet</li>
                        <li>Intenta seleccionar otra liga</li>
                        <li>Los partidos se actualizan automáticamente</li>
                    </ul>
                </div>
                <button onclick="window.sportsPredictor.refreshLeagueData('${leagueInfo.id}')" class="retry-btn">
                    🔄 Actualizar partidos
                </button>
            </div>
        `;
    }

    // 📋 Mostrar partidos validados
    displayValidatedMatches(matches, leagueInfo) {
        const matchesHeader = document.querySelector('.matches-header');
        const matchesTitle = document.getElementById('matchesTitle');
        const matchesCount = document.getElementById('matchesCount');
        const matchesGrid = document.getElementById('matchesGrid');

        // Mostrar header
        matchesHeader.style.display = 'flex';
        matchesTitle.textContent = `${leagueInfo.flag} ${leagueInfo.name} - Partidos Validados`;
        matchesCount.textContent = `${matches.length} partidos con equipos confirmados`;

        if (matches.length === 0) {
            this.showNoMatchesAvailable(leagueInfo);
            return;
        }

        // Crear tarjetas de partidos validados
        matchesGrid.innerHTML = matches.map(match => this.createValidatedMatchCard(match)).join('');

        // Agregar event listeners a las tarjetas
        this.addMatchCardListeners();
        
        // Animación de entrada
        this.animateMatchCardsEntry();
    }

    // 🎴 Crear tarjeta de partido validado
    createValidatedMatchCard(match) {
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

        // Verificar si ambos equipos tienen datos completos
        const isValidated = match.teams.home.name && match.teams.away.name;
        
        return `
            <div class="match-card validated-match ${isValidated ? 'fully-validated' : 'partial-validated'}" 
                 data-fixture-id="${match.fixture.id}" 
                 onclick="window.sportsPredictor.selectMatchFromCard(${match.fixture.id})">
                
                <div class="validation-badge">
                    <i class="fas ${isValidated ? 'fa-shield-check' : 'fa-shield-alt'}"></i>
                    <span>${isValidated ? 'Validado' : 'Parcial'}</span>
                </div>
                
                <div class="match-status ${statusClass}">
                    <span class="status-text">${status}</span>
                    <span class="match-time">${timeStr}</span>
                </div>
                
                <div class="match-teams">
                    <div class="team home-team">
                        <img src="${match.teams.home.logo || 'https://via.placeholder.com/40x40'}" 
                             alt="${match.teams.home.name}" 
                             class="team-logo"
                             onerror="this.src='https://via.placeholder.com/40x40'">
                        <span class="team-name">${match.teams.home.name}</span>
                        ${this.getTeamValidationIcon(match.teams.home.name)}
                    </div>
                    
                    <div class="match-vs">
                        <span class="vs-text">VS</span>
                        <div class="match-date">${dateStr}</div>
                        <div class="match-reliability">
                            <div class="reliability-stars">
                                ${this.getReliabilityStars(match)}
                            </div>
                        </div>
                    </div>
                    
                    <div class="team away-team">
                        <img src="${match.teams.away.logo || 'https://via.placeholder.com/40x40'}" 
                             alt="${match.teams.away.name}" 
                             class="team-logo"
                             onerror="this.src='https://via.placeholder.com/40x40'">
                        <span class="team-name">${match.teams.away.name}</span>
                        ${this.getTeamValidationIcon(match.teams.away.name)}
                    </div>
                </div>
                
                <div class="match-info">
                    <span class="venue">🏟️ ${match.fixture.venue.name}</span>
                    <button class="analyze-btn validated-analyze">
                        <i class="fas fa-microscope"></i> Analizar Validado
                    </button>
                </div>
                
                <div class="match-metadata">
                    <span class="league-info">${this.getLeagueFlag(match.league.id)} ${match.league.name}</span>
                    <span class="confidence-score">Confianza: ${this.calculateMatchConfidence(match)}%</span>
                </div>
            </div>
        `;
    }

    // ✅ Icono de validación del equipo
    getTeamValidationIcon(teamName) {
        const hasFixtures = this.teamHasUpcomingFixtures(teamName);
        return `<i class="fas ${hasFixtures ? 'fa-check-circle text-success' : 'fa-question-circle text-warning'}" 
                   title="${hasFixtures ? 'Equipo validado con partidos' : 'Verificar disponibilidad'}"></i>`;
    }

    // ⭐ Estrellas de confiabilidad
    getReliabilityStars(match) {
        const confidence = this.calculateMatchConfidence(match);
        const stars = Math.floor(confidence / 20); // 0-5 estrellas
        
        let starHtml = '';
        for (let i = 0; i < 5; i++) {
            starHtml += `<i class="fas fa-star ${i < stars ? 'active' : ''}"></i>`;
        }
        return starHtml;
    }

    // 🎯 Calcular confianza del partido
    calculateMatchConfidence(match) {
        let confidence = 70; // Base
        
        // +10 si ambos equipos tienen logos
        if (match.teams.home.logo && match.teams.away.logo) confidence += 10;
        
        // +10 si el partido es próximo (dentro de 7 días)
        const matchDate = new Date(match.fixture.date);
        const daysDiff = (matchDate - new Date()) / (1000 * 60 * 60 * 24);
        if (daysDiff <= 7) confidence += 10;
        
        // +10 si ambos equipos están validados
        const homeValidated = this.teamHasUpcomingFixtures(match.teams.home.name);
        const awayValidated = this.teamHasUpcomingFixtures(match.teams.away.name);
        if (homeValidated && awayValidated) confidence += 10;
        
        return Math.min(confidence, 100);
    }

    // 🏆 Obtener flag de liga por ID
    getLeagueFlag(leagueId) {
        const leagueFlags = {
            140: '🇪🇸',  // La Liga
            39: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',    // Premier League
            239: '🇨🇴'   // Liga BetPlay
        };
        return leagueFlags[leagueId] || '⚽';
    }

    // ✨ Animar entrada de tarjetas
    animateMatchCardsEntry() {
        const cards = document.querySelectorAll('.match-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.5s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    // 🔄 Cargar partidos de hoy de todas las ligas validadas
    async loadTodayMatchesFromAllValidatedLeagues() {
        try {
            const today = new Date().toISOString().split('T')[0];
            const allMatches = [];
            
            // Obtener partidos de hoy de cada liga
            for (const [leagueKey, fixtures] of Object.entries(this.leagueFixtures)) {
                const todayMatches = fixtures.filter(fixture => {
                    const matchDate = new Date(fixture.fixture.date).toISOString().split('T')[0];
                    return matchDate === today;
                });
                
                allMatches.push(...todayMatches);
            }
            
            if (allMatches.length > 0) {
                console.log(`📅 Total: ${allMatches.length} partidos validados para hoy`);
                this.displayValidatedMatches(allMatches, { 
                    name: 'Todas las Ligas', 
                    flag: '🌍' 
                });
            } else {
                console.log('📅 No hay partidos validados para hoy');
                this.showNoMatchesToday();
            }
        } catch (error) {
            console.error('❌ Error cargando partidos de hoy:', error);
        }
    }

    // 📅 Mostrar mensaje cuando no hay partidos hoy
    showNoMatchesToday() {
        const matchesGrid = document.getElementById('matchesGrid');
        matchesGrid.innerHTML = `
            <div class="no-matches-today">
                <i class="fas fa-calendar-day"></i>
                <h3>Sin partidos para hoy</h3>
                <p>No hay partidos programados para el día de hoy en las ligas disponibles</p>
                <div class="alternative-actions">
                    <button onclick="document.getElementById('timeFilter').value='tomorrow'; document.getElementById('timeFilter').dispatchEvent(new Event('change'))" 
                            class="alt-btn">
                        <i class="fas fa-forward"></i> Ver partidos de mañana
                    </button>
                    <button onclick="document.getElementById('timeFilter').value='week'; document.getElementById('timeFilter').dispatchEvent(new Event('change'))" 
                            class="alt-btn">
                        <i class="fas fa-calendar-week"></i> Ver esta semana
                    </button>
                </div>
            </div>
        `;
    }

    // [Mantener todos los otros métodos anteriores...]
    // makeApiCall, updateMatchInterfaceImmersive, etc.

    // 🔄 Actualizaciones automáticas mejoradas
    startImmersiveUpdates() {
        // Actualizar fixtures cada 30 minutos
        setInterval(async () => {
            if (!this.updatesPaused) {
                console.log('🔄 Actualizando fixtures automáticamente...');
                await this.loadAllLeagueFixtures();
                
                const selectedLeague = document.getElementById('leagueFilter').value;
                if (selectedLeague) {
                    await this.showValidatedLeagueMatches(selectedLeague);
                }
            }
        }, 30 * 60 * 1000); // 30 minutos
        
        // Otras actualizaciones...
        this.startOtherUpdates();
    }

    // [Incluir todos los otros métodos del código anterior...]
    // Los métodos como makeApiCall, delay, playSound, etc. se mantienen igual
    
    // 🛠️ Utilidades
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

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

    // [Resto de métodos se mantienen igual...]
}

// 🚀 Inicialización automática
document.addEventListener('DOMContentLoaded', () => {
    window.sportsPredictor = new ImmersiveSportsPredictor();
});

console.log(`
🎯 VALIDACIÓN DE PARTIDOS POR LIGA ACTIVADA 🎯
============================================
✅ CARACTERÍSTICAS NUEVAS:
🔍 Validación de equipos con partidos reales
📊 Cache inteligente de fixtures por liga
⚽ Solo equipos con partidos programados
🏆 Sugerencias basadas en partidos reales
📅 Filtrado por tiempo con partidos válidos
✨ Interfaz de tarjetas con validación
📈 Estadísticas de confiabilidad
🔄 Auto-actualización cada 30 minutos

🎮 FUNCIONALIDADES:
- Selecciona una liga → Ve solo equipos con partidos
- Busca equipos → Validación automática
- Sugerencias inteligentes con badges
- Indicadores de confiabilidad
- Partidos validados en tiempo real
============================================
`);
