# Simple Blockchain Implementation

A TypeScript implementation of a basic blockchain with wallet management, proof-of-work mining, and a REST API.

## Features

- Blockchain with proof-of-work mining
- Wallet creation and management
- Transaction signing and verification
- RESTful API endpoints
- Chain validation
- Genesis block with initial funds

## API Endpoints

### GET Endpoints
- `/` - Check server status and view available endpoints
- `/blockchain` - Get the full blockchain and validity status
- `/stats` - Get blockchain statistics
- `/latest-blocks` - Get most recent blocks (with optional limit parameter)
- `/blockchain/:hash` - Get block by hash
- `/wallet/balance` - Get wallet balance (requires private key)

### POST Endpoints
- `/wallet` - Create a new wallet
- `/transaction` - Create a new transaction
- `/mine` - Mine a block (testing endpoint)

## Getting Started

### Prerequisites
- Node.js (v14+)
- npm (v6+)
- TypeScript (v4+)
- Express (v4+)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/blockchain.git
   cd blockchain
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the TypeScript code:
   ```bash
   npm run build
   ```

4. Start the server:
   ```bash
   npm run server
   ```

The server will start running on http://localhost:3000

## Development

## Technical Details

- Built with TypeScript and Express.js
- Uses SHA-256 for block hashing
- Implements basic proof-of-work mining
- Public/private key cryptography for wallet management
- In-memory blockchain storage

## Security Notes

- This is a demonstration project and not intended for production use
- Private keys are exposed in API responses for educational purposes
- The blockchain implementation is simplified for learning
- No persistent storage - chain resets when server restarts

## License

ISC
