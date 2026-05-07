"use client"

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { marked } from "marked";
import DOMPurify from "dompurify";

const FETCH_ERROR = "ERROR";

export default function Main(params: {repoName: string, segments: string[]}) {
  const [navLinks, changeNL] = useState([""]);
  const [content, changeContent] = useState("");
  const navHeight = useRef("0px");

  function getMD(fileName: string){
    fetch(`https://cdn.jsdelivr.net/gh/uzairarif5/${params.repoName}/${params.segments.slice(1).join("/")+"/"+fileName}.md`)
    .then(res => {
      if (res.ok) return res.text();
      return FETCH_ERROR;
    })
    .then(async (res) => {
      const rawHtml = await marked.parse(res,{async: true});
      const safeHtml = DOMPurify.sanitize(rawHtml, {
        ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'h1', 'h2', 'h3', 'ul', 'ol', 'li','img'],
        ALLOWED_ATTR: ['width','height','src','href','title','alt'],
      });
      changeContent(safeHtml);
    });
  };

  useEffect(()=>{
    fetch(`https://cdn.jsdelivr.net/gh/uzairarif5/${params.repoName}/${params.segments.slice(1).join("/")}/order.txt`)
    .then(res => {
      navHeight.current = "140px";
      if (res.ok) return res.text();
      return FETCH_ERROR;
    })
    .then(res => { 
      if (res === FETCH_ERROR) changeNL([""]);
      else changeNL(res.split("\n")); 
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
    <main dangerouslySetInnerHTML={{__html:content}}></main>
    <footer>
      <Link href={"./"} id="BackButton">Back</Link>
      <Link href={"/"} id="homeButton">home page</Link>
    </footer>
  </>;
}
