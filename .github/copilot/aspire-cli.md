# Aspire CLI Reference

This document provides quick reference for working with the Aspire CLI in the Derivative project.

## Installation

### Installing Daily Builds

This project uses Aspire daily builds. Install with:

**Linux/macOS:**
```bash
curl -sSL https://aspire.dev/install.sh | bash -s -- -q dev
```

**Windows:**
```powershell
iex "& { $(irm https://aspire.dev/install.ps1) } -Quality dev"
```

### Installing with VS Code Extension

To install both CLI and VS Code extension:

**Linux/macOS:**
```bash
curl -sSL https://aspire.dev/install.sh | bash -s -- --install-extension -q dev
```

**Windows:**
```powershell
iex "& { $(irm https://aspire.dev/install.ps1) } -InstallExtension -Quality dev"
```

### Path Configuration

After installation, add to your PATH:

```bash
export PATH="$HOME/.aspire/bin:$PATH"
```

Add this to your `~/.bashrc` or `~/.zshrc` to persist across sessions.

## Common Commands

### Initialize a New Project

```bash
aspire init
```

Creates a new Aspire project with `apphost.cs` (single-file AppHost) or full project structure depending on whether a solution file exists.

### Run the Application

```bash
aspire run
```

Starts all services defined in the AppHost and launches the Aspire Dashboard for monitoring.

**Options:**
- `--no-dashboard` - Run without opening the dashboard
- `--no-browser` - Don't open browser automatically

### Update Project

```bash
aspire update
```

Updates the project to use the latest available Aspire packages and feeds (including daily builds).

### Create New Project from Template

```bash
aspire new
```

Interactive wizard to create a new Aspire project with template selection.

## Project Structure

### apphost.cs

The single-file AppHost is the entry point for Aspire orchestration:

```csharp
#:sdk Aspire.AppHost.Sdk@13.1.0-preview.1.25551.2

var builder = DistributedApplication.CreateBuilder(args);

// Add services
var api = builder.AddProject<Projects.Api>("api");
var frontend = builder.AddNpmApp("frontend", "../services/frontend")
    .WithReference(api);

builder.Build().Run();
```

### Adding Different Resource Types

**Container:**
```csharp
var postgres = builder.AddPostgres("postgres");
```

**Project Reference:**
```csharp
var api = builder.AddProject<Projects.Api>("api");
```

**npm Application:**
```csharp
var frontend = builder.AddNpmApp("frontend", "../services/frontend");
```

**Python Application:**
```csharp
var renderer = builder.AddPythonProject("renderer", "../services/rendering", "main.py");
```

**Executable:**
```csharp
var tool = builder.AddExecutable("tool", "node", "../services/tool", "index.js");
```

## Aspire Dashboard

The Aspire Dashboard provides:

- **Resources**: View all services and their status
- **Logs**: Aggregated and per-service logs
- **Traces**: Distributed tracing with OpenTelemetry
- **Metrics**: Performance metrics and health checks
- **Environment**: View environment variables and configuration

Default URLs (from apphost.run.json):
- HTTPS: `https://localhost:17167`
- HTTP: `http://localhost:15282`

## Service Discovery

Services can discover each other using environment variables injected by Aspire:

```csharp
// In a service that references "api"
var apiUrl = builder.Configuration["services:api:https:0"] 
    ?? builder.Configuration["services:api:http:0"];
```

## NuGet Feed Configuration

Daily builds come from:
```
https://pkgs.dev.azure.com/dnceng/public/_packaging/dotnet9/nuget/v3/index.json
```

This is automatically configured in `nuget.config` when using daily builds.

## Troubleshooting

### CLI Not Found

Ensure the CLI is in your PATH:
```bash
which aspire
# Should output: /home/username/.aspire/bin/aspire
```

### Update Daily Builds

```bash
aspire update
```

This refreshes to the latest daily build packages.

### Certificate Trust Issues

If you see certificate warnings, trust the development certificates:

```bash
dotnet dev-certs https --trust
```

### Clean Build

If experiencing issues, try:
```bash
dotnet clean
aspire run
```

## Additional Resources

- [Aspire Documentation](https://learn.microsoft.com/dotnet/aspire/)
- [Aspire GitHub Repository](https://github.com/dotnet/aspire)
- [Daily Builds Documentation](https://github.com/dotnet/aspire/blob/main/docs/using-latest-daily.md)
- [Aspire Samples](https://github.com/dotnet/aspire-samples)

## Version Information

Current project is using:
- **Aspire SDK**: 13.1.0-preview.1.25551.2 (daily build)
- **Channel**: dev

To check your installed CLI version:
```bash
aspire --version
```
