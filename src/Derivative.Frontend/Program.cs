using System.Net.WebSockets;
using System.Text;
using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);
builder.AddServiceDefaults();

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

app.MapDefaultEndpoints();

app.MapGet("/hello", () => "Hello World!");

// WebSocket endpoint for the graph
app.UseWebSockets();

app.Map("/ws/graph", async (HttpContext context) =>
{
    if (context.WebSockets.IsWebSocketRequest)
    {
        using var webSocket = await context.WebSockets.AcceptWebSocketAsync();
        await HandleGraphWebSocket(webSocket);
    }
    else
    {
        context.Response.StatusCode = StatusCodes.Status400BadRequest;
    }
});

app.Run();

async Task HandleGraphWebSocket(WebSocket webSocket)
{
    // Initial graph data with some seed nodes
    var nodes = new List<GraphNode>
    {
        new() { Id = "node-0" },
        new() { Id = "node-1" },
        new() { Id = "node-2" }
    };

    var links = new List<GraphLink>
    {
        new() { Source = "node-0", Target = "node-1" },
        new() { Source = "node-1", Target = "node-2" }
    };

    // Send initial graph data
    var initialData = new
    {
        type = "initial",
        nodes,
        links
    };

    await SendJsonMessage(webSocket, initialData);

    // Counter for new nodes
    int nodeCounter = 3;

    // Send new nodes every 5 seconds
    var random = new Random();
    
    while (webSocket.State == WebSocketState.Open)
    {
        await Task.Delay(5000);

        if (webSocket.State != WebSocketState.Open)
            break;

        // Pick a random existing node to connect to
        var targetNode = nodes[random.Next(nodes.Count)];
        var newNode = new GraphNode { Id = $"node-{nodeCounter}" };
        var newLink = new GraphLink { Source = newNode.Id, Target = targetNode.Id };

        nodes.Add(newNode);
        links.Add(newLink);
        nodeCounter++;

        // Send the new node and link
        var updateData = new
        {
            type = "add-node",
            node = newNode,
            link = newLink
        };

        await SendJsonMessage(webSocket, updateData);
    }

    // Close the WebSocket gracefully
    if (webSocket.State == WebSocketState.Open)
    {
        await webSocket.CloseAsync(
            WebSocketCloseStatus.NormalClosure,
            "Closing",
            CancellationToken.None);
    }
}

async Task SendJsonMessage(WebSocket webSocket, object data)
{
    var json = JsonSerializer.Serialize(data);
    var bytes = Encoding.UTF8.GetBytes(json);
    await webSocket.SendAsync(
        new ArraySegment<byte>(bytes),
        WebSocketMessageType.Text,
        true,
        CancellationToken.None);
}

record GraphNode
{
    public required string Id { get; init; }
}

record GraphLink
{
    public required string Source { get; init; }
    public required string Target { get; init; }
}
