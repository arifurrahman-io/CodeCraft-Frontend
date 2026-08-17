import PageHero from "@/components/website/PageHero";
import { COMPANY } from "@/utils/constants";

const sections = [
  {
    title: "Information We Collect",
    items: [
      "Contact details such as name, email address, phone number, company name, and project requirements submitted through our forms.",
      "CV submission details including personal information, education, skills, experience, references, and other career profile data.",
      "Project communication, support requests, feedback, and files you choose to share with our team.",
      "Basic technical information such as device, browser, IP address, and website usage data for security and performance monitoring.",
    ],
  },
  {
    title: "How We Use Your Information",
    items: [
      "To respond to inquiries, prepare proposals, estimate project scope, and communicate about software services.",
      "To review CV submissions for hiring, collaboration, internship, or future opportunity purposes.",
      "To deliver, maintain, secure, and improve websites, applications, dashboards, APIs, and digital products.",
      "To keep business records, prevent misuse, protect our systems, and comply with applicable obligations.",
    ],
  },
  {
    title: "Data Sharing",
    items: [
      "We do not sell personal information.",
      "We may share limited information with trusted service providers such as hosting, cloud storage, email, analytics, payment, or project management tools when needed to operate our business.",
      "We may disclose information if required by law, security investigation, or to protect our rights, clients, users, and systems.",
    ],
  },
  {
    title: "Data Security and Retention",
    items: [
      "We use reasonable technical and organizational safeguards to protect submitted data from unauthorized access, misuse, or loss.",
      "Project and contact data is retained as long as needed for business, support, legal, or operational purposes.",
      "CV data may be retained for future opportunities unless you request removal.",
    ],
  },
  {
    title: "Your Choices",
    items: [
      "You may request access, correction, or deletion of your personal data by contacting us.",
      "You may ask us not to use your CV or contact information for future communication.",
      "Some records may be retained where necessary for security, legal, accounting, or legitimate business reasons.",
    ],
  },
];

const PrivacyPage = () => {
  return (
    <div>
      <PageHero
        subtitle="Legal"
        title="Privacy Policy"
        description={`This policy explains how ${COMPANY.name} collects, uses, stores, and protects information shared through our website, project inquiries, CV submissions, and software service communications.`}
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
            <h2 className="text-xl font-semibold text-ink mb-3">Contact us</h2>
            <p className="text-ink-muted leading-relaxed">
              For privacy questions or data requests, contact us at{" "}
              <a
                href={`mailto:${COMPANY.email}`}
                className="text-accent hover:text-accent-hover font-medium"
              >
                {COMPANY.email}
              </a>
              .
            </p>
          </article>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPage;
