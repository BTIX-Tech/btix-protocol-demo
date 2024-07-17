const { apiProtocol } = require('./api');

const checkNewTickets = async (tickets) => {
  const { results: eventsProtocol } = await apiProtocol('public/events');
  const ticketsPromises = eventsProtocol.map((event) =>
    apiProtocol(`events/${event.id}/tickets`)
  );
  const ticketsProtocol = await Promise.all(ticketsPromises);
  const newTickets = tickets.filter((ticket) => {
    return !ticketsProtocol.find((ticketProtocol) => {
      if (ticketProtocol.referenceId === ticket.id) {
        ticket.protocolId = ticketProtocol.event;
        return true;
      }
    });
  });
  const newTicketsPromises = newTickets.map(({ id, buyer_email, protocolId }) =>
    apiProtocol(
      `events/${protocolId}/tickets`,
      'post',
      JSON.stringify({
        referenceId: id,
        owner: buyer_email,
        data: {
          price: 10,
        },
        metadata: {
          name: 'Não tem mano',
          description: 'Faz um pix pra mim?',
          image:
            'https://btix.app/wp-content/uploads/2024/01/capa-video-home.jpg',
          external_link: 'https://www.sympla.com.br/',
          traits: [
            {
              trait_type: 'Nome',
              value: 'VITRIGO',
            },
            {
              trait_type: 'Email',
              value: 'VISOJA',
            },
          ],
        },
      })
    )
  );
  await Promise.all(newTicketsPromises);
};

module.exports = { checkNewTickets };
