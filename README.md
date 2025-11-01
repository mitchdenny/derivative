# Derivative

**Derivative** is an experimental generative art project that explores the intersection of algorithmic art and generative AI. The project's name is a deliberate commentary on the criticism that generative AI "derives" from the work of artists—here, that's precisely the point and the art itself.

## Concept

The project visualizes the evolution of generative art through AI-assisted iteration. Each artwork is created by an AI agent that takes a previous p5.js sketch as input, along with user-provided keywords, and generates a new variation. The result is an ever-growing tree of derivative works, where each piece builds upon its predecessors.

### Visual Components

- **Force-Directed Graph**: A live, interactive visualization (built with d3.js) showing the genealogy of artworks. Each node represents a unique piece, with edges showing the parent-child relationships between derivatives.
- **Art Viewer**: Displays the selected artwork alongside the p5.js code and input parameters that generated it. Users can create new derivatives by adding 3-5 keywords to guide the AI, but cannot directly modify the code.

## Architecture

The project leverages .NET Aspire to orchestrate multiple services:

- **Frontend** *(not yet implemented)*: Client-side JavaScript application using d3.js for graph visualization and p5.js for art rendering
- **Rendering Service** *(not yet implemented)*: Python-based containerized service using Playwright and headless Chrome to execute and capture p5.js sketches
- **AI Agent Service** *(not yet implemented)*: Microsoft Agent Framework implementation with multiple agents:
  - Code generation agent (creates new p5.js variations)
  - Code analysis agent (validates safety and correctness)
- **API/Backend** *(not yet implemented)*: Handles websocket connections, queuing, and rate limiting
- **Storage** *(not yet implemented)*: Persists generated images and metadata

## Getting Started

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed instructions on setting up your development environment and working with this Aspire-based project.

## Technology Stack

- .NET Aspire (daily builds)
- JavaScript (d3.js, p5.js)
- Python (Playwright)
- Microsoft Agent Framework
- WebSockets for real-time updates

# Code of Conduct

This project has adopted the code of conduct defined by the Contributor Covenant
to clarify expected behavior in our community.

For more information, see the [.NET Foundation Code of Conduct](https://dotnetfoundation.org/code-of-conduct).
