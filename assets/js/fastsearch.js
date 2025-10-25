// Kodun başka script'lerle çakışmasını önlemek için her şeyi bir fonksiyon kapsamına alıyoruz.
// Ayrıca, sayfanın tüm resimlerinin yüklenmesini beklemeden, HTML hazır olur olmaz çalışması için 'DOMContentLoaded' kullanıyoruz.
document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // DOM elemanlarını en başta seçip değişkenlere atayarak tekrar tekrar sorgu yapmayı önlüyoruz.
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    const searchbox = document.getElementById('searchbox');

    // Eğer gerekli HTML elemanları sayfada yoksa, hatayı önlemek için script'i durdur.
    if (!searchInput || !searchResults || !searchbox) {
        console.error('Arama için gerekli HTML elemanları bulunamadı. (searchInput, searchResults, searchbox)');
        return;
    }

    let fuse;
    let first, last, current_elem = null;
    let resultsAvailable = false;

    // Fuse.js için varsayılan ve kullanıcı tanımlı ayarları birleştiren fonksiyon
    const getFuseOptions = (params) => {
        const defaultOptions = {
            isCaseSensitive: false,
            includeScore: false,
            includeMatches: false,
            minMatchCharLength: 1,
            shouldSort: true,
            findAllMatches: false,
            keys: ['title', 'permalink', 'summary', 'content'],
            location: 0,
            threshold: 0.4,
            distance: 100,
            ignoreLocation: true,
        };

        if (params && params.fuseOpts) {
            // Kullanıcının Hugo config'deki ayarlarını varsayılanların üzerine yaz
            return { ...defaultOptions, ...params.fuseOpts };
        }
        return defaultOptions;
    };

    // Arama indeksini modern fetch API ile asenkron olarak yükle
    const loadSearchIndex = async () => {
        try {
            const response = await fetch('/index.json'); // Hugo public klasöründeki index.json
            if (!response.ok) {
                throw new Error(`Arama indeksi yüklenemedi: ${response.statusText}`);
            }
            const data = await response.json();
            const options = getFuseOptions(window.params); // Hugo'dan gelen @params
            fuse = new Fuse(data, options);
        } catch (error) {
            console.error(error);
            searchInput.placeholder = "Arama şu an kullanılamıyor.";
            searchInput.disabled = true;
        }
    };

    // Her tuş vuruşunda arama yapmak yerine, kullanıcı yazmayı bıraktıktan sonra
    // belirli bir süre (örn: 300ms) bekleyip tek bir arama yapan "debounce" fonksiyonu.
    // Bu, performansı ciddi şekilde artırır.
    const debounce = (func, delay) => {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func.apply(this, args);
            }, delay);
        };
    };

    const executeSearch = (term) => {
        if (!fuse || !term) {
            resultsAvailable = false;
            searchResults.innerHTML = '';
            return;
        }

        const results = fuse.search(term, { limit: window.params?.fuseOpts?.limit || 20 });

        if (results.length > 0) {
            const resultSet = results.map(result => `
                <li class="post-entry">
                    <header class="entry-header">${result.item.title}&nbsp;»</header>
                    <a href="${result.item.permalink}" aria-label="${result.item.title}"></a>
                </li>`
            ).join('');

            searchResults.innerHTML = resultSet;
            resultsAvailable = true;
            first = searchResults.firstElementChild;
            last = searchResults.lastElementChild;
        } else {
            resultsAvailable = false;
            searchResults.innerHTML = '';
        }
    };

    const debouncedSearch = debounce(executeSearch, 300);

    const resetSearch = () => {
        resultsAvailable = false;
        searchResults.innerHTML = searchInput.value = '';
        searchInput.focus();
    };
    
    const setActiveElement = (el) => {
        document.querySelectorAll('.focus').forEach(element => element.classList.remove('focus'));
        if (el) {
            el.focus();
            current_elem = el;
            if (el.parentElement.tagName === 'LI') {
                 el.parentElement.classList.add('focus');
            }
        }
    };

    // Olay Dinleyicileri (Event Listeners)
    searchInput.addEventListener('keyup', (e) => {
        debouncedSearch(e.target.value.trim());
    });
    
    searchInput.addEventListener('search', (e) => {
        if (!e.target.value) resetSearch();
    });

    document.addEventListener('keydown', (e) => {
        const key = e.key;
        const activeEl = document.activeElement;

        if (key === 'Escape') {
            resetSearch();
            return;
        }
        
        // Sadece arama kutusu veya sonuçlar aktifken klavye navigasyonunu çalıştır
        if (!resultsAvailable || !searchbox.contains(activeEl)) return;

        switch(key) {
            case 'ArrowDown':
                e.preventDefault();
                if (activeEl === searchInput) {
                    setActiveElement(first?.lastElementChild);
                } else if (activeEl.parentElement !== last) {
                    setActiveElement(activeEl.parentElement.nextElementSibling?.lastElementChild);
                }
                break;
            case 'ArrowUp':
                e.preventDefault();
                 if (activeEl.parentElement === first) {
                    setActiveElement(searchInput);
                } else if (activeEl !== searchInput) {
                    setActiveElement(activeEl.parentElement.previousElementSibling?.lastElementChild);
                }
                break;
            case 'ArrowRight':
            case 'Enter': // Enter tuşunu da eklemek kullanışlı olur
                if(activeEl !== searchInput) {
                    activeEl.click();
                }
                break;
        }
    });

    // Script başladığında arama indeksini yükle
    loadSearchIndex();
});