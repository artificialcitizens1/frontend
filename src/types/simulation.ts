export type ElectionTopic = string;

export interface ElectionSettings {
  topics: ElectionTopic[];
  religiosity: number; // 0 to 1
  chaosLevel: number; // 0 to 1
  simulationType: number; // 0 to 1, where 0 is Realistic and 1 is Satirical
}

export type Duration = "1 Day" | "2 Days" | "3 Days" | "4 Days";
export type Speed = 0.25 | 0.5 | 1 | 1.25 | 1.5 | 2;

export interface TimeSettings {
  duration: Duration;
  speed: Speed;
}

export interface MediaOutlet {
  name: string;
  bias: "Left Leaning" | "Right Leaning";
  isSelected: boolean;
}

export interface MediaSettings {
  outlets: MediaOutlet[];
}

export interface MajoritySentiment {
  x: number; // -1 to 1, representing Left to Right
  y: number; // -1 to 1, representing Libertarian to Authoritarian
}

export interface SimulationSettings {
  electionSettings: ElectionSettings;
  timeSettings: TimeSettings;
  mediaSettings: MediaSettings;
  majoritySentiment: MajoritySentiment;
}
