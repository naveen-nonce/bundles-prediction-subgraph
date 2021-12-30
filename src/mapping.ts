import { BigInt } from "@graphprotocol/graph-ts"
import {
  Prediction,
  AdminAccessSet,
  BetPlaced,
  MatchAdded,
  OwnershipTransferred,
  TeamAdded,
  TeamUpdated
} from "../generated/Prediction/Prediction"
import { Match, Team } from "../generated/schema"


export function handleBetPlaced(event: BetPlaced): void {}

export function handleMatchAdded(event: MatchAdded): void {
  let match = Match.load(event.params.matchId.toString());

  if (!match) {
    match = new Match(event.params.matchId.toString());
    match.startingTime = event.params._startingTime;
    
  }
  match.save();
}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {}

export function handleTeamAdded(event: TeamAdded): void {
  let team = Team.load(event.params.teamId.toString());

  if (!team) {
    team = new Team(event.params.teamId.toString());
    team.name = event.params.team;
  }
  team.save();

}

export function handleTeamUpdated(event: TeamUpdated): void {}
