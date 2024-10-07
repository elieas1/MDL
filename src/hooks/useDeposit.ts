import { deadAddress } from "@/utils/constants";
import { formatUsdc, handleError, parseUsdc } from "@/utils/functions";
import { mdlAbi, mdlAddress } from "@/utils/mdlContract";
import { usdcAbi, usdcAddress } from "@/utils/usdcContract";
import { useEffect } from "react";
import { toast } from "react-toastify";
import {
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";

type Props = {
  address: `0x${string}` | undefined;
  ref?: string;
  amount: number;
};

const useDeposit = ({ address, amount, ref = "" }: Props) => {
  const { data: allowanceData, refetch: refetchAllowance } = useReadContract({
    abi: usdcAbi,
    address: usdcAddress,
    functionName: "allowance",
    args: [address, mdlAddress],
  });

  const {
    writeContract: approveUsdc,
    isPending: isLoadingApproveHash,
    data: approveUsdcHash,
  } = useWriteContract();

  const { isLoading: isLoadingApprove, isSuccess: isSuccessApprove } =
    useWaitForTransactionReceipt({
      hash: approveUsdcHash,
    });

  const allowance = formatUsdc(Number(allowanceData));

  const {
    writeContract,
    data,
    isPending: isLoadingDepositHash,
    error: errorHash,
    isError: isErrorHash,
  } = useWriteContract();

  useEffect(() => {
    if (isErrorHash) {
      handleError(errorHash.message);
    }
  }, [errorHash, isErrorHash]);

  const { isLoading: isLoadingDeposit, isSuccess } =
    useWaitForTransactionReceipt({
      hash: data,
    });

  useEffect(() => {
    if (isSuccess) {
      toast.success("Bought successfully");
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isSuccessApprove) {
      refetchAllowance();
      writeContract({
        abi: mdlAbi,
        address: mdlAddress,
        functionName: "enterLaunch",
        args: [parseUsdc(amount), ref || deadAddress],
      });
    }
  }, [amount, isSuccessApprove, ref, refetchAllowance, writeContract]);

  const deposit = () => {
    if (allowance < amount) {
      approveUsdc({
        abi: usdcAbi,
        address: usdcAddress,
        functionName: "approve",
        args: [mdlAddress, parseUsdc(amount)],
      });
    } else {
      writeContract({
        abi: mdlAbi,
        address: mdlAddress,
        functionName: "enterLaunch",
        args: [parseUsdc(amount), ref || deadAddress],
      });
    }
  };

  return {
    isLoadingDeposit,
    isLoadingDepositHash,
    deposit,
    isLoadingApprove,
    isLoadingApproveHash,
    allowance,
  };
};

export default useDeposit;
