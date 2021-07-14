#!/bin/bash

FORCE=false
OUTDATED=true
while [ $1 ]
do
  echo $1
  if [ "$1" == "-f" ]; then
    FORCE=true
  fi
  if [ "$1" == "-o" ]; then
    OUTDATED=false
  fi
  shift
done

echo "*** Do a git pull and deploy -f if you've updated deploy.sh! ***"

REPO="https://github.com/hogsmill/assessment.git"
APPS=(
  'five-dysfunctions,fiveDysfunctionsServer,fiveDysfunctionsTeams,fiveDysfunctionsQuestions,fiveDysfunctionsAssessments,3038,5 Dysfunctions,5 Dysfunctions'
  'five-dysfunctions-new,fiveDysfunctionsNewServer,fiveDysfunctionsNewTeams,fiveDysfunctionsNewQuestions,fiveDysfunctionsNewAssessments,3040,5 Dysfunctions,5 Dysfunctions New'
  'team-health-check,healthCheckServer,healthCheckTeams,healthCheckQuestions,healthCheckAssessments,3039,Team Health Check,Team Health Check'
  'team-health-check-new,healthCheckNewServer,healthCheckNewTeams,healthCheckQuestionsNew,healthCheckNewAssessments,3041,Team Health Check,Team Health Check New'
)

for ((i = 0; i < ${#APPS[@]}; i++))
do
  REC="${APPS[$i]}"

  APP=`echo $REC | cut -d, -f1`
  SERVERCOLLECTION=`echo $REC | cut -d, -f2`
  TEAMSCOLLECTION=`echo $REC | cut -d, -f3`
  QUESTIONCOLLECTION=`echo $REC | cut -d, -f4`
  ASSESSMENTSCOLLECTION=`echo $REC | cut -d, -f5`
  PORT=`echo $REC | cut -d, -f6`
  APPTYPE=`echo $REC | cut -d, -f7`
  APPNAME=`echo $REC | cut -d, -f8`

  echo "------------------------------------------------"
  if [ -z "$APPNAME" ]; then
    echo "Installing $APPTYPE:$APP ($SERVERCOLLECTION, $TEAMSCOLLECTION, $QUESTIONCOLLECTION, $ASSESSMENTSCOLLECTION, $PORT)"
  else
    echo "Installing $APPTYPE:$APP ($SERVERCOLLECTION, $TEAMSCOLLECTION, $QUESTIONCOLLECTION, $ASSESSMENTSCOLLECTION, $PORT, $APPNAME)"
  fi
  echo "------------------------------------------------"

  DIR="/usr/apps/$APP"
  if [ ! -d $DIR ]; then
    git clone $REPO $DIR
  fi
  ENVFILE="$DIR/.env"
  echo "VUE_APP_PORT=$PORT" > $ENVFILE
  echo "VUE_APP_TYPE=$APPTYPE" >> $ENVFILE
  echo "VUE_APP_SERVER_COLLECTION=$SERVERCOLLECTION" >> $ENVFILE
  echo "VUE_APP_TEAMS_COLLECTION=$TEAMSCOLLECTION" >> $ENVFILE
  echo "VUE_APP_QUESTION_COLLECTION=$QUESTIONCOLLECTION" >> $ENVFILE
  echo "VUE_APP_ASSESSMENTS_COLLECTION=$ASSESSMENTSCOLLECTION" >> $ENVFILE
  if [ ! -z "$APPNAME" ]; then
    echo "VUE_APP_NAME=$APPNAME" >> $ENVFILE
  fi

  cd $DIR

  PWD=`pwd`
  APP=`basename $PWD`
  git stash
  GIT=`git pull`
  echo $GIT
  if [ "$FORCE" != "true" -a "$GIT" == "Already up to date." ]; then
    exit 0
  fi

  npm install --legacy-peer-deps
  npm run build
  if [ ! -d /var/www/html/$APP/ ]; then
    mkdir /var/www/html/$APP
  fi
  if [ -d /var/www/html/$APP/css ]; then
    rm /var/www/html/$APP/css/*
  else
    mkdir /var/www/html/$APP/css
  fi
  if [ -d /var/www/html/$APP/js ]; then
    rm /var/www/html/$APP/js/*
  else
    mkdir /var/www/html/$APP/js
  fi
  cp -R dist/* /var/www/html/$APP
  if [ -f "src/server.js" ]; then
    SERVER=`ps -ef | grep server.js | grep "/$APP/" | awk {'print $2'}`
    if [ "$SERVER" != "" ]; then
      kill -9 $SERVER
    fi
  fi

done

if [ "$OUTDATED" == "true" ]; then
  php /usr/apps/monitor/src/lib/outdated.php &
fi
