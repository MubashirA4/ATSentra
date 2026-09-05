import mongoose from "mongoose";
import ATSAnalysis from "../../models/ATSAnalysis.js";

import {
  validateATSHistoryQuery,
} from "../../utils/ats/validateATSHistoryQuery.js";

export const getATSAnalysisHistory =
  async ({
    jobId,
    query = {},
  }) => {
    const filters =
      validateATSHistoryQuery({
        jobId,
        query,
      });

    const {
      page,
      limit,
      search,
      eligible,
      minScore,
      maxScore,
      minRank,
      maxRank,
      skill,
      sortBy,
      sortOrder,
    } = filters;

    const matchStage = {
      jobId:
        new mongoose.Types.ObjectId(
          jobId,
        ),
    };

    if (
      eligible !== undefined
    ) {
      matchStage.eligible =
        eligible;
    }

    if (
      minScore !== undefined ||
      maxScore !== undefined
    ) {
      matchStage.rankingScore = {};

      if (
        minScore !== undefined
      ) {
        matchStage.rankingScore.$gte =
          minScore;
      }

      if (
        maxScore !== undefined
      ) {
        matchStage.rankingScore.$lte =
          maxScore;
      }
    }

    if (
      minRank !== undefined ||
      maxRank !== undefined
    ) {
      matchStage.rank = {};

      if (
        minRank !== undefined
      ) {
        matchStage.rank.$gte =
          minRank;
      }

      if (
        maxRank !== undefined
      ) {
        matchStage.rank.$lte =
          maxRank;
      }
    }

    const pipeline = [
      {
        $match: matchStage,
      },

      {
        $lookup: {
          from: "candidates",
          localField:
            "candidateId",
          foreignField:
            "_id",
          as: "candidate",
        },
      },

      {
        $unwind: {
          path: "$candidate",
          preserveNullAndEmptyArrays:
            true,
        },
      },
    ];

    if (search) {
      pipeline.push({
        $match: {
          $or: [
            {
              "candidate.name": {
                $regex: search,
                $options: "i",
              },
            },
            {
              "candidate.email": {
                $regex: search,
                $options: "i",
              },
            },
          ],
        },
      });
    }

    if (skill) {
      pipeline.push({
        $match: {
          "candidate.skills": {
            $regex: skill,
            $options: "i",
          },
        },
      });
    }

    const sortDirection =
      sortOrder === "asc"
        ? 1
        : -1;

    pipeline.push({
      $sort: {
        [sortBy]:
          sortDirection,

        _id:
          sortDirection,
      },
    });

    const countPipeline = [
      ...pipeline,
      {
        $count: "total",
      },
    ];

    const dataPipeline = [
      ...pipeline,

      {
        $skip:
          (page - 1) * limit,
      },

      {
        $limit: limit,
      },

      {
        $project: {
          _id: 1,
          jobId: 1,
          candidateId: 1,
          rank: 1,
          rankingScore: 1,
          eligible: 1,
          eligibilityReasons: 1,
          matchResult: 1,
          explanation: 1,
          rankingComparison: 1,
          status: 1,
          createdAt: 1,
          updatedAt: 1,

          candidate: {
            _id: "$candidate._id",
            name: "$candidate.name",
            email: "$candidate.email",
            location:
              "$candidate.location",
            skills:
              "$candidate.skills",
          },
        },
      },
    ];

    const [
      countResult,
      analyses,
    ] = await Promise.all([
      ATSAnalysis.aggregate(
        countPipeline,
      ),

      ATSAnalysis.aggregate(
        dataPipeline,
      ),
    ]);

    const total =
      countResult[0]?.total ?? 0;

    const totalPages =
      Math.ceil(
        total / limit,
      );

    return {
      analyses,

      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage:
          page < totalPages,
        hasPreviousPage:
          page > 1,
      },

      filters: {
        search:
          search || null,

        eligible:
          eligible ?? null,

        minScore:
          minScore ?? null,

        maxScore:
          maxScore ?? null,

        minRank:
          minRank ?? null,

        maxRank:
          maxRank ?? null,

        skill:
          skill || null,

        sortBy,

        sortOrder,
      },
    };
  };