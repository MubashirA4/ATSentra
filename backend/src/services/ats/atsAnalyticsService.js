import mongoose from "mongoose";

import ATSAnalysis from "../../models/ATSAnalysis.js";

import {
  validateATSAnalyticsQuery,
} from "../../utils/ats/validateATSAnalyticsQuery.js";

export const getATSJobAnalytics =
  async ({
    jobId,
    query = {},
  }) => {
    const filters =
      validateATSAnalyticsQuery({
        jobId,
        query,
      });

    const {
      search,
      skill,
      eligible,
      minScore,
      maxScore,
      minRank,
      maxRank,
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

    /*
     * We use $facet so MongoDB processes the
     * filtered dataset once and produces all
     * dashboard metrics from that dataset.
     */
    pipeline.push({
      $facet: {
        overview: [
          {
            $group: {
              _id: null,

              totalCandidates: {
                $sum: 1,
              },

              eligibleCandidates: {
                $sum: {
                  $cond: [
                    "$eligible",
                    1,
                    0,
                  ],
                },
              },

              averageScore: {
                $avg:
                  "$matchResult.score",
              },

              averageRankingScore: {
                $avg:
                  "$rankingScore",
              },

              highestScore: {
                $max:
                  "$matchResult.score",
              },

              lowestScore: {
                $min:
                  "$matchResult.score",
              },

              highestRankingScore: {
                $max:
                  "$rankingScore",
              },

              lowestRankingScore: {
                $min:
                  "$rankingScore",
              },
            },
          },
        ],

        rankingDistribution: [
          {
            $group: {
              _id: "$rank",

              count: {
                $sum: 1,
              },
            },
          },

          {
            $sort: {
              _id:
                sortOrder === "asc"
                  ? 1
                  : -1,
            },
          },
        ],

        scoreDistribution: [
          {
            $bucket: {
              groupBy:
                "$rankingScore",

              boundaries: [
                0,
                20,
                40,
                60,
                70,
                80,
                90,
                100,
                101,
              ],

              default:
                "unknown",

              output: {
                count: {
                  $sum: 1,
                },
              },
            },
          },
        ],

        topCandidates: [
          {
            $sort: {
              rankingScore: -1,
              rank: 1,
              _id: 1,
            },
          },

          {
            $limit: 10,
          },

          {
            $project: {
              _id: 1,

              candidateId: 1,

              rank: 1,

              rankingScore: 1,

              eligible: 1,

              eligibilityReasons: 1,

              matchScore:
                "$matchResult.score",

              candidate: {
                _id:
                  "$candidate._id",

                name:
                  "$candidate.name",

                email:
                  "$candidate.email",

                location:
                  "$candidate.location",

                skills:
                  "$candidate.skills",
              },
            },
          },
        ],

        skillGaps: [
          {
            $project: {
              missingRequiredSkills:
                "$matchResult.skills.missingRequiredSkills",

              missingPreferredSkills:
                "$matchResult.skills.missingPreferredSkills",
            },
          },

          {
            $project: {
              skills: {
                $concatArrays: [
                  {
                    $ifNull: [
                      "$missingRequiredSkills",
                      [],
                    ],
                  },

                  {
                    $ifNull: [
                      "$missingPreferredSkills",
                      [],
                    ],
                  },
                ],
              },
            },
          },

          {
            $unwind:
              "$skills",
          },

          {
            $group: {
              _id:
                "$skills",

              count: {
                $sum: 1,
              },
            },
          },

          {
            $sort: {
              count: -1,
              _id: 1,
            },
          },

          {
            $limit: 20,
          },
        ],

        requiredSkillGaps: [
          {
            $project: {
              skills: {
                $ifNull: [
                  "$matchResult.skills.missingRequiredSkills",
                  [],
                ],
              },
            },
          },

          {
            $unwind:
              "$skills",
          },

          {
            $group: {
              _id:
                "$skills",

              count: {
                $sum: 1,
              },
            },
          },

          {
            $sort: {
              count: -1,
              _id: 1,
            },
          },

          {
            $limit: 20,
          },
        ],

        experienceStats: [
          {
            $group: {
              _id: null,

              averageCandidateYears: {
                $avg:
                  "$matchResult.experience.candidateYears",
              },

              averageRequiredYears: {
                $avg:
                  "$matchResult.experience.requiredYears",
              },

              experienceMatched: {
                $sum: {
                  $cond: [
                    "$matchResult.experience.matched",
                    1,
                    0,
                  ],
                },
              },

              experienceNotMatched: {
                $sum: {
                  $cond: [
                    "$matchResult.experience.matched",
                    0,
                    1,
                  ],
                },
              },
            },
          },
        ],

        educationStats: [
          {
            $group: {
              _id: null,

              educationMatched: {
                $sum: {
                  $cond: [
                    "$matchResult.education.matched",
                    1,
                    0,
                  ],
                },
              },

              educationNotMatched: {
                $sum: {
                  $cond: [
                    "$matchResult.education.matched",
                    0,
                    1,
                  ],
                },
              },

              averageEducationScore: {
                $avg:
                  "$matchResult.education.score",
              },
            },
          },
        ],
      },
    });

    const [
      result,
    ] =
      await ATSAnalysis.aggregate(
        pipeline,
      );

    const overview =
      result?.overview?.[0] ?? {
        totalCandidates: 0,
        eligibleCandidates: 0,
        averageScore: 0,
        averageRankingScore: 0,
        highestScore: 0,
        lowestScore: 0,
        highestRankingScore: 0,
        lowestRankingScore: 0,
      };

    const totalCandidates =
      overview.totalCandidates ?? 0;

    const eligibleCandidates =
      overview.eligibleCandidates ?? 0;

    const ineligibleCandidates =
      totalCandidates -
      eligibleCandidates;

    const eligibilityRate =
      totalCandidates > 0
        ? (
            (eligibleCandidates /
              totalCandidates) *
            100
          )
        : 0;

    const normalizeNumber = (
      value,
    ) => {
      if (
        value === null ||
        value === undefined ||
        !Number.isFinite(
          Number(value),
        )
      ) {
        return 0;
      }

      return Number(
        Number(value).toFixed(2),
      );
    };

    return {
      overview: {
        totalCandidates,

        eligibleCandidates,

        ineligibleCandidates,

        eligibilityRate:
          normalizeNumber(
            eligibilityRate,
          ),

        averageScore:
          normalizeNumber(
            overview.averageScore,
          ),

        averageRankingScore:
          normalizeNumber(
            overview.averageRankingScore,
          ),

        highestScore:
          normalizeNumber(
            overview.highestScore,
          ),

        lowestScore:
          normalizeNumber(
            overview.lowestScore,
          ),

        highestRankingScore:
          normalizeNumber(
            overview.highestRankingScore,
          ),

        lowestRankingScore:
          normalizeNumber(
            overview.lowestRankingScore,
          ),
      },

      topCandidates:
        (
          result?.topCandidates ??
          []
        ).map(
          (candidate) => ({
            analysisId:
              candidate._id,

            candidateId:
              candidate.candidateId,

            rank:
              candidate.rank,

            rankingScore:
              candidate.rankingScore,

            matchScore:
              candidate.matchScore,

            eligible:
              candidate.eligible,

            eligibilityReasons:
              candidate.eligibilityReasons ??
              [],

            candidate:
              candidate.candidate ??
              null,
          }),
        ),

      skillGaps:
        (
          result?.skillGaps ??
          []
        ).map(
          (item) => ({
            skill:
              item._id,

            count:
              item.count,
          }),
        ),

      requiredSkillGaps:
        (
          result?.requiredSkillGaps ??
          []
        ).map(
          (item) => ({
            skill:
              item._id,

            count:
              item.count,
          }),
        ),

      experience: {
        averageCandidateYears:
          normalizeNumber(
            result
              ?.experienceStats?.[0]
              ?.averageCandidateYears,
          ),

        averageRequiredYears:
          normalizeNumber(
            result
              ?.experienceStats?.[0]
              ?.averageRequiredYears,
          ),

        experienceMatched:
          result
            ?.experienceStats?.[0]
            ?.experienceMatched ??
          0,

        experienceNotMatched:
          result
            ?.experienceStats?.[0]
            ?.experienceNotMatched ??
          0,
      },

      education: {
        educationMatched:
          result
            ?.educationStats?.[0]
            ?.educationMatched ??
          0,

        educationNotMatched:
          result
            ?.educationStats?.[0]
            ?.educationNotMatched ??
          0,

        averageEducationScore:
          normalizeNumber(
            result
              ?.educationStats?.[0]
              ?.averageEducationScore,
          ),
      },

      distributions: {
        score:
          result?.scoreDistribution ??
          [],

        ranking:
          result?.rankingDistribution ??
          [],
      },

      filters,
    };
  };