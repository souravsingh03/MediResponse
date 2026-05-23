# 🚑 MediResponse

A real-time emergency coordination platform that connects paramedics, hospitals, and toll operators on a single dashboard. Paramedics use **Google Gemini AI** to triage patients in the field — the AI assesses severity, recommends specialists, and auto-sorts nearby hospitals by best match. Hospitals see incoming patients with live vitals. Toll plazas receive instant clearance alerts.

---

## ✨ Features

### 🧑‍⚕️ Paramedic Dashboard
- Patient intake form — name, age, gender, blood group, vitals, symptoms
- **Voice input** for symptoms via the Web Speech API (mic button in-form)
- **AI Triage** powered by Google Gemini 2.0 Flash — returns severity (`CRITICAL` / `MODERATE` / `STABLE`), a clinical summary, recommended specialists, and equipment list
- Hospital list **auto-sorted** by AI specialist match + ETA after triage
- One-click ambulance dispatch — notifies hospital and toll plaza simultaneously

### 🏥 Hospital Admin Dashboard
- Live view of all incoming ambulances with patient severity badges
- **Real-time vitals monitor** (HR, SpO₂, BP) that updates every 2 seconds
- Progress tracker showing ETA countdown and trip status (`EN_ROUTE` → `ARRIVED`)

### 🚧 Toll Operator Dashboard
- Instant clearance alerts when an ambulance is dispatched
- Alert details: toll name, ambulance ID, lane, destination, patient severity
- One-click "Clear" to mark lane as open; filter by Active / Cleared / All

### 🔐 Authentication
- Role-based login with Employee ID + Password
- JWT tokens; each role sees only its own dashboard view
- Self-registration via `/api/auth/signup`

---

## 🛠️ Tech Stack

### Frontend (`frontend/`)

| Technology | Purpose |
|---|---|
| React 19 + TypeScript | UI and type safety |
| Vite 6 | Build tool & dev server |
| Tailwind CSS v3 | Utility-first styling |
| `@google/genai` (Gemini 2.0 Flash) | AI-powered patient triage |
| `lucide-react` | Icon library |
| Web Speech API | Browser-native voice input |
| Fetch API | HTTP client for backend calls |

### Backend (`backend/`)

| Technology | Purpose |
|---|---|
| Spring Boot 3.2.4 | REST API framework |
| Java 17 | Core language |
| Spring Security | Authentication & Authorization |
| JWT (jjwt 0.12.3) | Stateless token auth |
| Spring Data JPA / Hibernate | ORM & database access |
| MySQL | Relational database |
| Bean Validation | Request validation |
| Docker | Containerised deployment |
| Maven | Build tool |

---

## 📁 Project Structure

```
MediResponse/
├── frontend/                          # React + TypeScript frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── shared/
│   │   │   │   ├── Layout.tsx          # App shell, nav, role switcher
│   │   │   │   └── LoginView.tsx       # Login form (Employee ID + role)
│   │   │   ├── ambulance/
│   │   │   │   └── AmbulanceView.tsx   # Paramedic: patient form + AI triage + hospital select
│   │   │   ├── hospital/
│   │   │   │   └── HospitalView.tsx    # Hospital: incoming patients + live vitals
│   │   │   └── toll/
│   │   │       └── TollView.tsx        # Toll: clearance alerts + clear action
│   │   ├── services/
│   │   │   ├── api.ts                  # Centralised fetch wrapper (VITE_API_BASE_URL)
│   │   │   └── geminiService.ts        # Gemini 2.0 Flash triage with structured JSON output
│   │   ├── hooks/
│   │   │   └── useSpeechRecognition.ts # Web Speech API hook for voice input
│   │   ├── types/
│   │   │   └── index.ts                # Shared TypeScript types & enums
│   │   ├── App.tsx                     # Root component — auth state, trip/alert state, dispatch logic
│   │   └── main.tsx
│   ├── vite.config.js
│   ├── vercel.json                     # Vercel deployment config
│   └── package.json
│
├── backend/                           # Spring Boot backend
│   ├── src/main/java/com/mediresponse/
│   │   ├── controller/
│   │   │   ├── AuthController.java     # /api/auth/login, /api/auth/signup
│   │   │   ├── HospitalController.java # /api/hospitals
│   │   │   └── TollController.java     # /api/tolls/alerts
│   │   ├── model/
│   │   │   ├── User.java               # Roles: PARAMEDIC, HOSPITAL_ADMIN, TOLL_OPERATOR
│   │   │   ├── Hospital.java
│   │   │   └── TollAlert.java
│   │   ├── service/
│   │   ├── repository/
│   │   ├── dto/
│   │   └── security/
│   ├── src/main/resources/
│   │   └── application.properties
│   ├── Dockerfile                      # Railway deployment
│   └── pom.xml
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 18
- Java 17
- Maven 3.8+
- MySQL 8+
- Google Gemini API key ([get one free at Google AI Studio](https://aistudio.google.com))

---

### 1. Clone the Repository

```bash
git clone https://github.com/souravsingh03/MediResponse.git
cd MediResponse
```

---

### 2. Backend Setup

```bash
cd backend
```

**Create the database:**

```sql
CREATE DATABASE mediresponse;
```

**Configure environment** — open `src/main/resources/application.properties` and set:

```properties
# MySQL
spring.datasource.url=jdbc:mysql://localhost:3306/mediresponse
spring.datasource.username=your_mysql_username
spring.datasource.password=your_mysql_password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

spring.jpa.hibernate.ddl-auto=update
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect

# JWT
mediresponse.jwt.secret=YourSecretKeyHereAtLeast256BitsLong
mediresponse.jwt.expiration=86400000

# CORS — your frontend URL
app.cors.allowed-origins=http://localhost:5173
```

**Run the backend:**

```bash
mvn spring-boot:run
```

API starts at `http://localhost:8080`.

---

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

Create a `.env` file in `frontend/`:

```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_GEMINI_API_KEY=your_google_gemini_api_key
```

> **Note:** If `VITE_GEMINI_API_KEY` is missing, the app falls back to a default `MODERATE` triage response — it won't crash.

**Run the frontend:**

```bash
npm run dev
```

App available at `http://localhost:5173`.

---

## 🔑 API Reference

### Auth — `/api/auth`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|:----:|
| POST | `/api/auth/login` | Login with Employee ID + password | ❌ |
| POST | `/api/auth/signup` | Register a new user | ❌ |

**Login request body:**
```json
{
  "employeeId": "AMB-001",
  "password": "demo123",
  "role": "PARAMEDIC"
}
```

### Hospitals — `/api/hospitals`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|:----:|
| GET | `/api/hospitals` | Get all hospitals | ✅ |

### Toll Alerts — `/api/tolls`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|:----:|
| GET | `/api/tolls/alerts` | Get all toll clearance alerts | ✅ |

### Trips — `/api/trips`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|:----:|
| POST | `/api/trips` | Create a new dispatch trip | ✅ |
| GET | `/api/trips` | Get all active trips | ✅ |

---

## 🤖 How AI Triage Works

1. Paramedic fills patient details (symptoms + vitals) in the field
2. "Run AI Triage" sends data to **Gemini 2.0 Flash** with a structured JSON schema
3. Gemini returns:
   - **Severity**: `CRITICAL`, `MODERATE`, or `STABLE`
   - **Clinical summary** (1–2 sentences)
   - **Recommended specialists** (e.g. Cardiology, Neurosurgery)
   - **Equipment to prepare** (e.g. Defibrillator, Ventilator)
4. Hospitals are **auto-sorted** — those matching the recommended specialists appear first, then by ETA
5. On dispatch, the hospital and toll plaza are notified simultaneously

---

## 👥 User Roles & Demo Credentials

| Role | Employee ID | Password | Dashboard |
|------|-------------|----------|-----------|
| Paramedic | `AMB-001` | `demo123` | Patient intake, AI triage, hospital dispatch |
| Hospital Admin | `HOSP-001` | `demo123` | Incoming patients, live vitals monitor |
| Toll Operator | `TOLL-001` | `demo123` | Emergency lane clearance alerts |

---

## 🌍 Deployment

| Layer | Platform | Notes |
|---|---|---|
| Frontend | [Vercel](https://vercel.com) | Set root directory to `frontend/`; add `VITE_*` env vars |
| Backend | [Railway](https://railway.app) | Auto-detects `Dockerfile`; add MySQL plugin |
| Database | MySQL (Railway plugin) | Auto-injects `SPRING_DATASOURCE_*` env vars |

**Environment variables required on Railway (backend):**

```
JWT_SECRET=your_32_char_secret
ALLOWED_ORIGINS=https://your-app.vercel.app
PORT=8080
```
> `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, and `SPRING_DATASOURCE_PASSWORD` are injected automatically by the Railway MySQL plugin.

---

## 🙌 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'Add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👤 Author

**Sourav Singh**
- GitHub: [@souravsingh03](https://github.com/souravsingh03)
