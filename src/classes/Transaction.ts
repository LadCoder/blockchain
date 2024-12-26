import * as crypto from "crypto";

export class Transaction {
  constructor(public amount: number, public payer: string, public payee: string) {
    this.amount = amount;
    this.payer = payer;
    this.payee = payee;
  }

  toString() {
    return JSON.stringify(this);
  }

  get hash() {
    const str = this.toString();
    const hash = crypto.createHash("MD5");
    return hash.update(str).digest("hex");
  }
}
