# Vocabulary Trainer

A React-based vocabulary training app that helps Russian users learn, repeat, and track progress with English words. The app offers three learning modes: **Repeat** and **Mixed**, and includes daily progress tracking and customizable settings

1. **Clone the repository:**

```bash
git clone https://github.com/SteppesLover/LearnLanguage
cd LearnLanguage

2. **Install dependencies:**
npm install

3. **Run App:**
npm run dev

4. **API & STORAGE**
create .env file with:
VITE_AIRTABLE_API_KEY=XXX
VITE_AIRTABLE_BASE_ID=XXX
VITE_AIRTABLE_TABLE_NAME=Progress

**How to get those?**
1. Log in airtable:
2. create a table in airtable.com with:
name - Progress
titles:
wordId(number), status(text), repeatCount(number)

**3. How to get API_Key:**
3.1 Visit the Airtable Developer Hub
3.2 Click on "Create token".
3.3 Give your token a name (e.g., “Vocabulary Trainer”).
3.4 Under Access, select the specific base(s) you want to grant access to.
3.5 Click Create token and copy your token.
3.6 This is your API_KEY.

**4. Base_ID:** 
4.1 Open the Airtable base you want to use.
4.2 Click the Share button, then choose “Developers”.
4.3 Click "Use the API" to open the API documentation for your base.
4.4 Look at the URL, which will look like:
https://airtable.com/appXXXXXXXXXXXXXX/api/docs
The part after /airtable.com/ is your BASE_ID

