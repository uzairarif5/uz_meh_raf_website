"use client"

import { useEffect, useState } from "react";

export default function LocalDateComp(props: {epochTime: number}) {
  const [curDate, changeCD] = useState("");

  useEffect(() => { 
    let d = new Date(props.epochTime);
    changeCD(d.toLocaleString("en-US", { hourCycle: "h23" })); 
  }, []);
  
  return curDate;
}