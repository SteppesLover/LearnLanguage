# Vocabulary Trainer

A React-based vocabulary training app that helps Russian users learn, repeat, and track progress with English words. The app offers three learning modes: **Repeat** and **Mixed**, and includes daily progress tracking and customizable settings

1. **Clone the repository:**

git clone https://github.com/SteppesLover/LearnLanguage
cd LearnLanguage

2. **Install dependencies:**
npm install

3. **Run App:**
npm run dev

4. **Environment Setup**

create .env file with:

VITE_AIRTABLE_API_KEY=XXX

VITE_AIRTABLE_BASE_ID=XXX

VITE_AIRTABLE_TABLE_NAME=Progress

5. **Airtable Configuration**
1. Log in to Airtable
Create a table named Progress with the following columns:
wordId (number)
status (text)
repeatCount (number)
(optional) isUsedToday (boolean)

2. How to get your API key:
Visit the Airtable Developer Hub
Click Create token
Name it (e.g., “Vocabulary Trainer”)
Under “Access,” select your base
Click Create token and copy your key

3. How to get your Base ID:
Open your Airtable base
Click Share → Developers → Use the API
In the URL, the part after airtable.com/ is your Base ID
Example:
https://airtable.com/appXXXXXXXXXXXXXX/api/docs
Base ID = appXXXXXXXXXXXXXX

6. **Project Structure**
src/
 ├─ assets/
 │   ├─ icons/
 │   ├─ progress.json
 │   └─ words.json
 ├─ features/
 │   ├─ DailyProgress.jsx
 │   └─ ProgressProcessor.jsx
 ├─ pages/
 │   ├─ MixedPage.jsx
 │   ├─ RepeatPage.jsx
 │   ├─ SettingsPage.jsx
 │   └─ NotFoundPage.jsx
 ├─ shared/
 │   ├─ AddWordForm.jsx
 │   ├─ Flashcard.jsx
 │   ├─ Layout.jsx
 │   ├─ Navbar.jsx
 │   └─ ResetProgressButton.jsx
 ├─ App.jsx
 └─ main.jsx

7. **Added Dependencies**
Package-Purpose-Direct DOM Manipulation
react-Core UI library for building components-Uses virtual DOM only
react-dom-Renders React tree to the browser DOM-Controlled internally by React (safe)
react-router-dom-Routing between pages
react-router-Core routing logic	
chai, vitest, @testing-library/...-Testing and assertions-Used only in test environment

The project does not perform any manual DOM manipulation.
All DOM interactions are handled internally by React through its virtual DOM system.
No direct use of document.querySelector, innerHTML, or window APIs is present in the source code.

8. **Features**

View and repeat English words
Track daily progress
Customize daily repetition limit
Reset daily progress
Add new words to your vocabulary
Persistent progress storage via Airtable and localStorage
Responsive UI with different fonts for headings and text

9. **Demonstrated React Concepts**
Concept-Implemented In
children props-Layout.jsx
reusable components (2+)-Flashcard, ResetProgressButton, DailyProgress
conditional rendering (4+)-MixedPage, SettingsPage, ResetProgressButton, AddWordForm
controlled form with validation-SettingsPage, AddWordForm
useEffect (2+)-MixedPage, AddWordForm
useCallback-MixedPage

Author
Alikhan Amanzhanov
GitHub: SteppesLover