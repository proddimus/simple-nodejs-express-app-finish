
Feature: web server responds with a HTTP response code

  The web server in front of my service must behave just like any other web server and any
  response must include a HTTP response code in the header.

  Scenario: When the endpoint does not exist
    When I call a non-existent endpoint
    Then I get a Not Found error

  Scenario: When the endpoint does exist
    When I call an existent endpoint
    Then I do not get a Not Found error