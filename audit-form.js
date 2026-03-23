// ========== ЕДИНАЯ ФОРМА АУДИТА ДЛЯ ВСЕХ СТРАНИЦ ==========

let currentStep = 0;
let formData = {
    name: '', 
    phone: '', 
    company: '', 
    industry: '', 
    city: '', 
    business_age: '',
    inn: '', 
    site: '', 
    vk: '', 
    telegram: '', 
    instagram: '',
    yandex: '', 
    avito: '', 
    other_links: '',
    problems: [], 
    goals: [], 
    automation_vision: '',
    result_goal: [],
    page: window.location.pathname,
    timestamp: new Date().toISOString()
};

const steps = [
    { title: 'Контактные данные', fields: ['name','phone'] },
    { title: 'О бизнесе', fields: ['company','industry','city','business_age'] },
    { title: 'Ваше присутствие в сети', fields: ['inn','site','vk','telegram','instagram','yandex','avito','other_links'] },
    { title: 'Где болит?', type: 'problems' },
    { title: 'Что улучшить в первую очередь?', type: 'goals' },
    { title: 'Какой результат ждёте за 6 месяцев?', type: 'final' }
];

// ========== ГЛОБАЛЬНЫЕ ФУНКЦИИ ==========
window.openBriefModal = () => {
    const modal = document.getElementById('briefModal');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        currentStep = 0;
        resetForm();
        renderStep();
    }
};

window.closeBriefModal = () => {
    const modal = document.getElementById('briefModal');
    const stepIndicator = document.getElementById('stepIndicator');
    const stepCounter = document.getElementById('stepCounter');
    
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    
    // Восстанавливаем индикатор шагов для следующего открытия
    if (stepIndicator) stepIndicator.style.display = 'flex';
    if (stepCounter) stepCounter.style.display = 'inline-block';
    
    // Сбрасываем форму
    currentStep = 0;
    resetForm();
};

window.nextStep = () => {
    // Сохраняем текущий шаг перед переходом
    if (currentStep === 0) {
        formData.name = document.getElementById('field_name')?.value || '';
        formData.phone = document.getElementById('field_phone')?.value || '';
        
        // Валидация шага 1
        if (!formData.name || !formData.phone) {
            alert('❌ Заполните имя и телефон');
            return;
        }
    } 
    else if (currentStep === 1) {
        formData.company = document.getElementById('field_company')?.value || '';
        formData.industry = document.getElementById('field_industry')?.value || '';
        formData.city = document.getElementById('field_city')?.value || '';
        formData.business_age = document.getElementById('field_business_age')?.value || '';
        
        // Валидация шага 2
        if (!formData.company || !formData.industry) {
            alert('❌ Заполните название компании и сферу деятельности');
            return;
        }
    } 
    else if (currentStep === 2) {
        formData.inn = document.getElementById('field_inn')?.value || '';
        formData.site = document.getElementById('field_site')?.value || '';
        formData.vk = document.getElementById('field_vk')?.value || '';
        formData.telegram = document.getElementById('field_telegram')?.value || '';
        formData.instagram = document.getElementById('field_instagram')?.value || '';
        formData.yandex = document.getElementById('field_yandex')?.value || '';
        formData.avito = document.getElementById('field_avito')?.value || '';
        formData.other_links = document.getElementById('field_other_links')?.value || '';
    } 
    else if (currentStep === 3) {
        // Валидация шага 4 (проблемы)
        if (formData.problems.length === 0) {
            alert('❌ Выберите хотя бы одну проблему');
            return;
        }
    }
    else if (currentStep === 4) {
        // Сохраняем vision и проверяем выбранные цели
        formData.automation_vision = document.getElementById('field_vision')?.value || '';
        formData.goals = Array.from(document.querySelectorAll('.goal-card.selected')).map(el => el.dataset.goal);
        
        // Валидация шага 5
        if (formData.goals.length === 0) {
            alert('❌ Выберите хотя бы одну цель');
            return;
        }
    }
    else if (currentStep === 5) {
        // Сохраняем финальные результаты
        formData.result_goal = Array.from(document.querySelectorAll('.goal-card.selected')).map(el => el.dataset.result);
    }

    if (currentStep < steps.length - 1) {
        currentStep++;
        renderStep();
    }
};

window.prevStep = () => {
    if (currentStep > 0) {
        currentStep--;
        renderStep();
    }
};

window.submitBrief = () => {
    // Финальное сохранение результатов
    formData.result_goal = Array.from(document.querySelectorAll('.goal-card.selected')).map(el => el.dataset.result);
    
    // Финальная валидация
    if (!formData.name || !formData.phone) {
        alert('❌ Заполните контактные данные');
        return;
    }
    
    if (formData.problems.length === 0) {
        alert('❌ Выберите проблемы');
        return;
    }
    
    if (formData.goals.length === 0) {
        alert('❌ Выберите цели');
        return;
    }
    
    if (formData.result_goal.length === 0) {
        alert('❌ Выберите желаемые результаты');
        return;
    }
    
    // Отправляем на N8N
    sendToN8N(formData);
};

// ========== ФУНКЦИЯ ОТПРАВКИ НА N8N ==========
function sendToN8N(data) {
    // ⭐ WEBHOOK URL
    const webhookUrl = 'https://n8n.n-shilova.ru/webhook/brief';
    
    // Проверка
    if (webhookUrl.includes('YOUR_')) {
        alert('⚠️ Ошибка конфигурации: вставьте URL webhook из n8n');
        console.error('Webhook URL не установлен!');
        return;
    }
    
    // Преобразуем данные для отправки в Google Sheets
    const payload = {
        // Личные данные
        name: data.name || '',
        phone: data.phone || '',
        
        // О бизнесе
        company: data.company || '',
        industry: data.industry || '',
        city: data.city || '',
        business_age: data.business_age || '',
        
        // Присутствие в сети
        inn: data.inn || '',
        site: data.site || '',
        vk: data.vk || '',
        telegram: data.telegram || '',
        instagram: data.instagram || '',
        yandex: data.yandex || '',
        avito: data.avito || '',
        other_links: data.other_links || '',
        
        // Проблемы и цели
        problems: data.problems.join('; ') || '',
        goals: data.goals.join('; ') || '',
        automation_vision: data.automation_vision || '',
        result_goal: data.result_goal.join('; ') || '',
        
        // Служебные данные
        page_source: data.page || '',
        submitted_at: new Date().toLocaleString('ru-RU'),
        timestamp: new Date().toISOString()
    };

    console.log('📤 Отправляю данные на N8N:', payload);

    // Блокируем кнопку отправки
    const submitBtn = document.getElementById('submitBtn');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Отправляю...';
    }

    fetch(webhookUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(payload),
        mode: 'cors'
    })
    .then(response => {
        console.log('✅ Response status:', response.status);
        
        if (!response.ok) {
            throw new Error(`HTTP Error ${response.status}`);
        }
        
        return response.json().catch(() => ({ success: true }));
    })
    .then(responseData => {
        console.log('✅ Успешно отправлено на N8N:', responseData);
        
        // Показываем сообщение об успехе
        showSuccessModal(formData.phone);
        
        // Закрываем модалку через 3 секунды
        setTimeout(() => {
            closeBriefModal();
        }, 3000);
    })
    .catch(error => {
        console.error('❌ Ошибка отправки:', error);
        
        let errorMessage = 'Ошибка отправки формы';
        
        if (error.message.includes('Failed to fetch')) {
            errorMessage = 'Ошибка сети. Проверьте интернет и попробуйте снова';
        } else if (error.message.includes('HTTP Error')) {
            errorMessage = `Ошибка сервера: ${error.message}`;
        }
        
        alert(`❌ ${errorMessage}\n\nОпишите проблему в VK: vk.com/neuro_media_nn`);
        
        // Разблокируем кнопку
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Получить аудит';
        }
    });
}

// ========== ПОКАЗ УСПЕШНОГО СООБЩЕНИЯ ==========
function showSuccessModal(phone) {
    const stepContainer = document.getElementById('stepContainer');
    const stepIndicator = document.getElementById('stepIndicator');
    const stepCounter = document.getElementById('stepCounter');
    const footer = document.querySelector('.brief-footer');
    
    // Скрываем индикатор шагов
    if (stepIndicator) stepIndicator.style.display = 'none';
    if (stepCounter) stepCounter.style.display = 'none';
    
    // Показываем успешное сообщение
    stepContainer.innerHTML = `
        <div style="text-align: center; padding: 2rem 1rem;">
            <div style="font-size: 3rem; margin-bottom: 1.5rem; animation: successBounce 0.6s ease-in-out;">✓</div>
            <h2 style="font-size: 1.5rem; font-weight: 800; color: #00D9FF; margin-bottom: 0.5rem;">Спасибо!</h2>
            <p style="color: #888; margin-bottom: 1.5rem; font-size: 1rem;">Ваша заявка успешно принята</p>
            <div style="background: rgba(0, 217, 255, 0.1); border: 1px solid rgba(0, 217, 255, 0.3); padding: 1.5rem; border-radius: 12px; margin-bottom: 1.5rem;">
                <p style="color: #666; font-size: 0.9rem; margin-bottom: 0.5rem;">Мы свяжемся с вами по номеру:</p>
                <p style="font-size: 1.1rem; color: #00D9FF; font-weight: 700;">${phone}</p>
                <p style="color: #666; font-size: 0.85rem; margin-top: 0.5rem;">в течение 2 часов с полным анализом и планом</p>
            </div>
            <p style="font-size: 0.85rem; color: #666;">Номер заявки: <strong>${Math.random().toString(36).substring(7).toUpperCase()}</strong></p>
        </div>
    `;
    
    // Обновляем кнопки в footer
    footer.innerHTML = `
        <button type="button" class="brief-btn primary" onclick="closeBriefModal()" style="width: 100%; text-align: center;">Закрыть</button>
    `;
}

// ========== РЕНДЕР ШАГА ФОРМЫ ==========
function renderStep() {
    const stepContainer = document.getElementById('stepContainer');
    const stepIndicator = document.getElementById('stepIndicator');
    const stepCounter = document.getElementById('stepCounter');
    const prevBtn = document.getElementById('prevStepBtn');
    const nextBtn = document.getElementById('nextStepBtn');
    const submitBtn = document.getElementById('submitBtn');

    if (!stepContainer) return;

    // Показываем индикатор и счетчик
    if (stepIndicator) stepIndicator.style.display = 'flex';
    if (stepCounter) stepCounter.style.display = 'inline-block';

    let html = '';
    const step = steps[currentStep];
    
    // Точки прогресса
    let dots = '';
    for (let i = 0; i < steps.length; i++) {
        dots += `<div class="step-dot ${i === currentStep ? 'active' : ''}"></div>`;
    }
    if (stepIndicator) stepIndicator.innerHTML = dots;
    if (stepCounter) stepCounter.innerText = `Шаг ${currentStep + 1}/${steps.length}`;
    
    // Рендер контента каждого шага
    if (currentStep === 0) {
        html = `
            <h4 style="font-size: 16px; font-weight: 700; margin-bottom: 20px;">${step.title}</h4>
            <input type="text" placeholder="Ваше имя" id="field_name" value="${formData.name}" style="width: 100%; background: #000; border: 1px solid #333; padding: 12px; border-radius: 8px; margin-bottom: 12px; color: white; font-size: 14px; transition: all 0.3s ease;" onfocus="this.style.borderColor='#00D9FF'; this.style.boxShadow='0 0 15px rgba(0,217,255,0.2)';" onblur="this.style.borderColor='#333'; this.style.boxShadow='none';">
            <input type="tel" placeholder="Телефон или Telegram" id="field_phone" value="${formData.phone}" style="width: 100%; background: #000; border: 1px solid #333; padding: 12px; border-radius: 8px; color: white; font-size: 14px; transition: all 0.3s ease;" onfocus="this.style.borderColor='#00D9FF'; this.style.boxShadow='0 0 15px rgba(0,217,255,0.2)';" onblur="this.style.borderColor='#333'; this.style.boxShadow='none';">
        `;
    }
    else if (currentStep === 1) {
        html = `
            <h4 style="font-size: 16px; font-weight: 700; margin-bottom: 20px;">${step.title}</h4>
            <input type="text" placeholder="Название компании" id="field_company" value="${formData.company}" style="width: 100%; background: #000; border: 1px solid #333; padding: 12px; border-radius: 8px; margin-bottom: 12px; color: white; font-size: 14px; transition: all 0.3s ease;" onfocus="this.style.borderColor='#00D9FF'; this.style.boxShadow='0 0 15px rgba(0,217,255,0.2)';" onblur="this.style.borderColor='#333'; this.style.boxShadow='none';">
            <input type="text" placeholder="Сфера деятельности" id="field_industry" value="${formData.industry}" style="width: 100%; background: #000; border: 1px solid #333; padding: 12px; border-radius: 8px; margin-bottom: 12px; color: white; font-size: 14px; transition: all 0.3s ease;" onfocus="this.style.borderColor='#00D9FF'; this.style.boxShadow='0 0 15px rgba(0,217,255,0.2)';" onblur="this.style.borderColor='#333'; this.style.boxShadow='none';">
            <input type="text" placeholder="Город" id="field_city" value="${formData.city}" style="width: 100%; background: #000; border: 1px solid #333; padding: 12px; border-radius: 8px; margin-bottom: 12px; color: white; font-size: 14px; transition: all 0.3s ease;" onfocus="this.style.borderColor='#00D9FF'; this.style.boxShadow='0 0 15px rgba(0,217,255,0.2)';" onblur="this.style.borderColor='#333'; this.style.boxShadow='none';">
            <select id="field_business_age" style="width: 100%; background: #000; border: 1px solid #333; padding: 12px; border-radius: 8px; color: white; font-size: 14px; cursor: pointer; transition: all 0.3s ease;" onfocus="this.style.borderColor='#00D9FF'; this.style.boxShadow='0 0 15px rgba(0,217,255,0.2)';" onblur="this.style.borderColor='#333'; this.style.boxShadow='none';">
                <option value="">Выберите возраст бизнеса</option>
                <option value="до 1 года" ${formData.business_age === 'до 1 года' ? 'selected' : ''}>до 1 года</option>
                <option value="1-3 года" ${formData.business_age === '1-3 года' ? 'selected' : ''}>1-3 года</option>
                <option value="3-7 лет" ${formData.business_age === '3-7 лет' ? 'selected' : ''}>3-7 лет</option>
                <option value="7+ лет" ${formData.business_age === '7+ лет' ? 'selected' : ''}>7+ лет</option>
            </select>
        `;
    }
    else if (currentStep === 2) {
        html = `
            <h4 style="font-size: 16px; font-weight: 700; margin-bottom: 20px;">${step.title}</h4>
            <input type="text" placeholder="ИНН компании" id="field_inn" value="${formData.inn}" style="width: 100%; background: #000; border: 1px solid #333; padding: 12px; border-radius: 8px; margin-bottom: 12px; color: white; font-size: 14px; transition: all 0.3s ease;" onfocus="this.style.borderColor='#00D9FF'; this.style.boxShadow='0 0 15px rgba(0,217,255,0.2)';" onblur="this.style.borderColor='#333'; this.style.boxShadow='none';">
            <input type="text" placeholder="Сайт (если есть)" id="field_site" value="${formData.site}" style="width: 100%; background: #000; border: 1px solid #333; padding: 12px; border-radius: 8px; margin-bottom: 12px; color: white; font-size: 14px; transition: all 0.3s ease;" onfocus="this.style.borderColor='#00D9FF'; this.style.boxShadow='0 0 15px rgba(0,217,255,0.2)';" onblur="this.style.borderColor='#333'; this.style.boxShadow='none';">
            <input type="text" placeholder="VK группа" id="field_vk" value="${formData.vk}" style="width: 100%; background: #000; border: 1px solid #333; padding: 12px; border-radius: 8px; margin-bottom: 12px; color: white; font-size: 14px; transition: all 0.3s ease;" onfocus="this.style.borderColor='#00D9FF'; this.style.boxShadow='0 0 15px rgba(0,217,255,0.2)';" onblur="this.style.borderColor='#333'; this.style.boxShadow='none';">
            <input type="text" placeholder="Telegram канал" id="field_telegram" value="${formData.telegram}" style="width: 100%; background: #000; border: 1px solid #333; padding: 12px; border-radius: 8px; margin-bottom: 12px; color: white; font-size: 14px; transition: all 0.3s ease;" onfocus="this.style.borderColor='#00D9FF'; this.style.boxShadow='0 0 15px rgba(0,217,255,0.2)';" onblur="this.style.borderColor='#333'; this.style.boxShadow='none';">
            <input type="text" placeholder="Instagram" id="field_instagram" value="${formData.instagram}" style="width: 100%; background: #000; border: 1px solid #333; padding: 12px; border-radius: 8px; margin-bottom: 12px; color: white; font-size: 14px; transition: all 0.3s ease;" onfocus="this.style.borderColor='#00D9FF'; this.style.boxShadow='0 0 15px rgba(0,217,255,0.2)';" onblur="this.style.borderColor='#333'; this.style.boxShadow='none';">
            <input type="text" placeholder="Яндекс.Бизнес / Карты" id="field_yandex" value="${formData.yandex}" style="width: 100%; background: #000; border: 1px solid #333; padding: 12px; border-radius: 8px; margin-bottom: 12px; color: white; font-size: 14px; transition: all 0.3s ease;" onfocus="this.style.borderColor='#00D9FF'; this.style.boxShadow='0 0 15px rgba(0,217,255,0.2)';" onblur="this.style.borderColor='#333'; this.style.boxShadow='none';">
            <input type="text" placeholder="2GIS / Avito" id="field_avito" value="${formData.avito}" style="width: 100%; background: #000; border: 1px solid #333; padding: 12px; border-radius: 8px; margin-bottom: 12px; color: white; font-size: 14px; transition: all 0.3s ease;" onfocus="this.style.borderColor='#00D9FF'; this.style.boxShadow='0 0 15px rgba(0,217,255,0.2)';" onblur="this.style.borderColor='#333'; this.style.boxShadow='none';">
            <input type="text" placeholder="Другие площадки" id="field_other_links" value="${formData.other_links}" style="width: 100%; background: #000; border: 1px solid #333; padding: 12px; border-radius: 8px; color: white; font-size: 14px; transition: all 0.3s ease;" onfocus="this.style.borderColor='#00D9FF'; this.style.boxShadow='0 0 15px rgba(0,217,255,0.2)';" onblur="this.style.borderColor='#333'; this.style.boxShadow='none';">
        `;
    }
    else if (currentStep === 3) {
        const problemsList = [
            'Нет постоянного потока клиентов',
            'Много ручной работы',
            'Не хватает времени на развитие',
            'Сложно контролировать работников',
            'Теряются заявки',
            'Сложно анализировать данные',
            'Маркетинг не дает результата'
        ];
        html = `<h4 style="font-size: 16px; font-weight: 700; margin-bottom: 20px;">Выберите 3-5 проблем:</h4><div style="display: grid; gap: 12px;">`;
        problemsList.forEach(p => {
            const checked = formData.problems.includes(p) ? 'selected' : '';
            html += `<div class="problem-card ${checked}" data-problem="${p}" onclick="toggleProblem(this)" style="background: #111; border: 1px solid #222; border-radius: 12px; padding: 14px; cursor: pointer; font-size: 14px; transition: all 0.3s; user-select: none;">${p}</div>`;
        });
        html += `</div>`;
    }
    else if (currentStep === 4) {
        const goalsList = [
            'Получать больше клиентов',
            'Сократить ручной труд',
            'Систематизировать процессы',
            'Увеличить прибыль',
            'Высвободить время',
            'Наладить маркетинг'
        ];
        html = `<h4 style="font-size: 16px; font-weight: 700; margin-bottom: 20px;">Выберите приоритеты:</h4><div style="display: grid; gap: 12px;">`;
        goalsList.forEach(g => {
            const checked = formData.goals.includes(g) ? 'selected' : '';
            html += `<div class="goal-card ${checked}" data-goal="${g}" onclick="toggleGoal(this)" style="background: #111; border: 1px solid #222; border-radius: 12px; padding: 14px; cursor: pointer; font-size: 14px; transition: all 0.3s; user-select: none;">${g}</div>`;
        });
        html += `<textarea placeholder="Как должна выглядеть идеальная система?" id="field_vision" style="width: 100%; background: #000; border: 1px solid #333; padding: 12px; border-radius: 8px; margin-top: 12px; color: white; font-size: 14px; font-family: inherit; transition: all 0.3s ease; resize: vertical;" rows="3" onfocus="this.style.borderColor='#00D9FF'; this.style.boxShadow='0 0 15px rgba(0,217,255,0.2)';" onblur="this.style.borderColor='#333'; this.style.boxShadow='none';">${formData.automation_vision}</textarea>`;
        html += `</div>`;
    }
    else if (currentStep === 5) {
        const resultGoals = [
            'Увеличить доход в 2 раза',
            'Сократить затраты на 50%',
            'Избежать найма новых людей',
            'Наладить контроль',
            'Масштабировать спокойно'
        ];
        html = `<h4 style="font-size: 16px; font-weight: 700; margin-bottom: 20px;">Ваши цели на 6 месяцев:</h4><div style="display: grid; gap: 12px;">`;
        resultGoals.forEach(r => {
            const checked = formData.result_goal.includes(r) ? 'selected' : '';
            html += `<div class="goal-card ${checked}" data-result="${r}" onclick="toggleResult(this)" style="background: #111; border: 1px solid #222; border-radius: 12px; padding: 14px; cursor: pointer; font-size: 14px; transition: all 0.3s; user-select: none;">${r}</div>`;
        });
        html += `</div>`;
    }

    stepContainer.innerHTML = html;
    updateNavButtons();
}

// ========== ПЕРЕКЛЮЧАТЕЛИ КАРТОЧЕК ==========
window.toggleProblem = (el) => {
    const prob = el.dataset.problem;
    if (formData.problems.includes(prob)) {
        formData.problems = formData.problems.filter(p => p !== prob);
        el.classList.remove('selected');
    } else {
        formData.problems.push(prob);
        el.classList.add('selected');
    }
};

window.toggleGoal = (el) => {
    const goal = el.dataset.goal;
    if (formData.goals.includes(goal)) {
        formData.goals = formData.goals.filter(g => g !== goal);
        el.classList.remove('selected');
    } else {
        formData.goals.push(goal);
        el.classList.add('selected');
    }
};

window.toggleResult = (el) => {
    const res = el.dataset.result;
    if (formData.result_goal.includes(res)) {
        formData.result_goal = formData.result_goal.filter(r => r !== res);
        el.classList.remove('selected');
    } else {
        formData.result_goal.push(res);
        el.classList.add('selected');
    }
};

// ========== ОБНОВЛЕНИЕ КНОПОК НАВИГАЦИИ ==========
function updateNavButtons() {
    const prevBtn = document.getElementById('prevStepBtn');
    const nextBtn = document.getElementById('nextStepBtn');
    const submitBtn = document.getElementById('submitBtn');
    
    if (prevBtn) prevBtn.style.visibility = currentStep === 0 ? 'hidden' : 'visible';
    
    if (currentStep === steps.length - 1) {
        if (nextBtn) nextBtn.style.display = 'none';
        if (submitBtn) submitBtn.style.display = 'inline-block';
    } else {
        if (nextBtn) nextBtn.style.display = 'inline-block';
        if (submitBtn) submitBtn.style.display = 'none';
    }
}

// ========== ОЧИСТКА ФОРМЫ ==========
function resetForm() {
    currentStep = 0;
    formData = {
        name: '', 
        phone: '', 
        company: '', 
        industry: '', 
        city: '', 
        business_age: '',
        inn: '', 
        site: '', 
        vk: '', 
        telegram: '', 
        instagram: '',
        yandex: '', 
        avito: '', 
        other_links: '',
        problems: [], 
        goals: [], 
        automation_vision: '',
        result_goal: [],
        page: window.location.pathname,
        timestamp: new Date().toISOString()
    };
}

// ========== ИНИЦИАЛИЗАЦИЯ ПРИ ЗАГРУЗКЕ ==========
document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ Форма аудита загружена');
    
    // Закрытие модалки по клику вне окна
    const modal = document.getElementById('briefModal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeBriefModal();
            }
        });
    }
    
    // Инициализируем первый шаг если модалка откроется
    renderStep();
});

// ========== СТИЛИ АНИМАЦИИ ==========
const style = document.createElement('style');
style.innerHTML = `
    @keyframes successBounce {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.15); }
    }
    
    .problem-card.selected,
    .goal-card.selected {
        background: rgba(0, 217, 255, 0.1) !important;
        border-color: #00D9FF !important;
        box-shadow: 0 0 15px rgba(0, 217, 255, 0.2) !important;
        transform: scale(1.02);
    }
    
    .problem-card:hover,
    .goal-card:hover {
        border-color: rgba(0, 217, 255, 0.5) !important;
        background: rgba(0, 217, 255, 0.05) !important;
        transform: translateY(-2px);
    }
`;
document.head.appendChild(style);