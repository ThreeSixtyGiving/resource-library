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

File.open("source/_data/categories.yml", "w") do |f|
  data = []
  @categories.each { |category| data.push(category.attributes) }
  f.write(data.to_yaml)
end

@categoriesObject = {}
File.open("source/_data/categories_objects.yml", "w") do |f|
  @categories.each { |category| @categoriesObject[category.attributes["id"]] = category.attributes.except!("id") }
  f.write(@categoriesObject.to_yaml)
end

File.open("source/_data/resources.yml", "w") do |f|
  data = []
  @resources.each do | resource |
    resource.attributes["category"] = resource.attributes["category"].map { |categoryId| @categoriesObject[categoryId]["name"] }
    data.push(resource.attributes)
  end
  f.write(data.to_yaml)
end

File.open("source/_data/resources_objects.yml", "w") do |f|
  data = {}
  @resources.each do | resource |
    # resource.attributes["category"] = resource.attributes["category"].map { |categoryId| @categoriesObject[categoryId]["name"] }
    data[resource.attributes["id"]] = resource.attributes.except("id")
  end
  f.write(data.to_yaml)
end