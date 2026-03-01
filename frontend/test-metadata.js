const { SAOClient } = require('./lib/ai/sao-client');
require('dotenv').config({ path: '.env.local' });

async function testMetadata() {
    console.log("--- Testing SAO Metadata Enrichment ---");
    const artist = "Bad Bunny";
    const track = "Tití Me Preguntó";

    console.log(`Fetching metadata for: ${artist} - ${track}...`);

    try {
        const metadata = await SAOClient.fetchTrackMetadata(artist, track);
        console.log("\n[RESULT] Metadata fetched successfully:");
        console.log(JSON.stringify(metadata, null, 2));

        if (metadata.spotify) {
            console.log("\n✅ Spotify Data: Match found!");
        } else {
            console.log("\n❌ Spotify Data: Not found. Check credentials.");
        }

        if (metadata.lastfm) {
            console.log("✅ Last.fm Data: Match found!");
            console.log(`Suggested Tags: ${metadata.suggestedTags?.join(', ')}`);
        } else {
            console.log("❌ Last.fm Data: Not found. Check credentials.");
        }
    } catch (error) {
        console.error("\n💥 Error during test:", error);
    }
}

testMetadata();
