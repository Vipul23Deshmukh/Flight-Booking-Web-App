# Deployment Guide

## Frontend (Vercel)

### Environment Variables

Set the following environment variable in Vercel Dashboard → Settings → Environment Variables:

| Variable | Value | Description |
|----------|-------|-------------|
| `REACT_APP_API_URL` | `https://your-backend.onrender.com` | Your Render backend URL |

### Deploy Steps

1. Push code to GitHub
2. Connect repository to Vercel
3. Set `BookMyFlight_UI` as the root directory (if asked)
4. Add the `REACT_APP_API_URL` environment variable
5. Deploy

---

## Backend (Render)

### Environment Variables

Set the following environment variables in Render Dashboard → Environment:

| Variable | Value | Description |
|----------|-------|-------------|
| `ConnectionStrings__DefaultConnection` | `server=your-mysql-host;port=3306;database=fbs;user=your-user;password=your-password` | MySQL connection string |
| `ASPNETCORE_URLS` | `http://+:$PORT` | Required for Render to bind port |

### Deploy Steps (Docker)

1. Create a new **Web Service** on Render
2. Connect your GitHub repository
3. Select **Docker** as the Environment
4. Set **Dockerfile Path**: `Flight-Reservation-System-Spring-boot-React-MySql-main/BookMyFlight_Net/BookMyFlight.Backend/Dockerfile`
5. Set **Docker Context**: `Flight-Reservation-System-Spring-boot-React-MySql-main/BookMyFlight_Net/BookMyFlight.Backend`
6. Add the environment variables (see above)
7. Deploy

### Database Options

For MySQL on production, you can use:
- **PlanetScale** (MySQL-compatible, free tier available)
- **Railway** (MySQL hosting)
- **Aiven** (MySQL hosting)
- **Amazon RDS** (if you need AWS)

---

## Important Notes

1. **CORS**: Backend already has `AllowAll` CORS policy configured
2. **Port**: Render assigns a dynamic port via `$PORT` environment variable
3. **SSL**: Both Vercel and Render provide HTTPS by default
4. **.env files**: Never commit `.env` files to git (they're in `.gitignore`)
