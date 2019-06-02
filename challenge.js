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

// flattens a single level array
const flatten = arr => arr.reduce((acc, val) => acc.concat(val), []);

// collects an array values for each node in tree, JSON for matches and empty strings for non matches
const collectMatches = (node, query) => {
  const currMatch = checkForMatch(node, query) ? [node] : [``];
  // base case: no more subviews
  if (!node.subviews && !node.contentView) {
    return currMatch;
  }
  // recurse down through subviews
  const subviews = node.subviews || node.contentView.subviews;
  return subviews
    .map(subview => flatten(collectMatches(subview, query)))
    .concat(currMatch);
};

// finds an array of matching nodes
const findMatches = (node, query) => {
  const results = flatten(collectMatches(node, query));
  return results.filter(result => result !== "");
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
  console.log(findMatches(data, input));
  console.log(`Enter another selector to search again:`);
});
