import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import chains from "./chains.json";
import axios from "axios";
import "dotenv/config";

const run = async () => {
  if (chains.length) {
    (chains as { prefix: string; name: string; faucet: string; denom: string }[]).forEach((chain) =>
      setInterval(async () => {
        try {
          const wallet = await DirectSecp256k1HdWallet.fromMnemonic(process.env.MNEMONIC as string, {
            prefix: chain.prefix,
          });
          const [{ address }] = await wallet.getAccounts();
          console.log(`${chain.name} address: `, address);

          const res = await axios.post(chain.faucet, {
            denom: chain.denom,
            address,
          });

          console.log(`${chain.name} faucet response: ${res.status}`);
        } catch (err) {
          console.error(err);
        }
      }, 1000 * parseInt(process.env.INTERVAL as string))
    );
    console.log("Starting script...");
  } else {
    console.log("No chains config found.");
  }
};

run();
