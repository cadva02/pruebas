import { IssuesClosedEvent } from "@octokit/webhooks-types";
import { App } from "octokit";
import { getSubscription } from "../getSubscription.js";
import { Subscription } from "../../interfaces/Subscription.js";

/**
Posts a comment on a closed issue through GitHub's API when an "issues_closed" event is received.
This function is designed to handle GitHub webhook events for closed issues. It checks for an installation ID
from the payload to authenticate the app installation and ensures the subscription is active before proceeding
to post a comment. If authentication fails or the subscription is inactive, it logs the appropriate message and exits.
@param {App} app - The App instance used to authenticate and make requests to GitHub's API.
@param {IssuesClosedEvent} payload - The event payload containing details about the closed issue, repository, and installation.
@returns {Promise} Resolves once the comment has been successfully posted or the operation is aborted due to an inactive subscription.
Logs:
"commentOnIssue" when the function executes.
Warns if an installation ID is not found.
Logs if skipping due to inactive or missing subscription.
Throws:
Throws any errors from Octokit request execution.
*/
export const commentOnIssueClosed = async (
    app: App,
    payload: IssuesClosedEvent,
): Promise<void> => {
    console.log('commentOnIssueClosed')
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
        body: "Issue closed",
    });
};