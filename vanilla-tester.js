const { createClient } = supabase;
const supaUrl = "https://wejrcsaojijlxfrtoija.supabase.co";
const supaAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndlanJjc2FvamlqbHhmcnRvaWphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDg3OTYzNzksImV4cCI6MjAyNDM3MjM3OX0.CRlRnblyCpynZQ4pZJ2kp8TFlxhgJU35LFW5HtsEZmM";
const db = createClient(supaUrl, supaAnonKey);
fetchRaceData(2020);

async function fetchRaceData(year) {
  // uses the same API as the Node examples
  const { data, error } = await db
    .from("races")
    .select("*")
    .eq("year", year)
    .order("round", { ascending: true });
  if (error) {
    console.error("Error fetching data:", error);
    return;
  }
  // populate first unordered list
  const first = document.querySelector("#first");
  for (let d of data) {
    const li = document.createElement("li");
    li.textContent = d.name;
    li.value = d.raceId;
    first.appendChild(li);

    li.addEventListener("click", (e) => {
      document.querySelector("#title").textContent =
        "Results for " + e.target.textContent;
      fetchResultsData(e.target.value);
    });
  }
}

async function fetchResultsData(raceid) {
  const { data, error } = await db
    .from("results")
    .select(
      `
    resultId, positionOrder, drivers (forename,surname),
    constructors (name)
    `
    )
    .eq("raceId", raceid)
    .order("positionOrder", { ascending: true });
  if (error) {
    console.error("Error fetching data:", error);
    return;
  }
  const second = document.querySelector("#second");
  second.innerHTML = "";
  for (let d of data) {
    const li = document.createElement("li");
    li.textContent = `${d.positionOrder}:
    ${d.drivers.forename} ${d.drivers.surname}
    [${d.constructors.name}]`;
    second.appendChild(li);
  }
}
