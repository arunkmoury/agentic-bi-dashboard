# Agentic BI Dashboard

This project demonstrates an AI-powered Business Intelligence (BI) dashboard. It leverages a Large Language Model (LLM) to interpret natural language queries about data in an Excel file, uses a Model Context Protocol (MCP) server to securely read the file, and dynamically generates interactive charts using React and Recharts.


## Features

* **Natural Language Querying:** Users can ask questions about their Excel data in plain English (e.g., "Show me a bar chart of Revenue by Region").
* **AI-Driven Analysis:** An LLM (OpenAI's GPT-4o) processes the query and the raw data to generate the appropriate chart configuration.
* **Secure Data Access:** An MCP server (`negokaz/excel-mcp-server`) reads the local Excel file, acting as a secure bridge between the file system and the AI agent.
* **Dynamic Visualization:** The React frontend uses the AI-generated configuration to render interactive charts (Line, Bar, Pie) with `recharts`.
* **Clean Architecture:** Separates the backend (Python/FastAPI) for data processing and AI interaction from the frontend (React) for user interface and visualization.

## Prerequisites

Before running the project, ensure you have the following installed:

* **Node.js:** Version 20 or later (for running the MCP server and Frontend).
* **Python:** Version 3.10 or later (for the Backend API).
* **OpenAI API Key:** You need a valid API key from OpenAI.

## Project Structure

```text
agentic-bi-dashboard/
├── backend/
│   ├── main.py                # FastAPI Server (The Agent's Brain)
│   ├── requirements.txt       # Python dependencies
│   ├── create_sample_excel.py # Script to generate dummy data
│   └── .env (Optional)        # For environment variables
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   └── AgenticChart.jsx  # Reusable Recharts Component
│   │   ├── App.js             # Main React Application
│   │   └── index.js
│   └── package.json           # Frontend dependencies
└── README.md
```

## Prerequisites
* Node.js: Required to run the MCP server (npx @negokaz/excel-mcp-server)

## How to Execute with OpenAI
You must export your OpenAI API Key in the terminal before running the python script.

For Windows (Command Prompt):

DOS
```
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt

set OPENAI_API_KEY=sk-proj-12345...
python main.py
```


For macOS/Linux:
```
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

export OPENAI_API_KEY="sk-proj-12345..."
python main.py
```

## Start the Frontend
Open a new terminal in the frontend/ folder:

```
npx create-react-app . 
npm install recharts

npm start
```
