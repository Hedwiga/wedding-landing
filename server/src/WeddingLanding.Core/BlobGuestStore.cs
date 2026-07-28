using System.Text.Json;
using Azure.Storage.Blobs;

namespace WeddingLanding.Core;

public sealed class BlobGuestStore : IGuestStore
{
    private const string ContainerName = "guests";
    private const string ProfileBlobName = "data.json";
    private const string SkinBlobName = "skin.png";

    private readonly BlobContainerClient _container;

    public BlobGuestStore(BlobServiceClient blobServiceClient)
    {
        _container = blobServiceClient.GetBlobContainerClient(ContainerName);
    }

    public async Task<GuestProfile?> GetProfileAsync(string link, CancellationToken ct = default)
    {
        var blob = _container.GetBlobClient(ProfilePath(link));
        if (!await blob.ExistsAsync(ct)) return null;

        var response = await blob.DownloadContentAsync(ct);
        return response.Value.Content.ToObjectFromJson<GuestProfile>();
    }

    public async Task CreateAsync(string link, string firstName, CancellationToken ct = default)
    {
        await _container.CreateIfNotExistsAsync(cancellationToken: ct);
        await WriteProfileAsync(link, new GuestProfile(firstName, null, null), ct);
    }

    public async Task UpdateProfileAsync(string link, string? nickname, bool? attending, CancellationToken ct = default)
    {
        var existing = await GetProfileAsync(link, ct) ?? throw new GuestNotFoundException(link);
        var updated = GuestProfileMerge.Apply(existing, nickname, attending);
        await WriteProfileAsync(link, updated, ct);
    }

    public async Task<SkinSaveResult> SaveSkinAsync(string link, Stream pngContent, CancellationToken ct = default)
    {
        if (await GetProfileAsync(link, ct) is null) throw new GuestNotFoundException(link);

        using var buffer = new MemoryStream();
        await pngContent.CopyToAsync(buffer, ct);
        var bytes = buffer.ToArray();

        var validation = SkinValidator.Validate(bytes);
        if (validation != SkinSaveResult.Success) return validation;

        var blob = _container.GetBlobClient(SkinPath(link));
        using var uploadStream = new MemoryStream(bytes);
        await blob.UploadAsync(uploadStream, overwrite: true, cancellationToken: ct);
        return SkinSaveResult.Success;
    }

    public async Task<Stream?> GetSkinAsync(string link, CancellationToken ct = default)
    {
        var blob = _container.GetBlobClient(SkinPath(link));
        if (!await blob.ExistsAsync(ct)) return null;

        var response = await blob.DownloadStreamingAsync(cancellationToken: ct);
        return response.Value.Content;
    }

    public async Task<bool> HasSkinAsync(string link, CancellationToken ct = default) =>
        await _container.GetBlobClient(SkinPath(link)).ExistsAsync(ct);

    private async Task WriteProfileAsync(string link, GuestProfile profile, CancellationToken ct)
    {
        var blob = _container.GetBlobClient(ProfilePath(link));
        using var stream = new MemoryStream();
        await JsonSerializer.SerializeAsync(stream, profile, cancellationToken: ct);
        stream.Position = 0;
        await blob.UploadAsync(stream, overwrite: true, cancellationToken: ct);
    }

    private static string ProfilePath(string link) => $"{link}/{ProfileBlobName}";
    private static string SkinPath(string link) => $"{link}/{SkinBlobName}";
}
