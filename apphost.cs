#:sdk Aspire.AppHost.Sdk@13.1.0-preview.1.25551.4
#:package Aspire.Hosting.NodeJs@13.1.0-preview.1.25551.4
#:package Aspire.Hosting.Azure.AppContainers@13.1.0-preview.1.25551.4
#:package Aspire.Hosting.Yarp@13.1.0-preview.1.25551.4
#:package Aspire.Hosting.Docker@13.1.0-preview.1.25551.4
#:project src\Derivative.Frontend\Derivative.Frontend.csproj

#pragma warning disable ASPIREACADOMAINS001 // Type is for evaluation purposes only and is subject to change or removal in future updates. Suppress this diagnostic to proceed.

var builder = DistributedApplication.CreateBuilder(args);

// Only define these parameters in the model if the configuration values
// are present in the environment, otherwise omit them, this allows us to
// provision custom domains on a per-envronment basis if desired.
var customDomain = builder.Configuration["Parameters:customDomain"] is { } ? builder.AddParameter("customDomain") : null;
var certificateName = builder.Configuration["Parameters:certificateName"] is { } ? builder.AddParameter("certificateName") : null;

builder.AddAzureContainerAppEnvironment("env");

var client = builder.AddViteApp("client", "./src/client");

var backend = builder.AddProject<Projects.Derivative_Frontend>("frontend")
    .WithExternalHttpEndpoints()
    .PublishWithContainerFiles(client, "./wwwroot")
    .PublishAsAzureContainerApp((infra, app) =>
    {
        app.Template.Scale.MinReplicas = 0;
        app.Template.Scale.MaxReplicas = 1;

        if (customDomain is { } && certificateName is { })
        {
            app.ConfigureCustomDomain(customDomain, certificateName);
        }
    });

client.WithReference(backend);

builder.Build().Run();
