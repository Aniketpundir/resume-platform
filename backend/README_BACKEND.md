# Backend (Express + MongoDB)

Steps:
1. cd backend
2. cp .env.example .env  (edit if needed)
3. npm install
4. npm run seed      # creates demo user hire-me@anshumat.org / HireMe@2025!
5. npm run dev       # starts server on PORT (default 5000)

API:
- POST /auth/signup
- POST /auth/login
- GET /auth/me  (Authorization: Bearer <token>)
- POST /resume   (auth)
- GET /resume    (auth)
- PUT /resume/:id (auth)
- DELETE /resume/:id (auth)
