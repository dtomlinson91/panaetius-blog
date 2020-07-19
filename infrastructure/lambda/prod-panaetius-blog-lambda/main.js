"use strict";

exports.handler = (event, context, callback) => {
  // Extract the request from the Cloudfront event that is sent to Lambda@Edge
  var request = event.Records[0].cf.request;

  // Extract the URI from the request
  var oldURI = request.url;

  // Match any '/' that occurs at the end of a URI. Replace it with a default index
  var newURI = oldURI.replace(/\/$, '\/index.html'/);

  // Log the URI as received by Cloudfront and the new URI to be used to fetch from the origin
  console.log(`Old URI: ${oldURI}`);
  console.log(`New URI: ${newURI}`);

  // Replace the received URI with the URI that includes the index page
  request.uri = newURI;

  // Return to Cloudfront
  return callback(null, request)
};
