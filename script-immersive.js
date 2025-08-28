// 🚀 Aplicación Ultra-Inmersiva de Pronósticos Deportivos
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
            'laliga': { id: 140, name: 'La Liga EA Sports', country: 'Spain', season: 2025, flag: '🇪🇸' },
            'premier': { id: 39, name: 'Premier League', country: 'England', season: 2025, flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
            'fpc': { id: 239, name: 'Liga BetPlay I', country: 'Colombia', season: 2025, flag: '🇨🇴' }
        };
        
        this.init();
    }

    // 🔧 Inicialización inmersiva
    async init() {
        this.initParticles();
        this.initSounds();
        this.setupAdvancedEventListeners();
        this.initTheme();
        this.initUserProgress();
        this.initVoiceRecognition();
        this.startImmersiveUpdates();
        
        // Efectos de carga
        await this.showWelcomeAnimation();
        
        console.log('🎮 Aplicación ultra-inmersiva inicializada');
    }

    // ✨ Inicializar partículas
    initParticles() {
        if (typeof particlesJS !== 'undefined') {
            particlesJS('particles-js', {
                particles: {
                    number: { value: 80, density: { enable: true, value_area: 800 } },
                    color: { value: '#00ff88' },
                    shape: { type: 'circle' },
                    opacity: { value: 0.5, random: false },
                    size: { value: 3, random: true },
                    line_linked: {
                        enable: true,
                        distance: 150,
                        color: '#00ff88',
                        opacity: 0.4,
                        width: 1
                    },
                    move: {
                        enable: true,
                        speed: 2,
                        direction: 'none',
                        random: false,
                        straight: false,
                        out_mode: 'out',
                        bounce: false
                    }
                },
                interactivity: {
                    detect_on: 'canvas',
                    events: {
                        onhover: { enable: true, mode: 'repulse' },
                        onclick: { enable: true, mode: 'push' },
                        resize: true
                    }
                },
                retina_detect: true
            });
        }
    }

    // 🔊 Inicializar sonidos
    initSounds() {
        this.sounds.click = document.getElementById('clickSound');
        this.sounds.success = document.getElementById('successSound');
        
        // Crear contexto de audio
        if ('AudioContext' in window || 'webkitAudioContext' in window) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    // 🎵 Reproducir sonido
    playSound(soundName, volume = 0.5) {
        if (this.sounds[soundName]) {
            this.sounds[soundName].volume = volume;
            this.sounds[soundName].play().catch(() => {
                // Silenciosamente fallar si no se puede reproducir
            });
        }
    }

    // 📱 Event listeners avanzados
    setupAdvancedEventListeners() {
        // Botones principales
        document.getElementById('analyzeBtn').addEventListener('click', (e) => {
            this.handleButtonClick(e);
            this.analyzeMatchImmersive();
        });

        // Toggle de tema
        document.getElementById('themeToggle').addEventListener('click', (e) => {
            this.handleButtonClick(e);
            this.toggleTheme();
        });

        // Slider de IA
        document.getElementById('aiLevel').addEventListener('input', (e) => {
            this.aiLevel = parseInt(e.target.value);
            this.updateAiLevelDisplay();
        });

        // Búsqueda por voz
        document.getElementById('voiceSearch').addEventListener('click', (e) => {
            this.handleButtonClick(e);
            this.toggleVoiceSearch();
        });

        // Botón de batalla animada
        document.addEventListener('click', (e) => {
            if (e.target.id === 'animateBattle') {
                this.handleButtonClick(e);
                this.animateStatsBattle();
            }
            
            if (e.target.id === 'simulateMatch') {
                this.handleButtonClick(e);
                this.simulateMatch();
            }
        });

        // Efectos hover para tarjetas
        this.setupHoverEffects();
        
        // Gestos táctiles
        this.setupTouchGestures();
        
        // Atajos de teclado
        this.setupKeyboardShortcuts();
    }

    // 🖱️ Manejar clics con efectos
    handleButtonClick(event) {
        this.playSound('click', 0.3);
        this.createRippleEffect(event.target, event);
        this.addButtonFeedback(event.target);
    }

    // 🌊 Crear efecto ripple
    createRippleEffect(button, event) {
        const ripple = document.createElement('div');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.className = 'btn-ripple';
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        
        button.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    // 💫 Feedback de botón
    addButtonFeedback(button) {
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = '';
        }, 150);
    }

    // 🎨 Toggle de tema
    toggleTheme() {
        this.theme = this.theme === 'dark' ? 'light' : 'dark';
        document.body.setAttribute('data-theme', this.theme);
        
        const icon = document.querySelector('#themeToggle i');
        icon.className = this.theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        
        // Efecto de transición
        document.body.style.transition = 'all 0.5s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 500);
        
        this.showToast(`Tema ${this.theme === 'dark' ? 'oscuro' : 'claro'} activado`, 'info');
    }

    // 🏆 Sistema de progreso del usuario
    initUserProgress() {
        const saved = localStorage.getItem('sportsPredictor_progress');
        if (saved) {
            const progress = JSON.parse(saved);
            this.userScore = progress.score || 0;
            this.userLevel = progress.level || 1;
        }
        this.updateUserProgress();
    }

    updateUserProgress() {
        document.getElementById('userScore').textContent = this.userScore;
        document.getElementById('userLevel').textContent = this.userLevel;
        
        const progressPercent = (this.userScore % 1000) / 1000 * 100;
        document.getElementById('progressFill').style.width = progressPercent + '%';
        
        // Guardar progreso
        localStorage.setItem('sportsPredictor_progress', JSON.stringify({
            score: this.userScore,
            level: this.userLevel
        }));
    }

    addScore(points) {
        this.userScore += points;
        const newLevel = Math.floor(this.userScore / 1000) + 1;
        
        if (newLevel > this.userLevel) {
            this.userLevel = newLevel;
            this.showLevelUpAnimation();
        }
        
        this.updateUserProgress();
        this.playSound('success', 0.4);
    }

    // 🎆 Animación de subida de nivel
    showLevelUpAnimation() {
        const modal = document.createElement('div');
        modal.className = 'level-up-modal';
        modal.innerHTML = `
            <div class="level-up-content">
                <div class="level-up-effect">
                    <i class="fas fa-trophy"></i>
                </div>
                <h2>¡Nivel ${this.userLevel} Desbloqueado!</h2>
                <p>Has ganado nuevas funcionalidades</p>
                <button onclick="this.parentElement.parentElement.remove()">Continuar</button>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        setTimeout(() => {
            modal.remove();
        }, 5000);
    }

    // 🎤 Reconocimiento de voz
    initVoiceRecognition() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            this.recognition.continuous = false;
            this.recognition.interimResults = false;
            this.recognition.lang = 'es-ES';
            
            this.recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                document.getElementById('teamSearch').value = transcript;
                this.showToast(`Búsqueda por voz: "${transcript}"`, 'success');
                this.analyzeMatchImmersive();
            };
            
            this.recognition.onerror = () => {
                this.showToast('Error en reconocimiento de voz', 'error');
                this.stopVoiceSearch();
            };
        }
    }

    toggleVoiceSearch() {
        if (!this.recognition) {
            this.showToast('Reconocimiento de voz no disponible', 'warning');
            return;
        }
        
        if (this.isVoiceEnabled) {
            this.stopVoiceSearch();
        } else {
            this.startVoiceSearch();
        }
    }

    startVoiceSearch() {
        this.isVoiceEnabled = true;
        const voiceBtn = document.getElementById('voiceSearch');
        voiceBtn.classList.add('listening');
        voiceBtn.innerHTML = '<i class="fas fa-microphone-slash"></i>';
        
        this.recognition.start();
        this.showToast('Habla ahora...', 'info');
    }

    stopVoiceSearch() {
        this.isVoiceEnabled = false;
        const voiceBtn = document.getElementById('voiceSearch');
        voiceBtn.classList.remove('listening');
        voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
        
        if (this.recognition) {
            this.recognition.stop();
        }
    }

    // 🎯 Análisis inmersivo
    async analyzeMatchImmersive() {
        const searchTerm = document.getElementById('teamSearch').value.trim();
        if (!searchTerm) {
            this.showToast('⚠️ Ingresa los nombres de los equipos', 'warning');
            return;
        }

        this.showAiThinking(true);
        this.showImmersiveLoading();
        
        try {
            // Simular análisis avanzado con IA
            await this.simulateAiAnalysis();
            
            // Buscar partido real
            const fixture = await this.findMatchByTeams(searchTerm);
            if (!fixture) {
                throw new Error('Partido no encontrado en las ligas disponibles');
            }

            const matchData = await this.getDetailedMatchData(fixture);
            this.currentMatch = matchData;
            
            // Actualizar interfaz con efectos
            await this.updateMatchInterfaceImmersive(matchData);
            
            // Realizar análisis completo
            const analysis = await this.performAdvancedAnalysis(matchData);
            
            // Actualizar todas las visualizaciones
            await this.updateAllVisualizations(analysis);
            
            // Generar pronóstico final
            const prediction = await this.generateImmersivePrediction(analysis);
            await this.showFinalPrediction(prediction);
            
            // Agregar puntos al usuario
            this.addScore(50);
            
            this.showToast('✅ Análisis completado con éxito', 'success');
            
        } catch (error) {
            console.error('❌ Error en análisis inmersivo:', error);
            this.showToast(error.message, 'error');
        } finally {
            this.showAiThinking(false);
            this.hideImmersiveLoading();
        }
    }

    // 🤖 Simular análisis de IA
    async simulateAiAnalysis() {
        const steps = [
            'Conectando con API deportiva...',
            'Analizando datos históricos...',
            'Procesando estadísticas avanzadas...',
            'Calculando probabilidades...',
            'Generando insights con IA...',
            'Finalizando predicción...'
        ];
        
        for (let i = 0; i < steps.length; i++) {
            await this.delay(800);
            this.updateLoadingStep(steps[i], (i + 1) / steps.length * 100);
        }
    }

    // 📊 Actualizar todas las visualizaciones
    async updateAllVisualizations(analysis) {
        // Actualizar orbe de predicción
        this.updatePredictionOrb(analysis.confidence);
        
        // Actualizar batalla de estadísticas
        this.updateStatsBattle(analysis);
        
        // Actualizar radar chart
        this.updateRadarChart(analysis);
        
        // Actualizar mapa de calor
        this.updateHeatMap(analysis);
        
        // Actualizar timeline de forma
        this.updateFormTimeline(analysis);
        
        // Actualizar ruedas de probabilidad
        this.updateProbabilityWheels(analysis);
        
        // Actualizar factores de impacto
        this.updateImpactFactors(analysis);
    }

    // 🔮 Actualizar orbe de predicción
    updatePredictionOrb(confidence) {
        const orb = document.getElementById('predictionOrb');
        const ring = document.getElementById('confidenceRing');
        const percent = document.getElementById('confidencePercent');
        const text = document.getElementById('predictionText');
        
        // Animación del orbe
        orb.style.transform = 'scale(1.1)';
        setTimeout(() => {
            orb.style.transform = 'scale(1)';
        }, 500);
        
        // Actualizar anillo de progreso
        const circumference = 2 * Math.PI * 40;
        const offset = circumference - (confidence / 100) * circumference;
        ring.style.strokeDashoffset = offset;
        
        // Actualizar texto
        percent.textContent = confidence + '%';
        text.textContent = this.getConfidenceText(confidence);
    }

    getConfidenceText(confidence) {
        if (confidence >= 80) return 'Muy Probable';
        if (confidence >= 60) return 'Probable';
        if (confidence >= 40) return 'Incierto';
        return 'Poco Probable';
    }

    // ⚔️ Animar batalla de estadísticas
    async animateStatsBattle() {
        const homeAttack = Math.random() * 100;
        const awayAttack = Math.random() * 100;
        const homeDefense = Math.random() * 100;
        const awayDefense = Math.random() * 100;
        const homeForm = Math.random() * 100;
        const awayForm = Math.random() * 100;
        
        // Animar barras secuencialmente
        await this.animateStatBar('homeAttackBar', homeAttack);
        await this.delay(200);
        await this.animateStatBar('awayAttackBar', awayAttack);
        await this.delay(200);
        await this.animateStatBar('homeDefenseBar', homeDefense);
        await this.delay(200);
        await this.animateStatBar('awayDefenseBar', awayDefense);
        await this.delay(200);
        await this.animateStatBar('homeFormBar', homeForm);
        await this.delay(200);
        await this.animateStatBar('awayFormBar', awayForm);
        
        this.showToast('⚔️ Batalla de estadísticas completada', 'success');
    }

    async animateStatBar(id, value) {
        const bar = document.getElementById(id);
        if (bar) {
            bar.style.width = '0%';
            await this.delay(100);
            bar.style.width = value + '%';
        }
    }

    // 📈 Actualizar radar chart
    updateRadarChart(analysis) {
        const canvas = document.getElementById('radarChart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        
        // Crear gráfico con Chart.js si está disponible
        if (typeof Chart !== 'undefined') {
            new Chart(ctx, {
                type: 'radar',
                data: {
                    labels: ['Ataque', 'Defensa', 'Posesión', 'Forma', 'Experiencia', 'Casa'],
                    datasets: [{
                        label: 'Equipo Local',
                        data: [85, 75, 80, 70, 90, 85],
                        backgroundColor: 'rgba(0, 102, 255, 0.2)',
                        borderColor: 'rgba(0, 102, 255, 1)',
                        pointBackgroundColor: 'rgba(0, 102, 255, 1)',
                    }, {
                        label: 'Equipo Visitante',
                        data: [70, 85, 75, 85, 80, 60],
                        backgroundColor: 'rgba(255, 51, 102, 0.2)',
                        borderColor: 'rgba(255, 51, 102, 1)',
                        pointBackgroundColor: 'rgba(255, 51, 102, 1)',
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: { position: 'bottom' }
                    },
                    scales: {
                        r: {
                            beginAtZero: true,
                            max: 100,
                            grid: { color: 'rgba(255, 255, 255, 0.1)' },
                            angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
                            pointLabels: { color: '#ffffff' }
                        }
                    }
                }
            });
        }
    }

    // 🔥 Actualizar mapa de calor
    updateHeatMap(analysis) {
        const zones = document.querySelectorAll('.zone');
        zones.forEach((zone, index) => {
            const intensity = 0.3 + (Math.random() * 0.7);
            zone.style.setProperty('--intensity', intensity);
            
            // Efecto de pulso para zonas activas
            if (intensity > 0.7) {
                zone.style.animation = 'pulse 2s infinite';
            }
        });
    }

    // 🕒 Actualizar timeline de forma
    updateFormTimeline(analysis) {
        const timeline = document.getElementById('formTimeline');
        if (!timeline) return;
        
        const homeForm = ['W', 'L', 'W', 'W', 'D'];
        const awayForm = ['W', 'W', 'D', 'L', 'W'];
        
        timeline.innerHTML = `
            <div class="timeline-team">
                <h4>Local</h4>
                <div class="timeline-matches">
                    ${homeForm.map((result, i) => `
                        <div class="timeline-match ${result.toLowerCase()}" 
                             data-opponent="Equipo ${i+1}" 
                             style="animation-delay: ${i * 0.1}s">
                            ${result}
                        </div>
                    `).join('')}
                </div>
            </div>
            <div class="timeline-team">
                <h4>Visitante</h4>
                <div class="timeline-matches">
                    ${awayForm.map((result, i) => `
                        <div class="timeline-match ${result.toLowerCase()}" 
                             data-opponent="Equipo ${i+1}" 
                             style="animation-delay: ${i * 0.1}s">
                            ${result}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    // 🎯 Simular partido
    async simulateMatch() {
        const result = document.getElementById('simulationResult');
        result.classList.remove('show');
        
        await this.delay(500);
        
        const homeScore = Math.floor(Math.random() * 4);
        const awayScore = Math.floor(Math.random() * 4);
        
        // Generar eventos del partido
        const events = this.generateMatchEvents(homeScore, awayScore);
        
        // Mostrar resultado
        result.querySelector('.home-score').textContent = homeScore;
        result.querySelector('.away-score').textContent = awayScore;
        
        const eventsContainer = document.getElementById('matchEvents');
        eventsContainer.innerHTML = events.map(event => `
            <div class="event-item">
                <span class="event-time">${event.time}'</span>
                <i class="fas ${event.icon}"></i>
                <span class="event-text">${event.text}</span>
            </div>
        `).join('');
        
        result.classList.add('show');
        
        // Agregar puntos por simulación
        this.addScore(25);
        this.showToast('🎮 Simulación completada', 'success');
    }

    generateMatchEvents(homeScore, awayScore) {
        const events = [];
        const totalGoals = homeScore + awayScore;
        
        for (let i = 0; i < totalGoals; i++) {
            const isHome = i < homeScore;
            const minute = Math.floor(Math.random() * 90) + 1;
            
            events.push({
                time: minute,
                icon: 'fa-futbol',
                text: `Gol del equipo ${isHome ? 'local' : 'visitante'}`
            });
        }
        
        // Agregar eventos adicionales
        if (Math.random() > 0.5) {
            events.push({
                time: Math.floor(Math.random() * 90) + 1,
                icon: 'fa-square',
                text: 'Tarjeta amarilla'
            });
        }
        
        return events.sort((a, b) => a.time - b.time);
    }

    // 🎡 Actualizar ruedas de probabilidad
    updateProbabilityWheels(analysis) {
        const homeProb = 45 + Math.floor(Math.random() * 20);
        const awayProb = 30 + Math.floor(Math.random() * 20);
        const drawProb = 100 - homeProb - awayProb;
        
        this.animateProbabilityWheel('home', homeProb);
        this.animateProbabilityWheel('away', awayProb);
        this.animateProbabilityWheel('draw', drawProb);
    }

    animateProbabilityWh
