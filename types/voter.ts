export interface Citizen {
    citizenNumber: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
}

export interface Candidate extends Citizen {

}

export interface Voter extends Citizen {
    candidate: number;
}