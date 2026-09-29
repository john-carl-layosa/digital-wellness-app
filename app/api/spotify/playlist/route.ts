import { NextResponse } from "next/server";
import {
  extractSpotifyPlaylistId,
  normalizeSpotifyPlaylistUrl,
  type SpotifyPlaylistMetadata,
} from "../../../../lib/data/playlists";

export const runtime = "nodejs";

type OEmbedResponse = {
  title?: string;
  thumbnail_url?: string;
};

type SpotifyApiPlaylist = {
  name?: string;
  description?: string;
  images?: Array<{
    url?: string;
  }>;
  items?: {
    total?: number;
  };
  tracks?: {
    total?: number;
  };
  owner?: {
    display_name?: string;
  };
  external_urls?: {
    spotify?: string;
  };
};

function stripHtml(value: string | undefined): string {
  return (value ?? "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

async function getSpotifyAccessToken(): Promise<string | null> {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return null;
  }

  const response = await fetch(
    "https://accounts.spotify.com/api/token",
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${clientId}:${clientSecret}`
        ).toString("base64")}`,
        "Content-Type":
          "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
      cache: "no-store",
    }
  );

  if (!response.ok) {
    return null;
  }

  const data = (await response.json()) as {
    access_token?: string;
  };

  return data.access_token ?? null;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      url?: unknown;
    };

    if (typeof body.url !== "string") {
      return NextResponse.json(
        {
          error: "Enter a Spotify playlist link.",
        },
        {
          status: 400,
        }
      );
    }

    const spotifyId = extractSpotifyPlaylistId(body.url);
    const spotifyUrl =
      normalizeSpotifyPlaylistUrl(body.url);

    if (!spotifyId || !spotifyUrl) {
      return NextResponse.json(
        {
          error:
            "Use a valid Spotify playlist link, such as open.spotify.com/playlist/....",
        },
        {
          status: 400,
        }
      );
    }

    const oEmbedResponse = await fetch(
      `https://open.spotify.com/oembed?url=${encodeURIComponent(
        spotifyUrl
      )}`,
      {
        cache: "no-store",
      }
    );

    if (!oEmbedResponse.ok) {
      return NextResponse.json(
        {
          error:
            "Spotify could not access this playlist. Check that the link is available.",
        },
        {
          status: 422,
        }
      );
    }

    const oEmbed =
      (await oEmbedResponse.json()) as OEmbedResponse;

    let apiPlaylist: SpotifyApiPlaylist | null = null;

    try {
      const token = await getSpotifyAccessToken();

      if (token) {
        const apiResponse = await fetch(
          `https://api.spotify.com/v1/playlists/${spotifyId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            cache: "no-store",
          }
        );

        if (apiResponse.ok) {
          apiPlaylist =
            (await apiResponse.json()) as SpotifyApiPlaylist;
        }
      }
    } catch {
      // oEmbed metadata is enough to add the playlist.
    }

    const metadata: SpotifyPlaylistMetadata = {
      spotifyId,
      spotifyUrl:
        apiPlaylist?.external_urls?.spotify ??
        spotifyUrl,
      name:
        apiPlaylist?.name?.trim() ||
        oEmbed.title?.trim() ||
        "Spotify Playlist",
      description: stripHtml(apiPlaylist?.description),
      coverImage:
        apiPlaylist?.images?.[0]?.url ??
        oEmbed.thumbnail_url ??
        null,
      trackCount:
        apiPlaylist?.items?.total ??
        apiPlaylist?.tracks?.total ??
        null,
      ownerName:
        apiPlaylist?.owner?.display_name?.trim() ||
        null,
    };

    return NextResponse.json(metadata);
  } catch {
    return NextResponse.json(
      {
        error:
          "We could not read that playlist right now. Please try again.",
      },
      {
        status: 500,
      }
    );
  }
}