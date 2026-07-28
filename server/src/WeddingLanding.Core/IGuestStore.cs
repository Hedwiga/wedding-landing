namespace WeddingLanding.Core;

public interface IGuestStore
{
    Task<GuestProfile?> GetProfileAsync(string link, CancellationToken ct = default);
    Task CreateAsync(string link, string firstName, CancellationToken ct = default);
    Task UpdateProfileAsync(string link, string? nickname, bool? attending, CancellationToken ct = default);
    Task<SkinSaveResult> SaveSkinAsync(string link, Stream pngContent, CancellationToken ct = default);
    Task<Stream?> GetSkinAsync(string link, CancellationToken ct = default);
    Task<bool> HasSkinAsync(string link, CancellationToken ct = default);
}
