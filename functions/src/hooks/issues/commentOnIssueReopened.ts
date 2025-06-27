import { IssuesReopenedEvent } from "@octokit/webhooks-types";
import { App } from "octokit";
import { getSubscription } from "../getSubscription.js";
import { Subscription } from "../../interfaces/Subscription.js";

/**
Comments on a reopened issue within a GitHub repository if the installation has an active subscription.
@param {App} app - The Probot application instance to authenticate as an installation.
@param {IssuesReopenedEvent} payload - The webhook payload data associated with the 'issues reopened' event.
@returns {Promise} - A promise that resolves when the comment is posted or subs is inactive/missing.
Logs a warning if no installation ID is found. Skips commenting if the subscription is inactive or missing.
Authenticates using the installation's Octokit and posts a "Issue reopened" comment on the particular issue.
*/
export const commentOnIssueReopened = async (
    app: App,
    payload: IssuesReopenedEvent,
): Promise<void> => {
    console.log('commentOnIssueReopened')
    const installationId = payload.installation?.id ?? -1;
    if (installationId === -1) {
        console.warn("⚠️ No installation ID found in webhook");
        return;
    }

    const sub: Subscription | undefined = await getSubscription(installationId);

    if (!sub || sub.status !== "active") {
        console.log(`🛑 Skipping due to inactive or missing subscription for ${installationId}`);
        return;
    }

    // Authenticate as the installation
    const octokit = await app.getInstallationOctokit(installationId);

    // Post a comment on the issue
    await octokit.request("POST /repos/{owner}/{repo}/issues/{issue_number}/comments", {
        owner: payload.repository.owner.login,
        repo: payload.repository.name,
        issue_number: payload.issue.number,
        body: "Issue reopened",
    });
};