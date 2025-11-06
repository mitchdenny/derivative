namespace Derivative.Frontend;

internal class AgentHostClient(HttpClient httpClient)
{
    public async Task<int> GenerateArtworkAsync(int originalArtworkId, string[] keywords, CancellationToken cancellationToken = default)
    {
        var request = new GenerateArtworkRequest
        {
            OriginalArtworkId = originalArtworkId,
            Keywords = keywords
        };

        var response = await httpClient.PostAsJsonAsync("/api/generate", request, cancellationToken);
        response.EnsureSuccessStatusCode();

        var result = await response.Content.ReadFromJsonAsync<GenerateArtworkResponse>(cancellationToken);
        return result?.Id ?? 0;
    }
}

internal record GenerateArtworkRequest
{
    public int OriginalArtworkId { get; init; }
    public required string[] Keywords { get; init; }
}

internal record GenerateArtworkResponse
{
    public int Id { get; init; }
}
