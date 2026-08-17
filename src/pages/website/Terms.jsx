import PageHero from "@/components/website/PageHero";
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
    <div>
      <PageHero
        subtitle="Legal"
        title="Terms of Service"
        description={`These terms describe how clients, visitors, applicants, and partners may use ${COMPANY.name}'s website and software services.`}
      />
      <div className="container-custom max-w-3xl -mt-6 mb-8">
        <p className="text-sm text-ink-subtle">Effective date: May 15, 2026</p>
      </div>

      <section className="pb-16 md:pb-20">
        <div className="container-custom max-w-3xl space-y-10">
          {sections.map((section) => (
            <article
              key={section.title}
              className="border-t border-border pt-6"
            >
              <h2 className="text-xl font-semibold text-ink mb-4">
                {section.title}
              </h2>
              <ul className="space-y-3">
                {section.items.map((item) => (
                  <li
                    key={item}
                    className="text-ink-muted leading-relaxed pl-4 border-l-2 border-border"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          ))}

          <article className="border-t border-border pt-6">
            <h2 className="text-xl font-semibold text-ink mb-3">
              Questions about these terms
            </h2>
            <p className="text-ink-muted leading-relaxed">
              Contact us at{" "}
              <a
                href={`mailto:${COMPANY.email}`}
                className="text-accent hover:text-accent-hover font-medium"
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
