import Link from "next/link";
import Main from "./Main";
import "./main.css";

const githubRepoName: {[key: string]: string} = {
  "Uzair":"uz_meh_raf_Uzair_Content",
  "Rafay":"uz_meh_raf_Raf_Content",
  "Mehrab":"uz_meh_raf_Meh_Content"
}

export default async function Page({params}: { params: Promise<{ segments: string[] }>}) {
  const authors = Object.keys(githubRepoName);
  const { segments } = await params;

  if (!(authors.includes(segments[0]))) return <p>Custom error: check segments[0]</p>;
  
  return <Main repoName={githubRepoName[segments[0]]} segments={segments}/>
}