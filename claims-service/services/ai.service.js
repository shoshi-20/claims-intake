import OpenAI from 'openai';
import {riskLevels, suggestedActions} from '../enums.js';

const MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';

let client;

const success = (data) => ({ok: true, data});
const failure = (code, message) => ({ok: false, error: {code, message}});

const getClient = () => {
  if (client) return success(client);

  if (!process.env.OPENAI_API_KEY) {
    return failure('AI_CONFIG', 'AI service is not configured. Missing OPENAI_API_KEY.');
  }

  try {
    client = new OpenAI({apiKey: process.env.OPENAI_API_KEY});
    return success(client);
  } catch {
    return failure('AI_CLIENT_INIT', 'AI client initialization failed.');
  }
};

const clampScore = (value) => {
  const numeric = Number(value);
  if (Number.isNaN(numeric)) return 0;
  return Math.max(0, Math.min(100, Math.round(numeric)));
};

const completeJson = async (systemPrompt, userPrompt) => {
  const clientResult = getClient();
  if (!clientResult.ok) return clientResult;

  try {
    const completion = await clientResult.data.chat.completions.create({
      model: MODEL,
      temperature: 0.2,
      response_format: {type: 'json_object'},
      messages: [
        {role: 'system', content: systemPrompt},
        {role: 'user', content: userPrompt},
      ],
    });

    const content = completion.choices?.[0]?.message?.content;
    if (!content) {
      return failure('AI_EMPTY_RESPONSE', 'AI returned an empty response.');
    }

    try {
      return success(JSON.parse(content));
    } catch {
      return failure('AI_PARSE_ERROR', 'AI returned invalid JSON.');
    }
  } catch {
    return failure('AI_REQUEST_FAILED', 'AI request failed. Please try again.');
  }
};

const assessClaim = async ({claimType, incidentDate, description}) => {
  const systemPrompt = `
  You are a senior insurance claims triage analyst.
  Context: The following data is what the user has provided.
  - User identity: already authenticated and verified
  - Claim type: ${claimType}
  - Incident date: ${incidentDate}
  - Contact info: already on file in user account
  
  Your task: Assess ONLY claim substance (fraud risk, completeness, likelihood of coverage).
  Do NOT recommend asking for: user ID, phone number, email, or any personal contact info.
  Do NOT recommend asking for: claim type, incident date (if already provided).
  Focus on: incident details, damage assessment, and claim validity.
  Answer in the user's language and keep it concise.

  Return valid JSON only.
  Use this exact shape:
  {
    "riskLevel": ${Object.values(riskLevels)
      .map((level) => `"${level}"`)
      .join(' | ')},
    "riskFactors": string[],
    "completenessScore": number,
    "suggestedAction": ${Object.values(suggestedActions)
      .map((action) => `"${action}"`)
      .join(' | ')},
    "summary": string
  }
  Keep riskFactors concise (max 5 items).
  completenessScore must be 0 to 100.
  summary must be 1-2 short sentences.
`;
  const userPrompt = JSON.stringify({claimType, incidentDate, description});
  const responseResult = await completeJson(systemPrompt, userPrompt);
  if (!responseResult.ok) return responseResult;

  const response = responseResult.data;

  const allowedRiskLevels = Object.values(riskLevels);
  const allowedActions = Object.values(suggestedActions);

  return success({
    riskLevel: allowedRiskLevels.includes(response.riskLevel) ? response.riskLevel : 'Medium',
    riskFactors: Array.isArray(response.riskFactors) ? response.riskFactors.slice(0, 5).map((item) => String(item)) : [],
    completenessScore: clampScore(response.completenessScore),
    suggestedAction: allowedActions.includes(response.suggestedAction) ? response.suggestedAction : 'Standard Review',
    summary:
      typeof response.summary === 'string' && response.summary.trim()
        ? response.summary.trim()
        : 'AI assessment is available but summary was not generated.',
    analyzedAt: new Date(),
  });
};

const checkDescriptionCompleteness = async (description, claimType, incidentDate) => {
  const systemPrompt = `
  You are an insurance claims intake quality checker.
  Context: The following data is already collected:
  - User identity: already authenticated
  - Claim type: ${claimType}
  - Incident date: ${incidentDate}
  - Contact info: already on file in user account
  
  Your task: Check if the description contains enough INCIDENT-SPECIFIC details.
  Do NOT recommend asking for: user ID, phone, email, name, policy number, or personal contact info.
  Do NOT recommend asking for: claim type and incident date (if already provided).
  Focus on: location, what happened, damage extent, witnesses, emergency services, estimated loss.
  Answer in the user's language and keep it concise.

  Return valid JSON only.
  Use this exact shape:
  {
    "completeness": number,
    "missing": string[],
    "suggestions": string[],
    "isReadyToSubmit": boolean
  }
  completeness must be 0 to 100.
  missing should list specific missing details users can add.
  suggestions should be short and practical (max 4 items).
  isReadyToSubmit should be true if the description is sufficient for submission, false if more details are needed.
`;

  const userPrompt = JSON.stringify({description, claimType, incidentDate});
  const responseResult = await completeJson(systemPrompt, userPrompt);
  if (!responseResult.ok) return responseResult;

  const response = responseResult.data;

  const completeness = clampScore(response.completeness);

  return success({
    completeness,
    missing: Array.isArray(response.missing) ? response.missing.slice(0, 6).map((item) => String(item)) : [],
    suggestions: Array.isArray(response.suggestions) ? response.suggestions.slice(0, 4).map((item) => String(item)) : [],
    isReadyToSubmit: typeof response.isReadyToSubmit === 'boolean' ? response.isReadyToSubmit : completeness >= 70,
  });
};

export {assessClaim, checkDescriptionCompleteness};
