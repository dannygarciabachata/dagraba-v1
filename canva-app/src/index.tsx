import React, { useState, useEffect } from 'react';
import { render } from '@canva/app-ui-kit';
import { Button, Text, Box, Rows, Stack, FormField, TextInput, Select } from '@canva/app-ui-kit';
import { useAssetUpload } from '@canva/asset';
import { addNativeElement } from '@canva/design';

interface Track {
    id: string;
    title: string;
}

const App = () => {
    const [tracks, setTracks] = useState<Track[]>([]);
    const [selectedTrack, setSelectedTrack] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const { upload, isUploading } = useAssetUpload();

    useEffect(() => {
        // Fetch user tracks from DA GRABA API
        const fetchTracks = async () => {
            setLoading(true);
            try {
                // This would use the authenticated user's session
                const response = await fetch('https://dagraba.studio/api/user/tracks');
                const data = await response.json();
                setTracks(data.tracks || []);
            } catch (err) {
                console.error('Failed to fetch tracks', err);
            } finally {
                setLoading(false);
            }
        };

        fetchTracks();
    }, []);

    const handleApplyToTrack = async () => {
        if (!selectedTrack) return;

        // Logic to export the current design from Canva and send its URL to DA GRABA
        // In a real app, you'd use the Canva Design SDK to get the exported image
        console.log('Applying design to track:', selectedTrack);
    };

    return (
        <Box padding="2u">
            <Rows gap="2u">
                <Text variant="bold" size="large">DA GRABA Cover Designer</Text>
                <Text variant="faint">Select a track to assign your design</Text>

                <FormField label="Your Tracks">
                    <Select
                        value={selectedTrack || ''}
                        onChange={(val: string) => setSelectedTrack(val)}
                        options={tracks.map(t => ({ value: t.id, label: t.title }))}
                        placeholder="Choose a song..."
                    />
                </FormField>

                {selectedTrack && (
                    <Stack direction="row" gap="1u">
                        <Button
                            variant="primary"
                            onClick={handleApplyToTrack}
                            loading={loading || isUploading}
                        >
                            Link to Track
                        </Button>
                    </Stack>
                )}
            </Rows>
        </Box>
    );
};

render(<App />);
