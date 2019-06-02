const readline = require(`readline`);
const data = require("./data.json");

// Checks if a node matches the given query
const checkForMatch = (node, query) => {
  // check if class matches
  if (query === node.class) return true;
  // check if class names match
  const isClass = query[0] === `.`;
  const isClassMatch = node.classNames && node.classNames.includes(query.slice(1));
  if (isClass && isClassMatch) return true;
  // check for identifier match
  const isId = query[0] === `#`;
  const isIdMatch = query.slice(1) === node.identifier;
  if (isId && isIdMatch) return true;
  // if no matches return false
  return false;
};

// Initialize CLI
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
  console.log(checkForMatch(data.subviews[0], input));
  console.log(`Enter another selector to search again:`);
});
