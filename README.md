# 리케어짐 (ReCare GYM) 홈페이지

체형교정 · 재활 · PT 전문 피트니스 센터 홈페이지 + 트레이너 소개 & 온라인 예약 시스템

---

## ✅ 완성된 기능

### 1. 메인 홈페이지 (`index.html`)
- 히어로 섹션 (헤드카피 + CTA 버튼 + 통계)
- 리케어짐 소개 (4대 강점 카드)
- 핵심 프로그램 6종 (체형교정/PT/재활/다이어트/중장년/소그룹)
- 트레이너 미리보기 카드 3장 + 예약 페이지 이동 버튼
- 회원 후기 슬라이더 (5개 후기)
- 무료 상담 신청 폼 (이름/연락처/프로그램/메시지)
- 오시는 길 & 운영시간 섹션
- 플로팅 CTA 버튼 (전화/상담)
- 반응형 헤더 & 햄버거 메뉴

### 2. 트레이너 & 예약 페이지 (`trainers.html`)
- 트레이너 프로필 카드 (사진 / 이름 / 역할 / 경력년수 / 자격증 / 경력사항)
- 상세 펼치기/접기 (자격증 목록, 주요 경력, 담당 프로그램)
- **3단계 예약 모달**
  - Step 1: 프로그램 선택 → 날짜 선택 → 타임슬롯 선택 (기예약 슬롯 비활성화)
  - Step 2: 이름/연락처/문의사항 입력 + 개인정보 동의
  - Step 3: 예약 내용 확인 후 최종 완료
  - 완료 화면: 예약번호 발급 안내
- **예약 조회** (전화번호로 본인 예약 내역 확인)
- 이중 예약 방지 로직 (서버 재확인 후 저장)

---

## 📁 파일 구조

```
index.html          ← 메인 홈페이지
trainers.html       ← 트레이너 소개 & 예약 페이지
js/
  trainers.js       ← 트레이너 로드, 예약 모달, 예약 저장/조회 로직
```

---

## 🗄️ 데이터 테이블

### `trainers` — 트레이너 프로필
| 필드 | 타입 | 설명 |
|---|---|---|
| id | text | 고유 ID |
| name | text | 이름 |
| role | text | 직책 |
| specialties | array | 전문 분야 태그 |
| career_years | number | 경력 연수 |
| intro | rich_text | 소개 문구 |
| certifications | array | 보유 자격증 목록 |
| career_history | array | 주요 경력 사항 |
| photo_url | text | 프로필 사진 URL |
| available_programs | array | 담당 가능 프로그램 |
| slot_start | text | 예약 시작 시간 (HH:MM) |
| slot_end | text | 예약 종료 시간 (HH:MM) |
| available_days | array | 예약 가능 요일 (0=일~6=토) |
| is_active | bool | 활성 여부 |

### `bookings` — 예약 내역
| 필드 | 타입 | 설명 |
|---|---|---|
| id | text | 예약 고유 ID |
| trainer_id | text | 트레이너 ID |
| trainer_name | text | 트레이너 이름 |
| booking_date | text | 예약 날짜 (YYYY-MM-DD) |
| booking_time | text | 예약 시간 (HH:MM) |
| program | text | 선택 프로그램 |
| customer_name | text | 예약자 이름 |
| customer_phone | text | 예약자 연락처 |
| message | rich_text | 전달 사항 |
| status | text | 대기중/확정/취소 |
| agreed_privacy | bool | 개인정보 동의 여부 |

---

## 🔗 주요 URI

| 경로 | 설명 |
|---|---|
| `/index.html` | 메인 홈페이지 |
| `/trainers.html` | 트레이너 소개 & 예약 |
| `/trainers.html#myBookings` | 예약 조회 섹션 |
| `tables/trainers` | 트레이너 데이터 API |
| `tables/bookings` | 예약 데이터 API |

---

## 🚧 아직 구현되지 않은 기능

- CSS 공통 스타일 파일 (`css/style.css`) — 현재 index.html은 CSS 없이 구동됨
- 관리자 페이지 (예약 확정/취소 처리)
- SMS/카카오 알림 발송 (서버 필요)
- 네이버/카카오 지도 API 연동
- 실제 트레이너 사진 교체
- 실제 사업자 정보(주소, 전화번호, 대표명) 입력
- 결제 시스템 연동

---

## 🔜 다음 추천 개발 단계

1. **CSS 공통 파일 작성** — `css/style.css` 생성 및 index.html 스타일 분리
2. **관리자 페이지** (`admin.html`) — 예약 목록 확인, 상태 변경 기능
3. **실제 정보 입력** — 주소, 전화번호, 트레이너 사진, 대표명
4. **지도 API 연동** — 네이버 지도 or 카카오 지도 임베드
5. **SEO 최적화** — meta 태그, OG 태그, 구조화 데이터

---

*2025 리케어짐 (ReCare GYM). All rights reserved.*
