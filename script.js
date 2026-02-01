/**
 * Main Script - Portfolio Orchestrator
 * Coordinates Terminal and Static modes
 * 
 * To update portfolio content, edit data.json - no need to touch this file!
 */

// ========================================
// DATA - Loaded from data.json
// ========================================
let portfolioData = null;

const loadPortfolioData = async () => {
    try {
        const response = await fetch('data.json');
        const data = await response.json();

        // Transform data.json format to match expected format
        portfolioData = {
            profile: data.profile,
            projects: data.projects.map(p => ({
                name: p.name,
                desc: p.description,
                link: p.link,
                tech: p.tech,
                highlights: p.highlights
            })),
            experience: data.experience.map(e => ({
                date: e.period,
                title: e.title,
                company: e.company,
                desc: e.highlights.join(' '),
                highlights: e.highlights,
                location: e.location
            })),
            education: data.education,
            skills: data.skills,
            socials: data.socials
        };

        console.log('Portfolio data loaded successfully');
        return portfolioData;
    } catch (error) {
        console.error('Failed to load data.json:', error);
        // Fallback data
        portfolioData = {
            profile: { name: 'Abhijit Rayarao', role: 'Software Engineer', intro: 'Building production applications.' },
            projects: [],
            experience: [],
            skills: { languages: [], frameworks: [], databases: [] },
            socials: []
        };
        return portfolioData;
    }
};

// ========================================
// BOOT SEQUENCES
// ========================================
const bootSequences = {
    arch: [
        { text: ":: Synchronizing package databases...", delay: 100 },
        { text: "[  OK  ] Started systemd-journald.service.", delay: 80 },
        { text: "[  OK  ] Started systemd-udevd.service.", delay: 100 },
        { text: "[  OK  ] Reached target Local File Systems.", delay: 150 },
        { text: "[  OK  ] Started User Manager for UID 1000.", delay: 200 },
        { text: "[  OK  ] Started Alacritty Terminal.", delay: 150 },
        { text: "", delay: 100 },
        { text: "Arch Linux 6.7.0-arch1-1 (tty1)", delay: 300 },
        { text: "", delay: 100 },
        { text: "Loading Zsh...", delay: 400 },
        { text: "Initializing Powerlevel10k...", delay: 500 },
        { text: "Done.", delay: 200 }
    ],
    ubuntu: [
        { text: "[    0.000000] Linux version 6.5.0-generic", delay: 50 },
        { text: "[  OK  ] Started Network Manager.", delay: 120 },
        { text: "[  OK  ] Started OpenSSH server.", delay: 100 },
        { text: "[  OK  ] Reached target Graphical Interface.", delay: 150 },
        { text: "", delay: 100 },
        { text: "Ubuntu 24.04 LTS abhijit-pc tty1", delay: 300 },
        { text: "", delay: 100 },
        { text: "Loading Zsh...", delay: 400 },
        { text: "Initializing Powerlevel10k...", delay: 500 },
        { text: "Done.", delay: 200 }
    ],
    minimal: [
        { text: "init: starting system...", delay: 100 },
        { text: "init: mounting filesystems... [OK]", delay: 150 },
        { text: "init: network... [OK]", delay: 120 },
        { text: "init: starting user services...", delay: 200 },
        { text: "", delay: 100 },
        { text: "Welcome to portfolio-os v2.0", delay: 300 },
        { text: "", delay: 100 },
        { text: "Loading shell...", delay: 400 },
        { text: "Done.", delay: 200 }
    ]
};

// ========================================
// UTILITY FUNCTIONS
// ========================================
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

const typeText = async (element, text, speed = 30) => {
    return new Promise(resolve => {
        let i = 0;
        const interval = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(interval);
                resolve();
            }
        }, speed);
    });
};

// ========================================
// TERMINAL MODE FUNCTIONS
// ========================================
let terminalInstance = null;
let startTime = Date.now();
let commandHistory = [];
let historyIndex = -1;

const runBootSequence = async () => {
    const startupSequence = document.getElementById('startup-sequence');
    const terminalOutput = document.getElementById('terminal-output');
    const activePrompt = document.getElementById('active-prompt');
    const terminalView = document.getElementById('terminal-view');

    if (!startupSequence || !terminalView) return;

    // Hide prompt during boot
    if (activePrompt) activePrompt.style.display = 'none';

    // Clear and show startup
    startupSequence.innerHTML = '';
    startupSequence.classList.remove('hidden');

    // Pick random boot sequence
    const types = Object.keys(bootSequences);
    const selectedType = types[Math.floor(Math.random() * types.length)];
    const sequence = bootSequences[selectedType];

    // Display boot logs
    for (const log of sequence) {
        const line = document.createElement('div');
        line.className = 'log-line';

        if (log.text.includes('[  OK  ]')) {
            line.innerHTML = `<span class="log-ok">[  OK  ]</span>${log.text.replace('[  OK  ]', '')}`;
        } else if (log.text.includes('[OK]')) {
            line.innerHTML = log.text.replace('[OK]', '<span class="log-ok">[OK]</span>');
        } else {
            line.textContent = log.text;
        }

        startupSequence.appendChild(line);
        terminalView.scrollTop = terminalView.scrollHeight;
        await sleep(log.delay);
    }

    // Clear boot and show intro
    await sleep(500);
    startupSequence.innerHTML = '';
    startupSequence.classList.add('hidden');

    // Show prompt
    if (activePrompt) activePrompt.style.display = 'flex';

    // Run intro
    await runTerminalIntro();

    // Initialize terminal input
    initTerminalInput();
};

const runTerminalIntro = async () => {
    const terminalOutput = document.getElementById('terminal-output');
    if (!terminalOutput) return;

    terminalOutput.innerHTML = '';

    const introContainer = document.createElement('div');
    introContainer.className = 'intro-section';
    terminalOutput.appendChild(introContainer);

    const lines = [
        `hi, i'm ${portfolioData.profile.name.toLowerCase()}`,
        "full-stack developer • react • next.js • ai/ml • webrtc"
    ];

    for (const line of lines) {
        const p = document.createElement('div');
        p.className = 'intro-line';
        introContainer.appendChild(p);
        await typeText(p, line, 50);
        await sleep(300);
    }

    // Add hint
    const hint = document.createElement('div');
    hint.className = 'intro-hint';
    hint.innerHTML = '<span class="hint-text">Type <span class="hint-cmd">help</span> to see available commands</span>';
    terminalOutput.appendChild(hint);

    terminalOutput.appendChild(document.createElement('br'));
};

const initTerminalInput = () => {
    const terminalView = document.getElementById('terminal-view');
    const inputText = document.getElementById('input-text');

    if (!terminalView || !inputText) return;

    // Focus terminal
    terminalView.tabIndex = 0;
    terminalView.focus();

    let currentInput = '';

    terminalView.addEventListener('keydown', async (e) => {
        // Ignore if not in terminal mode
        if (!terminalView.classList.contains('hidden') === false) return;

        if (e.key === 'Enter') {
            e.preventDefault();
            const command = currentInput.trim();
            if (command) {
                commandHistory.push(command);
                historyIndex = commandHistory.length;
                await executeCommand(command);
            }
            currentInput = '';
            inputText.textContent = '';
        } else if (e.key === 'Backspace') {
            e.preventDefault();
            currentInput = currentInput.slice(0, -1);
            inputText.textContent = currentInput;
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (historyIndex > 0) {
                historyIndex--;
                currentInput = commandHistory[historyIndex] || '';
                inputText.textContent = currentInput;
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex < commandHistory.length - 1) {
                historyIndex++;
                currentInput = commandHistory[historyIndex] || '';
            } else {
                historyIndex = commandHistory.length;
                currentInput = '';
            }
            inputText.textContent = currentInput;
        } else if (e.key === 'Tab') {
            e.preventDefault();
            // Autocomplete
            const completions = ['help', 'clear', 'whoami', 'ls', 'cd', 'cat', 'neofetch', 'wget', 'journalctl', 'sudo'];
            const match = completions.find(c => c.startsWith(currentInput) && c !== currentInput);
            if (match) {
                currentInput = match + ' ';
                inputText.textContent = currentInput;
            }
        } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
            currentInput += e.key;
            inputText.textContent = currentInput;
        }

        terminalView.scrollTop = terminalView.scrollHeight;
    });

    // Click to focus
    terminalView.addEventListener('click', () => terminalView.focus());
};

const executeCommand = async (command) => {
    const terminalOutput = document.getElementById('terminal-output');
    const terminalView = document.getElementById('terminal-view');

    // Add executed command prompt
    const promptLine = createPromptLine(command);
    terminalOutput.appendChild(promptLine);

    // Execute command
    const result = await processCommand(command);

    if (result) {
        const output = document.createElement('div');
        output.className = 'terminal-output';
        output.innerHTML = result;
        terminalOutput.appendChild(output);
    }

    terminalOutput.appendChild(document.createElement('br'));
    terminalView.scrollTop = terminalView.scrollHeight;
};

const createPromptLine = (command) => {
    const line = document.createElement('div');
    line.className = 'prompt-line executed';
    line.innerHTML = `
        <div class="p10k-segment os-icon"><i class="fab fa-linux"></i></div>
        <div class="p10k-arrow os-arrow"></div>
        <div class="p10k-segment dir-icon"></div>
        <div class="p10k-segment dir-text">~/portfolio</div>
        <div class="p10k-arrow dir-arrow"></div>
        <div class="p10k-segment git-icon"><i class="fas fa-code-branch"></i></div>
        <div class="p10k-segment git-text">main</div>
        <div class="p10k-arrow git-arrow"></div>
        <div class="command-input">
            <span class="input-text">${command}</span>
        </div>
    `;
    return line;
};

const processCommand = async (cmd) => {
    const parts = cmd.trim().split(' ');
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    switch (command) {
        case 'help':
            return `<div class="help-output">
<span class="help-header">Available Commands:</span>

  <span class="cmd-name">help</span>              <span class="cmd-desc">Show this help message</span>
  <span class="cmd-name">clear</span>             <span class="cmd-desc">Clear the terminal</span>
  <span class="cmd-name">whoami</span>            <span class="cmd-desc">Professional summary + tech stack</span>
  <span class="cmd-name">ls</span> <span class="cmd-arg">[dir]</span>         <span class="cmd-desc">List directory contents</span>
  <span class="cmd-name">cat README.md</span>     <span class="cmd-desc">Project details with problem/decisions/outcome</span>
  <span class="cmd-name">neofetch</span>          <span class="cmd-desc">ASCII art + system info</span>
  <span class="cmd-name">wget resume.pdf</span>   <span class="cmd-desc">Download my resume</span>
  <span class="cmd-name">journalctl -u growth</span>  <span class="cmd-desc">Learning timeline</span>
  <span class="cmd-name">sudo hire me</span>      <span class="cmd-desc">Confetti + hiring message 🎉</span>
  <span class="cmd-name">rm -rf /</span>          <span class="cmd-desc">Glitch effect + recovery 💥</span>

<span class="help-tip">Tip: Use ↑/↓ for history, Tab for autocomplete</span>
</div>`;

        case 'clear':
            const terminalOutput = document.getElementById('terminal-output');
            const terminalView = document.getElementById('terminal-view');
            terminalOutput.innerHTML = '';
            // CRT flash effect
            terminalView.classList.add('crt-flash');
            setTimeout(() => terminalView.classList.remove('crt-flash'), 150);
            return null;

        case 'whoami':
            return `<div class="whoami-output">
<span class="whoami-name">${portfolioData.profile.name}</span>
<span class="whoami-role">${portfolioData.profile.role}</span>

${portfolioData.profile.intro}

<span class="whoami-section">Tech Stack:</span>
${Object.values(portfolioData.skills).flat().map(s => `<span class="tech-tag">${s}</span>`).join(' ')}

<span class="whoami-section">Currently Building:</span>
AI-powered sports analytics for cricket coaching

<span class="whoami-contact">
<i class="fab fa-github"></i> github.com/Abhijit808
<i class="fab fa-linkedin"></i> linkedin.com/in/abhijit-rayarao
</span>
</div>`;

        case 'ls':
            const dir = args[0] || '.';
            if (dir === '.' || dir === 'projects' || dir === 'projects/') {
                return `<div class="ls-output">
${portfolioData.projects.map(p => `<span class="ls-dir"><i class="fas fa-folder"></i> ${p.name}</span>`).join('\n')}
</div>`;
            }
            return `<span class="error">ls: cannot access '${dir}': No such directory</span>`;

        case 'cat':
            const file = args.join(' ');
            if (file === 'README.md' || file === 'readme.md') {
                return `<div class="readme-output">
<span class="readme-header"># ${portfolioData.profile.name}'s Portfolio</span>

${portfolioData.profile.intro}

## Projects
${portfolioData.projects.map(p => `- **${p.name}**: ${p.desc}`).join('\n')}

## Contact
${portfolioData.socials.map(s => `- ${s.name}: ${s.link}`).join('\n')}
</div>`;
            }
            return `<span class="error">cat: ${file || 'missing operand'}: No such file</span>`;

        case 'neofetch':
            return `<div class="neofetch-output">
<pre class="ascii-art">
<span class="ascii-color-1">    █████╗ ██████╗ </span>
<span class="ascii-color-1">   ██╔══██╗██╔══██╗</span>
<span class="ascii-color-2">   ███████║██████╔╝</span>
<span class="ascii-color-2">   ██╔══██║██╔══██╗</span>
<span class="ascii-color-3">   ██║  ██║██║  ██║</span>
<span class="ascii-color-3">   ╚═╝  ╚═╝╚═╝  ╚═╝</span>
</pre>
<div class="neofetch-info">
<span class="nf-label">Name:</span> <span class="nf-value">${portfolioData.profile.name}</span>
<span class="nf-label">Role:</span> <span class="nf-value">${portfolioData.profile.role}</span>
<span class="nf-label">Shell:</span> <span class="nf-value">Zsh + Powerlevel10k</span>
<span class="nf-label">Terminal:</span> <span class="nf-value">Alacritty</span>
<span class="nf-label">Stack:</span> <span class="nf-value">NestJS • Next.js • Docker</span>
<span class="nf-label">Focus:</span> <span class="nf-value">Data Science • ML/AI</span>
<span class="nf-label">Uptime:</span> <span class="nf-value">${Math.floor((Date.now() - startTime) / 60000)} mins</span>
</div>
</div>`;

        case 'wget':
            if (args[0] === 'resume.pdf') {
                return `<div class="wget-output">
--2024-01-01 12:00:00--  https://abhijit.dev/resume.pdf
Resolving abhijit.dev... done.
Connecting to abhijit.dev|443|... connected.
HTTP request sent, awaiting response... 200 OK
Length: 142857 (140K) [application/pdf]
Saving to: 'resume.pdf'

resume.pdf      100%[========>] 140K  --.-KB/s    in 0.1s

<span class="wget-success">'resume.pdf' saved</span>
</div>`;
            }
            return `<span class="error">wget: missing URL</span>`;

        case 'journalctl':
            if (args.join(' ') === '-u growth') {
                return `<div class="journal-output">
<span class="journal-header">-- Growth journal entries --</span>

<div class="journal-entry">
<span class="journal-date">2024-01</span>
<span class="journal-tag learned">LEARNED</span> Computer Vision for sports analytics
</div>

<div class="journal-entry">
<span class="journal-date">2023-06</span>
<span class="journal-tag built">BUILT</span> First production Next.js application
</div>

<div class="journal-entry">
<span class="journal-date">2022-09</span>
<span class="journal-tag started">STARTED</span> Full-stack development with MERN
</div>

<span class="journal-footer">-- End of journal --</span>
</div>`;
            }
            return `<span class="error">journalctl: invalid option</span>`;

        case 'sudo':
            if (args.join(' ') === 'hire me') {
                // Trigger confetti
                triggerConfetti();
                return `<div class="hire-me-output">
<span class="hire-header">🎉 sudo: hire successful!</span>

<span class="hire-text">Thanks for considering me!</span>

<span class="hire-success">✓ Available for full-time opportunities</span>
<span class="hire-success">✓ Open to interesting projects</span>
<span class="hire-success">✓ Remote-friendly</span>

<span class="hire-cta">📧 Let's connect: <a href="mailto:abhijit@example.com">abhijit@example.com</a></span>
</div>`;
            }
            return `<span class="error">[sudo] password for abhijit:</span>`;

        case 'rm':
            if (args[0] === '-rf' && args[1] === '/') {
                // Glitch effect
                triggerGlitch();
                await sleep(1000);
                return `<div class="recovery-output">
<span class="recovery-header">⚠️ System Recovery Mode</span>
Just kidding! This is a safe portfolio environment.
<span class="recovery-hint">Try 'help' for actual commands.</span>
</div>`;
            }
            return `<span class="error">rm: missing operand</span>`;

        default:
            return `<span class="error">zsh: command not found: ${command}</span>
<span style="color: #666">Type 'help' for available commands</span>`;
    }
};

// ========================================
// EFFECTS
// ========================================
const triggerConfetti = () => {
    const container = document.createElement('div');
    container.className = 'confetti-container';
    document.body.appendChild(container);

    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.animationDelay = Math.random() * 2 + 's';
        confetti.style.backgroundColor = ['#b5bd68', '#f0c674', '#81a2be', '#b294bb', '#8abeb7'][Math.floor(Math.random() * 5)];
        container.appendChild(confetti);
    }

    setTimeout(() => container.remove(), 5000);
};

const triggerGlitch = () => {
    const overlay = document.createElement('div');
    overlay.className = 'glitch-overlay';
    document.body.appendChild(overlay);
    setTimeout(() => overlay.remove(), 500);
};

// ========================================
// STATUS BAR
// ========================================
const updateStatusBar = () => {
    const cpuStat = document.getElementById('cpu-stat');
    const memStat = document.getElementById('mem-stat');
    const uptimeStat = document.getElementById('uptime-stat');
    const promptCpu = document.getElementById('prompt-cpu');
    const promptUptime = document.getElementById('prompt-uptime');

    const cpu = 8 + Math.floor(Math.random() * 15);
    const cpuText = cpu + '%';

    if (cpuStat) cpuStat.textContent = cpuText;
    if (promptCpu) promptCpu.textContent = cpuText;

    if (memStat) {
        const mem = (1.8 + Math.random() * 0.8).toFixed(1);
        memStat.textContent = mem + 'G';
    }

    const mins = Math.floor((Date.now() - startTime) / 60000);
    const hrs = Math.floor(mins / 60);
    const uptimeText = hrs > 0 ? `${hrs}:${(mins % 60).toString().padStart(2, '0')}` : `0:${mins.toString().padStart(2, '0')}`;

    if (uptimeStat) uptimeStat.textContent = uptimeText;
    if (promptUptime) promptUptime.textContent = uptimeText;
};

// ========================================
// CLOCK
// ========================================
const updateClock = () => {
    const clock = document.getElementById('clock');
    if (clock) {
        const now = new Date();
        clock.textContent = now.toLocaleTimeString('en-US', { hour12: false });
    }
};

// ========================================
// THEME TOGGLE
// ========================================
const initThemeToggle = () => {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        const icon = themeToggle.querySelector('i');
        if (document.body.classList.contains('light-theme')) {
            icon.className = 'fas fa-moon';
        } else {
            icon.className = 'fas fa-sun';
        }
    });
};

// ========================================
// SPARK EFFECT
// ========================================
const createSpark = (e) => {
    const target = e.target.closest('.project-card, .skill-tag, .shutdown-btn, .static-card, .contact-card');
    if (!target) return;

    const spark = document.createElement('div');
    spark.className = 'spark';
    spark.textContent = ['+', '*', '.', 'x'][Math.floor(Math.random() * 4)];

    const rect = target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    spark.style.left = `${x}px`;
    spark.style.top = `${y}px`;

    const angle = Math.random() * Math.PI * 2;
    const velocity = 20 + Math.random() * 30;
    spark.style.setProperty('--tx', `${Math.cos(angle) * velocity}px`);
    spark.style.setProperty('--ty', `${Math.sin(angle) * velocity}px`);

    target.appendChild(spark);
    setTimeout(() => spark.remove(), 800);
};

const initSparkEffects = () => {
    document.addEventListener('mousemove', (e) => {
        if (e.target.closest('.project-card, .skill-tag, .shutdown-btn, .static-card, .contact-card')) {
            if (Math.random() > 0.85) createSpark(e);
        }
    });
};

// ========================================
// SHUTDOWN
// ========================================
const initShutdown = () => {
    const shutdownBtns = document.querySelectorAll('.shutdown-btn');

    shutdownBtns.forEach(btn => {
        btn.addEventListener('click', async () => {
            const alacrittyWindow = document.querySelector('.alacritty-window');
            const container = btn.closest('.terminal-content, .static-content');

            if (container) {
                container.innerHTML = '<div class="log-line">Stopping User Manager...</div>';
                await sleep(400);
                container.innerHTML += '<div class="log-line">Stopping Graphical Interface...</div>';
                await sleep(400);
                container.innerHTML += '<div class="log-line">Unmounting filesystems...</div>';
                await sleep(400);
                container.innerHTML += '<div class="log-line">System halting.</div>';
            }

            await sleep(1000);

            alacrittyWindow.style.opacity = '0';
            alacrittyWindow.style.transform = 'scale(0.9)';
            alacrittyWindow.style.transition = 'all 0.5s ease';

            await sleep(500);
            document.body.style.backgroundColor = '#000';
            document.querySelector('.crt-overlay').style.display = 'none';
        });
    });
};

// ========================================
// POPULATE STATIC VIEW FROM DATA
// ========================================
const populateStaticView = () => {
    if (!portfolioData) return;

    // Update intro/hero
    const heroName = document.querySelector('.intro-greeting .hero-name');
    const heroRole = document.querySelector('.intro-stack');

    if (heroName) heroName.textContent = portfolioData.profile.name.toLowerCase();
    if (heroRole) {
        // Build tech stack from skills
        const techStack = [
            portfolioData.profile.role?.split(' ')[0]?.toLowerCase() || 'developer',
            ...(portfolioData.skills.frameworks?.slice(0, 3) || []),
            ...(portfolioData.skills.databases?.slice(0, 1) || []),
            ...(portfolioData.skills.ml_data?.slice(0, 1) || [])
        ].join(' • ');
        heroRole.textContent = techStack;
    }

    // Update projects
    const projectsGrid = document.getElementById('static-projects');
    if (projectsGrid && portfolioData.projects.length) {
        projectsGrid.innerHTML = portfolioData.projects.map(p => `
            <article class="project-card static-card">
                <div class="card-header">
                    <i class="fas fa-folder folder-icon"></i>
                    <h3 class="project-name">${p.name}</h3>
                </div>
                <p class="project-desc">${p.desc}</p>
                <div class="project-tech">
                    ${p.tech.map(t => `<span class="tech-tag">${t}</span>`).join('')}
                </div>
                <div class="project-links">
                    <a href="${p.link}" target="_blank" class="project-link">
                        <i class="fab fa-github"></i> GitHub
                    </a>
                </div>
            </article>
        `).join('');
    }

    // Update experience
    const timeline = document.querySelector('#static-experience .timeline');
    if (timeline && portfolioData.experience.length) {
        timeline.innerHTML = portfolioData.experience.map(e => `
            <article class="timeline-item">
                <div class="timeline-date">${e.date}</div>
                <h3 class="timeline-title">${e.title}</h3>
                <div class="timeline-company">${e.company}</div>
                <p class="timeline-desc">${e.highlights ? e.highlights.slice(0, 2).join(' ') : e.desc}</p>
            </article>
        `).join('');
    }

    // Update skills
    const skillsGrid = document.querySelector('#static-skills .skills-grid');
    if (skillsGrid && portfolioData.skills) {
        const skillCategories = {
            'Languages': portfolioData.skills.languages || [],
            'Frameworks': portfolioData.skills.frameworks || [],
            'Databases': portfolioData.skills.databases || [],
            'Dev Tools': portfolioData.skills.devtools || [],
            'System Design': portfolioData.skills.system_design || [],
            'ML/Data': portfolioData.skills.ml_data || []
        };

        skillsGrid.innerHTML = Object.entries(skillCategories)
            .filter(([_, skills]) => skills.length > 0)
            .map(([category, skills]) => `
                <div class="skill-category">
                    <h3 class="skill-category-title">${category}</h3>
                    <div class="skills-container">
                        ${skills.map(s => `<span class="skill-tag">${s}</span>`).join('')}
                    </div>
                </div>
            `).join('');
    }

    // Update contact/socials
    const contactGrid = document.querySelector('#static-contact .contact-grid');
    if (contactGrid && portfolioData.socials.length) {
        contactGrid.innerHTML = portfolioData.socials.map(s => `
            <a href="${s.link}" target="_blank" class="contact-card">
                <i class="${s.icon}"></i>
                <span>${s.name}</span>
            </a>
        `).join('');
    }
};

// ========================================
// INITIALIZATION
// ========================================
document.addEventListener('DOMContentLoaded', async () => {
    // Load data first
    await loadPortfolioData();

    // Populate static view with data
    populateStaticView();

    // Start clock
    setInterval(updateClock, 1000);
    updateClock();

    // Start status bar updates
    setInterval(updateStatusBar, 2000);
    updateStatusBar();

    // Initialize features
    initThemeToggle();
    initSparkEffects();
    initShutdown();
});

// Listen for terminal boot event from mode controller
// This runs AFTER the global boot sequence completes
document.addEventListener('startTerminalBoot', async () => {
    await runTerminalIntro();
    initTerminalInput();
});

// Listen for static intro event - animate the name/role
document.addEventListener('startStaticIntro', async () => {
    const heroName = document.querySelector('.intro-greeting .hero-name');
    const heroRole = document.querySelector('.intro-stack');

    if (!heroName || !heroRole || !portfolioData) return;

    // Store full text
    const fullName = portfolioData.profile.name.toLowerCase();
    const techStack = [
        portfolioData.profile.role?.split(' ')[0]?.toLowerCase() || 'developer',
        ...(portfolioData.skills?.frameworks?.slice(0, 3) || []),
        ...(portfolioData.skills?.databases?.slice(0, 1) || []),
        ...(portfolioData.skills?.ml_data?.slice(0, 1) || [])
    ].join(' • ');

    // Clear and type name
    heroName.textContent = '';
    heroRole.textContent = '';

    for (let i = 0; i < fullName.length; i++) {
        heroName.textContent += fullName[i];
        await sleep(50);
    }

    await sleep(300);

    // Type role
    for (let i = 0; i < techStack.length; i++) {
        heroRole.textContent += techStack[i];
        await sleep(20);
    }
});

// Make data available globally
window.portfolioData = portfolioData;
window.loadPortfolioData = loadPortfolioData;

