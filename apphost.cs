#:sdk Aspire.AppHost.Sdk@13.1.0-preview.1.25551.2
#:package Aspire.Hosting.NodeJs@13.1.0-preview.1.25551.2
#:package Aspire.Hosting.Azure.AppContainers@13.1.0-preview.1.25551.2

var builder = DistributedApplication.CreateBuilder(args);

builder.AddAzureContainerAppEnvironment("env");

builder.AddViteApp("frontend", "./src/frontend");

builder.Build().Run();
