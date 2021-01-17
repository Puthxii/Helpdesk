import { Site, MaLevel } from './../site/site.model';
export interface Ticket {
    id: any;
    date: string;
    source: string;
    site: Site;
    maLevel: MaLevel;
    module: any;
    creater: string;
    type: string;
    subject: string;
    priority: string;
    description: string;
    resolveDescription: string;
    status: string;
    staff?: string;
    action?: Actions[];
}
export interface Actions {
    data: any,
    status: string,
    staff: string
}