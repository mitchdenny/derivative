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

app.MapPost("/api/random", () =>
{
    return new Artwork
    {
        Id = 0,
        DerivedFromId = 0,
        Title = "Sample Artwork",
        Keywords = new[] { "sample", "artwork" },
        ImageUrl = "/mars-topography.svg",
        CodeBlockUrl = "/sample-code.js"
    };
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