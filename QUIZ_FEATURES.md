# 🎯 MCQ Quiz Application - Complete Feature Documentation

## 📋 Overview

A fully-featured, mobile-friendly MCQ (Multiple Choice Questions) Quiz Application with multiple quiz modes, exam mode with timer and anti-cheating measures. Built with vanilla HTML, CSS, and JavaScript—NO dependencies required.

---

## 🎮 Features

### ✅ Core Features

1. **Three Quiz Modes**
   - **Quiz All**: Answer all questions from your question bank
   - **Select Questions**: Choose the number of questions (10, 25, 50, 100, or custom)
   - **Exam Mode**: Timed quiz with advanced security features

2. **Mobile-Friendly Design**
   - Fully responsive layout (mobile, tablet, desktop)
   - Touch-friendly buttons and options
   - Optimized for all screen sizes
   - Full-screen mode for immersive experience

3. **One-by-One Question Display**
   - Single question per screen
   - Clear visual hierarchy
   - Large, readable text
   - Easy navigation

4. **Answer Feedback System**
   - ✅ Green highlight for correct answers
   - ❌ Red highlight for wrong answers
   - Shows correct answer immediately
   - Detailed feedback message

5. **Two-Color Progress Bar**
   - Horizontal bar showing progress
   - Green segment for correct answers
   - Red segment for incorrect answers
   - Percentage completion displayed
   - Real-time updates

6. **Progress Tracking**
   - Current score display (e.g., "Score: 5/10")
   - Question counter (e.g., "5/10 questions completed")
   - Live updates as you answer

7. **Results & Review Section**
   - Final percentage score
   - Summary statistics (total, correct, incorrect, accuracy)
   - Detailed review of missed questions
   - Shows your answer vs. correct answer for each wrong question
   - Performance-based completion messages

---

## 🎓 Exam Mode Features

### ⏱️ Timer System
- **1 minute per question** countdown timer
- Remaining time always visible in top-right corner
- Auto-submission when time runs out
- Warning indicator when less than 1 minute remains

### 🚨 Tab Switch Detection
- Detects when user switches tabs/windows
- Shows warning modal on each violation
- Allows up to 3 warnings
- **Auto-submits exam on 4th attempt** (saved progress is submitted)
- Tab switch count displayed in warning

### 🔒 Anti-Cheating Measures

#### Disabled Features:
- ✓ Right-click context menu disabled
- ✓ Copy (Ctrl+C) disabled
- ✓ Paste (Ctrl+V) disabled
- ✓ Cut (Ctrl+X) disabled
- ✓ Long-press disabled (mobile)
- ✓ Developer tools (F12, DevTools shortcuts) disabled
- ✓ Text selection restrictions on questions
- ✓ Browser history/back navigation warnings

#### Security Notifications:
- Toast alerts for each blocked action
- Non-intrusive warnings
- Exam continues seamlessly

---

## 📊 Results & Analytics

### Score Breakdown
- **Percentage Score**: Bold, large display
- **Correct Answers**: Count and color-coded
- **Incorrect Answers**: Count and color-coded
- **Accuracy Rate**: Percentage display

### Performance Messages
- 100% → "🎉 Perfect Score! Excellent work!"
- 80% → "🌟 Great job! You did very well!"
- 60% → "👍 Good effort! Keep practicing!"
- 40% → "💪 Keep practicing! You'll improve!"
- <40% → "📚 Review the material and try again!"

### Detailed Review
- Question-by-question breakdown
- Your answer vs. correct answer
- Color-coded review items
- Badges indicating correct/incorrect

---

## 🎯 Quiz Modes In Detail

### Mode 1: Quiz All
```
1. Select "Quiz All" from Setup
2. System loads ALL questions from questions.json
3. Questions shown one by one
4. Answer each question
5. View complete results with review
```

### Mode 2: Select Questions
```
1. Select "Select Questions" from Setup
2. Choose question count:
   - 10 Questions
   - 25 Questions
   - 50 Questions
   - 100 Questions
   - Custom (enter any number)
3. System randomly selects from question bank
4. Complete the quiz
5. After results:
   - Retake with same questions
   - Retake with different random questions
   - Back to Setup
```

### Mode 3: Exam Mode
```
1. Select "Exam Mode" from Setup
2. Choose question count (same options as Select)
3. Timer starts: 1 minute × number of questions
4. Tab-switching detection enabled
5. Anti-cheating measures active
6. Auto-submit if:
   - Time runs out
   - 3 tab switches exceed
7. View results (cannot retake in exam context)
```

---

## 🎨 Design Features

### Modern UI/UX
- Gradient backgrounds and accents
- Smooth animations and transitions
- Clean card-based layout
- Professional color scheme
- Emoji icons for visual appeal

### Accessibility
- Keyboard navigation support
- Focus indicators
- High contrast text
- Responsive to motion preferences
- Semantic HTML structure

### Performance
- No external dependencies
- Lightweight (~50KB total)
- Instant question loading
- Smooth 60fps animations
- No page reloads

---

## 📱 Mobile Features

### Touch Optimization
- Large touch targets (44px minimum)
- Gesture support
- Swipe-friendly layout
- Full-screen mode removes distractions
- Landscape and portrait support

### Cross-Device Support
- Mobile phones (iOS, Android)
- Tablets (iPad, Android tablets)
- Desktop browsers (Chrome, Firefox, Safari, Edge)
- Works offline (once loaded)

---

## 🚀 Getting Started

### Setup Instructions

1. **Folder Structure**
   ```
   MCQ-quiz-webapplication/
   ├── index.html
   ├── questions.json
   ├── css/
   │   └── style.css
   └── js/
       ├── quiz.js
       └── exam.js
   ```

2. **Prepare Your Data**
   - Ensure `questions.json` is in the root folder
   - Format required:
   ```json
   [
     {
       "id": 1,
       "question": "What is...?",
       "options": ["Option A", "Option B", "Option C", "Option D"],
       "answer": "Option A",
       "category": "Topic Name (Optional)"
     }
   ]
   ```

3. **Run the Application**
   - **Option A**: Use Live Server (VS Code extension)
     - Right-click `index.html` → "Open with Live Server"
   
   - **Option B**: Python SimpleHTTPServer
     ```bash
     cd MCQ-quiz-webapplication
     python -m http.server 8000
     # Open http://localhost:8000
     ```
   
   - **Option C**: Node.js http-server
     ```bash
     npm install -g http-server
     http-server
     # Open http://localhost:8080
     ```

   **⚠️ Important**: Do NOT open `index.html` with `file://` protocol. Use a local server to avoid CORS errors when loading `questions.json`.

---

## 🎓 Question Format

### Minimal Format (Required)
```json
{
  "question": "What is X?",
  "options": ["A", "B", "C", "D"],
  "answer": "A"
}
```

### Complete Format (Recommended)
```json
{
  "id": 1,
  "question": "What is the capital of France?",
  "options": ["Paris", "London", "Berlin", "Madrid"],
  "answer": "Paris",
  "category": "Geography",
  "difficulty": "easy",
  "explanation": "Paris is the capital and largest city of France."
}
```

---

## ⌨️ Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Toggle Fullscreen | Click fullscreen button or F11 |
| Submit Answer | Click "Submit Answer" or press Enter |
| Next Question | Click "Next Question" |
| Exit Quiz | Click "❌" button (with confirmation) |

**Note**: In Exam Mode, many shortcuts are disabled for security.

---

## 🔐 Security & Proctoring

### Tab Switch Detection
- Monitors when user leaves the page
- Counts each violation
- Displays warning modal
- Auto-submits on 3+ violations

### Copy/Paste Prevention
- Disables Ctrl+C, Ctrl+V, Ctrl+X
- Right-click menu disabled
- Long-press disabled on mobile
- Selection restrictions on sensitive text

### Developer Tools Prevention
- F12 blocked
- Ctrl+Shift+I blocked
- Ctrl+Shift+J blocked
- Ctrl+Shift+C blocked
- Shows alert for each attempt

### Browser Warnings
- Warns when leaving exam page
- "Are you sure?" confirmation on exit
- Timer keeps counting even if minimized

---

## 🎯 Use Cases

1. **Educational Institutions**
   - Teachers create question banks
   - Students practice before exams
   - Track improvement over time

2. **Online Training**
   - Employee certification courses
   - Professional development
   - Skill assessments

3. **Self-Study**
   - Personal learning projects
   - Language learning
   - Technical skill building

4. **Competitive Exams**
   - SAT/GRE/GMAT practice
   - Competitive coding interviews
   - Professional licensing exams

---

## 🐛 Troubleshooting

### Issue: `questions.json` fails to load
**Solution**: Use a local server instead of `file://` protocol
```bash
# Quick Python server
python -m http.server 8000
# Then open http://localhost:8000
```

### Issue: Styles not loading
**Solution**: Ensure folder structure matches. CSS should be at `css/style.css`

### Issue: Timer not showing in Exam Mode
**Solution**: 
- Select "Exam Mode"
- Timer will appear once quiz starts
- Timer shows in top-right corner

### Issue: Tab switch detection not working
**Solution**: 
- Tab detection is browser-dependent
- Works best in Chrome/Firefox/Edge
- May not detect minimize/taskbar switches on all systems

---

## 📈 Future Enhancements

Potential features for future versions:
- [ ] Leaderboards and scoring history
- [ ] Question difficulty levels
- [ ] Category-based filtering
- [ ] Timed practice rounds
- [ ] Analytics dashboard
- [ ] Export results as PDF
- [ ] Spaced repetition algorithm
- [ ] Question bookmarking
- [ ] Multi-player quiz competition
- [ ] Voice instructions (accessibility)

---

## 📄 License

This application is provided as-is for educational purposes.

---

## ✨ Credits

Built with ❤️ for interactive learning.

---

## 🤝 Support

For issues or feature requests, please check:
1. The troubleshooting section above
2. Browser console for error messages (F12)
3. Ensure `questions.json` format is correct

---

**Enjoy your MCQ Quiz Experience! 🎉**
