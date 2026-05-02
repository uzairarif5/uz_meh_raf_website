import Link from "next/link";

export default async function Home() {
  let fetchRes, fetchJSON; 
  let firstFetchSuccess = false;
  let recentlyEditedDiv = null;
  
  fetchRes = await fetch("https://api.github.com/repos/uzairarif5/uz_meh_raf_website_content/commits?per_page=1&page=1", {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.ACCESS_TOKEN}`,
    }
  });
  console.log(fetchRes.headers);
  if (fetchRes.status == 200) {
    fetchJSON = await fetchRes.json();
    firstFetchSuccess = true;
    fetchRes = await fetch(`https://api.github.com/repos/uzairarif5/uz_meh_raf_website_content/commits/${fetchJSON[0]["sha"]}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.ACCESS_TOKEN}`,
      }
    });
    fetchJSON = await fetchRes.json();
    const files = fetchJSON["files"];
    console.log(fetchJSON);
    recentlyEditedDiv = <div>
      <table>
        <thead>
          <tr><th colSpan={3}>Date: {fetchJSON["commit"]["author"]["date"]}</th></tr>
          <tr><th>Last editor</th><th>File changed</th><th>File Status</th></tr>
        </thead>
        <tbody>
        {files.map((file: any, i: number)=>{
          let filename: string = file["filename"];
          if (filename.includes("order.txt")) return null;
          let name = filename.substring(0, filename.indexOf("/"));
          let smallerFileName = filename.substring(filename.indexOf("/")+1,filename.length-3);
          return <tr key={i}><td>{name}</td><td>{smallerFileName}</td><td>{file["status"]}</td></tr>;
        })}</tbody>
      </table>
    </div>;
  }
  else {
    console.error("fetch status:", fetchRes.status); 
    console.log("Response header:", fetchRes.headers);
  }

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
