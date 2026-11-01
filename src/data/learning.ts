/**
 * What I am learning right now. Shown on the Learning page and in the
 * "Currently learning" section of the home page.
 *
 *   link  Optional page for the course or material, shown as a link under the note.
 */

export interface LearningTopic {
  topic: string;
  note: string;
  link?: { label: string; url: string };
}

export const learning: LearningTopic[] = [
  {
    topic: "AI engineering",
    note: "Working through AI Engineering from Scratch, an open-source course that runs from math and ML foundations through deep learning to LLMs, RAG and agents.",
    link: {
      label: "The course",
      url: "https://github.com/rohitg00/ai-engineering-from-scratch",
    },
  },
  {
    topic: "Physics-informed ML",
    note: "How machine learning can be combined with physical knowledge and mathematical models, so a model respects the physics even where data runs out.",
  },
];
