// app/about/page.tsx
import fs from "fs";
import path from "path";
import AboutClient from "./AboutClient";

async function getMarkdownContent() {
  try {
    const markdownPath = path.join(
      process.cwd(),
      "public",
      "markdown",
      "about.md",
    );
    return fs.readFileSync(markdownPath, "utf8");
  } catch (error) {
    console.error("Error reading markdown file:", error);
    return "# Error\nCould not load the about page content.";
  }
}

export default async function AboutPage() {
  const markdownContent = await getMarkdownContent();
  return <AboutClient markdownContent={markdownContent} />;
}
