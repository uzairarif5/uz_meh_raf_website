"use client"

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { marked } from "marked";
import DOMPurify from "dompurify";

const EMPTY_NAVLINKS: string[] = [];

const PREFILLED_CONTENT = {
  waitingForMd: "<p>Fetching content...</p>",
  waitingForLinks: "<p>Fetching links...</p>",
  error: "<p>There was an error!</p>"
}

const ERROR_TEXT = "ERROR_TEXT";

export default function Main(params: {repoName: string, segments: string[]}) {
  const [navLinks, changeNL] = useState<string[]>(EMPTY_NAVLINKS);
  const [content, changeContent] = useState("");
  const navHeight = useRef("0px");

  function getMD(fileName: string){
    changeContent(PREFILLED_CONTENT.waitingForMd);
    const filePath = params.segments.slice(1).join("/") + "/" + fileName + ".md";
    fetch(`https://cdn.jsdelivr.net/gh/uzairarif5/${params.repoName}@main/${filePath}`)
    .then(res => {
      if (res.ok) return res.text();
      return ERROR_TEXT;
    })
    .then(async (res) => {
      if (res === ERROR_TEXT) changeContent(PREFILLED_CONTENT.error);
      else {
        const rawHtml = await marked.parse(res, {async: true});
        const safeHtml = DOMPurify.sanitize(rawHtml, {
          ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'h1', 'h2', 'h3', 'ul', 'ol', 'li','img'],
          ALLOWED_ATTR: ['width','height','src','href','title','alt'],
        });
        changeContent(safeHtml);
      }
    })
    .catch(err => {
      fetch(`https://purge.jsdelivr.net/gh/uzairarif5/${params.repoName}@main/${filePath}`);
      console.error(err);
      console.log("jsdelivr purged!");
    });
  };

  useEffect(()=>{
    const path = params.segments.slice(1).join("/");
    fetch(`https://cdn.jsdelivr.net/gh/uzairarif5/${params.repoName}@main/${path}/order.txt`)
    .then(res => {
      navHeight.current = "140px";
      if (res.ok) return res.text();
      return ERROR_TEXT;
    })
    .then(res => { 
      if (res === ERROR_TEXT) changeContent(PREFILLED_CONTENT.error);
      else changeNL(res.split("\n")); 
    })
    .catch(err => {
      fetch(`https://purge.jsdelivr.net/gh/uzairarif5/${params.repoName}@main/${path}/order.txt`);
      console.error(err);
      console.log("jsdelivr purged!");
    });
  }, []);

  return <>
    <header><p>{params.segments[0]}'s blogs</p></header>
    <nav id="buttonsContainer" style={{height: navHeight.current}}>
      {
        navLinks.map((link, i)=>{
          if (link.length == 0) return;
          if (link.startsWith("/")) 
            return <div key={i} className="navButton">
              <Link className="navLink" href={"/"+params.segments.join("/") + link}>{link}</Link>
            </div>;
          else return <div key={i} className="navButton">
            <button className="navInnerButton" type="button" onClick={()=>{getMD(link)}}>{link}</button>
          </div>
        })
      }
    </nav>
    <main dangerouslySetInnerHTML={{__html: navLinks == EMPTY_NAVLINKS ? PREFILLED_CONTENT.waitingForLinks : content}}></main>
    <footer>
      <Link href={"./"} id="BackButton">Back</Link>
      <Link href={"/"} id="homeButton">home page</Link>
    </footer>
  </>;
}
