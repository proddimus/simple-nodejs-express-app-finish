When("I ask for a list of all albums") do
  @response = HTTParty.get( 'http://localhost:3000/album' )
end

Then("I will receive a machine-readable response") do
  expect{ @json = JSON.parse( @response.body ) }.not_to raise_error
end

Then("It will contain a list of my favourite albums") do
  expect( @json ).to be_a_kind_of( Array )
  expect( @json ).not_to be_empty
end
