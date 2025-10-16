#!/bin/bash
docker-compose down -v
docker-compose up -d --build
echo 'Waiting 20s...'
sleep 20
echo 'API root:'
curl -s http://localhost:3000/
echo

echo 'DB tables:'
docker-compose exec -T tab_postgres psql -U postgres -d tra_api -c "\dt"
