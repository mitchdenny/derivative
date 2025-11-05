var builder = WebApplication.CreateBuilder(args);

builder.AddAzureCosmosContainer("metadata");
builder.AddKeyedAzureBlobContainerClient("generatedimages");
builder.AddKeyedAzureBlobContainerClient("codeblocks");

var app = builder.Build();

app.UseHttpsRedirection();
app.Run();
