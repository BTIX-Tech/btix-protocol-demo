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
  const [ticketsSympla] = await Promise.all(ticketsSymplaPromises);
  if (ticketsSympla.length === 0)
    return console.log("No tickets found in Sympla.");

  // Step 2.1
  const eventsProtocol = await getEventsProtocol();

  // Step 2.2
  const ticketsProtocolPromises = eventsProtocol.map((event) =>
    apiProtocol(`events/${event.id}/tickets`)
  );
  const ticketsProtocol = (await Promise.all(ticketsProtocolPromises)) || [[]];

  // Step 3
  const newTickets = ticketsSympla.filter((ticketSympla) => {
    const eventProtocolId = eventsProtocol.find(
      (event) => String(event.referenceId) === String(ticketSympla.event_id)
    ).id;

    return !ticketsProtocol.find((ticketProtocol) => {
      ticketSympla.eventProtocolId = eventProtocolId;

      if (ticketProtocol.referenceId === ticketSympla.id) {
        return true;
      }
    });
  });

  // Step 4
  const newTicketsPromises = newTickets.map(
    ({ id, buyer_email, eventProtocolId }) =>
      apiProtocol(
        `events/${eventProtocolId}/tickets`,
        "post",
        JSON.stringify({
          referenceId: id,
          owner: buyer_email,
          data: {
            price: 10,
          },
          metadata: {
            name: "Não tem mano",
            description: "Faz um pix pra mim?",
            image:
              "https://btix.app/wp-content/uploads/2024/01/capa-video-home.jpg",
            external_link: "https://www.sympla.com.br/",
            traits: [
              {
                trait_type: "Nome",
                value: "VITRIGO",
              },
              {
                trait_type: "Email",
                value: "VISOJA",
              },
            ],
          },
        })
      )
  );
  await Promise.all(newTicketsPromises);
};

module.exports = { checkNewTickets };
