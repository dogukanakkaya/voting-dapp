// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Voter is Ownable {
    event CandidateRegistered(uint indexed id, string firstName, string lastName);
    event WinnerCalculated(Candidate candidate);
    event Voted(string firstName, string lastName);

    enum State { OPEN, VOTING, CLOSED }

    struct Candidate {
        string firstName;
        string lastName;
        string dateOfBirth;
        uint256 votes;
    }

    mapping(string => bool) voters;
    Candidate[] public candidates;
    State state = State.OPEN;
    Candidate public victor;

    modifier mustHaveCitizenship(string memory citizenNumber) {
        require(verifyCitizenNumber(citizenNumber) == true, "You don't have a citizenship.");
        _;
    }

    function openVoting() public onlyOwner {
        require(state == State.CLOSED);
        
        state = State.OPEN;
    }

    function startVoting() public onlyOwner {
        require(state == State.OPEN);
        
        state = State.VOTING;
    }

    function endVoting() public onlyOwner {
        require(state == State.VOTING);
        
        state = State.CLOSED;

        calculateWinner();
    }

    function registerCandidate(
        string memory citizenNumber,
        string memory firstName,
        string memory lastName,
        string memory dateOfBirth
    ) public onlyOwner mustHaveCitizenship(citizenNumber) {
        require(state == State.OPEN);
        
        candidates.push(Candidate(firstName, lastName, dateOfBirth, 0));
        uint id = candidates.length - 1;

        emit CandidateRegistered(id, firstName, lastName);
    }

    function vote(
        string memory citizenNumber,
        string memory firstName,
        string memory lastName,
        string memory dateOfBirth,
        uint candidate
    ) public mustHaveCitizenship(citizenNumber) {
        require(state == State.VOTING);
        require(voters[citizenNumber] == false, "You already voted.");

        candidates[candidate].votes++;
        voters[citizenNumber] = true;

        emit Voted(firstName, lastName);
    }

    function calculateWinner() private {
        uint256 maxVotes = 0;
        uint id;
        
        for (uint i; i < candidates.length; i++) {
            if (candidates[i].votes > maxVotes) {
                maxVotes = candidates[i].votes;
                id = i;
            }
        }

        victor = candidates[id];
        emit WinnerCalculated(candidates[id]);
    }

    // todo: verify citizen number by making an api request with chainlink oracle otherwise revert
    function verifyCitizenNumber(string memory citizenNumber) private view returns (bool) {
        return true;
    }
}