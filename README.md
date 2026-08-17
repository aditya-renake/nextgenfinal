# 🧭 NexGen Careers — Find Your Path After 12th

An interactive, responsive career orientation web application designed for students completing 12th grade. Featuring a 10-question situational career compass quiz, dynamic SVG dial animations, end-to-end career roadmaps, exam timelines, official test registration links, and serverless API endpoints.

---

## 📁 Project Structure

```text
compass-app/
├── index.html          # Semantic HTML5 entry file
├── css/
│   └── style.css       # Complete design system, dark mode & responsive CSS
├── js/
│   ├── data.js         # Career directions, quiz questions, exam info & roadmaps
│   └── app.js          # Compass SVG math, quiz engine, filters & interactions
├── api/
│   ├── careers.js      # Serverless API: /api/careers (filtering & search)
│   └── quiz.js         # Serverless API: /api/quiz (questions & result scoring)
├── vercel.json         # Vercel deployment routing and security headers
├── package.json        # Project metadata and npm scripts
├── .gitignore          # Git exclusion rules
└── README.md           # Documentation and setup instructions
```

---

## 🚀 How to Run Locally

You don't need any complex build step. You can run it with any static server:

```bash
# Using npx serve
npx serve .

# Or using Python 3
python3 -m http.server 8000
```
Open [http://localhost:3000](http://localhost:3000) (or port 8000) in your browser.

---

## 🐙 Step 1: Upload to GitHub

1. Open your terminal and navigate to the project directory:
   ```bash
   cd /path/to/compass-app
   ```

2. Initialize a Git repository and commit your files:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Modular Compass career web app"
   ```

3. Create a new repository on [GitHub](https://github.com/new).

4. Link and push to your GitHub repository:
   ```bash
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```

---

## ⚡ Step 2: Deploy to Vercel (Ready in 30 seconds)

### Option A: Via Vercel Web Dashboard (Recommended)
1. Go to [vercel.com](https://vercel.com) and log in.
2. Click **"Add New..."** → **"Project"**.
3. Import your GitHub repository (`YOUR_REPO_NAME`).
4. Keep the default settings (Framework Preset: *Other*, Root Directory: `./`).
5. Click **"Deploy"**.

### Option B: Via Vercel CLI
```bash
# Install Vercel CLI if not already installed
npm i -g vercel

# Deploy directly from terminal
vercel
```

---

## 🔌 API Endpoints (Vercel Serverless Functions)

- **GET `/api/careers`**: Returns all 16 detailed career paths.
  - Query params: `?category=eng` or `?search=doctor`
- **GET `/api/quiz`**: Returns the list of quiz questions.
- **POST `/api/quiz`**: Accepts `{"answers": [0, 1, 2, ...]}` and returns ranked score breakdown.

---

## 📄 License
MIT License
