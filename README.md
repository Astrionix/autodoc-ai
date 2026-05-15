# AutoDoc AI – Academic Intelligence Platform

AutoDoc AI is a full-stack platform designed to help students, researchers, and educators quickly understand large documents through clean UI and intelligent analysis powered by the Groq API (LLaMA3/Mixtral).

## Features
- **Smart Summaries**: Distills long research papers into concise overviews.
- **Key Insights**: Highlights the most crucial data points and arguments.
- **Actionable Learnings**: Provides concrete steps and takeaways.
- **Professional UI**: Academic and trustworthy design using React & TailwindCSS.

## Project Structure
- `/app`: FastAPI Backend
- `/frontend`: Vite + React + TailwindCSS Frontend
- `/uploads`: Temporary document storage for processing

## Setup & Running

### Backend setup:
1. Navigate to the project root: `cd autodoc-ai`
2. Create and activate a virtual environment.
3. Install dependencies: `pip install -r requirements.txt`
4. Set up environment variables: Add your Groq API key to `.env`:
   ```
   GROQ_API_KEY=your_actual_groq_api_key
   ```
5. Run the FastAPI server: `python run.py` (Runs on http://localhost:8000)

### Frontend setup:
1. Navigate to the frontend folder: `cd autodoc-ai/frontend`
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev` (Runs on http://localhost:5173)

Enjoy the Academic Intelligence Suite!

# autodoc-ai
