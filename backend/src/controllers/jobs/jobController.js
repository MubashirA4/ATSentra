import {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
} from "../../services/jobs/jobService.js";
import {
  validateCreateJobRequest,
  validateUpdateJobRequest,
} from "../../utils/job/validateJobRequest.js";
import { parseJobDescription } from "../../utils/job/parseJobDescription.js";


export const createJobController = async (req, res) => {
  try {
    validateCreateJobRequest(req.body);

    const job = await createJob({
      ...req.body,
      createdBy: req.user.id,
    });

    return res.status(201).json({
      success: true,
      message: "Job created successfully",
      data: {
        job,
      },
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getJobsController = async (req, res) => {
  try {
    const {
      status,
      company,
      search,
      page,
      limit,
      sortBy,
      sortOrder,
    } = req.query;

    const filters = {
      status,
      company,
      search,
      page,
      limit,
      sortBy,
      sortOrder,
    };

    /*
     * Recruiters only see their own jobs.
     */
    if (req.user.role !== "admin") {
      filters.createdBy = req.user.id;
    }

    const result = await getJobs(filters);

    return res.status(200).json({
      success: true,
      message: "Jobs retrieved successfully",
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getJobByIdController = async (
  req,
  res,
) => {
  try {
    const isAdmin = req.user.role === "admin";

    const job = await getJobById(
      req.params.jobId,
      req.user.id,
      isAdmin,
    );

    if (!job) {
      return res.status(404).json({
        success: false,
        message:
          "Job not found or you do not have permission to view it",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Job fetched successfully",
      data: {
        job,
      },
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateJobController = async (req, res) => {
  try {
    validateUpdateJobRequest(req.body);

    const job = await updateJob(
  req.params.jobId,
  req.user.id,
  req.body, 
  req.user.role === "admin",
);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Job updated successfully",
      data: {
        job,
      },
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteJobController = async (
  req,
  res,
) => {
  try {
    const job = await deleteJob(
      req.params.jobId,
      req.user.id,
      req.user.role === "admin",
    );

    if (!job) {
      return res.status(404).json({
        success: false,
        message:
          "Job not found or you do not have permission to delete it",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Job deleted successfully",
      data: {
        jobId: job._id,
      },
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const parseJobDescriptionController = async (req, res) => {
  try {
    const { description } = req.body;

    const parsedJob = parseJobDescription(description);

    return res.status(200).json({
      success: true,
      message: "Job description parsed successfully",
      data: {
        job: parsedJob,
      },
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
