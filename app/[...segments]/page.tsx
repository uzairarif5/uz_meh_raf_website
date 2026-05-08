import "./main.css";
import githubRepoName from "../infoStore/githubReponames";
import Main from "./Main";

export default async function Page({params}: { params: Promise<{ segments: string[] }>}) {
  const authors = Object.keys(githubRepoName);
  const { segments } = await params;

  if (!(authors.includes(segments[0]))) return <p>Custom error: check segments[0]</p>;
  
  return <Main repoName={githubRepoName[segments[0]]} segments={segments}/>
}