import os
import json
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client
from openai import AsyncOpenAI  # CHANGED: Import OpenAI

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],        # Allow all origins
    allow_credentials=True,     
    allow_methods=["*"],        # Allow all HTTP methods
    allow_headers=["*"],        # Allow all headers
)

# 1. Initialize OpenAI Client
# Make sure you set the OPENAI_API_KEY environment variable before running!
client = AsyncOpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

# 2. Configuration for the Excel MCP Server (Same as before)
# This uses the 'negokaz/excel-mcp-server' tool definitions.
MCP_SERVER_PARAMS = StdioServerParameters(
    command="npx",
    args=["-y", "@negokaz/excel-mcp-server"],
    env={"EXCEL_MCP_PAGING_CELLS_LIMIT": "4000"}
)

class DashboardRequest(BaseModel):
    prompt: str
    file_path: str
    sheet_name: str = "Sheet1"

SYSTEM_PROMPT = """
You are a Data Visualization Expert.
1. Use the provided Excel data to analyze the user's request.
2. Return ONLY a valid JSON object with the following structure:
{
  "chartData": [{"name": "A", "value": 10}, ...],
  "chartConfig": {
    "type": "BarChart", 
    "title": "Chart Title", 
    "xKey": "name", 
    "dataKeys": ["value"],
    "colors": ["#8884d8"]
  }
}
"""

async def run_agent_pipeline(prompt: str, file_path: str, sheet_name: str):
    # 3. Connect to the MCP Server
    async with stdio_client(MCP_SERVER_PARAMS) as (read, write):
        async with ClientSession(read, write) as session:
            await session.initialize()

            # 4. Call the Tool directly
            # We use the arguments defined in the excel-mcp-server docs.
            result = await session.call_tool(
                "excel_read_sheet",
                arguments={
                    "fileAbsolutePath": os.path.abspath(file_path),
                    "sheetName": sheet_name,
                    "range": "A1:E50" # Adjust range based on your data size
                }
            )
            
            # Extract the raw text from the tool result
            raw_excel_data = result.content[0].text
            print(result)
            # 5. Send to OpenAI for reasoning
            final_prompt = f"User Request: {prompt}\n\nHere is the raw Excel data:\n{raw_excel_data}"
            
            response = await client.chat.completions.create(
                model="gpt-4o",  # Use a smart model for better data reasoning
                messages=[
                    {'role': 'system', 'content': SYSTEM_PROMPT},
                    {'role': 'user', 'content': final_prompt},
                ],
                response_format={ "type": "json_object" } # Forces strict JSON output
            )

            return response.choices[0].message.content

@app.post("/generate-dashboard")
async def generate_dashboard(request: DashboardRequest):
    # Security check for API Key
    if not os.environ.get("OPENAI_API_KEY"):
         raise HTTPException(status_code=500, detail="OPENAI_API_KEY not found. Please set it in your terminal.")

    try:
        if not os.path.exists(request.file_path):
            raise HTTPException(status_code=400, detail="Excel file not found.")

        json_str = await run_agent_pipeline(request.prompt, request.file_path, request.sheet_name)
        
        # OpenAI returns clean JSON, so we just parse it
        return json.loads(json_str)

    except Exception as e:
        # Improved error logging
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)