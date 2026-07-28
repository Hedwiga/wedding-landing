namespace WeddingLanding.Core;

public static class SkinValidator
{
    public const int MaxSizeBytes = 512 * 1024;

    private static readonly byte[] PngSignature = { 0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A };
    private const int IhdrWidthOffset = 16;
    private const int IhdrHeightOffset = 20;
    private const int MinHeaderLength = 24;

    public static SkinSaveResult Validate(byte[] content)
    {
        if (content.Length > MaxSizeBytes) return SkinSaveResult.TooLarge;

        if (content.Length < MinHeaderLength || !content.AsSpan(0, PngSignature.Length).SequenceEqual(PngSignature))
            return SkinSaveResult.NotPng;

        var width = ReadUInt32BigEndian(content, IhdrWidthOffset);
        var height = ReadUInt32BigEndian(content, IhdrHeightOffset);
        var isValidDimensions = (width == 64 && height == 64) || (width == 64 && height == 32);

        return isValidDimensions ? SkinSaveResult.Success : SkinSaveResult.InvalidDimensions;
    }

    private static uint ReadUInt32BigEndian(byte[] content, int offset) =>
        (uint)((content[offset] << 24) | (content[offset + 1] << 16) | (content[offset + 2] << 8) | content[offset + 3]);
}
