// Language switching functionality
let currentLang = 'en';

const translations = {
    en: {
        home: 'home',
        successStories: 'Success Stories',
        customerReviews: 'Customer reviews',
        aboutUs: 'about us',
        packages: 'Packages',
        faq: 'Faq',
        langSwitcher: 'العربية',
        joinNow: 'JOIN NOW',
        packagesWeOffer: 'Packages we offer',
        transformTitle: 'Transform Your Fitness<br>Journey with Expert Guidance.',
        tickerText: ['Live Healthy •', 'Train Smart •', 'Your Path to Strength and Confidence Starts Here •', 'Stay Strong •']
    },
    ar: {
        home: 'الرئيسية',
        successStories: 'قصص النجاح',
        customerReviews: 'آراء العملاء',
        aboutUs: 'من نحن',
        packages: 'الباقات',
        faq: 'الأسئلة الشائعة',
        langSwitcher: 'English',
        joinNow: 'انضم الآن',
        packagesWeOffer: 'الباقات المتاحة',
        transformTitle: 'حول رحلة اللياقة الخاصة بك<br>مع التوجيه المتخصص.',
        tickerText: ['عش بصحة •', 'تدرب بذكاء •', 'طريقك إلى القوة والثقة يبدأ هنا •', 'ابق قويًا •']
    }
};

function toggleLanguage(event) {
    event.preventDefault();
    currentLang = currentLang === 'en' ? 'ar' : 'en';
    
    const wrapper = document.querySelector('.language-wrapper');
    wrapper.classList.toggle('ar');
    wrapper.classList.toggle('en');
    wrapper.setAttribute('dir', currentLang === 'ar' ? 'rtl' : 'ltr');
    
    // Update all translatable elements
    document.querySelectorAll('[data-en]').forEach(el => {
        const content = el.getAttribute(`data-${currentLang}`);
        if (content) {
            el.innerHTML = content;
        }
    });
    
    // Update lang switcher text
    document.querySelectorAll('.lang-text').forEach(el => {
        el.textContent = translations[currentLang].langSwitcher;
    });
    
    // Update section headlines
    // updateSectionHeadlines(); // Commented out - now using text headings
    
    // Re-render packages and FAQ with new language
    document.getElementById('standardPackages').innerHTML = '';
    document.getElementById('vipPackages').innerHTML = '';
    document.getElementById('faqContainer').innerHTML = '';
    
    renderPackages(standardPackages, 'standardPackages');
    renderPackages(vipPackages, 'vipPackages');
    renderFAQ();
}

// Update section headline background images based on language
function updateSectionHeadlines() {
    const lang = currentLang === 'en' ? 'en' : 'ar';
    
    const headlines = {
        'success-headline': `assets/images/headlines/sucsess-${lang}.png`,
        'review-headline': `assets/images/headlines/review-${lang}.png`,
        'aboutus-headline': `assets/images/headlines/aboutus-${lang}.png`,
        'package-headline': `assets/images/headlines/package-${lang}.png`,
        'vip-headline': `assets/images/headlines/vip-${lang}.png`
    };
    
    Object.entries(headlines).forEach(([className, imagePath]) => {
        const element = document.querySelector(`.${className}`);
        if (element) {
            element.style.backgroundImage = `url('${imagePath}')`;
        }
    });
}

// Mobile menu toggle
function toggleMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    menu.classList.toggle('active');
}

// Success Stories Slider
const successImages = [
    '1-1.png','1-2.png',  '1-3.png', '1-4.png', '1-5.png', '1-6.png', '1-7.png', '1-8.png'
];

function initSuccessSlider() {
    const container = document.getElementById('successSlides');
    successImages.forEach(img => {
        const slide = document.createElement('div');
        slide.className = 'swiper-slide';
        slide.style.backgroundImage = `url('assets/images/Trans/${img}')`;
        container.appendChild(slide);
    });
    
    new Swiper('.success-swiper', {
        slidesPerView: 1,
        spaceBetween: 10,
        loop: true,
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        breakpoints: {
            640: {
                slidesPerView: 2,
                spaceBetween: 20,
            },
            968: {
                slidesPerView: 3,
                spaceBetween: 30,
            },
        },
    });
}

// Review Slider
function initReviewSlider() {
    new Swiper('.review-swiper', {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        autoplay: {
            delay: 4000,
            disableOnInteraction: false,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
    });
}

// Package data
const standardPackages = [
    {
        title: { en: '2 month', ar: 'شهرين' },
        price: '1400 EGP',
        features: [
            { en: 'Nutrition Plan based on your goal (bulking or shred)', ar: 'خطة تغذية بناءً على هدفك (زيادة أو تنشيف)' },
            { en: 'Workouts Plan based on your level it can be in Gym or Home', ar: 'خطة تمارين بناءً على مستواك في الجيم أو المنزل' },
            { en: 'Cardio & ABS routine', ar: 'روتين كارديو وبطن' },
            { en: 'Follow up on WhatsApp', ar: 'متابعة على واتساب' },
            { en: 'The plan is updated every 10-15 days, depending on the results', ar: 'يتم تحديث الخطة كل 10-15 يومًا حسب النتائج' },
            { en: 'Every 10-15 days you will resend pictures and the scale accordingly the program updated', ar: 'كل 10-15 يومًا سترسل الصور والوزن وسيتم تحديث البرنامج' }
        ],
        link: 'https://checkouts.kashier.io/en/paymentpage?ppLink=PP-841576504,live'
    },
    {
        title: { en: '3 months', ar: '3 أشهر' },
        price: '2000 EGP',
        features: [
            { en: 'Nutrition Plan based on your goal (bulking or shred)', ar: 'خطة تغذية بناءً على هدفك (زيادة أو تنشيف)' },
            { en: 'Workouts Plan based on your level it can be in Gym or Home', ar: 'خطة تمارين بناءً على مستواك في الجيم أو المنزل' },
            { en: 'Cardio & ABS routine', ar: 'روتين كارديو وبطن' },
            { en: 'Follow up on WhatsApp', ar: 'متابعة على واتساب' },
            { en: 'The plan is updated every 10-15 days, depending on the results', ar: 'يتم تحديث الخطة كل 10-15 يومًا حسب النتائج' },
            { en: 'Every 10-15 days you will resend pictures and the scale accordingly the program updated', ar: 'كل 10-15 يومًا سترسل الصور والوزن وسيتم تحديث البرنامج' }
        ],
        link: 'https://merchant.kashier.io/en/paypage/PP-841576501?mode=live'
    },
    {
        title: { en: '6 months', ar: '6 أشهر' },
        price: '3000 EGP',
        popular: true,
        features: [
            { en: 'Nutrition Plan based on your goal (bulking or shred)', ar: 'خطة تغذية بناءً على هدفك (زيادة أو تنشيف)' },
            { en: 'Workouts Plan based on your level it can be in Gym or Home', ar: 'خطة تمارين بناءً على مستواك في الجيم أو المنزل' },
            { en: 'Cardio & ABS routine', ar: 'روتين كارديو وبطن' },
            { en: 'Follow up on WhatsApp', ar: 'متابعة على واتساب' },
            { en: 'The plan is updated every 10-15 days, depending on the results', ar: 'يتم تحديث الخطة كل 10-15 يومًا حسب النتائج' },
            { en: 'Every 10-15 days you will resend pictures and the scale accordingly the program updated', ar: 'كل 10-15 يومًا سترسل الصور والوزن وسيتم تحديث البرنامج' }
        ],
        link: 'https://merchant.kashier.io/en/paypage/PP-841576502?mode=live'
    },
    {
        title: { en: '1 year', ar: 'سنة' },
        price: '4000 EGP',
        features: [
            { en: 'Nutrition Plan based on your goal (bulking or shred)', ar: 'خطة تغذية بناءً على هدفك (زيادة أو تنشيف)' },
            { en: 'Workouts Plan based on your level it can be in Gym or Home', ar: 'خطة تمارين بناءً على مستواك في الجيم أو المنزل' },
            { en: 'Cardio & ABS routine', ar: 'روتين كارديو وبطن' },
            { en: 'Follow up on WhatsApp', ar: 'متابعة على واتساب' },
            { en: 'The plan is updated every 10-15 days, depending on the results', ar: 'يتم تحديث الخطة كل 10-15 يومًا حسب النتائج' },
            { en: 'Every 10-15 days you will resend pictures and the scale accordingly the program updated', ar: 'كل 10-15 يومًا سترسل الصور والوزن وسيتم تحديث البرنامج' }
        ],
        link: 'https://merchant.kashier.io/en/paypage/PP-841576503?mode=live'
    }
];

const vipPackages = [
    {
        title: { en: '2 months', ar: 'شهرين' },
        price: '2500 EGP',
        features: [
            { en: 'Get my personal number and you can call me at any time', ar: 'احصل على رقمي الشخصي ويمكنك الاتصال بي في أي وقت' },
            { en: 'Follow up via WhatsApp and phone daily', ar: 'متابعة عبر واتساب والهاتف يوميًا' },
            { en: 'Daily call for follow-up and encouragement and see if you have any concerns', ar: 'مكالمة يومية للمتابعة والتشجيع ومعرفة أي مخاوف' },
            { en: 'Video call to check the results weekly', ar: 'مكالمة فيديو لفحص النتائج أسبوعيًا' }
        ],
        link: 'https://checkouts.kashier.io/en/paymentpage?ppLink=PP-841576508,live'
    },
    {
        title: { en: '3 months', ar: '3 أشهر' },
        price: '4000 EGP',
        popular: true,
        features: [
            { en: 'Get my personal number and you can call me at any time', ar: 'احصل على رقمي الشخصي ويمكنك الاتصال بي في أي وقت' },
            { en: 'Follow up via WhatsApp and phone daily', ar: 'متابعة عبر واتساب والهاتف يوميًا' },
            { en: 'Daily call for follow-up and encouragement and see if you have any concerns', ar: 'مكالمة يومية للمتابعة والتشجيع ومعرفة أي مخاوف' },
            { en: 'Video call to check the results weekly', ar: 'مكالمة فيديو لفحص النتائج أسبوعيًا' }
        ],
        link: 'https://checkouts.kashier.io/en/paymentpage?ppLink=PP-841576509,live'
    }
];

const checkIcon = `<svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_193_2889)"><path d="M18.2467 10.0489L13.4347 15.8203L11.7502 13.8007C11.5927 13.6117 11.3995 13.4556 11.1816 13.3412C10.9638 13.2269 10.7256 13.1566 10.4806 13.1343C10.2355 13.112 9.98854 13.1382 9.75366 13.2114C9.51877 13.2846 9.3006 13.4033 9.1116 13.5608C8.92259 13.7183 8.76647 13.9115 8.65212 14.1293C8.53778 14.3472 8.46747 14.5854 8.44519 14.8304C8.42292 15.0754 8.44912 15.3224 8.52231 15.5573C8.59549 15.7922 8.71422 16.0104 8.87172 16.1994L11.9955 19.9494C12.1711 20.1606 12.391 20.3307 12.6396 20.4475C12.8883 20.5642 13.1596 20.6248 13.4343 20.625C13.709 20.6252 13.9804 20.5649 14.2292 20.4485C14.478 20.332 14.6981 20.1623 14.8739 19.9512L21.1252 12.4512C21.284 12.2624 21.4041 12.044 21.4784 11.8086C21.5526 11.5733 21.5797 11.3256 21.558 11.0797C21.5364 10.8339 21.4664 10.5947 21.352 10.376C21.2377 10.1573 21.0813 9.96328 20.8918 9.80515C20.7024 9.64701 20.4835 9.52784 20.2479 9.45448C20.0122 9.38112 19.7644 9.35501 19.5187 9.37766C19.2729 9.4003 19.034 9.47125 18.8158 9.58643C18.5975 9.70162 18.4041 9.85877 18.2467 10.0489Z" fill="white"></path><path d="M14.9981 0C12.0313 0 9.13124 0.879735 6.6645 2.52796C4.19776 4.17618 2.27518 6.51886 1.13986 9.25975C0.00454617 12.0006 -0.292504 15.0166 0.286274 17.9264C0.865053 20.8361 2.29366 23.5088 4.39145 25.6066C6.48924 27.7044 9.16198 29.133 12.0717 29.7118C14.9814 30.2906 17.9974 29.9935 20.7383 28.8582C23.4792 27.7229 25.8219 25.8003 27.4701 23.3336C29.1183 20.8668 29.9981 17.9667 29.9981 15C29.9938 11.0231 28.4121 7.2102 25.6 4.39808C22.7878 1.58595 18.975 0.0042353 14.9981 0ZM14.9981 26.25C12.773 26.25 10.5979 25.5902 8.74789 24.354C6.89784 23.1179 5.45589 21.3609 4.60441 19.3052C3.75292 17.2495 3.53014 14.9875 3.96422 12.8052C4.3983 10.6229 5.46976 8.61839 7.0431 7.04505C8.61644 5.47171 10.621 4.40025 12.8033 3.96617C14.9856 3.53208 17.2476 3.75487 19.3032 4.60636C21.3589 5.45784 23.1159 6.89978 24.3521 8.74984C25.5883 10.5999 26.2481 12.775 26.2481 15C26.2448 17.9827 25.0585 20.8423 22.9494 22.9514C20.8403 25.0604 17.9807 26.2467 14.9981 26.25Z" fill="white"></path></g><defs><clipPath id="clip0_193_2889"><rect width="30" height="30" fill="white"></rect></clipPath></defs></svg>`;

function renderPackages(packages, containerId) {
    const container = document.getElementById(containerId);
    const itemsDiv = document.createElement('div');
    itemsDiv.className = 'items';
    
    packages.forEach(pkg => {
        const item = document.createElement('div');
        item.className = `item ${pkg.popular ? 'popular' : ''}`;
        
        let html = '<div class="headline">';
        if (pkg.popular) {
            html += `<div class="populartag" data-en="Top seller" data-ar="الأكثر مبيعًا">Top seller</div>`;
        }
        html += `<h2 data-en="${pkg.title.en}" data-ar="${pkg.title.ar}">${pkg.title[currentLang]}</h2>`;
        html += `<h3>${pkg.price}</h3>`;
        html += '<div class="border cover"></div></div>';
        html += '<ul class="info">';
        
        pkg.features.forEach(feature => {
            html += `<li>${checkIcon}<p data-en="${feature.en}" data-ar="${feature.ar}">${feature[currentLang]}</p></li>`;
        });
        
        html += '</ul>';
        html += `<a class="booknow" href="${pkg.link}" data-en="Book Now" data-ar="احجز الآن">Book Now</a>`;
        
        item.innerHTML = html;
        itemsDiv.appendChild(item);
    });
    
    container.appendChild(itemsDiv);
}

// FAQ data
const faqData = [
    {
        question: { en: 'What is included in the training program?', ar: 'ما الذي يتضمنه برنامج التدريب؟' },
        answer: { en: 'The program includes customized nutrition plans, workout routines, cardio and abs exercises, and continuous follow-up support.', ar: 'يتضمن البرنامج خطط تغذية مخصصة، روتين تمارين، تمارين كارديو وبطن، ودعم متابعة مستمر.' }
    },
    {
        question: { en: 'How often will my plan be updated?', ar: 'كم مرة سيتم تحديث خطتي؟' },
        answer: { en: 'Your plan will be updated every 10-15 days based on your progress and results.', ar: 'سيتم تحديث خطتك كل 10-15 يومًا بناءً على تقدمك ونتائجك.' }
    },
    {
        question: { en: 'Can I train at home or do I need a gym?', ar: 'هل يمكنني التدريب في المنزل أم أحتاج إلى صالة رياضية؟' },
        answer: { en: 'The program can be customized for both home and gym training based on your preference and available equipment.', ar: 'يمكن تخصيص البرنامج للتدريب في المنزل أو الصالة الرياضية بناءً على تفضيلاتك والمعدات المتاحة.' }
    },
    {
        question: { en: 'What is the difference between standard and VIP packages?', ar: 'ما الفرق بين الباقات القياسية وباقات VIP؟' },
        answer: { en: 'VIP packages include direct phone access, daily calls, and weekly video check-ins for more personalized support.', ar: 'تتضمن باقات VIP الوصول المباشر عبر الهاتف، مكالمات يومية، وفحوصات فيديو أسبوعية لدعم أكثر تخصيصًا.' }
    }
];

function renderFAQ() {
    const container = document.getElementById('faqContainer');
    
    faqData.forEach((item, index) => {
        const faqItem = document.createElement('div');
        faqItem.className = 'faq-item';
        
        faqItem.innerHTML = `
            <div class="faq-question" onclick="toggleFAQ(${index})">
                <span data-en="${item.question.en}" data-ar="${item.question.ar}">${item.question[currentLang]}</span>
                <span class="faq-icon" id="faq-icon-${index}">▼</span>
            </div>
            <div class="faq-answer" id="faq-answer-${index}">
                <p data-en="${item.answer.en}" data-ar="${item.answer.ar}">${item.answer[currentLang]}</p>
            </div>
        `;
        
        container.appendChild(faqItem);
    });
}

function toggleFAQ(index) {
    const answer = document.getElementById(`faq-answer-${index}`);
    const icon = document.getElementById(`faq-icon-${index}`);
    
    answer.classList.toggle('active');
    icon.classList.toggle('active');
}

// Smooth scroll
document.addEventListener('click', function(e) {
    if (e.target.tagName === 'A' && e.target.getAttribute('href').startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(e.target.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
});

// Load random products for home page
async function loadHomeProducts() {
    try {
        const response = await fetch('data/nbs_supplements.json');
        const data = await response.json();
        
        // Get 4 random products
        const randomProducts = data.products
            .sort(() => 0.5 - Math.random())
            .slice(0, 4);
        
        const container = document.getElementById('homeProductsShowcase');
        if (!container) return;
        
        container.innerHTML = randomProducts.map(product => `
            <div class="product-showcase-card" onclick="window.location.href='supplement-detail.html?product=${encodeURIComponent(product.url)}'">
                <div class="product-showcase-image">
                    ${product.images && product.images.length > 0 
                        ? `<img src="${product.images[0]}" alt="${product.name}">` 
                        : '<div class="placeholder">💊</div>'}
                </div>
                <div class="product-showcase-info">
                    <h3 class="product-showcase-name">${product.name}</h3>
                    <p class="product-showcase-description">${product.short_description || product.description.substring(0, 80) + '...'}</p>
                    <div class="product-showcase-price">${product.price.toFixed(2)} <small>EGP</small></div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Load random products for home page
    loadHomeProducts();
    
    // Initialize other features
    // updateSectionHeadlines(); // Commented out - now using text headings
    initSuccessSlider();
    initReviewSlider();
    renderPackages(standardPackages, 'standardPackages');
    renderPackages(vipPackages, 'vipPackages');
    renderFAQ();
    
    // Duplicate ticker for infinite scroll effect
    document.querySelectorAll('.ticker').forEach(ticker => {
        const content = ticker.innerHTML;
        ticker.innerHTML = content + content;
    });
});

