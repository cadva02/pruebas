
import { fs } from "../firebase/index.js";
import { Subscription } from "../interfaces/Subscription.js";

/**
Retrieves a subscription based on the provided installation ID.
@param {number} installation - The ID of the installation for which to fetch the subscription.
@returns {Promise<Subscription | undefined>} A promise that resolves to the subscription object
if found, or undefined if no matching subscription is found.
@throws {Error} If the installation ID is invalid.
*/
export const getSubscription = async (installation: number): Promise<Subscription | undefined> => {
    console.log('installation id', installation)
    if (installation === -1) {
        throw new Error('Invalid Installation ID')
    }

    // TODO: Actually fetch the subscription from a database or an API
    const doc = await fs.collection('installations').doc(installation.toString()).get();
    const sub = doc.data() as Subscription;

    return sub || undefined;
}