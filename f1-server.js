const express = require("express");
const supa = require("@supabase/supabase-js");
const app = express();
const supaUrl = "https://wejrcsaojijlxfrtoija.supabase.co";
const supaAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndlanJjc2FvamlqbHhmcnRvaWphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDg3OTYzNzksImV4cCI6MjAyNDM3MjM3OX0.CRlRnblyCpynZQ4pZJ2kp8TFlxhgJU35LFW5HtsEZmM";
const supabase = supa.createClient(supaUrl, supaAnonKey);

app.get("/f1/status", async (req, res) => {
  const { data, error } = await supabase.from("status").select();
  res.send(data);
});

app.listen(8080, () => {
  console.log("listening on port 8080");
  console.log("http://localhost:8080/f1/status");
});

app.get("/f1/seasons", async (req, res) => {
  const { data, error } = await supabase.from("seasons").select();
  res.send(data);
});

app.get("/f1/races", async (req, res) => {
  const { data, error } = await supabase
    .from("races")
    .select(
      `
        raceId, year, round, name, circuits (name,location,country)
        `
    )
    .eq("year", 2020)
    .order("round", { ascending: false });
  res.send(data);
});

app.get("/f1/results/:race", async (req, res) => {
  const { data, error } = await supabase
    .from("results")
    .select(
      `
    resultId, positionOrder, races (year, name),
    drivers (forename,surname), constructors (name)
    `
    )
    .eq("raceId", req.params.race)
    .order("positionOrder", { ascending: true });
  res.send(data);
});

//test knowledge 1

app.get("/f1/qualifying", async (req, res) => {
  const { data, error } = await supabase
    .from("qualifying")
    .select(
      `
            qualifyId, position, q1, q2, q3, races (name, year), 
            drivers (surname, forename), constructors (name)
            `
    )
    .order("position", { ascending: true });
  res.send(data);
  console.log("GET /f1/qualifying");
});

app.get("/f1/qualifying/:qualifyId", async (req, res) => {
  const { data, error } = await supabase
    .from("qualifying")
    .select(
      `
            qualifyId, position, q1, q2, q3, races (name, year), 
            drivers (surname, forename), constructors (name)
            `
    )
    .eq("qualifyId", req.params.qualifyId)
    .order("position", { ascending: true });
  res.send(data);
  const sampleQualifyId = 1034;
  console.log(`GET /f1/qualifying/${sampleQualifyId}`);
});

//test knowledge 2

app.get("/f1/races/:year/:yearTo/", async (req, res) => {
  const { data, error } = await supabase
    .from("races")
    .select(` * `)
    .gte("year", req.params.year)
    .lte("year", req.params.yearTo)
    .order("year", { ascending: true });
  res.send(data);
  const sampleYear = 2020;
  const sampleYearTo = 2022;
  console.log(`GET /f1/races/${sampleYear}/${sampleYearTo}/`);
});

//test knowledge 3

app.get("/f1/drivers/name/:search/limit/:limitNumber/", async (req, res) => {
  const { data, error } = await supabase
    .from("drivers")
    .select(`*`)
    .ilike("surname", `%${req.params.search}%`)
    .order("surname", { ascending: true })
    .limit(req.params.limitNumber);
  res.send(data);
  const sampleSearch = "sch";
  const sampleLimitNumber = 12;
  console.log(
    `GET /f1/drivers/name/${sampleSearch}/limit/${sampleLimitNumber}/`
  );
});

