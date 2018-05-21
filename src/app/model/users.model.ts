import { DatakantorModel } from './datakantor.model';

export class Users {
    id: string;
    username: string;
    password: string;
    userDetails: UserDetails;
}
export interface UserDetails {
id: string;
nik: string;
firstname: string;
lastname: string;
email: string;
jabatan: string;
dataKantor: DatakantorModel;
}
