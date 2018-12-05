Feature: Storing and retrieving the locations I like songs

  As a user, I want to be able to record the locations I like to listen
  to particular songs

  Scenario: Creating a location for a track
    When I record a location for a song
    Then The location I like to listen to that song is stored