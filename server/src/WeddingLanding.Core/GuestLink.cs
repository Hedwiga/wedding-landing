using System.Security.Cryptography;

namespace WeddingLanding.Core;

public static class GuestLink
{
    private const int ByteLength = 32;

    public static string Generate()
    {
        var bytes = RandomNumberGenerator.GetBytes(ByteLength);
        return Convert.ToBase64String(bytes)
            .TrimEnd('=')
            .Replace('+', '-')
            .Replace('/', '_');
    }
}
