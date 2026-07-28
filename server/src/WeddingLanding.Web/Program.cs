using Azure.Storage.Blobs;
using WeddingLanding.Core;
using WeddingLanding.Web;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSingleton(_ =>
{
    var connectionString = builder.Configuration.GetConnectionString("BlobStorage")
        ?? throw new InvalidOperationException("Missing ConnectionStrings:BlobStorage configuration.");
    return new BlobServiceClient(connectionString);
});
builder.Services.AddSingleton<IGuestStore, BlobGuestStore>();

builder.Services.AddSingleton(builder.Configuration.GetSection("WeddingContent").Get<WeddingContent>()
    ?? throw new InvalidOperationException("Missing WeddingContent configuration."));

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

app.MapGuestEndpoints();
app.MapFallbackToFile("index.html");

app.Run();

public partial class Program { }
