#!/bin/bash

FORCE=false
NEW=false
while [ $1 ]
do
  echo $1
  if [ "$1" == "-f" ]; then
    FORCE=true
  fi
  shift
done

echo "----------------------------------------------------------------"
echo "*** Note: Do a git pull and deploy -f if you've updated deploy.sh! ***"
echo "----------------------------------------------------------------"

BASEPORT=4500
REPO="https://github.com/hogsmill/assessment.git"
MAINAPP="assessment"

FIVEDYSFUNCTIONSAPP="five-dysfunctions"
FIVEDYSFUNCTIONSCOLLECTION="fiveDysfunctions"
FIVEDYSFUNCTIONSGAME="5 Dysfunctions"

TEAMHEALTHCHECKAPP="team-health-check"
TEAMHEALTHCHECKCOLLECTION="healthCheck"
TEAMHEALTHCHECKGAME="Team Health Check"

AGILEMATURITYAPP="agile-maturity"
AGILEMATURITYCOLLECTION="agileMaturity"
AGILEMATURITYGAME="Agile Maturity"

SCRUMMASTERAPP="scrum-master"
SCRUMMASTERCOLLECTION="scrumMaster"
SCRUMMASTERGAME="Scrum Master Assessment"

GAMES=(
  "5 Dysfunctions"
  "Team Health Check"
  "Agile Maturity"
  "Scrum Master"
)

ROUTES=(
  '',''
  'new','New'
  'abn','Abn'
  'ratesetter','Ratesetter'
  'eagile','EverydayAgile'
  'and','And'
  'richemont','Richemont'
  'mattphillip','MattPhillip'
)

git stash
GIT=`git pull`
echo $GIT
if [ "$FORCE" != "true" -a "$GIT" == "Already up to date." ]; then
  exit 0
fi
npm install --legacy-peer-deps
rm -rf node_modules/.cache

PORT=$BASEPORT
for ((g = 0; g < ${#GAMES[@]}; g++))
do
  for ((i = 0; i < ${#ROUTES[@]}; i++))
  do
    REC="${ROUTES[$i]}"
    ROUTE=`echo $REC | cut -d, -f1`
    COLLECTIONSUFFIX=`echo $REC | cut -d, -f2`

    case ${GAMES[$g]} in
      "5 Dysfunctions" )
        SERVERCOLLECTION="fiveDysFunctions${COLLECTIONSUFFIX}Server"
        DEPARTMENTSCOLLECTION="fiveDysFunctions${COLLECTIONSUFFIX}Departments"
        TEAMSCOLLECTION="fiveDysFunctions${COLLECTIONSUFFIX}Teams"
        QUESTIONCOLLECTION="fiveDysFunctions${COLLECTIONSUFFIX}Questions"
        ASSESSMENTSCOLLECTION="fiveDysFunctions${COLLECTIONSUFFIX}Assements"
        APP="five-dysfunctions"
        ;;
      "Team Health Check" )
        SERVERCOLLECTION="healthCheck${COLLECTIONSUFFIX}Server"
        DEPARTMENTSCOLLECTION="healthCheck${COLLECTIONSUFFIX}Departments"
        TEAMSCOLLECTION="healthCheck${COLLECTIONSUFFIX}Teams"
        QUESTIONCOLLECTION="healthCheck${COLLECTIONSUFFIX}Questions"
        ASSESSMENTSCOLLECTION="healthCheck${COLLECTIONSUFFIX}Assements"
        APP="team-health-check"

        ;;
      "Agile Maturity" )
        SERVERCOLLECTION="agileMaturity${COLLECTIONSUFFIX}Server"
        DEPARTMENTSCOLLECTION="agileMaturity${COLLECTIONSUFFIX}Departments"
        TEAMSCOLLECTION="agileMaturity${COLLECTIONSUFFIX}Teams"
        QUESTIONCOLLECTION="agileMaturity${COLLECTIONSUFFIX}Questions"
        ASSESSMENTSCOLLECTION="agileMaturity${COLLECTIONSUFFIX}Assements"
        APP="agile-maturity"
        ;;
      "Scrum Master" )
        SERVERCOLLECTION="scrumMaster${COLLECTIONSUFFIX}Server"
        DEPARTMENTSCOLLECTION="scrumMaster${COLLECTIONSUFFIX}Departments"
        TEAMSCOLLECTION="scrumMaster${COLLECTIONSUFFIX}Teams"
        QUESTIONCOLLECTION="scrumMaster${COLLECTIONSUFFIX}Questions"
        ASSESSMENTSCOLLECTION="scrumMaster${COLLECTIONSUFFIX}Assements"
        APP="scrum-master"
        ;;
    esac
    let PORT=$PORT+1

    if [ "$ROUTE" != "" ]; then
      APP="${APP}-${ROUTE}"
    fi
    APPTYPE=${GAMES[$g]}
    APPNAME=${GAMES[$g]}

    echo "------------------------------------------------"
    echo "Installing ${GAMES[$g]}:$APP ($SERVERCOLLECTION, $TEAMSCOLLECTION, $QUESTIONCOLLECTION, $ASSESSMENTSCOLLECTION, $PORT)"
    echo "------------------------------------------------"

    DIR="/usr/apps/$APP"
    if [ ! -d $DIR ]; then
      git clone $REPO $DIR
    fi
    ENVFILE="$DIR/.env"
    echo "VUE_APP_PORT=$PORT" > $ENVFILE
    echo "VUE_APP_TYPE=$APPTYPE" >> $ENVFILE
    echo "VUE_APP_SERVER_COLLECTION=$SERVERCOLLECTION" >> $ENVFILE
    echo "VUE_APP_DEPARTMENTS_COLLECTION=$DEPARTMENTSCOLLECTION" >> $ENVFILE
    echo "VUE_APP_TEAMS_COLLECTION=$TEAMSCOLLECTION" >> $ENVFILE
    echo "VUE_APP_QUESTION_COLLECTION=$QUESTIONCOLLECTION" >> $ENVFILE
    echo "VUE_APP_ASSESSMENTS_COLLECTION=$ASSESSMENTSCOLLECTION" >> $ENVFILE
    echo "VUE_APP_NAME=$APPNAME" >> $ENVFILE

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
    rm -rf $DIR/dist
  done
done

ps -ef | grep php | grep outdated
if [ $? -eq 1 ]; then
  php /usr/apps/monitor/src/lib/outdated.php &
fi

exit 0
