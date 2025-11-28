const terminal = document.getElementById('terminal');
const startupSequence = document.getElementById('startup-sequence');
const mainOutput = document.getElementById('main-output');
const activePrompt = document.getElementById('active-prompt');

// Boot logs
const bootLogs = [
    { text: "[  OK  ] Started User Manager.", delay: 100 },
    { text: "[  OK  ] Reached target Graphical Interface.", delay: 150 },
    { text: "[  OK  ] Found portfolio configuration.", delay: 200 },
    { text: "[  OK  ] Mounted /home/painfulpike/portfolio.", delay: 300 },
    { text: "Loading Zsh...", delay: 600 },
    { text: "Initializing Powerlevel10k...", delay: 800 },
    { text: "Done.", delay: 1000 }
];

// Typing effect utility
const typeText = async (element, text, speed = 30) => {
    return new Promise(resolve => {
        let i = 0;
        const interval = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                // Auto scroll to bottom
                terminal.scrollTop = terminal.scrollHeight;
            } else {
                clearInterval(interval);
                resolve();
            }
        }, speed);
    });
};

// Startup Sequence
const runStartup = async () => {
    startupSequence.classList.remove('hidden');
    activePrompt.style.display = 'none'; // Hide prompt initially

    for (const log of bootLogs) {
        const p = document.createElement('div');
        p.className = 'log-line';

        // Colorize "[ OK ]"
        if (log.text.includes("[  OK  ]")) {
            p.innerHTML = `<span class="log-ok">[  OK  ]</span> ${log.text.replace("[  OK  ] ", "")}`;
        } else {
            p.textContent = log.text;
        }

        startupSequence.appendChild(p);
        terminal.scrollTop = terminal.scrollHeight;
        await new Promise(r => setTimeout(r, log.delay));
    }

    // Clear screen effect
    await new Promise(r => setTimeout(r, 500));
    startupSequence.innerHTML = '';
    startupSequence.classList.add('hidden');

    // Show prompt
    activePrompt.style.display = 'flex';

    // Start Intro
    runIntro();
};

const runIntro = async () => {
    // Simulate typing the intro command? Or just showing the output?
    // Let's simulate typing "cat intro.txt" or just showing the header.
    // User requested: "My intro appears as if 'typed out'"

    const introContainer = document.createElement('div');
    introContainer.className = 'intro-section';
    mainOutput.appendChild(introContainer);

    const lines = [
        "hi, i'm abhijit rayarao",
        "full-stack developer • react • next.js • mern • webRTC • ai"
    ];

    for (const line of lines) {
        const p = document.createElement('div');
        p.className = 'intro-line';
        introContainer.appendChild(p);
        await typeText(p, line, 50);
        await new Promise(r => setTimeout(r, 300));
    }

    // Add a blank line
    mainOutput.appendChild(document.createElement('br'));

    // Start observing sections
    startObserving();
};

document.addEventListener('DOMContentLoaded', () => {
    // Clock functionality
    const updateClock = () => {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', { hour12: false });
        document.getElementById('clock').textContent = timeString;
    };
    setInterval(updateClock, 1000);
    updateClock();

    runStartup();
});

// Data
const projectsData = [
    { name: "github-mcp-server", desc: "Model Context Protocol server for GitHub", link: "https://github.com/Abhijit808/github-mcp-server" },
    { name: "Edupath", desc: "AI-powered education platform", link: "https://github.com/Abhijit8229/Edupath" },
    { name: "entitlements-app", desc: "GitHub App for managing repo entitlements", link: "https://github.com/Abhijit808/entitlements-app" },
    { name: "spark-template", desc: "Starter template for Spark projects", link: "https://github.com/Abhijit808/spark-template" }
];

const experienceData = [
    { date: "2024 - Present", title: "AI Intern", company: "HomeGround Sports Analytics", desc: "Building AI-based cricket coaching tools using Computer Vision." },
    { date: "2022", title: "Full Stack Developer", company: "Freelance", desc: "Developed web applications using MERN stack." }
];

const skillsData = [
    "JavaScript", "TypeScript", "React", "Next.js", "Node.js", "Python", "Computer Vision", "AI/ML", "TailwindCSS", "WebRTC"
];

// Socials Data
const socialsData = [
    { name: "GitHub (Abhijit808)", link: "https://github.com/Abhijit808", icon: "fab fa-github" },
    { name: "GitHub (Abhijit8229)", link: "https://github.com/Abhijit8229", icon: "fab fa-github-alt" },
    { name: "LinkedIn", link: "https://www.linkedin.com/in/abhijit-rayarao-8b6b6b1b6/", icon: "fab fa-linkedin" }
];

// Command Execution Logic
const executeCommand = async (command, sectionId, triggerElement) => {
    // Create Prompt Line
    const promptLine = document.createElement('div');
    promptLine.className = 'prompt-line executed-command';
    promptLine.innerHTML = `
        <div class="p10k-segment os-icon"><i class="fab fa-linux"></i></div>
        <div class="p10k-arrow os-arrow"></div>
        <div class="p10k-segment dir-icon"></div>
        <div class="p10k-segment dir-text">~/portfolio</div>
        <div class="p10k-arrow dir-arrow"></div>
        <div class="p10k-segment git-icon"><i class="fas fa-code-branch"></i></div>
        <div class="p10k-segment git-text">main</div>
        <div class="p10k-arrow git-arrow"></div>
        <div class="command-input">
            <span class="cmd-text"></span>
        </div>
    `;

    // Insert prompt before the section
    const section = document.getElementById(sectionId);
    section.parentNode.insertBefore(promptLine, section);

    // Type command
    const cmdTextSpan = promptLine.querySelector('.cmd-text');
    await typeText(cmdTextSpan, command, 50);

    // Render Content
    renderSection(sectionId);
};

const renderSection = (sectionId) => {
    const section = document.getElementById(sectionId);

    if (sectionId === 'section-projects') {
        const grid = document.createElement('div');
        grid.className = 'projects-grid';

        projectsData.forEach(proj => {
            const card = document.createElement('div');
            card.className = 'project-card';
            card.innerHTML = `
                <div class="folder-icon"><i class="fas fa-folder"></i></div>
                <div class="project-name">${proj.name}</div>
                <div class="project-desc">${proj.desc}</div>
            `;
            card.onclick = () => {
                if (proj.link !== '#') window.open(proj.link, '_blank');
                toggleProject(card);
            };
            grid.appendChild(card);
        });
        section.appendChild(grid);
    } else if (sectionId === 'section-experience') {
        const timeline = document.createElement('div');
        timeline.className = 'timeline';

        experienceData.forEach(exp => {
            const item = document.createElement('div');
            item.className = 'timeline-item';
            item.innerHTML = `
                <div class="timeline-date">${exp.date}</div>
                <div class="timeline-title">${exp.title}</div>
                <div class="timeline-company">${exp.company}</div>
                <div style="color: #888; margin-top: 5px;">${exp.desc}</div>
            `;
            timeline.appendChild(item);
        });
        section.appendChild(timeline);
    } else if (sectionId === 'section-skills') {
        const container = document.createElement('div');
        container.className = 'skills-container';

        skillsData.forEach(skill => {
            const tag = document.createElement('div');
            tag.className = 'skill-tag';
            tag.textContent = skill;
            container.appendChild(tag);
        });
        section.appendChild(container);
    } else if (sectionId === 'section-socials') {
        const container = document.createElement('div');
        container.className = 'skills-container'; // Reuse style

        socialsData.forEach(soc => {
            const tag = document.createElement('a');
            tag.className = 'skill-tag';
            tag.href = soc.link;
            tag.target = "_blank";
            tag.style.textDecoration = 'none';
            tag.style.display = 'inline-flex';
            tag.style.alignItems = 'center';
            tag.style.gap = '8px';
            tag.innerHTML = `<i class="${soc.icon}"></i> ${soc.name}`;
            container.appendChild(tag);
        });
        section.appendChild(container);
    }
};

const toggleProject = (card) => {
    // Simple expand animation
    if (card.style.height === 'auto') {
        card.style.height = '';
        card.querySelector('.folder-icon i').className = 'fas fa-folder';
    } else {
        // Reset others? Maybe not.
        card.style.height = 'auto';
        card.querySelector('.folder-icon i').className = 'fas fa-folder-open';
        // Add more details if needed
    }
};

// Intersection Observer
const observerOptions = {
    root: document.getElementById('terminal'), // Observe within terminal
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const trigger = entry.target;
            const command = trigger.dataset.command;
            const sectionId = trigger.id.replace('trigger-', 'section-');

            // Execute only once
            observer.unobserve(trigger);
            executeCommand(command, sectionId, trigger);
        }
    });
}, observerOptions);

// Start observing after intro
const startObserving = () => {
    document.querySelectorAll('.section-trigger').forEach(el => observer.observe(el));
};

// Theme Toggle
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;
const icon = themeToggle.querySelector('i');

themeToggle.addEventListener('click', () => {
    body.classList.toggle('light-theme');
    if (body.classList.contains('light-theme')) {
        icon.className = 'fas fa-moon';
    } else {
        icon.className = 'fas fa-sun';
    }
});

// Spark Effect
const createSpark = (e) => {
    const spark = document.createElement('div');
    spark.className = 'spark';
    spark.textContent = ['+', '*', '.', 'x'][Math.floor(Math.random() * 4)];

    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    spark.style.left = `${x}px`;
    spark.style.top = `${y}px`;

    // Random direction
    const angle = Math.random() * Math.PI * 2;
    const velocity = 20 + Math.random() * 30;
    const tx = Math.cos(angle) * velocity;
    const ty = Math.sin(angle) * velocity;

    spark.style.setProperty('--tx', `${tx}px`);
    spark.style.setProperty('--ty', `${ty}px`);

    e.target.appendChild(spark);

    setTimeout(() => {
        spark.remove();
    }, 800);
};

// Attach spark effect to interactive elements
document.addEventListener('mouseover', (e) => {
    if (e.target.closest('.project-card') || e.target.closest('.skill-tag') || e.target.closest('.shutdown-btn')) {
        const target = e.target.closest('.project-card') || e.target.closest('.skill-tag') || e.target.closest('.shutdown-btn');
        // Only add listener once? Or just use mousemove on container?
        // Let's use mousemove on the element itself
        target.onmousemove = (evt) => {
            if (Math.random() > 0.8) createSpark(evt); // Throttling
        };
    }
});

// Shutdown Logic
const shutdownBtn = document.getElementById('shutdown-btn');
shutdownBtn.addEventListener('click', async () => {
    const terminalContent = document.getElementById('terminal');
    terminalContent.innerHTML = ''; // Clear everything

    const shutdownLogs = [
        "Stopping User Manager...",
        "Stopping Graphical Interface...",
        "Unmounting /home/painfulpike/portfolio...",
        "System halting."
    ];

    for (const log of shutdownLogs) {
        const p = document.createElement('div');
        p.className = 'log-line';
        p.textContent = log;
        terminalContent.appendChild(p);
        await new Promise(r => setTimeout(r, 400));
    }

    await new Promise(r => setTimeout(r, 1000));

    // Turn off
    document.querySelector('.alacritty-window').style.opacity = '0';
    document.querySelector('.alacritty-window').style.transform = 'scale(0.9)';
    document.querySelector('.alacritty-window').style.transition = 'all 0.5s ease';

    setTimeout(() => {
        document.body.style.backgroundColor = '#000';
        document.querySelector('.crt-overlay').style.display = 'none';
    }, 500);
});
