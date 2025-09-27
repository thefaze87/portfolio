import { DATA } from "@/data/resume";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Opt-in Policy",
  description: "SMS opt-in policy for Nestly",
  robots: {
    index: false,
    follow: false,
  },
};

export default function OptInPolicyPage() {
  return (
    <main className="flex flex-col min-h-[100dvh] space-y-10">
      <section className="mx-auto w-full max-w-2xl space-y-8">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">
            Opt-in Policy
          </h1>
          <div className="prose max-w-full text-pretty font-sans text-sm text-muted-foreground dark:prose-invert">
            <p>
              By submitting your phone number, you agree to receive SMS updates
              from Nestly. Msg & data rates may apply. Reply STOP to
              unsubscribe.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
