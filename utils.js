
function doIntervalsOverlap (interval1, interval2) {
  let [start1, end1] = interval1;
  let [start2, end2] = interval2;

  let overlapAmount = Math.max(0, Math.min(end1, end2) - Math.max(start1, start2));
  return overlapAmount > 0;
}

function isClose (a, b, relTol = 1e-14, abs_tol = 0.0) {
  return Math.abs(a - b) <= Math.max(relTol * Math.max(Math.abs(a), Math.abs(b)), abs_tol)
}

function sortCompareEntriesByTime (x, y) {
  return x[0] - y[0];
}

function entryListToTree (entryList) {
  /*
  Builds a balanced binary tree from an entry list for quickly finding things at certain times

  entryList can consist of intervals or points in time
  Each node has a left and right branch;
    - nodes in the left branch occur in time before the start time in this node
    - nodes in the right branch occur in time after the stop time in this node
  */
  entryList.sort(sortCompareEntriesByTime);
  let rootNode = recEntryListToTree(entryList);
  return rootNode;
}

function recEntryListToTree (entryList) {
  /*
  Recursively builds a balanced binary tree
  */
  let currentNode = null;
  if (entryList.length > 0) {
    let i = Math.floor(entryList.length / 2);
    let entry = entryList[i];
    currentNode = { 'entry': entry, 'left': null, 'right': null };
    currentNode['left'] = recEntryListToTree(entryList.slice(0, i));
    currentNode['right'] = recEntryListToTree(entryList.slice(i + 1, entryList.length + 1));
  }

  return currentNode;
}

function findIntervalAtTime (time, rootNode) {
  /*
  Given a pre-compiled search tree and a time, returns the interval at that time
  */
  let currNode = rootNode;
  let matchNode = null;
  while (currNode !== null) {
    if (currNode.entry[0] <= time && currNode.entry[1] >= time) {
      matchNode = currNode;
      break;
    }
    else if (currNode.entry[0] > time) {
      currNode = currNode.left;
    }
    else {
      currNode = currNode.right;
    }
  }

  return matchNode ? matchNode.entry : null;
}

function findPointAtTime (time, rootNode, findClosest = false) {
  /*
  Given a pre-compiled search tree and a time, returns the point at that time

  If findClosest is true, return the entryList point that is closest to this time, even if its not an exact match.  By default, only search for exact matches.
  */
  let currNode = rootNode;
  let matchNode = null;
  let closestNode = rootNode;
  while (currNode !== null) {
    let newDiff = Math.abs(currNode.entry[0] - time);
    let oldDiff = Math.abs(closestNode.entry[0] - time);
    if (newDiff <= oldDiff) {
      // In the case two values are equidistant from the target time
      // choose the earlier of the  values
      if (newDiff !== oldDiff || currNode.entry[0] < closestNode.entry[0]) {
        closestNode = currNode;
      }
    }
    if (currNode.entry[0] === time) {
      matchNode = currNode;
      break;
    }
    else if (currNode.entry[0] > time) {
      currNode = currNode.left;
    }
    else {
      currNode = currNode.right;
    }
  }

  if (findClosest === true && matchNode === null) {
    matchNode = closestNode;
  }

  return matchNode ? matchNode.entry : null;
}

export { doIntervalsOverlap, isClose, sortCompareEntriesByTime, entryListToTree, findIntervalAtTime, findPointAtTime };
