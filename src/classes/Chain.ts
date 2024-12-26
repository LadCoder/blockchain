import * as crypto from "crypto";

import { Block } from "./Block";
import { Transaction } from "./Transaction";

export class Chain {
    public static instance = new Chain();

    chain: Block[];

    constructor() {
        this.chain = [
            new Block('', new Transaction(100, 'genesis', 'satoshi'))
        ];
    }

    get lastBlock() {
        return this.chain[this.chain.length - 1];
    }

    mine(nonce: number) {
        let solution = 1;
        console.log("⛏️  mining...");

        while (true) {

            const hash = crypto.createHash('MD5');
            hash.update((nonce + solution).toString()).end();

            const attempt = hash.digest('hex');

            if (attempt.startsWith('0000')) {
                console.log(`Solved: ${solution}`);
                return solution;
            }

            solution += 1;
        }
    }

    addBlock(transaction: Transaction, senderPublicKey: string, signature: Buffer) {
        const verifier = crypto.createVerify("sha256").update(transaction.toString());
        const isValid = verifier.verify(senderPublicKey, signature);

        if (isValid) {
            const newBlock = new Block(this.lastBlock.hash, transaction);
            this.mine(newBlock.nonce);
            this.chain.push(newBlock);
        }

    }

    isChainValid(): boolean {
        // Loop through all blocks (except genesis block)
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            // 1. Verify current block's hash
            if (currentBlock.hash !== currentBlock.calculateHash()) {
                console.log('Invalid block hash');
                return false;
            }

            // 2. Verify block link (previous hash)
            if (currentBlock.prevHash !== previousBlock.hash) {
                console.log('Invalid block chain link');
                return false;
            }

            // 3. Verify proof of work (if your difficulty is 4)
            if (!currentBlock.hash.startsWith('0000')) {
                console.log('Invalid proof of work');
                return false;
            }
        }

        return true;
    }
}
