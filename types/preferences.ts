export interface UserPreferences {
  followedTopicIds: string[];
  followedCreatorIds: string[];
  blockedKeywords: string[];
  boostedKeywords: string[];
  blockedCreatorIds: string[];
  blockedTopicIds: string[];
  schedules: ScheduleMode[];
}

export interface ScheduleMode {
  id: string;
  name: string;
  topicIds: string[];
  days: number[];
  startHour: number;
  endHour: number;
  enabled: boolean;
}
