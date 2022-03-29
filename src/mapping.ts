import { BigInt, Address } from "@graphprotocol/graph-ts";
import {
  AdminAccessSet,
  MatchAdded,
  MatchUpdated,
  OwnershipTransferred,
  LeagueAdded,
  PoolAdded,
  PoolUpdated,
  PoolPredicted,
  PredictionUpdated,
  RewardedPools,
  GradedPools,
  AddMatchCall,
} from "../generated/Prediction/Prediction";
import { Prediction, Match, League, Pool, User, Admin } from "../generated/schema";

export function handleAdminAccessSet(event: AdminAccessSet): void {
  let admin = Admin.load(event.params._admin.toString());

  if (!admin) {
    admin = new Admin(event.params._admin.toString());
    admin.address = event.params._admin;
  }

  admin.enabled = event.params._enabled;

  admin.save();
}

export function handleRewardedPools(event: RewardedPools): void {
  let pool = Pool.load(event.params.poolId.toString()) as Pool;
  let rewardRecipients = pool.rewardRecipients;
  let rewardAmounts = pool.rewardAmounts;
  for (var i = 0; i < event.params.winners.length; i++) {
    rewardRecipients.push(event.params.winners[i]);
    rewardAmounts.push(event.params.amount[i]);
    let user = User.load(event.params.winners[i].toString()) as User;
    let userPoolsRewarded = user.poolsRewarded;
    userPoolsRewarded.push(event.params.poolId);
    user.poolsRewarded = userPoolsRewarded;
    let userRewardAmounts = user.rewardAmounts;
    userRewardAmounts.push(event.params.amount[i]);
    user.rewardAmounts = userRewardAmounts;
    user.save();
  }
  pool.rewardRecipients = rewardRecipients;
  pool.rewardAmounts = rewardAmounts;
  pool.save();
}

export function handlePoolPredicted(event: PoolPredicted): void {
  let user = User.load(event.params.predictor.toString());
  let prediction = Prediction.load(event.params.predictionId.toString());
  let pool = Pool.load(event.params.poolId.toString()) as Pool;
  let predictions = pool.predictions;
  predictions.push(event.params.predictionId.toString());
  pool.predictions = predictions;
  let participants = pool.participants;
  participants.push(event.params.predictor);
  pool.participants = participants;
  pool.totalAmount = pool.totalAmount.plus(pool.fee);
  pool.totalParticipants = pool.totalParticipants.plus(BigInt.fromU64(1));

  if (!user) {
    user = new User(event.params.predictor.toString());
    user.address = event.params.predictor;
  }

  let userPools = user.pools;

  if (!userPools.includes(event.params.poolId)) {
    userPools.push(event.params.poolId);
  }

  user.pools = userPools;

  user.address = event.params.predictor;

  let userPredicitons = user.predictions;

  userPredicitons.push(event.params.predictionId.toString());

  user.predictions = userPredicitons;

  if (!prediction) {
    prediction = new Prediction(event.params.predictionId.toString());
    prediction.predictor = event.params.predictor;
    prediction.pool = event.params.poolId;
    prediction.matchIds = event.params.matchIds;
    prediction.choices = event.params.choices;
  }

  prediction.save();
  pool.save();
  user.save();
}

export function handlePredictionUpdated(event: PredictionUpdated): void {
  let prediction = Prediction.load(
    event.params.predictionId.toString()
  ) as Prediction;

  prediction.predictor = event.params.predictor;
  prediction.pool = event.params.poolId;
  prediction.matchIds = event.params.matchIds;
  prediction.choices = event.params.choices;

  prediction.save();
}

export function handleMatchAdded(event: MatchAdded): void {
  {
  }
  let match = Match.load(event.params.matchId.toString());

  if (!match) {
    match = new Match(event.params.matchId.toString());
    match.league = event.params.leagueId.toString();
    match.espnMatchId = event.params.espnMatchId;
  }
  match.save();
}

export function handleMatchUpdated(event: MatchUpdated): void {
  {
  }
  let match = Match.load(event.params.matchId.toString());

  match = new Match(event.params.matchId.toString());
  match.league = event.params.leagueId.toString();
  match.espnMatchId = event.params.espnMatchId;
  match.save();
}

export function handleAddMatch(call: AddMatchCall): void {
  let match = call.outputValues[0];
}

export function handlePoolAdded(event: PoolAdded): void {
  let pool = Pool.load(event.params.poolId.toString());
  let matches = [] as string[];

  if (!pool) {
    pool = new Pool(event.params.poolId.toString());
    for (var i = 0; i < event.params.matchIds.length; i++) {
      matches.push(event.params.matchIds[i].toString());
    }
    pool.matches = matches;
    pool.startTime = event.params.startTime;
    pool.endTime = event.params.startTime;
    pool.endTime = event.params.endTime;
    pool.fee = event.params.fee;
  }

  pool.save();
}

export function handlePoolUpdated(event: PoolUpdated): void {
  let pool = Pool.load(event.params.poolId.toString()) as Pool;
  let matches = [] as string[];

  for (var i = 0; i < event.params.matchIds.length; i++) {
    matches.push(event.params.matchIds[i].toString());
  }
  pool.matches = matches;
  pool.startTime = event.params.startTime;
  pool.endTime = event.params.startTime;
  pool.endTime = event.params.endTime;
  pool.fee = event.params.fee;

  pool.save();
}

export function handleLeagueAdded(event: LeagueAdded): void {
  let league = League.load(event.params.leagueId.toString());

  if (!league) {
    league = new League(event.params.leagueId.toString());
    league.name = event.params.name;
    league.sport = event.params.sport;
  }
  league.save();
}

export function handleGradedPools(event: GradedPools): void {
  let pool = Pool.load(event.params.poolId.toString()) as Pool;
  pool.results = event.params.results;
  pool.save();
}
