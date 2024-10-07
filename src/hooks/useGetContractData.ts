import { formatUsdc } from "@/utils/functions";
import { mdlAbi, mdlAddress } from "@/utils/mdlContract";
import { useReadContracts } from "wagmi";

const useGetContractData = () => {
  const {
    data,
    isLoading: isLoadingContractData,
  }: {
    data:
      | [
          { result: bigint },
          { result: bigint },
          { result: bigint },
          { result: bigint },
          { result: string[] }
        ]
      | undefined;
    isLoading: boolean;
  } = useReadContracts({
    contracts: [
      {
        address: mdlAddress,
        abi: mdlAbi,
        functionName: "maxTotal",
      },
      {
        address: mdlAddress,
        abi: mdlAbi,
        functionName: "minPerUser",
      },
      {
        address: mdlAddress,
        abi: mdlAbi,
        functionName: "maxPerUser",
      },
      {
        address: mdlAddress,
        abi: mdlAbi,
        functionName: "totalDeposited",
      },
      {
        address: mdlAddress,
        abi: mdlAbi,
        functionName: "getSuccessfullyDeposited",
      },
    ],
  });

  const { result: maxTotal } = data?.[0] ?? {};
  const { result: minPerUser } = data?.[1] ?? {};
  const { result: maxPerUser } = data?.[2] ?? {};
  const { result: totalDeposited } = data?.[3] ?? {};
  const { result: successfullyDeposited } = data?.[4] ?? {};

  return {
    maxTotal: formatUsdc(Number(maxTotal)),
    minPerUser: formatUsdc(Number(minPerUser)),
    maxPerUser: formatUsdc(Number(maxPerUser)),
    totalDeposited: formatUsdc(Number(totalDeposited)),
    isLoadingContractData,
    successfullyDeposited,
  };
};

export default useGetContractData;
