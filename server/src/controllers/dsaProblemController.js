const prisma = require('../utils/prismaClient');

exports.getAllSheets = async (req, res) => {
    try {
        const sheets = await prisma.dsaSheet.findMany({
            include: {
                _count: { select: { topics: true } }
            }
        });
        res.json({ success: true, count: sheets.length, data: sheets });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.getSheetById = async (req, res) => {
    try {
        const sheet = await prisma.dsaSheet.findUnique({
            where: { id: parseInt(req.params.id) },
            include: {
                topics: {
                    include: {
                        problems: {
                            include: {
                                solutions: true
                            }
                        }
                    }
                }
            }
        });

        if (!sheet) {
            return res.status(404).json({ success: false, message: 'DSA Sheet not found' });
        }

        res.json({ success: true, data: sheet });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
