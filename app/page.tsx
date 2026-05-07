import Link from "next/link";

export default async function Home() {
  let fetchRes, fetchJSON; 
  let recentlyEditedDiv = null;
  /* 
  fetchRes = await fetch("https://api.github.com/repos/uzairarif5/uz_meh_raf_website_content/commits?per_page=1&page=1", {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.ACCESS_TOKEN}`,
    }
  });

  if (fetchRes.status == 200) {
    fetchJSON = await fetchRes.json();
    fetchRes = await fetch(`https://api.github.com/repos/uzairarif5/uz_meh_raf_website_content/commits/${fetchJSON[0]["sha"]}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.ACCESS_TOKEN}`,
      }
    });
    fetchJSON = await fetchRes.json();
    const files = fetchJSON["files"];

    recentlyEditedDiv = <div>
      <table>
        <thead>
          <tr><th colSpan={3}>Date: {fetchJSON["commit"]["author"]["date"]}</th></tr>
          <tr><th>Author</th><th>Changes</th></tr>
        </thead>
        <tbody>
        {files.map((file: any, i: number)=>{
          let filename: string = file["filename"];
          let name = filename.substring(0, filename.indexOf("/"));
          let smallerFileName = filename.substring(filename.indexOf("/")+1,filename.length-3);
          if (filename.includes("order.txt")) {
            let foldersOnly = filename.substring(0,filename.lastIndexOf("/"));
            return <tr key={i}><td>{name}</td><td>{foldersOnly} (ordering)</td></tr>;
          }
          return <tr key={i}><td>{name}</td><td>{smallerFileName} ({file["status"]})</td></tr>;
        })}</tbody>
      </table>
    </div>;
  }
  else {
    console.error("fetch status:", fetchRes.status); 
    console.log("Response header:", fetchRes.headers);
  }
 */
  return (
    <div style={{display:"flex", flexDirection:"column", width:"calc(100%-40px)", margin: "20px"}}>
      <Link href={"./Uzair"}>Uzair</Link>
      <Link href={"./Mehrab"}>Mehrab</Link>
      <Link href={"./Rafay"}>Rafay</Link>
      <hr/>
      {recentlyEditedDiv}
    </div>
  );
}
