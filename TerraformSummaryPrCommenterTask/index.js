"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const _ = __importStar(require("lodash"));
const tl = require("azure-pipelines-task-lib/task");
const dotenv = __importStar(require("dotenv"));
dotenv.config(); // Load environment variables from .env file
// Use environment variables for local testing, and ADO inputs in the pipeline
const TERRAFORM_PLAN_PATH = process.env.TERRAFORM_PLAN_PATH || tl.getInput('TERRAFORM_PLAN_PATH', false) || './terraform-plan.json';
const ADO_STAGE_NAME = _.escapeRegExp(process.env.ADO_STAGE_NAME || tl.getInput('ADO_STAGE_NAME', true) || 'default_stage_name');
const ADO_JOB_LINK = process.env.ADO_JOB_LINK || tl.getInput('ADO_JOB_LINK', true) || '#';
const ADO_STAGE_LINK = process.env.ADO_STAGE_LINK || tl.getInput('ADO_STAGE_LINK', true) || '#';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || tl.getInput('GITHUB_TOKEN', true) || '';
const GITHUB_OWNER = process.env.GITHUB_OWNER || tl.getInput('GITHUB_OWNER', true) || '';
const GITHUB_REPO = process.env.GITHUB_REPO || tl.getInput('GITHUB_REPO', true) || '';
const GITHUB_ISSUE_NUMBER = process.env.GITHUB_ISSUE_NUMBER || tl.getInput('GITHUB_ISSUE_NUMBER', true) || '';
const ENVIRONMENT = process.env.ENVIRONMENT || tl.getInput('ENVIRONMENT', true) || 'DEV';
try {
    // Log the values for debugging
    console.log('TERRAFORM_PLAN_PATH:', TERRAFORM_PLAN_PATH);
    console.log('ADO_STAGE_NAME:', ADO_STAGE_NAME);
    console.log('ADO_JOB_LINK:', ADO_JOB_LINK);
    console.log('ADO_STAGE_LINK:', ADO_STAGE_LINK);
    console.log('GITHUB_TOKEN:', GITHUB_TOKEN); // Be cautious when logging sensitive information
    console.log('GITHUB_OWNER:', GITHUB_OWNER);
    console.log('GITHUB_REPO:', GITHUB_REPO);
    console.log('GITHUB_ISSUE_NUMBER:', GITHUB_ISSUE_NUMBER);
    console.log('ENVIRONMENT:', ENVIRONMENT);
}
catch (err) {
    if (err instanceof Error) {
        tl.setResult(tl.TaskResult.Failed, err.message);
    }
    else {
        tl.setResult(tl.TaskResult.Failed, "An unknown error occurred");
    }
}
// // Title for the comment
// const COMMENT_TITLE = "TF PLAN SUMMARY";
// // GitHub API configuration
// const githubApi = axios.create({
//     baseURL: `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}`,
//     headers: {
//         Authorization: `Bearer ${GITHUB_TOKEN}`,
//         'Content-Type': 'application/json',
//     },
// });
// // Type definition for the Terraform plan structure
// interface TerraformChange {
//     actions: string[];
//     before: any;
//     after: any;
//     after_unknown: any;
// }
// interface TerraformResourceChange {
//     address: string;
//     type: string;
//     name: string;
//     change: TerraformChange;
// }
// interface TerraformPlan {
//     resource_changes?: TerraformResourceChange[];
// }
// // Function to read the Terraform plan JSON file
// export const readTerraformPlan = (): TerraformPlan | null => {
//     try {
//         const rawData = fs.readFileSync(TERRAFORM_PLAN_PATH, 'utf-8');
//         return JSON.parse(rawData) as TerraformPlan;
//     } catch (error) {
//         console.error(`Error reading or parsing the Terraform plan file: ${(error as Error).message}`);
//         return null;
//     }
// };
// // Function to determine the appropriate status icon based on precedence
// const getStatusIcon = (adds: number, updates: number, deletes: number, imports: number): string => {
//     if (deletes > 0) {
//         return '🛑';
//     } else if (updates > 0) {
//         return '⚠️';
//     } else if (adds > 0 || imports > 0) {
//         return '➕';
//     } else {
//         return '✅';
//     }
// };
// // Function to compare status icons based on their precedence
// const getHigherPrecedenceStatus = (currentStatus: string, newStatus: string): string => {
//     const precedence = ['✅', '➕', '⚠️', '🛑']; // Higher index means higher precedence
//     const currentPrecedence = precedence.indexOf(currentStatus);
//     const newPrecedence = precedence.indexOf(newStatus);
//     // If the new status has higher precedence, return it, otherwise return the current status
//     return newPrecedence > currentPrecedence ? newStatus : currentStatus;
// };
// // Function to summarize the actions in the Terraform plan
// export const summarizeTerraformPlan = (plan: TerraformPlan): { adds: number, updates: number, deletes: number, imports: number } => {
//     let adds = 0, updates = 0, deletes = 0, imports = 0;
//     if (!plan.resource_changes || !Array.isArray(plan.resource_changes)) {
//         console.error('No resource changes found in the Terraform plan.');
//         return { adds, updates, deletes, imports };
//     }
//     // Iterate over each resource change
//     plan.resource_changes.forEach(change => {
//         if (!change || !change.change || !Array.isArray(change.change.actions)) {
//             console.error('Malformed resource change entry:', change);
//             return; // Skip this iteration if the structure is invalid
//         }
//         // Safely process valid actions
//         const actions = change.change.actions;
//         if (actions.includes('create')) adds++;
//         if (actions.includes('update')) updates++;
//         if (actions.includes('delete')) deletes++;
//         if (actions.includes('import')) imports++;
//     });
//     return { adds, updates, deletes, imports };
// };
// // Generate the summary for the environment as bullet points
// export const generateJobSummary = (adds: number, updates: number, deletes: number, imports: number, environment: string): { statusIcon: string, summary: string } => {
//     const statusIcon = getStatusIcon(adds, updates, deletes, imports);
//     const jobLink = `${ADO_JOB_LINK}}`;
//     const summary = `  * ${statusIcon} [${environment}](${jobLink}): ${adds} to add, ${updates} to change, ${deletes} to destroy, ${imports} to import. <!-- SUMMARY - ${ADO_STAGE_NAME}-${environment} -->`;
//     return { statusIcon, summary };
// };
// // New function to calculate the overall stage status
// export const calculateOverallStageStatus = (jobSummaries: { statusIcon: string; summary: string }[]): string => {
//     let overallStatus = '✅'; // Default to the lowest precedence
//     // Iterate over each job summary to find the highest precedence status
//     jobSummaries.forEach(job => {
//         overallStatus = getHigherPrecedenceStatus(overallStatus, job.statusIcon);
//     });
//     return overallStatus;
// };
// // Generate the entire section for the stage, including the headline and job summaries
// export const generateStageSection = (stageName: string, stageLink: string, jobSummaries: { statusIcon: string; summary: string }[]): string => {
//     // Calculate the overall status of the stage based on job summaries
//     const overallStatus = calculateOverallStageStatus(jobSummaries);
//     // Generate the headline for the stage with the overall status, using ADO_STAGE_LINK for the stage link
//     const headline = `* ${overallStatus} [${stageName}](${stageLink}) <!-- HEADLINE - ${stageName} -->`;
//     // Combine the headline and job summaries into the stage section
//     return `
// <!-- START - ${stageName} -->
// ${headline}
// ${jobSummaries.map(job => job.summary).join('\n')}
// <!-- END - ${stageName} -->
//     `.trim();
// };
// // Fetch comments from the GitHub issue
// const getIssueComments = async () => {
//     try {
//         const response = await githubApi.get(`/issues/${GITHUB_ISSUE_NUMBER}/comments`);
//         return response.data;
//     } catch (error) {
//         console.error(`Error fetching issue comments: ${(error as Error).message}`);
//         throw error;
//     }
// };
// // Insert or update the stage section in the comment
// const updateOrInsertSection = (existingCommentBody: string, newJobSummary: { statusIcon: string, summary: string }, stageName: string, environment: string): string => {
//     const startMarker = `<!-- START - ${stageName} -->`;
//     const endMarker = `<!-- END - ${stageName} -->`;
//     const startIndex = existingCommentBody.indexOf(startMarker);
//     const endIndex = existingCommentBody.indexOf(endMarker);
//     let jobSummaries: { statusIcon: string, summary: string }[] = [];
//     if (startIndex !== -1 && endIndex !== -1) {
//         // Existing section: Extract current job summaries
//         const existingSummaries = existingCommentBody.substring(startIndex + startMarker.length, endIndex).trim();
//         const lines = existingSummaries.split('\n').filter(line => line.includes('<!-- SUMMARY -'));
//         // Extract the status icon from the summary line using the first element (icon)
//         jobSummaries = lines.map(line => {
//             const parts = line.trim().split(' '); // Split the line by spaces
//             const statusIcon = parts[1]; // The status icon is the second element after '*'
//             return { statusIcon, summary: line };
//         });
//         // Replace or append the new job summary
//         jobSummaries = jobSummaries.filter(job => !job.summary.includes(`<!-- SUMMARY - ${ADO_STAGE_NAME}-${environment} -->`));
//         jobSummaries.push(newJobSummary); // Add the updated or new job summary
//     } else {
//         // If the section doesn't exist, create a new one with just the new job summary
//         jobSummaries.push(newJobSummary);
//     }
//     // Recalculate the overall status for the stage
//     const newSection = generateStageSection(stageName, ADO_STAGE_LINK, jobSummaries); // Use ADO_STAGE_LINK here
//     // If the section existed, replace it, otherwise append the new section
//     if (startIndex !== -1 && endIndex !== -1) {
//         return existingCommentBody.substring(0, startIndex) + newSection + existingCommentBody.substring(endIndex + endMarker.length);
//     } else {
//         return existingCommentBody + '\n' + newSection;
//     }
// };
// // Create or update a comment on the GitHub issue
// const postOrUpdateComment = async (commentId: number | null, body: string) => {
//     try {
//         if (commentId) {
//             await githubApi.patch(`/issues/comments/${commentId}`, { body });
//             console.log('Comment successfully updated.');
//         } else {
//             await githubApi.post(`/issues/${GITHUB_ISSUE_NUMBER}/comments`, { body });
//             console.log('Comment successfully created.');
//         }
//     } catch (error) {
//         console.error(`Error posting or updating the comment: ${(error as Error).message}`);
//         throw error;
//     }
// };
// // Main function to handle the process
// export const run = async () => {
//     const terraformPlan = readTerraformPlan();
//     if (!terraformPlan) {
//         console.error('Failed to read Terraform plan. Exiting.');
//         return;
//     }
//     if (!ENVIRONMENT) {
//         console.error('No environment specified in the ENVIRONMENT variable. Exiting.');
//         return;
//     }
//     const { adds, updates, deletes, imports } = summarizeTerraformPlan(terraformPlan);
//     const newJobSummary = generateJobSummary(adds, updates, deletes, imports, ENVIRONMENT);
//     try {
//         const comments = await getIssueComments();
//         let commentId: number | null = null;
//         let existingCommentBody = '';
//         const existingComment = comments.find((comment: any) =>
//             comment.body.startsWith(`## ${COMMENT_TITLE}`)
//         );
//         if (existingComment) {
//             commentId = existingComment.id;
//             existingCommentBody = existingComment.body;
//         } else {
//             existingCommentBody = `## ${COMMENT_TITLE}`;
//         }
//         const updatedCommentBody = updateOrInsertSection(existingCommentBody, newJobSummary, ADO_STAGE_NAME, ENVIRONMENT);
//         await postOrUpdateComment(commentId, updatedCommentBody);
//     } catch (error) {
//         console.error(`Error processing the comment: ${(error as Error).message}`);
//     }
// };
// run();
