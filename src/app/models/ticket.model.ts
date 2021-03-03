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
    resolveDescription: string;
    status: string;
    staff?: string;
    action?: Actions[];
    email?: string;
    assign?: string;
}
export interface Actions {
    data: any,
    status: string,
    staff: string
}