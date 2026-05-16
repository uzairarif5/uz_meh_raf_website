"use client"

import { useEffect, useState } from "react";

export default function LocalDateComp(props: {dateOb: Date}) {
  const [correctDate, changeCD] = useState("");

  useEffect(() => { 
    changeCD(props.dateOb.toLocaleString()); 
  }, []);

  return correctDate;

}