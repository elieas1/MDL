import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { headers } from "next/headers";
import Web3ModalProvider from "@/context";
import EmptySpace from "@/components/emptySpace/EmptySpace";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";
import { Button } from "@nextui-org/react";
import Link from "next/link";
import Web3Button from "@/components/web3Button/Web3Button";
import { Providers } from "@/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MDL | Numerical",
  description: "MDL Presale",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookies = headers().get("cookie");

  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <main>
            <Web3ModalProvider cookies={cookies}>
              <div className="flex flex-1 w-full justify-center sm:justify-between items-center flex-wrap">
                <Button className="hidden sm:block learnMore">
                  <Link
                    href="https://numerical.gitbook.io/numericalfi"
                    target="_blank"
                  >
                    Learn More
                  </Link>
                </Button>
                <Link href="/">
                  <Image src="/logo.png" width={200} height={200} alt="logo" />
                </Link>
                <div>
                  <Web3Button />
                </div>
              </div>
              <EmptySpace spaceTop={50} />
              {children}
            </Web3ModalProvider>
          </main>
        </Providers>
        <ToastContainer />
      </body>
    </html>
  );
}
