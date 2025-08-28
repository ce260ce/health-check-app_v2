#!/bin/bash
echo "🔁 mongoimport 開始"

# MongoDB が起動するまで待機
until mongo --host localhost --eval "print(\"waited for connection\")"
do
  echo "⏳ MongoDB の起動待ち中..."
  sleep 2
done

declare -A files=(
  [bulletins]="healthcheck.bulletins.json"
  [names]="healthcheck.names.json"
  [tasks]="healthcheck.tasks.json"
  [links]="healthcheck.links.json"
  [health]="healthcheck.health.json"
)

for collection in "${!files[@]}"; do
  file="${files[$collection]}"
  echo "📥 importing $file into $collection"
  mongoimport \
    --host localhost \
    --db=healthcheck \
    --collection=$collection \
    --jsonArray \
    --file="/docker-entrypoint-initdb.d/$file" \
    || echo "⚠️  $file の import に失敗しました"
done

echo "✅ mongoimport 完了"
