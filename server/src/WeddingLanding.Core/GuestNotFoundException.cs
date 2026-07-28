namespace WeddingLanding.Core;

public sealed class GuestNotFoundException : Exception
{
    public GuestNotFoundException(string link) : base($"No guest found for link '{link}'.")
    {
    }
}
