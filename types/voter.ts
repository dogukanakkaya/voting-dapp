export interface Candidate {
    citizenNumber: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
}

export interface Voter {
    citizenNumber: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    candidate: number;
}