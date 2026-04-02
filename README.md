# Movie Rating App

A modern web application built with Next.js that allows users to register, verify their email, sign in securely, and manage movie ratings. The app features email verification, OAuth integration, and a responsive dark-mode UI.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Features Implemented](#features-implemented)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Future Enhancements](#future-enhancements)
- [Deployment](#deployment)

---

## 🎯 Project Overview

Movie Rating App is a full-stack application that enables users to:

- Register with email verification
- Sign in with credentials or OAuth providers (Google, GitHub)
- Manage a personal collection of movies
- Rate and track their favorite films

The project prioritizes **security** (password hashing, JWT sessions) and **user experience** (email verification, OAuth integration, dark mode).

---

## 🛠 Tech Stack

**Frontend:**

- Next.js 16.1.6 (App Router)
- React 19.2.3
- TypeScript
- Tailwind CSS 4
- Shadcn UI Components
- Next Themes (dark mode)

**Backend:**

- Next.js API Routes
- NextAuth 4.24.13 (Authentication)
- Prisma 7.4.0 (ORM)
- Neon (Database)

**Authentication & Email:**

- NextAuth with JWT strategy
- OAuth providers: Google, GitHub
- Resend (Email service)
- Bcryptjs (Password hashing)

**Developer Tools:**

- Zod (Validation)
- Tanstack Query (Data fetching)
- ESLint (Linting)
- Zustand (State management)

---

## ✅ Features Implemented

### 1. **User Authentication**

- ✅ Email/password registration with validation
- ✅ Secure password hashing (bcryptjs)
- ✅ JWT-based session management
- ✅ Email verification with token-based links
- ✅ 24-hour token expiry for security
- ✅ OAuth integration (Google, GitHub)
- ✅ Credentials provider for traditional login

### 2. **Email Verification System**

- ✅ Automatic verification email on signup
- ✅ Secure token generation (crypto.randomBytes)
- ✅ Email verification endpoint (`/api/auth/verify-email`)
- ✅ Resend verification endpoint for expired tokens
- ✅ Verification success page
- ✅ User can sign in with unverified email (optional reminder feature ready)

### 3. **Database**

- ✅ User model with email verification fields
- ✅ VerificationToken model for managing tokens
- ✅ Movie model with user relationships
- ✅ Account model for OAuth provider linking
- ✅ Session model for JWT management
- ✅ Neon database with Prisma migrations

### 4. **API Endpoints**

- ✅ `POST /api/auth/signup` - User registration with email verification
- ✅ `GET /api/auth/verify-email` - Verify email with token
- ✅ `POST /api/auth/resend-verification` - Resend verification email
- ✅ `GET /api/movies` - Fetch user's movies (authenticated)
- ✅ `POST /api/movies` - Create new movie entry
- ✅ `PATCH /api/movies/[id]` - Update movie details
- ✅ `DELETE /api/movies/[id]` - Delete movie entry

### 5. **UI/UX**

- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Dark mode support with next-themes
- ✅ Form validation with error messages
- ✅ Loading states and error handling
- ✅ Verification confirmation screen
- ✅ Sign in/Sign up pages with OAuth buttons
- ✅ Movie management interface

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ (or using pnpm)
- Neon database
- GitHub & Google OAuth credentials
- Resend account for email service

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/mariamALLI/movies-rating-app.git
cd movies-rating-app
```

2. **Install dependencies**

```bash
pnpm install
```

3. **Set up environment variables** (see [Environment Variables](#environment-variables))

```bash
cp .env.example .env.local
# Edit .env.local with your credentials
```

4. **Set up database**

```bash
# Run migrations
pnpm exec prisma migrate dev

# (Optional) Seed database
pnpm exec prisma db seed
```

5. **Run development server**

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔐 Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/movies_db"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-generate-with-openssl-rand-base64-32"
NEXTAUTH_PUBLIC_APP_URL="http://localhost:3000"
NEXTAUTH_PUBLIC_APP_URL="http://localhost:3000"

# Resend (Email Service)
RESEND_API_KEY="re_xxx_your_api_key"
RESEND_FROM_EMAIL="noreply@yourdomain.com"

# OAuth Providers
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
```

### How to obtain credentials:

- **Resend**: https://resend.com (verify your domain, get API key)
- **Google OAuth**: https://console.cloud.google.com/
- **GitHub OAuth**: https://github.com/settings/developers

---

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── auth/
│   │       ├── signup/route.ts           # User registration
│   │       ├── verify-email/route.ts     # Email verification
│   │       ├── resend-verification/route.ts
│   │       └── [...]nextauth/route.ts    # NextAuth handler
│   ├── auth/
│   │   ├── signin/page.tsx               # Sign in page
│   │   ├── signup/page.tsx               # Sign up page
│   │   └── verify-email/page.tsx         # Verification result page
│   └── movies/
│       └── page.tsx                      # Dashboard
├── components/
│   ├── emails/
│   │   └── verify-email.tsx              # Email template
│   ├── ui/                               # Shadcn components
│   └── layout/                           # Layout components
├── lib/
│   ├── auth.ts                           # NextAuth configuration
│   ├── email.ts                          # Email service (Resend)
│   ├── prisma.ts                         # Prisma client
│   ├── validation/
│   │   └── auth.ts                       # Zod schemas
│   └── utils.ts                          # Utility functions
├── hooks/
│   └── movie-service.ts                  # Movie API hooks
└── generated/
    └── prisma/                           # Generated types
prisma/
├── schema.prisma                         # Database schema
├── seed.ts                               # Database seeding
└── migrations/                           # Migration history
```

---

## 🔌 API Endpoints

### Authentication

| Method | Endpoint                           | Description                               |
| ------ | ---------------------------------- | ----------------------------------------- |
| POST   | `/api/auth/signup`                 | Register new user with email verification |
| GET    | `/api/auth/verify-email?token=xxx` | Verify email with token                   |
| POST   | `/api/auth/resend-verification`    | Resend verification email                 |
| GET    | `/api/auth/session`                | Get current session                       |

### Movies

| Method | Endpoint           | Description                       |
| ------ | ------------------ | --------------------------------- |
| GET    | `/api/movies`      | Get user's movies (authenticated) |
| POST   | `/api/movies`      | Create movie entry                |
| PATCH  | `/api/movies/[id]` | Update movie                      |
| DELETE | `/api/movies/[id]` | Delete movie                      |

---

## 📋 Authentication Flow

### Signup Flow

1. User fills signup form (name, email, password)
2. Validation with Zod schema
3. Password hashed with bcryptjs
4. User created in database with `emailVerified: null`
5. Verification token generated and stored
6. Verification email sent via Resend
7. User redirected to "Check Your Email" screen
8. User clicks link in email → token verified → `emailVerified` timestamp set
9. User can now sign in

### Signin Flow

1. User enters email and password
2. Credentials validated with Zod
3. User lookup in database
4. Password comparison with bcrypt
5. JWT token created with user ID and email
6. Session callback populates email in session
7. User redirected to `/movies` dashboard
8. Protected routes check for valid session

---

## 🔮 Future Enhancements

### Authentication & Security

- [ ] **Password Reset** - Forgot password functionality
- [ ] **Account Recovery** - Recovery codes and backup options
- [ ] **Rate Limiting** - Prevent brute force attacks
- [ ] **Device Verification** - Track and manage trusted devices
- [ ] **Social Account Linking** - Link multiple OAuth providers

### Email & Notifications

- [ ] **Email Notifications** - Activity alerts, recommendations
- [ ] **Notification Preferences** - User-controlled notification settings
- [ ] **Email Templates** - Enhanced HTML templates with branding

### Movie Features

- [ ] **Rating System** - 5-star ratings with reviews
- [ ] **Review Comments** - Write detailed reviews
- [ ] **Movie Search** - Advanced search with filters
- [ ] **Movie Recommendations** - AI-powered suggestions
- [ ] **Watchlist** - Save movies to watch later
- [ ] **Social Features** - Share ratings, follow users
- [ ] **Export/Import** - Download movie data

### User Profile

- [ ] **Profile Management** - Edit name, avatar, preferences
- [ ] **Privacy Settings** - Control data visibility
- [ ] **Account Deletion** - GDPR compliance
- [ ] **Statistics Dashboard** - Movies watched, ratings given, etc.

### Admin & Moderation

- [ ] **Admin Dashboard** - User management, analytics
- [ ] **Content Moderation** - Review flagged content
- [ ] **Audit Logs** - Track user activities

### Developer Experience

- [ ] **API Documentation** - Swagger/OpenAPI spec
- [ ] **Testing Suite** - Unit, integration, E2E tests
- [ ] **Logging** - Structured logging with timestamps
- [ ] **Error Tracking** - Sentry integration
- [ ] **Performance Monitoring** - Analytics dashboard

### Deployment & DevOps

- [ ] **CI/CD Pipeline** - GitHub Actions automation
- [ ] **Docker Support** - Containerization
- [ ] **Database Backups** - Automated backups
- [ ] **CDN Integration** - Image optimization and caching

---

## 🧪 Testing

Currently, no test suite is implemented. Future work includes:

- Unit tests for API routes
- Integration tests for database operations
- E2E tests for signup/signin flows

---

## 🚀 Deployment

### Deploy on Vercel (Recommended)

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com/)
3. Import your repository
4. Set environment variables in Vercel dashboard
5. Deploy with one click

### Deploy on Other Platforms

For deployment on AWS, Heroku, DigitalOcean, etc., refer to [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).

---

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [NextAuth Documentation](https://next-auth.js.org/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Resend Documentation](https://resend.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

## 📝 License

This project is open source and available under the MIT License.

---

## 👤 Author

**Mariam ALLI**

- GitHub: [@mariamALLI](https://github.com/mariamALLI)
- Email: mariam_oa@yahoo.com

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📞 Support

For issues or questions, please open an issue on GitHub or contact the author.
