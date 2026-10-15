document.addEventListener('DOMContentLoaded', async () => {
    if (!window.mermaid) return;

    const diagrams = Array.from(
        document.querySelectorAll('pre.mermaid')
    );

    if (!diagrams.length) return;

    const sources = diagrams.map((element) => ({
        element,
        source: element.textContent
    }));

    let rendering = Promise.resolve();
    let currentTheme = null;

    function getTheme() {
        return document.body.classList.contains('dark')
            ? 'dark'
            : 'default';
    }

    async function renderDiagrams() {
        const theme = getTheme();

        if (theme === currentTheme) return;

        currentTheme = theme;

        window.mermaid.initialize({
            startOnLoad: false,
            securityLevel: 'strict',
            theme
        });

        for (const { element, source } of sources) {
            element.removeAttribute('data-processed');
            element.textContent = source;
        }

        try {
            await window.mermaid.run({
                nodes: diagrams
            });
        } catch (error) {
            console.error('Mermaid rendering failed:', error);
        }
    }

    function queueRender() {
        rendering = rendering
            .then(renderDiagrams)
            .catch((error) => {
                console.error('Mermaid rendering failed:', error);
            });
    }

    queueRender();

    const themeToggle = document.getElementById('theme-toggle');

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            queueRender();
        });
    }
});
