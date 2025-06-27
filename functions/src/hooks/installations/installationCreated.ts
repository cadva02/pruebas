import { InstallationCreatedEvent } from "@octokit/webhooks-types";
import { App } from "octokit";

import { fs } from "../../firebase/index.js";
import { Subscription } from "../../interfaces/Subscription.js";

/**
Handles the "installation created" event.
This function is an event handler for when an installation
is created. It logs the event, extracts the installation ID,
and stores account details to a database collection.
@param {App} app - The application instance.
@param {InstallationCreatedEvent} payload - The event payload containing installation details.
@returns {Promise} A promise that resolves when the operation completes.
@throws {Error} If there are issues accessing the database or writing data.
*/
export const installationCreated = async (
    app: App,
    payload: InstallationCreatedEvent,
): Promise<void> => {
    console.log('installationCreated')
    const installationId = payload.installation?.id ?? -1;
    if (installationId === -1) {
        console.warn("⚠️ No installation ID found in webhook");
        return;
    }

    const installations_ref = fs.collection('installations')
    const doc = installations_ref.doc(installationId.toString())
    const sub: Subscription = {
        id_installation: installationId,
        id_account: payload.installation.account.id,
        name: payload.installation.account.login,
        status: 'active',
        type: payload.installation.account.type,
        date_created: new Date()
    }
    await doc.set(sub as any)
};