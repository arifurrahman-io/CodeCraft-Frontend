import { useCallback, useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { toast } from "sonner";
import StatusBadge from "@/components/admin/StatusBadge";
import DataTable from "@/components/admin/DataTable";
import Input from "@/components/common/Input";
import Loader from "@/components/common/Loader";
import { getAllCvSubmissions } from "@/services/cvSubmissionService";

const getSubmissionsFromResponse = (response) => {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.data?.submissions)) {
    return response.data.submissions;
  }
  if (Array.isArray(response?.data?.cvSubmissions)) {
    return response.data.cvSubmissions;
  }
  if (Array.isArray(response?.data?.data)) return response.data.data;
  if (Array.isArray(response?.submissions)) return response.submissions;
  return [];
};

const normalizeSubmission = (submission = {}) => ({
  ...submission,
  _id: submission._id || submission.id,
  fullName: submission.fullName || "Unknown",
  emailAddress: submission.emailAddress || "",
  mobileNumber: submission.mobileNumber || "",
  gender: submission.gender || "",
  nationality: submission.nationality || "",
  educationalQualifications: Array.isArray(submission.educationalQualifications)
    ? submission.educationalQualifications
    : [],
  technicalSkills: submission.technicalSkills || "",
  status: submission.status || "new",
  createdAt: submission.createdAt || "",
});

const formatDate = (date) => {
  if (!date) return "";

  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const latestEducation = (submission) =>
  submission.educationalQualifications?.[0]?.degreeOrExamName || "N/A";

const CvSubmissionListPage = () => {
  const [submissions, setSubmissions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchSubmissions = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await getAllCvSubmissions();
      setSubmissions(
        getSubmissionsFromResponse(response).map(normalizeSubmission),
      );
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to load CV submissions",
      );
      setSubmissions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(fetchSubmissions);
  }, [fetchSubmissions]);

  const filteredSubmissions = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return submissions;

    return submissions.filter((submission) =>
      [
        submission.fullName,
        submission.emailAddress,
        submission.mobileNumber,
        submission.gender,
        submission.nationality,
        submission.technicalSkills,
        submission.status,
        ...submission.educationalQualifications.map((item) =>
          [
            item.degreeOrExamName,
            item.groupOrSubject,
            item.institutionName,
            item.boardOrUniversity,
            item.passingYear,
            item.gpaOrCgpa,
          ].join(" "),
        ),
      ]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [submissions, searchTerm]);

  const columns = [
    {
      header: "Applicant",
      accessor: "fullName",
      render: (row) => (
        <div>
          <h3 className="font-medium text-ink">{row.fullName}</h3>
          <p className="text-sm text-ink-muted">{row.emailAddress}</p>
          {row.mobileNumber && (
            <p className="text-xs text-ink-subtle">{row.mobileNumber}</p>
          )}
        </div>
      ),
    },
    {
      header: "Gender",
      accessor: "gender",
      render: (row) => (
        <span className="text-ink">{row.gender || "N/A"}</span>
      ),
    },
    {
      header: "Latest Education",
      accessor: "educationalQualifications",
      render: (row) => (
        <span className="text-ink">{latestEducation(row)}</span>
      ),
    },
    {
      header: "Skills",
      accessor: "technicalSkills",
      render: (row) => (
        <p className="max-w-xs truncate text-ink-muted">
          {row.technicalSkills || "N/A"}
        </p>
      ),
    },
    {
      header: "Status",
      accessor: "status",
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: "Submitted",
      accessor: "createdAt",
      render: (row) => (
        <span className="text-ink-muted">{formatDate(row.createdAt)}</span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">CV Submissions</h1>
        <p className="text-ink-muted">Review public CV submissions</p>
      </div>

      <Input
        placeholder="Search CVs..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        icon={Search}
      />

      {isLoading ? (
        <div className="bg-surface rounded-xl p-12 border border-border">
          <Loader text="Loading CV submissions..." />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={filteredSubmissions}
          basePath="/admin/cv-submissions"
          showEdit={false}
          showDelete={false}
          emptyMessage="No CV submissions"
        />
      )}
    </div>
  );
};

export default CvSubmissionListPage;
