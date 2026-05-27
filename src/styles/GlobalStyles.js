import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  :root {
    --bg-main: #fcfcfd;
    --bg-card: #ffffff;
    --text-main: #1a1a1a;
    --text-muted: #64748b;
    --border: #f1f5f9;
    --accent: ${props => props.$accentColor || '#000000'};
    --accent-shadow: rgba(0, 0, 0, 0.02);
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }

  body {
    background-color: var(--bg-main);
    color: var(--text-main);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-weight: 400;
    line-height: 1.5;
  }

  h1, h2, h3, h4, h5, h6 {
    color: var(--text-main);
    letter-spacing: -0.01em;
    font-weight: 600; /* Softer weight than 900 */
  }

  button {
    font-family: inherit;
  }

  /* Custom Scrollbar for a cleaner look */
  ::-webkit-scrollbar {
    width: 6px;
  }

  ::-webkit-scrollbar-track {
    background: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background: #e2e8f0;
    border-radius: 10px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #cbd5e1;
  }
`;

export default GlobalStyles;
