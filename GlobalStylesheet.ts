import tw from 'twin.macro';
import { createGlobalStyle } from 'styled-components/macro';

export default createGlobalStyle`
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');

    :root {
        --mekudo-bg: #080c14;
        --mekudo-surface: #0d1321;
        --mekudo-card: #111827;
        --mekudo-card-hover: #141e2e;
        --mekudo-border: rgba(0, 180, 255, 0.08);
        --mekudo-border-hover: rgba(0, 180, 255, 0.25);
        --mekudo-accent: #00b4ff;
        --mekudo-accent-dim: rgba(0, 180, 255, 0.15);
        --mekudo-accent-glow: rgba(0, 180, 255, 0.3);
        --mekudo-text: #e2eaf7;
        --mekudo-text-muted: #6b7fa3;
        --mekudo-text-dim: #3d4f6e;
        --mekudo-success: #00e5a0;
        --mekudo-warning: #ffb300;
        --mekudo-danger: #ff4757;
        --mekudo-sidebar-width: 240px;
    }

    * {
        box-sizing: border-box;
    }

    body {
        font-family: 'Sora', system-ui, sans-serif;
        background-color: var(--mekudo-bg);
        color: var(--mekudo-text);
        letter-spacing: 0.01em;
        line-height: 1.6;
        margin: 0;
        padding: 0;
        background-image:
            radial-gradient(ellipse 80% 50% at 50% -20%, rgba(0, 180, 255, 0.06) 0%, transparent 60%),
            radial-gradient(ellipse 40% 30% at 80% 80%, rgba(0, 100, 200, 0.04) 0%, transparent 50%);
        background-attachment: fixed;
        min-height: 100vh;
    }

    h1, h2, h3, h4, h5, h6 {
        font-family: 'Sora', system-ui, sans-serif;
        font-weight: 600;
        color: var(--mekudo-text);
        letter-spacing: -0.02em;
    }

    p {
        color: var(--mekudo-text-muted);
        line-height: 1.7;
    }

    form {
        margin: 0;
    }

    textarea, select, input, button, button:focus, button:focus-visible {
        outline: none;
        font-family: 'Sora', system-ui, sans-serif;
    }

    input[type=number]::-webkit-outer-spin-button,
    input[type=number]::-webkit-inner-spin-button {
        -webkit-appearance: none !important;
        margin: 0;
    }

    input[type=number] {
        -moz-appearance: textfield !important;
    }

    /* Scrollbar */
    ::-webkit-scrollbar {
        width: 6px;
        height: 6px;
        background: transparent;
    }

    ::-webkit-scrollbar-thumb {
        background: rgba(0, 180, 255, 0.2);
        border-radius: 3px;
        transition: background 0.2s;
    }

    ::-webkit-scrollbar-thumb:hover {
        background: rgba(0, 180, 255, 0.4);
    }

    ::-webkit-scrollbar-track {
        background: transparent;
    }

    ::-webkit-scrollbar-corner {
        background: transparent;
    }

    /* Mekudo Card Style */
    .mekudo-card {
        background: var(--mekudo-card);
        border: 1px solid var(--mekudo-border);
        border-radius: 16px;
        backdrop-filter: blur(8px);
        transition: border-color 0.2s ease, box-shadow 0.2s ease;
    }

    .mekudo-card:hover {
        border-color: var(--mekudo-border-hover);
        box-shadow: 0 0 30px rgba(0, 180, 255, 0.06);
    }

    /* Mekudo Button */
    .mekudo-btn {
        background: linear-gradient(135deg, #00b4ff, #0088cc);
        color: #fff;
        font-family: 'Sora', sans-serif;
        font-weight: 600;
        font-size: 0.85rem;
        padding: 0.5rem 1.25rem;
        border-radius: 10px;
        border: none;
        cursor: pointer;
        transition: all 0.2s ease;
        letter-spacing: 0.02em;
    }

    .mekudo-btn:hover {
        transform: translateY(-1px);
        box-shadow: 0 6px 20px rgba(0, 180, 255, 0.35);
    }

    /* Glow effect for accent elements */
    .mekudo-glow {
        box-shadow: 0 0 20px var(--mekudo-accent-glow);
    }

    /* Status indicators */
    .status-online { color: var(--mekudo-success); }
    .status-offline { color: var(--mekudo-danger); }
    .status-starting { color: var(--mekudo-warning); }
`;
