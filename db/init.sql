CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS pgrouting;

CREATE OR REPLACE FUNCTION public.find_shortest_path(
    start_lat double precision,
    start_lon double precision,
    end_lat double precision,
    end_lon double precision)
    RETURNS TABLE(agg_cost double precision, geom_way geometry) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
DECLARE
    start_node INT;
    end_node INT;
    start_geom geometry;
    end_geom geometry;
BEGIN
    -- Convert the input coordinates to the same SRID as the roads table (SRID 4326 for WGS 84)
    start_geom := ST_SetSRID(ST_MakePoint(start_lon, start_lat), 4326);
    end_geom := ST_SetSRID(ST_MakePoint(end_lon, end_lat), 4326);

    -- Find the closest start node by selecting the nearest point on the road network
    SELECT source INTO start_node
    FROM hh_2po_4pgr r
    ORDER BY ST_Distance(start_geom, ST_ClosestPoint(r.geom_way, start_geom))
    LIMIT 1;

    -- Find the closest end node by selecting the nearest point on the road network
    SELECT target INTO end_node
    FROM hh_2po_4pgr r
    ORDER BY ST_Distance(end_geom, ST_ClosestPoint(r.geom_way, end_geom))
    LIMIT 1;

    -- Ensure the start and end nodes are valid before running pgr_dijkstra
    IF start_node IS NULL OR end_node IS NULL THEN
        RAISE EXCEPTION 'No valid start or end node found';
    END IF;

    -- Use pgr_dijkstra to calculate the shortest path from the start node to the end node
    RETURN QUERY
    SELECT 
        pt.agg_cost, 
        r.geom_way
    FROM pgr_dijkstra(
        'SELECT id, source, target, cost FROM hh_2po_4pgr', 
        start_node, 
        end_node, 
        directed := false
    ) AS pt
    JOIN hh_2po_4pgr AS r ON r.id = pt.edge
    WHERE pt.edge IS NOT NULL;

    -- If no path is found, return NULLs with proper type casting
    IF NOT FOUND THEN
        RETURN QUERY SELECT NULL::double precision, NULL::geometry;
    END IF;

END;
$BODY$;

ALTER FUNCTION public.find_shortest_path(double precision, double precision, double precision, double precision)
    OWNER TO tripplanner;