#:sdk Aspire.AppHost.Sdk@13.1.0-preview.1.25555.7
#:package Aspire.Hosting.JavaScript@13.1.0-preview.1.25555.7
#:package Aspire.Hosting.Azure.AppContainers@13.1.0-preview.1.25555.7
#:package Aspire.Hosting.Yarp@13.1.0-preview.1.25555.7
#:package Aspire.Hosting.Docker@13.1.0-preview.1.25555.7
#:package Aspire.Hosting.Azure.Storage@13.1.0-preview.1.25555.7
#:package Aspire.Hosting.Azure.CosmosDB@13.1.0-preview.1.25555.7
#:package Aspire.Hosting.GitHub.Models@13.1.0-preview.1.25555.7
#:project src\Derivative.Frontend\Derivative.Frontend.csproj
#:project src\Derivative.AgentHost\Derivative.AgentHost.csproj

#pragma warning disable ASPIREACADOMAINS001
#pragma warning disable ASPIRECOSMOSDB001

using Aspire.Hosting.GitHub;

var builder = DistributedApplication.CreateBuilder(args);

// Conditionally adds parameters to app model if config values are specified.
var customDomainValue = builder.Configuration["Parameters:customDomain"];
var certificateNameValue = builder.Configuration["Parameters:certificateName"];

var customDomain = !string.IsNullOrEmpty(customDomainValue) ? builder.AddParameter("customDomain") : null;
var certificateName = !string.IsNullOrEmpty(certificateNameValue) ? builder.AddParameter("certificateName") : null;

builder.AddAzureContainerAppEnvironment("env");

var model = builder.AddGitHubModel("githubmodels", GitHubModel.OpenAI.OpenAIGpt41);

var metadata = builder.AddAzureCosmosDB("cosmos")
    .RunAsPreviewEmulator(c => c.WithDataExplorer())
    .AddCosmosDatabase("derivativedb")
    .AddContainer("metadata", "/id");

var storage = builder.AddAzureStorage("storage").RunAsEmulator();
var generatedImages = storage.AddBlobContainer("generatedimages");
var codeBlocks = storage.AddBlobContainer("codeblocks");

var agentHost = builder.AddProject<Projects.Derivative_AgentHost>("agenthost")
    .WithReference(metadata).WaitFor(metadata)
    .WithReference(generatedImages).WaitFor(generatedImages)
    .WithReference(codeBlocks).WaitFor(codeBlocks)
    .WithReference(model).WaitFor(model)
    .PublishAsAzureContainerApp((infra, app) =>
    {
        app.Template.Scale.MinReplicas = 0;
        app.Template.Scale.MaxReplicas = 1;
    });

var client = builder.AddViteApp("client", "./src/client")
    .WithEndpoint("http", endpoint => endpoint.Port = 5159);

var frontend = builder.AddProject<Projects.Derivative_Frontend>("frontend")
    .WithReference(metadata).WaitFor(metadata)
    .WithReference(generatedImages).WaitFor(generatedImages)
    .WithReference(codeBlocks).WaitFor(codeBlocks)
    .WithReference(agentHost).WaitFor(agentHost)
    .WithExternalHttpEndpoints()
    .PublishWithContainerFiles(client, "./wwwroot")
    .PublishAsAzureContainerApp((infra, app) =>
    {
        app.Template.Scale.MinReplicas = 0;
        app.Template.Scale.MaxReplicas = 1;

        if (customDomain is not null && certificateName is not null)
        {
            app.ConfigureCustomDomain(customDomain, certificateName);
        }
    });

client.WithReference(frontend);

builder.Build().Run();
