import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-8 row-start-2 items-center">
        <div className="flex flex-col items-center gap-4">
          <Image
            className="dark:invert"
            src="/logo.png"
            alt="Project logo"
            width={180}
            height={38}
            priority
          />
          <h1 className="text-4xl font-bold tracking-tight">
            Welcome to PortAPI
          </h1>
          <p className="text-muted-foreground text-center max-w-[600px]">
            A powerful API management platform built with Next.js and Shadcn UI.
          </p>
        </div>

        <div className="flex gap-4 items-center mt-4">
          <Button asChild size="lg">
            <Link href="/auth/login">
              Sign In
            </Link>
          </Button>
          <Button variant="outline" asChild size="lg">
            <Link href="/auth/register">
              Create Account
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-16">
          <div className="flex flex-col items-center gap-2">
            <div className="p-4 rounded-lg bg-primary/10">
              <svg
                className="w-6 h-6 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h2 className="font-semibold">Fast & Reliable</h2>
            <p className="text-sm text-muted-foreground text-center">
              Built on modern tech stack for maximum performance
            </p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="p-4 rounded-lg bg-primary/10">
              <svg
                className="w-6 h-6 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h2 className="font-semibold">Secure by Default</h2>
            <p className="text-sm text-muted-foreground text-center">
              Enterprise-grade security built-in
            </p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="p-4 rounded-lg bg-primary/10">
              <svg
                className="w-6 h-6 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <h2 className="font-semibold">Easy to Use</h2>
            <p className="text-sm text-muted-foreground text-center">
              Intuitive interface for developers
            </p>
          </div>
        </div>
      </main>

      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center text-sm text-muted-foreground">
        <Link href="/about" className="hover:text-foreground">
          About
        </Link>
        <Link href="/docs" className="hover:text-foreground">
          Documentation
        </Link>
        <Link href="/privacy" className="hover:text-foreground">
          Privacy Policy
        </Link>
        <Link href="/terms" className="hover:text-foreground">
          Terms of Service
        </Link>
      </footer>
    </div>
  );
}