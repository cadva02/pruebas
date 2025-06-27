import { IssuesOpenedEvent } from "@octokit/webhooks-types";
import { App } from "octokit";
import { getSubscription } from "../getSubscription.js";
import { Subscription } from "../../interfaces/Subscription.js";

/**
Posts a comment on a newly opened GitHub issue for a specific repository.
@param {App} app - The Probot application instance used to authenticate and interact with GitHub API.
@param {IssuesOpenedEvent} payload - The GitHub event payload containing details about the opened issue.
@returns {Promise} A promise that resolves when the comment is successfully posted on the issue.
This function retrieves the installation ID from the event payload to authenticate as the installation,
using Octokit to post a predefined comment on the newly opened issue. If the installation ID is not
found, the function logs an error and exits. */
export const commentOnIssueOpened = async (
    app: App,
    payload: IssuesOpenedEvent,
): Promise<void> => {
    console.log('commentOnIssueOpened')
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
        body: "👋 Hello from Octokit!",
    });
};