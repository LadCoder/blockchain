import * as crypto from "crypto";

export class Transaction {
  constructor(public amount: number, public payer: string, public payee: string) {
    this.amount = amount;
    this.payer = payer;
    this.payee = payee;
  }

  get hash() {
    return crypto.createHash("sha256").update(this.toString()).digest("hex");
  }
}
