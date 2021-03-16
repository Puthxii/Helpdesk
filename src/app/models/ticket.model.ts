import { Site, MaLevel } from './site.model';
export interface Ticket {
    id: any;
    date: string;
    source: string;
    site: Site;
    maLevel: MaLevel;
    module: any;
    creator: string;
    type: string;
    subject: string;
    priority: string;
    description: string;
    descriptionFile?: any;
    resolveDescription?: string;
    resolveDescriptionFile?: any;
    status: string;
    staff?: string;
    action?: Actions[];
    email?: string;
    assign?: string;
    actionSentence?: string;
    participant?: any;
    maDescription: string;
    maDescriptionFile?: any;
    suggestDescription: string;
    suggestDescriptionFile?: any;
    responDescription: string;
    responDescriptionFile?: any;
}
export interface Actions {
    data: any,
    status: string,
    staff: string
}