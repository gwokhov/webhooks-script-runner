cd /root/demo/

pm2 stop demo

git reset --hard origin/master

git clean -f

git pull origin master

yarn

npm run build

pm2 start demo