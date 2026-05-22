# MediResponse 🚑

Emergency coordination platform — Spring Boot backend + React/Vite frontend.

## Tech Stack
- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, Google Gemini AI
- **Backend**: Spring Boot 3.2, Java 17, Spring Security, JPA/Hibernate
- **Database**: MySQL (free tier on Railway or PlanetScale)

## Project Structure
```
MediResponse/
├── backend/          ← Spring Boot (Maven)
│   ├── Dockerfile    ← Deploy to Railway or Render
│   └── src/main/java/com/mediresponse/
└── frontend/         ← React + Vite
    └── vercel.json   ← Deploy to Vercel
```

## Deployment

### Backend → Railway (recommended, free MySQL included)
1. Push project to GitHub
2. Create new project on [railway.app](https://railway.app)
3. Add a **MySQL** plugin — Railway auto-injects `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, `SPRING_DATASOURCE_PASSWORD`
4. Deploy the `/backend` folder; Railway detects the `Dockerfile` automatically
5. Set these env vars in Railway:
   - `JWT_SECRET` = any long random string (32+ chars)
   - `ALLOWED_ORIGINS` = your Vercel frontend URL (e.g. `https://mediresponse.vercel.app`)

### Frontend → Vercel
1. Import the repo on [vercel.com](https://vercel.com)
2. Set **Root Directory** to `frontend`
3. Add env vars:
   - `VITE_API_BASE_URL` = your Railway backend URL + `/api` (e.g. `https://xxx.up.railway.app/api`)
   - `VITE_GEMINI_API_KEY` = your Google AI Studio key

### Demo credentials (auto-seeded on first run)
| Role           | Employee ID | Password |
|----------------|-------------|----------|
| Paramedic      | AMB-001     | demo123  |
| Hospital Admin | HOSP-001    | demo123  |
| Toll Operator  | TOLL-001    | demo123  |
