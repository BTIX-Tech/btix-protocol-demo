const { apiProtocol, apiSympla } = require("./api");
const { getEventsSympla, getEventsProtocol } = require("./events");

/**
 * Function to get tickets for a specific event from the Sympla API.
 * @param {number} eventId - The ID of the event.
 * @returns {Promise<Array>} - The list of tickets for the event.
 */
const getTicketsSympla = async (eventId) => {
  const { data } = await apiSympla(`events/${eventId}/orders`, 3);
  return data || [];
};

/**
 * Function to get tickets for a specific event from the Protocol API.
 * @param {number} eventId - The ID of the event.
 * @returns {Promise<Array>} - The list of tickets for the event.
 */
const getTicketsProtocol = async (eventId) => {
  const { results } = await apiProtocol(`events/${eventId}/tickets`);
  return results || [];
};

/**
 * Function to check for new tickets and add them to the Protocol API.
 * @param {Array} tickets - The list of tickets from Sympla.
 */
const checkNewTickets = async () => {
  // Step 1.1
  const eventsSympla = await getEventsSympla();

  // Step 1.2
  const ticketsSymplaPromises = eventsSympla.map((event) =>
    getTicketsSympla(event.id)
  );
  const ticketsSympla = (await Promise.all(ticketsSymplaPromises)).flat();
  if (ticketsSympla.length === 0)
    return console.log("No tickets found in Sympla.");

  // Step 2.1
  const eventsProtocol = await getEventsProtocol();

  const eventsProtocolCompleted = eventsProtocol.filter(
    (e) => e.status === "completed"
  );
  if (eventsProtocolCompleted.length === 0)
    return console.log("No completed events found in Protocol.");

  // Step 2.2
  const ticketsProtocolPromises = eventsProtocolCompleted.map((e) =>
    getTicketsProtocol(e.id)
  );
  const ticketsProtocol = (await Promise.all(ticketsProtocolPromises)).flat();

  // Step 3
  const newTickets = ticketsSympla.filter((ticketSympla) => {
    const eventProtocolId = eventsProtocolCompleted.find(
      (event) => String(event.referenceId) === String(ticketSympla.event_id)
    ).id;

    ticketSympla.eventProtocolId = eventProtocolId;

    return !ticketsProtocol.find((ticketProtocol) => {
      if (String(ticketProtocol.referenceId) === String(ticketSympla.id)) {
        return true;
      }
    });
  });

  // Step 4
  for (let ticket of newTickets) {
    const { id, buyer_email, eventProtocolId, event_id } = ticket;

    console.log(`Adding new ticket to Protocol API: ${id}`);

    const { data } = await apiSympla(
      `events/${event_id}/orders/${id}/participants`,
      3
    );
    const { ticket_name } = data[0];

    await apiProtocol(
      `events/${eventProtocolId}/tickets`,
      "post",
      JSON.stringify({
        referenceId: id,
        owner: buyer_email,
        data: {
          price: 10,
        },
        metadata: {
          name: ticket_name,
          description: "lorem ipsum",
          image:
            "https://btix.app/wp-content/uploads/2024/01/capa-video-home.jpg",
          external_link: "https://www.sympla.com.br/",
          traits: [
            {
              trait_type: "Category",
              value: ticket_name || "Ticket name",
            },
          ],
        },
      })
    );

    console.log(`Ticket ${id} added to Protocol API.`);
    console.log("");
  }
};

module.exports = { checkNewTickets };
