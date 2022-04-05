#/bin/bash

# run this script with cron
# crontab -e and add the following line:
# 0 */6 * * * /path/to/backup.sh
# where /path/to/backup.sh is the path to this script
# and 6 is the number of hours between backups

Date=`date +%Y-%m-%d-%H-%M-%S`
docker exec backend_mongo_1 mongodump --db daoportal --archive=/backup/backup_$Date.gz --gzip
docker cp backend_mongo_1:/backup .
docker exec backend_mongo_1 rm -rf /backup/backup_$Date.gz

# backup to bucket
gsutil cp -r ./backup/backup_$Date.gz gs://portalbo_back