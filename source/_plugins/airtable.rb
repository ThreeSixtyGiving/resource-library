require 'yaml'
require 'airtable'
require 'active_support/all'

@client = Airtable::Client.new("keyDicyKIwz9kuScP")

@resourcesTable = @client.table("appj9qNC7jiu1tphD", "Resources")
@categoriesTable = @client.table("appj9qNC7jiu1tphD", "Categories")
@tagsTable = @client.table("appj9qNC7jiu1tphD", "Tags")

@resources = @resourcesTable.select({
  filterByFormula: "Published",
  fields: ["#", "Your Name", "Resource Name", "Resource URL", "Resource Description", "Resource Image", "Why is this resource useful?", "Who is this resource useful for?", "What is it good for?", "Category", "Tags"],
  sort: ["#", :desc]
})

@categories = @categoriesTable.select({
  fields: ["Name"]
})

@tags = @tagsTable.select({
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

File.open("source/_data/tags.yml", "w") do |f|
  data = []
  @tags.each { |tag| data.push(tag.attributes) }
  f.write(data.to_yaml)
end

@tagsObject = {}
File.open("source/_data/tags_objects.yml", "w") do |f|
  @tags.each { |tag| @tagsObject[tag.attributes["id"]] = tag.attributes.except!("id") }
  f.write(@tagsObject.to_yaml)
end

File.open("source/_data/resources.yml", "w") do |f|
  data = []
  @resources.each do | resource |
    if resource.attributes["category"] then
      resource.attributes["category"] = resource.attributes["category"].map { |categoryId| @categoriesObject[categoryId]["name"] }
    end
    if resource.attributes["tags"] then
      resource.attributes["tags"] = resource.attributes["tags"].map { |tagId| @tagsObject[tagId]["name"] }
    end
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