var builder = WebApplication.CreateBuilder(args);

builder.AddAzureCosmosContainer("metadata");
builder.AddKeyedAzureBlobContainerClient("generatedimages");
builder.AddKeyedAzureBlobContainerClient("codeblocks");

var app = builder.Build();

app.UseHttpsRedirection();

// POST /api/generate - Generate new artwork from an original artwork and keywords
app.MapPost("/api/generate", (GenerateArtworkRequest request) =>
{
    // TODO: Implement actual artwork generation logic
    // For now, return a dummy ID of 0
    return Results.Ok(new GenerateArtworkResponse { Id = 0 });
});

app.Run();

internal record GenerateArtworkRequest
{
    public int OriginalArtworkId { get; init; }
    public required string[] Keywords { get; init; }
}

internal record GenerateArtworkResponse
{
    public int Id { get; init; }
}