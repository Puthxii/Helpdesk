import { Site, MaLevel } from './../site/site.model';
export interface Ticket {
    date: string;
    source: string;
    site: Site;
    maLevel: MaLevel;
    module: string;
    creater: string;
    type: string;
    subject: string;
    priority: string;
    description: string;
    resolveDescription: string;
    status: string;
    staff?: string;
}