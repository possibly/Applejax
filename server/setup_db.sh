mysql -u $1 -p < ./server/sql/reset_db.sql
mysql -u $1 -p < ./server/sql/procedures.sql
