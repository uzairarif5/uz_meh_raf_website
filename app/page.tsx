import { Fragment, Suspense } from "react";
import githubRepoName from "./infoStore/githubReponames";
import Link from "next/link";
import { createClient } from '@supabase/supabase-js'
import LocalDateComp from "./clientCompsHomePage/LocalDateComp";

type UpdatesType = [string, {fName: string, status: string}[]][]; //first string is date
type AuthorChangesType = {[key: string]: UpdatesType};
const recentCommitsTTL = 86400000 //ms

async function getLast5Commits(repoName: string) {
  return await fetch(`https://api.github.com/repos/uzairarif5/${repoName}/commits?per_page=5&page=1`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.ACCESS_TOKEN}`,
      }
  }).then(res => res.json()) || null;
}

async function getCommitsDetails(repoName: string, sha: string) {
  return await fetch(`https://api.github.com/repos/uzairarif5/${repoName}/commits/${sha}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.ACCESS_TOKEN}`,
    }
  }).then(res => res.json()) || null;
}

async function getAuthorChanges() {
  const commitsFetchRes = await fetch("https://hnvoklrpquwiekwyjvmu.supabase.co/storage/v1/object/public/uz-meh-raf-storage_bucket/commits.json");
  const commitsFetchResJSON = await commitsFetchRes.json();
  if (Date.now() < (commitsFetchResJSON.date + recentCommitsTTL)) return commitsFetchResJSON.data;

  let authors = Object.keys(githubRepoName);
  let authorChanges: AuthorChangesType = {};

  for (let author of authors){
    let updatesToAdd: UpdatesType = [];
    let last5Commits = await getLast5Commits(githubRepoName[author]);
    if (!last5Commits) continue;
    for (let commit of last5Commits) {
      let commitDetails = await getCommitsDetails(githubRepoName[author], commit["sha"]);
      if (!commitDetails) continue;
      let date: string = commitDetails["commit"]["committer"]["date"];
      let curDateUpdates: {fName: string, status: string}[] = [];
      for (let file of commitDetails.files) {
        let shortenedFileName: string = "";
        let status = null;
        if (file["filename"].endsWith(".md")) {
          shortenedFileName = file["filename"].substring(0, file["filename"].length - 3);
          status = file["status"];
        }
        else if (file["filename"].endsWith("/order.txt")) {
          shortenedFileName = file["filename"].substring(0, file["filename"].length - 10);
          status = file["status"];
          if (status === "modified") status = "ordering";
        }
        else if (file["filename"] === "order.txt") {
          shortenedFileName = "/";
          status = "ordering";
        }
        if (status === "removed") {
          // suppose shortenedFileName is story1 > chapter1
          // if story1 is already in list and being removed then ignore story1 > chapter1
          if (curDateUpdates.some(prevUp => (prevUp.status === "removed") && shortenedFileName.startsWith(prevUp.fName))) continue;
          // if story1 > chapter1 is being removed then ignore story1 > chapter1 > subchap1 (no need to mention subroutes)
          curDateUpdates = curDateUpdates.filter(prevUp => !prevUp.fName.startsWith(shortenedFileName));
        }
        if (shortenedFileName.length) { 
          let formattedFileName = shortenedFileName.replaceAll("/", " > ");
          curDateUpdates.push({fName: formattedFileName, status: status});
        }
      }
      updatesToAdd.push([date, curDateUpdates]);
    } 
    authorChanges[author] = updatesToAdd;
  }

  const supabase = createClient('https://hnvoklrpquwiekwyjvmu.supabase.co', process.env.SUPABASE_KEY!);
  await supabase.storage.from('uz-meh-raf-storage_bucket').upload('/commits.json', JSON.stringify({
    date : Date.now(),
    data: authorChanges
  }), {upsert: true});
  
  return authorChanges;
}

async function recentEditsTable() {
  const authorChanges: AuthorChangesType = await getAuthorChanges();
  const authors = Object.keys(authorChanges);

  return <section id="changesContainer">
    {authors.map((a, i)=>{
      return <div className="updateLogOneAuthor" key={i}>
        <h3>Changes by {a}</h3>
        {authorChanges[a].map((updateInfo, i) => {
          return <div key={i} className="updateLogOneDate">
            <span className="dateHolder"><LocalDateComp dateString={updateInfo[0]}/></span>
            {updateInfo[1].map((specificUpInfo, j) => {
              if (specificUpInfo.fName === " > ") return <span key={j} className="changedRootOrdering">Changed root ordering.</span>;
              return <Fragment key={j}>
                <span className="fNameContainer">{specificUpInfo.fName}</span> 
                <span className="statusContainer">{specificUpInfo.status}</span>
              </Fragment>;
            })}
          </div>;
        })}
      </div>;
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
