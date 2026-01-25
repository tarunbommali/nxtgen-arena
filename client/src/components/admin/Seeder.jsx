import { useState } from 'react';
import { db } from '../../lib/firebase';
import { doc, setDoc, writeBatch } from 'firebase/firestore';
import { challenges } from '../../data/challenges';
import { modules } from '../../data/curriculum';

export default function Seeder() {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('');

    const seedData = async () => {
        if (!confirm("This will overwrite existing challenge data in Firestore. Continue?")) return;

        setLoading(true);
        setStatus('Starting seed...');

        try {
            const batch = writeBatch(db);
            const challengeId = challenges[0].id; // "30-days-foundation"

            // 1. Seed Challenge Metadata
            setStatus('Seeding challenge metadata...');
            const challengeRef = doc(db, 'challenges', challengeId);
            batch.set(challengeRef, challenges[0]);

            await batch.commit(); // Commit metadata first

            // 2. Seed Days Content
            let processed = 0;
            const errors = [];

            for (const module of modules) {
                // Construct the folder name as it appears in public/docs
                // E.g. "Module 1 - Systems & Architecture (Days 1-5)"
                const folderName = `${module.title} (Days ${module.days[0].id}-${module.days[module.days.length - 1].id})`;

                for (const day of module.days) {
                    setStatus(`Processing Day ${day.id}...`);

                    const fileName = `${day.title}.md`;
                    let content = '';

                    try {
                        // Fetch from public folder
                        const response = await fetch(`/docs/${folderName}/${fileName}`);
                        if (response.ok) {
                            content = await response.text();
                        } else {
                            content = `# ${day.title}\n\nContent file not found. Please add content in the Admin Editor.`;
                            errors.push(`Missing file: ${fileName}`);
                        }
                    } catch (e) {
                        content = `# ${day.title}\n\nError loading content.`;
                        errors.push(`Error fetching: ${fileName}`);
                    }

                    // Upload to Firestore
                    // Path: challenges/{challengeId}/days/{dayId}
                    const dayRef = doc(db, 'challenges', challengeId, 'days', String(day.id));
                    await setDoc(dayRef, {
                        ...day,
                        moduleTitle: module.title,
                        moduleId: module.id,
                        content: content,
                        contentType: 'markdown' // Default to markdown for seeded content
                    });

                    processed++;
                }
            }

            setStatus(`Done! Processed ${processed} days. ${errors.length > 0 ? `Errors: ${errors.length}` : ''}`);
            if (errors.length) console.warn("Seed errors:", errors);

        } catch (error) {
            console.error(error);
            setStatus(`Failed: ${error.message}`);
        }
        setLoading(false);
    };

    return (
        <div className="p-6 border border-white/10 rounded-xl bg-black/20">
            <h3 className="text-xl font-bold mb-4">Database Seeder</h3>
            <p className="text-muted-foreground mb-4">
                Migrate hardcoded content (from public/docs) to Firestore.
                <br />
                <span className="text-sm text-yellow-500">Warning: This writes to the 'challenges' collection.</span>
            </p>
            <button
                onClick={seedData}
                disabled={loading}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg disabled:opacity-50 transition-colors"
            >
                {loading ? 'Seeding...' : 'Seed Data to Firestore'}
            </button>
            {status && <p className="mt-4 text-sm font-mono text-green-400">{status}</p>}
        </div>
    );
}
