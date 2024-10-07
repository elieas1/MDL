"use client";
import { Button } from "@nextui-org/react";
import React from "react";
import { useAccount } from "wagmi";
import classes from "./Web3Button.module.css";
import { useAppKit } from "@reown/appkit/react";

const Web3Button = () => {
  const { open } = useAppKit();
  const { address } = useAccount();
  return (
    <Button className={classes.buttonStyle} onClick={() => open()}>
      {address
        ? `${address?.slice(0, 7)}...${address.slice(address.length - 5)}`
        : "Connect Wallet"}
    </Button>
  );
};

export default Web3Button;
