/**
 * trainers.js
 * 리케어짐 트레이너 소개 & 예약 시스템
 * - 트레이너 목록 불러오기 (Table API)
 * - 예약 모달 (3-step)
 * - 타임슬롯 생성 & 예약 충돌 확인
 * - 예약 저장 (Table API)
 * - 예약 조회
 */

/* ==============================
   SAMPLE TRAINER PHOTOS
============================== */
const SAMPLE_TRAINER_PHOTOS = [
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
];

/* ==============================
   STATE
============================== */
let currentTrainer = null;    // 선택된 트레이너 객체
let selectedTime = null;      // 선택된 시간 슬롯 (HH:MM)
let currentStep = 1;          // 현재 스텝 (1~3)
let bookedSlotsCache = [];    // 해당 날짜 예약된 슬롯 캐시

/* ==============================
   INIT
============================== */
document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  loadTrainers();
  initDatePicker();
});

/* ==============================
   HEADER
============================== */
function initHeader() {
  const header = document.getElementById('header');
  const hamburger = document.getElementById('hamburger');
  const nav = document.getElementById('mainNav');

  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 30);
  });

  hamburger?.addEventListener('click', () => {
    nav.classList.toggle('open');
    hamburger.classList.toggle('open');
  });
}

/* ==============================
   DATE PICKER — 최소 날짜 오늘로 설정
============================== */
function initDatePicker() {
  const dateInput = document.getElementById('bookDate');
  if (!dateInput) return;
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  dateInput.min = `${yyyy}-${mm}-${dd}`;
}

/* ==============================
   LOAD TRAINERS
============================== */
async function loadTrainers() {
  const grid = document.getElementById('trainersGrid');

  try {
    const res = await fetch('tables/trainers?limit=20&sort=career_years');
    const data = await res.json();

    if (!data.data || data.data.length === 0) {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column:1/-1">
          <i class="fas fa-user-slash"></i>
          <p>등록된 트레이너 정보가 없습니다.</p>
        </div>`;
      return;
    }

    // 활성 트레이너만 필터 & 경력 역순 정렬
    const trainers = data.data
      .filter(t => t.is_active !== false)
      .sort((a, b) => (b.career_years || 0) - (a.career_years || 0));

    grid.innerHTML = trainers.map((t, idx) => renderTrainerCard(t, idx)).join('');
  } catch (e) {
    console.error(e);
    grid.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1">
        <i class="fas fa-exclamation-triangle"></i>
        <p>트레이너 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.</p>
      </div>`;
  }
}

/* ==============================
   RENDER TRAINER CARD
============================== */
function renderTrainerCard(t, idx) {
  const specialties = Array.isArray(t.specialties) ? t.specialties : [];
  const certs = Array.isArray(t.certifications) ? t.certifications : [];
  const careerHistory = Array.isArray(t.career_history) ? t.career_history : [];
  const programs = Array.isArray(t.available_programs) ? t.available_programs : [];

  const isMain = idx === 0; // 첫 번째가 대표

  // 사진 사용 - 없으면 샘플 사진으로 대체
  const photoUrl = t.photo_url || SAMPLE_TRAINER_PHOTOS[idx % SAMPLE_TRAINER_PHOTOS.length];
  
  const photoHtml = `<img src="${photoUrl}" alt="${t.name} 프로필 사진" class="tc__photo" loading="lazy" onerror="this.parentElement.innerHTML='<div class=tc__photo-placeholder><i class=\\'fas fa-user\\'></i></div>'" />`;

  return `
    <div class="trainer-card" id="card-${t.id}">
      <div class="tc__photo-area">
        ${photoHtml}
        <div class="tc__photo-overlay"></div>
        <div class="tc__role-badge">${escHtml(t.role || '트레이너')}</div>
        ${isMain ? '<div class="tc__main-badge">⭐ 대표 트레이너</div>' : ''}
      </div>

      <div class="tc__body">
        <h3 class="tc__name">
          ${escHtml(t.name)}
          <span>${escHtml(t.role || '')}</span>
        </h3>

        <div class="tc__stats">
          <div class="tc__stat">
            <span class="tc__stat-num">${t.career_years || 0}<small style="font-size:0.65rem">년+</small></span>
            <span class="tc__stat-label">지도 경력</span>
          </div>
          <div class="tc__stat">
            <span class="tc__stat-num">${certs.length}</span>
            <span class="tc__stat-label">보유 자격증</span>
          </div>
          <div class="tc__stat">
            <span class="tc__stat-num">${programs.length}</span>
            <span class="tc__stat-label">담당 프로그램</span>
          </div>
        </div>

        <p class="tc__intro">${escHtml(t.intro || '')}</p>

        <div class="tc__specialties">
          ${specialties.map(s => `<span class="tc__spec-tag">#${escHtml(s)}</span>`).join('')}
        </div>

        <!-- 상세 토글 버튼 -->
        <button class="tc__detail-toggle" onclick="toggleDetail('${t.id}', this)" aria-expanded="false">
          <i class="fas fa-chevron-down"></i> 자격증 · 경력 상세 보기
        </button>

        <!-- 상세 패널 -->
        <div class="tc__detail-panel" id="detail-${t.id}">
          <div class="tc__certs">
            <div class="tc__certs-title"><i class="fas fa-certificate"></i> 보유 자격증</div>
            <div class="tc__cert-list">
              ${certs.map(c => `<div class="tc__cert-item">${escHtml(c)}</div>`).join('')}
            </div>
          </div>

          <div class="tc__career">
            <div class="tc__career-title"><i class="fas fa-briefcase"></i> 주요 경력</div>
            ${careerHistory.map(c => `<div class="tc__career-item">${escHtml(c)}</div>`).join('')}
          </div>

          <div class="tc__certs" style="margin-bottom:16px;">
            <div class="tc__certs-title"><i class="fas fa-dumbbell"></i> 담당 프로그램</div>
            <div class="tc__specialties" style="margin-bottom:0">
              ${programs.map(p => `<span class="tc__spec-tag" style="background:rgba(245,197,24,0.15); color:var(--accent-dark)">${escHtml(p)}</span>`).join('')}
            </div>
          </div>
        </div>

        <!-- 예약 버튼 -->
        <button class="tc__book-btn" onclick='openBookingModal(${JSON.stringify(t)})'>
          <i class="fas fa-calendar-plus"></i>
          이 트레이너로 예약하기
        </button>
      </div>
    </div>`;
}

/* ==============================
   TOGGLE DETAIL PANEL
============================== */
function toggleDetail(trainerId, btn) {
  const panel = document.getElementById(`detail-${trainerId}`);
  if (!panel) return;
  const isOpen = panel.classList.contains('open');

  if (isOpen) {
    panel.classList.remove('open');
    btn.classList.remove('open');
    btn.innerHTML = '<i class="fas fa-chevron-down"></i> 자격증 · 경력 상세 보기';
    btn.setAttribute('aria-expanded', 'false');
  } else {
    panel.classList.add('open');
    btn.classList.add('open');
    btn.innerHTML = '<i class="fas fa-chevron-up"></i> 상세 닫기';
    btn.setAttribute('aria-expanded', 'true');
  }
}

/* ==============================
   BOOKING MODAL OPEN
============================== */
function openBookingModal(trainer) {
  currentTrainer = trainer;
  selectedTime = null;
  currentStep = 1;

  // 모달 헤더 업데이트
  document.getElementById('modalTrainerName').textContent = trainer.name;
  document.getElementById('modalTrainerRole').textContent = trainer.role || '';

  // 프로그램 셀렉트박스 채우기
  const programSelect = document.getElementById('bookProgram');
  programSelect.innerHTML = '<option value="">프로그램을 선택해 주세요</option>';
  const progs = Array.isArray(trainer.available_programs) ? trainer.available_programs : [];
  progs.forEach(p => {
    const opt = document.createElement('option');
    opt.value = p;
    opt.textContent = p;
    programSelect.appendChild(opt);
  });

  // 날짜 초기화
  document.getElementById('bookDate').value = '';
  document.getElementById('timeSlots').innerHTML = '';
  document.getElementById('slotHint').textContent = '날짜를 먼저 선택해 주세요';

  // 폼 초기화
  document.getElementById('bookName').value = '';
  document.getElementById('bookPhone').value = '';
  document.getElementById('bookMessage').value = '';
  document.getElementById('bookAgree').checked = false;

  // 스텝 초기화
  setStep(1);

  document.getElementById('bookingModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('bookingModal').classList.remove('open');
  document.body.style.overflow = '';
  currentTrainer = null;
  selectedTime = null;
}

function handleModalOverlayClick(e) {
  if (e.target === document.getElementById('bookingModal')) closeModal();
}

/* ==============================
   STEP NAVIGATION
============================== */
function setStep(step) {
  currentStep = step;

  // 패널 전환
  ['1', '2', '3', 'success'].forEach(s => {
    const panel = document.getElementById(`step-panel-${s}`);
    if (panel) panel.classList.toggle('active', s === String(step));
  });

  // 인디케이터 업데이트
  [1, 2, 3].forEach(i => {
    const ind = document.getElementById(`step-ind-${i}`);
    if (!ind) return;
    ind.classList.toggle('active', i === step);
    ind.classList.toggle('done', i < step);
  });
  [1, 2].forEach(i => {
    const line = document.getElementById(`line-${i}`);
    if (line) line.classList.toggle('done', i < step);
  });
}

function goStep(target) {
  if (target === 2) {
    // Step 1 → 2 validation
    if (!document.getElementById('bookProgram').value) {
      showToast('프로그램을 선택해 주세요.', 'error'); return;
    }
    if (!document.getElementById('bookDate').value) {
      showToast('예약 날짜를 선택해 주세요.', 'error'); return;
    }
    if (!selectedTime) {
      showToast('예약 시간을 선택해 주세요.', 'error'); return;
    }
    setStep(2);
  } else if (target === 3) {
    // Step 2 → 3 validation
    const name = document.getElementById('bookName').value.trim();
    const phone = document.getElementById('bookPhone').value.trim();
    const agree = document.getElementById('bookAgree').checked;

    if (!name) { showToast('이름을 입력해 주세요.', 'error'); return; }
    if (!phone || !/^[\d\-+]{9,14}$/.test(phone.replace(/\s/g, ''))) {
      showToast('올바른 연락처를 입력해 주세요.', 'error'); return;
    }
    if (!agree) { showToast('개인정보 수집에 동의해 주세요.', 'error'); return; }

    // Confirm summary 업데이트
    fillConfirmSummary(name, phone);
    setStep(3);
  } else {
    setStep(target);
  }
}

function fillConfirmSummary(name, phone) {
  const dateVal = document.getElementById('bookDate').value;
  const formattedDate = dateVal ? formatDateKr(dateVal) : '-';
  document.getElementById('confirm-trainer').textContent = currentTrainer?.name || '-';
  document.getElementById('confirm-program').textContent = document.getElementById('bookProgram').value || '-';
  document.getElementById('confirm-date').textContent = formattedDate;
  document.getElementById('confirm-time').textContent = selectedTime ? `${selectedTime} (50분)` : '-';
  document.getElementById('confirm-name').textContent = name;
  document.getElementById('confirm-phone').textContent = phone;
}

/* ==============================
   TIME SLOTS
============================== */
async function loadTimeSlots() {
  const dateVal = document.getElementById('bookDate').value;
  if (!dateVal || !currentTrainer) return;

  const container = document.getElementById('timeSlots');
  const hint = document.getElementById('slotHint');

  // 요일 체크 (available_days)
  const dayOfWeek = new Date(dateVal + 'T12:00:00').getDay(); // 0=일,1=월...
  const availDays = Array.isArray(currentTrainer.available_days)
    ? currentTrainer.available_days.map(Number)
    : [1,2,3,4,5];

  if (!availDays.includes(dayOfWeek)) {
    container.innerHTML = `<div style="grid-column:1/-1; color:var(--danger); font-size:0.85rem; padding:12px 0;">
      <i class="fas fa-times-circle"></i> 선택한 날짜는 ${currentTrainer.name} 트레이너의 휴무일입니다. 다른 날짜를 선택해 주세요.
    </div>`;
    hint.textContent = '휴무일';
    return;
  }

  container.innerHTML = `<div style="grid-column:1/-1; color:var(--gray); font-size:0.82rem; padding:12px 0;">
    <div class="loading-state__spinner" style="width:20px;height:20px;border-width:2px;display:inline-block;vertical-align:middle;margin-right:8px;"></div>시간 정보 확인 중...
  </div>`;
  hint.textContent = '';
  selectedTime = null;

  try {
    // 해당 날짜 & 트레이너로 예약된 슬롯 조회
    const res = await fetch(`tables/bookings?limit=100&search=${encodeURIComponent(dateVal)}`);
    const data = await res.json();

    const existingBookings = (data.data || []).filter(b =>
      b.trainer_id === currentTrainer.id &&
      b.booking_date === dateVal &&
      b.status !== '취소'
    );

    bookedSlotsCache = existingBookings.map(b => b.booking_time);

    // 슬롯 생성
    const slots = generateSlots(
      currentTrainer.slot_start || '06:00',
      currentTrainer.slot_end   || '21:00',
      50 // 분 단위
    );

    hint.textContent = `${slots.length}개 슬롯`;

    container.innerHTML = slots.map(slot => {
      const isBooked = bookedSlotsCache.includes(slot);
      const isPast = isTimeSlotPast(dateVal, slot);
      const disabled = isBooked || isPast;

      let cls = 'time-slot';
      let extra = '';
      if (isPast) { cls += ' disabled'; extra = ''; }
      else if (isBooked) { cls += ' booked'; extra = '<br/><small>예약완료</small>'; }

      return `<button class="${cls}" ${disabled ? 'disabled' : ''} onclick="selectTimeSlot(this, '${slot}')">${slot}${extra}</button>`;
    }).join('');

  } catch(e) {
    container.innerHTML = `<div style="grid-column:1/-1; color:var(--danger); font-size:0.82rem;">
      시간 정보를 불러오지 못했습니다.
    </div>`;
  }
}

function generateSlots(start, end, durationMin) {
  const slots = [];
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  let cur = sh * 60 + sm;
  const endMin = eh * 60 + em;

  while (cur + durationMin <= endMin) {
    const h = String(Math.floor(cur / 60)).padStart(2, '0');
    const m = String(cur % 60).padStart(2, '0');
    slots.push(`${h}:${m}`);
    cur += durationMin;
  }
  return slots;
}

function isTimeSlotPast(dateStr, timeStr) {
  const now = new Date();
  const slotDate = new Date(`${dateStr}T${timeStr}:00`);
  return slotDate <= now;
}

function selectTimeSlot(btn, time) {
  // 기존 선택 제거
  document.querySelectorAll('.time-slot.selected').forEach(el => el.classList.remove('selected'));
  btn.classList.add('selected');
  selectedTime = time;
}

/* ==============================
   SUBMIT BOOKING
============================== */
async function submitBooking() {
  const btn = document.getElementById('submitBookingBtn');
  if (!btn || btn.disabled) return;

  btn.disabled = true;
  btn.innerHTML = '<div class="spinner"></div> 예약 중...';

  const payload = {
    trainer_id:     currentTrainer.id,
    trainer_name:   currentTrainer.name,
    booking_date:   document.getElementById('bookDate').value,
    booking_time:   selectedTime,
    program:        document.getElementById('bookProgram').value,
    customer_name:  document.getElementById('bookName').value.trim(),
    customer_phone: document.getElementById('bookPhone').value.trim(),
    message:        document.getElementById('bookMessage').value.trim(),
    status:         '대기중',
    agreed_privacy: true
  };

  try {
    // 이중 예약 방지: 다시 한번 확인
    const checkRes = await fetch(`tables/bookings?limit=100&search=${encodeURIComponent(payload.booking_date)}`);
    const checkData = await checkRes.json();
    const conflict = (checkData.data || []).find(b =>
      b.trainer_id === payload.trainer_id &&
      b.booking_date === payload.booking_date &&
      b.booking_time === payload.booking_time &&
      b.status !== '취소'
    );

    if (conflict) {
      showToast('죄송합니다. 방금 다른 예약이 완료되었습니다. 다른 시간을 선택해 주세요.', 'error');
      btn.disabled = false;
      btn.innerHTML = '<i class="fas fa-calendar-check"></i> 예약 완료하기';
      goStep(1);
      await loadTimeSlots();
      return;
    }

    const res = await fetch('tables/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error('예약 실패');

    const result = await res.json();
    const bookingId = (result.id || '').slice(0, 8).toUpperCase();

    // Success UI
    document.getElementById('successBookingId').textContent = `예약번호: RCG-${bookingId}`;
    ['1','2','3'].forEach(s => {
      document.getElementById(`step-ind-${s}`)?.classList.add('done');
      document.getElementById(`step-ind-${s}`)?.classList.remove('active');
    });

    ['step-panel-1','step-panel-2','step-panel-3'].forEach(id => {
      document.getElementById(id)?.classList.remove('active');
    });
    document.getElementById('step-panel-success').classList.add('active');

    showToast(`예약이 완료되었습니다! 예약번호: RCG-${bookingId}`, 'success');

  } catch(e) {
    console.error(e);
    showToast('예약 처리 중 오류가 발생했습니다. 다시 시도해 주세요.', 'error');
    btn.disabled = false;
    btn.innerHTML = '<i class="fas fa-calendar-check"></i> 예약 완료하기';
  }
}

/* ==============================
   BOOKING LOOKUP (예약 조회)
============================== */
async function lookupBookings() {
  const phone = document.getElementById('lookupPhone').value.trim();
  const resultEl = document.getElementById('bookingResult');

  if (!phone) { showToast('전화번호를 입력해 주세요.', 'error'); return; }

  resultEl.innerHTML = `<div class="loading-state">
    <div class="loading-state__spinner"></div>
    <p>예약 내역 조회 중...</p>
  </div>`;
  resultEl.classList.add('show');

  try {
    const res = await fetch(`tables/bookings?limit=50&search=${encodeURIComponent(phone)}`);
    const data = await res.json();

    const matched = (data.data || []).filter(b =>
      b.customer_phone?.replace(/[-\s]/g,'') === phone.replace(/[-\s]/g,'')
    ).sort((a, b) => (b.created_at || 0) - (a.created_at || 0));

    if (matched.length === 0) {
      resultEl.innerHTML = `<div class="empty-state">
        <i class="fas fa-calendar-times"></i>
        <p>해당 연락처로 등록된 예약이 없습니다.</p>
      </div>`;
      return;
    }

    resultEl.innerHTML = `
      <p style="font-size:0.85rem; color:var(--gray); margin-bottom:16px; text-align:center;">
        총 <strong>${matched.length}건</strong>의 예약 내역이 확인되었습니다.
      </p>
      ${matched.map(b => renderBookingCard(b)).join('')}
    `;
  } catch(e) {
    resultEl.innerHTML = `<div class="empty-state">
      <i class="fas fa-exclamation-triangle"></i>
      <p>조회 중 오류가 발생했습니다.</p>
    </div>`;
  }
}

function renderBookingCard(b) {
  const statusClass = {
    '대기중': 'pending',
    '확정':   'confirmed',
    '취소':   'cancelled'
  }[b.status] || 'pending';

  const bookingId = (b.id || '').slice(0, 8).toUpperCase();
  const dateStr = b.booking_date ? formatDateKr(b.booking_date) : '-';

  return `
    <div class="booking-result-card">
      <div class="brc-header">
        <span class="brc-id">예약번호: RCG-${bookingId}</span>
        <span class="brc-status brc-status--${statusClass}">${b.status || '대기중'}</span>
      </div>
      <div class="brc-info">
        <div class="brc-info-item">
          <label>트레이너</label>
          <span>${escHtml(b.trainer_name || '-')}</span>
        </div>
        <div class="brc-info-item">
          <label>프로그램</label>
          <span>${escHtml(b.program || '-')}</span>
        </div>
        <div class="brc-info-item">
          <label>예약 날짜</label>
          <span>${dateStr}</span>
        </div>
        <div class="brc-info-item">
          <label>예약 시간</label>
          <span>${escHtml(b.booking_time || '-')}</span>
        </div>
      </div>
    </div>`;
}

/* ==============================
   UTILITIES
============================== */
function formatDateKr(dateStr) {
  if (!dateStr) return '-';
  const d = new Date(dateStr + 'T12:00:00');
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  return `${d.getFullYear()}년 ${d.getMonth()+1}월 ${d.getDate()}일 (${days[d.getDay()]})`;
}

function escHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function showToast(msg, type = '') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast${type ? ' toast--' + type : ''}`;
  toast.textContent = msg;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3200);
}

/* ==============================
   KEYBOARD ESC to close modal
============================== */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});
