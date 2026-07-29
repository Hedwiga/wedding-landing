using System.Text.Json.Serialization;

namespace WeddingLanding.Core;

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum AttendingStatus
{
    Attending,
    NotAttending,
    Unsure,
}
