using System.Reflection;
using Azure.Storage.Blobs;
using Microsoft.Extensions.Configuration;
using WeddingLanding.Core;

var configuration = new ConfigurationBuilder()
    .AddUserSecrets(Assembly.GetExecutingAssembly())
    .AddEnvironmentVariables()
    .Build();

var connectionString = configuration["ConnectionStrings:BlobStorage"]
    ?? throw new InvalidOperationException(
        "Set ConnectionStrings:BlobStorage with 'dotnet user-secrets set' or as an environment variable.");

List<string> guestFirstNames = [];

if (guestFirstNames.Count == 0)
{
    Console.WriteLine("No guests configured. Add first names to the guestFirstNames list in Program.cs.");
    return;
}

IGuestStore store = new BlobGuestStore(new BlobServiceClient(connectionString));

foreach (var firstName in guestFirstNames)
{
    var link = GuestLink.Generate();
    await store.CreateAsync(link, firstName!);
    Console.WriteLine($"{firstName}: {link}");
}
