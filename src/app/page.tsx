"use client";
import React, { ChangeEvent, useEffect, useState } from "react";
import EmptySpace from "@/components/emptySpace/EmptySpace";
import useGetContractData from "@/hooks/useGetContractData";
import useGetUserData from "@/hooks/useGetUserData";
import {
  Button,
  Card,
  CardBody,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Progress,
  Spinner,
  useDisclosure,
} from "@nextui-org/react";
import { useAccount } from "wagmi";
import { deadAddress } from "@/utils/constants";
import { useSearchParams } from "next/navigation";
import { isValidEthereumAddress } from "@/utils/functions";
import useDeposit from "@/hooks/useDeposit";
import { toast } from "react-toastify";

export default function Home() {
  const { address } = useAccount();

  const params = useSearchParams();
  const ref = params.get("ref");

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [valueAmount, setValueAmount] = useState(0);

  const {
    deposit,
    isLoadingDeposit,
    isLoadingDepositHash,
    isLoadingApprove,
    isLoadingApproveHash,
    allowance,
    isSuccess,
  } = useDeposit({
    address,
    amount: valueAmount,
    ref: ref!,
  });

  const {
    isLoadingContractData,
    maxPerUser,
    maxTotal,
    minPerUser,
    totalDeposited,
    successfullyDeposited,
    refetchContractData,
  } = useGetContractData();

  const {
    amount,
    isLoadingUserData,
    referredBy,
    enabled,
    rewards,
    referrals,
    refetchUserData,
  } = useGetUserData({ address });

  useEffect(() => {
    if (isSuccess) {
      refetchContractData();
      refetchUserData();
    }
  }, [isSuccess, refetchContractData, refetchUserData]);

  const hasReferral = referredBy !== deadAddress;

  const handleValueChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValueAmount(parseInt(event.target.value));
  };

  if (isLoadingContractData || isLoadingUserData) {
    return <Spinner />;
  }

  return (
    <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
      <Card className="card">
        <CardBody>
          <div className="title">$MDL - PRESALE</div>
          <div className="progress">
            <Progress
              label={`${totalDeposited.toLocaleString()} / ${maxTotal.toLocaleString()} USDC`}
              size="sm"
              value={totalDeposited}
              maxValue={maxTotal}
              color="success"
              showValueLabel={true}
              className="max-w-md"
            />
          </div>
          <EmptySpace spaceTop={10} />
          <Button className="button" color="primary" onPress={onOpen}>
            Buy $MDL
          </Button>
          <EmptySpace spaceTop={10} />
          <div className="info">
            <div>Total Contributers</div>
            <div>{successfullyDeposited?.length}</div>
          </div>
          <EmptySpace spaceTop={10} />
          <div className="info">
            <div>My Contribution</div>
            <div>{amount.toLocaleString()} USDC</div>
          </div>
          <EmptySpace spaceTop={10} />
          <div className="info">
            <div>My Allocation</div>
            <div>{amount.toLocaleString()} MDL</div>
          </div>
          <EmptySpace spaceTop={10} />
          <div className="info">
            <div>Max Wallet</div>
            <div>{maxPerUser.toLocaleString()} USDC</div>
          </div>
          <EmptySpace spaceTop={10} />
          <div className="info">
            <div>Total Allocation</div>
            <div>{maxTotal.toLocaleString()} MDL</div>
          </div>
          {enabled && (
            <>
              <EmptySpace showLine spaceTop={10} />
              <EmptySpace spaceTop={10} />
              <div className="info">
                <div>Referral Link</div>
                <div className="flex">
                  {`https://mdl.numerical.fi/?ref=${address}`.slice(0, 13) +
                    "..."}
                  <div
                    onClick={() => {
                      navigator.clipboard
                        .writeText(`https://mdl.numerical.fi/?ref=${address}`)
                        .then(() => {
                          toast.success("Copied");
                        });
                    }}
                    className="copy"
                  >
                    Copy
                  </div>
                </div>
              </div>
              <EmptySpace spaceTop={10} />
              <div className="info">
                <div>Total Referrals</div>
                <div>{referrals?.length}</div>
              </div>
              <EmptySpace spaceTop={10} />
              <div className="info">
                <div>Referral Rewards</div>
                <div>{rewards} USDC</div>
              </div>
            </>
          )}
        </CardBody>
      </Card>
      <Modal isOpen={isOpen} placement="auto" onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalHeader className="title">Buy $MDL</ModalHeader>
          <ModalBody>
            <Input
              value={valueAmount.toString()}
              onChange={handleValueChange}
              type="number"
              label="Amount"
              max={maxPerUser}
            />
            {valueAmount > 0 && (
              <div className="info">
                <div>You get</div>
                <div>{valueAmount.toLocaleString()} MDL</div>
              </div>
            )}
            {(hasReferral || (!!ref && isValidEthereumAddress(ref))) && (
              <Input
                type="text"
                label="Referral"
                value={hasReferral ? referredBy : ref || ""}
                disabled
              />
            )}
            <Button
              color="primary"
              onPress={deposit}
              className="button"
              isLoading={
                isLoadingDeposit ||
                isLoadingDepositHash ||
                isLoadingApprove ||
                isLoadingApproveHash
              }
              isDisabled={
                valueAmount < minPerUser ||
                valueAmount > maxPerUser ||
                (!!ref && !isValidEthereumAddress(ref))
              }
            >
              {allowance < valueAmount ? "Approve Usdc" : "Buy $MDL"}
            </Button>
            <EmptySpace spaceTop={10} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}
