#:sdk Aspire.AppHost.Sdk@13.1.0-preview.1.25551.4
#:package Aspire.Hosting.NodeJs@13.1.0-preview.1.25551.4
#:package Aspire.Hosting.Azure.AppContainers@13.1.0-preview.1.25551.4
#:package Aspire.Hosting.Yarp@13.1.0-preview.1.25551.4
#:package Aspire.Hosting.Docker@13.1.0-preview.1.25551.4
#:project src\Derivative.Frontend\Derivative.Frontend.csproj

var builder = DistributedApplication.CreateBuilder(args);

builder.AddAzureContainerAppEnvironment("env");

var client = builder.AddViteApp("client", "./src/client");

// Check if deploying to production resource group
var resourceGroup = builder.Configuration["AZURE__RESOURCEGROUP"];
var isProduction = resourceGroup == "derivative-production";

// Add parameters for custom domain configuration if in production
var customDomain = isProduction ? builder.AddParameter("customDomain") : null;
var certificateName = isProduction ? builder.AddParameter("certificateName") : null;

var backend = builder.AddProject<Projects.Derivative_Frontend>("frontend")
    .WithExternalHttpEndpoints()
    .PublishWithContainerFiles(client, "./wwwroot")
    .PublishAsAzureContainerApp((infra, app) =>
    {
        app.Template.Scale.MinReplicas = 0;
        app.Template.Scale.MaxReplicas = 1;
        
        // Configure custom domain for production deployments
        if (isProduction && customDomain != null && certificateName != null)
        {
            app.ConfigureCustomDomain(customDomain, certificateName);
        }
    });

client.WithReference(backend);

builder.Build().Run();
