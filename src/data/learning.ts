/**
 * What I am learning right now. Shown on the Learning page and in the
 * "Currently learning" section of the home page.
 */

export interface LearningTopic {
  topic: string;
  note: string;
}

export const learning: LearningTopic[] = [
  {
    topic: "Machine learning",
    note: "Strengthening the fundamentals so I can apply ML to problems in different fields.",
  },
  {
    topic: "Physics-informed ML",
    note: "How machine learning can be combined with physical knowledge and mathematical models, so a model respects the physics even where data runs out.",
  },
];
