const readline = require(`readline`);

const cli = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

cli.write(`Enter Q or ctrl + c to quit.\nEnter a selector to continue:\n`);

cli.on(`line`, input => {
  if (input == "Q") {
    cli.close();
    return;
  }
  console.log(input);
  console.log(`Enter another selector to search again:`);
});
