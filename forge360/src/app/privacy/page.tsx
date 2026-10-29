import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = { title: "Privacy" };

export default function Privacy() {
  return (
    <LegalPage title="Privacy" updated="29 October 2026">
      <p>
        Forge 360 collects only what it needs to show your Skill Card and match you with ideas, in line with India&apos;s Digital
        Personal Data Protection Act, 2023.
      </p>
      <h2>What we collect</h2>
      <ul>
        <li>Your email address, used to sign you in.</li>
        <li>What you enter: name, handle, discipline, year, city, availability, skills, answers and links.</li>
        <li>Ideas you post and the interest you express or receive.</li>
        <li>Your institute, worked out from your college email domain or the link you joined through.</li>
      </ul>
      <h2>Who sees what</h2>
      <ul>
        <li>Your public Skill Card shows your name, handle, headline, skills, tiers, evidence links and availability.</li>
        <li>Your email, institute, discipline and year are never shown publicly.</li>
        <li>When a founder accepts your interest, the two of you see each other&apos;s email, and the founder sees your institute.</li>
      </ul>
      <h2>Consent</h2>
      <p>We ask for your explicit consent before creating your profile. You can withdraw it at any time by deleting your account.</p>
      <h2>Deleting your data</h2>
      <p>
        Dashboard → Your data → Delete my data removes your account, Skill Card, ideas and requests permanently. It can&apos;t be
        undone.
      </p>
      <h2>What we don&apos;t do</h2>
      <ul>
        <li>We don&apos;t sell your data or show ads.</li>
        <li>We don&apos;t scrape profiles you haven&apos;t given us.</li>
        <li>We don&apos;t put personal data in logs.</li>
      </ul>
    </LegalPage>
  );
}
