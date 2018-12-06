
When(/I call (?:a|an) (non-existent|existent) endpoint/) do |endpoint_type|
  if endpoint_type == 'non-existent'
    @response = HTTParty.get( 'http://localhost:3000/nobody_home' )
  else
    @response = HTTParty.get( 'http://localhost:3000' )
  end
end

Then("I get a Not Found error") do
  expect( @response.code ).to eql 404
end

Then("I do not get a Not Found error") do
  expect( @response.code ).not_to eql 404
end
