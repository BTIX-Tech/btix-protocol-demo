const { apiSympla, apiProtocol } = require("./api");

/**
 * Function to get events from the Sympla API.
 * @returns {Promise<Array>} - The list of events.
 */
const getEventsSympla = async () => {
  const { data } = await apiSympla("events");
  return data;
};

/**
 * Function to get events from the Protocol API.
 * @returns {Promise<Array>} - The list of events.
 */
const getEventsProtocol = async () => {
  const { results } = await apiProtocol("events");
  return results || [];
};

/**
 * Function to check for new events and add them to the Protocol API.
 * @param {Array} events - The list of events from Sympla.
 */
const checkNewEvents = async () => {
  // Step 1.1
  const eventsSympla = await getEventsSympla();
  if (eventsSympla.length === 0)
    return console.log("No events found in Sympla.");

  // Step 1.2
  const eventsProtocol = await getEventsProtocol();

  // Step 2
  const newEvents = eventsSympla.filter(
    (event) =>
      !eventsProtocol.find(
        (eventProtocol) =>
          String(eventProtocol.referenceId) === String(event.id)
      )
  );
  if (newEvents.length === 0) return;

  // Step 3
  for (let event of newEvents) {
    const { name, id, detail, image } = event;

    console.log("Adding new event to Protocol API:", event.name);

    const eventCreated = await apiProtocol(
      "events",
      "post",
      JSON.stringify({
        name,
        referenceId: id,
        data: {
          minimumPrice: 4.5,
          symbol: "DEMO",
          royaltieFee: 10,
        },
        metadata: {
          name,
          description: detail,
          image,
          banner_image: image,
          featured_image: image,
        },
      })
    );

    console.log("Event added to Protocol API:", eventCreated.name);
    console.log("");
  }
};

module.exports = { getEventsSympla, checkNewEvents, getEventsProtocol };
