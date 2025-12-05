// app/api/search-youtube/route.ts
import { NextResponse } from "next/server";

const TRUSTED_CHANNELS = [
  "MKBHD",
  "Mrwhosetheboss",
  "GSMArena",
  "Tech Burner",
  "The Verge",
  "Unbox Therapy",
  "PhoneArena",
  "C4ETech",
  "GadgetByte Nepal",
];

// helper: check if snippet.channelTitle matches trusted list (case-insensitive, partial ok)
function isTrustedChannel(channelTitle: string) {
  if (!channelTitle) return false;
  const title = channelTitle.toLowerCase();
  return TRUSTED_CHANNELS.some((c) => title.includes(c.toLowerCase()));
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const q = (body.query || "").trim();
    if (!q) return NextResponse.json({ error: "Missing query" }, { status: 400 });

    const key = process.env.YOUTUBE_API_KEY;
    if (!key) return NextResponse.json({ error: "Missing API key" }, { status: 500 });

    // 1) Search for videos matching "<phone name> review" (limit 8)
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=8&q=${encodeURIComponent(
      `${q} review`
    )}&key=${key}`;

    const searchRes = await fetch(searchUrl);
    if (!searchRes.ok) {
      const t = await searchRes.text();
      console.error("Search API failed:", searchRes.status, t);
      return NextResponse.json({ error: "YouTube search failed" }, { status: 502 });
    }
    const searchJson = await searchRes.json();

    const items = searchJson.items || [];
    if (!items.length) {
      return NextResponse.json({ youtubeReviewId: "" }, { status: 200 });
    }

    // Prepare list of videoIds to inspect
    const ids = items.map((it: any) => it.id.videoId).filter(Boolean).join(",");

    // 2) Get videos details (status, contentDetails, snippet, statistics)
    const videosUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics,status&id=${ids}&key=${key}`;
    const videosRes = await fetch(videosUrl);
    if (!videosRes.ok) {
      const t = await videosRes.text();
      console.error("Videos API failed:", videosRes.status, t);
      return NextResponse.json({ error: "YouTube videos lookup failed" }, { status: 502 });
    }
    const videosJson = await videosRes.json();
    const videos = videosJson.items || [];

    // 3) Filter candidates: public, embeddable, not private, trusted channel prefered
    // We'll create two lists: trustedCandidates (channel in TRUSTED_CHANNELS) then others
    const trustedCandidates: any[] = [];
    const otherCandidates: any[] = [];

    for (const vid of videos) {
      const vidId = vid.id;
      const snippet = vid.snippet || {};
      const status = vid.status || {};
      const thumbnails = snippet.thumbnails || {};
      const embeddable = status.embeddable !== false; // default true if missing
      const privacy = status.privacyStatus || "public";
      const title = snippet.title || "";
      const channelTitle = snippet.channelTitle || "";

      // skip non-public or deleted/private
      if (privacy !== "public") continue;
      if (!embeddable) continue;

      // ensure thumbnail exists (we'll trust snippet thumbnails: maxres or high or standard)
      const thumbExists =
        thumbnails.maxres || thumbnails.standard || thumbnails.high || thumbnails.medium || thumbnails.default;

      if (!thumbExists) continue;

      const candidate = {
        id: vidId,
        title,
        channelTitle,
        publishedAt: snippet.publishedAt,
        viewCount: vid.statistics?.viewCount ? parseInt(vid.statistics.viewCount) : 0,
      };

      if (isTrustedChannel(channelTitle)) trustedCandidates.push(candidate);
      else otherCandidates.push(candidate);
    }

    // 4) pick best candidate: prefer trustedCandidates sorted by viewCount then publishedAt
    const pick = (arr: any[]) => {
      if (!arr.length) return null;
      arr.sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));
      return arr[0];
    };

    let chosen = pick(trustedCandidates) || pick(otherCandidates);

    // Additional check: if chosen is too old or too few views, you could reject — but we return it.
    if (!chosen) {
      return NextResponse.json({ youtubeReviewId: "" }, { status: 200 });
    }

    return NextResponse.json({ youtubeReviewId: chosen.id }, { status: 200 });
  } catch (err) {
    console.error("API ERROR:", err);
    return NextResponse.json({ error: "Internal Server Error", details: String(err) }, { status: 500 });
  }
}
