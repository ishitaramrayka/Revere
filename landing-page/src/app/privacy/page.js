import Link from "next/link";
import "../../app/globals.css";

export const metadata = {
  title: "Privacy Policy — Revere",
  description: "How Revere collects, uses, and protects your data.",
};

export default function PrivacyPage() {
  return (
    <>
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.2rem 4rem", background: "rgba(250,250,248,0.92)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(0,0,0,0.07)" }}>
        <Link href="/" className="nav-logo">
          Re<span style={{ color: "var(--accent)" }}>v</span>ere
        </Link>
        <Link href="/" className="btn-nav">← Back</Link>
      </nav>

      <main className="privacy-page">
        <div className="privacy-inner">

          <p className="privacy-updated">Last updated: March 2026</p>

          <h1 className="privacy-title">Privacy Policy</h1>
          <p className="privacy-lead">
            Revere is an AI-powered wearable device and companion platform designed to help people living with Alzheimer's disease and their caregivers. We take privacy seriously — especially given the sensitive nature of the people we serve. This policy explains exactly what we collect, why, and how it is protected.
          </p>

          <section className="privacy-section">
            <h2>Who this policy applies to</h2>
            <p>This policy applies to all users of the Revere device, the Revere caregiver web dashboard, and any related mobile or web applications. "User" refers to both the person wearing the device (the patient) and the caregivers or family members who configure and monitor it.</p>
          </section>

          <section className="privacy-section">
            <h2>What we collect</h2>
            <h3>On-device (patient side)</h3>
            <ul>
              <li><strong>Camera data:</strong> The glasses camera processes video in real time to identify faces. This processing happens entirely on the device. Raw video is never recorded, stored, or transmitted. Only the result of face recognition (for example, "person identified as Sarah") is used to trigger an audio prompt.</li>
              <li><strong>Face gallery:</strong> Caregivers upload photos of known people through the dashboard. These images are converted into face embeddings (mathematical vectors) and stored locally on the device. The original photos are not stored on the device after processing.</li>
              <li><strong>Location data:</strong> The device collects GPS coordinates to support wandering detection and location-based alerts. Location is only transmitted to the caregiver dashboard when a configurable alert threshold is crossed. Continuous location history is not stored beyond a rolling 24-hour window.</li>
              <li><strong>Device telemetry:</strong> Battery level, connection status, and hardware health diagnostics are collected to support device reliability. This data is anonymised before being transmitted.</li>
            </ul>

            <h3>Caregiver dashboard</h3>
            <ul>
              <li><strong>Account information:</strong> Name, email address, and password (hashed, never stored in plain text).</li>
              <li><strong>Uploaded face photos:</strong> Photos uploaded to build the face gallery. These are processed server-side to generate embeddings, then deleted from our servers within 24 hours. Embeddings are transmitted to the device and stored locally.</li>
              <li><strong>Schedule configuration:</strong> Daily routine and medication reminder schedules set by the caregiver.</li>
              <li><strong>Alert and activity logs:</strong> A timestamped log of alerts triggered (face recognition events, location alerts, reminders) is stored for up to 30 days and accessible only to the caregiver account linked to the device.</li>
            </ul>
          </section>

          <section className="privacy-section">
            <h2>What we do not collect</h2>
            <ul>
              <li>We do not record or store audio beyond the duration of a real-time prompt.</li>
              <li>We do not store raw video footage at any point.</li>
              <li>We do not sell, rent, or share personal data with advertisers or third parties for commercial purposes.</li>
              <li>We do not use patient data to train machine learning models without explicit, opt-in written consent.</li>
            </ul>
          </section>

          <section className="privacy-section">
            <h2>How data is stored and secured</h2>
            <p>All data transmitted between the device and our servers is encrypted in transit using TLS 1.3. Data stored on our servers is encrypted at rest using AES-256. Face embeddings stored on the device are protected by device-level encryption.</p>
            <p>Access to caregiver accounts is protected by password authentication. We recommend enabling two-factor authentication where available. Our internal team access to patient-linked data is restricted on a strict need-to-know basis and is logged.</p>
          </section>

          <section className="privacy-section">
            <h2>Data sharing</h2>
            <p>We do not sell personal data. We may share limited data with:</p>
            <ul>
              <li><strong>Infrastructure providers:</strong> Cloud hosting and database providers operating under data processing agreements consistent with applicable privacy law.</li>
              <li><strong>Emergency services:</strong> In situations where life safety is at risk, we may share location data with emergency responders if explicitly enabled by the caregiver.</li>
              <li><strong>Legal requirements:</strong> If required by a valid court order or applicable law, we may disclose data. We will notify the account holder unless legally prohibited from doing so.</li>
            </ul>
          </section>

          <section className="privacy-section">
            <h2>Retention</h2>
            <ul>
              <li>Alert and activity logs: 30 days, then automatically deleted.</li>
              <li>Uploaded face photos: deleted from our servers within 24 hours of processing.</li>
              <li>Account data: retained while the account is active. Deleted within 30 days of a deletion request.</li>
              <li>Device embeddings: deleted when the caregiver removes a person from the gallery, or when the device is factory reset.</li>
            </ul>
          </section>

          <section className="privacy-section">
            <h2>Your rights</h2>
            <p>Depending on your jurisdiction, you may have the right to access, correct, export, or delete personal data we hold about you. To exercise these rights, contact us at the address below. We will respond within 30 days.</p>
          </section>

          <section className="privacy-section">
            <h2>Children and vulnerable adults</h2>
            <p>Revere is designed to serve people living with Alzheimer's disease, who may lack the capacity to independently consent to data processing. We require that caregivers who configure and use the platform have appropriate legal authority to act on behalf of the patient, such as power of attorney or equivalent guardianship. We do not knowingly collect data from minors under 18 without verifiable guardian consent.</p>
          </section>

          <section className="privacy-section">
            <h2>Changes to this policy</h2>
            <p>We may update this policy as the product evolves. Significant changes will be communicated to registered caregiver accounts via email at least 14 days before taking effect. Continued use of the platform after that date constitutes acceptance of the revised policy.</p>
          </section>

          <section className="privacy-section">
            <h2>Contact</h2>
            <p>For privacy-related questions, data requests, or concerns:</p>
            <p><strong>Revere</strong><br />privacy@revere.health</p>
          </section>

        </div>
      </main>

      <style>{`
        .privacy-page {
          min-height: 100vh;
          padding: 10rem 2rem 8rem;
          background: var(--bg);
        }
        .privacy-inner {
          max-width: 720px;
          margin: 0 auto;
        }
        .privacy-updated {
          font-size: 0.75rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--muted);
          margin-bottom: 1.5rem;
        }
        .privacy-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight: 300;
          line-height: 1.1;
          margin-bottom: 2rem;
          color: var(--text);
        }
        .privacy-lead {
          font-size: 1.05rem;
          color: var(--muted);
          line-height: 1.8;
          margin-bottom: 4rem;
          border-bottom: 1px solid var(--border);
          padding-bottom: 3rem;
        }
        .privacy-section {
          margin-bottom: 3rem;
        }
        .privacy-section h2 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.4rem;
          font-weight: 400;
          color: var(--text);
          margin-bottom: 1rem;
        }
        .privacy-section h3 {
          font-size: 0.82rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--accent);
          margin: 1.5rem 0 0.75rem;
        }
        .privacy-section p {
          font-size: 0.92rem;
          color: var(--muted);
          line-height: 1.85;
          margin-bottom: 0.75rem;
        }
        .privacy-section ul {
          list-style: none;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }
        .privacy-section ul li {
          font-size: 0.92rem;
          color: var(--muted);
          line-height: 1.75;
          padding-left: 1.2rem;
          position: relative;
        }
        .privacy-section ul li::before {
          content: '–';
          position: absolute;
          left: 0;
          color: var(--accent);
        }
        .privacy-section strong {
          color: var(--text);
          font-weight: 500;
        }
      `}</style>
    </>
  );
}
