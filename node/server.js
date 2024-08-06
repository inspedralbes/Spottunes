import dotenv from "dotenv";
import mysql from "mysql2";
import axios, { all } from "axios";
import { get } from "mongoose";
import e from "cors";
import i18next from "./i18n.js";

dotenv.config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

async function getEvents() {
  let currentPage = 0;
  let allEvents = [];
  let maxPages = 1;
  // GET ALL PAGES
  do {
    try {
      const response = await axios.get(
        `https://app.ticketmaster.com/discovery/v2/events.json`,
        {
          params: {
            countryCode: "ES",
            classificationName: "music",
            page: currentPage,
            apikey: process.env.TICKETMASTER_API_KEY,
          },
        }
      );

      const data = response.data;
      maxPages = data.page.totalPages;
      const events = data._embedded.events;

      allEvents = allEvents.concat(events);
      currentPage++;
    } catch (error) {
      console.error(
        `Could not retrieve data from the Ticketmaster API: ${error.response.status} - ${error.response.statusText}`
      );
      return [];
    }
  } while (currentPage < maxPages);

  console.log("All events retrieved");
  return allEvents;
}

async function storeEvents() {
  db.connect(async (err) => {
    if (err) throw err;
    console.log("Connected to database");

    let allEvents = await getEvents();
    if (allEvents.length === 0) {
      console.log("No events to store");
      return;
    }

    await cleanObsoleteEvents(allEvents);

    allEvents.forEach(async (event) => {
      const id = event.id || null;

      const name = event.name || null;
      const artist =
        event._embedded &&
        event._embedded.attractions &&
        event._embedded.attractions.length > 0
          ? event._embedded.attractions[0].name
          : null;
      const date =
        event.dates && event.dates.start && event.dates.start.localDate
          ? event.dates.start.localDate
          : null;
      const time =
        event.dates && event.dates.start && event.dates.start.localTime
          ? event.dates.start.localTime
          : null;
      const venue =
        event._embedded && event._embedded.venues
          ? event._embedded.venues[0].name
          : null;
      const city =
        event._embedded &&
        event._embedded.venues &&
        event._embedded.venues[0].city
          ? event._embedded.venues[0].city.name
          : null;

      const latitude =
        event._embedded &&
        event._embedded.venues &&
        event._embedded.venues[0].location
          ? event._embedded.venues[0].location.latitude
          : null;

      const longitude =
        event._embedded &&
        event._embedded.venues &&
        event._embedded.venues[0].location
          ? event._embedded.venues[0].location.longitude
          : null;

      let country =
        event._embedded &&
        event._embedded.venues &&
        event._embedded.venues[0].country
          ? event._embedded.venues[0].country.name
          : null;

      if (country) {
        country = country ? i18next.t(country) : null;
      }

      const genre =
        event.classifications && event.classifications[0].genre
          ? event.classifications[0].genre.name
          : null;
      const subgenre =
        event.classifications && event.classifications[0].subGenre
          ? event.classifications[0].subGenre.name
          : null;
      const minPrice =
        event.priceRanges && event.priceRanges[0].min
          ? event.priceRanges[0].min
          : null;
      const maxPrice =
        event.priceRanges && event.priceRanges[0].max
          ? event.priceRanges[0].max
          : null;
      const promoter = event.promoter ? event.promoter.name : null;

      const images = event.images
        ? JSON.stringify(event.images.map((image) => image.url))
        : null;

      const selectQuery = `SELECT * FROM events WHERE event_id = ?`;
      const selectResult = await queryDatabase(selectQuery, [id]);

      if (selectResult.length > 0) {
        console.log(`Event already exists, NOT INSERTED: ${name}`);
        return;
      } else {
        const query = `INSERT INTO events (event_id, event, artist, date, time, venue, city, country, latitude,longitude, genre, subgenre, minPrice, maxPrice, promoter, images) VALUES 
        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const values = [
          id,
          name,
          artist,
          date,
          time,
          venue,
          city,
          country,
          latitude,
          longitude,
          genre,
          subgenre,
          minPrice,
          maxPrice,
          promoter,
          images,
        ];
        const result = await queryDatabase(query, values);
        console.log("Event inserted:", name);
      }
    });
  });
}

async function cleanObsoleteEvents(allEvents) {
  const dbEvents = await queryDatabase("SELECT event_id FROM events");
  const dbEventIds = dbEvents.map((event) => event.event_id);

  const fetchedEventIds = allEvents.map((event) => event.id);

  const eventsToDelete = dbEventIds.filter(
    (id) => !fetchedEventIds.includes(id)
  );
  if (eventsToDelete.length === 0) {
    console.log("No obsolete events");
    return;
  }

  for (const eventId of eventsToDelete) {
    const selectQuery = "SELECT * FROM events WHERE event_id = ?";
    const selectResult = await queryDatabase(selectQuery, [eventId]);

    if (selectResult.length > 0) {
      const eventName = selectResult[0].name; // Assuming 'name' is the column for event name

      const insertQuery =
        "INSERT INTO historic_events SELECT * FROM events WHERE event_id = ?";
      await queryDatabase(insertQuery, [eventId]);

      const deleteQuery = "DELETE FROM events WHERE event_id = ?";
      await queryDatabase(deleteQuery, [eventId]);

      console.log(`Moved event: ${eventName} to historic_events`);
    }
  }
}

async function movePastEventsToHistory() {
  try {
    const now = new Date().toISOString().slice(0, 19).replace("T", " ");

    const selectQuery = `SELECT * FROM events WHERE CONCAT(date, ' ', time) < ?`;
    const selectValues = [now];
    console.log("Moving past events to history...");

    const pastEvents = await queryDatabase(selectQuery, selectValues);

    pastEvents.forEach(async (event) => {
      const insertQuery = `INSERT INTO historic_events SELECT * FROM events WHERE event_id = ?`;
      const insertValues = [event.event_id];
      await queryDatabase(insertQuery, insertValues);

      const deleteQuery = `DELETE FROM events WHERE event_id = ?`;
      const deleteValues = [event.event_id];
      await queryDatabase(deleteQuery, deleteValues);

      console.log(`Moved event to history: ${JSON.stringify(event.event)}`);
    });

    console.log(`${pastEvents.length} past events moved to history`);
  } catch (error) {
    console.error("Error moving past events to history:", error);
  }
}

async function queryDatabase(query, values) {
  return new Promise((resolve, reject) => {
    db.query(query, values, (err, res) => {
      if (err) reject(err);
      resolve(res);
    });
  });
}

const server = {
  storeEvents,
  movePastEventsToHistory,
};

export default server;
