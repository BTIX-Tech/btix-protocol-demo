const { getEventsSympla, checkNewEvents, getTickets, getEventsProtocol } = require("./events");
const { checkNewTickets } = require("./tickets");

/**
 * Display header information for the BTIX Protocol Demo.
 */
const displayHeader = () => {
  console.clear()
  console.log("=======================================");
  console.log("");
  console.log(" BTIX PROTOCOL DEMO");
  console.log(
    " This project is a demo showcasing the use of the Protocol API."
  );
  console.log("");
  console.log("=======================================");
  console.log("");
};

// Call the displayHeader function to show the header
displayHeader();

/**
 * Main function to run the synchronization process.
 * Fetches events and tickets from Sympla and synchronizes them with the Protocol API.
 */
const run = async () => {
  try {
    // await checkNewEvents();
    await checkNewTickets();

    console.log("Process completed successfully.");
  } catch (error) {
    console.error(`Error in run: ${error.message}`);
  }
};

run();
