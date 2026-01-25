
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.22.0
 * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
 */
Prisma.prismaVersion = {
  client: "5.22.0",
  engine: "605197351a3c8bdd595af2d2a9bc3025bca48ea2"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.NotFoundError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`NotFoundError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  email: 'email',
  fullName: 'fullName',
  whatsapp: 'whatsapp',
  gender: 'gender',
  graduation: 'graduation',
  specialization: 'specialization',
  year: 'year',
  regNumber: 'regNumber',
  skills: 'skills',
  domain: 'domain',
  githubUrl: 'githubUrl',
  codingUrl: 'codingUrl',
  profilePicture: 'profilePicture',
  totalPoints: 'totalPoints',
  currentStreak: 'currentStreak',
  longestStreak: 'longestStreak',
  level: 'level',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  lastActive: 'lastActive'
};

exports.Prisma.EventCategoryScalarFieldEnum = {
  id: 'id',
  name: 'name',
  slug: 'slug',
  description: 'description',
  icon: 'icon',
  color: 'color',
  parentId: 'parentId',
  createdAt: 'createdAt'
};

exports.Prisma.EventTypeScalarFieldEnum = {
  id: 'id',
  categoryId: 'categoryId',
  name: 'name',
  slug: 'slug',
  description: 'description',
  defaultDurationHours: 'defaultDurationHours',
  createdAt: 'createdAt'
};

exports.Prisma.EventScalarFieldEnum = {
  id: 'id',
  title: 'title',
  slug: 'slug',
  description: 'description',
  categoryId: 'categoryId',
  eventType: 'eventType',
  mode: 'mode',
  registrationStart: 'registrationStart',
  registrationEnd: 'registrationEnd',
  maxParticipants: 'maxParticipants',
  isTeamEvent: 'isTeamEvent',
  allowIndividual: 'allowIndividual',
  minTeamSize: 'minTeamSize',
  maxTeamSize: 'maxTeamSize',
  teamFormationDeadline: 'teamFormationDeadline',
  restrictSameCollege: 'restrictSameCollege',
  eventStart: 'eventStart',
  eventEnd: 'eventEnd',
  isPaid: 'isPaid',
  registrationFee: 'registrationFee',
  currency: 'currency',
  hasSubmission: 'hasSubmission',
  submissionStart: 'submissionStart',
  submissionDeadline: 'submissionDeadline',
  submissionTemplateUrl: 'submissionTemplateUrl',
  rules: 'rules',
  eligibility: 'eligibility',
  rewards: 'rewards',
  prizes: 'prizes',
  venue: 'venue',
  meetingLink: 'meetingLink',
  resourceLinks: 'resourceLinks',
  bannerImage: 'bannerImage',
  images: 'images',
  status: 'status',
  isFeatured: 'isFeatured',
  hasRoadmap: 'hasRoadmap',
  roadmapId: 'roadmapId',
  hasChallenges: 'hasChallenges',
  problemCount: 'problemCount',
  createdBy: 'createdBy',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.TeamScalarFieldEnum = {
  id: 'id',
  eventId: 'eventId',
  teamName: 'teamName',
  teamLeaderId: 'teamLeaderId',
  isComplete: 'isComplete',
  isLocked: 'isLocked',
  collegeName: 'collegeName',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.TeamMemberScalarFieldEnum = {
  id: 'id',
  teamId: 'teamId',
  userId: 'userId',
  isLeader: 'isLeader',
  status: 'status',
  joinedAt: 'joinedAt',
  leftAt: 'leftAt'
};

exports.Prisma.TeamJoinRequestScalarFieldEnum = {
  id: 'id',
  teamId: 'teamId',
  userId: 'userId',
  requestType: 'requestType',
  status: 'status',
  message: 'message',
  responseMessage: 'responseMessage',
  createdAt: 'createdAt',
  respondedAt: 'respondedAt'
};

exports.Prisma.EventRegistrationScalarFieldEnum = {
  id: 'id',
  eventId: 'eventId',
  userId: 'userId',
  teamId: 'teamId',
  participationType: 'participationType',
  paymentStatus: 'paymentStatus',
  paymentId: 'paymentId',
  amountPaid: 'amountPaid',
  paidAt: 'paidAt',
  status: 'status',
  registeredAt: 'registeredAt',
  cancelledAt: 'cancelledAt'
};

exports.Prisma.EventSubmissionScalarFieldEnum = {
  id: 'id',
  eventId: 'eventId',
  userId: 'userId',
  teamId: 'teamId',
  projectDeckUrl: 'projectDeckUrl',
  presentationPdfUrl: 'presentationPdfUrl',
  mvpLink: 'mvpLink',
  demoVideoUrl: 'demoVideoUrl',
  githubRepoUrl: 'githubRepoUrl',
  technologiesUsed: 'technologiesUsed',
  aiToolsIntegrated: 'aiToolsIntegrated',
  solutionDescription: 'solutionDescription',
  score: 'score',
  rank: 'rank',
  feedback: 'feedback',
  status: 'status',
  submittedAt: 'submittedAt',
  updatedAt: 'updatedAt',
  evaluatedAt: 'evaluatedAt'
};

exports.Prisma.ChallengeScalarFieldEnum = {
  id: 'id',
  title: 'title',
  slug: 'slug',
  description: 'description',
  challengeType: 'challengeType',
  difficulty: 'difficulty',
  durationDays: 'durationDays',
  startDate: 'startDate',
  endDate: 'endDate',
  category: 'category',
  tags: 'tags',
  pointsPerDay: 'pointsPerDay',
  bonusPoints: 'bonusPoints',
  badges: 'badges',
  hasLeaderboard: 'hasLeaderboard',
  isPublic: 'isPublic',
  maxParticipants: 'maxParticipants',
  bannerImage: 'bannerImage',
  icon: 'icon',
  status: 'status',
  totalParticipants: 'totalParticipants',
  activeParticipants: 'activeParticipants',
  completionRate: 'completionRate',
  createdBy: 'createdBy',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ChallengeTaskScalarFieldEnum = {
  id: 'id',
  challengeId: 'challengeId',
  dayNumber: 'dayNumber',
  title: 'title',
  description: 'description',
  taskType: 'taskType',
  content: 'content',
  resourceLinks: 'resourceLinks',
  hints: 'hints',
  difficulty: 'difficulty',
  points: 'points',
  autoValidate: 'autoValidate',
  validationUrl: 'validationUrl',
  createdAt: 'createdAt'
};

exports.Prisma.UserChallengeProgressScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  challengeId: 'challengeId',
  status: 'status',
  completedDays: 'completedDays',
  totalDays: 'totalDays',
  completionPercentage: 'completionPercentage',
  currentStreak: 'currentStreak',
  longestStreak: 'longestStreak',
  lastCompletedDate: 'lastCompletedDate',
  totalPoints: 'totalPoints',
  bonusPoints: 'bonusPoints',
  currentRank: 'currentRank',
  startedAt: 'startedAt',
  lastActivity: 'lastActivity',
  completedAt: 'completedAt',
  certificateIssued: 'certificateIssued',
  certificateUrl: 'certificateUrl',
  completedTaskIds: 'completedTaskIds',
  skippedTaskIds: 'skippedTaskIds'
};

exports.Prisma.UserTaskCompletionScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  challengeId: 'challengeId',
  taskId: 'taskId',
  progressId: 'progressId',
  completedAt: 'completedAt',
  timeTaken: 'timeTaken',
  submissionUrl: 'submissionUrl',
  submissionText: 'submissionText',
  submissionFiles: 'submissionFiles',
  isVerified: 'isVerified',
  verifiedBy: 'verifiedBy',
  verifiedAt: 'verifiedAt',
  score: 'score',
  pointsEarned: 'pointsEarned',
  userNotes: 'userNotes',
  feedback: 'feedback'
};

exports.Prisma.UserBadgeScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  badgeType: 'badgeType',
  badgeName: 'badgeName',
  badgeDescription: 'badgeDescription',
  badgeIcon: 'badgeIcon',
  badgeColor: 'badgeColor',
  relatedChallengeId: 'relatedChallengeId',
  relatedEventId: 'relatedEventId',
  pointsAwarded: 'pointsAwarded',
  earnedAt: 'earnedAt'
};

exports.Prisma.UserAchievementScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  achievementType: 'achievementType',
  achievementName: 'achievementName',
  description: 'description',
  value: 'value',
  target: 'target',
  rarity: 'rarity',
  earnedAt: 'earnedAt'
};

exports.Prisma.LeaderboardScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  leaderboardType: 'leaderboardType',
  relatedId: 'relatedId',
  timePeriod: 'timePeriod',
  score: 'score',
  rank: 'rank',
  previousRank: 'previousRank',
  totalCompletions: 'totalCompletions',
  currentStreak: 'currentStreak',
  updatedAt: 'updatedAt'
};

exports.Prisma.EventChallengeScalarFieldEnum = {
  eventId: 'eventId',
  challengeId: 'challengeId'
};

exports.Prisma.RoadmapScalarFieldEnum = {
  id: 'id',
  title: 'title',
  description: 'description',
  roleTarget: 'roleTarget',
  createdAt: 'createdAt'
};

exports.Prisma.RoadmapPhaseScalarFieldEnum = {
  id: 'id',
  roadmapId: 'roadmapId',
  order: 'order',
  title: 'title',
  level: 'level',
  duration: 'duration',
  description: 'description'
};

exports.Prisma.PhaseSectionScalarFieldEnum = {
  id: 'id',
  phaseId: 'phaseId',
  title: 'title',
  description: 'description',
  order: 'order'
};

exports.Prisma.SectionItemScalarFieldEnum = {
  id: 'id',
  sectionId: 'sectionId',
  title: 'title',
  order: 'order'
};

exports.Prisma.SubItemScalarFieldEnum = {
  id: 'id',
  itemId: 'itemId',
  title: 'title',
  videoUrl: 'videoUrl',
  duration: 'duration',
  order: 'order'
};

exports.Prisma.PhasePlaylistScalarFieldEnum = {
  id: 'id',
  phaseId: 'phaseId',
  title: 'title',
  author: 'author',
  videoCount: 'videoCount',
  url: 'url',
  thumbnail: 'thumbnail'
};

exports.Prisma.PhaseProjectScalarFieldEnum = {
  id: 'id',
  phaseId: 'phaseId',
  title: 'title',
  description: 'description',
  tags: 'tags'
};

exports.Prisma.DSASheetScalarFieldEnum = {
  id: 'id',
  title: 'title',
  description: 'description',
  level: 'level',
  createdAt: 'createdAt'
};

exports.Prisma.DSATopicScalarFieldEnum = {
  id: 'id',
  title: 'title',
  sheetId: 'sheetId',
  order: 'order'
};

exports.Prisma.DSAProblemScalarFieldEnum = {
  id: 'id',
  title: 'title',
  description: 'description',
  difficulty: 'difficulty',
  topicId: 'topicId',
  order: 'order'
};

exports.Prisma.DSASolutionScalarFieldEnum = {
  id: 'id',
  language: 'language',
  code: 'code',
  problemId: 'problemId'
};

exports.Prisma.CertificateScalarFieldEnum = {
  id: 'id',
  certificateId: 'certificateId',
  eventId: 'eventId',
  userId: 'userId',
  teamId: 'teamId',
  participantName: 'participantName',
  position: 'position',
  issuedAt: 'issuedAt'
};

exports.Prisma.EmailLogScalarFieldEnum = {
  id: 'id',
  eventId: 'eventId',
  subject: 'subject',
  message: 'message',
  recipientCount: 'recipientCount',
  sentBy: 'sentBy',
  sentAt: 'sentAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.NullableJsonNullValueInput = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull
};

exports.Prisma.JsonNullValueFilter = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull,
  AnyNull: Prisma.AnyNull
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};


exports.Prisma.ModelName = {
  User: 'User',
  EventCategory: 'EventCategory',
  EventType: 'EventType',
  Event: 'Event',
  Team: 'Team',
  TeamMember: 'TeamMember',
  TeamJoinRequest: 'TeamJoinRequest',
  EventRegistration: 'EventRegistration',
  EventSubmission: 'EventSubmission',
  Challenge: 'Challenge',
  ChallengeTask: 'ChallengeTask',
  UserChallengeProgress: 'UserChallengeProgress',
  UserTaskCompletion: 'UserTaskCompletion',
  UserBadge: 'UserBadge',
  UserAchievement: 'UserAchievement',
  Leaderboard: 'Leaderboard',
  EventChallenge: 'EventChallenge',
  Roadmap: 'Roadmap',
  RoadmapPhase: 'RoadmapPhase',
  PhaseSection: 'PhaseSection',
  SectionItem: 'SectionItem',
  SubItem: 'SubItem',
  PhasePlaylist: 'PhasePlaylist',
  PhaseProject: 'PhaseProject',
  DSASheet: 'DSASheet',
  DSATopic: 'DSATopic',
  DSAProblem: 'DSAProblem',
  DSASolution: 'DSASolution',
  Certificate: 'Certificate',
  EmailLog: 'EmailLog'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
