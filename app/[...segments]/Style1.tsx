"use client"

import styles from "./style1.module.css";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { marked } from "marked";
import markedFootnote from 'marked-footnote';
import DOMPurify from "dompurify";
import { style1Fonts } from "../infoStore/fonts";
import Image from 'next/image';
import bookImage from "@/public/book.gif";
import leftImage from "@/public/left.gif";
import homeImage from "@/public/home.gif";
import featherPen from "@/public/feather_pen.png";

const EMPTY_NAVLINKS: string[] = [];

const PREFILLED_CONTENT = {
  waitingForMd: "<p>Fetching content...</p>",
  waitingForLinks: "<p>Fetching links...</p>",
  error: "<p>There was an error!</p>"
}

const ERROR_TEXT = "ERROR_TEXT";

export default function Main(params: {repoName: string, segments: string[]}) {
  const navLinks = useRef<string[]>(EMPTY_NAVLINKS);
  const [content, changeContent] = useState(PREFILLED_CONTENT.waitingForLinks);

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
        const rawHtml = await marked.use(markedFootnote()).parse(res, {async: true});
        console.log(rawHtml);
        const safeHtml = DOMPurify.sanitize(rawHtml, {
          ALLOWED_TAGS: ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'a', 'br', 'ul', 'ol', 'li','img', 'b', 'i', 'em', 'strong', 
            'del', 'code', 'pre', 'hr', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'q', 'blockquote'],
          ALLOWED_ATTR: ['width', 'height', 'src', 'href', 'title', 'alt', 'rowspan', 'colspan']
        });
        changeContent(safeHtml);
      }
    })
    .catch(err => {
      console.error(err);
      purgeJsdelivr(`https://purge.jsdelivr.net/gh/uzairarif5/${params.repoName}@main/${filePath}`);
    });
  };

  useEffect(()=>{
    const path = params.segments.slice(1).join("/");
    fetch(`https://cdn.jsdelivr.net/gh/uzairarif5/${params.repoName}@main/${path}/order.txt`)
    .then(res => {
      if (res.ok) return res.text();
      return ERROR_TEXT;
    })
    .then(res => { 
      if (res === ERROR_TEXT) changeContent(PREFILLED_CONTENT.error);
      else {
        navLinks.current = res.split("\n");
        changeContent("");
      }
    })
    .catch(err => {
      console.error(err);
      purgeJsdelivr(`https://purge.jsdelivr.net/gh/uzairarif5/${params.repoName}@main/${path}/order.txt`);
    });
  }, []);

  return <body className={style1Fonts.CRIMSON_PRO_FONT} id={styles.body}>
    <header><Image src={bookImage} alt="" width={20} height={20}/><p>{params.segments[0]}'s blogs</p></header>
    <nav id={styles.buttonsContainer}>
      {
        navLinks.current.map((link, i)=>{
          if (link.length == 0) return;
          if (link.startsWith("/")) 
            return <div key={i} className={styles.navButton}>
              <Link href={"/"+params.segments.join("/") + link}>{link}</Link>
            </div>;
          else return <div key={i} className={styles.navButton}>
            <button type="button" onClick={()=>{getMD(link)}} className={style1Fonts.CRIMSON_PRO_FONT}>{link}</button>
          </div>
        })
      }
    </nav>
    <main>
      <Image src={featherPen} alt="" width={45} height={45}/>
      <div dangerouslySetInnerHTML={{__html: content}}></div>
    </main>
    <footer>
      <Link href={"./"} id={styles.BackButton}><Image src={leftImage} alt="" width={20} height={20}/>Back</Link>
      <Link href={"/"} id={styles.homeButton}><Image src={homeImage} alt="" width={20} height={20}/> home page</Link>
    </footer>
  </body>;
}


function purgeJsdelivr(path: string) {
  console.log("purging jsdelivr...");
  fetch(path)
  .then(() => { console.log("jsdelivr purged"); })
  .catch((err) => { 
    console.log("Was not able to purge"); 
    console.error(err);
  });
}