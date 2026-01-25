const prisma = require('../utils/prismaClient');

exports.getAllRoadmaps = async (req, res) => {
    try {
        const roadmaps = await prisma.roadmap.findMany({
            include: { _count: { select: { phases: true } } }
        });
        res.json({ success: true, count: roadmaps.length, data: roadmaps });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.getRoadmapById = async (req, res) => {
    try {
        const roadmap = await prisma.roadmap.findUnique({
            where: { id: parseInt(req.params.id) },
            include: {
                phases: {
                    orderBy: { order: 'asc' },
                    include: {
                        sections: {
                            orderBy: { order: 'asc' },
                            include: {
                                items: {
                                    orderBy: { order: 'asc' },
                                    include: {
                                        subItems: {
                                            orderBy: { order: 'asc' }
                                        }
                                    }
                                }
                            }
                        },
                        playlists: true,
                        projects: true
                    }
                }
            }
        });

        if (!roadmap) {
            return res.status(404).json({ success: false, message: 'Roadmap not found' });
        }

        // Transform to match frontend format
        const formattedRoadmap = {
            id: roadmap.id.toString(),
            title: roadmap.title,
            description: roadmap.description,
            targetRoles: [roadmap.role_target],
            phases: roadmap.phases.map(phase => ({
                id: `phase-${phase.order}`,
                order: phase.order,
                title: phase.title,
                level: phase.level,
                duration: phase.duration,
                description: phase.description,
                sections: phase.sections.map(section => ({
                    id: `p${phase.order}-s${section.id}`,
                    title: section.title,
                    description: section.description,
                    items: section.items.map(item => ({
                        id: `p${phase.order}-s${section.id}-i${item.id}`,
                        title: item.title,
                        subItems: item.subItems.map(sub => ({
                            title: sub.title,
                            videoUrl: sub.video_url,
                            duration: sub.duration
                        }))
                    }))
                })),
                playlists: phase.playlists.map(pl => ({
                    title: pl.title,
                    author: pl.author,
                    videoCount: pl.video_count,
                    url: pl.url,
                    thumbnail: pl.thumbnail
                })),
                projects: phase.projects.map(proj => ({
                    id: `p${phase.order}-pr${proj.id}`,
                    title: proj.title,
                    description: proj.description,
                    tags: proj.tags
                }))
            }))
        };

        res.json({ success: true, data: formattedRoadmap });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
