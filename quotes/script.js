let selectedTag = "All";

async function fetchQuotes() {
  const url = "https://corsproxy.io/?url=https://github.com/quotable-io/data/raw/refs/heads/master/data/quotes.json";
  const res = await fetch(url);
  return await res.json();
}

async function getRandomQuote() {
  const data = await fetchQuotes();

  let filtered = data;

  if (selectedTag !== "All") {
    filtered = data.filter(q => q.tags && q.tags.includes(selectedTag));
  }

  if (!filtered.length) return null;

  const random = filtered[Math.floor(Math.random() * filtered.length)];

  return {
    author: random.author,
    content: random.content
  };
}

async function displayQuote() {
    const rawjson = await getRandomQuote();
    if (!rawjson) return;

    const quoteEl = document.getElementById('quote');
    const authorEl = document.getElementById('author');

    quoteEl.textContent = `"${rawjson.content}"`;
    authorEl.textContent = `- ${rawjson.author}`;

    updateBottomRowPosition();
}

function createCustomDropdown(options, onChange) {
    let isOpen = false;
    let selected = "All";

    const wrapper = document.createElement('div');
    wrapper.style.position = 'relative';

    const button = document.createElement('button');
    button.textContent = selected;
    button.style.padding = '8px 16px';
    button.style.fontSize = '15px';
    button.style.cursor = 'pointer';
    button.style.borderRadius = '5px';
    button.style.border = 'none';
    button.style.backgroundColor = '#4CAF50';
    button.style.color = 'white';

    const menu = document.createElement('div');
    menu.style.position = 'absolute';
    menu.style.left = '0';
    menu.style.bottom = '110%';
    menu.style.top = 'auto';
    menu.style.backgroundColor = '#4CAF50';
    menu.style.borderRadius = '5px';
    menu.style.overflowY = 'auto';
    menu.style.overflowX = 'hidden';
    menu.style.display = 'none';
    menu.style.minWidth = '140px';
    menu.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
    menu.style.zIndex = '9999';

    function updateSize() {
        const maxHeight = Math.floor(window.innerHeight * 0.4);
        menu.style.maxHeight = maxHeight + "px";
    }

    function openMenu() {
        isOpen = true;
        menu.style.display = 'block';
        updateSize();
    }

    function closeMenu() {
        isOpen = false;
        menu.style.display = 'none';
    }

    button.onclick = () => {
        isOpen ? closeMenu() : openMenu();
    };

    options.forEach(opt => {
        const item = document.createElement('div');
        item.textContent = opt;
        item.style.padding = '8px 12px';
        item.style.cursor = 'pointer';
        item.style.color = 'white';
        item.style.whiteSpace = 'nowrap';

        item.onmouseenter = () => item.style.backgroundColor = '#45a049';
        item.onmouseleave = () => item.style.backgroundColor = '#4CAF50';

        item.onclick = () => {
            selected = opt;
            button.textContent = opt;
            closeMenu();
            onChange(opt);
        };

        menu.appendChild(item);
    });

    wrapper.appendChild(button);
    wrapper.appendChild(menu);

    document.addEventListener('click', (e) => {
        if (!wrapper.contains(e.target)) closeMenu();
    });

    window.addEventListener('resize', () => {
        if (isOpen) updateSize();
    });

    return wrapper;
}

function updateFontSizes() {
    const quote = document.getElementById('quote');
    const author = document.getElementById('author');
    if (!quote || !author) return;

    const width = window.innerWidth;

    quote.style.fontSize = `${Math.min(42, Math.max(16, width * 0.035))}px`;
    author.style.fontSize = `${Math.min(20, Math.max(14, width * 0.025))}px`;
}

function updateBottomRowPosition() {
    const quote = document.getElementById('quote');
    const bottomRow = document.getElementById('bottomRow');
    if (!quote || !bottomRow) return;

    const rect = quote.getBoundingClientRect();
    const gap = window.innerHeight < 600 ? 8 : 14;

    let top = rect.bottom + gap;

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

    // fetch tags fresh
    const data = await fetchQuotes();
    const tags = new Set();
    data.forEach(q => (q.tags || []).forEach(t => tags.add(t)));

    const options = ["All", ...[...tags].sort()];

    const dropdown = createCustomDropdown(options, (value) => {
        selectedTag = value;
        displayQuote();
    });

    container.appendChild(quoteEl);
    document.body.appendChild(container);

    bottomRow.appendChild(authorEl);
    bottomRow.appendChild(dropdown);
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
