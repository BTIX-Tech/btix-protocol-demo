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

  // Step 3
  if (newEvents.length === 0) return;
  await apiProtocol(
    "events",
    "post",
    JSON.stringify({
      name: newEvents[0].name,
      referenceId: newEvents[0].id,
      data: {
        minimumPrice: 4.5,
        symbol: "DEMO",
        royaltieFee: 10,
      },
      metadata: {
        name: newEvents[0].name,
        description: newEvents[0].detail,
        image: newEvents[0].image,
        banner_image: newEvents[0].image,
        featured_image: newEvents[0].image,
      },
    })
  );

  // const newEventsPromises = newEvents.map(({ name, id, detail, image }) =>
  //   apiProtocol(
  //     "events",
  //     "post",
  //     JSON.stringify({
  //       name,
  //       referenceId: id,
  //       data: {
  //         minimumPrice: 4.5,
  //         symbol: "DEMO",
  //         royaltieFee: 10,
  //       },
  //       metadata: {
  //         name,
  //         description: detail,
  //         image,
  //         banner_image: image,
  //         featured_image: image,
  //       },
  //     })
  //   )
  // );
  // await Promise.all(newEventsPromises);
};

module.exports = { getEventsSympla, checkNewEvents, getEventsProtocol };
