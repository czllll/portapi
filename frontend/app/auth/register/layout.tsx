import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Register - PortAPI",
  description: "Create a new account",
}

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children;
}