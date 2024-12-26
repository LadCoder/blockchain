import express, { Request, Response } from 'express';
import { Chain } from './classes/Chain';

const app = express();
app.use(express.json());  // For parsing JSON bodies

const blockchain = Chain.instance;

// Basic endpoint to check if server is running
app.get('/', (_: Request, res: Response) => {
    res.json({
        message: 'Blockchain server is running!',
        endpoints: {
            GET: [
                '/',
                '/blockchain',
                '/balance/:address',
                '/pending'
            ],
            POST: [
                '/transaction',
                '/mine'
            ]
        }
    });
});

// Get the full blockchain
app.get('/blockchain', (_: Request, res: Response) => {
    res.json({
        chain: blockchain.chain,
        isValid: blockchain.isChainValid()
    });
});

// Get blockchain stats
app.get('/stats', (_: Request, res: Response) => {
    res.json({
        totalBlocks: blockchain.size,
        latestBlock: blockchain.lastBlock,
        isValid: blockchain.isChainValid(),
        difficulty: 4,
        totalTransactions: blockchain.size - 1 // Excluding genesis block
    });
});

// Get latest blocks (with limit parameter)
app.get('/latest-blocks', (req: Request, res: Response) => {
    const limit = parseInt(req.query.limit as string) || 5;
    const latestBlocks = blockchain.chain.slice(-limit);

    res.json(latestBlocks);
});

// Get block by hash
app.get('/blockchain/:hash', (req: Request, res: Response) => {
    const { hash } = req.params;
    const block = blockchain.chain.find(b => b.hash === hash);

    if (block) {
        res.status(200).json(block);
        return;
    }

    res.status(404).json({
        error: 'Block not found',
        details: 'No block found with the given hash'
    });
});

// Manual mining endpoint (for testing)
app.post('/mine', (req: Request, res: Response) => {
    const { nonce } = req.body;

    try {
        const solution = blockchain.mine(nonce);
        res.json({
            message: 'Mining successful',
            solution,
            nonce
        });
    } catch (error) {
        const err = error as Error;
        res.status(400).json({
            error: 'Mining failed',
            details: err.message
        });
    }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});