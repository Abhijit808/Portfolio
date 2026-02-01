/**
 * Effects Controller
 * Additional visual effects
 */

// CRT Flash effect
const addCrtFlashStyle = () => {
    const style = document.createElement('style');
    style.textContent = `
        .crt-flash {
            animation: crt-flash 0.15s ease-out;
        }
        
        @keyframes crt-flash {
            0% { filter: brightness(2) contrast(1.5); }
            100% { filter: brightness(1) contrast(1); }
        }
        
        .glitch-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: repeating-linear-gradient(0deg,
                rgba(0, 0, 0, 0.15),
                rgba(0, 0, 0, 0.15) 1px,
                transparent 1px,
                transparent 2px);
            pointer-events: none;
            z-index: 10000;
            animation: glitch 0.3s infinite;
        }
        
        @keyframes glitch {
            0% { transform: translate(0); }
            20% { transform: translate(-2px, 2px); }
            40% { transform: translate(2px, -2px); }
            60% { transform: translate(-2px, -2px); }
            80% { transform: translate(2px, 2px); }
            100% { transform: translate(0); }
        }
        
        .confetti-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            pointer-events: none;
            z-index: 10000;
            overflow: hidden;
        }
        
        .confetti {
            position: absolute;
            top: -10px;
            width: 10px;
            height: 10px;
            opacity: 0.8;
            animation: confetti-fall 3s linear forwards;
        }
        
        @keyframes confetti-fall {
            0% { transform: translateY(0) rotate(0deg); opacity: 1; }
            100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        
        /* Neofetch styles */
        .neofetch-output {
            display: flex;
            gap: 30px;
            margin: 10px 0;
        }
        
        .ascii-art {
            font-size: 0.8rem;
            line-height: 1.2;
        }
        
        .ascii-color-1 { color: var(--color-cyan); }
        .ascii-color-2 { color: var(--color-blue); }
        .ascii-color-3 { color: var(--color-magenta); }
        
        .neofetch-info {
            display: flex;
            flex-direction: column;
            gap: 3px;
        }
        
        .nf-label {
            color: var(--color-cyan);
            font-weight: bold;
            display: inline-block;
            min-width: 80px;
        }
        
        /* Help output styles */
        .help-output { line-height: 1.8; }
        .help-header { color: var(--color-cyan); font-weight: bold; }
        .cmd-name { color: var(--color-green); font-weight: bold; }
        .cmd-arg { color: var(--color-yellow); }
        .cmd-desc { color: #888; }
        .help-tip { color: #666; font-style: italic; }
        
        /* Whoami styles */
        .whoami-output { line-height: 1.8; }
        .whoami-name { color: var(--color-cyan); font-weight: bold; font-size: 1.3rem; display: block; }
        .whoami-role { color: var(--color-magenta); display: block; margin-bottom: 15px; }
        .whoami-section { color: var(--color-yellow); font-weight: bold; display: block; margin-top: 10px; margin-bottom: 5px; }
        .whoami-contact { display: block; margin-top: 15px; color: #888; }
        .whoami-contact i { color: var(--color-blue); margin-right: 8px; width: 20px; display: inline-block; }
        
        .tech-tag {
            background: #333;
            color: var(--color-green);
            padding: 2px 8px;
            border-radius: 4px;
            margin-right: 5px;
            font-size: 0.9rem;
            display: inline-block;
            margin-bottom: 4px;
        }
        
        /* LS output */
        .ls-output { display: flex; flex-wrap: wrap; gap: 15px; }
        .ls-dir { color: var(--color-blue); font-weight: bold; }
        .ls-file { color: var(--fg-color); }
        
        /* Journal styles */
        .journal-output { line-height: 1.8; }
        .journal-header, .journal-footer { color: #666; font-style: italic; display: block; margin: 10px 0; }
        .journal-entry { border-left: 2px solid #333; padding-left: 15px; margin: 15px 0; }
        .journal-date { color: var(--color-yellow); font-weight: bold; display: inline-block; min-width: 80px; }
        .journal-tag { padding: 1px 6px; border-radius: 3px; font-size: 0.8rem; font-weight: bold; margin-left: 10px; }
        .journal-tag.started { background: var(--color-blue); color: #000; }
        .journal-tag.built { background: var(--color-green); color: #000; }
        .journal-tag.learned { background: var(--color-magenta); color: #000; }
        
        /* Wget output */
        .wget-output { line-height: 1.5; color: #888; }
        .wget-success { color: var(--color-green); font-weight: bold; }
        
        /* Hire me */
        .hire-me-output { margin: 10px 0; line-height: 1.8; }
        .hire-header { font-size: 1.5rem; display: block; margin-bottom: 15px; }
        .hire-text { display: block; margin-bottom: 15px; }
        .hire-success { color: var(--color-green); font-weight: bold; display: block; }
        .hire-cta { display: block; margin-top: 10px; }
        .hire-cta a { color: var(--color-cyan); text-decoration: none; }
        
        /* Recovery */
        .recovery-output { margin: 10px 0; }
        .recovery-header { color: var(--color-yellow); font-size: 1.2rem; display: block; margin-bottom: 5px; }
        .recovery-hint { color: #666; display: block; margin-top: 5px; }
        
        /* README output */
        .readme-output { line-height: 1.6; }
        .readme-header { color: var(--color-cyan); margin-bottom: 15px; display: block; }
        
        /* Executed prompt */
        .prompt-line.executed { opacity: 0.8; }
    `;
    document.head.appendChild(style);
};

// Initialize effects when DOM ready
document.addEventListener('DOMContentLoaded', addCrtFlashStyle);
