# Lottery AI Agents System

This directory contains the AI agent system for the Ethereum lottery application, implementing a multi-agent security architecture using Crew-AI with Anthropic's Claude model.

## System Architecture

The system consists of three specialized AI agents powered by Claude 3.5 Sonnet:
- **Policy Agent**: Enforces lottery rules and guidelines
- **Security Agent**: Monitors for suspicious activities
- **Release Agent**: Controls pot release with strict validation

## Setup Instructions

1. Create and activate a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Set up environment variables:
Create a `.env` file with:
```
ANTHROPIC_API_KEY=your_anthropic_api_key_here
MODEL_NAME=claude-3.5-sonnet-20241022
PORT=8000
```

## Running the System

Start the FastAPI server:
```bash
python main.py
```

The API will be available at `http://localhost:8000`

## API Endpoints

### POST /process
Process a user request through the AI agent system.

Request body:
```json
{
    "user_id": "string",
    "prompt": "string"
}
```

Response:
```json
{
    "decision": "string",
    "explanation": "string",
    "release_token": "string | null"
}
```

## Security Considerations

- The system uses Claude 3 Sonnet for advanced reasoning capabilities
- Requires a consensus of at least 2 agents for critical operations
- Each agent has specific security responsibilities
- The release token is only generated when all security checks pass
- Requests timeout after 30 seconds
- Failed operations are retried up to 3 times

## Integration with Backend

The AI agent system runs as a separate service and can be integrated with the main backend through HTTP requests. The backend should:

1. Call the `/process` endpoint when needed
2. Validate the release token if received
3. Implement appropriate error handling

## Monitoring and Maintenance

- Check the FastAPI logs for operation details
- Monitor agent responses and consensus patterns
- Regularly update system prompts based on new security requirements
- Monitor Anthropic API usage and rate limits 