import { expect } from "chai";
import { ethers } from "hardhat";
import { Voter } from '../typechain';
import { Candidate, Voter as VoterType } from '../types/voter';

// todo: create a factory for these later
const mockCandidates: Candidate[] = [
  {
    citizenNumber: '123456789',
    firstName: 'John',
    lastName: 'Doe',
    dateOfBirth: '1970'
  },
  {
    citizenNumber: '987654321',
    firstName: 'Jane',
    lastName: 'Doe',
    dateOfBirth: '1970'
  }
];

const mockVoters: VoterType[] = [
  {
    citizenNumber: '10001',
    firstName: 'Voter',
    lastName: 'First',
    dateOfBirth: '2000',
    candidate: 0
  },
  {
    citizenNumber: '10002',
    firstName: 'Voter',
    lastName: 'Second',
    dateOfBirth: '2003',
    candidate: 1
  },
  {
    citizenNumber: '10003',
    firstName: 'Voter',
    lastName: 'Third',
    dateOfBirth: '1993',
    candidate: 0
  }
]

describe('Voter', function () {
  let voter: Voter;

  before(async () => {
    const Voter = await ethers.getContractFactory('Voter');
    voter = await Voter.deploy();
    await voter.deployed();
  })

  it('should add candidates', async function () {
    for (const mockCandidate of mockCandidates) {
      await voter.registerCandidate(
        mockCandidate.citizenNumber,
        mockCandidate.firstName,
        mockCandidate.lastName,
        mockCandidate.dateOfBirth
      );
    }

    const candidates = await Promise.all([
      voter.candidates(0),
      voter.candidates(1)
    ]);

    expect(candidates[0].firstName).to.equal(mockCandidates[0].firstName);
    expect(candidates[0].lastName).to.equal(mockCandidates[0].lastName);
    expect(candidates[0].dateOfBirth).to.equal(mockCandidates[0].dateOfBirth);

    expect(candidates[1].firstName).to.equal(mockCandidates[1].firstName);
    expect(candidates[1].lastName).to.equal(mockCandidates[1].lastName);
    expect(candidates[1].dateOfBirth).to.equal(mockCandidates[1].dateOfBirth);
  });

  it('should change state', async function () {
    let state = await voter.state();
    expect(state).to.equal(0);

    await voter.startVoting();

    state = await voter.state();
    expect(state).to.equal(1);
  });

  it('should vote', async function () {
    for (const mockVoter of mockVoters) {
      await voter.vote(
        mockVoter.citizenNumber,
        mockVoter.firstName,
        mockVoter.lastName,
        mockVoter.dateOfBirth,
        mockVoter.candidate
      );
    }

    const endVotingTx = await voter.endVoting();
    await endVotingTx.wait();
    const victor = await voter.victor();

    expect(victor.firstName).to.equal(mockCandidates[0].firstName);
    expect(victor.lastName).to.equal(mockCandidates[0].lastName);
    expect(victor.dateOfBirth).to.equal(mockCandidates[0].dateOfBirth);
  });
});
