import { toast } from "react-toastify";

export const formatUsdc = (amount: number) => {
  return amount / 10 ** 6;
};

export const parseUsdc = (amount: number) => {
  return amount * 10 ** 6;
};

export const handleError = (error: string) => {
  const result = error?.match(/@ (.*?) @/);

  if (result) {
    toast.error(result?.[1]);
  } else {
    toast.error("Operation failed");
  }
};

export const isValidEthereumAddress = (address: string) => {
  // Check if the address has the correct length and starts with '0x'
  if (
    typeof address !== "string" ||
    address.length !== 42 ||
    !address.startsWith("0x")
  ) {
    return false;
  }

  // Check if the address contains only valid hexadecimal characters
  const hexRegex = /^0x[a-fA-F0-9]{40}$/;
  return hexRegex.test(address);
};
