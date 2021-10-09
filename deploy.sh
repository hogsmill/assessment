#!/bin/bash

FORCE=false
NEW=false
while [ $1 ]
do
  echo $1
  if [ "$1" == "-f" ]; then
    FORCE=true
  fi
  if [ "$1" == "-n" ]; then
    NEW=true
  fi
  shift
done

echo "----------------------------------------------------------------"
echo "*** Note: Do a git pull and deploy -f if you've updated deploy.sh! ***"
echo "----------------------------------------------------------------"

REPO="https://github.com/hogsmill/assessment.git"
MAINAPP="assessment"
APPS=(
  'five-dysfunctions,fiveDysfunctionsServer,fiveDysfunctionsTeams,fiveDysfunctionsQuestions,fiveDysfunctionsAssessments,3038,5 Dysfunctions,5 Dysfunctions'
  'five-dysfunctions-new,fiveDysfunctionsNewServer,fiveDysfunctionsNewTeams,fiveDysfunctionsNewQuestions,fiveDysfunctionsNewAssessments,3040,5 Dysfunctions,5 Dysfunctions New'
  'five-dysfunctions-eagile,fiveDysfunctionsEverydayAgileServer,fiveDysfunctionsEverydayAgileTeams,fiveDysfunctionsEverydayAgileQuestions,fiveDysfunctionsEverydayAgileAssessments,3070,5 Dysfunctions,5 Dysfunctions'
  'five-dysfunctions-and,fiveDysfunctionsAndServer,fiveDysfunctionsAndTeams,fiveDysfunctionsAndQuestions,fiveDysfunctionsAndAssessments,3109,5 Dysfunctions,5 Dysfunctions'
  'five-dysfunctions-guardian,fiveDysfunctionsGuardianServer,fiveDysfunctionsGuardianTeams,fiveDysfunctionsGuardianQuestions,fiveDysfunctionsGuardianAssessments,3101,5 Dysfunctions,5 Dysfunctions'
  'team-health-check,healthCheckServer,healthCheckTeams,healthCheckQuestions,healthCheckAssessments,3039,Team Health Check,Team Health Check'
  'team-health-check-new,healthCheckNewServer,healthCheckNewTeams,healthCheckNewQuestions,healthCheckNewAssessments,3041,Team Health Check,Team Health Check New'
  'team-health-check-eagile,healthCheckEverydayAgileServer,healthCheckEverydayAgileTeams,healthCheckEverydayAgileQuestions,healthCheckEverydayAgileAssessments,3071,Team Health Check,Team Health Check'
  'team-health-check-guardian,healthCheckGuardianServer,healthCheckGuardianTeams,healthCheckGuardianQuestions,healthCheckGuardianAssessments,3102,Team Health Check,Team Health Check'
  'team-health-check-and,healthCheckAndServer,healthCheckAndTeams,healthCheckAndQuestions,healthCheckAndAssessments,3110,Team Health Check,Team Health Check'
  'agile-maturity,agileMaturityServer,agileMaturityTeams,agileMaturityQuestions,agileMaturityAssessments,3077,Agile Maturity,Agile Maturity'
  'agile-maturity-eagile,agileMaturityEverydayAgileServer,agileMaturityEverydayAgileTeams,agileMaturityEverydayAgileQuestions,agileMaturityEverydayAgileAssessments,3117,Agile Maturity,Agile Maturity'
  'agile-maturity-and,agileMaturityAndServer,agileMaturityAndTeams,agileMaturityAndQuestions,agileMaturityAndAssessments,3115,Agile Maturity,Agile Maturity'
  'scrum-master,scrumMasterServer,scrumMasterTeams,scrumMasterQuestions,scrumMasterAssessments,3078,Scrum Master,Scrum Master Assessment'
  'scrum-master-eagile,scrumMasterEverydayAgileServer,scrumMasterEverydayAgileTeams,scrumMasterEverydayAgileQuestions,scrumMasterEverydayAgileAssessments,3118,Scrum Master,Scrum Master Assessment'
  'scrum-master-and,scrumMasterAndServer,scrumMasterAndTeams,scrumMasterAndQuestions,scrumMasterAndAssessments,3116,Scrum Master,Scrum Master Assessment'
)

git stash
GIT=`git pull`
echo $GIT
if [ "$FORCE" != "true" -a "$GIT" == "Already up to date." ]; then
  exit 0
fi
npm install --legacy-peer-deps
rm -rf node_modules/.cache

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

  rm $DIR/package-lock.json
  rm -rf $DIR/node_modules

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
  rm -rf node_modules
  ln -s ../$MAINAPP/node_modules node_modules
  rm -rf $DIR/distdone
done

ps -ef | grep php | grep outdated
if [ $? -eq 1 ]; then
  php /usr/apps/monitor/src/lib/outdated.php &
fi
