# Contributing to Derivative

Thank you for your interest in contributing to Derivative! This document provides guidelines and instructions for setting up your development environment.

## Prerequisites

- .NET 9.0 SDK or later
- Docker (for containerized services)
- Git

## Development Environment Setup

### 1. Install the Aspire CLI (Daily Builds)

This project uses the latest daily builds of .NET Aspire. Install the Aspire CLI:

**On Linux or macOS:**
```bash
curl -sSL https://aspire.dev/install.sh | bash -s -- -q dev
```

**On Windows:**
```powershell
iex "& { $(irm https://aspire.dev/install.ps1) } -Quality dev"
```

After installation, restart your terminal or add `~/.aspire/bin` to your PATH:
```bash
export PATH="$HOME/.aspire/bin:$PATH"
```

### 2. Clone the Repository

```bash
git clone https://github.com/yourusername/derivative.git
cd derivative
```

### 3. Running the Project

To run the entire application stack:

```bash
aspire run
```

This will:
- Start all configured services
- Launch the Aspire Dashboard for monitoring
- Open the application in your browser

The Aspire Dashboard provides:
- Service status and logs
- Distributed tracing
- Metrics and health checks
- Resource management

### 4. Development Workflow

#### Making Changes

1. Make your changes to the relevant service
2. The Aspire orchestrator will automatically detect changes and restart affected services
3. View logs and traces in the Aspire Dashboard

#### Adding New Services

To add a new service to the app host:

1. Edit `apphost.cs` to register your service
2. Configure dependencies and environment variables
3. Run `aspire run` to test the integration

Example:
```csharp
var builder = DistributedApplication.CreateBuilder(args);

var myService = builder.AddProject<Projects.MyService>("myservice");

builder.Build().Run();
```

## Project Structure

```
derivative/
├── apphost.cs              # Aspire app host configuration
├── apphost.run.json        # Launch settings
├── services/               # Service implementations (not yet implemented)
│   ├── frontend/          # Client-side JavaScript application (not yet implemented)
│   ├── rendering/         # Python/Playwright rendering service (not yet implemented)
│   ├── ai-agents/         # Microsoft Agent Framework implementation (not yet implemented)
│   └── api/               # Backend API and WebSocket handler (not yet implemented)
└── docs/                  # Additional documentation
```

## Development Tips

### Viewing Service Logs

Use the Aspire Dashboard to view logs for all services in real-time.

### Debugging

- Launch services individually for debugging by running them from their respective directories
- Use the Aspire Dashboard to inspect service-to-service communication
- Check distributed traces to understand request flows

### Updating Aspire

To update to the latest daily build:

```bash
aspire update
```

This will update your project to use the newest available Aspire packages and feeds.

## Testing

(Testing guidelines to be added as test infrastructure is developed)

## Code Style

- Follow language-specific conventions for each service
- Keep services focused and loosely coupled
- Document AI agent behaviors and constraints
- Comment complex algorithmic art logic

## Submitting Changes

1. Create a feature branch from `main`
2. Make your changes with clear, descriptive commits
3. Test your changes thoroughly
4. Submit a pull request with a clear description of the changes

## Questions?

Feel free to open an issue for questions, suggestions, or bug reports.

## Code of Conduct

This project adheres to the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.
