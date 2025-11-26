local tables = {}

tables.pois = osm2pgsql.define_table({
    name = 'pois',
    ids = { type = 'node', id_column = 'osm_id' },
    columns = {
        { column = 'name', type = 'text' },
        { column = 'category', type = 'text' },
        { column = 'subcategory', type = 'text' },
        { column = 'tags', type = 'jsonb' },
        { column = 'geom', type = 'point', projection = 4326, not_null = true },
    }
})

-- Helper to clean tags
function clean_tags(tags)
    local result = {}
    for k, v in pairs(tags) do
        if not (k:find('^osm_') or k:find('^source') or k:find('^created_by')) then
            result[k] = v
        end
    end
    return result
end

-- Process POIs
function process_poi(object)
    -- Removed strict name check for debugging
    -- if not object.tags.name then return end 

    local category = nil
    local subcategory = nil

    -- Food
    if object.tags.amenity and (object.tags.amenity == 'restaurant' or object.tags.amenity == 'cafe' or object.tags.amenity == 'bar' or object.tags.amenity == 'pub' or object.tags.amenity == 'fast_food') then
        category = 'Food'
        subcategory = object.tags.amenity
    elseif object.tags.shop and (object.tags.shop == 'bakery' or object.tags.shop == 'supermarket' or object.tags.shop == 'convenience') then
        category = 'Food'
        subcategory = object.tags.shop
    end

    -- Health
    if object.tags.amenity and (object.tags.amenity == 'hospital' or object.tags.amenity == 'pharmacy' or object.tags.amenity == 'clinic' or object.tags.amenity == 'doctors') then
        category = 'Health'
        subcategory = object.tags.amenity
    end

    -- Transport
    if object.tags.amenity and (object.tags.amenity == 'fuel' or object.tags.amenity == 'parking') then
        category = 'Transport'
        subcategory = object.tags.amenity
    elseif object.tags.railway and (object.tags.railway == 'station') then
        category = 'Transport'
        subcategory = 'station'
    end

    -- Education
    if object.tags.amenity and (object.tags.amenity == 'school' or object.tags.amenity == 'university' or object.tags.amenity == 'library') then
        category = 'Education'
        subcategory = object.tags.amenity
    end
    
    -- Entertainment
    if object.tags.amenity and (object.tags.amenity == 'cinema' or object.tags.amenity == 'theatre') then
        category = 'Entertainment'
        subcategory = object.tags.amenity
    elseif object.tags.leisure and (object.tags.leisure == 'park') then
        category = 'Entertainment'
        subcategory = 'park'
    end

    -- Shopping
    if object.tags.shop and (object.tags.shop == 'mall' or object.tags.shop == 'clothes' or object.tags.shop == 'electronics') then
        category = 'Shopping'
        subcategory = object.tags.shop
    end

    -- Tourism
    if object.tags.tourism and (object.tags.tourism == 'hotel' or object.tags.tourism == 'museum' or object.tags.tourism == 'attraction') then
        category = 'Tourism'
        subcategory = object.tags.tourism
    end

    -- DEBUG: Catch-all for any amenity if not categorized yet
    if not category and object.tags.amenity then
        category = 'Other'
        subcategory = object.tags.amenity
    end

    if category then
        tables.pois:insert({
            name = object.tags.name or 'Unknown',
            category = category,
            subcategory = subcategory,
            tags = clean_tags(object.tags),
            geom = object:as_point()
        })
    end
end

osm2pgsql.process_node = process_poi
-- osm2pgsql.process_way = process_poi -- Disabled for now to test node table type

