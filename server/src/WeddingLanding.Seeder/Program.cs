using System.Reflection;
using System.Text;
using System.Text.Encodings.Web;
using System.Text.Json;
using Azure.Storage.Blobs;
using Microsoft.Extensions.Configuration;
using WeddingLanding.Core;

Console.OutputEncoding = Encoding.UTF8;

var configuration = new ConfigurationBuilder()
    .AddUserSecrets(Assembly.GetExecutingAssembly())
    .AddEnvironmentVariables()
    .Build();

var connectionString = configuration["ConnectionStrings:BlobStorage"]
    ?? throw new InvalidOperationException(
        "Set ConnectionStrings:BlobStorage with 'dotnet user-secrets set' or as an environment variable.");

IGuestStore store = new BlobGuestStore(new BlobServiceClient(connectionString));

// await SeedAsync(store);
// await DownloadSkinsAsync(store, "skins");
// await DownloadAllAsync(store, "backup");

static async Task SeedAsync(IGuestStore store)
{
    List<string> guestFirstNames = ["Тест"];

    if (guestFirstNames.Count == 0)
    {
        Console.WriteLine("No guests configured. Add first names to the guestFirstNames list in Program.cs.");
        return;
    }

    var existingGuests = await store.ListAsync();

    foreach (var firstName in guestFirstNames)
    {
        var existing = existingGuests.FirstOrDefault(g => g.FirstName == firstName);
        if (existing != default)
        {
            Console.WriteLine($"{firstName}: {existing.Link} (already added)");
            continue;
        }

        var link = GuestLink.Generate();
        await store.CreateAsync(link, firstName!);
        Console.WriteLine($"{firstName}: {link}");
    }
}

static async Task DownloadSkinsAsync(IGuestStore store, string outputDirectory)
{
    Directory.CreateDirectory(outputDirectory);

    var guests = await store.ListAsync();

    foreach (var (link, firstName) in guests)
    {
        if (!await store.HasSkinAsync(link))
        {
            continue;
        }

        var profile = await store.GetProfileAsync(link);
        var nickname = profile?.Nickname ?? "no-nickname";

        var fileName = $"{Sanitize(nickname)}.png";
        var filePath = Path.Combine(outputDirectory, fileName);

        await using var skinStream = await store.GetSkinAsync(link);
        if (skinStream is null)
        {
            continue;
        }

        await using var fileStream = File.Create(filePath);
        await skinStream.CopyToAsync(fileStream);

        Console.WriteLine($"{fileName}");
    }
}

static async Task DownloadAllAsync(IGuestStore store, string outputDirectory)
{
    Directory.CreateDirectory(outputDirectory);

    var guests = await store.ListAsync();

    foreach (var (link, firstName) in guests)
    {
        var profile = await store.GetProfileAsync(link);
        if (profile is null)
        {
            continue;
        }

        var guestDirectory = Path.Combine(outputDirectory, $"{Sanitize(firstName)}-{link}");
        Directory.CreateDirectory(guestDirectory);

        var json = JsonSerializer.Serialize(profile, new JsonSerializerOptions
        {
            WriteIndented = true,
            Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping
        });
        await File.WriteAllTextAsync(Path.Combine(guestDirectory, "data.json"), json);

        if (await store.HasSkinAsync(link))
        {
            await using var skinStream = await store.GetSkinAsync(link);
            if (skinStream is not null)
            {
                await using var fileStream = File.Create(Path.Combine(guestDirectory, "skin.png"));
                await skinStream.CopyToAsync(fileStream);
            }
        }

        Console.WriteLine($"{firstName}: {guestDirectory}");
    }
}

static string Sanitize(string value)
{
    foreach (var c in Path.GetInvalidFileNameChars())
    {
        value = value.Replace(c, '_');
    }

    return value;
}
