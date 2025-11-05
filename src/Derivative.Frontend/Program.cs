using Microsoft.Azure.Cosmos;

var builder = WebApplication.CreateBuilder(args);
builder.AddServiceDefaults();

builder.AddAzureCosmosContainer("metadata");
builder.AddKeyedAzureBlobContainerClient("generatedimages");
builder.AddKeyedAzureBlobContainerClient("codeblocks");

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

app.MapDefaultEndpoints();

// Mock artwork data store
var artworks = new Dictionary<int, Artwork>
{
    [1] = new Artwork
    {
        Id = 1,
        DerivedFromId = 0,
        Title = "Genesis",
        Keywords = new[] { "circle", "wave", "blue" },
        ImageUrl = "/artwork/1.png",
        CodeBlockUrl = "/code/1.js"
    },
    [2] = new Artwork
    {
        Id = 2,
        DerivedFromId = 1,
        Title = "Ripple Effect",
        Keywords = new[] { "wave", "motion", "green" },
        ImageUrl = "/artwork/2.png",
        CodeBlockUrl = "/code/2.js"
    },
    [3] = new Artwork
    {
        Id = 3,
        DerivedFromId = 1,
        Title = "Blue Harmony",
        Keywords = new[] { "circle", "pattern", "blue" },
        ImageUrl = "/artwork/3.png",
        CodeBlockUrl = "/code/3.js"
    }
};

var random = new Random();

// GET /api/artwork/random - Returns a random artwork
app.MapGet("/api/artwork/random", () =>
{
    var artworkIds = artworks.Keys.ToArray();
    var randomId = artworkIds[random.Next(artworkIds.Length)];
    return Results.Ok(artworks[randomId]);
});

// GET /api/artwork/{id} - Returns a specific artwork by ID
app.MapGet("/api/artwork/{id:int}", (int id) =>
{
    if (artworks.TryGetValue(id, out var artwork))
    {
        return Results.Ok(artwork);
    }
    return Results.NotFound(new { message = $"Artwork with ID {id} not found" });
});

// POST /api/artwork/{id}/remix - Creates a new artwork derived from the specified artwork
app.MapPost("/api/artwork/{id:int}/remix", (int id) =>
{
    if (!artworks.TryGetValue(id, out var parentArtwork))
    {
        return Results.NotFound(new { message = $"Artwork with ID {id} not found" });
    }

    // Generate a new artwork ID
    var newId = artworks.Keys.Max() + 1;
    
    var newArtwork = new Artwork
    {
        Id = newId,
        DerivedFromId = id,
        Title = $"Remix of {parentArtwork.Title}",
        Keywords = parentArtwork.Keywords,
        ImageUrl = $"/artwork/{newId}.png",
        CodeBlockUrl = $"/code/{newId}.js"
    };

    artworks[newId] = newArtwork;
    return Results.Created($"/api/artwork/{newId}", newArtwork);
});

app.Run();

internal class Artwork
{
    public int Id { get; init; }
    public int DerivedFromId { get; init; }
    public required string Title { get; init; }
    public required string[] Keywords { get; init; }
    public required string ImageUrl { get; init; }
    public required string CodeBlockUrl { get; init; }
}