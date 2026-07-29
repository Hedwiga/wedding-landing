namespace WeddingLanding.Core;

public static class GuestProfileMerge
{
    public static GuestProfile Apply(GuestProfile existing, string? nickname, AttendingStatus? attending) =>
        existing with
        {
            Nickname = nickname ?? existing.Nickname,
            Attending = attending ?? existing.Attending,
        };
}
