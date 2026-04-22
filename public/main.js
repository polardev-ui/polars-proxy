/**
 * Polar's Proxy - Multi-Tab Logic
 * Handles iframe lifecycle, tab switching, and URL navigation.
 */

let tabs = [];
let activeTabId = null;

const tabsBar = document.getElementById('tabs-bar');
const frameContainer = document.getElementById('frame-container');
const urlInput = document.getElementById('url-input');
const addTabBtn = document.getElementById('add-tab');

async function createTab() {
    const id = Date.now();
    
    const tabBtn = document.createElement('button');
    tabBtn.className = 'tab-btn';
    tabBtn.id = `btn-${id}`;
    tabBtn.innerHTML = `New Tab <span class="close-btn">×</span>`;
    
    const iframe = document.createElement('iframe');
    iframe.id = `frame-${id}`;
    iframe.className = 'proxy-frame';
    iframe.style.display = 'none'; 

    tabsBar.insertBefore(tabBtn, addTabBtn);
    frameContainer.appendChild(iframe);

    const tabObj = { 
        id, 
        iframe, 
        tabBtn, 
        url: '' 
    };
    
    tabs.push(tabObj);

    tabBtn.onclick = (e) => {
        if (e.target.classList.contains('close-btn')) {
            closeTab(id, e);
        } else {
            switchTab(id);
        }
    };

    switchTab(id);
    return tabObj;
}

function switchTab(id) {
    activeTabId = id;

    tabs.forEach(t => {
        const isActive = t.id === id;
        
        t.iframe.style.display = isActive ? 'block' : 'none';
        
        t.tabBtn.classList.toggle('active', isActive);

        if (isActive) {
            urlInput.value = t.url || '';
            urlInput.focus();
        }
    });
}

function closeTab(id, e) {
    if (e) e.stopPropagation();

    const index = tabs.findIndex(t => t.id === id);
    if (index > -1) {
        tabs[index].iframe.remove();
        tabs[index].tabBtn.remove();
        
        tabs.splice(index, 1);

        if (activeTabId === id) {
            if (tabs.length > 0) {
                switchTab(tabs[tabs.length - 1].id);
            } else {
                createTab();
            }
        }
    }
}

function formatUrl(url) {
    if (!url.includes('.')) return `https://www.google.com/search?q=${encodeURIComponent(url)}`;
    if (!/^https?:\/\//i.test(url)) return `http://${url}`;
    return url;
}

urlInput.addEventListener('keydown', async (e) => {
    if (e.key === 'Enter' && activeTabId) {
        const rawValue = urlInput.value.trim();
        if (!rawValue) return;

        const url = formatUrl(rawValue);
        const activeTab = tabs.find(t => t.id === activeTabId);
        
        activeTab.url = url;

        try {
            await navigator.serviceWorker.register('./uv/sw.js', { 
                scope: __uv$config.prefix 
            });

            activeTab.iframe.src = __uv$config.prefix + __uv$config.encodeUrl(url);
            
            activeTab.tabBtn.style.backgroundImage = `url(https://www.google.com/s2/favicons?domain=${url})`;
            const displayTitle = rawValue.replace(/^https?:\/\//, '').split('/')[0];
            activeTab.tabBtn.firstChild.textContent = displayTitle.substring(0, 12) + (displayTitle.length > 12 ? '...' : '');

        } catch (err) {
            console.error('Failed to register service worker or load proxy:', err);
        }
    }
});

addTabBtn.onclick = createTab;

window.addEventListener('load', () => {
    createTab();
});
