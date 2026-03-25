/**
 * НЕЙРОМЕДИА — Общие компоненты (шапка, подвал, модал)
 * Подключать ПОСЛЕДНИМ скриптом перед </body>:
 *   <script src="js/components.js"></script>
 *   <script src="js/audit-form.js"></script>
 */

(function () {

    // =====================================================
    //  КОНФИГУРАЦИЯ НАВИГАЦИИ
    // =====================================================
    const NAV_LINKS = [
        { href: 'index.html',      label: 'Главная' },
        { href: 'niches.html',     label: 'Ниши' },
        { href: 'assistants.html', label: 'Ассистенты' },
        { href: 'social.html',     label: 'Соцсети' },
    ];

    // Определяем текущую страницу
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    function buildLinks(items) {
        return items.map(({ href, label }) => {
            const cls = currentPage === href ? ' class="active"' : '';
            return `<a href="${href}"${cls}>${label}</a>`;
        }).join('');
    }

    // =====================================================
    //  HTML: ШАПКА
    // =====================================================
    const HEADER_HTML = `
<nav class="site-nav" id="siteNav">
    <div class="nav-inner">
        <a href="index.html" class="logo">
            <div class="logo-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                    <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
                    <path d="M10 13l2 2 4-4" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
            <span class="logo-text">НЕЙРОМЕДИА</span>
        </a>

        <div class="nav-links">
            ${buildLinks(NAV_LINKS)}
        </div>

        <div class="nav-actions">
            <button class="btn-audit" onclick="openBriefModal()">АУДИТ</button>
            <a href="https://vk.com/neuro_media_nn" target="_blank" class="btn-vk">ВКОНТАКТЕ</a>
        </div>

        <button class="nav-burger" id="navBurger" aria-label="Меню">
            <span></span><span></span><span></span>
        </button>
    </div>

    <div class="nav-mobile" id="navMobile">
        ${buildLinks(NAV_LINKS)}
        <button class="btn-audit" onclick="openBriefModal(); closeMenu();">ПОЛУЧИТЬ АУДИТ</button>
        <a href="https://vk.com/neuro_media_nn" target="_blank" class="btn-vk">ВКОНТАКТЕ</a>
    </div>
</nav>`;

    // =====================================================
    //  HTML: ПОДВАЛ
    // =====================================================
    const FOOTER_HTML = `
<footer class="site-footer">
    <div class="footer-inner">
        <div class="footer-grid">
            <div class="footer-col">
                <span class="footer-brand">НЕЙРОМЕДИА</span>
                <p>Автоматизируем рутину. Прибыль растёт.<br>Менеджеры занимаются стратегией.</p>
            </div>
            <div class="footer-col">
                <h4>Навигация</h4>
                ${NAV_LINKS.map(({ href, label }) => `<a href="${href}">${label}</a>`).join('')}
            </div>
            <div class="footer-col">
                <h4>Контакты</h4>
                <a class="footer-phone" href="tel:+79092959958">+7 (909) 295-99-58</a>
                <p>Дзержинск, Октябрьская 66</p>
                <p>Ответ в течение часа</p>
                <a href="https://vk.com/neuro_media_nn" target="_blank">ВКонтакте</a>
            </div>
        </div>
        <div class="footer-bottom">
            <p>© 2026 НЕЙРОМЕДИА. Все права защищены.</p>
        </div>
    </div>
</footer>`;

    // =====================================================
    //  HTML: МОДАЛЬНОЕ ОКНО АУДИТА
    // =====================================================
    const MODAL_HTML = `
<div id="briefModal">
    <div class="modal-content">
        <div style="padding:20px 24px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #222;">
            <div>
                <h3 style="font-size:20px;font-weight:800;margin-bottom:4px;">Бесплатный аудит</h3>
                <p style="font-size:12px;color:#888;">2 минуты на заполнение</p>
            </div>
            <button onclick="closeBriefModal()" style="background:none;border:none;color:#999;cursor:pointer;padding:0;font-size:24px;">✕</button>
        </div>
        <div class="step-indicator" id="stepIndicator"></div>
        <form id="briefForm" onsubmit="event.preventDefault(); submitBrief();">
            <div id="stepContainer" style="padding:24px 20px;min-height:300px;"></div>
            <div class="brief-footer">
                <button type="button" id="prevStepBtn" class="brief-btn secondary" onclick="prevStep()" style="visibility:hidden;">← Назад</button>
                <span id="stepCounter" style="font-size:12px;color:#888;">Шаг 1/6</span>
                <button type="button" id="nextStepBtn" class="brief-btn primary" onclick="nextStep()">Далее →</button>
                <button type="submit" id="submitBtn" class="brief-btn primary" style="display:none;">Получить аудит</button>
            </div>
        </form>
    </div>
</div>`;

    // =====================================================
    //  МОНТИРОВАНИЕ
    // =====================================================
    function mount() {
        // Шапка: заменяем placeholder или вставляем первым в body
        const headerSlot = document.getElementById('site-header');
        if (headerSlot) {
            headerSlot.outerHTML = HEADER_HTML;
        } else if (!document.querySelector('.site-nav')) {
            document.body.insertAdjacentHTML('afterbegin', HEADER_HTML);
        }

        // Подвал: заменяем placeholder
        const footerSlot = document.getElementById('site-footer');
        if (footerSlot) {
            footerSlot.outerHTML = FOOTER_HTML;
        }

        // Модал: вставляем, только если ещё нет на странице
        if (!document.getElementById('briefModal')) {
            document.body.insertAdjacentHTML('beforeend', MODAL_HTML);
        }

        initBurger();
        initScrollAnimations();
    }

    // =====================================================
    //  БУРГЕР-МЕНЮ
    // =====================================================
    function initBurger() {
        const burger = document.getElementById('navBurger');
        const mobile = document.getElementById('navMobile');
        if (!burger || !mobile) return;

        burger.addEventListener('click', () => {
            burger.classList.toggle('open');
            mobile.classList.toggle('open');
        });

        // Закрывать при клике на ссылку
        mobile.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', () => {
                burger.classList.remove('open');
                mobile.classList.remove('open');
            });
        });
    }

    // Глобальная функция для кнопки «Аудит» в мобильном меню
    window.closeMenu = function () {
        const burger = document.getElementById('navBurger');
        const mobile = document.getElementById('navMobile');
        if (burger) burger.classList.remove('open');
        if (mobile) mobile.classList.remove('open');
    };

    // =====================================================
    //  АНИМАЦИИ ПРИ СКРОЛЛЕ
    // =====================================================
    function initScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
    }

    // =====================================================
    //  ЗАПУСК
    // =====================================================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', mount);
    } else {
        mount();
    }

})();
