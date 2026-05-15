"use client"

import { useEffect, useState } from "react";

export default function LocalDateComp(props: {dateString: string}) {
  const [correctDate, changeCD] = useState("");

  useEffect(()=>{
    const dateOb = new Date(props.dateString);
    changeCD(dateOb.toLocaleString());
  }, []);

  return correctDate;

}