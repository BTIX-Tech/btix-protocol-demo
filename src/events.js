const { apiSympla, apiProtocol } = require("./api");

/**
 * Function to get events from the Sympla API.
 * @returns {Promise<Array>} - The list of events.
 */
const getEvents = async () => {
  const { data } = await apiSympla("events");
  return data;
};

/**
 * Function to get tickets for a specific event from the Sympla API.
 * @param {number} eventId - The ID of the event.
 * @returns {Promise<Array>} - The list of tickets for the event.
 */
const getTickets = async (eventId) => {
  const { data } = await apiSympla(`events/${eventId}/orders`, 3);
  return data;
};

/**
 * Function to check for new events and add them to the Protocol API.
 * @param {Array} events - The list of events from Sympla.
 */
const checkNewEvents = async (events) => {
  const { results: eventsProtocol } = await apiProtocol("public/events");
  const newEvents = events.filter((event) => {
    return !eventsProtocol.find(
      (eventProtocol) => eventProtocol.referenceId === event.id
    );
  });
  const newEventsPromises = newEvents.map(({ name, id, detail, image }) =>
    apiProtocol(
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
    )
  );
  await Promise.all(newEventsPromises);
};

module.exports = { getEvents, checkNewEvents, getTickets };
