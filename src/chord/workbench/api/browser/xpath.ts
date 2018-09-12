'use strict';

const XPathResult = (<any>window).XPathResult;


/**
 * https://developer.mozilla.org/en-US/docs/Web/API/Document/evaluate
 *
 * var xpathResult = document.evaluate(
 *     xpathExpression,
 *     contextNode,
 *     namespaceResolver,
 *     resultType,
 *     result
 * );
 *
 * xpathExpression is a string representing the XPath to be evaluated.
 * contextNode specifies the context node for the query (see the XPath specification). 
 * It's common to pass document as the context node.
 * namespaceResolver is a function that will be passed any namespace prefixes
 * and should return a string representing the namespace URI associated with that prefix.
 * It will be used to resolve prefixes within the XPath itself, so that they can be matched with the document.
 * null is common for HTML documents or when no namespace prefixes are used.
 * resultType is an integer that corresponds to the type of result XPathResult to return.
 * Use named constant properties, such as XPathResult.ANY_TYPE,
 * of the XPathResult constructor, which correspond to integers from 0 to 9.
 * result is an existing XPathResult to use for the results.
 * null is the most common and will create a new XPathResult
 *
 * ## Link to sectionResult types
 * | Result Type                    | Value | Description                                                  |
 * | ------------------------------ | ----- | ------------------------------------------------------------ |
 * | `ANY_TYPE`                     | 0     | Whatever type naturally results from the given expression.   |
 * | `NUMBER_TYPE`                  | 1     | A result set containing a single number. Useful, for example, in an XPath expression using the `count()` function. |
 * | `STRING_TYPE`                  | 2     | A result set containing a single string.                     |
 * | `BOOLEAN_TYPE`                 | 3     | A result set containing a single boolean value. Useful, for example, an an XPath expression using the `not()` function. |
 * | `UNORDERED_NODE_ITERATOR_TYPE` | 4     | A result set containing all the nodes matching the expression. The nodes in the result set are not necessarily in the same order they appear in the document. |
 * | `ORDERED_NODE_ITERATOR_TYPE`   | 5     | A result set containing all the nodes matching the expression. The nodes in the result set are in the same order they appear in the document. |
 * | `UNORDERED_NODE_SNAPSHOT_TYPE` | 6     | A result set containing snapshots of all the nodes matching the expression. The nodes in the result set are not necessarily in the same order they appear in the document. |
 * | `ORDERED_NODE_SNAPSHOT_TYPE`   | 7     | A result set containing snapshots of all the nodes matching the expression. The nodes in the result set are in the same order they appear in the document. |
 * | `ANY_UNORDERED_NODE_TYPE`      | 8     | A result set containing any single node that matches the expression. The node is not necessarily the first node in the document that matches the expression. |
 * | `FIRST_ORDERED_NODE_TYPE`      | 9     | A result set containing the first node in the document that matches the expression. |
 */
export function xpathSelect(xpath: string, startNode: HTMLElement = null): any[] {
    let els: Node[] = [];

    // browser global
    let iter = document.evaluate(xpath, startNode || document, null, XPathResult.ANY_TYPE, null);
    while (true) {
        let el = iter.iterateNext();
        if (el === null) {
            break;
        }
        els.push(el);
    }
    return els;
}
