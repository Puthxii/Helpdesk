export interface Ticket {
    id: string;
    subject: string;
    description: string;
    attach: Attach[];
    date: string;
    status: string;
    priority: string;
    source: string;
    tpye: string;
    user: string;
    task: Task[];
    action: Action[];

}

export interface Task {
    id: string;
    staff: string;
    point: number;
}

export interface Action {
    id: string;
    staff: string;
    AcitonId: string;
}

export interface Attach {
    id: string;
    link: string;
}

export interface User {
    id: string;
    name: string;
    lastname: string;
    email: string;
    phoneNumber: string;
    site: Site[];
    flag: boolean;
    password: string;


}

export interface Site {
    id: string;
    nameTH: string;
    nameEN: string;
    initaiName: string;
    phoneNumber: string;
    address: Address;
    product: Product;
    maintenancePackage: MaintenancePackage;
    startDate: string;
    endDate: string;
    server: Server;
    vpn: VPN;
    databaseName: DatabaseName;
    databaseIP: DatabaseIP;
    disable: boolean;

}

export interface Staff {
    id: string;
    name: string;
    lastname: string;
    nickname: string;
    phoneNumber: string;
    email: string;
    lineId: string;
    photoURL: string;
    disable: boolean;
    password: string;

}

export interface Address {
    strest: string;
    subDistrict: string;
    district: string;
    province: string;
    zipcode: string;
}

export interface Product {

}

export interface MaintenancePackage {

}

export interface Server {

}

export interface VPN {

}

export interface DatabaseName {

}

export interface DatabaseIP {

}