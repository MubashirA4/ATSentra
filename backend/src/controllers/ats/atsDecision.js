import {
  makeATSDecision,
} from "../../utils/ats/atsDecisionService.js";

import {
  buildATSDecisionApiResponse,
} from "../../utils/ats/atsDecisionApiResponse.js";

export const createATSDecision = async (
  req,
  res,
) => {
  try {
    const result =
      await makeATSDecision(
        req.body,
      );

    const response =
      buildATSDecisionApiResponse({
        result,
      });

    return res.status(200).json({
      success: true,

      message:
        "ATS decision completed successfully",

      data: response,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message:
        error.message,
    });
  }
};