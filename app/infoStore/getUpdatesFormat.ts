import githubRepoName from "./githubReponames";
import { createClient } from '@supabase/supabase-js';

type UpdateType = {fName: string, status: string}[];
type UpdateTypeWithAuthor = {author: string, changes: UpdateType};
export type AuthorChangesType = [Date, UpdateTypeWithAuthor][];
const supabaseURL = "https://hnvoklrpquwiekwyjvmu.supabase.co/storage/v1/object/public/uz-meh-raf-storage_bucket/commits.json";
const useShortRecentsCommitsTTL = false //used for testing
const recentCommitsTTL = useShortRecentsCommitsTTL ? 1000 : 86400000 //ms

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

function addDateToAuthorChanges(authorChanges: AuthorChangesType, date: Date, data: UpdateTypeWithAuthor) {
  const toAdd: [Date, UpdateTypeWithAuthor] = [date, data];
  if (authorChanges.length === 0) authorChanges.push(toAdd);
  else if (authorChanges.length === 1) {
    if (date > authorChanges[0][0]) authorChanges.unshift(toAdd);
    else authorChanges.push(toAdd);
  }
  else {
    const insertIdx = authorChanges.findIndex(el => el[0] < date);
    authorChanges.splice(insertIdx, 0, toAdd);
  }
}

export async function getAuthorChanges() {
  const commitsFetchRes = await fetch(supabaseURL);
  const commitsFetchResJSON = await commitsFetchRes.json();
  if (Date.now() < (commitsFetchResJSON.date + recentCommitsTTL)) return commitsFetchResJSON.data;

  let authors = Object.keys(githubRepoName);
  let authorChanges: AuthorChangesType = [];

  for (let author of authors) {
    let last5Commits = await getLast5Commits(githubRepoName[author]);
    if (!last5Commits) continue;
    for (let commit of last5Commits) {
      let commitDetails = await getCommitsDetails(githubRepoName[author], commit["sha"]);
      if (!commitDetails) continue;
      let date: Date = new Date(commitDetails["commit"]["committer"]["date"]);
      let curDateUpdates: UpdateType = [];
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
      addDateToAuthorChanges(authorChanges, date, {author: author, changes: curDateUpdates});
    } 
  }

  const supabase = createClient('https://hnvoklrpquwiekwyjvmu.supabase.co', process.env.SUPABASE_KEY!);
  await supabase.storage.from('uz-meh-raf-storage_bucket').upload('/commits.json', JSON.stringify({
    date : Date.now(),
    data: authorChanges
  }), {upsert: true});
  
  return authorChanges;
}
