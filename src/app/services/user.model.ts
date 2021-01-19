export interface Roles {
    customer?: boolean;
    supporter?: boolean;
    maintenance?: boolean;
    supervisor?: boolean;
}

export interface User {
    uid: string;
    email: string;
    name?: string;
    firsName?: string;
    lastName?: string;
    mobileNumber?: string;
    roles: Roles;
    photoURL: string;
}