/* ME·WORLD — site.js
   阅读进度 / 目录 TOC / 返回顶部 / 站内搜索 / 代码复制 / 滚动显现 / 阅读时长 */
(function () {
    'use strict';

    var $ = function (s, c) { return (c || document).querySelector(s); };
    var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

    /* ---------- 1. 阅读进度条（文章页） ---------- */
    var bar = $('#progress-bar');
    var onScroll = function () {
        if (!bar) return;
        var doc = document.documentElement;
        var max = doc.scrollHeight - window.innerHeight;
        var ratio = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
        bar.style.width = (ratio * 100).toFixed(2) + '%';
        if (backTop) backTop.classList.toggle('show', window.scrollY > 600);
    };

    /* ---------- 2. 返回顶部 ---------- */
    var backTop = $('#back-top');
    if (backTop) {
        backTop.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* ---------- 3. 目录 TOC + 滚动定位 ---------- */
    var content = $('.article .content');
    var tocBox = $('#toc');
    if (content && tocBox) {
        var heads = $$('h2, h3', content);
        if (heads.length) {
            heads.forEach(function (h, i) {
                if (!h.id) h.id = 'sec-' + i;
                var a = document.createElement('a');
                a.href = '#' + h.id;
                a.textContent = h.textContent.replace(/^§\s*/, '');
                a.className = h.tagName === 'H3' ? 'toc-h3' : 'toc-h2';
                tocBox.appendChild(a);
            });
            var links = $$('a', tocBox);
            var spy = function () {
                var cur = -1;
                heads.forEach(function (h, i) {
                    if (h.getBoundingClientRect().top < 120) cur = i;
                });
                links.forEach(function (a, i) {
                    a.classList.toggle('active', i === cur);
                });
            };
            window.addEventListener('scroll', spy, { passive: true });
            spy();
        } else {
            $('#toc-wrap').style.display = 'none';
        }
    }

    /* ---------- 4. 阅读时长（文章页） ---------- */
    var rt = $('#reading-time');
    if (rt && content) {
        var chars = content.textContent.replace(/\s/g, '').length;
        rt.textContent = '约 ' + Math.max(1, Math.round(chars / 400)) + ' 分钟读完';
    }

    /* ---------- 5. 代码块复制 ---------- */
    $$('pre').forEach(function (pre) {
        var btn = document.createElement('button');
        btn.className = 'code-copy';
        btn.type = 'button';
        btn.textContent = '复制';
        btn.addEventListener('click', function () {
            var code = $('code', pre);
            var text = code ? code.textContent : pre.textContent;
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(text).then(function () {
                    btn.textContent = '已复制 ✓';
                    setTimeout(function () { btn.textContent = '复制'; }, 1600);
                });
            }
        });
        pre.appendChild(btn);
    });

    /* ---------- 6. 滚动显现 ---------- */
    if ('IntersectionObserver' in window) {
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (e.isIntersecting) {
                    e.target.classList.add('in');
                    io.unobserve(e.target);
                }
            });
        }, { threshold: 0.08 });
        $$('.reveal').forEach(function (el) { io.observe(el); });
    } else {
        $$('.reveal').forEach(function (el) { el.classList.add('in'); });
    }

    /* ---------- 7. 站内搜索 ---------- */
    var overlay = $('#search-overlay');
    var searchInput = $('#search-input');
    var searchResults = $('#search-results');
    var searchIndex = null;
    var selIdx = -1;

    function openSearch() {
        if (!overlay) return;
        overlay.classList.add('open');
        searchInput.value = '';
        searchResults.innerHTML = '';
        setTimeout(function () { searchInput.focus(); }, 40);
    }

    function closeSearch() {
        if (overlay) overlay.classList.remove('open');
        selIdx = -1;
    }

    function esc(s) {
        return s.replace(/[&<>"']/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    }

    function mark(text, q) {
        if (!q) return esc(text);
        var i = text.toLowerCase().indexOf(q.toLowerCase());
        if (i < 0) return esc(text);
        return esc(text.slice(0, i)) + '<mark>' + esc(text.slice(i, i + q.length)) + '</mark>' + esc(text.slice(i + q.length));
    }

    function renderResults(q) {
        if (!searchIndex || !q) { searchResults.innerHTML = ''; return; }
        var ql = q.toLowerCase();
        var hits = searchIndex.filter(function (p) {
            return (p.title + ' ' + (p.tag || '') + ' ' + (p.summary || '') + ' ' + (p.text || '')).toLowerCase().indexOf(ql) >= 0;
        }).slice(0, 8);
        if (!hits.length) {
            searchResults.innerHTML = '<div class="search-hint">没有找到与「' + esc(q) + '」相关的内容</div>';
            return;
        }
        searchResults.innerHTML = hits.map(function (p) {
            return '<a class="search-hit" href="' + p.url + '"><div class="ht">' + mark(p.title, q) +
                ' <span style="font-weight:400;color:var(--ink-faint);font-size:12px">· ' + esc(p.tag || '') + '</span></div>' +
                '<div class="hs">' + mark(p.summary || '', q) + '</div></a>';
        }).join('');
        selIdx = -1;
    }

    if (overlay) {
        $$('.js-search').forEach(function (el) {
            el.addEventListener('click', openSearch);
        });
        overlay.addEventListener('click', function (e) {
            if (e.target === overlay) closeSearch();
        });
        searchInput.addEventListener('input', function () { renderResults(searchInput.value.trim()); });

        document.addEventListener('keydown', function (e) {
            if (e.key === '/' && !overlay.classList.contains('open')) {
                var t = document.activeElement && document.activeElement.tagName;
                if (t !== 'INPUT' && t !== 'TEXTAREA') { e.preventDefault(); openSearch(); }
            }
            if (e.key === 'Escape') closeSearch();
            if (overlay.classList.contains('open') && searchResults.children.length) {
                var hits = $$('.search-hit', searchResults);
                if (e.key === 'ArrowDown') { e.preventDefault(); selIdx = Math.min(selIdx + 1, hits.length - 1); }
                if (e.key === 'ArrowUp') { e.preventDefault(); selIdx = Math.max(selIdx - 1, 0); }
                if (e.key === 'Enter' && selIdx >= 0) { hits[selIdx].click(); return; }
                hits.forEach(function (h, i) { h.classList.toggle('sel', i === selIdx); });
            }
        });

        fetch('/search.json')
            .then(function (r) { return r.json(); })
            .then(function (data) { searchIndex = data; })
            .catch(function () { /* 本地预览时忽略 */ });
    }

    /* ---------- 8. 隐藏式折叠导航（汉堡菜单面板） ---------- */
    var burger = $('.nav-burger');
    var panel = $('.nav-panel');
    if (burger && panel) {
        var closePanel = function () {
            panel.classList.remove('open');
            burger.classList.remove('open');
            burger.setAttribute('aria-expanded', 'false');
        };

        burger.addEventListener('click', function (e) {
            e.stopPropagation();
            var willOpen = !panel.classList.contains('open');
            panel.classList.toggle('open', willOpen);
            burger.classList.toggle('open', willOpen);
            burger.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
        });

        // 点击面板外任意处收起（面板自身点击不冒泡）
        panel.addEventListener('click', function (e) { e.stopPropagation(); });
        document.addEventListener('click', closePanel);
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') closePanel();
        });

        // 当前页在面板内 → 金色高亮 + 汉堡按钮加金点
        var here = location.pathname.split('/').pop() || 'index.html';
        var cur = $('.nav-panel a[href="' + here + '"]');
        if (cur) {
            cur.classList.add('now');
            burger.classList.add('active');
        }
    }

    /* ---------- 9. 移动端文章目录（桌面端仍用侧栏 TOC） ---------- */
    var content9 = $('.article .content');
    if (content9 && document.querySelector('.toc')) {
        var heads9 = $$('h2, h3', content9).filter(function (h) { return h.id; });
        if (heads9.length > 1) {
            var det = document.createElement('details');
            det.className = 'toc-mobile';
            var sum = document.createElement('summary');
            sum.textContent = '目录 · 本页内容（' + heads9.length + ' 节）';
            det.appendChild(sum);
            heads9.forEach(function (h) {
                var a = document.createElement('a');
                a.href = '#' + h.id;
                a.textContent = h.textContent;
                a.style.paddingLeft = (h.tagName === 'H3') ? '28px' : '14px';
                det.appendChild(a);
            });
            content9.parentNode.insertBefore(det, content9);
        }
    }

    /* ---------- 10. 首页统计动态化 ---------- */
    var statPosts = $('#stat-posts');
    if (statPosts) {
        var rows = $$('.post-row').length;
        if (rows) statPosts.textContent = rows;
        var chips = $$('.tag-chip').length;
        var tagStat = document.querySelector('.hero-stats .stat:nth-child(2) .num');
        if (tagStat && chips) tagStat.textContent = chips;
    }
})();
