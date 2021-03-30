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
    status: string;
    staff?: string;
    action?: Actions[];
    email?: string;
    assign?: string;
    actionSentence?: string;
    participant?: any;
    responseDescription: string;
    responseDescriptionFile?: any;
    maDescription: string;
    maDescriptionFile?: any;
    suggestDescription: string;
    suggestDescriptionFile?: any;
    resolveDescription?: string;
    resolveDescriptionFile?: any;
    task?: Tasks[]
}
export interface Actions {
    data: any,
    status: string,
    staff: string
}

export interface Tasks {
    id: any
    subjectTask: string
    developer: any,
    point: number,
    dueDate: any
}