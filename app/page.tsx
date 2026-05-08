import { Suspense } from "react";
import githubRepoName from "./infoStore/githubReponames";
import Link from "next/link";

async function getLast5Commits(repoName: string) {
  return await fetch(`https://api.github.com/repos/uzairarif5/${repoName}/commits?per_page=5&page=1`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.ACCESS_TOKEN}`,
      }
  }).then(res => res.json());
}

async function getCommitsDetails(repoName: string, sha: string) {
  return await fetch(`https://api.github.com/repos/uzairarif5/${repoName}/commits/${sha}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.ACCESS_TOKEN}`,
    }
  }).then(res => res.json());
}

async function recentEditsTable() {
  let authors = Object.keys(githubRepoName);
  let authorChanges: {[key: string]: [string, string, string][]} = {};

  for (let author of authors){
    let updatesToAdd: [string,string, string][] = [];
    let last5Commits = await getLast5Commits(githubRepoName[author]);
    for (let commit of last5Commits) {
      let commitDetails = await getCommitsDetails(githubRepoName[author], commit["sha"]);
      let date: string = commitDetails["commit"]["committer"]["date"];
      for (let file of commitDetails.files) {
        let charToRemove = 0;
        if (file["filename"].endsWith(".md")) charToRemove = 3;
        else if (file["filename"].endsWith("/order.txt")) charToRemove = 10;
        let filename: string = file["filename"]
          .substring(0, file["filename"].length - charToRemove)
          .replaceAll("/", " > ");
        updatesToAdd.push([filename, file["status"], date]);
      }
    } 
    authorChanges[author] = updatesToAdd;
  }

  return <section id="changesContainer">
    {authors.map((a, i)=>{
      return <table className="updateLogOneAuthor" key={i}>
        <thead><tr><th colSpan={2}>Changes by {a}</th></tr></thead>
        <>{authorChanges[a].map((fileInfo, i) => {
          return <tbody key={i}>
            <tr><td colSpan={2}>{fileInfo[0]}</td></tr>
            <tr><td>{fileInfo[2]}</td><td>{fileInfo[1]}</td></tr>
          </tbody>;
        })}</>
      </table>;
    })}
  </section>;
}

export default async function Home() {
  return <>
    <h1>Blog website</h1>
    <p><Link href={"./Uzair"}>Uzair</Link></p>
    <p><Link href={"./Mehrab"}>Mehrab</Link></p>
    <p><Link href={"./Rafay"}>Rafay</Link></p>
    <hr/>
    <h2>Latest updates</h2>
    <Suspense fallback={<></>}>{await recentEditsTable()}</Suspense>
  </>;
}
