namespace WeddingLanding.Core;

public static class GuestProfileMerge
{
    public static GuestProfile Apply(GuestProfile existing, string? nickname, bool? attending) =>
        existing with
        {
            Nickname = nickname ?? existing.Nickname,
            Attending = attending ?? existing.Attending,
        };
}
