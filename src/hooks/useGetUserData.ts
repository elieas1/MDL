import { formatUsdc } from "@/utils/functions";
import { mdlAbi, mdlAddress } from "@/utils/mdlContract";
import { useReadContracts } from "wagmi";

type Props = {
  address: `0x${string}` | undefined;
};

const useGetUserData = ({ address }: Props) => {
  const {
    data,
    isLoading: isLoadingUserData,
    refetch: refetchUserData,
  }: // isError,
  {
    isError: boolean;
    isLoading: boolean;
    data:
      | [
          { result: { amount: bigint; referredBy: string } },
          { result: { enabled: boolean; rewards: bigint; referrals: string[] } }
        ]
      | undefined;
    refetch: () => void;
  } = useReadContracts({
    contracts: [
      {
        address: mdlAddress,
        abi: mdlAbi,
        functionName: "getUserDeposit",
        args: [address],
      },
      {
        address: mdlAddress,
        abi: mdlAbi,
        functionName: "getReferral",
        args: [address],
      },
    ],
  });

  const { result } = data?.[0] ?? {};
  const { amount, referredBy } = result ?? {};

  const { result: referralData } = data?.[1] ?? {};
  const { enabled, referrals, rewards } = referralData ?? {};

  return {
    amount: formatUsdc(Number(amount)) || 0,
    referredBy,
    isLoadingUserData,
    enabled,
    rewards: formatUsdc(Number(rewards)) || 0,
    referrals,
    refetchUserData,
  };
};

export default useGetUserData;
