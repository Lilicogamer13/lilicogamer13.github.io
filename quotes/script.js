async function fetchData() {
    try {
        const response = await fetch('https://api.quotable.io/random');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

async function displayQuote() {
    const rawjson = await fetchData();
    if (!rawjson) return;

    const quoteEl = document.getElementById('quote');
    const authorEl = document.getElementById('author');

    quoteEl.textContent = `"${rawjson.content}"`;
    authorEl.textContent = `- ${rawjson.author}`;

    updateBottomRowPosition();
}

function updateFontSizes() {
    const quote = document.getElementById('quote');
    const author = document.getElementById('author');
    if (!quote || !author) return;

    const width = window.innerWidth;

    // Clamp font sizes for mobile safety
    quote.style.fontSize = `${Math.min(42, Math.max(16, width * 0.035))}px`;
    author.style.fontSize = `${Math.min(20, Math.max(14, width * 0.025))}px`;
}

function updateBottomRowPosition() {
    const quote = document.getElementById('quote');
    const bottomRow = document.getElementById('bottomRow');
    if (!quote || !bottomRow) return;

    const rect = quote.getBoundingClientRect();

    // Smaller gap on small screens
    const gap = window.innerHeight < 600 ? 8 : 14;
    let top = rect.bottom + gap;

    // Prevent bottom row from going off-screen
    const rowHeight = bottomRow.offsetHeight;
    const maxTop = window.innerHeight - rowHeight - 8;
    if (top > maxTop) top = maxTop;

    bottomRow.style.top = `${top}px`;
}

(async () => {
    document.body.style.backgroundColor = '#ADD8E6';
    document.body.style.margin = '0';
    document.body.style.padding = '12px';
    document.body.style.fontFamily = 'Arial, sans-serif';

    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.left = '50%';
    container.style.top = '50%';
    container.style.transform = 'translate(-50%, -50%)';
    container.style.maxWidth = '600px';
    container.style.width = '100%';
    container.style.textAlign = 'center';

    const quoteEl = document.createElement('p');
    quoteEl.id = 'quote';
    quoteEl.style.fontStyle = 'italic';
    quoteEl.style.margin = '0';
    quoteEl.style.lineHeight = '1.25';

    const bottomRow = document.createElement('div');
    bottomRow.id = 'bottomRow';
    bottomRow.style.position = 'fixed';
    bottomRow.style.left = '0';
    bottomRow.style.right = '0';
    bottomRow.style.display = 'flex';
    bottomRow.style.justifyContent = 'space-between';
    bottomRow.style.alignItems = 'center';
    bottomRow.style.padding = '0 12px';

    const authorEl = document.createElement('p');
    authorEl.id = 'author';
    authorEl.style.margin = '0';

    const button = document.createElement('button');
    button.textContent = 'New Quote';
    button.style.padding = '8px 16px';
    button.style.fontSize = '15px';
    button.style.cursor = 'pointer';
    button.style.borderRadius = '5px';
    button.style.border = 'none';
    button.style.backgroundColor = '#4CAF50';
    button.style.color = 'white';
    button.onclick = displayQuote;

    container.appendChild(quoteEl);
    document.body.appendChild(container);

    bottomRow.appendChild(authorEl);
    bottomRow.appendChild(button);
    document.body.appendChild(bottomRow);

    await displayQuote();
    updateFontSizes();
    updateBottomRowPosition();

    window.addEventListener('resize', () => {
        updateFontSizes();
        updateBottomRowPosition();
    });
})();
