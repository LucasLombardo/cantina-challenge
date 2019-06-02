const readline = require(`readline`);
const data = require(`./data.json`);

// Checks if a node matches the given query
const checkForMatch = (node, query) => {
  // check if class matches
  if (query === node.class) return true;

  // check if classNames match
  const isClass = query[0] === `.`;
  const isClassMatch = node.classNames && node.classNames.includes(query.slice(1));
  if (isClass && isClassMatch) return true;

  // check if identifier matches
  const isId = query[0] === `#`;
  const isIdMatch = query.slice(1) === node.identifier;
  if (isId && isIdMatch) return true;

  // if no matches found return false
  return false;
};

// Helper function to flatten a single level array
const flatten = arr => arr.reduce((acc, val) => acc.concat(val), []);

// Collects all matches to a given query and empty strings for non-matching nodes
const collectMatches = (node, query) => {
  // set current node to an empty string if it isn't a match
  const currNode = checkForMatch(node, query) ? [node] : [``];

  // base case: no more subviews to traverse
  // (subviews can be in 3 buckets, `subviews`, `contentView`, or `control`)
  if (!node.subviews && !node.contentView && !node.control) {
    return currNode;
  }

  // recurse down through subviews, adding current node to result
  const contentView = node.contentView && node.contentView.subviews;
  const subviews = node.subviews || contentView || [node.control];
  return subviews
    .map(subview => flatten(collectMatches(subview, query)))
    .concat(currNode);
};

// Returns an array matching nodes for a given query
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
  // quit CLI
  if (input == "Q") {
    cli.close();
    return;
  }
  // find matches
  const matches = findMatches(data, input);
  console.log(`\nResults for "${input}":\n`);
  console.log(matches);
  console.log(`\nYour search returned ${matches.length} matches.\n`);
  console.log(`Enter Q or ctrl + c to quit.\nEnter another selector to search again:`);
});
