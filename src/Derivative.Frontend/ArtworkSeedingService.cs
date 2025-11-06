using Microsoft.Azure.Cosmos;

namespace Derivative.Frontend;

internal class ArtworkSeedingService(Container metadataContainer, AgentHostClient agentHostClient, ILogger<ArtworkSeedingService> logger) : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        logger.LogInformation("ArtworkSeedingService started");

        var query = new QueryDefinition("SELECT TOP 1 * FROM c ORDER BY c.id DESC");

        using var periodic = new PeriodicTimer(TimeSpan.FromSeconds(30));
        while (await periodic.WaitForNextTickAsync(stoppingToken))
        {
            logger.LogDebug("Checking for newest artwork metadata.");
            var iterator = metadataContainer.GetItemQueryIterator<ArtworkMetadata>(query, requestOptions: new () { MaxItemCount = 1 });
            var response = await iterator.ReadNextAsync(stoppingToken);
            var newestArtworkMetadata = response.FirstOrDefault();


            if (newestArtworkMetadata is not null && newestArtworkMetadata.Id > 10)
            {
                logger.LogInformation("Sufficient artwork metadata exists (latest ID: {Id}). Skipping seeding.", newestArtworkMetadata.Id);
                return;
            }
            else
            {
                logger.LogInformation("Seeding new artwork metadata.");
                
                await agentHostClient.GenerateArtworkAsync(
                    0,
                    ["mars", "topography", "layers", "burnt", "curves"],
                    stoppingToken
                    );
            }
        }

        logger.LogInformation("ArtworkSeedingService stopped");
    }
}