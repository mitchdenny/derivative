#:sdk Aspire.AppHost.Sdk@13.1.0-preview.1.25552.3
#:package Aspire.Hosting.NodeJs@13.1.0-preview.1.25552.3
#:package Aspire.Hosting.Azure.AppContainers@13.1.0-preview.1.25552.3
#:package Aspire.Hosting.Yarp@13.1.0-preview.1.25552.3
#:package Aspire.Hosting.Docker@13.1.0-preview.1.25552.3
#:project src\Derivative.Frontend\Derivative.Frontend.csproj

#pragma warning disable ASPIREACADOMAINS001

var builder = DistributedApplication.CreateBuilder(args);

// Conditionally adds parameters to app model if config values are specified.
var customDomainValue = builder.Configuration["Parameters:customDomain"];
var certificateNameValue = builder.Configuration["Parameters:certificateName"];

var customDomain = !string.IsNullOrEmpty(customDomainValue) ? builder.AddParameter("customDomain") : null;
var certificateName = !string.IsNullOrEmpty(certificateNameValue) ? builder.AddParameter("certificateName") : null;

builder.AddAzureContainerAppEnvironment("env");

var client = builder.AddViteApp("client", "./src/client")
    .WithEndpoint("http", endpoint => endpoint.Port = 5159);

var backend = builder.AddProject<Projects.Derivative_Frontend>("frontend")
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

client.WithReference(backend);

builder.Build().Run();
