// 🚀 Aplicación de Pronósticos Deportivos Pro
class SportsPredictor {
    constructor() {
        this.currentMatch = null;
        this.teams = new Map();
        this.leagues = new Map();
        this.updateInterval = null;
        this.apiEndpoints = {
            matches: 'https://api.football-data.org/v4/matches',
            teams: 'https://api.football-data.org/v4/teams',
            standings: 'https://api.football-data.org/v4/competitions'
        };
        
        this.init();
    }

    // 🔧 Inicialización de la aplicación
    init() {
        this.setupEventListeners();
        this.loadSampleData();
        this.startRealTimeUpdates();
        this.updateLastUpdateTime();
        console.log('⚽ Aplicación inicializada correctamente');
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
        leagueFilter.addEventListener('change', () => this.filterMatches());
        timeFilter.addEventListener('change', () => this.filterMatches());
    }

    // 🔍 Analizar partido específico
    async analyzeMatch() {
        const searchTerm = document.getElementById('teamSearch').value.trim();
        if (!searchTerm) {
            alert('⚠️ Por favor ingresa los nombres de los equipos');
            return;
        }

        this.showLoadingState();
        
        try {
            // Simular búsqueda de equipos (En producción conectaría con API real)
            const matchData = await this.searchTeams(searchTerm);
            this.currentMatch = matchData;
            
            // Actualizar interfaz con datos del partido
            await this.updateMatchInterface(matchData);
            
            // Realizar análisis estadístico
            const analysis = await this.performStatisticalAnalysis(matchData);
            
            // Actualizar análisis en la interfaz
            this.updateAnalysisInterface(analysis);
            
            // Generar pronóstico
            const prediction = this.generatePrediction(analysis);
            this.updatePredictionInterface(prediction);
            
            console.log('✅ Análisis completado:', prediction);
            
        } catch (error) {
            console.error('❌ Error en el análisis:', error);
            this.showErrorMessage('Error al analizar el partido. Inténtalo de nuevo.');
        }
    }

    // 🔎 Buscar equipos (simulado - conectaría con API real)
    async searchTeams(searchTerm) {
        // Simular delay de API
        await this.delay(1500);
        
        // Datos de ejemplo - En producción vendría de API real
        const sampleMatches = [
            {
                id: 1,
                homeTeam: {
                    name: 'Real Madrid',
                    logo: 'https://logos-world.net/wp-content/uploads/2020/06/Real-Madrid-Logo.png',
                    position: 1,
                    points: 65,
                    stats: {
                        offensivePower: 92,
                        defensivePower: 85,
                        possession: 68,
                        form: ['W', 'W', 'D', 'W', 'W'],
                        injuries: ['Benzema', 'Courtois'],
                        doubtful: ['Modric'],
                        formation: '4-3-3',
                        formationStrengths: ['Ataque rápido', 'Presión alta']
                    }
                },
                awayTeam: {
                    name: 'Barcelona',
                    logo: 'https://logoeps.com/wp-content/uploads/2013/03/barcelona-vector-logo.png',
                    position: 2,
                    points: 61,
                    stats: {
                        offensivePower: 88,
                        defensivePower: 79,
                        possession: 72,
                        form: ['W', 'L', 'W', 'W', 'D'],
                        injuries: ['Pedri', 'Araujo'],
                        doubtful: ['Lewandowski'],
                        formation: '4-3-3',
                        formationStrengths: ['Posesión', 'Combinaciones']
                    }
                },
                date: new Date().toLocaleDateString(),
                time: '21:00',
                league: 'La Liga',
                coaches: {
                    home: {
                        name: 'Carlo Ancelotti',
                        style: ['Ofensivo', 'Pragmático'],
                        record: '18V - 3E - 1D'
                    },
                    away: {
                        name: 'Xavi Hernández',
                        style: ['Posesión', 'Presión Alta'],
                        record: '15V - 4E - 3D'
                    }
                }
            }
        ];
        
        // Buscar coincidencia (simplificado)
        const match = sampleMatches.find(m => 
            searchTerm.toLowerCase().includes(m.homeTeam.name.toLowerCase()) ||
            searchTerm.toLowerCase().includes(m.awayTeam.name.toLowerCase())
        ) || sampleMatches[0]; // Devolver el primero si no encuentra coincidencia

        return match;
    }

    // 📊 Realizar análisis estadístico avanzado
    async performStatisticalAnalysis(matchData) {
        const homeTeam = matchData.homeTeam;
        const awayTeam = matchData.awayTeam;
        
        // Análisis de poder ofensivo vs defensivo
        const offensiveDefensiveAnalysis = {
            homeOffensiveVsAwayDefensive: homeTeam.stats.offensivePower - awayTeam.stats.defensivePower,
            awayOffensiveVsHomeDefensive: awayTeam.stats.offensivePower - homeTeam.stats.defensivePower,
            balanceScore: (homeTeam.stats.offensivePower + homeTeam.stats.defensivePower) - 
                         (awayTeam.stats.offensivePower + awayTeam.stats.defensivePower)
        };

        // Análisis de forma reciente
        const formAnalysis = {
            homeFormScore: this.calculateFormScore(homeTeam.stats.form),
            awayFormScore: this.calculateFormScore(awayTeam.stats.form),
            homeMomentum: this.calculateMomentum(homeTeam.stats.form),
            awayMomentum: this.calculateMomentum(awayTeam.stats.form)
        };

        // Análisis de lesiones/bajas
        const injuryAnalysis = {
            homeImpact: this.calculateInjuryImpact(homeTeam.stats.injuries),
            awayImpact: this.calculateInjuryImpact(awayTeam.stats.injuries),
            homeAvailability: 100 - (homeTeam.stats.injuries.length * 5),
            awayAvailability: 100 - (awayTeam.stats.injuries.length * 5)
        };

        // Análisis de formaciones
        const tacticalAnalysis = {
            homeFormationStrength: this.evaluateFormation(homeTeam.stats.formation),
            awayFormationStrength: this.evaluateFormation(awayTeam.stats.formation),
            tacticalAdvantage: this.calculateTacticalAdvantage(
                homeTeam.stats.formation, 
                awayTeam.stats.formation
            )
        };

        return {
            offensiveDefensive: offensiveDefensiveAnalysis,
            form: formAnalysis,
            injuries: injuryAnalysis,
            tactical: tacticalAnalysis,
            homeAdvantage: 15, // Ventaja típica de jugar en casa
            confidenceFactors: this.calculateConfidenceFactors(matchData)
        };
    }

    // 🧮 Calcular puntuación de forma reciente
    calculateFormScore(form) {
        const points = {
            'W': 3,
            'D': 1,
            'L': 0
        };
        
        return form.reduce((total, result, index) => {
            const weight = (index + 1) * 0.2; // Más peso a partidos recientes
            return total + (points[result] * weight);
        }, 0);
    }

    // 📈 Calcular momentum del equipo
    calculateMomentum(form) {
        const recent = form.slice(-3); // Últimos 3 partidos
        const wins = recent.filter(r => r === 'W').length;
        const draws = recent.filter(r => r === 'D').length;
        
        return (wins * 2 + draws) / 6 * 100; // Porcentaje de momentum
    }

    // 🏥 Calcular impacto de lesiones
    calculateInjuryImpact(injuries) {
        // En una implementación real, tendría pesos por posición y calidad del jugador
        const keyPositions = ['Goalkeeper', 'Centre-Back', 'Striker'];
        let impact = 0;
        
        injuries.forEach(injury => {
            impact += Math.random() * 15 + 5; // Simulado: 5-20 puntos por lesión
        });
        
        return Math.min(impact, 50); // Máximo 50% de impacto
    }

    // ⚽ Evaluar fortaleza de formación
    evaluateFormation(formation) {
        const formationStrengths = {
            '4-3-3': { attack: 90, defense: 75, midfield: 85 },
            '4-4-2': { attack: 80, defense: 85, midfield: 80 },
            '3-5-2': { attack: 85, defense: 80, midfield: 90 },
            '4-2-3-1': { attack: 85, defense: 80, midfield: 85 },
            '5-3-2': { attack: 70, defense: 95, midfield: 75 }
        };
        
        const strengths = formationStrengths[formation] || { attack: 75, defense: 75, midfield: 75 };
        return (strengths.attack + strengths.defense + strengths.midfield) / 3;
    }

    // 🎯 Calcular ventaja táctica
    calculateTacticalAdvantage(homeFormation, awayFormation) {
        // Matriz de ventajas tácticas simplificada
        const advantages = {
            '4-3-3': { '4-4-2': 5, '3-5-2': -3, '4-2-3-1': 2 },
            '4-4-2': { '4-3-3': -5, '3-5-2': 3, '4-2-3-1': -2 },
            '3-5-2': { '4-3-3': 3, '4-4-2': -3, '4-2-3-1': 1 }
        };
        
        return advantages[homeFormation]?.[awayFormation] || 0;
    }

    // 🔍 Calcular factores de confianza
    calculateConfidenceFactors(matchData) {
        const factors = [];
        
        // Factor de posición en tabla
        const positionDiff = matchData.awayTeam.position - matchData.homeTeam.position;
        if (Math.abs(positionDiff) > 5) {
            factors.push({
                factor: 'Diferencia significativa en tabla',
                impact: Math.abs(positionDiff) * 2,
                positive: positionDiff > 0
            });
        }

        // Factor de lesiones
        const homeInjuries = matchData.homeTeam.stats.injuries.length;
        const awayInjuries = matchData.awayTeam.stats.injuries.length;
        if (Math.abs(homeInjuries - awayInjuries) >= 2) {
            factors.push({
                factor: 'Diferencia en disponibilidad de jugadores',
                impact: Math.abs(homeInjuries - awayInjuries) * 5,
                positive: homeInjuries < awayInjuries
            });
        }

        return factors;
    }

    // 🎲 Generar pronóstico final
    generatePrediction(analysis) {
        let homeScore = 50; // Base 50-50
        
        // Aplicar análisis ofensivo/defensivo
        homeScore += analysis.offensiveDefensive.balanceScore * 0.3;
        
        // Aplicar forma reciente
        const formDiff = analysis.form.homeFormScore - analysis.form.awayFormScore;
        homeScore += formDiff * 2;
        
        // Aplicar ventaja de casa
        homeScore += analysis.homeAdvantage;
        
        // Aplicar impacto de lesiones
        const injuryDiff = analysis.injuries.awayImpact - analysis.injuries.homeImpact;
        homeScore += injuryDiff * 0.5;
        
        // Aplicar ventaja táctica
        homeScore += analysis.tactical.tacticalAdvantage;
        
        // Normalizar entre 0-100
        homeScore = Math.max(0, Math.min(100, homeScore));
        
        // Determinar resultado más probable
        let prediction = '';
        let confidence = 0;
        
        if (homeScore > 65) {
            prediction = 'Victoria Local';
            confidence = homeScore;
        } else if (homeScore < 35) {
            prediction = 'Victoria Visitante';
            confidence = 100 - homeScore;
        } else {
            prediction = 'Empate o Resultado Cerrado';
            confidence = 100 - Math.abs(homeScore - 50) * 2;
        }
        
        // Calcular factores clave
        const keyFactors = this.identifyKeyFactors(analysis);
        
        return {
            result: prediction,
            confidence: Math.round(confidence),
            homeWinProbability: Math.round(homeScore),
            awayWinProbability: Math.round(100 - homeScore),
            keyFactors: keyFactors,
            analysis: analysis
        };
    }

    // 🔑 Identificar factores clave del pronóstico
    identifyKeyFactors(analysis) {
        const factors = [];
        
        if (analysis.homeAdvantage > 10) {
            factors.push('Ventaja de jugar en casa');
        }
        
        if (Math.abs(analysis.form.homeFormScore - analysis.form.awayFormScore) > 2) {
            const better = analysis.form.homeFormScore > analysis.form.awayFormScore ? 'local' : 'visitante';
            factors.push(`Mejor forma reciente del equipo ${better}`);
        }
        
        if (Math.abs(analysis.offensiveDefensive.balanceScore) > 10) {
            const stronger = analysis.offensiveDefensive.balanceScore > 0 ? 'local' : 'visitante';
            factors.push(`Superioridad técnica del equipo ${stronger}`);
        }
        
        if (Math.abs(analysis.injuries.homeImpact - analysis.injuries.awayImpact) > 15) {
            const lessBurdened = analysis.injuries.homeImpact < analysis.injuries.awayImpact ? 'local' : 'visitante';
            factors.push(`Mejor disponibilidad de jugadores para equipo ${lessBurdened}`);
        }
        
        return factors.slice(0, 3); // Máximo 3 factores clave
    }

    // 🖥️ Actualizar interfaz del partido
    async updateMatchInterface(matchData) {
        // Información básica de equipos
        document.getElementById('localTeamName').textContent = matchData.homeTeam.name;
        document.getElementById('visitanteTeamName').textContent = matchData.awayTeam.name;
        document.getElementById('localTeamLogo').src = matchData.homeTeam.logo;
        document.getElementById('visitanteTeamLogo').src = matchData.awayTeam.logo;
        
        // Estadísticas de equipos
        document.getElementById('localPosition').textContent = matchData.homeTeam.position + '°';
        document.getElementById('localPoints').textContent = matchData.homeTeam.points + ' pts';
        document.getElementById('visitantePosition').textContent = matchData.awayTeam.position + '°';
        document.getElementById('visitantePoints').textContent = matchData.awayTeam.points + ' pts';
        
        // Información del partido
        document.getElementById('matchTime').textContent = matchData.time;
        document.getElementById('matchDate').textContent = matchData.date;
        
        console.log('✅ Interfaz del partido actualizada');
    }

    // 📈 Actualizar interfaz de análisis
    updateAnalysisInterface(analysis) {
        // Poder ofensivo/defensivo
        this.updatePowerBars(analysis.offensiveDefensive);
        
        // Posesión de balón
        this.updatePossessionBars();
        
        // Formaciones
        this.updateFormations();
        
        // Estado del plantel
        this.updateTeamStatus();
        
        // Forma reciente
        this.updateRecentForm();
        
        // Análisis del DT
        this.updateCoachAnalysis();
        
        console.log('✅ Interfaz de análisis actualizada');
    }

    // ⚡ Actualizar barras de poder
    updatePowerBars(analysis) {
        const homeTeam = this.currentMatch.homeTeam;
        const awayTeam = this.currentMatch.awayTeam;
        
        // Animar barras de poder
        setTimeout(() => {
            document.getElementById('offensiveLocal').style.width = `${homeTeam.stats.offensivePower}%`;
            document.getElementById('offensiveLocalValue').textContent = homeTeam.stats.offensivePower;
            
            document.getElementById('defensiveLocal').style.width = `${homeTeam.stats.defensivePower}%`;
            document.getElementById('defensiveLocalValue').textContent = homeTeam.stats.defensivePower;
            
            document.getElementById('offensiveVisitante').style.width = `${awayTeam.stats.offensivePower}%`;
            document.getElementById('offensiveVisitanteValue').textContent = awayTeam.stats.offensivePower;
            
            document.getElementById('defensiveVisitante').style.width = `${awayTeam.stats.defensivePower}%`;
            document.getElementById('defensiveVisitanteValue').textContent = awayTeam.stats.defensivePower;
        }, 500);
    }

    // 🏃 Actualizar barras de posesión
    updatePossessionBars() {
        const homeTeam = this.currentMatch.homeTeam;
        const awayTeam = this.currentMatch.awayTeam;
        
        setTimeout(() => {
            document.getElementById('localPossession').style.width = `${homeTeam.stats.possession}%`;
            document.getElementById('localPossessionValue').textContent = `${homeTeam.stats.possession}%`;
            
            document.getElementById('visitantePossession').style.width = `${awayTeam.stats.possession}%`;
            document.getElementById('visitantePossessionValue').textContent = `${awayTeam.stats.possession}%`;
        }, 750);
    }

    // 🛡️ Actualizar formaciones
    updateFormations() {
        const homeTeam = this.currentMatch.homeTeam;
        const awayTeam = this.currentMatch.awayTeam;
        
        // Formación local
        const localFormationEl = document.getElementById('localFormation');
        localFormationEl.querySelector('.formation-name').textContent = homeTeam.stats.formation;
        const localStrengths = localFormationEl.querySelector('.formation-strengths');
        localStrengths.innerHTML = homeTeam.stats.formationStrengths
            .map(strength => `<span class="strength">${strength}</span>`)
            .join('');
        
        // Formación visitante
        const visitanteFormationEl = document.getElementById('visitanteFormation');
        visitanteFormationEl.querySelector('.formation-name').textContent = awayTeam.stats.formation;
        const visitanteStrengths = visitanteFormationEl.querySelector('.formation-strengths');
        visitanteStrengths.innerHTML = awayTeam.stats.formationStrengths
            .map(strength => `<span class="strength">${strength}</span>`)
            .join('');
    }

    // 🏥 Actualizar estado del plantel
    updateTeamStatus() {
        const homeTeam = this.currentMatch.homeTeam;
        const awayTeam = this.currentMatch.awayTeam;
        
        // Lesionados local
        const localInjuredEl = document.getElementById('localInjured');
        localInjuredEl.innerHTML = homeTeam.stats.injuries.length > 0 
            ? homeTeam.stats.injuries.map(player => `<li>${player}</li>`).join('')
            : '<li>Sin lesionados reportados</li>';
        
        // Dudosos local
        const localDoubtfulEl = document.getElementById('localDoubtful');
        localDoubtfulEl.innerHTML = homeTeam.stats.doubtful.length > 0
            ? homeTeam.stats.doubtful.map(player => `<li>${player}</li>`).join('')
            : '<li>Plantel completo disponible</li>';
        
        // Lesionados visitante
        const visitanteInjuredEl = document.getElementById('visitanteInjured');
        visitanteInjuredEl.innerHTML = awayTeam.stats.injuries.length > 0
            ? awayTeam.stats.injuries.map(player => `<li>${player}</li>`).join('')
            : '<li>Sin lesionados reportados</li>';
        
        // Dudosos visitante
        const visitanteDoubtfulEl = document.getElementById('visitanteDoubtful');
        visitanteDoubtfulEl.innerHTML = awayTeam.stats.doubtful.length > 0
            ? awayTeam.stats.doubtful.map(player => `<li>${player}</li>`).join('')
            : '<li>Plantel completo disponible</li>';
    }

    // 📊 Actualizar forma reciente
    updateRecentForm() {
        const homeTeam = this.currentMatch.homeTeam;
        const awayTeam = this.currentMatch.awayTeam;
        
        // Forma local
        const localFormEl = document.getElementById('localRecentForm');
        localFormEl.innerHTML = homeTeam.stats.form
            .map(result => {
                const className = result === 'W' ? 'win' : result === 'D' ? 'draw' : 'loss';
                return `<span class="result ${className}">${result}</span>`;
            }).join('');
        
        // Estadísticas de forma local
        const localWins = homeTeam.stats.form.filter(r => r === 'W').length;
        const localDraws = homeTeam.stats.form.filter(r => r === 'D').length;
        const localLosses = homeTeam.stats.form.filter(r => r === 'L').length;
        document.getElementById('localFormStats').textContent = `${localWins}V - ${localDraws}E - ${localLosses}D`;
        
        // Forma visitante
        const visitanteFormEl = document.getElementById('visitanteRecentForm');
        visitanteFormEl.innerHTML = awayTeam.stats.form
            .map(result => {
                const className = result === 'W' ? 'win' : result === 'D' ? 'draw' : 'loss';
                return `<span class="result ${className}">${result}</span>`;
            }).join('');
        
        // Estadísticas de forma visitante
        const visitanteWins = awayTeam.stats.form.filter(r => r === 'W').length;
        const visitanteDraws = awayTeam.stats.form.filter(r => r === 'D').length;
        const visitanteLosses = awayTeam.stats.form.filter(r => r === 'L').length;
        document.getElementById('visitanteFormStats').textContent = `${visitanteWins}V - ${visitanteDraws}E - ${visitanteLosses}D`;
    }

    // 👔 Actualizar análisis del DT
    updateCoachAnalysis() {
        const coaches = this.currentMatch.coaches;
        
        // DT Local
        const localCoachEl = document.getElementById('localCoachInfo');
        localCoachEl.querySelector('.coach-name').textContent = coaches.home.name;
        localCoachEl.querySelector('.coach-record').textContent = coaches.home.record + ' esta temporada';
        
        const localStyleEl = localCoachEl.querySelector('.coach-style');
        localStyleEl.innerHTML = coaches.home.style
            .map(style => `<span class="style-tag">${style}</span>`)
            .join('');
        
        // DT Visitante
        const visitanteCoachEl = document.getElementById('visitanteCoachInfo');
        visitanteCoachEl.querySelector('.coach-name').textContent = coaches.away.name;
        visitanteCoachEl.querySelector('.coach-record').textContent = coaches.away.record + ' esta temporada';
        
        const visitanteStyleEl = visitanteCoachEl.querySelector('.coach-style');
        visitanteStyleEl.innerHTML = coaches.away.style
            .map(style => `<span class="style-tag">${style}</span>`)
            .join('');
    }

    // 🎯 Actualizar interfaz de pronóstico
    updatePredictionInterface(prediction) {
        // Resultado principal
        document.getElementById('predictionResult').querySelector('.prediction-text').textContent = prediction.result;
        
        // Barra de confianza
        const confidenceFill = document.getElementById('confidenceFill');
        const confidenceText = document.getElementById('confidenceText');
        
        setTimeout(() => {
            confidenceFill.style.width = `${prediction.confidence}%`;
            confidenceText.textContent = `${prediction.confidence}% Confianza`;
        }, 1000);
        
        // Resumen detallado
        document.getElementById('mostLikelyResult').textContent = prediction.result;
        document.getElementById('confidenceLevel').textContent = `${prediction.confidence}%`;
        document.getElementById('keyFactors').textContent = prediction.keyFactors.join(', ');
        
        console.log('✅ Pronóstico actualizado:', prediction);
    }

    // 🕐 Estado de carga
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
                element.innerHTML = '<span class="loading"></span> Analizando...';
            }
        });
    }

    // ❌ Mostrar mensaje de error
    showErrorMessage(message) {
        const predictionText = document.querySelector('#predictionResult .prediction-text');
        if (predictionText) {
            predictionText.textContent = `❌ ${message}`;
            predictionText.style.color = 'var(--danger-color)';
        }
        
        setTimeout(() => {
            if (predictionText) {
                predictionText.style.color = '';
                predictionText.textContent = 'Selecciona un partido para analizar';
            }
        }, 5000);
    }

    // 🔄 Cargar datos de ejemplo
    loadSampleData() {
        // Cargar partido de ejemplo para demostración
        const sampleSearch = 'Real Madrid vs Barcelona';
        document.getElementById('teamSearch').value = sampleSearch;
        
        // Simular carga automática después de un delay
        setTimeout(() => {
            this.analyzeMatch();
        }, 2000);
    }

    // ⏰ Iniciar actualizaciones en tiempo real
    startRealTimeUpdates() {
        // Actualizar cada 30 segundos
        this.updateInterval = setInterval(() => {
            this.updateLastUpdateTime();
            
            // Si hay un partido actual, actualizar sus datos
            if (this.currentMatch) {
                this.refreshMatchData();
            }
        }, 30000);
        
        console.log('🔄 Actualizaciones en tiempo real iniciadas');
    }

    // 📡 Refrescar datos del partido actual
    async refreshMatchData() {
        try {
            // En producción, esto haría una llamada real a la API
            console.log('🔄 Refrescando datos del partido...');
            
            // Simular pequeños cambios en las estadísticas
            if (this.currentMatch) {
                // Actualizar estadísticas ligeramente
                this.currentMatch.homeTeam.stats.offensivePower += (Math.random() - 0.5) * 2;
                this.currentMatch.awayTeam.stats.offensivePower += (Math.random() - 0.5) * 2;
                
                // Re-analizar con datos actualizados
                const analysis = await this.performStatisticalAnalysis(this.currentMatch);
                const prediction = this.generatePrediction(analysis);
                
                // Actualizar solo las partes que cambiaron
                this.updatePowerBars(analysis.offensiveDefensive);
                this.updatePredictionInterface(prediction);
            }
        } catch (error) {
            console.error('❌ Error al refrescar datos:', error);
        }
    }

    // 🕒 Actualizar hora de última actualización
    updateLastUpdateTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('es-CO', {
            timeZone: 'America/Bogota',
            hour12: false
        });
        
        document.getElementById('lastUpdate').textContent = timeString;
    }

    // 🔍 Filtrar partidos por liga y tiempo
    filterMatches() {
        const league = document.getElementById('leagueFilter').value;
        const time = document.getElementById('timeFilter').value;
        
        console.log(`🔍 Filtrando: Liga=${league}, Tiempo=${time}`);
        
        // En producción, esto filtrarías los resultados de búsqueda
        // Por ahora, solo log para demostración
    }

    // ⏳ Función auxiliar para delay
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // 🛑 Detener actualizaciones
    destroy() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            console.log('🛑 Actualizaciones detenidas');
        }
    }
}

// 🚀 Inicializar aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.sportsPredictor = new SportsPredictor();
    
    // Manejar eventos de visibilidad para pausar/reanudar actualizaciones
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            console.log('⏸️ Aplicación pausada');
        } else {
            console.log('▶️ Aplicación reanudada');
            window.sportsPredictor.updateLastUpdateTime();
        }
    });
});

// 🧹 Limpiar al cerrar la página
window.addEventListener('beforeunload', () => {
    if (window.sportsPredictor) {
        window.sportsPredictor.destroy();
    }
});

// 📱 Funciones adicionales para características avanzadas
class AdvancedAnalytics {
    // 📊 Análisis de tendencias históricas
    static analyzeHistoricalTrends(team1, team2) {
        // En producción: analizar encuentros previos, rendimiento en condiciones similares
        return {
            headToHead: {
                team1Wins: 5,
                team2Wins: 3,
                draws: 2,
                trend: 'Favorable para ' + team1
            },
            seasonalTrends: {
                team1Performance: 'En alza',
                team2Performance: 'Estable'
            }
        };
    }

    // 🌦️ Análisis de condiciones del partido
    static analyzeMatchConditions(matchData) {
        return {
            weather: 'Soleado, 22°C',
            pitch: 'Excelente',
            attendance: '95% capacidad',
            referee: {
                name: 'Antonio Mateu Lahoz',
                cardTendency: 'Estricto',
                experienceLevel: 'Alta'
            }
        };
    }

    // 💰 Análisis de valor de mercado
    static analyzeMarketValue(team1, team2) {
        return {
            team1Value: '€750M',
            team2Value: '€680M',
            keyPlayerValues: {
                team1: [
                    { name: 'Vinícius Jr.', value: '€100M' },
                    { name: 'Jude Bellingham', value: '€120M' }
                ],
                team2: [
                    { name: 'Pedri', value: '€90M' },
                    { name: 'Gavi', value: '€80M' }
                ]
            }
        };
    }
}

// 📈 Sistema de métricas de rendimiento
class PerformanceMetrics {
    constructor() {
        this.metrics = new Map();
        this.startTime = Date.now();
    }

    // ⏱️ Medir tiempo de análisis
    measureAnalysisTime(startTime) {
        const duration = Date.now() - startTime;
        this.metrics.set('analysisTime', duration);
        console.log(`⏱️ Tiempo de análisis: ${duration}ms`);
        return duration;
    }

    // 🎯 Medir precisión de pronósticos (implementar con datos reales)
    measureAccuracy(predictions, actualResults) {
        // En producción: comparar predicciones con resultados reales
        const accuracy = Math.random() * 20 + 75; // Simulado: 75-95%
        this.metrics.set('accuracy', accuracy);
        return accuracy;
    }

    // 📊 Obtener reporte de métricas
    getReport() {
        return {
            uptime: Date.now() - this.startTime,
            metrics: Object.fromEntries(this.metrics),
            memoryUsage: performance.memory ? {
                used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
                total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024)
            } : 'No disponible'
        };
    }
}

// Inicializar métricas globales
window.performanceMetrics = new PerformanceMetrics();

console.log(`
⚽ APLICACIÓN DE PRONÓSTICOS DEPORTIVOS INICIALIZADA ⚽
=======================================================
🚀 Funcionalidades habilitadas:
✅ Análisis estadístico en tiempo real
✅ Comparación ofensiva/defensiva
✅ Análisis de posesión de balón
✅ Evaluación de formaciones tácticas
✅ Monitoreo de lesiones y bajas
✅ Análisis de forma reciente (últimos 5 juegos)
✅ Evaluación de directores técnicos
✅ Sistema de predicción avanzado
✅ Actualizaciones automáticas cada 30 segundos
✅ Interfaz responsive y moderna

🔧 Configurado para zona horaria UTC-5 (Bogotá, Colombia)
📡 Listo para conectar con APIs de datos deportivos
📊 Sistema de métricas de rendimiento activado
=======================================================
`);
