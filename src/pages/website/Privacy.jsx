import { ShieldCheck } from "lucide-react";
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
    <div className="min-h-screen bg-slate-950">
      <section className="bg-slate-900 pt-28 pb-14">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/15 text-cyan-400 ring-1 ring-cyan-400/20">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h1 className="text-4xl font-bold text-slate-100 md:text-5xl">
            Privacy Policy
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-400">
            This policy explains how {COMPANY.name} collects, uses, stores, and
            protects information shared through our website, project inquiries,
            CV submissions, and software service communications.
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
                  <li
                    key={item}
                    className="leading-7 text-slate-400"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          ))}

          <article className="rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-6">
            <h2 className="text-xl font-semibold text-slate-100">
              Contact Us
            </h2>
            <p className="mt-3 leading-7 text-slate-400">
              For privacy questions or data requests, contact us at{" "}
              <a
                href={`mailto:${COMPANY.email}`}
                className="text-cyan-400 hover:text-cyan-300"
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
