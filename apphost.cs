#:sdk Aspire.AppHost.Sdk@13.1.0-preview.1.25551.4
#:package Aspire.Hosting.NodeJs@13.1.0-preview.1.25551.4
#:package Aspire.Hosting.Azure.AppContainers@13.1.0-preview.1.25551.4
#:package Aspire.Hosting.Yarp@13.1.0-preview.1.25551.4
#:package Aspire.Hosting.Docker@13.1.0-preview.1.25551.4
#:project src\Derivative.Frontend\Derivative.Frontend.csproj

var builder = DistributedApplication.CreateBuilder(args);

builder.AddAzureContainerAppEnvironment("env");

var frontend = builder.AddViteApp("client", "./src/frontend");

var backend = builder.AddProject<Projects.Derivative_Frontend>("backend")
    .WithExternalHttpEndpoints()
    .PublishWithContainerFiles(frontend, "./wwwroot");

frontend.WithReference(backend);

builder.Build().Run();
