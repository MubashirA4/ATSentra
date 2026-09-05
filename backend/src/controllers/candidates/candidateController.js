import {
  createCandidate,
  getCandidates,
  getCandidateById,
  updateCandidate,
  deleteCandidate,
} from "../../services/candidates/candidateService.js";

import {
  validateCreateCandidateRequest,
  validateUpdateCandidateRequest,
} from "../../utils/candidates/validateCandidateRequest.js";

export const createCandidateController =
  async (req, res) => {
    try {
      validateCreateCandidateRequest(
        req.body,
      );

      const candidate =
        await createCandidate(
          req.body,
          req.user.userId,
        );

      return res.status(201).json({
        success: true,
        message:
          "Candidate created successfully",
        data: {
          candidate,
        },
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message:
          error.message,
      });
    }
  };

export const getCandidatesController =
  async (req, res) => {
    try {
      const candidates =
        await getCandidates({
          status:
            req.query.status,
          email:
            req.query.email,
          createdBy:
            req.user.userId,
        });

      return res.status(200).json({
        success: true,
        message:
          "Candidates retrieved successfully",
        data: {
          candidates,
          count:
            candidates.length,
        },
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message:
          error.message,
      });
    }
  };

export const getCandidateByIdController =
  async (req, res) => {
    try {
      const candidate =
        await getCandidateById(
          req.params.candidateId,
          req.user.userId,
        );

      if (!candidate) {
        return res.status(404).json({
          success: false,
          message:
            "Candidate not found",
        });
      }

      return res.status(200).json({
        success: true,
        message:
          "Candidate retrieved successfully",
        data: {
          candidate,
        },
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message:
          error.message,
      });
    }
  };

export const updateCandidateController =
  async (req, res) => {
    try {
      validateUpdateCandidateRequest(
        req.body,
      );

      const candidate =
        await updateCandidate(
          req.params.candidateId,
          req.body,
          req.user.userId,
        );

      if (!candidate) {
        return res.status(404).json({
          success: false,
          message:
            "Candidate not found",
        });
      }

      return res.status(200).json({
        success: true,
        message:
          "Candidate updated successfully",
        data: {
          candidate,
        },
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message:
          error.message,
      });
    }
  };

export const deleteCandidateController =
  async (req, res) => {
    try {
      const candidate =
        await deleteCandidate(
          req.params.candidateId,
          req.user.userId,
        );

      if (!candidate) {
        return res.status(404).json({
          success: false,
          message:
            "Candidate not found",
        });
      }

      return res.status(200).json({
        success: true,
        message:
          "Candidate deleted successfully",
        data: {
          candidateId:
            candidate._id,
        },
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message:
          error.message,
      });
    }
  };