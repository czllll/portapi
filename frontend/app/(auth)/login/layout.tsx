import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Login - PortAPI",
    description: "Login to your account",
}

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children;
}