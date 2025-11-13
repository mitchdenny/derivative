using Derivative.Frontend;

var builder = WebApplication.CreateBuilder(args);
builder.AddServiceDefaults();

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

app.MapDefaultEndpoints();

app.MapGet("/hello", () => "Hello World!");

// Artwork API endpoints
var dummyArtwork = new ArtworkMetadata(
    Id: 1,
    Title: "Mars Topography",
    Keywords: ["mars", "topography", "layers", "burnt", "curves"]
);

app.MapGet("/api/artwork/random", () => 
{
    return Results.Json(dummyArtwork);
});

app.MapGet("/api/artwork/{id:int}", (int id) => 
{
    // For now, return the same dummy artwork regardless of id
    return Results.Json(dummyArtwork);
});

app.MapGet("/api/artwork/{id:int}/content", (int id) => 
{
    var html = """
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Artwork Content</title>
        <style>
            body {
                margin: 0;
                padding: 0;
                width: 100%;
                height: 100vh;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            img {
                max-width: 100%;
                max-height: 100%;
                object-fit: contain;
            }
        </style>
    </head>
    <body>
        <img src="/mars-topography.svg" alt="Generated Artwork" />
    </body>
    </html>
    """;
    
    return Results.Content(html, "text/html");
});

app.Run();
