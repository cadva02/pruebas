import { Timestamp } from "firebase-admin/firestore";

export interface Subscription {
    id_installation: number;
    id_account: number;
    name: string;
    status: string;
    type: string;
    date_created: Date | Timestamp;
}