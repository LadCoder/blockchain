import * as crypto from "crypto";

import { Transaction } from "./Transaction";

export class Block {

  public nonce = Math.round(Math.random() * 999999999);
  public hash: string;

  constructor(public prevHash: string, public transaction: Transaction, public timestamp = Date.now()) {
    this.hash = this.calculateHash();
  }

  calculateHash(): string {
    const str = this.prevHash +
      this.timestamp.toString() +
      this.transaction.toString() +
      this.nonce.toString();

    return crypto
      .createHash('MD5')
      .update(str)
      .digest('hex');
  }
}
