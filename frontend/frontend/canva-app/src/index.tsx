import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Button, Text, Box, Rows, FormField, Select } from '@canva/app-ui-kit';

interface Track {
    id: string;
    title: string;
}

const App = () => {
    const [tracks, setTracks] = useState<Track[]>([]);
    const [selectedTrack, setSelectedTrack] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Fetch user tracks from DA GRABA API
        const fetchTracks = async () => {
            setLoading(true);
            try {
                // This would use the authenticated user's session
                const response = await fetch('http://localhost:3000/api/user/tracks');
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
        console.log('Applying design to track:', selectedTrack);
    };

    return (
        <Box padding="2u">
            <Rows spacing="2u">
                <Text>DA GRABA Cover Designer</Text>
                <Text>Select a track to assign your design</Text>

                <FormField
                    label="Your Tracks"
                    control={(props) => (
                        <Select
                            {...props}
                            value={selectedTrack || ''}
                            onChange={(val: string) => setSelectedTrack(val)}
                            options={tracks.map(t => ({ value: t.id, label: t.title }))}
                        />
                    )}
                />

                {selectedTrack && (
                    <Button
                        variant="primary"
                        onClick={handleApplyToTrack}
                        loading={loading}
                    >
                        Link to Track
                    </Button>
                )}
            </Rows>
        </Box>
    );
};

const root = createRoot(document.getElementById('root') || document.body);
root.render(<App />);
