import { InstallationUnsuspendEvent } from "@octokit/webhooks-types";
import { App } from "octokit";
import { fs } from "../../firebase/index.js";


        
export const installationUnsuspended = async (
    app: App,
    payload: InstallationUnsuspendEvent,
): Promise<void> => {
    console.log('installationUnsuspended')
    const installationId = payload.installation?.id ?? -1;
    if (installationId === -1) {
        console.warn("⚠️ No installation ID found in webhook");
        return;
    }

    const installations_ref = fs.collection('installations')
    const doc = installations_ref.doc(installationId.toString())
    await doc.update({
        status: 'active'
    })
};