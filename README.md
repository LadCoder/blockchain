# Blockchain Implementation in TypeScript

A simple blockchain implementation to demonstrate core blockchain concepts including:

- Blocks with transactions and cryptographic hashing
- Digital signatures and wallet key pairs
- Transaction validation
- Proof of work mining

## Key Components

### Block
Each block contains:
- Previous block's hash
- Transaction data
- Timestamp
- Nonce for mining
- Cryptographic hash using SHA256

### Transaction
Represents transfer of value between wallets:
- Amount
- Payer public key
- Payee public key
- Transaction hash

### Wallet
Handles cryptographic operations:
- RSA key pair generation
- Digital signatures
- Transaction signing and verification

## Usage
`npm run start`