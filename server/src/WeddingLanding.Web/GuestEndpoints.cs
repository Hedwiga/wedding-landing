using WeddingLanding.Core;

namespace WeddingLanding.Web;

public sealed record GuestProfileResponse(string FirstName, string? Nickname, AttendingStatus? Attending, bool HasSkin, WeddingContent Content);
public sealed record RsvpRequest(AttendingStatus Attending);
public sealed record NicknameRequest(string Nickname);

public static class GuestEndpoints
{
    private const int MaxNicknameLength = 20;

    public static void MapGuestEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/guest/{link}");

        group.MapGet("", GetGuestAsync);
        group.MapPut("/rsvp", PutRsvpAsync);
        group.MapPut("/nickname", PutNicknameAsync);
        group.MapPost("/skin", PostSkinAsync).DisableAntiforgery();
        group.MapGet("/skin", GetSkinAsync);
    }

    private static async Task<IResult> GetGuestAsync(string link, IGuestStore store, WeddingContent content, CancellationToken ct)
    {
        var profile = await store.GetProfileAsync(link, ct);
        if (profile is null) return Results.NotFound();

        return Results.Ok(await ToResponseAsync(profile, link, store, content, ct));
    }

    private static async Task<IResult> PutRsvpAsync(string link, RsvpRequest request, IGuestStore store, WeddingContent content, CancellationToken ct)
    {
        try
        {
            await store.UpdateProfileAsync(link, nickname: null, attending: request.Attending, ct);
        }
        catch (GuestNotFoundException)
        {
            return Results.NotFound();
        }

        var profile = await store.GetProfileAsync(link, ct);
        return Results.Ok(await ToResponseAsync(profile!, link, store, content, ct));
    }

    private static async Task<IResult> PutNicknameAsync(string link, NicknameRequest request, IGuestStore store, WeddingContent content, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(request.Nickname) || request.Nickname.Length > MaxNicknameLength)
            return Results.BadRequest(new { error = $"Nickname must be 1-{MaxNicknameLength} characters." });

        try
        {
            await store.UpdateProfileAsync(link, nickname: request.Nickname, attending: null, ct);
        }
        catch (GuestNotFoundException)
        {
            return Results.NotFound();
        }

        var profile = await store.GetProfileAsync(link, ct);
        return Results.Ok(await ToResponseAsync(profile!, link, store, content, ct));
    }

    private static async Task<IResult> PostSkinAsync(string link, IFormFile file, IGuestStore store, CancellationToken ct)
    {
        SkinSaveResult result;
        await using (var stream = file.OpenReadStream())
        {
            try
            {
                result = await store.SaveSkinAsync(link, stream, ct);
            }
            catch (GuestNotFoundException)
            {
                return Results.NotFound();
            }
        }

        return result == SkinSaveResult.Success
            ? Results.Ok()
            : Results.BadRequest(new { error = result.ToString() });
    }

    private static async Task<IResult> GetSkinAsync(string link, IGuestStore store, CancellationToken ct)
    {
        var skin = await store.GetSkinAsync(link, ct);
        return skin is null ? Results.NotFound() : Results.File(skin, "image/png");
    }

    private static async Task<GuestProfileResponse> ToResponseAsync(GuestProfile profile, string link, IGuestStore store, WeddingContent content, CancellationToken ct)
    {
        var hasSkin = await store.HasSkinAsync(link, ct);
        return new GuestProfileResponse(profile.FirstName, profile.Nickname, profile.Attending, hasSkin, WithGatedServerIp(content));
    }

    private static WeddingContent WithGatedServerIp(WeddingContent content)
    {
        if (ShouldRevealServerIp(content)) return content;

        return new WeddingContent
        {
            CoupleNames = content.CoupleNames,
            WeddingDateTime = content.WeddingDateTime,
            WeddingTimezone = content.WeddingTimezone,
            MinecraftServer = new MinecraftServerContent { Ip = "", Password = "", Version = content.MinecraftServer.Version },
            DiscordInvite = content.DiscordInvite,
        };
    }

    private static bool ShouldRevealServerIp(WeddingContent content)
    {
        return false;
    }
}
