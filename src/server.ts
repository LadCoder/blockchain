import express from 'express';
import { Chain } from './classes/Chain';

const app = express();
app.use(express.json());  // For parsing JSON bodies

const blockchain = Chain.instance;

// Basic endpoint to check if server is running
app.get('/', (req, res) => {
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
app.get('/blockchain', (req, res) => {
    res.json({
        chain: blockchain.chain,
        isValid: blockchain.isChainValid()
    });
});

// Get blockchain stats
app.get('/stats', (req, res) => {
    res.json({
        totalBlocks: blockchain.size,
        latestBlock: blockchain.lastBlock,
        isValid: blockchain.isChainValid(),
        difficulty: 4,
        totalTransactions: blockchain.size - 1 // Excluding genesis block
    });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});