namespace WeddingLanding.Web;

public sealed class MinecraftServerContent
{
    public string Ip { get; init; } = "";
    public string Version { get; init; } = "";
}

public sealed class WeddingContent
{
    public string CoupleNames { get; init; } = "";
    public string WeddingDateTime { get; init; } = "";
    public string WeddingTimezone { get; init; } = "";
    public MinecraftServerContent MinecraftServer { get; init; } = new();
}
