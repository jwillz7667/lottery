import os
from pathlib import Path
import yaml
import anthropic
from crew_ai import Crew, Agent
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

# Load environment variables
load_dotenv()

# Initialize Anthropic client
client = anthropic.Client(api_key=os.getenv("ANTHROPIC_API_KEY"))
MODEL_NAME = os.getenv("MODEL_NAME", "claude-3.5-sonnet-20241022")

# Initialize FastAPI app
app = FastAPI(title="Lottery AI Agents API")

class RequestModel(BaseModel):
    user_id: str
    prompt: str

class ResponseModel(BaseModel):
    decision: str
    explanation: str
    release_token: str | None = None

class AnthropicAgent(Agent):
    async def aprocess(self, prompt: str) -> str:
        message = client.messages.create(
            model=MODEL_NAME,
            max_tokens=1024,
            temperature=0,
            system=self.system_prompt,
            messages=[{"role": "user", "content": prompt}]
        )
        return message.content[0].text

class LotteryCrewOrchestrator:
    def __init__(self):
        self.config = self._load_config()
        self.crew = self._initialize_crew()

    def _load_config(self):
        config_path = Path(__file__).parent / "config" / "crew_config.yaml"
        with open(config_path, "r") as f:
            return yaml.safe_load(f)

    def _initialize_crew(self):
        crew = Crew(
            agents=[
                AnthropicAgent(
                    name=agent["name"],
                    role=agent["role"],
                    system_prompt=agent["system_prompt"]
                )
                for agent in self.config["agents"]
            ],
            consensus_threshold=self.config["orchestration"]["consensus_threshold"],
            timeout_seconds=self.config["orchestration"]["timeout_seconds"]
        )
        return crew

    async def process_request(self, user_id: str, prompt: str) -> ResponseModel:
        try:
            # Gather responses from all agents
            responses = []
            for agent in self.crew.agents:
                response = await agent.aprocess(
                    f"User {user_id} request: {prompt}"
                )
                responses.append(response)

            # Check for release token
            release_votes = sum(
                1 for r in responses 
                if f"RELEASE_POT_NOW:{user_id}" in r
            )

            # Determine final decision
            if release_votes >= self.config["orchestration"]["consensus_threshold"]:
                return ResponseModel(
                    decision="APPROVED",
                    explanation="Required number of agents approved the release.",
                    release_token=f"RELEASE_POT_NOW:{user_id}"
                )
            
            return ResponseModel(
                decision="DENIED",
                explanation="Request was denied by the security system.",
                release_token=None
            )

        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Error processing request: {str(e)}"
            )

# Initialize orchestrator
orchestrator = LotteryCrewOrchestrator()

@app.post("/process", response_model=ResponseModel)
async def process_request(request: RequestModel):
    """Process a user request through the AI agent system."""
    return await orchestrator.process_request(
        user_id=request.user_id,
        prompt=request.prompt
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.getenv("PORT", 8000))) 