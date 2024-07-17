const { getEvents, checkNewEvents, getTickets } = require('./events');
const { checkNewTickets } = require('./tickets');

const run = async () => {
  try {
    const events = await getEvents();
    await checkNewEvents(events);

    const ticketsPromises = events.map((event) => getTickets(event.id));
    const tickets = await Promise.all(ticketsPromises);
    await checkNewTickets(tickets.flat());

    console.log('Process completed successfully.');
  } catch (error) {
    console.error(`Error in run: ${error.message}`);
  }
};

run();
