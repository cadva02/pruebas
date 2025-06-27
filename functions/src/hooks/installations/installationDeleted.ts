import { InstallationDeletedEvent } from "@octokit/webhooks-types";
import { App } from "octokit";
import { fs } from "../../firebase/index.js";



export const installationDeleted = async (
    app: App,
    payload: InstallationDeletedEvent,
): Promise<void> => {
    console.log('installationDeleted')
    const installationId = payload.installation?.id ?? -1;
    if (installationId === -1) {
        console.warn("⚠️ No installation ID found in webhook");
        return;
    }

    const installations_ref = fs.collection('installations')
    const doc = installations_ref.doc(installationId.toString())
    await doc.delete()
};