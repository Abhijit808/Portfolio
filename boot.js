/**
 * Boot Manager - Randomized boot sequences
 */

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
    ubuntu: [
        { text: "[    0.000000] Linux version 6.5.0-generic (buildd@lcy02-amd64)", delay: 50 },
        { text: "[    0.123456] Command line: BOOT_IMAGE=/boot/vmlinuz-6.5.0-generic", delay: 80 },
        { text: "[  OK  ] Started snap.lxd.activate.service.", delay: 100 },
        { text: "[  OK  ] Started Network Manager.", delay: 120 },
        { text: "[  OK  ] Started OpenSSH server.", delay: 100 },
        { text: "[  OK  ] Reached target Graphical Interface.", delay: 150 },
        { text: "[  OK  ] Started GNOME Display Manager.", delay: 200 },
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
        { text: "init: display... [OK]", delay: 100 },
        { text: "init: starting user services...", delay: 200 },
        { text: "", delay: 100 },
        { text: "Welcome to abhijit-os v2.0", delay: 300 },
        { text: "", delay: 100 },
        { text: "Loading shell...", delay: 400 },
        { text: "Done.", delay: 200 }
    ],
    fedora: [
        { text: "[  OK  ] Finished Load Kernel Modules.", delay: 80 },
        { text: "[  OK  ] Started Plymouth Boot Screen.", delay: 100 },
        { text: "[  OK  ] Started Avahi mDNS/DNS-SD Stack.", delay: 120 },
        { text: "[  OK  ] Started Network Manager Script Dispatcher Service.", delay: 150 },
        { text: "[  OK  ] Started GDM Display Manager.", delay: 180 },
        { text: "[  OK  ] Reached target Multi-User System.", delay: 200 },
        { text: "", delay: 100 },
        { text: "Fedora Linux 39 (Workstation Edition)", delay: 300 },
        { text: "", delay: 100 },
        { text: "Loading Zsh...", delay: 400 },
        { text: "Initializing Powerlevel10k...", delay: 500 },
        { text: "Done.", delay: 200 }
    ]
};

class BootManager {
    constructor(options = {}) {
        this.terminalElement = options.terminalElement;
        this.startupElement = options.startupElement;
        this.onComplete = options.onComplete || (() => { });
    }

    async run() {
        // Pick random boot sequence
        const types = Object.keys(bootSequences);
        const selectedType = types[Math.floor(Math.random() * types.length)];
        const sequence = bootSequences[selectedType];

        this.startupElement.classList.remove('hidden');

        // Play boot sound
        if (window.audioManager) {
            window.audioManager.play('boot');
        }

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

            this.startupElement.appendChild(line);

            if (this.terminalElement) {
                this.terminalElement.scrollTop = this.terminalElement.scrollHeight;
            }

            await this.sleep(log.delay);
        }

        // Clear and proceed
        await this.sleep(500);
        this.startupElement.innerHTML = '';
        this.startupElement.classList.add('hidden');

        this.onComplete();
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Export
window.BootManager = BootManager;
