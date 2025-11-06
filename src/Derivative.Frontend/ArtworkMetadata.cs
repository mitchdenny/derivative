namespace Derivative.Frontend;

internal class ArtworkMetadata
{
    public required int Id { get; init; }
    public required string Title { get; init; }
    public required string[] Keywords { get; init; }
    public required string GeneratedImageBlobPath { get; init; }
    public required string CodeBlockBlobPath { get; init; }
}