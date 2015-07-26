mysql -u $1 -p < ./server/reset_db.sql
mysql -u $1 -p < ./server/procedures.sql
