import express, { Request, Response } from 'express';
import { Chain } from './classes/Chain';
import { Wallet } from './classes/Wallet';

const app = express();
app.use(express.json());  // For parsing JSON bodies

const blockchain = Chain.instance;
const wallets: Wallet[] = [Chain.instance.genesisWallet];

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

// Create a new wallet
app.post('/wallet', (_: Request, res: Response) => {
    try {
        const wallet = new Wallet();
        wallets.push(wallet);

        res.status(201).json({
            address: wallet.publicKey,
            privateKey: wallet.privateKey,
            message: 'Keep your private key safe! It will not be shown again.'
        });
    } catch (error) {
        const err = error as Error;
        res.status(500).json({
            error: 'Failed to create wallet',
            details: err.message
        });
    }
});

// Get wallet balance
app.get('/wallet/balance', (req: Request, res: Response) => {
    const { privateKey } = req.body;

    try {
        const wallet = wallets.find(w => w.privateKey === privateKey);
        if (!wallet) {
            res.status(404).json({
                error: 'Wallet not found',
                details: 'No wallet found with the given private key'
            });
            return;
        }

        const balance = wallet.getBalance();

        res.json({
            address: wallet.publicKey,
            balance
        });
    } catch (error) {
        const err = error as Error;
        res.status(400).json({
            error: 'Failed to get wallet balance',
            details: err.message
        });
    }
});

// Create a new transaction
app.post('/transaction', (req: Request, res: Response) => {
    const { fromPrivateKey, toAddress, amount } = req.body;

    if (!fromPrivateKey || !toAddress || !amount) {
        res.status(400).json({
            error: 'Missing required fields',
            details: 'Please provide fromPrivateKey, toAddress, and amount'
        });
        return;
    }

    try {
        // Find the sender's wallet           
        const senderWallet = wallets.find(w => JSON.stringify(w.privateKey) === JSON.stringify(fromPrivateKey));

        if (!senderWallet) {
            res.status(404).json({
                error: 'Wallet not found',
                details: 'No wallet found with the given private key'
            });
            return;
        }

        // Check if sender has enough balance
        const currentBalance = senderWallet.getBalance();
        if (currentBalance < amount) {
            res.status(400).json({
                error: 'Insufficient funds',
                details: `Current balance (${currentBalance}) is less than transaction amount (${amount})`
            });
            return;
        }

        // Create and send transaction
        senderWallet.sendMoney(amount, toAddress);

        res.status(201).json({
            message: 'Transaction created successfully',
            details: {
                from: senderWallet.publicKey,
                to: toAddress,
                amount: amount
            }
        });
    } catch (error) {
        const err = error as Error;
        res.status(500).json({
            error: 'Transaction failed',
            details: err.message
        });
    }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});