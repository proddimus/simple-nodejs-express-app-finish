
When("I record a location for a song") do
  @payload = {
    'location' => '50.00, 25.00',
    'song_id'  =>  1
  }
  @response = HTTParty.post( 
    'http://localhost:3000/songLocation', 
    body: @payload.to_json,
    headers: { 'Content-Type' => 'application/json' } ) 
end

Then("The location I like to listen to that song is stored") do
  @validation_response = HTTParty.get( 'http://localhost:3000/songLocation' )
  @locations = JSON.parse( @validation_response.body )
  # we have to do this step to workaround an API issue
  @locations.each { |location| location.delete( 'song_location_id' ) }
  expect( @locations ).to include( @payload )
end
