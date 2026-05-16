import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Plus, Send, Trash2, UserRound } from "lucide-react";
import { toast } from "sonner";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import TextArea from "@/components/common/TextArea";
import { submitCv } from "@/services/cvSubmissionService";

const blankEducation = {
  degreeOrExamName: "",
  groupOrSubject: "",
  institutionName: "",
  boardOrUniversity: "",
  passingYear: "",
  gpaOrCgpa: "",
};

const blankTraining = {
  trainingTitle: "",
  organizationName: "",
  durationOrYear: "",
};

const blankLanguage = {
  languageName: "",
  proficiencyLevel: "",
};

const blankReference = {
  name: "",
  designation: "",
  organization: "",
  mobileNumber: "",
  emailAddress: "",
  relationship: "",
};

const initialForm = {
  fullName: "",
  dateOfBirth: "",
  nationality: "",
  nationalIdNumber: "",
  religion: "",
  maritalStatus: "",
  gender: "",
  bloodGroup: "",
  presentAddress: "",
  mobileNumber: "",
  emailAddress: "",
  professionalSummary: "",
  employmentHistory: "",
  educationalQualifications: [{ ...blankEducation }],
  technicalSkills: "",
  professionalSkills: "",
  trainingAndCertifications: [{ ...blankTraining }],
  languageProficiency: [{ ...blankLanguage }],
  extraCurricularActivities: "",
  achievementsAndAwards: "",
  references: [{ ...blankReference }],
};

const selectOptions = {
  maritalStatus: ["Single", "Married", "Divorced", "Widowed"],
  gender: ["Male", "Female"],
  bloodGroup: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
  proficiencyLevel: ["Basic", "Conversational", "Fluent", "Native"],
};

const FieldGroup = ({ title, description, children }) => (
  <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 md:p-6 shadow-lg shadow-slate-950/20">
    <div className="mb-5">
      <h2 className="text-lg font-semibold text-slate-100">{title}</h2>
      {description && (
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      )}
    </div>
    {children}
  </section>
);

const SelectField = ({ label, name, value, onChange, options }) => (
  <div className="w-full">
    <label className="block text-sm font-medium text-slate-300 mb-2">
      {label}
    </label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
    >
      <option value="">Select {label.toLowerCase()}</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  </div>
);

const rowHasValue = (row) =>
  Object.values(row).some((value) => String(value || "").trim());

const trimText = (value) => String(value || "").trim();

const cleanRows = (rows) =>
  rows
    .map((row) =>
      Object.fromEntries(
        Object.entries(row).map(([key, value]) => [key, trimText(value)]),
      ),
    )
    .filter(rowHasValue);

const RepeatableSection = ({
  title,
  description,
  addLabel,
  rows,
  maxRows,
  onAdd,
  renderRow,
}) => (
  <FieldGroup title={title} description={description}>
    <div className="space-y-4">{rows.map(renderRow)}</div>
    {(!maxRows || rows.length < maxRows) && (
      <button
        type="button"
        onClick={onAdd}
        className="mt-4 inline-flex items-center gap-2 rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-cyan-500/50 hover:text-cyan-300"
      >
        <Plus className="h-4 w-4" />
        {addLabel}
      </button>
    )}
  </FieldGroup>
);

const RemoveButton = ({ disabled, onClick }) => (
  <button
    type="button"
    disabled={disabled}
    onClick={onClick}
    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700 text-slate-400 transition hover:border-red-500/50 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-40"
    aria-label="Remove row"
  >
    <Trash2 className="h-4 w-4" />
  </button>
);

const SubmitCvPage = () => {
  const [formData, setFormData] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRowChange = (section, index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: prev[section].map((row, rowIndex) =>
        rowIndex === index ? { ...row, [field]: value } : row,
      ),
    }));
  };

  const addRow = (section, blankRow) => {
    setFormData((prev) => ({
      ...prev,
      [section]: [...prev[section], { ...blankRow }],
    }));
  };

  const removeRow = (section, index) => {
    setFormData((prev) => ({
      ...prev,
      [section]: prev[section].filter((_, rowIndex) => rowIndex !== index),
    }));
  };

  const validateForm = () => {
    const requiredFields = [
      "fullName",
      "presentAddress",
      "mobileNumber",
      "emailAddress",
      "professionalSummary",
    ];
    const missingField = requiredFields.find((field) => !formData[field].trim());

    if (missingField) {
      return "Please fill all required fields";
    }

    const educationRows = cleanRows(formData.educationalQualifications);
    if (!educationRows.length) {
      return "Please add at least one educational qualification";
    }

    const invalidEducation = educationRows.some(
      (row) =>
        !row.degreeOrExamName || !row.institutionName || !row.passingYear,
    );

    if (invalidEducation) {
      return "Each education row needs degree/exam, institution, and passing year";
    }

    return "";
  };

  const buildPayload = () => ({
    ...Object.fromEntries(
      Object.entries(formData)
        .filter(([, value]) => !Array.isArray(value))
        .map(([key, value]) => [
          key,
          key === "dateOfBirth" && !value ? null : trimText(value),
        ]),
    ),
    educationalQualifications: cleanRows(formData.educationalQualifications),
    trainingAndCertifications: cleanRows(formData.trainingAndCertifications),
    languageProficiency: cleanRows(formData.languageProficiency),
    references: cleanRows(formData.references).slice(0, 2),
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setIsSubmitting(true);

    try {
      await submitCv(buildPayload());

      setFormData(initialForm);
      setIsSubmitted(true);
      toast.success("CV submitted successfully");
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to submit CV",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <section className="pt-24 pb-10 bg-slate-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/15 text-cyan-400 ring-1 ring-cyan-400/20">
              <UserRound className="h-6 w-6" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-100">
              Submit Your CV
            </h1>
            <p className="mt-4 text-lg leading-8 text-slate-400">
              Share your profile with CodeCraft.BD. No account or registration
              is required.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {isSubmitted ? (
            <div className="rounded-2xl border border-green-500/20 bg-green-500/10 p-8 text-center">
              <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-green-400" />
              <h2 className="text-2xl font-semibold text-slate-100">
                CV Submitted Successfully
              </h2>
              <p className="mt-3 text-slate-400">
                Thank you for sharing your profile. Our team will review it.
              </p>
              <Button
                type="button"
                variant="outline"
                className="mt-6"
                onClick={() => setIsSubmitted(false)}
              >
                Submit Another CV
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <FieldGroup
                title="Personal Information"
                description="Basic identification and contact details."
              >
                <div className="grid md:grid-cols-2 gap-5">
                  <Input
                    label="Full Name *"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Your full name"
                  />
                  <Input
                    label="Date of Birth"
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                  />
                  <Input
                    label="Nationality"
                    name="nationality"
                    value={formData.nationality}
                    onChange={handleChange}
                    placeholder="Bangladeshi"
                  />
                  <Input
                    label="National ID Number"
                    name="nationalIdNumber"
                    value={formData.nationalIdNumber}
                    onChange={handleChange}
                    placeholder="NID number"
                  />
                  <Input
                    label="Religion"
                    name="religion"
                    value={formData.religion}
                    onChange={handleChange}
                    placeholder="Religion"
                  />
                  <SelectField
                    label="Marital Status"
                    name="maritalStatus"
                    value={formData.maritalStatus}
                    onChange={handleChange}
                    options={selectOptions.maritalStatus}
                  />
                  <SelectField
                    label="Gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    options={selectOptions.gender}
                  />
                  <SelectField
                    label="Blood Group"
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleChange}
                    options={selectOptions.bloodGroup}
                  />
                </div>
              </FieldGroup>

              <FieldGroup
                title="Contact Details"
                description="Where we can reach you."
              >
                <div className="grid md:grid-cols-2 gap-5">
                  <Input
                    label="Mobile Number *"
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleChange}
                    placeholder="+8801XXXXXXXXX"
                  />
                  <Input
                    label="Email Address *"
                    type="email"
                    name="emailAddress"
                    value={formData.emailAddress}
                    onChange={handleChange}
                    placeholder="you@example.com"
                  />
                  <div className="md:col-span-2">
                    <TextArea
                      label="Present Address *"
                      name="presentAddress"
                      rows={3}
                      value={formData.presentAddress}
                      onChange={handleChange}
                      placeholder="Your present address"
                    />
                  </div>
                </div>
              </FieldGroup>

              <FieldGroup
                title="Career Profile"
                description="Summarize your background and experience."
              >
                <div className="space-y-5">
                  <TextArea
                    label="Professional Summary *"
                    name="professionalSummary"
                    rows={4}
                    value={formData.professionalSummary}
                    onChange={handleChange}
                    placeholder="Briefly describe your experience, strengths, and career goals"
                  />
                  <TextArea
                    label="Employment History"
                    name="employmentHistory"
                    rows={5}
                    value={formData.employmentHistory}
                    onChange={handleChange}
                    placeholder="Company, designation, duration, responsibilities"
                  />
                </div>
              </FieldGroup>

              <RepeatableSection
                title="Educational Qualifications"
                description="Add one row for each exam such as SSC, HSC, Bachelor, or Master."
                addLabel="Add Education"
                rows={formData.educationalQualifications}
                onAdd={() =>
                  addRow("educationalQualifications", blankEducation)
                }
                renderRow={(row, index) => (
                  <div
                    key={index}
                    className="rounded-xl border border-slate-800 bg-slate-950/50 p-4"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-slate-200">
                        Exam {index + 1}
                      </h3>
                      <RemoveButton
                        disabled={formData.educationalQualifications.length === 1}
                        onClick={() =>
                          removeRow("educationalQualifications", index)
                        }
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <Input
                        label="Degree/Exam Name *"
                        value={row.degreeOrExamName}
                        onChange={(e) =>
                          handleRowChange(
                            "educationalQualifications",
                            index,
                            "degreeOrExamName",
                            e.target.value,
                          )
                        }
                        placeholder="SSC, HSC, Bachelor, Master"
                      />
                      <Input
                        label="Group/Subject"
                        value={row.groupOrSubject}
                        onChange={(e) =>
                          handleRowChange(
                            "educationalQualifications",
                            index,
                            "groupOrSubject",
                            e.target.value,
                          )
                        }
                        placeholder="Science, CSE, Business Studies"
                      />
                      <Input
                        label="Institution Name *"
                        value={row.institutionName}
                        onChange={(e) =>
                          handleRowChange(
                            "educationalQualifications",
                            index,
                            "institutionName",
                            e.target.value,
                          )
                        }
                        placeholder="Institution name"
                      />
                      <Input
                        label="Board/University"
                        value={row.boardOrUniversity}
                        onChange={(e) =>
                          handleRowChange(
                            "educationalQualifications",
                            index,
                            "boardOrUniversity",
                            e.target.value,
                          )
                        }
                        placeholder="Board or university"
                      />
                      <Input
                        label="Passing Year *"
                        value={row.passingYear}
                        onChange={(e) =>
                          handleRowChange(
                            "educationalQualifications",
                            index,
                            "passingYear",
                            e.target.value,
                          )
                        }
                        placeholder="2024"
                      />
                      <Input
                        label="GPA/CGPA"
                        value={row.gpaOrCgpa}
                        onChange={(e) =>
                          handleRowChange(
                            "educationalQualifications",
                            index,
                            "gpaOrCgpa",
                            e.target.value,
                          )
                        }
                        placeholder="5.00 or 3.75"
                      />
                    </div>
                  </div>
                )}
              />

              <FieldGroup
                title="Skills"
                description="Add technical and professional capabilities."
              >
                <div className="grid md:grid-cols-2 gap-5">
                  <TextArea
                    label="Technical Skills"
                    name="technicalSkills"
                    rows={4}
                    value={formData.technicalSkills}
                    onChange={handleChange}
                    placeholder="JavaScript, React, Node.js, MongoDB"
                  />
                  <TextArea
                    label="Professional Skills"
                    name="professionalSkills"
                    rows={4}
                    value={formData.professionalSkills}
                    onChange={handleChange}
                    placeholder="Communication, leadership, problem solving"
                  />
                </div>
              </FieldGroup>

              <RepeatableSection
                title="Training and Certifications"
                description="Add training title, organization, and duration or year."
                addLabel="Add Training"
                rows={formData.trainingAndCertifications}
                onAdd={() =>
                  addRow("trainingAndCertifications", blankTraining)
                }
                renderRow={(row, index) => (
                  <div
                    key={index}
                    className="rounded-xl border border-slate-800 bg-slate-950/50 p-4"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-slate-200">
                        Training {index + 1}
                      </h3>
                      <RemoveButton
                        disabled={formData.trainingAndCertifications.length === 1}
                        onClick={() =>
                          removeRow("trainingAndCertifications", index)
                        }
                      />
                    </div>
                    <div className="grid md:grid-cols-3 gap-4">
                      <Input
                        label="Training Title"
                        value={row.trainingTitle}
                        onChange={(e) =>
                          handleRowChange(
                            "trainingAndCertifications",
                            index,
                            "trainingTitle",
                            e.target.value,
                          )
                        }
                        placeholder="Training title"
                      />
                      <Input
                        label="Organization Name"
                        value={row.organizationName}
                        onChange={(e) =>
                          handleRowChange(
                            "trainingAndCertifications",
                            index,
                            "organizationName",
                            e.target.value,
                          )
                        }
                        placeholder="Organization name"
                      />
                      <Input
                        label="Duration / Year"
                        value={row.durationOrYear}
                        onChange={(e) =>
                          handleRowChange(
                            "trainingAndCertifications",
                            index,
                            "durationOrYear",
                            e.target.value,
                          )
                        }
                        placeholder="3 months / 2024"
                      />
                    </div>
                  </div>
                )}
              />

              <RepeatableSection
                title="Language Proficiency"
                description="Add each language and your proficiency level."
                addLabel="Add Language"
                rows={formData.languageProficiency}
                onAdd={() => addRow("languageProficiency", blankLanguage)}
                renderRow={(row, index) => (
                  <div
                    key={index}
                    className="rounded-xl border border-slate-800 bg-slate-950/50 p-4"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-slate-200">
                        Language {index + 1}
                      </h3>
                      <RemoveButton
                        disabled={formData.languageProficiency.length === 1}
                        onClick={() => removeRow("languageProficiency", index)}
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <Input
                        label="Language Name"
                        value={row.languageName}
                        onChange={(e) =>
                          handleRowChange(
                            "languageProficiency",
                            index,
                            "languageName",
                            e.target.value,
                          )
                        }
                        placeholder="Bangla, English"
                      />
                      <SelectField
                        label="Proficiency Level"
                        value={row.proficiencyLevel}
                        onChange={(e) =>
                          handleRowChange(
                            "languageProficiency",
                            index,
                            "proficiencyLevel",
                            e.target.value,
                          )
                        }
                        options={selectOptions.proficiencyLevel}
                      />
                    </div>
                  </div>
                )}
              />

              <FieldGroup
                title="Activities and Achievements"
                description="Add extracurricular activities and awards."
              >
                <div className="grid md:grid-cols-2 gap-5">
                  <TextArea
                    label="Extra-Curricular Activities"
                    name="extraCurricularActivities"
                    rows={4}
                    value={formData.extraCurricularActivities}
                    onChange={handleChange}
                    placeholder="Clubs, volunteering, community work"
                  />
                  <TextArea
                    label="Achievements and Awards"
                    name="achievementsAndAwards"
                    rows={4}
                    value={formData.achievementsAndAwards}
                    onChange={handleChange}
                    placeholder="Awards, recognitions, notable accomplishments"
                  />
                </div>
              </FieldGroup>

              <RepeatableSection
                title="References"
                description="Add 1 to 2 professional references if available."
                addLabel="Add Reference"
                rows={formData.references}
                maxRows={2}
                onAdd={() => addRow("references", blankReference)}
                renderRow={(row, index) => (
                  <div
                    key={index}
                    className="rounded-xl border border-slate-800 bg-slate-950/50 p-4"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-slate-200">
                        Reference {index + 1}
                      </h3>
                      <RemoveButton
                        disabled={formData.references.length === 1}
                        onClick={() => removeRow("references", index)}
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <Input
                        label="Name"
                        value={row.name}
                        onChange={(e) =>
                          handleRowChange(
                            "references",
                            index,
                            "name",
                            e.target.value,
                          )
                        }
                        placeholder="Reference name"
                      />
                      <Input
                        label="Designation"
                        value={row.designation}
                        onChange={(e) =>
                          handleRowChange(
                            "references",
                            index,
                            "designation",
                            e.target.value,
                          )
                        }
                        placeholder="Designation"
                      />
                      <Input
                        label="Organization"
                        value={row.organization}
                        onChange={(e) =>
                          handleRowChange(
                            "references",
                            index,
                            "organization",
                            e.target.value,
                          )
                        }
                        placeholder="Organization"
                      />
                      <Input
                        label="Mobile Number"
                        value={row.mobileNumber}
                        onChange={(e) =>
                          handleRowChange(
                            "references",
                            index,
                            "mobileNumber",
                            e.target.value,
                          )
                        }
                        placeholder="+8801XXXXXXXXX"
                      />
                      <Input
                        label="Email Address"
                        type="email"
                        value={row.emailAddress}
                        onChange={(e) =>
                          handleRowChange(
                            "references",
                            index,
                            "emailAddress",
                            e.target.value,
                          )
                        }
                        placeholder="reference@example.com"
                      />
                      <Input
                        label="Relationship"
                        value={row.relationship}
                        onChange={(e) =>
                          handleRowChange(
                            "references",
                            index,
                            "relationship",
                            e.target.value,
                          )
                        }
                        placeholder="Supervisor, teacher, colleague"
                      />
                    </div>
                  </div>
                )}
              />

              <div className="flex justify-end">
                <Button
                  type="submit"
                  size="lg"
                  icon={Send}
                  isLoading={isSubmitting}
                >
                  Submit CV
                </Button>
              </div>
            </form>
          )}
        </div>
      </section>
    </div>
  );
};

export default SubmitCvPage;
