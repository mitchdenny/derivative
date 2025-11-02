#:sdk Aspire.AppHost.Sdk@13.1.0-preview.1.25551.4
#:package Aspire.Hosting.NodeJs@13.1.0-preview.1.25551.4
#:package Aspire.Hosting.Azure.AppContainers@13.1.0-preview.1.25551.4
#:package Aspire.Hosting.Yarp@13.1.0-preview.1.25551.4
#:package Aspire.Hosting.Docker@13.1.0-preview.1.25551.4
#:project src\Derivative.Backend\Derivative.Backend.csproj

var builder = DistributedApplication.CreateBuilder(args);

builder.AddAzureContainerAppEnvironment("env");

var frontend = builder.AddViteApp("frontend", "./src/frontend");

var backend = builder.AddProject<Projects.Derivative_Backend>("backend")
    .WithExternalHttpEndpoints()
    .PublishWithContainerFiles(frontend, "./wwwroot");

frontend.WithReference(backend);

builder.Build().Run();
