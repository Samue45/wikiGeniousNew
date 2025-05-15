import { Category } from "./category";

export interface Genius {
    name: string;
    photoURL: string | null;
    summary: string | null;
    category : Category | null;   
}
