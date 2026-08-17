/**
 * Compass Application Logic
 * Interactive quiz, dynamic SVG compass dial, career filters, and FAQ interactions.
 */

document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

function initApp() {
  initMobileNav();
  initCompassVisuals();
  initExplorer();
  initFAQ();
  initScrollReveal();
}

/* ============ MOBILE NAVIGATION ============ */
function initMobileNav() {
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isVisible = navLinks.style.display === 'flex';
      navLinks.style.display = isVisible ? 'none' : 'flex';
      if (!isVisible) {
        navLinks.style.flexDirection = 'column';
        navLinks.style.position = 'absolute';
        navLinks.style.top = '100%';
        navLinks.style.left = '0';
        navLinks.style.right = '0';
        navLinks.style.background = 'var(--bg-deep)';
        navLinks.style.padding = '20px 28px';
        navLinks.style.borderBottom = '1px solid var(--line)';
        navLinks.style.gap = '16px';
      }
    });

    // Close mobile nav on click of link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 820) {
          navLinks.style.display = 'none';
        }
      });
    });
  }
}

/* ============ COMPASS RENDER ============ */
function polar(cx, cy, r, angleDeg) {
  const rad = (angleDeg - 90) * Math.PI / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad)
  };
}

function renderCompass(ticksId, labelsId) {
  const ticks = document.getElementById(ticksId);
  const labels = document.getElementById(labelsId);
  if (!ticks || !labels) return;

  ticks.innerHTML = '';
  labels.innerHTML = '';

  CATS.forEach(cat => {
    // Tick lines
    const p1 = polar(200, 200, 150, cat.angle);
    const p2 = polar(200, 200, 140, cat.angle);
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', p1.x);
    line.setAttribute('y1', p1.y);
    line.setAttribute('x2', p2.x);
    line.setAttribute('y2', p2.y);
    line.setAttribute('stroke', '#3A4670');
    line.setAttribute('stroke-width', '1.4');
    ticks.appendChild(line);

    // Compass category labels
    const lp = polar(200, 200, 168, cat.angle);
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', lp.x);
    text.setAttribute('y', lp.y);
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('dominant-baseline', 'middle');
    text.setAttribute('class', 'compass-label');
    text.setAttribute('data-cat', cat.id);
    text.textContent = cat.short;
    labels.appendChild(text);
  });
}

function initCompassVisuals() {
  renderCompass('heroTicks', 'heroLabels');
  renderCompass('resultTicks', 'resultLabels');
}

/* ============ QUIZ LOGIC ============ */
let currentQ = 0;
let answers = new Array(QUESTIONS.length).fill(null);

window.startQuiz = function () {
  const intro = document.getElementById('quizIntro');
  const results = document.getElementById('quizResults');
  const questions = document.getElementById('quizQuestions');

  if (intro) intro.classList.remove('active');
  if (results) results.classList.remove('active');
  if (questions) questions.classList.add('active');

  currentQ = 0;
  answers = new Array(QUESTIONS.length).fill(null);
  renderQuestion();
};

window.restartQuiz = function () {
  answers = new Array(QUESTIONS.length).fill(null);
  currentQ = 0;

  const intro = document.getElementById('quizIntro');
  const results = document.getElementById('quizResults');
  const questions = document.getElementById('quizQuestions');

  if (results) results.classList.remove('active');
  if (questions) questions.classList.remove('active');
  if (intro) intro.classList.add('active');
};

function renderQuestion() {
  const total = QUESTIONS.length;
  const quizCount = document.getElementById('quizCount');
  const quizBarFill = document.getElementById('quizBarFill');
  const quizQ = document.getElementById('quizQ');
  const optsWrap = document.getElementById('quizOptions');
  const backBtn = document.getElementById('quizBackBtn');

  if (quizCount) quizCount.textContent = `Q ${String(currentQ + 1).padStart(2, '0')} / ${total}`;
  if (quizBarFill) quizBarFill.style.width = `${(currentQ / total) * 100}%`;

  const data = QUESTIONS[currentQ];
  if (quizQ) quizQ.textContent = data.q;

  if (optsWrap) {
    optsWrap.innerHTML = '';
    data.opts.forEach((opt, i) => {
      const btn = document.createElement('button');
      btn.className = 'quiz-opt';
      btn.textContent = opt.t;
      if (answers[currentQ] === i) btn.classList.add('chosen');
      btn.onclick = () => selectOption(i);
      optsWrap.appendChild(btn);
    });
  }

  if (backBtn) backBtn.disabled = currentQ === 0;
}

function selectOption(i) {
  answers[currentQ] = i;
  setTimeout(() => {
    if (currentQ < QUESTIONS.length - 1) {
      currentQ++;
      renderQuestion();
    } else {
      showResults();
    }
  }, 220);
}

window.goBack = function () {
  if (currentQ > 0) {
    currentQ--;
    renderQuestion();
  }
};

function showResults() {
  const quizBarFill = document.getElementById('quizBarFill');
  if (quizBarFill) quizBarFill.style.width = `100%`;

  const scores = {};
  CATS.forEach(c => (scores[c.id] = 0));
  const maxPer = {};
  CATS.forEach(c => (maxPer[c.id] = 0));

  QUESTIONS.forEach((q, qi) => {
    q.opts.forEach(o => (maxPer[o.c] += 3));
    const chosenIdx = answers[qi];
    if (chosenIdx !== null) {
      scores[q.opts[chosenIdx].c] += 3;
    }
  });

  const ranked = CATS.map(c => ({
    ...c,
    score: scores[c.id],
    pct: Math.round((scores[c.id] / maxPer[c.id]) * 100)
  })).sort((a, b) => b.score - a.score);

  const top = ranked[0];

  const questionsEl = document.getElementById('quizQuestions');
  const resultsEl = document.getElementById('quizResults');
  if (questionsEl) questionsEl.classList.remove('active');
  if (resultsEl) resultsEl.classList.add('active');

  const titleEl = document.getElementById('resultTitle');
  const subEl = document.getElementById('resultSub');
  if (titleEl) titleEl.textContent = top.name;
  if (subEl) {
    subEl.textContent = `Your answers point most strongly toward ${top.name.toLowerCase()} — here's the full breakdown, plus matching roadmaps below.`;
  }

  const resultNeedle = document.getElementById('resultNeedle');
  if (resultNeedle) {
    resultNeedle.setAttribute('transform', `rotate(${top.angle})`);
  }

  document.querySelectorAll('#resultLabels .compass-label').forEach(l => {
    l.classList.toggle('active', l.getAttribute('data-cat') === top.id);
  });

  const scoreList = document.getElementById('scoreList');
  if (scoreList) {
    scoreList.innerHTML = '';
    ranked.forEach(c => {
      const row = document.createElement('div');
      row.className = 'score-row';
      row.innerHTML = `
        <div class="score-name">${c.name}</div>
        <div class="score-track"><div class="score-fill" style="width:0%" data-target="${c.pct}"></div></div>
        <div class="score-pct">${c.pct}%</div>
      `;
      scoreList.appendChild(row);
    });

    requestAnimationFrame(() => {
      setTimeout(() => {
        document.querySelectorAll('.score-fill').forEach(f => {
          f.style.width = f.dataset.target + '%';
        });
      }, 80);
    });
  }

  const matchBtn = document.getElementById('exploreMatchBtn');
  if (matchBtn) {
    matchBtn.onclick = () => {
      setActiveFilter(top.id);
    };
  }
}

/* ============ EXPLORER ============ */
let activeFilter = 'all';

function initExplorer() {
  buildFilters();
  renderCards();
}

function buildFilters() {
  const filtersWrap = document.getElementById('filters');
  if (!filtersWrap) return;

  filtersWrap.innerHTML = '';
  const allChip = document.createElement('button');
  allChip.className = 'chip active';
  allChip.textContent = 'All careers';
  allChip.dataset.cat = 'all';
  allChip.onclick = () => setActiveFilter('all');
  filtersWrap.appendChild(allChip);

  CATS.forEach(c => {
    const chip = document.createElement('button');
    chip.className = 'chip';
    chip.textContent = c.name;
    chip.dataset.cat = c.id;
    chip.onclick = () => setActiveFilter(c.id);
    filtersWrap.appendChild(chip);
  });
}

function setActiveFilter(catId) {
  activeFilter = catId;
  document.querySelectorAll('.chip').forEach(c => {
    c.classList.toggle('active', c.dataset.cat === catId);
  });
  renderCards();
  const explorerEl = document.getElementById('explorer');
  if (explorerEl) {
    explorerEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function renderCards() {
  const cardGrid = document.getElementById('cardGrid');
  if (!cardGrid) return;

  cardGrid.innerHTML = '';
  const list = activeFilter === 'all' ? CAREERS : CAREERS.filter(c => c.cat === activeFilter);

  list.forEach((career, idx) => {
    const catInfo = CATS.find(c => c.id === career.cat) || { short: 'CAREER' };
    const card = document.createElement('div');
    card.className = 'career-card';
    const detailsId = `details-${career.cat}-${idx}`;

    const roadmapHTML = career.roadmap.map(step => `
      <div class="roadmap-step">
        <span class="roadmap-dot"></span>
        <div><b>${step[0]}</b> — <span>${step[1]}</span></div>
      </div>
    `).join('');

    const examChipsHTML = career.examKeys.map(key => {
      const ex = EXAM_INFO[key] || { name: key };
      return `<button class="exam-chip" data-target="${detailsId}" data-exam="${key}">${ex.name}</button>`;
    }).join('');

    const examTimelineHTML = career.examKeys.map(key => {
      const ex = EXAM_INFO[key];
      if (!ex) return '';
      const linkHTML = ex.site
        ? `<a href="${ex.site}" target="_blank" rel="noopener noreferrer" class="exam-link">${ex.site.replace('https://', '')} ↗</a>`
        : `<span class="exam-link exam-link-none">No single official site — check your target institution</span>`;
      return `
        <div class="exam-block" id="${detailsId}-${key}">
          <div class="exam-block-head"><b>${ex.name}</b><span class="exam-body">${ex.body}</span></div>
          <p class="exam-timeline">${ex.timeline}</p>
          ${linkHTML}
        </div>
      `;
    }).join('');

    card.innerHTML = `
      <span class="tag">${catInfo.short}</span>
      <h3>${career.title}</h3>
      <p class="one-liner">${career.one}</p>
      <div class="meta">STREAM · ${career.stream}</div>
      <div class="exam-chip-row">
        <span class="exam-chip-label">EXAMS</span>${examChipsHTML}
      </div>
      <details id="${detailsId}">
        <summary>Full roadmap</summary>
        <div class="roadmap">${roadmapHTML}</div>
        <div class="skills-line"><b>Helps if you have:</b> ${career.skills}</div>
        <div class="exam-timelines">
          <div class="exam-timelines-label">Exam windows &amp; official sites</div>
          ${examTimelineHTML}
        </div>
      </details>
    `;
    cardGrid.appendChild(card);

    // Bind event listener to scroll to exam timeline on chip click
    card.querySelectorAll('.exam-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const det = document.getElementById(chip.dataset.target);
        if (det) {
          det.open = true;
          setTimeout(() => {
            const block = document.getElementById(`${chip.dataset.target}-${chip.dataset.exam}`);
            if (block) {
              block.scrollIntoView({ behavior: 'smooth', block: 'center' });
              block.classList.add('exam-block-flash');
              setTimeout(() => block.classList.remove('exam-block-flash'), 1200);
            }
          }, 60);
        }
      });
    });
  });
}

/* ============ FAQ ============ */
function initFAQ() {
  const faqList = document.getElementById('faqList');
  if (!faqList) return;

  faqList.innerHTML = '';
  FAQS.forEach(item => {
    const el = document.createElement('div');
    el.className = 'faq-item';
    el.innerHTML = `
      <button class="faq-q">${item.q}<span class="plus">+</span></button>
      <div class="faq-a"><p>${item.a}</p></div>
    `;
    const btn = el.querySelector('.faq-q');
    const answer = el.querySelector('.faq-a');

    btn.onclick = () => {
      const isOpen = el.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(f => {
        f.classList.remove('open');
        f.querySelector('.faq-a').style.maxHeight = null;
      });
      if (!isOpen) {
        el.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    };
    faqList.appendChild(el);
  });
}

/* ============ SCROLL REVEAL ============ */
function initScrollReveal() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}
