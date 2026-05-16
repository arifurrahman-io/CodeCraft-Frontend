import { FileText } from "lucide-react";
import { COMPANY } from "@/utils/constants";

const sections = [
  {
    title: "Use of Our Website",
    items: [
      "You agree to use this website only for lawful business, hiring, project inquiry, or information purposes.",
      "You must not attempt to damage, overload, reverse engineer, scan, scrape, or gain unauthorized access to our website, API, admin area, or connected systems.",
      "Information submitted through forms must be accurate and must not violate another person's rights.",
    ],
  },
  {
    title: "Software Services",
    items: [
      "Project scope, pricing, timeline, revisions, deliverables, and support terms are defined in the proposal, invoice, agreement, or written communication accepted by both parties.",
      "Any change outside the approved scope may require additional time, cost, or a separate agreement.",
      "Client delays in providing content, feedback, approvals, credentials, or third-party access may affect delivery timelines.",
    ],
  },
  {
    title: "Payments and Project Delivery",
    items: [
      "Payment terms are agreed before work begins and may include advance payments, milestone payments, or final settlement before deployment or handover.",
      "Late or incomplete payment may pause development, support, maintenance, deployment, or access to deliverables.",
      "Completed work may be demonstrated, staged, or delivered according to the agreed project process.",
    ],
  },
  {
    title: "Intellectual Property",
    items: [
      "After full payment, ownership of custom project deliverables transfers to the client unless otherwise agreed.",
      "We may retain ownership of reusable code, internal tools, frameworks, libraries, templates, workflows, and general know-how used to deliver services.",
      "Third-party assets, plugins, APIs, fonts, images, libraries, hosting, and software remain subject to their own licenses and terms.",
    ],
  },
  {
    title: "Client Responsibilities",
    items: [
      "Clients are responsible for providing lawful content, brand assets, access credentials, business requirements, and timely feedback.",
      "Clients are responsible for maintaining licenses, subscriptions, domain renewals, hosting plans, third-party API accounts, and payment gateway accounts unless otherwise agreed.",
      "Clients must review deliverables carefully before approval, launch, or public use.",
    ],
  },
  {
    title: "Limitations",
    items: [
      "We aim to provide secure, reliable, and high-quality software, but no website, server, integration, or third-party service can be guaranteed to be uninterrupted or error-free.",
      "We are not responsible for losses caused by third-party outages, client-side misconfiguration, expired services, unauthorized credential sharing, or changes made outside our control.",
      "To the maximum extent permitted by law, our liability is limited to the amount paid for the specific service giving rise to the claim.",
    ],
  },
  {
    title: "CV Submissions and Hiring",
    items: [
      "Submitting a CV does not guarantee employment, interview selection, internship, contract work, or future engagement.",
      "Applicants are responsible for submitting truthful and current information.",
      "We may contact applicants using the details provided if a suitable opportunity becomes available.",
    ],
  },
];

const TermsPage = () => {
  return (
    <div className="min-h-screen bg-slate-950">
      <section className="bg-slate-900 pt-28 pb-14">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/15 text-cyan-400 ring-1 ring-cyan-400/20">
            <FileText className="h-6 w-6" />
          </div>
          <h1 className="text-4xl font-bold text-slate-100 md:text-5xl">
            Terms of Service
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-400">
            These terms describe how clients, visitors, applicants, and partners
            may use {COMPANY.name}&apos;s website and software services.
          </p>
          <p className="mt-4 text-sm text-slate-500">
            Effective date: May 15, 2026
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-5xl space-y-6 px-4 sm:px-6 lg:px-8">
          {sections.map((section) => (
            <article
              key={section.title}
              className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-lg shadow-slate-950/20"
            >
              <h2 className="text-xl font-semibold text-slate-100">
                {section.title}
              </h2>
              <ul className="mt-4 space-y-3">
                {section.items.map((item) => (
                  <li key={item} className="leading-7 text-slate-400">
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          ))}

          <article className="rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-6">
            <h2 className="text-xl font-semibold text-slate-100">
              Questions About These Terms
            </h2>
            <p className="mt-3 leading-7 text-slate-400">
              Contact us at{" "}
              <a
                href={`mailto:${COMPANY.email}`}
                className="text-cyan-400 hover:text-cyan-300"
              >
                {COMPANY.email}
              </a>{" "}
              for clarification about project terms, support, or service
              agreements.
            </p>
          </article>
        </div>
      </section>
    </div>
  );
};

export default TermsPage;
