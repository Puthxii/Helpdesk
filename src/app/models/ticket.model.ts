import { Site, MaLevel } from './site.model';
import {IMyDateModel} from "angular-mydatepicker";
export interface Ticket {
    id: any;
    date: IMyDateModel;
    source: string;
    site: Site;
    maLevel: MaLevel;
    module: any;
    creator: string;
    creatorName: string;
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
    sumPoint: number;
    maxDueDate: any;
    minDueDate: any;
    countIncrement?: number;
    moreInfo?: boolean;
    keyword?: any
    participantId? : any
    userId? : any
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
    dueDate: IMyDateModel
    checked: boolean
}
