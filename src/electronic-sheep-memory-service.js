// Electronic Sheep v2.7.1 Memory Service for OpenClaw
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 19002; // Changed from 19001 to avoid conflict

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Memory storage directory
const MEMORY_DIR = path.join(__dirname, '.openclaw', 'memory');
const MEMORY_FILE = path.join(MEMORY_DIR, 'MEMORY.md');
const DAILY_MEMORY_DIR = path.join(MEMORY_DIR, 'daily');

// Ensure directories exist
if (!fs.existsSync(MEMORY_DIR)) {
    fs.mkdirSync(MEMORY_DIR, { recursive: true });
}
if (!fs.existsSync(DAILY_MEMORY_DIR)) {
    fs.mkdirSync(DAILY_MEMORY_DIR, { recursive: true });
}

// Heat algorithm weights
const HEAT_WEIGHTS = {
    accessFrequency: 0.4,
    freshness: 0.3,
    relevance: 0.2,
    userRating: 0.1
};

// Memory layers configuration
const MEMORY_LAYERS = {
    shortTerm: { days: 7 },
    longTerm: { minDays: 7, maxDays: 90 },
    discard: { minDays: 90, protectDays: 30 }
};

// In-memory cache for memory entries
let memoryCache = new Map();

// Helper function to calculate heat score
function calculateHeatScore(entry) {
    const now = Date.now();
    const daysSinceAccess = (now - entry.lastAccessed) / (1000 * 60 * 60 * 24);
    const daysSinceCreated = (now - entry.createdAt) / (1000 * 60 * 60 * 24);
    
    const accessFrequencyScore = entry.accessCount / Math.max(daysSinceCreated, 1);
    const freshnessScore = Math.max(0, 1 - (daysSinceCreated / 90));
    const relevanceScore = entry.relevance || 0.5;
    const userRatingScore = entry.userRating || 0.5;
    
    return (
        accessFrequencyScore * HEAT_WEIGHTS.accessFrequency +
        freshnessScore * HEAT_WEIGHTS.freshness +
        relevanceScore * HEAT_WEIGHTS.relevance +
        userRatingScore * HEAT_WEIGHTS.userRating
    );
}

// Determine memory layer based on age and heat
function getMemoryLayer(entry) {
    const now = Date.now();
    const daysOld = (now - entry.createdAt) / (1000 * 60 * 60 * 24);
    
    if (daysOld <= MEMORY_LAYERS.shortTerm.days) {
        return 'shortTerm';
    } else if (daysOld <= MEMORY_LAYERS.longTerm.maxDays) {
        return 'longTerm';
    } else {
        return 'discard';
    }
}

// Routes
app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'electronic-sheep-memory-v2.7.1' });
});

app.post('/memory/search', async (req, res) => {
    try {
        const { query, limit = 10 } = req.body;
        
        // Simulate semantic search with heat scoring
        let results = [];
        for (let [key, entry] of memoryCache) {
            if (entry.content.toLowerCase().includes(query.toLowerCase())) {
                const heatScore = calculateHeatScore(entry);
                results.push({
                    id: key,
                    content: entry.content,
                    heatScore: heatScore,
                    layer: getMemoryLayer(entry),
                    lastAccessed: entry.lastAccessed,
                    createdAt: entry.createdAt
                });
            }
        }
        
        // Sort by heat score and limit results
        results.sort((a, b) => b.heatScore - a.heatScore);
        results = results.slice(0, limit);
        
        // Update access counts
        results.forEach(result => {
            const entry = memoryCache.get(result.id);
            if (entry) {
                entry.accessCount = (entry.accessCount || 0) + 1;
                entry.lastAccessed = Date.now();
            }
        });
        
        res.json({ results });
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ error: 'Search failed' });
    }
});

app.post('/memory/store', async (req, res) => {
    try {
        const { id, content, metadata = {} } = req.body;
        
        const entry = {
            id,
            content,
            ...metadata,
            createdAt: Date.now(),
            lastAccessed: Date.now(),
            accessCount: 1
        };
        
        memoryCache.set(id, entry);
        
        // Also store in file system for persistence
        const dailyFile = path.join(DAILY_MEMORY_DIR, `${new Date().toISOString().split('T')[0]}.md`);
        const logEntry = `[${new Date().toISOString()}] ${content}\n`;
        fs.appendFileSync(dailyFile, logEntry, 'utf8');
        
        res.json({ success: true, id });
    } catch (error) {
        console.error('Store error:', error);
        res.status(500).json({ error: 'Store failed' });
    }
});

app.get('/memory/consolidate', async (req, res) => {
    try {
        // Auto-consolidation logic would run here
        // This would organize memory into layers based on heat scores
        const stats = {
            totalEntries: memoryCache.size,
            shortTerm: 0,
            longTerm: 0,
            discard: 0
        };
        
        for (let [key, entry] of memoryCache) {
            const layer = getMemoryLayer(entry);
            stats[layer]++;
        }
        
        res.json({ success: true, stats });
    } catch (error) {
        console.error('Consolidation error:', error);
        res.status(500).json({ error: 'Consolidation failed' });
    }
});

// Start server
app.listen(PORT, '127.0.0.1', () => {
    console.log(`🐑 Electronic Sheep Memory Service v2.7.1 running on http://127.0.0.1:${PORT}`);
    console.log('Memory layers:', MEMORY_LAYERS);
    console.log('Heat algorithm weights:', HEAT_WEIGHTS);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('Shutting down memory service...');
    process.exit(0);
});