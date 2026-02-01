/**
 * Mode Controller - Manages Terminal/Static mode switching
 * Features:
 * - URL param detection (?mode=terminal / ?mode=static)
 * - localStorage persistence
 * - Mobile detection (defaults to static)
 * - Smooth transitions
 */

class ModeController {
    constructor() {
        this.currentMode = 'static'; // Default
        this.terminalBooted = false;
        this.isMobile = this.detectMobile();

        // DOM Elements (will be set after DOM ready)
        this.terminalView = null;
        this.staticView = null;
        this.modeToggle = null;
        this.crtOverlay = null;

        this.init();
    }

    init() {
        // Determine initial mode
        const urlMode = this.getUrlParam('mode');
        const savedMode = localStorage.getItem('portfolioMode');

        if (urlMode === 'terminal' || urlMode === 'static') {
            this.currentMode = urlMode;
        } else if (savedMode) {
            this.currentMode = savedMode;
        } else {
            // Mobile defaults to static
            this.currentMode = this.isMobile ? 'static' : 'terminal';
        }
    }

    detectMobile() {
        return window.innerWidth < 768 ||
            ('ontouchstart' in window && window.innerWidth < 1024);
    }

    getUrlParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    setMode(mode, animate = true) {
        if (mode === this.currentMode) return;

        this.currentMode = mode;
        localStorage.setItem('portfolioMode', mode);

        // Update URL without reload
        const url = new URL(window.location);
        url.searchParams.set('mode', mode);
        window.history.replaceState({}, '', url);

        if (animate) {
            this.transitionMode(mode);
        } else {
            this.applyMode(mode);
        }
    }

    transitionMode(mode) {
        // Hide current views and run boot sequence
        this.terminalView?.classList.add('hidden');
        this.staticView?.classList.add('hidden');

        // Run boot sequence before showing new mode
        this.runBootSequence();
    }

    applyMode(mode) {
        if (mode === 'terminal') {
            this.staticView?.classList.add('hidden');
            this.terminalView?.classList.remove('hidden');

            if (!this.terminalBooted) {
                this.bootTerminal();
            }
        } else {
            this.terminalView?.classList.add('hidden');
            this.staticView?.classList.remove('hidden');
        }

        this.updateToggleButton();
    }

    bootTerminal() {
        this.terminalBooted = true;
        // Trigger custom event for terminal to start boot sequence
        document.dispatchEvent(new CustomEvent('startTerminalBoot'));
    }

    updateToggleButton() {
        if (!this.modeToggle) return;

        const btn = this.modeToggle;
        if (this.currentMode === 'terminal') {
            btn.innerHTML = '<i class="fas fa-file-alt"></i> <span>Static</span>';
            btn.classList.add('active-terminal');
            btn.classList.remove('active-static');
        } else {
            btn.innerHTML = '<i class="fas fa-terminal"></i> <span>Terminal</span>';
            btn.classList.add('active-static');
            btn.classList.remove('active-terminal');
        }
    }

    toggle() {
        const newMode = this.currentMode === 'terminal' ? 'static' : 'terminal';
        this.setMode(newMode);
    }

    // Called after DOM is ready
    bindElements() {
        this.terminalView = document.getElementById('terminal-view');
        this.staticView = document.getElementById('static-view');
        this.modeToggle = document.getElementById('mode-toggle');
        this.crtOverlay = document.querySelector('.crt-overlay');

        // Hide both views initially for boot sequence
        this.terminalView?.classList.add('hidden');
        this.staticView?.classList.add('hidden');

        // Always run boot sequence first
        this.runBootSequence();

        // Bind toggle click
        if (this.modeToggle) {
            this.modeToggle.addEventListener('click', () => this.toggle());
        }

        // Keyboard shortcut: Ctrl+Shift+T
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'T') {
                e.preventDefault();
                this.toggle();
            }
        });
    }

    async runBootSequence() {
        const bootOverlay = document.getElementById('boot-overlay');
        const bootLogs = document.getElementById('boot-logs');

        if (!bootOverlay || !bootLogs) {
            // Fallback: just show the mode
            this.terminalBooted = true;
            this.applyMode(this.currentMode);
            return;
        }

        // Boot sequences
        const bootSequences = {
            arch: [
                { text: ":: Synchronizing package databases...", delay: 100 },
                { text: "[  OK  ] Started systemd-journald.service.", delay: 80 },
                { text: "[  OK  ] Started systemd-udevd.service.", delay: 100 },
                { text: ":: Running early hook [udev]", delay: 120 },
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
            minimal: [
                { text: "init: starting system...", delay: 100 },
                { text: "init: mounting filesystems... [OK]", delay: 150 },
                { text: "init: network... [OK]", delay: 120 },
                { text: "init: display... [OK]", delay: 100 },
                { text: "init: starting user services...", delay: 200 },
                { text: "", delay: 100 },
                { text: "Welcome to abhijit-os v2.0", delay: 300 },
                { text: "", delay: 100 },
                { text: "Loading shell...", delay: 400 },
                { text: "Done.", delay: 200 }
            ]
        };

        // Pick random sequence
        const types = Object.keys(bootSequences);
        const selectedType = types[Math.floor(Math.random() * types.length)];
        const sequence = bootSequences[selectedType];

        // Clear and show boot overlay
        bootLogs.innerHTML = '';
        bootOverlay.classList.remove('hidden');

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

            bootLogs.appendChild(line);
            bootOverlay.scrollTop = bootOverlay.scrollHeight;
            await this.sleep(log.delay);
        }

        // Wait a bit then hide boot and show mode
        await this.sleep(500);
        bootOverlay.classList.add('hidden');
        this.terminalBooted = true;
        this.applyMode(this.currentMode);

        // Run mode-specific intro
        if (this.currentMode === 'terminal') {
            document.dispatchEvent(new CustomEvent('startTerminalBoot'));
        } else {
            document.dispatchEvent(new CustomEvent('startStaticIntro'));
        }
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    getMode() {
        return this.currentMode;
    }
}

// Create global instance
window.modeController = new ModeController();

// Bind after DOM ready
document.addEventListener('DOMContentLoaded', () => {
    window.modeController.bindElements();
});
