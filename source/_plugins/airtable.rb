require 'yaml'
require 'airtable'
require 'active_support/all'

@client = Airtable::Client.new("keyDicyKIwz9kuScP")

@resourcesTable = @client.table("appj9qNC7jiu1tphD", "Resources")
@categoriesTable = @client.table("appj9qNC7jiu1tphD", "Categories")

@resources = @resourcesTable.select({
  filterByFormula: "Published",
  fields: ["#", "Your Name", "Resource Name", "Resource URL", "Resource Description", "Resource Image", "Why would you recommend it?", "Who is using it?", "Category"],
  sort: ["#", :desc]
})

@categories = @categoriesTable.select({
  fields: ["Name"]
})

File.open("source/_data/resources.yml", "w") do |f|
  data = []
  @resources.each { |resource| data.push(resource.attributes) }
  f.write(data.to_yaml)
end

File.open("source/_data/resources_objects.yml", "w") do |f|
  data = {}
  @resources.each { |resource| data[resource.attributes["id"]] = resource.attributes.except!("id") }
  f.write(data.to_yaml)
end

File.open("source/_data/categories.yml", "w") do |f|
  data = []
  @categories.each { |category| data.push(category.attributes) }
  f.write(data.to_yaml)
end

File.open("source/_data/categories_objects.yml", "w") do |f|
  data = {}
  @categories.each { |category| data[category.attributes["id"]] = category.attributes.except!("id") }
  f.write(data.to_yaml)
end