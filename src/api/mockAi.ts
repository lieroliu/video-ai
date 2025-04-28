import { MockAiResponse, TranscriptSection } from "../types";

export function mockAiProcess(): Promise<MockAiResponse> {
  const sections: TranscriptSection[] = [
    {
      title: "Introduction",
      items: [
        {
          text: "Welcome to our product demonstration.",
          startSeconds: 0,
          endSeconds: 5,
        },
        {
          text: "Today, we'll be showcasing our latest innovation.",
          isHighlighted: true,
          startSeconds: 5,
          endSeconds: 15,
        },
      ],
    },
    {
      title: "Key Features",
      items: [
        {
          text: "Our product has three main features.",
          startSeconds: 15,
          endSeconds: 20,
        },
        {
          text: "First, it's incredibly easy to use.",
          startSeconds: 20,
          endSeconds: 25,
        },
        {
          text: "Second, it's highly efficient.",
          startSeconds: 25,
          endSeconds: 30,
        },
        {
          text: "And third, it's cost-effective.",
          startSeconds: 30,
          endSeconds: 40,
        },
      ],
    },
    {
      title: "Demonstration",
      items: [
        {
          text: "Let me show you how it works.",
          startSeconds: 40,
          endSeconds: 45,
        },
        {
          text: "Simply press this button to start.",
          isHighlighted: true,
          startSeconds: 45,
          endSeconds: 50,
        },
        {
          text: "The interface is intuitive and user-friendly.",
          isHighlighted: true,
          startSeconds: 50,
          endSeconds: 60,
        },
      ],
    },
    {
      title: "Conclusion",
      items: [
        {
          text: "In conclusion, our product is a game-changer.",
          startSeconds: 60,
          endSeconds: 65,
        },
        {
          text: "We're excited to bring this to market.",
          isHighlighted: true,
          startSeconds: 65,
          endSeconds: 70,
        },
        {
          text: "Thank you for your attention.",
          startSeconds: 70,
          endSeconds: 80,
        },
      ],
    },
  ];

  const highlights = sections.flatMap((s) =>
    s.items.filter((i) => i.isHighlighted)
  );

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        sections,
        highlights,
      });
    }, 800);
  });
}
