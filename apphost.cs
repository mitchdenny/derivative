#:sdk Aspire.AppHost.Sdk@13.1.0-preview.1.25551.4
#:package Aspire.Hosting.NodeJs@13.1.0-preview.1.25551.4
#:package Aspire.Hosting.Azure.AppContainers@13.1.0-preview.1.25551.4
#:package Aspire.Hosting.Yarp@13.1.0-preview.1.25551.4
#:package Aspire.Hosting.Docker@13.1.0-preview.1.25551.4
#:project src\Derivative.Frontend\Derivative.Frontend.csproj

var builder = DistributedApplication.CreateBuilder(args);

// Conditionally adds parameters to app model if config values are specified.
var customDomain = builder.Configuration["Parameters:customDomain"] != null ? builder.AddParameter("customDomain") : null;
var certificateName = builder.Configuration["Parameters:certificateName"] != null ? builder.AddParameter("certificateName") : null;

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
            app.ConfigureDomain(customDomain, certificateName);
        }
    });

client.WithReference(backend);

builder.Build().Run();
