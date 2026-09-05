import mongoose from "mongoose";
import Job from "../../models/Job.js";

const JOB_UPDATE_FIELDS = [
  "title",
  "company",
  "location",
  "employmentType",
  "requiredSkills",
  "preferredSkills",
  "experienceRequirement",
  "educationRequirements",
  "responsibilities",
  "description",
  "status",
];

const ALLOWED_SORT_FIELDS = [
  "createdAt",
  "updatedAt",
  "title",
  "company",
  "status",
];

const ALLOWED_STATUSES = [
  "draft",
  "open",
  "closed",
  "archived",
];

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

const validateId = (id, fieldName = "ID") => {
  if (!id) {
    throw new Error(`${fieldName} is required`);
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error(`Invalid ${fieldName}`);
  }
};

const sanitizeJobUpdate = (updateData) => {
  return Object.fromEntries(
    Object.entries(updateData).filter(([key]) =>
      JOB_UPDATE_FIELDS.includes(key),
    ),
  );
};

const escapeRegex = (value) => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

const normalizePagination = (page, limit) => {
  const parsedPage = Number(page);
  const parsedLimit = Number(limit);

  const normalizedPage =
    Number.isInteger(parsedPage) && parsedPage > 0
      ? parsedPage
      : DEFAULT_PAGE;

  const normalizedLimit =
    Number.isInteger(parsedLimit) &&
    parsedLimit > 0 &&
    parsedLimit <= MAX_LIMIT
      ? parsedLimit
      : DEFAULT_LIMIT;

  return {
    page: normalizedPage,
    limit: normalizedLimit,
  };
};

const validateJobQuery = ({
  status,
  sortBy,
  sortOrder,
}) => {
  if (
    status &&
    !ALLOWED_STATUSES.includes(status)
  ) {
    throw new Error(
      `Invalid job status. Allowed values: ${ALLOWED_STATUSES.join(", ")}`,
    );
  }

  if (
    sortBy &&
    !ALLOWED_SORT_FIELDS.includes(sortBy)
  ) {
    throw new Error(
      `Invalid sort field. Allowed values: ${ALLOWED_SORT_FIELDS.join(", ")}`,
    );
  }

  if (
    sortOrder &&
    !["asc", "desc"].includes(sortOrder)
  ) {
    throw new Error(
      "Invalid sort order. Use 'asc' or 'desc'",
    );
  }
};

export const createJob = async (jobData) => {
  if (
    !jobData ||
    typeof jobData !== "object" ||
    Array.isArray(jobData)
  ) {
    throw new Error("Job data is required");
  }

  return Job.create(jobData);
};

export const getJobs = async ({
  status,
  company,
  search,
  page = DEFAULT_PAGE,
  limit = DEFAULT_LIMIT,
  sortBy = "createdAt",
  sortOrder = "desc",
  createdBy,
} = {}) => {
  validateJobQuery({
    status,
    sortBy,
    sortOrder,
  });

  const pagination = normalizePagination(
    page,
    limit,
  );

  const filter = {};

  if (status) {
    filter.status = status;
  }

  if (company) {
    filter.company = {
      $regex: escapeRegex(company),
      $options: "i",
    };
  }

  if (search?.trim()) {
    const searchRegex = {
      $regex: escapeRegex(search.trim()),
      $options: "i",
    };

    filter.$or = [
      { title: searchRegex },
      { company: searchRegex },
      { location: searchRegex },
    ];
  }

  if (createdBy) {
    validateId(createdBy, "Created By ID");
    filter.createdBy = createdBy;
  }

  const skip =
    (pagination.page - 1) *
    pagination.limit;

  const sortDirection =
    sortOrder === "asc" ? 1 : -1;

  const sort = {
    [sortBy]: sortDirection,
  };

  /*
   * Statistics should represent the recruiter's
   * complete job collection, not just the current page.
   */
  const statsFilter = {};

  if (createdBy) {
    statsFilter.createdBy = createdBy;
  }

  const [
    jobs,
    total,
    allCount,
    draftCount,
    openCount,
    closedCount,
    archivedCount,
  ] = await Promise.all([
    Job.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(pagination.limit)
      .lean(),

    Job.countDocuments(filter),

    Job.countDocuments(statsFilter),

    Job.countDocuments({
      ...statsFilter,
      status: "draft",
    }),

    Job.countDocuments({
      ...statsFilter,
      status: "open",
    }),

    Job.countDocuments({
      ...statsFilter,
      status: "closed",
    }),

    Job.countDocuments({
      ...statsFilter,
      status: "archived",
    }),
  ]);

  return {
    jobs,

    pagination: {
      page: pagination.page,
      limit: pagination.limit,
      total,
      totalPages: Math.ceil(
        total / pagination.limit,
      ),
    },

    stats: {
      all: allCount,
      draft: draftCount,
      open: openCount,
      closed: closedCount,
      archived: archivedCount,
    },
  };
};

export const getJobById = async (
  jobId,
  userId,
  isAdmin = false,
) => {
  validateId(jobId, "Job ID");

  if (isAdmin) {
    return Job.findById(jobId).lean();
  }

  validateId(userId, "User ID");

  return Job.findOne({
    _id: jobId,
    createdBy: userId,
  }).lean();
};

export const updateJob = async (
  jobId,
  userId,
  updateData,
  isAdmin = false,
) => {
  validateId(jobId, "Job ID");
  validateId(userId, "User ID");

  if (
    !updateData ||
    typeof updateData !== "object" ||
    Array.isArray(updateData)
  ) {
    throw new Error(
      "Job update data is required",
    );
  }

  const sanitizedUpdate =
    sanitizeJobUpdate(updateData);

  if (
    Object.keys(sanitizedUpdate).length === 0
  ) {
    throw new Error(
      "No valid job fields were provided for update",
    );
  }

  const filter = {
    _id: jobId,
  };

  if (!isAdmin) {
    filter.createdBy = userId;
  }

  return Job.findOneAndUpdate(
    filter,
    sanitizedUpdate,
    {
      returnDocument: "after",
      runValidators: true,
    },
  ).lean();
};

export const deleteJob = async (
  jobId,
  userId,
  isAdmin = false,
) => {
  validateId(jobId, "Job ID");
  validateId(userId, "User ID");

  const filter = {
    _id: jobId,
  };

  if (!isAdmin) {
    filter.createdBy = userId;
  }

  return Job.findOneAndDelete(filter).lean();
};