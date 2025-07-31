const viewport = document.querySelector('meta[name="viewport"]');
const oldContent = viewport.getAttribute('content');
const printBtn = document.querySelector('.printBtn');
const themeBtn = document.querySelector('.themeBtn');
const CV = document.querySelector('.CV');

// Функция для создания волны
function ripple(e){
    const target = this;
    const rect = target.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.className = 'ripple';

    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = size + 'px';

    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';

    target.appendChild(ripple);

    setTimeout(() => {
        ripple.remove();
    }, 500);
}

// Кнопка Скачать
printBtn.addEventListener('click', function(e) {
    ripple.call(this, e);
    setTimeout(() => {
        createPDF();
    }, 300)
});

// Кнопка Темы
themeBtn.addEventListener('click', function(e) {
    ripple.call(this, e);
    document.body.classList.toggle('dark');
});

// Глобальный обработчик кликов для эффекта ряби на ВСЕХ элементах
CV.addEventListener('click', function(e) {
    const target = e.target.closest('.photo, .nameBox, .languages, .education, .interests, .contacts, .tools, .experience, .eduCard, .expCard, .interest, .level, .toolsCard > img, [contenteditable="true"]');
    
    if (target) {
        ripple.call(target, e);
    }
});


document.querySelectorAll('.CV [contenteditable="true"]').forEach(el => {
  el.addEventListener('input', saveContent);
});

window.addEventListener('DOMContentLoaded', loadContent);

// --- САМАЯ НАДЕЖНАЯ ФУНКЦИЯ СОЗДАНИЯ PDF ---
function createPDF() {
    const cvElement = document.querySelector('.CV');

    html2canvas(cvElement, { 
        scale: 3, 
        backgroundColor: '#ffffff'
    }).then(canvas => {
        const pdf = new window.jspdf.jsPDF('p', 'mm', 'a4');
        
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        
        // Рассчитываем соотношения сторон
        const pageAspectRatio = pageWidth / pageHeight;
        const canvasAspectRatio = canvasWidth / canvasHeight;

        let renderWidth, renderHeight, x, y;

        // Определяем, как масштабировать, чтобы все поместилось
        if (canvasAspectRatio > pageAspectRatio) {
            // Если резюме "шире" страницы, подгоняем по ширине
            renderWidth = pageWidth;
            renderHeight = pageWidth / canvasAspectRatio;
            y = (pageHeight - renderHeight) / 2; // Центрируем по вертикали
            x = 0;
        } else {
            // Если резюме "выше" страницы, подгоняем по высоте
            renderHeight = pageHeight;
            renderWidth = pageHeight * canvasAspectRatio;
            x = (pageWidth - renderWidth) / 2; // Центрируем по горизонтали
            y = 0;
        }

        const imgData = canvas.toDataURL('image/png');
        
        pdf.addImage(imgData, 'PNG', x, y, renderWidth, renderHeight);
        pdf.save('resume-final.pdf');
    });
}


function saveContent() {
  const editables = document.querySelectorAll('.CV [contenteditable="true"]');
  const data = [];
  editables.forEach(el => data.push(el.innerHTML));
  localStorage.setItem('cv_content', JSON.stringify(data));
}

function loadContent() {
  const data = JSON.parse(localStorage.getItem('cv_content') || '[]');
  const editables = document.querySelectorAll('.CV [contenteditable="true"]');
  editables.forEach((el, i) => {
    if (data[i] !== undefined) el.innerHTML = data[i];
  });
}