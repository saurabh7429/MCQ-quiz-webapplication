# 🚀 Quick Setup Guide

## ⚡ 30-Second Setup

### Step 1: Check Your Folder Structure
```
MCQ-quiz-webapplication/
├── index.html
├── questions.json
├── css/style.css
└── js/quiz.js & exam.js
```

✅ All files are already created!

### Step 2: Start a Local Server

Choose ONE option:

**Option A: Python (Built-in on Most Systems)**
```bash
cd MCQ-quiz-webapplication
python -m http.server 8000
```
Then open: `http://localhost:8000`

**Option B: Node.js**
```bash
npm install -g http-server
http-server
```
Then open: `http://localhost:8080`

**Option C: VS Code Live Server**
1. Install extension: "Live Server"
2. Right-click `index.html`
3. Select "Open with Live Server"

### Step 3: Start Using!
1. Open the app in your browser
2. Select a quiz mode
3. Answer questions
4. View results

---

## 📋 Question File Format

Your `questions.json` should look like this:

```json
[
  {
    "id": 1,
    "question": "What is the capital of France?",
    "options": ["Paris", "London", "Berlin", "Madrid"],
    "answer": "Paris",
    "category": "Geography"
  },
  {
    "id": 2,
    "question": "Which planet is known as the Red Planet?",
    "options": ["Mars", "Venus", "Jupiter", "Saturn"],
    "answer": "Mars",
    "category": "Science"
  }
]
```

---

## ✨ Features

### 📚 Quiz All
- Answer every question in your bank
- See all results at the end
- Review your mistakes

### 🎯 Select Questions  
- Choose 10, 25, 50, or 100 questions
- Or enter a custom number
- Random selection each time

### ⏱️ Exam Mode
- Timed (1 minute per question)
- Tab-switch detection (max 3 warnings)
- Anti-cheating measures
- Auto-submit on time out

---

## 📱 Features Included

✅ Mobile-friendly design
✅ Green/red answer highlighting  
✅ 2-color progress bar
✅ Full-screen mode
✅ Results & review section
✅ Timer for exam mode
✅ Tab switch detection
✅ Copy/paste prevention
✅ Developer tools blocking
✅ Long-press prevention (mobile)

---

## 🎨 UI Highlights

- **Clean, modern design** with gradients
- **Smooth animations** for better UX
- **Responsive layout** for all devices
- **Color-coded results** (green/red)
- **Live progress tracking**
- **Toast notifications** for alerts

---

## 🐛 Common Issues

### ❌ "Failed to load questions.json"
**Fix**: Don't open with `file://` - Use a local server!

### ❌ CSS styles missing
**Fix**: Check folder structure. Should be at: `css/style.css`

### ❌ Timer not showing
**Fix**: Select "Exam Mode" - timer appears after starting

---

## 📞 Need Help?

1. Check `QUIZ_FEATURES.md` for full documentation
2. Verify `questions.json` format is correct
3. Ensure you're using a local server (not file://)
4. Check browser console for errors (F12)

---

**Ready to quiz? Start the local server and open the app! 🎉**
