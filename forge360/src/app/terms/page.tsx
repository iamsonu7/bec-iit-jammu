import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = { title: "Terms" };

export default function Terms() {
  return (
    <LegalPage title="Terms" updated="29 October 2026">
      <p>By using Forge 360 you agree to these terms. They&apos;re short on purpose.</p>
      <h2>Be honest</h2>
      <p>
        Your Skill Card must describe what you can actually do. Evidence links must be your own work. Verified tiers can be removed
        if a claim turns out to be false.
      </p>
      <h2>Ideas and ownership</h2>
      <p>
        Forge 360 introduces students and founders; it isn&apos;t a party to any agreement between them. Agree in writing who owns
        what before starting work together, especially for equity.
      </p>
      <h2>Stay safe</h2>
      <ul>
        <li>Don&apos;t pay anyone, or ask anyone to pay, to be considered for an idea.</li>
        <li>Meet in public places and tell someone where you&apos;re going.</li>
        <li>Report anything that feels wrong to the Forge 360 team.</li>
      </ul>
      <h2>What isn&apos;t allowed</h2>
      <ul>
        <li>Harassment, discrimination, spam or misleading ideas.</li>
        <li>Collecting other users&apos; contact details for anything other than the idea you matched on.</li>
      </ul>
      <p>We may remove content or accounts that break these rules.</p>
    </LegalPage>
  );
}
