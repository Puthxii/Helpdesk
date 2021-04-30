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
    sumPoint: string;
}
export interface Actions {
    actionSentence: string
    dev?: any
    staff?: string
    status: string
    date?: any
}

export interface Tasks {
    id?: any
    subjectTask: string
    developer: any
    point: number
    dueDate: any
}
