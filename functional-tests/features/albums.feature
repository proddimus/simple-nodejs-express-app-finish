Feature: My Favourite Albums

  People want to be able to get a list of all of their favourite albums so that they can
  compare their musical tastes with other people.

  Scenario: Listing all albums
    Given I ask for a list of all albums
     Then I will receive a machine-readable response
      And It will contain a list of my favourite albums