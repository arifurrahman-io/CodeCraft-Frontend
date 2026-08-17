import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  GraduationCap,
  Languages,
  Mail,
  MapPin,
  Phone,
  User,
} from "lucide-react";
import { toast } from "sonner";
import Button from "@/components/common/Button";
import EmptyState from "@/components/common/EmptyState";
import Loader from "@/components/common/Loader";
import StatusBadge from "@/components/admin/StatusBadge";
import {
  getCvSubmissionById,
  updateCvSubmissionStatus,
} from "@/services/cvSubmissionService";

const CV_STATUSES = ["new", "reviewing", "shortlisted", "rejected"];

const getSubmissionFromResponse = (response) =>
  response?.data?.submission ||
  response?.data?.cvSubmission ||
  response?.data?.data ||
  response?.data ||
  response?.submission ||
  response ||
  null;

const normalizeSubmission = (submission = {}) => ({
  ...submission,
  _id: submission._id || submission.id,
  fullName: submission.fullName || "Unknown",
  status: submission.status || "new",
  adminNotes: submission.adminNotes || "",
  educationalQualifications: Array.isArray(submission.educationalQualifications)
    ? submission.educationalQualifications
    : [],
  trainingAndCertifications: Array.isArray(submission.trainingAndCertifications)
    ? submission.trainingAndCertifications
    : [],
  languageProficiency: Array.isArray(submission.languageProficiency)
    ? submission.languageProficiency
    : [],
  references: Array.isArray(submission.references) ? submission.references : [],
});

const formatDate = (date) => {
  if (!date) return "N/A";

  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const DetailCard = ({ title, children }) => (
  <section className="bg-surface rounded-xl p-6 border border-border">
    <h2 className="mb-4 text-lg font-semibold text-ink">{title}</h2>
    {children}
  </section>
);

const InfoItem = ({ label, value }) => (
  <div>
    <p className="text-sm text-ink-muted">{label}</p>
    <p className="mt-1 whitespace-pre-line break-words text-ink">
      {value || "N/A"}
    </p>
  </div>
);

const CvSubmissionDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [submission, setSubmission] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState("new");
  const [adminNotes, setAdminNotes] = useState("");
  const [isSavingStatus, setIsSavingStatus] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadSubmission = async () => {
      try {
        setIsLoading(true);
        const response = await getCvSubmissionById(id);
        const submissionData = normalizeSubmission(
          getSubmissionFromResponse(response),
        );

        if (mounted) {
          setSubmission(submissionData);
          setStatus(submissionData.status || "new");
          setAdminNotes(submissionData.adminNotes || "");
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to load CV");
        if (mounted) setSubmission(null);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    if (id) loadSubmission();

    return () => {
      mounted = false;
    };
  }, [id]);

  const handleStatusSave = async () => {
    try {
      setIsSavingStatus(true);
      const response = await updateCvSubmissionStatus(id, {
        status,
        notes: adminNotes,
      });
      const updated = normalizeSubmission(getSubmissionFromResponse(response));
      setSubmission(updated);
      setStatus(updated.status);
      setAdminNotes(updated.adminNotes || "");
      toast.success("CV status updated");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to update CV status",
      );
    } finally {
      setIsSavingStatus(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-surface rounded-xl p-12 border border-border">
        <Loader text="Loading CV details..." />
      </div>
    );
  }

  if (!submission) {
    return (
      <EmptyState
        title="CV submission not found"
        description="This submission may have been deleted or the link is invalid."
        action={
          <Button
            variant="outline"
            onClick={() => navigate("/admin/cv-submissions")}
          >
            Back to CV Submissions
          </Button>
        }
      />
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => navigate("/admin/cv-submissions")}
          className="p-2 rounded-lg text-ink-muted hover:text-ink hover:bg-ink/5"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold text-ink">
              {submission.fullName}
            </h1>
            <StatusBadge status={submission.status} />
          </div>
          <p className="text-ink-muted">CV submission details</p>
        </div>
      </div>

      <DetailCard title="Review status">
        <div className="grid md:grid-cols-[200px_1fr_auto] gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-ink mb-2">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="input"
            >
              {CV_STATUSES.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-2">
              Internal notes
            </label>
            <textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              rows={2}
              className="input resize-none"
              placeholder="Optional notes for your team"
            />
          </div>
          <Button onClick={handleStatusSave} isLoading={isSavingStatus}>
            Save status
          </Button>
        </div>
      </DetailCard>

      <DetailCard title="Contact Summary">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-ink-muted" />
            <InfoItem label="Full Name" value={submission.fullName} />
          </div>
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-ink-muted" />
            <InfoItem label="Email" value={submission.emailAddress} />
          </div>
          <div className="flex items-center gap-3">
            <Phone className="w-5 h-5 text-ink-muted" />
            <InfoItem label="Mobile" value={submission.mobileNumber} />
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-ink-muted" />
            <InfoItem
              label="Submitted"
              value={formatDate(submission.createdAt)}
            />
          </div>
          <div className="md:col-span-2 flex items-start gap-3">
            <MapPin className="mt-1 w-5 h-5 text-ink-muted" />
            <InfoItem label="Present Address" value={submission.presentAddress} />
          </div>
        </div>
      </DetailCard>

      <DetailCard title="Personal Information">
        <div className="grid md:grid-cols-3 gap-6">
          <InfoItem
            label="Date of Birth"
            value={formatDate(submission.dateOfBirth)}
          />
          <InfoItem label="Nationality" value={submission.nationality} />
          <InfoItem label="National ID Number" value={submission.nationalIdNumber} />
          <InfoItem label="Religion" value={submission.religion} />
          <InfoItem label="Marital Status" value={submission.maritalStatus} />
          <InfoItem label="Gender" value={submission.gender} />
          <InfoItem label="Blood Group" value={submission.bloodGroup} />
        </div>
      </DetailCard>

      <DetailCard title="Career Profile">
        <div className="space-y-6">
          <InfoItem
            label="Professional Summary"
            value={submission.professionalSummary}
          />
          <InfoItem
            label="Employment History"
            value={submission.employmentHistory}
          />
        </div>
      </DetailCard>

      <DetailCard title="Educational Qualifications">
        <div className="space-y-4">
          {submission.educationalQualifications.length ? (
            submission.educationalQualifications.map((item, index) => (
              <div
                key={index}
                className="rounded-xl border border-border bg-canvas p-4"
              >
                <div className="mb-3 flex items-center gap-2 text-accent">
                  <GraduationCap className="h-4 w-4" />
                  <h3 className="font-medium">{item.degreeOrExamName}</h3>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <InfoItem label="Group/Subject" value={item.groupOrSubject} />
                  <InfoItem
                    label="Institution"
                    value={item.institutionName}
                  />
                  <InfoItem
                    label="Board/University"
                    value={item.boardOrUniversity}
                  />
                  <InfoItem label="Passing Year" value={item.passingYear} />
                  <InfoItem label="GPA/CGPA" value={item.gpaOrCgpa} />
                </div>
              </div>
            ))
          ) : (
            <p className="text-ink-muted">No education added.</p>
          )}
        </div>
      </DetailCard>

      <DetailCard title="Skills">
        <div className="grid md:grid-cols-2 gap-6">
          <InfoItem label="Technical Skills" value={submission.technicalSkills} />
          <InfoItem
            label="Professional Skills"
            value={submission.professionalSkills}
          />
        </div>
      </DetailCard>

      <DetailCard title="Training and Certifications">
        <div className="space-y-4">
          {submission.trainingAndCertifications.length ? (
            submission.trainingAndCertifications.map((item, index) => (
              <div
                key={index}
                className="grid md:grid-cols-3 gap-4 rounded-xl border border-border bg-canvas p-4"
              >
                <InfoItem label="Training Title" value={item.trainingTitle} />
                <InfoItem
                  label="Organization"
                  value={item.organizationName}
                />
                <InfoItem label="Duration / Year" value={item.durationOrYear} />
              </div>
            ))
          ) : (
            <p className="text-ink-muted">No training added.</p>
          )}
        </div>
      </DetailCard>

      <DetailCard title="Language Proficiency">
        <div className="space-y-4">
          {submission.languageProficiency.length ? (
            submission.languageProficiency.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-3 rounded-xl border border-border bg-canvas p-4"
              >
                <Languages className="h-5 w-5 text-ink-muted" />
                <div>
                  <p className="font-medium text-ink">
                    {item.languageName || "N/A"}
                  </p>
                  <p className="text-sm text-ink-muted">
                    {item.proficiencyLevel || "N/A"}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-ink-muted">No language proficiency added.</p>
          )}
        </div>
      </DetailCard>

      <DetailCard title="Activities and Achievements">
        <div className="grid md:grid-cols-2 gap-6">
          <InfoItem
            label="Extra-Curricular Activities"
            value={submission.extraCurricularActivities}
          />
          <InfoItem
            label="Achievements and Awards"
            value={submission.achievementsAndAwards}
          />
        </div>
      </DetailCard>

      <DetailCard title="References">
        <div className="grid md:grid-cols-2 gap-4">
          {submission.references.length ? (
            submission.references.map((item, index) => (
              <div
                key={index}
                className="rounded-xl border border-border bg-canvas p-4"
              >
                <h3 className="mb-3 font-medium text-ink">
                  {item.name || `Reference ${index + 1}`}
                </h3>
                <div className="space-y-3">
                  <InfoItem label="Designation" value={item.designation} />
                  <InfoItem label="Organization" value={item.organization} />
                  <InfoItem label="Mobile" value={item.mobileNumber} />
                  <InfoItem label="Email" value={item.emailAddress} />
                  <InfoItem label="Relationship" value={item.relationship} />
                </div>
              </div>
            ))
          ) : (
            <p className="text-ink-muted">No references added.</p>
          )}
        </div>
      </DetailCard>

      <div className="flex justify-end gap-4">
        <Button
          variant="ghost"
          onClick={() => navigate("/admin/cv-submissions")}
        >
          Back
        </Button>
        {submission.emailAddress && (
          <a href={`mailto:${submission.emailAddress}`}>
            <Button icon={Mail}>Email Applicant</Button>
          </a>
        )}
      </div>
    </div>
  );
};

export default CvSubmissionDetailsPage;
