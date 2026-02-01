/**
 * Terminal Engine - Stub file
 * Main terminal functionality is now in script.js
 */

// Placeholder for future terminal enhancements
class TerminalEngine {
    constructor(options = {}) {
        this.outputElement = options.outputElement;
    }

    print(text, className = '') {
        if (!this.outputElement) return;
        const line = document.createElement('div');
        line.className = `terminal-output ${className}`;
        line.textContent = text;
        this.outputElement.appendChild(line);
    }
}

window.TerminalEngine = TerminalEngine;
